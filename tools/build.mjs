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
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";

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

// ---------------------------------------------------------------------
// თითო გვერდზე მხოლოდ საკუთარი შიგთავსი (Google-ისთვის): სხვა გვერდების ბლოკები იცვლება
// ცარიელი „ნაკვალევით“ — მხოლოდ ის id-ები რჩება, რომლებსაც js იყენებს ($("…")), რომ კოდი არ გაფუჭდეს.
// მთავარიდან სხვა გვერდებზე რჩება მხოლოდ დაჯავშნის ფორმა (#book) და კონტაქტი (#contact).
const JSIDS = new Set(["js/script.js", "js/fx.js", "js/scene.js"].flatMap(f =>
  existsSync(join(ROOT, f)) ? [...readFileSync(join(ROOT, f), "utf8").matchAll(/\$\("([A-Za-z0-9-]+)"\)/g)].map(m => m[1]) : []));
const VOID = new Set(["input", "img", "br", "hr", "source", "meta", "link"]);
function stubs(block) {
  const out = [];
  for (const m of block.matchAll(/<([a-z0-9]+)\b[^>]*\sid="([A-Za-z0-9-]+)"[^>]*>/g)) {
    if (!JSIDS.has(m[2])) continue;
    const open = m[0].replace(/\sdata-i="[^"]*"/g, "");
    out.push(VOID.has(m[1]) ? open : open + "</" + m[1] + ">");
  }
  return out.join("");
}
function slim(html, cur) {
  // შიდა გვერდები: <div class="pg..." id="p-X"> … შემდეგ კომენტარამდე
  html = html.replace(/(<div class="pg[^"]*" id="p-([a-z-]+)"[^>]*>)([\s\S]*?)(?=\n    <!-- )/g, (m, open, name, body) => {
    if (name === cur || (name === "admin" && cur === "home")) return m;
    return open + "<div hidden>" + stubs(body) + "</div></div>";
  });
  if (cur !== "home") {
    // მთავარი: რჩება #book და #contact, დანარჩენი — ნაკვალევი
    html = html.replace(/(<div id="p-home">)([\s\S]*?)(?=\n    <!-- ===================== )/, (m, open, body) => {
      const keep = [...body.matchAll(/\n      <section class="[^"]*" id="(book|contact)">[\s\S]*?\n      <\/section>/g)].map(x => x[0]);
      let rest = body;
      keep.forEach(k => { rest = rest.replace(k, ""); });
      return open + keep.join("\n") + "\n      <div hidden>" + stubs(rest) + "</div>\n    </div>";
    });
  }
  return html;
}

