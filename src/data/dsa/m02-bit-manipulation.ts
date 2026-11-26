import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM02Lessons: Record<string, LessonContent> = {
  "dsa-binary-bitwise": {
    lessonId: "dsa-binary-bitwise",
    subtitle:
      "Read base-2 place values, combine bit patterns with AND, OR, XOR, NOT, and shifts, and test parity in one bit check.",
    intro: {
      heading: "Binary Representation & Bitwise Operators",
      explanation: [
        "Write `if n & 1 == 0` in C++, Java, JavaScript, or Python and it evaluates `n & (1 == 0)` (`n & 0 = 0`, always false) because `==` binds tighter than `&`. Meanwhile, `(-3) % 2` gives `-1` instead of `1` in C++/JS, breaking odd-number checks. Parenthesizing `(n & 1) == 1` reads only the `2^0` bit and works consistently even on negative numbers.",
        "Computers store every integer as a row of base-2 **bits** (`0` or `1`) with weights `1, 2, 4, 8, 16, ...`. **Bitwise operators** (`&`, `|`, `^`, `~`, `<<`, `>>`) process all bit columns in parallel inside the CPU in `O(1)` time.",
      ],
      analogy:
        "A row of wall switches labeled `32, 16, 8, 4, 2, 1` represents binary digits: flipping switches ON (`1`) and adding their labels builds any non-negative integer, while bitwise operators compare or shift whole rows in one step.",
      realWorldUses: [
        "Packing multiple boolean permissions (read, write, execute) into one compact integer status field",
        "Fast parity checks, power-of-two size alignment, and halving or doubling in low-level systems",
      ],
    },
    sections: [
      {
        heading: "Base-2 place values and bitwise operators",
        paragraphs: [
          "To convert `13` to binary, pick the powers of `2` that sum to `13`: `8 + 4 + 1`, which turns on bits `3`, `2`, and `0` (`001101` in 6-bit form).",
          "Bitwise operators compare aligned bit columns independently. Unlike logical `&&` or `||` (which treat any nonzero integer as `true`), `&`, `|`, and `^` compute a fresh `0` or `1` at every single bit position.",
        ],
        table: {
          caption: "Bitwise operators demonstrated with a = 6 (0110) and b = 3 (0011)",
          headers: ["Operator", "Symbol", "Bit-by-bit rule", "Example", "Decimal result"],
          rows: [
            ["AND", "`&`", "`1` only when both bits are `1`", "`0110 & 0011 = 0010`", "`2`"],
            ["OR", "`|`", "`1` when at least one bit is `1`", "`0110 | 0011 = 0111`", "`7`"],
            ["XOR", "`^`", "`1` when the two bits differ", "`0110 ^ 0011 = 0101`", "`5`"],
            ["NOT", "`~`", "Flips every bit (`0 <-> 1`), including sign bit", "`~6 = -7` (two's complement)", "`-7`"],
            ["Left shift", "`<<`", "Slides bits left by `k`, fills `0` on the right", "`0011 << 2 = 1100`", "`12` (`3 * 4`)"],
            ["Right shift", "`>>`", "Slides non-negative bits right by `k`, drops low bits", "`1101 >> 1 = 0110`", "`6` (`floor(13 / 2)`)"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Every bit at position k >= 1 represents an even value (2, 4, 8, 16, ...). Only bit 0 (value 1) can make a number odd, so (n & 1) == 1 always checks oddness.",
        },
      },
      {
        heading: "Parity checks (`n & 1`) and signed bitwise NOT (`~n`)",
        paragraphs: [
          "Masking `n & 1` zeroes out every bit above index `0` and leaves only the `2^0` bit. Even for negative integers in two's complement, `(-3) & 1` evaluates to `1`, whereas `-3 % 2` produces `-1` in languages like C, Java, and JavaScript.",
          "Unary `~n` flips every bit in the integer word. Computers store negatives using **two's complement** (flipping every bit of nonnegative `x` in an `N`-bit signed word leaves `2^N - 1 - x`, which encodes `-(x + 1)` so `~5 == -6`, `~(-1) == 0`, and `0 & -1 == 0` across infinite leading `1`s in Python).",
        ],
        code: [
          "// Broken precedence & negative modulo:",
          "12 & 1 == 0          // Parses as 12 & (1 == 0) = 0 -> FALSE!",
          "(-3) % 2 == 1        // In C/Java/JS: -1 == 1 -> FALSE!",
          "// Working parenthesized bitwise parity:",
          "(12 & 1) == 0        // 0 == 0 -> TRUE",
          "((-3) & 1) == 1      // 1 == 1 -> TRUE",
        ],
        output: "Broken: (12 & 1 == 0) -> false | Working: ((12 & 1) == 0) -> true",
        table: {
          caption: "Comparing n & 1 against modulo and ~n in 32-bit signed integers",
          headers: ["Input `n`", "Low 4 bits", "`n & 1`", "`n % 2` (C/JS)", "`~n` (`-(n + 1)`)"],
          rows: [
            ["`0`", "`0000`", "`0` (even)", "`0`", "`-1`"],
            ["`5`", "`0101`", "`1` (odd)", "`1`", "`-6`"],
            ["`12`", "`1100`", "`0` (even)", "`0`", "`-13`"],
            ["`-3`", "`...1101`", "`1` (odd)", "`-1`", "`2`"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "WATCH OUT",
          text: "In C, C++, Java, JavaScript, and Python, == binds tighter than &. Writing n & 1 == 0 parses as n & (1 == 0), which equals 0! Always write (n & 1) == 0 with parentheses.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Fix Operator Precedence and Extract Bit Slices With Masks",
      subtitle: "Move from a precedence trap to reliable parity checks and contiguous bit slicing.",
      steps: [
        {
          label: "Step 1: Broken precedence (== runs before &)",
          explanation: "Without parentheses, `n & 1 == 0` evaluates `1 == 0` (`0`) first, then computes `n & 0`, which is always `0`.",
          code: [
            "function is_even_broken(n):",
            "    return n & 1 == 0      // BUG: evaluates n & (1 == 0) -> 0",
          ],
          activeLines: [2],
          output: "is_even_broken(12) -> 0 (false!)",
        },
        {
          label: "Step 2: Parenthesize (n & 1) before comparing",
          explanation: "Parentheses force `&` to isolate bit `0` before `== 0` runs, giving exact parity even on negative numbers.",
          code: [
            "function is_even(n):",
            "    return (n & 1) == 0",
          ],
          activeLines: [2],
          output: "is_even(12) -> true | is_even(-3) -> false",
        },
        {
          label: "Step 3: Combine >> and & to extract bit slice [lo..hi]",
          explanation: "Shifting right by `lo` moves bit `lo` to position `0`, and masking with `(1 << width) - 1` keeps only the lowest `width` bits.",
          code: [
            "function extract_slice(n, lo, hi):",
            "    width ← hi - lo + 1",
            "    mask ← (1 << width) - 1",
            "    return (n >> lo) & mask",
          ],
          activeLines: [2, 3, 4],
          output: "extract_slice(214, 2, 5) -> 5",
        },
      ],
    },
    walkthrough: {
      title: "Trace binary place values, bitwise operators, shifts, and parity",
      layout: "visual-first",
      steps: [
        {
          title: "Read decimal 13 as base-2 place values",
          tag: "CONCEPT",
          explanation: [
            "Write `13` in 6-bit binary: `8 + 4 + 1 = 13`, so bits `3`, `2`, and `0` are `1` while bits `5`, `4`, and `1` are `0`.",
            "Click any bit cell below to inspect its position index from `0` (rightmost `1`s place) to `5` (leftmost `32`s place).",
          ],
          code: [
            "n ← 13                // 8 + 4 + 1 = 001101",
            "// weights: [32, 16, 8, 4, 2, 1]",
            "// bits:    [ 0,  0, 1, 1, 0, 1]",
          ],
          activeLines: [1, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Decimal n", value: "13" },
            { name: "Active weights", value: "8 + 4 + 1" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "n = 13 in 6-bit binary (weights 32, 16, 8, 4, 2, 1)",
                cells: [
                  { id: "n-b5", value: "0", index: 5, state: "dim" },
                  { id: "n-b4", value: "0", index: 4, state: "dim" },
                  { id: "n-b3", value: "1", index: 3, state: "active" },
                  { id: "n-b2", value: "1", index: 2, state: "active" },
                  { id: "n-b1", value: "0", index: 1, state: "dim" },
                  { id: "n-b0", value: "1", index: 0, state: "active" },
                ],
                pointers: [
                  { index: 2, label: "+8", tone: "accent" },
                  { index: 3, label: "+4", tone: "accent" },
                  { index: 5, label: "+1 (LSB)", tone: "coral" },
                ],
              },
            ],
            caption: "Summing the weights of every 1-bit recovers the decimal value: 8 + 4 + 1 = 13.",
          },
        },
        {
          title: "Combine aligned columns with AND (&)",
          tag: "TRACE",
          explanation: [
            "Align `a = 13 (001101)` above `b = 10 (001010)` and apply `&` to each column independently.",
            "Only bit `3` (weight `8`) has `1` in both numbers, so `13 & 10` evaluates to `001000` (`8`).",
          ],
          code: [
            "a ← 13                // 001101",
            "b ← 10                // 001010",
            "both ← a & b          // 001000 = 8",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "a", value: "13 (001101)" },
            { name: "b", value: "10 (001010)" },
            { name: "a & b", value: "8 (001000)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "a = 13 (001101)",
                cells: [
                  { id: "a-b5", value: "0", index: 5, state: "dim" },
                  { id: "a-b4", value: "0", index: 4, state: "dim" },
                  { id: "a-b3", value: "1", index: 3, state: "active" },
                  { id: "a-b2", value: "1", index: 2 },
                  { id: "a-b1", value: "0", index: 1, state: "dim" },
                  { id: "a-b0", value: "1", index: 0 },
                ],
                pointers: [{ index: 2, label: "1", tone: "ok" }],
              },
              {
                label: "b = 10 (001010)",
                cells: [
                  { id: "b-b5", value: "0", index: 5, state: "dim" },
                  { id: "b-b4", value: "0", index: 4, state: "dim" },
                  { id: "b-b3", value: "1", index: 3, state: "active" },
                  { id: "b-b2", value: "0", index: 2, state: "dim" },
                  { id: "b-b1", value: "1", index: 1 },
                  { id: "b-b0", value: "0", index: 0, state: "dim" },
                ],
                pointers: [{ index: 2, label: "1", tone: "ok" }],
              },
              {
                label: "a & b = 8 (001000)",
                cells: [
                  { id: "r-b5", value: "0", index: 5, state: "dim" },
                  { id: "r-b4", value: "0", index: 4, state: "dim" },
                  { id: "r-b3", value: "1", index: 3, state: "done" },
                  { id: "r-b2", value: "0", index: 2, state: "dim" },
                  { id: "r-b1", value: "0", index: 1, state: "dim" },
                  { id: "r-b0", value: "0", index: 0, state: "dim" },
                ],
                pointers: [{ index: 2, label: "both 1 -> 1", tone: "ok" }],
              },
            ],
            caption: "AND keeps only the positions where both inputs have a 1-bit.",
          },
        },
        {
          title: "Detect differing columns with XOR (^)",
          tag: "TRACE",
          explanation: [
            "Using the same `a = 13 (001101)` and `b = 10 (001010)`, XOR outputs `1` wherever the two bits are opposite (`1 ^ 0` or `0 ^ 1`).",
            "Bit `3` (`1 ^ 1`) cancels to `0`, while bits `2`, `1`, and `0` differ and turn ON, giving `000111` (`7`).",
          ],
          code: [
            "a ← 13                // 001101",
            "b ← 10                // 001010",
            "diff ← a ^ b          // 000111 = 7",
          ],
          activeLines: [3],
          codeLabel: "Pseudocode",
          state: [
            { name: "a", value: "13 (001101)" },
            { name: "b", value: "10 (001010)" },
            { name: "a ^ b", value: "7 (000111)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "a = 13 (001101)",
                cells: [
                  { id: "a-b5", value: "0", index: 5, state: "dim" },
                  { id: "a-b4", value: "0", index: 4, state: "dim" },
                  { id: "a-b3", value: "1", index: 3, state: "dim" },
                  { id: "a-b2", value: "1", index: 2, state: "active" },
                  { id: "a-b1", value: "0", index: 1, state: "active" },
                  { id: "a-b0", value: "1", index: 0, state: "active" },
                ],
              },
              {
                label: "b = 10 (001010)",
                cells: [
                  { id: "b-b5", value: "0", index: 5, state: "dim" },
                  { id: "b-b4", value: "0", index: 4, state: "dim" },
                  { id: "b-b3", value: "1", index: 3, state: "dim" },
                  { id: "b-b2", value: "0", index: 2, state: "active" },
                  { id: "b-b1", value: "1", index: 1, state: "active" },
                  { id: "b-b0", value: "0", index: 0, state: "active" },
                ],
              },
              {
                label: "a ^ b = 7 (000111)",
                cells: [
                  { id: "r-b5", value: "0", index: 5, state: "dim" },
                  { id: "r-b4", value: "0", index: 4, state: "dim" },
                  { id: "r-b3", value: "0", index: 3, state: "dim" },
                  { id: "r-b2", value: "1", index: 2, state: "done" },
                  { id: "r-b1", value: "1", index: 1, state: "done" },
                  { id: "r-b0", value: "1", index: 0, state: "done" },
                ],
                highlightRange: [3, 5],
                pointers: [
                  { index: 3, label: "differ", tone: "coral" },
                  { index: 5, label: "differ", tone: "coral" },
                ],
              },
            ],
            caption: "XOR lights up every bit column where a and b disagree.",
          },
        },
        {
          title: "Slide bits with left shift (<<) and right shift (>>)",
          tag: "TRACE",
          explanation: [
            "Shifting `x = 6 (000110)` left by `1` moves every bit up one weight slot and inserts a `0` at bit `0`, turning `4 + 2` into `8 + 4 = 12`.",
            "Shifting `x = 6 (000110)` right by `1` drops bit `0` and halves every remaining weight, giving `000011` (`3`).",
          ],
          code: [
            "x ← 6                 // 000110",
            "doubled ← x << 1      // 001100 = 12",
            "halved ← x >> 1       // 000011 = 3",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "x = 6",
              "doubled = x << 1  # 12",
              "halved = x >> 1   # 3",
            ],
            activeLines: [2, 3],
          },
          state: [
            { name: "x", value: "6 (000110)" },
            { name: "x << 1", value: "12 (001100)", changed: true },
            { name: "x >> 1", value: "3 (000011)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Original x = 6 (000110)",
                cells: [
                  { id: "x-b5", value: "0", index: 5, state: "dim" },
                  { id: "x-b4", value: "0", index: 4, state: "dim" },
                  { id: "x-b3", value: "0", index: 3, state: "dim" },
                  { id: "x-b2", value: "1", index: 2, state: "active" },
                  { id: "x-b1", value: "1", index: 1, state: "active" },
                  { id: "x-b0", value: "0", index: 0, state: "dim" },
                ],
              },
              {
                label: "x << 1 = 12 (001100)",
                cells: [
                  { id: "l-b5", value: "0", index: 5, state: "dim" },
                  { id: "l-b4", value: "0", index: 4, state: "dim" },
                  { id: "l-b3", value: "1", index: 3, state: "done" },
                  { id: "l-b2", value: "1", index: 2, state: "done" },
                  { id: "l-b1", value: "0", index: 1, state: "dim" },
                  { id: "l-b0", value: "0", index: 0, state: "pivot" },
                ],
                pointers: [{ index: 5, label: "0 fills in", tone: "coral" }],
              },
              {
                label: "x >> 1 = 3 (000011)",
                cells: [
                  { id: "r-b5", value: "0", index: 5, state: "dim" },
                  { id: "r-b4", value: "0", index: 4, state: "dim" },
                  { id: "r-b3", value: "0", index: 3, state: "dim" },
                  { id: "r-b2", value: "0", index: 2, state: "dim" },
                  { id: "r-b1", value: "1", index: 1, state: "done" },
                  { id: "r-b0", value: "1", index: 0, state: "done" },
                ],
                pointers: [{ index: 5, label: "low bit shifted out", tone: "accent" }],
              },
            ],
            caption: "Left shift multiplies by 2; right shift divides by 2 and truncates toward zero for non-negative integers.",
          },
        },
        {
          title: "Test parity in O(1) with n & 1",
          tag: "PATTERN",
          explanation: [
            "Masking `n = 13` with `1` (`000001`) sets bits `5..1` to `0` regardless of what `n` holds in those higher slots.",
            "Only bit `0` survives: if `(n & 1) == 1`, `n` is odd; if `(n & 1) == 0`, `n` is even.",
          ],
          callout: {
            kind: "RULE OF THUMB",
            text: "Wrap (n & 1) in parentheses before comparing with == or !=.",
          },
          code: [
            "n ← 13                    // 001101",
            "mask ← 1                  // 000001",
            "is_odd ← (n & mask) == 1  // true",
          ],
          activeLines: [3],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "n = 13",
              "mask = 1",
              "is_odd = (n & mask) == 1  # True (parenthesize before ==)",
            ],
            activeLines: [3],
          },
          state: [
            { name: "n", value: "13 (001101)" },
            { name: "n & 1", value: "1 (odd)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "n = 13 (001101)",
                cells: [
                  { id: "p-n5", value: "0", index: 5, state: "dim" },
                  { id: "p-n4", value: "0", index: 4, state: "dim" },
                  { id: "p-n3", value: "1", index: 3 },
                  { id: "p-n2", value: "1", index: 2 },
                  { id: "p-n1", value: "0", index: 1, state: "dim" },
                  { id: "p-n0", value: "1", index: 0, state: "active" },
                ],
                pointers: [{ index: 5, label: "bit 0 = 1", tone: "coral" }],
              },
              {
                label: "mask = 1 (000001)",
                cells: [
                  { id: "p-m5", value: "0", index: 5, state: "dim" },
                  { id: "p-m4", value: "0", index: 4, state: "dim" },
                  { id: "p-m3", value: "0", index: 3, state: "dim" },
                  { id: "p-m2", value: "0", index: 2, state: "dim" },
                  { id: "p-m1", value: "0", index: 1, state: "dim" },
                  { id: "p-m0", value: "1", index: 0, state: "active" },
                ],
              },
              {
                label: "n & 1 = 1 (000001)",
                cells: [
                  { id: "p-r5", value: "0", index: 5, state: "dim" },
                  { id: "p-r4", value: "0", index: 4, state: "dim" },
                  { id: "p-r3", value: "0", index: 3, state: "dim" },
                  { id: "p-r2", value: "0", index: 2, state: "dim" },
                  { id: "p-r1", value: "0", index: 1, state: "dim" },
                  { id: "p-r0", value: "1", index: 0, state: "done" },
                ],
                pointers: [{ index: 5, label: "odd!", tone: "ok" }],
              },
            ],
            caption: "All higher even-weighted bits are zeroed by mask 1, isolating bit 0.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Bitwise & has lower precedence than ==",
        detail:
          "Writing `if n & 1 == 0` evaluates `1 == 0` (`false` / `0`) first, then `n & 0`, which is always `0` (`false`). Always write `if (n & 1) == 0`.",
        code: "// Wrong: n & (1 == 0) -> 0\nif (n & 1 == 0)\n\n// Right:\nif ((n & 1) == 0)",
      },
      {
        title: "Bitwise NOT (~) is not boolean NOT (!)",
        detail:
          "`~n` flips every bit in the integer word (`~0` becomes `-1`, which is still truthy in languages where nonzero is true). For two's complement signed integers, `~n == -(n + 1)`.",
      },
      {
        title: "Shift overflow and negative right shifts",
        detail:
          "Shifting `1 << 31` or higher can overflow a signed 32-bit integer, and right-shifting negative numbers duplicates the sign bit in many languages. Use 64-bit unsigned or `1L << k` when shifts reach 31 or above.",
      },
    ],
    practiceTask: {
      title: "Parity and Half-Step Using Bitwise Operators",
      tier: "Warmup",
      goal: "Given a non-negative integer `n`, return a pair `(parity, half)` where `parity` is `\"odd\"` or `\"even\"` and `half` is `floor(n / 2)`, computed using only `&` and `>>`.",
      constraints: ["0 <= n <= 10^9", "Do not use `%` or `/`", "Target time: O(1), space: O(1)"],
      examples: [
        { input: "n = 13", output: "(\"odd\", 6)", explanation: "13 & 1 is 1 (odd), and 13 >> 1 is 6." },
        { input: "n = 8", output: "(\"even\", 4)", explanation: "8 & 1 is 0 (even), and 8 >> 1 is 4." },
      ],
      tasks: [
        "Check `(n & 1) == 1` to decide between `\"odd\"` and `\"even\"`.",
        "Compute `n >> 1` to drop the lowest bit and halve `n`.",
      ],
      starterCode:
        "function parity_and_half(n):\n    // TODO: use & 1 and >> 1 without % or /\n    return (parity, half)",
      expectedOutput: "(\"odd\", 6)\n(\"even\", 4)",
      hint: "Keep parentheses around `(n & 1)` before comparing to `1`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "function parity_and_half(n):\n    if (n & 1) == 1:\n        parity ← \"odd\"\n    else:\n        parity ← \"even\"\n    half ← n >> 1\n    return (parity, half)",
    },
    practiceChallenges: [
      {
        title: "Parity and Half-Step Using Bitwise Operators",
        tier: "Warmup",
        goal: "Given a non-negative integer `n`, return `(parity, floor(n / 2))` using only `&` and `>>`.",
        constraints: ["0 <= n <= 10^9", "Do not use `%` or `/`", "Target: O(1) time, O(1) space"],
        examples: [
          { input: "n = 13", output: "(\"odd\", 6)" },
          { input: "n = 8", output: "(\"even\", 4)" },
        ],
        tasks: [
          "Test `(n & 1) == 1` for parity.",
          "Shift right with `n >> 1` for `floor(n / 2)`.",
        ],
        starterCode:
          "function parity_and_half(n):\n    // TODO: compute parity and half via & and >>",
        expectedOutput: "(\"odd\", 6)\n(\"even\", 4)",
        hint: "Parenthesize `(n & 1)` so operator precedence never trips you up.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "function parity_and_half(n):\n    parity ← \"even\"\n    if (n & 1) == 1:\n        parity ← \"odd\"\n    return (parity, n >> 1)",
      },
      {
        title: "Scale by a Power of Two Without Multiplication",
        tier: "Core",
        goal: "Given non-negative integer `x` and shift `k`, return `(x * 2^k, floor(x / 2^k))` using only bit shifts.",
        constraints: ["0 <= x <= 10^6", "0 <= k <= 20", "Use 64-bit integer arithmetic", "Target: O(1)"],
        examples: [
          { input: "x = 5, k = 3", output: "(40, 0)", explanation: "5 << 3 = 40 and 5 >> 3 = 0." },
          { input: "x = 19, k = 2", output: "(76, 4)", explanation: "19 << 2 = 76 and 19 >> 2 = 4." },
        ],
        tasks: [
          "Compute `up = x << k`.",
          "Compute `down = x >> k` and return `(up, down)`.",
        ],
        starterCode:
          "function scale_pow2(x, k):\n    // TODO: return (x * 2^k, floor(x / 2^k)) via shifts",
        expectedOutput: "(40, 0)\n(76, 4)",
        hint: "Left shift by `k` multiplies by `2^k`; right shift by `k` divides by `2^k`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "function scale_pow2(x, k):\n    return (x << k, x >> k)",
      },
      {
        title: "Extract a Contiguous Bit Slice",
        tier: "Stretch",
        goal: "Given non-negative integer `n` and inclusive bit bounds `lo` and `hi` (`0 <= lo <= hi <= 15`), extract bits `[lo..hi]` and return them shifted down to start at bit `0`.",
        constraints: ["0 <= n <= 65535", "0 <= lo <= hi <= 15", "Target: O(1) time, O(1) space"],
        examples: [
          {
            input: "n = 214, lo = 2, hi = 5",
            output: "5",
            explanation: "214 is 11010110; bits 5..2 are 0101, which equals 5.",
          },
          {
            input: "n = 45, lo = 0, hi = 3",
            output: "13",
            explanation: "45 is 101101; bits 3..0 are 1101, which equals 13.",
          },
        ],
        tasks: [
          "Shift `n` right by `lo` so bit `lo` moves to bit `0`.",
          "Build a `width`-bit mask `(1 << (hi - lo + 1)) - 1` and `&` it with the shifted value.",
        ],
        starterCode:
          "function extract_bit_slice(n, lo, hi):\n    // TODO: shift down by lo, mask width (hi - lo + 1) bits",
        expectedOutput: "5\n13",
        hint: "A run of `w` consecutive `1`-bits at the bottom equals `(1 << w) - 1`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "function extract_bit_slice(n, lo, hi):\n    width ← hi - lo + 1\n    mask ← (1 << width) - 1\n    return (n >> lo) & mask",
      },
    ],
  },

  "dsa-bit-tricks": {
    lessonId: "dsa-bit-tricks",
    subtitle:
      "Target any k-th bit with 1 << k, detect powers of two in O(1), and count set bits by stripping the lowest 1-bit.",
    intro: {
      heading: "Single-Bit Masks, Power of Two & Set Bit Count",
      explanation: [
        "Test whether bit `1` of `n = 10` (`1010`) is set using `(10 & (1 << 1)) == 1`, and it returns `false`—because `10 & 2` equals `2`, not `1`! Similarly, testing power-of-two with `(n & (n - 1)) == 0` without `n > 0` falsely reports `n = 0` as a power of two (`0 & -1 == 0`).",
        "Shifting `1` left by `k` slots (`1 << k`) isolates bit `k` for `O(1)` check, set, clear, and toggle edits. Meanwhile, subtracting `1` borrows from the rightmost `1`-bit, so `n & (n - 1)` erases the lowest `1`-bit in one step—powering both the `O(1)` power-of-two check and Brian Kernighan's set-bit counting loop.",
      ],
      analogy:
        "A mask `1 << k` is a pinpoint stencil that covers every switch except switch `#k`. Meanwhile, `n & (n - 1)` snaps off whichever active light is closest to the right edge in one motion, skipping every dark switch in between.",
      realWorldUses: [
        "Toggling, enabling, and reading individual flags inside compact bitfields in O(1) time",
        "Verifying power-of-two buffer capacities and counting bit differences (Hamming distance) between codes",
      ],
    },
    sections: [
      {
        heading: "Checking, setting, clearing, and toggling bit k",
        paragraphs: [
          "Bit `k` uses 0-based indexing from the right (`k = 0` is the `1`s place, `k = 1` is the `2`s place). Once you form `mask = 1 << k`, four patterns cover every single-bit edit.",
          "To clear bit `k`, invert the mask with `~mask` so every bit except `k` is `1`, then `&` with `n`. Only position `k` gets forced to `0`.",
        ],
        code: [
          "// Broken bit check for k > 0:",
          "(10 & (1 << 1)) == 1       // 10 & 2 = 2 != 1 -> FALSE (BUG!)",
          "// Working bit check:",
          "((10 >> 1) & 1) == 1       // 5 & 1 = 1 -> TRUE",
          "(10 & (1 << 1)) != 0       // 2 != 0 -> TRUE",
        ],
        output: "Broken: 2 == 1 -> false | Working: (10 >> 1) & 1 -> 1 (true)",
        table: {
          caption: "Single-bit operations using mask = 1 << k (demonstrated with n = 10 = 1010)",
          headers: ["Operation", "Formula", "Effect on bit k", "Example (`n = 10 = 1010`)"],
          rows: [
            ["Check bit `k`", "`(n >> k) & 1`", "Returns `1` or `0`", "`(10 >> 1) & 1 = 1`"],
            ["Check (boolean)", "`(n & (1 << k)) != 0`", "Returns `true` or `false`", "`(10 & (1 << 2)) != 0` is `false`"],
            ["Set bit `k`", "`n | (1 << k)`", "Forces bit `k` to `1`", "`10 | (1 << 2) = 14` (`1110`)"],
            ["Clear bit `k`", "`n & ~(1 << k)`", "Forces bit `k` to `0`", "`10 & ~(1 << 1) = 8` (`1000`)"],
            ["Toggle bit `k`", "`n ^ (1 << k)`", "Flips `0 <-> 1` at bit `k`", "`10 ^ (1 << 3) = 2` (`0010`)"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "RULE OF THUMB",
          text: "Avoid writing (n & (1 << k)) == 1 when k > 0. The result of n & (1 << k) is either 0 or 2^k, not 1. Use (n & (1 << k)) != 0 or (n >> k) & 1 instead.",
        },
      },
      {
        heading: "Why n & (n - 1) detects powers of two and counts set bits",
        paragraphs: [
          "Take any positive integer such as `n = 12 (1100)`. Subtracting `1` borrows from the rightmost `1`-bit, flipping that `1` to `0` and all trailing `0`s to `1` (`n - 1 = 11 = 1011`). Bits to the left of that lowest `1` stay identical, so `n & (n - 1)` yields `1000` (`8`) with the lowest set bit erased.",
          "A positive number is a power of `2` (`1, 2, 4, 8, ...`) if and only if its binary form has **exactly one** `1`-bit. Stripping that lone `1`-bit leaves `0`, giving the `O(1)` test `n > 0 && (n & (n - 1)) == 0`. Repeating `n ← n & (n - 1)` in a loop until `n == 0` counts all set bits in `O(number of 1-bits)` steps (Brian Kernighan's algorithm).",
        ],
        table: {
          caption: "Tracing n & (n - 1) on powers of two vs multi-bit integers",
          headers: ["Input `n`", "Binary `n`", "Binary `n - 1`", "`n & (n - 1)`", "Power of two?"],
          rows: [
            ["`16`", "`10000`", "`01111`", "`00000` (`0`)", "Yes (`true`)"],
            ["`1`", "`00001`", "`00000`", "`00000` (`0`)", "Yes (`2^0 = 1`)"],
            ["`12`", "`01100`", "`01011`", "`01000` (`8`)", "No (`8 != 0`)"],
            ["`0`", "`00000`", "`11111...` (`-1`)", "`00000` (`0`)", "No (blocked by `n > 0`)"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Always check n > 0 before testing (n & (n - 1)) == 0. For n = 0, 0 & -1 equals 0 even though 0 is not a power of two.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Master Single-Bit Masks and n & (n - 1)",
      subtitle: "Fix the k > 0 mask bug, guard zero in power-of-two checks, and count set bits by stripping 1s.",
      steps: [
        {
          label: "Step 1: Fix the (n & (1 << k)) == 1 check bug",
          explanation: "Shifting `n` right by `k` before `& 1` brings bit `k` down to index `0`, returning `0` or `1` for every `k`.",
          code: [
            "function get_bit(n, k):",
            "    // Wrong: (n & (1 << k)) == 1 returns false when k > 0!",
            "    return (n >> k) & 1",
          ],
          activeLines: [3],
          output: "get_bit(10, 1) -> 1 | get_bit(10, 2) -> 0",
        },
        {
          label: "Step 2: Guard n > 0 in the O(1) power-of-two test",
          explanation: "Without `n > 0`, `n = 0` passes `(0 & -1) == 0`. Adding `n > 0` makes the test exact for all integers.",
          code: [
            "function is_pow2(n):",
            "    return n > 0 and (n & (n - 1)) == 0",
          ],
          activeLines: [2],
          output: "is_pow2(16) -> true | is_pow2(0) -> false | is_pow2(12) -> false",
        },
        {
          label: "Step 3: Strip the lowest 1-bit in a loop to count set bits",
          explanation: "Each `n &= (n - 1)` erases one `1`-bit and skips all `0`-bits between them.",
          code: [
            "function count_set_bits(n):",
            "    count ← 0",
            "    while n > 0:",
            "        n ← n & (n - 1)",
            "        count ← count + 1",
            "    return count",
          ],
          activeLines: [3, 4, 5],
          output: "count_set_bits(13) -> 3 (13 -> 12 -> 8 -> 0)",
        },
      ],
    },
    walkthrough: {
      title: "Trace single-bit masks, power-of-two test, and Kernighan's loop",
      layout: "visual-first",
      steps: [
        {
          title: "Build a single-bit mask with 1 << k",
          tag: "CONCEPT",
          explanation: [
            "Start with `n = 10 (001010)` and aim at bit `k = 2`. Shifting `1` left by `2` places creates `mask = 4 (000100)`.",
            "Every bit in `mask` except bit `2` is `0`, so `&`, `|`, and `^` will target bit `2`.",
          ],
          code: [
            "n ← 10                // 001010",
            "k ← 2",
            "mask ← 1 << k         // 000100 = 4",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "n", value: "10 (001010)" },
            { name: "mask (1 << 2)", value: "4 (000100)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "n = 10 (001010)",
                cells: [
                  { id: "m-n5", value: "0", index: 5, state: "dim" },
                  { id: "m-n4", value: "0", index: 4, state: "dim" },
                  { id: "m-n3", value: "1", index: 3, state: "active" },
                  { id: "m-n2", value: "0", index: 2, state: "pivot" },
                  { id: "m-n1", value: "1", index: 1, state: "active" },
                  { id: "m-n0", value: "0", index: 0, state: "dim" },
                ],
                pointers: [{ index: 3, label: "target k=2", tone: "coral" }],
              },
              {
                label: "mask = 1 << 2 = 4 (000100)",
                cells: [
                  { id: "m-k5", value: "0", index: 5, state: "dim" },
                  { id: "m-k4", value: "0", index: 4, state: "dim" },
                  { id: "m-k3", value: "0", index: 3, state: "dim" },
                  { id: "m-k2", value: "1", index: 2, state: "active" },
                  { id: "m-k1", value: "0", index: 1, state: "dim" },
                  { id: "m-k0", value: "0", index: 0, state: "dim" },
                ],
                pointers: [{ index: 3, label: "1 << 2", tone: "accent" }],
              },
            ],
            caption: "1 << k aligns a lone 1-bit directly with bit position k.",
          },
        },
        {
          title: "Set bit 2 and toggle bit 3",
          tag: "TRACE",
          explanation: [
            "Applying `n | (1 << 2)` turns bit `2` ON while leaving bits `3` and `1` ON, turning `10 (001010)` into `14 (001110)`.",
            "Applying `^ (1 << 3)` flips bit `3` from `1` to `0`, leaving `6 (000110)`.",
          ],
          code: [
            "n ← n | (1 << 2)      // 001110 = 14 (set bit 2)",
            "n ← n ^ (1 << 3)      // 000110 = 6  (toggle bit 3)",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "After set bit 2", value: "14 (001110)", changed: true },
            { name: "After toggle bit 3", value: "6 (000110)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After n | (1 << 2) -> 14 (001110)",
                cells: [
                  { id: "m-n5", value: "0", index: 5, state: "dim" },
                  { id: "m-n4", value: "0", index: 4, state: "dim" },
                  { id: "m-n3", value: "1", index: 3, state: "active" },
                  { id: "m-n2", value: "1", index: 2, state: "done" },
                  { id: "m-n1", value: "1", index: 1, state: "active" },
                  { id: "m-n0", value: "0", index: 0, state: "dim" },
                ],
                pointers: [{ index: 3, label: "set -> 1", tone: "ok" }],
              },
              {
                label: "After n ^ (1 << 3) -> 6 (000110)",
                cells: [
                  { id: "t-n5", value: "0", index: 5, state: "dim" },
                  { id: "t-n4", value: "0", index: 4, state: "dim" },
                  { id: "t-n3", value: "0", index: 3, state: "pivot" },
                  { id: "t-n2", value: "1", index: 2, state: "done" },
                  { id: "t-n1", value: "1", index: 1, state: "active" },
                  { id: "t-n0", value: "0", index: 0, state: "dim" },
                ],
                pointers: [{ index: 2, label: "toggled -> 0", tone: "coral" }],
              },
            ],
            caption: "OR forces a bit to 1; XOR flips whatever value was there.",
          },
        },
        {
          title: "Clear bit 1 with n & ~(1 << 1)",
          tag: "TRACE",
          explanation: [
            "Starting from `14 (001110)`, suppose we want to force bit `1` to `0`. Inverting `1 << 1` (`000010`) yields `111101` in the low 6 bits.",
            "ANDing `001110 & 111101` preserves every other bit and forces bit `1` to `0`, producing `12 (001100)`.",
          ],
          code: [
            "val ← 14              // 001110",
            "inv ← ~(1 << 1)       // ...111101",
            "cleared ← val & inv   // 001100 = 12",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "val", value: "14 (001110)" },
            { name: "cleared", value: "12 (001100)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "val = 14 (001110)",
                cells: [
                  { id: "c-v5", value: "0", index: 5, state: "dim" },
                  { id: "c-v4", value: "0", index: 4, state: "dim" },
                  { id: "c-v3", value: "1", index: 3, state: "active" },
                  { id: "c-v2", value: "1", index: 2, state: "active" },
                  { id: "c-v1", value: "1", index: 1, state: "pivot" },
                  { id: "c-v0", value: "0", index: 0, state: "dim" },
                ],
              },
              {
                label: "~(1 << 1) low 6 bits (111101)",
                cells: [
                  { id: "c-m5", value: "1", index: 5 },
                  { id: "c-m4", value: "1", index: 4 },
                  { id: "c-m3", value: "1", index: 3 },
                  { id: "c-m2", value: "1", index: 2 },
                  { id: "c-m1", value: "0", index: 1, state: "pivot" },
                  { id: "c-m0", value: "1", index: 0 },
                ],
                pointers: [{ index: 4, label: "0 clears bit 1", tone: "coral" }],
              },
              {
                label: "val & ~(1 << 1) = 12 (001100)",
                cells: [
                  { id: "c-r5", value: "0", index: 5, state: "dim" },
                  { id: "c-r4", value: "0", index: 4, state: "dim" },
                  { id: "c-r3", value: "1", index: 3, state: "done" },
                  { id: "c-r2", value: "1", index: 2, state: "done" },
                  { id: "c-r1", value: "0", index: 1, state: "dim" },
                  { id: "c-r0", value: "0", index: 0, state: "dim" },
                ],
              },
            ],
            caption: "ANDing with ~(1 << k) zeroes only bit k and keeps every other bit intact.",
          },
        },
        {
          title: "Test power of two in O(1) with n > 0 and (n & (n - 1)) == 0",
          tag: "PATTERN",
          explanation: [
            "For `n = 16 (010000)`, `n - 1 = 15 (001111)` has `0` at bit `4` and `1`s in bits `3..0`.",
            "No column has `1` in both numbers, so `16 & 15 == 0`. Combined with `n > 0`, this proves `16` has exactly one `1`-bit and is a power of `2`.",
          ],
          callout: {
            kind: "WATCH OUT",
            text: "Never skip the n > 0 check: 0 & (0 - 1) equals 0, yet 0 is not a power of two.",
          },
          code: [
            "function is_pow2(n):",
            "    return n > 0 and (n & (n - 1)) == 0",
            "// is_pow2(16) -> 16 & 15 == 0 -> true",
          ],
          activeLines: [2],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "def is_pow2(n: int) -> bool:",
              "    return n > 0 and (n & (n - 1)) == 0",
            ],
            activeLines: [2],
          },
          state: [
            { name: "n", value: "16 (010000)" },
            { name: "n - 1", value: "15 (001111)" },
            { name: "n & (n - 1)", value: "0 (power of 2)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "n = 16 (010000)",
                cells: [
                  { id: "p2-n5", value: "0", index: 5, state: "dim" },
                  { id: "p2-n4", value: "1", index: 4, state: "active" },
                  { id: "p2-n3", value: "0", index: 3, state: "dim" },
                  { id: "p2-n2", value: "0", index: 2, state: "dim" },
                  { id: "p2-n1", value: "0", index: 1, state: "dim" },
                  { id: "p2-n0", value: "0", index: 0, state: "dim" },
                ],
                pointers: [{ index: 1, label: "lone 1-bit", tone: "accent" }],
              },
              {
                label: "n - 1 = 15 (001111)",
                cells: [
                  { id: "p2-m5", value: "0", index: 5, state: "dim" },
                  { id: "p2-m4", value: "0", index: 4, state: "dim" },
                  { id: "p2-m3", value: "1", index: 3 },
                  { id: "p2-m2", value: "1", index: 2 },
                  { id: "p2-m1", value: "1", index: 1 },
                  { id: "p2-m0", value: "1", index: 0 },
                ],
              },
              {
                label: "n & (n - 1) = 0 (000000)",
                cells: [
                  { id: "p2-r5", value: "0", index: 5, state: "done" },
                  { id: "p2-r4", value: "0", index: 4, state: "done" },
                  { id: "p2-r3", value: "0", index: 3, state: "done" },
                  { id: "p2-r2", value: "0", index: 2, state: "done" },
                  { id: "p2-r1", value: "0", index: 1, state: "done" },
                  { id: "p2-r0", value: "0", index: 0, state: "done" },
                ],
              },
            ],
            caption: "A lone 1-bit disappears completely when ANDed with n - 1.",
          },
        },
        {
          title: "Count set bits: Iterations 1 and 2 clear the low 1-bits",
          tag: "TRACE",
          explanation: [
            "For `n = 13 (001101)`, each pass runs `n ← n & (n - 1)` and adds `1` to `count`.",
            "Iteration 1 clears bit `0` (`13 -> 12`), and Iteration 2 clears bit `2` (`12 -> 8`), leaving only one `1`-bit.",
          ],
          code: [
            "count ← 0",
            "while n > 0:",
            "    n ← n & (n - 1)   // drop lowest 1-bit",
            "    count ← count + 1",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Start", value: "13 (001101)" },
            { name: "Iter 1 -> Iter 2", value: "12 -> 8", changed: true },
            { name: "count", value: "2", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Start: n = 13 (001101), count = 0",
                cells: [
                  { id: "k0-5", value: "0", index: 5, state: "dim" },
                  { id: "k0-4", value: "0", index: 4, state: "dim" },
                  { id: "k0-3", value: "1", index: 3, state: "active" },
                  { id: "k0-2", value: "1", index: 2, state: "active" },
                  { id: "k0-1", value: "0", index: 1, state: "dim" },
                  { id: "k0-0", value: "1", index: 0, state: "pivot" },
                ],
                pointers: [{ index: 5, label: "drop next", tone: "coral" }],
              },
              {
                label: "Iter 1: 13 & 12 = 12 (001100), count = 1",
                cells: [
                  { id: "k1-5", value: "0", index: 5, state: "dim" },
                  { id: "k1-4", value: "0", index: 4, state: "dim" },
                  { id: "k1-3", value: "1", index: 3, state: "active" },
                  { id: "k1-2", value: "1", index: 2, state: "pivot" },
                  { id: "k1-1", value: "0", index: 1, state: "dim" },
                  { id: "k1-0", value: "0", index: 0, state: "dim" },
                ],
                pointers: [{ index: 3, label: "drop next", tone: "coral" }],
              },
              {
                label: "Iter 2: 12 & 11 = 8 (001000), count = 2",
                cells: [
                  { id: "k2-5", value: "0", index: 5, state: "dim" },
                  { id: "k2-4", value: "0", index: 4, state: "dim" },
                  { id: "k2-3", value: "1", index: 3, state: "pivot" },
                  { id: "k2-2", value: "0", index: 2, state: "dim" },
                  { id: "k2-1", value: "0", index: 1, state: "dim" },
                  { id: "k2-0", value: "0", index: 0, state: "dim" },
                ],
                pointers: [{ index: 2, label: "last 1-bit", tone: "coral" }],
              },
            ],
            caption: "Each n &= (n - 1) jumps directly to the next set bit, skipping 0s.",
          },
        },
        {
          title: "Iteration 3 clears the last 1-bit: n = 0 (000000), count = 3",
          tag: "CHECK",
          explanation: [
            "Iteration 3 computes `8 & 7 = 0 (000000)` and increments `count` to `3`.",
            "Now `n > 0` fails, so the loop exits after exactly `3` iterations, matching the `3` set bits in `13`.",
          ],
          code: [
            "while n > 0:          // 8 > 0 -> enter Iter 3",
            "    n ← n & (n - 1)   // 8 & 7 = 0 (000000)",
            "    count ← count + 1 // count = 3",
            "// n == 0 -> loop exits",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "n", value: "0 (000000)", changed: true },
            { name: "count", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Before Iter 3: n = 8 (001000), count = 2",
                cells: [
                  { id: "k2-5", value: "0", index: 5, state: "dim" },
                  { id: "k2-4", value: "0", index: 4, state: "dim" },
                  { id: "k2-3", value: "1", index: 3, state: "pivot" },
                  { id: "k2-2", value: "0", index: 2, state: "dim" },
                  { id: "k2-1", value: "0", index: 1, state: "dim" },
                  { id: "k2-0", value: "0", index: 0, state: "dim" },
                ],
                pointers: [{ index: 2, label: "8 & 7 clears bit 3", tone: "coral" }],
              },
              {
                label: "Iter 3: 8 & 7 = 0 (000000), count = 3 (loop exits)",
                cells: [
                  { id: "k3-5", value: "0", index: 5, state: "done" },
                  { id: "k3-4", value: "0", index: 4, state: "done" },
                  { id: "k3-3", value: "0", index: 3, state: "done" },
                  { id: "k3-2", value: "0", index: 2, state: "done" },
                  { id: "k3-1", value: "0", index: 1, state: "done" },
                  { id: "k3-0", value: "0", index: 0, state: "done" },
                ],
                pointers: [{ index: 0, label: "n = 0, count = 3", tone: "ok" }],
              },
            ],
            caption: "Once all set bits are cleared, n reaches 000000 and count holds the exact bit count.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Comparing (n & (1 << k)) == 1 fails for k > 0",
        detail:
          "Masking `10` (`1010`) with `1 << 1` (`0010`) returns `2`, not `1`. To check bit `k`, test `(n & (1 << k)) != 0` or extract the bit directly with `(n >> k) & 1`.",
        code: "// Wrong for k = 1: (10 & 2) == 1 is false!\n// Right:\nis_set ← ((n >> k) & 1) == 1",
      },
      {
        title: "n = 0 passes (n & (n - 1)) == 0",
        detail:
          "`0` is not a power of two (`2^k >= 1`), yet `0 & -1 == 0`. Under fixed-width wrapping arithmetic, the smallest signed negative number (`-2^31`) can also zero out with `n - 1`. Always guard `n > 0`.",
      },
      {
        title: "64-bit masks need a 64-bit 1 literal",
        detail:
          "Writing `1 << k` in languages like C, C++, or Java shifts a 32-bit `1`. When `k` can be `31..62`, write `1LL << k` or `1UL << k` so the shift does not overflow.",
      },
    ],
    practiceTask: {
      title: "Single-Bit Inspector and Editor",
      tier: "Warmup",
      goal: "Given a non-negative integer `n` and bit index `k`, return a 4-tuple `(bit_val, set_val, clear_val, toggle_val)` where `bit_val` is `0` or `1` at bit `k`, and the other three entries hold `n` after setting, clearing, and toggling bit `k`.",
      constraints: ["0 <= n <= 10^9", "0 <= k <= 30", "Target: O(1) time, O(1) space"],
      examples: [
        {
          input: "n = 10, k = 2",
          output: "(0, 14, 10, 14)",
          explanation: "10 is 1010: bit 2 is 0; setting or toggling bit 2 gives 1110 (14); clearing keeps 10.",
        },
        {
          input: "n = 10, k = 1",
          output: "(1, 10, 8, 8)",
          explanation: "Bit 1 is 1; setting keeps 10; clearing or toggling bit 1 gives 1000 (8).",
        },
      ],
      tasks: [
        "Build `mask = 1 << k`.",
        "Compute `(n >> k) & 1`, `n | mask`, `n & ~mask`, and `n ^ mask`.",
      ],
      starterCode:
        "function edit_kth_bit(n, k):\n    // TODO: return (bit_val, set_val, clear_val, toggle_val)",
      expectedOutput: "(0, 14, 10, 14)\n(1, 10, 8, 8)",
      hint: "Use `(n >> k) & 1` for `bit_val` so it is always `0` or `1`, regardless of `k`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "function edit_kth_bit(n, k):\n    mask ← 1 << k\n    bit_val ← (n >> k) & 1\n    return (bit_val, n | mask, n & (~mask), n ^ mask)",
    },
    practiceChallenges: [
      {
        title: "Single-Bit Inspector and Editor",
        tier: "Warmup",
        goal: "Given `n` and `k`, return `(bit_val, set_val, clear_val, toggle_val)` using a single-bit mask `1 << k`.",
        constraints: ["0 <= n <= 10^9", "0 <= k <= 30", "Target: O(1) time, O(1) space"],
        examples: [
          { input: "n = 10, k = 2", output: "(0, 14, 10, 14)" },
          { input: "n = 10, k = 1", output: "(1, 10, 8, 8)" },
        ],
        tasks: [
          "Extract bit `k` as `0` or `1` with `(n >> k) & 1`.",
          "Return `n | mask`, `n & ~mask`, and `n ^ mask`.",
        ],
        starterCode:
          "function edit_kth_bit(n, k):\n    // TODO: inspect and edit bit k",
        expectedOutput: "(0, 14, 10, 14)\n(1, 10, 8, 8)",
        hint: "Form `mask = 1 << k` once and reuse it in all three updates.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "function edit_kth_bit(n, k):\n    mask ← 1 << k\n    bit_val ← (n >> k) & 1\n    return (bit_val, n | mask, n & (~mask), n ^ mask)",
      },
      {
        title: "Count Set Bits by Dropping the Lowest 1-Bit",
        tier: "Core",
        goal: "Given a non-negative integer `n`, return the count of `1`-bits in its binary form using Brian Kernighan's `n &= (n - 1)` loop.",
        constraints: ["0 <= n <= 2^31 - 1", "Loop iterations must equal set-bit count", "Extra space: O(1)"],
        examples: [
          { input: "n = 29", output: "4", explanation: "29 is 11101, which has four 1-bits." },
          { input: "n = 0", output: "0" },
        ],
        tasks: [
          "Initialize `count = 0`.",
          "While `n > 0`, replace `n` with `n & (n - 1)` and increment `count`.",
        ],
        starterCode:
          "function count_set_bits(n):\n    // TODO: Brian Kernighan n &= (n - 1) loop",
        expectedOutput: "4\n0",
        hint: "Each `n & (n - 1)` erases one `1`-bit, so `count` reaches the exact answer when `n` hits `0`.",
        complexity: { time: "O(set bits)", space: "O(1)" },
        solutionCode:
          "function count_set_bits(n):\n    count ← 0\n    while n > 0:\n        n ← n & (n - 1)\n        count ← count + 1\n    return count",
      },
      {
        title: "Minimum Bit Flips to Transform a into b",
        tier: "Stretch",
        goal: "Given two non-negative integers `a` and `b`, return the minimum number of single-bit flips needed to turn `a` into `b`.",
        constraints: ["0 <= a, b <= 2^31 - 1", "Target time: O(set bits in a ^ b)", "Extra space: O(1)"],
        examples: [
          {
            input: "a = 10, b = 7",
            output: "3",
            explanation: "10 (1010) and 7 (0111) differ at bits 3, 2, and 0 -> 3 flips.",
          },
          { input: "a = 8, b = 8", output: "0" },
        ],
        tasks: [
          "Compute `diff = a ^ b` so every differing bit position becomes `1`.",
          "Count set bits in `diff` with `diff &= (diff - 1)`.",
        ],
        starterCode:
          "function min_bit_flips(a, b):\n    // TODO: count differing bits between a and b",
        expectedOutput: "3\n0",
        hint: "XOR marks every position where `a` and `b` disagree with a `1`-bit.",
        complexity: { time: "O(flips)", space: "O(1)" },
        solutionCode:
          "function min_bit_flips(a, b):\n    diff ← a ^ b\n    flips ← 0\n    while diff > 0:\n        diff ← diff & (diff - 1)\n        flips ← flips + 1\n    return flips",
      },
    ],
  },

  "dsa-xor-bitmasks": {
    lessonId: "dsa-xor-bitmasks",
    subtitle:
      "Cancel pairs in O(1) space using x ^ x = 0, understand XOR-swap caveats, and iterate all 2^n subsets with plain nested loops.",
    intro: {
      heading: "XOR Properties & Subset Bitmask Intuition",
      explanation: [
        "Run the classic three-line XOR swap `arr[i] ^= arr[j]; arr[j] ^= arr[i]; arr[i] ^= arr[j]` when `i == j`, and the very first line computes `arr[i] ^= arr[i] = 0`—erasing your value! Meanwhile, finding one unpaired ID in `[4, 9, 4, 7, 9]` with a hash set allocates `O(n)` extra RAM when a single `acc = 0` variable cancels pairs in `O(1)` space.",
        "XOR (`^`) obeys **self-cancellation** (`x ^ x = 0`), **identity** (`x ^ 0 = x`), and **order independence** (`a ^ b = b ^ a`). Extending bits from single numbers to selections, an `n`-bit integer `mask` from `0` to `(1 << n) - 1` encodes any subset of `n` items so two nested loops inspect all `2^n` subsets without recursion.",
      ],
      analogy:
        "XOR acts like a coat check where every matching pair of tickets cancels out and leaves only the lone unpaired ticket. A subset bitmask is a row of `n` yes/no checkboxes: counting from `0` (`000`) to `2^n - 1` (`111`) walks through every possible selection.",
      realWorldUses: [
        "Detecting a single unpaired or missing ID in an integer stream using one accumulator variable (`O(1)` space)",
        "Enumerating all small feature-flag or item combinations (`n <= 20`) with iterative bitmask loops",
      ],
    },
    sections: [
      {
        heading: "XOR cancellation laws and the XOR-swap caveat",
        paragraphs: [
          "Because `(a ^ b) ^ c == a ^ (b ^ c)` and `x ^ x == 0`, paired elements cancel even when separated in the input: tracing `[4, 9, 4, 7, 9]` gives `0 -> 4 -> 13 -> 9 -> 14 -> 7`.",
          "XOR swap exchanges two distinct slots (`a ^= b; b ^= a; a ^= b`), yet zeroes the slot if `a` and `b` alias the exact same address (`arr[i]` and `arr[i]`). Keep `temp = arr[i]` for general swaps.",
        ],
        code: [
          "// Broken aliased XOR swap (i == j = 0 -> zeroes arr[0]):",
          "arr = [42]; arr[0] ^= arr[0]    // arr[0] becomes 0 immediately!",
          "// Working O(1)-space pair cancellation on [4, 9, 4, 7, 9]:",
          "// 0^4=4 -> 4^9=13 -> 13^4=9 -> 9^7=14 -> 14^9=7",
        ],
        output: "Aliased XOR swap -> [0] (destroyed) | single_number([4,9,4,7,9]) -> 7",
        table: {
          caption: "Core XOR identities and swap comparison",
          headers: ["Rule or pattern", "Expression", "Result", "Important note"],
          rows: [
            ["Self-inverse", "`x ^ x`", "`0`", "Cancels any value XORed with itself"],
            ["Identity", "`x ^ 0`", "`x`", "Starting accumulator value (`acc = 0`)"],
            ["Commutative pair cancel", "`a ^ b ^ a`", "`b`", "Order of paired items does not matter"],
            ["XOR swap (`i != j`)", "`a ^= b; b ^= a; a ^= b`", "Swaps `a` and `b`", "Zeroes data if `a` and `b` share the same memory slot"],
            ["Temp swap (preferred)", "`t = a; a = b; b = t`", "Swaps `a` and `b`", "Works even when `i == j`; clear and fast on modern CPUs"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Never run XOR swap on array slots arr[i] and arr[j] without checking i != j. Prefer a temp variable in real code.",
        },
      },
      {
        heading: "Iterating all 2^n subsets with integer bitmasks",
        paragraphs: [
          "Suppose `items = [4, 7, 9]` (`n = 3`). There are `1 << 3 = 8` subsets, matching integers `mask = 0` (`000`) through `mask = 7` (`111`).",
          "Inside an outer loop `for mask from 0 to (1 << n) - 1`, an inner loop checks `for i from 0 to n - 1`: whenever `(mask & (1 << i)) != 0`, item `i` belongs to the current subset. Total work is `O(n * 2^n)`, practical up to roughly `n = 20` (`2^20 = 1,048,576`).",
        ],
        table: {
          caption: "All 2^3 = 8 bitmasks for items = [4, 7, 9]",
          headers: ["`mask`", "Binary (`b2 b1 b0`)", "Set bits", "Chosen subset", "Subset sum"],
          rows: [
            ["`0`", "`000`", "none", "`[]`", "`0`"],
            ["`1`", "`001`", "`0`", "`[4]`", "`4`"],
            ["`2`", "`010`", "`1`", "`[7]`", "`7`"],
            ["`3`", "`011`", "`0, 1`", "`[4, 7]`", "`11`"],
            ["`4`", "`100`", "`2`", "`[9]`", "`9`"],
            ["`5`", "`101`", "`0, 2`", "`[4, 9]`", "`13`"],
            ["`6`", "`110`", "`1, 2`", "`[7, 9]`", "`16`"],
            ["`7`", "`111`", "`0, 1, 2`", "`[4, 7, 9]`", "`20`"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Bitmasks encode every subset as a plain integer from 0 to (1 << n) - 1, letting two nested loops enumerate all 2^n subsets without recursion.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build XOR Pair Cancellation and Iterative Bitmask Subsets",
      subtitle: "Move from O(1)-space pair cancellation to decoding masks and counting target subsets.",
      steps: [
        {
          label: "Step 1: Cancel paired elements with acc ^= x",
          explanation: "Starting `acc = 0` and XORing every item leaves only the unpaired value because `x ^ x = 0`.",
          code: [
            "function single_number(nums):",
            "    acc ← 0",
            "    for each x in nums:",
            "        acc ← acc ^ x",
            "    return acc",
          ],
          activeLines: [2, 3, 4],
          output: "[4, 9, 4, 7, 9] -> 7",
        },
        {
          label: "Step 2: Decode one mask integer into subset elements",
          explanation: "Testing `(mask & (1 << i)) != 0` picks `items[i]` for every `1`-bit in `mask`.",
          code: [
            "function subset_for_mask(items, mask):",
            "    total ← 0",
            "    for i from 0 to len(items) - 1:",
            "        if (mask & (1 << i)) != 0:",
            "            total ← total + items[i]",
            "    return total",
          ],
          activeLines: [4, 5],
          output: "items=[4, 7, 9], mask=5 (101) -> 4 + 9 = 13",
        },
        {
          label: "Step 3: Loop mask from 0 to (1 << n) - 1 to count target subsets",
          explanation: "Wrapping the bit check in an outer `mask` loop visits all `2^n` subsets iteratively in `O(n * 2^n)` time.",
          code: [
            "function count_target_subsets(nums, target):",
            "    n ← len(nums), matches ← 0",
            "    for mask from 0 to (1 << n) - 1:",
            "        total ← 0",
            "        for i from 0 to n - 1:",
            "            if (mask & (1 << i)) != 0: total += nums[i]",
            "        if total == target: matches += 1",
            "    return matches",
          ],
          activeLines: [3, 6, 7],
          output: "nums=[2, 3, 5], target=5 -> 2",
        },
      ],
    },
    walkthrough: {
      title: "Trace XOR cancellation, XOR swap, and iterative subset bitmasks",
      layout: "visual-first",
      steps: [
        {
          title: "Pairs cancel to zero: 6 ^ 3 ^ 6 = 3",
          tag: "CONCEPT",
          explanation: [
            "Start accumulator `acc = 0` (`0000`). XORing `6` sets `acc = 6 (0110)`. XORing `3` flips bits to `5 (0101)`.",
            "XORing the second `6` flips the exact same bits back, canceling both `6`s and leaving `3 (0011)`.",
          ],
          code: [
            "acc ← 0               // 0000",
            "acc ← acc ^ 6         // 0110 = 6",
            "acc ← acc ^ 3         // 0101 = 5",
            "acc ← acc ^ 6         // 0011 = 3 (6s canceled)",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "After ^ 6", value: "6 (0110)" },
            { name: "After ^ 3", value: "5 (0101)" },
            { name: "After ^ 6", value: "3 (0011)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "acc = 6 (0110)",
                cells: [
                  { id: "x1-3", value: "0", index: 3, state: "dim" },
                  { id: "x1-2", value: "1", index: 2, state: "active" },
                  { id: "x1-1", value: "1", index: 1, state: "active" },
                  { id: "x1-0", value: "0", index: 0, state: "dim" },
                ],
              },
              {
                label: "6 ^ 3 = 5 (0101)",
                cells: [
                  { id: "x2-3", value: "0", index: 3, state: "dim" },
                  { id: "x2-2", value: "1", index: 2, state: "active" },
                  { id: "x2-1", value: "0", index: 1, state: "dim" },
                  { id: "x2-0", value: "1", index: 0, state: "active" },
                ],
              },
              {
                label: "5 ^ 6 = 3 (0011) - pair canceled",
                cells: [
                  { id: "x3-3", value: "0", index: 3, state: "dim" },
                  { id: "x3-2", value: "0", index: 2, state: "dim" },
                  { id: "x3-1", value: "1", index: 1, state: "done" },
                  { id: "x3-0", value: "1", index: 0, state: "done" },
                ],
                pointers: [{ index: 3, label: "survivor = 3", tone: "ok" }],
              },
            ],
            caption: "Any number XORed twice returns every bit to its prior state.",
          },
        },
        {
          title: "Scan nums = [4, 9, 4, 7, 9]: mid-scan after canceling 4s",
          tag: "TRACE",
          explanation: [
            "Start with `acc = 0` and XOR the first three items: `0 ^ 4 = 4`, `4 ^ 9 = 13`, then `13 ^ 4 = 9`.",
            "The two `4`s already canceled out, leaving `acc = 9 (1001)` before reading `7` and `9`.",
          ],
          code: [
            "acc ← 0",
            "for each x in [4, 9, 4, 7, 9]:",
            "    acc ← acc ^ x     // 4 -> 13 -> 9",
            "    // next: 9 ^ 7 = 14, then 14 ^ 9 = 7",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Processed", value: "[4, 9, 4]" },
            { name: "acc", value: "9 (1001)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input sequence nums (at index 2)",
                cells: [
                  { id: "s-0", value: "4", index: 0, state: "dim" },
                  { id: "s-1", value: "9", index: 1, state: "active" },
                  { id: "s-2", value: "4", index: 2, state: "dim" },
                  { id: "s-3", value: "7", index: 3 },
                  { id: "s-4", value: "9", index: 4 },
                ],
                pointers: [{ index: 2, label: "4s canceled", tone: "accent" }],
              },
              {
                label: "Mid-scan acc = 9 (1001)",
                cells: [
                  { id: "acc-3", value: "1", index: 3, state: "active" },
                  { id: "acc-2", value: "0", index: 2, state: "dim" },
                  { id: "acc-1", value: "0", index: 1, state: "dim" },
                  { id: "acc-0", value: "1", index: 0, state: "active" },
                ],
              },
            ],
            caption: "Halfway through the scan, paired 4s have already canceled to leave acc = 9.",
          },
        },
        {
          title: "Finish scan: 9 ^ 7 ^ 9 cancels the 9s, leaving acc = 7",
          tag: "PATTERN",
          explanation: [
            "Continuing from `acc = 9`: `9 ^ 7 = 14 (1110)`, then `14 ^ 9 = 7 (0111)`.",
            "Both pairs (`4`s and `9`s) canceled completely, isolating the single non-duplicate `7` in `O(1)` extra space.",
          ],
          code: [
            "// continuing from acc = 9:",
            "acc ← acc ^ 7         // 9 ^ 7 = 14 (1110)",
            "acc ← acc ^ 9         // 14 ^ 9 = 7 (0111)",
            "return acc            // 7",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Trace", value: "9 -> 14 -> 7", changed: true },
            { name: "acc", value: "7 (0111)", changed: true },
            { name: "Extra space", value: "O(1)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input sequence nums",
                cells: [
                  { id: "s-0", value: "4", index: 0, state: "dim" },
                  { id: "s-1", value: "9", index: 1, state: "dim" },
                  { id: "s-2", value: "4", index: 2, state: "dim" },
                  { id: "s-3", value: "7", index: 3, state: "done" },
                  { id: "s-4", value: "9", index: 4, state: "dim" },
                ],
                pointers: [{ index: 3, label: "unique = 7", tone: "ok" }],
              },
              {
                label: "Final acc = 7 (0111)",
                cells: [
                  { id: "acc-3", value: "0", index: 3, state: "dim" },
                  { id: "acc-2", value: "1", index: 2, state: "done" },
                  { id: "acc-1", value: "1", index: 1, state: "done" },
                  { id: "acc-0", value: "1", index: 0, state: "done" },
                ],
              },
            ],
            caption: "Scanning once with a single XOR accumulator isolates the unpaired element in O(n) time and O(1) space.",
          },
        },
        {
          title: "XOR swap on distinct variables (and its aliasing trap)",
          tag: "PITFALL",
          explanation: [
            "For distinct `a = 5 (0101)` and `b = 9 (1001)`, setting `a ← a ^ b` stores `1100` (their difference mask). Then `b ← b ^ a` recovers `5`, and `a ← a ^ b` recovers `9`.",
            "If both references pointed to the exact same slot (`arr[i]` and `arr[i]`), step 1 would execute `arr[i] ^= arr[i]` and erase the value to `0`.",
          ],
          callout: {
            kind: "WATCH OUT",
            text: "Use temp swap unless you explicitly verify two slots are distinct (i != j). XOR swap is brittle under aliasing.",
          },
          code: [
            "// Only safe when a and b are distinct slots!",
            "a ← a ^ b             // a = 12 (1100)",
            "b ← b ^ a             // b = 5  (0101)",
            "a ← a ^ b             // a = 9  (1001)",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "a", value: "9 (was 5)", changed: true },
            { name: "b", value: "5 (was 9)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "a after swap = 9 (1001)",
                cells: [
                  { id: "sw-a3", value: "1", index: 3, state: "done" },
                  { id: "sw-a2", value: "0", index: 2, state: "dim" },
                  { id: "sw-a1", value: "0", index: 1, state: "dim" },
                  { id: "sw-a0", value: "1", index: 0, state: "done" },
                ],
              },
              {
                label: "b after swap = 5 (0101)",
                cells: [
                  { id: "sw-b3", value: "0", index: 3, state: "dim" },
                  { id: "sw-b2", value: "1", index: 2, state: "done" },
                  { id: "sw-b1", value: "0", index: 1, state: "dim" },
                  { id: "sw-b0", value: "1", index: 0, state: "done" },
                ],
              },
            ],
            caption: "XOR swap exchanges two distinct scalar values, but self-aliasing zeroes the slot on the first line.",
          },
        },
        {
          title: "Decode a single bitmask integer as a subset",
          tag: "CONCEPT",
          explanation: [
            "Given `items = [4, 7, 9]`, take `mask = 5`, which is `101` in 3-bit binary (`bit 2 = 1`, `bit 1 = 0`, `bit 0 = 1`).",
            "Every `1`-bit selects the corresponding index in `items`: `bit 0` picks `items[0] = 4`, and `bit 2` picks `items[2] = 9`.",
          ],
          code: [
            "items ← [4, 7, 9]",
            "mask ← 5              // 101 in binary",
            "// bit 0 = 1 (pick 4), bit 1 = 0 (skip 7), bit 2 = 1 (pick 9)",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "items = [4, 7, 9]",
              "mask = 5  # 0b101 -> picks indices 0 and 2",
              "chosen = [items[i] for i in range(len(items)) if (mask >> i) & 1]",
            ],
            activeLines: [1, 2, 3],
          },
          state: [
            { name: "mask", value: "5 (101)" },
            { name: "Chosen subset", value: "[4, 9]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "mask = 5 (bits 0, 1, 2 aligned with items)",
                cells: [
                  { id: "bm-0", value: "1", index: 0, state: "active" },
                  { id: "bm-1", value: "0", index: 1, state: "dim" },
                  { id: "bm-2", value: "1", index: 2, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "pick items[0]", tone: "ok" },
                  { index: 2, label: "pick items[2]", tone: "ok" },
                ],
              },
              {
                label: "items (indices 0, 1, 2)",
                cells: [
                  { id: "it-0", value: "4", index: 0, state: "done" },
                  { id: "it-1", value: "7", index: 1, state: "dim" },
                  { id: "it-2", value: "9", index: 2, state: "done" },
                ],
                pointers: [
                  { index: 0, label: "bit 0 = 1", tone: "ok" },
                  { index: 2, label: "bit 2 = 1", tone: "ok" },
                ],
              },
            ],
            caption: "Bit i of mask acts as an on/off switch for items[i].",
          },
        },
        {
          title: "Iterate all 2^n masks with two plain nested loops",
          tag: "TRACE",
          explanation: [
            "The outer loop walks `mask` from `0` to `(1 << n) - 1`. At `mask = 6 (110)`, the inner loop tests `(6 & (1 << i)) != 0` for `i = 0, 1, 2`.",
            "Bit `0` is `0` (`4` skipped), while bits `1` and `2` are `1`, adding `7 + 9 = 16` without any recursion.",
          ],
          code: [
            "for mask from 0 to (1 << n) - 1:",
            "    sum ← 0",
            "    for i from 0 to n - 1:",
            "        if (mask & (1 << i)) != 0:",
            "            sum ← sum + items[i]",
          ],
          activeLines: [1, 3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "mask", value: "6 (110)" },
            { name: "Chosen", value: "[7, 9]" },
            { name: "sum", value: "16", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "mask = 6 (bits 0, 1, 2 aligned with items)",
                cells: [
                  { id: "bm-0", value: "0", index: 0, state: "dim" },
                  { id: "bm-1", value: "1", index: 1, state: "active" },
                  { id: "bm-2", value: "1", index: 2, state: "active" },
                ],
                pointers: [
                  { index: 1, label: "i=1 on", tone: "ok" },
                  { index: 2, label: "i=2 on", tone: "ok" },
                ],
              },
              {
                label: "items (sum = 7 + 9 = 16)",
                cells: [
                  { id: "it-0", value: "4", index: 0, state: "dim" },
                  { id: "it-1", value: "7", index: 1, state: "done" },
                  { id: "it-2", value: "9", index: 2, state: "done" },
                ],
                highlightRange: [1, 2],
              },
            ],
            caption: "Plain nested loops over 0..(1 << n) - 1 visit all 2^n subsets.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "XOR cancellation only drops even-count duplicates",
        detail:
          "`x ^ x = 0` works when duplicates appear twice (`2, 4, 6, ...` times). If an item appears 3 times, `x ^ x ^ x` equals `x`, not `0`.",
      },
      {
        title: "XOR swap breaks on aliased indices (i == j)",
        detail:
          "Writing `arr[i] ^= arr[j]` when `i == j` XORs the slot with itself and overwrites it with `0`. Always guard `if i != j` or just use a `temp` variable.",
        code: "// Bug when i == j:\narr[i] ← arr[i] ^ arr[j]   // becomes 0!\n\n// Safe:\nif i != j:\n    temp ← arr[i]; arr[i] ← arr[j]; arr[j] ← temp",
      },
      {
        title: "Subset bitmask size explodes exponentially (2^n)",
        detail:
          "Enumerating `0 .. (1 << n) - 1` takes `O(n * 2^n)` steps. Keep `n <= 20` (around `2 * 10^7` inner checks), and remember `1 << 31` overflows signed 32-bit integers.",
      },
    ],
    practiceTask: {
      title: "Find the Lone Unpaired Integer",
      tier: "Warmup",
      goal: "Given a sequence `nums` where every value appears exactly twice except for one unique integer, return that unique integer in `O(n)` time and `O(1)` extra space.",
      constraints: ["1 <= len(nums) <= 10^5", "Target: O(n) time, O(1) extra space", "Do not use extra containers"],
      examples: [
        { input: "nums = [4, 1, 2, 1, 2]", output: "4", explanation: "1^1 = 0 and 2^2 = 0, leaving 4." },
        { input: "nums = [7, 3, 7]", output: "3" },
      ],
      tasks: [
        "Initialize `ans = 0`.",
        "Loop through `nums`, updating `ans = ans ^ x`, and return `ans`.",
      ],
      starterCode:
        "function single_number(nums):\n    // TODO: XOR all values in O(1) extra space",
      expectedOutput: "4\n3",
      hint: "XOR is associative and commutative, so matching pairs cancel no matter how far apart they sit.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function single_number(nums):\n    ans ← 0\n    for each x in nums:\n        ans ← ans ^ x\n    return ans",
    },
    practiceChallenges: [
      {
        title: "Find the Lone Unpaired Integer",
        tier: "Warmup",
        goal: "Return the single non-duplicate element in `nums` where all other numbers appear twice, using `O(1)` extra memory.",
        constraints: ["1 <= len(nums) <= 10^5", "Target: O(n) time, O(1) extra space"],
        examples: [
          { input: "nums = [4, 1, 2, 1, 2]", output: "4" },
          { input: "nums = [7, 3, 7]", output: "3" },
        ],
        tasks: [
          "Set `ans = 0`.",
          "XOR every element into `ans` and return `ans`.",
        ],
        starterCode:
          "function single_number(nums):\n    // TODO: return unique number in O(1) space",
        expectedOutput: "4\n3",
        hint: "Start at `0` because `0 ^ x = x`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function single_number(nums):\n    ans ← 0\n    for each x in nums:\n        ans ← ans ^ x\n    return ans",
      },
      {
        title: "Find the Missing Number in 0..n Using XOR",
        tier: "Core",
        goal: "Given a sequence `nums` of `n` distinct integers taken from `0, 1, ..., n`, find the one missing integer in `O(n)` time and `O(1)` extra space without summing (avoiding overflow).",
        constraints: ["1 <= n <= 10^5", "All elements distinct in [0, n]", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [3, 0, 1]", output: "2", explanation: "0..3 has 0, 1, 2, 3; only 2 is missing." },
          { input: "nums = [0, 1]", output: "2" },
        ],
        tasks: [
          "Initialize `ans = n`.",
          "For `i` from `0` to `n - 1`, update `ans = ans ^ i ^ nums[i]`.",
        ],
        starterCode:
          "function missing_number(nums):\n    // TODO: XOR indices 0..n with all elements of nums",
        expectedOutput: "2\n2",
        hint: "Every number present in `nums` appears once in `0..n` and once in `nums`, so they cancel out.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function missing_number(nums):\n    n ← len(nums)\n    ans ← n\n    for i from 0 to n - 1:\n        ans ← ans ^ i ^ nums[i]\n    return ans",
      },
      {
        title: "Count Subsets Reaching Target Sum (Iterative Bitmask)",
        tier: "Stretch",
        goal: "Given `n` positive integers `nums` (`1 <= n <= 16`) and `target`, count how many of the `2^n` subsets sum exactly to `target` using plain nested loops (no recursion).",
        constraints: ["1 <= n <= 16", "1 <= nums[i] <= 10^6", "Target time: O(n * 2^n), extra space: O(1)"],
        examples: [
          { input: "nums = [2, 3, 5], target = 5", output: "2", explanation: "Subsets [2, 3] and [5] both sum to 5." },
          { input: "nums = [1, 1, 2], target = 2", output: "2", explanation: "Subsets at indices {0, 1} and {2} sum to 2." },
        ],
        tasks: [
          "Loop `mask` from `0` to `(1 << n) - 1`.",
          "For each `mask`, sum `nums[i]` wherever `(mask & (1 << i)) != 0`, and count subsets with `sum == target`.",
        ],
        starterCode:
          "function count_target_subsets(nums, target):\n    // TODO: iterate masks 0..(1 << n) - 1 without recursion",
        expectedOutput: "2\n2",
        hint: "Check `(mask & (1 << i)) != 0` inside the inner `i = 0..n-1` loop.",
        complexity: { time: "O(n * 2^n)", space: "O(1)" },
        solutionCode:
          "function count_target_subsets(nums, target):\n    n ← len(nums)\n    matches ← 0\n    for mask from 0 to (1 << n) - 1:\n        total ← 0\n        for i from 0 to n - 1:\n            if (mask & (1 << i)) != 0:\n                total ← total + nums[i]\n        if total == target:\n            matches ← matches + 1\n    return matches",
      },
    ],
  },
};

