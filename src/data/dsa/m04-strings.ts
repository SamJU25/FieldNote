import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM04Lessons: Record<string, LessonContent> = {
  "dsa-string-basics": {
    lessonId: "dsa-string-basics",
    subtitle:
      "Understand how characters map to integer code points, how offset math turns letters into array indices, and why loop concatenation costs O(n²) unless you use a mutable character buffer.",
    intro: {
      heading: "Character Encoding, Immutability & Builders",
      explanation: [
        "Appending characters one at a time with `s = s + ch` inside a loop looks harmless on 10-letter inputs, yet it turns an `O(n)` task into `O(n²)` and times out at `n = 100,000`. Because strings in Python, Java, JavaScript, and Go are **immutable**, each `+` allocates a fresh string and re-copies every character written so far.",
        "Every string is backed by integer **code points**: ASCII maps `'0'..'9'` to `48..57`, `'A'..'Z'` to `65..90`, and `'a'..'z'` to `97..122` (while UTF-8 uses 1 to 4 bytes per character). Collecting characters in a mutable buffer (`buf.append(ch)`) and joining once at the end runs in `O(n)` time, and subtracting `ord('a')` turns any lowercase letter into array slot `0..25` in `O(1)`.",
      ],
      analogy:
        "An immutable string behaves like a printed plaque: adding one letter at the end forces carving a new plaque with all earlier letters copied over. A mutable character buffer is a magnetic letter board where you snap each new tile onto the end and read the full word once at the finish.",
      realWorldUses: [
        "Converting lowercase letters or digit characters into 0-based array indices or integers in O(1) without lookup tables",
        "Avoiding O(n²) memory churn when assembling CSV lines, log payloads, or normalized text inside loops",
      ],
    },
    sections: [
      {
        heading: "ASCII, UTF-8, and offset arithmetic",
        paragraphs: [
          "ASCII assigns each basic character a 7-bit integer (`0..127`). UTF-8 keeps `0..127` as 1 byte while accented letters, non-Latin scripts, and emojis take 2 to 4 bytes, so byte length does not always equal character count.",
          "Inside the contiguous ranges `'0'..'9'`, `'A'..'Z'`, and `'a'..'z'`, subtraction gives direct `O(1)` conversions. Always check the character range before subtracting: `'7'` -> `ord('7') - ord('0') = 7` (valid) and `'A'` -> `chr(ord('A') + 32) = 'a'` (valid), whereas subtracting `ord('a')` from `'A'` yields `65 - 97 = -32` (invalid out-of-bounds index).",
        ],
        code: [
          "// Valid vs broken ASCII offset, UTF-8 byte count, and immutability check",
          "ord('7') - ord('0')       // Valid: 55 - 48 = 7",
          "ord('A') - ord('a')       // Broken: 65 - 97 = -32 (missing range guard!)",
          "",
          "len(\"café\")               // 4 characters, but 5 UTF-8 bytes ('é' takes 2 bytes)",
          "s = \"cat\"; s[0] = 'b'     // Error -> TypeError: strings are immutable",
        ],
        output: "ord('7') - ord('0') -> 7 | ord('A') - ord('a') -> -32 | s[0] = 'b' -> TypeError",
        table: {
          caption: "Common ASCII ranges and O(1) offset formulas",
          headers: ["Character range", "Code point range", "Offset formula", "Result range"],
          rows: [
            ["Digits `'0'..'9'`", "`48..57`", "`ord(ch) - ord('0')`", "Integers `0..9`"],
            ["Uppercase `'A'..'Z'`", "`65..90`", "`ord(ch) - ord('A')`", "Alphabet index `0..25`"],
            ["Lowercase `'a'..'z'`", "`97..122`", "`ord(ch) - ord('a')`", "Alphabet index `0..25`"],
            ["Case fold `'A'..'Z'` -> `'a'..'z'`", "`65..90` -> `97..122`", "`chr(ord(ch) + 32)`", "Lowercase ASCII letter"],
            ["Space `' '` & UTF-8 extras", "`32` (1B), `>= 128` (2-4B)", "Validate range first", "Check bounds before subtracting"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Because 'a'..'z' and '0'..'9' are contiguous blocks in ASCII and Unicode, simple subtraction turns characters into 0-based integers in O(1) time.",
        },
      },
      {
        heading: "Immutable strings vs mutable character builders",
        paragraphs: [
          "Trace building `\"cats\"` one letter at a time with `s = s + ch`: step 1 writes `'c'` (1 write), step 2 re-copies `'c'` + `'a'` (2 writes), step 3 re-copies `\"ca\"` + `'t'` (3 writes), and step 4 re-copies `\"cat\"` + `'s'` (4 writes) -> `1 + 2 + 3 + 4 = 10` writes for 4 letters. For `n` characters, `1 + 2 + ... + n = n(n + 1)/2` writes gives `O(n²)` time.",
          "Collecting characters into a mutable array `buf` (`buf.append(ch)`) and calling `join(buf)` (`\"\".join(buf)` in Python) once at the end performs `n` appends plus `n` join copies (`2n` writes total), running in `O(n)` time and `O(n)` space. Notice `slice(s, 0, j)` corresponds directly to Python's `s[:j]`.",
        ],
        code: [
          "// Broken O(n^2) repeated '+' concatenation (re-copies growing prefix)",
          "s = \"\"",
          "for ch in ['c', 'a', 't', 's']:",
          "    s = s + ch            // 1 + 2 + 3 + 4 = 10 writes; at n=100k -> ~5B writes (TLE)",
          "",
          "// Working O(n) mutable buffer + single join",
          "buf = []",
          "for ch in ['c', 'a', 't', 's']:",
          "    buf.append(ch)        // 4 appends + 4 join copies = 8 writes (2n total)",
          "s = \"\".join(buf)          // \"cats\"",
        ],
        output: "Loop '+': 10 writes (O(n^2)) | Buffer + join: 8 writes -> \"cats\" (O(n))",
        table: {
          caption: "String construction cost for appending n characters",
          headers: ["Approach", "Language pattern", "Total writes", "Time / Space"],
          rows: [
            ["Repeated concatenation", "`s = s + ch` in loop (Python/Java/JS)", "`1 + 2 + ... + n = n(n + 1)/2`", "`O(n²)` time / `O(n)` final"],
            ["Mutable character buffer", "`buf.append(ch)` then `join(buf)`", "`n` appends + `n` join copies", "`O(n)` time / `O(n)` space"],
            ["In-place mutable string", "C++ `std::string` `push_back(ch)` or char array", "Amortized `O(1)` per append", "`O(n)` time / `O(n)` space"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "WATCH OUT",
          text: "On small 20-character tests, `s = s + ch` looks fast. On `n = 100,000` characters, copying growing prefixes performs roughly 5 billion character writes and times out.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From O(n²) Concatenation to an O(n) Character Builder",
      steps: [
        {
          label: "Step 1: Naive loop concatenation (O(n²) copies)",
          explanation: "Concatenating `s = s + ch` allocates a brand-new string and copies the growing prefix every iteration.",
          code: [
            "function clean_naive(raw):",
            "    out ← \"\"",
            "    for each ch in raw:",
            "        if 'a' <= ch and ch <= 'z':",
            "            out ← out + ch",
            "    return out",
          ],
          activeLines: [2, 5],
          output: "\"ab...\" -> n(n + 1)/2 character writes",
        },
        {
          label: "Step 2: Collect in a mutable buffer, join once (O(n))",
          explanation: "Appending to `buf` and joining once after the loop cuts total writes from `O(n²)` down to `2n`.",
          code: [
            "function clean_buffer(raw):",
            "    buf ← empty char array",
            "    for each ch in raw:",
            "        if 'a' <= ch and ch <= 'z':",
            "            buf.append(ch)",
            "    return join(buf)",
          ],
          activeLines: [2, 5, 6],
          output: "2n writes -> O(n) time and space",
        },
        {
          label: "Step 3: Guard and fold uppercase ASCII via +32 offset",
          explanation: "Check `'A' <= ch <= 'Z'` before applying `chr(ord(ch) + 32)` so digits or symbols never shift into wrong code points.",
          code: [
            "function normalize_tag(raw):",
            "    buf ← empty char array",
            "    for each ch in raw:",
            "        if ('a' <= ch and ch <= 'z') or ('0' <= ch and ch <= '9'):",
            "            buf.append(ch)",
            "        else if 'A' <= ch and ch <= 'Z':",
            "            buf.append(chr(ord(ch) + 32))",
            "    return join(buf)",
          ],
          activeLines: [6, 7],
          output: "normalize_tag(\"SKU-409!\") -> \"sku409\"",
        },
      ],
    },
    walkthrough: {
      title: "Trace O(n²) string copying vs O(n) character builder",
      layout: "visual-first",
      steps: [
        {
          title: "Map characters to ASCII codes and 0..25 offsets",
          tag: "CONCEPT",
          explanation: [
            "Each input character in `\"cat\"` sits at its ASCII code point (`99`, `97`, `116`).",
            "Subtracting `ord('a')` (`97`) converts `'c'`, `'a'`, `'t'` directly to `2`, `0`, `19` in `O(1)` per character.",
          ],
          code: [
            "chars ← ['c', 'a', 't']",
            "for ch in chars:",
            "    idx ← ord(ch) - ord('a')",
          ],
          activeLines: [1, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "ord('a')", value: "97" },
            { name: "Offsets", value: "[2, 0, 19]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input characters",
                cells: [
                  { id: "in0", value: "'c'", index: 0, state: "active" },
                  { id: "in1", value: "'a'", index: 1, state: "active" },
                  { id: "in2", value: "'t'", index: 2, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "ord 99", tone: "accent" },
                  { index: 1, label: "ord 97", tone: "ok" },
                  { index: 2, label: "ord 116", tone: "coral" },
                ],
              },
              {
                label: "0..25 offsets (ord(ch) - 97)",
                cells: [
                  { id: "off0", value: "2", index: 0, state: "done" },
                  { id: "off1", value: "0", index: 1, state: "done" },
                  { id: "off2", value: "19", index: 2, state: "done" },
                ],
              },
            ],
            caption: "Contiguous ASCII codes turn lowercase letters into 0..25 indices with one subtraction.",
          },
        },
        {
          title: "Broken pattern: s = s + ch copies the old prefix on step 2",
          tag: "PITFALL",
          explanation: [
            "Suppose strings are immutable and we build `\"cat\"` with `s ← s + ch`. After `'c'`, adding `'a'` cannot modify `\"c\"` in place.",
            "The runtime allocates a new 2-slot string, copies `'c'`, and writes `'a'` (`1 + 2 = 3` writes so far).",
          ],
          code: [
            "s ← \"\"",
            "s ← s + 'c'   // 1 write",
            "s ← s + 'a'   // copy 'c' + write 'a' (2 writes)",
            "s ← s + 't'   // waiting...",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "s", value: "\"ca\"", changed: true },
            { name: "Cumulative writes", value: "1 + 2 = 3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input characters",
                cells: [
                  { id: "in0", value: "'c'", index: 0, state: "done" },
                  { id: "in1", value: "'a'", index: 1, state: "active" },
                  { id: "in2", value: "'t'", index: 2, state: "dim" },
                ],
                pointers: [{ index: 1, label: "i = 1", tone: "coral" }],
              },
              {
                label: "Immutable allocation for s = \"ca\" (copied 'c' again)",
                cells: [
                  { id: "imm0", value: "'c'", index: 0, state: "done" },
                  { id: "imm1", value: "'a'", index: 1, state: "active" },
                ],
                pointers: [{ index: 0, label: "re-copied", tone: "coral" }],
              },
            ],
            caption: "Adding 'a' allocates new memory and re-copies the previous prefix 'c'.",
          },
        },
        {
          title: "Broken pattern: step 3 copies all previous characters again (O(n²))",
          tag: "PITFALL",
          explanation: [
            "Appending `'t'` allocates a 3-slot string and copies `'c'` and `'a'` yet again before writing `'t'`.",
            "For `n` characters, total writes grow as `1 + 2 + ... + n = n(n + 1)/2`, which is `O(n²)`.",
          ],
          code: [
            "s ← \"\"",
            "s ← s + 'c'   // 1 write",
            "s ← s + 'a'   // 2 writes",
            "s ← s + 't'   // copy 'c','a' + write 't' (3 writes)",
          ],
          activeLines: [4],
          codeLabel: "Pseudocode",
          state: [
            { name: "s", value: "\"cat\"", changed: true },
            { name: "Total writes", value: "1 + 2 + 3 = 6 (O(n²))", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input characters",
                cells: [
                  { id: "in0", value: "'c'", index: 0, state: "done" },
                  { id: "in1", value: "'a'", index: 1, state: "done" },
                  { id: "in2", value: "'t'", index: 2, state: "active" },
                ],
                pointers: [{ index: 2, label: "i = 2", tone: "coral" }],
              },
              {
                label: "Third allocation for s = \"cat\" (re-copied 'c' and 'a')",
                cells: [
                  { id: "imm0", value: "'c'", index: 0, state: "done" },
                  { id: "imm1", value: "'a'", index: 1, state: "done" },
                  { id: "imm2", value: "'t'", index: 2, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "copied 3x", tone: "coral" },
                  { index: 1, label: "copied 2x", tone: "coral" },
                ],
              },
            ],
            caption: "Early characters get copied repeatedly on every loop step, causing O(n²) work.",
          },
        },
        {
          title: "Pattern: append into a mutable character buffer",
          tag: "PATTERN",
          explanation: [
            "Instead of rebuilding strings every step, push each character onto the end of a mutable array `buf`.",
            "Appending `'c'`, `'a'`, `'t'` writes each character into its own slot once without re-copying the prefix.",
          ],
          code: [
            "buf ← empty mutable char array",
            "for ch in chars:",
            "    buf.append(ch)   // amortized O(1)",
            "return join(buf)",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "buf writes", value: "3 (1 per char)", changed: true },
            { name: "Prefix re-copies", value: "0", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input characters",
                cells: [
                  { id: "in0", value: "'c'", index: 0, state: "done" },
                  { id: "in1", value: "'a'", index: 1, state: "done" },
                  { id: "in2", value: "'t'", index: 2, state: "done" },
                ],
              },
              {
                label: "Mutable buffer buf (written once per char)",
                cells: [
                  { id: "buf0", value: "'c'", index: 0, state: "active" },
                  { id: "buf1", value: "'a'", index: 1, state: "active" },
                  { id: "buf2", value: "'t'", index: 2, state: "active" },
                ],
                pointers: [{ index: 2, label: "append end", tone: "ok" }],
              },
            ],
            caption: "Each append drops one character at the end of buf in amortized O(1) time.",
          },
        },
        {
          title: "Join the buffer once at the end in O(n)",
          tag: "TRACE",
          explanation: [
            "After the loop finishes, `join(buf)` allocates the exact final string size once and copies all `n` slots in a single pass.",
            "Total writes equal `n` appends plus `n` final copies (`2n = O(n)`), staying fast even for `n = 10^6`.",
          ],
          code: [
            "buf ← ['c', 'a', 't']",
            "result ← join(buf)   // single O(n) pass",
            "return result        // \"cat\"",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "result", value: "\"cat\"", changed: true },
            { name: "Total complexity", value: "O(n) time, O(n) space" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Mutable buffer buf",
                cells: [
                  { id: "buf0", value: "'c'", index: 0, state: "dim" },
                  { id: "buf1", value: "'a'", index: 1, state: "dim" },
                  { id: "buf2", value: "'t'", index: 2, state: "dim" },
                ],
              },
              {
                label: "Final immutable string (1 allocation)",
                cells: [
                  { id: "out0", value: "'c'", index: 0, state: "done" },
                  { id: "out1", value: "'a'", index: 1, state: "done" },
                  { id: "out2", value: "'t'", index: 2, state: "done" },
                ],
                pointers: [{ index: 0, label: "O(n) join", tone: "ok" }],
              },
            ],
            caption: "One final allocation copies n characters once, dropping loop cost from O(n²) to O(n).",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Slicing inside a loop also triggers hidden O(n²) copies",
        detail:
          "In languages with immutable strings, calling `s = s[1:]` or `substring(1)` inside an `n`-step loop creates a new `n - 1`, `n - 2`, ... character copy each step, costing `O(n²)`. Track a read index `i` instead of slicing off the front.",
      },
      {
        title: "Guard character ranges before subtracting 'a'",
        detail:
          "Computing `ord(ch) - ord('a')` on `'A'`, `'5'`, or `' '` produces negative or out-of-range numbers (`-32`, `-49`, `-65`), which crash array lookups on a 26-slot array. Always check `'a' <= ch <= 'z'` first.",
      },
      {
        title: "UTF-8 byte length vs character count",
        detail:
          "Multi-byte characters such as accented letters or emojis take 2 to 4 bytes in UTF-8. Indexing raw UTF-8 bytes splits a single character in half; use code-point iteration when processing non-ASCII text.",
      },
    ],
    practiceTask: {
      title: "Shift Lowercase Letters by K",
      tier: "Warmup",
      goal: "Given a string `s` and non-negative integer `k`, shift every lowercase letter `'a'..'z'` forward by `k` positions wrapping around `'z'` back to `'a'`, leaving other characters unchanged, in `O(n)` time.",
      constraints: ["1 <= len(s) <= 10^5", "0 <= k <= 10^9", "Target time: O(n)", "Extra space: O(n) buffer"],
      examples: [
        { input: "s = \"xyz-1\", k = 3", output: "abc-1", explanation: "'x' -> 'a', 'y' -> 'b', 'z' -> 'c', '-' and '1' stay unchanged." },
        { input: "s = \"hello\", k = 26", output: "hello" },
      ],
      tasks: [
        "Allocate a mutable character buffer `buf` instead of using `out = out + ch`.",
        "For each `'a' <= ch <= 'z'`, compute `shifted = (ord(ch) - ord('a') + k) mod 26` and append `chr(ord('a') + shifted)`.",
        "Append non-lowercase characters unchanged, then join `buf` once.",
      ],
      starterCode: "function shift_lowercase(s, k):\n    // TODO: O(n) character buffer + mod 26 offset math\n    return result",
      expectedOutput: "abc-1\nhello",
      hint: "Reduce `(ord(ch) - ord('a') + (k mod 26)) mod 26` so large `k` up to `10^9` never overflows 32-bit integers, and append to a mutable buffer.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "function shift_lowercase(s, k):\n    buf ← empty char array\n    shift ← k mod 26\n    for each ch in s:\n        if 'a' <= ch and ch <= 'z':\n            offset ← (ord(ch) - ord('a') + shift) mod 26\n            buf.append(chr(ord('a') + offset))\n        else:\n            buf.append(ch)\n    return join(buf)",
    },
    practiceChallenges: [
      {
        title: "Shift Lowercase Letters by K",
        tier: "Warmup",
        goal: "Shift every lowercase letter `'a'..'z'` in `s` forward by `k` places with wrap-around, leaving non-lowercase characters unchanged, in `O(n)` time.",
        constraints: ["1 <= len(s) <= 10^5", "0 <= k <= 10^9", "Target time: O(n)", "Extra space: O(n)"],
        examples: [
          { input: "s = \"xyz-1\", k = 3", output: "abc-1" },
          { input: "s = \"hello\", k = 26", output: "hello" },
        ],
        tasks: [
          "Use `shift = k mod 26` and `(ord(ch) - ord('a') + shift) mod 26`.",
          "Collect characters in a mutable buffer and join once.",
        ],
        starterCode: "function shift_lowercase(s, k):\n    // TODO: shift 'a'..'z' using offset arithmetic and a char buffer",
        expectedOutput: "abc-1\nhello",
        hint: "Adding `ord('a')` back converts `0..25` back into `'a'..'z'`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function shift_lowercase(s, k):\n    buf ← empty char array\n    shift ← k mod 26\n    for each ch in s:\n        if 'a' <= ch and ch <= 'z':\n            offset ← (ord(ch) - ord('a') + shift) mod 26\n            buf.append(chr(ord('a') + offset))\n        else:\n            buf.append(ch)\n    return join(buf)",
      },
      {
        title: "Filter & Lowercase Alphanumerics in O(n)",
        tier: "Core",
        goal: "Return a cleaned string keeping only ASCII letters and digits from `s`, folding uppercase `'A'..'Z'` to lowercase using ASCII offset math without built-in regex or repeated string concatenation.",
        constraints: ["0 <= len(s) <= 10^5", "Target time: O(n)", "Extra space: O(n)"],
        examples: [
          { input: "s = \"A1-b C!2\"", output: "a1bc2" },
          { input: "s = \"---\"", output: "\"\"", explanation: "No ASCII letters or digits remain, so joining yields an empty string." },
        ],
        tasks: [
          "Check three ASCII ranges: `'a'..'z'`, `'0'..'9'`, and `'A'..'Z'`.",
          "Convert `'A'..'Z'` via `chr(ord(ch) - ord('A') + ord('a'))` and append to a buffer.",
        ],
        starterCode: "function clean_alnum_lower(s):\n    // TODO: O(n) filter + ASCII lowercase conversion\n    return result",
        expectedOutput: "a1bc2\n\"\"",
        hint: "Skip characters outside `'a'..'z'`, `'0'..'9'`, and `'A'..'Z'`, and append kept characters into a mutable buffer.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function clean_alnum_lower(s):\n    buf ← empty char array\n    for each ch in s:\n        if ('a' <= ch and ch <= 'z') or ('0' <= ch and ch <= '9'):\n            buf.append(ch)\n        else if 'A' <= ch and ch <= 'Z':\n            buf.append(chr(ord(ch) - ord('A') + ord('a')))\n    return join(buf)",
      },
      {
        title: "Normalize Whitespace & Capitalize Words",
        tier: "Stretch",
        goal: "Given a sentence `s` of ASCII letters and spaces, trim leading/trailing spaces, collapse consecutive spaces into one `' '`, capitalize the first letter of each word, and lowercase remaining letters in `O(n)` time using a single char buffer.",
        constraints: ["0 <= len(s) <= 10^5", "Do not call built-in split or title helpers", "Target time: O(n)", "Extra space: O(n)"],
        examples: [
          { input: "s = \"  hELLO   wORLD  \"", output: "Hello World" },
          { input: "s = \"   \"", output: "\"\"", explanation: "All spaces are trimmed, returning an empty string." },
        ],
        tasks: [
          "Track a boolean `at_word_start = true` as you scan `s` left to right.",
          "Skip `' '` when `buf` is empty or the previous appended character was `' '` (or wait until a letter arrives before emitting a separating space).",
          "Fold the first letter of a word to `'A'..'Z'` and later letters to `'a'..'z'` via ASCII offsets.",
        ],
        starterCode: "function normalize_title(s):\n    // TODO: single-pass O(n) space-collapse and case normalization",
        expectedOutput: "Hello World\n\"\"",
        hint: "Track `need_space = false` and `at_word_start = true`. When you see a space after emitting at least one word, set `need_space = true` and `at_word_start = true`. Only append `' '` right before the next non-space letter arrives, which automatically prevents trailing spaces!",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function normalize_title(s):\n    buf ← empty char array\n    at_word_start ← true\n    need_space ← false\n    for each ch in s:\n        if ch == ' ':\n            if len(buf) > 0:\n                need_space ← true\n            at_word_start ← true\n        else:\n            if need_space:\n                buf.append(' ')\n                need_space ← false\n            if at_word_start:\n                if 'a' <= ch and ch <= 'z':\n                    buf.append(chr(ord(ch) - ord('a') + ord('A')))\n                else:\n                    buf.append(ch)\n                at_word_start ← false\n            else:\n                if 'A' <= ch and ch <= 'Z':\n                    buf.append(chr(ord(ch) - ord('A') + ord('a')))\n                else:\n                    buf.append(ch)\n    return join(buf)",
      },
    ],
  },

  "dsa-string-frequency": {
    lessonId: "dsa-string-frequency",
    subtitle:
      "Use fixed-size 26-slot and 128-slot integer arrays from Module 03 to count characters, detect anagrams, find the first unique letter, and verify one-to-one character mappings in O(n) time.",
    intro: {
      heading: "Character Frequency & Anagram Patterns",
      explanation: [
        "Checking whether two strings are anagrams by erasing matched letters in nested loops runs in `O(n²)`, and sorting copies of both strings costs `O(n log n)` time plus `O(n)` extra memory. On isomorphic checks, storing only a one-way map misses collisions like `s = \"ab\"`, `t = \"aa\"` where two distinct letters try to share `'a'`.",
        "When strings use a fixed alphabet such as `'a'..'z'` (`26` slots) or ASCII (`128` slots), an integer array gives `O(1)` read and update via `ord(ch) - ord('a')`. Because `26` and `128` stay constant regardless of string length `n`, fixed-alphabet frequency and bidirectional maps run in `O(n)` time and `O(1)` auxiliary space.",
      ],
      analogy:
        "Picture a 26-compartment Scrabble tray labeled `a` through `z`. To check if two words are anagrams, drop `+1` marble per letter of the first word and `-1` marble per letter of the second; if every compartment ends at `0`, both words contain the exact same letters.",
      realWorldUses: [
        "Checking whether two words or identifier strings are anagrams in O(n) time instead of O(n log n) sorting",
        "Validating one-to-one character substitutions (isomorphic patterns) using paired 128-slot ASCII arrays",
      ],
    },
    sections: [
      {
        heading: "The 26-slot frequency array pattern",
        paragraphs: [
          "Sorting two strings of length `n` takes `O(n log n)` time and allocates `O(n)` sorted copies. A fixed array `counts[26]` drops time to `O(n)` and auxiliary space to `O(1)` (`26` integers regardless of `n`).",
          "For **valid anagram** (`is_anagram(s, t)`), reject `len(s) != len(t)` in `O(1)`. Then walk `i` from `0` to `n - 1`, adding `1` at `ord(s[i]) - ord('a')` and subtracting `1` at `ord(t[i]) - ord('a')`. On `(\"care\", \"race\")`, every active slot (`a`, `c`, `e`, `r`) cancels back to `0` (`true`); on `(\"care\", \"card\")`, slot `'e'` stays `+1` and slot `'d'` stays `-1` (`false`).",
        ],
        code: [
          "// Slow O(n^2) nested erase vs O(n log n) sort vs O(n) 26-slot counting",
          "for ch in s: pool.remove(ch)          // O(n^2) linear scan + shift per char",
          "sorted(s) == sorted(t)                // O(n log n) time, O(n) extra copies",
          "",
          "// Working O(n) 26-slot array: anagram balance + palindrome cleanup",
          "counts = [0] * 26",
          "for i in range(len(s)):               // s = \"care\", t = \"race\"",
          "    counts[ord(s[i]) - ord('a')] += 1",
          "    counts[ord(t[i]) - ord('a')] -= 1 // All 26 slots end at 0 -> true",
          "",
          "// Palindrome cleanup: normalize 'A'..'Z' -> 'a'..'z', drop punctuation, then count",
          "// \"Race, car!\" -> \"racecar\" -> at most 1 odd slot in counts[26] -> true",
        ],
        output: "Nested erase: O(n^2) | 26-slot counts[\"care\", \"race\"]: all 0 -> true | \"Race, car!\" -> true",
        table: {
          caption: "Comparing anagram detection approaches on length-n strings",
          headers: ["Method", "How it works", "Time", "Auxiliary space"],
          rows: [
            ["Nested letter matching", "Search and erase each letter of `s` in `t`", "`O(n²)`", "`O(n)` copy"],
            ["Sort and compare", "Sort both strings and compare equality", "`O(n log n)`", "`O(n)` sorted copies"],
            ["26-slot count array", "Add `+1` for `s[i]`, `-1` for `t[i]`, verify all `0`", "`O(n)`", "`O(1)` (26 integers)"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "KEY IDEA",
          text: "A fixed alphabet size (26 lowercase letters or 128 ASCII codes) turns character counting into direct array indexing with O(1) space.",
        },
      },
      {
        heading: "First unique character & two-way isomorphic arrays",
        paragraphs: [
          "To find the **first unique character** in `s`, Pass 1 tallies every letter into `counts[26]`. Pass 2 walks `i` from `0` to `n - 1` along `s` (rather than `0..25` along `counts`) and returns the first `i` where `counts[ord(s[i]) - ord('a')] == 1`. On `\"love\"`, scanning `counts[0..25]` would pick `'e'` (index 3), while scanning `s` preserves order and returns `'l'` (index 0).",
          "For **isomorphic strings** (`s = \"ab\"`, `t = \"aa\"`), a single array `map_s[128]` binds `'a' -> 'a'` at `i = 0` and `'b' -> 'a'` at `i = 1`, wrongly returning `true`. Maintaining paired arrays `map_s[128]` and `map_t[128]` (filled with `-1`) catches the collision at `i = 1` because `map_t['a']` already holds `'a'` instead of `'b'`.",
        ],
        code: [
          "// Broken one-way map on s = \"ab\", t = \"aa\":",
          "map_s['a'] = 'a'; map_s['b'] = 'a'   // Misses collision -> wrongly returns true!",
          "",
          "// Working two-way 128-slot ASCII maps:",
          "if map_s[c1] == -1 and map_t[c2] == -1:",
          "    map_s[c1] = c2; map_t[c2] = c1",
          "else if map_s[c1] != c2 or map_t[c2] != c1:",
          "    return false                      // Catches map_t['a'] == 'a' != 'b' -> false",
        ],
        output: "One-way map(\"ab\", \"aa\") -> true (BUG) | Two-way map -> false",
        table: {
          caption: "Core M04 string problems solved with fixed-size integer arrays",
          headers: ["Problem", "Array used", "Pass structure", "Time / Space"],
          rows: [
            ["Valid Anagram", "`counts[26]` init `0`", "1 pass (`+1`/`-1`) + 26-slot check", "`O(n)` / `O(1)`"],
            ["First Unique Character", "`counts[26]` init `0`", "Pass 1 counts; Pass 2 scans `s[0..n-1]`", "`O(n)` / `O(1)`"],
            ["Isomorphic Strings", "`map_s[128]`, `map_t[128]` init `-1`", "Single pass checking both mapping directions", "`O(n)` / `O(1)`"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Checking only `map_s[c1] == c2` misses collisions like `s = \"ab\"`, `t = \"aa\"`, where both `'a'` and `'b'` try to map to `'a'`. Always maintain both `map_s[128]` and `map_t[128]`.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From 26-Slot Balance Checks to Two-Way ASCII Maps",
      steps: [
        {
          label: "Step 1: Naive nested erase (O(n²))",
          explanation: "Searching `t` for each character of `s` and removing matches costs `O(n²)` and mutates a copy.",
          code: [
            "function is_anagram_naive(s, t):",
            "    if len(s) != len(t): return false",
            "    pool ← list(t)",
            "    for ch in s:",
            "        if ch not in pool: return false",
            "        pool.remove(ch)",
            "    return true",
          ],
          activeLines: [4, 5, 6],
          output: "O(n²) linear scan per character",
        },
        {
          label: "Step 2: Single-pass +1/-1 balance in counts[26] (O(n))",
          explanation: "Adding `1` for `s[i]` and subtracting `1` for `t[i]` reduces time to `O(n)` and extra space to `26` integers (`O(1)`).",
          code: [
            "function is_anagram(s, t):",
            "    if len(s) != len(t): return false",
            "    counts ← array of 26 zeros",
            "    for i from 0 to len(s) - 1:",
            "        counts[ord(s[i]) - ord('a')] += 1",
            "        counts[ord(t[i]) - ord('a')] -= 1",
            "    for k from 0 to 25:",
            "        if counts[k] != 0: return false",
            "    return true",
          ],
          activeLines: [3, 5, 6, 8],
          output: "is_anagram(\"care\", \"race\") -> true",
        },
        {
          label: "Step 3: Pair map_s[128] and map_t[128] for one-to-one mapping",
          explanation: "Checking both arrays prevents two distinct characters in `s` from collapsing onto the same character in `t`.",
          code: [
            "function are_isomorphic(s, t):",
            "    if len(s) != len(t): return false",
            "    map_s ← array of 128 (-1); map_t ← array of 128 (-1)",
            "    for i from 0 to len(s) - 1:",
            "        c1 ← ord(s[i]); c2 ← ord(t[i])",
            "        if map_s[c1] == -1 and map_t[c2] == -1:",
            "            map_s[c1] ← c2; map_t[c2] ← c1",
            "        else if map_s[c1] != c2 or map_t[c2] != c1:",
            "            return false",
            "    return true",
          ],
          activeLines: [3, 6, 7, 8],
          output: "are_isomorphic(\"ab\", \"aa\") -> false",
        },
      ],
    },
    walkthrough: {
      title: "Trace anagram cancellation with a 26-slot array",
      layout: "visual-first",
      steps: [
        {
          title: "Verify equal lengths and initialize counts[26] to 0",
          tag: "CONCEPT",
          explanation: [
            "We compare `s = \"care\"` and `t = \"race\"`. First check `len(s) == len(t)` (`4 == 4`).",
            "Allocate `counts[26]` filled with `0`. Below we watch the four active letter slots `'a'` (index `0`), `'c'` (`2`), `'e'` (`4`), and `'r'` (`17`).",
          ],
          code: [
            "if len(s) != len(t): return false",
            "counts ← array of 26 zeros",
            "for i from 0 to len(s) - 1:",
            "    counts[ord(s[i]) - ord('a')] += 1",
            "    counts[ord(t[i]) - ord('a')] -= 1",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "lengths", value: "4 == 4 (proceed)" },
            { name: "counts[a,c,e,r]", value: "[0, 0, 0, 0]" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "s = \"care\"",
                cells: [
                  { id: "s0", value: "'c'", index: 0 },
                  { id: "s1", value: "'a'", index: 1 },
                  { id: "s2", value: "'r'", index: 2 },
                  { id: "s3", value: "'e'", index: 3 },
                ],
              },
              {
                label: "t = \"race\"",
                cells: [
                  { id: "t0", value: "'r'", index: 0 },
                  { id: "t1", value: "'a'", index: 1 },
                  { id: "t2", value: "'c'", index: 2 },
                  { id: "t3", value: "'e'", index: 3 },
                ],
              },
              {
                label: "Letter frequency counters for 'a', 'c', 'e', 'r'",
                cells: [
                  { id: "f0", value: "0", index: 0 },
                  { id: "f2", value: "0", index: 2 },
                  { id: "f4", value: "0", index: 4 },
                  { id: "f17", value: "0", index: 17 },
                ],
              },
            ],
            caption: "All 26 compartments start empty at 0.",
          },
        },
        {
          title: "Step i = 0: +1 for s[0]='c', -1 for t[0]='r'",
          tag: "TRACE",
          explanation: [
            "At `i = 0`, `s[0]` is `'c'` (slot `2`), so `counts[2]` increments to `+1`.",
            "`t[0]` is `'r'` (slot `17`), so `counts[17]` decrements to `-1`, recording one `'r'` debt from `t`.",
          ],
          code: [
            "// i = 0: s[0] = 'c', t[0] = 'r'",
            "counts[2]  += 1   // 'c': 0 -> 1",
            "counts[17] -= 1   // 'r': 0 -> -1",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "0", changed: true },
            { name: "counts['c'] / counts['r']", value: "1 / -1", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "s = \"care\"",
                cells: [
                  { id: "s0", value: "'c'", index: 0, state: "active" },
                  { id: "s1", value: "'a'", index: 1 },
                  { id: "s2", value: "'r'", index: 2 },
                  { id: "s3", value: "'e'", index: 3 },
                ],
                pointers: [{ index: 0, label: "i = 0 (+1)", tone: "ok" }],
              },
              {
                label: "t = \"race\"",
                cells: [
                  { id: "t0", value: "'r'", index: 0, state: "active" },
                  { id: "t1", value: "'a'", index: 1 },
                  { id: "t2", value: "'c'", index: 2 },
                  { id: "t3", value: "'e'", index: 3 },
                ],
                pointers: [{ index: 0, label: "i = 0 (-1)", tone: "coral" }],
              },
              {
                label: "Active slots inside counts[26]",
                cells: [
                  { id: "f0", value: "0", index: 0 },
                  { id: "f2", value: "1", index: 2, state: "active" },
                  { id: "f4", value: "0", index: 4 },
                  { id: "f17", value: "-1", index: 17, state: "active" },
                ],
                pointers: [
                  { index: 1, label: "'c' +1", tone: "ok" },
                  { index: 3, label: "'r' -1", tone: "coral" },
                ],
              },
            ],
            caption: "Negative counts mean t has seen a letter that s has not matched yet.",
          },
        },
        {
          title: "Step i = 1: same letter 'a' cancels immediately",
          tag: "TRACE",
          explanation: [
            "At `i = 1`, both `s[1]` and `t[1]` are `'a'` (slot `0`).",
            "`counts[0]` receives `+1` and `-1`, ending back at `0`.",
          ],
          code: [
            "// i = 1: s[1] = 'a', t[1] = 'a'",
            "counts[0] += 1   // 'a': 0 -> 1",
            "counts[0] -= 1   // 'a': 1 -> 0",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "1", changed: true },
            { name: "counts['a']", value: "0 (cancelled)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "s = \"care\"",
                cells: [
                  { id: "s0", value: "'c'", index: 0, state: "done" },
                  { id: "s1", value: "'a'", index: 1, state: "active" },
                  { id: "s2", value: "'r'", index: 2 },
                  { id: "s3", value: "'e'", index: 3 },
                ],
                pointers: [{ index: 1, label: "i = 1 (+1)", tone: "ok" }],
              },
              {
                label: "t = \"race\"",
                cells: [
                  { id: "t0", value: "'r'", index: 0, state: "done" },
                  { id: "t1", value: "'a'", index: 1, state: "active" },
                  { id: "t2", value: "'c'", index: 2 },
                  { id: "t3", value: "'e'", index: 3 },
                ],
                pointers: [{ index: 1, label: "i = 1 (-1)", tone: "coral" }],
              },
              {
                label: "Active slots inside counts[26]",
                cells: [
                  { id: "f0", value: "0", index: 0, state: "done" },
                  { id: "f2", value: "1", index: 2 },
                  { id: "f4", value: "0", index: 4 },
                  { id: "f17", value: "-1", index: 17 },
                ],
                pointers: [{ index: 0, label: "'a' = 0", tone: "ok" }],
              },
            ],
            caption: "Matching characters at the same position cancel immediately.",
          },
        },
        {
          title: "Steps i = 2 and 3: remaining letters settle the balance",
          tag: "TRACE",
          explanation: [
            "At `i = 2`, `s[2] = 'r'` adds `+1` to slot `17` (cancelling `-1` to `0`), and `t[2] = 'c'` subtracts `1` from slot `2` (cancelling `1` to `0`).",
            "At `i = 3`, `'e'` on both sides adds `+1` and `-1` at slot `4`, leaving every count at `0`.",
          ],
          code: [
            "// i = 2: s[2]='r' (+1 at 17), t[2]='c' (-1 at 2)",
            "// i = 3: s[3]='e' (+1 at 4),  t[3]='e' (-1 at 4)",
            "counts[17] -> 0, counts[2] -> 0, counts[4] -> 0",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "3 (loop done)", changed: true },
            { name: "counts[a,c,e,r]", value: "[0, 0, 0, 0]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "s = \"care\"",
                cells: [
                  { id: "s0", value: "'c'", index: 0, state: "done" },
                  { id: "s1", value: "'a'", index: 1, state: "done" },
                  { id: "s2", value: "'r'", index: 2, state: "done" },
                  { id: "s3", value: "'e'", index: 3, state: "done" },
                ],
              },
              {
                label: "t = \"race\"",
                cells: [
                  { id: "t0", value: "'r'", index: 0, state: "done" },
                  { id: "t1", value: "'a'", index: 1, state: "done" },
                  { id: "t2", value: "'c'", index: 2, state: "done" },
                  { id: "t3", value: "'e'", index: 3, state: "done" },
                ],
              },
              {
                label: "Active slots inside counts[26]",
                cells: [
                  { id: "f0", value: "0", index: 0, state: "done" },
                  { id: "f2", value: "0", index: 2, state: "done" },
                  { id: "f4", value: "0", index: 4, state: "done" },
                  { id: "f17", value: "0", index: 17, state: "done" },
                ],
              },
            ],
            caption: "Every slot returns to 0 once all matched letters have been processed.",
          },
        },
        {
          title: "Scan the 26 slots: all zeros confirms an anagram",
          tag: "CHECK",
          explanation: [
            "A final loop over `0..25` takes a constant `26` checks (`O(1)`).",
            "Since every slot holds `0`, `\"care\"` and `\"race\"` are exact anagrams in `O(n)` time and `O(1)` extra space.",
          ],
          code: [
            "for k from 0 to 25:",
            "    if counts[k] != 0: return false",
            "return true",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "All 26 slots == 0", value: "true", changed: true },
            { name: "Complexity", value: "O(n) time, O(1) space" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Final verification across counts[26]",
                cells: [
                  { id: "f0", value: "0", index: 0, state: "done" },
                  { id: "f2", value: "0", index: 2, state: "done" },
                  { id: "f4", value: "0", index: 4, state: "done" },
                  { id: "f17", value: "0", index: 17, state: "done" },
                ],
                pointers: [
                  { index: 0, label: "ok", tone: "ok" },
                  { index: 1, label: "ok", tone: "ok" },
                  { index: 2, label: "ok", tone: "ok" },
                  { index: 3, label: "ok", tone: "ok" },
                ],
              },
            ],
            caption: "Checking 26 fixed slots costs O(1) regardless of how long s and t are.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Scanning counts[0..25] loses string order in First Unique Character",
        detail:
          "For `s = \"love\"`, slot `'e'` (`4`) comes before `'l'` (`11`) alphabetically, even though `'l'` appears first in `\"love\"`. Always walk `i` from `0` to `len(s) - 1` during the second pass.",
      },
      {
        title: "Isomorphic check needs two arrays, not one",
        detail:
          "If you only track `map_s[c1]`, then `s = \"ab\"` and `t = \"aa\"` both map `'a' -> 'a'` and `'b' -> 'a'` without conflict! Maintain `map_t[128]` as well so two distinct characters in `s` cannot claim the same target character in `t`.",
      },
      {
        title: "Skipping the length check on anagrams",
        detail:
          "Checking `len(s) != len(t)` upfront avoids scanning long unequal strings and guarantees both strings share the same loop bound `0..n - 1`.",
      },
    ],
    practiceTask: {
      title: "Check Valid Anagram with 26-Slot Array",
      tier: "Warmup",
      goal: "Given two lowercase English strings `s` and `t`, return `true` if `t` is an anagram of `s` and `false` otherwise using a fixed 26-slot integer array.",
      constraints: ["1 <= len(s), len(t) <= 10^5", "Lowercase 'a'..'z' only", "Target time: O(n)", "Extra space: O(1)"],
      examples: [
        { input: "s = \"anagram\", t = \"nagaram\"", output: "true" },
        { input: "s = \"rat\", t = \"car\"", output: "false" },
      ],
      tasks: [
        "Return `false` immediately if `len(s) != len(t)`.",
        "Use a single `counts[26]` array with `+1` for `s[i]` and `-1` for `t[i]`, then verify all 26 entries equal `0`.",
      ],
      starterCode: "function is_anagram(s, t):\n    // TODO: O(n) time, O(1) space using counts[26]",
      expectedOutput: "true\nfalse",
      hint: "Index slot `ord(ch) - ord('a')` and remember to check all 26 entries are `0` at the end.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function is_anagram(s, t):\n    if len(s) != len(t):\n        return false\n    counts ← array of 26 zeros\n    for i from 0 to len(s) - 1:\n        counts[ord(s[i]) - ord('a')] += 1\n        counts[ord(t[i]) - ord('a')] -= 1\n    for k from 0 to 25:\n        if counts[k] != 0:\n            return false\n    return true",
    },
    practiceChallenges: [
      {
        title: "Check Valid Anagram with 26-Slot Array",
        tier: "Warmup",
        goal: "Determine whether `t` is a rearrangement of `s` using a single `counts[26]` array.",
        constraints: ["1 <= len(s), len(t) <= 10^5", "Lowercase 'a'..'z' only", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "s = \"anagram\", t = \"nagaram\"", output: "true" },
          { input: "s = \"rat\", t = \"car\"", output: "false" },
        ],
        tasks: ["Fast-reject unequal lengths, apply `+1`/`-1` updates, then verify all 26 slots are `0`."],
        starterCode: "function is_anagram(s, t):\n    // TODO: check anagram using counts[26]",
        expectedOutput: "true\nfalse",
        hint: "Do not sort either string; `26` integers use constant space.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function is_anagram(s, t):\n    if len(s) != len(t):\n        return false\n    counts ← array of 26 zeros\n    for i from 0 to len(s) - 1:\n        counts[ord(s[i]) - ord('a')] += 1\n        counts[ord(t[i]) - ord('a')] -= 1\n    for k from 0 to 25:\n        if counts[k] != 0:\n            return false\n    return true",
      },
      {
        title: "First Non-Repeating Character Index",
        tier: "Core",
        goal: "Given lowercase string `s`, return the 0-based index of the first character whose total frequency in `s` is `1`, or `-1` if none exists.",
        constraints: ["1 <= len(s) <= 10^5", "Lowercase 'a'..'z' only", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "s = \"loveleetcode\"", output: "2", explanation: "'v' at index 2 appears once, before 't', 'c', 'd'." },
          { input: "s = \"aabb\"", output: "-1" },
        ],
        tasks: [
          "Pass 1: increment `counts[ord(ch) - ord('a')]` for every character in `s`.",
          "Pass 2: scan `i` from `0` to `len(s) - 1` and return the first `i` where `counts[ord(s[i]) - ord('a')] == 1`.",
        ],
        starterCode: "function first_unique_char(s):\n    // TODO: two linear passes with counts[26]",
        expectedOutput: "2\n-1",
        hint: "Pass 2 must iterate over `s`, not over `0..25`, so the earliest index in `s` is returned.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function first_unique_char(s):\n    counts ← array of 26 zeros\n    for each ch in s:\n        counts[ord(ch) - ord('a')] += 1\n    for i from 0 to len(s) - 1:\n        if counts[ord(s[i]) - ord('a')] == 1:\n            return i\n    return -1",
      },
      {
        title: "Two-Way Isomorphic Pattern Check",
        tier: "Stretch",
        goal: "Given two ASCII strings `s` and `t`, return `true` if characters in `s` can be replaced one-to-one (preserving order and uniqueness) to form `t`, without using a hash map.",
        constraints: ["1 <= len(s), len(t) <= 10^5", "ASCII characters (0..127)", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "s = \"paper\", t = \"title\"", output: "true", explanation: "'p'->'t', 'a'->'i', 'e'->'l', 'r'->'e'." },
          { input: "s = \"ab\", t = \"aa\"", output: "false", explanation: "Two distinct characters cannot map to 'a'." },
        ],
        tasks: [
          "Allocate `map_s[128]` and `map_t[128]`, each initialized to `-1`.",
          "At each index `i`, check both directions: if unmapped on both sides, bind them; if already mapped, verify both match.",
        ],
        starterCode: "function are_isomorphic(s, t):\n    // TODO: bidirectional mapping with map_s[128] and map_t[128]",
        expectedOutput: "true\nfalse",
        hint: "If `map_s[c1] == -1 and map_t[c2] == -1`, store `map_s[c1] = c2` and `map_t[c2] = c1`. Otherwise, if `map_s[c1] != c2 or map_t[c2] != c1`, return `false`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function are_isomorphic(s, t):\n    if len(s) != len(t):\n        return false\n    map_s ← array of 128 values set to -1\n    map_t ← array of 128 values set to -1\n    for i from 0 to len(s) - 1:\n        c1 ← ord(s[i])\n        c2 ← ord(t[i])\n        if map_s[c1] == -1 and map_t[c2] == -1:\n            map_s[c1] ← c2\n            map_t[c2] ← c1\n        else if map_s[c1] != c2 or map_t[c2] != c1:\n            return false\n    return true",
      },
    ],
  },

  "dsa-string-parsing": {
    lessonId: "dsa-string-parsing",
    subtitle:
      "Build mirror-index palindrome checks, integer parsing with sign and overflow guards, run-length compression, and longest common prefix in O(1) extra space.",
    intro: {
      heading: "Parsing, Palindrome Checks & Run-Length Encoding",
      explanation: [
        "Two silent bugs break almost every first draft of string parsers and encoders: in `atoi`, multiplying `res * 10 + digit` before checking bounds overflows 32-bit integers on `\"2147483649\"`, and in run-length encoding, emitting only on mismatches drops the last run (`\"aaabbc\"` outputs `\"a3b2\"` instead of `\"a3b2c1\"`).",
        "Both bugs vanish with disciplined boundary guards: comparing `res` against `214748364` *before* multiplying by `10`, and flushing `s[n - 1]` with `run_len` right after the loop. Mirror-index palindrome checks (`s[i]` vs `s[n - 1 - i]`) and vertical common-prefix scans likewise run in `O(1)` extra space once bounds are checked first.",
      ],
      analogy:
        "Checking a palindrome folds a paper strip in half so position `0` touches position `n - 1` and position `1` touches `n - 2`; one mismatch stops the check early. Parsing digits into an integer rolls an odometer forward one digit at a time while clamping at the dial limit before it wraps.",
      realWorldUses: [
        "Parsing configuration numbers and command flags with overflow guards in compilers, shells, and JSON/CSV parsers",
        "Compressing repeated telemetry signals, bitmap rows, or DNA stretches with run-length encoding",
      ],
    },
    sections: [
      {
        heading: "Mirror indices, vertical prefix scans, and bounded atoi",
        paragraphs: [
          "To check if `s` of length `n` is a palindrome in `O(n)` time and `O(1)` space, compare `s[i]` against `s[n - 1 - i]` for `i` from `0` to `floor(n / 2) - 1`. For **longest common prefix**, scan column `j` vertically across every `words[w]` and return `slice(words[0], 0, j)` as soon as `j == len(words[w])` (bounds check first!) or `words[w][j] != words[0][j]`.",
          "Trace `parse_int32(\"2147483649\")`: after reading 9 digits, `res = 214748364` and `digit = 9`. Multiplying first produces `2147483649` (32-bit overflow!); checking `res > 214748364 or (res == 214748364 and digit > 7)` *before* multiplying clamps early to `2147483647`. Likewise on `rle_encode(\"aaabbc\")`, `'a'` flushes on `'b'`, `'b'` flushes on `'c'`, and `'c'` only flushes after the loop ends.",
        ],
        code: [
          "// 1. Pre-multiply overflow guard on s = \"2147483649\" (res = 214748364, digit = 9)",
          "res = res * 10 + digit           // Broken: 2147483649 overflows 32-bit int first!",
          "if res > 214748364 or (res == 214748364 and digit > 7):",
          "    return 2147483647            // Working: clamps before multiplying",
          "",
          "// 2. RLE post-loop flush bug on \"aaabbc\"",
          "// Broken loop only emits on s[i] != s[i - 1], dropping final 'c1' -> \"a3b2\"",
          "out.append(s[n - 1]); out.append(str(run_len))   // Working post-loop flush -> \"a3b2c1\"",
        ],
        output: "atoi(\"2147483649\") -> 2147483647 | rle_broken(\"aaabbc\") -> \"a3b2\" | rle_encode -> \"a3b2c1\"",
        table: {
          caption: "Parsing and symmetry patterns covered in this lesson",
          headers: ["Pattern", "Core index / guard rule", "Time", "Extra space"],
          rows: [
            ["Mirror palindrome check", "Compare `s[i]` vs `s[n - 1 - i]` for `i < floor(n / 2)`", "`O(n)`", "`O(1)`"],
            ["Bounded `atoi` parser", "Guard `res > 214748364` or (`res == 214748364` and `digit > 7`) first", "`O(n)`", "`O(1)`"],
            ["Run-length encoding", "Count `run_len`, emit on mismatch, flush final run after loop", "`O(n)`", "`O(n)` buffer"],
            ["Longest common prefix", "Vertical scan `j` across all `words[w][j]` until mismatch", "`O(total chars)`", "`O(1)` (or slice)"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "WATCH OUT",
          text: "In `atoi`, check `res > floor(2147483647 / 10)` or `(res == 214748364 and digit > 7)` (or `digit > 8` when negative) *before* multiplying `res * 10 + digit`. Checking after multiplying overflows 32-bit integers first.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From Buggy Loop Boundaries to Guarded String Parsers",
      steps: [
        {
          label: "Step 1: RLE loop missing empty guard and final flush",
          explanation: "Emitting only inside `else` drops the trailing run (`\"aaabbc\"` outputs `\"a3b2\"`) and crashes on `\"\"`.",
          code: [
            "function rle_broken(s):",
            "    out ← empty char array; run_len ← 1",
            "    for i from 1 to len(s) - 1:",
            "        if s[i] == s[i - 1]: run_len += 1",
            "        else: out.append(s[i - 1]); out.append(str(run_len)); run_len ← 1",
            "    return join(out)",
          ],
          activeLines: [3, 5],
          output: "rle_broken(\"aaabbc\") -> \"a3b2\" (missing c1!)",
        },
        {
          label: "Step 2: Add empty guard and post-loop final-run flush",
          explanation: "Short-circuit `n == 0` and flush `s[n - 1]` with `run_len` right after the `for` loop exits.",
          code: [
            "function rle_encode(s):",
            "    n ← len(s)",
            "    if n == 0: return \"\"",
            "    out ← empty char array; run_len ← 1",
            "    for i from 1 to n - 1:",
            "        if s[i] == s[i - 1]: run_len += 1",
            "        else: out.append(s[i - 1]); out.append(str(run_len)); run_len ← 1",
            "    out.append(s[n - 1]); out.append(str(run_len))",
            "    return join(out)",
          ],
          activeLines: [3, 8],
          output: "rle_encode(\"aaabbc\") -> \"a3b2c1\"",
        },
        {
          label: "Step 3: Guard 32-bit overflow before multiplying in atoi",
          explanation: "Compare `res` against `214748364` and `digit > 7` prior to `res * 10 + digit` so `2147483649` clamps before wrapping.",
          code: [
            "function parse_int32(s):",
            "    // skip spaces & optional '+'/'-' sign to set i and sign",
            "    res ← 0",
            "    while i < len(s) and '0' <= s[i] and s[i] <= '9':",
            "        digit ← ord(s[i]) - ord('0')",
            "        if res > 214748364 or (res == 214748364 and digit > 7):",
            "            return 2147483647 if sign == 1 else -2147483648",
            "        res ← res * 10 + digit; i += 1",
            "    return sign * res",
          ],
          activeLines: [6, 7],
          output: "parse_int32(\"2147483649\") -> 2147483647",
        },
      ],
    },
    walkthrough: {
      title: "Trace run-length encoding and the final-run flush",
      layout: "visual-first",
      steps: [
        {
          title: "Start at i = 1 with run_len = 1: s[1] matches s[0]",
          tag: "CONCEPT",
          explanation: [
            "Given non-empty `s = \"aaabbc\"`, initialize `run_len ← 1` for `s[0] = 'a'` and start scanning at `i = 1`.",
            "Since `s[1] == s[0]` (`'a' == 'a'`), increment `run_len ← 2`. Nothing is written to `out` until a run ends.",
          ],
          code: [
            "run_len ← 1, out ← empty char array",
            "for i from 1 to len(s) - 1:",
            "    if s[i] == s[i - 1]:",
            "        run_len ← run_len + 1",
            "    else: flush s[i - 1] and run_len",
          ],
          activeLines: [1, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "1" },
            { name: "run_len", value: "2", changed: true },
            { name: "out", value: "[]" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input s = \"aaabbc\"",
                cells: [
                  { id: "s0", value: "'a'", index: 0, state: "done" },
                  { id: "s1", value: "'a'", index: 1, state: "active" },
                  { id: "s2", value: "'a'", index: 2 },
                  { id: "s3", value: "'b'", index: 3 },
                  { id: "s4", value: "'b'", index: 4 },
                  { id: "s5", value: "'c'", index: 5 },
                ],
                pointers: [
                  { index: 0, label: "i-1", tone: "accent" },
                  { index: 1, label: "i=1", tone: "ok" },
                ],
              },
              {
                label: "Output buffer out",
                cells: [{ id: "out-empty", value: "·", index: 0, state: "dim" }],
              },
            ],
            caption: "Matching s[i] == s[i - 1] extends the current run without flushing yet.",
          },
        },
        {
          title: "Step i = 2: third 'a' extends run_len to 3",
          tag: "TRACE",
          explanation: [
            "At `i = 2`, `s[2]` is `'a'` which still matches `s[1] = 'a'`.",
            "`run_len` climbs to `3` while `out` remains empty.",
          ],
          code: [
            "// i = 2: s[2] == s[1] ('a' == 'a')",
            "if s[i] == s[i - 1]:",
            "    run_len ← run_len + 1   // 2 -> 3",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "2", changed: true },
            { name: "run_len", value: "3", changed: true },
            { name: "out", value: "[]" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input s = \"aaabbc\"",
                cells: [
                  { id: "s0", value: "'a'", index: 0, state: "done" },
                  { id: "s1", value: "'a'", index: 1, state: "done" },
                  { id: "s2", value: "'a'", index: 2, state: "active" },
                  { id: "s3", value: "'b'", index: 3 },
                  { id: "s4", value: "'b'", index: 4 },
                  { id: "s5", value: "'c'", index: 5 },
                ],
                pointers: [{ index: 2, label: "i=2 (len=3)", tone: "ok" }],
              },
              {
                label: "Output buffer out",
                cells: [{ id: "out-empty", value: "·", index: 0, state: "dim" }],
              },
            ],
            caption: "Three consecutive 'a' characters are now accumulated in run_len.",
          },
        },
        {
          title: "Step i = 3: mismatch 'b' != 'a' flushes \"a3\" and resets run_len",
          tag: "PATTERN",
          explanation: [
            "At `i = 3`, `s[3] = 'b'` differs from `s[2] = 'a'`.",
            "Append `s[2]` (`'a'`) and `str(run_len)` (`'3'`) into `out`, then reset `run_len ← 1` for the new `'b'` run.",
          ],
          code: [
            "else:   // s[3] = 'b' != s[2] = 'a'",
            "    out.append(s[i - 1])",
            "    out.append(str(run_len))",
            "    run_len ← 1",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "3", changed: true },
            { name: "run_len", value: "1 (reset)", changed: true },
            { name: "out", value: "['a', '3']", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input s = \"aaabbc\"",
                cells: [
                  { id: "s0", value: "'a'", index: 0, state: "dim" },
                  { id: "s1", value: "'a'", index: 1, state: "dim" },
                  { id: "s2", value: "'a'", index: 2, state: "done" },
                  { id: "s3", value: "'b'", index: 3, state: "active" },
                  { id: "s4", value: "'b'", index: 4 },
                  { id: "s5", value: "'c'", index: 5 },
                ],
                pointers: [
                  { index: 2, label: "flushed", tone: "ok" },
                  { index: 3, label: "i=3 (new)", tone: "coral" },
                ],
              },
              {
                label: "Output buffer out",
                cells: [
                  { id: "o0", value: "'a'", index: 0, state: "active" },
                  { id: "o1", value: "'3'", index: 1, state: "active" },
                ],
              },
            ],
            caption: "A character change triggers flushing the previous run into the mutable buffer.",
          },
        },
        {
          title: "Step i = 4: second 'b' extends run_len to 2",
          tag: "TRACE",
          explanation: [
            "At `i = 4`, `s[4] = 'b'` matches `s[3] = 'b'`.",
            "`run_len` increments from `1` to `2` without writing to `out` yet.",
          ],
          code: [
            "// i = 4: s[4] == s[3] ('b' == 'b')",
            "if s[i] == s[i - 1]:",
            "    run_len ← run_len + 1   // 1 -> 2",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "4", changed: true },
            { name: "run_len", value: "2", changed: true },
            { name: "out", value: "['a', '3']" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input s = \"aaabbc\"",
                cells: [
                  { id: "s0", value: "'a'", index: 0, state: "dim" },
                  { id: "s1", value: "'a'", index: 1, state: "dim" },
                  { id: "s2", value: "'a'", index: 2, state: "dim" },
                  { id: "s3", value: "'b'", index: 3, state: "done" },
                  { id: "s4", value: "'b'", index: 4, state: "active" },
                  { id: "s5", value: "'c'", index: 5 },
                ],
                pointers: [{ index: 4, label: "i=4 (len=2)", tone: "ok" }],
              },
              {
                label: "Output buffer out",
                cells: [
                  { id: "o0", value: "'a'", index: 0, state: "done" },
                  { id: "o1", value: "'3'", index: 1, state: "done" },
                ],
              },
            ],
            caption: "Matching 'b' increments run_len to 2 while holding off on flushing.",
          },
        },
        {
          title: "Step i = 5: mismatch 'c' != 'b' flushes \"b2\"",
          tag: "TRACE",
          explanation: [
            "At `i = 5`, `s[5] = 'c'` differs from `s[4] = 'b'`, so we flush `'b'` and `'2'` into `out`.",
            "Reset `run_len ← 1` for `'c'`, and now the `for` loop reaches the end of `s` with `'c'` still pending.",
          ],
          code: [
            "else:   // s[5] = 'c' != s[4] = 'b'",
            "    out.append(s[i - 1])",
            "    out.append(str(run_len))",
            "    run_len ← 1   // loop ends after i = 5",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "5 (loop finished)", changed: true },
            { name: "pending run", value: "'c' x 1" },
            { name: "out", value: "['a', '3', 'b', '2']", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input s = \"aaabbc\"",
                cells: [
                  { id: "s0", value: "'a'", index: 0, state: "dim" },
                  { id: "s1", value: "'a'", index: 1, state: "dim" },
                  { id: "s2", value: "'a'", index: 2, state: "dim" },
                  { id: "s3", value: "'b'", index: 3, state: "dim" },
                  { id: "s4", value: "'b'", index: 4, state: "done" },
                  { id: "s5", value: "'c'", index: 5, state: "active" },
                ],
                pointers: [{ index: 5, label: "pending 'c'", tone: "coral" }],
              },
              {
                label: "Output buffer out",
                cells: [
                  { id: "o0", value: "'a'", index: 0, state: "done" },
                  { id: "o1", value: "'3'", index: 1, state: "done" },
                  { id: "o2", value: "'b'", index: 2, state: "active" },
                  { id: "o3", value: "'2'", index: 3, state: "active" },
                ],
              },
            ],
            caption: "When the loop exits at the last index, the final run ('c', count 1) has not been flushed yet.",
          },
        },
        {
          title: "Final flush: emit the trailing run after the loop ends",
          tag: "PITFALL",
          explanation: [
            "Because there is no character after `s[n - 1]` to trigger a mismatch, the last run always remains pending when the loop exits.",
            "Always append `s[n - 1]` and `str(run_len)` right after the loop before calling `join(out)` to get `\"a3b2c1\"`.",
          ],
          code: [
            "// After loop ends:",
            "out.append(s[len(s) - 1])",
            "out.append(str(run_len))",
            "return join(out)   // \"a3b2c1\"",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "out", value: "['a','3','b','2','c','1']", changed: true },
            { name: "Result", value: "\"a3b2c1\"", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input s = \"aaabbc\"",
                cells: [
                  { id: "s0", value: "'a'", index: 0, state: "done" },
                  { id: "s1", value: "'a'", index: 1, state: "done" },
                  { id: "s2", value: "'a'", index: 2, state: "done" },
                  { id: "s3", value: "'b'", index: 3, state: "done" },
                  { id: "s4", value: "'b'", index: 4, state: "done" },
                  { id: "s5", value: "'c'", index: 5, state: "done" },
                ],
              },
              {
                label: "Output buffer out (final run flushed)",
                cells: [
                  { id: "o0", value: "'a'", index: 0, state: "done" },
                  { id: "o1", value: "'3'", index: 1, state: "done" },
                  { id: "o2", value: "'b'", index: 2, state: "done" },
                  { id: "o3", value: "'2'", index: 3, state: "done" },
                  { id: "o4", value: "'c'", index: 4, state: "active" },
                  { id: "o5", value: "'1'", index: 5, state: "active" },
                ],
                pointers: [{ index: 4, label: "post-loop flush", tone: "ok" }],
              },
            ],
            caption: "Flushing s[n - 1] and run_len after the loop completes the compressed string.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Forgetting the post-loop flush in run-length encoding",
        detail:
          "If your loop only writes when `s[i] != s[i - 1]`, the very last run (including a string of all identical letters like `\"aaaa\"`) never hits a mismatch inside the loop. Guard `s == \"\"` early and flush `s[n - 1]` + `run_len` right after the loop.",
      },
      {
        title: "Checking 32-bit overflow after multiplying by 10",
        detail:
          "Writing `res = res * 10 + digit; if res > 2147483647` fails in 32-bit languages because `res * 10` wraps before the comparison runs. Check `res > 214748364` or `(res == 214748364 and digit > 7)` (or `> 8` for negative) before multiplying.",
      },
      {
        title: "Empty input or shorter words in Longest Common Prefix",
        detail:
          "When comparing `words[w][j]` against `words[0][j]`, always check `j == len(words[w])` before indexing `words[w][j]`, otherwise a shorter second word triggers an out-of-bounds read.",
      },
    ],
    practiceTask: {
      title: "Mirror-Index Palindrome Check",
      tier: "Warmup",
      goal: "Given a string `s`, return `true` if it reads the same forward and backward using mirror index arithmetic `i` vs `n - 1 - i` in `O(1)` extra space, without allocating a reversed copy.",
      constraints: ["0 <= len(s) <= 10^5", "Do not reverse or copy the string", "Target time: O(n)", "Extra space: O(1)"],
      examples: [
        { input: "s = \"racecar\"", output: "true" },
        { input: "s = \"robot\"", output: "false", explanation: "s[0] = 'r' != s[4] = 't'." },
      ],
      tasks: [
        "Set `n = len(s)` and loop `i` from `0` to `floor(n / 2) - 1`.",
        "If `s[i] != s[n - 1 - i]`, return `false` immediately; return `true` after the loop.",
      ],
      starterCode: "function is_palindrome(s):\n    // TODO: compare s[i] with s[n - 1 - i] in O(1) space",
      expectedOutput: "true\nfalse",
      hint: "Empty strings (`n = 0`) and 1-char strings (`n = 1`) skip the loop (`floor(n / 2) = 0`) and return `true`.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function is_palindrome(s):\n    n ← len(s)\n    for i from 0 to floor(n / 2) - 1:\n        if s[i] != s[n - 1 - i]:\n            return false\n    return true",
    },
    practiceChallenges: [
      {
        title: "Mirror-Index Palindrome Check",
        tier: "Warmup",
        goal: "Determine if `s` is a palindrome in `O(n)` time and `O(1)` extra space by comparing `s[i]` with `s[n - 1 - i]`.",
        constraints: ["0 <= len(s) <= 10^5", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "s = \"racecar\"", output: "true" },
          { input: "s = \"robot\"", output: "false" },
        ],
        tasks: ["Loop `i` from `0` to `floor(n / 2) - 1` and return `false` on any mismatch."],
        starterCode: "function is_palindrome(s):\n    // TODO: mirror index check without reversing s",
        expectedOutput: "true\nfalse",
        hint: "When `n` is odd, the middle index `floor(n / 2)` mirrors itself and does not need to be checked.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function is_palindrome(s):\n    n ← len(s)\n    for i from 0 to floor(n / 2) - 1:\n        if s[i] != s[n - 1 - i]:\n            return false\n    return true",
      },
      {
        title: "Run-Length Encode Consecutive Runs",
        tier: "Core",
        goal: "Compress `s` by replacing every maximal run of identical consecutive characters with `<char><count>` using an `O(n)` character buffer.",
        constraints: ["0 <= len(s) <= 10^5", "Target: O(n) time, O(n) space"],
        examples: [
          { input: "s = \"aaabbc\"", output: "a3b2c1" },
          { input: "s = \"\"", output: "\"\"", explanation: "Empty input short-circuits to \"\"." },
        ],
        tasks: [
          "Handle `len(s) == 0` by returning `\"\"`.",
          "Count `run_len` from `i = 1`, flush `s[i - 1]` and `str(run_len)` on mismatch, and flush the last run after the loop.",
        ],
        starterCode: "function rle_encode(s):\n    // TODO: run-length encode in O(n) with final-run flush",
        expectedOutput: "a3b2c1\n\"\"",
        hint: "Remember to append `s[n - 1]` and `str(run_len)` after the `for` loop exits.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function rle_encode(s):\n    n ← len(s)\n    if n == 0:\n        return \"\"\n    out ← empty char array\n    run_len ← 1\n    for i from 1 to n - 1:\n        if s[i] == s[i - 1]:\n            run_len ← run_len + 1\n        else:\n            out.append(s[i - 1])\n            out.append(str(run_len))\n            run_len ← 1\n    out.append(s[n - 1])\n    out.append(str(run_len))\n    return join(out)",
      },
      {
        title: "Safe 32-Bit Signed Integer Parser (atoi)",
        tier: "Stretch",
        goal: "Parse a string `s` into a 32-bit signed integer: skip leading `' '`, read optional `'+'` or `'-'`, accumulate digits `'0'..'9'` until a non-digit or end, and clamp to `[-2147483648, 2147483647]` before overflow occurs.",
        constraints: ["0 <= len(s) <= 10^4", "Clamp before 32-bit overflow", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "s = \"   -42xyz\"", output: "-42" },
          { input: "s = \"2147483649\"", output: "2147483647", explanation: "Clamped to INT_MAX before multiplying." },
          { input: "s = \"-91283472332\"", output: "-2147483648", explanation: "Clamped to INT_MIN." },
        ],
        tasks: [
          "Advance index `i` past leading `' '` characters; return `0` if `i == len(s)`.",
          "Check once for `'+'` or `'-'` to set `sign = 1` or `-1`.",
          "Before `res = res * 10 + digit`, check `res > 214748364` or (`res == 214748364` and `digit > 7`), clamping to `2147483647` if `sign == 1` or `-2147483648` if `sign == -1`.",
        ],
        starterCode: "function parse_int32(s):\n    // TODO: whitespace, sign, digit offset, and pre-multiply overflow guard",
        expectedOutput: "-42\n2147483647\n-2147483648",
        hint: "Notice `2147483647` ends in `7` and `-2147483648` ends in `8`. When `res == 214748364` and `digit == 8` with `sign == -1`, returning `-2147483648` directly handles `INT_MIN` without ever computing `+2147483648`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function parse_int32(s):\n    n ← len(s)\n    i ← 0\n    while i < n and s[i] == ' ':\n        i ← i + 1\n    if i == n:\n        return 0\n    sign ← 1\n    if s[i] == '-' or s[i] == '+':\n        if s[i] == '-': sign ← -1\n        i ← i + 1\n    res ← 0\n    while i < n and '0' <= s[i] and s[i] <= '9':\n        digit ← ord(s[i]) - ord('0')\n        if res > 214748364 or (res == 214748364 and digit > 7):\n            if sign == 1: return 2147483647\n            return -2147483648\n        res ← res * 10 + digit\n        i ← i + 1\n    return sign * res",
      },
    ],
  },
};

