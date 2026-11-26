import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM20Lessons: Record<string, LessonContent> = {
  "dsa-dp-intro": {
    lessonId: "dsa-dp-intro",
    subtitle:
      "Recognize Optimal Substructure and Overlapping Subproblems, eliminate exponential recursion from Module 10 with top-down memoization and bottom-up tabulation, and compress Climbing Stairs to O(1) space.",
    intro: {
      heading: "Dynamic Programming: Memoization & Tabulation",
      explanation: [
        "Plain recursive `ways(50)` solves the same subproblems billions of times (`ways(3)` gets recomputed from scratch under every higher branch) and hangs. Greedy local choices (`[1, 3, 4]` coins in Module 16) cannot fix overlapping branches either.",
        "**Dynamic Programming (DP)** rests on one rule: *cache each subproblem the first time you solve it, and reuse it on every later visit.* Any problem with **Optimal Substructure** and **Overlapping Subproblems** drops from `O(2^n)` trees to `O(n)` loops.",
      ],
      analogy:
        "Computing `ways(5)` without caching is like asking two clerks to count `ways(3)` from scratch separately instead of writing `ways(3) = 3` in a shared notebook the first time anyone finishes it.",
      realWorldUses: [
        "Counting valid path routes, step schedules, or request retry windows without repeating prefix work",
        "Scheduling interval weights or stamp/coin breakdowns when local greedy picks fail",
      ],
    },
    sections: [
      {
        heading: "Why Naive Recursion Repeats Work & How Caching Fixes It",
        paragraphs: [
          "In **Climbing Stairs** (`1` or `2` steps per move), step `0` has `1` empty path (`[]`), step `1` has `1` (`[1]`), step `2` has `2` (`[1, 1]`, `[2]`), and step `3` has `3`. Every path to `i` arrives from `i - 1` or `i - 2`, giving `ways(i) = ways(i - 1) + ways(i - 2)`.",
          "Without a cache, `ways(5)` makes `15` recursive calls—solving `ways(3)` twice and `ways(2)` three times. Writing each finished value to `memo` shrinks that tree to one computation per step.",
        ],
        table: {
          caption: "Inside naive climb(5): repeated calls vs cached DP",
          headers: ["Subproblem in climb(5)", "Calls without cache", "With memo / dp", "Example paths or base case"],
          rows: [
            ["`ways(5)` / `ways(4)`", "1 / 1", "1 / 1", "`ways(5) = ways(4) + ways(3) = 8`"],
            ["`ways(3)`", "2 times", "1", "Paths: `[1,1,1]`, `[1,2]`, `[2,1]`"],
            ["`ways(2)`", "3 times", "1", "Paths: `[1,1]`, `[2]`"],
            ["`ways(1)` / `ways(0)`", "5 / 3 times", "1 / 1", "`ways[0] = 1` (`[]`), `ways[1] = 1` (`[1]`)"],
          ],
          highlightCol: 1,
        },
        visual: {
          kind: "dsa-dp-grid",
          rowHeaders: ["ways[i-2]", "ways[i-1]", "ways[i]"],
          colHeaders: ["i=0", "i=1", "i=2", "i=3", "i=4", "i=5"],
          cells: [
            { r: 0, c: 2, value: "1", state: "source" },
            { r: 1, c: 2, value: "1", state: "source" },
            { r: 2, c: 0, value: "1", state: "default" },
            { r: 2, c: 1, value: "1", state: "default" },
            { r: 2, c: 2, value: "2", state: "default" },
            { r: 0, c: 3, value: "1", state: "source" },
            { r: 1, c: 3, value: "2", state: "source" },
            { r: 2, c: 3, value: "3", state: "default" },
            { r: 0, c: 4, value: "2", state: "source" },
            { r: 1, c: 4, value: "3", state: "source" },
            { r: 2, c: 4, value: "5", state: "active" },
            { r: 0, c: 5, value: "3", state: "source" },
            { r: 1, c: 5, value: "5", state: "source" },
            { r: 2, c: 5, value: "8", state: "optimal" },
          ],
          formulaNote: "1D strip ways[0..5] showing each value plus the two prior entries ways[i-2] and ways[i-1] above it.",
          caption: "1D array ways[0..5]: each column computes ways[i] = ways[i - 1] + ways[i - 2].",
        },
        microCheck: {
          prompt: "Why must Climbing Stairs initialize `ways[0] = 1` instead of `ways[0] = 0`?",
          code: "ways[0] ← ???\nways[1] ← 1\nways[2] ← ways[1] + ways[0]",
          options: [
            { id: "a", label: "Zero steps means zero ways, so ways[0] = 0 and ways[2] = 1" },
            { id: "b", label: "There is 1 empty path at step 0, so a 2-step jump from 0 to 2 yields ways[2] = 1 + 1 = 2" },
            { id: "c", label: "It prevents an off-by-one crash on negative indices" },
            { id: "d", label: "It turns top-down memoization into O(1) space" },
          ],
          correctId: "b",
          explanation: "Standing at step 0 counts as 1 valid empty path (taking zero moves). Setting ways[0] = 1 lets ways[2] = ways[1] + ways[0] = 1 + 1 = 2 count both [1, 1] and [2].",
        },
        callout: {
          kind: "KEY IDEA",
          text: "Memoization (top-down with a cache) and tabulation (bottom-up with a `for` loop) compute the exact same recurrence. Tabulation uses an iterative loop so deep recursion never overflows the call stack.",
        },
      },
      {
        heading: "From Naive O(2^n) Recursion to Memo Table and O(1) Rolling State",
        paragraphs: [
          "Compare all three code shapes side by side: `climb_naive` blows up in `O(2^n)`, `climb_memo` caches solved states in `O(n)`, and `climb_rolling` tracks only `prev2` and `prev1` to cut space to `O(1)`.",
        ],
        code: [
          "// 1) Naive recursion: O(2^n) time — repeats calls",
          "function climb_naive(i):",
          "    if i <= 1: return 1",
          "    return climb_naive(i - 1) + climb_naive(i - 2)",
          "",
          "// 2) Top-Down Memoization: O(n) time, O(n) space",
          "function climb_memo(i, memo):   // seed memo with -1, never 0",
          "    if i <= 1: return 1",
          "    if memo[i] != -1: return memo[i]",
          "    memo[i] ← climb_memo(i - 1, memo) + climb_memo(i - 2, memo)",
          "    return memo[i]",
          "",
          "// 3) Bottom-Up Rolling Variables: O(n) time, O(1) space",
          "function climb_rolling(n):",
          "    if n <= 1: return 1",
          "    prev2 ← 1, prev1 ← 1",
          "    for i from 2 to n:",
          "        curr ← prev1 + prev2",
          "        prev2 ← prev1; prev1 ← curr",
          "    return prev1",
          "",
          "// Trace: climb_naive(5) vs blocked-step memo=[0] sentinel bug",
          "// if blocked[i]: return 0   (if memo=[0] and check memo[i]!=0 -> cache miss!)",
        ],
        codeLabel: "Pseudocode",
        output: "climb_naive(5) = 8 (15 calls) | climb_memo(5) = 8 (6 cached states) | memo=[0] on 0-way state: recomputes every time",
        predictOutput: {
          prompt: "How many total calls does `climb_naive(5)` trigger, and what fails if a blocked-stair variant uses `memo = [0]` with `if memo[i] != 0`?",
          revealLabel: "Reveal call counts & sentinel bug",
          why: "Without caching, climb_naive(5) makes 15 calls (1 + 9 + 5, evaluating climb(2) three times). And if a subproblem legitimately returns 0 (for example, all paths through step i are blocked), checking `memo[i] != 0` mistakes that cached 0 for 'unvisited' and recomputes the entire subtree again.",
        },
        visual: {
          kind: "param-lab",
          variant: "dp-stairs",
          caption: "Slide n from 3 to 9 and switch strategies to compare naive call explosion, -1 memo caching, and O(1) rolling state.",
        },
        deepDive: [
          {
            label: "Deep Dive: Top-down recursion stack vs bottom-up topological order",
            paragraphs: [
              "Memoization and tabulation traverse the exact same DP dependency graph, just in different execution styles:",
              "Top-down memoization starts at `n` and recurses downward lazily—useful when many states are unreachable, though deep chains like `n = 100,000` push `100,000` call-stack frames and overflow.",
              "Bottom-up tabulation loops in **topological order** (`i = 2..n` so dependencies `i - 1` and `i - 2` are already solved), keeping call-stack depth `O(1)` and enabling `prev2, prev1` space compression.",
            ],
            bullets: [
              "Use **top-down memo** when the state space is sparse and recursion depth stays small (`n <= 1,000`).",
              "Use **bottom-up tabulation** when every subproblem is needed, `n` is large, or you want `O(1)` / `O(row)` rolling memory.",
            ],
          },
        ],
        callout: {
          kind: "WATCH OUT",
          text: "Initialize a top-down `memo` table with a sentinel like `-1` (never `0`) whenever `0` is a valid subproblem answer. Checking `if memo[i] != 0` would endlessly recompute any subproblem whose true answer is `0`.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Climbing Stairs in 4 Stages: Naive Recursion to O(1) Space",
      steps: [
        {
          label: "Step 1: Naive recursion (`O(2^n)`)",
          explanation: "Direct translation of `ways(n) = ways(n - 1) + ways(n - 2)` computes overlapping subproblems repeatedly.",
          code: [
            "function climb(i):",
            "    if i <= 1: return 1",
            "    return climb(i - 1) + climb(i - 2)",
          ],
          activeLines: [3],
          output: "climb(5) = 8 (15 calls; climb(45) hangs)",
        },
        {
          label: "Step 2: Add top-down `memo` (`O(n)` time, `O(n)` space)",
          explanation: "Cache each solved `memo[i]` once using `-1` for unsolved slots.",
          code: [
            "function climb_memo(i, memo):",
            "    if i <= 1: return 1",
            "    if memo[i] != -1: return memo[i]",
            "    memo[i] ← climb_memo(i - 1, memo) + climb_memo(i - 2, memo)",
            "    return memo[i]",
          ],
          activeLines: [3, 4],
          output: "climb_memo(5, memo) = 8 (only 6 subproblems computed)",
        },
        {
          label: "Step 3: Bottom-up `dp[]` table (zero recursion)",
          explanation: "Fill `dp[0..n]` iteratively from `2` up to `n` so call stack stays `O(1)`.",
          code: [
            "dp[0] ← 1; dp[1] ← 1",
            "for i from 2 to n:",
            "    dp[i] ← dp[i - 1] + dp[i - 2]",
            "return dp[n]",
          ],
          activeLines: [2, 3],
          output: "dp = [1, 1, 2, 3, 5, 8]",
        },
        {
          label: "Step 4: Rolling `prev2, prev1` (`O(1)` space)",
          explanation: "Keep only the two prior entries instead of allocating an array of length `n + 1`.",
          code: [
            "prev2 ← 1; prev1 ← 1",
            "for i from 2 to n:",
            "    curr ← prev1 + prev2",
            "    prev2 ← prev1; prev1 ← curr",
            "return prev1",
          ],
          activeLines: [3, 4],
          output: "climb_rolling(5) = 8 using 3 variables",
        },
      ],
    },
    walkthrough: {
      title: "Trace Memoization Cache, Bottom-Up Table, and O(1) Rolling State for n = 5",
      layout: "visual-first",
      steps: [
        {
          title: "Top-down memoization caches ways(3) on first visit",
          tag: "CONCEPT",
          explanation: [
            "Left-branch calls compute `ways(0) = 1`, `ways(1) = 1`, `ways(2) = 2`, and `ways(3) = 3`, saving each result into `memo[0..3]`.",
            "When `ways(5)` later needs `ways(3)` from its right branch, `memo[3] != -1` hits immediately in `O(1)` instead of re-expanding `ways(2)` and `ways(1)`.",
          ],
          code: [
            "function climb_memo(i, memo):",
            "    if i <= 1: return 1",
            "    if memo[i] != -1: return memo[i]",
            "    memo[i] ← climb_memo(i - 1, memo) + climb_memo(i - 2, memo)",
            "    return memo[i]",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "def climb_memo(i, memo):",
              "    if i <= 1: return 1",
              "    if memo[i] != -1: return memo[i]",
              "    memo[i] = climb_memo(i - 1, memo) + climb_memo(i - 2, memo)",
              "    return memo[i]",
            ],
          },
          state: [
            { name: "Active query", value: "ways(3) from ways(5)", changed: true },
            { name: "Cache hit", value: "memo[3] = 3", changed: true },
            { name: "Unfilled slots", value: "memo[4], memo[5] = -1" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Top-down memo[0..5] during climb_memo(5)",
                cells: [
                  { id: "cs0", value: "1", index: 0, state: "done" },
                  { id: "cs1", value: "1", index: 1, state: "done" },
                  { id: "cs2", value: "2", index: 2, state: "done" },
                  { id: "cs3", value: "3", index: 3, state: "active" },
                  { id: "cs4", value: "-1", index: 4, state: "dim" },
                  { id: "cs5", value: "-1", index: 5, state: "dim" },
                ],
                pointers: [
                  { index: 3, label: "cache hit", tone: "ok" },
                  { index: 4, label: "pending", tone: "coral" },
                ],
              },
            ],
            caption: "Each subproblem index is computed once and reused on every later lookup.",
          },
        },
        {
          title: "Bottom-up tabulation seeds base cases dp[0] and dp[1]",
          tag: "MEMORY",
          explanation: [
            "Instead of recursing downward, bottom-up tabulation allocates `dp[0..5]` and fills base states `dp[0] = 1` and `dp[1] = 1` directly.",
            "Every cell `dp[i]` for `i >= 2` only depends on indices strictly to its left (`i - 1` and `i - 2`), so scanning left to right guarantees dependencies are ready.",
          ],
          code: [
            "dp ← array of size n + 1",
            "dp[0] ← 1",
            "dp[1] ← 1",
            "for i from 2 to n:",
            "    dp[i] ← dp[i - 1] + dp[i - 2]",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "dp[0]", value: "1", changed: true },
            { name: "dp[1]", value: "1", changed: true },
            { name: "Next index i", value: "2" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Bottom-up table dp[0..5] after base seeding",
                cells: [
                  { id: "cs0", value: "1", index: 0, state: "done" },
                  { id: "cs1", value: "1", index: 1, state: "done" },
                  { id: "cs2", value: "?", index: 2 },
                  { id: "cs3", value: "?", index: 3 },
                  { id: "cs4", value: "?", index: 4 },
                  { id: "cs5", value: "?", index: 5 },
                ],
                pointers: [
                  { index: 0, label: "base", tone: "ok" },
                  { index: 1, label: "base", tone: "ok" },
                ],
              },
            ],
            caption: "Seeding dp[0] = 1 and dp[1] = 1 anchors every larger step.",
          },
        },
        {
          title: "Start bottom-up table dependencies for i = 0..2",
          tag: "PATTERN",
          explanation: [
            "Visualize early steps `i = 0..2` first: base steps `dp[0] = 1` and `dp[1] = 1` feed into `dp[2] = ways[1] + ways[0] = 2`.",
            "Each cell `i >= 2` adds the two entries immediately behind it (`dp[i - 2]` and `dp[i - 1]`).",
          ],
          code: [
            "dp[0] ← 1, dp[1] ← 1",
            "for i from 2 to n:",
            "    dp[i] ← dp[i - 1] + dp[i - 2]",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "dp[0..1]", value: "[1, 1]" },
            { name: "dp[2]", value: "1 + 1 = 2", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Bottom-up table dp[0..5] at early step i = 2",
                cells: [
                  { id: "cd0", value: "1", index: 0, state: "done" },
                  { id: "cd1", value: "1", index: 1, state: "done" },
                  { id: "cd2", value: "2", index: 2, state: "active" },
                  { id: "cd3", value: "?", index: 3, state: "dim" },
                  { id: "cd4", value: "?", index: 4, state: "dim" },
                  { id: "cd5", value: "?", index: 5, state: "dim" },
                ],
                highlightRange: [0, 2],
                pointers: [
                  { index: 0, label: "i-2=1", tone: "accent" },
                  { index: 1, label: "i-1=1", tone: "accent" },
                  { index: 2, label: "dp[2]=2", tone: "ok" },
                ],
              },
            ],
            caption: "Base cases dp[0]=1 and dp[1]=1 combine to fill dp[2]=2 before stepping to 3..5.",
          },
        },
        {
          title: "Next iteration fills dp[3] from dp[1] and dp[2]",
          tag: "TRACE",
          explanation: [
            "At `i = 3`, `dp[3] = dp[2] + dp[1] = 2 + 1 = 3` (paths: `[1,1,1]`, `[2,1]`, `[1,2]`).",
            "Notice only the two cells behind `i` (`dp[1]` and `dp[2]`) are needed.",
          ],
          code: [
            "dp ← array of size n + 1",
            "dp[0] ← 1",
            "dp[1] ← 1",
            "for i from 2 to n:",
            "    dp[i] ← dp[i - 1] + dp[i - 2]",
          ],
          activeLines: [4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "3", changed: true },
            { name: "dp[2]", value: "2" },
            { name: "dp[3]", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Tabulating i = 3 from dp[1] and dp[2]",
                cells: [
                  { id: "cs0", value: "1", index: 0, state: "dim" },
                  { id: "cs1", value: "1", index: 1, state: "pivot" },
                  { id: "cs2", value: "2", index: 2, state: "pivot" },
                  { id: "cs3", value: "3", index: 3, state: "active" },
                  { id: "cs4", value: "?", index: 4 },
                  { id: "cs5", value: "?", index: 5 },
                ],
                highlightRange: [1, 2],
                pointers: [
                  { index: 1, label: "i-2", tone: "accent" },
                  { index: 2, label: "i-1", tone: "accent" },
                  { index: 3, label: "i=3", tone: "coral" },
                ],
              },
            ],
            caption: "Each step reads only the two adjacent entries immediately behind i.",
          },
        },
        {
          title: "Complete tabulation up to dp[5] = 8",
          tag: "PATTERN",
          explanation: [
            "Continuing the loop across `i = 3..5` fills `dp[3] = 3`, `dp[4] = dp[3] + dp[2] = 5`, and `dp[5] = dp[4] + dp[3] = 8`.",
            "Every cell was written exactly once in a single linear pass with zero recursion.",
          ],
          code: [
            "for i from 2 to n:",
            "    dp[i] ← dp[i - 1] + dp[i - 2]",
            "return dp[n]",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "dp[4]", value: "5", changed: true },
            { name: "dp[5]", value: "8", changed: true },
            { name: "Total work", value: "4 additions" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Completed tabulation dp[0..5]",
                cells: [
                  { id: "cf0", value: "1", index: 0, state: "done" },
                  { id: "cf1", value: "1", index: 1, state: "done" },
                  { id: "cf2", value: "2", index: 2, state: "done" },
                  { id: "cf3", value: "3", index: 3, state: "pivot" },
                  { id: "cf4", value: "5", index: 4, state: "pivot" },
                  { id: "cf5", value: "8", index: 5, state: "active" },
                ],
                pointers: [
                  { index: 3, label: "i-2=3", tone: "accent" },
                  { index: 4, label: "i-1=5", tone: "accent" },
                  { index: 5, label: "ans=8", tone: "ok" },
                ],
              },
            ],
            caption: "Full iterative pass computes dp[5] = dp[4] + dp[3] = 8 in O(n) time.",
          },
        },
        {
          title: "Compress the table into two rolling variables (O(1) space)",
          tag: "CHECK",
          explanation: [
            "Notice `dp[0..2]` are never needed again once `dp[4]` starts. Storing only `prev2` and `prev1` reduces memory from `O(n)` down to two integer variables.",
            "At `i = 5`, `curr = 5 + 3 = 8`, then `prev2` becomes `5` and `prev1` becomes `8`. Returning `prev1` yields `8`.",
          ],
          code: [
            "prev2 ← 1, prev1 ← 1",
            "for i from 2 to n:",
            "    curr ← prev1 + prev2",
            "    prev2 ← prev1",
            "    prev1 ← curr",
            "return prev1",
          ],
          activeLines: [3, 4, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "prev2 (old ways[3])", value: "3 -> 5", changed: true },
            { name: "prev1 (ways[5])", value: "5 -> 8", changed: true },
            { name: "Extra space", value: "O(1)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "O(1) rolling window at final step i = 5",
                cells: [
                  { id: "r_prev2", value: "5", index: 0, state: "done" },
                  { id: "r_prev1", value: "8", index: 1, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "prev2", tone: "accent" },
                  { index: 1, label: "prev1 (ans)", tone: "ok" },
                ],
              },
            ],
            caption: "Only the two latest states live in memory at any point.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using 0 as the uncached sentinel in memoization",
        detail:
          "If a valid subproblem can return `0` (such as zero paths through a blocked node or zero profit), checking `if memo[i] != 0` misses cached zeros and causes repeated work. Use `-1` or an explicit `has_key` check in a hash map.",
      },
      {
        title: "Setting ways[0] = 0 instead of 1 in Climbing Stairs",
        detail:
          "Standing at step `0` counts as `1` valid empty path so `ways[2] = ways[1] + ways[0] = 1 + 1 = 2` (`[1,1]` and `[2]`). Setting `ways[0] = 0` drops `[2]` and shifts every answer down.",
      },
      {
        title: "Ignoring call-stack limits on large n with top-down DP",
        detail:
          "Even though top-down memoization runs in `O(n)` time, `n = 100,000` still pushes `100,000` recursive frames before returning. Switch to bottom-up iteration when `n` exceeds a few thousand.",
      },
    ],
    predictChecks: [
      {
        prompt: "In naive recursion `climb_naive(5)` (without memoization), how many times is `climb_naive(2)` evaluated?",
        code: "function climb_naive(i):\n    if i <= 1: return 1\n    return climb_naive(i - 1) + climb_naive(i - 2)\n\nclimb_naive(5)",
        options: [
          { id: "a", label: "1 time" },
          { id: "b", label: "2 times" },
          { id: "c", label: "3 times" },
          { id: "d", label: "5 times" },
        ],
        correctId: "c",
        explanation: "climb(5) splits into climb(4) + climb(3). climb(4) splits into climb(3) + climb(2) (1st), and each of the two climb(3) calls invokes climb(2) (2nd and 3rd)—3 total evaluations of climb(2).",
      },
      {
        prompt: "Suppose step 2 is broken (`blocked[2] = true`), so `ways(2)` legitimately equals `0`. What happens when `memo` is initialized to `0` instead of `-1`?",
        code: "memo ← [0, 0, 0, 0, 0, 0]\nfunction ways(i):\n    if i <= 1: return 1\n    if blocked[i]: return 0\n    if memo[i] != 0: return memo[i]\n    memo[i] ← ways(i - 1) + ways(i - 2)\n    return memo[i]",
        options: [
          { id: "a", label: "The answer becomes negative because 0 is falsy" },
          { id: "b", label: "memo[2] stays 0, so `memo[2] != 0` fails and every caller recomputes ways(2) from scratch" },
          { id: "c", label: "It throws an out-of-bounds error at memo[0]" },
          { id: "d", label: "It returns 1 instead of 0 for ways(2)" },
        ],
        correctId: "b",
        explanation: "When `0` is both the uncached sentinel and a valid subproblem result, `memo[i] != 0` cannot distinguish 'unsolved' from 'solved with 0 ways', causing repeated recomputation on zero-way states.",
      },
    ],
    practiceTask: {
      title: "Climbing Stairs Way Counter",
      tier: "Warmup",
      goal: "Given `n` steps where each move climbs `1` or `2` steps, return the total number of distinct ways to reach step `n` using `O(1)` extra space.",
      constraints: ["0 <= n <= 45", "Target: O(n) time, O(1) space"],
      examples: [
        { input: "n = 2", output: "2", explanation: "1+1 or 2." },
        { input: "n = 5", output: "8" },
      ],
      tasks: [
        "Handle `n <= 1` by returning `1`.",
        "Maintain `prev2 = 1` and `prev1 = 1` and advance `curr = prev1 + prev2` from `2` to `n`.",
      ],
      starterCode: "function climb_stairs(n):\n    // TODO: return distinct ways in O(n) time and O(1) space",
      expectedOutput: "2\n8",
      hint: "Update `prev2` to `prev1` before overwriting `prev1` with `curr`.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function climb_stairs(n):\n    if n <= 1:\n        return 1\n    prev2 ← 1\n    prev1 ← 1\n    for i from 2 to n:\n        curr ← prev1 + prev2\n        prev2 ← prev1\n        prev1 ← curr\n    return prev1",
    },
    practiceChallenges: [
      {
        title: "Climbing Stairs Way Counter",
        tier: "Warmup",
        goal: "Return the number of distinct `1`-or-`2` step sequences to reach step `n` in `O(1)` space.",
        constraints: ["0 <= n <= 45", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "n = 2", output: "2" },
          { input: "n = 5", output: "8" },
        ],
        tasks: ["Use rolling variables `prev2` and `prev1` starting from `1`."],
        starterCode: "function climb_stairs(n):\n    // TODO: rolling two-variable DP",
        expectedOutput: "2\n8",
        hint: "Each step `i` is reachable from `i - 1` or `i - 2`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function climb_stairs(n):\n    if n <= 1:\n        return 1\n    prev2 ← 1\n    prev1 ← 1\n    for i from 2 to n:\n        curr ← prev1 + prev2\n        prev2 ← prev1\n        prev1 ← curr\n    return prev1",
      },
      {
        title: "Minimum Cost Climbing Stairs",
        tier: "Core",
        goal: "Given `cost[i]` to climb from step `i` (`1` or `2` steps forward), you may start at step `0` or `1`. Return the minimum total cost to reach past the top (`index n`).",
        constraints: ["2 <= len(cost) <= 1000", "0 <= cost[i] <= 999", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "cost = [10, 15, 20]", output: "15", explanation: "Start at index 1 and pay 15 to reach index 3." },
          { input: "cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]", output: "6" },
        ],
        tasks: [
          "Define `dp[i]` as the minimum cost to reach step `i` before paying `cost[i]` (`dp[0] = 0, dp[1] = 0`).",
          "Transition `dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])` using rolling variables.",
        ],
        starterCode: "function min_cost_stairs(cost):\n    // TODO: reach index len(cost) with minimum toll",
        expectedOutput: "15\n6",
        hint: "Because you can start at index 0 or 1 for free, `prev2 = 0` and `prev1 = 0`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function min_cost_stairs(cost):\n    prev2 ← 0\n    prev1 ← 0\n    for i from 2 to len(cost):\n        curr ← min(prev1 + cost[i - 1], prev2 + cost[i - 2])\n        prev2 ← prev1\n        prev1 ← curr\n    return prev1",
      },
      {
        title: "Tribonacci Sequence With Rolling State",
        tier: "Stretch",
        goal: "Given `T(0) = 0`, `T(1) = 1`, `T(2) = 1`, and `T(n) = T(n - 1) + T(n - 2) + T(n - 3)` for `n >= 3`, return `T(n)` in `O(1)` extra space.",
        constraints: ["0 <= n <= 37", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "n = 4", output: "4", explanation: "T(3) = 2, T(4) = 1 + 1 + 2 = 4." },
          { input: "n = 25", output: "1389537" },
        ],
        tasks: [
          "Return `0` for `n == 0` and `1` for `n == 1` or `n == 2`.",
          "Shift three rolling variables `(a, b, c) -> (b, c, a + b + c)` for `i` from `3` to `n`.",
        ],
        starterCode: "function tribonacci(n):\n    // TODO: three-variable rolling state",
        expectedOutput: "4\n1389537",
        hint: "Store `next_val = a + b + c` before shifting `a ← b`, `b ← c`, `c ← next_val`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function tribonacci(n):\n    if n == 0:\n        return 0\n    if n <= 2:\n        return 1\n    a ← 0\n    b ← 1\n    c ← 1\n    for i from 3 to n:\n        next_val ← a + b + c\n        a ← b\n        b ← c\n        c ← next_val\n    return c",
      },
    ],
  },

  "dsa-dp-1d": {
    lessonId: "dsa-dp-1d",
    subtitle:
      "Define 1D DP states across three patterns: House Robber, Coin Change minimum coins, and Longest Increasing Subsequence (both O(n^2) DP and O(n log n) patience-sorting Binary Search).",
    intro: {
      heading: "1D DP Transitions: House Robber, Coin Change & LIS",
      explanation: [
        "Picking the largest coin first fails on `coins = [1, 3, 4]` for `amount = 6`: greedy grabs `4 + 1 + 1` (3 coins), missing `3 + 3` (2 coins). House Robber breaks the same way on `[2, 7, 9, 3, 1]` when grabbing `7` blocks `2` and `9`, giving `7 + 3 = 10` instead of `2 + 9 + 1 = 12`.",
        "Every 1D DP replaces local guessing with an exact table meaning for `dp[i]`: **best on prefix `0..i`** (House Robber), **fewest coins for target amount `a`** (Coin Change), or **longest increasing subsequence ending at `i`** (LIS). Pairing LIS with Module 09 Binary Search cuts runtime from `O(n^2)` to `O(n log n)`.",
      ],
      analogy:
        "House Robber chooses at each house whether to skip it or loot it plus the house two doors back; Coin Change tests every coin stamp to reach amount `a` in fewest steps; LIS sorts cards onto the leftmost valid patience-sorting pile using binary search.",
      realWorldUses: [
        "Scheduling non-overlapping reward tasks on a timeline where adjacent jobs conflict",
        "Minimizing coin bills, packet sizes, or fixed resource allocations to hit an exact quota",
      ],
    },
    sections: [
      {
        heading: "Three 1D State Definitions: Prefix vs Target vs Ending-At",
        paragraphs: [
          "In **House Robber**, adjacent indices cannot both be chosen. Define `dp[i]` as the maximum money robbed from houses `0..i`. At house `i`, either skip `i` (`dp[i - 1]`) or rob `i` and add the best from `0..i - 2` (`dp[i - 2] + nums[i]`). That gives `dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])`, which compresses to two rolling variables `prev2` and `prev1`.",
          "In **Coin Change**, `dp[a]` stores the fewest coins summing to `a` (`dp[0] = 0`, all others `amount + 1`). For `coins = [1, 3, 4]` and `amount = 6`, filling `a = 1..6` produces `dp = [0, 1, 2, 1, 1, 2, 2]`: at `a = 3`, coin `3` gives `1 + dp[0] = 1`; at `a = 6`, testing `1, 3, 4` compares `1 + dp[5] = 3`, `1 + dp[3] = 2`, and `1 + dp[2] = 3`, beating greedy `4 + 1 + 1 = 3`.",
        ],
        table: {
          caption: "Comparing the three core 1D DP patterns",
          headers: ["Problem", "Meaning of dp[i]", "Recurrence", "Time & Space"],
          rows: [
            [
              "House Robber (`prefix 0..i`)",
              "Max loot from prefix `0..i`",
              "`max(dp[i-1], dp[i-2] + nums[i])`",
              "`O(n)` time, `O(1)` rolling",
            ],
            [
              "Coin Change (`target amount i`)",
              "Min coins summing to `i`",
              "Try each coin `c <= i`: `min(1 + dp[i - c])`",
              "`O(amount * coins)` time, `O(amount)` space",
            ],
            [
              "LIS Quadratic (`ending at i`)",
              "Longest increasing ending **at** `i`",
              "Try each `j < i` with `nums[j] < nums[i]`: `1 + dp[j]`",
              "`O(n^2)` time, `O(n)` space",
            ],
            [
              "LIS Binary Search (`tails`)",
              "`tails[k]` = smallest tail of length `k + 1`",
              "Binary search first `tails[idx] >= x`",
              "`O(n log n)` time, `O(n)` space",
            ],
          ],
          highlightCol: 2,
        },
        visual: {
          kind: "dsa-dp-grid",
          rowHeaders: ["1 + dp[a-1]", "1 + dp[a-3]", "1 + dp[a-4]", "best dp[a]"],
          colHeaders: ["a=0", "a=1", "a=2", "a=3", "a=4", "a=5", "a=6"],
          cells: [
            { r: 0, c: 1, value: "1", state: "default" },
            { r: 0, c: 2, value: "2", state: "default" },
            { r: 0, c: 3, value: "3", state: "default" },
            { r: 0, c: 4, value: "2", state: "default" },
            { r: 0, c: 5, value: "2", state: "default" },
            { r: 0, c: 6, value: "3", state: "dim" },
            { r: 1, c: 3, value: "1", state: "source" },
            { r: 1, c: 4, value: "2", state: "default" },
            { r: 1, c: 5, value: "3", state: "default" },
            { r: 1, c: 6, value: "2", state: "active" },
            { r: 2, c: 4, value: "1", state: "source" },
            { r: 2, c: 5, value: "2", state: "default" },
            { r: 2, c: 6, value: "3", state: "dim" },
            { r: 3, c: 0, value: "0", state: "default" },
            { r: 3, c: 1, value: "1", state: "default" },
            { r: 3, c: 2, value: "2", state: "default" },
            { r: 3, c: 3, value: "1", state: "source" },
            { r: 3, c: 4, value: "1", state: "default" },
            { r: 3, c: 5, value: "2", state: "default" },
            { r: 3, c: 6, value: "2", state: "optimal" },
          ],
          formulaNote: "dp[6] = min(1 + dp[5], 1 + dp[3], 1 + dp[2]) = min(3, 1 + 1, 3) = 2.",
          caption: "Coin Change dependency matrix for coins=[1,3,4], amount=6 showing why 3+3 beats greedy 4+1+1.",
        },
        callout: {
          kind: "KEY IDEA",
          text: "Write down the sentence `dp[i] = ...` in plain English before coding. Changing from \"best in prefix 0..i\" to \"best ending at i\" completely changes whether you return `dp[n - 1]` or `max(dp)`.",
        },
      },
      {
        heading: "Longest Increasing Subsequence: O(n^2) DP vs O(n log n) Tails Binary Search",
        paragraphs: [
          "In the `O(n^2)` LIS approach, every index `i` starts at `dp[i] = 1` and scans all earlier `j < i` with `nums[j] < nums[i]` to update `dp[i] = max(dp[i], 1 + dp[j])`. Because the longest subsequence might finish before the last array element, return `max(dp)`.",
          "To hit `O(n log n)`, maintain an array `tails` where `tails[k]` holds the **smallest possible ending value** of any strictly increasing subsequence of length `k + 1` seen so far. Because `tails` is always strictly sorted, for each new `x` you run Module 09 Binary Search (`lower_bound`: first index where `tails[idx] >= x`). If `idx == len(tails)`, append `x` (extending the longest subsequence by 1); otherwise overwrite `tails[idx] = x` to make future extensions easier.",
        ],
        code: [
          "// Broken on [1, 2, 5, 0]: returns dp[3] = 1 instead of max(dp) = 3",
          "// Broken on [2, 2]: upper_bound (tails[mid] <= x) counts [2, 2] as length 2",
          "",
          "// Working O(n log n) LIS length with lower_bound (tails[mid] < x):",
          "function lis_length(nums):",
          "    tails ← []",
          "    for each x in nums:",
          "        lo ← 0, hi ← len(tails)",
          "        while lo < hi:",
          "            mid ← lo + floor((hi - lo) / 2)",
          "            if tails[mid] < x: lo ← mid + 1",
          "            else: hi ← mid",
          "        if lo == len(tails): tails.append(x)",
          "        else: tails[lo] ← x",
          "    return len(tails)",
        ],
        codeLabel: "Pseudocode",
        callout: {
          kind: "WATCH OUT",
          text: "`tails` always equals the exact LIS **length**, but its elements are not necessarily a valid subsequence in original order after replacements. Never return `tails` directly as the subsequence itself.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Coin Change in 3 Stages: Sentinel Setup to Unreachable Guard",
      steps: [
        {
          label: "Step 1: Seed dp[0] = 0 with a safe sentinel (amount + 1)",
          explanation: "Use `amount + 1` instead of `INT_MAX` so evaluating `1 + dp[a - c]` never overflows.",
          code: [
            "inf ← amount + 1",
            "dp ← array of size (amount + 1) filled with inf",
            "dp[0] ← 0",
          ],
          activeLines: [1, 2, 3],
          output: "dp = [0, 7, 7, 7, 7, 7, 7] for amount = 6",
        },
        {
          label: "Step 2: Try every coin c <= a from a = 1 up to amount",
          explanation: "Each slot pulls from an already-solved smaller amount `a - c` instead of guessing the largest coin.",
          code: [
            "for a from 1 to amount:",
            "    for each c in coins:",
            "        if a >= c:",
            "            dp[a] ← min(dp[a], 1 + dp[a - c])",
          ],
          activeLines: [3, 4],
          output: "dp = [0, 1, 2, 1, 1, 2, 2] for coins = [1, 3, 4]",
        },
        {
          label: "Step 3: Guard unreachable targets by returning -1",
          explanation: "If no coin combination reaches `amount`, `dp[amount]` stays `amount + 1`, so convert it to `-1`.",
          code: [
            "if dp[amount] > amount:",
            "    return -1",
            "return dp[amount]",
          ],
          activeLines: [1, 2, 3],
          output: "coins=[1,3,4], amount=6 -> 2 | coins=[2], amount=3 -> -1",
        },
      ],
    },
    walkthrough: {
      title: "Trace House Robber, Coin Change vs Greedy, and O(n log n) LIS Tails",
      layout: "visual-first",
      steps: [
        {
          title: "House Robber: decide skip vs rob at index 2",
          tag: "CONCEPT",
          explanation: [
            "On `nums = [2, 7, 9, 3, 1]`, seed `dp[0] = 2` and `dp[1] = max(2, 7) = 7`.",
            "At `i = 2` (`nums[2] = 9`), skipping gives `dp[1] = 7`, while robbing adds `dp[0] + 9 = 2 + 9 = 11`. So `dp[2] = 11`.",
          ],
          code: [
            "dp[0] ← nums[0]",
            "dp[1] ← max(nums[0], nums[1])",
            "for i from 2 to len(nums) - 1:",
            "    dp[i] ← max(dp[i - 1], dp[i - 2] + nums[i])",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "2 (nums[2] = 9)", changed: true },
            { name: "skip vs rob", value: "max(7, 2 + 9) = 11", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Houses nums[0..4]",
                cells: [
                  { id: "hr_n0", value: "2", index: 0, state: "done" },
                  { id: "hr_n1", value: "7", index: 1, state: "dim" },
                  { id: "hr_n2", value: "9", index: 2, state: "active" },
                  { id: "hr_n3", value: "3", index: 3 },
                  { id: "hr_n4", value: "1", index: 4 },
                ],
                pointers: [{ index: 2, label: "i=2 (+9)", tone: "coral" }],
              },
              {
                label: "Prefix best dp[0..4]",
                cells: [
                  { id: "hr_d0", value: "2", index: 0, state: "pivot" },
                  { id: "hr_d1", value: "7", index: 1, state: "pivot" },
                  { id: "hr_d2", value: "11", index: 2, state: "active" },
                  { id: "hr_d3", value: "?", index: 3 },
                  { id: "hr_d4", value: "?", index: 4 },
                ],
                pointers: [
                  { index: 0, label: "dp[i-2]", tone: "accent" },
                  { index: 1, label: "dp[i-1]", tone: "accent" },
                ],
              },
            ],
            caption: "Robbing house 2 combines with dp[0] = 2 to beat dp[1] = 7.",
          },
        },
        {
          title: "House Robber: finish i = 3 and i = 4 to reach 12",
          tag: "TRACE",
          explanation: [
            "At `i = 3` (`nums[3] = 3`), `max(dp[2], dp[1] + 3) = max(11, 7 + 3) = 11` (skipping house 3 keeps `2 + 9`).",
            "At `i = 4` (`nums[4] = 1`), `max(dp[3], dp[2] + 1) = max(11, 11 + 1) = 12` (`2 + 9 + 1`).",
          ],
          code: [
            "for i from 2 to len(nums) - 1:",
            "    dp[i] ← max(dp[i - 1], dp[i - 2] + nums[i])",
            "return dp[len(nums) - 1]",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "dp[3]", value: "11 (skip 3)", changed: true },
            { name: "dp[4]", value: "12 (take 2 + 9 + 1)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Houses nums[0..4]",
                cells: [
                  { id: "hr_n0", value: "2", index: 0, state: "done" },
                  { id: "hr_n1", value: "7", index: 1, state: "dim" },
                  { id: "hr_n2", value: "9", index: 2, state: "done" },
                  { id: "hr_n3", value: "3", index: 3, state: "dim" },
                  { id: "hr_n4", value: "1", index: 4, state: "done" },
                ],
              },
              {
                label: "Completed prefix best dp[0..4]",
                cells: [
                  { id: "hr_d0", value: "2", index: 0, state: "done" },
                  { id: "hr_d1", value: "7", index: 1, state: "dim" },
                  { id: "hr_d2", value: "11", index: 2, state: "done" },
                  { id: "hr_d3", value: "11", index: 3, state: "dim" },
                  { id: "hr_d4", value: "12", index: 4, state: "active" },
                ],
                pointers: [{ index: 4, label: "answer=12", tone: "ok" }],
              },
            ],
            caption: "dp[4] = 12 beats greedy 7 + 3 = 10.",
          },
        },
        {
          title: "Coin Change: seed dp[0] = 0 and fill early amounts a = 1..3",
          tag: "TRACE",
          explanation: [
            "For `coins = [1, 3, 4]` and `amount = 6`, seed `dp[0] = 0` and compute `dp[1..3]` left to right.",
            "Using only coin `1` gives `dp[1] = 1` and `dp[2] = 2`, then at `a = 3`, coin `3` reaches `1 + dp[0] = 1`, beating `1 + dp[2] = 3`.",
          ],
          code: [
            "dp ← [amount + 1] * (amount + 1); dp[0] ← 0",
            "for a from 1 to amount:",
            "    for each c in coins:",
            "        if a >= c:",
            "            dp[a] ← min(dp[a], 1 + dp[a - c])",
          ],
          activeLines: [1, 2, 3, 4, 5],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "dp = [amount + 1] * (amount + 1); dp[0] = 0",
              "for a in range(1, amount + 1):",
              "    for c in coins:",
              "        if a >= c:",
              "            dp[a] = min(dp[a], 1 + dp[a - c])",
            ],
          },
          state: [
            { name: "dp[0..2]", value: "[0, 1, 2]", changed: true },
            { name: "dp[3] (coin 3)", value: "1 + dp[0] = 1", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "1D dp[0..6] at a = 3 (coins = [1, 3, 4])",
                cells: [
                  { id: "cc0", value: "0", index: 0, state: "done" },
                  { id: "cc1", value: "1", index: 1, state: "done" },
                  { id: "cc2", value: "2", index: 2, state: "done" },
                  { id: "cc3", value: "1", index: 3, state: "active" },
                  { id: "cc4", value: "?", index: 4, state: "dim" },
                  { id: "cc5", value: "?", index: 5, state: "dim" },
                  { id: "cc6", value: "?", index: 6, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "1+dp[0]=1", tone: "ok" },
                  { index: 3, label: "dp[3]=1", tone: "coral" },
                ],
              },
            ],
            caption: "At a = 3, coin 3 pulls from dp[0] = 0 to drop dp[3] from 3 down to 1 coin.",
          },
        },
        {
          title: "Coin Change: finish a = 4..6 and beat greedy on amount = 6",
          tag: "PITFALL",
          explanation: [
            "Greedy picks `4`, leaving `2`, then `1 + 1`, totaling `3` coins. Continuing DP across `a = 4..6` sets `dp[4] = 1` and `dp[5] = 2`.",
            "At `a = 6`, testing all three coins checks `1 + dp[5] = 3`, `1 + dp[3] = 2`, and `1 + dp[2] = 3`, finding optimal `dp[6] = 2` (`3 + 3`).",
          ],
          code: [
            "dp ← [amount + 1] * (amount + 1); dp[0] ← 0",
            "for a from 1 to amount:",
            "    for each c in coins:",
            "        if a >= c:",
            "            dp[a] ← min(dp[a], 1 + dp[a - c])",
          ],
          activeLines: [2, 3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Greedy answer", value: "4 + 1 + 1 = 3 coins" },
            { name: "DP at a = 6", value: "1 + dp[3] = 2 coins", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Completed 1D dp[0..6] for coins = [1, 3, 4]",
                cells: [
                  { id: "cd0", value: "0", index: 0, state: "done" },
                  { id: "cd1", value: "1", index: 1, state: "done" },
                  { id: "cd2", value: "2", index: 2, state: "dim" },
                  { id: "cd3", value: "1", index: 3, state: "pivot" },
                  { id: "cd4", value: "1", index: 4, state: "done" },
                  { id: "cd5", value: "2", index: 5, state: "dim" },
                  { id: "cd6", value: "2", index: 6, state: "active" },
                ],
                pointers: [
                  { index: 3, label: "1+dp[3]=2", tone: "ok" },
                  { index: 6, label: "ans=2", tone: "ok" },
                ],
              },
            ],
            caption: "Coin 3 reaches 1 + dp[3] = 2 coins at amount 6, beating greedy 4+1+1 = 3.",
          },
        },
        {
          title: "LIS O(n^2) DP: compute longest ending strictly at each i",
          tag: "PATTERN",
          explanation: [
            "On `nums = [3, 1, 5, 2, 6]`, start every `dp[i] = 1`. At `i = 2` (`5`), both `3` and `1` are smaller, so `dp[2] = 2`.",
            "At `i = 3` (`2`), only `1 < 2`, so `dp[3] = 1 + dp[1] = 2`. At `i = 4` (`6`), `max(dp[0..3]) + 1 = 3`.",
          ],
          code: [
            "dp ← [1] * n",
            "for i from 1 to n - 1:",
            "    for j from 0 to i - 1:",
            "        if nums[j] < nums[i]:",
            "            dp[i] ← max(dp[i], 1 + dp[j])",
            "return max(dp)",
          ],
          activeLines: [4, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "nums", value: "[3, 1, 5, 2, 6]" },
            { name: "dp", value: "[1, 1, 2, 2, 3]", changed: true },
            { name: "max(dp)", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input nums",
                cells: [
                  { id: "lis_n0", value: "3", index: 0, state: "dim" },
                  { id: "lis_n1", value: "1", index: 1, state: "done" },
                  { id: "lis_n2", value: "5", index: 2, state: "done" },
                  { id: "lis_n3", value: "2", index: 3, state: "pivot" },
                  { id: "lis_n4", value: "6", index: 4, state: "active" },
                ],
              },
              {
                label: "dp[i] = LIS ending at index i",
                cells: [
                  { id: "lis_d0", value: "1", index: 0 },
                  { id: "lis_d1", value: "1", index: 1 },
                  { id: "lis_d2", value: "2", index: 2 },
                  { id: "lis_d3", value: "2", index: 3 },
                  { id: "lis_d4", value: "3", index: 4, state: "active" },
                ],
                pointers: [{ index: 4, label: "max=3", tone: "ok" }],
              },
            ],
            caption: "Quadratic LIS checks every j < i and takes max(dp).",
          },
        },
        {
          title: "LIS O(n log n): binary search tails replacement",
          tag: "CHECK",
          explanation: [
            "Process `[3, 1, 5, 2, 6]` into `tails`: `3 -> [3]`; `1` replaces `3 -> [1]`; `5` appends `-> [1, 5]`; `2` binary-searches `lower_bound(2)` at index `1` and replaces `5 -> [1, 2]`.",
            "Finally `6 > 2` appends to `[1, 2, 6]`. Length `len(tails) = 3` matches `O(n^2)` DP in `O(n log n)` total time.",
          ],
          code: [
            "for each x in nums:",
            "    idx ← lower_bound(tails, x)",
            "    if idx == len(tails): tails.append(x)",
            "    else: tails[idx] ← x",
            "return len(tails)",
          ],
          activeLines: [2, 3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "After 2", value: "tails = [1, 2] (replaced 5)", changed: true },
            { name: "After 6", value: "tails = [1, 2, 6]", changed: true },
            { name: "LIS length", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Final sorted patience array tails[0..2]",
                cells: [
                  { id: "t0", value: "1", index: 0, state: "done" },
                  { id: "t1", value: "2", index: 1, state: "done" },
                  { id: "t2", value: "6", index: 2, state: "active" },
                ],
                pointers: [
                  { index: 1, label: "2 replaced 5", tone: "accent" },
                  { index: 2, label: "appended 6", tone: "ok" },
                ],
              },
            ],
            caption: "Replacing larger tails keeps future extensions open without changing length.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Overflowing INF in Coin Change",
        detail:
          "Initializing `dp` with `INT_MAX` and evaluating `1 + dp[a - c]` overflows signed integers into negative numbers. Initialize `dp` with `amount + 1` instead, since valid coin counts never exceed `amount`.",
      },
      {
        title: "Returning dp[n - 1] instead of max(dp) in LIS",
        detail:
          "Because `dp[i]` stores the longest increasing subsequence ending **at** index `i`, a small final element like `0` in `[1, 2, 5, 0]` has `dp[3] = 1` while the global answer is `dp[2] = 3`.",
      },
      {
        title: "Using upper_bound instead of lower_bound for strictly increasing LIS",
        detail:
          "Strictly increasing means duplicates (`[2, 2]`) cannot extend length. Using `tails[mid] < x` (`lower_bound`, first `>= x`) replaces `2` with `2` instead of appending a duplicate.",
      },
    ],
    predictChecks: [
      {
        prompt: "For nums = [1, 3, 5, 2], this O(n^2) LIS computes dp[i] = longest increasing subsequence ending at i. What does returning dp[3] produce?",
        code: "dp = [1, 1, 1, 1]\nfor i from 0 to 3:\n    for j from 0 to i - 1:\n        if nums[j] < nums[i]:\n            dp[i] = max(dp[i], dp[j] + 1)\nreturn dp[3]",
        options: [
          { id: "a", label: "2 instead of 3, because dp[3] only counts subsequences ending at 2" },
          { id: "b", label: "3, because dp[2] propagates into dp[3]" },
          { id: "c", label: "1, because 2 is smaller than 5" },
          { id: "d", label: "4, because all elements are positive" },
        ],
        correctId: "a",
        explanation: "dp[i] stores the longest increasing subsequence ending at index i. After [1, 3, 5] gives dp[2] = 3, the smaller value 2 can only follow 1, leaving dp[3] = 2; return max(dp).",
      },
      {
        prompt: "For nums = [2, 2, 3], this O(n log n) LIS uses tails[mid] <= x instead of tails[mid] < x. What is len(tails) at the end?",
        code: "tails = []\nfor x in [2, 2, 3]:\n    lo = 0; hi = len(tails)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if tails[mid] <= x: lo = mid + 1\n        else: hi = mid\n    if lo == len(tails): tails.append(x)\n    else: tails[lo] = x\nreturn len(tails)",
        options: [
          { id: "a", label: "2, because the second 2 overwrites tails[0]" },
          { id: "b", label: "1, because duplicates collapse the array" },
          { id: "c", label: "3 instead of 2, because tails[mid] <= x appends a duplicate 2" },
          { id: "d", label: "2, because 3 overwrites the second 2" },
        ],
        correctId: "c",
        explanation: "For strictly increasing LIS, a duplicate 2 must replace the existing 2 in tails. Using tails[mid] <= x advances lo past 2 and appends a second 2, producing [2, 2, 3] (length 3 instead of 2). Use tails[mid] < x.",
      },
    ],
    practiceTask: {
      title: "Max Non-Adjacent House Loot",
      tier: "Warmup",
      goal: "Given non-negative house values `nums`, return the maximum amount you can collect without taking two adjacent indices.",
      constraints: ["1 <= len(nums) <= 10^4", "0 <= nums[i] <= 400", "Target: O(n) time, O(1) space"],
      examples: [
        { input: "nums = [2, 7, 9, 3, 1]", output: "12", explanation: "2 + 9 + 1 = 12." },
        { input: "nums = [1, 2, 3, 1]", output: "4" },
      ],
      tasks: [
        "Maintain `prev2 = 0` and `prev1 = 0`.",
        "For each `val` in `nums`, set `curr = max(prev1, prev2 + val)`, then shift `prev2 = prev1`, `prev1 = curr`.",
      ],
      starterCode: "function rob_houses(nums):\n    // TODO: O(n) time, O(1) space non-adjacent max sum",
      expectedOutput: "12\n4",
      hint: "Initializing `prev2 = 0, prev1 = 0` handles `len(nums) == 1` inside one loop.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function rob_houses(nums):\n    prev2 ← 0\n    prev1 ← 0\n    for each val in nums:\n        curr ← max(prev1, prev2 + val)\n        prev2 ← prev1\n        prev1 ← curr\n    return prev1",
    },
    practiceChallenges: [
      {
        title: "Max Non-Adjacent House Loot",
        tier: "Warmup",
        goal: "Return the maximum sum of non-adjacent elements in `nums` using `O(1)` extra space.",
        constraints: ["1 <= len(nums) <= 10^4", "0 <= nums[i] <= 400", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [2, 7, 9, 3, 1]", output: "12" },
          { input: "nums = [1, 2, 3, 1]", output: "4" },
        ],
        tasks: ["Roll `prev2` and `prev1` across `nums`."],
        starterCode: "function rob_houses(nums):\n    // TODO: rolling 1D DP",
        expectedOutput: "12\n4",
        hint: "At each element, pick the larger of skipping (`prev1`) or taking (`prev2 + val`).",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function rob_houses(nums):\n    prev2 ← 0\n    prev1 ← 0\n    for each val in nums:\n        curr ← max(prev1, prev2 + val)\n        prev2 ← prev1\n        prev1 ← curr\n    return prev1",
      },
      {
        title: "Fewest Coins to Make Exact Amount",
        tier: "Core",
        goal: "Given coin denominations `coins` (unlimited supply) and `amount`, return the fewest coins needed to sum to `amount`, or `-1` if impossible.",
        constraints: ["1 <= len(coins) <= 12", "0 <= amount <= 10^4", "Target: O(amount * len(coins)) time"],
        examples: [
          { input: "coins = [1, 3, 4], amount = 6", output: "2", explanation: "3 + 3 = 6." },
          { input: "coins = [2], amount = 3", output: "-1" },
        ],
        tasks: [
          "Create `dp[0..amount]` filled with `amount + 1`, with `dp[0] = 0`.",
          "For `a` from `1` to `amount`, update `dp[a] = min(dp[a], 1 + dp[a - c])` for each `c <= a`.",
        ],
        starterCode: "function min_coins(coins, amount):\n    // TODO: bottom-up minimum coin count",
        expectedOutput: "2\n-1",
        hint: "Return `-1` at the end if `dp[amount] > amount`.",
        complexity: { time: "O(amount * len(coins))", space: "O(amount)" },
        solutionCode:
          "function min_coins(coins, amount):\n    inf ← amount + 1\n    dp ← array of size (amount + 1) filled with inf\n    dp[0] ← 0\n    for a from 1 to amount:\n        for each c in coins:\n            if a >= c:\n                dp[a] ← min(dp[a], 1 + dp[a - c])\n    if dp[amount] > amount:\n        return -1\n    return dp[amount]",
      },
      {
        title: "Longest Strictly Increasing Subsequence Length",
        tier: "Stretch",
        goal: "Return the length of the longest strictly increasing subsequence in `nums` in `O(n log n)` time.",
        constraints: ["1 <= len(nums) <= 10^5", "-10^4 <= nums[i] <= 10^4", "Target: O(n log n) time, O(n) space"],
        examples: [
          { input: "nums = [10, 9, 2, 5, 3, 7, 101, 18]", output: "4", explanation: "[2, 3, 7, 101]." },
          { input: "nums = [7, 7, 7, 7]", output: "1" },
        ],
        tasks: [
          "Maintain a sorted `tails` list where `tails[k]` is the minimum end value of an increasing subsequence of length `k + 1`.",
          "Binary search (`lower_bound`) for the first `tails[idx] >= x`; append if `idx == len(tails)`, else replace `tails[idx] = x`.",
        ],
        starterCode: "function lis_length(nums):\n    // TODO: O(n log n) patience-sorting binary search",
        expectedOutput: "4\n1",
        hint: "Use `<` in `if tails[mid] < x` so equal values overwrite rather than extend.",
        complexity: { time: "O(n log n)", space: "O(n)" },
        solutionCode:
          "function lis_length(nums):\n    tails ← []\n    for each x in nums:\n        lo ← 0\n        hi ← len(tails)\n        while lo < hi:\n            mid ← lo + floor((hi - lo) / 2)\n            if tails[mid] < x:\n                lo ← mid + 1\n            else:\n                hi ← mid\n        if lo == len(tails):\n            tails.append(x)\n        else:\n            tails[lo] ← x\n    return len(tails)",
      },
    ],
  },

  "dsa-dp-2d-grids": {
    lessonId: "dsa-dp-2d-grids",
    subtitle:
      "Extend Module 05 matrix indexing to 2D grid DP: solve Minimum Path Sum, Unique Paths with Obstacles, and Triangle Minimum Path, then compress O(R * C) tables into an O(C) single row.",
    intro: {
      heading: "2D Grid & Matrix Dynamic Programming",
      explanation: [
        "Running `grid[r][c] + min(dp[r - 1][c], dp[r][c - 1])` blindly across every cell crashes on row `0` (`dp[-1][c]` out of bounds) and column `0` (`dp[r][-1]`). Filling row `0` with all `1`s in Unique Paths also breaks on obstacles: when `(0, 1)` holds `1` (blocked), routes cannot jump past it to `(0, 2)`.",
        "Once row `0` and column `0` read only their single valid border neighbor and any `1`-blocked cell forces `dp[r][c] = 0`, every row depends strictly on row `r - 1` and earlier columns `c - 1`. Scanning columns left-to-right lets a single `O(C)` array overwrite the prior row in place instead of storing `O(R * C)` cells.",
      ],
      analogy:
        "Walking downhill on a tiled staircase where every step goes right or down means the cheapest route into tile `(r, c)` depends solely on the tile directly above it and the tile directly to its left.",
      realWorldUses: [
        "Routing robots or warehouse carts across grids with blocked aisles and weighted terrain",
        "Computing seam-carving energy paths across pixel columns in image resizing",
      ],
    },
    sections: [
      {
        heading: "Grid Transitions, Boundary Rows, and Obstacle Blocking",
        paragraphs: [
          "For **Minimum Path Sum**, `dp[r][c]` stores the cheapest total from `(0, 0)` to `(r, c)`. Row `0` has no top neighbor (`dp[0][c] = dp[0][c - 1] + grid[0][c]`) and column `0` has no left neighbor (`dp[r][0] = dp[r - 1][0] + grid[r][0]`). Every interior cell picks `grid[r][c] + min(dp[r - 1][c], dp[r][c - 1])`.",
          "For **Unique Paths with Obstacles** (`1` = blocked, `0` = open), any cell with `grid[r][c] == 1` has `dp[r][c] = 0`. In **Triangle Minimum Path**, row `r` moves down to `(r + 1, c)` or `(r + 1, c + 1)`; working **bottom-up** from row `R - 2` up to `0` uses `dp[c] = triangle[r][c] + min(dp[c], dp[c + 1])` with zero boundary special cases.",
        ],
        table: {
          caption: "2D grid & matrix DP patterns",
          headers: ["Problem", "State dp[r][c]", "Blocked / edge rule", "Compressed space"],
          rows: [
            [
              "Minimum Path Sum",
              "Min cost to reach `(r, c)`",
              "Row `0` from left only; col `0` from top only",
              "`O(C)` single row",
            ],
            [
              "Unique Paths II",
              "Valid route count to `(r, c)`",
              "If `grid[r][c] == 1`, `dp[r][c] = 0`",
              "`O(C)` single row",
            ],
            [
              "Triangle Min Path",
              "Min cost from `(r, c)` to bottom",
              "Seed `dp` with last row; loop `r` bottom-up",
              "`O(R)` single row",
            ],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "KEY IDEA",
          text: "On a grid with right/down moves only, row `r` depends solely on row `r - 1` and earlier columns `c - 1` of row `r`.",
        },
      },
      {
        heading: "Compressing an O(R * C) Table Down to an O(C) Single Row",
        paragraphs: [
          "Keep a single 1D array `dp[0..C - 1]` representing the active row. On `grid = [[1, 3, 1], [1, 5, 1], [4, 2, 1]]`, row `0` starts as `dp = [1, 4, 5]`. Scanning `c` left-to-right for row `1` updates `dp[0] = 1 + 1 = 2`, then at `c = 1`, `dp[1]` still holds `4` (above) while `dp[0]` holds `2` (left), giving `5 + min(4, 2) = 7` -> `[2, 7, 6]` -> row `2`: `[6, 8, 7]`.",
          "Compare working vs broken row compression: scanning right-to-left (`c` from `C - 1` down to `0`) breaks `min(dp[c], dp[c - 1])` because `dp[c - 1]` still holds old row `r - 1` instead of current row `r`. Left-to-right scan keeps `O(C)` space (`1,000` cells instead of `1,000,000` for a `1000 x 1000` grid).",
        ],
        code: [
          "// Broken on [[0, 1, 0]]: seeding row 0 with all 1s outputs 1 instead of 0",
          "// Working O(C) Minimum Path Sum (left-to-right c scan):",
          "function min_path_sum(grid):",
          "    R ← len(grid), C ← len(grid[0])",
          "    dp ← array of size C",
          "    dp[0] ← grid[0][0]",
          "    for c from 1 to C - 1:",
          "        dp[c] ← dp[c - 1] + grid[0][c]",
          "    for r from 1 to R - 1:",
          "        dp[0] ← dp[0] + grid[r][0]         // col 0 only comes from above",
          "        for c from 1 to C - 1:",
          "            dp[c] ← grid[r][c] + min(dp[c], dp[c - 1])",
          "    return dp[C - 1]",
        ],
        codeLabel: "Pseudocode",
        visual: {
          kind: "dsa-array",
          trays: [
            {
              label: "Single O(C) rolling row array after processing r = 1",
              cells: [
                { id: "sgr0", value: "2", index: 0, state: "done" },
                { id: "sgr1", value: "7", index: 1, state: "active" },
                { id: "sgr2", value: "6", index: 2, state: "active" },
              ],
              pointers: [
                { index: 0, label: "dp[c-1] left", tone: "accent" },
                { index: 1, label: "overwrote above=4", tone: "coral" },
              ],
            },
          ],
          caption: "Scanning c left-to-right lets one O(C) array replace an entire R x C table.",
        },
        callout: {
          kind: "WATCH OUT",
          text: "In Unique Paths with Obstacles, never initialize the entire first row to `1`! If `(0, 1)` is blocked (`1`), then `(0, 1)` and every column to its right on row `0` must be `0`.",
        },
      },
    ],
    guidedBuildUp: {
      title: "2D Grid DP in 3 Stages: Boundaries to O(C) Single-Row Compression",
      steps: [
        {
          label: "Step 1: Seed row 0 and col 0 without negative-index crashes",
          explanation: "Row `0` has no top neighbor and col `0` has no left neighbor, so fill borders first.",
          code: [
            "dp[0][0] ← grid[0][0]",
            "for c from 1 to C - 1: dp[0][c] ← dp[0][c - 1] + grid[0][c]",
            "for r from 1 to R - 1: dp[r][0] ← dp[r - 1][0] + grid[r][0]",
          ],
          activeLines: [2, 3],
          output: "Row 0: [1, 4, 5], Col 0: [1, 2, 6]",
        },
        {
          label: "Step 2: Fill interior cells from above and left",
          explanation: "Each interior `(r, c)` picks the cheaper of `dp[r - 1][c]` and `dp[r][c - 1]`.",
          code: [
            "for r from 1 to R - 1:",
            "    for c from 1 to C - 1:",
            "        dp[r][c] ← grid[r][c] + min(dp[r - 1][c], dp[r][c - 1])",
            "return dp[R - 1][C - 1]",
          ],
          activeLines: [3],
          output: "Row 1: [2, 7, 6], Row 2: [6, 8, 7] -> answer 7",
        },
        {
          label: "Step 3: Compress O(R * C) table to one O(C) array scanned left-to-right",
          explanation: "Before overwriting `dp[c]`, it holds row `r - 1` (above) while `dp[c - 1]` holds row `r` (left).",
          code: [
            "for r from 1 to R - 1:",
            "    dp[0] ← dp[0] + grid[r][0]",
            "    for c from 1 to C - 1:",
            "        dp[c] ← grid[r][c] + min(dp[c], dp[c - 1])",
          ],
          activeLines: [2, 4],
          output: "O(C) memory = 3 cells instead of 9",
        },
      ],
    },
    walkthrough: {
      title: "Trace 2D Grid DP, Obstacle Blocking, and O(C) Row Compression",
      layout: "visual-first",
      steps: [
        {
          title: "Seed top row and left column for Minimum Path Sum",
          tag: "CONCEPT",
          explanation: [
            "Consider `grid = [[1, 3, 1], [1, 5, 1], [4, 2, 1]]` (`3 x 3`).",
            "Top row cells can only enter from the left (`1 -> 4 -> 5`), and left column cells can only enter from above (`1 -> 2 -> 6`).",
          ],
          code: [
            "dp[0][0] ← grid[0][0]                     // 1",
            "for c from 1 to C - 1: dp[0][c] ← dp[0][c - 1] + grid[0][c]",
            "for r from 1 to R - 1: dp[r][0] ← dp[r - 1][0] + grid[r][0]",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "dp[0][0] = grid[0][0]",
              "for c in range(1, C): dp[0][c] = dp[0][c - 1] + grid[0][c]",
              "for r in range(1, R): dp[r][0] = dp[r - 1][0] + grid[r][0]",
            ],
          },
          state: [
            { name: "Row 0", value: "[1, 4, 5]", changed: true },
            { name: "Col 0", value: "[1, 2, 6]", changed: true },
          ],
          visual: {
            kind: "dsa-dp-grid",
            rowHeaders: ["r=0", "r=1", "r=2"],
            colHeaders: ["c=0", "c=1", "c=2"],
            cells: [
              { r: 0, c: 0, value: "1", state: "source" },
              { r: 0, c: 1, value: "4", state: "active" },
              { r: 0, c: 2, value: "5", state: "active" },
              { r: 1, c: 0, value: "2", state: "active" },
              { r: 2, c: 0, value: "6", state: "active" },
            ],
            formulaNote: "Boundary edges have only one incoming direction.",
            caption: "Minimum Path Sum table after filling row 0 and column 0.",
          },
        },
        {
          title: "Fill interior row r = 1 from top and left neighbors",
          tag: "TRACE",
          explanation: [
            "At `(1, 1)` (`grid = 5`), `5 + min(dp[0][1]=4, dp[1][0]=2) = 5 + 2 = 7`.",
            "At `(1, 2)` (`grid = 1`), `1 + min(dp[0][2]=5, dp[1][1]=7) = 1 + 5 = 6`.",
          ],
          code: [
            "for r from 1 to R - 1:",
            "    for c from 1 to C - 1:",
            "        dp[r][c] ← grid[r][c] + min(dp[r - 1][c], dp[r][c - 1])",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "dp[1][1]", value: "5 + min(4, 2) = 7", changed: true },
            { name: "dp[1][2]", value: "1 + min(5, 7) = 6", changed: true },
          ],
          visual: {
            kind: "dsa-dp-grid",
            rowHeaders: ["r=0", "r=1", "r=2"],
            colHeaders: ["c=0", "c=1", "c=2"],
            cells: [
              { r: 0, c: 0, value: "1", state: "default" },
              { r: 0, c: 1, value: "4", state: "source" },
              { r: 0, c: 2, value: "5", state: "source" },
              { r: 1, c: 0, value: "2", state: "source" },
              { r: 1, c: 1, value: "7", state: "active" },
              { r: 1, c: 2, value: "6", state: "active" },
              { r: 2, c: 0, value: "6", state: "default" },
            ],
            formulaNote: "`dp[1][2] = 1 + min(5, 7) = 6` pulls from top `(0, 2)`.",
            caption: "Row 1 finishes before row 2 begins.",
          },
        },
        {
          title: "Complete row r = 2 and trace optimal cost 7",
          tag: "CHECK",
          explanation: [
            "At `(2, 1)` (`grid = 2`), `2 + min(7, 6) = 8`. At `(2, 2)` (`grid = 1`), `1 + min(6, 8) = 7`.",
            "The minimum total path `(0,0) -> (0,1) -> (0,2) -> (1,2) -> (2,2)` costs `1 + 3 + 1 + 1 + 1 = 7`.",
          ],
          code: [
            "dp[2][1] ← 2 + min(dp[1][1], dp[2][0])   // 2 + 6 = 8",
            "dp[2][2] ← 1 + min(dp[1][2], dp[2][1])   // 1 + 6 = 7",
            "return dp[R - 1][C - 1]",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "dp[2][1]", value: "8", changed: true },
            { name: "dp[2][2]", value: "7", changed: true },
          ],
          visual: {
            kind: "dsa-dp-grid",
            rowHeaders: ["r=0", "r=1", "r=2"],
            colHeaders: ["c=0", "c=1", "c=2"],
            cells: [
              { r: 0, c: 0, value: "1", state: "optimal" },
              { r: 0, c: 1, value: "4", state: "optimal" },
              { r: 0, c: 2, value: "5", state: "optimal" },
              { r: 1, c: 0, value: "2", state: "dim" },
              { r: 1, c: 1, value: "7", state: "dim" },
              { r: 1, c: 2, value: "6", state: "optimal" },
              { r: 2, c: 0, value: "6", state: "dim" },
              { r: 2, c: 1, value: "8", state: "dim" },
              { r: 2, c: 2, value: "7", state: "optimal" },
            ],
            formulaNote: "Optimal path cost = `7` (`1 -> 3 -> 1 -> 1 -> 1`).",
            caption: "Highlighted cells trace the optimal route into (2, 2).",
          },
        },
        {
          title: "Unique Paths with Obstacles: seed borders and zero blocked (1, 1)",
          tag: "PITFALL",
          explanation: [
            "On `obstacleGrid = [[0, 0, 0], [0, 1, 0], [0, 0, 0]]`, top row `0` and left column `0` have `1` unobstructed path each.",
            "When the scan hits `(1, 1)` (`obstacleGrid[1][1] == 1`), it immediately sets `dp[1][1] = 0` so no route can pass through the center.",
          ],
          code: [
            "if obstacleGrid[r][c] == 1:",
            "    dp[r][c] ← 0",
            "else:",
            "    dp[r][c] ← dp[r - 1][c] + dp[r][c - 1]",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "Row 0 / Col 0", value: "all 1s (open)", changed: true },
            { name: "Blocked cell (1,1)", value: "0", changed: true },
          ],
          visual: {
            kind: "dsa-dp-grid",
            rowHeaders: ["r=0", "r=1", "r=2"],
            colHeaders: ["c=0", "c=1", "c=2"],
            cells: [
              { r: 0, c: 0, value: "1", state: "source" },
              { r: 0, c: 1, value: "1", state: "default" },
              { r: 0, c: 2, value: "1", state: "default" },
              { r: 1, c: 0, value: "1", state: "default" },
              { r: 1, c: 1, value: "X (0)", state: "active" },
              { r: 2, c: 0, value: "1", state: "default" },
            ],
            formulaNote: "Row 0 and col 0 initialize to `1`; blocked `(1, 1)` is forced to `0`.",
            caption: "Borders and center obstacle before filling remaining interior cells.",
          },
        },
        {
          title: "Unique Paths with Obstacles: route around (1, 1) to reach 2",
          tag: "TRACE",
          explanation: [
            "Remaining open cells add `dp[top] + dp[left]`: `(1, 2)` gets `1 + 0 = 1` and `(2, 1)` gets `0 + 1 = 1`.",
            "Combining those two open detours at `(2, 2)` yields `dp[2][2] = 1 + 1 = 2` valid routes around the center block.",
          ],
          code: [
            "if obstacleGrid[r][c] == 1:",
            "    dp[r][c] ← 0",
            "else:",
            "    dp[r][c] ← dp[r - 1][c] + dp[r][c - 1]",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Blocked cell (1,1)", value: "0", changed: true },
            { name: "Paths to (2,2)", value: "2", changed: true },
          ],
          visual: {
            kind: "dsa-dp-grid",
            rowHeaders: ["r=0", "r=1", "r=2"],
            colHeaders: ["c=0", "c=1", "c=2"],
            cells: [
              { r: 0, c: 0, value: "1", state: "default" },
              { r: 0, c: 1, value: "1", state: "default" },
              { r: 0, c: 2, value: "1", state: "default" },
              { r: 1, c: 0, value: "1", state: "default" },
              { r: 1, c: 1, value: "X (0)", state: "dim" },
              { r: 1, c: 2, value: "1", state: "source" },
              { r: 2, c: 0, value: "1", state: "default" },
              { r: 2, c: 1, value: "1", state: "source" },
              { r: 2, c: 2, value: "2", state: "optimal" },
            ],
            formulaNote: "`dp[1][1] = 0` blocks all middle crossings; `dp[2][2] = 1 + 1 = 2`.",
            caption: "Obstacle cells contribute 0 paths to right and down neighbors.",
          },
        },
        {
          title: "Compress 2D table into a single O(C) array",
          tag: "MEMORY",
          explanation: [
            "Returning to Minimum Path Sum row `r = 1` (`grid[1] = [1, 5, 1]`), start with `dp = [1, 4, 5]` (row `0`).",
            "Update left-to-right: `dp[0] = 1 + 1 = 2`, then at `c = 1`, `dp[1]` (still `4` from row `0`) and `dp[0]` (already `2` from row `1`) compute `5 + min(4, 2) = 7` in place!",
          ],
          code: [
            "dp[0] ← dp[0] + grid[r][0]",
            "for c from 1 to C - 1:",
            "    dp[c] ← grid[r][c] + min(dp[c], dp[c - 1])",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Old dp[1] (above)", value: "4" },
            { name: "New dp[0] (left)", value: "2" },
            { name: "Updated row r=1", value: "[2, 7, 6]", changed: true },
          ],
          visual: {
            kind: "dsa-dp-grid",
            rowHeaders: ["old row (r=0)", "rolling dp[c]"],
            colHeaders: ["c=0", "c=1", "c=2"],
            cells: [
              { r: 0, c: 0, value: "1", state: "source" },
              { r: 0, c: 1, value: "4", state: "source" },
              { r: 0, c: 2, value: "5", state: "source" },
              { r: 1, c: 0, value: "2", state: "default" },
              { r: 1, c: 1, value: "7", state: "active" },
              { r: 1, c: 2, value: "6", state: "optimal" },
            ],
            formulaNote: "Left-to-right c scan updates dp[1]=7 using new dp[0]=2 and old dp[1]=4.",
            caption: "Single O(C) array overwrites row 0 with row 1 in-place from left to right.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Forgetting obstacle propagation along the first row or column",
        detail:
          "In Unique Paths with Obstacles, once `obstacleGrid[0][k] == 1`, all cells `c >= k` in row `0` are unreachable (`0`). Using a single `O(C)` loop handles this if you set `dp[c] = 0` when `grid[r][c] == 1`, otherwise `dp[c] += dp[c - 1]`.",
      },
      {
        title: "Not checking if start (0,0) or destination (R-1,C-1) is blocked",
        detail:
          "If `obstacleGrid[0][0] == 1`, there are `0` paths regardless of the rest of the grid. Always seed `dp[0] = 1` only if `obstacleGrid[0][0] == 0`.",
      },
      {
        title: "Reversing column loop order in O(C) compression",
        detail:
          "Because `dp[r][c]` reads `dp[r][c - 1]` (left neighbor in the **current** row), `c` must move left-to-right (`0` to `C - 1`). Moving right-to-left would read the old row's `c - 1` instead.",
      },
    ],
    practiceTask: {
      title: "Grid Path Count With Blocked Cells",
      tier: "Warmup",
      goal: "Given an `R x C` grid where `1` marks an obstacle and `0` marks open space, count unique paths from `(0, 0)` to `(R - 1, C - 1)` moving only right or down.",
      constraints: ["1 <= R, C <= 100", "Answer fits in 32-bit signed int", "Target: O(R * C) time, O(C) space"],
      examples: [
        { input: "grid = [[0,0,0],[0,1,0],[0,0,0]]", output: "2" },
        { input: "grid = [[1,0]]", output: "0" },
      ],
      tasks: [
        "Allocate `dp[0..C - 1]` initialized to `0`, and set `dp[0] = 1` if `grid[0][0] == 0`.",
        "For each row `r` and column `c`, set `dp[c] = 0` if `grid[r][c] == 1`, else if `c > 0` add `dp[c - 1]` to `dp[c]`.",
      ],
      starterCode: "function unique_paths_obstacles(grid):\n    // TODO: O(C) space grid path counter",
      expectedOutput: "2\n0",
      hint: "Notice `dp[c]` already holds the value from above (`r - 1, c`), so adding `dp[c - 1]` when `c > 0` works for every row including row `0`!",
      complexity: { time: "O(R * C)", space: "O(C)" },
      solutionCode:
        "function unique_paths_obstacles(grid):\n    R ← len(grid)\n    C ← len(grid[0])\n    dp ← array of size C filled with 0\n    if grid[0][0] == 0:\n        dp[0] ← 1\n    for r from 0 to R - 1:\n        for c from 0 to C - 1:\n            if grid[r][c] == 1:\n                dp[c] ← 0\n            else if c > 0:\n                dp[c] ← dp[c] + dp[c - 1]\n    return dp[C - 1]",
    },
    practiceChallenges: [
      {
        title: "Grid Path Count With Blocked Cells",
        tier: "Warmup",
        goal: "Count right/down routes from `(0, 0)` to `(R - 1, C - 1)` avoiding `1` obstacles using `O(C)` extra space.",
        constraints: ["1 <= R, C <= 100", "Target: O(R * C) time, O(C) space"],
        examples: [
          { input: "grid = [[0,0,0],[0,1,0],[0,0,0]]", output: "2" },
          { input: "grid = [[1,0]]", output: "0" },
        ],
        tasks: ["Zero `dp[c]` on obstacles; otherwise add `dp[c - 1]` for `c > 0`."],
        starterCode: "function unique_paths_obstacles(grid):\n    // TODO: O(C) space",
        expectedOutput: "2\n0",
        hint: "If `grid[0][0] == 1`, `dp[0]` stays `0` and propagates `0` everywhere.",
        complexity: { time: "O(R * C)", space: "O(C)" },
        solutionCode:
          "function unique_paths_obstacles(grid):\n    R ← len(grid)\n    C ← len(grid[0])\n    dp ← array of size C filled with 0\n    if grid[0][0] == 0:\n        dp[0] ← 1\n    for r from 0 to R - 1:\n        for c from 0 to C - 1:\n            if grid[r][c] == 1:\n                dp[c] ← 0\n            else if c > 0:\n                dp[c] ← dp[c] + dp[c - 1]\n    return dp[C - 1]",
      },
      {
        title: "Minimum Cost Path Across a Matrix",
        tier: "Core",
        goal: "Given an `R x C` grid of non-negative integers, find the minimum sum path from `(0, 0)` to `(R - 1, C - 1)` moving only right or down, using `O(C)` space.",
        constraints: ["1 <= R, C <= 200", "0 <= grid[r][c] <= 200", "Target: O(R * C) time, O(C) space"],
        examples: [
          { input: "grid = [[1,3,1],[1,5,1],[4,2,1]]", output: "7" },
          { input: "grid = [[1,2,3],[4,5,6]]", output: "12" },
        ],
        tasks: [
          "Build row `0` prefix sums in `dp[0..C - 1]`.",
          "For rows `1..R - 1`, update `dp[0] += grid[r][0]` and `dp[c] = grid[r][c] + min(dp[c], dp[c - 1])`.",
        ],
        starterCode: "function min_path_sum(grid):\n    // TODO: O(C) space minimum path sum",
        expectedOutput: "7\n12",
        hint: "Before updating `dp[c]`, `dp[c]` holds the cell directly above.",
        complexity: { time: "O(R * C)", space: "O(C)" },
        solutionCode:
          "function min_path_sum(grid):\n    R ← len(grid)\n    C ← len(grid[0])\n    dp ← array of size C\n    dp[0] ← grid[0][0]\n    for c from 1 to C - 1:\n        dp[c] ← dp[c - 1] + grid[0][c]\n    for r from 1 to R - 1:\n        dp[0] ← dp[0] + grid[r][0]\n        for c from 1 to C - 1:\n            dp[c] ← grid[r][c] + min(dp[c], dp[c - 1])\n    return dp[C - 1]",
      },
      {
        title: "Minimum Path Sum in a Triangle",
        tier: "Stretch",
        goal: "Given a `triangle` array where row `r` has `r + 1` integers and you can step from `(r, c)` to `(r + 1, c)` or `(r + 1, c + 1)`, return the minimum path sum from top to bottom in `O(R)` space.",
        constraints: ["1 <= len(triangle) <= 200", "-10^4 <= triangle[r][c] <= 10^4", "Target: O(R^2) time, O(R) space"],
        examples: [
          { input: "triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]", output: "11", explanation: "2 + 3 + 5 + 1 = 11." },
          { input: "triangle = [[-10]]", output: "-10" },
        ],
        tasks: [
          "Copy the bottom row `triangle[R - 1]` into `dp`.",
          "Iterate `r` from `R - 2` down to `0` and `c` from `0` to `r`, setting `dp[c] = triangle[r][c] + min(dp[c], dp[c + 1])`.",
        ],
        starterCode: "function min_triangle_path(triangle):\n    // TODO: bottom-up O(R) space DP",
        expectedOutput: "11\n-10",
        hint: "Going bottom-up eliminates all left/right boundary checks and leaves the answer in `dp[0]`.",
        complexity: { time: "O(R^2)", space: "O(R)" },
        solutionCode:
          "function min_triangle_path(triangle):\n    R ← len(triangle)\n    dp ← copy of triangle[R - 1]\n    for r from R - 2 down to 0:\n        for c from 0 to r:\n            dp[c] ← triangle[r][c] + min(dp[c], dp[c + 1])\n    return dp[0]",
      },
    ],
  },

  "dsa-dp-knapsack": {
    lessonId: "dsa-dp-knapsack",
    subtitle:
      "Formulate 2D (i, w) capacity transitions for 0/1 Knapsack, Subset Sum, and Unbounded Knapsack, and see why reversing the 1D capacity loop switches between using an item at most once vs unlimited times.",
    intro: {
      heading: "0/1 Knapsack, Subset Sum & Unbounded Knapsack",
      explanation: [
        "Sorting items by value-to-weight density fails at capacity `W = 4` on `[(wt:1, val:1), (wt:2, val:4), (wt:3, val:5)]`: greedy picks `(2, 4) + (1, 1) = 5` and wastes capacity, missing `(3, 5) + (1, 1) = 6`. Even after switching to 1D DP, looping capacity `w` in the wrong direction silently packs a single unique item twice (`4 + 4 = 8`).",
        "In the 2D table `dp[i][w]`, **0/1 Knapsack** reads row `i - 1` (at most one copy per item) while **Unbounded Knapsack** reads current row `i` (unlimited copies). Compressing to a 1D array `dp[0..W]` turns that distinction into one rule: loop `w` downward (`W` down to `wt[i]`) for 0/1, or upward (`wt[i]` up to `W`) for Unbounded.",
      ],
      analogy:
        "Packing a suitcase with unique items (0/1) vs stocking a vending machine from infinite bins (Unbounded): updating your capacity ledger from right to left (`W` down to `wt[i]`) reads yesterday's values so no unique item is packed twice; updating left to right (`wt[i]` up to `W`) lets you keep adding copies of the same item.",
      realWorldUses: [
        "Budget-constrained job packing and cargo loading with fixed weight limits",
        "Counting distinct coin or packet-size combinations for an exact target quota",
      ],
    },
    sections: [
      {
        heading: "2D (i, w) Capacity Table vs 1D Rolling Array",
        paragraphs: [
          "In **0/1 Knapsack**, `dp[i][w]` stores the max value using items `0..i - 1` within capacity `w`. For item `i - 1` with weight `wt` and value `val`: if `w < wt`, skip it (`dp[i][w] = dp[i - 1][w]`). Otherwise, take `max(dp[i - 1][w], val + dp[i - 1][w - wt])`. Notice both lookups come strictly from row `i - 1`.",
          "**Subset Sum** is the boolean sibling of 0/1 Knapsack (`dp[w] = dp[w] or dp[w - num]`, seeded with `dp[0] = true`). **Unbounded Knapsack** and **Coin Combinations** allow unlimited copies, so `dp[i][w]` reads `dp[i][w - wt]` from the same row `i` instead of `i - 1`.",
        ],
        table: {
          caption: "0/1 Knapsack vs Subset Sum vs Unbounded Knapsack / Coin Combinations",
          headers: ["Variant", "Copies per item", "2D transition source", "1D `w` loop direction"],
          rows: [
            ["0/1 Knapsack", "At most 1", "`dp[i - 1][w - wt]` (prev row)", "`W` down to `wt`"],
            ["Subset Sum / Partition", "At most 1", "`dp[i - 1][w - num]` (prev row)", "`target` down to `num`"],
            ["Unbounded Knapsack", "Unlimited", "`dp[i][w - wt]` (current row)", "`wt` up to `W`"],
            ["Coin Combinations", "Unlimited (unordered)", "`dp[i][w - coin]` (current row)", "`coin` up to `amount` (outer: `coin`)"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Every 1D knapsack transition updates `dp[w]` from `dp[w - wt]`. Looping `w` downward reads `dp[w - wt]` before item `i` modifies it (0/1); looping `w` upward reads `dp[w - wt]` after item `i` modifies it (Unbounded).",
        },
      },
      {
        heading: "Why Loop Direction Decides 0/1 vs Unbounded Reuse",
        paragraphs: [
          "Trace item `(wt = 2, val = 4)` onto `dp = [0, 1, 1, 1, 1]` (`W = 4`, already holding item `1` of `wt=1, val=1`). Looping downward (`w = 4, 3, 2`): `dp[4]` reads old `dp[2] = 1` -> `max(1, 4+1) = 5`; `dp[3]` reads old `dp[1] = 1` -> `5`; `dp[2]` reads `dp[0] = 0` -> `4`. Result: `[0, 1, 4, 5, 5]` (each item used at most once).",
          "Looping upward (`w = 2, 3, 4`) on the same array updates `dp[2] = 4` first, then `dp[4]` reads the new `dp[2] = 4` and writes `4 + 4 = 8`, packing `(wt=2, val=4)` twice -> `[0, 1, 4, 5, 8]`. That upward direction is a bug for 0/1 Knapsack and the exact rule needed for **Coin Combinations** (outer `for c in coins`, inner `for w from c to amount` upward).",
        ],
        code: [
          "// 0/1 Knapsack (each item used <= 1 time): loop w downward",
          "function knapsack_01(wt, val, W):",
          "    dp ← array of size (W + 1) filled with 0",
          "    for i from 0 to len(wt) - 1:",
          "        for w from W down to wt[i]:",
          "            dp[w] ← max(dp[w], val[i] + dp[w - wt[i]])",
          "    return dp[W]",
          "",
          "// Unbounded Coin Combinations (order ignored): outer coin, inner w upward",
          "function coin_combinations(coins, amount):",
          "    dp ← array of size (amount + 1) filled with 0; dp[0] ← 1",
          "    for each c in coins:",
          "        for w from c to amount:",
          "            dp[w] ← dp[w] + dp[w - c]",
          "    return dp[amount]",
        ],
        codeLabel: "Pseudocode",
        visual: {
          kind: "dsa-array",
          trays: [
            {
              label: "1D dp[0..4] after downward pass for 0/1 item (wt=2, val=4)",
              cells: [
                { id: "sks0", value: "0", index: 0, state: "done" },
                { id: "sks1", value: "1", index: 1, state: "done" },
                { id: "sks2", value: "4", index: 2, state: "active" },
                { id: "sks3", value: "5", index: 3, state: "active" },
                { id: "sks4", value: "5", index: 4, state: "active" },
              ],
              pointers: [
                { index: 2, label: "reads old dp[0]", tone: "accent" },
                { index: 4, label: "reads old dp[2]=1", tone: "ok" },
              ],
            },
          ],
          caption: "Downward w loop protects smaller indices until larger indices finish reading them.",
        },
        callout: {
          kind: "WATCH OUT",
          text: "Swapping the two loops in Coin Combinations (`for w` outside `for c`) changes the problem from combinations (`1+2` equals `2+1`) to ordered permutations (`1+2` and `2+1` counted separately).",
        },
      },
    ],
    guidedBuildUp: {
      title: "Knapsack DP in 3 Stages: 2D Table to Downward 0/1 and Upward Unbounded",
      steps: [
        {
          label: "Step 1: 2D table dp[i][w] reading strictly from row i - 1",
          explanation: "Skip item `i - 1` (`dp[i - 1][w]`) or pack it once (`val + dp[i - 1][w - wt]`).",
          code: [
            "dp[i][w] ← dp[i - 1][w]",
            "if w >= wt[i - 1]:",
            "    dp[i][w] ← max(dp[i][w], val[i - 1] + dp[i - 1][w - wt[i - 1]])",
          ],
          activeLines: [1, 3],
          output: "Row 1: [0,1,1,1,1] -> Row 2: [0,1,4,5,5] -> Row 3: [0,1,4,5,6]",
        },
        {
          label: "Step 2: Compress 0/1 Knapsack to 1D by looping w downward",
          explanation: "Looping `w` from `W` down to `wt[i]` reads old `dp[w - wt[i]]` before overwriting it.",
          code: [
            "for i from 0 to len(wt) - 1:",
            "    for w from W down to wt[i]:",
            "        dp[w] ← max(dp[w], val[i] + dp[w - wt[i]])",
          ],
          activeLines: [2, 3],
          output: "0/1 dp after all 3 items: [0, 1, 4, 5, 6]",
        },
        {
          label: "Step 3: Flip inner loop upward for Unbounded Coin Combinations",
          explanation: "Outer `c in coins`, inner `w` from `c` to `amount` allows multiple copies without permutation duplicates.",
          code: [
            "dp[0] ← 1",
            "for each c in coins:",
            "    for w from c to amount:",
            "        dp[w] ← dp[w] + dp[w - c]",
          ],
          activeLines: [3, 4],
          output: "coins=[1,2,5], amount=5 -> [1, 1, 2, 2, 3, 4]",
        },
      ],
    },
    walkthrough: {
      title: "Trace 2D 0/1 Knapsack, 1D Downward vs Upward Reuse, and Unbounded Combinations",
      layout: "visual-first",
      steps: [
        {
          title: "2D 0/1 Knapsack setup: rows for items, columns for capacity",
          tag: "CONCEPT",
          explanation: [
            "Consider `items = [(wt:1, val:1), (wt:2, val:4), (wt:3, val:5)]` and `W = 4`.",
            "Row `0` (`0 items`) is all `0`. Row `1` (`wt=1, val=1`) can fit inside every capacity `w >= 1`, giving `[0, 1, 1, 1, 1]`.",
          ],
          code: [
            "dp ← (n + 1) x (W + 1) table of 0s",
            "for i from 1 to n:",
            "    for w from 0 to W:",
            "        dp[i][w] ← dp[i - 1][w]",
            "        if w >= wt[i - 1]:",
            "            dp[i][w] ← max(dp[i][w], val[i - 1] + dp[i - 1][w - wt[i - 1]])",
          ],
          activeLines: [1, 2, 3, 4, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "Items", value: "(w1,v1), (w2,v4), (w3,v5)" },
            { name: "Row i=1", value: "[0, 1, 1, 1, 1]", changed: true },
          ],
          visual: {
            kind: "dsa-dp-grid",
            rowHeaders: ["0 items", "i1 (w1,v1)", "i2 (w2,v4)", "i3 (w3,v5)"],
            colHeaders: ["w=0", "w=1", "w=2", "w=3", "w=4"],
            cells: [
              { r: 0, c: 0, value: "0", state: "default" },
              { r: 0, c: 1, value: "0", state: "default" },
              { r: 0, c: 2, value: "0", state: "default" },
              { r: 0, c: 3, value: "0", state: "default" },
              { r: 0, c: 4, value: "0", state: "default" },
              { r: 1, c: 0, value: "0", state: "default" },
              { r: 1, c: 1, value: "1", state: "active" },
              { r: 1, c: 2, value: "1", state: "active" },
              { r: 1, c: 3, value: "1", state: "active" },
              { r: 1, c: 4, value: "1", state: "active" },
            ],
            formulaNote: "Each row adds one more item choice against every capacity `w = 0..4`.",
            caption: "2D 0/1 Knapsack table after processing item 1 (wt=1, val=1).",
          },
        },
        {
          title: "Fill row 2 (i2: wt=2, val=4) from row 1",
          tag: "TRACE",
          explanation: [
            "Row `2` (`wt=2, val=4`) copies `dp[1][0..1] = [0, 1]` where `w < 2`, then evaluates `w = 2..4`.",
            "At `w = 2`, `4 + dp[1][0] = 4`; at `w = 3` and `w = 4`, `4 + dp[1][1] = 5` and `4 + dp[1][2] = 5` (`i1 + i2`).",
          ],
          code: [
            "// At i = 2 (wt=2, val=4):",
            "for w from 0 to W:",
            "    dp[2][w] ← dp[1][w]",
            "    if w >= 2: dp[2][w] ← max(dp[2][w], 4 + dp[1][w - 2])",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "dp[2][2]", value: "4 + dp[1][0] = 4", changed: true },
            { name: "dp[2][3..4]", value: "4 + dp[1][1..2] = 5", changed: true },
          ],
          visual: {
            kind: "dsa-dp-grid",
            rowHeaders: ["0 items", "i1 (w1,v1)", "i2 (w2,v4)", "i3 (w3,v5)"],
            colHeaders: ["w=0", "w=1", "w=2", "w=3", "w=4"],
            cells: [
              { r: 0, c: 0, value: "0", state: "default" },
              { r: 0, c: 1, value: "0", state: "default" },
              { r: 0, c: 2, value: "0", state: "default" },
              { r: 0, c: 3, value: "0", state: "default" },
              { r: 0, c: 4, value: "0", state: "default" },
              { r: 1, c: 0, value: "0", state: "source" },
              { r: 1, c: 1, value: "1", state: "source" },
              { r: 1, c: 2, value: "1", state: "source" },
              { r: 1, c: 3, value: "1", state: "default" },
              { r: 1, c: 4, value: "1", state: "default" },
              { r: 2, c: 0, value: "0", state: "default" },
              { r: 2, c: 1, value: "1", state: "default" },
              { r: 2, c: 2, value: "4", state: "active" },
              { r: 2, c: 3, value: "5", state: "active" },
              { r: 2, c: 4, value: "5", state: "active" },
            ],
            formulaNote: "Row 2 finishes `[0, 1, 4, 5, 5]` before row 3 begins.",
            caption: "2D 0/1 Knapsack table after completing row 2.",
          },
        },
        {
          title: "Complete row 3 (i3: wt=3, val=5): beat greedy density with value 6",
          tag: "TRACE",
          explanation: [
            "Row `3` (`wt=3, val=5`) copies `[0, 1, 4]` for `w < 3`, then tests taking `i3` at `w = 3` (`max(5, 5 + 0) = 5`).",
            "At `w = 4`, `dp[3][4]` compares skipping (`dp[2][4] = 5`) against taking `i3` (`5 + dp[2][1] = 5 + 1 = 6`). Greedy density took `(w2,v4)+(w1,v1) = 5`, while DP finds `6`!",
          ],
          code: [
            "// At i = 3 (wt=3, val=5), w = 4:",
            "skip ← dp[2][4]                 // 5",
            "take ← 5 + dp[2][4 - 3]         // 5 + dp[2][1] = 6",
            "dp[3][4] ← max(skip, take)      // 6",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "dp[3][3]", value: "max(5, 5 + 0) = 5", changed: true },
            { name: "dp[3][4]", value: "max(5, 5 + 1) = 6", changed: true },
          ],
          visual: {
            kind: "dsa-dp-grid",
            rowHeaders: ["0 items", "i1 (w1,v1)", "i2 (w2,v4)", "i3 (w3,v5)"],
            colHeaders: ["w=0", "w=1", "w=2", "w=3", "w=4"],
            cells: [
              { r: 0, c: 0, value: "0", state: "default" },
              { r: 0, c: 1, value: "0", state: "default" },
              { r: 0, c: 2, value: "0", state: "default" },
              { r: 0, c: 3, value: "0", state: "default" },
              { r: 0, c: 4, value: "0", state: "default" },
              { r: 1, c: 0, value: "0", state: "default" },
              { r: 1, c: 1, value: "1", state: "default" },
              { r: 1, c: 2, value: "1", state: "default" },
              { r: 1, c: 3, value: "1", state: "default" },
              { r: 1, c: 4, value: "1", state: "default" },
              { r: 2, c: 0, value: "0", state: "default" },
              { r: 2, c: 1, value: "1", state: "source" },
              { r: 2, c: 2, value: "4", state: "default" },
              { r: 2, c: 3, value: "5", state: "default" },
              { r: 2, c: 4, value: "5", state: "source" },
              { r: 3, c: 0, value: "0", state: "default" },
              { r: 3, c: 1, value: "1", state: "default" },
              { r: 3, c: 2, value: "4", state: "default" },
              { r: 3, c: 3, value: "5", state: "default" },
              { r: 3, c: 4, value: "6", state: "optimal" },
            ],
            formulaNote: "`dp[3][4] = max(dp[2][4], 5 + dp[2][1]) = max(5, 6) = 6`.",
            caption: "Optimal 0/1 selection packs (wt=1, val=1) + (wt=3, val=5) = 6.",
          },
        },
        {
          title: "Compress 0/1 Knapsack to 1D by looping w downward",
          tag: "MEMORY",
          explanation: [
            "Start with `dp = [0, 1, 1, 1, 1]` (row `1`). Now add item `2` (`wt=2, val=4`) looping `w` downward from `4` to `2`.",
            "`dp[4]` reads `dp[2] = 1` -> `5`, `dp[3]` reads `dp[1] = 1` -> `5`, `dp[2]` reads `dp[0] = 0` -> `4`. Each cell only sees row `1` values!",
          ],
          code: [
            "for w from W down to wt[i]:",
            "    dp[w] ← max(dp[w], val[i] + dp[w - wt[i]])",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "Item added", value: "(wt=2, val=4)" },
            { name: "Loop direction", value: "w = 4 -> 3 -> 2 (down)", changed: true },
            { name: "1D dp[0..4]", value: "[0, 1, 4, 5, 5]", changed: true },
          ],
          visual: {
            kind: "dsa-dp-grid",
            rowHeaders: ["before (i=1)", "after w=4..2"],
            colHeaders: ["w=0", "w=1", "w=2", "w=3", "w=4"],
            cells: [
              { r: 0, c: 0, value: "0", state: "source" },
              { r: 0, c: 1, value: "1", state: "source" },
              { r: 0, c: 2, value: "1", state: "source" },
              { r: 0, c: 3, value: "1", state: "default" },
              { r: 0, c: 4, value: "1", state: "default" },
              { r: 1, c: 0, value: "0", state: "default" },
              { r: 1, c: 1, value: "1", state: "default" },
              { r: 1, c: 2, value: "4", state: "active" },
              { r: 1, c: 3, value: "5", state: "active" },
              { r: 1, c: 4, value: "5", state: "optimal" },
            ],
            formulaNote: "w=4 reads old dp[2]=1 -> 1+4=5; smaller slots stay intact until later.",
            caption: "Downward pass keeps 0/1 exclusivity in one row by reading unupdated prior weights.",
          },
        },
        {
          title: "Looping w upward turns 0/1 into Unbounded reuse",
          tag: "PITFALL",
          explanation: [
            "Look what happens on `dp = [0, 1, 1, 1, 1]` if you loop `w` upward (`2 -> 3 -> 4`) for `(wt=2, val=4)`.",
            "`dp[2]` updates first to `4`. Then `dp[4]` reads the new `dp[2] = 4` and computes `4 + 4 = 8`, packing item `2` twice. That upward loop is a bug for 0/1 Knapsack, and the right pattern for Unbounded Knapsack.",
          ],
          code: [
            "// Upward loop allows unlimited copies of item (wt=2, val=4):",
            "for w from wt[i] to W:",
            "    dp[w] ← max(dp[w], val[i] + dp[w - wt[i]])",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "dp[2] updated first", value: "4", changed: true },
            { name: "dp[4] reads new dp[2]", value: "4 + 4 = 8 (2 copies!)", changed: true },
          ],
          visual: {
            kind: "dsa-dp-grid",
            rowHeaders: ["before", "up w=2..4"],
            colHeaders: ["w=0", "w=1", "w=2", "w=3", "w=4"],
            cells: [
              { r: 0, c: 0, value: "0", state: "dim" },
              { r: 0, c: 1, value: "1", state: "dim" },
              { r: 0, c: 2, value: "1", state: "dim" },
              { r: 0, c: 3, value: "1", state: "dim" },
              { r: 0, c: 4, value: "1", state: "dim" },
              { r: 1, c: 0, value: "0", state: "default" },
              { r: 1, c: 1, value: "1", state: "default" },
              { r: 1, c: 2, value: "4", state: "source" },
              { r: 1, c: 3, value: "5", state: "default" },
              { r: 1, c: 4, value: "8", state: "active" },
            ],
            formulaNote: "dp[4] reads already-updated dp[2]=4, counting item (wt=2, val=4) twice.",
            caption: "Upward w loop reads same-row updates, implementing Unbounded Knapsack reuse.",
          },
        },
        {
          title: "Unbounded Coin Combinations: seed init, coin 1, and early coin 2",
          tag: "PATTERN",
          explanation: [
            "To count unique combinations summing to `amount = 5` using `coins = [1, 2, 5]`, seed `dp = [1, 0, 0, 0, 0, 0]` (`init`).",
            "Processing `coin 1` upward fills `[1, 1, 1, 1, 1, 1]`. Next, `coin 2` begins at `w = 2`: `dp[2] += dp[0] -> 2` and `dp[3] += dp[1] -> 2`.",
          ],
          code: [
            "dp[0] ← 1",
            "for each c in coins:",
            "    for w from c to amount:",
            "        dp[w] ← dp[w] + dp[w - c]",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "After coin 1", value: "[1, 1, 1, 1, 1, 1]", changed: true },
            { name: "Coin 2 (w=0..3)", value: "[1, 1, 2, 2, ?, ?]", changed: true },
          ],
          visual: {
            kind: "dsa-dp-grid",
            rowHeaders: ["init", "coin 1", "coin 2", "coin 5"],
            colHeaders: ["w=0", "w=1", "w=2", "w=3", "w=4", "w=5"],
            cells: [
              { r: 0, c: 0, value: "1", state: "source" },
              { r: 0, c: 1, value: "0", state: "dim" },
              { r: 0, c: 2, value: "0", state: "dim" },
              { r: 0, c: 3, value: "0", state: "dim" },
              { r: 0, c: 4, value: "0", state: "dim" },
              { r: 0, c: 5, value: "0", state: "dim" },
              { r: 1, c: 0, value: "1", state: "source" },
              { r: 1, c: 1, value: "1", state: "source" },
              { r: 1, c: 2, value: "1", state: "default" },
              { r: 1, c: 3, value: "1", state: "default" },
              { r: 1, c: 4, value: "1", state: "default" },
              { r: 1, c: 5, value: "1", state: "default" },
              { r: 2, c: 0, value: "1", state: "default" },
              { r: 2, c: 1, value: "1", state: "default" },
              { r: 2, c: 2, value: "2", state: "active" },
              { r: 2, c: 3, value: "2", state: "active" },
            ],
            formulaNote: "At `coin 2`, `dp[2] = 1 + dp[0] = 2` and `dp[3] = 1 + dp[1] = 2`.",
            caption: "Init row, coin 1 row, and early w=0..3 updates for coin 2.",
          },
        },
        {
          title: "Unbounded Coin Combinations: complete coin 2 and coin 5 rows",
          tag: "CHECK",
          explanation: [
            "Continuing `coin 2` upward reads the updated `dp[2] = 2` at `w = 4` (`1 + 2 = 3`, adding `2+2`) and `dp[3] = 2` at `w = 5` (`1 + 2 = 3`).",
            "Finally `coin 5` adds `dp[5 - 5] = dp[0] = 1` at `w = 5`, reaching `4` unique combinations (`11111`, `1112`, `122`, `5`).",
          ],
          code: [
            "dp[0] ← 1",
            "for each c in coins:",
            "    for w from c to amount:",
            "        dp[w] ← dp[w] + dp[w - c]",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "After coin 1", value: "[1, 1, 1, 1, 1, 1]" },
            { name: "After coin 2", value: "[1, 1, 2, 2, 3, 3]", changed: true },
            { name: "After coin 5", value: "[1, 1, 2, 2, 3, 4]", changed: true },
          ],
          visual: {
            kind: "dsa-dp-grid",
            rowHeaders: ["init", "coin 1", "coin 2", "coin 5"],
            colHeaders: ["w=0", "w=1", "w=2", "w=3", "w=4", "w=5"],
            cells: [
              { r: 0, c: 0, value: "1", state: "default" },
              { r: 0, c: 1, value: "0", state: "dim" },
              { r: 0, c: 2, value: "0", state: "dim" },
              { r: 0, c: 3, value: "0", state: "dim" },
              { r: 0, c: 4, value: "0", state: "dim" },
              { r: 0, c: 5, value: "0", state: "dim" },
              { r: 1, c: 0, value: "1", state: "default" },
              { r: 1, c: 1, value: "1", state: "default" },
              { r: 1, c: 2, value: "1", state: "default" },
              { r: 1, c: 3, value: "1", state: "default" },
              { r: 1, c: 4, value: "1", state: "default" },
              { r: 1, c: 5, value: "1", state: "default" },
              { r: 2, c: 0, value: "1", state: "default" },
              { r: 2, c: 1, value: "1", state: "default" },
              { r: 2, c: 2, value: "2", state: "source" },
              { r: 2, c: 3, value: "2", state: "default" },
              { r: 2, c: 4, value: "3", state: "source" },
              { r: 2, c: 5, value: "3", state: "active" },
              { r: 3, c: 0, value: "1", state: "default" },
              { r: 3, c: 1, value: "1", state: "default" },
              { r: 3, c: 2, value: "2", state: "default" },
              { r: 3, c: 3, value: "2", state: "default" },
              { r: 3, c: 4, value: "3", state: "default" },
              { r: 3, c: 5, value: "4", state: "optimal" },
            ],
            formulaNote: "Coin `5` adds `dp[5 - 5] = dp[0] = 1` to `3`, yielding `4` combinations.",
            caption: "Outer-coin, upward-amount loop prevents duplicate permutations like 1+2 and 2+1.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Looping upward in 1D 0/1 Knapsack or Subset Sum",
        detail:
          "Scanning `w` upward from `wt[i]` to `W` lets `dp[w - wt[i]]` already reflect item `i`, allowing the same item to be chosen multiple times. Always loop `w` downward from `W` to `wt[i]` when each item may be used at most once.",
      },
      {
        title: "Swapping loop order in Coin Combinations",
        detail:
          "Putting `for w` outside `for coin` counts every ordered permutation (`1+2` and `2+1` as `2` ways). Keep `for coin in coins` as the outer loop when counting unique combinations.",
      },
      {
        title: "Skipping the odd-sum check in Equal Partition Subset",
        detail:
          "Two equal-sum subsets are impossible whenever `sum(nums)` is odd. Return `false` immediately if `total mod 2 != 0` before running Subset Sum on `target = total / 2`.",
      },
    ],
    predictChecks: [
      {
        prompt: "For a single item of weight 3 (usable at most once) and target W = 6, this 0/1 Subset Sum loops w upward from 3 to 6 instead of downward. What does dp[6] become?",
        code: "dp = [true, false, false, false, false, false, false]\nfor w from 3 to 6:\n    if dp[w - 3]:\n        dp[w] = true\nreturn dp[6]",
        options: [
          { id: "a", label: "false, because only one item of weight 3 exists" },
          { id: "b", label: "true, because dp[3] turns true at w = 3 and gets reused at w = 6" },
          { id: "c", label: "true, because dp[0] starts as true for all weights" },
          { id: "d", label: "IndexOutOfBounds error at w = 6" },
        ],
        correctId: "b",
        explanation: "Scanning w upward reads dp[w - 3] after the same item has already updated dp[3] = true, turning 0/1 Subset Sum into unbounded Coin Change. Loop w downward from 6 down to 3.",
      },
      {
        prompt: "This Coin Change II snippet swaps the loops (amount outer, coins inner) on coins = [1, 2] and target = 3. What does dp[3] return?",
        code: "dp = [1, 0, 0, 0]\nfor w from 1 to 3:\n    for c in [1, 2]:\n        if w >= c:\n            dp[w] += dp[w - c]\nreturn dp[3]",
        options: [
          { id: "a", label: "2, counting {1+1+1, 1+2}" },
          { id: "b", label: "1, because coin 2 overwrites coin 1" },
          { id: "c", label: "4, counting every subset of coins" },
          { id: "d", label: "3 instead of 2, because 1+2 and 2+1 are counted as distinct sequences" },
        ],
        correctId: "d",
        explanation: "With w on the outside, dp[3] adds dp[2] (which includes 2) plus coin 1, and adds dp[1] (1) plus coin 2, counting both 2+1 and 1+2. Put for c in coins on the outside when counting combinations.",
      },
    ],
    practiceTask: {
      title: "Partition Array Into Equal Sums",
      tier: "Warmup",
      goal: "Given positive integers `nums`, return `true` if `nums` can be partitioned into two subsets with equal sum, otherwise `false`.",
      constraints: ["1 <= len(nums) <= 200", "1 <= nums[i] <= 100", "Target: O(n * target) time, O(target) space"],
      examples: [
        { input: "nums = [1, 5, 11, 5]", output: "true", explanation: "[1, 5, 5] and [11] both sum to 11." },
        { input: "nums = [1, 2, 3, 5]", output: "false" },
      ],
      tasks: [
        "Compute `total = sum(nums)`. If `total mod 2 == 1`, return `false`.",
        "Run 1D Subset Sum for `target = total / 2` looping `w` downward from `target` to `num`.",
      ],
      starterCode: "function can_partition(nums):\n    // TODO: 0/1 Subset Sum in O(target) space",
      expectedOutput: "true\nfalse",
      hint: "Seed `dp[0] = true` and update `dp[w] = dp[w] or dp[w - num]` downward.",
      complexity: { time: "O(n * target)", space: "O(target)" },
      solutionCode:
        "function can_partition(nums):\n    total ← sum(nums)\n    if total mod 2 != 0:\n        return false\n    target ← total / 2\n    dp ← array of size (target + 1) filled with false\n    dp[0] ← true\n    for each num in nums:\n        for w from target down to num:\n            dp[w] ← dp[w] or dp[w - num]\n    return dp[target]",
    },
    practiceChallenges: [
      {
        title: "Partition Array Into Equal Sums",
        tier: "Warmup",
        goal: "Determine whether `nums` splits into two subsets of equal total sum.",
        constraints: ["1 <= len(nums) <= 200", "1 <= nums[i] <= 100", "Target: O(n * target) time, O(target) space"],
        examples: [
          { input: "nums = [1, 5, 11, 5]", output: "true" },
          { input: "nums = [1, 2, 3, 5]", output: "false" },
        ],
        tasks: ["Reject odd totals, then run downward Subset Sum up to `total / 2`."],
        starterCode: "function can_partition(nums):\n    // TODO: downward boolean DP",
        expectedOutput: "true\nfalse",
        hint: "If `dp[target]` turns `true` early, you can even return `true` immediately.",
        complexity: { time: "O(n * target)", space: "O(target)" },
        solutionCode:
          "function can_partition(nums):\n    total ← sum(nums)\n    if total mod 2 != 0:\n        return false\n    target ← total / 2\n    dp ← array of size (target + 1) filled with false\n    dp[0] ← true\n    for each num in nums:\n        for w from target down to num:\n            dp[w] ← dp[w] or dp[w - num]\n    return dp[target]",
      },
      {
        title: "0/1 Knapsack Maximum Value",
        tier: "Core",
        goal: "Given item weights `wt`, item values `val`, and bag capacity `W`, return the maximum value packable where each item is used at most once.",
        constraints: ["1 <= len(wt) <= 200", "0 <= W <= 10^4", "Target: O(n * W) time, O(W) space"],
        examples: [
          { input: "wt = [1, 2, 3], val = [1, 4, 5], W = 4", output: "6" },
          { input: "wt = [4, 5, 1], val = [1, 2, 3], W = 4", output: "3" },
        ],
        tasks: [
          "Create `dp[0..W]` initialized to `0`.",
          "For each item `i`, loop `w` downward from `W` down to `wt[i]` and update `dp[w] = max(dp[w], val[i] + dp[w - wt[i]])`.",
        ],
        starterCode: "function knapsack_01(wt, val, W):\n    // TODO: 1D downward 0/1 Knapsack",
        expectedOutput: "6\n3",
        hint: "Downward `w` iteration keeps `dp[w - wt[i]]` uncontaminated by updates from the current item.",
        complexity: { time: "O(n * W)", space: "O(W)" },
        solutionCode:
          "function knapsack_01(wt, val, W):\n    dp ← array of size (W + 1) filled with 0\n    for i from 0 to len(wt) - 1:\n        for w from W down to wt[i]:\n            dp[w] ← max(dp[w], val[i] + dp[w - wt[i]])\n    return dp[W]",
      },
      {
        title: "Count Unbounded Coin Combinations",
        tier: "Stretch",
        goal: "Given distinct positive coin denominations `coins` (unlimited supply) and `amount`, return the number of combinations that sum to `amount` (order does not matter).",
        constraints: ["1 <= len(coins) <= 300", "0 <= amount <= 5000", "Target: O(len(coins) * amount) time, O(amount) space"],
        examples: [
          { input: "coins = [1, 2, 5], amount = 5", output: "4", explanation: "5, 2+2+1, 2+1+1+1, 1+1+1+1+1." },
          { input: "coins = [2], amount = 3", output: "0" },
        ],
        tasks: [
          "Initialize `dp[0..amount]` with `0` and `dp[0] = 1`.",
          "Iterate `c` in `coins` in the outer loop, and `w` upward from `c` to `amount` in the inner loop.",
        ],
        starterCode: "function coin_combinations(coins, amount):\n    // TODO: outer coin loop, inner upward amount loop",
        expectedOutput: "4\n0",
        hint: "Looping `w` upward allows reusing coin `c` multiple times while outer `c` avoids permutation duplicates.",
        complexity: { time: "O(len(coins) * amount)", space: "O(amount)" },
        solutionCode:
          "function coin_combinations(coins, amount):\n    dp ← array of size (amount + 1) filled with 0\n    dp[0] ← 1\n    for each c in coins:\n        for w from c to amount:\n            dp[w] ← dp[w] + dp[w - c]\n    return dp[amount]",
      },
    ],
  },
};

