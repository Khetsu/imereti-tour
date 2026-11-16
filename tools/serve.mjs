/* ლოკალური სერვერი შესამოწმებლად: node tools/serve.mjs → http://localhost:8137 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const T = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain" };
createServer(async (q, s) => {
  let p = join(ROOT, decodeURIComponent(new URL(q.url, "http://x").pathname));
  try { if ((await stat(p)).isDirectory()) p = join(p, "index.html"); const b = await readFile(p); s.writeHead(200, { "content-type": T[extname(p)] || "application/octet-stream" }); s.end(b); }
  catch { s.writeHead(404); s.end("404"); }
}).listen(+process.env.PORT || 8137, () => console.log("http://localhost:" + (+process.env.PORT || 8137)));
