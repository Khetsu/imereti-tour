/* =====================================================================
   იმერეთი ტური · გვერდების აწყობა: node tools/build.mjs
   src/template.html + src/pages.json → index.html, buses/, schedule/, parcels/, info/, faq/
   ტექსტის ან დიზაინის შეცვლისას ცვლი src/template.html-ს და უშვებ ამ ბრძანებას.
   (index.html-ებს ხელით ნუ ცვლი — შემდეგ აწყობაზე გადაიწერება.)
   ===================================================================== */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://imereti-tour.pages.dev/";
const tpl = await readFile(join(ROOT, "src/template.html"), "utf8");
const pages = JSON.parse(await readFile(join(ROOT, "src/pages.json"), "utf8"));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

for (const [id, p] of Object.entries(pages)) {
  const home = id === "home", B = home ? "" : "../";
  const html = tpl
    .replace(/<!-- იმერეთი ტური · შაბლონი[\s\S]*?-->\n/, "<!-- იმერეთი ტური · ეს ფაილი იქმნება src/template.html-დან (node tools/build.mjs). ხელით ნუ შეცვლი. -->\n")
    .replaceAll("{{B}}", B)
    .replaceAll("{{PAGE}}", home ? "" : id)
    .replaceAll("{{TITLE}}", esc(p.title))
    .replaceAll("{{DESC}}", esc(p.desc))
    .replaceAll("{{OGTITLE}}", esc(p.ogTitle || p.title))
    .replaceAll("{{OGDESC}}", esc(p.ogDesc || p.desc))
    .replaceAll("{{URL}}", SITE + (home ? "" : id + "/"));
  if (/\{\{[A-Z]+\}\}/.test(html)) throw new Error("unfilled placeholder in " + id);
  const out = home ? join(ROOT, "index.html") : join(ROOT, id, "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
  console.log("✓", home ? "index.html" : id + "/index.html");
}