export const dsaM02PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m2",
  title: "Module 02 Practice Set: Bit Manipulation",
  description:
    "Four mixed problems applying bit packing and shifts, single-bit and power-of-two checks, O(1)-space cancellation, and iterative subset enumeration.",
  problems: [
    {
      id: "dsa-m2-p1",
      title: "Pack and Unpack Two Small Counters",
      patternHint: "Use left shift (<< 8) and OR (|) to pack two bytes, then right shift (>> 8) and mask (& 255) to unpack (Lesson 02-1).",
      lessonRefId: "dsa-binary-bitwise",
      goal: "Write `pack_pair(hi, lo)` to store two integers (`0 <= hi, lo <= 255`) inside one 16-bit integer with `hi` in bits `8..15` and `lo` in bits `0..7`, and `unpack_pair(packed)` to recover `(hi, lo)`.",
      constraints: ["0 <= hi, lo <= 255", "Use bitwise shifts and masks instead of division or modulo", "Target: O(1)"],
      examples: [
        {
          input: "hi = 12, lo = 45",
          output: "packed=3117, unpacked=(12, 45)",
          explanation: "(12 << 8) | 45 = 3072 + 45 = 3117; 3117 >> 8 = 12 and 3117 & 255 = 45.",
        },
        {
          input: "hi = 255, lo = 0",
          output: "packed=65280, unpacked=(255, 0)",
          explanation: "Max high byte (255 << 8 = 65280) with zero low byte tests full 16-bit bitmask boundaries.",
        },
      ],
      tasks: [
        "Encode with `(hi << 8) | lo`.",
        "Decode `hi = packed >> 8` and `lo = packed & 255` (`255` is eight `1`-bits: `11111111`).",
      ],
      starterCode:
        "function pack_pair(hi, lo):\n    // TODO: pack hi into bits 8..15 and lo into bits 0..7\n\nfunction unpack_pair(packed):\n    // TODO: recover (hi, lo)",
      expectedOutput: "packed=3117, unpacked=(12, 45)\npacked=65280, unpacked=(255, 0)",
      hint: "255 equals `(1 << 8) - 1`, which keeps only the lowest 8 bits.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "function pack_pair(hi, lo):\n    return (hi << 8) | lo\n\nfunction unpack_pair(packed):\n    return (packed >> 8, packed & 255)",
    },
    {
      id: "dsa-m2-p2",
      title: "Memory Block Split Check",
      patternHint: "Combine the O(1) power-of-two test (n > 0 and (n & (n - 1)) == 0) with Brian Kernighan's set-bit loop (Lesson 02-2).",
      lessonRefId: "dsa-bit-tricks",
      goal: "Given a requested capacity `units`, return `(single_block, min_blocks)` where `single_block` is `true` if `units` equals an exact power-of-two block (`2^k` for `k >= 0`), and `min_blocks` is the minimum number of distinct `2^k` blocks that sum to `units`.",
      constraints: ["0 <= units <= 10^9", "Target time: O(min_blocks)", "Extra space: O(1)"],
      examples: [
        { input: "units = 16", output: "(true, 1)", explanation: "16 is a single 2^4 block." },
        { input: "units = 13", output: "(false, 3)", explanation: "13 = 8 + 4 + 1 uses 3 distinct blocks." },
        { input: "units = 0", output: "(false, 0)" },
      ],
      tasks: [
        "Check `units > 0 and (units & (units - 1)) == 0` for `single_block`.",
        "Count set bits in `units` using `n &= (n - 1)` for `min_blocks`.",
      ],
      starterCode:
        "function block_split_check(units):\n    // TODO: return (single_block, min_blocks)",
      expectedOutput: "(true, 1)\n(false, 3)\n(false, 0)",
      hint: "Each `1`-bit at index `k` in `units` corresponds to one distinct `2^k` block.",
      complexity: { time: "O(set bits)", space: "O(1)" },
      solutionCode:
        "function block_split_check(units):\n    single_block ← units > 0 and (units & (units - 1)) == 0\n    n ← units\n    min_blocks ← 0\n    while n > 0:\n        n ← n & (n - 1)\n        min_blocks ← min_blocks + 1\n    return (single_block, min_blocks)",
    },
    {
      id: "dsa-m2-p3",
      title: "Find the Unpaired Packet ID",
      patternHint: "Use self-canceling XOR (x ^ x = 0) across one pass in O(1) extra space (Lesson 02-3).",
      lessonRefId: "dsa-xor-bitmasks",
      goal: "Every packet ID in `ids` was logged in matching pairs except one stray ID that was logged once. Find and return that stray ID in `O(n)` time and `O(1)` extra space.",
      constraints: ["1 <= len(ids) <= 10^5", "Target: O(n) time, O(1) extra space", "Do not use extra lookup containers"],
      examples: [
        { input: "ids = [19, 4, 19, 8, 4]", output: "8", explanation: "19^19 = 0 and 4^4 = 0, leaving 8." },
        { input: "ids = [42]", output: "42" },
      ],
      tasks: [
        "Accumulate `res = res ^ id` across all IDs starting from `0`.",
        "Return `res` after one linear pass.",
      ],
      starterCode:
        "function unpaired_packet(ids):\n    // TODO: find the unpaired ID in O(1) space",
      expectedOutput: "8\n42",
      hint: "Matching pairs cancel out regardless of order because XOR is commutative.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function unpaired_packet(ids):\n    res ← 0\n    for each id in ids:\n        res ← res ^ id\n    return res",
    },
    {
      id: "dsa-m2-p4",
      title: "Maximum Team Weight Under Budget",
      patternHint: "Iterate masks 0..(1 << n) - 1 in nested loops and test (mask & (1 << i)) != 0 (Lesson 02-3).",
      lessonRefId: "dsa-xor-bitmasks",
      goal: "Given `n` item weights (`1 <= n <= 16`) and a budget `limit`, find the largest total weight achievable by choosing any subset of items without exceeding `limit`.",
      constraints: ["1 <= n <= 16", "1 <= weights[i] <= 10^6", "0 <= limit <= 10^7", "No recursion; target O(n * 2^n) time"],
      examples: [
        { input: "weights = [4, 7, 9], limit = 12", output: "11", explanation: "Choosing [4, 7] gives 11 <= 12." },
        { input: "weights = [5, 8, 3], limit = 2", output: "0", explanation: "Only the empty subset fits." },
      ],
      tasks: [
        "Initialize `best = 0`.",
        "For `mask` from `0` to `(1 << n) - 1`, sum active `weights[i]` where `(mask & (1 << i)) != 0`; if `total <= limit`, update `best = max(best, total)`.",
      ],
      starterCode:
        "function max_weight_under_budget(weights, limit):\n    // TODO: enumerate subsets iteratively and track best <= limit",
      expectedOutput: "11\n0",
      hint: "Even `mask = 0` (sum `0`) is a valid subset when every single item exceeds `limit`.",
      complexity: { time: "O(n * 2^n)", space: "O(1)" },
      solutionCode:
        "function max_weight_under_budget(weights, limit):\n    n ← len(weights)\n    best ← 0\n    for mask from 0 to (1 << n) - 1:\n        total ← 0\n        for i from 0 to n - 1:\n            if (mask & (1 << i)) != 0:\n                total ← total + weights[i]\n        if total <= limit and total > best:\n            best ← total\n    return best",
    },
  ],
};
