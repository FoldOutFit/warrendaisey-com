/* Browser half of assistant/tools/encrypt.mjs. AES-GCM with a key derived
   from the passphrase by PBKDF2-SHA256. The iteration count, salt, and IV
   come from the encrypted file. The passphrase is never written to storage. */
(function (global) {
  var text = new TextEncoder();
  var decoded = new TextDecoder();
  var SESSION_KEY = "wd-assistant-session";

  function fail(code, message) {
    var err = new Error(message);
    err.code = code;
    return err;
  }

  function b64encode(bytes) {
    var bin = "";
    var step = 0x8000;
    for (var i = 0; i < bytes.length; i += step) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + step));
    }
    return btoa(bin);
  }

  function b64decode(value) {
    var clean = String(value || "").replace(/\s/g, "");
    if (!clean || /[^A-Za-z0-9+/=]/.test(clean)) {
      throw fail("format", "This briefing file is incomplete.");
    }
    var bin = atob(clean);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function checkEnvelope(file) {
    if (!file || file.v !== 1 || file.alg !== "AES-GCM" || file.kdf !== "PBKDF2-SHA256") {
      throw fail("format", "This briefing file is not a supported encrypted briefing.");
    }
    if (typeof file.iterations !== "number" || file.iterations < 100000 || file.iterations > 2000000) {
      throw fail("format", "This briefing uses unsupported key settings.");
    }
    if (!file.salt || !file.iv || !file.ciphertext) {
      throw fail("format", "This briefing file is incomplete.");
    }
  }

  function deriveKey(passphrase, salt, iterations) {
    return crypto.subtle.importKey("raw", text.encode(passphrase), "PBKDF2", false, ["deriveKey"]).then(function (base) {
      return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: salt, iterations: iterations, hash: "SHA-256" },
        base,
        { name: "AES-GCM", length: 256 },
        true,
        ["decrypt"]
      );
    });
  }

  function decryptBytes(key, iv, ciphertext) {
    return crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, ciphertext).then(function (buf) {
      var json;
      try {
        json = JSON.parse(decoded.decode(buf));
      } catch (e) {
        throw fail("format", "The briefing decrypted but was not valid JSON.");
      }
      if (!json || typeof json !== "object" || typeof json.date !== "string") {
        throw fail("format", "The briefing is missing a date.");
      }
      return json;
    }, function (err) {
      if (err && err.code) throw err;
      throw fail("passphrase", "That passphrase did not unlock this briefing.");
    });
  }

  function unlock(file, passphrase) {
    checkEnvelope(file);
    if (!passphrase) return Promise.reject(fail("passphrase", "Enter your passphrase."));
    return deriveKey(passphrase, b64decode(file.salt), file.iterations).then(function (key) {
      return decryptBytes(key, b64decode(file.iv), b64decode(file.ciphertext)).then(function (data) {
        return { data: data, key: key };
      });
    });
  }

  function decryptWithRaw(file, rawB64) {
    checkEnvelope(file);
    var raw = b64decode(rawB64);
    return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, true, ["decrypt"]).then(function (key) {
      return decryptBytes(key, b64decode(file.iv), b64decode(file.ciphertext));
    });
  }

  function saveSession(src, file, key) {
    return crypto.subtle.exportKey("raw", key).then(function (buf) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        v: 1,
        src: src,
        salt: file.salt,
        iv: file.iv,
        key: b64encode(new Uint8Array(buf))
      }));
    });
  }

  function readSession(src, file) {
    try {
      var saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
      if (!saved || saved.v !== 1 || saved.src !== src) return null;
      if (saved.salt !== file.salt || saved.iv !== file.iv || !saved.key) return null;
      return saved.key;
    } catch (e) {
      return null;
    }
  }

  function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  global.AssistantCrypto = {
    unlock: unlock,
    decryptWithRaw: decryptWithRaw,
    saveSession: saveSession,
    readSession: readSession,
    clearSession: clearSession
  };
})(window);
