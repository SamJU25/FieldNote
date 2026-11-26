import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM16Lessons: Record<string, LessonContent> = {
  "dsa-greedy-choice": {
    lessonId: "dsa-greedy-choice",
    subtitle:
      "Decide when making the locally best choice at each step yields a global optimum, verify safety with concrete swaps, and catch greedy traps early.",
    intro: {
      heading: "Greedy Choice Property & When Greedy Fails",
      explanation: [
        "Suppose stamps come in `[1, 3, 4]` and a customer needs `6` with as few stamps as possible. Grabbing the biggest stamp that fits (`4`) forces `1 + 1` (`3` stamps), whereas `3 + 3` takes only `2`. A **greedy algorithm** always locks in the biggest or best immediate move and never takes it back.",
        "When the greedy choice property holds (like canonical `[1, 2, 5, 10]` coins, interval scheduling, or divisible cargo), greedy runs in `O(n log n)` or `O(n)`. Always test small counterexamples first before trusting a greedy shortcut.",
      ],
      analogy:
        "Scooping spices by the gram is greedy-safe because taking the highest price-per-gram spice first always wins. Buying fixed sealed jars (`4g`, `3g`, `1g` for `6g`) can trap you into extra tiny jars if you always grab the biggest one first.",
      realWorldUses: [
        "Allocating fractional bandwidth or CPU shares sorted by priority-per-unit-cost",
        "Matching buyers to sellers, or workers to tasks, using sorted two-pointer scans",
      ],
    },
    sections: [
      {
        heading: "Greedy Works vs Fails: Testing With Small Counterexamples",
        paragraphs: [
          "Greedy is only safe when picking the best local choice now never ruins better combinations later. Before coding greedy, try building a 3- or 4-item counterexample to see if an early pick traps you.",
          "For **Assign Cookies**, sort child appetites and cookie sizes ascending. Giving child 0 the *smallest* cookie that fits (`cookies[j]`) instead of a larger cookie (`cookies[k]`) always leaves `cookies[k]` free for greedier children later, so the greedy match never hurts.",
        ],
        table: {
          caption: "Greedy-safe problems vs greedy counterexamples",
          headers: ["Problem", "Greedy rule", "Works?", "Why or counterexample"],
          rows: [
            ["Canonical Coins `[1, 2, 5, 10]`", "Pick largest coin `<= remaining`", "Yes", "Denominations step down evenly (`target = 18` -> `10 + 5 + 2 + 1`)"],
            ["Arbitrary Coins `[1, 3, 4]`", "Pick largest coin `<= remaining`", "No", "Target `6`: greedy picks `4 + 1 + 1` (`3` coins) vs `3 + 3` (`2` coins)"],
            ["Fractional Knapsack", "Sort by `value / weight` descending", "Yes", "Items divide evenly; higher value-per-kg strictly wins"],
            ["0/1 Knapsack (whole items)", "Sort by `value / weight` descending", "No", "Cap `50`: `(60,10)+(100,20)=160` loses to `(100,20)+(120,30)=220`"],
            ["Assign Cookies", "Smallest child gets smallest valid cookie", "Yes", "Saving bigger cookies for bigger appetites never hurts"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "KEY IDEA",
          text: "If even one small counterexample (`[1, 3, 4]`, target `6`) beats your greedy pick, drop greedy and compare choices with Dynamic Programming in Module 20.",
        },
      },
      {
        heading: "Fractional Knapsack and exact ratio comparators",
        paragraphs: [
          "In **Fractional Knapsack**, items can be split into fractions (`take = min(item.wt, rem)`). Sort by `value / weight` descending using cross-multiplication (`a.val * b.wt > b.val * a.wt`) to avoid decimal rounding errors.",
          "Take full items until the next item exceeds remaining capacity `rem`, then take `rem / item.wt` of that final item and stop.",
        ],
        code: [
          "function fractional_knapsack(items, capacity):",
          "    sort items by (a.val * b.wt > b.val * a.wt)   // descending ratio",
          "    total_value ← 0.0",
          "    rem ← capacity",
          "    for each item in items:",
          "        if rem == 0: break",
          "        take ← min(item.wt, rem)",
          "        total_value ← total_value + item.val * (take / item.wt)",
          "        rem ← rem - take",
          "    return total_value",
        ],
        codeLabel: "Pseudocode",
        callout: {
          kind: "WATCH OUT",
          text: "For coins `[1, 3, 4]` and target `6`, taking `4` immediately drops remaining target to `2`, forcing `1 + 1` (`3` coins total). Taking `3` instead leaves `3`, finishing in `2` coins (`3 + 3`). Never assume greedy coin picking works on arbitrary denominations.",
        },
      },
    ],
    guidedBuildUp: {
      title: "See Where Greedy Coin Picking Works vs Breaks",
      steps: [
        {
          label: "Step 1: Greedy works on `[10, 5, 2, 1]` for `18`",
          explanation: "Standard stamps `[10, 5, 2, 1]` sum to `18` in 4 stamps (`10 + 5 + 2 + 1`).",
          code: [
            "function greedy_coins(target, coins):   // coins sorted descending",
            "    picked ← []",
            "    for c in coins:",
            "        while target >= c:",
            "            picked.append(c)",
            "            target ← target - c",
            "    return picked",
          ],
          activeLines: [3, 4, 5, 6],
          output: "greedy_coins(18, [10, 5, 2, 1]) -> [10, 5, 2, 1] (4 coins)",
        },
        {
          label: "Step 2: Same loop breaks on `[4, 3, 1]` for `6`",
          explanation: "Locking `4` leaves `2`, forcing `[4, 1, 1]` (3 coins) even though `[3, 3]` (2 coins) exists.",
          code: [
            "// Same loop, different coin set: [4, 3, 1] for target 6",
            "// c=4 -> picks 4 (rem=2)",
            "// c=3 -> skips (3 > 2)",
            "// c=1 -> picks 1, 1 -> [4, 1, 1] (3 coins; optimal is [3, 3] = 2!)",
          ],
          activeLines: [2, 4],
          output: "greedy_coins(6, [4, 3, 1]) -> [4, 1, 1] (WRONG: 3 > 2)",
        },
        {
          label: "Step 3: Contrast greedy-safe Fractional Knapsack",
          explanation: "When items split smoothly, sorting by `val / wt` descending never gets trapped.",
          code: [
            "for each item in sorted_by_ratio_desc:",
            "    take ← min(item.wt, rem)",
            "    total_value ← total_value + item.val * (take / item.wt)",
            "    rem ← rem - take",
          ],
          activeLines: [2, 3],
          output: "Optimal value 240.0 for W = 50",
        },
      ],
    },
    walkthrough: {
      title: "Trace Fractional Knapsack, Assign Cookies, and Coin Counterexample",
      layout: "visual-first",
      steps: [
        {
          title: "Fractional Knapsack: sort items by value / weight",
          tag: "CONCEPT",
          explanation: [
            "We have capacity `W = 50` and three divisible items: `(60, 10)` with ratio `6`, `(100, 20)` with ratio `5`, and `(120, 30)` with ratio `4`.",
            "Sorting descending by `value / weight` puts the highest value-per-unit items first to maximize value per kilogram.",
          ],
          code: [
            "sort items by val / wt descending",
            "rem ← 50, total ← 0",
            "for each item in items:",
            "    take ← min(item.wt, rem)",
            "    total ← total + item.val * (take / item.wt)",
            "    rem ← rem - take",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "Capacity rem", value: "50", changed: true },
            { name: "Total value", value: "0" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Items sorted by value / weight descending",
                cells: [
                  { id: "fk0", value: "60/10 r6", index: 0, state: "active" },
                  { id: "fk1", value: "100/20 r5", index: 1 },
                  { id: "fk2", value: "120/30 r4", index: 2 },
                ],
                pointers: [{ index: 0, label: "best ratio", tone: "coral" }],
              },
            ],
            caption: "Sorting by unit value places ratio 6 ahead of 5 and 4.",
          },
        },
        {
          title: "Take 100% of Item 0 (highest ratio 6) first",
          tag: "TRACE",
          explanation: [
            "Item 0 has `weight = 10 <= rem (50)`, so we take all of it (`100%`, adding `60` to `total_value`).",
            "Capacity drops to `rem = 40`, and we advance to Item 1 (`v:100, w:20`).",
          ],
          code: [
            "sort items by val / wt descending",
            "rem ← 50, total ← 0",
            "for each item in items:",
            "    take ← min(item.wt, rem)   // take = 10",
            "    total ← total + item.val * (take / item.wt)",
            "    rem ← rem - take           // rem = 40",
          ],
          activeLines: [4, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "Capacity rem", value: "40", changed: true },
            { name: "Total value", value: "60", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Fractions taken after Item 0",
                cells: [
                  { id: "fk0", value: "100% (+60)", index: 0, state: "done" },
                  { id: "fk1", value: "v:100 w:20", index: 1, state: "active" },
                  { id: "fk2", value: "v:120 w:30", index: 2 },
                ],
                pointers: [{ index: 1, label: "next item", tone: "coral" }],
              },
            ],
            caption: "Item 0 fits whole, leaving 40 units of capacity for Item 1 and Item 2.",
          },
        },
        {
          title: "Pack Item 1 whole, then slice 20/30 of Item 2",
          tag: "TRACE",
          explanation: [
            "Item 1 (`w = 20 <= 40`) also fits completely (`rem = 20`, `total = 160`).",
            "Only `20` units remain for Item 2 (`w = 30`), so we take `20 / 30` of it (`+80`), reaching `total = 240` with `rem = 0`.",
          ],
          code: [
            "sort items by val / wt descending",
            "rem ← 50, total ← 0",
            "for each item in items:",
            "    take ← min(item.wt, rem)",
            "    total ← total + item.val * (take / item.wt)",
            "    rem ← rem - take",
          ],
          activeLines: [4, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "Capacity rem", value: "0", changed: true },
            { name: "Total value", value: "240 (60 + 100 + 80)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Fractions taken from sorted items",
                cells: [
                  { id: "fk0", value: "100% +60", index: 0, state: "done" },
                  { id: "fk1", value: "100% +100", index: 1, state: "done" },
                  { id: "fk2", value: "20/30 +80", index: 2, state: "active" },
                ],
                pointers: [{ index: 2, label: "partial fill", tone: "accent" }],
              },
            ],
            caption: "The bag reaches capacity 50 with optimal total value 240.",
          },
        },
        {
          title: "Assign Cookies: sorted two-pointer matching",
          tag: "PATTERN",
          explanation: [
            "With `greed = [1, 2, 3]` and `cookies = [1, 1, 2]`, pointer `i` tracks the next child and `j` scans cookies.",
            "Cookie `0` (`1`) satisfies child `0` (`1`), cookie `1` (`1`) is skipped (`1 < 2`), and at `j = 2` cookie `2` (`2`) satisfies child `1` (`2`), advancing `i` to `2` before `j` exits.",
          ],
          code: [
            "sort(greed); sort(cookies)",
            "i ← 0, j ← 0",
            "while i < len(greed) and j < len(cookies):",
            "    if cookies[j] >= greed[i]:",
            "        i ← i + 1",
            "    j ← j + 1",
          ],
          activeLines: [3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Satisfied children i", value: "2", changed: true },
            { name: "Cookie index j", value: "2 (last match)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "greed (sorted ascending)",
                cells: [
                  { id: "g0", value: "1", index: 0, state: "done" },
                  { id: "g1", value: "2", index: 1, state: "done" },
                  { id: "g2", value: "3", index: 2, state: "dim" },
                ],
                pointers: [{ index: 2, label: "i=2 (unmet)", tone: "coral" }],
              },
              {
                label: "cookies (sorted ascending)",
                cells: [
                  { id: "c0", value: "1", index: 0, state: "done" },
                  { id: "c1", value: "1 (skip)", index: 1, state: "dim" },
                  { id: "c2", value: "2", index: 2, state: "done" },
                ],
                pointers: [{ index: 2, label: "j=2 matched", tone: "ok" }],
              },
            ],
            caption: "Each child receives the smallest cookie that satisfies their greed.",
          },
        },
        {
          title: "Greedy Coin Trap: [1, 3, 4] with target 6",
          tag: "PITFALL",
          explanation: [
            "Suppose coins are `[1, 3, 4]` and we want the minimum number of coins summing to `6`.",
            "Greedy takes the largest coin `<= 6`, which is `4`. With remaining target `2`, neither `4` nor `3` fits, forcing `1 + 1` for a total of `3` coins (`4 + 1 + 1`).",
          ],
          code: [
            "// Greedy coin attempt (FAILS on [1, 3, 4])",
            "rem ← 6, count ← 0",
            "for coin in [4, 3, 1]:",
            "    while rem >= coin:",
            "        rem ← rem - coin",
            "        count ← count + 1",
          ],
          activeLines: [4, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "Greedy coins", value: "[4, 1, 1]", changed: true },
            { name: "Greedy count", value: "3 coins", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Greedy pick sequence for target 6",
                cells: [
                  { id: "gc0", value: "4", index: 0, state: "pivot" },
                  { id: "gc1", value: "1", index: 1, state: "active" },
                  { id: "gc2", value: "1", index: 2, state: "active" },
                ],
                pointers: [{ index: 0, label: "myopic pick", tone: "coral" }],
              },
            ],
            caption: "Picking 4 immediately leaves 2, forcing two 1-coins (3 coins total).",
          },
        },
        {
          title: "Optimal answer is 3 + 3 (needs DP in Module 20)",
          tag: "CHECK",
          explanation: [
            "Skipping `4` and choosing `3` first leaves `6 - 3 = 3`, which finishes with one more `3` coin: `3 + 3` uses only `2` coins.",
            "Because `[1, 3, 4]` lacks the greedy choice property, no single local ordering works for all targets; Module 20 Dynamic Programming solves arbitrary coin sets by comparing subproblem counts.",
          ],
          code: [
            "// Counterexample summary for target = 6",
            "// Greedy:  4 + 1 + 1  -> 3 coins (suboptimal)",
            "// Optimal: 3 + 3      -> 2 coins",
            "// Fix: test subproblems in Module 20 (DP)",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Greedy result", value: "3 coins (4+1+1)" },
            { name: "Optimal result", value: "2 coins (3+3)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Optimal coin combination (target = 6)",
                cells: [
                  { id: "oc0", value: "3", index: 0, state: "done" },
                  { id: "oc1", value: "3", index: 1, state: "done" },
                ],
                pointers: [{ index: 0, label: "2 coins", tone: "ok" }],
              },
            ],
            caption: "3 + 3 beats 4 + 1 + 1, proving greedy fails on [1, 3, 4].",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Floating-point drift when sorting by ratio",
        detail:
          "Computing `val / wt` as a floating-point number can misorder near-equal ratios. Use cross-multiplication (`a.val * b.wt > b.val * a.wt`) in your Module 11 comparator with 64-bit integers.",
      },
      {
        title: "Dividing by zero or skipping zero-weight items",
        detail:
          "In Fractional Knapsack, check constraints for `weight == 0` items; any zero-weight positive-value item adds free value without using capacity.",
      },
      {
        title: "Passing sample cases on canonical coins",
        detail:
          "Greedy coin selection passes US coins `[1, 5, 10, 25]` and powers of two `[1, 2, 4, 8]`, which creates false confidence. Always test small non-multiple coins like `[1, 3, 4]` with target `6` before trusting a greedy rule.",
      },
    ],
    practiceTask: {
      title: "Match Children with Cookies",
      tier: "Warmup",
      goal: "Given child greed factors `g` and cookie sizes `s`, return the maximum number of children you can satisfy (at most one cookie per child, with `cookie >= greed`).",
      constraints: ["0 <= len(g), len(s) <= 3 * 10^4", "1 <= g[i], s[j] <= 10^9", "Target time: O(n log n + m log m)"],
      examples: [
        { input: "g = [1, 2, 3], s = [1, 1]", output: "1", explanation: "Only one child with greed 1 can be satisfied." },
        { input: "g = [1, 2], s = [1, 2, 3]", output: "2" },
      ],
      tasks: [
        "Sort both `g` and `s` in non-decreasing order.",
        "Advance cookie pointer `j` every step, and advance child pointer `i` whenever `s[j] >= g[i]`.",
      ],
      starterCode: "function find_content_children(g, s):\n    // TODO: sort both arrays and match greedily",
      expectedOutput: "1\n2",
      hint: "Give each child the smallest cookie that meets their greed so bigger cookies stay free.",
      complexity: { time: "O(n log n + m log m)", space: "O(1) extra" },
      solutionCode:
        "function find_content_children(g, s):\n    sort(g)\n    sort(s)\n    i ← 0\n    j ← 0\n    while i < len(g) and j < len(s):\n        if s[j] >= g[i]:\n            i ← i + 1\n        j ← j + 1\n    return i",
    },
    practiceChallenges: [
      {
        title: "Match Children with Cookies",
        tier: "Warmup",
        goal: "Maximize satisfied children given greed array `g` and cookie sizes `s`.",
        constraints: ["0 <= len(g), len(s) <= 3 * 10^4", "Target time: O(n log n + m log m)"],
        examples: [
          { input: "g = [1, 2, 3], s = [1, 1]", output: "1" },
          { input: "g = [1, 2], s = [1, 2, 3]", output: "2" },
        ],
        tasks: ["Sort `g` and `s` ascending, then run two pointers from index `0`."],
        starterCode: "function find_content_children(g, s):\n    // TODO: greedy two-pointer match",
        expectedOutput: "1\n2",
        hint: "If `s[j] < g[i]`, discard cookie `j` because it cannot satisfy child `i` or any greedier child after `i`.",
        complexity: { time: "O(n log n + m log m)", space: "O(1) extra" },
        solutionCode:
          "function find_content_children(g, s):\n    sort(g)\n    sort(s)\n    i ← 0\n    j ← 0\n    while i < len(g) and j < len(s):\n        if s[j] >= g[i]:\n            i ← i + 1\n        j ← j + 1\n    return i",
      },
      {
        title: "Fractional Knapsack Value",
        tier: "Core",
        goal: "Given items `(val, wt)` and capacity `W`, return the maximum total value when fractions of items are allowed.",
        constraints: ["1 <= len(items) <= 10^5", "1 <= wt <= 10^6", "0 <= W <= 10^9"],
        examples: [
          { input: "items = [(60, 10), (100, 20), (120, 30)], W = 50", output: "240.0" },
          { input: "items = [(500, 30)], W = 10", output: "166.6667" },
        ],
        tasks: [
          "Sort items by `val / wt` descending using cross-multiplication `a.val * b.wt > b.val * a.wt`.",
          "Greedily take `min(item.wt, rem)` from each item until `rem == 0`.",
        ],
        starterCode: "function fractional_knapsack(items, W):\n    // TODO: sort by ratio descending and fill up to W",
        expectedOutput: "240.0\n166.6667",
        hint: "Stop the loop immediately once `rem == 0`.",
        complexity: { time: "O(n log n)", space: "O(1) extra" },
        solutionCode:
          "function fractional_knapsack(items, W):\n    sort items by (a.val * b.wt > b.val * a.wt)\n    total ← 0.0\n    rem ← W\n    for each item in items:\n        if rem == 0: break\n        take ← min(item.wt, rem)\n        total ← total + item.val * (take / item.wt)\n        rem ← rem - take\n    return total",
      },
      {
        title: "Lemonade Stand Exact Change",
        tier: "Stretch",
        goal: "Customers line up buying 5-dollar lemonade and paying with `5`, `10`, or `20` bills (`bills[i]`). Starting with no change, return `true` if you can give exact change to every customer in order.",
        constraints: ["1 <= len(bills) <= 10^5", "bills[i] in {5, 10, 20}", "Target time: O(n), O(1) space"],
        examples: [
          { input: "bills = [5, 5, 5, 10, 20]", output: "true" },
          { input: "bills = [5, 5, 10, 10, 20]", output: "false", explanation: "At 20, you have two 10s and zero 5s." },
        ],
        tasks: [
          "Track counts `fives` and `tens` (you never give `20` as change).",
          "When receiving `20`, greedily pay change as `10 + 5` before falling back to `5 + 5 + 5`.",
        ],
        starterCode: "function lemonade_change(bills):\n    // TODO: track fives and tens, prioritize giving 10 + 5 for 20",
        expectedOutput: "true\nfalse",
        hint: "A `5` bill is strictly more versatile than a `10` bill because it can make change for both `10` and `20`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function lemonade_change(bills):\n    fives ← 0\n    tens ← 0\n    for each b in bills:\n        if b == 5:\n            fives ← fives + 1\n        else if b == 10:\n            if fives == 0: return false\n            fives ← fives - 1\n            tens ← tens + 1\n        else:\n            if tens > 0 and fives > 0:\n                tens ← tens - 1\n                fives ← fives - 1\n            else if fives >= 3:\n                fives ← fives - 3\n            else:\n                return false\n    return true",
      },
    ],
  },

  "dsa-intervals-sweep": {
    lessonId: "dsa-intervals-sweep",
    subtitle:
      "Solve interval merging, insertion, non-overlapping selection, and concurrent room counting in O(n log n) by sorting on the right boundary.",
    intro: {
      heading: "Intervals & Sweep-Line Sorting",
      explanation: [
        "Suppose you have three talks `[[1,4], [2,3], [3,5]]` and want as many non-overlapping talks as possible in one room. If you sort by `start` time and greedily take `[1,4]`, it blocks both `[2,3]` and `[3,5]`, leaving you with `1` talk when `2` talks fit (`[2,3]` then `[3,5]`).",
        "Interval problems break into two camps based on which endpoint you sort by. Sort by `end` for **Activity Selection** and **Non-Overlapping Intervals**, because finishing earliest leaves maximum room for later intervals; sort by `start` for **Merge Intervals** and **Meeting Rooms II** (paired with a Module 15 Min-Heap) so overlapping blocks line up adjacent in `O(n log n)` time.",
      ],
      analogy:
        "Booking one conference room for back-to-back talks rewards finishing early: picking the talk that ends earliest frees the room sooner for everyone else. Summarizing when the room is busy does the opposite—you sort reservations by start time and fuse overlapping blocks.",
      realWorldUses: [
        "Merging overlapping calendar busy slots, memory ranges, or timeline edits",
        "Scheduling the maximum number of non-conflicting jobs on one processor",
      ],
    },
    sections: [
      {
        heading: "Start-sorted vs end-sorted interval patterns",
        paragraphs: [
          "Testing `[[1,4], [2,3], [3,5]]` makes the sorting rule concrete. Sorting by `start` puts `[1,4]` first (`count = 1`, `prev_end = 4`), forcing you to reject `[2,3]` (`2 < 4`) and `[3,5]` (`3 < 4`). Sorting by `end` puts `[2,3]` first (`prev_end = 3`), rejects `[1,4]` (`1 < 3`), and accepts `[3,5]` (`3 >= 3`) for `2` talks.",
          "In **Merge Intervals**, sort by `start` ascending so every overlapping range sits next to the last merged block: if `curr.start <= merged[-1].end`, extend `merged[-1].end = max(merged[-1].end, curr.end)`; otherwise append `[curr.start, curr.end]`. In **Non-Overlapping Intervals**, sort by `end` ascending and count a removal whenever `curr.start < prev_end`.",
        ],
        table: {
          caption: "Start-sorted vs end-sorted interval patterns and concrete traces",
          headers: ["Pattern", "Sort key", "Core rule", "Worked trace or complexity"],
          rows: [
            ["Merge Intervals", "`start` ascending", "If `curr.start <= last.end`, extend `last.end = max(...)`", "`[[1,3],[2,6]]` -> `[[1,6]]` (`O(n log n)` / `O(n)`)"],
            ["Insert Interval", "Already sorted by `start`", "3-phase scan: before, merge overlapping, after", "`O(n)` time, `O(n)` space"],
            ["Activity Selection (broken)", "`start` ascending", "Pick `[1,4]` from `[[1,4],[2,3],[3,5]]`", "1 talk kept (WRONG: misses `[2,3],[3,5]`)"],
            ["Activity Selection (working)", "`end` ascending", "Keep earliest-ending; drop `curr` if `curr.start < prev_end`", "`[2,3]`, `[3,5]` -> 2 talks kept (`O(n log n)`)"],
            ["Meeting Rooms II (Min-Heap / Sweep)", "`start` ascending (or events)", "Pop freed room if `heap_min <= curr.start`, or track max sweep count", "`O(n log n)` time, `O(n)` space"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "RULE OF THUMB",
          text: "Sort by `start` when combining or counting active intervals; sort by `end` when maximizing disjoint intervals on one timeline.",
        },
      },
      {
        heading: "3-phase Insert Interval and Meeting Rooms II (Min-Heap vs Sweep-Line)",
        paragraphs: [
          "When intervals are already sorted and non-overlapping, **Insert Interval** avoids re-sorting (`O(n)` time) with three `while` loops: (1) copy all intervals with `curr.end < new_int.start`, (2) while `curr.start <= new_int.end`, fuse `new_int` using `min(starts)` and `max(ends)`, then append `new_int`, and (3) copy all remaining intervals.",
          "For **Meeting Rooms II**, sort meetings by `start` and maintain a Module 15 **Min-Heap** of active end times. Before assigning a room to `curr`, inspect `heap.peek()`: if `heap.peek() <= curr.start`, that earliest room is free, so pop it and push `curr.end`; otherwise keep all active rooms and push `curr.end`. Equivalently, an **event sweep** creates `(start, +1)` and `(end, -1)` events, sorts by timestamp (placing `-1` before `+1` on ties), and records the peak running sum.",
        ],
        code: [
          "function min_meeting_rooms(intervals):",
          "    sort intervals by start ascending",
          "    min_heap ← empty MinHeap            // Module 15",
          "    for each [start, end] in intervals:",
          "        if not min_heap.empty() and min_heap.peek() <= start:",
          "            min_heap.pop()              // reuse earliest freed room",
          "        min_heap.push(end)",
          "    return min_heap.size()",
        ],
        codeLabel: "Pseudocode",
        callout: {
          kind: "WATCH OUT",
          text: "Check whether touching endpoints count as overlapping. In Merge Intervals, `[1, 4]` and `[4, 5]` merge (`curr.start <= last.end`). In Meeting Rooms II, a meeting ending at `4` frees the room for a meeting starting at `4` (`heap_min <= start`, and `-1` before `+1` in event sweep).",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build Activity Selection from Broken Start-Sort to Optimal End-Sort",
      steps: [
        {
          label: "Step 1: Broken attempt — sorting by start gets trapped by long early intervals",
          explanation:
            "On `[[1,4], [2,3], [3,5]]`, sorting by `start` locks `[1,4]` first (`prev_end = 4`) and rejects both `[2,3]` and `[3,5]`.",
          code: [
            "sort intervals by start ascending        // BUG on [[1,4], [2,3], [3,5]]",
            "kept ← 1, prev_end ← intervals[0][1]     // picks [1,4] -> prev_end = 4",
            "for [s, e] in intervals[1..]:",
            "    if s >= prev_end: kept ← kept + 1; prev_end ← e",
          ],
          activeLines: [1, 2],
          output: "start-sort on [[1,4],[2,3],[3,5]] -> 1 (WRONG: optimal is 2)",
        },
        {
          label: "Step 2: Fix the comparator — sort by end ascending",
          explanation:
            "Sorting by `end` orders `[[2,3], [1,4], [3,5]]` so the shortest-finishing interval `[2,3]` sets `prev_end = 3`.",
          code: [
            "sort intervals by end ascending          // [[2,3], [1,4], [3,5]]",
            "kept ← 1, prev_end ← intervals[0][1]     // picks [2,3] -> prev_end = 3",
            "for [s, e] in intervals[1..]:",
            "    if s >= prev_end:",
            "        kept ← kept + 1; prev_end ← e",
          ],
          activeLines: [1, 2, 4, 5],
          output: "end-sort on [[1,4],[2,3],[3,5]] -> 2 ([2,3], [3,5])",
        },
        {
          label: "Step 3: Guard empty input and return removals when needed",
          explanation:
            "Returning `len(intervals) - kept` solves Non-Overlapping Intervals (`eraseOverlapIntervals`) with the exact same loop.",
          code: [
            "if len(intervals) == 0: return 0",
            "sort intervals by end ascending",
            "kept ← 1, prev_end ← intervals[0][1]",
            "for [s, e] in intervals[1..]:",
            "    if s >= prev_end:",
            "        kept ← kept + 1; prev_end ← e",
            "return len(intervals) - kept             // minimum removals",
          ],
          activeLines: [1, 7],
          output: "removals on [[1,4],[2,3],[3,5]] -> 1 (drop [1,4])",
        },
      ],
    },
    walkthrough: {
      title: "Step through Merge Intervals, Earliest-End Selection, and Meeting Rooms II",
      layout: "visual-first",
      steps: [
        {
          title: "Merge Intervals: sort ranges by start time",
          tag: "PATTERN",
          explanation: [
            "Given unsorted intervals `[[8,10], [1,3], [15,18], [2,6]]`, sorting by `start` places `[1,3]` and `[2,6]` adjacent.",
            "Once sorted by `start`, any interval that overlaps the current merged block must appear next in the scan.",
          ],
          code: [
            "sort intervals by start ascending",
            "merged ← [intervals[0]]",
            "for each [s, e] in intervals[1..]:",
            "    if s <= merged.back().end:",
            "        merged.back().end ← max(merged.back().end, e)",
            "    else: merged.append([s, e])",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "intervals.sort(key=lambda iv: iv[0])",
              "merged = [list(intervals[0])]",
              "for s, e in intervals[1:]:",
              "    if s <= merged[-1][1]:",
              "        merged[-1][1] = max(merged[-1][1], e)",
              "    else: merged.append([s, e])",
            ],
          },
          state: [
            { name: "Sorted input", value: "[[1,3], [2,6], [8,10], [15,18]]", changed: true },
            { name: "merged", value: "[[1,3]]" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Intervals sorted by start",
                cells: [
                  { id: "mi0", value: "[1, 3]", index: 0, state: "active" },
                  { id: "mi1", value: "[2, 6]", index: 1 },
                  { id: "mi2", value: "[8, 10]", index: 2 },
                  { id: "mi3", value: "[15, 18]", index: 3 },
                ],
                pointers: [{ index: 0, label: "start seed", tone: "accent" }],
              },
            ],
            caption: "Sorting by start aligns all overlapping candidates next to each other.",
          },
        },
        {
          title: "Merge [1,3] and [2,6] into [1,6] mid-scan",
          tag: "TRACE",
          explanation: [
            "Next interval `[2, 6]` has `start = 2 <= merged.back().end (3)`, so it fuses into `[1, max(3, 6)] = [1, 6]`.",
            "Next we will test `[8, 10]` against `end = 6`.",
          ],
          code: [
            "sort intervals by start ascending",
            "merged ← [intervals[0]]",
            "for each [s, e] in intervals[1..]:",
            "    if s <= merged.back().end:",
            "        merged.back().end ← max(merged.back().end, e)",
            "    else: merged.append([s, e])",
          ],
          activeLines: [4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Scanning", value: "[2, 6] (2 <= 3)", changed: true },
            { name: "merged", value: "[[1, 6]]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input scan (at index 1)",
                cells: [
                  { id: "mi0", value: "[1, 3]", index: 0, state: "done" },
                  { id: "mi1", value: "[2, 6]", index: 1, state: "active" },
                  { id: "mi2", value: "[8, 10]", index: 2 },
                  { id: "mi3", value: "[15, 18]", index: 3 },
                ],
                pointers: [{ index: 1, label: "2 <= 3", tone: "coral" }],
              },
              {
                label: "Merged so far",
                cells: [
                  { id: "mo0", value: "[1, 6]", index: 0, state: "active" },
                ],
              },
            ],
            caption: "Overlapping [1,3] and [2,6] fuse into [1,6] before inspecting [8,10].",
          },
        },
        {
          title: "Keep disjoint [8,10] and [15,18] to finish Merge Intervals",
          tag: "TRACE",
          explanation: [
            "`[8, 10]` has `8 > 6` and `[15, 18]` has `15 > 10`, so neither overlaps the previous merged block.",
            "Both append as separate intervals, giving `[[1, 6], [8, 10], [15, 18]]`.",
          ],
          code: [
            "sort intervals by start ascending",
            "merged ← [intervals[0]]",
            "for each [s, e] in intervals[1..]:",
            "    if s <= merged.back().end:",
            "        merged.back().end ← max(merged.back().end, e)",
            "    else: merged.append([s, e])",
          ],
          activeLines: [4, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "merged", value: "[[1,6], [8,10], [15,18]]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input scan",
                cells: [
                  { id: "mi0", value: "[1, 3]", index: 0, state: "done" },
                  { id: "mi1", value: "[2, 6]", index: 1, state: "done" },
                  { id: "mi2", value: "[8, 10]", index: 2, state: "done" },
                  { id: "mi3", value: "[15, 18]", index: 3, state: "done" },
                ],
              },
              {
                label: "Merged output",
                cells: [
                  { id: "mo0", value: "[1, 6]", index: 0, state: "done" },
                  { id: "mo1", value: "[8, 10]", index: 1, state: "done" },
                  { id: "mo2", value: "[15, 18]", index: 2, state: "active" },
                ],
              },
            ],
            caption: "Disjoint blocks [8,10] and [15,18] append after [1,6].",
          },
        },
        {
          title: "Activity Selection: sort by end and drop conflicting [1,5]",
          tag: "TRACE",
          explanation: [
            "Sort `[[1,5], [1,2], [4,6], [2,4]]` by `end`: `[[1,2], [2,4], [1,5], [4,6]]`. Accept `[1,2]` (`prev_end = 2`) and `[2,4]` (`2 >= 2`, `prev_end = 4`).",
            "At `[1,5]`, `start = 1 < prev_end (4)`, so we drop `[1,5]` to protect room for later intervals.",
          ],
          code: [
            "sort intervals by end ascending",
            "prev_end ← intervals[0].end, kept ← 1",
            "for each [s, e] in intervals[1..]:",
            "    if s >= prev_end:",
            "        kept ← kept + 1; prev_end ← e",
            "    // else drop overlapping interval",
          ],
          activeLines: [1, 4, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "prev_end", value: "4", changed: true },
            { name: "Kept so far", value: "2 ([1,2], [2,4])", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Sorted by end (scanning index 2)",
                cells: [
                  { id: "as0", value: "[1, 2]", index: 0, state: "done" },
                  { id: "as1", value: "[2, 4]", index: 1, state: "done" },
                  { id: "as2", value: "[1, 5] x", index: 2, state: "pivot" },
                  { id: "as3", value: "[4, 6]", index: 3 },
                ],
                pointers: [{ index: 2, label: "1 < 4 drop", tone: "coral" }],
              },
            ],
            caption: "Dropping [1,5] keeps prev_end at 4 so [4,6] remains eligible.",
          },
        },
        {
          title: "Activity Selection: accept [4,6] for 3 disjoint talks",
          tag: "TRACE",
          explanation: [
            "At the final interval `[4,6]`, `start = 4 >= prev_end (4)`, so we accept it (`kept = 3`, `prev_end = 6`).",
            "Sorting by earliest end kept `3` talks and removed only `1` (`[1,5]`).",
          ],
          code: [
            "sort intervals by end ascending",
            "prev_end ← intervals[0].end, kept ← 1",
            "for each [s, e] in intervals[1..]:",
            "    if s >= prev_end:",
            "        kept ← kept + 1",
            "        prev_end ← e",
          ],
          activeLines: [4, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "prev_end", value: "6", changed: true },
            { name: "Kept / Removed", value: "3 / 1", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Final selected non-overlapping talks",
                cells: [
                  { id: "as0", value: "[1, 2]", index: 0, state: "done" },
                  { id: "as1", value: "[2, 4]", index: 1, state: "done" },
                  { id: "as2", value: "[1, 5] x", index: 2, state: "dim" },
                  { id: "as3", value: "[4, 6]", index: 3, state: "active" },
                ],
                pointers: [{ index: 3, label: "4 >= 4 keep", tone: "ok" }],
              },
            ],
            caption: "Earliest-end selection fits 3 disjoint intervals: [1,2], [2,4], [4,6].",
          },
        },
        {
          title: "Meeting Rooms II: [0, 30] and [5, 10] require 2 concurrent rooms",
          tag: "MEMORY",
          explanation: [
            "Sort meetings by `start`: `[0, 30]`, `[5, 10]`, `[15, 20]`. Meeting `[0, 30]` takes room 1 (`heap = [30]`).",
            "Next, `[5, 10]` sees `heap.peek() = 30 > 5`, so room 1 is still busy; we open room 2 (`heap = [10, 30]`).",
          ],
          code: [
            "sort intervals by start ascending",
            "for each [s, e] in intervals:",
            "    if not heap.empty() and heap.peek() <= s:",
            "        heap.pop()",
            "    heap.push(e)",
          ],
          activeLines: [3, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Processed", value: "[0,30], [5,10]", changed: true },
            { name: "heap.peek()", value: "10 (room 2)", changed: true },
            { name: "Active rooms", value: "2", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Min-Heap backing array (heap[0] = earliest end)",
                cells: [
                  { id: "rm2", value: "10 (rm2)", index: 0, state: "active" },
                  { id: "rm1", value: "30 (rm1)", index: 1 },
                ],
                pointers: [{ index: 0, label: "heap.peek()", tone: "coral" }],
              },
            ],
            caption: "Min-Heap keeps the earliest-ending active room (10) at index 0.",
          },
        },
        {
          title: "Meeting Rooms II: [15, 20] reuses freed room 2 (end = 10)",
          tag: "MEMORY",
          explanation: [
            "When `[15, 20]` arrives, `heap.peek() = 10 <= 15`: room 2 has finished!",
            "We pop `10` and push `20`, keeping `heap.size() = 2` rooms instead of opening a third.",
          ],
          code: [
            "sort intervals by start ascending",
            "for each [s, e] in intervals:",
            "    if not heap.empty() and heap.peek() <= s:",
            "        heap.pop()",
            "    heap.push(e)",
            "return heap.size()",
          ],
          activeLines: [3, 4, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "Incoming meeting", value: "[15, 20]" },
            { name: "Earliest end popped", value: "10", changed: true },
            { name: "Rooms needed", value: "2", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Min-Heap backing array after pop(10) + push(20)",
                cells: [
                  { id: "rm2", value: "20 (rm2)", index: 0, state: "active" },
                  { id: "rm1", value: "30 (rm1)", index: 1, state: "done" },
                ],
                pointers: [{ index: 0, label: "min end = 20", tone: "ok" }],
              },
            ],
            caption: "Popping 10 from index 0 and pushing 20 reuses room 2 without allocating a third room.",
          },
        },
        {
          title: "Sweep-Line view: +1 start and -1 end events",
          tag: "CHECK",
          explanation: [
            "Splitting `[0, 30]`, `[5, 10]`, `[15, 20]` into boundary events gives `(0, +1)`, `(5, +1)`, `(10, -1)`, `(15, +1)`, `(20, -1)`, `(30, -1)`.",
            "Scanning left to right tracks `active` rooms (`1 -> 2 -> 1 -> 2 -> 1 -> 0`), confirming the peak concurrent demand is `2`.",
          ],
          code: [
            "events ← [(s, +1), (e, -1) for each [s, e]]",
            "sort events by (time asc, delta asc)   // -1 before +1",
            "active ← 0, best ← 0",
            "for each (t, delta) in events:",
            "    active ← active + delta",
            "    best ← max(best, active)",
          ],
          activeLines: [2, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "Running active", value: "1 -> 2 -> 1 -> 2 -> 1 -> 0" },
            { name: "Peak rooms best", value: "2", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Sorted sweep-line events (time, delta)",
                cells: [
                  { id: "ev0", value: "0: +1 (1)", index: 0, state: "done" },
                  { id: "ev1", value: "5: +1 (2)", index: 1, state: "active" },
                  { id: "ev2", value: "10: -1 (1)", index: 2, state: "done" },
                  { id: "ev3", value: "15: +1 (2)", index: 3, state: "active" },
                  { id: "ev4", value: "20: -1 (1)", index: 4, state: "done" },
                  { id: "ev5", value: "30: -1 (0)", index: 5, state: "dim" },
                ],
                pointers: [
                  { index: 1, label: "peak 2", tone: "coral" },
                  { index: 3, label: "peak 2", tone: "coral" },
                ],
              },
            ],
            caption: "Event sweep tracks active count across sorted endpoints in O(n log n).",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Sorting by start for Activity Selection",
        detail:
          "Picking the earliest-starting interval `[0, 100]` blocks every shorter interval inside it. Always sort by `end` ascending when maximizing disjoint intervals or minimizing removals.",
      },
      {
        title: "Tie-breaking sweep events at equal timestamps",
        detail:
          "If meeting A ends at `10` and meeting B starts at `10`, processing `(10, +1)` before `(10, -1)` falsely inflates the active count by 1. Sort `-1` before `+1` when timestamps match (or use `heap.peek() <= start`).",
      },
      {
        title: "Mutating input intervals vs copying",
        detail:
          "In Merge Intervals, pushing a fresh copy `[s, e]` into `merged` prevents accidental mutation of the caller's input arrays through shared references (Module 00).",
      },
    ],
    predictChecks: [
      {
        prompt: "Meetings are [[0, 10], [10, 20]]. Sorting sweep events by timestamp ascending, then delta descending (+1 before -1) causes what result?",
        code: "events = [(0, +1), (10, -1), (10, +1), (20, -1)]\nsort events by (time asc, delta desc)\nactive = 0; best = 0\nfor (t, delta) in events:\n    active += delta\n    best = max(best, active)\nreturn best",
        options: [
          { id: "a", label: "Returns 1, because both meetings share endpoint 10" },
          { id: "b", label: "Returns 2 instead of 1, because (10, +1) increments active before (10, -1) frees the room" },
          { id: "c", label: "Returns 0, because active drops below zero at t = 10" },
          { id: "d", label: "Returns 2 only when the input intervals are unsorted" },
        ],
        correctId: "b",
        explanation: "At t = 10, sorting delta descending processes the starting meeting (+1) before the ending meeting (-1), raising active from 1 to 2. Sort by (time asc, delta asc) so -1 runs before +1.",
      },
      {
        prompt: "This greedy selector picks maximum disjoint intervals from [[1, 10], [2, 3], [4, 5], [6, 7]], but sorts by start time instead of end time. What count does it return?",
        code: "sort intervals by start asc\ncount = 0; prev_end = -INF\nfor (s, e) in intervals:\n    if s >= prev_end:\n        count += 1\n        prev_end = e\nreturn count",
        options: [
          { id: "a", label: "3, picking [2, 3], [4, 5], and [6, 7]" },
          { id: "b", label: "2, picking [1, 10] and [6, 7]" },
          { id: "c", label: "1, because [1, 10] sets prev_end = 10 and blocks all shorter intervals" },
          { id: "d", label: "4, because all intervals have distinct start times" },
        ],
        correctId: "c",
        explanation: "Sorting by start chooses [1, 10] first, pushing prev_end to 10 and rejecting [2, 3], [4, 5], and [6, 7]. Sorting by end time ascending picks [2, 3] first and yields 3.",
      },
    ],
    practiceTask: {
      title: "Merge Overlapping Intervals",
      tier: "Warmup",
      goal: "Given a list of `[start, end]` intervals, merge all overlapping intervals and return the disjoint sorted list.",
      constraints: ["1 <= len(intervals) <= 10^4", "0 <= start <= end <= 10^4", "Target time: O(n log n)"],
      examples: [
        { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
        { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]", explanation: "Touching endpoints count as overlapping." },
      ],
      tasks: [
        "Sort `intervals` by `start` ascending.",
        "Scan left to right, extending `merged[-1][1]` when `curr[0] <= merged[-1][1]`.",
      ],
      starterCode: "function merge_intervals(intervals):\n    // TODO: sort by start and merge overlapping intervals",
      expectedOutput: "[[1,6],[8,10],[15,18]]\n[[1,5]]",
      hint: "Remember to take `max(merged[-1][1], curr[1])` because `curr` might end *inside* `merged[-1]`.",
      complexity: { time: "O(n log n)", space: "O(n)" },
      solutionCode:
        "function merge_intervals(intervals):\n    sort intervals by start ascending\n    merged ← [[intervals[0][0], intervals[0][1]]]\n    for i from 1 to len(intervals) - 1:\n        s ← intervals[i][0]\n        e ← intervals[i][1]\n        if s <= merged[-1][1]:\n            merged[-1][1] ← max(merged[-1][1], e)\n        else:\n            merged.append([s, e])\n    return merged",
    },
    practiceChallenges: [
      {
        title: "Merge Overlapping Intervals",
        tier: "Warmup",
        goal: "Merge all overlapping `[start, end]` intervals into disjoint sorted ranges.",
        constraints: ["1 <= len(intervals) <= 10^4", "Target time: O(n log n)"],
        examples: [
          { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
          { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
        ],
        tasks: ["Sort by `start` and merge whenever `curr.start <= last.end`."],
        starterCode: "function merge_intervals(intervals):\n    // TODO: sort by start and merge",
        expectedOutput: "[[1,6],[8,10],[15,18]]\n[[1,5]]",
        hint: "What if `[1, 10]` is followed by `[2, 5]`? Use `max(last.end, curr.end)` so `last.end` never shrinks.",
        complexity: { time: "O(n log n)", space: "O(n)" },
        solutionCode:
          "function merge_intervals(intervals):\n    sort intervals by start ascending\n    merged ← [[intervals[0][0], intervals[0][1]]]\n    for i from 1 to len(intervals) - 1:\n        if intervals[i][0] <= merged[-1][1]:\n            merged[-1][1] ← max(merged[-1][1], intervals[i][1])\n        else:\n            merged.append([intervals[i][0], intervals[i][1]])\n    return merged",
      },
      {
        title: "Insert Interval in Linear Time",
        tier: "Core",
        goal: "Given non-overlapping `intervals` already sorted by `start` and a `newInterval = [s, e]`, insert `newInterval` and merge any overlaps in `O(n)` time.",
        constraints: ["0 <= len(intervals) <= 10^4", "Input already sorted by start", "Target time: O(n)"],
        examples: [
          { input: "intervals = [[1,3],[6,9]], newInterval = [2,5]", output: "[[1,5],[6,9]]" },
          { input: "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]", output: "[[1,2],[3,10],[12,16]]" },
        ],
        tasks: [
          "Phase 1: append intervals with `end < newInterval[0]`.",
          "Phase 2: while `start <= newInterval[1]`, expand `newInterval` with `min` start and `max` end; then append `newInterval`.",
          "Phase 3: append all remaining intervals.",
        ],
        starterCode: "function insert_interval(intervals, newInterval):\n    // TODO: 3-phase O(n) scan",
        expectedOutput: "[[1,5],[6,9]]\n[[1,2],[3,10],[12,16]]",
        hint: "Do not call `sort`; use an index `i` across three sequential `while` loops.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function insert_interval(intervals, newInterval):\n    res ← []\n    i ← 0\n    n ← len(intervals)\n    cur ← [newInterval[0], newInterval[1]]\n    while i < n and intervals[i][1] < cur[0]:\n        res.append(intervals[i])\n        i ← i + 1\n    while i < n and intervals[i][0] <= cur[1]:\n        cur[0] ← min(cur[0], intervals[i][0])\n        cur[1] ← max(cur[1], intervals[i][1])\n        i ← i + 1\n    res.append(cur)\n    while i < n:\n        res.append(intervals[i])\n        i ← i + 1\n    return res",
      },
      {
        title: "Minimum Removals for Disjoint Intervals",
        tier: "Stretch",
        goal: "Given `intervals`, return the minimum number of intervals to remove so the rest do not overlap (touching at `[1,2]` and `[2,3]` is allowed).",
        constraints: ["1 <= len(intervals) <= 10^5", "Target time: O(n log n)"],
        examples: [
          { input: "intervals = [[1,2],[2,3],[3,4],[1,3]]", output: "1", explanation: "Remove [1,3]." },
          { input: "intervals = [[1,2],[1,2],[1,2]]", output: "2" },
        ],
        tasks: [
          "Sort `intervals` by `end` ascending.",
          "Whenever `curr.start < prev_end`, increment `removed`; otherwise update `prev_end = curr.end`.",
        ],
        starterCode: "function erase_overlap_intervals(intervals):\n    // TODO: sort by end and count conflicts",
        expectedOutput: "1\n2",
        hint: "When two intervals overlap, keeping the one with the smaller `end` always leaves more room.",
        complexity: { time: "O(n log n)", space: "O(1) extra" },
        solutionCode:
          "function erase_overlap_intervals(intervals):\n    sort intervals by end ascending\n    prev_end ← intervals[0][1]\n    removed ← 0\n    for i from 1 to len(intervals) - 1:\n        if intervals[i][0] < prev_end:\n            removed ← removed + 1\n        else:\n            prev_end ← intervals[i][1]\n    return removed",
      },
    ],
  },

  "dsa-greedy-paths": {
    lessonId: "dsa-greedy-paths",
    subtitle:
      "Replace O(n^2) jump or circuit scans with O(n) greedy reach invariants, and build optimal prefix-free Huffman codes using a Module 15 Min-Heap.",
    intro: {
      heading: "Greedy Array Walks & Huffman Encoding",
      explanation: [
        "On `nums = [2, 3, 1, 1, 4]`, always taking the maximum jump from index `0` lands at index `2` (`value = 1`), forcing `0 -> 2 -> 3 -> 4` (`3` jumps) when `0 -> 1 -> 4` takes `2`. Similarly, testing every starting pump in **Gas Station** takes `O(n^2)` time and times out at `n = 10^5`. Both problems yield to a single `O(n)` pass that tracks a frontier invariant (`furthest` reach or `tank` reset) without backtracking.",
        "Greedy tree construction works the same way with a **Min-Heap** (Module 15). **Huffman Coding** shrinks message size by merging the two lowest-frequency symbols repeatedly into a binary tree whose root-to-leaf bit paths are **prefix-free** so bitstreams decode uniquely left to right.",
      ],
      analogy:
        "Crossing stepping stones in the dark requires remembering the farthest stone reachable from your current wave of stones, rather than committing early to the farthest single leap. In Huffman coding, frequent letters stay near the top with short codes while rare letters sink to deeper branches.",
      realWorldUses: [
        "Lossless compression in ZIP, GZIP, PNG, and HTTP/2 headers via Huffman trees",
        "Linear-time jump reachability and circular route feasibility checks",
      ],
    },
    sections: [
      {
        heading: "Three O(n) greedy array walks and common off-by-one failures",
        paragraphs: [
          "In **Jump Game**, `nums[i]` is the max jump from index `i`. Track `max_reach = 0`: if `i > max_reach`, index `i` is unreachable (`return false`); else set `max_reach = max(max_reach, i + nums[i])`. In **Jump Game II**, track jump levels `(current_end, furthest)` while `i < len(nums) - 1`: update `furthest = max(furthest, i + nums[i])`, and when `i == current_end`, increment `jumps` and set `current_end = furthest`. Looping up to `len(nums) - 1` breaks on `[2, 3, 1, 1, 4]` because `current_end` hits `4` at `i = 2`, and visiting `i = 4` triggers `4 == 4` for a bogus `3rd` jump.",
          "In **Gas Station**, station `i` gives `gas[i]` fuel and costs `cost[i]` to reach `i + 1`. Keep `total_surplus += gas[i] - cost[i]` and `tank += gas[i] - cost[i]`. If `tank < 0` at `i`, every start from `start` through `i` fails: starting at any middle station `m` in `[start + 1..i]` would enter `m` with `0` tank, leaving strictly less fuel than entering `m` with `>= 0`. Resetting `start = i + 1` and `tank = 0` skips the whole block in `O(1)` time; at the end, return `start` if `total_surplus >= 0` else `-1`.",
        ],
        table: {
          caption: "Linear greedy array walks: working rule vs broken trap",
          headers: ["Problem", "Invariant tracked", "Broken trap", "Working rule (`O(n)` / `O(1)`)"],
          rows: [
            ["Jump Game", "`max_reach`", "Stopping at `0` even if earlier index jumps over it", "Fail only when `i > max_reach`; else `max(max_reach, i + nums[i])`"],
            ["Jump Game II", "`current_end`, `furthest`, `jumps`", "Looping `0..n-1` adds a phantom jump at `i = n - 1`", "Loop `0..n-2`; at `i == current_end`, `jumps++`, `current_end = furthest`"],
            ["Gas Station", "`tank`, `total_surplus`, `start`", "Checking only `tank >= 0` on suffix `[start..n-1]`", "Reset `start = i + 1, tank = 0` when `tank < 0`; require `total_surplus >= 0`"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "KEY IDEA",
          text: "In Gas Station, `tank < 0` at index `i` eliminates the entire candidate block `[start..i]` in one step. One `O(n)` pass replaces trying every starting station in `O(n^2)` time.",
        },
      },
      {
        heading: "Huffman Coding: prefix-free trees via a Min-Heap",
        paragraphs: [
          "Suppose a message uses `A` (5 times), `B` (9), `C` (12), and `D` (16). Fixed-width 2-bit codes (`00, 01, 10, 11`) spend `2 * 42 = 84` bits. Naive variable codes like `D=0, C=1, A=01, B=11` fail decoding because `011` could mean `D-B` or `A-C`. Codes must be **prefix-free** (no codeword starts another) so bitstreams decode uniquely left to right.",
          "**Huffman Coding** puts each `(freq, symbol)` node into a Module 15 **Min-Heap**. While `heap.size() > 1`, pop the two nodes with smallest frequency (`left` and `right`), create a parent node with frequency `left.freq + right.freq` (`0` edge to `left`, `1` edge to `right`), and push the parent back. Putting the two rarest symbols at the deepest leaves minimizes total weighted bits `sum(freq * depth)` in `O(k log k)` time for `k` distinct symbols.",
        ],
        code: [
          "function build_huffman_tree(freq_map):",
          "    heap ← MinHeap()                          // ordered by node.freq (M15)",
          "    for each (ch, f) in freq_map:",
          "        heap.push(Node(freq=f, char=ch))",
          "    while heap.size() > 1:",
          "        left ← heap.pop()",
          "        right ← heap.pop()",
          "        merged ← Node(freq=left.freq + right.freq, left=left, right=right)",
          "        heap.push(merged)",
          "    return heap.pop()                         // root of prefix-free tree",
          "",
          "function extract_codes(node, bits, codes):",
          "    if node.char != null:",
          "        codes[node.char] ← \"0\" if len(bits) == 0 else bits",
          "        return",
          "    extract_codes(node.left, bits + \"0\", codes)",
          "    extract_codes(node.right, bits + \"1\", codes)",
        ],
        codeLabel: "Pseudocode",
        visual: {
          kind: "dsa-graph",
          nodes: [
            { id: "root", label: "42", x: 50, y: 10, badge: "root", state: "visited" },
            { id: "d", label: "D:16", x: 22, y: 38, badge: "0", state: "default" },
            { id: "n2", label: "26", x: 70, y: 38, state: "visited" },
            { id: "c", label: "C:12", x: 46, y: 68, badge: "10", state: "default" },
            { id: "n1", label: "14", x: 75, y: 68, state: "visited" },
            { id: "a", label: "A:5", x: 62, y: 95, badge: "110", state: "default" },
            { id: "b", label: "B:9", x: 88, y: 95, badge: "111", state: "active" },
          ],
          edges: [
            { from: "root", to: "d", weight: "0", directed: true },
            { from: "root", to: "n2", weight: "1", directed: true, state: "active" },
            { from: "n2", to: "c", weight: "0", directed: true },
            { from: "n2", to: "n1", weight: "1", directed: true, state: "active" },
            { from: "n1", to: "a", weight: "0", directed: true },
            { from: "n1", to: "b", weight: "1", directed: true, state: "active" },
          ],
          caption: "Huffman Tree after merging lightest pairs: every symbol sits at a leaf so DFS extracts prefix-free codes.",
        },
        callout: {
          kind: "WATCH OUT",
          text: "Handle two small edge cases explicitly: in Jump Game II, stop the loop at `n - 2` (for `n == 1`, return `0` jumps without entering the loop); in Huffman Coding, if there is only `1` distinct character, assign it `\"0\"` so repeated characters still produce `1` bit each.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build Gas Station from O(n^2) Simulation to O(n) Tank Reset",
      steps: [
        {
          label: "Step 1: Naive O(n^2) — test every candidate start station",
          explanation:
            "Simulating a full loop from every station `s` works on tiny arrays (`n = 5`) but takes `O(n^2)` steps on large routes.",
          code: [
            "for s from 0 to n - 1:                   // O(n^2) total",
            "    tank ← 0, ok ← true",
            "    for step from 0 to n - 1:",
            "        idx ← (s + step) % n",
            "        tank ← tank + gas[idx] - cost[idx]",
            "        if tank < 0: ok ← false; break",
            "    if ok: return s",
          ],
          activeLines: [1, 5, 6],
          output: "Works for n=5, times out at n=10^5",
        },
        {
          label: "Step 2: Single-pass tank reset skips impossible prefixes",
          explanation:
            "Whenever `tank < 0` at `i`, every start in `[start..i]` runs dry at or before `i`, so jump `start` straight to `i + 1`.",
          code: [
            "tank ← 0, start ← 0",
            "for i from 0 to n - 1:",
            "    tank ← tank + (gas[i] - cost[i])",
            "    if tank < 0:",
            "        start ← i + 1",
            "        tank ← 0",
          ],
          activeLines: [4, 5, 6],
          output: "Skips failed starts in O(n), still needs global feasibility check",
        },
        {
          label: "Step 3: Track total_surplus to catch impossible circuits",
          explanation:
            "Accumulating `total_surplus` across all stations separates a valid wrap-around (`total_surplus >= 0`) from an impossible circuit (`-1`).",
          code: [
            "total_surplus ← 0, tank ← 0, start ← 0",
            "for i from 0 to n - 1:",
            "    diff ← gas[i] - cost[i]",
            "    total_surplus ← total_surplus + diff",
            "    tank ← tank + diff",
            "    if tank < 0: start ← i + 1; tank ← 0",
            "return start if total_surplus >= 0 else -1",
          ],
          activeLines: [4, 7],
          output: "gas=[1,2,3,4,5], cost=[3,4,5,1,2] -> 3; total < 0 -> -1",
        },
      ],
    },
    walkthrough: {
      title: "Trace Jump Game II, Gas Station Reset, and Huffman Tree Construction",
      layout: "visual-first",
      steps: [
        {
          title: "Jump Game II: commit jump 1 from index 0",
          tag: "TRACE",
          explanation: [
            "On `nums = [2, 3, 1, 1, 4]` (`n = 5`), start with `jumps = 0`, `current_end = 0`, `furthest = 0`.",
            "At `i = 0`, `furthest = max(0, 0 + 2) = 2`. Since `i == current_end` (`0 == 0`), we take our first jump (`jumps = 1`) and expand our window to `current_end = 2`.",
          ],
          code: [
            "jumps ← 0, current_end ← 0, furthest ← 0",
            "for i from 0 to len(nums) - 2:",
            "    furthest ← max(furthest, i + nums[i])",
            "    if i == current_end:",
            "        jumps ← jumps + 1",
            "        current_end ← furthest",
          ],
          activeLines: [3, 4, 5, 6],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "jumps = current_end = furthest = 0",
              "for i in range(len(nums) - 1):",
              "    furthest = max(furthest, i + nums[i])",
              "    if i == current_end:",
              "        jumps += 1",
              "        current_end = furthest",
            ],
          },
          state: [
            { name: "i", value: "0" },
            { name: "furthest", value: "2", changed: true },
            { name: "jumps / current_end", value: "1 / 2", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Jump Game II levels (nums = [2, 3, 1, 1, 4])",
                cells: [
                  { id: "jg0", value: "2", index: 0, state: "done" },
                  { id: "jg1", value: "3", index: 1, state: "active" },
                  { id: "jg2", value: "1", index: 2, state: "active" },
                  { id: "jg3", value: "1", index: 3 },
                  { id: "jg4", value: "4", index: 4 },
                ],
                highlightRange: [1, 2],
                pointers: [
                  { index: 0, label: "i=0", tone: "accent" },
                  { index: 2, label: "end=2", tone: "coral" },
                ],
              },
            ],
            caption: "Jump 1 covers indices [1..2] without picking a specific landing spot yet.",
          },
        },
        {
          title: "Jump Game II: reach target with jump 2",
          tag: "TRACE",
          explanation: [
            "At `i = 1`, `furthest = max(2, 1 + 3) = 4`. At `i = 2`, `furthest` stays `4` and `i == current_end` (`2 == 2`), so `jumps` becomes `2` and `current_end = 4`.",
            "Stopping the loop at `n - 2 = 3` updates `furthest` at `i = 3` (`4`) without adding a spurious jump at `i = 4`.",
          ],
          code: [
            "jumps ← 0, current_end ← 0, furthest ← 0",
            "for i from 0 to len(nums) - 2:",
            "    furthest ← max(furthest, i + nums[i])",
            "    if i == current_end:",
            "        jumps ← jumps + 1",
            "        current_end ← furthest",
          ],
          activeLines: [2, 3, 4, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "2" },
            { name: "furthest", value: "4", changed: true },
            { name: "jumps / current_end", value: "2 / 4", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Level 2 reaches last index 4",
                cells: [
                  { id: "jg0", value: "2", index: 0, state: "done" },
                  { id: "jg1", value: "3", index: 1, state: "done" },
                  { id: "jg2", value: "1", index: 2, state: "done" },
                  { id: "jg3", value: "1", index: 3, state: "active" },
                  { id: "jg4", value: "4", index: 4, state: "done" },
                ],
                highlightRange: [3, 4],
                pointers: [
                  { index: 2, label: "i=2 (jump 2)", tone: "accent" },
                  { index: 4, label: "end=4", tone: "ok" },
                ],
              },
            ],
            caption: "Minimum jumps = 2 (0 -> 1 -> 4) found in one O(n) pass.",
          },
        },
        {
          title: "Gas Station: reset start when tank drops below 0",
          tag: "PITFALL",
          explanation: [
            "Let net deltas `gas[i] - cost[i]` be `[-2, -2, -2, +3, +3]` (`total_surplus = 0 >= 0`).",
            "Starting at `0`, `tank` goes negative at indices `0`, `1`, and `2`, each time resetting `start = i + 1` and `tank = 0`. From `start = 3`, `tank` grows `3 -> 6 >= 0`, so index `3` completes the loop.",
          ],
          code: [
            "total ← 0, tank ← 0, start ← 0",
            "for i from 0 to len(gas) - 1:",
            "    diff ← gas[i] - cost[i]",
            "    total ← total + diff, tank ← tank + diff",
            "    if tank < 0:",
            "        start ← i + 1, tank ← 0",
            "return start if total >= 0 else -1",
          ],
          activeLines: [4, 5, 6, 7],
          codeLabel: "Pseudocode",
          state: [
            { name: "Candidate start", value: "3", changed: true },
            { name: "Suffix tank", value: "+6", changed: true },
            { name: "total_surplus", value: "0 (>= 0)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Net fuel delta (gas[i] - cost[i])",
                cells: [
                  { id: "gs0", value: "-2", index: 0, state: "dim" },
                  { id: "gs1", value: "-2", index: 1, state: "dim" },
                  { id: "gs2", value: "-2", index: 2, state: "dim" },
                  { id: "gs3", value: "+3", index: 3, state: "active" },
                  { id: "gs4", value: "+3", index: 4, state: "done" },
                ],
                pointers: [
                  { index: 2, label: "tank < 0 reset", tone: "coral" },
                  { index: 3, label: "start=3", tone: "ok" },
                ],
              },
            ],
            caption: "Any start in [0..2] runs dry before index 3; index 3 finishes the circuit.",
          },
        },
        {
          title: "Huffman Coding: merge two smallest nodes in Min-Heap",
          tag: "PATTERN",
          explanation: [
            "Start with symbol frequencies in an M15 Min-Heap: `A:5, B:9, C:12, D:16`.",
            "Round 1 pops `A:5` and `B:9` and pushes internal node `N1:14`. The heap now holds `C:12, N1:14, D:16`; next round merges `C:12` with `N1:14` into `N2:26`.",
          ],
          code: [
            "while heap.size() > 1:",
            "    left ← heap.pop()",
            "    right ← heap.pop()",
            "    merged ← Node(left.freq + right.freq, left, right)",
            "    heap.push(merged)",
          ],
          activeLines: [1, 2, 3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Popped pair", value: "A:5 and B:9", changed: true },
            { name: "Pushed parent", value: "N1:14", changed: true },
            { name: "Remaining heap", value: "[C:12, N1:14, D:16]" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Min-Heap backing array after popping A:5 + B:9 -> N1:14",
                cells: [
                  { id: "hf_c", value: "C:12", index: 0, state: "active" },
                  { id: "hf_n1", value: "N1:14", index: 1, state: "done" },
                  { id: "hf_d", value: "D:16", index: 2 },
                ],
                pointers: [{ index: 0, label: "heap.min", tone: "coral" }],
              },
            ],
            caption: "Round 1 merges A:5 and B:9 into N1:14, leaving [C:12, N1:14, D:16] in the Min-Heap.",
          },
        },
        {
          title: "Huffman Round 2: merge C(12) and N1(14) into N2(26)",
          tag: "TRACE",
          explanation: [
            "Popping the two smallest entries from `[C:12, N1:14, D:16]` pairs `C:12` (left, `0`) and `N1:14` (right, `1`) into internal node `N2:26`.",
            "Pushing `N2:26` back leaves `[D:16, N2:26]` in the Min-Heap, ready for the final merge into Root:42.",
          ],
          code: [
            "left ← heap.pop()    // C:12",
            "right ← heap.pop()   // N1:14",
            "merged ← Node(26, left, right)",
            "heap.push(merged)    // heap: [D:16, N2:26]",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Popped pair", value: "C:12 + N1:14", changed: true },
            { name: "Merged subtree", value: "N2:26", changed: true },
            { name: "Remaining heap", value: "[D:16, N2:26]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Min-Heap backing array after Round 2",
                cells: [
                  { id: "h2_d", value: "D:16", index: 0, state: "active" },
                  { id: "h2_n2", value: "N2:26", index: 1, state: "done" },
                ],
                pointers: [
                  { index: 0, label: "left (0)", tone: "coral" },
                  { index: 1, label: "right (1)", tone: "accent" },
                ],
              },
            ],
            caption: "Round 2 merges C:12 and N1:14 into N2:26; D:16 and N2:26 remain for Root:42.",
          },
        },
        {
          title: "Huffman DFS: extract prefix-free codewords D=0, C=10, A=110, B=111",
          tag: "CHECK",
          explanation: [
            "After merging `D:16 + N2:26 -> Root:42`, a single DFS (`extract_codes(root, \"\", codes)`) appends `'0'` going left and `'1'` going right.",
            "Following `root -> 26 (1) -> 14 (1) -> B:9 (1)` assigns `B = 111`, bringing total weighted bit length down from `84` to `82` prefix-free bits.",
          ],
          code: [
            "function extract_codes(node, bits, codes):",
            "    if node.char != null:",
            "        codes[node.char] ← \"0\" if len(bits) == 0 else bits",
            "        return",
            "    extract_codes(node.left, bits + \"0\", codes)",
            "    extract_codes(node.right, bits + \"1\", codes)",
          ],
          activeLines: [1, 2, 3, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "Codes", value: "D:0, C:10, A:110, B:111", changed: true },
            { name: "Active path", value: "42 -> 26 -> 14 -> B (111)", changed: true },
            { name: "Total bits", value: "82 (prefix-free)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Extracted prefix-free codebook via DFS",
                cells: [
                  { id: "hc_d", value: "D: 0 (16x)", index: 0, state: "done" },
                  { id: "hc_c", value: "C: 10 (12x)", index: 1, state: "done" },
                  { id: "hc_a", value: "A: 110 (5x)", index: 2, state: "done" },
                  { id: "hc_b", value: "B: 111 (9x)", index: 3, state: "active" },
                ],
                pointers: [{ index: 3, label: "r->N2->N1->B", tone: "ok" }],
              },
            ],
            caption: "Prefix-free leaf codewords produce 16*1 + 12*2 + 5*3 + 9*3 = 82 bits (vs 84 fixed-width).",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Looping up to n - 1 instead of n - 2 in Jump Game II",
        detail:
          "If `current_end` lands exactly on `n - 1` at the end of the loop, visiting `i = n - 1` would trigger `i == current_end` and add an extra unnecessary jump. Loop only while `i < n - 1`.",
      },
      {
        title: "Skipping the total_surplus check in Gas Station",
        detail:
          "A positive suffix `[start..n-1]` alone does not prove the wrap-around leg succeeds. Always return `-1` if `total_surplus < 0`.",
      },
      {
        title: "Single-symbol edge case in Huffman Coding",
        detail:
          "When all characters in the input are identical (e.g. `\"aaaa\"`), the tree has a single node and `while heap.size() > 1` never runs. Assign that lone symbol code `\"0\"` so its length is `1` bit per symbol rather than `0`.",
      },
    ],
    practiceTask: {
      title: "Check Reachability to Final Tile",
      tier: "Warmup",
      goal: "Given non-negative integers `nums` where `nums[i]` is your max jump from `i`, return `true` if you can reach the last index starting from `0`.",
      constraints: ["1 <= len(nums) <= 10^4", "0 <= nums[i] <= 10^5", "Target: O(n) time, O(1) space"],
      examples: [
        { input: "nums = [2, 3, 1, 1, 4]", output: "true" },
        { input: "nums = [3, 2, 1, 0, 4]", output: "false", explanation: "All paths stall at index 3." },
      ],
      tasks: [
        "Maintain `max_reach = 0` as you scan `i` from `0` to `n - 1`.",
        "Return `false` if `i > max_reach`; otherwise update `max_reach = max(max_reach, i + nums[i])`.",
      ],
      starterCode: "function can_jump(nums):\n    // TODO: single-pass O(n) reachability check",
      expectedOutput: "true\nfalse",
      hint: "You can even exit early with `true` as soon as `max_reach >= len(nums) - 1`.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function can_jump(nums):\n    max_reach ← 0\n    for i from 0 to len(nums) - 1:\n        if i > max_reach:\n            return false\n        max_reach ← max(max_reach, i + nums[i])\n    return true",
    },
    practiceChallenges: [
      {
        title: "Check Reachability to Final Tile",
        tier: "Warmup",
        goal: "Determine whether index `n - 1` is reachable from index `0` given max jump lengths `nums`.",
        constraints: ["1 <= len(nums) <= 10^4", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [2, 3, 1, 1, 4]", output: "true" },
          { input: "nums = [3, 2, 1, 0, 4]", output: "false" },
        ],
        tasks: ["Track `max_reach` and fail immediately if `i > max_reach`."],
        starterCode: "function can_jump(nums):\n    // TODO: track max_reach in O(n)",
        expectedOutput: "true\nfalse",
        hint: "A `0` blocks you only if `max_reach` cannot step past it.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function can_jump(nums):\n    max_reach ← 0\n    for i from 0 to len(nums) - 1:\n        if i > max_reach:\n            return false\n        max_reach ← max(max_reach, i + nums[i])\n    return true",
      },
      {
        title: "Minimum Jumps to Reach the End",
        tier: "Core",
        goal: "Assuming index `n - 1` is reachable, return the minimum number of jumps from index `0` to `n - 1` in `O(n)` time.",
        constraints: ["1 <= len(nums) <= 10^4", "0 <= nums[i] <= 1000", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [2, 3, 1, 1, 4]", output: "2" },
          { input: "nums = [2, 3, 0, 1, 4]", output: "2" },
        ],
        tasks: [
          "Track `jumps`, `current_end`, and `furthest` across `i` from `0` to `n - 2`.",
          "Increment `jumps` and set `current_end = furthest` whenever `i == current_end`.",
        ],
        starterCode: "function min_jumps(nums):\n    // TODO: O(n) greedy furthest-reach levels",
        expectedOutput: "2\n2",
        hint: "Stop the loop at `len(nums) - 2` so arriving at `n - 1` never triggers an extra jump.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function min_jumps(nums):\n    jumps ← 0\n    current_end ← 0\n    furthest ← 0\n    for i from 0 to len(nums) - 2:\n        furthest ← max(furthest, i + nums[i])\n        if i == current_end:\n            jumps ← jumps + 1\n            current_end ← furthest\n    return jumps",
      },
      {
        title: "Circular Fuel Circuit Start Index",
        tier: "Stretch",
        goal: "Given `gas[i]` and `cost[i]` around a circular route, return the unique starting station index that lets you complete the full loop, or `-1` if impossible.",
        constraints: ["1 <= len(gas) <= 10^5", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]", output: "3" },
          { input: "gas = [2,3,4], cost = [3,4,3]", output: "-1" },
        ],
        tasks: [
          "Accumulate both `total_surplus` and current `tank`.",
          "When `tank < 0`, set `start = i + 1` and `tank = 0`.",
        ],
        starterCode: "function can_complete_circuit(gas, cost):\n    // TODO: single-pass reset on negative tank",
        expectedOutput: "3\n-1",
        hint: "If `total_surplus < 0`, no starting station exists anywhere on the circle.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function can_complete_circuit(gas, cost):\n    total ← 0\n    tank ← 0\n    start ← 0\n    for i from 0 to len(gas) - 1:\n        diff ← gas[i] - cost[i]\n        total ← total + diff\n        tank ← tank + diff\n        if tank < 0:\n            start ← i + 1\n            tank ← 0\n    if total >= 0:\n        return start\n    return -1",
      },
    ],
  },
};

