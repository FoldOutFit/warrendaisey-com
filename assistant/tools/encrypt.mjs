#!/usr/bin/env node
/**
 * Encrypt or decrypt a daily assistant briefing.
 *
 * The passphrase comes only from ASSISTANT_PASSPHRASE. It is never read from
 * argv, and this script never writes the passphrase or, on success, the
 * plaintext to the terminal unless you ask decrypt to print it.
 *
 *   ASSISTANT_PASSPHRASE='…' node assistant/tools/encrypt.mjs check briefing.json
 *   ASSISTANT_PASSPHRASE='…' node assistant/tools/encrypt.mjs encrypt briefing.json assistant/data.enc.json
 *   ASSISTANT_PASSPHRASE='…' node assistant/tools/encrypt.mjs decrypt assistant/data.enc.json /tmp/briefing.json
 *   ASSISTANT_PASSPHRASE='…' node assistant/tools/encrypt.mjs verify assistant/data.enc.json
 *
 * Do not commit the plaintext. assistant/.gitignore patterns live in the repo
 * root .gitignore. The demo passphrase "demo" is only for assistant/sample.json.
 */

import { readFile, writeFile } from "node:fs/promises";
import { stderr, stdout, argv, exit, env } from "node:process";

const ITERATIONS = 600000;
const MIN_ITERATIONS = 100000;
const MAX_ITERATIONS = 2000000;
const ACTIONS = ["done", "snooze", "copy", "open", "note"];

function die(message, code) {
  stderr.write(message.replace(/\n?$/, "\n"));
  exit(code || 1);
}

function b64(bytes) {
  return Buffer.from(bytes).toString("base64");
}

function fromB64(value) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("incomplete");
  }
  return new Uint8Array(Buffer.from(value, "base64"));
}

function isHttpUrl(value) {
  if (typeof value !== "string" || !value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch (err) {
    return false;
  }
}

function schemaErrors(data) {
  const errors = [];
  const warnings = [];
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { errors: ["briefing must be a JSON object"], warnings };
  }
  if (typeof data.generated_at !== "string" || !data.generated_at.trim()) {
    errors.push("generated_at must be an ISO-8601 string");
  }
  if (typeof data.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.push("date must be YYYY-MM-DD");
  }
  if (!data.config || typeof data.config !== "object" || Array.isArray(data.config)) {
    errors.push("config must be an object");
  } else {
    if (!isHttpUrl(data.config.action_webhook_url)) {
      errors.push("config.action_webhook_url must be an http(s) URL");
    }
    if (typeof data.config.action_webhook_key !== "string" || !data.config.action_webhook_key) {
      errors.push("config.action_webhook_key must be a non-empty string");
    }
    if (data.config.action_webhook_header !== undefined) {
      if (typeof data.config.action_webhook_header !== "string" ||
          !/^[A-Za-z0-9-]{1,64}$/.test(data.config.action_webhook_header)) {
        errors.push("config.action_webhook_header must be a short token such as X-Assistant-Key");
      }
    }
  }
  if (!Array.isArray(data.tasks)) errors.push("tasks must be an array");
  else checkTasks(data.tasks, errors, warnings);
  if (!Array.isArray(data.emails)) errors.push("emails must be an array");
  else checkEmails(data.emails, errors, warnings);
  return { errors, warnings };
}