const NAV = [["", "nv0"], ["buses", "nv1"], ["charter", "nv6"], ["schedule", "nv2"], ["parcels", "nv4"], ["info", "nv5"], ["faq", "nv3"]];
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
      logo: SITE + "images/icon-512.png", image: SITE + "images/og.jpg", telephone: PHONE, sameAs: ["https://t.me/imeretitour", "https://www.facebook.com/Imeretitour/"],
      description: meta("home", l).desc, areaServed: ["GE", "RU"],
      address: { "@type": "PostalAddress", streetAddress: "8 Baku Street", addressLocality: "Batumi", addressCountry: "GE" },
      geo: { "@type": "GeoCoordinates", latitude: 41.6465879, longitude: 41.6465561 },
      contactPoint: { "@type": "ContactPoint", telephone: PHONE, contactType: "customer service", availableLanguage: ["ka", "ru", "en"] }
    },
    { "@type": "WebPage", "@id": url(id, l) + "#page", url: url(id, l), name: p.title, description: p.desc, isPartOf: { "@id": SITE + "#site" }, about: { "@id": SITE + "#org" }, inLanguage: l }
  ];
  if (id !== "home") g.push({
    "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: K.nv0 || name, item: url("home", l) },
      { "@type": "ListItem", position: 2, name: id === "new-year" ? K.nyN : id === "travel-guide" ? K.tgN : id === "lars" ? K.laN : id === "parcel-guide" ? K.pgN : K[NAV.find(n => n[0] === id)[1]], item: url(id, l) }]
  });
  // ავტობუსის დაქირავება: სერვისი + ხშირი კითხვები; ზემო ლარსი: სტატია
  if (id === "charter") g.push(
    { "@type": "Service", name: K.cpH, description: K.chT, serviceType: "Bus charter", provider: { "@id": SITE + "#org" },
      areaServed: ["GE", "Europe"], url: url(id, l), inLanguage: l },
    { "@type": "FAQPage", mainEntity: [1, 2, 3].map(i => ({ "@type": "Question", name: K["cq" + i], acceptedAnswer: { "@type": "Answer", text: K["ca" + i] } })) });
  if (id === "parcel-guide") g.push({ "@type": "Article", headline: K.pgH, description: K.pgS, inLanguage: l, url: url(id, l),
    image: SITE + "images/og.jpg", author: { "@id": SITE + "#org" }, publisher: { "@id": SITE + "#org" }, datePublished: "2026-11-20", dateModified: "2026-11-20" });
  if (id === "travel-guide") g.push({ "@type": "Article", headline: K.tgH, description: K.tgS, inLanguage: l, url: url(id, l),
    image: SITE + "images/og.jpg", author: { "@id": SITE + "#org" }, publisher: { "@id": SITE + "#org" }, datePublished: "2026-11-21", dateModified: "2026-11-21" },
    { "@type": "FAQPage", mainEntity: [7, 8, 9].map(i => ({ "@type": "Question", name: K["q" + i], acceptedAnswer: { "@type": "Answer", text: K["a" + i] } })) });
  if (id === "lars") g.push({ "@type": "Article", headline: K.laH, description: K.laS, inLanguage: l, url: url(id, l),
    image: SITE + "images/og.jpg", author: { "@id": SITE + "#org" }, publisher: { "@id": SITE + "#org" }, datePublished: "2026-11-18", dateModified: "2026-11-20" });
  if (id === "faq") g.push({
    "@type": "FAQPage", mainEntity: [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(i => K["q" + i] && K["a" + i]).map(i => ({
      "@type": "Question", name: K["q" + i], acceptedAnswer: { "@type": "Answer", text: K["a" + i] }
    }))
  });
  return '<script type="application/ld+json">' + JSON.stringify({ "@context": "https://schema.org", "@graph": g }).replace(/</g, "\\u003c") + "</script>";
}

// ---------------------------------------------------------------------
// ქალაქების გვერდები: bus/batumi-moscow/ ... (თითო გაჩერებაზე, სამ ენაზე)
// მონაცემები: გაჩერებები js/script.js-დან (S), დრო/დღეები/ფასი js/schedule-config.js-დან.
// ---------------------------------------------------------------------
function grabArr(name) {
  const i = js.indexOf(`var ${name} = [`), j = js.indexOf("[", i);
  for (let k = j, d = 0; k < js.length; k++) {
    if (js[k] === "[") d++;
    else if (js[k] === "]" && --d === 0) return Function("return " + js.slice(j, k + 1))();
  }
}
const STOPS = grabArr("S");
const MAPS = await readFile(join(ROOT, "src/maps.html"), "utf8"); // გაჩერებების რუკები (თბილისი, მოსკოვი)
const cfgSrc = await readFile(join(ROOT, "js/schedule-config.js"), "utf8");
const CFG = Function("var window={};" + cfgSrc + ";return window.SCHEDULE")();
const days = (kind, l) => CFG.days[kind].slice().sort((a, b) => (a || 7) - (b || 7))
  .map(d => new Intl.DateTimeFormat(l, { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 7 + d)))).join(", ");
