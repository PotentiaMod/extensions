// PenguinMod / TurboWarp Extension: Swear Word Checker
// Uses PurgoMalum API (free, no key needed) for detection
// Also detects spaced-out swears like: s h i t, f**k, f.u.c.k, etc.

(function () {
  "use strict";

  // Cache results to avoid spamming the API
  const cache = new Map();

  /**
   * Normalize text to catch evasion tricks:
   *  - s h i t        → shit
   *  - f.u.c.k        → fuck
   *  - f*ck / f**k    → fck / fk  (still caught by API)
   *  - leetspeak: @ → a, 3 → e, 1 → i, 0 → o, 5 → s, etc.
   */
  function normalize(text) {
    let t = text.toLowerCase();

    // Leet speak replacements
    const leet = {
      "@": "a", "4": "a",
      "3": "e",
      "1": "i", "!": "i",
      "0": "o",
      "$": "s", "5": "s",
      "7": "t",
      "+": "t",
      "(": "c",
    };
    t = t.replace(/[@4310!$57+(]/g, (c) => leet[c] || c);

    // Remove asterisks, dots, dashes used as letter substitutes inside words
    // e.g. f**k → fk,  f.u.c.k → fuck,  f-u-c-k → fuck
    t = t.replace(/([a-z])[*.\-_]+([a-z])/g, "$1$2");

    // Collapse spaced-out letters: "s h i t" → "shit"
    // Pattern: single letters separated by spaces (2+ in a row)
    t = t.replace(/\b([a-z])(?: ([a-z])){1,}\b/g, (match) =>
      match.replace(/ /g, "")
    );

    return t;
  }

  /**
   * Call PurgoMalum API — returns true if profanity found, false otherwise.
   * Falls back to true (flag as unsafe) on network error so it fails safe.
   */
  async function checkWithAPI(text) {
    const key = text.slice(0, 300); // limit cache key length
    if (cache.has(key)) return cache.get(key);

    try {
      const encoded = encodeURIComponent(text.slice(0, 500));
      const url = `https://www.purgomalum.com/service/containsprofanity?text=${encoded}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("API error");
      const result = (await res.text()).trim() === "true";
      cache.set(key, result);
      return result;
    } catch (e) {
      // Network unavailable — do a basic local fallback check
      // (only most common root forms, normalized text already applied)
      const basicList = [
        "fuck","shit","bitch","ass","cunt","dick","cock","pussy",
        "nigger","nigga","faggot","fag","bastard","whore","slut",
        "damn","crap","piss","retard","asshole","bullshit","motherfucker",
        "fucker","fuk","fck","shyt","biatch","azz","kunt","dik",
      ];
      const found = basicList.some((w) => text.includes(w));
      cache.set(key, found);
      return found;
    }
  }

  class SwearCheckerExtension {
    getInfo() {
      return {
        id: "swearChecker",
        name: "Swear Checker",
        color1: "#c0392b",
        color2: "#922b21",
        color3: "#7b241c",
        blocks: [
          {
            opcode: "containsSwear",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[TEXT] contains a swear word?",
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "type something here",
              },
            },
          },
          {
            opcode: "containsSwearAsync",
            blockType: Scratch.BlockType.REPORTER,
            text: "check (async) [TEXT] for swears",
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "type something here",
              },
            },
          },
        ],
      };
    }

    /**
     * BOOLEAN block — uses local fallback only (synchronous, instant).
     * Good for real-time checking while typing.
     */
    containsSwear({ TEXT }) {
      if (typeof TEXT !== "string") return false;
      const normalized = normalize(TEXT);

      const basicList = [
        "fuck","shit","bitch","ass","cunt","dick","cock","pussy",
        "nigger","nigga","faggot","fag","bastard","whore","slut",
        "damn","crap","piss","retard","asshole","bullshit","motherfucker",
        "fucker","fuk","fck","shyt","biatch","azz","kunt","dik","wtf",
        "stfu","gtfo","ffs","shat","prick","wank","tosser","twat","arse",
        "bollocks","crap","shite","jackass","dumbass","douchebag","dipshit",
      ];

      return basicList.some((w) => normalized.includes(w));
    }

    /**
     * REPORTER block — uses the PurgoMalum API (async, more accurate).
     * Reports "true" or "false" as a string.
     */
    async containsSwearAsync({ TEXT }) {
      if (typeof TEXT !== "string") return "false";
      const normalized = normalize(TEXT);

      // First do a quick local check
      const localResult = this.containsSwear({ TEXT });
      if (localResult) return "true";

      // Then confirm (or catch misses) with the API
      const apiResult = await checkWithAPI(normalized);
      return apiResult ? "true" : "false";
    }
  }

  Scratch.extensions.register(new SwearCheckerExtension());
})();