/* =====================================================================
   იმერეთი ტური · გვერდების აწყობა: node tools/build.mjs
   src/template.html + src/pages.json → index.html, buses/, schedule/, parcels/, info/, faq/
   ტექსტის ან დიზაინის შეცვლისას ცვლი src/template.html-ს და უშვებ ამ ბრძანებას.
   (index.html-ებს ხელით ნუ ცვლი — შემდეგ აწყობაზე გადაიწერება.)

   Google-ისთვის აწყობა ასევე:
    - ქართულ ტექსტებს წინასწარ ჩაწერს HTML-ში (js/script.js-დან), რომ Google-მა სრული გვერდი დაინახოს;
    - მენიუს ბმულებს ჩაწერს (Google ამით ხვდება გვერდების სტრუქტურას → sitelinks);
    - დაამატებს სტრუქტურირებულ მონაცემებს (JSON-LD): საიტის სახელი, კომპანია, ლოგო, კითხვები, ბილიკი;
    - განაახლებს sitemap.xml-ს.
   ===================================================================== */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://imeretitour.com/";
const PHONE = "+995598808022";
const tpl = await readFile(join(ROOT, "src/template.html"), "utf8");
const pages = JSON.parse(await readFile(join(ROOT, "src/pages.json"), "utf8"));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// ტექსტები js/script.js-დან (T, T2, T3 → ქართული)
const js = await readFile(join(ROOT, "js/script.js"), "utf8");
function grab(name) {
  const i = js.indexOf(`var ${name} = {`);
  if (i < 0) return {};
  const j = js.indexOf("{", i);
  for (let k = j, d = 0; k < js.length; k++) {
    if (js[k] === "{") d++;
    else if (js[k] === "}" && --d === 0) return Function("return " + js.slice(j, k + 1))();
  }
  return {};
}
const K = Object.assign({}, grab("T").ka, grab("T2").ka, grab("T3").ka);

const NAV = [["", "nv0"], ["buses", "nv1"], ["schedule", "nv2"], ["parcels", "nv4"], ["info", "nv5"], ["faq", "nv3"]];
const url = id => SITE + (id && id !== "home" ? id + "/" : "");

function jsonld(id, p) {
  const g = [
    { "@type": "WebSite", "@id": SITE + "#site", name: "იმერეთი ტური", alternateName: ["Imereti Tour", "Имерети Тур", "imeretitour.com"], url: SITE, inLanguage: ["ka", "ru", "en"] },
    {
      "@type": ["Organization", "TravelAgency"], "@id": SITE + "#org", name: "იმერეთი ტური", alternateName: "Imereti Tour", url: SITE,
      logo: SITE + "images/icon-512.png", image: SITE + "images/og.jpg", telephone: PHONE,
      description: pages.home.desc, areaServed: ["GE", "RU"],
      address: { "@type": "PostalAddress", addressLocality: "Kutaisi", addressRegion: "Imereti", addressCountry: "GE" },
      contactPoint: { "@type": "ContactPoint", telephone: PHONE, contactType: "customer service", availableLanguage: ["ka", "ru", "en"] }
    },
    { "@type": "WebPage", "@id": url(id) + "#page", url: url(id), name: p.title, description: p.desc, isPartOf: { "@id": SITE + "#site" }, about: { "@id": SITE + "#org" }, inLanguage: "ka" }
  ];
  if (id !== "home") g.push({
    "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: K.nv0 || "მთავარი", item: SITE },
      { "@type": "ListItem", position: 2, name: K[NAV.find(n => n[0] === id)[1]], item: url(id) }]
  });
  if (id === "faq") g.push({
    "@type": "FAQPage", mainEntity: [1, 2, 3, 4, 5, 6].filter(i => K["q" + i] && K["a" + i]).map(i => ({
      "@type": "Question", name: K["q" + i], acceptedAnswer: { "@type": "Answer", text: K["a" + i] }
    }))
  });
  return '<script type="application/ld+json">' + JSON.stringify({ "@context": "https://schema.org", "@graph": g }).replace(/</g, "\\u003c") + "</script>";
}

for (const [id, p] of Object.entries(pages)) {
  const home = id === "home", B = home ? "" : "../";
  let html = tpl
    .replace(/<!-- იმერეთი ტური · შაბლონი[\s\S]*?-->\n/, "<!-- იმერეთი ტური · ეს ფაილი იქმნება src/template.html-დან (node tools/build.mjs). ხელით ნუ შეცვლი. -->\n")
    .replaceAll("{{B}}", B)
    .replaceAll("{{PAGE}}", home ? "" : id)
    .replaceAll("{{TITLE}}", esc(p.title))
    .replaceAll("{{DESC}}", esc(p.desc))
    .replaceAll("{{OGTITLE}}", esc(p.ogTitle || p.title))
    .replaceAll("{{OGDESC}}", esc(p.ogDesc || p.desc))
    .replaceAll("{{URL}}", url(id));
  if (/\{\{[A-Z]+\}\}/.test(html)) throw new Error("unfilled placeholder in " + id);
  // ქართული ტექსტები ცარიელ ადგილებში
  html = html.replace(/(<([a-z0-9]+)\b[^>]*\sdata-i="([^"]+)"[^>]*>)(<\/\2>)/g, (m, open, tag, key, close) => K[key] ? open + esc(K[key]) + close : m);
  // ბმულები data-href-ით
  html = html.replace(/<a\b([^>]*?)\sdata-href="([^"]+)"/g, (m, a, h) => /\shref=/.test(a) ? m : `<a${a} href="${B}${h}/" data-href="${h}"`);
  // მენიუ
  const nav = NAV.map(([h, k]) => `<a href="${h ? B + h + "/" : B || "./"}" data-p="${h}"${(h || "home") === id ? ' aria-current="page"' : ""}>${esc(K[k] || h)}</a>`).join("");
  html = html.replace('<nav class="mn" id="mn" aria-label="Pages"></nav>', `<nav class="mn" id="mn" aria-label="Pages">${nav}</nav>`);
  // სტრუქტურირებული მონაცემები
  html = html.replace("</head>", "    " + jsonld(id, p) + "\n  </head>");
  const out = home ? join(ROOT, "index.html") : join(ROOT, id, "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
  console.log("✓", home ? "index.html" : id + "/index.html");
}

// sitemap.xml
const day = new Date().toISOString().slice(0, 10);
await writeFile(join(ROOT, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  Object.keys(pages).map(id => `  <url><loc>${url(id)}</loc><lastmod>${day}</lastmod><priority>${id === "home" ? "1.0" : "0.8"}</priority></url>`).join("\n") + "\n</urlset>\n");
console.log("✓ sitemap.xml");
