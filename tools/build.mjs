/* =====================================================================
   იმერეთი ტური · გვერდების აწყობა: node tools/build.mjs
   src/template.html + src/pages.json → სამ ენაზე:
     ქართული:  index.html, buses/, schedule/, parcels/, info/, faq/
     რუსული:   ru/index.html, ru/buses/ ...
     ინგლისური: en/index.html, en/buses/ ...
   ტექსტის ან დიზაინის შეცვლისას ცვლი src/template.html-ს და უშვებ ამ ბრძანებას.
   (index.html-ებს ხელით ნუ ცვლი — შემდეგ აწყობაზე გადაიწერება.)

   Google-ისთვის (და Yandex-ისთვის) აწყობა ასევე:
    - ტექსტებს წინასწარ ჩაწერს HTML-ში თითო ენაზე (js/script.js-დან), რომ საძიებომ სრული გვერდი დაინახოს;
    - მენიუს ბმულებს ჩაწერს (საძიებო ამით ხვდება გვერდების სტრუქტურას → sitelinks);
    - hreflang: საძიებოს ეუბნება, რომ /ru/ და /en/ იგივე გვერდის თარგმანებია;
    - სტრუქტურირებული მონაცემები (JSON-LD): საიტის სახელი, კომპანია, ლოგო, კითხვები, ბილიკი;
    - განაახლებს sitemap.xml-ს.
   ===================================================================== */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.imeretitour.com/";
const PHONE = "+995598808022";
const LANGS = ["ka", "ru", "en"];
const LOCALE = { ka: "ka_GE", ru: "ru_RU", en: "en_US" };
const tpl = await readFile(join(ROOT, "src/template.html"), "utf8");
const pages = JSON.parse(await readFile(join(ROOT, "src/pages.json"), "utf8"));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// ტექსტები js/script.js-დან (T, T2, T3)
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
const TT = [grab("T"), grab("T2"), grab("T3")];
const TX = Object.fromEntries(LANGS.map(l => [l, Object.assign({}, ...TT.map(t => t[l] || {}))]));

const NAV = [["", "nv0"], ["buses", "nv1"], ["schedule", "nv2"], ["parcels", "nv4"], ["info", "nv5"], ["faq", "nv3"]];
const lp = l => (l === "ka" ? "" : l + "/");
const path = id => (id && id !== "home" ? id + "/" : "");
const url = (id, l = "ka") => SITE + lp(l) + path(id);
const meta = (id, l) => (l === "ka" ? pages[id] : { ...pages[id], ...(pages[id][l] || {}) });

function jsonld(id, l, p, K) {
  const name = K.brand || "იმერეთი ტური";
  const g = [
    { "@type": "WebSite", "@id": SITE + "#site", name: "იმერეთი ტური", alternateName: ["Imereti Tour", "Имерети Тур", "imeretitour.com"], url: SITE, inLanguage: LANGS },
    {
      "@type": ["Organization", "TravelAgency"], "@id": SITE + "#org", name: "იმერეთი ტური", alternateName: ["Imereti Tour", "Имерети Тур"], url: SITE,
      logo: SITE + "images/icon-512.png", image: SITE + "images/og.jpg", telephone: PHONE,
      description: meta("home", l).desc, areaServed: ["GE", "RU"],
      address: { "@type": "PostalAddress", addressLocality: "Kutaisi", addressRegion: "Imereti", addressCountry: "GE" },
      contactPoint: { "@type": "ContactPoint", telephone: PHONE, contactType: "customer service", availableLanguage: ["ka", "ru", "en"] }
    },
    { "@type": "WebPage", "@id": url(id, l) + "#page", url: url(id, l), name: p.title, description: p.desc, isPartOf: { "@id": SITE + "#site" }, about: { "@id": SITE + "#org" }, inLanguage: l }
  ];
  if (id !== "home") g.push({
    "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: K.nv0 || name, item: url("home", l) },
      { "@type": "ListItem", position: 2, name: K[NAV.find(n => n[0] === id)[1]], item: url(id, l) }]
  });
  if (id === "faq") g.push({
    "@type": "FAQPage", mainEntity: [1, 2, 3, 4, 5, 6].filter(i => K["q" + i] && K["a" + i]).map(i => ({
      "@type": "Question", name: K["q" + i], acceptedAnswer: { "@type": "Answer", text: K["a" + i] }
    }))
  });
  return '<script type="application/ld+json">' + JSON.stringify({ "@context": "https://schema.org", "@graph": g }).replace(/</g, "\\u003c") + "</script>";
}

