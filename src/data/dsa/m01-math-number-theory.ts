import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM01Lessons: Record<string, LessonContent> = {
  "dsa-digit-math": {
    lessonId: "dsa-digit-math",
    subtitle:
      "Peel base-10 digits with mod 10 and integer division, reverse numbers, check palindromes, and guard 32-bit and 64-bit signed limits.",
    intro: {
      heading: "Digit Extraction & Integer Overflow",
      explanation: [
        "Reverse `1534236469` inside a 32-bit signed integer and `rev * 10 + digit` silently wraps around past `2,147,483,647` before any post-check can catch it. Meanwhile, counting digits of `n = 0` with `while n > 0` returns `0` digits instead of `1`. Two arithmetic steps peel digits without converting to text: `n mod 10` reads the ones digit, and `floor(n / 10)` drops it.",
        "Reassembling digits via `rev = rev * 10 + digit` drives digit counting, digit sums, reversal, and palindrome checks in `O(log10 n)` time and `O(1)` extra space—as long as you check 32-bit and 64-bit ceilings before multiplying by `10`.",
      ],
      analogy:
        "Numbered train cars sitting on a track work the same way: `n mod 10` reads the caboose at the rear, and `floor(n / 10)` uncouples it so the car ahead becomes the new caboose.",
      realWorldUses: [
        "Validating credit card, barcode, and ISBN check digits in constant extra memory",
        "Parsing and reversing numeric IDs in 32-bit or 64-bit systems without wraparound bugs",
      ],
    },
    sections: [
      {
        heading: "Base-10 digit operations and signed integer limits",
        paragraphs: [
          "Repeating `digit = n mod 10` and `n = floor(n / 10)` visits each decimal digit from right to left. Tracing `n = 1234` takes 4 passes: `(n=1234 -> d=4, rev=4)`, `(123 -> d=3, rev=43)`, `(12 -> d=2, rev=432)`, `(1 -> d=1, rev=4321)`, then stops at `n = 0`.",
          "Signed 32-bit integers hold `-2,147,483,648` to `2,147,483,647`. Checking `rev > floor(INT_MAX / 10)` *before* multiplying catches `rev = 214748364, digit = 8` before `2,147,483,648` overflows; checking after `rev * 10 + digit` is already too late.",
        ],
        code: [
          "// Trace n = 1234: (1234 -> d=4, rev=4) -> (123 -> d=3, rev=43) -> (12 -> d=2, rev=432) -> (1 -> d=1, rev=4321)",
          "// Broken overflow check (wraps BEFORE comparison in 32-bit):",
          "rev = rev * 10 + digit; if rev > INT_MAX: return 0",
          "// Working pre-check (rev = 214748364, digit = 8 caught before * 10):",
          "if rev > 214748364 or (rev == 214748364 and digit > 7): return 0",
        ],
        output: "1234 -> 4321 | 1534236469 -> 0 (overflow prevented)",
        table: {
          caption: "Digit operations and fixed-width signed integer boundaries",
          headers: ["Operation or Bound", "Formula / Exact Value", "Key Detail"],
          rows: [
            ["Read rightmost digit", "`n mod 10` (for `n >= 0`)", "Take `abs(n)` or track sign first for negative inputs"],
            ["Drop rightmost digit", "`floor(n / 10)` (for `n >= 0`)", "Shrinks `n` by factor of 10 each step"],
            ["Append digit to reversed value", "`rev = rev * 10 + digit`", "Must guard overflow before multiplying by 10"],
            ["32-bit signed max (`INT_MAX`)", "`2,147,483,647` (`2^31 - 1`)", "Pre-check: `rev > 214748364` or (`rev == 214748364` and `d > 7`)"],
            ["32-bit signed min (`INT_MIN`)", "`-2,147,483,648` (`-2^31`)", "Pre-check: `rev < -214748364` or (`rev == -214748364` and `d < -8`)"],
            ["64-bit signed max (`LLONG_MAX`)", "`9,223,372,036,854,775,807` (`2^63 - 1`)", "Holds up to 18 full decimal digits (`~9.22 * 10^18`)"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Never test for overflow after computing `rev * 10 + digit`. In 32-bit or 64-bit signed arithmetic, the multiplication wraps around or overflows before the comparison executes. Always check against `floor(INT_MAX / 10)` first.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build 32-Bit Overflow-Safe Integer Reversal",
      subtitle: "Start with a raw digit loop, add sign handling, then guard INT_MAX before multiplying by 10.",
      steps: [
        {
          label: "Step 1: Basic positive reversal loop (overflows on 1534236469)",
          explanation: "Peeling `x mod 10` and `floor(x / 10)` reverses positive inputs like `1234`, yet wraps 32-bit integers on large inputs and ignores negatives.",
          code: [
            "function reverse_basic(x):",
            "    rev ← 0",
            "    while x > 0:",
            "        rev ← rev * 10 + (x mod 10)",
            "        x ← floor(x / 10)",
            "    return rev",
          ],
          activeLines: [3, 4, 5],
          output: "1234 -> 4321 | 1534236469 -> OVERFLOW",
        },
        {
          label: "Step 2: Preserve sign and guard INT_MIN = -2147483648",
          explanation: "Because `-(-2147483648)` itself overflows signed 32-bit, return `0` up front for `INT_MIN` and strip the sign into `sign`.",
          code: [
            "function reverse_signed(x):",
            "    if x == -2147483648: return 0",
            "    sign ← 1",
            "    if x < 0: sign ← -1; x ← -x",
            "    rev ← 0",
            "    while x > 0:",
            "        rev ← rev * 10 + (x mod 10)",
            "        x ← floor(x / 10)",
            "    return sign * rev",
          ],
          activeLines: [2, 3, 4],
          output: "-120 -> -21",
        },
        {
          label: "Step 3: Pre-check floor(INT_MAX / 10) before multiplying by 10",
          explanation: "Reject `rev > 214748364` or `(rev == 214748364 and digit > 7)` before executing `rev * 10 + digit`.",
          code: [
            "function reverse_int32(x):",
            "    if x == -2147483648: return 0",
            "    sign ← -1 if x < 0 else 1",
            "    x ← abs(x); rev ← 0",
            "    while x > 0:",
            "        digit ← x mod 10",
            "        if rev > 214748364 or (rev == 214748364 and digit > 7): return 0",
            "        rev ← rev * 10 + digit",
            "        x ← floor(x / 10)",
            "    return sign * rev",
          ],
          activeLines: [7, 8],
          output: "1534236469 -> 0 | -120 -> -21",
        },
      ],
    },
    walkthrough: {
      title: "Peeling digits, reversing 1234, and catching 32-bit overflow",
      layout: "visual-first",
      steps: [
        {
          title: "Start with n = 1234 and an empty accumulator rev = 0",
          tag: "CONCEPT",
          explanation: [
            "We hold `n = 1234` in one scalar variable and `rev = 0` in another. The four digits sit inside `n` waiting to be read from right to left.",
            "Each pass extracts the rightmost digit (`n mod 10`), pushes it onto `rev`, and truncates `n` with `floor(n / 10)`.",
          ],
          code: [
            "n ← 1234",
            "rev ← 0",
            "while n > 0:",
            "    digit ← n mod 10",
            "    rev ← rev * 10 + digit",
            "    n ← floor(n / 10)",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "n", value: "1234" },
            { name: "rev", value: "0" },
            { name: "digit", value: "-" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Current digits remaining in n = 1234",
                cells: [
                  { id: "d0", value: "1", index: 0 },
                  { id: "d1", value: "2", index: 1 },
                  { id: "d2", value: "3", index: 2 },
                  { id: "d3", value: "4", index: 3, state: "active" },
                ],
                pointers: [
                  { index: 3, label: "n mod 10 target", tone: "coral" },
                ],
              },
              {
                label: "Accumulator rev",
                cells: [
                  { id: "r0", value: "0", index: 0, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "rev = 0", tone: "accent" },
                ],
              },
            ],
            caption: "Mod 10 isolates the rightmost digit without converting n into text.",
          },
        },
        {
          title: "Iteration 1: extract 4 and shift n down to 123",
          tag: "TRACE",
          explanation: [
            "`1234 mod 10` produces `4`. Setting `rev = 0 * 10 + 4` stores `4` in `rev`.",
            "Then `floor(1234 / 10)` cuts off the trailing `4`, leaving `n = 123` for the next pass.",
          ],
          code: [
            "n ← 1234",
            "rev ← 0",
            "while n > 0:",
            "    digit ← n mod 10       // 4",
            "    rev ← rev * 10 + digit // 4",
            "    n ← floor(n / 10)      // 123",
          ],
          activeLines: [4, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "digit", value: "4", changed: true },
            { name: "rev", value: "4", changed: true },
            { name: "n", value: "123", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Remaining digits in n = 123",
                cells: [
                  { id: "d0", value: "1", index: 0 },
                  { id: "d1", value: "2", index: 1 },
                  { id: "d2", value: "3", index: 2, state: "active" },
                  { id: "d3", value: "4", index: 3, state: "dim" },
                ],
                pointers: [
                  { index: 2, label: "next n mod 10", tone: "coral" },
                ],
              },
              {
                label: "Digits built inside rev = 4",
                cells: [
                  { id: "r0", value: "4", index: 0, state: "done" },
                ],
                pointers: [
                  { index: 0, label: "rev = 4", tone: "ok" },
                ],
              },
            ],
            caption: "First pass moves 4 from the tail of n into rev.",
          },
        },
        {
          title: "Iteration 2: extract 3 so rev = 43 and n = 12",
          tag: "TRACE",
          explanation: [
            "Pass 2 peels `123 mod 10 = 3`, raising `rev` to `4 * 10 + 3 = 43`.",
            "Truncating with `floor(123 / 10)` leaves `n = 12` for the third iteration.",
          ],
          code: [
            "n ← 123",
            "while n > 0:",
            "    digit ← n mod 10       // 3",
            "    rev ← rev * 10 + digit // 43",
            "    n ← floor(n / 10)      // 12",
          ],
          activeLines: [3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "digit", value: "3", changed: true },
            { name: "rev", value: "43", changed: true },
            { name: "n", value: "12", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Remaining digits in n = 12",
                cells: [
                  { id: "d0", value: "1", index: 0 },
                  { id: "d1", value: "2", index: 1, state: "active" },
                  { id: "d2", value: "3", index: 2, state: "dim" },
                  { id: "d3", value: "4", index: 3, state: "dim" },
                ],
                pointers: [
                  { index: 1, label: "next n mod 10", tone: "coral" },
                ],
              },
              {
                label: "Digits built inside rev = 43",
                cells: [
                  { id: "r0", value: "4", index: 0, state: "done" },
                  { id: "r1", value: "3", index: 1, state: "done" },
                ],
                pointers: [
                  { index: 1, label: "rev = 43", tone: "ok" },
                ],
              },
            ],
            caption: "Second pass shifts rev left in base 10 and appends 3.",
          },
        },
        {
          title: "Iteration 3: extract 2 so rev = 432 and n = 1",
          tag: "TRACE",
          explanation: [
            "Pass 3 peels `12 mod 10 = 2`, raising `rev` to `43 * 10 + 2 = 432`.",
            "Truncating `floor(12 / 10)` leaves only the final digit `n = 1`.",
          ],
          code: [
            "n ← 12",
            "while n > 0:",
            "    digit ← n mod 10       // 2",
            "    rev ← rev * 10 + digit // 432",
            "    n ← floor(n / 10)      // 1",
          ],
          activeLines: [3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "digit", value: "2", changed: true },
            { name: "rev", value: "432", changed: true },
            { name: "n", value: "1", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Remaining digit in n = 1",
                cells: [
                  { id: "d0", value: "1", index: 0, state: "active" },
                  { id: "d1", value: "2", index: 1, state: "dim" },
                  { id: "d2", value: "3", index: 2, state: "dim" },
                  { id: "d3", value: "4", index: 3, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "last digit", tone: "coral" },
                ],
              },
              {
                label: "Digits built inside rev = 432",
                cells: [
                  { id: "r0", value: "4", index: 0, state: "done" },
                  { id: "r1", value: "3", index: 1, state: "done" },
                  { id: "r2", value: "2", index: 2, state: "done" },
                ],
                pointers: [
                  { index: 2, label: "rev = 432", tone: "ok" },
                ],
              },
            ],
            caption: "Each digit multiplies rev by 10 to make room at the ones place.",
          },
        },
        {
          title: "Iteration 4: peel final 1 so rev = 4321 and n = 0",
          tag: "TRACE",
          explanation: [
            "Pass 4 takes `1 mod 10 = 1`, updates `rev = 432 * 10 + 1 = 4321`, and sets `n = floor(1 / 10) = 0`.",
            "The loop condition `n > 0` stops after 4 passes, matching `O(log10 n)` time and `O(1)` extra space.",
          ],
          code: [
            "while n > 0:",
            "    digit ← n mod 10       // 1",
            "    rev ← rev * 10 + digit // 4321",
            "    n ← floor(n / 10)      // 0 -> loop exits",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "digit", value: "1", changed: true },
            { name: "rev", value: "4321", changed: true },
            { name: "n", value: "0", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "All digits consumed (n = 0)",
                cells: [
                  { id: "d0", value: "1", index: 0, state: "dim" },
                  { id: "d1", value: "2", index: 1, state: "dim" },
                  { id: "d2", value: "3", index: 2, state: "dim" },
                  { id: "d3", value: "4", index: 3, state: "dim" },
                ],
              },
              {
                label: "Final reversed integer rev = 4321",
                cells: [
                  { id: "r0", value: "4", index: 0, state: "done" },
                  { id: "r1", value: "3", index: 1, state: "done" },
                  { id: "r2", value: "2", index: 2, state: "done" },
                  { id: "r3", value: "1", index: 3, state: "done" },
                ],
                pointers: [
                  { index: 3, label: "rev = 4321", tone: "ok" },
                ],
              },
            ],
            caption: "Four passes reverse a 4-digit integer in O(1) extra space.",
          },
        },
        {
          title: "Guard 32-bit overflow before multiplying rev by 10",
          tag: "PITFALL",
          explanation: [
            "Suppose `rev = 214748364` (`floor(INT_MAX / 10)`) and the next peeled digit is `8`. Multiplying `rev * 10 + 8` produces `2147483648`, which exceeds `INT_MAX = 2147483647` by `1`.",
            "Checking `if rev > 214748364 or (rev == 214748364 and digit > 7): return 0` rejects the bad update before the 32-bit slot overflows.",
          ],
          callout: {
            kind: "RULE OF THUMB",
            text: "For any 10-digit reversed input, the tenth digit is the only place `rev == floor(INT_MAX / 10)` can tie; digits `0..7` succeed for positive overflow, and `-8..-1` succeed for negative `INT_MIN`.",
          },
          code: [
            "INT_MAX ← 2147483647",
            "if rev > floor(INT_MAX / 10):",
            "    return 0",
            "if rev == floor(INT_MAX / 10) and digit > 7:",
            "    return 0",
            "rev ← rev * 10 + digit",
          ],
          activeLines: [4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "rev", value: "214748364" },
            { name: "digit", value: "8" },
            { name: "Guard result", value: "Overflow caught -> 0", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "32-bit signed ceiling check (INT_MAX = 2147483647)",
                cells: [
                  { id: "b0", value: "2", index: 0, state: "done" },
                  { id: "b1", value: "147", index: 1, state: "done" },
                  { id: "b2", value: "483", index: 2, state: "done" },
                  { id: "b3", value: "64", index: 3, state: "done" },
                  { id: "b4", value: "8 > 7", index: 4, state: "pivot" },
                ],
                pointers: [
                  { index: 3, label: "rev = 214748364", tone: "ok" },
                  { index: 4, label: "digit = 8 overflows", tone: "coral" },
                ],
              },
            ],
            caption: "Comparing rev against floor(INT_MAX / 10) catches overflow before multiplication.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Zero has 1 digit, not 0 digits",
        detail:
          "A plain `while n > 0` digit-counting loop returns `0` when `n = 0`. Handle `if n == 0: return 1` explicitly before entering the loop.",
        code: "if n == 0: return 1",
      },
      {
        title: "Negative numbers and `% 10` differ across languages",
        detail:
          "In C++, Java, and JavaScript, `-123 % 10` evaluates to `-3` and integer division truncates toward zero, while Python's `-123 % 10` gives `7`. Save the sign first and work on `abs(n)` (or handle negative inputs directly) so behavior stays consistent.",
      },
      {
        title: "Half-reversal avoids palindrome overflow",
        detail:
          "Reversing all digits of `2147483647` overflows 32-bit ints (`7463847412`). For numeric palindromes, reject `x < 0` or trailing zeros (`x != 0 and x mod 10 == 0`), then reverse only until `rev >= x` and compare `x == rev` or `x == floor(rev / 10)`.",
      },
    ],
    practiceTask: {
      title: "Sum and Count Digits of an Integer",
      tier: "Warmup",
      goal: "Given any integer `n` (positive, zero, or negative), return `(digit_count, digit_sum)` using only integer arithmetic in `O(log10(|n| + 1))` time.",
      constraints: ["-10^18 <= n <= 10^18", "Do not convert `n` to text", "Extra space: O(1)"],
      examples: [
        { input: "n = 5082", output: "(4, 15)", explanation: "4 digits: 5 + 0 + 8 + 2 = 15." },
        { input: "n = 0", output: "(1, 0)", explanation: "Zero has 1 digit whose sum is 0." },
        { input: "n = -94", output: "(2, 13)", explanation: "Work on abs(-94) = 94." },
      ],
      tasks: [
        "Handle `n == 0` upfront by returning `(1, 0)`.",
        "Take `x = abs(n)`, then peel `x mod 10` and `floor(x / 10)` until `x == 0`.",
      ],
      starterCode: "function digit_count_and_sum(n):\n    // TODO: return (count, sum) without string conversion",
      expectedOutput: "(4, 15)\n(1, 0)\n(2, 13)",
      hint: "Handle `n == 0` first; otherwise take `x = abs(n)` and loop `while x > 0`.",
      complexity: { time: "O(log n)", space: "O(1)" },
      solutionCode:
        "function digit_count_and_sum(n):\n    if n == 0:\n        return (1, 0)\n    x ← abs(n)\n    count ← 0\n    total ← 0\n    while x > 0:\n        total ← total + (x mod 10)\n        count ← count + 1\n        x ← floor(x / 10)\n    return (count, total)",
    },
    practiceChallenges: [
      {
        title: "Sum and Count Digits of an Integer",
        tier: "Warmup",
        goal: "Return `(digit_count, digit_sum)` for any signed integer `n` using integer division and modulo only.",
        constraints: ["-10^18 <= n <= 10^18", "Do not convert `n` to text", "Extra space: O(1)"],
        examples: [
          { input: "n = 5082", output: "(4, 15)" },
          { input: "n = 0", output: "(1, 0)" },
        ],
        tasks: [
          "Return `(1, 0)` immediately when `n == 0`.",
          "Loop over `x = abs(n)` adding `x mod 10` and incrementing `count`.",
        ],
        starterCode: "function digit_count_and_sum(n):\n    // TODO: count and sum digits in O(1) space",
        expectedOutput: "(4, 15)\n(1, 0)",
        hint: "Zero must be handled separately because `while x > 0` runs zero times when `x = 0`.",
        complexity: { time: "O(log n)", space: "O(1)" },
        solutionCode:
          "function digit_count_and_sum(n):\n    if n == 0:\n        return (1, 0)\n    x ← abs(n)\n    count ← 0\n    total ← 0\n    while x > 0:\n        total ← total + (x mod 10)\n        count ← count + 1\n        x ← floor(x / 10)\n    return (count, total)",
      },
      {
        title: "32-Bit Safe Integer Reversal",
        tier: "Core",
        goal: "Reverse the decimal digits of signed 32-bit integer `x`. If the reversed value falls outside `[-2147483648, 2147483647]`, return `0` without overflowing 32-bit slots.",
        constraints: ["-2147483648 <= x <= 2147483647", "Assume 32-bit signed integer limits", "Extra space: O(1)"],
        examples: [
          { input: "x = -120", output: "-21", explanation: "Sign stays negative and leading zero drops." },
          { input: "x = 1534236469", output: "0", explanation: "9646324351 exceeds INT_MAX = 2147483647." },
        ],
        tasks: [
          "Store `sign` (`-1` if `x < 0` else `1`), or handle `x == -2147483648` early since `-x` overflows 32-bit signed.",
          "Check `rev > 214748364` or `(rev == 214748364 and digit > 7)` (or `digit > 8` for negative) before multiplying `rev * 10`.",
        ],
        starterCode: "function reverse_int32(x):\n    // TODO: reverse x with pre-multiplication 32-bit bounds guard",
        expectedOutput: "-21\n0",
        hint: "In signed 32-bit, `abs(-2147483648)` itself overflows, so return `0` immediately when `x == -2147483648` (its reverse `-8463847412` overflows anyway).",
        complexity: { time: "O(log n)", space: "O(1)" },
        solutionCode:
          "function reverse_int32(x):\n    if x == -2147483648:\n        return 0\n    sign ← 1\n    if x < 0:\n        sign ← -1\n        x ← -x\n    rev ← 0\n    while x > 0:\n        digit ← x mod 10\n        if rev > 214748364 or (rev == 214748364 and digit > 7):\n            return 0\n        rev ← rev * 10 + digit\n        x ← floor(x / 10)\n    return sign * rev",
      },
      {
        title: "Numeric Palindrome by Half-Reversal",
        tier: "Stretch",
        goal: "Return `true` if integer `x` reads identically forwards and backwards, using `O(1)` extra space and never overflowing 32-bit integers.",
        constraints: ["-2^31 <= x <= 2^31 - 1", "No string conversion", "No full-number reversal that could overflow"],
        examples: [
          { input: "x = 12321", output: "true", explanation: "Half-loop stops at x = 12, rev = 123; 12 == floor(123 / 10)." },
          { input: "x = 120", output: "false", explanation: "Trailing zero cannot match leading non-zero digit." },
          { input: "x = -121", output: "false" },
        ],
        tasks: [
          "Return `false` immediately if `x < 0` or `(x != 0 and x mod 10 == 0)`.",
          "While `x > rev`, move the last digit of `x` onto `rev`; afterward check `x == rev or x == floor(rev / 10)`.",
        ],
        starterCode: "function is_palindrome_number(x):\n    // TODO: reverse only the right half of digits",
        expectedOutput: "true\nfalse\nfalse",
        hint: "When `x` has an odd number of digits, the middle digit ends up as the ones digit of `rev`, so `floor(rev / 10)` strips it.",
        complexity: { time: "O(log n)", space: "O(1)" },
        solutionCode:
          "function is_palindrome_number(x):\n    if x < 0 or (x != 0 and x mod 10 == 0):\n        return false\n    rev ← 0\n    while x > rev:\n        rev ← rev * 10 + (x mod 10)\n        x ← floor(x / 10)\n    return x == rev or x == floor(rev / 10)",
      },
    ],
  },

  "dsa-primes-sieve": {
    lessonId: "dsa-primes-sieve",
    subtitle:
      "Discover all divisors in O(sqrt(n)), test single primes via trial division, and precompute primes up to n with the Sieve of Eratosthenes.",
    intro: {
      heading: "Factors, Primality & Sieve of Eratosthenes",
      explanation: [
        "Testing every number in `2..1,000,000` with trial division runs `O(n sqrt(n))` (`~6.7 × 10^8` checks) and hits Time Limit Exceeded. Even for a single large number like `n = 2,147,483,647`, writing `d * d <= n` overflows 32-bit signed integers once `d` hits `46,341`, while perfect squares like `n = 36` double-count `6` unless guarded.",
        "Divisors always arrive in pairs `(d, n / d)` with one side `<= sqrt(n)`, so single-number checks finish in `O(sqrt(n))` time. For all primes up to `n`, the **Sieve of Eratosthenes** flips a boolean table `is_prime[0..n]` by crossing out multiples of each prime `p` starting at `p * p`, dropping total work to `O(n log log n)`.",
      ],
      analogy:
        "Checking one suspect at a time up to `1,000,000` is slow detective work. Instead, lay out numbered cards `0..n`, flip `0` and `1` face down, and each time you reach a face-up prime `p`, flip multiples `p * p, p * (p + 1), ...` face down in rapid hops.",
      realWorldUses: [
        "Precomputing prime tables up to millions in milliseconds for number-theory and factoring queries",
        "Counting divisors and testing large primality candidates without 32-bit `d * d` overflow",
      ],
    },
    sections: [
      {
        heading: "Factor pairs up to sqrt(n) vs Sieve of Eratosthenes",
        paragraphs: [
          "To prevent 32-bit overflow in `d * d <= n`, test `d <= floor(n / d)`. When `d` divides `n`, both `d` and `n / d` are divisors—check `d != n / d` so `n = 36` counts `6` once instead of twice (`1 + 2 + 3 + 4 + 6 + 9 + 12 + 18 = 55`).",
          "Tracing the Sieve on `n = 12`: mark `0, 1` false and `2..12` true. At `p = 2`, cross out `4, 6, 8, 10, 12`. At `p = 3`, start at `3 * 3 = 9` (skipping `6` already crossed by `2`) and mark `9` false (`12` is already false). At `p = 4`, `4 * 4 > 12` stops the loop, leaving primes `[2, 3, 5, 7, 11]`.",
        ],
        code: [
          "// Broken 32-bit loop (d = 46341 -> d*d = 2,147,488,281 wraps past INT_MAX):",
          "while d * d <= 2147483647: ...     // Overflows in 32-bit signed ints",
          "// Working overflow-free bound:",
          "while d <= floor(n / d): ...       // Stops at d = 46340 without overflow",
          "",
          "// Sieve trace for n = 12:",
          "// p=2 crosses: 4, 6, 8, 10, 12  |  p=3 crosses: 9 (skip 6)  |  p=4 stops (16 > 12)",
        ],
        output: "is_prime(2147483647) -> true | primes <= 12 -> [2, 3, 5, 7, 11]",
        table: {
          caption: "Comparing divisor and prime algorithms",
          headers: ["Task", "Algorithm", "Time Complexity", "Extra Space", "Practical Limit"],
          rows: [
            ["All divisors of one `n`", "Scan `1..n`", "`O(n)`", "`O(1)`", "`n <= 10^7`"],
            ["All divisors / Primality of one `n`", "Paired scan `1..sqrt(n)`", "`O(sqrt(n))`", "`O(1)`", "`n <= 10^14`"],
            ["All primes in `2..n`", "Trial division per number", "`O(n sqrt(n))`", "`O(1)`", "`n <= 10^4`"],
            ["All primes in `2..n`", "Sieve of Eratosthenes", "`O(n log log n)`", "`O(n)`", "`n <= 10^7`"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Starting the inner sieve loop at `p * p` instead of `2 * p` skips redundant work while keeping correctness exact: every composite multiple `k * p` with `k < p` already contains a prime factor smaller than `p`.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From O(n) Trial Check to O(sqrt(n)) Primality and O(n log log n) Sieve",
      subtitle: "Eliminate redundant checks, guard 32-bit multiplication, and scale up to 5 x 10^6.",
      steps: [
        {
          label: "Step 1: Naive O(n) divisor scan (times out at n = 10^9)",
          explanation: "Testing every candidate `d` from `2` to `n - 1` works for small numbers yet takes a billion steps for large primes.",
          code: [
            "function is_prime_slow(n):",
            "    if n <= 1: return false",
            "    for d from 2 to n - 1:",
            "        if n mod d == 0: return false",
            "    return true",
          ],
          activeLines: [3, 4],
          output: "is_prime(2147483647) -> ~2x10^9 checks (TLE)",
        },
        {
          label: "Step 2: Stop at sqrt(n) using d <= floor(n / d) (O(sqrt(n)))",
          explanation: "Using `d <= floor(n / d)` prevents `d * d` overflow in 32-bit integers and cuts work on `2147483647` down to `46,340` steps.",
          code: [
            "function is_prime(n):",
            "    if n <= 1: return false",
            "    d ← 2",
            "    while d <= floor(n / d):",
            "        if n mod d == 0: return false",
            "        d ← d + 1",
            "    return true",
          ],
          activeLines: [4, 5],
          output: "is_prime(2147483647) -> true in 46,340 checks",
        },
        {
          label: "Step 3: Sieve of Eratosthenes for all primes in 2..n (O(n log log n))",
          explanation: "Batch-marking multiples from `p * p` finds every prime up to `10^6` in milliseconds instead of running `is_prime` `10^6` times.",
          code: [
            "function sieve_primes(n):",
            "    is_p[0..n] ← true; is_p[0] ← false; is_p[1] ← false",
            "    p ← 2",
            "    while p * p <= n:",
            "        if is_p[p]:",
            "            for m from p * p to n step p:",
            "                is_p[m] ← false",
            "        p ← p + 1",
            "    return is_p",
          ],
          activeLines: [4, 5, 6, 7],
          output: "n = 12 -> [2, 3, 5, 7, 11]",
        },
      ],
    },
    walkthrough: {
      title: "Running the Sieve of Eratosthenes on is_prime[0..12]",
      layout: "visual-first",
      steps: [
        {
          title: "Initialize numbered boolean row is_prime[0..12]",
          tag: "CONCEPT",
          explanation: [
            "Slots `0` and `1` are neither prime nor composite, so mark them `F` (false). Mark slots `2..12` as `T` (true) to start.",
            "Outer variable `p` begins at `2` and only needs to run while `p * p <= 12`.",
          ],
          code: [
            "is_prime[0..n] ← all true",
            "is_prime[0] ← false",
            "is_prime[1] ← false",
            "p ← 2",
            "while p * p <= n:",
            "    if is_prime[p]:",
            "        for m from p * p to n step p:",
            "            is_prime[m] ← false",
            "    p ← p + 1",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "n", value: "12" },
            { name: "p", value: "2" },
            { name: "Bound", value: "p * p <= 12 (p <= 3)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "is_prime[0..12] initial state (T = candidate prime, F = not prime)",
                cells: [
                  { id: "s0", value: "F", index: 0, state: "dim" },
                  { id: "s1", value: "F", index: 1, state: "dim" },
                  { id: "s2", value: "T", index: 2, state: "active" },
                  { id: "s3", value: "T", index: 3 },
                  { id: "s4", value: "T", index: 4 },
                  { id: "s5", value: "T", index: 5 },
                  { id: "s6", value: "T", index: 6 },
                  { id: "s7", value: "T", index: 7 },
                  { id: "s8", value: "T", index: 8 },
                  { id: "s9", value: "T", index: 9 },
                  { id: "s10", value: "T", index: 10 },
                  { id: "s11", value: "T", index: 11 },
                  { id: "s12", value: "T", index: 12 },
                ],
                pointers: [
                  { index: 2, label: "p = 2", tone: "coral" },
                ],
              },
            ],
            caption: "Indices 0 and 1 start false; indices 2..12 start true.",
          },
        },
        {
          title: "p = 2 is prime: cross out 4, 6, 8, 10, 12",
          tag: "TRACE",
          explanation: [
            "Since `is_prime[2]` is `T` and `2 * 2 = 4 <= 12`, march from `4` up to `12` in steps of `2`.",
            "Slots `4, 6, 8, 10, 12` switch to `F`, leaving `2` itself untouched as prime.",
          ],
          code: [
            "while p * p <= n:",
            "    if is_prime[p]:",
            "        for m from p * p to n step p:",
            "            is_prime[m] ← false",
            "    p ← p + 1",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "p", value: "2" },
            { name: "Start m", value: "4 (p * p)" },
            { name: "Marked false", value: "4, 6, 8, 10, 12", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After crossing out multiples of p = 2 from 4..12",
                cells: [
                  { id: "s0", value: "F", index: 0, state: "dim" },
                  { id: "s1", value: "F", index: 1, state: "dim" },
                  { id: "s2", value: "T", index: 2, state: "done" },
                  { id: "s3", value: "T", index: 3 },
                  { id: "s4", value: "F", index: 4, state: "pivot" },
                  { id: "s5", value: "T", index: 5 },
                  { id: "s6", value: "F", index: 6, state: "pivot" },
                  { id: "s7", value: "T", index: 7 },
                  { id: "s8", value: "F", index: 8, state: "pivot" },
                  { id: "s9", value: "T", index: 9 },
                  { id: "s10", value: "F", index: 10, state: "pivot" },
                  { id: "s11", value: "T", index: 11 },
                  { id: "s12", value: "F", index: 12, state: "pivot" },
                ],
                pointers: [
                  { index: 2, label: "p = 2 (prime)", tone: "ok" },
                  { index: 4, label: "start p*p = 4", tone: "coral" },
                ],
              },
            ],
            caption: "All even slots beyond 2 become F in one linear sweep.",
          },
        },
        {
          title: "p = 3 is prime: start at 3 * 3 = 9 and cross out 9, 12",
          tag: "TRACE",
          explanation: [
            "Next candidate `p = 3` is still `T`, and `3 * 3 = 9 <= 12`. Notice we jump straight to `9` and skip `6` because `6` was already marked when `p = 2`.",
            "Setting `is_prime[9] = false` crosses out the only remaining odd composite up to `12` (`12` is already `F`).",
          ],
          code: [
            "while p * p <= n:",
            "    if is_prime[p]:",
            "        for m from p * p to n step p:",
            "            is_prime[m] ← false",
            "    p ← p + 1",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "p", value: "3", changed: true },
            { name: "Start m", value: "9 (p * p)", changed: true },
            { name: "Newly false", value: "9", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After crossing out multiples of p = 3 from 9..12",
                cells: [
                  { id: "s0", value: "F", index: 0, state: "dim" },
                  { id: "s1", value: "F", index: 1, state: "dim" },
                  { id: "s2", value: "T", index: 2, state: "done" },
                  { id: "s3", value: "T", index: 3, state: "done" },
                  { id: "s4", value: "F", index: 4, state: "dim" },
                  { id: "s5", value: "T", index: 5 },
                  { id: "s6", value: "F", index: 6, state: "dim" },
                  { id: "s7", value: "T", index: 7 },
                  { id: "s8", value: "F", index: 8, state: "dim" },
                  { id: "s9", value: "F", index: 9, state: "pivot" },
                  { id: "s10", value: "F", index: 10, state: "dim" },
                  { id: "s11", value: "T", index: 11 },
                  { id: "s12", value: "F", index: 12, state: "dim" },
                ],
                pointers: [
                  { index: 3, label: "p = 3 (prime)", tone: "ok" },
                  { index: 9, label: "9 marked F", tone: "coral" },
                ],
              },
            ],
            caption: "Starting at p * p = 9 skips 6, which was already crossed out by 2.",
          },
        },
        {
          title: "p = 4 breaks p * p <= 12 and stops the loop",
          tag: "CHECK",
          explanation: [
            "Incrementing `p` to `4` fails `p * p <= 12` (`16 > 12`), so the outer loop exits early.",
            "Every remaining `T` in `is_prime[0..12]` (`2, 3, 5, 7, 11`) has no prime divisor `<= sqrt(12)` and is prime.",
          ],
          code: [
            "p ← p + 1           // p = 4",
            "while p * p <= n:   // 16 <= 12 is false!",
            "    ...",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "p", value: "4", changed: true },
            { name: "4 * 4 <= 12", value: "false -> exit", changed: true },
            { name: "Primes found", value: "2, 3, 5, 7, 11", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Final sieve table: remaining T cells are all primes <= 12",
                cells: [
                  { id: "s0", value: "F", index: 0, state: "dim" },
                  { id: "s1", value: "F", index: 1, state: "dim" },
                  { id: "s2", value: "T", index: 2, state: "done" },
                  { id: "s3", value: "T", index: 3, state: "done" },
                  { id: "s4", value: "F", index: 4, state: "dim" },
                  { id: "s5", value: "T", index: 5, state: "done" },
                  { id: "s6", value: "F", index: 6, state: "dim" },
                  { id: "s7", value: "T", index: 7, state: "done" },
                  { id: "s8", value: "F", index: 8, state: "dim" },
                  { id: "s9", value: "F", index: 9, state: "dim" },
                  { id: "s10", value: "F", index: 10, state: "dim" },
                  { id: "s11", value: "T", index: 11, state: "done" },
                  { id: "s12", value: "F", index: 12, state: "dim" },
                ],
                pointers: [
                  { index: 2, label: "2", tone: "ok" },
                  { index: 3, label: "prime", tone: "ok" },
                  { index: 5, label: "5", tone: "ok" },
                  { index: 7, label: "7", tone: "ok" },
                  { index: 11, label: "11", tone: "ok" },
                ],
              },
            ],
            caption: "Any composite up to n has a prime factor <= sqrt(n), so stopping at p * p > n is complete.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "32-bit overflow in `d * d <= n` and `p * p`",
        detail:
          "When `n` is near `2 * 10^9`, `d * d` overflows 32-bit signed ints before the loop stops (`46341 * 46341 > INT_MAX`). Write `d <= floor(n / d)` for trial division, or use 64-bit integers.",
        code: "while d <= floor(n / d):",
      },
      {
        title: "Double-counting the square root of a perfect square",
        detail:
          "For `n = 36`, `d = 6` gives partner `n // d = 6`. Always check `if d != n // d` before adding the partner divisor so `6` is counted once.",
      },
      {
        title: "Treating `1` as prime",
        detail:
          "By definition, a prime has exactly two distinct positive divisors (`1` and itself). Since `1` has only one divisor, both `is_prime(1)` and `is_prime(0)` must return `false`.",
      },
    ],
    practiceTask: {
      title: "Sum of Proper Divisors",
      tier: "Warmup",
      goal: "Given positive integer `n`, return the sum of all positive divisors strictly smaller than `n` in `O(sqrt(n))` time.",
      constraints: ["1 <= n <= 10^9", "Target time: O(sqrt(n))", "Extra space: O(1)"],
      examples: [
        { input: "n = 28", output: "28", explanation: "1 + 2 + 4 + 7 + 14 = 28." },
        { input: "n = 36", output: "55", explanation: "1 + 2 + 3 + 4 + 6 + 9 + 12 + 18 = 55 (count 6 once)." },
        { input: "n = 1", output: "0", explanation: "No positive divisor is strictly smaller than 1." },
      ],
      tasks: [
        "Return `0` immediately when `n <= 1`.",
        "Start `total = 1` (since `1` divides every `n > 1`), then scan `d` from `2` while `d <= floor(n / d)`, adding `d` and `n / d` when distinct.",
      ],
      starterCode: "function sum_proper_divisors(n):\n    // TODO: sum divisors < n in O(sqrt(n)) time",
      expectedOutput: "28\n55\n0",
      hint: "Keep `n` itself excluded by starting `total = 1` and looping `d` from `2` up to `floor(n / d)`.",
      complexity: { time: "O(sqrt(n))", space: "O(1)" },
      solutionCode:
        "function sum_proper_divisors(n):\n    if n <= 1:\n        return 0\n    total ← 1\n    d ← 2\n    while d <= floor(n / d):\n        if n mod d == 0:\n            total ← total + d\n            partner ← n // d\n            if partner != d:\n                total ← total + partner\n        d ← d + 1\n    return total",
    },
    practiceChallenges: [
      {
        title: "Sum of Proper Divisors",
        tier: "Warmup",
        goal: "Compute the sum of all positive divisors of `n` strictly less than `n` in `O(sqrt(n))` time.",
        constraints: ["1 <= n <= 10^9", "Target time: O(sqrt(n))", "Extra space: O(1)"],
        examples: [
          { input: "n = 28", output: "28" },
          { input: "n = 36", output: "55" },
        ],
        tasks: [
          "Return `0` for `n <= 1`.",
          "Scan `d` from `2` while `d <= floor(n / d)`, adding `d` and distinct `n // d`.",
        ],
        starterCode: "function sum_proper_divisors(n):\n    // TODO: O(sqrt(n)) paired divisor sum",
        expectedOutput: "28\n55",
        hint: "If `d * d == n`, `d` equals `n // d`, so add `d` only once.",
        complexity: { time: "O(sqrt(n))", space: "O(1)" },
        solutionCode:
          "function sum_proper_divisors(n):\n    if n <= 1:\n        return 0\n    total ← 1\n    d ← 2\n    while d <= floor(n / d):\n        if n mod d == 0:\n            total ← total + d\n            partner ← n // d\n            if partner != d:\n                total ← total + partner\n        d ← d + 1\n    return total",
      },
      {
        title: "Overflow-Safe Trial Division Primality",
        tier: "Core",
        goal: "Return `true` if `n` is prime and `false` otherwise, handling inputs up to `2 * 10^9` without `d * d` overflow.",
        constraints: ["-10^9 <= n <= 2 * 10^9", "Target time: O(sqrt(n))", "Extra space: O(1)"],
        examples: [
          { input: "n = 1", output: "false" },
          { input: "n = 2147483647", output: "true" },
          { input: "n = 49", output: "false" },
        ],
        tasks: [
          "Reject `n <= 1`; return `true` for `n == 2` or `n == 3`; reject multiples of `2` or `3`.",
          "Test factors `d` from `5` upward (`d <= floor(n / d)`) stepping by `6` (checking `d` and `d + 2`), or step by `2` over odd `d`.",
        ],
        starterCode: "function is_prime(n):\n    // TODO: O(sqrt(n)) primality without d * d overflow",
        expectedOutput: "false\ntrue\nfalse",
        hint: "Use `while d <= floor(n / d)` so `d * d` never overflows a 32-bit integer.",
        complexity: { time: "O(sqrt(n))", space: "O(1)" },
        solutionCode:
          "function is_prime(n):\n    if n <= 1:\n        return false\n    if n == 2:\n        return true\n    if n mod 2 == 0:\n        return false\n    d ← 3\n    while d <= floor(n / d):\n        if n mod d == 0:\n            return false\n        d ← d + 2\n    return true",
      },
      {
        title: "Count Primes Strictly Below N",
        tier: "Stretch",
        goal: "Given non-negative integer `n`, return how many prime numbers are strictly less than `n` using the Sieve of Eratosthenes.",
        constraints: ["0 <= n <= 5 * 10^6", "Target time: O(n log log n)", "Extra space: O(n)"],
        examples: [
          { input: "n = 10", output: "4", explanation: "Primes strictly below 10 are 2, 3, 5, 7." },
          { input: "n = 2", output: "0", explanation: "No prime is strictly less than 2." },
        ],
        tasks: [
          "Return `0` if `n <= 2`.",
          "Allocate `is_prime[0..n-1]` initialized to `true`, set `0` and `1` to `false`, cross out multiples from `p * p` for `p * p < n`, then count `true` slots.",
        ],
        starterCode: "function count_primes_below(n):\n    // TODO: Sieve of Eratosthenes on [0..n-1]",
        expectedOutput: "4\n0",
        hint: "Note the strict bound `< n`, so your boolean row covers indices `0..n-1` and stops crossing out at `m < n`.",
        complexity: { time: "O(n log log n)", space: "O(n)" },
        solutionCode:
          "function count_primes_below(n):\n    if n <= 2:\n        return 0\n    is_prime ← boolean row of size n filled with true\n    is_prime[0] ← false\n    is_prime[1] ← false\n    p ← 2\n    while p * p < n:\n        if is_prime[p]:\n            m ← p * p\n            while m < n:\n                is_prime[m] ← false\n                m ← m + p\n        p ← p + 1\n    count ← 0\n    for i from 2 to n - 1:\n        if is_prime[i]:\n            count ← count + 1\n    return count",
      },
    ],
  },

  "dsa-gcd-lcm": {
    lessonId: "dsa-gcd-lcm",
    subtitle:
      "Shrink GCD computation from O(min(a, b)) to O(log(min(a, b))) via Euclid's remainder step, and compute LCM without intermediate overflow.",
    intro: {
      heading: "Euclidean GCD & LCM",
      explanation: [
        "Scanning downward from `min(a, b)` to find the **Greatest Common Divisor (GCD)** takes up to `10^9` steps on `(10^9, 10^9 - 1)` and times out, while subtracting `a - b` takes `10^9` steps on `(10^9, 1)`. Meanwhile, computing **LCM** with `(a * b) / gcd(a, b)` overflows 64-bit integers on `a = 10^12, b = 10^12 + 1` even when you only need to check a bound.",
        "Euclid's algorithm replaces `(a, b)` with `(b, a mod b)` until `b == 0`, cutting the larger argument at least in half every two rounds to finish in `O(log(min(a, b)))` time. Once `g = gcd(a, b)` is known, `(a / g) * b` divides first so intermediate products stay small.",
      ],
      analogy:
        "Tiling a `48 x 18` hallway with the largest identical square tiles illustrates Euclid's rule: two `18 x 18` tiles leave a `12 x 18` strip, one `12 x 12` tile leaves `12 x 6`, and two `6 x 6` tiles finish the floor.",
      realWorldUses: [
        "Reducing ratios and rational numbers `(num / g, den / g)` to lowest terms",
        "Computing when multiple periodic jobs, clocks, or signals next align (`lcm`) without multiplication overflow",
      ],
    },
    sections: [
      {
        heading: "Why remainder reduction works and how to compute safe LCM",
        paragraphs: [
          "Write `a = q * b + r` where `r = a mod b`. Any integer `d` that divides both `a` and `b` also divides `a - q * b = r`; conversely, any divisor of `b` and `r` divides `q * b + r = a`. Tracing `(48, 18)`: `(48, 18) -> (18, 48 mod 18 = 12) -> (12, 18 mod 12 = 6) -> (6, 12 mod 6 = 0) -> gcd = 6` in just 3 steps.",
          "Computing `lcm(a, b)` as `(a * b) / gcd(a, b)` overflows early on `a * b`. Because `g = gcd(a, b)` divides `a` evenly, `(a / g) * b` divides first (`(48 / 6) * 18 = 8 * 18 = 144` instead of `864 / 6`). Guard `a == 0 or b == 0` first by returning `0` so `lcm(0, 0)` never divides by `0`.",
        ],
        code: [
          "// Trace gcd(48, 18): (48, 18) -> (18, 12) -> (12, 6) -> (6, 0) -> 6",
          "// Broken LCM (multiplies first -> overflows 32-bit at a=100000, b=100000):",
          "bad_lcm = (a * b) / gcd(a, b)      // 10^10 overflows 32-bit before / g",
          "// Working LCM (guard zero, divide before multiplying):",
          "if a == 0 or b == 0: return 0",
          "good_lcm = (abs(a) / gcd(a, b)) * abs(b)",
        ],
        output: "gcd(48, 18) = 6 | lcm(48, 18) = 144 | lcm(0, 0) = 0",
        table: {
          caption: "GCD and LCM approaches compared",
          headers: ["Method", "Core Step", "Time Complexity", "Overflow Risk"],
          rows: [
            ["Brute-force GCD", "Test `d` from `min(a, b)` down to `1`", "`O(min(a, b))`", "None, but too slow above `10^7`"],
            ["Subtraction Euclid", "Replace larger with `a - b`", "`O(max(a, b))` worst case", "Slow on `(10^9, 1)`"],
            ["Modulo Euclid (iterative)", "`(a, b) <- (b, a mod b)` while `b != 0`", "`O(log(min(a, b)))`", "None when using `abs`"],
            ["Naive LCM", "`(a * b) / gcd(a, b)`", "`O(log(min(a, b)))`", "High (`a * b` overflows early)"],
            ["Divide-first LCM", "`(a / gcd(a, b)) * b`", "`O(log(min(a, b)))`", "Minimal (divides before multiplying)"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "RULE OF THUMB",
          text: "Write `lcm(a, b)` as `(a / gcd(a, b)) * b` and guard `a == 0 or b == 0` first by returning `0` so you never divide by `gcd(0, 0) = 0`.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From Slow Subtraction to Modulo Euclid and Overflow-Free LCM",
      subtitle: "Eliminate O(max(a, b)) subtraction loops and premature a * b multiplication.",
      steps: [
        {
          label: "Step 1: Subtraction loop (times out on (10^9, 1))",
          explanation: "Repeatedly subtracting `b` from `a` works on `(48, 18)` yet takes one billion iterations on `(10^9, 1)`.",
          code: [
            "function gcd_sub(a, b):",
            "    a ← abs(a); b ← abs(b)",
            "    while a != 0 and b != 0:",
            "        if a > b: a ← a - b",
            "        else: b ← b - a",
            "    return max(a, b)",
          ],
          activeLines: [4, 5],
          output: "gcd_sub(48, 18) = 6 (TLE on 10^9, 1)",
        },
        {
          label: "Step 2: Replace subtraction with modulo (O(log min(a, b)))",
          explanation: "Replacing `a - b` with `a mod b` jumps across all repeated subtractions in one step, finishing `(10^9, 1)` in 1 iteration.",
          code: [
            "function gcd(a, b):",
            "    a ← abs(a); b ← abs(b)",
            "    while b != 0:",
            "        rem ← a mod b",
            "        a ← b; b ← rem",
            "    return a",
          ],
          activeLines: [3, 4, 5],
          output: "gcd(48, 18) = 6 (3 steps) | gcd(10^9, 1) = 1 (1 step)",
        },
        {
          label: "Step 3: Guard zero and divide before multiplying for LCM",
          explanation: "Returning `0` when either input is `0` avoids division by zero, and `(abs(a) / g) * abs(b)` keeps intermediate numbers small.",
          code: [
            "function lcm(a, b):",
            "    if a == 0 or b == 0: return 0",
            "    g ← gcd(a, b)",
            "    return (abs(a) / g) * abs(b)",
          ],
          activeLines: [2, 3, 4],
          output: "lcm(48, 18) = 144 | lcm(0, 5) = 0",
        },
      ],
    },
    walkthrough: {
      title: "Tracing iterative gcd(48, 18) and overflow-safe lcm(48, 18)",
      layout: "visual-first",
      steps: [
        {
          title: "Start with a = 48 and b = 18",
          tag: "CONCEPT",
          explanation: [
            "Normalize signs with `abs` and enter `while b != 0`. At the start, `a = 48` and `b = 18`.",
            "Instead of subtracting `18` repeatedly, one `48 mod 18` jumps straight to the remainder `12`.",
          ],
          code: [
            "function gcd(a, b):",
            "    a ← abs(a)",
            "    b ← abs(b)",
            "    while b != 0:",
            "        rem ← a mod b",
            "        a ← b",
            "        b ← rem",
            "    return a",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "a", value: "48" },
            { name: "b", value: "18" },
            { name: "rem", value: "-" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Euclidean pair state (a, b)",
                cells: [
                  { id: "v48", value: "48", index: 0, state: "active" },
                  { id: "v18", value: "18", index: 1, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "a = 48", tone: "accent" },
                  { index: 1, label: "b = 18", tone: "coral" },
                ],
              },
            ],
            caption: "Each loop iteration replaces (a, b) with (b, a mod b).",
          },
        },
        {
          title: "Step 1: 48 mod 18 = 12, shift to (18, 12)",
          tag: "TRACE",
          explanation: [
            "`48 = 2 * 18 + 12`, so `rem = 12`. We set `a = 18` and `b = 12`.",
            "Every common divisor of `48` and `18` still divides `18` and `12`.",
          ],
          code: [
            "    while b != 0:",
            "        rem ← a mod b  // 48 mod 18 = 12",
            "        a ← b          // 18",
            "        b ← rem        // 12",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "rem", value: "12", changed: true },
            { name: "a", value: "18", changed: true },
            { name: "b", value: "12", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Pair after step 1: gcd(48, 18) = gcd(18, 12)",
                cells: [
                  { id: "v18", value: "18", index: 0, state: "active" },
                  { id: "v12", value: "12", index: 1, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "a = 18", tone: "accent" },
                  { index: 1, label: "b = 12", tone: "coral" },
                ],
              },
            ],
            caption: "48 dropped to 18 and 18 dropped to 12 in one modulo step.",
          },
        },
        {
          title: "Step 2: 18 mod 12 = 6, shift to (12, 6)",
          tag: "TRACE",
          explanation: [
            "Next remainder: `18 mod 12 = 6`. Shift `(a, b)` to `(12, 6)`.",
            "Both arguments shrank dramatically in just two iterations.",
          ],
          code: [
            "    while b != 0:",
            "        rem ← a mod b  // 18 mod 12 = 6",
            "        a ← b          // 12",
            "        b ← rem        // 6",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "rem", value: "6", changed: true },
            { name: "a", value: "12", changed: true },
            { name: "b", value: "6", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Pair after step 2: gcd(18, 12) = gcd(12, 6)",
                cells: [
                  { id: "v12", value: "12", index: 0, state: "active" },
                  { id: "v6", value: "6", index: 1, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "a = 12", tone: "accent" },
                  { index: 1, label: "b = 6", tone: "coral" },
                ],
              },
            ],
            caption: "Dividing 18 by 12 leaves remainder 6.",
          },
        },
        {
          title: "Step 3: 12 mod 6 = 0, b hits 0 so return a = 6",
          tag: "TRACE",
          explanation: [
            "`12 mod 6 = 0`. Shifting sets `a = 6` and `b = 0`.",
            "Because `b == 0`, the loop exits and returns `a = 6`, since `gcd(6, 0) = 6`.",
          ],
          code: [
            "    while b != 0:",
            "        rem ← a mod b  // 12 mod 6 = 0",
            "        a ← b          // 6",
            "        b ← rem        // 0 -> loop exits",
            "    return a           // 6",
          ],
          activeLines: [4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "rem", value: "0", changed: true },
            { name: "a (GCD)", value: "6", changed: true },
            { name: "b", value: "0", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Loop stops at b = 0; a holds gcd(48, 18) = 6",
                cells: [
                  { id: "v6", value: "6", index: 0, state: "done" },
                  { id: "v0", value: "0", index: 1, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "gcd = 6", tone: "ok" },
                ],
              },
            ],
            caption: "When remainder reaches 0, the previous divisor is the greatest common divisor.",
          },
        },
        {
          title: "Derive safe LCM via (48 / 6) * 18 = 144",
          tag: "PATTERN",
          explanation: [
            "Once `g = gcd(48, 18) = 6` is found, divide `48 / 6 = 8` first and then multiply `8 * 18 = 144`.",
            "Even for large inputs like `a = 10^9, b = 5 * 10^8`, dividing first keeps intermediate values much smaller than `a * b`.",
          ],
          code: [
            "function lcm(a, b):",
            "    if a == 0 or b == 0:",
            "        return 0",
            "    g ← gcd(a, b)",
            "    return (abs(a) / g) * abs(b)",
          ],
          activeLines: [4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "g", value: "6" },
            { name: "48 / g", value: "8", changed: true },
            { name: "lcm(48, 18)", value: "144", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Safe LCM pipeline: divide by g before multiplying",
                cells: [
                  { id: "l0", value: "48 / 6", index: 0, state: "done" },
                  { id: "l1", value: "8 * 18", index: 1, state: "active" },
                  { id: "l2", value: "144", index: 2, state: "done" },
                ],
                pointers: [
                  { index: 0, label: "shrink first", tone: "ok" },
                  { index: 2, label: "lcm = 144", tone: "ok" },
                ],
              },
            ],
            caption: "Never compute a * b = 864 first when (a / gcd) * b keeps intermediate values smaller.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Dividing by zero in `lcm(0, 0)`",
        detail:
          "`gcd(0, 0)` returns `0`. If `lcm(a, b)` blindly runs `(a / g) * b` without checking `if a == 0 or b == 0: return 0`, it crashes with division by zero.",
      },
      {
        title: "Negative inputs in GCD",
        detail:
          "Take `abs(a)` and `abs(b)` on entry to `gcd(a, b)`. Otherwise negative remainders can flip the sign of the returned divisor depending on the language.",
      },
      {
        title: "Consecutive Fibonacci numbers are the worst case",
        detail:
          "Pairs like `(21, 13)` take the most steps for their size because every quotient is `1`, yet Euclid still finishes in at most `~1.44 * log2(b)` steps (`O(log(min(a, b)))`).",
      },
    ],
    practiceTask: {
      title: "Reduce a Fraction to Lowest Terms",
      tier: "Warmup",
      goal: "Given integers `num` and `den` (`den != 0`), return `[reduced_num, reduced_den]` in lowest terms with `reduced_den > 0`.",
      constraints: ["-10^9 <= num, den <= 10^9", "den != 0", "Target time: O(log(min(|num|, |den|)))", "Extra space: O(1)"],
      examples: [
        { input: "num = 48, den = -18", output: "[-8, 3]", explanation: "Move sign to numerator and divide both by gcd(48, 18) = 6." },
        { input: "num = 0, den = -5", output: "[0, 1]", explanation: "gcd(0, 5) = 5, so 0/5 = 0 and -5/-5 = 1." },
      ],
      tasks: [
        "If `den < 0`, negate both `num` and `den` so `den` stays positive.",
        "Compute `g = gcd(abs(num), den)` iteratively and return `[num // g, den // g]`.",
      ],
      starterCode: "function reduce_fraction(num, den):\n    // TODO: normalize denominator sign and divide by gcd",
      expectedOutput: "[-8, 3]\n[0, 1]",
      hint: "Normalize `den > 0` first so `0 / -5` becomes `[0, 1]` instead of `[0, -1]`.",
      complexity: { time: "O(log(min(|num|, |den|)))", space: "O(1)" },
      solutionCode:
        "function gcd(a, b):\n    a ← abs(a)\n    b ← abs(b)\n    while b != 0:\n        rem ← a mod b\n        a ← b\n        b ← rem\n    return a\n\nfunction reduce_fraction(num, den):\n    if den < 0:\n        num ← -num\n        den ← -den\n    g ← gcd(num, den)\n    return [num // g, den // g]",
    },
    practiceChallenges: [
      {
        title: "Reduce a Fraction to Lowest Terms",
        tier: "Warmup",
        goal: "Return `[num, den]` simplified by `gcd(|num|, |den|)` with a positive denominator.",
        constraints: ["-10^9 <= num, den <= 10^9", "den != 0", "Extra space: O(1)"],
        examples: [
          { input: "num = 48, den = -18", output: "[-8, 3]" },
          { input: "num = 0, den = -5", output: "[0, 1]" },
        ],
        tasks: [
          "Flip both signs if `den < 0`.",
          "Divide both numerator and denominator by iterative `gcd`.",
        ],
        starterCode: "function reduce_fraction(num, den):\n    // TODO: simplify fraction with positive denominator",
        expectedOutput: "[-8, 3]\n[0, 1]",
        hint: "Use `gcd(0, 5) = 5` so zero reduces to `[0, 1]`.",
        complexity: { time: "O(log(min(|num|, |den|)))", space: "O(1)" },
        solutionCode:
          "function gcd(a, b):\n    a ← abs(a)\n    b ← abs(b)\n    while b != 0:\n        rem ← a mod b\n        a ← b\n        b ← rem\n    return a\n\nfunction reduce_fraction(num, den):\n    if den < 0:\n        num ← -num\n        den ← -den\n    g ← gcd(num, den)\n    return [num // g, den // g]",
      },
      {
        title: "GCD and LCM Across a List",
        tier: "Core",
        goal: "Given a list `nums` of `k` positive integers, compute `(overall_gcd, overall_lcm)` by folding one element at a time using iterative Euclid.",
        constraints: ["1 <= len(nums) <= 10^4", "1 <= nums[i] <= 10^6", "Assume overall_lcm fits in 64-bit signed ints"],
        examples: [
          { input: "nums = [12, 18, 30]", output: "(6, 180)", explanation: "gcd(12, 18, 30) = 6 and lcm(12, 18, 30) = 180." },
          { input: "nums = [7]", output: "(7, 7)" },
        ],
        tasks: [
          "Initialize `g = nums[0]` and `l = nums[0]`.",
          "For each remaining `x`, update `g = gcd(g, x)` and `l = (l / gcd(l, x)) * x`.",
        ],
        starterCode: "function list_gcd_lcm(nums):\n    // TODO: fold gcd and safe lcm across nums",
        expectedOutput: "(6, 180)\n(7, 7)",
        hint: "Warning: `lcm(a, b, c)` uses `gcd(l, x)` for the current running LCM `l`, not the overall `g`.",
        complexity: { time: "O(k log M)", space: "O(1)" },
        solutionCode:
          "function gcd(a, b):\n    while b != 0:\n        rem ← a mod b\n        a ← b\n        b ← rem\n    return a\n\nfunction list_gcd_lcm(nums):\n    g ← nums[0]\n    l ← nums[0]\n    for i from 1 to len(nums) - 1:\n        x ← nums[i]\n        g ← gcd(g, x)\n        l ← (l / gcd(l, x)) * x\n    return (g, l)",
      },
      {
        title: "Count Multiples of A or B Up to N",
        tier: "Stretch",
        goal: "Given positive integers `n`, `a`, and `b`, count how many integers in `1..n` are divisible by `a` or `b` in `O(log(min(a, b)))` time.",
        constraints: ["1 <= n, a, b <= 10^15", "O(n) loop will time out", "Guard lcm(a, b) > n against 64-bit overflow"],
        examples: [
          { input: "n = 20, a = 4, b = 6", output: "7", explanation: "4, 6, 8, 12, 16, 18, 20: 5 + 3 - 1 = 7." },
          { input: "n = 1000000000000, a = 999999937, b = 999999929", output: "2000", explanation: "lcm > n, so zero overlap." },
        ],
        tasks: [
          "Count multiples of `a` via `floor(n / a)` and multiples of `b` via `floor(n / b)`.",
          "Before computing `(a / g) * b`, check if `a / g > floor(n / b)`. If so, `lcm(a, b) > n` and overlap is `0`.",
        ],
        starterCode: "function count_multiples_a_or_b(n, a, b):\n    // TODO: inclusion-exclusion with overflow-guarded lcm bound",
        expectedOutput: "7\n2000",
        hint: "Since `a, b <= 10^15`, `lcm(a, b)` could reach `10^30` and overflow 64-bit ints! Test `a_div > floor(n / b)` first.",
        complexity: { time: "O(log(min(a, b)))", space: "O(1)" },
        solutionCode:
          "function gcd(a, b):\n    while b != 0:\n        rem ← a mod b\n        a ← b\n        b ← rem\n    return a\n\nfunction count_multiples_a_or_b(n, a, b):\n    total ← floor(n / a) + floor(n / b)\n    g ← gcd(a, b)\n    a_div ← a / g\n    if a_div <= floor(n / b):\n        both ← a_div * b\n        total ← total - floor(n / both)\n    return total",
      },
    ],
  },

  "dsa-modular-power": {
    lessonId: "dsa-modular-power",
    subtitle:
      "Keep sums and products inside 64-bit limits with modular arithmetic, wrap negative remainders, and compute a^n mod m in O(log n) loops.",
    intro: {
      heading: "Modular Arithmetic & Iterative Fast Power",
      explanation: [
        "Compute `3^1000000000` directly and it overflows 64-bit integers past `3^40`; multiply `3` one billion times in a loop and it hits Time Limit Exceeded; subtract `(2 - 5) mod 7` in C++, Java, or JavaScript and you get `-3` instead of `4`. Taking `mod m` (often `10^9 + 7`) after every step keeps numbers small, and wrapping negatives with `((x mod m) + m) mod m` keeps indices inside `[0, m - 1]`.",
        "For huge exponents, **iterative fast power** (binary exponentiation) squares `base` and halves `exp` in a `while exp > 0` loop, multiplying into `ans` whenever `exp mod 2 == 1` to finish `a^n mod m` in `O(log n)` steps with no recursion.",
      ],
      analogy:
        "On a 12-hour clock, spinning forward 1,000 hours lands on the same hour as moving `1000 mod 12 = 4` hours, and doubling your stride on each hop crosses a billion-step bridge in 30 hops.",
      realWorldUses: [
        "Keeping intermediate products inside 64-bit integers in combinatorics and rolling hash calculations (`10^9 + 7`)",
        "Computing huge modular powers `base^exp mod m` in cryptographic signatures and primality checks",
      ],
    },
    sections: [
      {
        heading: "Modular identities, negative wrap, and why 10^9 + 7",
        paragraphs: [
          "Modular addition and multiplication preserve remainders: `(a + b) mod m = ((a mod m) + (b mod m)) mod m` and `(a * b) mod m = ((a mod m) * (b mod m)) mod m`. Because subtraction can turn negative (`(2 - 5) mod 7 = -3` in C++/JS), normalize with `((x mod m) + m) mod m` so `-3` becomes `4`. `10^9 + 7` is prime, fits sums inside 32-bit (`2.01 * 10^9`), and keeps `base * base` under 64-bit max (`1.01 * 10^18 < 9.22 * 10^18`).",
          "Tracing `3^13 mod 100` (`13 = 8 + 4 + 1`): start `ans = 1, base = 3, exp = 13`. Step 1 (`exp=13` odd): `ans = 3, base = 9, exp = 6`. Step 2 (`exp=6` even): skip `ans`, `base = 81, exp = 3`. Step 3 (`exp=3` odd): `ans = (3 * 81) mod 100 = 43, base = 61, exp = 1`. Step 4 (`exp=1` odd): `ans = (43 * 61) mod 100 = 23, exp = 0` -> returns `23` in 4 steps.",
        ],
        code: [
          "// Negative wrap bug vs fix:",
          "(-3) % 7                          // Broken in C++/JS: -3",
          "(((-3) % 7) + 7) % 7              // Working: 4",
          "// Trace 3^13 mod 100 (4 steps vs 13):",
          "// exp=13 (odd)->ans=3, b=9 | exp=6->b=81 | exp=3 (odd)->ans=43, b=61 | exp=1 (odd)->ans=23",
        ],
        output: "wrap(-3, 7) -> 4 | mod_pow(3, 13, 100) -> 23",
        table: {
          caption: "Modular arithmetic rules and common edge cases",
          headers: ["Rule or Case", "Formula", "Safe Practice"],
          rows: [
            ["Addition", "`((a mod m) + (b mod m)) mod m`", "Apply `mod m` after every addition"],
            ["Subtraction / negative wrap", "`((x mod m) + m) mod m`", "Keeps remainder inside `0..m-1` in every language"],
            ["Multiplication", "`((a mod m) * (b mod m)) mod m`", "Use 64-bit integers before `mod m` when `m ~ 10^9`"],
            ["Division", "Does not distribute over `mod m`", "Never write `((a mod m) / (b mod m)) mod m`"],
            ["Modulus `m = 1`", "Every integer `mod 1 == 0`", "Initialize `ans = 1 mod m` so `a^0 mod 1 = 0`"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Do not distribute modulo over division: `(10 / 2) mod 7 = 5`, whereas `((10 mod 7) / (2 mod 7)) mod 7` is `3 / 2`. Also keep `base` and `ans` in 64-bit integer types when `m = 10^9 + 7`, because `base * base` reaches `10^18` before `mod m` runs.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From O(exp) Loop to O(log exp) Modular Fast Power",
      subtitle: "Replace linear multiplication with binary squaring and add edge guards for m=1 and negative base.",
      steps: [
        {
          label: "Step 1: Naive O(exp) loop (times out at exp = 10^9)",
          explanation: "Multiplying `ans = (ans * base) mod m` one exponent at a time overflows nothing with `mod m`, yet takes `10^9` iterations when `exp = 10^9`.",
          code: [
            "function mod_pow_slow(base, exp, m):",
            "    ans ← 1",
            "    for i from 1 to exp:",
            "        ans ← (ans * base) mod m",
            "    return ans",
          ],
          activeLines: [3, 4],
          output: "mod_pow_slow(3, 13, 100) = 23 (TLE at exp=10^9)",
        },
        {
          label: "Step 2: Square base and halve exp in O(log exp) iterations",
          explanation: "Multiplying `ans` by `base` whenever `exp mod 2 == 1` and squaring `base` drops `10^18` steps to ~60 iterations.",
          code: [
            "function mod_pow_fast(base, exp, m):",
            "    ans ← 1",
            "    base ← base mod m",
            "    while exp > 0:",
            "        if exp mod 2 == 1: ans ← (ans * base) mod m",
            "        base ← (base * base) mod m",
            "        exp ← floor(exp / 2)",
            "    return ans",
          ],
          activeLines: [5, 6, 7],
          output: "mod_pow_fast(3, 13, 100) = 23 (4 steps)",
        },
        {
          label: "Step 3: Guard m = 1 and normalize negative bases",
          explanation: "Initializing `ans = 1 mod m` returns `0` when `m = 1` and `exp = 0`, and `((base mod m) + m) mod m` handles negative bases.",
          code: [
            "function mod_pow(base, exp, m):",
            "    ans ← 1 mod m",
            "    base ← ((base mod m) + m) mod m",
            "    while exp > 0:",
            "        if exp mod 2 == 1: ans ← (ans * base) mod m",
            "        base ← (base * base) mod m",
            "        exp ← floor(exp / 2)",
            "    return ans",
          ],
          activeLines: [2, 3],
          output: "mod_pow(7, 0, 1) = 0 | mod_pow(-2, 3, 5) = 2",
        },
      ],
    },
    walkthrough: {
      title: "Computing 3^13 mod 100 in O(log n) using loops only",
      layout: "visual-first",
      steps: [
        {
          title: "Set ans = 1 mod m, base = 3 mod 100, and exp = 13",
          tag: "CONCEPT",
          explanation: [
            "Writing `13 = 8 + 4 + 1` splits `3^13` into `3^8 * 3^4 * 3^1`. Instead of multiplying `3` thirteen times, we generate squared powers `3^1, 3^2, 3^4, 3^8` and include only the ones where `exp` is odd (`exp mod 2 == 1`).",
            "Initializing `ans = 1 mod m` handles `m = 1` automatically.",
          ],
          code: [
            "function mod_pow(base, exp, m):",
            "    ans ← 1 mod m",
            "    base ← ((base mod m) + m) mod m",
            "    while exp > 0:",
            "        if exp mod 2 == 1:",
            "            ans ← (ans * base) mod m",
            "        base ← (base * base) mod m",
            "        exp ← floor(exp / 2)",
            "    return ans",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "ans", value: "1" },
            { name: "base", value: "3" },
            { name: "exp", value: "13" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Squaring ladder for base^1, base^2, base^4, base^8 (mod 100)",
                cells: [
                  { id: "p1", value: "3^1=3", index: 0, state: "active" },
                  { id: "p2", value: "3^2=?", index: 1, state: "dim" },
                  { id: "p4", value: "3^4=?", index: 2, state: "dim" },
                  { id: "p8", value: "3^8=?", index: 3, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "exp = 13 (odd)", tone: "coral" },
                ],
              },
            ],
            caption: "Each loop iteration computes the next squared power and halves exp.",
          },
        },
        {
          title: "Iteration 1 (exp = 13, odd): include 3^1, square to 9, halve to 6",
          tag: "TRACE",
          explanation: [
            "`13 mod 2 == 1`, so multiply `ans = (1 * 3) mod 100 = 3`.",
            "Then square `base = (3 * 3) mod 100 = 9` and halve `exp = floor(13 / 2) = 6`.",
          ],
          code: [
            "    while exp > 0:",
            "        if exp mod 2 == 1:            // 13 is odd",
            "            ans ← (ans * base) mod m  // 3",
            "        base ← (base * base) mod m    // 9",
            "        exp ← floor(exp / 2)          // 6",
          ],
          activeLines: [2, 3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "ans", value: "3", changed: true },
            { name: "base (3^2)", value: "9", changed: true },
            { name: "exp", value: "6", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Included 3^1 = 3 into ans; next base = 3^2 = 9",
                cells: [
                  { id: "p1", value: "3^1=3", index: 0, state: "done" },
                  { id: "p2", value: "3^2=9", index: 1, state: "active" },
                  { id: "p4", value: "3^4=?", index: 2, state: "dim" },
                  { id: "p8", value: "3^8=?", index: 3, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "used in ans", tone: "ok" },
                  { index: 1, label: "exp = 6 (even)", tone: "accent" },
                ],
              },
            ],
            caption: "Odd exponent includes current base in ans before squaring.",
          },
        },
        {
          title: "Iteration 2 (exp = 6, even): skip ans, square to 81, halve to 3",
          tag: "TRACE",
          explanation: [
            "`6 mod 2 == 0`, so `ans` stays `3` (we do not multiply `3^2` into `ans`).",
            "Square `base = (9 * 9) mod 100 = 81` and halve `exp = floor(6 / 2) = 3`.",
          ],
          code: [
            "    while exp > 0:",
            "        if exp mod 2 == 1:            // 6 is even -> skip",
            "            ans ← (ans * base) mod m",
            "        base ← (base * base) mod m    // 81",
            "        exp ← floor(exp / 2)          // 3",
          ],
          activeLines: [2, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "ans", value: "3" },
            { name: "base (3^4)", value: "81", changed: true },
            { name: "exp", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Skipped 3^2; next base = 3^4 = 81 mod 100",
                cells: [
                  { id: "p1", value: "3^1=3", index: 0, state: "done" },
                  { id: "p2", value: "3^2=9", index: 1, state: "dim" },
                  { id: "p4", value: "3^4=81", index: 2, state: "active" },
                  { id: "p8", value: "3^8=?", index: 3, state: "dim" },
                ],
                pointers: [
                  { index: 2, label: "exp = 3 (odd)", tone: "coral" },
                ],
              },
            ],
            caption: "Even exponent still squares base and halves exp so powers stay aligned.",
          },
        },
        {
          title: "Iteration 3 (exp = 3, odd): multiply 3 * 81 mod 100 = 43, halve to 1",
          tag: "TRACE",
          explanation: [
            "`3 mod 2 == 1`, so `ans = (3 * 81) mod 100 = 243 mod 100 = 43`.",
            "Square `base = (81 * 81) mod 100 = 6561 mod 100 = 61` and halve `exp = floor(3 / 2) = 1`.",
          ],
          code: [
            "    while exp > 0:",
            "        if exp mod 2 == 1:            // 3 is odd",
            "            ans ← (ans * base) mod m  // 243 mod 100 = 43",
            "        base ← (base * base) mod m    // 6561 mod 100 = 61",
            "        exp ← floor(exp / 2)          // 1",
          ],
          activeLines: [2, 3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "ans", value: "43", changed: true },
            { name: "base (3^8)", value: "61", changed: true },
            { name: "exp", value: "1", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Included 3^4 = 81 -> ans = 43; next base = 3^8 = 61 mod 100",
                cells: [
                  { id: "p1", value: "3^1=3", index: 0, state: "done" },
                  { id: "p2", value: "3^2=9", index: 1, state: "dim" },
                  { id: "p4", value: "3^4=81", index: 2, state: "done" },
                  { id: "p8", value: "3^8=61", index: 3, state: "active" },
                ],
                pointers: [
                  { index: 2, label: "used in ans", tone: "ok" },
                  { index: 3, label: "exp = 1 (odd)", tone: "coral" },
                ],
              },
            ],
            caption: "Taking mod 100 at every multiply keeps intermediate values under 10,000.",
          },
        },
        {
          title: "Iteration 4 (exp = 1, odd): multiply 43 * 61 mod 100 = 23 and exit",
          tag: "PATTERN",
          explanation: [
            "`1 mod 2 == 1`, so `ans = (43 * 61) mod 100 = 2623 mod 100 = 23`.",
            "Halving `exp = floor(1 / 2) = 0` ends the loop in 4 steps (`3^13 = 1,594,323`, ending in `23`). Even `exp = 10^18` takes only ~60 iterations.",
          ],
          code: [
            "    while exp > 0:",
            "        if exp mod 2 == 1:            // 1 is odd",
            "            ans ← (ans * base) mod m  // 2623 mod 100 = 23",
            "        base ← (base * base) mod m    // 21",
            "        exp ← floor(exp / 2)          // 0 -> loop exits",
            "    return ans                        // 23",
          ],
          activeLines: [2, 3, 4, 5, 6],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "    while exp > 0:",
              "        if exp % 2 == 1:",
              "            ans = (ans * base) % m",
              "        base = (base * base) % m",
              "        exp //= 2",
              "    return ans",
            ],
            activeLines: [2, 3, 4, 5, 6],
          },
          state: [
            { name: "ans", value: "23", changed: true },
            { name: "exp", value: "0", changed: true },
            { name: "Steps taken", value: "4 (vs 13)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "3^13 mod 100 = (3^1 * 3^4 * 3^8) mod 100 = 23",
                cells: [
                  { id: "p1", value: "3^1=3", index: 0, state: "done" },
                  { id: "p2", value: "3^2=9", index: 1, state: "dim" },
                  { id: "p4", value: "3^4=81", index: 2, state: "done" },
                  { id: "p8", value: "3^8=61", index: 3, state: "done" },
                ],
                pointers: [
                  { index: 0, label: "included", tone: "ok" },
                  { index: 2, label: "included", tone: "ok" },
                  { index: 3, label: "included -> 23", tone: "ok" },
                ],
              },
            ],
            caption: "Iterative fast power computes a^n mod m in O(log n) time and O(1) space.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Negative remainders on subtraction or negative base",
        detail:
          "Computing `(a - b) mod m` directly can yield `-5` instead of `m - 5`. Always wrap with `((x mod m) + m) mod m` on negative bases and differences.",
        code: "diff ← ((a - b) mod m + m) mod m",
      },
      {
        title: "Forgetting `m == 1` when `exp == 0`",
        detail:
          "Initializing `ans = 1` returns `1` for `mod_pow(5, 0, 1)`, which is wrong because `1 mod 1 == 0`. Always start with `ans = 1 mod m`.",
      },
      {
        title: "Squaring `base * base` inside 32-bit integers",
        detail:
          "With `m = 10^9 + 7`, `base` can be `10^9 + 6`, so `base * base` reaches `10^18` before `% m` runs. Store `base` and `ans` in 64-bit integer types.",
      },
    ],
    practiceTask: {
      title: "Normalized Cyclic Step Index",
      tier: "Warmup",
      goal: "Given a circular dial of `size` positions (`0..size-1`), current position `pos`, and signed step offset `delta` (which may be huge or negative), return the landing index in `[0, size - 1]` in `O(1)` time.",
      constraints: ["1 <= size <= 10^9", "0 <= pos < size", "-10^15 <= delta <= 10^15", "Extra space: O(1)"],
      examples: [
        { input: "pos = 2, delta = -5, size = 7", output: "4", explanation: "(2 - 5) = -3 -> ((-3 mod 7) + 7) mod 7 = 4." },
        { input: "pos = 1, delta = -1000000000, size = 6", output: "3", explanation: "Direct modulo wrap handles billion-step offsets in O(1)." },
      ],
      tasks: [
        "Reduce `delta` first via `step = ((delta mod size) + size) mod size` so `pos + step` never overflows unnecessarily.",
        "Return `(pos + step) mod size`.",
      ],
      starterCode: "function wrap_index(pos, delta, size):\n    // TODO: return landing index in [0, size - 1] in O(1)",
      expectedOutput: "4\n3",
      hint: "Normalize `delta mod size` before adding to `pos` so even `10^15` offsets finish in one arithmetic expression.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "function wrap_index(pos, delta, size):\n    step ← ((delta mod size) + size) mod size\n    return (pos + step) mod size",
    },
    practiceChallenges: [
      {
        title: "Normalized Cyclic Step Index",
        tier: "Warmup",
        goal: "Compute the ending slot in `[0, size - 1]` after moving `delta` steps (positive or negative) from `pos` on a ring of length `size`.",
        constraints: ["1 <= size <= 10^9", "0 <= pos < size", "-10^15 <= delta <= 10^15"],
        examples: [
          { input: "pos = 2, delta = -5, size = 7", output: "4" },
          { input: "pos = 1, delta = -1000000000, size = 6", output: "3" },
        ],
        tasks: [
          "Normalize `delta` into `[0, size - 1]` using `((delta mod size) + size) mod size`.",
          "Add `pos` and apply `mod size` once more.",
        ],
        starterCode: "function wrap_index(pos, delta, size):\n    // TODO: O(1) positive/negative cyclic wrap",
        expectedOutput: "4\n3",
        hint: "Adding `size` after `delta mod size` guarantees a non-negative intermediate value in every language.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "function wrap_index(pos, delta, size):\n    step ← ((delta mod size) + size) mod size\n    return (pos + step) mod size",
      },
      {
        title: "Iterative Fast Power Modulo M",
        tier: "Core",
        goal: "Compute `(base^exp) mod m` in `O(log exp)` time and `O(1)` space using loops only (no recursion and no bit operators).",
        constraints: ["-10^9 <= base <= 10^9", "0 <= exp <= 10^18", "1 <= m <= 10^9 + 7", "Use 64-bit arithmetic"],
        examples: [
          { input: "base = 3, exp = 13, m = 100", output: "23" },
          { input: "base = -2, exp = 3, m = 5", output: "2", explanation: "(-2)^3 = -8 -> ((-8 mod 5) + 5) mod 5 = 2." },
          { input: "base = 7, exp = 0, m = 1", output: "0" },
        ],
        tasks: [
          "Initialize `ans = 1 mod m` and `cur = ((base mod m) + m) mod m`.",
          "Loop `while exp > 0`: if `exp mod 2 == 1`, set `ans = (ans * cur) mod m`; then set `cur = (cur * cur) mod m` and `exp = floor(exp / 2)`.",
        ],
        starterCode: "function mod_pow(base, exp, m):\n    // TODO: iterative O(log exp) power using loops only",
        expectedOutput: "23\n2\n0",
        hint: "Normalize negative `base` into `[0, m - 1]` at the start and use `ans = 1 mod m` so `m = 1` returns `0`.",
        complexity: { time: "O(log exp)", space: "O(1)" },
        solutionCode:
          "function mod_pow(base, exp, m):\n    ans ← 1 mod m\n    cur ← ((base mod m) + m) mod m\n    while exp > 0:\n        if exp mod 2 == 1:\n            ans ← (ans * cur) mod m\n        cur ← (cur * cur) mod m\n        exp ← floor(exp / 2)\n    return ans",
      },
      {
        title: "Difference of Large Powers Modulo 10^9 + 7",
        tier: "Stretch",
        goal: "Given non-negative integers `a, b, c, d`, compute `(a^b - c^d) mod 1000000007` as a value in `[0, 1000000006]`.",
        constraints: ["0 <= a, c <= 10^9", "0 <= b, d <= 10^15", "Target time: O(log b + log d)", "Extra space: O(1)"],
        examples: [
          { input: "a = 2, b = 10, c = 3, d = 7", output: "999998844", explanation: "1024 - 2187 = -1163 -> 1000000007 - 1163 = 999998844." },
          { input: "a = 5, b = 100, c = 5, d = 100", output: "0" },
        ],
        tasks: [
          "Compute `p1 = mod_pow(a, b, 1000000007)` and `p2 = mod_pow(c, d, 1000000007)`.",
          "Return `((p1 - p2) mod 1000000007 + 1000000007) mod 1000000007` so negative differences wrap.",
        ],
        starterCode: "function power_diff_mod(a, b, c, d):\n    // TODO: compute (a^b - c^d) mod 1000000007 without negative remainders",
        expectedOutput: "999998844\n0",
        hint: "Even when `a^b < c^d`, adding `MOD` after `(p1 - p2) mod MOD` produces the positive remainder.",
        complexity: { time: "O(log b + log d)", space: "O(1)" },
        solutionCode:
          "function mod_pow(base, exp, m):\n    ans ← 1 mod m\n    cur ← ((base mod m) + m) mod m\n    while exp > 0:\n        if exp mod 2 == 1:\n            ans ← (ans * cur) mod m\n        cur ← (cur * cur) mod m\n        exp ← floor(exp / 2)\n    return ans\n\nfunction power_diff_mod(a, b, c, d):\n    MOD ← 1000000007\n    p1 ← mod_pow(a, b, MOD)\n    p2 ← mod_pow(c, d, MOD)\n    return ((p1 - p2) mod MOD + MOD) mod MOD",
      },
    ],
  },
};