function checkTasks(tasks, errors, warnings) {
  const seen = Object.create(null);
  tasks.forEach(function (task, index) {
    const path = "tasks[" + index + "]";
    if (!task || typeof task !== "object" || Array.isArray(task)) {
      errors.push(path + " must be an object");
      return;
    }
    needString(task, "id", path, errors, false);
    needString(task, "title", path, errors, false);
    if (task.id && seen[task.id]) errors.push(path + ".id is duplicated");
    if (task.id) seen[task.id] = true;
    if (task.priority !== undefined && task.priority !== "high" && task.priority !== "medium" && task.priority !== "low") {
      errors.push(path + ".priority must be high, medium, or low");
    }
    if (task.due !== undefined && task.due !== null && typeof task.due !== "string") {
      errors.push(path + ".due must be a string or null");
    }
    if (task.links !== undefined && !Array.isArray(task.links)) errors.push(path + ".links must be an array");
    if (Array.isArray(task.links)) {
      task.links.forEach(function (link, linkIndex) {
        const linkPath = path + ".links[" + linkIndex + "]";
        if (!link || typeof link.label !== "string" || !link.label.trim()) errors.push(linkPath + ".label must be a string");
        if (!isHttpUrl(link && link.url)) errors.push(linkPath + ".url must be an http(s) URL");
      });
    }
    if (task.actions !== undefined && !Array.isArray(task.actions)) errors.push(path + ".actions must be an array");
    if (Array.isArray(task.actions)) {
      task.actions.forEach(function (action) {
        if (ACTIONS.indexOf(action) === -1) errors.push(path + ".actions has unknown value " + JSON.stringify(action));
      });
    }
    if (typeof task.proposed_solution !== "string" || !task.proposed_solution.trim()) {
      warnings.push(path + ".proposed_solution is empty");
    }
  });
}

function checkEmails(emails, errors, warnings) {
  const seen = Object.create(null);
  emails.forEach(function (email, index) {
    const path = "emails[" + index + "]";
    if (!email || typeof email !== "object" || Array.isArray(email)) {
      errors.push(path + " must be an object");
      return;
    }
    needString(email, "id", path, errors, false);
    if (email.id && seen[email.id]) errors.push(path + ".id is duplicated");
    if (email.id) seen[email.id] = true;
    needString(email, "draft_to", path, errors, false);
    needString(email, "draft_subject", path, errors, false);
    needString(email, "draft_body", path, errors, true);
    if (email.draft_cc !== undefined && typeof email.draft_cc !== "string") errors.push(path + ".draft_cc must be a string");
    if (typeof email.gmail_url !== "string" || !email.gmail_url) warnings.push(path + ".gmail_url is missing");
    else if (!isHttpUrl(email.gmail_url)) errors.push(path + ".gmail_url must be an http(s) URL");
    if (typeof email.from_email !== "string" || !email.from_email.trim()) warnings.push(path + ".from_email is empty");
    if (typeof email.why_it_needs_reply !== "string" || !email.why_it_needs_reply.trim()) {
      warnings.push(path + ".why_it_needs_reply is empty");
    }
  });
}

function needString(obj, key, path, errors, allowEmpty) {
  if (typeof obj[key] !== "string" || (!allowEmpty && !obj[key].trim())) {
    errors.push(path + "." + key + " must be " + (allowEmpty ? "a string" : "a non-empty string"));
  }
}

async function readJson(path) {
  let raw;
  try {
    raw = await readFile(path, "utf8");
  } catch (err) {
    die("Could not read " + path + ": " + err.message);
  }
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  try {
    return JSON.parse(raw);
  } catch (err) {
    die(path + " is not valid JSON: " + err.message, 2);
  }
}

function reportSchema(data) {
  const result = schemaErrors(data);
  result.warnings.forEach(function (warning) { stderr.write("warn " + warning + "\n"); });
  if (result.errors.length) {
    result.errors.forEach(function (error) { stderr.write("error " + error + "\n"); });
    exit(2);
  }
  return result;
}

async function deriveKey(passphrase, salt, iterations, usages) {
  const base = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    usages
  );
}

function passphrase() {
  const value = env.ASSISTANT_PASSPHRASE;
  if (!value) die("Set ASSISTANT_PASSPHRASE in the environment. Do not pass it as an argument.");
  if (value.length < 10 && value !== "demo") {
    stderr.write("warn passphrase is shorter than 10 characters\n");
  }
  return value;
}

function defaultEncPath(input) {
  if (input.endsWith(".json")) return input.slice(0, -5) + ".enc.json";
  return input + ".enc.json";
}

