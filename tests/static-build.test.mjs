import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

test("builds a static phonics PWA", async () => {
  const html = await readFile(
    new URL("../dist/index.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /<title>小小自然拼读<\/title>/i);
  assert.match(html, /manifest\.webmanifest/);
  assert.match(html, /assets\/.*\.js/);

  await stat(new URL("../dist/sw.js", import.meta.url));
  await stat(new URL("../dist/og.png", import.meta.url));
  await stat(new URL("../dist/audio/letters/a.mp3", import.meta.url));
  await stat(new URL("../dist/audio/words/apple.mp3", import.meta.url));
});

test("includes all 26 letter lessons and their offline audio", async () => {
  const source = await readFile(
    new URL("../app/page.tsx", import.meta.url),
    "utf8",
  );
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const lessonSource = source.slice(0, source.indexOf("const AVAILABLE_LETTERS"));
  const lessonLetters = [
    ...lessonSource.matchAll(/letter: "([a-z])",\s+uppercase:/g),
  ].map((match) => match[1]);
  const contentWords = [
    ...lessonSource.matchAll(/\{ word: "([^"]+)", zh:/g),
  ].map((match) => match[1]);

  assert.deepEqual(lessonLetters, alphabet);
  assert.equal(contentWords.length, 156);

  await Promise.all(
    alphabet.map((letter) =>
      stat(new URL(`../dist/audio/letters/${letter}.mp3`, import.meta.url)),
    ),
  );
  await Promise.all(
    [...new Set(contentWords)].map((word) =>
      stat(new URL(`../dist/audio/words/${word}.mp3`, import.meta.url)),
    ),
  );
});
