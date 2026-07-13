import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("ships the requested offline game content without remote data calls", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /109 challenges/);
  assert.match(source, /localStorage/);
  assert.match(source, /serviceWorker/);
  assert.doesNotMatch(source, /https?:\/\//);
});