async function encrypt(input, output) {
  const data = await readJson(input);
  reportSchema(data);
  const outPath = output || defaultEncPath(input);
  if (outPath === input) die("Refusing to overwrite the plaintext with ciphertext.");
  const secret = passphrase();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(secret, salt, ITERATIONS, ["encrypt"]);
  const plain = new TextEncoder().encode(JSON.stringify(data));
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plain));
  const envelope = {
    v: 1,
    alg: "AES-GCM",
    kdf: "PBKDF2-SHA256",
    iterations: ITERATIONS,
    salt: b64(salt),
    iv: b64(iv),
    ciphertext: b64(cipher)
  };
  await writeFile(outPath, JSON.stringify(envelope, null, 2) + "\n", { mode: 0o644 });
  const tasks = data.tasks.length;
  const emails = data.emails.length;
  stderr.write("wrote " + outPath + " (" + tasks + " tasks, " + emails + " emails, date " + data.date + ")\n");
}

function checkEnvelope(file) {
  if (!file || file.v !== 1 || file.alg !== "AES-GCM" || file.kdf !== "PBKDF2-SHA256") {
    die("Unsupported encrypted briefing.");
  }
  if (typeof file.iterations !== "number" || file.iterations < MIN_ITERATIONS || file.iterations > MAX_ITERATIONS) {
    die("Unsupported PBKDF2 iteration count.");
  }
  if (typeof file.salt !== "string" || typeof file.iv !== "string" || typeof file.ciphertext !== "string") {
    die("Encrypted briefing is missing salt, iv, or ciphertext.");
  }
}

async function openEncrypted(path) {
  const file = await readJson(path);
  checkEnvelope(file);
  const secret = passphrase();
  let plain;
  try {
    const key = await deriveKey(secret, fromB64(file.salt), file.iterations, ["decrypt"]);
    const buf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromB64(file.iv) },
      key,
      fromB64(file.ciphertext)
    );
    plain = JSON.parse(new TextDecoder().decode(buf));
  } catch (err) {
    die("Could not decrypt. Check ASSISTANT_PASSPHRASE and that the file was not edited.");
  }
  return plain;
}

async function decrypt(input, output) {
  const data = await openEncrypted(input);
  const pretty = JSON.stringify(data, null, 2) + "\n";
  if (!output || output === "-") {
    stderr.write("plaintext on stdout\n");
    stdout.write(pretty);
    return;
  }
  if (output.endsWith(".enc.json")) die("Refusing to write plaintext to an .enc.json path.");
  await writeFile(output, pretty, { mode: 0o600 });
  stderr.write("wrote " + output + "\n");
}

async function verify(input) {
  const data = await openEncrypted(input);
  reportSchema(data);
  stdout.write("ok date=" + data.date + " tasks=" + data.tasks.length + " emails=" + data.emails.length + "\n");
}

async function check(input) {
  const data = await readJson(input);
  reportSchema(data);
  stdout.write("ok date=" + data.date + " tasks=" + data.tasks.length + " emails=" + data.emails.length + "\n");
}

function usage() {
  die(
    "Usage:\n" +
    "  node assistant/tools/encrypt.mjs check <plain.json>\n" +
    "  ASSISTANT_PASSPHRASE=… node assistant/tools/encrypt.mjs encrypt <plain.json> [out.enc.json]\n" +
    "  ASSISTANT_PASSPHRASE=… node assistant/tools/encrypt.mjs decrypt <file.enc.json> [out.json|-]\n" +
    "  ASSISTANT_PASSPHRASE=… node assistant/tools/encrypt.mjs verify <file.enc.json>\n" +
    "The passphrase is read only from ASSISTANT_PASSPHRASE."
  );
}

const command = argv[2];
const input = argv[3];
const output = argv[4];
if (!command || command === "--help" || command === "-h") usage();
if (!input) usage();

if (command === "check") await check(input);
else if (command === "encrypt") await encrypt(input, output);
else if (command === "decrypt") await decrypt(input, output);
else if (command === "verify") await verify(input);
else usage();