export const dsaM20PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m20",
  title: "Module 20 Practice Set: Dynamic Programming Core",
  description:
    "Four mixed problems combining rolling-state recurrences, circular 1D constraints, 2D obstacle-and-cost grids, and capacity-bounded subset counting.",
  problems: [
    {
      id: "dsa-m20-p1",
      title: "Paid Toll Stairway Crossing",
      patternHint:
        "Express the cheapest way to reach step `i` from `i - 1` or `i - 2` and roll two variables (Lesson 20-1).",
      lessonRefId: "dsa-dp-intro",
      goal: "Each tile `i` (`0 <= i < n`) charges `cost[i]` when you step off it by `1` or `2` tiles. You may start free on tile `0` or tile `1`. Return the minimum total toll to pass tile `n - 1` (reaching index `n`).",
      constraints: ["2 <= len(cost) <= 1000", "0 <= cost[i] <= 999", "Target: O(n) time, O(1) space"],
      examples: [
        { input: "cost = [10, 15, 20]", output: "15", explanation: "Start on index 1 and pay 15 to jump 2 tiles to index 3." },
        { input: "cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]", output: "6" },
      ],
      tasks: [
        "Set `prev2 = 0` (reach `0`) and `prev1 = 0` (reach `1`).",
        "For `i` from `2` to `len(cost)`, compute `curr = min(prev1 + cost[i - 1], prev2 + cost[i - 2])` and shift.",
      ],
      starterCode: "function min_toll_crossing(cost):\n    // TODO: O(n) time, O(1) space",
      expectedOutput: "15\n6",
      hint: "Index `n` is one past the last tile, so the loop runs up to `i = len(cost)` inclusive.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function min_toll_crossing(cost):\n    prev2 ← 0\n    prev1 ← 0\n    for i from 2 to len(cost):\n        curr ← min(prev1 + cost[i - 1], prev2 + cost[i - 2])\n        prev2 ← prev1\n        prev1 ← curr\n    return prev1",
    },
    {
      id: "dsa-m20-p2",
      title: "Circular Vault Loot Maximum",
      patternHint:
        "Break the cycle between index `0` and `n - 1` into two linear 1D non-adjacent passes: `[0..n-2]` and `[1..n-1]` (Lesson 20-2).",
      lessonRefId: "dsa-dp-1d",
      goal: "Vaults are arranged in a circle so vault `0` and vault `n - 1` are adjacent. Given non-negative vault values `nums`, return the maximum total without opening two adjacent vaults.",
      constraints: ["1 <= len(nums) <= 1000", "0 <= nums[i] <= 1000", "Target: O(n) time, O(1) space"],
      examples: [
        { input: "nums = [2, 3, 2]", output: "3", explanation: "Cannot take both 0 and 2, so best is 3." },
        { input: "nums = [1, 2, 3, 1]", output: "4", explanation: "1 + 3 = 4." },
      ],
      tasks: [
        "Handle `len(nums) == 1` directly by returning `nums[0]`.",
        "Run a rolling non-adjacent helper on `[0..n - 2]` and `[1..n - 1]` and return the max of both.",
      ],
      starterCode: "function max_circular_vaults(nums):\n    // TODO: split circular ring into two linear ranges",
      expectedOutput: "3\n4",
      hint: "Any valid selection omits at least one of the first or last vaults.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function rob_range(nums, lo, hi):\n    prev2 ← 0\n    prev1 ← 0\n    for i from lo to hi:\n        curr ← max(prev1, prev2 + nums[i])\n        prev2 ← prev1\n        prev1 ← curr\n    return prev1\n\nfunction max_circular_vaults(nums):\n    n ← len(nums)\n    if n == 1:\n        return nums[0]\n    return max(rob_range(nums, 0, n - 2), rob_range(nums, 1, n - 1))",
    },
    {
      id: "dsa-m20-p3",
      title: "Cargo Drone Grid Pathfinding",
      patternHint:
        "Combine 2D minimum-cost transitions with obstacle sentinel checks (`-1`) in a single `O(C)` compressed row (Lesson 20-3).",
      lessonRefId: "dsa-dp-2d-grids",
      goal: "Given an `R x C` sector grid where `-1` is an impassable storm cell and `grid[r][c] >= 0` is fuel cost, find the minimum fuel to fly from `(0, 0)` to `(R - 1, C - 1)` moving only right or down, or `-1` if no valid route exists.",
      constraints: ["1 <= R, C <= 200", "-1 <= grid[r][c] <= 500", "Target: O(R * C) time, O(C) space"],
      examples: [
        { input: "grid = [[1,3,1],[1,-1,1],[4,2,1]]", output: "7", explanation: "Top-right route 1+3+1+1+1 = 7 avoids storm at (1,1)." },
        { input: "grid = [[0,-1],[-1,0]]", output: "-1" },
      ],
      tasks: [
        "Use `INF = 10^9` in an `O(C)` row array `dp` to mark unreachable cells.",
        "At `(r, c)`, if `grid[r][c] == -1`, set `dp[c] = INF`; otherwise take `min(above, left)` plus `grid[r][c]`.",
      ],
      starterCode: "function min_drone_fuel(grid):\n    // TODO: O(C) space min-cost grid with -1 storm cells",
      expectedOutput: "7\n-1",
      hint: "If both `above` and `left` equal `INF` (when `r > 0` or `c > 0`), the current cell also stays `INF`.",
      complexity: { time: "O(R * C)", space: "O(C)" },
      solutionCode:
        "function min_drone_fuel(grid):\n    R ← len(grid)\n    C ← len(grid[0])\n    INF ← 1000000000\n    dp ← array of size C filled with INF\n    if grid[0][0] == -1:\n        return -1\n    dp[0] ← grid[0][0]\n    for r from 0 to R - 1:\n        for c from 0 to C - 1:\n            if grid[r][c] == -1:\n                dp[c] ← INF\n            else if r == 0 and c == 0:\n                continue\n            else:\n                best_prev ← dp[c]\n                if c > 0:\n                    best_prev ← min(best_prev, dp[c - 1])\n                if best_prev >= INF:\n                    dp[c] ← INF\n                else:\n                    dp[c] ← best_prev + grid[r][c]\n    if dp[C - 1] >= INF:\n        return -1\n    return dp[C - 1]",
    },
    {
      id: "dsa-m20-p4",
      title: "Exact Weight Shipment Ways",
      patternHint:
        "Count subsets using each package weight at most once via a downward 1D capacity loop `target` down to `wt` (Lesson 20-4).",
      lessonRefId: "dsa-dp-knapsack",
      goal: "Given positive package weights `weights` and a target load `target`, return how many distinct subsets of packages sum to `target`.",
      constraints: ["1 <= len(weights) <= 30", "1 <= weights[i] <= 100", "0 <= target <= 1000", "Target: O(n * target) time, O(target) space"],
      examples: [
        { input: "weights = [1, 2, 3, 3], target = 6", output: "3", explanation: "{1,2,3 (first)}, {1,2,3 (second)}, and {3,3}." },
        { input: "weights = [1, 1, 1], target = 5", output: "0" },
      ],
      tasks: [
        "Initialize `dp[0..target]` with `0` and `dp[0] = 1`.",
        "For each `wt` in `weights`, loop `w` **downward** from `target` to `wt` and add `dp[w] += dp[w - wt]`.",
      ],
      starterCode: "function count_exact_shipments(weights, target):\n    // TODO: count 0/1 subsets summing to target",
      expectedOutput: "3\n0",
      hint: "Looping `w` downward prevents any package weight in `weights` from being added more than once per subset.",
      complexity: { time: "O(n * target)", space: "O(target)" },
      solutionCode:
        "function count_exact_shipments(weights, target):\n    dp ← array of size (target + 1) filled with 0\n    dp[0] ← 1\n    for each wt in weights:\n        for w from target down to wt:\n            dp[w] ← dp[w] + dp[w - wt]\n    return dp[target]",
    },
  ],
};