export const dsaM04PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m4",
  title: "Module 04 Practice Set: Strings",
  description:
    "Four mixed string problems combining ASCII offset math, O(n) character builders, fixed 26-slot counting arrays, and vertical prefix scanning.",
  problems: [
    {
      id: "dsa-m4-p1",
      title: "Normalize Product Tag",
      patternHint: "Use ASCII range checks, uppercase-to-lowercase offset math (+32), and a mutable char buffer joined once in O(n) (Lesson 04-1).",
      lessonRefId: "dsa-string-basics",
      goal: "Given a raw product label `raw`, keep only ASCII letters and digits, convert uppercase `'A'..'Z'` to lowercase, and return the normalized tag in `O(n)` time.",
      constraints: ["0 <= len(raw) <= 10^5", "Do not use repeated s = s + ch concatenation", "Target: O(n) time, O(n) space"],
      examples: [
        { input: "raw = \"SKU-409 Alpha!\"", output: "sku409alpha" },
        { input: "raw = \"!!**!!\"", output: "\"\"", explanation: "Only symbols exist, so the normalized tag is empty." },
      ],
      tasks: [
        "Allocate a mutable character buffer `buf`.",
        "For each character, keep `'a'..'z'` and `'0'..'9'`, fold `'A'..'Z'` with `ord(ch) - ord('A') + ord('a')`, and ignore all other characters.",
        "Join `buf` once after the loop.",
      ],
      starterCode: "function normalize_product_tag(raw):\n    // TODO: O(n) buffer build with ASCII offset math",
      expectedOutput: "sku409alpha\n\"\"",
      hint: "Appending to a mutable array and joining once avoids the `O(n²)` prefix copying of `out = out + ch`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "function normalize_product_tag(raw):\n    buf ← empty char array\n    for each ch in raw:\n        if ('a' <= ch and ch <= 'z') or ('0' <= ch and ch <= '9'):\n            buf.append(ch)\n        else if 'A' <= ch and ch <= 'Z':\n            buf.append(chr(ord(ch) - ord('A') + ord('a')))\n    return join(buf)",
    },
    {
      id: "dsa-m4-p2",
      title: "Verify Scrambled Access Key",
      patternHint: "Use a single 26-slot integer array with +1/-1 balance cancellation instead of O(n log n) sorting (Lesson 04-2).",
      lessonRefId: "dsa-string-frequency",
      goal: "Given two lowercase access strings `key_a` and `key_b`, return `true` if `key_b` can be formed by rearranging all characters of `key_a`.",
      constraints: ["1 <= len(key_a), len(key_b) <= 10^5", "Lowercase 'a'..'z' only", "Target: O(n) time, O(1) extra space"],
      examples: [
        { input: "key_a = \"secure\", key_b = \"rescue\"", output: "true" },
        { input: "key_a = \"token\", key_b = \"taken\"", output: "false" },
      ],
      tasks: [
        "Check `len(key_a) == len(key_b)` first.",
        "Walk both strings once updating `counts[ord(ch) - ord('a')]` with `+1` for `key_a` and `-1` for `key_b`, then confirm every slot equals `0`.",
      ],
      starterCode: "function can_rearrange_key(key_a, key_b):\n    // TODO: verify exact letter match in O(n) time, O(1) space",
      expectedOutput: "true\nfalse",
      hint: "Using a fixed 26-integer array uses `O(1)` auxiliary space regardless of string length.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function can_rearrange_key(key_a, key_b):\n    if len(key_a) != len(key_b):\n        return false\n    counts ← array of 26 zeros\n    for i from 0 to len(key_a) - 1:\n        counts[ord(key_a[i]) - ord('a')] += 1\n        counts[ord(key_b[i]) - ord('a')] -= 1\n    for k from 0 to 25:\n        if counts[k] != 0:\n            return false\n    return true",
    },
    {
      id: "dsa-m4-p3",
      title: "Earliest Solo Signal Index",
      patternHint: "Count frequencies in Pass 1 with counts[26], then walk the original string in Pass 2 to preserve appearance order (Lesson 04-2).",
      lessonRefId: "dsa-string-frequency",
      goal: "Given a lowercase signal log `stream`, return the 0-based index of the earliest character that occurs exactly once in `stream`, or `-1` if every character repeats.",
      constraints: ["1 <= len(stream) <= 10^5", "Lowercase 'a'..'z' only", "Target: O(n) time, O(1) extra space"],
      examples: [
        { input: "stream = \"aabcbd\"", output: "3", explanation: "'c' at index 3 is the first character with total count 1 ('d' appears later at index 5)." },
        { input: "stream = \"xyxy\"", output: "-1" },
      ],
      tasks: [
        "Pass 1: tally character counts into `counts[26]`.",
        "Pass 2: scan `i` from `0` to `len(stream) - 1` and return the first `i` where `counts[ord(stream[i]) - ord('a')] == 1`.",
      ],
      starterCode: "function earliest_solo_signal(stream):\n    // TODO: return earliest index of a count-1 character, or -1",
      expectedOutput: "3\n-1",
      hint: "Do not loop over `counts[0..25]` in Pass 2; loop over `stream` left to right so you return the earliest position.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function earliest_solo_signal(stream):\n    counts ← array of 26 zeros\n    for each ch in stream:\n        counts[ord(ch) - ord('a')] += 1\n    for i from 0 to len(stream) - 1:\n        if counts[ord(stream[i]) - ord('a')] == 1:\n            return i\n    return -1",
    },
    {
      id: "dsa-m4-p4",
      title: "Find Shared Leading Command",
      patternHint: "Scan column j vertically across all words until any word ends or differs from words[0][j] (Lesson 04-3).",
      lessonRefId: "dsa-string-parsing",
      goal: "Given a non-empty list of command strings `commands`, return the longest leading string shared by every command in `commands` (or `\"\"` if none).",
      constraints: ["1 <= len(commands) <= 200", "0 <= len(commands[i]) <= 200", "Target: O(total characters) time, O(1) extra space beyond output"],
      examples: [
        { input: "commands = [\"deploy-app\", \"deploy-api\", \"deploy\"]", output: "deploy" },
        { input: "commands = [\"build\", \"test\", \"lint\"]", output: "\"\"", explanation: "Column 0 already differs across commands, returning \"\"." },
      ],
      tasks: [
        "Loop column `j` from `0` to `len(commands[0]) - 1`.",
        "For each `w` from `1` to `len(commands) - 1`, if `j == len(commands[w])` or `commands[w][j] != commands[0][j]`, return `commands[0][0..j-1]`.",
        "If the outer loop completes, return `commands[0]`.",
      ],
      starterCode: "function shared_leading_command(commands):\n    // TODO: vertical column scan across commands",
      expectedOutput: "deploy\n\"\"",
      hint: "Check `j == len(commands[w])` before reading `commands[w][j]` so shorter strings never cause an out-of-bounds error.",
      complexity: { time: "O(total_chars)", space: "O(1)" },
      solutionCode:
        "function shared_leading_command(commands):\n    if len(commands) == 0:\n        return \"\"\n    for j from 0 to len(commands[0]) - 1:\n        ch ← commands[0][j]\n        for w from 1 to len(commands) - 1:\n            if j == len(commands[w]) or commands[w][j] != ch:\n                return slice(commands[0], 0, j)\n    return commands[0]",
    },
  ],
};
