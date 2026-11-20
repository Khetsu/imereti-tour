/* =====================================================================
   იმერეთი ტური · IndexNow: საიტის ყველა გვერდს ატყობინებს Bing-ს და Яндекс-ს.
   გაშვება საიტის ატვირთვის (git push) შემდეგ: node tools/indexnow.mjs
   გასაღები: 067284e4ac370403073a1fcd4f6d4733.txt საიტის ძირში (არ წაშალო).
   ===================================================================== */
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const KEY = "067284e4ac370403073a1fcd4f6d4733", HOST = "www.imeretitour.com";
const sm = await readFile(join(ROOT, "sitemap.xml"), "utf8");
const urlList = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
for (const ep of ["https://api.indexnow.org/indexnow", "https://yandex.com/indexnow"]) {
  const r = await fetch(ep, { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }) });
  console.log(ep, r.status, urlList.length + " URLs");
}
