/* Client-side retrieval for the Darryl biography. No network model, no invented facts. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DarrylGuide = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var STOP = {
    a: 1, an: 1, the: 1, of: 1, and: 1, or: 1, to: 1, in: 1, on: 1, for: 1, with: 1,
    his: 1, her: 1, their: 1, he: 1, she: 1, they: 1, was: 1, were: 1, is: 1, are: 1,
    be: 1, been: 1, from: 1, by: 1, at: 1, as: 1, that: 1, this: 1, it: 1, its: 1,
    who: 1, what: 1, when: 1, where: 1, why: 1, how: 1, did: 1, does: 1, do: 1,
    about: 1, into: 1, than: 1, then: 1, there: 1, which: 1, have: 1, has: 1, had: 1,
    not: 1, but: 1, if: 1, so: 1, too: 1, very: 1, can: 1, could: 1, would: 1,
    should: 1, please: 1, tell: 1, me: 1, i: 1, you: 1, your: 1, our: 1, we: 1,
    my: 1, any: 1, some: 1, just: 1, also: 1, been: 1, being: 1, over: 1, after: 1,
    before: 1, out: 1, up: 1, down: 1, them: 1, him: 1, darryl: 1, daisey: 1, b: 1,
    now: 1, today: 1, current: 1, currently: 1, still: 1, happened: 1, happen: 1
  };

  function fold(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  var IRREG = {
    studied: "study", study: "study", studying: "study",
    graduated: "graduate", graduate: "graduate", graduates: "graduate", graduation: "graduate"
  };
  function stem(t) {
    if (IRREG[t]) return IRREG[t];
    if (t.length > 5 && t.endsWith("ies")) t = t.slice(0, -3) + "y";
    else if (t.length > 5 && t.endsWith("ing")) t = t.slice(0, -3);
    else if (t.length > 5 && t.endsWith("ed")) t = t.slice(0, -2);
    else if (t.length > 4 && t.endsWith("es")) t = t.slice(0, -2);
    else if (t.length > 4 && t.endsWith("s") && !t.endsWith("ss")) t = t.slice(0, -1);
    return t;
  }

  function close(a, b) {
    if (a === b) return true;
    if (!a || !b || a.length < 4 || b.length < 4) return false;
    var longer = a.length >= b.length ? a : b;
    var shorter = a.length >= b.length ? b : a;
    if (longer.indexOf(shorter) !== 0) return false;
    var extra = longer.slice(shorter.length);
    return extra === "e" || extra === "s" || extra === "es" || extra === "ed" || extra === "d" || extra === "ing" || extra === "ion";
  }

  function tokens(s) {
    var raw = fold(s).split(" ").filter(Boolean);
    var out = [];
    raw.forEach(function (t) {
      var x = stem(t);
      if (x.length > 1) out.push(x);
    });
    return out;
  }

  function contentTerms(q) {
    return tokens(q).filter(function (t) { return !STOP[t]; });
  }

  function expand(terms) {
    var extra = [];
    function has() {
      for (var i = 0; i < arguments.length; i++) if (terms.indexOf(arguments[i]) !== -1) return true;
      return false;
    }
    if (has("college", "university")) extra.push("penn", "state", "university");
    if (has("major", "degree", "studied", "study", "graduate", "graduated")) extra.push("logistic", "business");
    if (has("twin")) extra.push("darnell");
    if (has("wife", "spouse", "married")) extra.push("sari");
    if (has("santa", "christmas", "nutcracker")) extra.push("santa", "ornament", "holiday");
    if (has("swim", "swimming")) extra.push("swim", "mandatory");
    if (has("born", "birthday", "birth")) extra.push("1961", "born");
    if (has("chronicle", "chronicles")) extra.push("african", "american", "timeline", "blackhistory");
    if (has("father", "dad", "parent", "parents", "mother", "mom")) extra.push("william", "shirley");
    if (has("job", "career", "work", "employer")) extra.push("constellation", "exelon", "sourcing", "logistic");
    if (has("chair", "commission", "heritage")) extra.push("lewes", "heritage", "commission");
    var all = terms.slice();
    extra.forEach(function (t) { if (all.indexOf(t) === -1) all.push(stem(t)); });
    return all;
  }

  function termIn(doc, term) {
    return !!(doc.tf && doc.tf[term]);
  }

  function prepare(chunks) {
    var docs = chunks.map(function (c) {
      return {
        id: c.id,
        chapter: c.chapter,
        text: c.text,
        sources: c.sources || [],
        tokens: tokens(c.text)
      };
    });
    var df = {};
    docs.forEach(function (d) {
      var seen = {};
      d.tokens.forEach(function (t) {
        if (!seen[t]) { df[t] = (df[t] || 0) + 1; seen[t] = 1; }
      });
    });
    var n = docs.length || 1;
    var avg = docs.reduce(function (s, d) { return s + d.tokens.length; }, 0) / n;
    docs.forEach(function (d) {
      var tf = {};
      d.tokens.forEach(function (t) { tf[t] = (tf[t] || 0) + 1; });
      d.tf = tf;
      d.norm = fold(d.text);
      d.photo = /^photograph\b/.test(d.norm);
    });
    return { docs: docs, df: df, n: n, avg: avg || 1 };
  }

  function bm25(index, terms) {
    var k1 = 1.4, b = 0.72;
    return index.docs.map(function (d) {
      var score = 0;
      terms.forEach(function (t) {
        var f = d.tf[t] || 0;
        if (!f) {
          var keys = Object.keys(d.tf);
          for (var i = 0; i < keys.length; i++) {
            if (close(keys[i], t)) { f = d.tf[keys[i]]; break; }
          }
        }
        if (!f) return;
        var dfn = index.df[t] || 0;
        var idf = Math.log(1 + (index.n - dfn + 0.5) / (dfn + 0.5));
        score += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * d.tokens.length / index.avg));
      });
      return { doc: d, score: score };
    }).sort(function (a, b) { return b.score - a.score; });
  }

  function sentences(text) {
    var protectedText = String(text)
      .replace(/\b(Mr|Mrs|Ms|Dr|Sr|Jr|St|Gen|Rev|U\.S)\./g, function (m) { return m.slice(0, -1) + "\u0001"; })
      .replace(/\b([A-Z])\./g, function (m) { return m.slice(0, -1) + "\u0001"; });
    var parts = protectedText.split(/(?<=[.!?])\s+(?=[A-Z“"\(])/);
    return parts.map(function (s) {
      return s.replace(/\u0001/g, ".").trim();
    }).filter(function (s) { return s.length > 30; });
  }

  function matchedTerms(doc, terms) {
    return terms.filter(function (t) {
      if (termIn(doc, t)) return true;
      var keys = Object.keys(doc.tf);
      for (var i = 0; i < keys.length; i++) if (close(keys[i], t)) return true;
      return false;
    });
  }

  function pickSentences(text, terms) {
    var sents = sentences(text);
    if (!sents.length) return text.slice(0, 420);
    var ranked = sents.map(function (s, i) {
      var bag = {};
      tokens(s).forEach(function (t) { bag[t] = 1; });
      var n = terms.filter(function (t) { return bag[t]; }).length;
      return { s: s, i: i, n: n };
    }).filter(function (x) { return x.n > 0; });
    ranked.sort(function (a, b) { return b.n - a.n || a.i - b.i; });
    var take = ranked.slice(0, 3);
    if (!take.length) return "";
    var keep = {};
    take.forEach(function (t) { keep[t.i] = 1; });
    return sents.filter(function (s, i) { return keep[i]; }).join(" ");
  }

  function create(payload) {
    var index = prepare((payload && payload.chunks) || []);
    function answer(question) {
      var q = String(question || "").trim();
      if (!q) return { known: false, text: "Ask a question about Darryl and I will look through the biography." };
      if (/\b(e-?mail|phone|address|street address)\b/i.test(q)) {
        return { known: false, text: "I don’t have a phone number, email, or street address in the biography, and this page doesn’t publish them." };
      }
      if (/^(hi|hello|hey|thanks|thank you)\b/i.test(q) && contentTerms(q).length === 0) {
        return { known: false, greeting: true, text: "Hello. I can answer from Darryl B. Daisey’s biography — his family, Penn State years, the African American Chronicles, his Lewes history work, and the Black Santa collection. If the biography does not cover a question, I will say so." };
      }
      var folded = fold(q);
      if (/^(who is|who was|tell me about|about|introduce)\s+(darryl|him)\b/.test(folded) || folded === "darryl" || folded === "darryl daisey" || folded === "darryl b daisey") {
        var intro = index.docs.filter(function (d) { return d.id === "c1"; })[0];
        if (intro) return { known: true, text: intro.text, chapter: intro.chapter, sources: intro.sources, id: intro.id };
      }
      var original = contentTerms(q);
      if (!original.length) {
        return { known: false, text: "I need a little more to search the biography. Try asking about a person, a year, or a chapter of his life." };
      }
      var terms = expand(original);
      var ranked = bm25(index, terms).map(function (row) {
        var hit = matchedTerms(row.doc, original);
        var score = row.score + hit.length * 2.2;
        if (row.doc.chapter === "Overview" && original.length >= 2 && hit.length >= original.length) score += 7;
        if (original.indexOf("many") !== -1 && /\b100\b/.test(row.doc.text)) score += 5;
        if (row.doc.photo) score *= 0.15;
        var glued = (row.doc.text.match(/[a-z][A-Z]|\d[A-Z]/g) || []).length;
        if (glued >= 3) score *= 0.4;
        return { doc: row.doc, score: score, hit: hit };
      }).sort(function (a, b) { return b.score - a.score; });
      var need = original.length <= 2 ? original.length : Math.max(2, Math.ceil(original.length * 0.6));
      if (original.length === 1) need = 1;
      function usable(row) { return row.score >= 1.15 && row.hit.length >= need; }
      var prose = ranked.filter(function (row) { return !row.doc.photo && usable(row); });
      var photos = ranked.filter(function (row) { return row.doc.photo && usable(row); });
      var top = prose[0] || photos[0];
      if (!top) {
        return {
          known: false,
          text: "I don’t have that in the biography, so I won’t guess. I can answer from the chapters on this page — family, Penn State, his supply-chain career, the African American Chronicles, Lewes history, and the Black Santa collection."
        };
      }
      var yesNo = /^(did|does|do|is|was|were|has|have|can)\b/i.test(q);
      var extracted = top.doc.text.length < 720 && !yesNo ? top.doc.text : pickSentences(top.doc.text, terms);
      if (yesNo) {
        var bits = sentences(extracted || "");
        var grounded = bits.some(function (s) {
          if (!/\bdarryl\b/i.test(s)) return false;
          var bag = {};
          tokens(s).forEach(function (t) { bag[t] = 1; });
          return original.some(function (t) {
            if (bag[t]) return true;
            var keys = Object.keys(bag);
            for (var i = 0; i < keys.length; i++) if (close(keys[i], t)) return true;
            return false;
          });
        });
        if (!grounded) {
          return {
            known: false,
            text: "I don’t have that in the biography, so I won’t guess. I can answer from the chapters on this page — family, Penn State, his supply-chain career, the African American Chronicles, Lewes history, and the Black Santa collection."
          };
        }
      }
      if (extracted && extracted.length > 720) extracted = extracted.slice(0, 700).replace(/\s+\S*$/, "") + "…";
      if (!extracted || extracted.length < 40) {
        return {
          known: false,
          text: "I don’t have that in the biography, so I won’t guess. I can answer from the chapters on this page — family, Penn State, his supply-chain career, the African American Chronicles, Lewes history, and the Black Santa collection."
        };
      }
      if (extracted.length > 700) extracted = extracted.slice(0, 680).replace(/\s+\S*$/, "") + "…";
      return {
        known: true,
        text: extracted,
        chapter: top.doc.chapter,
        sources: top.doc.sources || [],
        id: top.doc.id
      };
    }
    function debug(question) {
      var original = contentTerms(question);
      var terms = expand(original);
      var ranked = bm25(index, terms).map(function (row) {
        var hit = matchedTerms(row.doc, original);
        var score = row.score + hit.length * 2.2;
        return { id: row.doc.id, chapter: row.doc.chapter, photo: row.doc.photo, score: score, hit: hit, bm25: row.score };
      }).sort(function (a, b) { return b.score - a.score; });
      return { original: original, terms: terms, top: ranked.slice(0, 6) };
    }
    return { answer: answer, debug: debug };
  }

  function nyYMD(date) {
    var fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    return fmt.format(date);
  }

  function factIndex(date, count) {
    var ymd = nyYMD(date);
    var bits = ymd.split("-").map(function (n) { return parseInt(n, 10); });
    var days = Math.floor(Date.UTC(bits[0], bits[1] - 1, bits[2]) / 86400000);
    if (!count) return 0;
    return ((days % count) + count) % count;
  }

  function factForDate(facts, date) {
    if (!facts || !facts.length) return null;
    var i = factIndex(date || new Date(), facts.length);
    return { index: i, ymd: nyYMD(date || new Date()), fact: facts[i] };
  }

  return { create: create, factForDate: factForDate, factIndex: factIndex, nyYMD: nyYMD };
});
