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
// Google My Maps ბმული ყველა გაჩერებით (src/stops-map.txt)
const STOPSMAP = existsSync(join(ROOT, "src/stops-map.txt")) ? readFileSync(join(ROOT, "src/stops-map.txt"), "utf8").trim() : "https://www.imeretitour.com/";
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
      logo: SITE + "images/icon-512.png", image: [SITE + "images/og.jpg"].concat(["bus-verhoeven-hotel", "bus-alaibus-side", "interior-warm", "interior-blue", "bus-kutaisi-lukoil-night", "bus-sarp-border"].map(n => SITE + "images/real/" + n + ".jpg")), telephone: PHONE, sameAs: ["https://yandex.ru/maps/org/imereti_tour/213269777081/", "https://t.me/imeretitour", "https://www.facebook.com/profile.php?id=61596622898121", "https://www.facebook.com/Imeretitour/", "https://vk.com/imeretitour", "https://ok.ru/group/70000060538721"],
      description: meta("home", l).desc, areaServed: ["GE", "RU"],
      address: { "@type": "PostalAddress", streetAddress: "8 Baku Street", addressLocality: "Batumi", addressCountry: "GE" },
      geo: { "@type": "GeoCoordinates", latitude: 41.6465879, longitude: 41.6465561 },
      contactPoint: { "@type": "ContactPoint", telephone: PHONE, contactType: "customer service", availableLanguage: ["ka", "ru", "en"] },
      priceRange: "200 GEL / 6500 RUB", currenciesAccepted: "GEL, RUB",
      knowsAbout: ["Bus Moscow — Georgia", "Автобус Москва — Грузия", "Автобус Москва — Тбилиси", "Автобус Москва — Кутаиси", "Автобус Москва — Батуми", "Посылки в Грузию из Москвы", "Upper Lars border crossing"],
      hasOfferCatalog: { "@type": "OfferCatalog", name: "Imereti Tour", itemListElement: [
        { "@type": "Offer", name: "Bus ticket Georgia ⇄ Moscow (Batumi, Kobuleti, Poti, Kutaisi, Tbilisi ⇄ Moscow Annino)", price: 200, priceCurrency: "GEL", url: SITE },
        { "@type": "Offer", name: "Bus ticket Moscow ⇄ Georgia (price in rubles)", price: 6500, priceCurrency: "RUB", url: SITE + "ru/" },
        { "@type": "Offer", name: "Parcel delivery Georgia ⇄ Moscow, per kg", price: 10, priceCurrency: "GEL", url: SITE + "parcels/" },
        { "@type": "Offer", name: "Bus charter in Georgia and to Europe", url: SITE + "charter/" }] }
    },
    { "@type": "WebPage", "@id": url(id, l) + "#page", url: url(id, l), name: p.title, description: p.desc, isPartOf: { "@id": SITE + "#site" }, about: { "@id": SITE + "#org" }, inLanguage: l }
  ];
  if (id !== "home") g.push({
    "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: K.nv0 || name, item: url("home", l) },
      { "@type": "ListItem", position: 2, name: id === "new-year" ? K.nyN : id === "travel-guide" ? K.tgN : id === "lars" ? K.laN : id === "how-to-get" ? K.hgN : id === "parcel-guide" ? K.pgN : K[NAV.find(n => n[0] === id)[1]], item: url(id, l) }]
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
  if (id === "how-to-get") g.push({ "@type": "Article", headline: K.hgH, description: K.hgS, inLanguage: l, url: url(id, l),
    image: SITE + "images/og.jpg", author: { "@id": SITE + "#org" }, publisher: { "@id": SITE + "#org" }, datePublished: "2026-11-27", dateModified: "2026-11-27" },
    { "@type": "FAQPage", mainEntity: [1, 2, 3].map(i => ({ "@type": "Question", name: K["hgq" + i], acceptedAnswer: { "@type": "Answer", text: K["hga" + i] } })) });
  if (id === "lars") g.push({ "@type": "Article", headline: K.laH, description: K.laS, inLanguage: l, url: url(id, l),
    image: SITE + "images/og.jpg", author: { "@id": SITE + "#org" }, publisher: { "@id": SITE + "#org" }, datePublished: "2026-11-18", dateModified: "2026-11-23" },
    { "@type": "FAQPage", mainEntity: [1, 2, 3, 4].map(i => ({ "@type": "Question", name: K["laq" + i], acceptedAnswer: { "@type": "Answer", text: K["laa" + i] } })) });
  if (id === "home") g.push({ "@type": "FAQPage", mainEntity: HOMESEO[l].q.map(q => ({ "@type": "Question", name: q[0], acceptedAnswer: { "@type": "Answer", text: q[1] } })) });
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
const RUB = CFG.rub || 6500; // ბილეთის ფასი რუბლში
const price = CFG.price.ge > 0 ? CFG.price.ge + " " + CFG.cur + " (" + RUB + " ₽)" : "";
const CITY = STOPS.map((s, i) => ({ i, slug: s[1].en.toLowerCase() + "-moscow", n: s[1], time: CFG.stops[i] || s[0] }));
const kaAbl = n => n + "დან", kaLoc = n => n.replace(/ი$/, "") + "ში";
const RT = {
  ka: c => ({
    title: `${c.n.ka} მოსკოვი ავტობუსი — ბილეთი, ფასი, განრიგი | იმერეთი ტური`,
    desc: `ავტობუსი ${kaAbl(c.n.ka)} მოსკოვამდე: გასვლა ${days("ge", "ka")}, ${c.time}.${price ? " ბილეთი " + price + "." : ""} გზაში ~1,5 დღე, 30 კგ ბარგი უფასოა. დაჯავშნე ონლაინ.`,
    kick: "ავტობუსი", h1: `${c.n.ka} — მოსკოვი`, sub: `რეგულარული რეისი ${kaAbl(c.n.ka)} მოსკოვამდე, ზემო ლარსის გავლით. დაჯავშნე ადგილი 1 წუთში.`,
    fT: "გასვლა", fD: "დღეები", fP: "ფასი", fE: "ფინიში", end: "მოსკოვი, მეტრო „ანინო“",
    rH: "მარშრუტი", wH: "რატომ ჩვენთან",
    li: ["კომფორტული ავტობუსები: კონდიციონერი, Wi-Fi, USB დამტენი", "დაჯავშნა 1 წუთში, რეგისტრაციის გარეშე", "ჯავშნისთვის საკმარისია 25% წინასწარ", "ამანათების გადაზიდვა ორივე მიმართულებით"],
    cta: "დაჯავშნა", sch: "სრული განრიგი", qH: "ხშირი კითხვები", oH: "სხვა ქალაქებიდან",
    faq: [[`როდის გადის ავტობუსი ${kaAbl(c.n.ka)} მოსკოვში?`, `${days("ge", "ka")}, ${c.time}-ზე (საქართველოს დროით). ზუსტი თარიღები იხილეთ განრიგში.`],
      price && [`რა ღირს ბილეთი ${kaAbl(c.n.ka)} მოსკოვამდე?`, `${price} ერთ ადგილზე. დაჯავშნისას საკმარისია 25% წინასწარ.`],
      [`არის რეისი უკან, მოსკოვიდან ${kaLoc(c.n.ka)}?`, `დიახ. მოსკოვიდან გასვლა: ${days("ru", "ka")}.`],
      ["რამდენ ხანს გრძელდება მგზავრობა?", "დაახლოებით დღე-ნახევარი — დამოკიდებულია ზემო ლარსზე რიგსა და ამინდზე. 30 კგ ბარგი უფასოა, დამატებით — 10 ლარი/კგ."],
      ["როგორ დავჯავშნო?", "აირჩიეთ თარიღი და გაჩერება საიტზე და გაგზავნეთ ჯავშანი WhatsApp-ში, ან დაგვირეკეთ: +995 598 80 80 22."]],
    msg: `გამარჯობა! მინდა ადგილის დაჯავშნა: ${c.n.ka} → მოსკოვი.`, other: o => `${o.n.ka} — მოსკოვი`
  }),
  ru: c => ({
    title: `Автобус ${c.n.ru} — Москва: расписание, цена, билеты | Имерети Тур`,
    desc: `Автобус из ${c.n.ru} в Москву: отправление ${days("ge", "ru")} в ${c.time}.${price ? " Цена " + price + "." : ""} В пути ~1,5 суток, 30 кг багажа бесплатно. Обратно из Москвы: ${days("ru", "ru")}. Бронирование онлайн.`,
    kick: "Автобус", h1: `${c.n.ru} — Москва`, sub: `Регулярный рейс из ${c.n.ru} в Москву через Верхний Ларс. Бронирование за 1 минуту.`,
    fT: "Отправление", fD: "Дни", fP: "Цена", fE: "Финиш", end: "Москва, метро «Аннино»",
    rH: "Маршрут", wH: "Почему мы",
    li: ["Комфортные автобусы: кондиционер, Wi-Fi, USB-зарядка", "Бронирование за 1 минуту, без регистрации", "Для брони достаточно 25% предоплаты", "Доставка посылок в обе стороны"],
    cta: "Забронировать", sch: "Всё расписание", qH: "Частые вопросы", oH: "Из других городов",
    faq: [[`Когда отправляется автобус из ${c.n.ru} в Москву?`, `${days("ge", "ru")}, в ${c.time} (по грузинскому времени). Точные даты смотрите в расписании.`],
      price && [`Сколько стоит билет из ${c.n.ru} до Москвы?`, `${price} за место. Для бронирования достаточно 25% предоплаты.`],
      [`Есть ли обратный рейс из Москвы в ${c.n.ru}?`, `Да. Отправление из Москвы: ${days("ru", "ru")}.`],
      ["Сколько ехать до Москвы?", "Около полутора суток — зависит от очереди на Верхнем Ларсе и погоды. 30 кг багажа — бесплатно, сверх нормы — 10 лари/кг."],
      ["Как забронировать?", "Выберите дату и остановку на сайте и отправьте заявку в WhatsApp или позвоните: +995 598 80 80 22."]],
    msg: `Здравствуйте! Хочу забронировать место: ${c.n.ru} → Москва.`, other: o => `${o.n.ru} — Москва`
  }),
  en: c => ({
    title: `${c.n.en} — Moscow bus: schedule, price, tickets | Imereti Tour`,
    desc: `Bus from ${c.n.en} to Moscow: departures ${days("ge", "en")} at ${c.time}.${price ? " Ticket " + price + "." : ""} About 1.5 days, 30 kg luggage free. Book online.`,
    kick: "Bus", h1: `${c.n.en} — Moscow`, sub: `Regular bus from ${c.n.en} to Moscow via Upper Lars. Book a seat in 1 minute.`,
    fT: "Departure", fD: "Days", fP: "Price", fE: "Finish", end: "Moscow, Annino metro",
    rH: "Route", wH: "Why us",
    li: ["Comfortable coaches: air conditioning, Wi-Fi, USB charging", "Book in 1 minute, no sign-up", "Only 25% prepayment to book", "Parcel delivery both ways"],
    cta: "Book a seat", sch: "Full schedule", qH: "FAQ", oH: "From other cities",
    faq: [[`When does the bus from ${c.n.en} to Moscow leave?`, `${days("ge", "en")} at ${c.time} (Georgia time). See the schedule for exact dates.`],
      price && [`How much is a ticket from ${c.n.en} to Moscow?`, `${price} per seat. Only 25% prepayment to book.`],
      [`Is there a return trip from Moscow to ${c.n.en}?`, `Yes. Departures from Moscow: ${days("ru", "en")}.`],
      ["How long is the trip to Moscow?", "About a day and a half — depends on the queue at Upper Lars and the weather. 30 kg of luggage free, extra — 10 GEL/kg."],
      ["How do I book?", "Pick a date and stop on the website and send the request on WhatsApp, or call +995 598 80 80 22."]],
    msg: `Hello! I would like to book a seat: ${c.n.en} → Moscow.`, other: o => `${o.n.en} — Moscow`
  })
};
const rtUrl = (c, l) => SITE + lp(l) + "bus/" + c.slug + "/";
// საპირისპირო მიმართულება: bus/moscow-batumi/ ... (ხალხი ხშირად ეძებს „Москва Батуми“, „Москва Кутаиси“)
const priceR = CFG.price.ru > 0 ? CFG.price.ru + " " + CFG.cur + " (" + RUB + " ₽)" : "";
const CITYR = STOPS.map((s, i) => ({ i, rev: true, slug: "moscow-" + s[1].en.toLowerCase(), n: s[1] }));
const RTR = {
  ka: c => ({
    title: `მოსკოვი ${c.n.ka} ავტობუსი — ბილეთი, ფასი, განრიგი | იმერეთი ტური`,
    desc: `ავტობუსი მოსკოვიდან ${kaLoc(c.n.ka)}: გასვლა ${days("ru", "ka")}, მეტრო „ანინოსთან“.${priceR ? " ბილეთი " + priceR + "." : ""} 30 კგ ბარგი უფასოა. დაჯავშნე ონლაინ 1 წუთში.`,
    kick: "ავტობუსი", h1: `მოსკოვი — ${c.n.ka}`, sub: `რეგულარული რეისი მოსკოვიდან ${kaLoc(c.n.ka)}, ზემო ლარსის გავლით. დაჯავშნე ადგილი 1 წუთში.`,
    fS: "გასვლა", start: "მოსკოვი, მეტრო „ანინო“", fD: "დღეები", fP: "ფასი", fE: "ჩამოსვლა", end: c.n.ka,
    rH: "მარშრუტი", wH: "რატომ ჩვენთან",
    li: ["კომფორტული ავტობუსები: კონდიციონერი, Wi-Fi, USB დამტენი", "30 კგ ბარგი უფასოა", "დაჯავშნა 1 წუთში, რეგისტრაციის გარეშე", "ამანათები მოსკოვიდან საქართველოში — 10 ₾/კგ"],
    cta: "დაჯავშნა", sch: "სრული განრიგი", qH: "ხშირი კითხვები", oH: "სხვა მიმართულებები",
    faq: [[`როდის გადის ავტობუსი მოსკოვიდან ${kaLoc(c.n.ka)}?`, `${days("ru", "ka")}. გასვლა მეტრო „ანინოსთან“ (МКАД 33 км). ზუსტი თარიღები იხილეთ განრიგში.`],
      priceR && [`რა ღირს ბილეთი მოსკოვიდან ${kaLoc(c.n.ka)}?`, `${priceR} ერთ ადგილზე. დაჯავშნისას საკმარისია 25% წინასწარ.`],
      ["რამდენ ხანს გრძელდება მგზავრობა?", "დაახლოებით დღე-ნახევარი — დამოკიდებულია ზემო ლარსზე რიგსა და ამინდზე. 30 კგ ბარგი უფასოა, დამატებით — 10 ლარი/კგ."],
      [`შემიძლია ამანათის გაგზავნა მოსკოვიდან ${kaLoc(c.n.ka)}?`, "დიახ, 10 ლარი 1 კგ. ამანათს იღებთ ავტობუსის გაჩერებაზე. მოგვწერეთ WhatsApp-ში."],
      ["როგორ დავჯავშნო?", "აირჩიეთ თარიღი და გაჩერება საიტზე და გაგზავნეთ ჯავშანი WhatsApp-ში, ან დაგვირეკეთ: +995 598 80 80 22."]],
    msg: `გამარჯობა! მინდა ადგილის დაჯავშნა: მოსკოვი → ${c.n.ka}.`, other: o => `მოსკოვი — ${o.n.ka}`, back: `უკან: ${c.n.ka} — მოსკოვი`
  }),
  ru: c => ({
    title: `Автобус Москва — ${c.n.ru}: расписание, цена, билеты | Имерети Тур`,
    desc: `Автобус из Москвы в ${c.n.ru}: отправление ${days("ru", "ru")} от м. Аннино.${priceR ? " Билет " + priceR + "." : ""} 30 кг багажа бесплатно. Бронирование онлайн за 1 минуту.`,
    kick: "Автобус", h1: `Москва — ${c.n.ru}`, sub: `Регулярный рейс из Москвы в ${c.n.ru} через Верхний Ларс. Бронирование за 1 минуту.`,
    fS: "Отправление", start: "Москва, метро «Аннино»", fD: "Дни", fP: "Цена", fE: "Прибытие", end: c.n.ru,
    rH: "Маршрут", wH: "Почему мы",
    li: ["Комфортные автобусы: кондиционер, Wi-Fi, USB-зарядка", "30 кг багажа бесплатно", "Бронирование за 1 минуту, без регистрации", "Посылки из Москвы в Грузию — 10 ₾/кг"],
    cta: "Забронировать", sch: "Всё расписание", qH: "Частые вопросы", oH: "Другие направления",
    faq: [[`Когда отправляется автобус из Москвы в ${c.n.ru}?`, `${days("ru", "ru")}. Посадка у метро «Аннино» (МКАД 33 км). Точные даты смотрите в расписании.`],
      priceR && [`Сколько стоит билет из Москвы в ${c.n.ru}?`, `${priceR} за место. Для бронирования достаточно 25% предоплаты.`],
      ["Сколько ехать?", "Около полутора суток — зависит от очереди на Верхнем Ларсе и погоды. 30 кг багажа — бесплатно, сверх нормы — 10 лари/кг."],
      [`Можно отправить посылку из Москвы в ${c.n.ru}?`, "Да, 10 лари за 1 кг. Получатель забирает посылку на остановке автобуса. Напишите нам в WhatsApp."],
      ["Как забронировать?", "Выберите дату и остановку на сайте и отправьте заявку в WhatsApp или позвоните: +995 598 80 80 22."]],
    msg: `Здравствуйте! Хочу забронировать место: Москва → ${c.n.ru}.`, other: o => `Москва — ${o.n.ru}`, back: `Обратно: ${c.n.ru} — Москва`
  }),
  en: c => ({
    title: `Moscow — ${c.n.en} bus: schedule, price, tickets | Imereti Tour`,
    desc: `Bus from Moscow to ${c.n.en}: departures ${days("ru", "en")} from Annino metro.${priceR ? " Ticket " + priceR + "." : ""} 30 kg of luggage free. Book online in 1 minute.`,
    kick: "Bus", h1: `Moscow — ${c.n.en}`, sub: `Regular bus from Moscow to ${c.n.en} via Upper Lars. Book a seat in 1 minute.`,
    fS: "Departure", start: "Moscow, Annino metro", fD: "Days", fP: "Price", fE: "Arrival", end: c.n.en,
    rH: "Route", wH: "Why us",
    li: ["Comfortable coaches: air conditioning, Wi-Fi, USB charging", "30 kg of luggage free", "Book in 1 minute, no sign-up", "Parcels from Moscow to Georgia — 10 ₾/kg"],
    cta: "Book a seat", sch: "Full schedule", qH: "FAQ", oH: "Other routes",
    faq: [[`When does the bus from Moscow to ${c.n.en} leave?`, `${days("ru", "en")}, from Annino metro (MKAD 33 km). See the schedule for exact dates.`],
      priceR && [`How much is a ticket from Moscow to ${c.n.en}?`, `${priceR} per seat. Only 25% prepayment to book.`],
      ["How long is the trip?", "About a day and a half — depends on the queue at Upper Lars and the weather. 30 kg of luggage free, extra — 10 GEL/kg."],
      [`Can I send a parcel from Moscow to ${c.n.en}?`, "Yes, 10 GEL per 1 kg. The recipient collects it at the bus stop. Message us on WhatsApp."],
      ["How do I book?", "Pick a date and stop on the website and send the request on WhatsApp, or call +995 598 80 80 22."]],
    msg: `Hello! I would like to book a seat: Moscow → ${c.n.en}.`, other: o => `Moscow — ${o.n.en}`, back: `Back: ${c.n.en} — Moscow`
  })
};
const RTX = c => (c.rev ? RTR : RT);
// ---------------------------------------------------------------------
// მთავარი გვერდის ტექსტი Google-ისთვის და AI-სთვის: რას ეძებენ ხალხი (ბილეთი, ფასი, განრიგი, რამდენ ხანს მივდივართ, ამანათი)
// ---------------------------------------------------------------------
const PR = CFG.price.ge || 200, KG = CFG.kg.ge || 10;
const HOMESEO = {
  ka: {
    k: "ყველაფერი მგზავრობაზე", h: "ავტობუსი საქართველო — მოსკოვი: ბილეთები, ფასი, განრიგი",
    p: [`„იმერეთი ტური“ — რეგულარული ავტობუსი საქართველოსა და მოსკოვს შორის. საქართველოდან მოსკოვში ავტობუსი გადის: ${days("ge", "ka")}; მოსკოვიდან საქართველოში: ${days("ru", "ka")}. გაჩერებები საქართველოში: ბათუმი, ქობულეთი, ფოთი, ქუთაისი და თბილისი; მოსკოვში — მეტრო „ანინო“ (МКАД 33 კმ). მარშრუტი ზემო ლარსის გავლით მიდის, გზაში დაახლოებით დღე-ნახევარია.`,
      `ბილეთი ავტობუსზე საქართველო — მოსკოვი ღირს ${PR} ლარი (${RUB} ₽) ნებისმიერი ქალაქიდან. 30 კგ ბარგი ერთ მგზავრზე უფასოა, დამატებით — ${KG} ლარი 1 კგ. ავტობუსებში არის კონდიციონერი, Wi-Fi და USB დამტენი. ადგილის დასაჯავშნად აირჩიე თარიღი და გაჩერება ზემოთ ფორმაში და გამოგვიგზავნე WhatsApp-ში — რეგისტრაცია არ სჭირდება, საკმარისია 25% წინასწარ.`,
      `ამავე ავტობუსით ვგზავნით ამანათებს მოსკოვში და მოსკოვიდან საქართველოში — ${KG} ლარი 1 კგ. ამანათს ავტობუსის გაჩერებაზე გადმოგვცემთ, ადრესატი კი დანიშნულების ადგილას იღებს.`],
    rH: "პოპულარული მიმართულებები", qH: "ხშირი კითხვები ავტობუსზე საქართველო — მოსკოვი",
    q: [[`რა ღირს ავტობუსის ბილეთი მოსკოვამდე?`, `${PR} ლარი (${RUB} ₽) ერთ ადგილზე — ბათუმიდან, ქობულეთიდან, ფოთიდან, ქუთაისიდან ან თბილისიდან. 30 კგ ბარგი უფასოა.`],
      ["რამდენ ხანს მივდივართ ავტობუსით მოსკოვამდე?", "დაახლოებით დღე-ნახევარი. დრო დამოკიდებულია ზემო ლარსზე რიგსა და ამინდზე."],
      ["რომელ დღეებში გადის ავტობუსი მოსკოვში?", `საქართველოდან: ${days("ge", "ka")}. მოსკოვიდან: ${days("ru", "ka")}.`],
      ["საიდან გადის ავტობუსი მოსკოვში?", "მოსკოვში ავტობუსი დგას მეტრო „ანინოსთან“ (МКАД 33 კმ, владение 6, стр. 5). ქუთაისში — Lukoil, ლადო ასათიანის 98."],
      ["შემიძლია ამანათის გაგზავნა მოსკოვში?", `დიახ, ორივე მიმართულებით — ${KG} ლარი 1 კგ.`],
      ["როგორ დავჯავშნო ბილეთი?", "საიტზე აირჩიეთ თარიღი და გაჩერება და გამოგვიგზავნეთ WhatsApp-ში, ან დაგვირეკეთ: +995 598 80 80 22."]]
  },
  ru: {
    k: "Всё о поездке", h: "Автобус Москва — Грузия: билеты, цена, расписание",
    p: [`«Имерети Тур» — регулярный автобус между Москвой и Грузией. Из Москвы автобус отправляется: ${days("ru", "ru")}; из Грузии в Москву: ${days("ge", "ru")}. Посадка в Москве — у метро «Аннино» (МКАД 33 км). Остановки в Грузии: Тбилиси, Кутаиси, Поти, Кобулети и Батуми. Маршрут идёт через КПП Верхний Ларс, в пути около полутора суток.`,
      `Билет на автобус Москва — Грузия стоит ${PR} лари (${RUB} ₽) до любого города маршрута. 30 кг багажа на человека — бесплатно, сверх нормы — ${KG} лари за кг. В автобусах кондиционер, Wi-Fi и USB-зарядка. Чтобы купить билет, выберите дату и остановку в форме выше и отправьте заявку в WhatsApp — без регистрации, достаточно предоплаты 25%. При отмене деньги возвращаем.`,
      `Этим же автобусом мы перевозим посылки из Москвы в Грузию и из Грузии в Москву — ${KG} лари за кг. Посылку передают на остановке автобуса, получатель забирает её в пункте назначения.`],
    rH: "Популярные направления", qH: "Частые вопросы об автобусе Москва — Грузия",
    q: [["Сколько стоит билет на автобус Москва — Грузия?", `${PR} лари (${RUB} ₽) за место до Тбилиси, Кутаиси, Поти, Кобулети или Батуми. 30 кг багажа — бесплатно.`],
      ["Сколько ехать на автобусе из Москвы в Грузию?", "Около полутора суток. Время зависит от очереди на Верхнем Ларсе и погоды."],
      ["В какие дни ходит автобус?", `Из Москвы: ${days("ru", "ru")}. Из Грузии: ${days("ge", "ru")}.`],
      ["Откуда отправляется автобус в Москве?", "От метро «Аннино» (МКАД 33 км, владение 6, стр. 5)."],
      ["Можно отправить посылку в Грузию из Москвы?", `Да, в обе стороны — ${KG} лари за кг.`],
      ["Как купить билет?", "Выберите дату и остановку на сайте и отправьте заявку в WhatsApp или позвоните: +995 598 80 80 22."]]
  },
  en: {
    k: "About the trip", h: "Georgia — Moscow bus: tickets, price, schedule",
    p: [`Imereti Tour runs a regular bus between Georgia and Moscow. From Georgia to Moscow: ${days("ge", "en")}; from Moscow to Georgia: ${days("ru", "en")}. Stops in Georgia: Batumi, Kobuleti, Poti, Kutaisi and Tbilisi; in Moscow the bus stops at Annino metro (MKAD 33 km). The route crosses the border at Upper Lars and takes about a day and a half.`,
      `A Georgia — Moscow bus ticket costs ${PR} GEL (${RUB} RUB) from any city on the route. 30 kg of luggage per person is free, extra is ${KG} GEL per kg. The coaches have air conditioning, Wi-Fi and USB charging. To book, pick a date and stop in the form above and send it on WhatsApp — no sign-up, only 25% prepayment.`,
      `The same bus carries parcels from Georgia to Moscow and back — ${KG} GEL per kg. You hand the parcel over at the bus stop and the recipient collects it at the destination.`],
    rH: "Popular routes", qH: "Georgia — Moscow bus: FAQ",
    q: [["How much is a bus ticket from Georgia to Moscow?", `${PR} GEL (${RUB} RUB) per seat from Batumi, Kobuleti, Poti, Kutaisi or Tbilisi. 30 kg of luggage free.`],
      ["How long is the bus trip to Moscow?", "About a day and a half, depending on the queue at Upper Lars and the weather."],
      ["Which days does the bus run?", `From Georgia: ${days("ge", "en")}. From Moscow: ${days("ru", "en")}.`],
      ["Where does the bus stop in Moscow?", "At Annino metro station (MKAD 33 km, vladenie 6, building 5)."],
      ["Can I send a parcel to Moscow?", `Yes, both ways — ${KG} GEL per kg.`],
      ["How do I book?", "Pick a date and stop on the website and send the request on WhatsApp, or call +995 598 80 80 22."]]
  }
};
function homeSeo(l, LB) {
  const t = HOMESEO[l];
  const links = CITYR.map(c => `<a href="${LB}bus/${c.slug}/">${esc((l === "ka" ? "ავტობუსი " : l === "ru" ? "Автобус " : "Bus ") + RTR[l](c).h1)}</a>`)
    .concat(CITY.map(c => `<a href="${LB}bus/${c.slug}/">${esc((l === "ka" ? "ავტობუსი " : l === "ru" ? "Автобус " : "Bus ") + RT[l](c).h1)}</a>`)).join("");
  return `<section class="band" id="about">
        <div class="w narrow">
          <div class="head"><span class="kicker">${esc(t.k)}</span><h2>${esc(t.h)}</h2></div>
          <article class="prose art">${t.p.map(x => `<p>${esc(x)}</p>`).join("")}</article>
          <h3 class="h2">${esc(t.rH)}</h3>
          <div class="rt-other">${links}</div>
          <h3 class="h2">${esc(t.qH)}</h3>
          <div class="faq f3d">${t.q.map(q => `<details><summary>${esc(q[0])}</summary><p>${esc(q[1])}</p></details>`).join("")}</div>
        </div>
      </section>`;
}
// მარშრუტის გვერდის აღწერა („როგორ ჩავიდეთ …“) + ამანათები ამ მიმართულებით
function routeIntro(c, l) {
  const n = c.n[l], rev = !!c.rev, t = (rev ? CFG.stops : CFG.stops)[c.i] || "";
  if (l === "ka") return rev
    ? [`როგორ ჩავიდეთ მოსკოვიდან ${kaLoc(n)} ავტობუსით`, `„იმერეთი ტურის“ ავტობუსი მოსკოვი — ${n} გადის მოსკოვიდან, მეტრო „ანინოსთან“ (МКАД 33 კმ): ${days("ru", "ka")}. მარშრუტი ზემო ლარსის გავლით მიდის, გზაში დაახლოებით დღე-ნახევარია. ბილეთი — ${CFG.price.ru || PR} ლარი (${RUB} ₽), 30 კგ ბარგი უფასოა, დამატებით — ${KG} ლარი/კგ. დაჯავშნა ონლაინ 1 წუთში, რეგისტრაციის გარეშე: საკმარისია 25% წინასწარ.`,
      `ამანათი მოსკოვიდან ${kaLoc(n)}`, `ამანათი იმავე ავტობუსით მიდის — ${KG} ლარი 1 კგ. გადმოგვეცით მოსკოვში, მეტრო „ანინოსთან“, ადრესატი კი ${kaLoc(n)} იღებს.`]
    : [`როგორ ჩავიდეთ ${kaAbl(n)} მოსკოვში ავტობუსით`, `„იმერეთი ტურის“ ავტობუსი ${n} — მოსკოვი გადის ${kaAbl(n)}: ${days("ge", "ka")}, ${t}-ზე. მარშრუტი ზემო ლარსის გავლით მიდის და ჩადის მოსკოვში, მეტრო „ანინოსთან“ (МКАД 33 კმ). გზაში დაახლოებით დღე-ნახევარია. ბილეთი — ${PR} ლარი (${RUB} ₽), 30 კგ ბარგი უფასოა, დამატებით — ${KG} ლარი/კგ. დაჯავშნა ონლაინ 1 წუთში, რეგისტრაციის გარეშე: საკმარისია 25% წინასწარ.`,
      `ამანათი ${kaAbl(n)} მოსკოვში`, `ამანათი იმავე ავტობუსით მიდის — ${KG} ლარი 1 კგ. გადმოგვეცით გაჩერებაზე, ადრესატი კი მოსკოვში, მეტრო „ანინოსთან“ იღებს.`];
  if (l === "ru") return rev
    ? [`Как доехать из Москвы в ${n} на автобусе`, `Автобус Москва — ${n} компании «Имерети Тур» отправляется от метро «Аннино» (МКАД 33 км): ${days("ru", "ru")}. Маршрут идёт через КПП Верхний Ларс, в пути около полутора суток. Билет — ${CFG.price.ru || PR} лари (${RUB} ₽), 30 кг багажа бесплатно, сверх нормы — ${KG} лари за кг. Бронирование онлайн за 1 минуту, без регистрации: достаточно предоплаты 25%.`,
      `Посылки из Москвы в ${n}`, `Посылка едет этим же автобусом — ${KG} лари за кг. Передайте её на остановке у метро «Аннино» в Москве, получатель забирает её в ${n}.`]
    : [`Как доехать из ${n} в Москву на автобусе`, `Автобус ${n} — Москва компании «Имерети Тур» отправляется из ${n}: ${days("ge", "ru")}, в ${t}. Маршрут идёт через КПП Верхний Ларс до метро «Аннино» в Москве (МКАД 33 км), в пути около полутора суток. Билет — ${PR} лари (${RUB} ₽), 30 кг багажа бесплатно, сверх нормы — ${KG} лари за кг. Бронирование онлайн за 1 минуту, без регистрации: достаточно предоплаты 25%.`,
      `Посылки из ${n} в Москву`, `Посылка едет этим же автобусом — ${KG} лари за кг. Передайте её на остановке в ${n}, получатель забирает её в Москве у метро «Аннино».`];
  return rev
    ? [`How to get from Moscow to ${n} by bus`, `The Imereti Tour bus from Moscow to ${n} leaves from Annino metro (MKAD 33 km): ${days("ru", "en")}. It crosses the border at Upper Lars and takes about a day and a half. A ticket is ${CFG.price.ru || PR} GEL (${RUB} RUB), 30 kg of luggage free, extra ${KG} GEL per kg. Book online in 1 minute, no sign-up, only 25% prepayment.`,
      `Parcels from Moscow to ${n}`, `Parcels travel on the same bus — ${KG} GEL per kg. Hand it over at Annino metro in Moscow; the recipient collects it in ${n}.`]
    : [`How to get from ${n} to Moscow by bus`, `The Imereti Tour bus from ${n} to Moscow leaves ${days("ge", "en")} at ${t}. It crosses the border at Upper Lars and arrives at Annino metro in Moscow (MKAD 33 km) in about a day and a half. A ticket is ${PR} GEL (${RUB} RUB), 30 kg of luggage free, extra ${KG} GEL per kg. Book online in 1 minute, no sign-up, only 25% prepayment.`,
      `Parcels from ${n} to Moscow`, `Parcels travel on the same bus — ${KG} GEL per kg. Hand it over at the stop in ${n}; the recipient collects it in Moscow at Annino metro.`];
}
const introHtml = (c, l) => { const x = routeIntro(c, l); return `<article class="prose art rt-intro"><h2>${esc(x[0])}</h2><p>${esc(x[1])}</p><h2>${esc(x[2])}</h2><p>${esc(x[3])}</p></article>`; };
const IMQ = {"ka":["ზესტაფონიდან, სამტრედიიდან, წყალტუბოდან ან იმერეთის სხვა ქალაქიდან როგორ ვიმგზავრო?","იმერეთიდან ყველაზე ახლოს ქუთაისის გაჩერებაა: Lukoil, ლადო ასათიანის 98. ზესტაფონიდან, სამტრედიიდან, წყალტუბოდან, ტყიბულიდან, ჭიათურიდან, თერჯოლიდან, ვანიდან, ბაღდათიდან და ხონიდან მგზავრები აქ სხდებიან და აქვე ჩამოდიან."],"ru":["Я из Зестафони, Самтредиа, Цхалтубо или другого города Имерети — где сесть?","Ближайшая остановка для всей Имерети — Кутаиси: Lukoil, ул. Ладо Асатиани, 98. Пассажиры из Зестафони, Самтредиа, Цхалтубо, Ткибули, Чиатуры, Терджолы, Вани, Багдати и Хони садятся и выходят здесь."],"en":["I live in Zestaponi, Samtredia, Tskaltubo or elsewhere in Imereti — where do I board?","The nearest stop for all of Imereti is Kutaisi: Lukoil, 98 Lado Asatiani St. Passengers from Zestaponi, Samtredia, Tskaltubo, Tkibuli, Chiatura, Terjola, Vani, Baghdati and Khoni board and get off here."]};
const faqOf = (c, l, t) => t.faq.filter(Boolean).concat(c.i === 3 ? [IMQ[l]] : []);
function routeHtmlR(c, l, LB) {
  const t = RTR[l](c), K = TX[l];
  const stops = `<li class="me"><b>${esc(t.start)}</b></li>` + STOPS.slice().reverse().map(s => `<li${STOPS.indexOf(s) === c.i ? ' class="me"' : ""}>${esc(s[1][l])}</li>`).join("");
  const fwd = CITY.find(o => o.i === c.i);
  return `
      <div class="phd phd3" data-scene="bus"><canvas class="phgl" aria-hidden="true"></canvas><div class="w"><h1>${esc(t.kick + " " + t.h1)}</h1><p class="sub">${esc(t.sub)}</p></div></div>
      <div class="w">
        <div class="rt-facts"><div><small>${t.fS}</small><b>${esc(t.start)}</b></div><div><small>${t.fD}</small><b>${esc(days("ru", l))}</b></div>${priceR ? `<div><small>${t.fP}</small><b>${esc(priceR)}</b></div>` : ""}<div><small>${t.fE}</small><b>${esc(t.end)}</b></div></div>
        <div class="two">
          <div class="box rbox"><h2>${t.rH}</h2><ol class="route rt-route">${stops}</ol></div>
          <div class="box"><h2>${t.wH}</h2><ul class="rt-list">${t.li.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
            <p class="ctas"><a class="btn coral mag" href="${LB || "./"}?st=${c.i}&dir=ru#book">${esc(t.cta)}</a><a class="btn wa" href="https://wa.me/995598808022?text=${encodeURIComponent(t.msg)}" target="_blank" rel="noopener">WhatsApp</a><a class="btn ghost" href="${LB}schedule/">${esc(t.sch)}</a></p></div>
        </div>
        ${introHtml(c, l)}
        ${cityMaps(fwd)}
        <h2 class="h2">${t.qH}</h2>
        <div class="faq f3d">${faqOf(c, l, t).map(q => `<details><summary>${esc(q[0])}</summary><p>${esc(q[1])}</p></details>`).join("")}</div>
        <h2 class="h2">${t.oH}</h2>
        <div class="rt-other"><a href="${LB}bus/${fwd.slug}/">${esc(t.back)}</a>${CITYR.filter(o => o !== c).map(o => `<a href="${LB}bus/${o.slug}/">${esc(t.other(o))}</a>`).join("")}</div>
      </div>`;
}
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
      <div class="phd phd3" data-scene="bus"><canvas class="phgl" aria-hidden="true"></canvas><div class="w"><h1>${esc(t.kick + " " + t.h1)}</h1><p class="sub">${esc(t.sub)}</p></div></div>
      <div class="w">
        <div class="rt-facts"><div><small>${t.fT}</small><b>${c.time}</b></div><div><small>${t.fD}</small><b>${esc(days("ge", l))}</b></div>${price ? `<div><small>${t.fP}</small><b>${esc(price)}</b></div>` : ""}<div><small>${t.fE}</small><b>${esc(t.end)}</b></div></div>
        <div class="two">
          <div class="box rbox"><h2>${t.rH}</h2><ol class="route rt-route">${stops}</ol></div>
          <div class="box"><h2>${t.wH}</h2><ul class="rt-list">${t.li.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
            <p class="ctas"><a class="btn coral mag" href="${LB || "./"}?st=${c.i}#book">${esc(t.cta)}</a><a class="btn wa" href="https://wa.me/995598808022?text=${encodeURIComponent(t.msg)}" target="_blank" rel="noopener">WhatsApp</a><a class="btn ghost" href="${LB}schedule/">${esc(t.sch)}</a></p></div>
        </div>
        ${introHtml(c, l)}
        ${cityMaps(c)}
        <h2 class="h2">${t.qH}</h2>
        <div class="faq f3d">${faqOf(c, l, t).map(q => `<details><summary>${esc(q[0])}</summary><p>${esc(q[1])}</p></details>`).join("")}</div>
        <h2 class="h2">${t.oH}</h2>
        <div class="rt-other"><a href="${LB}bus/moscow-${c.n.en.toLowerCase()}/">${esc(RTR[l](c).h1)}</a>${CITY.filter(o => o !== c).map(o => `<a href="${LB}bus/${o.slug}/">${esc(t.other(o))}</a>`).join("")}</div>
      </div>`;
}
const GUIDES = "<div class=\"gd rv\"><div class=\"head\"><span class=\"kicker\" data-i=\"gdK\"></span><h2 data-i=\"gdH\"></h2></div><div class=\"gdl\"><a class=\"gdc gdc0\" data-href=\"new-year\"><span class=\"gdi\" aria-hidden=\"true\">🎄</span><span class=\"gdx\"><b data-i=\"gd0\"></b><small data-i=\"gd0t\"></small></span><svg class=\"gda\"><use href=\"#i-arrow\"/></svg></a><a class=\"gdc gdc1\" data-href=\"charter\"><span class=\"gdi\" aria-hidden=\"true\">🚌</span><span class=\"gdx\"><b data-i=\"gd1\"></b><small data-i=\"gd1t\"></small></span><svg class=\"gda\"><use href=\"#i-arrow\"/></svg></a><a class=\"gdc gdc2\" data-href=\"lars\"><span class=\"gdi\" aria-hidden=\"true\">🛂</span><span class=\"gdx\"><b data-i=\"gd2\"></b><small data-i=\"gd2t\"></small></span><svg class=\"gda\"><use href=\"#i-arrow\"/></svg></a><a class=\"gdc gdc3\" data-href=\"parcel-guide\"><span class=\"gdi\" aria-hidden=\"true\">📦</span><span class=\"gdx\"><b data-i=\"gd3\"></b><small data-i=\"gd3t\"></small></span><svg class=\"gda\"><use href=\"#i-arrow\"/></svg></a></div></div>";
const routesNav = (l, LB) => `<nav class="w ft-routes" aria-label="Routes">${CITY.map(c => `<a href="${LB}bus/${c.slug}/">${esc(RT[l](c).h1)}</a>`).join("")}${CITYR.map(c => `<a href="${LB}bus/${c.slug}/">${esc(RTR[l](c).h1)}</a>`).join("")}<a href="${LB}travel-guide/">${esc(TX[l].tgN)}</a><a href="${LB}new-year/">${esc(TX[l].nyN)}</a><a href="${LB}charter/">${esc(TX[l].cpH)}</a><a href="${LB}lars/">${esc(TX[l].laN)}</a><a href="${LB}how-to-get/">${esc(TX[l].hgN)}</a><a href="${LB}parcel-guide/">${esc(TX[l].pgN)}</a><a href="${esc(STOPSMAP)}" target="_blank" rel="noopener">${esc(TX[l].smN)}</a></nav>`;

async function page(l, id, city) {
  const K = TX[l], home = id === "home";
  const p = city ? { title: RTX(city)[l](city).title, desc: RTX(city)[l](city).desc } : meta(id, l);
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
    .replace("{{ROUTE}}", city ? (city.rev ? routeHtmlR : routeHtml)(city, l, LB) + "<div class=\"w\">{{GUIDES}}</div>" : "")
    .replaceAll("{{GUIDES}}", GUIDES)
    .replace("{{HOMESEO}}", home ? homeSeo(l, LB) : "")
    .replaceAll("{{STOPSMAP}}", esc(STOPSMAP));
  if (!city && p.og) html = html.replace("images/og.jpg?v=3", p.og);
  if (l !== "ka") html = html.replaceAll("images/og.jpg?v=3", "images/og-" + l + ".jpg?v=1"); // ru/en გვერდებს — საკუთარი ენის OG სურათი
  html = slim(html, city ? "route" : home ? "home" : id);
  if (/\{\{[A-Z]+\}\}/.test(html)) throw new Error("unfilled placeholder in " + l + "/" + pth);
  const ALT = { ka: ["იმერეთი ტურის ავტობუსი საქართველო — მოსკოვი", "იმერეთი ტურის ავტობუსის სალონი"], ru: ["Автобус Москва — Грузия «Имерети Тур»", "Салон автобуса Москва — Грузия «Имерети Тур»"], en: ["Imereti Tour Georgia — Moscow bus", "Inside the Imereti Tour Georgia — Moscow bus"] }[l];
  html = html.replaceAll('alt="Imereti Tour — ავტობუსი / автобус"', `alt="${ALT[0]}"`).replaceAll('alt="Imereti Tour — სალონი / салон"', `alt="${ALT[1]}"`);
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
    const t = RTX(city)[l](city), g = JSON.parse(ld.replace(/^<script[^>]*>|<\/script>$/g, ""));
    g["@graph"] = g["@graph"].filter(x => x["@type"] !== "BreadcrumbList" && x["@type"] !== "FAQPage").map(x => x["@type"] === "WebPage" ? { ...x, "@id": U + "#page", url: U } : x);
    g["@graph"].push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: K.nv0, item: SITE + lp(l) }, { "@type": "ListItem", position: 2, name: t.h1, item: U }] });
    g["@graph"].push({ "@type": "FAQPage", mainEntity: faqOf(city, l, t).map(q => ({ "@type": "Question", name: q[0], acceptedAnswer: { "@type": "Answer", text: q[1] } })) });
    const MSK = { "@type": "BusStop", name: city.rev ? t.start : t.end, address: "МКАД 33 км, владение 6, стр. 5, Москва", geo: { "@type": "GeoCoordinates", latitude: 55.578679, longitude: 37.588061 } }, GEO = { "@type": "BusStop", name: city.n[l] };
    const pr = city.rev ? CFG.price.ru : CFG.price.ge;
    g["@graph"].push({ "@type": "BusTrip", name: t.h1, provider: { "@id": SITE + "#org" }, departureBusStop: city.rev ? MSK : GEO, arrivalBusStop: city.rev ? GEO : MSK, ...(pr > 0 ? { offers: { "@type": "Offer", price: pr, priceCurrency: "GEL", url: U } } : {}) });
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
  for (const c of CITY.concat(CITYR)) ALL.push([await page(l, null, c), "0.9", "bus/" + c.slug + "/"]);
}
console.log("✓", ALL.length, "pages");

// sitemap.xml (ყველა ენა, თარგმანების კავშირით)
const day = new Date().toISOString().slice(0, 10);
await writeFile(join(ROOT, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  ALL.map(([u, pr, pth]) => `  <url><loc>${u}</loc><lastmod>${day}</lastmod><priority>${pr}</priority>` + LANGS.map(x => `<xhtml:link rel="alternate" hreflang="${x}" href="${SITE + lp(x) + pth}"/>`).join("") + "</url>").join("\n") + "\n</urlset>\n");
console.log("✓ sitemap.xml (" + ALL.length + " URLs)");
