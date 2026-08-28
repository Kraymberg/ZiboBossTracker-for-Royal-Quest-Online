import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const KEY = "***REMOVED***";
const PROJECT = "***REMOVED***";
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

async function fetchAll(collection) {
  const out = [];
  let pageToken = "";
  let url = `${BASE}/${collection}?pageSize=300&key=${KEY}`;
  for (;;) {
    const u = pageToken ? `${url}&pageToken=${encodeURIComponent(pageToken)}` : url;
    const res = await fetch(u);
    if (!res.ok) throw new Error(`${collection}: HTTP ${res.status} ${await res.text()}`);
    const data = await res.json();
    for (const doc of data.documents || []) {
      const id = doc.name.split("/").pop();
      const fields = doc.fields || {};
      const rec = { id };
      for (const [k, v] of Object.entries(fields)) {
        if ("stringValue" in v) rec[k] = v.stringValue;
        else if ("integerValue" in v) rec[k] = Number(v.integerValue);
        else if ("booleanValue" in v) rec[k] = v.booleanValue;
        else if ("doubleValue" in v) rec[k] = v.doubleValue;
        else if ("mapValue" in v) {
          rec[k] = {};
          for (const [k2, v2] of Object.entries(v.mapValue.fields || {})) {
            if ("stringValue" in v2) rec[k][k2] = v2.stringValue;
            else if ("booleanValue" in v2) rec[k][k2] = v2.booleanValue;
            else if ("integerValue" in v2) rec[k][k2] = Number(v2.integerValue);
            else rec[k][k2] = v2;
          }
          rec[k]._struct = true;
        } else rec[k] = v;
      }
      if (rec.respawn && rec.respawn._struct) delete rec.respawn._struct;
      out.push(rec);
    }
    const next = data.nextPageToken;
    if (!next) break;
    pageToken = next;
  }
  return out;
}

await mkdir(join(ROOT, "data"), { recursive: true });

const [history, users] = await Promise.all([fetchAll("history"), fetchAll("users")]);

await writeFile(join(ROOT, "data", "history.json"), JSON.stringify(history, null, 2));
await writeFile(join(ROOT, "data", "users.json"), JSON.stringify(users, null, 2));

console.log(`history: ${history.length} docs`);
console.log(`users:   ${users.length} docs`);