export const dsaM01PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m1",
  title: "Module 01 Practice Set: Math & Number Theory",
  description:
    "Four mixed problems drawn from Module 01 topics: digit math, prime counting, common cycles, and modular exponentiation.",
  problems: [
    {
      id: "dsa-m1-p1",
      title: "Symmetric Ticket Number",
      patternHint: "Compare digits from both ends by reversing only the right half of the integer (Lesson 01-1).",
      lessonRefId: "dsa-digit-math",
      goal: "Given a 32-bit signed integer `ticket`, return `true` if its decimal representation reads identically left-to-right and right-to-left without converting to text or overflowing 32-bit integers.",
      constraints: ["-2^31 <= ticket <= 2^31 - 1", "No string or array allocation", "Target: O(log10 |ticket|) time, O(1) space"],
      examples: [
        { input: "ticket = 40804", output: "true" },
        { input: "ticket = 10", output: "false" },
        { input: "ticket = -121", output: "false" },
      ],
      tasks: [
        "Reject negative numbers and positive multiples of `10` immediately.",
        "Peel digits from `ticket` onto `rev` only while `ticket > rev`, then check `ticket == rev or ticket == floor(rev / 10)`.",
      ],
      starterCode: "function is_symmetric_ticket(ticket):\n    // TODO: return true if ticket is a numeric palindrome in O(1) space",
      expectedOutput: "true\nfalse\nfalse",
      hint: "Stopping as soon as `rev >= ticket` splits the number in half and guarantees `rev` stays well below `INT_MAX`.",
      complexity: { time: "O(log n)", space: "O(1)" },
      solutionCode:
        "function is_symmetric_ticket(ticket):\n    if ticket < 0 or (ticket != 0 and ticket mod 10 == 0):\n        return false\n    rev ← 0\n    while ticket > rev:\n        rev ← rev * 10 + (ticket mod 10)\n        ticket ← floor(ticket / 10)\n    return ticket == rev or ticket == floor(rev / 10)",
    },
    {
      id: "dsa-m1-p2",
      title: "Three-Divisor Lucky Numbers",
      patternHint: "Only squares of primes p^2 have exactly three positive divisors {1, p, p^2}; count primes up to floor(sqrt(limit)) with a sieve (Lesson 01-2).",
      lessonRefId: "dsa-primes-sieve",
      goal: "Given positive integer `limit`, count how many integers `x` in `[1..limit]` have exactly `3` distinct positive divisors.",
      constraints: ["1 <= limit <= 10^12", "Scanning 1..limit will time out", "Target: O(sqrt(limit) log log sqrt(limit)) time"],
      examples: [
        { input: "limit = 30", output: "3", explanation: "4 (1,2,4), 9 (1,3,9), and 25 (1,5,25) have exactly 3 divisors." },
        { input: "limit = 3", output: "0" },
      ],
      tasks: [
        "Compute the integer square root `root = floor(sqrt(limit))` (or step `root` up with 64-bit arithmetic).",
        "Run the Sieve of Eratosthenes on `is_prime[0..root]` and count how many primes `p <= root` exist.",
      ],
      starterCode: "function count_three_divisor_numbers(limit):\n    // TODO: count numbers <= limit with exact divisor count 3",
      expectedOutput: "3\n0",
      hint: "A number has an odd number of divisors only when it is a square `k^2`, and exactly 3 divisors `{1, p, p^2}` when `k = p` is prime. Note: near `10^12+`, 64-bit float `sqrt(n)` can round off by 1, so `int_sqrt` adjusts `r` with integer squaring (in Python 3.8+, `math.isqrt(n)` is already exact).",
      complexity: { time: "O(sqrt(limit) log log sqrt(limit))", space: "O(sqrt(limit))" },
      solutionCode:
        "function int_sqrt(n):\n    r ← floor(sqrt(n))\n    while (r + 1) * (r + 1) <= n:\n        r ← r + 1\n    while r * r > n:\n        r ← r - 1\n    return r\n\nfunction count_three_divisor_numbers(limit):\n    if limit < 4:\n        return 0\n    root ← int_sqrt(limit)\n    is_prime ← boolean row of size root + 1 filled with true\n    is_prime[0] ← false\n    is_prime[1] ← false\n    p ← 2\n    while p * p <= root:\n        if is_prime[p]:\n            m ← p * p\n            while m <= root:\n                is_prime[m] ← false\n                m ← m + p\n        p ← p + 1\n    count ← 0\n    for i from 2 to root:\n        if is_prime[i]:\n            count ← count + 1\n    return count",
    },
    {
      id: "dsa-m1-p3",
      title: "Shared Beacon Flash Seconds",
      patternHint: "Apply inclusion-exclusion with floor(T / a) + floor(T / b) - floor(T / lcm(a, b)) using overflow-safe Euclidean GCD (Lesson 01-3).",
      lessonRefId: "dsa-gcd-lcm",
      goal: "Beacon A flashes every `a` seconds and Beacon B flashes every `b` seconds starting after `t = 0`. Given positive window `T`, return how many integer seconds `t` in `[1..T]` see at least one beacon flash.",
      constraints: ["1 <= T, a, b <= 10^15", "Target time: O(log(min(a, b)))", "Extra space: O(1)", "Do not overflow 64-bit ints when computing lcm(a, b)"],
      examples: [
        { input: "T = 30, a = 6, b = 10", output: "7", explanation: "Multiples of 6 (5) + multiples of 10 (3) - multiples of 30 (1) = 7." },
        { input: "T = 10, a = 3, b = 3", output: "3" },
      ],
      tasks: [
        "Compute `g = gcd(a, b)` via iterative modulo reduction and `a_div = a / g`.",
        "If `a_div <= floor(T / b)`, subtract `floor(T / (a_div * b))` from `floor(T / a) + floor(T / b)`; otherwise `lcm(a, b) > T` so overlap is `0`.",
      ],
      starterCode: "function count_beacon_seconds(T, a, b):\n    // TODO: count seconds in [1..T] divisible by a or b",
      expectedOutput: "7\n3",
      hint: "Checking `a_div <= floor(T / b)` before multiplying `a_div * b` prevents 64-bit overflow when `a` and `b` are large.",
      complexity: { time: "O(log(min(a, b)))", space: "O(1)" },
      solutionCode:
        "function gcd(a, b):\n    while b != 0:\n        rem ← a mod b\n        a ← b\n        b ← rem\n    return a\n\nfunction count_beacon_seconds(T, a, b):\n    ans ← floor(T / a) + floor(T / b)\n    g ← gcd(a, b)\n    a_div ← a / g\n    if a_div <= floor(T / b):\n        both ← a_div * b\n        ans ← ans - floor(T / both)\n    return ans",
    },
    {
      id: "dsa-m1-p4",
      title: "Valid Security Badge Codes",
      patternHint: "Multiply 5^(even slots) * 4^(odd slots) using iterative binary exponentiation mod 10^9 + 7 (Lesson 01-4).",
      lessonRefId: "dsa-modular-power",
      goal: "A badge code has `n` positions indexed `0..n-1`. Even positions (`0, 2, 4, ...`) allow any of `5` even digits (`0, 2, 4, 6, 8`), and odd positions (`1, 3, 5, ...`) allow any of `4` prime digits (`2, 3, 5, 7`). Return the total number of valid `n`-digit codes modulo `1000000007`.",
      constraints: ["1 <= n <= 10^15", "Target time: O(log n)", "Extra space: O(1)", "Loops only (no recursion or bit shifts)"],
      examples: [
        { input: "n = 1", output: "5", explanation: "Index 0 is even, giving 5 choices." },
        { input: "n = 4", output: "400", explanation: "2 even slots (5^2 = 25) * 2 odd slots (4^2 = 16) = 400." },
        { input: "n = 10", output: "3200000", explanation: "5^5 * 4^5 = 20^5 = 3,200,000." },
      ],
      tasks: [
        "Compute `even_slots = floor((n + 1) / 2)` and `odd_slots = floor(n / 2)`.",
        "Use iterative `mod_pow(5, even_slots, 1000000007)` and `mod_pow(4, odd_slots, 1000000007)`, then multiply their results modulo `1000000007`.",
      ],
      starterCode: "function count_badge_codes(n):\n    // TODO: compute 5^even_slots * 4^odd_slots mod 1000000007",
      expectedOutput: "5\n400\n3200000",
      hint: "For `n = 5`, indices `0, 2, 4` are even (`3 = floor(6/2)`) and indices `1, 3` are odd (`2 = floor(5/2)`).",
      complexity: { time: "O(log n)", space: "O(1)" },
      solutionCode:
        "function mod_pow(base, exp, m):\n    ans ← 1 mod m\n    cur ← base mod m\n    while exp > 0:\n        if exp mod 2 == 1:\n            ans ← (ans * cur) mod m\n        cur ← (cur * cur) mod m\n        exp ← floor(exp / 2)\n    return ans\n\nfunction count_badge_codes(n):\n    MOD ← 1000000007\n    even_slots ← floor((n + 1) / 2)\n    odd_slots ← floor(n / 2)\n    return (mod_pow(5, even_slots, MOD) * mod_pow(4, odd_slots, MOD)) mod MOD",
    },
  ],
};