const price = CFG.price.ge > 0 ? CFG.price.ge + " " + CFG.cur : "";
const CITY = STOPS.map((s, i) => ({ i, slug: s[1].en.toLowerCase() + "-moscow", n: s[1], time: CFG.stops[i] || s[0] }));
const kaAbl = n => n + "დან", kaLoc = n => n.replace(/ი$/, "") + "ში";
const RT = {
  ka: c => ({
    title: `ავტობუსი ${c.n.ka} — მოსკოვი და მოსკოვი — ${c.n.ka}: განრიგი, ფასი | იმერეთი ტური`,
    desc: `ავტობუსი ${kaAbl(c.n.ka)} მოსკოვამდე: გასვლა ${days("ge", "ka")}, ${c.time}.${price ? " ფასი " + price + "." : ""} დაჯავშნე ონლაინ 1 წუთში.`,
    kick: "ავტობუსი", h1: `${c.n.ka} — მოსკოვი`, sub: `რეგულარული რეისი ${kaAbl(c.n.ka)} მოსკოვამდე, ზემო ლარსის გავლით. დაჯავშნე ადგილი 1 წუთში.`,
    fT: "გასვლა", fD: "დღეები", fP: "ფასი", fE: "ფინიში", end: "მოსკოვი, მეტრო „ანინო“",
    rH: "მარშრუტი", wH: "რატომ ჩვენთან",
    li: ["კომფორტული ავტობუსები: კონდიციონერი, Wi-Fi, USB დამტენი", "დაჯავშნა 1 წუთში, რეგისტრაციის გარეშე", "ჯავშნისთვის საკმარისია 25% წინასწარ", "ამანათების გადაზიდვა ორივე მიმართულებით"],
    cta: "დაჯავშნა", sch: "სრული განრიგი", qH: "ხშირი კითხვები", oH: "სხვა ქალაქებიდან",
    faq: [[`როდის გადის ავტობუსი ${kaAbl(c.n.ka)} მოსკოვში?`, `${days("ge", "ka")}, ${c.time}-ზე (საქართველოს დროით). ზუსტი თარიღები იხილეთ განრიგში.`],
      price && [`რა ღირს ბილეთი ${kaAbl(c.n.ka)} მოსკოვამდე?`, `${price} ერთ ადგილზე. დაჯავშნისას საკმარისია 25% წინასწარ.`],
      [`არის რეისი უკან, მოსკოვიდან ${kaLoc(c.n.ka)}?`, `დიახ. მოსკოვიდან გასვლა: ${days("ru", "ka")}.`],
      ["რამდენ ხანს გრძელდება მგზავრობა?", "დაახლოებით დღე-ნახევარი — დამოკიდებულია ზემო ლარსზე რიგსა და ამინდზე. ბარგი: დაახლოებით 30 კგ ერთ მგზავრზე."],
      ["როგორ დავჯავშნო?", "აირჩიეთ თარიღი და გაჩერება საიტზე და გაგზავნეთ ჯავშანი WhatsApp-ში, ან დაგვირეკეთ: +995 598 80 80 22."]],
    msg: `გამარჯობა! მინდა ადგილის დაჯავშნა: ${c.n.ka} → მოსკოვი.`, other: o => `${o.n.ka} — მოსკოვი`
  }),
  ru: c => ({
    title: `Автобус ${c.n.ru} — Москва и Москва — ${c.n.ru}: расписание, цена | Имерети Тур`,
    desc: `Автобус из ${c.n.ru} в Москву: отправление ${days("ge", "ru")} в ${c.time}.${price ? " Цена " + price + "." : ""} Обратно из Москвы: ${days("ru", "ru")}. Бронирование онлайн за 1 минуту.`,
    kick: "Автобус", h1: `${c.n.ru} — Москва`, sub: `Регулярный рейс из ${c.n.ru} в Москву через Верхний Ларс. Бронирование за 1 минуту.`,
    fT: "Отправление", fD: "Дни", fP: "Цена", fE: "Финиш", end: "Москва, метро «Аннино»",
    rH: "Маршрут", wH: "Почему мы",
    li: ["Комфортные автобусы: кондиционер, Wi-Fi, USB-зарядка", "Бронирование за 1 минуту, без регистрации", "Для брони достаточно 25% предоплаты", "Доставка посылок в обе стороны"],
    cta: "Забронировать", sch: "Всё расписание", qH: "Частые вопросы", oH: "Из других городов",
    faq: [[`Когда отправляется автобус из ${c.n.ru} в Москву?`, `${days("ge", "ru")}, в ${c.time} (по грузинскому времени). Точные даты смотрите в расписании.`],
      price && [`Сколько стоит билет из ${c.n.ru} до Москвы?`, `${price} за место. Для бронирования достаточно 25% предоплаты.`],
      [`Есть ли обратный рейс из Москвы в ${c.n.ru}?`, `Да. Отправление из Москвы: ${days("ru", "ru")}.`],
      ["Сколько ехать до Москвы?", "Около полутора суток — зависит от очереди на Верхнем Ларсе и погоды. Багаж: около 30 кг на человека."],
      ["Как забронировать?", "Выберите дату и остановку на сайте и отправьте заявку в WhatsApp или позвоните: +995 598 80 80 22."]],
    msg: `Здравствуйте! Хочу забронировать место: ${c.n.ru} → Москва.`, other: o => `${o.n.ru} — Москва`
  }),
  en: c => ({
    title: `${c.n.en} — Moscow bus and Moscow — ${c.n.en}: schedule, price | Imereti Tour`,
    desc: `Bus from ${c.n.en} to Moscow: departures ${days("ge", "en")} at ${c.time}.${price ? " Price " + price + "." : ""} Book online in 1 minute.`,
    kick: "Bus", h1: `${c.n.en} — Moscow`, sub: `Regular bus from ${c.n.en} to Moscow via Upper Lars. Book a seat in 1 minute.`,
    fT: "Departure", fD: "Days", fP: "Price", fE: "Finish", end: "Moscow, Annino metro",
    rH: "Route", wH: "Why us",
    li: ["Comfortable coaches: air conditioning, Wi-Fi, USB charging", "Book in 1 minute, no sign-up", "Only 25% prepayment to book", "Parcel delivery both ways"],
    cta: "Book a seat", sch: "Full schedule", qH: "FAQ", oH: "From other cities",
    faq: [[`When does the bus from ${c.n.en} to Moscow leave?`, `${days("ge", "en")} at ${c.time} (Georgia time). See the schedule for exact dates.`],
      price && [`How much is a ticket from ${c.n.en} to Moscow?`, `${price} per seat. Only 25% prepayment to book.`],
      [`Is there a return trip from Moscow to ${c.n.en}?`, `Yes. Departures from Moscow: ${days("ru", "en")}.`],
      ["How long is the trip to Moscow?", "About a day and a half — depends on the queue at Upper Lars and the weather. Luggage: about 30 kg per person."],
      ["How do I book?", "Pick a date and stop on the website and send the request on WhatsApp, or call +995 598 80 80 22."]],
    msg: `Hello! I would like to book a seat: ${c.n.en} → Moscow.`, other: o => `${o.n.en} — Moscow`
  })
};
const rtUrl = (c, l) => SITE + lp(l) + "bus/" + c.slug + "/";
// ქალაქის გვერდზე: მხოლოდ ამ ქალაქის გაჩერება (თუ რუკა გვაქვს) + მოსკოვი — ყველა ქალაქის გვერდი უნიკალური რომ იყოს
function cityMaps(c) {
  return MAPS.replace(/\n\s*<figure class="mapc">[\s\S]*?<\/figure>/g, f => {
    const t = (f.match(/title="([^"]+)"/) || [])[1];
    return t === "Moscow" || t === c.n.en ? f : "";
  });
}
function routeHtml(c, l, LB) {
  const t = RT[l](c), K = TX[l];
  const stops = STOPS.map((s, i) => `<li${i === c.i ? ' class="me"' : ""}><time>${CFG.stops[i] || s[0]}</time>${esc(s[1][l])}</li>`).join("") +
    `<li class="end"><b>${esc(t.end)}</b><small>${esc((K.rtl || "") + ": " + days("ru", l))}</small></li>`;
  return `
      <div class="phd phd3" data-scene="bus"><canvas class="phgl" aria-hidden="true"></canvas><div class="w"><span class="kicker">${esc(t.kick)}</span><h1>${esc(t.h1)}</h1><p class="sub">${esc(t.sub)}</p></div></div>
      <div class="w">
        <div class="rt-facts"><div><small>${t.fT}</small><b>${c.time}</b></div><div><small>${t.fD}</small><b>${esc(days("ge", l))}</b></div>${price ? `<div><small>${t.fP}</small><b>${esc(price)}</b></div>` : ""}<div><small>${t.fE}</small><b>${esc(t.end)}</b></div></div>
        <div class="two">
          <div class="box rbox"><h2>${t.rH}</h2><ol class="route rt-route">${stops}</ol></div>
          <div class="box"><h2>${t.wH}</h2><ul class="rt-list">${t.li.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
            <p class="ctas"><a class="btn coral mag" href="${LB || "./"}?st=${c.i}#book">${esc(t.cta)}</a><a class="btn wa" href="https://wa.me/995598808022?text=${encodeURIComponent(t.msg)}" target="_blank" rel="noopener">WhatsApp</a><a class="btn ghost" href="${LB}schedule/">${esc(t.sch)}</a></p></div>
        </div>
        ${cityMaps(c)}
        <h2 class="h2">${t.qH}</h2>
        <div class="faq f3d">${t.faq.filter(Boolean).map(q => `<details><summary>${esc(q[0])}</summary><p>${esc(q[1])}</p></details>`).join("")}</div>
        <h2 class="h2">${t.oH}</h2>
        <div class="rt-other">${CITY.filter(o => o !== c).map(o => `<a href="${LB}bus/${o.slug}/">${esc(t.other(o))}</a>`).join("")}</div>
      </div>`;
}
const GUIDES = "<div class=\"gd rv\"><div class=\"head\"><span class=\"kicker\" data-i=\"gdK\"></span><h2 data-i=\"gdH\"></h2></div><div class=\"gdl\"><a class=\"gdc gdc0\" data-href=\"new-year\"><span class=\"gdi\" aria-hidden=\"true\">🎄</span><span class=\"gdx\"><b data-i=\"gd0\"></b><small data-i=\"gd0t\"></small></span><svg class=\"gda\"><use href=\"#i-arrow\"/></svg></a><a class=\"gdc gdc1\" data-href=\"charter\"><span class=\"gdi\" aria-hidden=\"true\">🚌</span><span class=\"gdx\"><b data-i=\"gd1\"></b><small data-i=\"gd1t\"></small></span><svg class=\"gda\"><use href=\"#i-arrow\"/></svg></a><a class=\"gdc gdc2\" data-href=\"lars\"><span class=\"gdi\" aria-hidden=\"true\">🛂</span><span class=\"gdx\"><b data-i=\"gd2\"></b><small data-i=\"gd2t\"></small></span><svg class=\"gda\"><use href=\"#i-arrow\"/></svg></a><a class=\"gdc gdc3\" data-href=\"parcel-guide\"><span class=\"gdi\" aria-hidden=\"true\">📦</span><span class=\"gdx\"><b data-i=\"gd3\"></b><small data-i=\"gd3t\"></small></span><svg class=\"gda\"><use href=\"#i-arrow\"/></svg></a></div></div>";
const routesNav = (l, LB) => `<nav class="w ft-routes" aria-label="Routes">${CITY.map(c => `<a href="${LB}bus/${c.slug}/">${esc(RT[l](c).h1)}</a>`).join("")}<a href="${LB}travel-guide/">${esc(TX[l].tgN)}</a><a href="${LB}new-year/">${esc(TX[l].nyN)}</a><a href="${LB}charter/">${esc(TX[l].cpH)}</a><a href="${LB}lars/">${esc(TX[l].laN)}</a><a href="${LB}parcel-guide/">${esc(TX[l].pgN)}</a></nav>`;

