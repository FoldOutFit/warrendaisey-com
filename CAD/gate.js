const STORAGE_KEY = window.__CAD_UNLOCK_KEY || "wd-cad-gallery-unlock";
const PASSWORD_HASH = window.__CAD_UNLOCK_HASH || "f592a73de0e9b32647b6b7868617697bddffde412ef09d512d2d799fe075d6ff";

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function isUnlocked() {
  try {
    return localStorage.getItem(STORAGE_KEY) === PASSWORD_HASH;
  } catch {
    return false;
  }
}

function persistUnlock() {
  try {
    localStorage.setItem(STORAGE_KEY, PASSWORD_HASH);
  } catch {
    // Private mode can block storage; the session can still proceed unlocked.
  }
}

function showError() {
  const error = document.getElementById("gate-error");
  const input = document.getElementById("gate-password");
  if (error) error.hidden = false;
  if (input) {
    input.setAttribute("aria-invalid", "true");
    input.focus();
    input.select();
  }
}

function clearError() {
  const error = document.getElementById("gate-error");
  const input = document.getElementById("gate-password");
  if (error) error.hidden = true;
  if (input) input.removeAttribute("aria-invalid");
}

let started = false;

async function revealAndLoad() {
  if (started) return;
  started = true;
  document.documentElement.classList.add("cad-unlocked");
  document.getElementById("gate")?.setAttribute("hidden", "");
  document.getElementById("gallery-content")?.removeAttribute("hidden");
  const { init } = await import("./gallery.js");
  init();
}

async function onSubmit(event) {
  event.preventDefault();
  const input = document.getElementById("gate-password");
  const guess = (input?.value || "").trim();
  if (!guess) {
    showError();
    return;
  }
  const hash = await sha256Hex(guess);
  if (hash === PASSWORD_HASH) {
    clearError();
    persistUnlock();
    await revealAndLoad();
    return;
  }
  showError();
}

if (isUnlocked()) {
  revealAndLoad();
} else {
  document.getElementById("gate-form")?.addEventListener("submit", onSubmit);
  document.getElementById("gate-password")?.focus();
}
