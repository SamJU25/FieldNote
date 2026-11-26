import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM24Lessons: Record<string, LessonContent> = {
  "dsa-interview-framework": {
    lessonId: "dsa-interview-framework",
    subtitle:
      "Run a repeatable 45-minute interview loop: clarify input bounds, anchor a brute-force baseline, cut the bottleneck with a concrete trade-off, dry-run on small inputs, and adapt to follow-ups.",
    intro: {
      heading: "The 6-Step Coding Interview Playbook (Clarify -> Optimize -> Dry Run -> Follow-Ups)",
      explanation: [
        "Typing code on minute two is the fastest way to fail an interview you already knew how to solve. Candidates assume inputs are sorted, positive, or duplicate-free, spend 20 minutes building nested loops or broken dynamic programming, and burn the rest of the clock patching an edge case that one 30-second question would have caught.",
        "Treating a 45-minute coding round as six deliberate checkpoints keeps your thinking visible and your code small. You clarify bounds and return format first, state a working brute-force baseline with its cost, name the repeated work that slows it down, write modular helper-friendly code, trace a 4-element test by hand before running anything, and stay ready for follow-up constraint shifts.",
      ],
      analogy:
        "A surgical team runs a 60-second pre-op checklist before making the first cut: confirm which side, check allergies, verify tools, follow the planned path, and count every sponge before closing. Skipping that short check turns a routine 20-minute procedure into an emergency.",
      realWorldUses: [
        "Live coding and pair-programming interviews where graders score edge-case discovery, clear trade-offs, and bug recovery alongside Big-O",
        "Design reviews and incident debugging sessions where stating the baseline cost and isolating the slow loop prevents wasted engineering work",
      ],
    },
    sections: [
      {
        heading: "The 6 Stages Across a 45-Minute Interview",
        paragraphs: [
          "Interviewers grade signal per minute, not raw typing speed. Spending the first 8 minutes clarifying constraints and locking down a brute-force plan prevents false starts and gives the interviewer a chance to steer you early.",
          "Once you spot the repeated work inside your brute-force baseline, name the trade-off out loud before writing a line of optimal code. Reserve the final 10 minutes for a manual line-by-line dry run and follow-up scaling questions.",
        ],
        table: {
          caption: "6 Interview Stages -> Exact What-to-Say Template & What Graders Score",
          headers: ["Stage (Minutes)", "What to Say Out Loud", "What Graders Score"],
          rows: [
            [
              "1. Clarify (0-4)",
              "Can the array hold duplicates or negatives, what is max n, and what should we return when no answer exists?",
              "Catches hidden assumptions early and defines exact input/output contracts",
            ],
            [
              "2. Brute Force (4-8)",
              "A baseline nested check takes O(n^2) time and O(1) space by testing every pair; is n small enough or do we need faster?",
              "Proves correctness first and sets an honest complexity baseline",
            ],
            [
              "3. Optimize (8-14)",
              "The inner loop re-scans elements we already passed. Storing counts in a HashMap cuts time to O(n) for O(n) space.",
              "Isolates the exact bottleneck and justifies the time-space trade-off",
            ],
            [
              "4. Implement (14-30)",
              "I will guard len(nums) < 2 first, keep helper names clear, and query the complement before inserting the current item.",
              "Produces readable, bug-resistant code with clean boundary guards",
            ],
            [
              "5. Dry Run (30-37)",
              "Let me trace [3, 1, 3, 5] with target = 6 line by line, checking counts and pairs after every index.",
              "Finds off-by-one and duplicate-counting bugs before hitting Run",
            ],
            [
              "6. Follow-Ups (37-45)",
              "If extra memory drops to O(1), we can sort in O(n log n) with two pointers; if data streams in, we keep the map incremental.",
              "Demonstrates adaptability when memory, latency, or input rules change",
            ],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Getting a valid brute-force baseline in 4 minutes beats chasing a clever trick for 20 minutes and running out of time. Always anchor correctness first, then ask what repeated work you can cache or skip.",
        },
      },
      {
        heading: "Working vs. Broken Candidate Behavior on Pair Counting",
        paragraphs: [
          "Suppose the prompt asks: given `nums` and `target`, count pairs `(i, j)` with `i < j` and `nums[i] + nums[j] == target`. A rushed candidate skips Stage 1, loads everything into a `HashSet` upfront, and breaks immediately on duplicate values like `[3, 3]` with `target = 6` because a set collapses two copies of `3` into one.",
          "A structured candidate clarifies duplicates first, states the `O(n^2)` nested loop, and notices that looking up `need = target - x` in a `counts` HashMap before inserting `x` enforces `i < j` automatically. Each element only pairs with earlier indices `i`, so `[3, 3]` counts `1` valid pair without double-counting or self-pairing.",
        ],
        code: [
          "// Broken: loads a set upfront -> collapses duplicates and self-pairs 3 + 3",
          "function count_pairs_broken(nums, target):",
          "    seen ← set(nums)                   // [3, 3] collapses to {3}",
          "    pairs ← 0",
          "    for x in nums:",
          "        if (target - x) in seen:       // pairs index 0 with itself!",
          "            pairs ← pairs + 1          // returns 2 instead of 1",
          "    return pairs",
          "",
          "// Working: clarify duplicates -> lookup past counts before inserting x",
          "function count_pairs_fixed(nums, target):",
          "    if len(nums) < 2: return 0",
          "    counts ← empty Hash Map",
          "    pairs ← 0",
          "    for x in nums:",
          "        need ← target - x",
          "        pairs ← pairs + counts.get(need, 0)",
          "        counts[x] ← counts.get(x, 0) + 1",
          "    return pairs",
        ],
        codeLabel: "Broken vs. Fixed",
        output: "count_pairs_broken([3, 3], 6) -> 2 (wrong)\ncount_pairs_fixed([3, 3], 6) -> 1",
        table: {
          caption: "Stage 5 Manual Dry-Run Table on nums = [3, 1, 3, 5], target = 6",
          headers: ["Index i", "x = nums[i]", "need = 6 - x", "counts.get(need, 0)", "pairs", "counts after step"],
          rows: [
            ["0", "3", "3", "0 (3 not yet inserted)", "0", "{3: 1}"],
            ["1", "1", "5", "0", "0", "{3: 1, 1: 1}"],
            ["2", "3", "3", "1 (matches index 0)", "1", "{3: 2, 1: 1}"],
            ["3", "5", "1", "1 (matches index 1)", "2", "{3: 2, 1: 1, 5: 1}"],
          ],
          highlightCol: 4,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Never populate `counts` in a full pre-pass before checking complements unless you subtract self-matches and divide every pair count by `2`. Querying before inserting keeps every match strictly `i < j` in one clean pass.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build the Interview Solution Through Stages 2 -> 4 -> 5",
      subtitle: "Move from an O(n^2) baseline to an O(n) HashMap pass with boundary guards and duplicate checks.",
      steps: [
        {
          label: "Step 1 (Stage 2): State and verify the O(n^2) brute-force baseline",
          explanation:
            "Start with two loops where `i < j`. This proves the contract on `[3, 1, 3, 5], target = 6` in 30 seconds and sets your complexity baseline.",
          code: [
            "function count_pairs_brute(nums, target):",
            "    pairs ← 0",
            "    for i from 0 to len(nums) - 1:",
            "        for j from i + 1 to len(nums) - 1:",
            "            if nums[i] + nums[j] == target:",
            "                pairs ← pairs + 1",
            "    return pairs",
          ],
          activeLines: [3, 4, 5, 6],
          output: "2",
        },
        {
          label: "Step 2 (Stage 3): Replace the inner scan with a past-counts HashMap",
          explanation:
            "The inner loop asks how many earlier elements equal `target - nums[i]`. Caching past frequencies in `counts` answers that query in `O(1)` average time.",
          code: [
            "function count_pairs_hash(nums, target):",
            "    counts ← empty Hash Map",
            "    pairs ← 0",
            "    for x in nums:",
            "        pairs ← pairs + counts.get(target - x, 0)",
            "        counts[x] ← counts.get(x, 0) + 1",
            "    return pairs",
          ],
          activeLines: [4, 5, 6],
          output: "2",
        },
        {
          label: "Step 3 (Stages 4-5): Add edge guards and dry-run duplicate inputs",
          explanation:
            "Guard `len(nums) < 2` upfront and test `[3, 3], 6` and `[-2, 8, -2, 8], 6` during your Stage 5 dry run to confirm duplicates and negatives pass.",
          code: [
            "function count_pairs(nums, target):",
            "    if len(nums) < 2:",
            "        return 0",
            "    counts ← empty Hash Map",
            "    pairs ← 0",
            "    for x in nums:",
            "        need ← target - x",
            "        pairs ← pairs + counts.get(need, 0)",
            "        counts[x] ← counts.get(x, 0) + 1",
            "    return pairs",
          ],
          activeLines: [2, 3, 7, 8, 9],
          output: "1, 4",
        },
      ],
    },
    walkthrough: {
      title: "Trace an Interview Dry Run & Bug Catch on nums = [3, 1, 3, 5], target = 6",
      layout: "visual-first",
      steps: [
        {
          title: "Stage 1 & 4: Lock contract and guard empty/short inputs",
          tag: "CONCEPT",
          explanation: [
            "Confirm `nums = [3, 1, 3, 5]` allows duplicates (`3` appears twice) and requires counting index pairs `(i, j)` with `i < j`.",
            "Initialize `counts = {}` and `pairs = 0`, skipping immediately if `len(nums) < 2`.",
          ],
          code: [
            "if len(nums) < 2: return 0",
            "counts ← {}, pairs ← 0",
            "// Ready to trace i = 0..3 on [3, 1, 3, 5], target = 6",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "target", value: "6" },
            { name: "pairs", value: "0" },
            { name: "counts", value: "{}" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Input array [3, 1, 3, 5] before the dry run starts: duplicates exist at indices 0 and 2",
            trays: [
              {
                label: "nums[0..3]",
                cells: [
                  { id: "n0", value: "3", index: 0 },
                  { id: "n1", value: "1", index: 1 },
                  { id: "n2", value: "3", index: 2 },
                  { id: "n3", value: "5", index: 3 },
                ],
                pointers: [{ index: 0, label: "start", tone: "accent" }],
              },
            ],
          },
        },
        {
          title: "Stage 5 Bug Catch at i = 0: Why lookup runs before insert",
          tag: "PITFALL",
          explanation: [
            "At `i = 0`, `x = 3` and `need = 6 - 3 = 3`. If you inserted `counts[3] = 1` first, the lookup would match `3` with itself.",
            "Checking `counts.get(3, 0)` before inserting returns `0`, then sets `counts[3] = 1`. No self-pair is created.",
          ],
          code: [
            "x ← nums[0]                     // 3",
            "need ← 6 - 3                    // 3",
            "pairs ← pairs + counts.get(3, 0)// +0 (runs before insert!)",
            "counts[3] ← counts.get(3, 0) + 1// counts = {3: 1}",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "0" },
            { name: "need", value: "3" },
            { name: "pairs", value: "0" },
            { name: "counts", value: "{3: 1}", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "At i = 0, querying counts before inserting avoids pairing index 0 with itself",
            trays: [
              {
                label: "nums[0..3]",
                cells: [
                  { id: "n0", value: "3", index: 0, state: "active" },
                  { id: "n1", value: "1", index: 1 },
                  { id: "n2", value: "3", index: 2 },
                  { id: "n3", value: "5", index: 3 },
                ],
                pointers: [{ index: 0, label: "i (need=3 -> 0)", tone: "coral" }],
              },
            ],
          },
        },
        {
          title: "Trace i = 1: miss on need = 5, record counts[1] = 1",
          tag: "TRACE",
          explanation: [
            "At `i = 1`, `x = 1` and `need = 6 - 1 = 5`. `5` is absent from `counts = {3: 1}`, so `pairs` stays `0`.",
            "Insert `1` into `counts`, giving `{3: 1, 1: 1}`.",
          ],
          code: [
            "x ← nums[1]                     // 1",
            "need ← 6 - 1                    // 5",
            "pairs ← pairs + counts.get(5, 0)// +0",
            "counts[1] ← 1                   // counts = {3: 1, 1: 1}",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "1" },
            { name: "need", value: "5" },
            { name: "pairs", value: "0" },
            { name: "counts", value: "{3: 1, 1: 1}", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "At i = 1, complement 5 is not yet in counts; record 1 for future elements",
            trays: [
              {
                label: "nums[0..3]",
                cells: [
                  { id: "n0", value: "3", index: 0, state: "done" },
                  { id: "n1", value: "1", index: 1, state: "active" },
                  { id: "n2", value: "3", index: 2 },
                  { id: "n3", value: "5", index: 3 },
                ],
                pointers: [{ index: 1, label: "i (need=5 -> 0)", tone: "accent" }],
              },
            ],
          },
        },
        {
          title: "Trace i = 2: duplicate 3 matches earlier index 0",
          tag: "TRACE",
          explanation: [
            "At `i = 2`, `x = 3` and `need = 6 - 3 = 3`. `counts.get(3, 0)` returns `1`, so `pairs` increments from `0` to `1`.",
            "Update `counts[3]` to `2`. A third `3` later would now add `2` new pairs in one lookup.",
          ],
          code: [
            "x ← nums[2]                     // 3",
            "need ← 6 - 3                    // 3",
            "pairs ← pairs + counts.get(3, 0)// +1 -> pairs = 1",
            "counts[3] ← 2                   // counts = {3: 2, 1: 1}",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "2" },
            { name: "pairs", value: "1", changed: true },
            { name: "counts", value: "{3: 2, 1: 1}", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "At i = 2, need = 3 hits counts[3] = 1, counting pair (0, 2) once",
            trays: [
              {
                label: "nums[0..3]",
                cells: [
                  { id: "n0", value: "3", index: 0, state: "done" },
                  { id: "n1", value: "1", index: 1, state: "done" },
                  { id: "n2", value: "3", index: 2, state: "active" },
                  { id: "n3", value: "5", index: 3 },
                ],
                pointers: [
                  { index: 0, label: "match", tone: "ok" },
                  { index: 2, label: "i (+1 pair)", tone: "accent" },
                ],
              },
            ],
          },
        },
        {
          title: "Stage 5 & 6 Check at i = 3: hit pair (1, 3) and state follow-up pivot",
          tag: "CHECK",
          explanation: [
            "At `i = 3`, `x = 5` looks up `need = 1`, finds `counts[1] = 1`, and raises `pairs` to `2` (`(0, 2)` and `(1, 3)`).",
            "Finish by summarizing `O(n)` time, `O(n)` space, and mentioning the `O(1)`-space sort + two-pointer follow-up when mutation is allowed.",
          ],
          code: [
            "x ← nums[3]                     // 5",
            "pairs ← pairs + counts.get(1, 0)// +1 -> pairs = 2",
            "return pairs                    // 2",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "3" },
            { name: "pairs", value: "2", changed: true },
            { name: "Complexity", value: "O(n) time, O(n) space" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Dry run verified: pairs (0, 2) and (1, 3) give final count 2 in O(n) time",
            trays: [
              {
                label: "nums[0..3]",
                cells: [
                  { id: "n0", value: "3", index: 0, state: "done" },
                  { id: "n1", value: "1", index: 1, state: "done" },
                  { id: "n2", value: "3", index: 2, state: "done" },
                  { id: "n3", value: "5", index: 3, state: "active" },
                ],
                pointers: [
                  { index: 1, label: "match", tone: "ok" },
                  { index: 3, label: "i (total=2)", tone: "ok" },
                ],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Self-pairing when loading a map or set before the scan",
        detail:
          "If `target = 6` and `nums` has one `3`, pre-populating a set makes `target - 3 == 3` look like a valid match with itself. Querying `counts` before inserting the current element guarantees `i < j`.",
        code: "pairs ← pairs + counts.get(target - x, 0)\ncounts[x] ← counts.get(x, 0) + 1",
      },
      {
        title: "Mutating the caller's array without asking in Stage 1",
        detail:
          "Sorting `nums` in place saves memory, yet breaks problems that return original indices or forbid modifying input. Ask whether in-place mutation is allowed before calling `sort(nums)`.",
      },
      {
        title: "Skipping edge-case dry runs on empty, 1-element, or all-equal arrays",
        detail:
          "Most runtime crashes in interviews happen on `[]`, `[5]`, or `[2, 2, 2]`. Always run your loop mentally on a 0-element or 1-element input plus one duplicate-heavy input.",
      },
    ],
    predictChecks: [
      {
        prompt: "You receive a new coding prompt: 'Return two indices whose values sum to target.' Which clarifying question prevents the biggest wasted detour?",
        code: "function solve(nums, target):\n    // Before writing anything, ask...",
        options: [
          { id: "a", label: "Are values sorted, can elements repeat, and should we return indices or values?" },
          { id: "b", label: "Should I write variable names in camelCase or snake_case?" },
          { id: "c", label: "Can I use a 3D dynamic programming table right away?" },
        ],
        correctId: "a",
        explanation: "Knowing sort order, duplicates, and index-vs-value return decides immediately between Two Pointers, HashMap, and edge guards.",
      },
      {
        prompt: "What does `count_pairs_buggy([4, 2, 4], 8)` return if you insert `counts[x]` before adding `counts.get(target - x, 0)`?",
        code: "for x in nums:\n    counts[x] ← counts.get(x, 0) + 1\n    pairs ← pairs + counts.get(target - x, 0)",
        options: [
          { id: "a", label: "1 (correct)" },
          { id: "b", label: "3 (counts both self-pairs and the real pair)" },
          { id: "c", label: "0" },
        ],
        correctId: "b",
        explanation: "At index 0 (4), counts[4] becomes 1 so pairs adds 1; at index 2 (4), counts[4] becomes 2 so pairs adds 2, giving 3 instead of 1.",
      },
    ],
    practiceTask: {
      title: "Count Pairs With Target Sum (Duplicates & Negatives)",
      tier: "Warmup",
      goal: "Given an integer array `nums` (which may hold duplicates and negative numbers) and `target`, return the count of index pairs `(i, j)` with `i < j` and `nums[i] + nums[j] == target` in `O(n)` average time.",
      constraints: [
        "0 <= len(nums) <= 10^5",
        "-10^9 <= nums[i], target <= 10^9",
        "Target: O(n) average time, O(n) space",
      ],
      examples: [
        { input: "nums = [3, 1, 3, 5], target = 6", output: "2" },
        {
          input: "nums = [-2, 4, -2, 4], target = 2",
          output: "4",
          explanation: "Each 4 pairs with both -2 values (2 * 2 = 4 pairs).",
        },
      ],
      tasks: [
        "Guard `len(nums) < 2` by returning `0`.",
        "Look up `counts.get(target - x, 0)` before incrementing `counts[x]`.",
      ],
      starterCode: "function count_pairs(nums, target):\n    // TODO: O(n) count of pairs i < j summing to target",
      expectedOutput: "2\n4",
      hint: "Query `counts[target - x]` before adding `x` to `counts`, so an element never pairs with itself.",
      complexity: { time: "O(n) average", space: "O(n)" },
      solutionCode:
        "function count_pairs(nums, target):\n    if len(nums) < 2:\n        return 0\n    counts ← empty Hash Map\n    pairs ← 0\n    for x in nums:\n        need ← target - x\n        pairs ← pairs + counts.get(need, 0)\n        counts[x] ← counts.get(x, 0) + 1\n    return pairs",
    },
    practiceChallenges: [
      {
        title: "First Non-Repeating Event Code",
        tier: "Warmup",
        goal: "Given a string `events` of lowercase letters, return the 0-based index of the first character that appears exactly once, or `-1` if every character repeats or `events` is empty.",
        constraints: [
          "0 <= len(events) <= 10^5",
          "Target: O(n) time, O(1) alphabet space",
        ],
        examples: [
          { input: "events = \"aabcbd\"", output: "3", explanation: "c at index 3 is the first character with frequency 1." },
          { input: "events = \"aabb\"", output: "-1" },
        ],
        tasks: [
          "Count character frequencies in a first pass.",
          "Scan left-to-right and return the first index `i` where `freq[events[i]] == 1`.",
          "Return `-1` when no unique character exists.",
        ],
        starterCode: "function first_unique_event(events):\n    // TODO: two-pass frequency check with -1 fallback",
        expectedOutput: "3\n-1",
        hint: "In Stage 1, always clarify what to return when no unique character exists (`-1`) and test empty strings.",
        complexity: { time: "O(n)", space: "O(1) (<= 26 chars)" },
        solutionCode:
          "function first_unique_event(events):\n    freq ← empty Hash Map\n    for ch in events:\n        freq[ch] ← freq.get(ch, 0) + 1\n    for i from 0 to len(events) - 1:\n        if freq[events[i]] == 1:\n            return i\n    return -1",
      },
      {
        title: "Original Indices for Target Sum",
        tier: "Core",
        goal: "Given an unsorted integer array `nums` and `target`, return `[i, j]` (`i < j`) such that `nums[i] + nums[j] == target` (guaranteed at most one answer, return `[-1, -1]` if none) without mutating `nums`.",
        constraints: [
          "0 <= len(nums) <= 10^5",
          "Cannot destroy original indices by sorting in place",
          "Target: O(n) average time, O(n) space",
        ],
        examples: [
          { input: "nums = [11, 2, 15, 7], target = 9", output: "[1, 3]" },
          { input: "nums = [4, 4], target = 8", output: "[0, 1]", explanation: "Index 1 matches index 0 stored in seen." },
        ],
        tasks: [
          "Map each seen value to its index (`index_of[val] = i`).",
          "Check `target - nums[i]` in `index_of` before inserting `nums[i]`.",
          "Return `[index_of[need], i]` immediately on match, or `[-1, -1]` after the loop.",
        ],
        starterCode: "function find_target_indices(nums, target):\n    // TODO: return original indices [i, j] or [-1, -1]",
        expectedOutput: "[1, 3]\n[0, 1]",
        hint: "Explain in Stage 3 why sorting loses original indices unless you copy `(val, idx)` pairs, making HashMap cleaner and faster (`O(n)` vs `O(n log n)`).",
        complexity: { time: "O(n) average", space: "O(n)" },
        solutionCode:
          "function find_target_indices(nums, target):\n    index_of ← empty Hash Map\n    for i from 0 to len(nums) - 1:\n        need ← target - nums[i]\n        if need in index_of:\n            return [index_of[need], i]\n        index_of[nums[i]] ← i\n    return [-1, -1]",
      },
      {
        title: "Unique Zero-Sum Triplets Without Duplicate Sets",
        tier: "Stretch",
        goal: "Given an integer array `nums`, return all unique triplets `[a, b, c]` in ascending order such that `a + b + c == 0`, sorted lexicographically, without storing a separate set of tuples.",
        constraints: [
          "0 <= len(nums) <= 3000",
          "Target: O(n^2) time, O(1) extra work space",
        ],
        examples: [
          { input: "nums = [-1, 0, 1, 2, -1, -4]", output: "[[-1, -1, 2], [-1, 0, 1]]" },
          { input: "nums = [0, 0, 0, 0]", output: "[[0, 0, 0]]" },
        ],
        tasks: [
          "Sort `nums` ascending (`O(n log n)`).",
          "For each anchor `i`, skip duplicates (`i > 0 and nums[i] == nums[i - 1]`) and stop early if `nums[i] > 0`.",
          "Run two pointers `l = i + 1, r = n - 1` and skip repeated `nums[l]` values after each hit.",
        ],
        starterCode: "function three_sum_unique(nums):\n    // TODO: O(n^2) sorted anchor + two pointers",
        expectedOutput: "[[-1, -1, 2], [-1, 0, 1]]\n[[0, 0, 0]]",
        hint: "In Stage 5 dry-run `[0, 0, 0, 0]`: skipping `nums[i] == nums[i - 1]` and advancing past duplicate `nums[l]` guarantees `[[0, 0, 0]]` appears once.",
        complexity: { time: "O(n^2)", space: "O(1) extra (excluding output)" },
        solutionCode:
          "function three_sum_unique(nums):\n    sort(nums)\n    res ← []\n    n ← len(nums)\n    for i from 0 to n - 3:\n        if nums[i] > 0:\n            break\n        if i > 0 and nums[i] == nums[i - 1]:\n            continue\n        l ← i + 1\n        r ← n - 1\n        while l < r:\n            total ← nums[i] + nums[l] + nums[r]\n            if total < 0:\n                l ← l + 1\n            else if total > 0:\n                r ← r - 1\n            else:\n                res.append([nums[i], nums[l], nums[r]])\n                l ← l + 1\n                r ← r - 1\n                while l < r and nums[l] == nums[l - 1]:\n                    l ← l + 1\n    return res",
      },
    ],
  },

  "dsa-pattern-triggers": {
    lessonId: "dsa-pattern-triggers",
    subtitle:
      "Decode hidden input bounds and prompt phrasing on unseen problems to identify the passing time complexity and go-to data structure in under 60 seconds.",
    intro: {
      heading: "Picking the Right Pattern from Constraints & Prompt Clues",
      explanation: [
        "Solving problems inside a labeled chapter hides the hardest skill in an interview: picking the right pattern when the title gives away zero clues. A question about 'bandwidth spikes' or 'minimum ferry weight' never announces 'Sliding Window' or 'Binary Search on Answer', so candidates guess nested loops or recursion and hit timeouts on `n = 10^5`.",
        "Every problem leaves two fast clues in the prompt itself: the maximum input size `n` and a handful of structural trigger phrases. Constraints tell you which complexities can finish under roughly `10^8` operations, and wording clues narrow the data structure down to one or two candidates you can test right away.",
      ],
      analogy:
        "A car mechanic does not unpack every wrench on the wall when an engine stalls. Hearing whether the sound is a dead click, a slow crank, or a metallic knock cuts 50 possible tools down to two before lifting the hood.",
      realWorldUses: [
        "Diagnosing why an API query stalls at 100,000 records and choosing the matching linear or log-linear data structure",
        "Fast triage in mixed coding interviews where 30 seconds of constraint math prevents building an unpassable O(n^2) solution",
      ],
    },
    sections: [
      {
        heading: "Reading Input Bounds First: The 10^8 Operations Rule",
        paragraphs: [
          "A standard judge or interview runner executes roughly `10^8` simple operations per second. When `n = 10^5`, an `O(n^2)` loop executes `10^10` steps and takes ~100 seconds (Time Limit Exceeded), whereas `O(n log n)` executes about `1.7 * 10^6` steps and finishes in milliseconds.",
          "Check `n` before brainstorming algorithms. Tiny bounds like `n <= 20` signal exponential search (backtracking or bitmasks), medium bounds `n <= 10^3` permit `O(n^2)` DP, `n <= 10^5` demands `O(n)` or `O(n log n)`, and `n <= 10^9` forces `O(log n)` or `O(1)` math.",
        ],
        table: {
          caption: "Input Size n -> Passing Time Complexity & Pattern Family",
          headers: ["Max Input Size n", "Passing Time Complexity", "Pattern Family", "Disqualified Complexity"],
          rows: [
            ["n <= 12", "O(n!) or O(n * 2^n)", "Permutations, N-Queens, TSP bitmask", "None (all small)"],
            ["n <= 20", "O(2^n) or O(n * 2^n)", "Subsets, combination backtracking, subset bitmask DP", "O(n!)"],
            ["n <= 10^3", "O(n^2)", "2D DP grids, all-pairs checks, nested interval/matrix scans", "O(2^n)"],
            [
              "n <= 10^5",
              "O(n) or O(n log n)",
              "Sliding Window, Prefix+Hash, Two Pointers, Monotonic Stack, Heap, Binary Search, Greedy, 1D DP, Graph BFS/Topo/DSU/Dijkstra, Trie/Fenwick/Segment",
              "O(n^2) (10^10 steps -> timeout)",
            ],
            ["n <= 10^9", "O(log n) or O(1)", "Binary Search on Answer, Math / GCD / Fast Power, Bit Tricks", "O(n) (10^9 steps -> too slow)"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Constraint math eliminates impossible approaches in 10 seconds. Seeing `n <= 10^5` rules out `O(n^2)` immediately, while `n <= 20` tells you exponential backtracking is intended.",
        },
      },
      {
        heading: "Prompt Wording Clues -> Go-To Pattern",
        paragraphs: [
          "Once `n` pins down your target complexity, scan the prompt verbs and nouns for structural invariants. 'Contiguous subarray', 'next greater', 'minimize the maximum', and 'prerequisite order' each point to one primary pattern.",
          "Pair every trigger with its watch-out condition before coding. For instance, 'contiguous subarray' with positive values uses Sliding Window, whereas negative values break window shrinking and push you to Prefix Sum + HashMap.",
        ],
        table: {
          caption: "Clue in Prompt -> Go-To Data Structure / Pattern",
          headers: ["Clue in Prompt", "Go-To Pattern / Structure", "Watch-Out Condition"],
          rows: [
            ["Contiguous subarray/substring, positive items or fixed k", "Sliding Window (M08)", "Negative values break left-shrinking monotonicity"],
            ["Subarray sum == k (negatives allowed) or range sum", "Prefix Sum + HashMap (M03, M06)", "Seed counts[0] = 1 for prefixes starting at index 0"],
            ["Sorted array pairs, partitioning, palindrome", "Two Pointers (M07)", "Confirm whether input is already sorted"],
            ["Values in [1..n] or [0..n] with O(1) space", "Cyclic Sort (M11)", "Skip swap when nums[i] == nums[target]"],
            ["Next greater/smaller item, span, histogram area", "Monotonic Stack (M13)", "Store indices on the stack to compute distances"],
            ["Minimize the maximum / maximize the minimum capacity", "Binary Search on Answer (M09)", "Verify feasible(mid) is monotonic first"],
            ["Kth largest/smallest, stream median, merge K lists", "Top-K Heap / Two Heaps (M15)", "Keep heap sizes balanced within 1 for median"],
            ["Overlapping meetings, merge intervals, min rooms", "Intervals + Sort / Min-Heap (M16)", "Sort by end time to maximize non-overlapping count"],
            ["All subsets, permutations, combinations (n <= 20)", "Backtracking (M17)", "Undo choice (pop) after every recursive call"],
            ["Shortest unweighted path / prerequisites / components / weighted path", "BFS / Topo Sort / DSU / Dijkstra (M18, M19)", "Negative edge weights disqualify Dijkstra"],
            ["Count ways or min cost with overlapping subproblems", "1D / 2D Dynamic Programming (M20, M21)", "Test greedy counterexamples before trusting greedy"],
            ["Prefix autocomplete or dynamic mutable range queries", "Trie / Fenwick / Segment Tree (M22, M23)", "Fenwick needs invertible ops; Segment handles min/max"],
          ],
          highlightCol: 1,
        },
      },
      {
        heading: "Broken vs. Working Diagnosis: Shortest Subarray With Sum >= Target",
        paragraphs: [
          "Prompt: 'Given `n <= 10^5` positive packet sizes `sizes` and `target`, find the minimum contiguous subarray length whose sum is at least `target` (or `0` if none).' A candidate who ignores `n <= 10^5` writes two nested loops and burns `5 * 10^9` steps on large inputs.",
          "Reading the two clues together — `n <= 10^5` (`O(n)`) plus `positive values + contiguous subarray` — picks `Sliding Window`. Because every item is positive, expanding `right` increases `window_sum` and shrinking `left` decreases it monotonically, solving the problem in `O(n)` time and `O(1)` space.",
        ],
        code: [
          "// Broken at n = 10^5: O(n^2) nested scan hits timeout (~5 * 10^9 ops)",
          "function min_len_slow(sizes, target):",
          "    best ← INF",
          "    for l from 0 to len(sizes) - 1:",
          "        total ← 0",
          "        for r from l to len(sizes) - 1:",
          "            total ← total + sizes[r]",
          "            if total >= target:",
          "                best ← min(best, r - l + 1)",
          "                break",
          "    return 0 if best == INF else best",
          "",
          "// Working at n = 10^5: positive items + contiguous -> O(n) Sliding Window",
          "function min_len_window(sizes, target):",
          "    left ← 0, total ← 0, best ← INF",
          "    for right from 0 to len(sizes) - 1:",
          "        total ← total + sizes[right]",
          "        while total >= target:",
          "            best ← min(best, right - left + 1)",
          "            total ← total - sizes[left]",
          "            left ← left + 1",
          "    return 0 if best == INF else best",
        ],
        codeLabel: "Broken vs. Working",
        output: "min_len_slow([2, 3, 1, 2, 4, 3], 7) -> 2 (timeouts at n = 10^5)\nmin_len_window([2, 3, 1, 2, 4, 3], 7) -> 2 (O(n) passes n = 10^5)",
        callout: {
          kind: "WATCH OUT",
          text: "Whenever a prompt mentions 'contiguous' with `n = 10^5`, test whether all numbers are non-negative before reaching for Sliding Window. If negative numbers can appear, switch to Prefix Sums + Monotonic Deque (for `>= target`) or Prefix Sum + HashMap (for `== target`).",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build Pattern Selection from Clues to Optimal O(n) Code",
      subtitle: "Turn constraint clues on Shortest Subarray >= Target into a complete O(n) window solution.",
      steps: [
        {
          label: "Step 1: Verify constraint budget and start with O(n^2) baseline",
          explanation:
            "At `n = 10^5`, `O(n^2)` takes ~`10^10` steps (timeout), so we need `O(n)` or `O(n log n)`. First write the clear `O(n^2)` reference to verify the contract.",
          code: [
            "function min_len_step1(sizes, target):",
            "    best ← INF",
            "    for l from 0 to len(sizes) - 1:",
            "        total ← 0",
            "        for r from l to len(sizes) - 1:",
            "            total ← total + sizes[r]",
            "            if total >= target: best ← min(best, r - l + 1); break",
            "    return 0 if best == INF else best",
          ],
          activeLines: [3, 5, 7],
          output: "2",
        },
        {
          label: "Step 2: Replace re-scanning with a sliding window [left..right]",
          explanation:
            "Because all `sizes[i] > 0`, once `[left..right]` reaches `target`, extending `right` further can only produce longer ranges. Shrink `left` right away.",
          code: [
            "function min_len_step2(sizes, target):",
            "    left ← 0, total ← 0, best ← INF",
            "    for right from 0 to len(sizes) - 1:",
            "        total ← total + sizes[right]",
            "        while total >= target:",
            "            best ← min(best, right - left + 1)",
            "            total ← total - sizes[left]",
            "            left ← left + 1",
            "    return best",
          ],
          activeLines: [5, 6, 7, 8],
          output: "2",
        },
        {
          label: "Step 3: Guard unreachable targets and empty arrays",
          explanation:
            "If the entire array sum stays below `target`, `best` remains `INF`. Convert `INF` to `0` at return time.",
          code: [
            "function min_len(sizes, target):",
            "    left ← 0, total ← 0, best ← INF",
            "    for right from 0 to len(sizes) - 1:",
            "        total ← total + sizes[right]",
            "        while total >= target:",
            "            best ← min(best, right - left + 1)",
            "            total ← total - sizes[left]",
            "            left ← left + 1",
            "    return 0 if best == INF else best",
          ],
          activeLines: [2, 9],
          output: "2, 0",
        },
      ],
    },
    walkthrough: {
      title: "Trace Sliding Window Pattern Selection on sizes = [2, 3, 1, 2, 4, 3], target = 7",
      layout: "visual-first",
      steps: [
        {
          title: "Clues locked: n <= 10^5 + positive items -> Sliding Window",
          tag: "PATTERN",
          explanation: [
            "Positive numbers mean adding on `right` strictly grows `total` and dropping `left` strictly shrinks `total`.",
            "Start with `left = 0`, `total = 0`, `best = INF`.",
          ],
          code: [
            "sizes ← [2, 3, 1, 2, 4, 3], target ← 7",
            "left ← 0, total ← 0, best ← INF",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "target", value: "7" },
            { name: "total", value: "0" },
            { name: "best", value: "INF" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Positive values + contiguous length -> O(n) Sliding Window starts at left = 0",
            trays: [
              {
                label: "sizes[0..5]",
                cells: [
                  { id: "s0", value: "2", index: 0, state: "active" },
                  { id: "s1", value: "3", index: 1 },
                  { id: "s2", value: "1", index: 2 },
                  { id: "s3", value: "2", index: 3 },
                  { id: "s4", value: "4", index: 4 },
                  { id: "s5", value: "3", index: 5 },
                ],
                pointers: [{ index: 0, label: "left=0", tone: "coral" }],
              },
            ],
          },
        },
        {
          title: "Expand right = 0..3 until window [0..3] hits total = 8 >= 7",
          tag: "TRACE",
          explanation: [
            "Adding `2 + 3 + 1 + 2` reaches `total = 8` at `right = 3`.",
            "First valid window `[0..3]` has length `4`, so `best` updates from `INF` to `4`.",
          ],
          code: [
            "// right = 0..3 -> total = 2 + 3 + 1 + 2 = 8",
            "if total >= 7:",
            "    best ← min(INF, 3 - 0 + 1)   // best = 4",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "window", value: "[0..3]" },
            { name: "total", value: "8", changed: true },
            { name: "best", value: "4", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Window [0..3] reaches sum 8 >= 7, setting best = 4 before shrinking",
            trays: [
              {
                label: "sizes[0..5]",
                cells: [
                  { id: "s0", value: "2", index: 0, state: "active" },
                  { id: "s1", value: "3", index: 1, state: "active" },
                  { id: "s2", value: "1", index: 2, state: "active" },
                  { id: "s3", value: "2", index: 3, state: "active" },
                  { id: "s4", value: "4", index: 4 },
                  { id: "s5", value: "3", index: 5 },
                ],
                pointers: [
                  { index: 0, label: "left", tone: "coral" },
                  { index: 3, label: "right", tone: "accent" },
                ],
                highlightRange: [0, 3],
              },
            ],
          },
        },
        {
          title: "Shrink left to 1: total drops to 6 < 7, stopping the while loop",
          tag: "TRACE",
          explanation: [
            "Subtract `sizes[0] = 2` and advance `left` to `1`. Now `total = 6 < 7`.",
            "Because `[1..3]` falls short of `7`, resume advancing `right`.",
          ],
          code: [
            "total ← 8 - sizes[0]   // 6",
            "left ← 1",
            "// while total >= 7 exits because 6 < 7",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "window", value: "[1..3]" },
            { name: "total", value: "6", changed: true },
            { name: "best", value: "4" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Dropping index 0 lowers total to 6 < 7, so shrinking pauses at left = 1",
            trays: [
              {
                label: "sizes[0..5]",
                cells: [
                  { id: "s0", value: "2", index: 0, state: "dim" },
                  { id: "s1", value: "3", index: 1, state: "active" },
                  { id: "s2", value: "1", index: 2, state: "active" },
                  { id: "s3", value: "2", index: 3, state: "active" },
                  { id: "s4", value: "4", index: 4 },
                  { id: "s5", value: "3", index: 5 },
                ],
                pointers: [
                  { index: 1, label: "left", tone: "coral" },
                  { index: 3, label: "right", tone: "accent" },
                ],
                highlightRange: [1, 3],
              },
            ],
          },
        },
        {
          title: "Advance right = 4 (total = 10) and shrink left to 3 (length 3)",
          tag: "TRACE",
          explanation: [
            "Adding `sizes[4] = 4` brings `[1..4]` to `10 >= 7` (`best` stays `4`). Shrink `left = 1` (`3` out -> `7`, length `3` -> `best = 3`).",
            "Shrink `left = 2` (`1` out -> `6 < 7`), leaving window `[3..4]` with `total = 6`.",
          ],
          code: [
            "total ← 6 + sizes[4]            // 10 -> [1..4]",
            "// drop 3: total = 7 -> [2..4], best = 3",
            "// drop 1: total = 6 -> [3..4], left = 3",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "window", value: "[3..4]" },
            { name: "total", value: "6", changed: true },
            { name: "best", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Shrinking [1..4] -> [2..4] improves best to 3, then stops at [3..4] (sum 6)",
            trays: [
              {
                label: "sizes[0..5]",
                cells: [
                  { id: "s0", value: "2", index: 0, state: "dim" },
                  { id: "s1", value: "3", index: 1, state: "dim" },
                  { id: "s2", value: "1", index: 2, state: "dim" },
                  { id: "s3", value: "2", index: 3, state: "active" },
                  { id: "s4", value: "4", index: 4, state: "active" },
                  { id: "s5", value: "3", index: 5 },
                ],
                pointers: [
                  { index: 3, label: "left", tone: "coral" },
                  { index: 4, label: "right", tone: "accent" },
                ],
                highlightRange: [3, 4],
              },
            ],
          },
        },
        {
          title: "Final step right = 5: shrink [3..5] -> [4..5] for optimal length 2",
          tag: "CHECK",
          explanation: [
            "Add `sizes[5] = 3`, reaching `total = 9` on `[3..5]` (length `3`). Shrink `left = 3` (`2` out -> `total = 7` on `[4..5]`).",
            "`best` updates to `2`, and shrinking `4` drops `total` to `3 < 7`. Return `2` in `O(n)` time (`12` total pointer moves).",
          ],
          code: [
            "total ← 6 + sizes[5]            // 9 -> [3..5]",
            "// drop 2: total = 7 -> [4..5], best = 2",
            "return best                     // 2",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "best window", value: "[4, 3]" },
            { name: "best", value: "2", changed: true },
            { name: "Complexity", value: "O(n) time, O(1) space" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Final window [4..5] = [4, 3] reaches sum 7 with minimum length 2",
            trays: [
              {
                label: "sizes[0..5]",
                cells: [
                  { id: "s0", value: "2", index: 0, state: "dim" },
                  { id: "s1", value: "3", index: 1, state: "dim" },
                  { id: "s2", value: "1", index: 2, state: "dim" },
                  { id: "s3", value: "2", index: 3, state: "dim" },
                  { id: "s4", value: "4", index: 4, state: "done" },
                  { id: "s5", value: "3", index: 5, state: "done" },
                ],
                pointers: [
                  { index: 4, label: "left", tone: "ok" },
                  { index: 5, label: "right (len=2)", tone: "ok" },
                ],
                highlightRange: [4, 5],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using Sliding Window when negative numbers are allowed",
        detail:
          "Dropping a negative number from `left` makes `window_sum` go up instead of down, breaking the shrink invariant. Check whether negatives exist before picking Sliding Window; switch to Prefix Sum + HashMap for exact sums.",
      },
      {
        title: "Assuming greedy works without testing a counterexample",
        detail:
          "Prompts asking for minimum coins or maximum value under a weight limit often tempt candidates into picking the largest unit first. Test `[1, 3, 4]` for target `6` (`greedy = 4 + 1 + 1 = 3` coins vs `DP = 3 + 3 = 2` coins) before committing to greedy.",
        code: "// Greedy fails on coins = [1, 3, 4], target = 6:\n// greedy picks 4 + 1 + 1 (3 coins), DP finds 3 + 3 (2 coins)",
      },
      {
        title: "Ignoring `10^9` bounds and writing an `O(n)` loop",
        detail:
          "When `n` or the search limit reaches `10^9` (e.g., 'capacity up to 10^9'), even an `O(n)` scan times out. Look for a monotonic `feasible(mid)` predicate and Binary Search on Answer in `O(log(10^9)) ~ 30` checks.",
      },
    ],
    predictChecks: [
      {
        prompt:
          "A prompt gives `1 <= n <= 10^5` packages and `1 <= max_weight <= 10^9`, asking for the minimum truck capacity to deliver all packages in `D` days without reordering them. Which pattern fits?",
        code: "// Clue 1: 'minimum truck capacity' (minimize the maximum)\n// Clue 2: max_weight up to 10^9, n <= 10^5",
        options: [
          { id: "a", label: "Backtracking over all day splits" },
          { id: "b", label: "Binary Search on Answer over [max(weights) .. sum(weights)]" },
          { id: "c", label: "Sort the packages descending and use Two Pointers" },
        ],
        correctId: "b",
        explanation: "Cannot reorder packages and capacity reaches 10^9 -> binary search the capacity mid in ~30 steps, checking feasibility greedily in O(n) per step.",
      },
      {
        prompt:
          "A prompt gives `n <= 10^5` integers (including negative numbers) and asks how many contiguous subarrays sum to `k`. Which pattern fits?",
        code: "// Clue 1: n <= 10^5, contiguous subarray sum == k\n// Clue 2: elements can be negative",
        options: [
          { id: "a", label: "Prefix Sum + HashMap of seen prefix counts" },
          { id: "b", label: "Variable-size Sliding Window" },
          { id: "c", label: "O(n^2) nested subarray sums" },
        ],
        correctId: "a",
        explanation: "Negative elements break Sliding Window monotonicity, and O(n^2) times out at n = 10^5. Prefix Sum + HashMap runs in O(n).",
      },
    ],
    practiceTask: {
      title: "Shortest Contiguous Packet Burst Reaching Target",
      tier: "Warmup",
      goal: "Given an array of positive packet sizes `sizes` (`1 <= len(sizes) <= 10^5`) and integer `target`, return the minimum length of a contiguous subarray with sum `>= target`, or `0` if none exists.",
      constraints: [
        "1 <= len(sizes) <= 10^5",
        "1 <= sizes[i] <= 10^4",
        "Target: O(n) time, O(1) space",
      ],
      examples: [
        { input: "sizes = [2, 3, 1, 2, 4, 3], target = 7", output: "2" },
        { input: "sizes = [1, 1, 1], target = 10", output: "0" },
      ],
      tasks: [
        "Expand `right` across `sizes` while accumulating `total`.",
        "Shrink `left` in a `while total >= target` loop and update `best`.",
        "Return `0` if `best` never updated.",
      ],
      starterCode: "function min_packet_burst(sizes, target):\n    // TODO: O(n) sliding window minimum length",
      expectedOutput: "2\n0",
      hint: "Both `left` and `right` move forward at most `n` times, giving `O(n)` total steps despite the inner `while`.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function min_packet_burst(sizes, target):\n    left ← 0\n    total ← 0\n    best ← INF\n    for right from 0 to len(sizes) - 1:\n        total ← total + sizes[right]\n        while total >= target:\n            best ← min(best, right - left + 1)\n            total ← total - sizes[left]\n            left ← left + 1\n    return 0 if best == INF else best",
    },
    practiceChallenges: [
      {
        title: "Days Until Next Higher Reading",
        tier: "Warmup",
        goal: "Given daily sensor readings `temps` (`1 <= len(temps) <= 10^5`), return an array `ans` where `ans[i]` is how many days you wait after day `i` for a strictly higher reading (or `0` if none).",
        constraints: [
          "1 <= len(temps) <= 10^5",
          "Target: O(n) time, O(n) space",
        ],
        examples: [
          { input: "temps = [73, 74, 75, 71, 69, 72, 76, 73]", output: "[1, 1, 4, 2, 1, 1, 0, 0]" },
          { input: "temps = [30, 20, 10]", output: "[0, 0, 0]" },
        ],
        tasks: [
          "Spot the trigger: 'next strictly higher' at `n <= 10^5` -> Monotonic Decreasing Stack of indices.",
          "While `temps[i] > temps[stack[-1]]`, pop `prev` and set `ans[prev] = i - prev`.",
          "Push `i` onto `stack`.",
        ],
        starterCode: "function days_until_warmer(temps):\n    // TODO: O(n) monotonic stack of waiting indices",
        expectedOutput: "[1, 1, 4, 2, 1, 1, 0, 0]\n[0, 0, 0]",
        hint: "Store indices rather than values on `stack` so `i - prev` computes the wait span in `O(1)`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function days_until_warmer(temps):\n    n ← len(temps)\n    ans ← array of size n filled with 0\n    stack ← []\n    for i from 0 to n - 1:\n        while len(stack) > 0 and temps[i] > temps[stack[-1]]:\n            prev ← stack.pop()\n            ans[prev] ← i - prev\n        stack.append(i)\n    return ans",
      },
      {
        title: "Minimum Fleet Capacity Within Deadline",
        tier: "Core",
        goal: "Packages with weights `weights` must ship in order within `days` days. Return the smallest ship weight capacity that completes delivery within `days` days.",
        constraints: [
          "1 <= days <= len(weights) <= 5 * 10^4",
          "1 <= weights[i] <= 500",
          "Target: O(n log(sum(weights))) time, O(1) space",
        ],
        examples: [
          { input: "weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], days = 5", output: "15" },
          { input: "weights = [3, 2, 2, 4, 1, 4], days = 3", output: "6" },
        ],
        tasks: [
          "Spot the trigger: 'smallest capacity' + ordered partitions -> Binary Search on Answer.",
          "Set `lo = max(weights)` and `hi = sum(weights)`.",
          "Write `can_ship(cap)` greedily counting days needed, then shrink `[lo, hi]`.",
        ],
        starterCode: "function min_ship_capacity(weights, days):\n    // TODO: binary search capacity over [max(weights), sum(weights)]",
        expectedOutput: "15\n6",
        hint: "If `cap < max(weights)`, the heaviest single package can never load, so `lo` starts at `max(weights)`.",
        complexity: { time: "O(n log S)", space: "O(1)" },
        solutionCode:
          "function can_ship(weights, days, cap):\n    used_days ← 1\n    cur ← 0\n    for w in weights:\n        if cur + w > cap:\n            used_days ← used_days + 1\n            cur ← 0\n        cur ← cur + w\n    return used_days <= days\n\nfunction min_ship_capacity(weights, days):\n    lo ← max(weights)\n    hi ← sum(weights)\n    while lo < hi:\n        mid ← lo + (hi - lo) // 2\n        if can_ship(weights, days, mid):\n            hi ← mid\n        else:\n            lo ← mid + 1\n    return lo",
      },
      {
        title: "Valid Service Build Order Check",
        tier: "Stretch",
        goal: "Given `num_jobs` labeled `0..num_jobs - 1` and dependency pairs `[job, prereq]` (meaning `prereq` must build before `job`), return `true` if every job can finish without a cycle, else `false`.",
        constraints: [
          "1 <= num_jobs <= 10^5",
          "0 <= len(deps) <= 10^5",
          "Target: O(V + E) time and space",
        ],
        examples: [
          { input: "num_jobs = 4, deps = [[1, 0], [2, 1], [3, 2]]", output: "true" },
          { input: "num_jobs = 2, deps = [[1, 0], [0, 1]]", output: "false" },
        ],
        tasks: [
          "Spot the trigger: 'prerequisite order + cycle check' at `n <= 10^5` -> Kahn's Topological BFS.",
          "Build adjacency list `prereq -> job` and `indegree[job]`.",
          "Peel zero-indegree nodes from a queue and check `built == num_jobs`.",
        ],
        starterCode: "function can_finish_jobs(num_jobs, deps):\n    // TODO: Kahn's topological sort cycle detection",
        expectedOutput: "true\nfalse",
        hint: "Watch the edge direction: `[job, prereq]` means an arrow `prereq -> job`, so `indegree[job]` increases by 1.",
        complexity: { time: "O(V + E)", space: "O(V + E)" },
        solutionCode:
          "function can_finish_jobs(num_jobs, deps):\n    adj ← list of num_jobs empty lists\n    indegree ← array of size num_jobs filled with 0\n    for pair in deps:\n        job ← pair[0]\n        prereq ← pair[1]\n        adj[prereq].append(job)\n        indegree[job] ← indegree[job] + 1\n    q ← queue of all i where indegree[i] == 0\n    built ← 0\n    while len(q) > 0:\n        u ← q.pop_left()\n        built ← built + 1\n        for v in adj[u]:\n            indegree[v] ← indegree[v] - 1\n            if indegree[v] == 0:\n                q.append(v)\n    return built == num_jobs",
      },
    ],
  },

  "dsa-interview-followups": {
    lessonId: "dsa-interview-followups",
    subtitle:
      "Adapt accepted solutions mid-interview when the interviewer cuts extra memory to O(1), switches batch arrays to live streams, or introduces negative numbers.",
    intro: {
      heading: "Handling Follow-Up Twists: O(1) Space, Streams & Negative Inputs",
      explanation: [
        "Delivering a clean `O(n)` solution with 15 minutes left triggers the real grading hurdle: 'Can you shrink extra memory to `O(1)`?', 'What if values arrive one by one in a stream?', or 'What breaks if inputs can be negative?' Candidates who memorized one static template stall because their HashSet, full sort, or Sliding Window fails the new constraint.",
        "Interview follow-ups rarely throw away your first solution. Most twists follow three repeatable pivots: swap an `O(n)` auxiliary structure for in-place swaps, pointers, or rolling DP rows (`O(1)` / `O(W)` space); swap full-array sorting for a bounded heap or deque on streams; and swap monotonic window/greedy assumptions for Prefix + HashMap or Bellman-Ford when negatives enter.",
      ],
      analogy:
        "A food truck kitchen runs smoothly on 30 pre-packed boxed lunches, yet when walk-up customers begin ordering one item at a time with allergy swaps, you keep the same grill and switch from batch trays to a live ticket rail.",
      realWorldUses: [
        "Memory-tight telemetry agents and large ETL passes where duplicating a 100-million-item array exceeds RAM limits",
        "Real-time stream processors computing rolling percentiles or sliding-window peaks without storing full history",
      ],
    },
    sections: [
      {
        heading: "The 3 Classic Interview Follow-Up Pivots",
        paragraphs: [
          "When an interviewer changes one rule after you finish your main solution, listen for which constraint shifted: space budget (`O(n) -> O(1)`), arrival model (`batch -> stream`), or value domain (`positive -> negative`).",
          "Each shift pairs with a small set of standard upgrades from earlier modules. Naming the exact pivot out loud shows engineering judgment even before you adjust a single line.",
        ],
        table: {
          caption: "Original Solution -> Interviewer Twist -> Exact Pivot",
          headers: ["Baseline Solution", "Interviewer Twist", "Pivot Technique", "Complexity Shift"],
          rows: [
            [
              "HashSet duplicate / missing check",
              "Use O(1) extra space (values in 1..n)",
              "Cyclic Sort in-place swaps (mutable) or Floyd Fast-Slow (read-only)",
              "O(n) space -> O(1) space",
            ],
            [
              "2D DP table dp[i][j]",
              "Shrink memory footprint",
              "Rolling 1D row (iterate backward for 0/1) or 2 scalar variables",
              "O(n * W) space -> O(W) or O(1)",
            ],
            [
              "Sort array for Kth largest / median",
              "Unbounded live stream of numbers",
              "Fixed-size Min-Heap of size k / Two Heaps",
              "O(n log n) batch -> O(log k) or O(log n) per item",
            ],
            [
              "Scan each window of size k for max",
              "Window slides over a stream",
              "Monotonic Decreasing Deque of indices",
              "O(n * k) -> O(n) amortized, O(k) space",
            ],
            [
              "Sliding Window for subarray sum == k",
              "Negative integers allowed",
              "Prefix Sum + HashMap of prior totals (seed {0: 1})",
              "Window breaks -> Prefix+Hash keeps O(n)",
            ],
            [
              "Dijkstra shortest path",
              "Negative edge weights allowed",
              "Bellman-Ford (V - 1 full edge relaxation passes)",
              "O(E log V) -> O(V * E)",
            ],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Before coding a follow-up, state aloud which invariant broke: 'Negatives break window monotonicity, so Sliding Window drops out and Prefix + HashMap takes over.'",
        },
      },
      {
        heading: "Follow-Up in Action: Shrinking Space and Handling Negatives",
        paragraphs: [
          "Consider finding a duplicate inside `nums` of length `n + 1` with values in `1..n`. A HashSet works in `O(n)` space, yet the follow-up demands `O(1)` extra space. If mutation is allowed, Cyclic Sort swaps each value `v` toward slot `v - 1` until `nums[i] == nums[v - 1]` catches the duplicate; if `nums` is read-only, Floyd's Fast-Slow pointer finds the cycle entry without touching a single cell.",
          "Similarly, on `subarray_sum == k`, a positive-only Sliding Window crashes on `[3, 4, -7, 1, 3, 3], k = 7` because shrinking past `3, 4` misses `[3, 4, -7, 1, 3, 3]` (`sum = 7`) and `[1, 3, 3]`. Switching to `Prefix Sum + HashMap` restores exact `O(n)` counting on negative inputs.",
        ],
        code: [
          "// Broken follow-up: Sliding Window misses subarrays cancelled by negatives",
          "function count_sum_k_broken(nums, k):",
          "    left ← 0, total ← 0, count ← 0",
          "    for right from 0 to len(nums) - 1:",
          "        total ← total + nums[right]",
          "        while total > k and left <= right:",
          "            total ← total - nums[left]",
          "            left ← left + 1",
          "        if total == k: count ← count + 1",
          "    return count   // on [3, 4, -7, 1, 3, 3], k=7 -> misses whole-array sum 7!",
          "",
          "// Working follow-up: Prefix Sum + HashMap handles positive, zero, and negative items",
          "function count_sum_k_fixed(nums, k):",
          "    seen ← {0: 1}",
          "    prefix ← 0, count ← 0",
          "    for x in nums:",
          "        prefix ← prefix + x",
          "        count ← count + seen.get(prefix - k, 0)",
          "        seen[prefix] ← seen.get(prefix, 0) + 1",
          "    return count",
        ],
        codeLabel: "Follow-Up Pivot",
        output: "count_sum_k_broken([3, 4, -7, 1, 3, 3], 7) -> 2 (misses full array + [3, 4] overlap)\ncount_sum_k_fixed([3, 4, -7, 1, 3, 3], 7) -> 3",
        callout: {
          kind: "WATCH OUT",
          text: "When pivoting `count_sum_k` to Prefix Sum + HashMap, always initialize `seen = {0: 1}` before the loop. Skipping `{0: 1}` misses every subarray that begins at index `0`.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Pivot Subarray Sum Equals K When Negatives Break Sliding Window",
      subtitle: "Trace how an O(1)-space Sliding Window fails negative inputs and evolves into Prefix Sum + HashMap.",
      steps: [
        {
          label: "Step 1: Positive-only Sliding Window works on [2, 1, 3, 2], k = 4",
          explanation:
            "With strictly positive values, shrinking `left` while `total > k` finds `[1, 3]` in `O(1)` extra space.",
          code: [
            "nums ← [2, 1, 3, 2], k ← 4",
            "left ← 0, total ← 0, count ← 0",
            "for right from 0 to len(nums) - 1:",
            "    total ← total + nums[right]",
            "    while total > k and left <= right: total ← total - nums[left]; left ← left + 1",
            "    if total == k: count ← count + 1",
            "print(count)",
          ],
          activeLines: [4, 5, 6],
          output: "1",
        },
        {
          label: "Step 2: Follow-up twist adds negatives [3, 4, -7, 1, 3, 3], k = 7",
          explanation:
            "When `right = 2` hits `-7`, `total` drops to `0`, yet `[3, 4, -7, 1, 3, 3]` sums to `7`. Sliding Window has already discarded prefix choices and undercounts.",
          code: [
            "nums ← [3, 4, -7, 1, 3, 3], k ← 7",
            "// At right=2: 3 + 4 + (-7) = 0; at right=5: [3, 4, -7, 1, 3, 3] == 7!",
            "// True count is 3 ([3,4], [3,4,-7,1,3,3], [1,3,3]), window finds only 2",
          ],
          activeLines: [2, 3],
          output: "2  (expected 3)",
        },
        {
          label: "Step 3: Pivot to Prefix Sum + HashMap with seen = {0: 1}",
          explanation:
            "Tracking `prefix` totals in `seen` handles positive, zero, and negative deltas in `O(n)` time and `O(n)` space.",
          code: [
            "function count_subarrays_k(nums, k):",
            "    seen ← {0: 1}",
            "    prefix ← 0, count ← 0",
            "    for x in nums:",
            "        prefix ← prefix + x",
            "        count ← count + seen.get(prefix - k, 0)",
            "        seen[prefix] ← seen.get(prefix, 0) + 1",
            "    return count",
          ],
          activeLines: [2, 5, 6, 7],
          output: "3",
        },
      ],
    },
    walkthrough: {
      title: "Trace O(1)-Space Cyclic Sort Pivot on nums = [2, 4, 1, 3, 3]",
      layout: "visual-first",
      steps: [
        {
          title: "Follow-up twist: cut HashSet O(n) space to O(1) via Cyclic Sort",
          tag: "CONCEPT",
          explanation: [
            "Values sit in `[1..4]` across length `5`. Instead of allocating `seen = set()`, treat value `v` as wanting to sit at index `v - 1`.",
            "Start at `i = 0` (`nums[0] = 2`), whose home slot is `target = 2 - 1 = 1`.",
          ],
          code: [
            "nums ← [2, 4, 1, 3, 3]",
            "i ← 0",
            "target ← nums[0] - 1   // 1",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "0" },
            { name: "nums[0]", value: "2" },
            { name: "target", value: "1" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "O(1)-space follow-up starts at i = 0: value 2 belongs at index 1",
            trays: [
              {
                label: "nums[0..4]",
                cells: [
                  { id: "c0", value: "2", index: 0, state: "active" },
                  { id: "c1", value: "4", index: 1, state: "pivot" },
                  { id: "c2", value: "1", index: 2 },
                  { id: "c3", value: "3", index: 3 },
                  { id: "c4", value: "3", index: 4 },
                ],
                pointers: [
                  { index: 0, label: "i", tone: "coral" },
                  { index: 1, label: "target", tone: "accent" },
                ],
              },
            ],
          },
        },
        {
          title: "Swap nums[0] (2) into home slot 1 -> nums = [4, 2, 1, 3, 3]",
          tag: "TRACE",
          explanation: [
            "Since `nums[0] (2) != nums[1] (4)`, swap them. Value `2` is now home at index `1`.",
            "Stay at `i = 0` because the incoming value `4` belongs at index `4 - 1 = 3`, not `0`.",
          ],
          code: [
            "swap(nums[0], nums[1])   // [4, 2, 1, 3, 3]",
            "// keep i = 0; check new nums[0] = 4 -> target = 3",
          ],
          activeLines: [1],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "0" },
            { name: "nums[0]", value: "4", changed: true },
            { name: "target", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Value 2 reaches index 1; incoming 4 stays at i = 0 targeting index 3",
            trays: [
              {
                label: "nums[0..4]",
                cells: [
                  { id: "c0", value: "4", index: 0, state: "active" },
                  { id: "c1", value: "2", index: 1, state: "done" },
                  { id: "c2", value: "1", index: 2 },
                  { id: "c3", value: "3", index: 3, state: "pivot" },
                  { id: "c4", value: "3", index: 4 },
                ],
                pointers: [
                  { index: 0, label: "i", tone: "coral" },
                  { index: 3, label: "target", tone: "accent" },
                ],
              },
            ],
          },
        },
        {
          title: "Chain swaps at i = 0 until 1 settles home: [1, 2, 3, 4, 3]",
          tag: "TRACE",
          explanation: [
            "Swap `nums[0]` (`4`) with `nums[3]` (`3`) -> `[3, 2, 1, 4, 3]`, then swap `nums[0]` (`3`) with `nums[2]` (`1`) -> `[1, 2, 3, 4, 3]`.",
            "Now `nums[0] == 1` matches `0 + 1`, so `i` advances past settled indices `1, 2, 3`.",
          ],
          code: [
            "swap(nums[0], nums[3])   // [3, 2, 1, 4, 3]",
            "swap(nums[0], nums[2])   // [1, 2, 3, 4, 3]",
            "// nums[0..3] are all in home slots!",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "nums[0..3]", value: "[1, 2, 3, 4]", changed: true },
            { name: "i advances to", value: "4" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Indices 0..3 hold [1, 2, 3, 4] in their home slots in O(1) extra space",
            trays: [
              {
                label: "nums[0..4]",
                cells: [
                  { id: "c0", value: "1", index: 0, state: "done" },
                  { id: "c1", value: "2", index: 1, state: "done" },
                  { id: "c2", value: "3", index: 2, state: "done" },
                  { id: "c3", value: "4", index: 3, state: "done" },
                  { id: "c4", value: "3", index: 4, state: "active" },
                ],
                pointers: [{ index: 4, label: "i=4", tone: "coral" }],
              },
            ],
          },
        },
        {
          title: "Collision at i = 4: target index 2 already holds 3",
          tag: "PITFALL",
          explanation: [
            "At `i = 4`, `nums[4] = 3` looks at `target = 3 - 1 = 2`. Slot `2` already holds `3`!",
            "Trying to swap `nums[4]` with `nums[2]` would loop forever; checking `if nums[i] != nums[target]` prevents an infinite loop and flags `3` as the duplicate.",
          ],
          code: [
            "target ← nums[4] - 1            // 2",
            "if nums[4] == nums[2]:          // 3 == 3 and 4 != 2",
            "    return nums[4]              // duplicate = 3!",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "4" },
            { name: "nums[4]", value: "3" },
            { name: "nums[2]", value: "3" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Collision at i = 4: nums[4] == nums[2] == 3 avoids an infinite swap and catches duplicate 3",
            trays: [
              {
                label: "nums[0..4]",
                cells: [
                  { id: "c0", value: "1", index: 0, state: "done" },
                  { id: "c1", value: "2", index: 1, state: "done" },
                  { id: "c2", value: "3", index: 2, state: "pivot" },
                  { id: "c3", value: "4", index: 3, state: "done" },
                  { id: "c4", value: "3", index: 4, state: "active" },
                ],
                pointers: [
                  { index: 2, label: "target (3)", tone: "ok" },
                  { index: 4, label: "i (3)", tone: "coral" },
                ],
              },
            ],
          },
        },
        {
          title: "Verify O(n) time, O(1) space, and read-only Floyd follow-up",
          tag: "CHECK",
          explanation: [
            "Every swap places at least one value into its permanent home slot, capping total swaps at `n - 1` (`O(n)` time, `O(1)` extra space).",
            "Mention in Stage 6: if the caller forbids mutating `nums`, Floyd's Fast-Slow cycle check finds `3` in `O(n)` time and `O(1)` space without writes.",
          ],
          code: [
            "return 3   // O(n) time, O(1) space",
          ],
          activeLines: [1],
          codeLabel: "Pseudocode",
          state: [
            { name: "Duplicate", value: "3", changed: true },
            { name: "Swaps", value: "3 (<= n)" },
            { name: "Extra space", value: "O(1)" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Duplicate 3 confirmed in O(n) time and O(1) extra space after 3 total swaps",
            trays: [
              {
                label: "nums[0..4]",
                cells: [
                  { id: "c0", value: "1", index: 0, state: "done" },
                  { id: "c1", value: "2", index: 1, state: "done" },
                  { id: "c2", value: "3", index: 2, state: "done" },
                  { id: "c3", value: "4", index: 3, state: "done" },
                  { id: "c4", value: "3", index: 4, state: "active" },
                ],
                pointers: [{ index: 4, label: "dup=3", tone: "ok" }],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Infinite loop when Cyclic Sort swaps equal numbers",
        detail:
          "Writing `while nums[i] != i + 1: swap(nums[i], nums[nums[i] - 1])` hangs forever if two equal values swap endlessly. Always test `nums[i] != nums[target]` before swapping.",
        code: "while nums[i] != nums[nums[i] - 1]:\n    target ← nums[i] - 1\n    swap(nums[i], nums[target])",
      },
      {
        title: "Picking the wrong heap polarity for streaming Top-K",
        detail:
          "Keeping the `k` largest elements of a stream requires a Min-Heap of size `k` (so `pop()` evicts the smallest element), while keeping the `k` smallest requires a Max-Heap of size `k`.",
      },
      {
        title: "Iterating forward in 1D rolling 0/1 Knapsack DP",
        detail:
          "Compressing `dp[i][w]` to `dp[w]` reuses the same array across items. Walking `w` from `w_i` up to `W` reads already-updated `dp[w - w_i]`, turning 0/1 Knapsack into Unbounded Knapsack. Always loop `w` from `W` down to `w_i`.",
      },
    ],
    predictChecks: [
      {
        prompt: "You solved `find_duplicate(nums)` with a HashSet, and the interviewer says: 'Use O(1) extra space and do not modify nums.' What is your pivot?",
        code: "// len(nums) == n + 1, values in [1..n]\n// Constraint: O(1) extra space, nums is read-only",
        options: [
          { id: "a", label: "Floyd's Fast-Slow cycle detection treating nums[idx] as next pointer" },
          { id: "b", label: "In-place Cyclic Sort swaps" },
          { id: "c", label: "Copy nums into a sorted array" },
        ],
        correctId: "a",
        explanation: "Cyclic Sort and sorting both modify or copy nums. Floyd's Fast-Slow pointer runs in O(n) time, O(1) extra space, and never writes to nums.",
      },
      {
        prompt: "A streaming monitor must report the 3rd highest score seen so far after every incoming score (`n = 10^7` total scores). Which structure fits?",
        code: "// Unbounded stream, need Kth largest after each push",
        options: [
          { id: "a", label: "Sort the entire stream on every push" },
          { id: "b", label: "A Min-Heap capped at size k = 3" },
          { id: "c", label: "A Max-Heap storing all 10^7 scores" },
        ],
        correctId: "b",
        explanation: "A Min-Heap of size k = 3 holds the top 3 scores in O(k) space; its root is the 3rd largest and updates take O(log k) = O(1) time.",
      },
    ],
    practiceTask: {
      title: "In-Place O(1)-Space Duplicate Finder",
      tier: "Warmup",
      goal: "Given mutable array `nums` of length `n + 1` with integers in `[1..n]` containing one repeated number (possibly repeated more than once), return the duplicate in `O(n)` time and `O(1)` extra space without a HashSet.",
      constraints: [
        "2 <= len(nums) <= 10^5",
        "1 <= nums[i] <= len(nums) - 1",
        "Target: O(n) time, O(1) extra space",
      ],
      examples: [
        { input: "nums = [2, 4, 1, 3, 3]", output: "3" },
        { input: "nums = [1, 1]", output: "1" },
      ],
      tasks: [
        "Loop `i` from `0` to `len(nums) - 1`.",
        "If `nums[i] != i + 1`, set `target = nums[i] - 1`.",
        "If `nums[i] == nums[target]`, return `nums[i]`; otherwise swap `nums[i]` and `nums[target]` without advancing `i`.",
      ],
      starterCode: "function find_duplicate_o1(nums):\n    // TODO: O(n) time, O(1) extra space via cyclic placement",
      expectedOutput: "3\n1",
      hint: "Only increment `i` when `nums[i] == i + 1`; whenever you swap, inspect the new element at index `i` next.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function find_duplicate_o1(nums):\n    i ← 0\n    while i < len(nums):\n        if nums[i] != i + 1:\n            target ← nums[i] - 1\n            if nums[i] == nums[target]:\n                return nums[i]\n            swap(nums[i], nums[target])\n        else:\n            i ← i + 1\n    return -1",
    },
    practiceChallenges: [
      {
        title: "Subarray Count With Negative Numbers",
        tier: "Warmup",
        goal: "Given an integer array `nums` (including negative values and zeros) and integer `k`, return the total number of contiguous subarrays whose sum equals `k`.",
        constraints: [
          "1 <= len(nums) <= 10^5",
          "-10^4 <= nums[i] <= 10^4",
          "Target: O(n) average time, O(n) space",
        ],
        examples: [
          { input: "nums = [3, 4, -7, 1, 3, 3], k = 7", output: "3" },
          { input: "nums = [1, -1, 0], k = 0", output: "3", explanation: "[1,-1], [0], and [1,-1,0] all sum to 0." },
        ],
        tasks: [
          "Initialize `seen = {0: 1}`, `prefix = 0`, `count = 0`.",
          "For each `x`, update `prefix += x`, add `seen.get(prefix - k, 0)`, then increment `seen[prefix]`.",
        ],
        starterCode: "function count_subarrays_negatives(nums, k):\n    // TODO: Prefix Sum + HashMap pivot for negative numbers",
        expectedOutput: "3\n3",
        hint: "Sliding Window breaks on `[1, -1, 0]`; `seen = {0: 1}` ensures prefixes equal to `k` starting at index `0` are counted.",
        complexity: { time: "O(n) average", space: "O(n)" },
        solutionCode:
          "function count_subarrays_negatives(nums, k):\n    seen ← {0: 1}\n    prefix ← 0\n    count ← 0\n    for x in nums:\n        prefix ← prefix + x\n        count ← count + seen.get(prefix - k, 0)\n        seen[prefix] ← seen.get(prefix, 0) + 1\n    return count",
      },
      {
        title: "Streaming Kth Largest Score",
        tier: "Core",
        goal: "Given `k`, an initial list `initial`, and a sequence of incoming stream scores `stream`, return a list containing the `k`-th largest score after each incoming score arrives.",
        constraints: [
          "1 <= k <= 10^4",
          "Total items <= 10^5",
          "Target: O(log k) per stream item, O(k) space",
        ],
        examples: [
          { input: "k = 3, initial = [4, 5, 8, 2], stream = [3, 5, 10, 9, 4]", output: "[4, 5, 5, 8, 8]" },
          { input: "k = 2, initial = [10], stream = [6, 12]", output: "[6, 10]" },
        ],
        tasks: [
          "Build a Min-Heap `h` and push every element from `initial`, popping whenever `len(h) > k`.",
          "For each `val` in `stream`, push `val`, pop if `len(h) > k`, and append `h[0]` (heap min) to output.",
        ],
        starterCode: "function track_kth_largest(k, initial, stream):\n    // TODO: maintain Min-Heap of size <= k",
        expectedOutput: "[4, 5, 5, 8, 8]\n[6, 10]",
        hint: "A Min-Heap of size `k` discards everything below the top `k` items, so `h[0]` is always the `k`-th largest.",
        complexity: { time: "O((n + m) log k)", space: "O(k)" },
        solutionCode:
          "function track_kth_largest(k, initial, stream):\n    h ← empty Min-Heap\n    for x in initial:\n        h.push(x)\n        if len(h) > k:\n            h.pop()\n    out ← []\n    for val in stream:\n        h.push(val)\n        if len(h) > k:\n            h.pop()\n        out.append(h.peek())\n    return out",
      },
      {
        title: "Space-Compressed 0/1 Knapsack",
        tier: "Stretch",
        goal: "Given `weights`, `values`, and capacity `cap`, compute the maximum total value achievable using each item at most once, using only `O(cap)` extra space (a single 1D array).",
        constraints: [
          "1 <= len(weights) <= 500",
          "1 <= cap <= 10^4",
          "Target: O(n * cap) time, O(cap) space",
        ],
        examples: [
          { input: "weights = [2, 3, 4], values = [3, 4, 5], cap = 5", output: "7" },
          { input: "weights = [4, 5, 1], values = [1, 2, 3], cap = 4", output: "3" },
        ],
        tasks: [
          "Allocate `dp` of size `cap + 1` initialized to `0`.",
          "For each item `(w, v)`, iterate capacity `c` downward from `cap` to `w`.",
          "Update `dp[c] = max(dp[c], dp[c - w] + v)` and return `dp[cap]`.",
        ],
        starterCode: "function knapsack_1d(weights, values, cap):\n    // TODO: O(cap)-space rolling 0/1 knapsack",
        expectedOutput: "7\n3",
        hint: "Iterating `c` downward guarantees `dp[c - w]` still holds the result from the previous item row rather than reusing the current item.",
        complexity: { time: "O(n * cap)", space: "O(cap)" },
        solutionCode:
          "function knapsack_1d(weights, values, cap):\n    dp ← array of size cap + 1 filled with 0\n    for i from 0 to len(weights) - 1:\n        w ← weights[i]\n        v ← values[i]\n        for c from cap down to w:\n            dp[c] ← max(dp[c], dp[c - w] + v)\n    return dp[cap]",
      },
    ],
  },
};

export const dsaM24PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m24",
  title: "Module 24 Practice Set: Interview Playbook & Mixed Patterns",
  description:
    "Four disguised interview challenges combining constraint decoding, O(1)-space pivots, monotonic stacks, topological cycle checks, and rolling dynamic programming.",
  problems: [
    {
      id: "dsa-m24-p1",
      title: "Missing Badge Number in O(1) Memory",
      patternHint:
        "Lesson 24-2 & 24-3 trigger: values sit in [0..n] with n <= 10^5 and O(1) extra space required -> Cyclic Sort placement (or XOR/sum check).",
      lessonRefId: "dsa-interview-followups",
      goal: "A security turnstile logs `n` distinct employee badge IDs drawn from `0..n` into an unsorted mutable array `badges`, leaving one ID missing. Return the missing badge ID in `O(n)` time and `O(1)` extra space.",
      constraints: [
        "1 <= len(badges) <= 10^5",
        "0 <= badges[i] <= len(badges), all values distinct",
        "Target: O(n) time, O(1) extra space",
      ],
      examples: [
        {
          input: "badges = [3, 0, 1]",
          output: "2",
          explanation: "Range is 0..3; 0, 1, and 3 are present so 2 is missing.",
        },
        {
          input: "badges = [0, 1]",
          output: "2",
        },
      ],
      tasks: [
        "Place each `badges[i] < n` at its home index `badges[i]` using Cyclic Sort swaps.",
        "Scan `0..n - 1` and return the first `i` where `badges[i] != i`, or `n` if all slots match.",
      ],
      starterCode: "function find_missing_badge(badges):\n    // TODO: O(n) time, O(1) extra space missing badge ID",
      expectedOutput: "2\n2",
      hint: "How to explain this in an interview: Start with an O(n) HashSet baseline, then pivot to Cyclic Sort (putting each value v < n at index v) or XOR to drop extra memory to O(1).",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function find_missing_badge(badges):\n    n ← len(badges)\n    i ← 0\n    while i < n:\n        target ← badges[i]\n        if target < n and badges[i] != badges[target]:\n            swap(badges[i], badges[target])\n        else:\n            i ← i + 1\n    for i from 0 to n - 1:\n        if badges[i] != i:\n            return i\n    return n",
    },
    {
      id: "dsa-m24-p2",
      title: "Server Queue Surge Span",
      patternHint:
        "Lesson 24-2 trigger: 'consecutive preceding days <= today' at n <= 10^5 -> Monotonic Decreasing Stack storing (load, span) or indices.",
      lessonRefId: "dsa-pattern-triggers",
      goal: "Given daily server queue loads `loads[0..n-1]`, return an array `spans` where `spans[i]` is the maximum number of consecutive days ending on day `i` (including day `i`) whose load was less than or equal to `loads[i]`.",
      constraints: [
        "1 <= len(loads) <= 10^5",
        "1 <= loads[i] <= 10^5",
        "Target: O(n) time, O(n) space",
      ],
      examples: [
        {
          input: "loads = [100, 80, 60, 70, 60, 75, 85]",
          output: "[1, 1, 1, 2, 1, 4, 6]",
          explanation: "At load 85, the 6 consecutive days [80, 60, 70, 60, 75, 85] are all <= 85.",
        },
        {
          input: "loads = [10, 20, 30]",
          output: "[1, 2, 3]",
        },
      ],
      tasks: [
        "Maintain a Monotonic Decreasing Stack of `(load, span)` pairs (or indices of strictly larger loads).",
        "While `stack` is non-empty and `stack[-1][0] <= loads[i]`, add `stack.pop()[1]` to `cur_span`.",
        "Push `(loads[i], cur_span)` and append `cur_span` to `spans`.",
      ],
      starterCode: "function compute_surge_spans(loads):\n    // TODO: O(n) monotonic stack surge span",
      expectedOutput: "[1, 1, 1, 2, 1, 4, 6]\n[1, 2, 3]",
      hint: "How to explain this in an interview: Scanning left for each day costs O(n^2) and times out at n = 10^5; popping smaller-or-equal earlier days onto a monotonic stack collapses each element once for O(n) amortized time.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "function compute_surge_spans(loads):\n    stack ← []\n    spans ← []\n    for x in loads:\n        span ← 1\n        while len(stack) > 0 and stack[-1][0] <= x:\n            span ← span + stack.pop()[1]\n        stack.append((x, span))\n        spans.append(span)\n    return spans",
    },
    {
      id: "dsa-m24-p3",
      title: "Microservice Deployment Cycle Audit",
      patternHint:
        "Lessons 24-1 & 24-2 trigger: directed dependency rules '[service, requires]' asking whether a deadlock cycle blocks deployment -> Kahn's Topological BFS.",
      lessonRefId: "dsa-interview-framework",
      goal: "A release pipeline has `num_services` services (`0..num_services - 1`) and dependency pairs `[svc, dep]` meaning `dep` must deploy before `svc`. Return `true` if a circular dependency prevents deployment, or `false` if a valid deploy order exists.",
      constraints: [
        "1 <= num_services <= 10^5",
        "0 <= len(deps) <= 10^5",
        "Target: O(V + E) time and space",
      ],
      examples: [
        {
          input: "num_services = 3, deps = [[1, 0], [2, 1], [0, 2]]",
          output: "true",
          explanation: "0 -> 1 -> 2 -> 0 forms a cycle, so deployment deadlocks.",
        },
        {
          input: "num_services = 4, deps = [[1, 0], [2, 0], [3, 1], [3, 2]]",
          output: "false",
        },
      ],
      tasks: [
        "Clarify return polarity (`true` means cycle exists) and handle `deps = []` without failing.",
        "Build adjacency list `dep -> svc` and `indegree[svc]` array.",
        "Peel zero-indegree nodes with a queue; return `deployed != num_services`.",
      ],
      starterCode: "function has_deploy_cycle(num_services, deps):\n    // TODO: O(V + E) cycle audit returning true if a cycle exists",
      expectedOutput: "true\nfalse",
      hint: "How to explain this in an interview: First clarify whether [a, b] means a depends on b and confirm true means cycle exists; then run Kahn's BFS so any unpeeled node proves a cycle.",
      complexity: { time: "O(V + E)", space: "O(V + E)" },
      solutionCode:
        "function has_deploy_cycle(num_services, deps):\n    adj ← list of num_services empty lists\n    indegree ← array of size num_services filled with 0\n    for pair in deps:\n        svc ← pair[0]\n        dep ← pair[1]\n        adj[dep].append(svc)\n        indegree[svc] ← indegree[svc] + 1\n    q ← queue of all i where indegree[i] == 0\n    deployed ← 0\n    while len(q) > 0:\n        u ← q.pop_left()\n        deployed ← deployed + 1\n        for v in adj[u]:\n            indegree[v] ← indegree[v] - 1\n            if indegree[v] == 0:\n                q.append(v)\n    return deployed != num_services",
    },
    {
      id: "dsa-m24-p4",
      title: "Warehouse Shift Energy Optimizer",
      patternHint:
        "Lessons 24-2 & 24-3 trigger: maximize sum with no two adjacent slots -> 1D DP compressed to O(1) rolling variables (prev2, prev1).",
      lessonRefId: "dsa-interview-followups",
      goal: "A robotic crane earns `yields[i]` on shift `i`, yet running two back-to-back shifts overheats the motor. Given non-negative `yields[0..n-1]`, return the maximum total yield without picking two adjacent indices in `O(n)` time and `O(1)` extra space.",
      constraints: [
        "0 <= len(yields) <= 10^5",
        "0 <= yields[i] <= 10^4",
        "Target: O(n) time, O(1) space",
      ],
      examples: [
        {
          input: "yields = [2, 7, 9, 3, 1]",
          output: "12",
          explanation: "Picking shifts 0, 2, and 4 gives 2 + 9 + 1 = 12.",
        },
        {
          input: "yields = [5, 1, 1, 5]",
          output: "10",
        },
      ],
      tasks: [
        "Guard empty arrays (`[] -> 0`).",
        "Maintain two rolling scalars `prev2` (`dp[i - 2]`) and `prev1` (`dp[i - 1]`), both initialized to `0`.",
        "For each `val` in `yields`, compute `cur = max(prev1, prev2 + val)`, then shift `prev2 = prev1`, `prev1 = cur`.",
      ],
      starterCode: "function max_shift_yield(yields):\n    // TODO: O(n) time, O(1) space rolling DP",
      expectedOutput: "12\n10",
      hint: "How to explain this in an interview: Test greedy on [5, 1, 1, 5] vs [2, 7, 9, 3, 1] to reject greedy, write dp[i] = max(dp[i-1], dp[i-2] + yields[i]), and compress dp[] to two scalars for O(1) space.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function max_shift_yield(yields):\n    prev2 ← 0\n    prev1 ← 0\n    for val in yields:\n        cur ← max(prev1, prev2 + val)\n        prev2 ← prev1\n        prev1 ← cur\n    return prev1",
    },
  ],
};
