import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("ships bilingual game content without remote data calls", async () => {
  const [source, worker] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/OfflineWorker.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(source, /Autocamper Bingo/);
  assert.match(source, /Road Bingo/);
  assert.match(source, /localStorage/);
  assert.match(worker, /serviceWorker/);
  assert.doesNotMatch(source, /https?:\/\//);
});