export const dsaM16PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m16",
  title: "Module 16 Practice Set: Greedy Algorithms & Intervals",
  description:
    "Four mixed problems covering exchange-argument pairing, earliest-end interval scanning, concurrent event counting, and Min-Heap optimal merging.",
  problems: [
    {
      id: "dsa-m16-p1",
      title: "Minimum Rescue Boats for Passengers",
      patternHint:
        "Sort weights (Module 11) and pair the lightest with the heaviest using two pointers (Module 07), justified by an exchange argument (Lesson 16-1).",
      lessonRefId: "dsa-greedy-choice",
      goal: "Given passenger weights `people` and boat weight limit `limit`, each boat holds at most `2` people whose sum is `<= limit`. Return the minimum number of boats required.",
      constraints: ["1 <= len(people) <= 5 * 10^4", "1 <= people[i] <= limit <= 3 * 10^4", "Target time: O(n log n)"],
      examples: [
        { input: "people = [3, 2, 2, 1], limit = 3", output: "3", explanation: "(1, 2), (2), and (3)." },
        { input: "people = [3, 5, 3, 4], limit = 5", output: "4" },
      ],
      tasks: [
        "Sort `people` ascending and place `left = 0`, `right = n - 1`.",
        "Always board `people[right]`; if `people[left] + people[right] <= limit`, also board `people[left]` and advance `left += 1`.",
      ],
      starterCode: "function min_rescue_boats(people, limit):\n    // TODO: pair lightest with heaviest when possible",
      expectedOutput: "3\n4",
      hint: "If the lightest person cannot fit with the heaviest person, nobody else can pair with the heaviest person either.",
      complexity: { time: "O(n log n)", space: "O(1) extra" },
      solutionCode:
        "function min_rescue_boats(people, limit):\n    sort(people)\n    left ← 0\n    right ← len(people) - 1\n    boats ← 0\n    while left <= right:\n        if people[left] + people[right] <= limit:\n            left ← left + 1\n        right ← right - 1\n        boats ← boats + 1\n    return boats",
    },
    {
      id: "dsa-m16-p2",
      title: "Minimum Arrows for Horizontal Balloons",
      patternHint:
        "Sort spans by earliest end coordinate so each shot pierces the maximum overlapping group (Lesson 16-2).",
      lessonRefId: "dsa-intervals-sweep",
      goal: "Each balloon spans `[x_start, x_end]`. An arrow shot at `x` bursts every balloon with `x_start <= x <= x_end`. Return the minimum number of arrows needed to burst all balloons.",
      constraints: ["1 <= len(points) <= 10^5", "-2^31 <= x_start <= x_end <= 2^31 - 1", "Target time: O(n log n)"],
      examples: [
        { input: "points = [[10,16],[2,8],[1,6],[7,12]]", output: "2", explanation: "Shoot at x = 6 and x = 12." },
        { input: "points = [[1,2],[3,4],[5,6],[7,8]]", output: "4" },
      ],
      tasks: [
        "Sort `points` by `x_end` ascending (be careful of integer overflow if using subtraction in comparators).",
        "Shoot at `arrow_pos = points[0][1]`; whenever `curr[0] > arrow_pos`, increment `arrows` and set `arrow_pos = curr[1]`.",
      ],
      starterCode: "function min_arrows(points):\n    // TODO: sort by end coordinate and place arrows",
      expectedOutput: "2\n4",
      hint: "Remember touching endpoints `curr[0] == arrow_pos` still get burst by the same arrow!",
      complexity: { time: "O(n log n)", space: "O(1) extra" },
      solutionCode:
        "function min_arrows(points):\n    sort points by end ascending\n    arrows ← 1\n    arrow_pos ← points[0][1]\n    for i from 1 to len(points) - 1:\n        if points[i][0] > arrow_pos:\n            arrows ← arrows + 1\n            arrow_pos ← points[i][1]\n    return arrows",
    },
    {
      id: "dsa-m16-p3",
      title: "Peak Concurrent Compute Jobs",
      patternHint:
        "Track earliest finishing active jobs in a Min-Heap (Module 15) or sweep +1/-1 boundary events (Lesson 16-2).",
      lessonRefId: "dsa-intervals-sweep",
      goal: "Given job time windows `[start, end)` where a job finishing at `t` frees its worker immediately for a job starting at `t`, return the minimum workers needed.",
      constraints: ["1 <= len(jobs) <= 10^5", "0 <= start < end <= 10^9", "Target time: O(n log n)"],
      examples: [
        { input: "jobs = [[0,30],[5,10],[15,20]]", output: "2" },
        { input: "jobs = [[7,10],[2,4]]", output: "1" },
      ],
      tasks: [
        "Build `(start, +1)` and `(end, -1)` events, or sort by `start` with a Min-Heap of `end` times.",
        "Release a job's worker at end time `t` before a job starting at `t` claims one.",
      ],
      starterCode: "function min_workers(jobs):\n    // TODO: return peak simultaneous jobs",
      expectedOutput: "2\n1",
      hint: "In event sweep, sort ties by delta (`-1` before `+1`); in Min-Heap, reuse whenever `heap.peek() <= start`.",
      complexity: { time: "O(n log n)", space: "O(n)" },
      solutionCode:
        "function min_workers(jobs):\n    events ← []\n    for each [s, e] in jobs:\n        events.append((s, +1))\n        events.append((e, -1))\n    sort events by (time asc, delta asc)\n    active ← 0\n    peak ← 0\n    for each (t, d) in events:\n        active ← active + d\n        peak ← max(peak, active)\n    return peak",
    },
    {
      id: "dsa-m16-p4",
      title: "Minimum Total Cost to Join Ropes",
      patternHint:
        "Always merge the two shortest lengths first using a Min-Heap (Module 15), identical to Huffman tree construction (Lesson 16-3).",
      lessonRefId: "dsa-greedy-paths",
      goal: "Given positive rope lengths `ropes`, connecting two ropes of lengths `a` and `b` costs `a + b` and leaves one rope of length `a + b`. Return the minimum total cost to connect all ropes into one.",
      constraints: ["1 <= len(ropes) <= 10^5", "1 <= ropes[i] <= 10^4", "Target time: O(n log n)"],
      examples: [
        { input: "ropes = [4, 3, 2, 6]", output: "29", explanation: "(2+3)=5, (4+5)=9, (6+9)=15 -> 5+9+15 = 29." },
        { input: "ropes = [5]", output: "0", explanation: "Already a single rope." },
      ],
      tasks: [
        "Heapify all `ropes` into a Min-Heap (Module 15).",
        "While `heap.size() > 1`, pop the two smallest lengths `a` and `b`, add `a + b` to `cost`, and push `a + b` back.",
      ],
      starterCode: "function min_rope_cost(ropes):\n    // TODO: Min-Heap greedy pairwise merge",
      expectedOutput: "29\n0",
      hint: "Every merge's sum gets added again in later merges, so merging the shortest ropes earliest minimizes repeated weight.",
      complexity: { time: "O(n log n)", space: "O(n)" },
      solutionCode:
        "function min_rope_cost(ropes):\n    heap ← MinHeap(ropes)\n    total_cost ← 0\n    while heap.size() > 1:\n        a ← heap.pop()\n        b ← heap.pop()\n        merged ← a + b\n        total_cost ← total_cost + merged\n        heap.push(merged)\n    return total_cost",
    },
  ],
};