for (const l of LANGS) for (const id of Object.keys(pages)) {
  const K = TX[l], p = meta(id, l), home = id === "home";
  const depth = (l === "ka" ? 0 : 1) + (home ? 0 : 1);
  const B = "../".repeat(depth), LB = B + lp(l);
  let html = tpl
    .replace(/<!-- იმერეთი ტური · შაბლონი[\s\S]*?-->\n/, "<!-- იმერეთი ტური · ეს ფაილი იქმნება src/template.html-დან (node tools/build.mjs). ხელით ნუ შეცვლი. -->\n")
    .replaceAll("{{B}}", B)
    .replaceAll("{{PAGE}}", home ? "" : id)
    .replaceAll("{{TITLE}}", esc(p.title))
    .replaceAll("{{DESC}}", esc(p.desc))
    .replaceAll("{{OGTITLE}}", esc(l === "ka" ? p.ogTitle || p.title : p.title))
    .replaceAll("{{OGDESC}}", esc(l === "ka" ? p.ogDesc || p.desc : p.desc))
    .replaceAll("{{URL}}", url(id, l));
  if (/\{\{[A-Z]+\}\}/.test(html)) throw new Error("unfilled placeholder in " + l + "/" + id);
  html = html
    .replace('<html lang="ka">', `<html lang="${l}">`)
    .replace('<body data-page=', `<body data-lang="${l}" data-page=`)
    .replace('content="ka_GE"', `content="${LOCALE[l]}"`);
  // თარგმანები საძიებოსთვის (hreflang)
  const alt = LANGS.map(x => `<link rel="alternate" hreflang="${x}" href="${url(id, x)}">`).join("\n    ") + `\n    <link rel="alternate" hreflang="x-default" href="${url(id, "ka")}">`;
  html = html.replace(/(<link rel="canonical"[^>]*>)/, `$1\n    ${alt}`);
  // ტექსტები ცარიელ ადგილებში (ამ ენაზე)
  html = html.replace(/(<([a-z0-9]+)\b[^>]*\sdata-i="([^"]+)"[^>]*>)(<\/\2>)/g, (m, open, tag, key, close) => K[key] ? open + esc(K[key]) + close : m);
  // ბმულები data-href-ით
  html = html.replace(/<a\b([^>]*?)\sdata-href="([^"]+)"/g, (m, a, h) => /\shref=/.test(a) ? m : `<a${a} href="${LB}${h}/" data-href="${h}"`);
  // მენიუ
  const nav = NAV.map(([h, k]) => `<a href="${LB + (h ? h + "/" : "") || "./"}" data-p="${h}"${(h || "home") === id ? ' aria-current="page"' : ""}>${esc(K[k] || h)}</a>`).join("");
  html = html.replace('<nav class="mn" id="mn" aria-label="Pages"></nav>', `<nav class="mn" id="mn" aria-label="Pages">${nav}</nav>`);
  // ენის ღილაკები: ნამდვილი ბმულები, რომ საძიებომ თარგმანები იპოვოს
  html = html.replace(/<button data-l="(ka|ru|en)">(KA|RU|EN)<\/button>/g, (m, x, t) => `<button data-l="${x}"${x === l ? ' aria-pressed="true"' : ""}>${t}</button>`);
  html = html.replace("</footer>", `  <nav class="w ft-lang" aria-label="Language">${LANGS.map(x => `<a href="${B + lp(x) + path(id) || "./"}" hreflang="${x}" lang="${x}"${x === l ? ' aria-current="true"' : ""}>${{ ka: "ქართული", ru: "Русский", en: "English" }[x]}</a>`).join("")}</nav>\n    </footer>`);
  // სტრუქტურირებული მონაცემები
  html = html.replace("</head>", "    " + jsonld(id, l, p, K) + "\n  </head>");
  const out = join(ROOT, lp(l), path(id), "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
  console.log("✓", lp(l) + path(id) + "index.html");
}

// sitemap.xml (ყველა ენა, თარგმანების კავშირით)
const day = new Date().toISOString().slice(0, 10);
const rows = [];
for (const l of LANGS) for (const id of Object.keys(pages)) {
  rows.push(`  <url><loc>${url(id, l)}</loc><lastmod>${day}</lastmod><priority>${id === "home" ? "1.0" : "0.8"}</priority>` +
    LANGS.map(x => `<xhtml:link rel="alternate" hreflang="${x}" href="${url(id, x)}"/>`).join("") + "</url>");
}
await writeFile(join(ROOT, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + rows.join("\n") + "\n</urlset>\n");
console.log("✓ sitemap.xml (" + rows.length + " URLs)");
