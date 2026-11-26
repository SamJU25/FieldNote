import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM10Lessons: Record<string, LessonContent> = {
  "dsa-recursion-base-case": {
    lessonId: "dsa-recursion-base-case",
    subtitle:
      "Build every recursive function from two mandatory pieces, trace digit sum and array palindrome checks, and see why missing either piece triggers Stack Overflow.",
    intro: {
      heading: "Recursion Fundamentals & Base Cases",
      explanation: [
        "When nested boxes hold smaller boxes inside, or a tree branches in two directions, a plain `for` loop cannot easily remember every unfinished level waiting behind it. **Recursion** handles that by solving one piece and calling the same function on a strictly smaller input until reaching a tiny **base case**.",
        "Every recursive function needs two rules: (1) a **base case** that returns right away without calling itself, and (2) a **recursive step** that shrinks the input toward that base case. Missing either piece repeats calls until memory runs out (`Stack Overflow`).",
      ],
      analogy:
        "Opening nested shipping envelopes: you open each inner envelope until you hit the smallest envelope containing the final slip (base case), then hand the total back outward one desk at a time.",
      realWorldUses: [
        "Walking nested file directories or JSON trees where every subfolder has the same shape as its parent",
        "Traversing left and right branches of trees and graphs",
      ],
    },
    sections: [
      {
        heading: "Descend & Unwind: Tracing Calls Down and Answers Back Up",
        paragraphs: [
          "Consider `sum_digits(472)`. First, peel the last digit via `n mod 10` (`2`) and shrink the rest via `floor(n / 10)` (`47`). Calling `sum_digits(47)` pauses `sum_digits(472)` on the call stack until the smaller call returns.",
          "Think of recursion in two clear phases: **Phase 1 (Going Down)** pauses each call while waiting for a smaller subproblem until `n < 10` returns directly; **Phase 2 (Coming Back Up)** resumes each paused caller in reverse order (`4` -> `7 + 4 = 11` -> `2 + 11 = 13`).",
        ],
        code: [
          "function sum_digits(n):",
          "    if n < 10: return n                 // base case: single digit",
          "    last ← n mod 10                     // peel rightmost digit",
          "    return last + sum_digits(floor(n / 10))",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Two-phase trace of sum_digits(472): Going Down vs Coming Back Up",
          headers: ["Phase & Step", "Call", "Base check (`n < 10`)", "Waiting Expression / Return"],
          rows: [
            ["Going Down 1", "`sum_digits(472)`", "False", "`2 + sum_digits(47)` (pauses)"],
            ["Going Down 2", "`sum_digits(47)`", "False", "`7 + sum_digits(4)` (pauses)"],
            ["Going Down 3", "`sum_digits(4)`", "True (base case)", "Returns `4` directly"],
            ["Coming Up 1", "`sum_digits(47)`", "Resumes with `4`", "Computes `7 + 4` -> returns `11`"],
            ["Coming Up 2", "`sum_digits(472)`", "Resumes with `11`", "Computes `2 + 11` -> returns `13`"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Write the base case first, and double-check that every recursive call strictly shrinks the problem toward it.",
        },
      },
      {
        heading: "Two-Index Bounds & When to Use a Loop Instead",
        paragraphs: [
          "When shrinking bounds on an array `arr` (such as palindrome checking), pass `(l, r)` indices (`l + 1`, `r - 1`) instead of slicing subarray copies. Always check `if l >= r:` (not `l == r`), because an even-length array like `[4, 4]` steps `(0, 1) -> (1, 0)` right past equality.",
          "Also notice when *not* to recurse: for a single straight chain like `sum_digits` or linear array sum, a `while` or `for` loop uses `O(1)` memory instead of `O(depth)` call stack frames. Use recursion when a problem branches into multiple subproblems (trees, permutations, nested structures).",
        ],
        table: {
          caption: "Loop vs Recursion quick guide",
          headers: ["Problem Shape", "Best Choice", "Why"],
          rows: [
            ["Straight countdown (`1..n`, `sum_digits`)", "Loop", "`O(1)` extra space; no stack limit"],
            ["Single inward or halved step (`binary_search`)", "Loop", "Simple state (`lo, hi`) fits in 2 variables"],
            ["Two+ branches per step (Trees, Backtracking)", "Recursion", "Call stack tracks multiple pending branches automatically"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Checking `if l == r` alone fails on even-length arrays like `[4, 4]`: indices `(0, 1)` step to `(1, 0)`, skipping `l == r` completely and crashing out of bounds!",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build a Bug-Free Recursive Palindrome Checker",
      steps: [
        {
          label: "Step 1: Broken `l == r` base case",
          explanation: "`l == r` works on odd-length arrays like `[1, 2, 1]`, yet skips past `l > r` on `[4, 4]` and goes out of bounds.",
          code: [
            "function is_pal_buggy(arr, l, r):",
            "    if l == r: return true      // BUG on even-length [4, 4]: (0,1)->(1,0)",
            "    if arr[l] != arr[r]: return false",
            "    return is_pal_buggy(arr, l + 1, r - 1)",
          ],
          activeLines: [2],
          output: "[4, 4] steps to l=1, r=0 and crashes on arr[-1]",
        },
        {
          label: "Step 2: Fix base guard to `l >= r`",
          explanation: "Using `>=` stops both odd crossings `(2, 2)` and even crossings `(1, 0)` without reading out of bounds.",
          code: [
            "function is_pal(arr, l, r):",
            "    if l >= r: return true      // stops for both odd & even lengths",
            "    if arr[l] != arr[r]: return false",
            "    return is_pal(arr, l + 1, r - 1)",
          ],
          activeLines: [2],
          output: "is_pal([4, 4], 0, 1) -> true",
        },
        {
          label: "Step 3: Trace early mismatch exit",
          explanation: "Checking `arr[l] != arr[r]` returns `false` right away without shrinking further.",
          code: [
            "function is_pal(arr, l, r):",
            "    if l >= r: return true",
            "    if arr[l] != arr[r]: return false   // early exit on [4, 9, 2, 4] at (1, 2)",
            "    return is_pal(arr, l + 1, r - 1)",
          ],
          activeLines: [3],
          output: "is_pal([4, 9, 2, 4], 0, 3) -> false",
        },
      ],
    },
    walkthrough: {
      title: "Trace sum_digits(472) and palindrome bounds",
      layout: "visual-first",
      steps: [
        {
          title: "Peel the last digit and recurse on floor(n / 10)",
          tag: "CONCEPT",
          explanation: [
            "`sum_digits(472)` checks the base case `472 < 10` (false), keeps `472 mod 10 = 2`, and pauses to wait for `sum_digits(47)`.",
            "Because `47 < 472`, each step shrinks the input toward `n < 10`.",
          ],
          code: [
            "function sum_digits(n):",
            "    if n < 10:",
            "        return n",
            "    last ← n mod 10",
            "    return last + sum_digits(floor(n / 10))",
          ],
          activeLines: [4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Active call", value: "sum_digits(472)", changed: true },
            { name: "Saved digit", value: "2" },
            { name: "Next input", value: "47" },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack: Waiting for sum_digits(47)",
            items: [
              { id: "f472", label: "sum_digits(472)", sub: "waiting: 2 + ?", state: "active" },
            ],
            caption: "sum_digits(472) pauses on the stack while calling sum_digits(47).",
          },
        },
        {
          title: "Shrink again from 47 down to 4",
          tag: "TRACE",
          explanation: [
            "`sum_digits(47)` sees `47 < 10` is false, saves `last = 7`, and calls `sum_digits(4)`.",
            "Both `sum_digits(472)` and `sum_digits(47)` sit paused on the call stack, waiting for inner answers.",
          ],
          code: [
            "function sum_digits(n):",
            "    if n < 10:",
            "        return n",
            "    last ← n mod 10",
            "    return last + sum_digits(floor(n / 10))",
          ],
          activeLines: [4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Active call", value: "sum_digits(47)", changed: true },
            { name: "Saved digit", value: "7", changed: true },
            { name: "Next input", value: "4", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack: Two Paused Calls",
            items: [
              { id: "f472", label: "sum_digits(472)", sub: "waiting: 2 + ?", state: "dim" },
              { id: "f47", label: "sum_digits(47)", sub: "waiting: 7 + ?", state: "active" },
            ],
            caption: "Each recursive step moves n strictly closer to the single-digit base case.",
          },
        },
        {
          title: "Base case n < 10 returns directly",
          tag: "CHECK",
          explanation: [
            "`sum_digits(4)` checks `4 < 10` (true) and returns `4` immediately without spawning another call.",
            "Because the chain hits a concrete base case, recursion stops growing and begins returning values back up.",
          ],
          code: [
            "function sum_digits(n):",
            "    if n < 10:",
            "        return n",
            "    last ← n mod 10",
            "    return last + sum_digits(floor(n / 10))",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Active call", value: "sum_digits(4)", changed: true },
            { name: "Base hit", value: "4 < 10 -> return 4", changed: true },
            { name: "Stack depth", value: "3 frames" },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack: Base Case Reached",
            items: [
              { id: "f472", label: "sum_digits(472)", sub: "waiting: 2 + ?", state: "dim" },
              { id: "f47", label: "sum_digits(47)", sub: "waiting: 7 + ?", state: "dim" },
              { id: "f4", label: "sum_digits(4)", sub: "base case -> returns 4", state: "done" },
            ],
            caption: "Without this base check, calls would keep pushing sum_digits(0) until Stack Overflow.",
          },
        },
        {
          title: "Unwind base result 4 into sum_digits(47)",
          tag: "TRACE",
          explanation: [
            "`sum_digits(4)` returns `4` and pops from the stack, resuming `sum_digits(47)` with its preserved `last = 7`.",
            "`sum_digits(47)` computes `7 + 4 = 11` and prepares to return `11` to `sum_digits(472)`.",
          ],
          code: [
            "function sum_digits(n):",
            "    if n < 10:",
            "        return n",
            "    last ← n mod 10",
            "    return last + sum_digits(floor(n / 10))",
          ],
          activeLines: [5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Returned from base", value: "4", changed: true },
            { name: "sum_digits(47)", value: "7 + 4 = 11", changed: true },
            { name: "Stack depth", value: "2 frames" },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack: Unwinding sum_digits(47)",
            items: [
              { id: "f472", label: "sum_digits(472)", sub: "waiting: 2 + ?", state: "dim" },
              { id: "f47", label: "sum_digits(47)", sub: "receives 4 -> returns 7 + 4 = 11", state: "done" },
            ],
            caption: "sum_digits(4) popped; sum_digits(47) combines its saved digit 7 with 4.",
          },
        },
        {
          title: "Unwind 11 into root sum_digits(472) -> returns 13",
          tag: "TRACE",
          explanation: [
            "`sum_digits(47)` pops and passes `11` back to `sum_digits(472)`.",
            "`sum_digits(472)` computes `2 + 11 = 13` and returns `13` to the original caller.",
          ],
          code: [
            "function sum_digits(n):",
            "    if n < 10:",
            "        return n",
            "    last ← n mod 10",
            "    return last + sum_digits(floor(n / 10))",
          ],
          activeLines: [5],
          codeLabel: "Pseudocode",
          state: [
            { name: "sum_digits(472)", value: "2 + 11 = 13", changed: true },
            { name: "Final result", value: "13", changed: true },
            { name: "Stack status", value: "1 root frame returning" },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack: Unwound to Root Answer",
            items: [
              { id: "f472", label: "sum_digits(472)", sub: "returns 2 + 11 = 13", state: "done" },
            ],
            caption: "Root caller resumes with its saved digit 2 and returns final sum 13.",
          },
        },
        {
          title: "Recursive array palindrome check narrows [l, r]",
          tag: "PATTERN",
          explanation: [
            "For `['r', 'a', 'd', 'a', 'r']`, pass indices `(l, r)` instead of copying subarrays. After Call 1 checks `'r' == 'r'` at `(0, 4)`, Call 2 checks `(1, 3)` where `'a' == 'a'` and recurses to `(2, 2)`.",
            "Because `(2, 2)` hits `l >= r`, the base case returns `true` back up the stack.",
          ],
          code: [
            "function is_pal(arr, l, r):",
            "    if l >= r:",
            "        return true",
            "    if arr[l] != arr[r]:",
            "        return false",
            "    return is_pal(arr, l + 1, r - 1)",
          ],
          activeLines: [4, 6],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "def is_pal(arr, l, r):",
              "    if l >= r:",
              "        return True",
              "    if arr[l] != arr[r]:",
              "        return False",
              "    return is_pal(arr, l + 1, r - 1)",
            ],
          },
          state: [
            { name: "Call 1: (0, 4)", value: "'r' == 'r' -> recurse (1, 3)" },
            { name: "Call 2: (1, 3)", value: "'a' == 'a' -> recurse (2, 2)", changed: true },
            { name: "Call 3 (base): (2, 2)", value: "l >= r -> true", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack · is_pal(['r','a','d','a','r'], l, r) Base Case",
            items: [
              { id: "p0", label: "is_pal(0, 4)", sub: "'r' == 'r', waiting", state: "dim" },
              { id: "p1", label: "is_pal(1, 3)", sub: "'a' == 'a', waiting", state: "active" },
              { id: "p2", label: "is_pal(2, 2)", sub: "l >= r -> base: true", state: "done" },
            ],
            caption: "Each recursive call shrinks bounds (l, r) inward until is_pal(2, 2) hits l >= r and returns true.",
          },
        },
        {
          title: "Early mismatch on [4, 9, 2, 4] returns false immediately",
          tag: "PITFALL",
          explanation: [
            "At `(0, 3)`, `4 == 4` matches, so Call 2 checks `(1, 2)`.",
            "Since `arr[1] = 9 != arr[2] = 2`, line 5 immediately returns `false` back up through Call 1 without checking any base case.",
          ],
          code: [
            "function is_pal(arr, l, r):",
            "    if l >= r:",
            "        return true",
            "    if arr[l] != arr[r]:",
            "        return false",
            "    return is_pal(arr, l + 1, r - 1)",
          ],
          activeLines: [4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Call 1: (0, 3)", value: "4 == 4 -> recurse (1, 2)" },
            { name: "Call 2: (1, 2)", value: "9 != 2 -> returns false", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack · Mismatch Early Return",
            items: [
              { id: "m0", label: "is_pal(0, 3)", sub: "4 == 4, waiting", state: "dim" },
              { id: "m1", label: "is_pal(1, 2)", sub: "9 != 2 -> returns false", state: "active" },
            ],
            caption: "Mismatch returns false immediately without waiting to cross bounds.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Skipping past the base case",
        detail:
          "Writing `if n == 0: return 0` when stepping by `n - 2` works for even `n`, but odd inputs like `n = 5 -> 3 -> 1 -> -1` skip `0` completely and cause Stack Overflow. Always use inequalities like `n <= 0` or `l >= r`.",
        code: "if n <= 0: return 0   // safe even if step skips exact 0",
      },
      {
        title: "Forgetting to return the recursive call",
        detail:
          "Calling `sum_digits(floor(n / 10))` without `return` runs the inner call and then throws away its answer. Every non-void recursive branch must explicitly `return` its result.",
      },
      {
        title: "Calling with unchanged parameters",
        detail:
          "Writing `is_pal(arr, l, r)` inside `is_pal` instead of `is_pal(arr, l + 1, r - 1)` never shrinks the problem and overflows the stack in milliseconds.",
      },
    ],
    practiceTask: {
      title: "Recursive Digit Sum",
      tier: "Warmup",
      goal: "Given a non-negative integer `n`, return the sum of its decimal digits using recursion (no loops).",
      constraints: ["0 <= n <= 10^9", "Use recursion without converting `n` to a string"],
      examples: [
        { input: "n = 472", output: "13", explanation: "4 + 7 + 2 = 13." },
        { input: "n = 0", output: "0", explanation: "Single-digit base case returns 0 directly." },
      ],
      tasks: [
        "Return `n` directly in the base case when `n < 10`.",
        "Otherwise return `(n mod 10) + sum_digits(floor(n / 10))`.",
      ],
      starterCode:
        "function sum_digits(n):\n    // TODO: base case for single digit, then recurse on floor(n / 10)",
      expectedOutput: "13\n0",
      hint: "Base case `if n < 10: return n` handles both `0` and single-digit numbers.",
      complexity: { time: "O(log10 n)", space: "O(log10 n)" },
      solutionCode:
        "function sum_digits(n):\n    if n < 10:\n        return n\n    return (n mod 10) + sum_digits(floor(n / 10))",
    },
    practiceChallenges: [
      {
        title: "Recursive Digit Sum",
        tier: "Warmup",
        goal: "Given a non-negative integer `n`, return the sum of its decimal digits recursively without loops.",
        constraints: ["0 <= n <= 10^9", "Do not convert `n` to a string"],
        examples: [
          { input: "n = 472", output: "13" },
          { input: "n = 0", output: "0" },
        ],
        tasks: [
          "Write base case `if n < 10: return n`.",
          "Add `n mod 10` to the recursive result on `floor(n / 10)`.",
        ],
        starterCode:
          "function sum_digits(n):\n    // TODO: return sum of digits recursively",
        expectedOutput: "13\n0",
        hint: "Each `floor(n / 10)` drops one digit, so `n` reaches `< 10` in at most 10 calls.",
        complexity: { time: "O(log10 n)", space: "O(log10 n)" },
        solutionCode:
          "function sum_digits(n):\n    if n < 10:\n        return n\n    return (n mod 10) + sum_digits(floor(n / 10))",
      },
      {
        title: "Recursive Array Palindrome Check",
        tier: "Core",
        goal: "Determine whether integer array `arr` reads the same forward and backward using recursive index bounds `(l, r)`.",
        constraints: ["0 <= len(arr) <= 1000", "Do not allocate reversed copies or subarrays"],
        examples: [
          { input: "arr = [3, 8, 5, 8, 3]", output: "true" },
          { input: "arr = [4, 9, 2, 4]", output: "false", explanation: "9 != 2 on the inner call." },
        ],
        tasks: [
          "Stop and return `true` when `l >= r` (handles empty, 1-element, and even-length arrays).",
          "Return `false` if `arr[l] != arr[r]`; otherwise return `is_pal(arr, l + 1, r - 1)`.",
        ],
        starterCode:
          "function is_palindrome(arr):\n    return helper(arr, 0, len(arr) - 1)\n\nfunction helper(arr, l, r):\n    // TODO: base case and recursive inward check",
        expectedOutput: "true\nfalse",
        hint: "Using `l >= r` instead of `l == r` stops both odd and even array lengths without an off-by-one miss.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function is_palindrome(arr):\n    return helper(arr, 0, len(arr) - 1)\n\nfunction helper(arr, l, r):\n    if l >= r:\n        return true\n    if arr[l] != arr[r]:\n        return false\n    return helper(arr, l + 1, r - 1)",
      },
      {
        title: "Count Occurrences of Digit d in n",
        tier: "Stretch",
        goal: "Given non-negative integer `n` and target digit `d` (`0 <= d <= 9`), recursively count how many times `d` appears in the decimal digits of `n`.",
        constraints: ["0 <= n <= 10^9", "0 <= d <= 9", "Must handle `n = 0, d = 0` returning 1"],
        examples: [
          { input: "n = 70727, d = 7", output: "3" },
          { input: "n = 0, d = 0", output: "1", explanation: "0 has one digit equal to 0." },
        ],
        tasks: [
          "Handle the single-digit base case `n < 10` directly (`return 1` if `n == d` else `0`) so `n = 0, d = 0` works without breaking multi-digit recursion.",
          "For `n >= 10`, add `(1 if (n mod 10) == d else 0)` to `count_digit(floor(n / 10), d)`.",
        ],
        starterCode:
          "function count_digit(n, d):\n    // TODO: handle n < 10 carefully and recurse on floor(n / 10)",
        expectedOutput: "3\n1",
        hint: "If your base case were `n == 0 -> 0`, then `count_digit(0, 0)` would wrongly return `0`! Stopping at `n < 10` fixes it.",
        complexity: { time: "O(log10 n)", space: "O(log10 n)" },
        solutionCode:
          "function count_digit(n, d):\n    if n < 10:\n        if n == d: return 1\n        return 0\n    match ← 1 if (n mod 10) == d else 0\n    return match + count_digit(floor(n / 10), d)",
      },
    ],
  },

  "dsa-call-stack-frames": {
    lessonId: "dsa-call-stack-frames",
    subtitle:
      "Inspect how LIFO call stack frames isolate local variables per call, cost O(d) auxiliary space, and learn when plain loops beat linear recursion.",
    intro: {
      heading: "Call Stack Frames & Recursion vs Loops",
      explanation: [
        "Run `sum_to(100_000)` recursively (`n + sum_to(n - 1)`) and your program crashes with `RecursionError` / `Stack Overflow` around depth `1,000`–`10,000`—even though the function allocates zero arrays. Every paused call keeps its own **stack frame** alive in RAM holding that invocation's parameters, locals, and return address.",
        "Because frames push and pop in **LIFO** (Last-In, First-Out) order, changing `n` in `fact(n - 1)` never overwrites `n` in `fact(n)`, yet a chain of depth `d` consumes `O(d)` stack space. Rewriting linear recursion as a `for` loop computes the exact same answer in `O(1)` extra space without touching stack limits.",
      ],
      analogy:
        "Stacking clipboards on a desk while pausing one task to handle an urgent sub-task: each clipboard keeps its own sticky notes (`n`, `temp`) separate from the clipboards underneath, and you always finish the top clipboard first.",
      realWorldUses: [
        "Predicting stack-overflow crashes when processing inputs of size `n = 10^5` through linear recursion",
        "Rewriting deep linear chains into `O(1)`-space loops in tight memory environments",
      ],
    },
    sections: [
      {
        heading: "Stack frame isolation, O(d) space, and broken depth=10^5 recursion vs loop",
        paragraphs: [
          "Each recursive call receives its own private stack frame, so `n` in `fact(2)` sits in a different slot from `n` in `fact(3)`. While `fact(3)` waits for `fact(2)` to return, its frame stays open in memory.",
          "For a straight chain of length `n`, keeping `n` suspended frames open hits the OS/runtime stack limit (`~1,000` to `10,000` frames). Converting linear recursion to an accumulator loop eliminates every suspended frame and keeps memory at `O(1)` even at `n = 100,000`.",
        ],
        code: [
          "// CRASHES at n = 100,000 (100,000 suspended frames -> Stack Overflow):",
          "function sum_to_rec(n):",
          "    if n <= 0: return 0",
          "    return n + sum_to_rec(n - 1)",
          "",
          "// FIXED: O(1) space loop finishes n = 100,000 with 1 frame:",
          "function sum_to_loop(n):",
          "    total ← 0",
          "    for i from 1 to n:",
          "        total ← total + i",
          "    return total",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Linear recursion vs plain loop for depth d = n",
          headers: ["Dimension", "Linear Recursion (fact(n) / sum_to_rec)", "Plain Loop (for i from 1 to n)"],
          rows: [
            ["Extra memory", "O(n) stack frames kept open at once", "O(1) scalar variables only"],
            ["Local variable state", "Isolated copy of n per frame", "Single i and total overwritten in place"],
            ["At n = 100,000", "Stack Overflow crash (~1,000–10,000 limit)", "Runs in ~1 millisecond"],
            ["Best suited for", "Branching or nested subproblems", "Single straight chain of steps"],
          ],
          highlightCol: 2,
        },
        visual: {
          kind: "dsa-growth",
          n: 16,
          activeTier: "const",
          tiers: [
            { id: "const", label: "O(1)", name: "plain loop frames", steps: 1 },
            { id: "linear", label: "O(n)", name: "linear recursion frames", steps: 16 },
          ],
          caption: "At n = 16, a loop holds 1 stack frame while linear recursion stacks 16 frames.",
        },
        callout: {
          kind: "RULE OF THUMB",
          text: "If a recursive function makes only one self-call per step along a straight line (`f(n - 1)` or `f(arr, i + 1)`), a plain loop gives the same time with `O(1)` space and zero stack limit risk.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Replace Crashing O(n) Linear Recursion with an O(1) Loop",
      steps: [
        {
          label: "Step 1: Linear recursion stacks n open frames",
          explanation: "Each call pauses on `n + sum_to_rec(n - 1)`, keeping `n` frames open until `n == 0`.",
          code: [
            "function sum_to_rec(n):",
            "    if n <= 0: return 0",
            "    return n + sum_to_rec(n - 1)",
          ],
          activeLines: [3],
          output: "sum_to_rec(100000) -> Stack Overflow / RecursionError",
        },
        {
          label: "Step 2: Move pending addition into an accumulator variable",
          explanation: "Instead of leaving `n + ...` suspended on the stack, add `i` into `total` right away inside a `for` loop.",
          code: [
            "function sum_to_loop(n):",
            "    total ← 0",
            "    for i from 1 to n:",
            "        total ← total + i",
            "    return total",
          ],
          activeLines: [2, 4],
          output: "sum_to_loop(100000) -> 5000050000 (1 stack frame)",
        },
        {
          label: "Step 3: Reserve recursion for branching or index-based problems",
          explanation: "When recursion is required on small bounds, pass an index `idx + 1` rather than slicing copies of `arr`.",
          code: [
            "function sum_from(arr, idx):",
            "    if idx == len(arr): return 0",
            "    return arr[idx] + sum_from(arr, idx + 1)",
          ],
          activeLines: [2, 3],
          output: "sum_from([5, -2, 9, 1], 0) -> 13",
        },
      ],
    },
    walkthrough: {
      title: "Trace LIFO frames in fact(3) and compare O(1) loops",
      layout: "visual-first",
      steps: [
        {
          title: "Push frame 1 for fact(3)",
          tag: "MEMORY",
          explanation: [
            "Calling `fact(3)` allocates Frame #1 with local parameter `n = 3`. Execution pauses on line 4 waiting for `fact(2)`.",
            "Frame #1 cannot finish yet, so it stays on the call stack.",
          ],
          code: [
            "function fact(n):",
            "    if n <= 1:",
            "        return 1",
            "    sub ← fact(n - 1)",
            "    return n * sub",
          ],
          activeLines: [4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Stack depth", value: "1 frame" },
            { name: "Top frame", value: "fact(3): n = 3", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack (LIFO) · Depth = 1",
            items: [
              { id: "s3", label: "fact(3)", sub: "n = 3, paused at line 4", state: "active" },
            ],
            caption: "Frame #1 holds its own local n = 3 while waiting on fact(2).",
          },
        },
        {
          title: "Push frame 2 with isolated n = 2",
          tag: "TRACE",
          explanation: [
            "`fact(2)` allocates Frame #2 on top of Frame #1 with its own `n = 2`. Frame #1's `n = 3` remains untouched below.",
            "Frame #2 now pauses at line 4 to call `fact(1)`.",
          ],
          code: [
            "function fact(n):",
            "    if n <= 1:",
            "        return 1",
            "    sub ← fact(n - 1)",
            "    return n * sub",
          ],
          activeLines: [4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Stack depth", value: "2 frames", changed: true },
            { name: "Frame #1 n", value: "3 (unchanged)" },
            { name: "Frame #2 n", value: "2 (top)", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack (LIFO) · Depth = 2",
            items: [
              { id: "s3", label: "fact(3)", sub: "n = 3, paused", state: "dim" },
              { id: "s2", label: "fact(2)", sub: "n = 2, paused at line 4", state: "active" },
            ],
            caption: "Local variables live inside their own frame, never overwriting caller frames.",
          },
        },
        {
          title: "Peak depth d = 3 at base case fact(1)",
          tag: "CHECK",
          explanation: [
            "`fact(1)` pushes Frame #3 (`n = 1`), hits `n <= 1`, and returns `1` immediately.",
            "Peak auxiliary space equals `d = 3` open frames simultaneously (`O(d)` stack space).",
          ],
          code: [
            "function fact(n):",
            "    if n <= 1:",
            "        return 1",
            "    sub ← fact(n - 1)",
            "    return n * sub",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Peak depth d", value: "3 frames", changed: true },
            { name: "fact(1) returns", value: "1", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack (LIFO) · Peak Depth d = 3",
            items: [
              { id: "s3", label: "fact(3)", sub: "n = 3, paused", state: "dim" },
              { id: "s2", label: "fact(2)", sub: "n = 2, paused", state: "dim" },
              { id: "s1", label: "fact(1)", sub: "n = 1, returns 1", state: "done" },
            ],
            caption: "TOP frame pops first (Last-In, First-Out) once it returns 1.",
          },
        },
        {
          title: "Pop fact(1) and resume frame 2 (fact(2))",
          tag: "TRACE",
          explanation: [
            "Frame #3 (`fact(1)`) pops and passes its return value `1` into Frame #2's `sub`, while Frame #2 retains its isolated `n = 2`.",
            "Frame #2 computes `2 * 1 = 2` and prepares to pop and return `2` to Frame #1 (`fact(3)`).",
          ],
          code: [
            "function fact(n):",
            "    if n <= 1:",
            "        return 1",
            "    sub ← fact(n - 1)",
            "    return n * sub",
          ],
          activeLines: [5],
          codeLabel: "Pseudocode",
          state: [
            { name: "fact(1) popped", value: "returned 1", changed: true },
            { name: "Frame #2 result", value: "2 * 1 = 2", changed: true },
            { name: "Active frames", value: "2 (fact(3), fact(2))" },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack (LIFO) · Unwinding Frame #2",
            items: [
              { id: "s3", label: "fact(3)", sub: "n = 3, paused", state: "dim" },
              { id: "s2", label: "fact(2)", sub: "n = 2, sub = 1 -> returns 2", state: "done" },
            ],
            caption: "Frame #2 pops next in LIFO order with its own isolated n = 2.",
          },
        },
        {
          title: "Resume root frame fact(3) and return 6",
          tag: "TRACE",
          explanation: [
            "Frame #2 pops and delivers `sub = 2` to Frame #1 (`fact(3)`), which still has its preserved `n = 3`.",
            "Frame #1 computes `3 * 2 = 6` and returns `6` to the caller, leaving `0` open frames after return.",
          ],
          code: [
            "function fact(n):",
            "    if n <= 1:",
            "        return 1",
            "    sub ← fact(n - 1)",
            "    return n * sub",
          ],
          activeLines: [5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Frame #1 result", value: "3 * 2 = 6", changed: true },
            { name: "Stack status", value: "1 frame returning (0 after return)", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack (LIFO) · Root Frame Returning",
            items: [
              { id: "s3", label: "fact(3)", sub: "n = 3, sub = 2 -> returns 6", state: "done" },
            ],
            caption: "Root frame restores local n = 3 and returns 6 to finish the call chain.",
          },
        },
        {
          title: "Why a plain loop wins for linear chains",
          tag: "PATTERN",
          explanation: [
            "At `n = 16`, linear recursion keeps `16` stack frames alive (`O(n)` space). At `n = 100,000`, those `100,000` frames overflow most runtime call stacks.",
            "Rewriting `fact(n)` with a single `for` loop uses `1` frame (`O(1)` auxiliary space) and runs faster with zero frame overhead.",
          ],
          code: [
            "function fact_loop(n):      // O(1) space",
            "    ans ← 1",
            "    for i from 2 to n:",
            "        ans ← ans * i",
            "    return ans",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "def fact_loop(n):          # O(1) space",
              "    ans = 1",
              "    for i in range(2, n + 1):",
              "        ans *= i",
              "    return ans",
            ],
          },
          state: [
            { name: "Loop extra space", value: "O(1) (1 frame)", changed: true },
            { name: "Recursive space", value: "O(n) (16 frames)" },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Loop Execution · Single Reused Stack Frame (O(1) Space)",
            items: [
              { id: "loop1", label: "fact_loop(16)", sub: "ans = 1, i = 2..16 updated in place", state: "done" },
            ],
            caption: "A plain loop holds 1 stack frame at O(1) space instead of pushing 16 frames onto the call stack.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Hidden O(n) space without any arrays",
        detail:
          "A recursive function with zero array allocations is not `O(1)` space! Every active nested call occupies a stack frame, so depth `d` always uses `O(d)` auxiliary space.",
      },
      {
        title: "Scalars are isolated, container references are shared",
        detail:
          "Changing `n` or `i` inside a child frame never affects the parent's `n` or `i`. However, mutating `arr[i]` inside a child frame modifies the single shared array referenced by all frames.",
      },
      {
        title: "Runtime stack depth ceilings",
        detail:
          "Most languages cap the call stack around `1,000` to `10,000` frames by default. Never use linear recursion of depth `n` when `n` can reach `10^5`; write an iterative loop instead.",
      },
    ],
    practiceTask: {
      title: "Recursive Array Sum With Index",
      tier: "Warmup",
      goal: "Compute the sum of all elements in 1D integer array `arr` recursively by advancing an index `idx` from `0` to `len(arr)`.",
      constraints: ["0 <= len(arr) <= 500", "Do not slice or copy `arr`"],
      examples: [
        { input: "arr = [5, -2, 9, 1]", output: "13" },
        { input: "arr = []", output: "0" },
      ],
      tasks: [
        "Return `0` in the base case when `idx == len(arr)`.",
        "Return `arr[idx] + sum_from(arr, idx + 1)` otherwise.",
      ],
      starterCode:
        "function sum_array(arr):\n    return sum_from(arr, 0)\n\nfunction sum_from(arr, idx):\n    // TODO: base case at end of array + recursive step",
      expectedOutput: "13\n0",
      hint: "Passing `idx + 1` reads `arr` in `O(1)` per call without creating subarray copies, though call stack depth is `O(n)`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "function sum_array(arr):\n    return sum_from(arr, 0)\n\nfunction sum_from(arr, idx):\n    if idx == len(arr):\n        return 0\n    return arr[idx] + sum_from(arr, idx + 1)",
    },
    practiceChallenges: [
      {
        title: "Recursive Array Sum With Index",
        tier: "Warmup",
        goal: "Return the sum of elements in `arr` using an index parameter `idx` and no loops or array slicing.",
        constraints: ["0 <= len(arr) <= 500", "No array copies"],
        examples: [
          { input: "arr = [5, -2, 9, 1]", output: "13" },
          { input: "arr = []", output: "0" },
        ],
        tasks: [
          "Return `0` when `idx == len(arr)`.",
          "Add `arr[idx]` to `sum_from(arr, idx + 1)`.",
        ],
        starterCode:
          "function sum_from(arr, idx):\n    // TODO: base case and recursive sum",
        expectedOutput: "13\n0",
        hint: "Each frame keeps its own `idx`, so `arr[idx]` stays intact when unwinding.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function sum_from(arr, idx):\n    if idx == len(arr):\n        return 0\n    return arr[idx] + sum_from(arr, idx + 1)",
      },
      {
        title: "Reverse Character Array Recursively",
        tier: "Core",
        goal: "Reverse character array `chars` in place using a recursive helper on bounds `(l, r)` so caller sees the reversed array.",
        constraints: ["0 <= len(chars) <= 500", "Mutate `chars` in place without allocating a second array"],
        examples: [
          { input: "chars = ['s', 't', 'a', 'c', 'k']", output: "['k', 'c', 'a', 't', 's']" },
          { input: "chars = ['a', 'b']", output: "['b', 'a']" },
        ],
        tasks: [
          "Stop when `l >= r`.",
          "Swap `chars[l]` and `chars[r]`, then recurse on `(l + 1, r - 1)`.",
        ],
        starterCode:
          "function reverse_chars(chars, l, r):\n    // TODO: swap outer pair and recurse inward",
        expectedOutput: "['k', 'c', 'a', 't', 's']\n['b', 'a']",
        hint: "Because `chars` is passed by reference, swapping inside each frame mutates the shared array directly.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function reverse_chars(chars, l, r):\n    if l >= r:\n        return\n    temp ← chars[l]\n    chars[l] ← chars[r]\n    chars[r] ← temp\n    reverse_chars(chars, l + 1, r - 1)",
      },
      {
        title: "Convert Linear Sum-Up-To-N Recursion to O(1) Loop",
        tier: "Stretch",
        goal: "Given `n` up to `10^5` where recursive `sum_to(n)` overflows the stack, implement `sum_to_safe(n)` iteratively in `O(1)` auxiliary space.",
        constraints: ["0 <= n <= 10^5", "Must not overflow call stack", "Auxiliary space: O(1)"],
        examples: [
          { input: "n = 5", output: "15" },
          { input: "n = 100000", output: "5000050000" },
        ],
        tasks: [
          "Replace recursive `n + sum_to(n - 1)` with an accumulator loop from `1` to `n` using 64-bit integers.",
          "Confirm zero recursive frames are pushed.",
        ],
        starterCode:
          "function sum_to_safe(n):\n    // TODO: O(1)-space loop safe at n = 100000",
        expectedOutput: "15\n5000050000",
        hint: "Keep `total = 0` and loop `i` from `1` to `n`, adding `i` to `total`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function sum_to_safe(n):\n    total ← 0\n    for i from 1 to n:\n        total ← total + i\n    return total",
      },
    ],
  },

  "dsa-recursion-trees": {
    lessonId: "dsa-recursion-trees",
    subtitle:
      "Visualize why naive branching calls like fib(n) explode to O(2^n), preview caching repeated subproblems, and halve exponents to achieve O(log n) depth.",
    intro: {
      heading: "Recursion Trees, Duplicate Calls & O(log n) Power",
      explanation: [
        "Call naive `fib(45)` (`fib(n - 1) + fib(n - 2)`) and your CPU executes over 2 billion redundant calls, freezing for tens of seconds because `fib(3)`, `fib(2)`, and `fib(1)` get recomputed over and over. Even in halving power `pow(x, n)`, writing `pow(x, floor(n/2)) * pow(x, floor(n/2))` executes the same subproblem twice per level and silently turns `O(log n)` back into `O(n)`.",
        "You tame a **recursion tree** in two ways: **caching** solved states in a `memo` array so overlapping branches run once (`O(n)`), or storing one halved call (`half = fast_pow(x, floor(n/2))`) in a local variable so `O(log n)` time and stack depth stay intact.",
      ],
      analogy:
        "Computing `2^8`: multiplying `2 * 2 * ...` eight times is linear work, and asking two friends to each compute `2^4` separately repeats identical work. Asking one friend for `half = 2^4` and squaring `half * half` solves it in a single halving chain.",
      realWorldUses: [
        "Avoiding exponential timeouts on overlapping recurrences like staircase counting",
        "Computing modular powers `a^b mod m` in `O(log b)` steps for cryptography and hashing",
      ],
    },
    sections: [
      {
        heading: "Comparing recursion tree shapes, duplicate calls, and broken vs fixed fast_pow",
        paragraphs: [
          "Total runtime equals the total number of nodes in the recursion tree, whereas auxiliary stack space equals only the longest root-to-leaf path (tree height). In naive `fib(5)`, `fib(3)` runs twice, `fib(2)` runs 3 times, and `fib(1)` runs 5 times; caching results in `memo` reduces all `O(2^n)` duplicate nodes to `O(n)`.",
          "The exact same trap hits `fast_pow(x, n)`: calling `fast_pow(x, floor(n/2)) * fast_pow(x, floor(n/2))` creates 2 branches per level (`2^(log2 n) = n` total calls). Storing `half` once drops the tree to a single straight chain of length `log2(n)`.",
        ],
        code: [
          "// SLOW O(n): two recursive calls per frame rebuild the entire tree!",
          "function pow_double_call(x, n):",
          "    if n == 0: return 1",
          "    if n mod 2 == 0:",
          "        return pow_double_call(x, floor(n / 2)) * pow_double_call(x, floor(n / 2))",
          "    return x * pow_double_call(x, floor(n / 2)) * pow_double_call(x, floor(n / 2))",
          "",
          "// FIXED O(log n): store half once in a local variable",
          "function fast_pow(x, n):",
          "    if n == 0: return 1",
          "    half ← fast_pow(x, floor(n / 2))",
          "    if n mod 2 == 0: return half * half",
          "    return x * half * half",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Recursion tree shape, total calls (time), and max stack depth (space)",
          headers: ["Pattern", "Calls per node", "Total nodes (Time)", "Tree height (Space)"],
          rows: [
            ["Naive fib(n-1) + fib(n-2)", "2 (overlapping)", "O(2^n)", "O(n)"],
            ["Cached fib(n) with memo array", "2, repeats look up O(1)", "O(n)", "O(n)"],
            ["Double-call pow(n/2) * pow(n/2)", "2 (duplicate halving)", "O(n)", "O(log n)"],
            ["Saved half = pow(x, floor(n/2))", "1 (single halving)", "O(log n)", "O(log n)"],
          ],
          highlightCol: 2,
        },
        visual: {
          kind: "dsa-growth",
          n: 16,
          activeTier: "log",
          tiers: [
            { id: "log", label: "O(log n)", name: "single-half fast_pow (halvings)", steps: 4 },
            { id: "linear", label: "O(n)", name: "linear or double-half pow", steps: 16 },
          ],
          caption: "Storing half once keeps both time and stack depth logarithmic in n.",
        },
        callout: {
          kind: "WATCH OUT",
          text: "Never call the same recursive subproblem twice in one return expression (`pow(x, n/2) * pow(x, n/2)`). Save `half` once in a local variable and multiply `half * half`.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Tame Exponential Trees with Memoization & Saved Halves",
      steps: [
        {
          label: "Step 1: Naive two-branch `fib(n)` (`O(2^n)`)",
          explanation: "`fib(n - 1)` and `fib(n - 2)` re-solve identical subtrees over and over, timing out past `n = 40`.",
          code: [
            "function fib_naive(n):",
            "    if n <= 1: return n",
            "    return fib_naive(n - 1) + fib_naive(n - 2)",
          ],
          activeLines: [3],
          output: "fib_naive(45) -> >2,000,000,000 calls (times out)",
        },
        {
          label: "Step 2: Cache each solved state in `memo` (`O(n)`)",
          explanation: "Checking `memo[k] != -1` turns every repeated subtree into an `O(1)` lookup.",
          code: [
            "function fib_memo(k, memo):",
            "    if k <= 1: return k",
            "    if memo[k] != -1: return memo[k]",
            "    memo[k] ← fib_memo(k - 1, memo) + fib_memo(k - 2, memo)",
            "    return memo[k]",
          ],
          activeLines: [3, 4],
          output: "fib_memo(45) -> 1134903170 in 89 calls",
        },
        {
          label: "Step 3: Store `half` once in `fast_pow(x, n)` (`O(log n)`)",
          explanation: "Halving `n` and saving `half` in one local variable prevents duplicate recursive calls.",
          code: [
            "function fast_pow(x, n):",
            "    if n == 0: return 1",
            "    half ← fast_pow(x, floor(n / 2))",
            "    if n mod 2 == 0: return half * half",
            "    return x * half * half",
          ],
          activeLines: [3, 4, 5],
          output: "fast_pow(2, 10) -> 1024 in 4 calls",
        },
      ],
    },
    walkthrough: {
      title: "Fibonacci call explosion vs O(log n) halving power",
      layout: "visual-first",
      steps: [
        {
          title: "Naive fib(4) branches into two calls",
          tag: "CONCEPT",
          explanation: [
            "`fib(4)` needs both `fib(3)` and `fib(2)`, splitting level 0 into two recursive calls at level 1.",
            "Unlike linear recursion, each node spawns two children, doubling potential work per level.",
          ],
          code: [
            "function fib(n):",
            "    if n <= 1: return n",
            "    return fib(n - 1) + fib(n - 2)",
          ],
          activeLines: [3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Root call", value: "fib(4)" },
            { name: "Children spawned", value: "fib(3), fib(2)", changed: true },
          ],
          visual: {
            kind: "dsa-divide",
            levels: [
              {
                label: "Depth 0",
                groups: [{ label: "Root", values: ["fib(4)"], cellIds: ["f4"], state: "active", note: "Calls fib(3) + fib(2)" }],
              },
              {
                label: "Depth 1",
                groups: [
                  { label: "Left", values: ["fib(3)"], cellIds: ["f3"], state: "pivot", note: "Will branch again" },
                  { label: "Right", values: ["fib(2)"], cellIds: ["f2r"], state: "default", note: "Will duplicate work" },
                ],
              },
            ],
            caption: "Each non-base fib(n) node splits into two recursive subproblems.",
          },
        },
        {
          title: "Duplicate calls multiply across the fib(4) tree",
          tag: "PITFALL",
          explanation: [
            "Expanding all levels for `n = 4` executes `9` total calls: `fib(2)` runs twice from scratch and `fib(1)` runs three times.",
            "With `n = 40`, this naive tree makes over `300,000,000` calls (`O(2^n)` growth).",
          ],
          code: [
            "function fib(n):",
            "    if n <= 1: return n",
            "    return fib(n - 1) + fib(n - 2)",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Total calls (n=4)", value: "9 nodes", changed: true },
            { name: "fib(2) repeated", value: "2 times", changed: true },
            { name: "Time / Stack space", value: "O(2^n) / O(n)" },
          ],
          visual: {
            kind: "dsa-divide",
            levels: [
              {
                label: "Depth 0",
                groups: [{ values: ["fib(4)"], cellIds: ["f4"], state: "default" }],
              },
              {
                label: "Depth 1",
                groups: [
                  { values: ["fib(3)"], cellIds: ["f3"], state: "default" },
                  { label: "Duplicate", values: ["fib(2)"], cellIds: ["f2r"], state: "pivot", note: "Computed twice!" },
                ],
              },
              {
                label: "Depth 2",
                groups: [
                  { label: "Duplicate", values: ["fib(2)"], cellIds: ["f2l"], state: "pivot", note: "Same subproblem as Depth 1 right" },
                  { values: ["fib(1)"], cellIds: ["f1a"], state: "done" },
                  { values: ["fib(1)"], cellIds: ["f1b"], state: "done" },
                  { values: ["fib(0)"], cellIds: ["f0a"], state: "done" },
                ],
              },
              {
                label: "Depth 3",
                groups: [
                  { values: ["fib(1)"], cellIds: ["f1c"], state: "done" },
                  { values: ["fib(0)"], cellIds: ["f0b"], state: "done" },
                ],
              },
            ],
            caption: "Repeated subproblems (highlighted fib(2)) cause exponential O(2^n) work.",
          },
        },
        {
          title: "Memoization prunes duplicate fib(2) branch in O(1)",
          tag: "PATTERN",
          explanation: [
            "Store solved values in `memo`: once `fib_memo(2)` computes and saves `memo[2] = 1` under the left branch, the right `fib(2)` reads `memo[2]` in `O(1)` without expanding.",
            "Pruning repeated subtrees drops runtime from `O(2^n)` down to `O(n)` calls.",
          ],
          code: [
            "function fib_memo(n, memo):",
            "    if n <= 1: return n",
            "    if memo[n] != -1: return memo[n]",
            "    memo[n] ← fib_memo(n - 1, memo) + fib_memo(n - 2, memo)",
            "    return memo[n]",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "memo[2]", value: "1 (cached on 1st visit)", changed: true },
            { name: "2nd fib(2) call", value: "O(1) array hit (pruned)", changed: true },
            { name: "Time complexity", value: "O(n)", changed: true },
          ],
          visual: {
            kind: "dsa-divide",
            levels: [
              {
                label: "Depth 0",
                groups: [{ values: ["fib(4) = 3"], cellIds: ["f4"], state: "done" }],
              },
              {
                label: "Depth 1",
                groups: [
                  { label: "Computed", values: ["fib(3) = 2"], cellIds: ["f3"], state: "active" },
                  { label: "memo[2] hit", values: ["1 (pruned)"], cellIds: ["f2r"], state: "done", note: "No subtree needed!" },
                ],
              },
              {
                label: "Depth 2",
                groups: [
                  { label: "Saved memo[2]", values: ["fib(2) = 1"], cellIds: ["f2l"], state: "done" },
                  { label: "memo[1] hit", values: ["1"], cellIds: ["f1a"], state: "dim" },
                ],
              },
              {
                label: "Depth 3",
                groups: [
                  { values: ["fib(1)"], cellIds: ["f1c"], state: "done" },
                  { values: ["fib(0)"], cellIds: ["f0b"], state: "done" },
                ],
              },
            ],
            caption: "Caching turns exponential branching into a single pruned spine (O(n) work).",
          },
        },
        {
          title: "Halving recursion: compute half once in fast_pow(2, 8)",
          tag: "TRACE",
          explanation: [
            "To compute `2^8`, store `half = fast_pow(2, 4)` in a local variable ONCE, then return `half * half`.",
            "Each level halves the exponent (`8 -> 4 -> 2 -> 1 -> 0`), forming a single straight chain of length `O(log n)` with zero duplicate branches.",
          ],
          code: [
            "function fast_pow(x, n):",
            "    if n == 0: return 1",
            "    half ← fast_pow(x, floor(n / 2))",
            "    if n mod 2 == 0:",
            "        return half * half",
            "    return x * half * half",
          ],
          activeLines: [2, 3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Chain", value: "pow(2,8)->(2,4)->(2,2)->(2,1)->(2,0)", changed: true },
            { name: "Total calls", value: "5 calls", changed: true },
            { name: "Result", value: "256" },
          ],
          visual: {
            kind: "dsa-divide",
            levels: [
              {
                label: "n = 8",
                groups: [{ label: "half * half", values: ["fast_pow(2, 8) = 256"], cellIds: ["p8"], state: "done" }],
              },
              {
                label: "n = 4",
                groups: [{ label: "half = 16", values: ["fast_pow(2, 4) = 16"], cellIds: ["p4"], state: "active" }],
              },
              {
                label: "n = 2",
                groups: [{ label: "half = 4", values: ["fast_pow(2, 2) = 4"], cellIds: ["p2"], state: "active" }],
              },
              {
                label: "n = 1",
                groups: [{ label: "2 * 1 * 1", values: ["fast_pow(2, 1) = 2"], cellIds: ["p1"], state: "active" }],
              },
              {
                label: "n = 0",
                groups: [{ label: "Base", values: ["fast_pow(2, 0) = 1"], cellIds: ["p0"], state: "done" }],
              },
            ],
            caption: "Storing half once produces one single branch per halving step (O(log n) depth and time).",
          },
        },
        {
          title: "Compare O(log n) halving vs O(n) linear power at n = 16",
          tag: "CHECK",
          explanation: [
            "At exponent `n = 16`, `fast_pow(x, 16)` performs only `log2(16) = 4` halvings (`16 -> 8 -> 4 -> 2 -> 1`, then base `0`), whereas multiplying `x` linearly or calling `fast_pow(x, floor(n/2))` twice takes `O(n)` steps (`16` multiplications).",
            "Even when `n = 1,000,000,000`, `log2(n)` is only ~30 halvings!",
          ],
          code: [
            "// Compare at n = 16 (log2(16) = 4 halvings):",
            "// linear_pow(x, 16) -> 16 steps",
            "// fast_pow(x, 16)   -> 4 halvings (O(log n))",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Exponent n", value: "16" },
            { name: "O(log n) work", value: "4 halvings", changed: true },
            { name: "O(n) work", value: "16 steps" },
          ],
          visual: {
            kind: "dsa-divide",
            levels: [
              {
                label: "4 halvings vs 16",
                groups: [{ label: "Depth 0", values: ["n = 16 (O(log n) vs O(n))"], cellIds: ["h16"], state: "done" }],
              },
              {
                label: "Halve 1 -> 2",
                groups: [
                  { label: "Step 1", values: ["n = 8"], cellIds: ["h8"], state: "active" },
                  { label: "Step 2", values: ["n = 4"], cellIds: ["h4"], state: "active" },
                ],
              },
              {
                label: "Halve 3 -> 4",
                groups: [
                  { label: "Step 3", values: ["n = 2"], cellIds: ["h2"], state: "active" },
                  { label: "Step 4", values: ["n = 1 -> 0"], cellIds: ["h1"], state: "done" },
                ],
              },
            ],
            caption: "Storing half once executes 4 halvings (16 -> 8 -> 4 -> 2 -> 1 -> 0) instead of 16 linear steps.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Calling fast_pow twice ruins O(log n)",
        detail:
          "Writing `return fast_pow(x, floor(n/2)) * fast_pow(x, floor(n/2))` splits every node into 2 calls. A halving call tree of depth `log2(n)` has `2^(log2 n) = n` nodes (formal tree traversals are covered in M14), silently degrading `O(log n)` back to `O(n)`!",
        code: "half ← fast_pow(x, floor(n / 2))   // store once in a local variable!",
      },
      {
        title: "Time vs stack space in naive Fibonacci",
        detail:
          "Naive `fib(n)` takes `O(2^n)` time because `~2^n` calls execute across the whole tree, yet its auxiliary stack space is only `O(n)` because only one root-to-leaf path is open on the stack at any moment.",
      },
      {
        title: "Odd exponent handling in fast_pow",
        detail:
          "When `n` is odd (e.g., `n = 5`), `floor(5 / 2) = 2`, so `half * half` only gives `x^4`. Multiply by one extra `x` (`return x * half * half`) to restore the dropped `1`.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does this buggy fast_pow(2, 5) return when the odd-exponent branch omits multiplying by x?",
        code: "function fast_pow(x, n):\n    if n == 0: return 1\n    half ← fast_pow(x, floor(n / 2))\n    return half * half",
        options: [
          { id: "a", label: "1 (every frame returns 1 because fast_pow(2, 1) also drops x)" },
          { id: "b", label: "16 (computes 2^4 and drops only the final factor of 2)" },
          { id: "c", label: "32 (floor(5 / 2) still produces 2^5)" },
          { id: "d", label: "Infinite recursion because n = 1 never reaches 0" },
        ],
        correctId: "a",
        explanation: "Tracing down to n = 1 hits floor(1 / 2) = 0, so fast_pow(2, 1) returns 1 * 1 = 1 instead of 2. That 1 then squares into 1 at n = 2 and n = 5.",
      },
      {
        prompt: "What happens when you call fib_memo(2, memo) with only k == 0 as the base case?",
        code: "function fib_memo(k, memo):\n    if k == 0: return 0\n    if memo[k] != -1: return memo[k]\n    memo[k] ← fib_memo(k - 1, memo) + fib_memo(k - 2, memo)\n    return memo[k]",
        options: [
          { id: "a", label: "Returns 1" },
          { id: "b", label: "Returns 2" },
          { id: "c", label: "Returns 0" },
          { id: "d", label: "Recurses into negative k (-1, -2, ...) because k = 1 has no base case" },
        ],
        correctId: "d",
        explanation: "Because k = 1 is not handled as a base case, fib_memo(1) calls fib_memo(-1), which misses k == 0 and keeps descending into negative indices.",
      },
    ],
    practiceTask: {
      title: "Fast Integer Power in O(log n)",
      tier: "Warmup",
      goal: "Compute `x^n` for integer `x` and non-negative exponent `n` using halving recursion in `O(log n)` time and `O(log n)` stack space.",
      constraints: ["-10 <= x <= 10", "0 <= n <= 30", "Call `fast_pow(x, floor(n / 2))` only ONCE per frame"],
      examples: [
        { input: "x = 2, n = 10", output: "1024" },
        { input: "x = 3, n = 5", output: "243", explanation: "half = 3^2 = 9, odd step returns 3 * 9 * 9 = 243." },
      ],
      tasks: [
        "Return `1` when `n == 0`.",
        "Compute `half = fast_pow(x, floor(n / 2))` once, then return `half * half` if `n` is even or `x * half * half` if `n` is odd.",
      ],
      starterCode:
        "function fast_pow(x, n):\n    // TODO: O(log n) recursive power by squaring",
      expectedOutput: "1024\n243",
      hint: "Store `half` in a local variable before squaring; never call `fast_pow` twice in the return line.",
      complexity: { time: "O(log n)", space: "O(log n)" },
      solutionCode:
        "function fast_pow(x, n):\n    if n == 0:\n        return 1\n    half ← fast_pow(x, floor(n / 2))\n    if n mod 2 == 0:\n        return half * half\n    return x * half * half",
    },
    practiceChallenges: [
      {
        title: "Fast Integer Power in O(log n)",
        tier: "Warmup",
        goal: "Implement `fast_pow(x, n)` using recursive halving in `O(log n)` time and depth.",
        constraints: ["-10 <= x <= 10", "0 <= n <= 30", "Must not multiply linearly in O(n)"],
        examples: [
          { input: "x = 2, n = 10", output: "1024" },
          { input: "x = 3, n = 5", output: "243" },
        ],
        tasks: [
          "Handle `n == 0` by returning `1`.",
          "Store `half = fast_pow(x, floor(n / 2))` once and handle even vs odd `n`.",
        ],
        starterCode:
          "function fast_pow(x, n):\n    // TODO: halving recursion",
        expectedOutput: "1024\n243",
        hint: "If `n` is odd, `x^n = x * (x^floor(n/2))^2`.",
        complexity: { time: "O(log n)", space: "O(log n)" },
        solutionCode:
          "function fast_pow(x, n):\n    if n == 0:\n        return 1\n    half ← fast_pow(x, floor(n / 2))\n    if n mod 2 == 0:\n        return half * half\n    return x * half * half",
      },
      {
        title: "Cached Fibonacci Number in O(n) Time",
        tier: "Core",
        goal: "Compute the `n`-th Fibonacci number (`fib(0) = 0, fib(1) = 1`) for `n <= 45` by caching solved states in a `memo` array initialized to `-1`.",
        constraints: ["0 <= n <= 45", "Naive O(2^n) recursion will time out", "Target: O(n) time"],
        examples: [
          { input: "n = 10", output: "55" },
          { input: "n = 40", output: "102334155" },
        ],
        tasks: [
          "Allocate array `memo` of size `n + 1` filled with `-1`.",
          "Inside `fib_memo(k, memo)`, check `if memo[k] != -1: return memo[k]` before recursing, and save the computed sum into `memo[k]`.",
        ],
        starterCode:
          "function fib_cached(n):\n    memo ← array of size (n + 1) filled with -1\n    return fib_memo(n, memo)\n\nfunction fib_memo(k, memo):\n    // TODO: base case, memo lookup, store and return",
        expectedOutput: "55\n102334155",
        hint: "Checking `memo[k] != -1` turns the second branch into an `O(1)` lookup instead of re-expanding a whole subtree.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function fib_cached(n):\n    memo ← array of size (n + 1) filled with -1\n    return fib_memo(n, memo)\n\nfunction fib_memo(k, memo):\n    if k <= 1:\n        return k\n    if memo[k] != -1:\n        return memo[k]\n    memo[k] ← fib_memo(k - 1, memo) + fib_memo(k - 2, memo)\n    return memo[k]",
      },
      {
        title: "Modular Exponentiation Under Large Modulus",
        tier: "Stretch",
        goal: "Compute `(base^exp) mod m` for `exp` up to `10^9` using `O(log exp)` recursion and intermediate `% m` reductions to prevent overflow.",
        constraints: ["1 <= base <= 10^9", "0 <= exp <= 10^9", "1 <= m <= 10^9", "Use 64-bit integer arithmetic"],
        examples: [
          { input: "base = 3, exp = 1000000000, m = 1000", output: "1", explanation: "3^4 = 81, ..., 3^(10^9) ends in 001 mod 1000." },
          { input: "base = 2, exp = 10, m = 100", output: "24" },
        ],
        tasks: [
          "Return `1 mod m` in the base case `exp == 0` (handles `m = 1` returning `0`).",
          "Compute `half = mod_pow(base, floor(exp / 2), m)`, square `(half * half) mod m`, and for odd `exp` multiply by `(base mod m)` then take `mod m` again.",
        ],
        starterCode:
          "function mod_pow(base, exp, m):\n    // TODO: O(log exp) modular exponentiation without integer overflow",
        expectedOutput: "1\n24",
        hint: "Reduce intermediate products with `mod m` at every multiplication step so numbers never exceed `(m - 1)^2`. (Unlike M01's iterative loop which uses `O(1)` space, recursive `mod_pow` uses `O(log exp)` stack depth.)",
        complexity: { time: "O(log exp)", space: "O(log exp)" },
        solutionCode:
          "function mod_pow(base, exp, m):\n    if exp == 0:\n        return 1 mod m\n    half ← mod_pow(base, floor(exp / 2), m)\n    sq ← (half * half) mod m\n    if exp mod 2 == 0:\n        return sq\n    return (sq * (base mod m)) mod m",
      },
    ],
  },
};

export const dsaM10PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m10",
  title: "Module 10 Practice Set: Recursion & Call Stack",
  description:
    "Four mixed problems covering base case design, call stack depth vs loops, overlapping subproblem caching, and logarithmic halving recursion.",
  problems: [
    {
      id: "dsa-m10-p1",
      title: "Repeated Digital Root Reduction",
      patternHint: "Combine a digit-sum recursive helper with an outer base case checking n < 10 (Lesson 10-1).",
      lessonRefId: "dsa-recursion-base-case",
      goal: "Given a non-negative integer `n`, repeatedly sum its decimal digits until only a single digit (`< 10`) remains, and return that final digit.",
      constraints: ["0 <= n <= 10^9", "Implement recursively without loops or string conversion"],
      examples: [
        { input: "n = 9875", output: "2", explanation: "9+8+7+5 = 29 -> 2+9 = 11 -> 1+1 = 2." },
        { input: "n = 7", output: "7" },
      ],
      tasks: [
        "Write a recursive helper `sum_digits(x)` that returns the digit sum of `x`.",
        "Write `digital_root(n)`: if `n < 10` return `n`; otherwise return `digital_root(sum_digits(n))`.",
      ],
      starterCode:
        "function sum_digits(x):\n    // TODO: return sum of digits of x\n\nfunction digital_root(n):\n    // TODO: base case n < 10, else recurse on sum_digits(n)",
      expectedOutput: "2\n7",
      hint: "For any `n >= 10`, `sum_digits(n)` is strictly smaller than `n`, guaranteeing termination.",
      complexity: { time: "O(log10 n)", space: "O(log10 n)" },
      solutionCode:
        "function sum_digits(x):\n    if x < 10:\n        return x\n    return (x mod 10) + sum_digits(floor(x / 10))\n\nfunction digital_root(n):\n    if n < 10:\n        return n\n    return digital_root(sum_digits(n))",
    },
    {
      id: "dsa-m10-p2",
      title: "Verify Strictly Increasing Array Bounds",
      patternHint: "Compare adjacent elements recursively with index i, and compare its O(n) stack space with an O(1) loop (Lesson 10-2).",
      lessonRefId: "dsa-call-stack-frames",
      goal: "Given integer array `arr`, return `true` if every adjacent pair satisfies `arr[i] < arr[i + 1]`, and `false` otherwise.",
      constraints: ["0 <= len(arr) <= 500", "Return `true` for empty or 1-element arrays"],
      examples: [
        { input: "arr = [2, 5, 9, 14]", output: "true" },
        { input: "arr = [3, 7, 7, 10]", output: "false", explanation: "7 is not strictly less than 7." },
      ],
      tasks: [
        "Return `true` in the base case when `idx >= len(arr) - 1`.",
        "If `arr[idx] >= arr[idx + 1]`, return `false`; otherwise recurse on `idx + 1`.",
      ],
      starterCode:
        "function is_strictly_increasing(arr, idx):\n    // TODO: check adjacent pair and advance idx",
      expectedOutput: "true\nfalse",
      hint: "Using `idx >= len(arr) - 1` handles both `length == 0` (`0 >= -1`) and `length == 1` (`0 >= 0`) without going out of bounds.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "function is_strictly_increasing(arr, idx):\n    if idx >= len(arr) - 1:\n        return true\n    if arr[idx] >= arr[idx + 1]:\n        return false\n    return is_strictly_increasing(arr, idx + 1)",
    },
    {
      id: "dsa-m10-p3",
      title: "Climb Stairs with One or Two Steps",
      patternHint: "Notice ways(n) = ways(n-1) + ways(n-2) creates overlapping subproblems that need a memo array (Lesson 10-3).",
      lessonRefId: "dsa-recursion-trees",
      goal: "You are climbing a staircase of `n` steps and can take either `1` or `2` steps at a time. Return the total number of distinct ways to reach step `n`.",
      constraints: ["1 <= n <= 45", "Naive branching O(2^n) will time out at n = 45", "Target time: O(n)"],
      examples: [
        { input: "n = 4", output: "5", explanation: "1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2." },
        { input: "n = 40", output: "165580141" },
      ],
      tasks: [
        "Identify base cases `ways(1) = 1` and `ways(2) = 2` (or `ways(0) = 1, ways(1) = 1`).",
        "Cache computed results in `memo[0..n]` initialized to `-1` so each subproblem executes once.",
      ],
      starterCode:
        "function climb_stairs(n):\n    memo ← array of size (n + 1) filled with -1\n    return ways(n, memo)\n\nfunction ways(k, memo):\n    // TODO: base cases + memoized recurrence",
      expectedOutput: "5\n165580141",
      hint: "Before computing `ways(k - 1, memo) + ways(k - 2, memo)`, check `if memo[k] != -1: return memo[k]`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "function climb_stairs(n):\n    memo ← array of size (n + 1) filled with -1\n    return ways(n, memo)\n\nfunction ways(k, memo):\n    if k <= 1:\n        return 1\n    if memo[k] != -1:\n        return memo[k]\n    memo[k] ← ways(k - 1, memo) + ways(k - 2, memo)\n    return memo[k]",
    },
    {
      id: "dsa-m10-p4",
      title: "Last Three Digits of Large Power",
      patternHint: "Compute base^exp mod 1000 with single-half O(log exp) recursion (Lesson 10-3).",
      lessonRefId: "dsa-recursion-trees",
      goal: "Given integers `base` and `exp`, compute `(base^exp) mod 1000` (the integer value of the last three decimal digits) efficiently for huge `exp`.",
      constraints: ["1 <= base <= 10^9", "0 <= exp <= 10^9", "Target: O(log exp) time and stack depth"],
      examples: [
        { input: "base = 7, exp = 10", output: "249", explanation: "7^10 = 282475249, mod 1000 is 249." },
        { input: "base = 2, exp = 1000000000", output: "376" },
      ],
      tasks: [
        "Return `1` for `exp == 0`.",
        "Store `half = last_three(base, floor(exp / 2))` once, square `(half * half) mod 1000`, and multiply by `(base mod 1000)` when `exp` is odd.",
      ],
      starterCode:
        "function last_three(base, exp):\n    // TODO: O(log exp) modular power mod 1000",
      expectedOutput: "249\n376",
      hint: "Take `mod 1000` after every multiplication so intermediate numbers stay under `1,000,000`.",
      complexity: { time: "O(log exp)", space: "O(log exp)" },
      solutionCode:
        "function last_three(base, exp):\n    if exp == 0:\n        return 1\n    half ← last_three(base, floor(exp / 2))\n    sq ← (half * half) mod 1000\n    if exp mod 2 == 0:\n        return sq\n    return (sq * (base mod 1000)) mod 1000",
    },
  ],
};