async function page(l, id, city) {
  const K = TX[l], home = id === "home";
  const p = city ? { title: RT[l](city).title, desc: RT[l](city).desc } : meta(id, l);
  const pth = city ? "bus/" + city.slug + "/" : path(id);
  const depth = (l === "ka" ? 0 : 1) + pth.split("/").filter(Boolean).length;
  const B = "../".repeat(depth), LB = B + lp(l), U = SITE + lp(l) + pth;
  let html = tpl
    .replace(/<!-- იმერეთი ტური · შაბლონი[\s\S]*?-->\n/, "<!-- იმერეთი ტური · ეს ფაილი იქმნება src/template.html-დან (node tools/build.mjs). ხელით ნუ შეცვლი. -->\n")
    // ფაილის ვერსია (?v=…): ცვლილების შემდეგ ბრაუზერი ძველ js/css-ს აღარ აიღებს ქეშიდან
    .replace(/\{\{B\}\}((?:css|js)\/[\w.-]+\.(?:css|js))"/g,(m, f) => existsSync(join(ROOT, f)) ? "{{B}}" + f + "?v=" + createHash("md5").update(readFileSync(join(ROOT, f))).digest("hex").slice(0, 8) + "\"" : m)
    .replaceAll("{{B}}", B)
    .replaceAll("{{PAGE}}", city ? "bus/" + city.slug : home ? "" : id)
    .replaceAll("{{TITLE}}", esc(p.title))
    .replaceAll("{{DESC}}", esc(p.desc))
    .replaceAll("{{OGTITLE}}", esc(l === "ka" && !city ? p.ogTitle || p.title : p.title))
    .replaceAll("{{OGDESC}}", esc(l === "ka" && !city ? p.ogDesc || p.desc : p.desc))
    .replaceAll("{{URL}}", U)
    .replace("{{ROUTE}}", city ? routeHtml(city, l, LB) + "<div class=\"w\">{{GUIDES}}</div>" : "")
    .replaceAll("{{GUIDES}}", GUIDES);
  if (!city && p.og) html = html.replace("images/og.jpg?v=3", p.og);
  html = slim(html, city ? "route" : home ? "home" : id);
  if (/\{\{[A-Z]+\}\}/.test(html)) throw new Error("unfilled placeholder in " + l + "/" + pth);
  html = html
    .replace('<html lang="ka">', `<html lang="${l}">`)
    .replace('<body data-page=', `<body data-lang="${l}" data-page=`)
    .replace('content="ka_GE"', `content="${LOCALE[l]}"`);
  const alt = LANGS.map(x => `<link rel="alternate" hreflang="${x}" href="${SITE + lp(x) + pth}">`).join("\n    ") + `\n    <link rel="alternate" hreflang="x-default" href="${SITE + pth}">`;
  html = html.replace(/(<link rel="canonical"[^>]*>)/, `$1\n    ${alt}`);
  html = html.replace(/(<([a-z0-9]+)\b[^>]*\sdata-i="([^"]+)"[^>]*>)(<\/\2>)/g, (m, open, tag, key, close) => K[key] ? open + esc(K[key]) + close : m);
  html = html.replace(/<a\b([^>]*?)\sdata-href="([^"]+)"/g, (m, a, h) => /\shref=/.test(a) ? m : `<a${a} href="${LB}${h}/" data-href="${h}"`);
  const nav = NAV.map(([h, k]) => `<a href="${LB + (h ? h + "/" : "") || "./"}" data-p="${h}"${!city && (h || "home") === id ? ' aria-current="page"' : ""}>${esc(K[k] || h)}</a>`).join("");
  html = html.replace('<nav class="mn" id="mn" aria-label="Pages"></nav>', `<nav class="mn" id="mn" aria-label="Pages">${nav}</nav>`);
  html = html.replace(/<button data-l="(ka|ru|en)">(KA|RU|EN)<\/button>/g, (m, x, t) => `<button data-l="${x}"${x === l ? ' aria-pressed="true"' : ""}>${t}</button>`);
  html = html.replace("</footer>", `  ${routesNav(l, LB)}\n      <nav class="w ft-lang" aria-label="Language">${LANGS.map(x => `<a href="${B + lp(x) + pth || "./"}" hreflang="${x}" lang="${x}"${x === l ? ' aria-current="true"' : ""}>${{ ka: "ქართული", ru: "Русский", en: "English" }[x]}</a>`).join("")}</nav>\n    </footer>`);
  let ld = jsonld(city ? "home" : id, l, p, K);
  if (city) {
    const t = RT[l](city), g = JSON.parse(ld.replace(/^<script[^>]*>|<\/script>$/g, ""));
    g["@graph"] = g["@graph"].filter(x => x["@type"] !== "BreadcrumbList").map(x => x["@type"] === "WebPage" ? { ...x, "@id": U + "#page", url: U } : x);
    g["@graph"].push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: K.nv0, item: SITE + lp(l) }, { "@type": "ListItem", position: 2, name: t.h1, item: U }] });
    g["@graph"].push({ "@type": "FAQPage", mainEntity: t.faq.filter(Boolean).map(q => ({ "@type": "Question", name: q[0], acceptedAnswer: { "@type": "Answer", text: q[1] } })) });
    g["@graph"].push({ "@type": "BusTrip", name: t.h1, provider: { "@id": SITE + "#org" }, departureBusStop: { "@type": "BusStop", name: city.n[l] }, arrivalBusStop: { "@type": "BusStop", name: t.end, address: "МКАД 33 км, владение 6, стр. 5, Москва", geo: { "@type": "GeoCoordinates", latitude: 55.578679, longitude: 37.588061 } }, ...(price ? { offers: { "@type": "Offer", price: CFG.price.ge, priceCurrency: "GEL", url: U } } : {}) });
    ld = '<script type="application/ld+json">' + JSON.stringify(g).replace(/</g, "\\u003c") + "</script>";
  }
  html = html.replace("</head>", "    " + ld + "\n  </head>");
  const out = join(ROOT, lp(l), pth, "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
  return U;
}
const ALL = [];
for (const l of LANGS) {
  for (const id of Object.keys(pages)) ALL.push([await page(l, id), id === "home" ? "1.0" : "0.8", path(id)]);
  for (const c of CITY) ALL.push([await page(l, null, c), "0.9", "bus/" + c.slug + "/"]);
}
console.log("✓", ALL.length, "pages");

// sitemap.xml (ყველა ენა, თარგმანების კავშირით)
const day = new Date().toISOString().slice(0, 10);
await writeFile(join(ROOT, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  ALL.map(([u, pr, pth]) => `  <url><loc>${u}</loc><lastmod>${day}</lastmod><priority>${pr}</priority>` + LANGS.map(x => `<xhtml:link rel="alternate" hreflang="${x}" href="${SITE + lp(x) + pth}"/>`).join("") + "</url>").join("\n") + "\n</urlset>\n");
console.log("✓ sitemap.xml (" + ALL.length + " URLs)");
