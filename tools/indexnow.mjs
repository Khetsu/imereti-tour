/* IndexNow: Bing-ს, Yandex-ს და სხვა საძიებოებს ატყობინებს საიტის ყველა გვერდს (sitemap.xml-დან).
   გაშვება: node tools/indexnow.mjs   (საიტის ატვირთვის შემდეგ) */
import { readFileSync } from "node:fs";
const KEY = "3f4a74eef743b77cc50170aff5d4ce9b";
const urls = [...readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
urls.push("https://www.imeretitour.com/llms.txt");
for (const host of ["https://api.indexnow.org/indexnow", "https://yandex.com/indexnow", "https://www.bing.com/indexnow"]) {
  const r = await fetch(host, { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: "www.imeretitour.com", key: KEY, keyLocation: `https://www.imeretitour.com/${KEY}.txt`, urlList: urls }) });
  console.log(host, r.status, (await r.text()).slice(0, 200));
}
console.log(urls.length, "URLs");
