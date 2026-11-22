// main.ts — entry program for the bring-the-humans-03 TikTok ad.
//
// The grader runs this program and expects the entry's VIDEO.json to
// land in the output directory. This file does that one small job: it
// reads the VIDEO.json sitting next to it in the repo root and writes
// an identical copy into the output folder.
//
// The output folder comes from MAKEFUN_OUTPUT_DIR, or /output when
// that variable is not set. The folder is created when it is missing.
// The program never removes or moves the output folder itself: on the
// grader /output is a mounted volume, and deleting a mount point
// fails the run with a device-busy error.
//
// Before copying, the file is read and checked: it must parse as JSON
// and carry a non-empty "url" string. A malformed entry fails loudly
// here instead of shipping a broken file to the grader. The copy
// itself is the original text, byte for byte — never re-serialized.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Folder holding this script — VIDEO.json lives right beside it.
const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "VIDEO.json");

// Read the entry file and validate its shape before doing anything.
const text = readFileSync(source, "utf8");
const parsed: unknown = JSON.parse(text);
if (
  typeof parsed !== "object" ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== "string" ||
  ((parsed as { url: string }).url.length === 0)
) {
  throw new Error("VIDEO.json must be an object with a non-empty url string");
}

// Where the copy goes: the environment wins, /output is the fallback.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Make sure the destination exists (recursive: parents included).
mkdirSync(outDir, { recursive: true });

// Write the original text across, same name, same bytes.
writeFileSync(join(outDir, "VIDEO.json"), text);

// One line of confirmation, naming the destination.
console.log(`VIDEO.json written to ${outDir}`);
