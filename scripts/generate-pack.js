import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const extensionsPath = resolve(root, "public", "extensions", "extensions.json");
const outputPath = resolve(root, "public", "extensions", "pack.json");

const extensions = JSON.parse(readFileSync(extensionsPath, "utf-8"));

const pack = {
  information: {
    name: "dde's Extension Gallery",
    tag: "dde",
  },
  extensions: extensions
    .filter((ext) => !ext.hidden && ext.canBeUsedOn.nb)
    .map((ext) => ({
      slug: `code/${ext.id}`,
      id: ext.id,
      name: ext.name,
      description: ext.description,
      image: `thumbnail/${ext.id}.${ext.imgFormat || "svg"}`,
    })),
};

writeFileSync(outputPath, JSON.stringify(pack, null, 2) + "\n");
console.log(`Generated ${pack.extensions.length} extensions`);
