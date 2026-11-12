import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const from = html.indexOf("  function inferenceMessages(chat){");
const to = html.indexOf("  async function submit(event){", from);
assert.ok(from !== -1 && to > from, "LEAF inference context code must be present");
const context = vm.runInNewContext(html.slice(from, to) + "\ninferenceMessages;");
const user = (content, sample = false) => ({ role: "user", text: content, sample });
const assistant = (content, sample = false) => ({ role: "assistant", text: content, sample });

test("public LEAF cannot connect to private inference", () => {
  assert.match(html, /const REAL_GATEWAY_AVAILABLE = false;/);
  assert.match(html, /const API = "\/api\/noorel\/chat"/);
  assert.match(html, /ephemeralGatewayToken = null/);
  assert.doesNotMatch(html, /sk-[A-Za-z0-9]{20,}/);
});

test("new preview exchanges are excluded from neural context", () => {
  const messages = [user("hello", true), assistant("sample", true), user("actual question")];
  assert.equal(JSON.stringify(context({ messages })), JSON.stringify([{ role: "user", content: "actual question" }]));
});

test("legacy preview exchanges are also excluded", () => {
  const messages = [user("old preview question"), assistant("sample", true), user("new question")];
  assert.equal(JSON.stringify(context({ messages })), JSON.stringify([{ role: "user", content: "new question" }]));
});

test("failed turns do not contaminate a later request", () => {
  const messages = [
    user("previous", true), assistant("gateway unavailable", true),
    user("later"), assistant("real answer"), user("follow up")
  ];
  assert.equal(
    JSON.stringify(context({ messages })),
    JSON.stringify([
      { role: "user", content: "later" },
      { role: "assistant", content: "real answer" },
      { role: "user", content: "follow up" }
    ])
  );
});

test("context window starts and ends with the user within 23 turns", () => {
  const messages = [];
  for (let i = 0; i < 20; i++) {
    messages.push(user("q" + i), assistant("a" + i));
  }
  messages.push(user("final"));
  const result = context({ messages });
  assert.ok(result.length <= 23);
  assert.equal(result[0].role, "user");
  assert.equal(result.at(-1).content, "final");
  result.forEach((m, i) => assert.equal(m.role, i % 2 === 0 ? "user" : "assistant"));
});

test("model content is limited to 4000 characters per message", () => {
  const messages = [user("x".repeat(5000))];
  assert.equal(context({ messages })[0].content.length, 4000);
  assert.match(html, /maxlength="4000"/);
});
