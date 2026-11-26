import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM11Lessons: Record<string, LessonContent> = {
  "dsa-elementary-sorts": {
    lessonId: "dsa-elementary-sorts",
    subtitle:
      "Compare O(n²) Selection, Bubble, and Insertion Sort, understand why Insertion Sort runs in O(n) on nearly-sorted inputs, and define sorting stability.",
    intro: {
      heading: "Elementary Sorts: Selection, Bubble & Insertion Sort",
      explanation: [
        "Picking the wrong `O(n²)` sort turns a fast update into a bottleneck or scrambles tied records: **Selection Sort** still runs `n(n - 1)/2` comparisons on an already-sorted array and jumps `(3, a)` past `(3, b)`, while changing `>` to `>=` in **Insertion Sort** breaks tie order.",
        "Although Selection Sort, Bubble Sort, and Insertion Sort all run in `O(n²)` worst-case time and `O(1)` extra space, **Insertion Sort** inserts each element into an already-sorted prefix—finishing in `O(n)` time on sorted or nearly-sorted streams while preserving **stability**.",
      ],
      analogy:
        "Insertion Sort is how most people sort playing cards in their hand: you keep the left side of your hand sorted, pick up one new card at a time, and slide it left past any taller cards until it settles into its spot.",
      realWorldUses: [
        "Sorting tiny subarrays (size <= 16 or 32) inside hybrid production sorts where low constant overhead beats recursion",
        "Maintaining order on nearly-sorted streams such as timestamps arriving slightly out of order",
      ],
    },
    sections: [
      {
        heading: "Selection, Bubble, and Insertion Sort side by side",
        paragraphs: [
          "**Selection Sort** divides the array into a sorted prefix `[0..i-1]` and an unsorted suffix `[i..n-1]`. On pass `i`, it finds the minimum index `min_idx` in `[i..n-1]` and swaps `arr[i]` with `arr[min_idx]`. It performs at most `n - 1` swaps total, but always makes `n(n - 1)/2` comparisons, even when the array is already sorted.",
          "**Bubble Sort** sweeps left to right and swaps adjacent elements whenever `arr[j] > arr[j + 1]`, bubbling the largest remaining value to the end of the pass. Adding an early-exit `swapped` flag lets it stop in `O(n)` on already-sorted input, though it still does many swaps on unsorted data.",
          "**Insertion Sort** grows a sorted prefix `[0..i-1]` by taking `key = arr[i]` and shifting larger elements one slot right until `arr[j] <= key`. Because the `while` loop stops the moment it sees an element `<= key`, each pass takes `O(1)` work on sorted arrays and `O(k)` work when every item starts at most `k` positions away from its final spot.",
        ],
        table: {
          caption: "Elementary O(n²) sorting algorithms compared",
          headers: ["Algorithm", "Best time", "Worst time", "Extra space", "Stable?"],
          rows: [
            ["Selection Sort", "`O(n²)`", "`O(n²)`", "`O(1)`", "No (long swap can jump equal keys)"],
            ["Bubble Sort (with early exit)", "`O(n)`", "`O(n²)`", "`O(1)`", "Yes (swap only on strict `>`)"],
            ["Insertion Sort", "`O(n)`", "`O(n²)`", "`O(1)`", "Yes (shift only on strict `>`)"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "KEY IDEA",
          text: "If an array has at most `I` inverted pairs (pairs where `i < j` and `arr[i] > arr[j]`), Insertion Sort performs exact `I` shifts and runs in `O(n + I)` time. On nearly-sorted data where `I = O(n)`, Insertion Sort is linear.",
        },
      },
      {
        heading: "Sorting stability and why strict > matters",
        paragraphs: [
          "A sorting algorithm is **stable** if two elements with equal sort keys stay in the same relative order they had in the input. Suppose records are `(score, name)` and you already sorted alphabetically by `name`: `[(90, \"Alice\"), (85, \"Bob\"), (90, \"Cara\")]`. A stable sort by `score` keeps `(90, \"Alice\")` before `(90, \"Cara\")`; an unstable sort can flip them.",
          "In Insertion Sort and Bubble Sort, stability comes from using strict inequality (`arr[j] > key` or `arr[j] > arr[j + 1]`). If you wrote `>=` instead of `>`, an equal key arriving later would shift past an earlier equal key and break stability. Selection Sort breaks stability because swapping `arr[0] = 3a` with `arr[2] = 1` jumps `3a` past `3b` at index `1`.",
        ],
        code: [
          "// BROKEN stability: >= shifts (3, b) past (3, a)",
          "// while j >= 0 and arr[j] >= key:   <-- unstable!",
          "",
          "// FIXED: strict > keeps (3, a) before (3, b) and stops in O(1) on sorted prefixes",
          "function insertion_sort(arr):",
          "    for i from 1 to len(arr) - 1:",
          "        key ← arr[i]",
          "        j ← i - 1",
          "        while j >= 0 and arr[j] > key:",
          "            arr[j + 1] ← arr[j]",
          "            j ← j - 1",
          "        arr[j + 1] ← key",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Stability test on [(3, a), (3, b), (1, c)]",
          headers: ["Algorithm", "Output order", "Preserves (3, a) before (3, b)?"],
          rows: [
            ["Insertion Sort (`>`)", "`[(1, c), (3, a), (3, b)]`", "Yes (stable)"],
            ["Bubble Sort (`>`)", "`[(1, c), (3, a), (3, b)]`", "Yes (stable)"],
            ["Selection Sort (in-place swap)", "`[(1, c), (3, b), (3, a)]`", "No (`3a` swapped past `3b`)"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Changing `arr[j] > key` to `arr[j] >= key` in Insertion Sort subtly destroys stability and performs unnecessary extra shifts whenever duplicate keys appear.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From Always-O(n²) Selection Sort to Stable, Adaptive Insertion Sort",
      steps: [
        {
          label: "Step 1: Selection Sort (always O(n²) and unstable)",
          explanation: "Swapping the minimum into slot `i` skips across equal keys and runs `n(n - 1)/2` comparisons even on sorted inputs.",
          code: [
            "function selection_sort(arr):",
            "    for i from 0 to len(arr) - 2:",
            "        min_i ← i",
            "        for j from i + 1 to len(arr) - 1:",
            "            if arr[j] < arr[min_i]: min_i ← j",
            "        swap(arr, i, min_i)",
          ],
          activeLines: [4, 6],
          output: "[(3,a), (3,b), (1,c)] -> [(1,c), (3,b), (3,a)] (unstable!)",
        },
        {
          label: "Step 2: Broken Insertion Sort using >=",
          explanation: "Shifting leftward adapts to sorted prefixes, yet `arr[j] >= key` pushes equal keys past earlier equals.",
          code: [
            "function insertion_unstable(arr):",
            "    for i from 1 to len(arr) - 1:",
            "        key ← arr[i]; j ← i - 1",
            "        while j >= 0 and arr[j] >= key:   // BUG: >= breaks ties",
            "            arr[j + 1] ← arr[j]; j ← j - 1",
            "        arr[j + 1] ← key",
          ],
          activeLines: [4],
          output: "[(3,a), (3,b), (1,c)] -> [(1,c), (3,b), (3,a)] (unstable!)",
        },
        {
          label: "Step 3: Fix to strict > for stable O(n + I) Insertion Sort",
          explanation: "Stopping as soon as `arr[j] <= key` preserves equal-key order and finishes sorted arrays in `O(n)`.",
          code: [
            "function insertion_sort(arr):",
            "    for i from 1 to len(arr) - 1:",
            "        key ← arr[i]; j ← i - 1",
            "        while j >= 0 and arr[j] > key:",
            "            arr[j + 1] ← arr[j]; j ← j - 1",
            "        arr[j + 1] ← key",
          ],
          activeLines: [4],
          output: "[(3,a), (3,b), (1,c)] -> [(1,c), (3,a), (3,b)] (stable)",
        },
      ],
    },
    walkthrough: {
      title: "Trace Insertion Sort on arr = [5, 2, 4, 1]",
      layout: "visual-first",
      steps: [
        {
          title: "Start with sorted prefix [5] and pick key = 2",
          tag: "CONCEPT",
          explanation: [
            "Index `0` (`5`) is trivially a sorted prefix of length `1`.",
            "Outer loop starts at `i = 1`, saves `key = arr[1] = 2`, and sets `j = 0` to compare leftwards.",
          ],
          code: [
            "// arr = [5, 2, 4, 1]",
            "i ← 1, key ← arr[1]  // key = 2",
            "j ← i - 1            // j = 0",
            "while j >= 0 and arr[j] > key:",
            "    arr[j + 1] ← arr[j]; j ← j - 1",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Sorted prefix", value: "[0..0] -> [5]" },
            { name: "i / key", value: "i = 1, key = 2", changed: true },
            { name: "j", value: "0", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Pass i = 1: compare key = 2 against sorted prefix [5]",
                cells: [
                  { id: "e5", value: "5", index: 0, state: "done" },
                  { id: "e2", value: "2", index: 1, state: "active" },
                  { id: "e4", value: "4", index: 2, state: "dim" },
                  { id: "e1", value: "1", index: 3, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "j", tone: "coral" },
                  { index: 1, label: "i (key=2)", tone: "accent" },
                ],
                highlightRange: [0, 0],
              },
            ],
            caption: "Prefix [0..0] is sorted; key = 2 at index 1 will shift left past 5.",
          },
        },
        {
          title: "Shift 5 right and insert key = 2 at index 0",
          tag: "TRACE",
          explanation: [
            "Since `arr[0] = 5 > 2`, shift `5` right to index `1` and decrement `j` to `-1`.",
            "Now `arr[j + 1] = arr[0] = 2`, expanding the sorted prefix to `[2, 5]`.",
          ],
          code: [
            "while j >= 0 and arr[j] > key:  // 5 > 2",
            "    arr[j + 1] ← arr[j]",
            "    j ← j - 1",
            "arr[j + 1] ← key                // arr[0] ← 2",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Shift", value: "arr[1] ← 5", changed: true },
            { name: "Insert", value: "arr[0] ← 2", changed: true },
            { name: "Sorted prefix", value: "[2, 5]" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After pass i = 1: prefix [2, 5] is sorted",
                cells: [
                  { id: "e2", value: "2", index: 0, state: "done" },
                  { id: "e5", value: "5", index: 1, state: "done" },
                  { id: "e4", value: "4", index: 2, state: "active" },
                  { id: "e1", value: "1", index: 3, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "placed", tone: "ok" },
                  { index: 2, label: "next i=2", tone: "accent" },
                ],
                highlightRange: [0, 1],
              },
            ],
            caption: "2 and 5 glide into sorted prefix [2, 5]; next key is 4 at index 2.",
          },
        },
        {
          title: "Pass i = 2: shift 5 right, stop at 2 <= 4, place 4",
          tag: "TRACE",
          explanation: [
            "Pick `key = 4` (`i = 2`). Compare `arr[1] = 5 > 4`, so shift `5` right to index `2`.",
            "Next compare `arr[0] = 2`: since `2 <= 4`, the `while` loop stops early without touching `2`, and `arr[1] = 4`.",
          ],
          code: [
            "i ← 2, key ← 4, j ← 1",
            "arr[2] ← arr[1]      // shift 5 right",
            "j ← 0                // arr[0] = 2 <= 4 -> stop!",
            "arr[1] ← key         // place 4 at index 1",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Stopped early at", value: "arr[0] = 2 <= 4", changed: true },
            { name: "Sorted prefix", value: "[2, 4, 5]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After pass i = 2: early stop leaves 2 untouched",
                cells: [
                  { id: "e2", value: "2", index: 0, state: "done" },
                  { id: "e4", value: "4", index: 1, state: "done" },
                  { id: "e5", value: "5", index: 2, state: "done" },
                  { id: "e1", value: "1", index: 3, state: "active" },
                ],
                pointers: [
                  { index: 1, label: "placed 4", tone: "ok" },
                  { index: 3, label: "next i=3", tone: "accent" },
                ],
                highlightRange: [0, 2],
              },
            ],
            caption: "Stopping as soon as arr[j] <= key is what makes Insertion Sort O(n) on nearly-sorted inputs.",
          },
        },
        {
          title: "Pass i = 3: key = 1 shifts [2, 4, 5] right and finishes",
          tag: "PATTERN",
          explanation: [
            "For `key = 1`, every element in `[2, 4, 5]` is greater than `1`, so `5`, `4`, and `2` each shift one slot right.",
            "`j` reaches `-1` and `arr[0] = 1`, producing the fully sorted array `[1, 2, 4, 5]` in `O(1)` extra memory.",
          ],
          code: [
            "i ← 3, key ← 1, j ← 2",
            "while j >= 0 and arr[j] > 1:  // shifts 5, 4, 2",
            "    arr[j + 1] ← arr[j]; j ← j - 1",
            "arr[0] ← 1",
            "return arr                    // [1, 2, 4, 5]",
          ],
          activeLines: [2, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Total shifts", value: "1 + 1 + 3 = 5" },
            { name: "Final arr", value: "[1, 2, 4, 5]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Sorted result [1, 2, 4, 5]",
                cells: [
                  { id: "e1", value: "1", index: 0, state: "done" },
                  { id: "e2", value: "2", index: 1, state: "done" },
                  { id: "e4", value: "4", index: 2, state: "done" },
                  { id: "e5", value: "5", index: 3, state: "done" },
                ],
                pointers: [{ index: 0, label: "min", tone: "ok" }],
                highlightRange: [0, 3],
              },
            ],
            caption: "Total shifts (5) equals the exact number of inversions in [5, 2, 4, 1].",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using arr[j] >= key instead of arr[j] > key",
        detail:
          "Switching `>` to `>=` pushes equal items past earlier copies, breaking sorting stability and wasting shifts when duplicates exist.",
        code: "// Stable: stop when arr[j] <= key\nwhile j >= 0 and arr[j] > key:",
      },
      {
        title: "Thinking all O(n²) sorts are equal on nearly-sorted arrays",
        detail:
          "Selection Sort still performs `n(n - 1)/2` comparisons on an already-sorted array because it scans the whole suffix for the minimum every pass, whereas Insertion Sort finishes in `n - 1` comparisons.",
      },
    ],
    practiceTask: {
      title: "Insertion Sort With Shift Count",
      tier: "Warmup",
      goal: "Sort integer array `nums` in-place using Insertion Sort and return the total number of element shifts performed (not counting the final placement `arr[j + 1] = key`).",
      constraints: ["1 <= len(nums) <= 2000", "Target: O(n²) worst-case, O(n) on sorted input, O(1) extra space"],
      examples: [
        { input: "nums = [5, 2, 4, 1]", output: "5", explanation: "Pass 1 shifts 5 (1); pass 2 shifts 5 (1); pass 3 shifts 5, 4, 2 (3). Total = 5." },
        { input: "nums = [1, 2, 3, 4]", output: "0" },
      ],
      tasks: [
        "Loop `i` from `1` to `len(nums) - 1`, storing `key = nums[i]` and `j = i - 1`.",
        "While `j >= 0` and `nums[j] > key`, copy `nums[j]` into `nums[j + 1]`, decrement `j`, and increment `shifts`.",
      ],
      starterCode: "function insertion_sort_shifts(nums):\n    // TODO: sort in-place and return shift count\n    return shifts",
      expectedOutput: "5\n0",
      hint: "Increment `shifts` inside the `while` loop each time `nums[j]` moves to `nums[j + 1]`.",
      complexity: { time: "O(n²) worst, O(n) best", space: "O(1)" },
      solutionCode:
        "function insertion_sort_shifts(nums):\n    shifts ← 0\n    for i from 1 to len(nums) - 1:\n        key ← nums[i]\n        j ← i - 1\n        while j >= 0 and nums[j] > key:\n            nums[j + 1] ← nums[j]\n            j ← j - 1\n            shifts ← shifts + 1\n        nums[j + 1] ← key\n    return shifts",
    },
    practiceChallenges: [
      {
        title: "Insertion Sort With Shift Count",
        tier: "Warmup",
        goal: "Sort integer array `nums` in-place using Insertion Sort and return the total number of right-shifts performed.",
        constraints: ["1 <= len(nums) <= 2000", "Target: O(n²) worst-case, O(n) sorted, O(1) extra space"],
        examples: [
          { input: "nums = [5, 2, 4, 1]", output: "5", explanation: "Total shifts equals the number of inverted pairs." },
          { input: "nums = [1, 2, 3, 4]", output: "0" },
        ],
        tasks: [
          "Track `key = nums[i]` and shift `nums[j]` right while `j >= 0 and nums[j] > key`.",
          "Count each shift in `shifts` and place `key` at `nums[j + 1]`.",
        ],
        starterCode: "function insertion_sort_shifts(nums):\n    // TODO: sort in-place and return shift count\n    return shifts",
        expectedOutput: "5\n0",
        hint: "Use strict `>` so equal keys do not shift unnecessarily.",
        complexity: { time: "O(n²) worst, O(n) best", space: "O(1)" },
        solutionCode:
          "function insertion_sort_shifts(nums):\n    shifts ← 0\n    for i from 1 to len(nums) - 1:\n        key ← nums[i]\n        j ← i - 1\n        while j >= 0 and nums[j] > key:\n            nums[j + 1] ← nums[j]\n            j ← j - 1\n            shifts ← shifts + 1\n        nums[j + 1] ← key\n    return shifts",
      },
      {
        title: "Sort Color Codes 0, 1, 2 In-Place",
        tier: "Core",
        goal: "Given an array `nums` containing only `0`, `1`, and `2`, sort it in-place in a single pass with `O(1)` extra space without calling a library sort.",
        constraints: ["1 <= len(nums) <= 10^5", "nums[i] in {0, 1, 2}", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [2, 0, 2, 1, 1, 0]", output: "[0, 0, 1, 1, 2, 2]" },
          { input: "nums = [2, 0, 1]", output: "[0, 1, 2]" },
        ],
        tasks: [
          "Maintain three regions with pointers `low`, `mid`, and `high`: `[0..low-1]` are `0`s, `[low..mid-1]` are `1`s, and `[high+1..n-1]` are `2`s.",
          "Inspect `nums[mid]`: swap `0` to `low` and advance both; advance `mid` on `1`; swap `2` to `high` and decrement `high` without advancing `mid`.",
        ],
        starterCode: "function sort_three_colors(nums):\n    // TODO: three-pointer O(n) in-place partition\n    return nums",
        expectedOutput: "[0, 0, 1, 1, 2, 2]\n[0, 1, 2]",
        hint: "When swapping `nums[mid]` with `nums[high]`, do not increment `mid` yet because the value arriving from `high` has not been checked.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function sort_three_colors(nums):\n    low ← 0, mid ← 0, high ← len(nums) - 1\n    while mid <= high:\n        if nums[mid] == 0:\n            swap(nums, low, mid)\n            low ← low + 1\n            mid ← mid + 1\n        else if nums[mid] == 1:\n            mid ← mid + 1\n        else:\n            swap(nums, mid, high)\n            high ← high - 1\n    return nums",
      },
      {
        title: "Sort k-Nearly-Sorted Array Quickly",
        tier: "Stretch",
        goal: "Given an array `nums` where every element starts within `k` indices of its sorted position, sort `nums` in-place using Insertion Sort and prove its `O(n * k)` running time by returning `(nums, max_shifts_per_item)`.",
        constraints: ["1 <= len(nums) <= 10^5", "0 <= k <= 20", "Target: O(n * k) time, O(1) extra space"],
        examples: [
          { input: "nums = [2, 1, 4, 3, 6, 5]", output: "([1, 2, 3, 4, 5, 6], 1)", explanation: "Each item shifts at most 1 slot." },
          { input: "nums = [3, 1, 2, 6, 4, 5]", output: "([1, 2, 3, 4, 5, 6], 2)" },
        ],
        tasks: [
          "Run standard Insertion Sort and track `local_shifts` inside each outer iteration.",
          "Update `max_shifts = max(max_shifts, local_shifts)` and return `(nums, max_shifts)`.",
        ],
        starterCode: "function sort_nearly_sorted(nums):\n    // TODO: Insertion Sort tracking max shifts for any item\n    return (nums, max_shifts)",
        expectedOutput: "([1, 2, 3, 4, 5, 6], 1)\n([1, 2, 3, 4, 5, 6], 2)",
        hint: "Because no value is more than `k` places away from its destination, the inner `while` loop executes at most `k` iterations per `i`.",
        complexity: { time: "O(n * k)", space: "O(1)" },
        solutionCode:
          "function sort_nearly_sorted(nums):\n    max_shifts ← 0\n    for i from 1 to len(nums) - 1:\n        key ← nums[i]\n        j ← i - 1\n        local_shifts ← 0\n        while j >= 0 and nums[j] > key:\n            nums[j + 1] ← nums[j]\n            j ← j - 1\n            local_shifts ← local_shifts + 1\n        nums[j + 1] ← key\n        max_shifts ← max(max_shifts, local_shifts)\n    return (nums, max_shifts)",
      },
    ],
  },

  "dsa-merge-sort": {
    lessonId: "dsa-merge-sort",
    subtitle:
      "Split arrays across log₂ n recursive levels and merge sorted halves in O(n) time to guarantee O(n log n) worst-case sorting and count inversions.",
    intro: {
      heading: "Divide & Conquer: Merge Sort & Inversions",
      explanation: [
        "Elementary `O(n²)` sorts stall once `n` reaches `10^5` (`10^10` operations), and counting out-of-order inversion pairs with nested `for` loops hits the exact same `O(n²)` wall. **Merge Sort** breaks both barriers via **divide and conquer**: split the array in half down to length-1 slices, then merge sorted pairs with a two-pointer scan.",
        "Halving produces `log₂ n` recursion levels, and merging all pairs at one level reads each of the `n` elements once (`O(n)` per level). That delivers a guaranteed `O(n log n)` worst case and **stability**, trading `O(n)` temporary buffer memory for predictable speed.",
      ],
      analogy:
        "Combining two already-alphabetized stacks of exam papers needs zero searching: check only the two top sheets, place the smaller one into a new pile, and repeat until both stacks run out.",
      realWorldUses: [
        "External sorting of multi-gigabyte disk files that do not fit in RAM by merging sorted chunks",
        "Counting inversions in ranking systems to measure how far two preference lists disagree",
      ],
    },
    sections: [
      {
        heading: "Why Merge Sort guarantees O(n log n) with O(n) extra space",
        paragraphs: [
          "Each call `merge_sort(arr, lo, hi)` computes `mid = lo + floor((hi - lo) / 2)`, sorts `[lo..mid]` and `[mid+1..hi]`, and combines them in linear time. Because the array always splits evenly in half regardless of element values, there is no unlucky input order: best, average, and worst cases all run in `O(n log n)`.",
          "Merging two adjacent slices in an array cannot overwrite unread elements without extra space, so `merge` copies into a temporary buffer of size up to `n`. Total auxiliary space is `O(n)` for the buffer plus `O(log n)` for the call stack, giving `O(n)` overall.",
        ],
        table: {
          caption: "Merge Sort complexity and level-by-level work on n elements",
          headers: ["Level", "Subarray count", "Size per subarray", "Total merge work"],
          rows: [
            ["Level 0 (top)", "1", "`n`", "`O(n)`"],
            ["Level 1", "2", "`n / 2`", "`2 * (n / 2) = O(n)`"],
            ["Level k", "`2^k`", "`n / 2^k`", "`O(n)`"],
            ["Base level (`log₂ n`)", "`n`", "`1`", "Base cases (0 merges)"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "KEY IDEA",
          text: "`log₂ n` halving levels multiplied by `O(n)` merge work per level gives `O(n log n)` guaranteed time, even on reverse-sorted arrays.",
        },
      },
      {
        heading: "Counting inversions during the merge step",
        paragraphs: [
          "An **inversion** is a pair of indices `(i, j)` with `i < j` and `arr[i] > arr[j]`. A sorted array has `0` inversions, while a reverse-sorted array of length `n` has `n(n - 1)/2` inversions. Checking every pair takes `O(n²)`, which times out at `n = 10^5`.",
          "Merge Sort counts all inversions in `O(n log n)` for free! Whenever `merge` compares `left[i]` and `right[j]` and finds `right[j] < left[i]`, every remaining item in the sorted `left` half (`left[i..mid]`) is also strictly greater than `right[j]`. So picking `right[j]` adds `mid - i + 1` inversions in one `O(1)` addition.",
        ],
        code: [
          "// BROKEN tie-break: arr[i] < arr[j] picks right on ties (unstable + wrong inv!)",
          "// Example: left = [(2, a), (5, x)], right = [(2, b), (3, y)]",
          "// Strict < outputs [(2, b), ...] and counts +2 false inversions!",
          "",
          "// FIXED: arr[i] <= arr[j] keeps left ties first and only counts strict arr[i] > arr[j]",
          "function merge_and_count(arr, lo, mid, hi, buf):",
          "    i ← lo, j ← mid + 1, k ← lo, inv ← 0",
          "    while i <= mid and j <= hi:",
          "        if arr[i] <= arr[j]:",
          "            buf[k] ← arr[i]; i ← i + 1",
          "        else:",
          "            buf[k] ← arr[j]; j ← j + 1",
          "            inv ← inv + (mid - i + 1)",
          "        k ← k + 1",
          "    copy any leftovers from left or right into buf",
          "    copy buf[lo..hi] back into arr[lo..hi]",
          "    return inv",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Two-pointer merge decision rule",
          headers: ["Comparison", "Action", "Stability rule", "Inversions added"],
          rows: [
            ["`arr[i] <= arr[j]`", "Take `arr[i]` from left half", "`<=` keeps earlier left duplicates first", "`0`"],
            ["`arr[i] > arr[j]`", "Take `arr[j]` from right half", "Right item jumps past `arr[i..mid]`", "`mid - i + 1`"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Use `arr[i] <= arr[j]` (not `<`) when picking from the left half. Strict `<` would wrongly pick the right element on ties, both breaking stability and overcounting equal pairs as inversions!",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build Merge Sort & In-Flight Inversion Counting",
      steps: [
        {
          label: "Step 1: Divide `[lo .. hi]` in half down to size 1",
          explanation: "Stop when `lo >= hi`; otherwise split at `mid` and recurse on both halves.",
          code: [
            "function merge_sort(arr, lo, hi, buf):",
            "    if lo >= hi: return 0",
            "    mid ← lo + floor((hi - lo) / 2)",
            "    inv ← merge_sort(arr, lo, mid, buf)",
            "    inv ← inv + merge_sort(arr, mid + 1, hi, buf)",
            "    return inv + merge_and_count(arr, lo, mid, hi, buf)",
          ],
          activeLines: [2, 3, 4, 5],
          output: "Splits [8, 3, 5, 2] -> [8, 3] and [5, 2] -> single items",
        },
        {
          label: "Step 2: Merge two sorted halves with `arr[i] <= arr[j]`",
          explanation: "Using `<=` keeps equal keys from the left half ahead of equal keys from the right half (preserving stability).",
          code: [
            "while i <= mid and j <= hi:",
            "    if arr[i] <= arr[j]:",
            "        buf[k] ← arr[i]; i ← i + 1",
            "    else:",
            "        buf[k] ← arr[j]; j ← j + 1",
            "    k ← k + 1",
          ],
          activeLines: [2, 3],
          output: "Merges [3, 8] + [2, 5] -> [2, 3, 5, 8]",
        },
        {
          label: "Step 3: Count `mid - i + 1` inversions when right wins",
          explanation: "Whenever `arr[j] < arr[i]`, every item in `arr[i..mid]` is also greater than `arr[j]`, adding `mid - i + 1` inversions at once.",
          code: [
            "while i <= mid and j <= hi:",
            "    if arr[i] <= arr[j]:",
            "        buf[k] ← arr[i]; i ← i + 1",
            "    else:",
            "        buf[k] ← arr[j]; j ← j + 1",
            "        inv ← inv + (mid - i + 1)",
            "    k ← k + 1",
          ],
          activeLines: [6],
          output: "[8, 3, 5, 2] -> 5 inversions counted in O(n log n)",
        },
      ],
    },
    walkthrough: {
      title: "Split and merge [8, 3, 5, 2] across log₂ n levels",
      layout: "visual-first",
      steps: [
        {
          title: "Level 0: start with unsorted array [8, 3, 5, 2]",
          tag: "CONCEPT",
          explanation: [
            "We enter `merge_sort(arr, 0, 3)` with `n = 4` items: `[8, 3, 5, 2]`.",
            "Since `lo < hi`, compute `mid = floor((0 + 3) / 2) = 1` so we split into `[0..1]` and `[2..3]`.",
          ],
          code: [
            "function merge_sort(arr, lo, hi):",
            "    if lo >= hi: return 0",
            "    mid ← lo + floor((hi - lo) / 2)  // mid = 1",
            "    split into [lo..mid] and [mid + 1..hi]",
          ],
          activeLines: [1, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Depth", value: "Level 0 (n = 4)" },
            { name: "mid", value: "1", changed: true },
            { name: "Inversions", value: "0" },
          ],
          visual: {
            kind: "dsa-divide",
            levels: [
              {
                label: "Level 0 · Input [0..3]",
                groups: [
                  {
                    label: "arr[0..3]",
                    values: ["8", "3", "5", "2"],
                    cellIds: ["c8", "c3", "c5", "c2"],
                    state: "active",
                    note: "Split at mid = 1 into [0..1] and [2..3]",
                  },
                ],
              },
            ],
            caption: "Initial length-4 array before recursive halving.",
          },
        },
        {
          title: "Level 1: halve into [8, 3] and [5, 2]",
          tag: "TRACE",
          explanation: [
            "The first recursive split breaks `[8, 3, 5, 2]` into left half `[8, 3]` and right half `[5, 2]`.",
            "Notice neither half is length `1` yet, so each half computes its own midpoint and splits one more time.",
          ],
          code: [
            "inv ← 0",
            "inv ← inv + merge_sort(arr, 0, 1)  // [8, 3]",
            "inv ← inv + merge_sort(arr, 2, 3)  // [5, 2]",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Depth", value: "Level 1 (2 halves of size 2)", changed: true },
            { name: "Left half", value: "[8, 3]" },
            { name: "Right half", value: "[5, 2]" },
          ],
          visual: {
            kind: "dsa-divide",
            levels: [
              {
                label: "Level 0 · Parent",
                groups: [
                  {
                    label: "arr[0..3]",
                    values: ["8", "3", "5", "2"],
                    cellIds: ["g0-8", "g0-3", "g0-5", "g0-2"],
                    state: "dim",
                    note: "Waiting on recursive left and right halves",
                  },
                ],
              },
              {
                label: "Level 1 · Split",
                groups: [
                  {
                    label: "left [0..1]",
                    values: ["8", "3"],
                    cellIds: ["c8", "c3"],
                    state: "active",
                    note: "Splits next at mid = 0",
                  },
                  {
                    label: "right [2..3]",
                    values: ["5", "2"],
                    cellIds: ["c5", "c2"],
                    state: "active",
                    note: "Splits next at mid = 2",
                  },
                ],
              },
            ],
            caption: "First halving creates two subproblems of size n / 2 = 2.",
          },
        },
        {
          title: "Level 2: reach length-1 base cases [8], [3], [5], [2]",
          tag: "TRACE",
          explanation: [
            "After `log₂ 4 = 2` halvings, every subarray has length `1`: `[8]`, `[3]`, `[5]`, and `[2]`.",
            "A 1-element subarray satisfies `lo >= hi` and is trivially sorted, ending recursion.",
          ],
          code: [
            "if lo >= hi:",
            "    return 0  // singletons [8], [3], [5], [2] are sorted",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "Depth", value: "Level 2 (base case size 1)", changed: true },
            { name: "Subarrays", value: "4 singletons" },
          ],
          visual: {
            kind: "dsa-divide",
            levels: [
              {
                label: "Level 0 · Parent",
                groups: [
                  {
                    label: "arr[0..3]",
                    values: ["8", "3", "5", "2"],
                    cellIds: ["g0-8", "g0-3", "g0-5", "g0-2"],
                    state: "dim",
                  },
                ],
              },
              {
                label: "Level 1 · Split",
                groups: [
                  { label: "[0..1]", values: ["8", "3"], cellIds: ["g1-8", "g1-3"], state: "dim" },
                  { label: "[2..3]", values: ["5", "2"], cellIds: ["g1-5", "g1-2"], state: "dim" },
                ],
              },
              {
                label: "Level 2 · Base Cases",
                groups: [
                  { label: "[0]", values: ["8"], cellIds: ["c8"], state: "done", note: "Sorted singleton" },
                  { label: "[1]", values: ["3"], cellIds: ["c3"], state: "done", note: "Sorted singleton" },
                  { label: "[2]", values: ["5"], cellIds: ["c5"], state: "done", note: "Sorted singleton" },
                  { label: "[3]", values: ["2"], cellIds: ["c2"], state: "done", note: "Sorted singleton" },
                ],
              },
            ],
            caption: "Base level reached after log₂(4) = 2 splits; merging begins upward.",
          },
        },
        {
          title: "Merge pairs back to Level 1: [3, 8] and [2, 5]",
          tag: "TRACE",
          explanation: [
            "Merging `[8]` and `[3]` picks `3 < 8`, adding `1` inversion `(8, 3)` and producing `[3, 8]`.",
            "Merging `[5]` and `[2]` picks `2 < 5`, adding `1` inversion `(5, 2)` and producing `[2, 5]`. Total work across this level touches all `4` elements once.",
          ],
          code: [
            "// Merge [8] & [3] -> [3, 8] (+1 inversion: (8, 3))",
            "// Merge [5] & [2] -> [2, 5] (+1 inversion: (5, 2))",
            "inv ← inv + (mid - i + 1)  // adds 1 for each pair",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Merged halves", value: "[3, 8] and [2, 5]", changed: true },
            { name: "Inversions so far", value: "2", changed: true },
          ],
          visual: {
            kind: "dsa-divide",
            levels: [
              {
                label: "Level 0 · Parent",
                groups: [
                  { label: "arr[0..3]", values: ["8", "3", "5", "2"], cellIds: ["g0-8", "g0-3", "g0-5", "g0-2"], state: "dim" },
                ],
              },
              {
                label: "Level 1 · Merged Pairs",
                groups: [
                  {
                    label: "merged [0..1]",
                    values: ["3", "8"],
                    cellIds: ["c3", "c8"],
                    state: "done",
                    note: "1 inversion counted: (8, 3)",
                  },
                  {
                    label: "merged [2..3]",
                    values: ["2", "5"],
                    cellIds: ["c2", "c5"],
                    state: "done",
                    note: "1 inversion counted: (5, 2)",
                  },
                ],
              },
              {
                label: "Level 2 · Consumed",
                groups: [
                  { values: ["8"], cellIds: ["g2-8"], state: "dim" },
                  { values: ["3"], cellIds: ["g2-3"], state: "dim" },
                  { values: ["5"], cellIds: ["g2-5"], state: "dim" },
                  { values: ["2"], cellIds: ["g2-2"], state: "dim" },
                ],
              },
            ],
            caption: "Bottom-up merge produces sorted halves [3, 8] and [2, 5].",
          },
        },
        {
          title: "Final O(n) merge at Level 0 produces [2, 3, 5, 8] (5 inversions)",
          tag: "PATTERN",
          explanation: [
            "Two-pointer merge compares `[3, 8]` and `[2, 5]`: `2 < 3` takes `2` and adds `2` inversions `(3, 2), (8, 2)`; `3 < 5` takes `3`; `5 < 8` takes `5` and adds `1` inversion `(8, 5)`; finally append `8`.",
            "Sorted output is `[2, 3, 5, 8]` and total inversions equal `1 + 1 + 3 = 5`, computed in `O(n log n)` time and `O(n)` buffer space.",
          ],
          code: [
            "// Merge [3, 8] & [2, 5]:",
            "// 2 < 3 -> take 2 (+2 inv: 3, 8 remaining)",
            "// 3 < 5 -> take 3 (+0 inv)",
            "// 5 < 8 -> take 5 (+1 inv: 8 remaining)",
            "// append 8 -> [2, 3, 5, 8], total inv = 5",
          ],
          activeLines: [2, 3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Sorted output", value: "[2, 3, 5, 8]", changed: true },
            { name: "Cross-half inv", value: "+3 -> total 5", changed: true },
            { name: "Space used", value: "O(n) buffer" },
          ],
          visual: {
            kind: "dsa-divide",
            levels: [
              {
                label: "Level 0 · Final Merge",
                groups: [
                  {
                    label: "sorted [0..3]",
                    values: ["2", "3", "5", "8"],
                    cellIds: ["c2", "c3", "c5", "c8"],
                    state: "done",
                    note: "Total 5 inversions: (8,3), (5,2), (3,2), (8,2), (8,5)",
                  },
                ],
              },
              {
                label: "Level 1 · Consumed",
                groups: [
                  { label: "[0..1]", values: ["3", "8"], cellIds: ["g1-3", "g1-8"], state: "dim" },
                  { label: "[2..3]", values: ["2", "5"], cellIds: ["g1-2", "g1-5"], state: "dim" },
                ],
              },
            ],
            caption: "Each element moved at most log₂ n times across merge levels -> O(n log n).",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Allocating a brand-new temporary buffer inside every merge call",
        detail:
          "Allocating a fresh `n`-element buffer at the root once (`buf = array(n)`) keeps memory churn minimal. Slicing or reallocating huge buffers carelessly in tight loops hurts cache locality, though asymptotic extra space remains `O(n)`.",
      },
      {
        title: "Using `arr[i] < arr[j]` instead of `<=` during merge",
        detail:
          "If `arr[i] == arr[j]`, taking from the right half flips equal keys (breaking stability) and falsely counts `(arr[i], arr[j])` as an inversion.",
        code: "// Correct stability & inversion guard:\nif arr[i] <= arr[j]:\n    take arr[i]",
      },
    ],
    practiceTask: {
      title: "Merge Two Sorted Subarrays In-Place Using a Buffer",
      tier: "Warmup",
      goal: "Implement `merge_range(arr, lo, mid, hi)` that stably merges sorted slices `arr[lo..mid]` and `arr[mid+1..hi]` back into `arr[lo..hi]`.",
      constraints: ["0 <= lo <= mid < hi < len(arr) <= 10^5", "Target: O(hi - lo + 1) time and buffer space"],
      examples: [
        { input: "arr = [3, 8, 2, 5, 9], lo = 0, mid = 1, hi = 3", output: "[2, 3, 5, 8, 9]", explanation: "Merges [3, 8] and [2, 5] while leaving index 4 untouched." },
        { input: "arr = [9, 2, 5, 1, 2, 0], lo = 1, mid = 2, hi = 4", output: "[9, 1, 2, 2, 5, 0]", explanation: "Merges subarrays [2, 5] and [1, 2] inside interior bounds 1..4 without disturbing 9 or 0." },
      ],
      tasks: [
        "Copy `arr[lo..hi]` or merge directly into a temporary array `tmp` of length `hi - lo + 1`.",
        "Advance `i` (from `lo`) and `j` (from `mid + 1`), picking `arr[i]` whenever `arr[i] <= arr[j]`, then copy remaining tails and write `tmp` back to `arr[lo..hi]`.",
      ],
      starterCode: "function merge_range(arr, lo, mid, hi):\n    // TODO: merge arr[lo..mid] and arr[mid+1..hi]\n    return arr",
      expectedOutput: "[2, 3, 5, 8, 9]\n[9, 1, 2, 2, 5, 0]",
      hint: "Remember to append any leftover items from either half after the main `while i <= mid and j <= hi` loop ends.",
      complexity: { time: "O(hi - lo + 1)", space: "O(hi - lo + 1)" },
      solutionCode:
        "function merge_range(arr, lo, mid, hi):\n    tmp ← empty array\n    i ← lo, j ← mid + 1\n    while i <= mid and j <= hi:\n        if arr[i] <= arr[j]:\n            tmp.append(arr[i]); i ← i + 1\n        else:\n            tmp.append(arr[j]); j ← j + 1\n    while i <= mid:\n        tmp.append(arr[i]); i ← i + 1\n    while j <= hi:\n        tmp.append(arr[j]); j ← j + 1\n    for idx from 0 to len(tmp) - 1:\n        arr[lo + idx] ← tmp[idx]\n    return arr",
    },
    practiceChallenges: [
      {
        title: "Merge Two Sorted Subarrays In-Place Using a Buffer",
        tier: "Warmup",
        goal: "Stably merge adjacent sorted slices `arr[lo..mid]` and `arr[mid+1..hi]` back into `arr[lo..hi]`.",
        constraints: ["0 <= lo <= mid < hi < len(arr) <= 10^5", "Target: O(hi - lo + 1) time"],
        examples: [
          { input: "arr = [3, 8, 2, 5, 9], lo = 0, mid = 1, hi = 3", output: "[2, 3, 5, 8, 9]" },
          { input: "arr = [9, 2, 5, 1, 2, 0], lo = 1, mid = 2, hi = 4", output: "[9, 1, 2, 2, 5, 0]", explanation: "Merges interior slices [2, 5] and [1, 2] while preserving outside indices." },
        ],
        tasks: [
          "Use two pointers `i = lo` and `j = mid + 1` to fill a temporary buffer.",
          "Copy remaining elements from whichever half did not finish, then copy the buffer back to `arr[lo..hi]`.",
        ],
        starterCode: "function merge_range(arr, lo, mid, hi):\n    // TODO: two-pointer merge\n    return arr",
        expectedOutput: "[2, 3, 5, 8, 9]\n[9, 1, 2, 2, 5, 0]",
        hint: "Use `arr[i] <= arr[j]` to keep the merge stable.",
        complexity: { time: "O(hi - lo + 1)", space: "O(hi - lo + 1)" },
        solutionCode:
          "function merge_range(arr, lo, mid, hi):\n    tmp ← empty array\n    i ← lo, j ← mid + 1\n    while i <= mid and j <= hi:\n        if arr[i] <= arr[j]:\n            tmp.append(arr[i]); i ← i + 1\n        else:\n            tmp.append(arr[j]); j ← j + 1\n    while i <= mid:\n        tmp.append(arr[i]); i ← i + 1\n    while j <= hi:\n        tmp.append(arr[j]); j ← j + 1\n    for idx from 0 to len(tmp) - 1:\n        arr[lo + idx] ← tmp[idx]\n    return arr",
      },
      {
        title: "Count Global Inversions in an Array",
        tier: "Core",
        goal: "Return the total number of pairs `(i, j)` with `i < j` and `nums[i] > nums[j]` in `O(n log n)` time using Merge Sort.",
        constraints: ["1 <= len(nums) <= 10^5", "-10^9 <= nums[i] <= 10^9", "Use 64-bit integer for count (up to ~5 * 10^9)"],
        examples: [
          { input: "nums = [8, 3, 5, 2]", output: "5" },
          { input: "nums = [1, 2, 3, 4]", output: "0" },
        ],
        tasks: [
          "Recursively count inversions in left half `[lo..mid]` and right half `[mid+1..hi]`.",
          "During the merge step, whenever `nums[j] < nums[i]`, add `mid - i + 1` to the inversion total.",
        ],
        starterCode: "function count_inversions(nums):\n    // TODO: O(n log n) Merge Sort inversion counter\n    return total",
        expectedOutput: "5\n0",
        hint: "Because `nums[lo..mid]` is already sorted, `nums[j] < nums[i]` implies `nums[j]` is smaller than every element from `i` through `mid`.",
        complexity: { time: "O(n log n)", space: "O(n)" },
        solutionCode:
          "function count_inversions(nums):\n    buf ← array of size len(nums)\n    function sort_count(lo, hi):\n        if lo >= hi: return 0\n        mid ← lo + floor((hi - lo) / 2)\n        inv ← sort_count(lo, mid) + sort_count(mid + 1, hi)\n        i ← lo, j ← mid + 1, k ← lo\n        while i <= mid and j <= hi:\n            if nums[i] <= nums[j]:\n                buf[k] ← nums[i]; i ← i + 1\n            else:\n                buf[k] ← nums[j]; j ← j + 1\n                inv ← inv + (mid - i + 1)\n            k ← k + 1\n        while i <= mid: buf[k] ← nums[i]; i ← i + 1; k ← k + 1\n        while j <= hi: buf[k] ← nums[j]; j ← j + 1; k ← k + 1\n        for idx from lo to hi: nums[idx] ← buf[idx]\n        return inv\n    return sort_count(0, len(nums) - 1)",
      },
      {
        title: "Bottom-Up Iterative Merge Sort",
        tier: "Stretch",
        goal: "Implement Merge Sort iteratively without recursion by doubling subarray width `width = 1, 2, 4, 8, ...` from the bottom up.",
        constraints: ["1 <= len(nums) <= 10^5", "No recursive function calls", "Target: O(n log n) time, O(n) buffer space"],
        examples: [
          { input: "nums = [6, 1, 4, 2, 5, 3]", output: "[1, 2, 3, 4, 5, 6]" },
          { input: "nums = [9]", output: "[9]" },
        ],
        tasks: [
          "Loop `width` starting at `1` while `width < n`, doubling `width` each outer pass.",
          "For each `lo = 0, 2 * width, 4 * width, ...` while `lo + width < n`, compute `mid = lo + width - 1` and `hi = min(lo + 2 * width - 1, n - 1)`, then merge `[lo..mid]` and `[mid+1..hi]`.",
        ],
        starterCode: "function iterative_merge_sort(nums):\n    // TODO: bottom-up width-doubling merge sort\n    return nums",
        expectedOutput: "[1, 2, 3, 4, 5, 6]\n[9]",
        hint: "Clamp `hi` with `min(lo + 2 * width - 1, n - 1)` because `n` does not have to be a power of `2`.",
        complexity: { time: "O(n log n)", space: "O(n)" },
        solutionCode:
          "function iterative_merge_sort(nums):\n    n ← len(nums)\n    buf ← array of size n\n    width ← 1\n    while width < n:\n        lo ← 0\n        while lo + width < n:\n            mid ← lo + width - 1\n            hi ← min(lo + 2 * width - 1, n - 1)\n            i ← lo, j ← mid + 1, k ← lo\n            while i <= mid and j <= hi:\n                if nums[i] <= nums[j]:\n                    buf[k] ← nums[i]; i ← i + 1\n                else:\n                    buf[k] ← nums[j]; j ← j + 1\n                k ← k + 1\n            while i <= mid: buf[k] ← nums[i]; i ← i + 1; k ← k + 1\n            while j <= hi: buf[k] ← nums[j]; j ← j + 1; k ← k + 1\n            for idx from lo to hi: nums[idx] ← buf[idx]\n            lo ← lo + 2 * width\n        width ← width * 2\n    return nums",
      },
    ],
  },

  "dsa-quick-sort": {
    lessonId: "dsa-quick-sort",
    subtitle:
      "Partition arrays in-place around a pivot using Lomuto or Hoare schemes, avoid the O(n²) sorted-input trap with randomized pivots, and find Kth elements via Quickselect.",
    intro: {
      heading: "Quick Sort & In-Place Partitioning",
      explanation: [
        "Run Lomuto Quick Sort with a fixed `pivot = arr[hi]` on an already-sorted array `[1, 2, 3, ..., 100000]` and it collapses to `O(n²)` (`5 * 10^9` operations) and `100,000` stack frames deep—because every partition splits `n` items into `0` and `n - 1`. Meanwhile, assuming Quick Sort keeps equal keys in order fails whenever long-distance swaps jump equal items across the pivot.",
        "**Quick Sort** flips Merge Sort's work order: **partitioning** puts `<= pivot` on the left and `> pivot` on the right in-place (`O(1)` buffer memory), needing zero combine step afterward. Choosing a **random pivot** (or Hoare's two-pointer partition) breaks adversarial sorted inputs and restores `O(n log n)` expected speed.",
      ],
      analogy:
        "Sorting a shelf of books by grabbing one random book as a benchmark, sliding every shorter book to its left and every taller book to its right: that single book lands in its permanent spot right away, and you repeat independently on the left and right piles.",
      realWorldUses: [
        "Fast in-place sorting when memory bandwidth and cache locality matter and stability is unneeded",
        "Finding the median, 95th percentile latency, or Kth smallest item in `O(n)` average time with Quickselect",
      ],
    },
    sections: [
      {
        heading: "Lomuto vs Hoare partitioning and the O(n²) pivot trap",
        paragraphs: [
          "**Lomuto partition** picks `pivot = arr[hi]` and walks `scan` from `lo` to `hi - 1`, maintaining `store` as the boundary of `<= pivot` elements. Whenever `arr[scan] <= pivot`, it swaps `arr[scan]` with `arr[store]` and increments `store`; at the end it swaps `arr[hi]` into `arr[store]` and returns `store`.",
          "**Hoare partition** uses two inward-moving pointers `left` and `right` starting at opposite ends (from M07 Two Pointers). It swaps out-of-place pairs `arr[left] >= pivot` and `arr[right] <= pivot`, making ~3x fewer swaps than Lomuto and avoiding degenerate `O(n²)` splits on all-equal arrays. Note that Hoare returns a split index `p` where `[lo..p]` and `[p+1..hi]` are partitioned, without guaranteeing `pivot` itself sits at `p`.",
          "If you always choose `arr[hi]` (or `arr[lo]`) on an **already-sorted** or **reverse-sorted** array, every partition leaves `0` items on one side and `n - 1` items on the other. Recursion depth hits `n` and total work degrades to `n + (n - 1) + ... + 1 = O(n²)`. Picking a **random index** `rand(lo, hi)` and swapping it with `arr[hi]` before partitioning makes adversarial inputs practically impossible and restores `O(n log n)` expected time.",
        ],
        code: [
          "// COUNTEREXAMPLE on sorted [1, 2, 3, 4] with fixed pivot = arr[hi]:",
          "// Pass 1 (pivot=4): [1,2,3] | 4 | []   -> depth 1 (n-1 left)",
          "// Pass 2 (pivot=3): [1,2]   | 3 | []   -> depth 2 (O(n^2) total work!)",
          "",
          "// FIXED: Hoare two-pointer partition or randomized Lomuto pivot",
          "function hoare_partition(arr, lo, hi):",
          "    pivot ← arr[lo + floor((hi - lo) / 2)]",
          "    left ← lo - 1; right ← hi + 1",
          "    while true:",
          "        left ← left + 1; while arr[left] < pivot: left ← left + 1",
          "        right ← right - 1; while arr[right] > pivot: right ← right - 1",
          "        if left >= right: return right   // split into [lo..right] and [right+1..hi]",
          "        swap(arr, left, right)",
        ],
        codeLabel: "Pseudocode · Hoare Partition",
        table: {
          caption: "Lomuto vs Hoare partition and pivot strategies",
          headers: ["Scheme / Strategy", "Pointer motion", "Pivot lands at final index?", "Behavior on all-equal array"],
          rows: [
            ["Lomuto (`arr[hi]`)", "Two same-direction pointers (`store`, `scan`)", "Yes (`store`)", "Degrades to `O(n²)` (skewed split)"],
            ["Hoare (two ends)", "Two inward pointers (`left`, `right`)", "No (returns boundary `p`)", "Balanced `n/2` split (`O(n log n)`)"],
            ["Randomized Lomuto", "Swap `arr[rand(lo, hi)]` to `arr[hi]` first", "Yes (`store`)", "Needs 3-way partition if all keys equal"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Quick Sort is not stable: long-distance swaps across the pivot reorder equal keys. Avoid deterministic first or last pivots on production inputs, since already-sorted inputs trigger worst-case splits.",
        },
      },
      {
        heading: "Quickselect: finding the Kth smallest element in O(n) average time",
        paragraphs: [
          "Suppose you only want the `k`-th smallest number (`0`-indexed, such as the median `k = n / 2`) rather than sorting the entire array. After partitioning around a random pivot into index `p`, you know `p` is in its exact final sorted position.",
          "If `p == k`, return `arr[p]` immediately. If `k < p`, recurse only on the left half `[lo..p - 1]`; if `k > p`, recurse only on the right half `[p + 1..hi]`. Because you discard one side each step, average work sums as a geometric series `n + n/2 + n/4 + ... < 2n = O(n)` expected time with `O(1)` iterative space!",
        ],
        code: [
          "function quickselect(arr, k):",
          "    lo ← 0, hi ← len(arr) - 1",
          "    while lo <= hi:",
          "        p_idx ← random_int(lo, hi)",
          "        swap(arr, p_idx, hi)",
          "        p ← lomuto_partition(arr, lo, hi)",
          "        if p == k: return arr[p]",
          "        if k < p: hi ← p - 1",
          "        else:     lo ← p + 1",
          "    return -1",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Sorting vs Quickselect for Kth order statistic",
          headers: ["Approach", "Average time", "Worst time", "Extra space"],
          rows: [
            ["Full Merge Sort + `arr[k]`", "`O(n log n)`", "`O(n log n)`", "`O(n)`"],
            ["Iterative Randomized Quickselect", "`O(n)`", "`O(n²)` (vanishingly rare)", "`O(1)`"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "RULE OF THUMB",
          text: "Whenever a problem asks for the median, top-`k` threshold, or `k`-th smallest value without requiring the entire array sorted, reach for Quickselect to drop time from `O(n log n)` to `O(n)` expected.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Fix Deterministic O(n²) Quick Sort with Randomized Pivots",
      steps: [
        {
          label: "Step 1: Fixed `arr[hi]` pivot traps sorted arrays in O(n²)",
          explanation: "Always picking `arr[hi]` on `[1, 2, 3, 4]` strips one element per call and recurses `n` levels deep.",
          code: [
            "function quicksort_slow(arr, lo, hi):",
            "    if lo >= hi: return",
            "    p ← lomuto_partition(arr, lo, hi)   // always uses arr[hi]",
            "    quicksort_slow(arr, lo, p - 1)",
            "    quicksort_slow(arr, p + 1, hi)",
          ],
          activeLines: [3],
          output: "[1, 2, 3, ..., 100000] -> O(n^2) + Stack Overflow",
        },
        {
          label: "Step 2: Swap a random element into `arr[hi]` before partitioning",
          explanation: "One random swap prevents pre-sorted or reverse-sorted inputs from forcing skewed `0` vs `n - 1` splits.",
          code: [
            "function quicksort_rand(arr, lo, hi):",
            "    if lo >= hi: return",
            "    r ← random_int(lo, hi)",
            "    swap(arr, r, hi)",
            "    p ← lomuto_partition(arr, lo, hi)",
            "    quicksort_rand(arr, lo, p - 1)",
            "    quicksort_rand(arr, p + 1, hi)",
          ],
          activeLines: [3, 4],
          output: "Expected O(n log n) time across any input order",
        },
        {
          label: "Step 3: Use Hoare partition for ~3x fewer swaps & all-equal inputs",
          explanation: "Inward pointers `left` and `right` balance `[5, 5, 5, 5]` in `n / 2` instead of degrading to `O(n²)`.",
          code: [
            "function quicksort_hoare(arr, lo, hi):",
            "    if lo >= hi: return",
            "    p ← hoare_partition(arr, lo, hi)   // splits [lo..p] and [p+1..hi]",
            "    quicksort_hoare(arr, lo, p)",
            "    quicksort_hoare(arr, p + 1, hi)",
          ],
          activeLines: [3, 4],
          output: "[5, 5, 5, 5] splits evenly in O(n log n)",
        },
      ],
    },
    walkthrough: {
      title: "Trace Lomuto partition on [4, 7, 2, 6, 3, 5] with pivot = 5",
      layout: "visual-first",
      steps: [
        {
          title: "Choose pivot = 5 at index 5; set store = 0, scan = 0",
          tag: "CONCEPT",
          explanation: [
            "Using Lomuto partition on `[4, 7, 2, 6, 3, 5]`, `pivot = arr[5] = 5`.",
            "`store` marks where the next value `<= 5` will be placed, and `scan` scans left to right from `0` to `4`.",
          ],
          code: [
            "// arr = [4, 7, 2, 6, 3, 5], lo = 0, hi = 5",
            "pivot ← arr[hi]      // pivot = 5",
            "store ← lo           // store = 0",
            "for scan from lo to hi - 1:",
            "    if arr[scan] <= pivot: swap & store++",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "pivot", value: "5 (at index 5)" },
            { name: "store", value: "0", changed: true },
            { name: "scan", value: "0", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Initial Lomuto partition state (pivot = 5)",
                cells: [
                  { id: "q4", value: "4", index: 0, state: "active" },
                  { id: "q7", value: "7", index: 1 },
                  { id: "q2", value: "2", index: 2 },
                  { id: "q6", value: "6", index: 3 },
                  { id: "q3", value: "3", index: 4 },
                  { id: "q5", value: "5", index: 5, state: "pivot" },
                ],
                pointers: [
                  { index: 0, label: "store, scan", tone: "accent" },
                  { index: 5, label: "pivot", tone: "coral" },
                ],
              },
            ],
            caption: "Elements <= 5 will accumulate at indices [0..store-1].",
          },
        },
        {
          title: "scan=0 (4<=5) advances store; scan=1 (7>5) leaves 7 behind",
          tag: "TRACE",
          explanation: [
            "At `scan = 0`, `4 <= 5`, so `swap(arr[0], arr[0])` keeps `4` in place and advances `store` to `1`.",
            "At `scan = 1`, `7 > 5`, so we do not move `store`: `7` stays at index `1` as the start of the `> pivot` zone.",
          ],
          code: [
            "// scan = 0: 4 <= 5 -> swap(0, 0), store ← 1",
            "// scan = 1: 7 > 5  -> skip (store stays 1)",
            "if arr[scan] <= pivot:",
            "    swap(arr[store], arr[scan]); store ← store + 1",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "store", value: "1", changed: true },
            { name: "scan", value: "2 (next)", changed: true },
            { name: "<= pivot zone", value: "[4]" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After scan = 0 and scan = 1: store points at 7 (> pivot)",
                cells: [
                  { id: "q4", value: "4", index: 0, state: "done" },
                  { id: "q7", value: "7", index: 1, state: "dim" },
                  { id: "q2", value: "2", index: 2, state: "active" },
                  { id: "q6", value: "6", index: 3 },
                  { id: "q3", value: "3", index: 4 },
                  { id: "q5", value: "5", index: 5, state: "pivot" },
                ],
                pointers: [
                  { index: 1, label: "store", tone: "coral" },
                  { index: 2, label: "scan", tone: "accent" },
                  { index: 5, label: "pivot", tone: "coral" },
                ],
                highlightRange: [0, 0],
              },
            ],
            caption: "store sits on the first element > 5, ready to swap with the next small element.",
          },
        },
        {
          title: "scan=2 (2<=5) swaps 2 with 7; scan=3 (6>5) skips",
          tag: "TRACE",
          explanation: [
            "At `scan = 2`, `2 <= 5`: swap `arr[1]` (`7`) and `arr[2]` (`2`), advancing `store` to `2` (`[4, 2, 7, 6, 3, 5]`).",
            "At `scan = 3`, `6 > 5` skips without moving `store`, leaving `[7, 6]` in the `> pivot` zone as `scan` moves to `4`.",
          ],
          code: [
            "// scan = 2: 2 <= 5 -> swap(arr[1], arr[2]), store ← 2",
            "// scan = 3: 6 > 5  -> skip (store stays 2)",
            "if arr[scan] <= pivot:",
            "    swap(arr[store], arr[scan]); store ← store + 1",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "Array now", value: "[4, 2, 7, 6, 3, 5]", changed: true },
            { name: "store", value: "2", changed: true },
            { name: "scan", value: "4 (next)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After scan = 2 and scan = 3: [4, 2] <= 5, store at index 2",
                cells: [
                  { id: "q4", value: "4", index: 0, state: "done" },
                  { id: "q2", value: "2", index: 1, state: "done" },
                  { id: "q7", value: "7", index: 2, state: "dim" },
                  { id: "q6", value: "6", index: 3, state: "dim" },
                  { id: "q3", value: "3", index: 4, state: "active" },
                  { id: "q5", value: "5", index: 5, state: "pivot" },
                ],
                pointers: [
                  { index: 2, label: "store", tone: "coral" },
                  { index: 4, label: "scan", tone: "accent" },
                  { index: 5, label: "pivot", tone: "coral" },
                ],
                highlightRange: [0, 1],
              },
            ],
            caption: "2 swapped left into index 1; 7 and 6 remain right of store = 2.",
          },
        },
        {
          title: "scan=4 (3<=5) swaps 3 with 7 to finish the scan",
          tag: "TRACE",
          explanation: [
            "At `scan = 4`, `3 <= 5`: swap `arr[2]` (`7`) and `arr[4]` (`3`), advancing `store` to `3` (`[4, 2, 3, 6, 7, 5]`).",
            "The scan loop (`0..4`) ends with `[4, 2, 3] <= 5` and `[6, 7] > 5`.",
          ],
          code: [
            "// scan = 4: 3 <= 5 -> swap(arr[2], arr[4]), store ← 3",
            "if arr[scan] <= pivot:",
            "    swap(arr[store], arr[scan]); store ← store + 1",
            "// loop ends: ready to swap pivot into store = 3",
          ],
          activeLines: [1, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Array now", value: "[4, 2, 3, 6, 7, 5]", changed: true },
            { name: "store", value: "3", changed: true },
            { name: "<= pivot zone", value: "[4, 2, 3]" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Scan finished: [4, 2, 3] <= 5 and [6, 7] > 5",
                cells: [
                  { id: "q4", value: "4", index: 0, state: "done" },
                  { id: "q2", value: "2", index: 1, state: "done" },
                  { id: "q3", value: "3", index: 2, state: "done" },
                  { id: "q6", value: "6", index: 3, state: "active" },
                  { id: "q7", value: "7", index: 4, state: "dim" },
                  { id: "q5", value: "5", index: 5, state: "pivot" },
                ],
                pointers: [
                  { index: 3, label: "store", tone: "coral" },
                  { index: 5, label: "pivot", tone: "accent" },
                ],
                highlightRange: [0, 2],
              },
            ],
            caption: "3 moved left of store into index 2; 6 and 7 stay to the right.",
          },
        },
        {
          title: "Swap pivot into store (index 3) -> pivot is permanently placed",
          tag: "PATTERN",
          explanation: [
            "Swap `arr[store]` (`6`) with `arr[hi]` (`5`), placing pivot `5` at index `3`.",
            "Every value in `[0..2]` (`[4, 2, 3]`) is `<= 5` and every value in `[4..5]` (`[7, 6]`) is `> 5`. Quick Sort now recurses independently on `[0..2]` and `[4..5]`; Quickselect for `k = 3` would return `5` right here!",
          ],
          code: [
            "swap(arr[store], arr[hi])  // swap 6 and 5",
            "return store               // pivot index = 3",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "Pivot final index", value: "3 (value 5)", changed: true },
            { name: "Partitioned arr", value: "[4, 2, 3, 5, 7, 6]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Pivot 5 locked at index 3: left <= 5, right > 5",
                cells: [
                  { id: "q4", value: "4", index: 0, state: "active" },
                  { id: "q2", value: "2", index: 1, state: "active" },
                  { id: "q3", value: "3", index: 2, state: "active" },
                  { id: "q5", value: "5", index: 3, state: "pivot" },
                  { id: "q7", value: "7", index: 4, state: "dim" },
                  { id: "q6", value: "6", index: 5, state: "dim" },
                ],
                pointers: [{ index: 3, label: "final p=3", tone: "ok" }],
                highlightRange: [3, 3],
              },
            ],
            caption: "Pivot 5 will never move again; Quick Sort recurses on [0..2] and [4..5].",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Infinite recursion in Hoare partition if split boundaries overlap",
        detail:
          "With Hoare partition returning `p`, you must recurse on `[lo..p]` and `[p+1..hi]` (not `[lo..p-1]`) and never pick `arr[hi]` as the Hoare pivot if `p` can equal `hi`.",
        code: "// Hoare recursion boundaries:\nquick_sort(arr, lo, p)\nquick_sort(arr, p + 1, hi)",
      },
      {
        title: "Many duplicate keys collapsing Lomuto to O(n²)",
        detail:
          "Even with a random pivot, if 90% of the array holds the same value `x`, Lomuto places all `x`s on the `<=` side and yields an `O(n²)` split. A 3-way partition (`< pivot`, `== pivot`, `> pivot`) handles duplicates in `O(n)`.",
      },
    ],
    practiceTask: {
      title: "In-Place Lomuto Partition Around Last Element",
      tier: "Warmup",
      goal: "Partition `arr[lo..hi]` in-place around `pivot = arr[hi]` using Lomuto partitioning so all values `<= pivot` sit left of the returned pivot index and values `> pivot` sit right.",
      constraints: ["0 <= lo <= hi < len(arr) <= 10^5", "Target: O(hi - lo + 1) time, O(1) extra space"],
      examples: [
        { input: "arr = [4, 7, 2, 6, 3, 5], lo = 0, hi = 5", output: "3", explanation: "Pivot 5 lands at index 3 as arr becomes [4, 2, 3, 5, 7, 6]." },
        { input: "arr = [-3, -1, 0], lo = 0, hi = 2", output: "2", explanation: "Already-sorted subarray leaves largest element 0 at final pivot index 2." },
      ],
      tasks: [
        "Set `pivot = arr[hi]` and `store = lo`.",
        "Scan `i` from `lo` to `hi - 1`: whenever `arr[i] <= pivot`, swap `arr[store]` and `arr[i]` and increment `store`.",
        "Swap `arr[store]` and `arr[hi]` and return `store`.",
      ],
      starterCode: "function lomuto_partition(arr, lo, hi):\n    // TODO: partition in-place and return final pivot index\n    return store",
      expectedOutput: "3\n2",
      hint: "Only increment `store` when swapping an element `<= pivot` into `arr[store]`.",
      complexity: { time: "O(hi - lo + 1)", space: "O(1)" },
      solutionCode:
        "function lomuto_partition(arr, lo, hi):\n    pivot ← arr[hi]\n    store ← lo\n    for i from lo to hi - 1:\n        if arr[i] <= pivot:\n            swap(arr[store], arr[i])\n            store ← store + 1\n    swap(arr[store], arr[hi])\n    return store",
    },
    practiceChallenges: [
      {
        title: "In-Place Lomuto Partition Around Last Element",
        tier: "Warmup",
        goal: "Partition `arr[lo..hi]` around `arr[hi]` in `O(1)` extra space and return the pivot's final index.",
        constraints: ["0 <= lo <= hi < len(arr) <= 10^5", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "arr = [4, 7, 2, 6, 3, 5], lo = 0, hi = 5", output: "3", explanation: "Pivot 5 lands at index 3 (arr becomes [4, 2, 3, 5, 7, 6])." },
          { input: "arr = [-3, -1, 0], lo = 0, hi = 2", output: "2", explanation: "Sorted negative-to-zero slice leaves pivot 0 at index 2." },
        ],
        tasks: [
          "Keep `store = lo` and swap every `arr[i] <= arr[hi]` into `arr[store]`.",
          "Finish with `swap(arr[store], arr[hi])` and return `store`.",
        ],
        starterCode: "function lomuto_partition(arr, lo, hi):\n    // TODO: Lomuto partition\n    return store",
        expectedOutput: "3\n2",
        hint: "Values strictly greater than `pivot` naturally drift to indices `[store..i]`.",
        complexity: { time: "O(hi - lo + 1)", space: "O(1)" },
        solutionCode:
          "function lomuto_partition(arr, lo, hi):\n    pivot ← arr[hi]\n    store ← lo\n    for i from lo to hi - 1:\n        if arr[i] <= pivot:\n            swap(arr[store], arr[i])\n            store ← store + 1\n    swap(arr[store], arr[hi])\n    return store",
      },
      {
        title: "Find Kth Largest Element Without Full Sort",
        tier: "Core",
        goal: "Given an integer array `nums` and integer `k` (`1 <= k <= len(nums)`), return the `k`-th largest element in `O(n)` expected time using Quickselect.",
        constraints: ["1 <= k <= len(nums) <= 10^5", "-10^4 <= nums[i] <= 10^4", "Target: O(n) expected time, O(1) extra space"],
        examples: [
          { input: "nums = [3, 2, 1, 5, 6, 4], k = 2", output: "5", explanation: "Sorted order is [1, 2, 3, 4, 5, 6]; 2nd largest is at target index 6 - 2 = 4." },
          { input: "nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4", output: "4" },
        ],
        tasks: [
          "Convert `k`-th largest into ascending 0-based target index `target = len(nums) - k`.",
          "Loop while `lo <= hi`: pick a random pivot, partition, and narrow `[lo, hi]` to whichever side holds `target`.",
        ],
        starterCode: "function kth_largest(nums, k):\n    // TODO: iterative randomized Quickselect\n    return ans",
        expectedOutput: "5\n4",
        hint: "Randomizing the pivot index in `[lo, hi]` before partitioning prevents `O(n²)` on sorted inputs.",
        complexity: { time: "O(n) expected", space: "O(1)" },
        solutionCode:
          "function kth_largest(nums, k):\n    target ← len(nums) - k\n    lo ← 0, hi ← len(nums) - 1\n    while lo <= hi:\n        r ← random_int(lo, hi)\n        swap(nums, r, hi)\n        pivot ← nums[hi]\n        store ← lo\n        for i from lo to hi - 1:\n            if nums[i] <= pivot:\n                swap(nums, store, i)\n                store ← store + 1\n        swap(nums, store, hi)\n        if store == target: return nums[store]\n        if store < target: lo ← store + 1\n        else: hi ← store - 1\n    return -1",
      },
      {
        title: "Three-Way Quick Sort for Heavy Duplicates",
        tier: "Stretch",
        goal: "Sort `nums` in-place using 3-way partitioning (`< pivot`, `== pivot`, `> pivot`) so arrays packed with duplicate values finish in `O(n)` time instead of `O(n²)`.",
        constraints: ["1 <= len(nums) <= 10^5", "Array may contain thousands of identical keys", "Target: O(n log n) expected, O(n) when few distinct keys"],
        examples: [
          { input: "nums = [4, 9, 4, 4, 1, 9, 4, 4, 1]", output: "[1, 1, 4, 4, 4, 4, 4, 9, 9]" },
          { input: "nums = [7, 7, 7, 7]", output: "[7, 7, 7, 7]" },
        ],
        tasks: [
          "Pick a random pivot `p_val` and maintain three pointers `lt = lo`, `i = lo`, `gt = hi`.",
          "Move `< p_val` left of `lt`, `> p_val` right of `gt`, and advance `i` over `== p_val`; then recurse only on `[lo..lt - 1]` and `[gt + 1..hi]`.",
        ],
        starterCode: "function quicksort_3way(nums, lo, hi):\n    // TODO: 3-way partition + recursion skipping == pivot band\n    return nums",
        expectedOutput: "[1, 1, 4, 4, 4, 4, 4, 9, 9]\n[7, 7, 7, 7]",
        hint: "When all elements equal `p_val`, `[lt..gt]` spans `[lo..hi]`, so both recursive calls exit immediately in `O(n)` total work!",
        complexity: { time: "O(n log n) expected, O(n) all-equal", space: "O(log n) stack" },
        solutionCode:
          "function quicksort_3way(nums, lo, hi):\n    if lo >= hi: return nums\n    p_val ← nums[random_int(lo, hi)]\n    lt ← lo, i ← lo, gt ← hi\n    while i <= gt:\n        if nums[i] < p_val:\n            swap(nums, lt, i)\n            lt ← lt + 1; i ← i + 1\n        else if nums[i] > p_val:\n            swap(nums, i, gt)\n            gt ← gt - 1\n        else:\n            i ← i + 1\n    quicksort_3way(nums, lo, lt - 1)\n    quicksort_3way(nums, gt + 1, hi)\n    return nums",
      },
    ],
  },

  "dsa-linear-sorts": {
    lessonId: "dsa-linear-sorts",
    subtitle:
      "Beat the Omega(n log n) comparison lower bound when keys live in a bounded integer range [0..K] using stable Counting Sort, Radix Sort, and multi-key custom comparators.",
    intro: {
      heading: "Counting Sort, Radix Sort & Custom Comparators",
      explanation: [
        "Every comparison sort (`Merge Sort`, `Quick Sort`) hits an `Omega(n log n)` wall because `n!` permutations require at least `log₂(n!)` yes/no comparisons: sorting 10 million 8-bit sensor bytes (`0..255`) wastes ~230 million comparisons, and a buggy comparator that returns `-1` on ties (`cmp(a, a) == -1`) breaks strict weak ordering and crashes `sort()`.",
        "When keys are bounded integers in `[0..K]` or fixed-width digits, **Counting Sort** (`O(n + K)`) and **Radix Sort** (`O(d * (n + B))`) skip pairwise comparisons altogether by placing keys directly into prefix-sum slots. When you do sort general objects, **custom comparators** express multi-key ordering rules without breaking transitivity.",
      ],
      analogy:
        "Counting Sort is like sorting numbered jerseys into labeled cubbies `0` through `K` instead of comparing jerseys two at a time; Radix Sort sorts stacks of 3-digit tickets by organizing the ones digit first, then tens, then hundreds, never mixing up ties from earlier digits.",
      realWorldUses: [
        "Sorting large arrays of ages, HTTP status codes, byte values, or small integer scores in `O(n + K)` time",
        "Sorting fixed-width IDs, IPv4 addresses, or 32-bit integers via base-256 Radix Sort without `O(n log n)` comparisons",
      ],
    },
    sections: [
      {
        heading: "Beating O(n log n) with stable Counting Sort & Radix Sort",
        paragraphs: [
          "**Counting Sort** works on integers in `[0..K]`. Step 1 counts how many times each key appears in `counts[0..K]`. Step 2 turns `counts` into prefix sums (`counts[v] += counts[v - 1]`), so `counts[v]` equals the 1-based end position of key `v` in the sorted output. Step 3 walks the input **backwards** from `n - 1` down to `0`, placing `arr[i]` at `out[--counts[arr[i]]]`. Walking forward (`0` to `n - 1`) places `(3, a)` into the rightmost `3` slot and `(3, c)` into the earlier slot, flipping equal keys and breaking Radix Sort.",
          "**Radix Sort** extends Counting Sort to large integers (e.g., up to `10^9`) by sorting **digit by digit** from least-significant digit (LSD) to most-significant digit (MSD) in base `B` (commonly `B = 10` or `B = 256`). Each pass uses stable Counting Sort on a single digit (`0..B - 1`), taking `O(d * (n + B))` total time where `d` is the number of digits.",
        ],
        code: [
          "// BROKEN stability on [(3, a), (1, b), (3, c)]: forward placement flips ties!",
          "// for i from 0 to n - 1: out[--counts[key]] ← arr[i]  -> [(1,b), (3,c), (3,a)]",
          "",
          "// FIXED: iterate backwards (n - 1 down to 0) so later ties take later slots",
          "function counting_sort(arr, K):",
          "    counts ← array of (K + 1) zeros",
          "    for each x in arr: counts[x] ← counts[x] + 1",
          "    for v from 1 to K: counts[v] ← counts[v] + counts[v - 1]",
          "    out ← array of length len(arr)",
          "    for i from len(arr) - 1 down to 0:",
          "        v ← arr[i]",
          "        counts[v] ← counts[v] - 1",
          "        out[counts[v]] ← v",
          "    return out",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Non-comparison linear sorts vs comparison lower bound",
          headers: ["Algorithm", "Time complexity", "Extra space", "Stable?", "Requirement"],
          rows: [
            ["Comparison sorts (lower bound)", "`Omega(n log n)`", "`O(1)` to `O(n)`", "Depends", "Any comparable type (`a < b`)"],
            ["Counting Sort", "`O(n + K)`", "`O(n + K)`", "Yes (right-to-left placement)", "Integer keys in small range `[0..K]`"],
            ["LSD Radix Sort (base `B`, `d` digits)", "`O(d * (n + B))`", "`O(n + B)`", "Yes (relies on stable pass)", "Fixed-width integers or padded strings"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "KEY IDEA",
          text: "LSD Radix Sort only works because each digit pass is **stable**: when sorting `[21, 11]` by the tens digit (`2` vs `1`), ties on a shared tens digit like `[25, 21]` must keep the ones-digit order (`21` before `25`) from the previous pass!",
        },
      },
      {
        heading: "Designing multi-key custom comparators",
        paragraphs: [
          "In real problems, you rarely sort raw integers alone: you sort intervals by start time, tasks by `(priority DESC, deadline ASC)`, or strings by `(len(s) ASC, s ASC)`. A **custom comparator** maps two items `(a, b)` to an ordering signal (negative if `a` goes before `b`, zero if tied, positive if `a` goes after `b`) or maps each item to a **sort key tuple**.",
          "Whenever your language supports key tuples, e.g., `key(item) = (-item.score, item.name)`, prefer a key function over a manual three-way comparator: it runs in `O(n)` key extractions and avoids buggy non-transitive comparators. If you write a comparator directly (for example, sorting numbers `a` and `b` to form the largest concatenated number by comparing `str(a) + str(b)` vs `str(b) + str(a)`), verify **transitivity** and return `0` when `a` and `b` tie.",
        ],
        code: [
          "// Multi-key sort: score descending, then name ascending",
          "key(student) ← (-student.score, student.name)",
          "",
          "// Pairwise comparator for largest concatenated number:",
          "function compare_concat(a, b):",
          "    ab ← str(a) + str(b)",
          "    ba ← str(b) + str(a)",
          "    if ab > ba: return -1   // a comes before b",
          "    if ab < ba: return 1    // b comes before a",
          "    return 0",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Common custom comparator patterns",
          headers: ["Goal", "Sort key / comparator rule", "Tie-break behavior"],
          rows: [
            ["Interval scheduling", "`(end ASC, start ASC)`", "Earliest-ending interval first"],
            ["Leaderboard ranking", "`(-score, name)`", "Highest score first, alphabetical ties"],
            ["Largest number string", "`str(a) + str(b) > str(b) + str(a)`", "`\"9\"` before `\"34\"` because `\"934\" > \"349\"`"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "WATCH OUT",
          text: "A comparator must satisfy strict weak ordering: an element cannot come before itself (`cmp(a, a) == 0`), ordering must be consistent without cycles (`a` before `b` and `b` before `c` requires `a` before `c`), and equal-tier ties must be transitive. Returning `-1` on equal values breaks these rules and can make sorting loop or crash.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build Stable Counting Sort & Safe Multi-Key Comparators",
      steps: [
        {
          label: "Step 1: Count key frequencies in `[0..K]`",
          explanation: "Tally how many times each integer appears in `counts[0..K]` in `O(n)` time without comparing pairs.",
          code: [
            "counts ← array of (K + 1) zeros",
            "for each x in arr:",
            "    counts[x] ← counts[x] + 1",
          ],
          activeLines: [2, 3],
          output: "[3, 1, 3, 0, 2] -> counts = [1, 1, 1, 2]",
        },
        {
          label: "Step 2: Convert counts to prefix sums and place backwards",
          explanation: "Accumulate end offsets (`counts[v] += counts[v - 1]`), then walk `arr` from `n - 1` down to `0` so equal keys stay in original order.",
          code: [
            "for v from 1 to K: counts[v] ← counts[v] + counts[v - 1]",
            "out ← array of length len(arr)",
            "for i from len(arr) - 1 down to 0:",
            "    counts[arr[i]] ← counts[arr[i]] - 1",
            "    out[counts[arr[i]]] ← arr[i]",
          ],
          activeLines: [1, 3],
          output: "out = [0, 1, 2, 3, 3] (stable)",
        },
        {
          label: "Step 3: Use key tuples or return 0 on ties in comparators",
          explanation: "Prefer key tuples `(-score, name)`; if writing a pairwise comparator, return `0` whenever `a` and `b` tie.",
          code: [
            "function compare_concat(a, b):",
            "    ab ← str(a) + str(b)",
            "    ba ← str(b) + str(a)",
            "    if ab > ba: return -1",
            "    if ab < ba: return 1",
            "    return 0   // mandatory for strict weak ordering",
          ],
          activeLines: [6],
          output: "compare_concat(9, 34) -> -1 ('934' > '349')",
        },
      ],
    },
    walkthrough: {
      title: "Trace stable Counting Sort on arr = [3, 1, 3, 0, 2] (K = 3)",
      layout: "visual-first",
      steps: [
        {
          title: "Step 1: Count occurrences of each value in [0..3]",
          tag: "CONCEPT",
          explanation: [
            "Input `arr = [3, 1, 3, 0, 2]` has keys in `[0..3]`, so we allocate `counts` of length `K + 1 = 4`.",
            "One `O(n)` scan tallies `0 -> 1`, `1 -> 1`, `2 -> 1`, and `3 -> 2`.",
          ],
          code: [
            "// arr = [3, 1, 3, 0, 2], K = 3",
            "counts ← [0, 0, 0, 0]",
            "for x in arr:",
            "    counts[x] ← counts[x] + 1",
            "// counts = [1, 1, 1, 2]",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Input", value: "[3, 1, 3, 0, 2]" },
            { name: "counts[0..3]", value: "[1, 1, 1, 2]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input array (a0..a4)",
                cells: [
                  { id: "a0", value: "3", index: 0, state: "active" },
                  { id: "a1", value: "1", index: 1, state: "active" },
                  { id: "a2", value: "3", index: 2, state: "active" },
                  { id: "a3", value: "0", index: 3, state: "active" },
                  { id: "a4", value: "2", index: 4, state: "active" },
                ],
              },
              {
                label: "Frequency counts for keys 0, 1, 2, 3",
                cells: [
                  { id: "k0", value: "1", index: 0, state: "done" },
                  { id: "k1", value: "1", index: 1, state: "done" },
                  { id: "k2", value: "1", index: 2, state: "done" },
                  { id: "k3", value: "2", index: 3, state: "done" },
                ],
              },
            ],
            caption: "Key 3 appears twice (at index 0 and index 2); keys 0, 1, 2 appear once each.",
          },
        },
        {
          title: "Step 2: Prefix-sum counts to find 1-based end positions",
          tag: "TRACE",
          explanation: [
            "Convert `counts` into running prefix sums (`counts[v] += counts[v - 1]` for `v = 1..3`).",
            "`counts` becomes `[1, 2, 3, 5]`: key `0` ends at slot `1` (index `0`), key `2` ends at slot `3` (index `2`), and key `3` ends at slot `5` (indices `3..4`).",
          ],
          code: [
            "for v from 1 to K:",
            "    counts[v] ← counts[v] + counts[v - 1]",
            "// counts = [1, 2, 3, 5]",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "Prefix counts", value: "[1, 2, 3, 5]", changed: true },
            { name: "Key 3 end slot", value: "5 -> index 4" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input waiting for stable placement",
                cells: [
                  { id: "a0", value: "3", index: 0 },
                  { id: "a1", value: "1", index: 1 },
                  { id: "a2", value: "3", index: 2 },
                  { id: "a3", value: "0", index: 3 },
                  { id: "a4", value: "2", index: 4 },
                ],
              },
              {
                label: "Prefix-summed counts (1-based end slots)",
                cells: [
                  { id: "k0", value: "1", index: 0, state: "active" },
                  { id: "k1", value: "2", index: 1, state: "active" },
                  { id: "k2", value: "3", index: 2, state: "active" },
                  { id: "k3", value: "5", index: 3, state: "active" },
                ],
              },
            ],
            caption: "Each counts[v] - 1 gives the rightmost output index reserved for key v.",
          },
        },
        {
          title: "Step 3: Walk input backwards (i = 4, 3, 2) to preserve stability",
          tag: "TRACE",
          explanation: [
            "Scanning backwards from `i = 4` (`2`), `i = 3` (`0`), `i = 2` (`3`): decrement `counts[val]` and place `arr[i]` at `out[counts[val]]`.",
            "The later `3` (`a2` at index `2`) takes `out[4]` first, leaving `out[3]` open for the earlier `3` (`a0`).",
          ],
          code: [
            "for i from len(arr) - 1 down to 0:",
            "    v ← arr[i]",
            "    counts[v] ← counts[v] - 1",
            "    out[counts[v]] ← v",
          ],
          activeLines: [1, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Placed i=4,3,2", value: "out[2]=2, out[0]=0, out[4]=3", changed: true },
            { name: "counts now", value: "[0, 2, 2, 4]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Output array after placing i = 4, 3, 2",
                cells: [
                  { id: "a3", value: "0", index: 0, state: "done" },
                  { id: "empty1", value: "_", index: 1, state: "dim" },
                  { id: "a4", value: "2", index: 2, state: "done" },
                  { id: "empty3", value: "_", index: 3, state: "dim" },
                  { id: "a2", value: "3", index: 4, state: "done" },
                ],
                pointers: [{ index: 4, label: "later 3", tone: "coral" }],
              },
              {
                label: "Remaining counts",
                cells: [
                  { id: "k0", value: "0", index: 0, state: "dim" },
                  { id: "k1", value: "2", index: 1 },
                  { id: "k2", value: "2", index: 2, state: "dim" },
                  { id: "k3", value: "4", index: 3, state: "active" },
                ],
              },
            ],
            caption: "Walking right-to-left places the second 3 at index 4 so the first 3 lands before it.",
          },
        },
        {
          title: "Step 4: Place i = 1 (1) and i = 0 (first 3) -> [0, 1, 2, 3, 3]",
          tag: "PATTERN",
          explanation: [
            "Finish `i = 1` (`1` -> `out[1]`) and `i = 0` (`3` -> `out[3]`).",
            "Sorted output is `[0, 1, 2, 3, 3]` with `a0` before `a2` in `O(n + K)` time and zero pairwise comparisons.",
          ],
          code: [
            "// i = 1: counts[1] -> 1, out[1] ← 1",
            "// i = 0: counts[3] -> 3, out[3] ← 3",
            "return out   // [0, 1, 2, 3, 3]",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Sorted output", value: "[0, 1, 2, 3, 3]", changed: true },
            { name: "Total time", value: "O(n + K)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Stable sorted output [0, 1, 2, 3, 3]",
                cells: [
                  { id: "a3", value: "0", index: 0, state: "done" },
                  { id: "a1", value: "1", index: 1, state: "done" },
                  { id: "a4", value: "2", index: 2, state: "done" },
                  { id: "a0", value: "3", index: 3, state: "done" },
                  { id: "a2", value: "3", index: 4, state: "done" },
                ],
                pointers: [
                  { index: 3, label: "first 3", tone: "ok" },
                  { index: 4, label: "second 3", tone: "accent" },
                ],
                highlightRange: [0, 4],
              },
            ],
            caption: "Stability preserved: a0 (earlier 3) sits at index 3 ahead of a2 (later 3).",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using Counting Sort when K is huge (e.g., 0 to 10^9)",
        detail:
          "If `n = 1000` values span `0..10^9`, allocating `counts` of size `K + 1` wastes a billion slots and crashes with out-of-memory. Switch to LSD Radix Sort (`O(d * (n + B))`) or an `O(n log n)` comparison sort.",
      },
      {
        title: "Handling negative numbers in Counting Sort or Radix Sort",
        detail:
          "Array indices cannot be negative. For Counting Sort on `[min_val..max_val]`, shift every key by `-min_val` into `[0..max_val - min_val]`; for Radix Sort with negatives, partition negatives from non-negatives or flip the sign bit when using binary bases.",
        code: "idx ← val - min_val  // maps [min_val..max_val] -> [0..K]",
      },
    ],
    practiceTask: {
      title: "Stable Counting Sort for Bounded Scores",
      tier: "Warmup",
      goal: "Given an array of `(score, label)` pairs where `0 <= score <= max_score`, sort them in ascending order of `score` in `O(n + max_score)` time while keeping original order on equal scores.",
      constraints: ["1 <= len(items) <= 10^5", "0 <= score <= max_score <= 10^4", "Target: O(n + max_score) time and space"],
      examples: [
        { input: "items = [(3, \"a\"), (1, \"b\"), (3, \"c\"), (0, \"d\")], max_score = 3", output: "[(0, \"d\"), (1, \"b\"), (3, \"a\"), (3, \"c\")]" },
        { input: "items = [(2, \"x\"), (2, \"y\"), (2, \"z\")], max_score = 2", output: "[(2, \"x\"), (2, \"y\"), (2, \"z\")]", explanation: "All equal scores keep their original relative order because the placement pass scans right-to-left." },
      ],
      tasks: [
        "Build frequency array `counts` of size `max_score + 1` from `item.score`, then prefix-sum `counts`.",
        "Iterate `items` backwards (`n - 1` down to `0`) to place each pair into `out` stably.",
      ],
      starterCode: "function stable_counting_sort(items, max_score):\n    // TODO: stable O(n + max_score) Counting Sort\n    return out",
      expectedOutput: "[(0, \"d\"), (1, \"b\"), (3, \"a\"), (3, \"c\")]\n[(2, \"x\"), (2, \"y\"), (2, \"z\")]",
      hint: "Decrement `counts[score]` before indexing `out` when scanning backwards.",
      complexity: { time: "O(n + max_score)", space: "O(n + max_score)" },
      solutionCode:
        "function stable_counting_sort(items, max_score):\n    counts ← array of (max_score + 1) zeros\n    for item in items:\n        counts[item.score] ← counts[item.score] + 1\n    for v from 1 to max_score:\n        counts[v] ← counts[v] + counts[v - 1]\n    out ← array of size len(items)\n    for i from len(items) - 1 down to 0:\n        s ← items[i].score\n        counts[s] ← counts[s] - 1\n        out[counts[s]] ← items[i]\n    return out",
    },
    practiceChallenges: [
      {
        title: "Stable Counting Sort for Bounded Scores",
        tier: "Warmup",
        goal: "Sort `(score, label)` items by `score` in `[0..max_score]` in `O(n + max_score)` time while preserving input order for ties.",
        constraints: ["1 <= len(items) <= 10^5", "0 <= score <= max_score <= 10^4", "Target: O(n + max_score)"],
        examples: [
          { input: "items = [(3, \"a\"), (1, \"b\"), (3, \"c\"), (0, \"d\")], max_score = 3", output: "[(0, \"d\"), (1, \"b\"), (3, \"a\"), (3, \"c\")]" },
          { input: "items = [(2, \"x\"), (2, \"y\"), (2, \"z\")], max_score = 2", output: "[(2, \"x\"), (2, \"y\"), (2, \"z\")]", explanation: "Right-to-left scatter preserves x before y before z when all keys match." },
        ],
        tasks: [
          "Tally `counts[item.score]`, convert to prefix sums, and place items backwards from `n - 1` to `0`.",
        ],
        starterCode: "function stable_counting_sort(items, max_score):\n    // TODO: stable Counting Sort\n    return out",
        expectedOutput: "[(0, \"d\"), (1, \"b\"), (3, \"a\"), (3, \"c\")]\n[(2, \"x\"), (2, \"y\"), (2, \"z\")]",
        hint: "Backwards iteration places the last matching item in the rightmost slot of its bucket.",
        complexity: { time: "O(n + max_score)", space: "O(n + max_score)" },
        solutionCode:
          "function stable_counting_sort(items, max_score):\n    counts ← array of (max_score + 1) zeros\n    for item in items:\n        counts[item.score] ← counts[item.score] + 1\n    for v from 1 to max_score:\n        counts[v] ← counts[v] + counts[v - 1]\n    out ← array of size len(items)\n    for i from len(items) - 1 down to 0:\n        s ← items[i].score\n        counts[s] ← counts[s] - 1\n        out[counts[s]] ← items[i]\n    return out",
      },
      {
        title: "LSD Radix Sort on Non-Negative Integers",
        tier: "Core",
        goal: "Sort an array of non-negative integers up to `10^9` in `O(d * (n + 10))` time using base-10 LSD Radix Sort.",
        constraints: ["1 <= len(nums) <= 10^5", "0 <= nums[i] <= 10^9", "Target: O(d * (n + 10)) time"],
        examples: [
          { input: "nums = [170, 45, 75, 90, 802, 24, 2, 66]", output: "[2, 24, 45, 66, 75, 90, 170, 802]" },
          { input: "nums = [0, 5, 0]", output: "[0, 0, 5]" },
        ],
        tasks: [
          "Find `max_val = max(nums)` to know when to stop multiplying `exp = 1, 10, 100, ...`.",
          "At each `exp`, run stable Counting Sort using `digit = floor(nums[i] / exp) mod 10`.",
        ],
        starterCode: "function radix_sort_base10(nums):\n    // TODO: LSD Radix Sort pass by pass\n    return nums",
        expectedOutput: "[2, 24, 45, 66, 75, 90, 170, 802]\n[0, 0, 5]",
        hint: "Remember to copy `out` back into `nums` after each digit pass before multiplying `exp` by `10`.",
        complexity: { time: "O(d * (n + 10))", space: "O(n + 10)" },
        solutionCode:
          "function radix_sort_base10(nums):\n    if len(nums) <= 1: return nums\n    max_val ← max(nums)\n    exp ← 1\n    while floor(max_val / exp) > 0:\n        counts ← array of 10 zeros\n        for x in nums:\n            d ← floor(x / exp) mod 10\n            counts[d] ← counts[d] + 1\n        for d from 1 to 9:\n            counts[d] ← counts[d] + counts[d - 1]\n        out ← array of size len(nums)\n        for i from len(nums) - 1 down to 0:\n            d ← floor(nums[i] / exp) mod 10\n            counts[d] ← counts[d] - 1\n            out[counts[d]] ← nums[i]\n        nums ← out\n        exp ← exp * 10\n    return nums",
      },
      {
        title: "Largest Concatenated Number String",
        tier: "Stretch",
        goal: "Given a list of non-negative integers `nums`, arrange them so they concatenate into the largest possible decimal number string.",
        constraints: ["1 <= len(nums) <= 10^5", "0 <= nums[i] <= 10^9", "Handle all-zero arrays like [0, 0] -> \"0\""],
        examples: [
          { input: "nums = [3, 30, 34, 5, 9]", output: "9534330", explanation: "\"9\" + \"5\" + \"34\" + \"3\" + \"30\" beats putting \"30\" before \"3\"." },
          { input: "nums = [0, 0]", output: "0" },
        ],
        tasks: [
          "Convert numbers to strings and sort with custom comparator `a` before `b` iff `a + b > b + a`.",
          "If the largest string after sorting is `\"0\"`, return `\"0\"`; otherwise join all strings.",
        ],
        starterCode: "function largest_concatenated_number(nums):\n    // TODO: custom comparator sort on string concatenations\n    return result",
        expectedOutput: "9534330\n0",
        hint: "Check `strs[0] == \"0\"` at the end so `[0, 0]` returns `\"0\"` instead of `\"00\"`. In Python 3, wrap a pairwise comparator with `functools.cmp_to_key(cmp)` since `list.sort` uses `key=` rather than `cmp=`.",
        complexity: { time: "O(n log n * L)", space: "O(n * L)" },
        solutionCode:
          "function largest_concatenated_number(nums):\n    strs ← [str(x) for x in nums]\n    sort strs with comparator(a, b):\n        if a + b > b + a: return -1\n        if a + b < b + a: return 1\n        return 0\n    if strs[0] == \"0\":\n        return \"0\"\n    return join(strs, \"\")",
      },
    ],
  },
  "dsa-cyclic-sort": {
    lessonId: "dsa-cyclic-sort",
    subtitle:
      "Sort integers in [1..n] or [0..n] in O(n) time and O(1) extra space by swapping each value straight to its home index, catching duplicates, missing numbers, and the first missing positive.",
    intro: {
      heading: "Cyclic Sort & [1..n] In-Place Index Placement",
      explanation: [
        "Finding a missing or duplicate number in an unsorted `[1..n]` array often forces an awkward trade-off: sorting the array first takes `O(n log n)` time, while tracking seen values in a hash set burns `O(n)` extra memory. Even after switching to in-place swaps, writing `while nums[i] != i + 1: swap(nums, i, nums[i] - 1)` triggers an infinite loop on duplicates because `nums[i]` and `nums[nums[i] - 1]` keep trading identical copies forever.",
        "**Cyclic Sort** places each value `v` directly into its home index `v - 1` (or `v` for `[0..n]`). Every executed swap settles at least one element into its permanent slot, capping total swaps at `n - 1` for **`O(n)` time** and **`O(1)` extra space**. Guarding with `1 <= nums[i] <= n` and `nums[i] != nums[target]` skips out-of-range numbers and stops duplicate loops cold, leaving one final scan to report any missing or repeated values.",
      ],
      analogy:
        "Numbered theater seats labeled 1 through n work the same way: every guest holds a ticket for their assigned seat. Walking down the row from seat 1, whoever sits in seat i swaps with the occupant of their ticketed seat until seat i holds the right guest, or until the person already sitting in that target seat holds an identical duplicate ticket.",
      realWorldUses: [
        "Detecting dropped or duplicated sequence IDs in `[1..n]` packet logs and invoice batches under strict `O(1)` memory budgets",
        "Finding the First Missing Positive primary key in unsorted database imports without allocating a hash table or running an `O(n log n)` sort",
      ],
    },
    sections: [
      {
        heading: "Swapping directly to home index v - 1",
        paragraphs: [
          "When array values lie in `[1..n]`, the sorted position of value `v` is already known without comparing pairs: `v` belongs at index `v - 1` (or index `v` when values span `[0..n]`). At index `i`, compute `target = nums[i] - 1`, swap `nums[i]` with `nums[target]` when `nums[i]` belongs elsewhere, and stay on index `i` because the incoming element may also be out of place.",
          "Once `nums[i]` lands at `i + 1`—or hits a duplicate or out-of-range value—increment `i` by `1`. Even though swaps repeat inside a `while` loop, every swap puts one misplaced value into its permanent home slot, so total swaps across the entire run stay bounded by `n`.",
        ],
        code: [
          "// Bug: infinite loop on duplicate [1, 3, 2, 2]",
          "// while nums[i] != i + 1:",
          "//     swap(nums, i, nums[i] - 1)  // at i=3, nums[3]=2 swaps with nums[1]=2 forever!",
          "",
          "// Fixed: check bounds and skip when target already holds the same value",
          "function cyclic_sort_guarded(nums):",
          "    n ← len(nums)",
          "    i ← 0",
          "    while i < n:",
          "        target ← nums[i] - 1",
          "        if 1 <= nums[i] <= n and nums[i] != nums[target]:",
          "            swap(nums, i, target)",
          "        else:",
          "            i ← i + 1",
          "    return nums",
        ],
        codeLabel: "Pseudocode",
        output:
          "Broken on [1, 3, 2, 2]: hangs at i = 3 swapping 2 with 2\nFixed on [1, 3, 2, 2]: [1, 2, 3, 2] -> index 3 holds 2 instead of 4",
        callout: {
          kind: "WATCH OUT",
          text: "Checking `nums[i] != i + 1` alone fails on duplicates and out-of-range numbers. Writing `nums[i] != nums[target]` handles both cases at once: when `nums[i]` already sits at home (`target == i`), `nums[i] == nums[i]` is true, and when `target` already holds a duplicate copy, `nums[i] == nums[target]` stops the swap.",
        },
      },
      {
        heading: "Adapting Cyclic Sort to [0..n], duplicates, and negatives",
        paragraphs: [
          "After placement finishes, mismatches between `nums[i]` and its expected index reveal the answer in one `O(n)` scan. For Missing Number on `[0..n]` (`n` items missing one value), the home index is `v` itself, and value `n` has no slot in `0..n - 1`, so it stays put until the scan reports the first `i` where `nums[i] != i`.",
          "For First Missing Positive, the array can hold negative numbers, zeros, and integers larger than `n`. Guarding with `1 <= nums[i] <= n` leaves irrelevant numbers untouched; after placement, the first index `i` where `nums[i] != i + 1` returns `i + 1` (or `n + 1` if every number `1..n` sits in place).",
        ],
        code: [
          "// Trace First Missing Positive on nums = [3, 4, -1, 1] (n = 4)",
          "// i = 0: 3 -> swap(0, 2) => [-1, 4, 3, 1]; -1 <= 0 -> i = 1",
          "// i = 1: 4 -> swap(1, 3) => [-1, 1, 3, 4]; 1 -> swap(1, 0) => [1, -1, 3, 4]; -1 <= 0 -> i = 2",
          "// i = 2: 3 == nums[2], i = 3: 4 == nums[3] -> placement done: [1, -1, 3, 4]",
          "// Scan: i = 0 holds 1, i = 1 holds -1 != 2 -> First Missing Positive is 2",
        ],
        codeLabel: "Trace",
        output: "[3, 4, -1, 1] -> [1, -1, 3, 4] -> First Missing Positive = 2",
        table: {
          caption: "Cyclic Sort variants: home index, swap guard, and final scan",
          headers: ["Problem", "Expected value range", "Home index for v", "Swap guard", "Final scan result"],
          rows: [
            ["Missing Number", "[0..n] (1 missing)", "v", "0 <= v < n and nums[i] != nums[v]", "First i where nums[i] != i, else n"],
            ["Find All Duplicates", "[1..n] (1x or 2x each)", "v - 1", "nums[i] != nums[v - 1]", "All nums[i] where nums[i] != i + 1"],
            ["First Missing Positive", "Any integers (<= 0 or > n)", "v - 1", "1 <= v <= n and nums[i] != nums[v - 1]", "First i + 1 where nums[i] != i + 1, else n + 1"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Any array of length `n` has a First Missing Positive in `[1..n + 1]` by the pigeonhole principle: even if every slot holds a distinct positive integer `1..n`, the answer is `n + 1`, so values `<= 0` or `> n` never need a home index.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build Cyclic Sort from [1..n] Swaps to First Missing Positive",
      subtitle: "Start with basic in-place placement, add duplicate and range guards, then scan for the missing value.",
      steps: [
        {
          label: "Step 1: Basic [1..n] cyclic placement",
          explanation: "Map each value v in [1..n] to index v - 1. Keep swapping index i until nums[i] sits at home, then advance i.",
          code: [
            "i ← 0",
            "while i < len(nums):",
            "    target ← nums[i] - 1",
            "    if nums[i] != i + 1:",
            "        swap(nums, i, target)",
            "    else:",
            "        i ← i + 1",
          ],
          activeLines: [3, 4, 5],
          output: "[3, 1, 2] -> [1, 2, 3]",
        },
        {
          label: "Step 2: Skip duplicates and out-of-range <= 0 or > n values",
          explanation: "Guard bounds with 1 <= nums[i] <= n and compare nums[i] != nums[target] so duplicates and out-of-range numbers never loop or index out of bounds.",
          code: [
            "n ← len(nums)",
            "i ← 0",
            "while i < n:",
            "    target ← nums[i] - 1",
            "    if 1 <= nums[i] <= n and nums[i] != nums[target]:",
            "        swap(nums, i, target)",
            "    else:",
            "        i ← i + 1",
          ],
          activeLines: [5, 6],
          output: "[3, 1, 4, -1, 1] -> [1, -1, 3, 4, 1]",
        },
        {
          label: "Step 3: First Missing Positive scan",
          explanation: "Walk i from 0 to n - 1 after placement; the first index where nums[i] != i + 1 reveals i + 1, or n + 1 if 1..n all sit in place.",
          code: [
            "for i from 0 to n - 1:",
            "    if nums[i] != i + 1:",
            "        return i + 1",
            "return n + 1",
          ],
          activeLines: [2, 3, 4],
          output: "[1, -1, 3, 4, 1] -> returns 2",
        },
      ],
    },
    walkthrough: {
      title: "Trace First Missing Positive on nums = [3, 1, 4, -1, 1]",
      layout: "visual-first",
      steps: [
        {
          title: "Step 1: Inspect [3, 1, 4, -1, 1] at i = 0 before swapping 3 -> index 2",
          tag: "CONCEPT",
          explanation: [
            "Start at `i = 0` where `nums = [3, 1, 4, -1, 1]`. Here `nums[0] = 3`, so its home index is `target = 3 - 1 = 2`.",
            "Since `1 <= 3 <= 5` and `nums[0] != nums[2]` (`3 != 4`), swap indices `0` and `2` while keeping `i = 0`.",
          ],
          code: [
            "// Start: [3, 1, 4, -1, 1], i = 0",
            "while i < n:",
            "    target ← nums[i] - 1            // 3 - 1 = 2",
            "    if 1 <= nums[i] <= n and nums[i] != nums[target]:",
            "        swap(nums, i, target)       // swaps 3 and 4",
          ],
          activeLines: [3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "0" },
            { name: "Before swap", value: "[3, 1, 4, -1, 1]" },
            { name: "target", value: "2 (nums[2] = 4)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Initial array before swap(0, 2)",
                cells: [
                  { id: "c0", value: "3", index: 0, state: "active" },
                  { id: "c1", value: "1", index: 1 },
                  { id: "c2", value: "4", index: 2, state: "pivot" },
                  { id: "c3", value: "-1", index: 3 },
                  { id: "c4", value: "1", index: 4 },
                ],
                pointers: [
                  { index: 0, label: "i=0 (3)", tone: "coral" },
                  { index: 2, label: "target=2 (4)", tone: "accent" },
                ],
              },
            ],
            caption: "Before swapping: 3 belongs at index 2, currently occupied by 4.",
          },
        },
        {
          title: "Step 2: Stay at i = 0 after [4, 1, 3, -1, 1] and swap 4 -> index 3",
          tag: "TRACE",
          explanation: [
            "Swapping indices `0` and `2` settles `3` at home and lands `4` at `nums[0]` (`[4, 1, 3, -1, 1]`). Do not increment `i` inside the swap branch.",
            "Re-checking `i = 0` finds `nums[0] = 4` (`target = 3`). Since `4 != nums[3]` (`-1`), swap `0` and `3` to get `[-1, 1, 3, 4, 1]`.",
          ],
          code: [
            "// After swap(0, 2): [4, 1, 3, -1, 1], i stays 0",
            "target ← nums[0] - 1            // 4 - 1 = 3",
            "if 1 <= 4 <= 5 and nums[0] != nums[3]:",
            "    swap(nums, 0, 3)            // [-1, 1, 3, 4, 1]",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "0 (re-check)" },
            { name: "Array", value: "[-1, 1, 3, 4, 1]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After swaps at i = 0",
                cells: [
                  { id: "c0", value: "-1", index: 0, state: "active" },
                  { id: "c1", value: "1", index: 1 },
                  { id: "c2", value: "3", index: 2, state: "done" },
                  { id: "c3", value: "4", index: 3, state: "done" },
                  { id: "c4", value: "1", index: 4 },
                ],
                pointers: [
                  { index: 0, label: "i=0 (-1)", tone: "coral" },
                  { index: 2, label: "3 home", tone: "ok" },
                  { index: 3, label: "4 home", tone: "ok" },
                ],
              },
            ],
            caption: "Staying at i = 0 after the first swap placed both 3 and 4 into their home indices.",
          },
        },
        {
          title: "Step 3: i = 0 hits -1 (<= 0), advance to i = 1 and swap 1 -> index 0",
          tag: "TRACE",
          explanation: [
            "At `i = 0`, `nums[0] = -1` fails `1 <= nums[i] <= 5`, so the `else` branch advances `i` to `1`.",
            "At `i = 1`, `nums[1] = 1` (`target = 0`). Since `nums[0] = -1 != 1`, swap `1` and `0` so `1` moves home to index `0` and `-1` drops into index `1`.",
          ],
          code: [
            "// i = 0 holds -1 <= 0 -> i becomes 1",
            "target ← nums[1] - 1   // 1 - 1 = 0",
            "if 1 <= 1 <= 5 and nums[1] != nums[0]:",
            "    swap(nums, 1, 0)   // [1, -1, 3, 4, 1]",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "1", changed: true },
            { name: "Array", value: "[1, -1, 3, 4, 1]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After swapping 1 into index 0",
                cells: [
                  { id: "c0", value: "1", index: 0, state: "done" },
                  { id: "c1", value: "-1", index: 1, state: "active" },
                  { id: "c2", value: "3", index: 2, state: "done" },
                  { id: "c3", value: "4", index: 3, state: "done" },
                  { id: "c4", value: "1", index: 4 },
                ],
                pointers: [
                  { index: 0, label: "1 home", tone: "ok" },
                  { index: 1, label: "i=1 (-1)", tone: "coral" },
                ],
              },
            ],
            caption: "Out-of-range -1 gets pushed aside as 1 moves to index 0; next iteration skips -1 and advances i.",
          },
        },
        {
          title: "Step 4: i = 2 and i = 3 already hold 3 and 4 at home",
          tag: "TRACE",
          explanation: [
            "After `-1` at `i = 1` skips, we check `i = 2` (`nums[2] = 3`, `target = 2`) and `i = 3` (`nums[3] = 4`, `target = 3`).",
            "Because `nums[i] == nums[target]` at both indices, zero swaps happen and `i` advances to `4`.",
          ],
          code: [
            "// i = 2: target = 2, nums[2] == nums[2] -> skip",
            "// i = 3: target = 3, nums[3] == nums[3] -> skip",
            "i ← i + 1   // advance to i = 4",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "2 -> 3 -> 4", changed: true },
            { name: "Array", value: "[1, -1, 3, 4, 1]" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Home slots already satisfied at i = 2 and i = 3",
                cells: [
                  { id: "c0", value: "1", index: 0, state: "done" },
                  { id: "c1", value: "-1", index: 1, state: "dim" },
                  { id: "c2", value: "3", index: 2, state: "active" },
                  { id: "c3", value: "4", index: 3, state: "active" },
                  { id: "c4", value: "1", index: 4 },
                ],
                pointers: [
                  { index: 2, label: "i=2 (3==3)", tone: "ok" },
                  { index: 3, label: "i=3 (4==4)", tone: "ok" },
                ],
              },
            ],
            caption: "Values already sitting in their home indices pass in O(1) without extra swaps.",
          },
        },
        {
          title: "Step 5: i = 4 hits duplicate 1 (nums[4] == nums[0]), preventing an infinite loop",
          tag: "PITFALL",
          explanation: [
            "At `i = 4`, `nums[4] = 1` targets index `0`. Checking `nums[4] != 5` alone would swap index `4` with index `0` forever because both slots hold `1`.",
            "The guard `nums[4] != nums[0]` evaluates `1 != 1` (false), so the duplicate stays at index `4` and `i` advances past the end of the array.",
          ],
          code: [
            "// i = 4: nums[4] = 1, target = 0",
            "if 1 <= nums[4] <= 5 and nums[4] != nums[0]:",
            "    // 1 != 1 is false -> skip swap, advance i to 5",
            "i ← i + 1",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "4 -> 5", changed: true },
            { name: "Duplicate guard", value: "nums[4] == nums[0] == 1" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Duplicate 1 collides with settled 1 at index 0",
                cells: [
                  { id: "c0", value: "1", index: 0, state: "done" },
                  { id: "c1", value: "-1", index: 1, state: "dim" },
                  { id: "c2", value: "3", index: 2, state: "done" },
                  { id: "c3", value: "4", index: 3, state: "done" },
                  { id: "c4", value: "1", index: 4, state: "pivot" },
                ],
                pointers: [
                  { index: 0, label: "target=0 (1)", tone: "accent" },
                  { index: 4, label: "i=4 dup 1", tone: "coral" },
                ],
              },
            ],
            caption: "Duplicate guard prevents swapping identical 1s at index 4 and index 0.",
          },
        },
        {
          title: "Step 6: Final O(n) scan finds nums[1] = -1 != 2 -> returns 2",
          tag: "PATTERN",
          explanation: [
            "Walk `i` from `0` to `4` checking `nums[i] != i + 1`: index `0` holds `1`, then index `1` holds `-1` instead of `2`.",
            "Return `1 + 1 = 2` immediately in `O(n)` total time and `O(1)` auxiliary space.",
          ],
          code: [
            "for i from 0 to n - 1:",
            "    if nums[i] != i + 1:",
            "        return i + 1   // i = 1 -> returns 2",
            "return n + 1",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Scan i = 1", value: "nums[1] = -1 != 2", changed: true },
            { name: "Answer", value: "2", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Final scan stops at first mismatch",
                cells: [
                  { id: "c0", value: "1", index: 0, state: "done" },
                  { id: "c1", value: "-1", index: 1, state: "active" },
                  { id: "c2", value: "3", index: 2, state: "done" },
                  { id: "c3", value: "4", index: 3, state: "done" },
                  { id: "c4", value: "1", index: 4, state: "dim" },
                ],
                pointers: [{ index: 1, label: "missing 2", tone: "coral" }],
                highlightRange: [0, 1],
              },
            ],
            caption: "First mismatch at index 1 gives the First Missing Positive: 2.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Infinite swap loop on duplicate values",
        detail:
          "Writing `while nums[i] != i + 1` hangs when `nums[i]` equals `nums[nums[i] - 1]`, because two copies keep trading places without changing the array. Always test `nums[i] != nums[target]` before swapping.",
        code: "if 1 <= nums[i] <= n and nums[i] != nums[nums[i] - 1]: swap(nums, i, nums[i] - 1)",
      },
      {
        title: "Advancing i inside the swap branch",
        detail:
          "After `swap(nums, i, target)`, keep `i` unchanged so the newly arrived element at index `i` also gets moved to its home slot. Increment `i` only in the `else` branch.",
      },
      {
        title: "Mixing up [0..n] vs [1..n] home indices",
        detail:
          "Values in `[1..n]` belong at `target = nums[i] - 1`, whereas values in `[0..n]` belong directly at `target = nums[i]` with bounds check `0 <= nums[i] < n`.",
      },
    ],
    predictChecks: [
      {
        prompt:
          "On `nums = [1, 2, 2]`, index `i = 2` holds `2`. What happens if your loop checks `while nums[i] != i + 1` without `nums[i] != nums[nums[i] - 1]`?",
        code: "i ← 2   // nums = [1, 2, 2]\nwhile nums[i] != i + 1:\n    swap(nums, i, nums[i] - 1)",
        options: [
          { id: "a", label: "It finishes in one swap and returns [1, 2, 2]" },
          { id: "b", label: "It loops forever swapping nums[2] = 2 with nums[1] = 2" },
          { id: "c", label: "It throws an index-out-of-bounds error at index 3" },
        ],
        correctId: "b",
        explanation:
          "At i = 2, nums[2] is 2 != 3, so target is 2 - 1 = 1. Because nums[1] is already 2, swapping indices 2 and 1 leaves [1, 2, 2] unchanged and repeats forever.",
      },
      {
        prompt:
          "After running guarded Cyclic Sort on `nums = [7, 8, 9, 11, 12]` (`n = 5`), what does the final First Missing Positive scan return?",
        code: "// Guard: 1 <= nums[i] <= 5 and nums[i] != nums[nums[i] - 1]\nfor i from 0 to 4:\n    if nums[i] != i + 1: return i + 1\nreturn 6",
        options: [
          { id: "a", label: "1" },
          { id: "b", label: "6" },
          { id: "c", label: "10" },
        ],
        correctId: "a",
        explanation:
          "Every value exceeds n = 5, so zero swaps run. On the scan, i = 0 sees nums[0] = 7 != 1 and returns 0 + 1 = 1.",
      },
    ],
    practiceTask: {
      title: "In-Place Cyclic Sort on [1..n]",
      tier: "Warmup",
      goal: "Given an unsorted permutation `nums` containing every integer in `[1..n]` exactly once, sort `nums` in-place in `O(n)` time and `O(1)` extra space.",
      constraints: ["1 <= len(nums) <= 10^5", "Every value satisfies 1 <= nums[i] <= len(nums)", "Target: O(n) time, O(1) space"],
      examples: [
        { input: "nums = [3, 1, 5, 4, 2]", output: "[1, 2, 3, 4, 5]" },
        { input: "nums = [2, 1]", output: "[1, 2]" },
      ],
      tasks: [
        "Iterate `i` from `0` to `n - 1`; while `nums[i] != nums[nums[i] - 1]`, swap `nums[i]` with `nums[nums[i] - 1]`.",
        "Advance `i` only when `nums[i]` sits at its home index `nums[i] - 1`.",
      ],
      starterCode: "function cyclic_sort_1_to_n(nums):\n    // TODO: sort [1..n] permutation in O(n) time and O(1) space\n    return nums",
      expectedOutput: "[1, 2, 3, 4, 5]\n[1, 2]",
      hint: "Compute `target = nums[i] - 1` into a local variable before swapping so the second read does not use a mutated `nums[i]`.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function cyclic_sort_1_to_n(nums):\n    i ← 0\n    while i < len(nums):\n        target ← nums[i] - 1\n        if nums[i] != nums[target]:\n            swap(nums, i, target)\n        else:\n            i ← i + 1\n    return nums",
    },
    practiceChallenges: [
      {
        title: "Missing Number in [0..n]",
        tier: "Warmup",
        goal: "Given an array `nums` of `n` distinct integers taken from `[0..n]`, return the single missing integer in `O(n)` time and `O(1)` extra space.",
        constraints: ["1 <= len(nums) <= 10^5", "0 <= nums[i] <= len(nums), all distinct", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [3, 0, 1]", output: "2", explanation: "After placement: [0, 1, 3]; index 2 holds 3 != 2." },
          { input: "nums = [0, 1]", output: "2", explanation: "All indices 0..1 match; missing value is n = 2." },
        ],
        tasks: [
          "Place each value `v < len(nums)` at index `v` (`target = nums[i]`) whenever `nums[i] < n and nums[i] != nums[target]`.",
          "Scan `i` from `0` to `n - 1` and return the first `i` where `nums[i] != i`, or `n` if all match.",
        ],
        starterCode: "function missing_number(nums):\n    // TODO: place values in [0..n-1] at nums[v] and find missing index\n    return len(nums)",
        expectedOutput: "2\n2",
        hint: "Here values are 0-indexed (`[0..n]`), so home index is `nums[i]` rather than `nums[i] - 1`, and value `n` stays put.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function missing_number(nums):\n    n ← len(nums)\n    i ← 0\n    while i < n:\n        target ← nums[i]\n        if nums[i] < n and nums[i] != nums[target]:\n            swap(nums, i, target)\n        else:\n            i ← i + 1\n    for i from 0 to n - 1:\n        if nums[i] != i:\n            return i\n    return n",
      },
      {
        title: "Find All Duplicates in [1..n]",
        tier: "Core",
        goal: "Given an integer array `nums` of length `n` where each value lies in `[1..n]` and appears once or twice, return every number that appears twice in `O(n)` time and `O(1)` extra space (excluding output).",
        constraints: ["1 <= len(nums) <= 10^5", "1 <= nums[i] <= len(nums)", "Target: O(n) time, O(1) auxiliary space"],
        examples: [
          { input: "nums = [4, 3, 2, 7, 8, 2, 3, 1]", output: "[3, 2]", explanation: "After placement: [1, 2, 3, 4, 3, 2, 7, 8]; indices 4 and 5 hold duplicates 3 and 2." },
          { input: "nums = [1, 1, 2]", output: "[1]" },
        ],
        tasks: [
          "Run Cyclic Sort with `nums[i] != nums[nums[i] - 1]` so duplicate copies never loop.",
          "Scan `i` from `0` to `n - 1` and append `nums[i]` whenever `nums[i] != i + 1`.",
        ],
        starterCode: "function find_all_duplicates(nums):\n    // TODO: cyclic sort with duplicate guard, then collect nums[i] != i + 1\n    return dups",
        expectedOutput: "[3, 2]\n[1]",
        hint: "Every value with two copies fills its home index `v - 1` once and strands the extra copy at some mismatched index `i`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function find_all_duplicates(nums):\n    i ← 0\n    while i < len(nums):\n        target ← nums[i] - 1\n        if nums[i] != nums[target]:\n            swap(nums, i, target)\n        else:\n            i ← i + 1\n    dups ← []\n    for i from 0 to len(nums) - 1:\n        if nums[i] != i + 1:\n            dups.append(nums[i])\n    return dups",
      },
      {
        title: "First Missing Positive Integer",
        tier: "Stretch",
        goal: "Given an unsorted integer array `nums` that may contain negatives, zeros, duplicates, and integers above `n`, return the smallest positive integer (`>= 1`) missing from `nums` in `O(n)` time and `O(1)` extra space.",
        constraints: ["1 <= len(nums) <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1", "Target: O(n) time, O(1) extra space"],
        examples: [
          { input: "nums = [3, 4, -1, 1]", output: "2", explanation: "Placement yields [1, -1, 3, 4]; index 1 holds -1 != 2." },
          { input: "nums = [1, 2, 0]", output: "3" },
          { input: "nums = [1, 2, 3]", output: "4" },
        ],
        tasks: [
          "Swap `nums[i]` to `target = nums[i] - 1` only when `1 <= nums[i] <= n` and `nums[i] != nums[target]`.",
          "Scan `i` from `0` to `n - 1` for the first `nums[i] != i + 1` and return `i + 1`; otherwise return `n + 1`.",
        ],
        starterCode: "function first_missing_positive(nums):\n    // TODO: ignore <= 0 or > n, cyclic sort, and return first i + 1 mismatch\n    return len(nums) + 1",
        expectedOutput: "2\n3\n4",
        hint: "Negative numbers, zeros, and integers larger than `n` never affect the first missing positive in `[1..n + 1]`, so skip swapping them.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function first_missing_positive(nums):\n    n ← len(nums)\n    i ← 0\n    while i < n:\n        target ← nums[i] - 1\n        if 1 <= nums[i] <= n and nums[i] != nums[target]:\n            swap(nums, i, target)\n        else:\n            i ← i + 1\n    for i from 0 to n - 1:\n        if nums[i] != i + 1:\n            return i + 1\n    return n + 1",
      },
    ],
  },
  "dsa-quickselect": {
    lessonId: "dsa-quickselect",
    subtitle:
      "Find the k-th smallest or k-th largest element in O(n) expected time and O(1) extra space by partitioning around a pivot and discarding the non-target half instead of sorting the entire array.",
    intro: {
      heading: "Quickselect & K-th Order Statistics",
      explanation: [
        "Sorting 1,000,000 request latencies just to read the median (`p50`) spends `O(n log n)` comparisons putting 999,999 ranks in order that you immediately ignore—yet a naive Quickselect using a fixed `arr[hi]` pivot crashes back to `O(n²)` on sorted inputs or `[5, 5, ..., 5]` duplicates, and passing `k - 1` instead of `n - k` returns the k-th smallest when you asked for k-th largest.",
        "**Quickselect** places one random pivot in its final index `p` and discards the side that cannot contain `target = n - k`. Because every iteration shrinks into **only one side**, expected work sums geometrically (`n + n/2 + n/4 + ... = 2n`) for **`O(n)` expected time** and **`O(1)` iterative space**.",
      ],
      analogy:
        "Finding the 50th tallest person out of 1,000 recruits works by picking someone average-looking, lining shorter recruits left and taller recruits right, and counting `380` shorter recruits: you leave those `380` people unsorted and search only inside the remaining group.",
      realWorldUses: [
        "Computing exact sample medians (`p50`) or `p95` latencies over unsorted request durations in O(n) expected time",
        "Returning the Top-K closest points to origin or Top-K largest elements in O(n) average without maintaining a heap",
      ],
    },
    sections: [
      {
        heading: "Why One-Sided Partitioning Gives O(n) Instead of O(n log n)",
        paragraphs: [
          "Quick Sort runs `T(n) = 2 * T(n/2) + O(n) = O(n log n)` because it has to process both sides after partitioning. Quickselect runs **`T(n) = T(n/2) + O(n) = O(n)`** on average because after placing the pivot at its true sorted index `p`, one entire side is dead.",
          "Convert `k`-th largest once at the start: in a zero-indexed sorted array of length `n`, the **k-th smallest** sits at `target = k - 1`, and the **k-th largest** sits at `target = n - k`. Because our iterative loop shrinks `[lo, hi]` directly in place, Quickselect uses `O(1)` extra space (no recursion stack).",
        ],
        table: {
          caption: "Finding the K-th Element: Approach Tradeoffs",
          headers: ["Approach", "Expected Time", "Worst-Case Time", "Extra Space", "Best Use Case"],
          rows: [
            ["Full Sort (`O(n log n)`)", "`O(n log n)`", "`O(n log n)` (Merge)", "`O(1)-O(n)`", "Need multiple rank queries afterward"],
            ["Size-`k` Min-Heap", "`O(n log k)`", "`O(n log k)`", "`O(k)`", "Streaming data where full array does not fit in RAM"],
            ["Randomized Quickselect", "`O(n)`", "`O(n^2)` (adversarial)", "`O(1)` iterative", "Fastest in-memory single `k`-th / Top-K query"],
            ["Median-of-Medians Select", "`O(n)`", "`O(n)` guaranteed", "`O(log n)`", "Strict `O(n)` worst-case theoretical guarantees"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Always check `target = len(nums) - k` for k-th largest (not `k - 1`) and randomize the pivot inside `[lo, hi]` so pre-sorted arrays cannot force `O(n^2)` behavior.",
        },
      },
      {
        heading: "Handling Duplicates & Worst-Case Prevention",
        paragraphs: [
          "Just like Quick Sort, standard Lomuto partition around the last element runs in `O(n^2)` if given sorted inputs or arrays packed with identical elements (`[5, 5, ..., 5]`).",
          "Two fixes keep Quickselect linear in production: (1) swap a uniformly random index `r in [lo, hi]` into `arr[hi]` before partitioning, and (2) use **3-way Dutch National Flag partitioning** (`< pivot`, `== pivot`, `> pivot`) when duplicate-heavy inputs occur: if `target` falls inside `[lt..gt]`, return `pivot` right away in `O(n)`.",
        ],
        code: [
          "// SLOW O(n log n): full sort when you only need rank target = len(nums) - k",
          "// sort(nums); return nums[len(nums) - k]",
          "",
          "// FAST O(n) expected, O(1) space: iterative randomized Quickselect",
          "function kth_largest(nums, k):",
          "    target ← len(nums) - k",
          "    lo ← 0; hi ← len(nums) - 1",
          "    while lo <= hi:",
          "        r ← random_int(lo, hi)",
          "        swap(nums, r, hi)",
          "        p ← lomuto_partition(nums, lo, hi)",
          "        if p == target: return nums[p]",
          "        if p < target: lo ← p + 1",
          "        else: hi ← p - 1",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "How 3-Way Partition Reacts to Target Index",
          headers: ["Where `target` Falls", "Partition Slice", "Next Action", "Cost"],
          rows: [
            ["`target < lt`", "Strictly smaller band `[lo..lt - 1]`", "Set `hi = lt - 1`", "Discard `==` and `>` bands"],
            ["`lt <= target <= gt`", "Equal band `[lt..gt]`", "Return `nums[lt]` immediately!", "Early exit on duplicates"],
            ["`target > gt`", "Strictly greater band `[gt + 1..hi]`", "Set `lo = gt + 1`", "Discard `<` and `==` bands"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Do not subtract `k` ambiguously on recursive slices if it confuses indices; keeping original 0-based `target = n - k` with `[lo, hi]` bounds makes iterative Quickselect bug-free.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From O(n log n) Full Sort to O(n) Iterative Quickselect",
      steps: [
        {
          label: "Step 1: Full sort wastes `O(n log n)` work for one rank",
          explanation: "Sorting all `n` elements orders every index even though you only read `nums[n - k]`.",
          code: [
            "function kth_largest_slow(nums, k):",
            "    sort(nums)                 // O(n log n) comparisons",
            "    return nums[len(nums) - k]",
          ],
          activeLines: [2],
          output: "1,000,000 items -> ~20,000,000 comparisons",
        },
        {
          label: "Step 2: Partition with random pivot and discard one side",
          explanation: "Convert `k`-th largest to ascending `target = n - k`, partition around a random pivot, and drop the side without `target`.",
          code: [
            "function kth_largest(nums, k):",
            "    target ← len(nums) - k; lo ← 0; hi ← len(nums) - 1",
            "    while lo <= hi:",
            "        swap(nums, random_int(lo, hi), hi)",
            "        p ← lomuto_partition(nums, lo, hi)",
            "        if p == target: return nums[p]",
            "        if p < target: lo ← p + 1",
            "        else: hi ← p - 1",
          ],
          activeLines: [4, 6, 7, 8],
          output: "kth_largest([3, 2, 1, 5, 6, 4], 2) -> 5 in O(n) expected time",
        },
        {
          label: "Step 3: Add 3-way partition for heavy-duplicate arrays",
          explanation: "Grouping `< pivot`, `== pivot`, and `> pivot` exits early whenever `lt <= target <= gt`, avoiding `O(n^2)` on `[5, 5, ..., 5]`.",
          code: [
            "[lt, gt] ← three_way_partition(nums, lo, hi)",
            "if target < lt: hi ← lt - 1",
            "else if target > gt: lo ← gt + 1",
            "else: return nums[target]   // landed inside equal band!",
          ],
          activeLines: [4],
          output: "[5, 5, 5, 5, 5] finishes in one O(n) pass",
        },
      ],
    },
    walkthrough: {
      title: "Trace iterative Quickselect finding the 2nd largest element in [3, 2, 1, 5, 6, 4]",
      layout: "visual-first",
      steps: [
        {
          title: "Convert k = 2 largest to ascending target index n - k = 4",
          tag: "CONCEPT",
          explanation: [
            "We want the `2`-nd largest element of `nums = [3, 2, 1, 5, 6, 4]` (`n = 6`).",
            "In sorted order `[1, 2, 3, 4, 5, 6]`, the `2`-nd largest sits at ascending index `target = 6 - 2 = 4`.",
          ],
          code: [
            "function quickselect_kth_largest(nums, k):",
            "    target ← len(nums) - k",
            "    lo ← 0, hi ← len(nums) - 1",
            "    while lo <= hi:",
            "        p ← partition(nums, lo, hi)",
            "        if p == target: return nums[p]",
            "        else if p < target: lo ← p + 1",
            "        else: hi ← p - 1",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode · Quickselect",
          state: [
            { name: "n, k", value: "6, 2 -> target = 4", changed: true },
            { name: "[lo, hi]", value: "[0, 5]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Unsorted array (searching for sorted index [4])",
                cells: [
                  { id: "q0", value: "3", index: 0, state: "default" },
                  { id: "q1", value: "2", index: 1, state: "default" },
                  { id: "q2", value: "1", index: 2, state: "default" },
                  { id: "q3", value: "5", index: 3, state: "default" },
                  { id: "q4", value: "6", index: 4, state: "default" },
                  { id: "q5", value: "4", index: 5, state: "default" },
                ],
                highlightRange: [0, 5],
                pointers: [
                  { index: 0, label: "lo=0", tone: "accent" },
                  { index: 4, label: "target=4", tone: "ok" },
                  { index: 5, label: "hi=5", tone: "coral" },
                ],
              },
            ],
          },
        },
        {
          title: "Partition around pivot 4 -> lands at p = 3 (< target 4)",
          tag: "TRACE",
          explanation: [
            "Lomuto partition around `pivot = 4` moves `<= 4` (`3, 2, 1`) left and `> 4` (`5, 6`) right, landing `4` at final sorted index `p = 3`.",
            "Because `p = 3 < target = 4`, indices `0..3` are permanently too small! We discard all `4` elements on the left with zero sorting.",
          ],
          code: [
            "function quickselect_kth_largest(nums, k):",
            "    target ← len(nums) - k",
            "    lo ← 0, hi ← len(nums) - 1",
            "    while lo <= hi:",
            "        p ← partition(nums, lo, hi)",
            "        if p == target: return nums[p]",
            "        else if p < target: lo ← p + 1",
            "        else: hi ← p - 1",
          ],
          activeLines: [5, 7],
          codeLabel: "Pseudocode · Quickselect",
          state: [
            { name: "pivot = 4", value: "landed at p = 3", changed: true },
            { name: "Comparison", value: "p (3) < target (4)", changed: true },
            { name: "Next window", value: "lo = 4, hi = 5", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After partition around 4 -> discard [0..3] forever!",
                cells: [
                  { id: "q0", value: "3", index: 0, state: "dim" },
                  { id: "q1", value: "2", index: 1, state: "dim" },
                  { id: "q2", value: "1", index: 2, state: "dim" },
                  { id: "q5", value: "4", index: 3, state: "pivot" },
                  { id: "q4", value: "6", index: 4, state: "active" },
                  { id: "q3", value: "5", index: 5, state: "active" },
                ],
                highlightRange: [4, 5],
                pointers: [
                  { index: 3, label: "p=3", tone: "coral" },
                  { index: 4, label: "new lo=4", tone: "ok" },
                  { index: 5, label: "hi=5", tone: "accent" },
                ],
              },
            ],
          },
        },
        {
          title: "Narrow to [4..5]: partition [6, 5] around pivot 5",
          tag: "TRACE",
          explanation: [
            "Now `lo = 4, hi = 5`, holding only `[6, 5]`. Notice elements `[3, 2, 1, 4]` stayed untouched and never wasted another comparison.",
            "Partitioning `[6, 5]` around `pivot = 5` swaps `5` and `6`, placing `5` at `p = 4`.",
          ],
          code: [
            "function quickselect_kth_largest(nums, k):",
            "    target ← len(nums) - k",
            "    lo ← 0, hi ← len(nums) - 1",
            "    while lo <= hi:",
            "        p ← partition(nums, lo, hi)",
            "        if p == target: return nums[p]",
            "        else if p < target: lo ← p + 1",
            "        else: hi ← p - 1",
          ],
          activeLines: [5, 6],
          codeLabel: "Pseudocode · Quickselect",
          state: [
            { name: "Subrange", value: "[6, 5] at [4..5]" },
            { name: "pivot = 5", value: "swapped into p = 4", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Partition [4..5] places pivot 5 at index [4]",
                cells: [
                  { id: "q0", value: "3", index: 0, state: "dim" },
                  { id: "q1", value: "2", index: 1, state: "dim" },
                  { id: "q2", value: "1", index: 2, state: "dim" },
                  { id: "q5", value: "4", index: 3, state: "dim" },
                  { id: "q3", value: "5", index: 4, state: "active" },
                  { id: "q4", value: "6", index: 5, state: "done" },
                ],
                highlightRange: [4, 4],
                pointers: [
                  { index: 4, label: "p=4 == target!", tone: "ok" },
                ],
              },
            ],
          },
        },
        {
          title: "Hit p == target (4): return 5 without sorting the rest",
          tag: "CHECK",
          explanation: [
            "`p = 4 == target = 4`, so Quickselect immediately returns `nums[4] = 5`!",
            "Total element visits were `6 + 2 = 8` (roughly `n`), never sorting `[3, 2, 1]` at all.",
          ],
          code: [
            "function quickselect_kth_largest(nums, k):",
            "    target ← len(nums) - k",
            "    lo ← 0, hi ← len(nums) - 1",
            "    while lo <= hi:",
            "        p ← partition(nums, lo, hi)",
            "        if p == target: return nums[p]",
            "        else if p < target: lo ← p + 1",
            "        else: hi ← p - 1",
          ],
          activeLines: [6],
          codeLabel: "Pseudocode · Quickselect",
          state: [
            { name: "Returned", value: "5 (2nd largest)", changed: true },
            { name: "Avg Time", value: "O(n) total" },
            { name: "Extra Space", value: "O(1)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Final array state: nums[4] = 5 verified in O(n) expected time",
                cells: [
                  { id: "q0", value: "3", index: 0, state: "dim" },
                  { id: "q1", value: "2", index: 1, state: "dim" },
                  { id: "q2", value: "1", index: 2, state: "dim" },
                  { id: "q5", value: "4", index: 3, state: "dim" },
                  { id: "q3", value: "5", index: 4, state: "done" },
                  { id: "q4", value: "6", index: 5, state: "dim" },
                ],
                pointers: [
                  { index: 4, label: "ans = 5", tone: "ok" },
                ],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Confusing k-th smallest vs k-th largest target index",
        detail: "In 0-indexed ascending order, k-th smallest sits at target = k - 1 while k-th largest sits at target = len(nums) - k.",
      },
      {
        title: "Skipping pivot randomization",
        detail: "Always picking the last element on a pre-sorted array forces O(n^2) partitions; pick random_int(lo, hi) first.",
      },
      {
        title: "Mutating arrays shared by other callers",
        detail: "In-place partitioning reorders elements in the input buffer; copy first if the caller needs the original order preserved.",
      },
    ],
    predictChecks: [
      {
        prompt: "You partition 1,000,000 items so pivot lands at p = 500,000, while searching for target = 99. How much work remains?",
        code: "if p == target: return nums[p]\nelse if p < target: lo ← p + 1\nelse: hi ← p - 1",
        options: [
          { id: "a", label: "Quickselect must still sort both halves (500,000 each) before answering" },
          { id: "b", label: "Only the left half [0..499,999] needs partitioning next; the right half is discarded completely" },
          { id: "c", label: "One more swap solves the problem in O(1) immediately" },
        ],
        correctId: "b",
        explanation: "Every element right of index 500,000 is >= arr[500,000], so index 99 cannot lie there; discarding one half yields O(n) expected work.",
      },
      {
        prompt: "Why does iterative Quickselect beat full sorting on auxiliary memory?",
        code: "while lo <= hi:\n    p ← partition(nums, lo, hi)\n    if p < target: lo ← p + 1\n    else: hi ← p - 1",
        options: [
          { id: "a", label: "Iterative Quickselect swaps in-place with only O(1) scalar variables" },
          { id: "b", label: "Quickselect avoids comparing any array elements" },
          { id: "c", label: "Quickselect guarantees O(1) runtime on all inputs" },
        ],
        correctId: "a",
        explanation: "Because only one side continues each step, a while loop eliminates recursion frames and achieves O(1) extra space.",
      },
    ],
    practiceTask: {
      title: "Iterative K-th Smallest Element (Quickselect)",
      tier: "Warmup",
      goal: "Given an integer array `nums` and `k` (`1 <= k <= len(nums)`), return the `k`-th smallest value (`target = k - 1`) in `O(n)` expected time and `O(1)` extra space.",
      constraints: ["1 <= k <= len(nums) <= 10^5", "Target: O(n) expected time, O(1) space"],
      examples: [
        { input: "nums = [7, 10, 4, 3, 20, 15], k = 3", output: "7", explanation: "Sorted: [3, 4, 7, 10, 15, 20]; 3rd smallest is 7." },
        { input: "nums = [9], k = 1", output: "9" },
      ],
      tasks: [
        "Set `target = k - 1`, `lo = 0`, `hi = len(nums) - 1`.",
        "Randomize pivot in `[lo, hi]`, run Lomuto partition, and narrow either `lo = p + 1` or `hi = p - 1` until `p == target`.",
      ],
      starterCode: "function kth_smallest(nums, k):\n    // TODO: iterative Quickselect targeting index k - 1\n    return ans",
      expectedOutput: "7\n9",
      hint: "Carefully distinguish `target = k - 1` (k-th smallest) from `target = len(nums) - k` (k-th largest).",
      complexity: { time: "O(n) expected", space: "O(1)" },
      solutionCode:
        "function kth_smallest(nums, k):\n    target ← k - 1\n    lo ← 0, hi ← len(nums) - 1\n    while lo <= hi:\n        r ← random_int(lo, hi)\n        swap(nums, r, hi)\n        pivot ← nums[hi]\n        store ← lo\n        for i from lo to hi - 1:\n            if nums[i] <= pivot:\n                swap(nums, store, i)\n                store ← store + 1\n        swap(nums, store, hi)\n        if store == target: return nums[store]\n        if store < target: lo ← store + 1\n        else: hi ← store - 1\n    return -1",
    },
    practiceChallenges: [
      {
        title: "Iterative K-th Smallest Element (Quickselect)",
        tier: "Warmup",
        goal: "Return the `k`-th smallest integer in `nums` in `O(n)` expected time and `O(1)` space.",
        constraints: ["1 <= k <= len(nums) <= 10^5", "Target: O(n) expected, O(1) space"],
        examples: [
          { input: "nums = [7, 10, 4, 3, 20, 15], k = 3", output: "7" },
          { input: "nums = [9], k = 1", output: "9" },
        ],
        tasks: ["Partition iteratively until pivot index equals `k - 1`."],
        starterCode: "function kth_smallest(nums, k):\n    // TODO: O(n) expected Quickselect for k - 1\n    return ans",
        expectedOutput: "7\n9",
        hint: "Randomizing pivot index keeps sorted inputs at `O(n)` expected time.",
        complexity: { time: "O(n) expected", space: "O(1)" },
        solutionCode:
          "function kth_smallest(nums, k):\n    target ← k - 1\n    lo ← 0, hi ← len(nums) - 1\n    while lo <= hi:\n        r ← random_int(lo, hi)\n        swap(nums, r, hi)\n        pivot ← nums[hi]\n        store ← lo\n        for i from lo to hi - 1:\n            if nums[i] <= pivot:\n                swap(nums, store, i)\n                store ← store + 1\n        swap(nums, store, hi)\n        if store == target: return nums[store]\n        if store < target: lo ← store + 1\n        else: hi ← store - 1\n    return -1",
      },
      {
        title: "Find K Closest Points to Origin via Quickselect",
        tier: "Core",
        goal: "Given 2D points `[x, y]` and `k`, partition points in-place around squared distance `x*x + y*y` so the first `k` elements `points[0..k-1]` are the `k` closest points to `(0, 0)` in `O(n)` expected time.",
        constraints: ["1 <= k <= len(points) <= 10^5", "-10^4 <= x, y <= 10^4", "Target: O(n) expected time, O(1) space"],
        examples: [
          { input: "points = [[3, 3], [5, -1], [-2, 4]], k = 2", output: "[[3, 3], [-2, 4]]", explanation: "Squared distances: 18, 26, 20 -> smallest two are 18 and 20." },
          { input: "points = [[1, 3], [-2, 2]], k = 1", output: "[[-2, 2]]" },
        ],
        tasks: [
          "Avoid floating-point `sqrt`; compare integer `dist2(p) = p[0]^2 + p[1]^2` directly.",
          "Run Quickselect targeting `target = k - 1`, then slice `points[0..k - 1]`.",
        ],
        starterCode: "function k_closest_origin(points, k):\n    // TODO: Quickselect by x^2 + y^2 and return first k points\n    return points[0..k - 1]",
        expectedOutput: "[[3, 3], [-2, 4]]\n[[-2, 2]]",
        hint: "Once element at index `k - 1` sits in sorted position, every point in `[0..k-1]` is guaranteed closer or equal to every point in `[k..n-1]`.",
        complexity: { time: "O(n) expected", space: "O(1)" },
        solutionCode:
          "function dist2(p): return p[0] * p[0] + p[1] * p[1]\n\nfunction k_closest_origin(points, k):\n    lo ← 0, hi ← len(points) - 1, target ← k - 1\n    while lo <= hi:\n        r ← random_int(lo, hi)\n        swap(points, r, hi)\n        p_dist ← dist2(points[hi])\n        store ← lo\n        for i from lo to hi - 1:\n            if dist2(points[i]) <= p_dist:\n                swap(points, store, i)\n                store ← store + 1\n        swap(points, store, hi)\n        if store == target: break\n        if store < target: lo ← store + 1\n        else: hi ← store - 1\n    return points[0..k - 1]",
      },
      {
        title: "Duplicate-Safe 3-Way Quickselect for Array Median",
        tier: "Stretch",
        goal: "Compute the lower median (`target = floor((n - 1) / 2)`) of an array that may contain thousands of identical numbers using 3-way Dutch National Flag Quickselect in `O(n)` expected time.",
        constraints: ["1 <= len(nums) <= 10^5", "Heavy duplicate arrays must not degrade to O(n^2)", "Target: O(n) expected time, O(1) space"],
        examples: [
          { input: "nums = [5, 5, 5, 1, 5, 5, 9]", output: "5" },
          { input: "nums = [8, 2, 4, 6]", output: "4", explanation: "n = 4 -> lower median index floor(3 / 2) = 1, sorted [2, 4, 6, 8] -> 4." },
        ],
        tasks: [
          "Partition `[lo..hi]` into `< p_val` (`lo..lt-1`), `== p_val` (`lt..gt`), and `> p_val` (`gt+1..hi`).",
          "If `lt <= target <= gt`, return `p_val` immediately; otherwise jump into `[lo..lt-1]` or `[gt+1..hi]`.",
        ],
        starterCode: "function quickselect_3way_median(nums):\n    // TODO: 3-way partition Quickselect for floor((n - 1) / 2)\n    return ans",
        expectedOutput: "5\n4",
        hint: "When all elements equal `p_val`, `lt == 0` and `gt == n - 1`, triggering an immediate `O(n)` single-pass return.",
        complexity: { time: "O(n) expected", space: "O(1)" },
        solutionCode:
          "function quickselect_3way_median(nums):\n    target ← floor((len(nums) - 1) / 2)\n    lo ← 0, hi ← len(nums) - 1\n    while lo <= hi:\n        p_val ← nums[random_int(lo, hi)]\n        lt ← lo, i ← lo, gt ← hi\n        while i <= gt:\n            if nums[i] < p_val:\n                swap(nums, lt, i)\n                lt ← lt + 1; i ← i + 1\n            else if nums[i] > p_val:\n                swap(nums, i, gt)\n                gt ← gt - 1\n            else:\n                i ← i + 1\n        if lt <= target and target <= gt: return p_val\n        if target < lt: hi ← lt - 1\n        else: lo ← gt + 1\n    return nums[lo]",
      },
    ],
  },
};

export const dsaM11PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m11",
  title: "Module 11 Practice Set: Sorting Algorithms",
  description:
    "Four mixed problems combining inversion counting, order-statistic selection, bounded-key bucketing, and multi-key custom ordering.",
  problems: [
    {
      id: "dsa-m11-p1",
      title: "Out-of-Order Pair Counter",
      patternHint: "Divide the array in half recursively and count `mid - i + 1` inversions whenever a right-half element merges before a left-half element (Lesson 11-2).",
      lessonRefId: "dsa-merge-sort",
      goal: "Given an integer sequence `ratings`, return how many index pairs `(i, j)` satisfy `i < j` and `ratings[i] > ratings[j]` within `n <= 10^5`.",
      constraints: ["1 <= len(ratings) <= 10^5", "-10^9 <= ratings[i] <= 10^9", "Target: O(n log n) time, O(n) space"],
      examples: [
        { input: "ratings = [8, 3, 5, 2]", output: "5" },
        { input: "ratings = [2, 4, 1, 3, 5]", output: "3", explanation: "Pairs (2,1), (4,1), and (4,3)." },
      ],
      tasks: [
        "Avoid the `O(n²)` nested pair loop.",
        "Hook into the two-pointer merge step of Merge Sort and add `mid - i + 1` whenever `ratings[j] < ratings[i]`.",
      ],
      starterCode: "function out_of_order_pairs(ratings):\n    // TODO: O(n log n) pair counting\n    return total",
      expectedOutput: "5\n3",
      hint: "Keep `ratings[i] <= ratings[j]` so equal ratings do not add false inversions.",
      complexity: { time: "O(n log n)", space: "O(n)" },
      solutionCode:
        "function out_of_order_pairs(ratings):\n    buf ← array of size len(ratings)\n    function solve(lo, hi):\n        if lo >= hi: return 0\n        mid ← lo + floor((hi - lo) / 2)\n        total ← solve(lo, mid) + solve(mid + 1, hi)\n        i ← lo, j ← mid + 1, k ← lo\n        while i <= mid and j <= hi:\n            if ratings[i] <= ratings[j]:\n                buf[k] ← ratings[i]; i ← i + 1\n            else:\n                buf[k] ← ratings[j]; j ← j + 1\n                total ← total + (mid - i + 1)\n            k ← k + 1\n        while i <= mid: buf[k] ← ratings[i]; i ← i + 1; k ← k + 1\n        while j <= hi: buf[k] ← ratings[j]; j ← j + 1; k ← k + 1\n        for idx from lo to hi: ratings[idx] ← buf[idx]\n        return total\n    return solve(0, len(ratings) - 1)",
    },
    {
      id: "dsa-m11-p2",
      title: "Median Latency Sensor Check",
      patternHint: "Use iterative randomized Quickselect to locate the middle sorted index `floor((n - 1) / 2)` in `O(n)` expected time without sorting the entire array (Lesson 11-3).",
      lessonRefId: "dsa-quick-sort",
      goal: "Given an unsorted array of `n` latency readings (where `n` is odd), find the exact lower-median reading (`floor((n - 1) / 2)`-th smallest) in `O(n)` expected time and `O(1)` extra space.",
      constraints: ["1 <= len(latencies) <= 10^5 (odd)", "0 <= latencies[i] <= 10^9", "Target: O(n) expected time, O(1) space"],
      examples: [
        { input: "latencies = [42, 7, 19, 3, 25]", output: "19", explanation: "Sorted readings are [3, 7, 19, 25, 42]; index 2 is 19." },
        { input: "latencies = [10]", output: "10" },
      ],
      tasks: [
        "Set `target = floor((len(latencies) - 1) / 2)`.",
        "Repeatedly partition around a random pivot in `[lo..hi]` and discard the half that cannot contain `target`.",
      ],
      starterCode: "function find_median_latency(latencies):\n    // TODO: O(n) expected time, O(1) space selection\n    return ans",
      expectedOutput: "19\n10",
      hint: "After partitioning into index `p`, return `latencies[p]` when `p == target`, move `lo = p + 1` if `p < target`, or move `hi = p - 1`.",
      complexity: { time: "O(n) expected", space: "O(1)" },
      solutionCode:
        "function find_median_latency(latencies):\n    target ← floor((len(latencies) - 1) / 2)\n    lo ← 0, hi ← len(latencies) - 1\n    while lo <= hi:\n        r ← random_int(lo, hi)\n        swap(latencies, r, hi)\n        pivot ← latencies[hi]\n        store ← lo\n        for i from lo to hi - 1:\n            if latencies[i] <= pivot:\n                swap(latencies, store, i)\n                store ← store + 1\n        swap(latencies, store, hi)\n        if store == target: return latencies[store]\n        if store < target: lo ← store + 1\n        else: hi ← store - 1\n    return -1",
    },
    {
      id: "dsa-m11-p3",
      title: "Maximum Consecutive Gap in Sensor Readings",
      patternHint: "Sort 32-bit non-negative integers in linear `O(d * (n + B))` time using LSD Radix Sort, then scan adjacent differences in one pass (Lesson 11-4).",
      lessonRefId: "dsa-linear-sorts",
      goal: "Given an unsorted array of non-negative integers `readings`, return the largest difference between two successive elements once sorted (`0` if fewer than `2` elements) in linear time.",
      constraints: ["1 <= len(readings) <= 10^5", "0 <= readings[i] <= 10^9", "Target: linear O(d * (n + 10)) or O(n) time"],
      examples: [
        { input: "readings = [3, 6, 9, 1]", output: "3", explanation: "Sorted [1, 3, 6, 9] has gaps 2, 3, 3 -> max is 3." },
        { input: "readings = [10]", output: "0" },
      ],
      tasks: [
        "Return `0` immediately if `len(readings) < 2`.",
        "Sort `readings` in linear time with base-10 LSD Radix Sort, then take `max(readings[i] - readings[i - 1])`.",
      ],
      starterCode: "function max_sorted_gap(readings):\n    // TODO: linear-time sort + single-pass gap scan\n    return best",
      expectedOutput: "3\n0",
      hint: "Base-10 LSD Radix Sort needs at most `10` passes for numbers up to `10^9`.",
      complexity: { time: "O(d * (n + 10))", space: "O(n + 10)" },
      solutionCode:
        "function max_sorted_gap(readings):\n    if len(readings) < 2: return 0\n    max_val ← max(readings)\n    exp ← 1\n    while floor(max_val / exp) > 0:\n        counts ← array of 10 zeros\n        for x in readings:\n            d ← floor(x / exp) mod 10\n            counts[d] ← counts[d] + 1\n        for d from 1 to 9:\n            counts[d] ← counts[d] + counts[d - 1]\n        out ← array of size len(readings)\n        for i from len(readings) - 1 down to 0:\n            d ← floor(readings[i] / exp) mod 10\n            counts[d] ← counts[d] - 1\n            out[counts[d]] ← readings[i]\n        readings ← out\n        exp ← exp * 10\n    best ← 0\n    for i from 1 to len(readings) - 1:\n        best ← max(best, readings[i] - readings[i - 1])\n    return best",
    },
    {
      id: "dsa-m11-p4",
      title: "Merge Overlapping Meeting Windows",
      patternHint: "Sort intervals by `(start ASC, end ASC)` first, then merge each next interval into `merged[-1]` whenever `next_start <= last_end` (Lessons 11-1 & 11-4).",
      lessonRefId: "dsa-linear-sorts",
      goal: "Given a list of meeting intervals `[start, end]`, combine all overlapping intervals and return the merged list sorted by start time.",
      constraints: ["1 <= len(intervals) <= 10^4", "0 <= start <= end <= 10^4", "Target: O(n log n) time (or O(n) if nearly sorted)"],
      examples: [
        { input: "intervals = [[1, 3], [8, 10], [2, 6], [15, 18]]", output: "[[1, 6], [8, 10], [15, 18]]" },
        { input: "intervals = [[1, 4], [4, 5]]", output: "[[1, 5]]", explanation: "Touching endpoints [1, 4] and [4, 5] merge into [1, 5]." },
      ],
      tasks: [
        "Sort `intervals` by custom key `(interval[0], interval[1])`.",
        "Initialize `merged = [intervals[0]]`; for each remaining `[s, e]`, if `s <= merged[-1][1]`, set `merged[-1][1] = max(merged[-1][1], e)`, else append `[s, e]`.",
      ],
      starterCode: "function merge_meetings(intervals):\n    // TODO: sort by start time then sweep once\n    return merged",
      expectedOutput: "[[1, 6], [8, 10], [15, 18]]\n[[1, 5]]",
      hint: "Sorting by `start` places any interval that overlaps `merged[-1]` immediately next in the scan.",
      complexity: { time: "O(n log n)", space: "O(n)" },
      solutionCode:
        "function merge_meetings(intervals):\n    sort intervals by key (interval[0], interval[1])\n    merged ← [intervals[0]]\n    for i from 1 to len(intervals) - 1:\n        s ← intervals[i][0]\n        e ← intervals[i][1]\n        if s <= merged[-1][1]:\n            merged[-1][1] ← max(merged[-1][1], e)\n        else:\n            merged.append([s, e])\n    return merged",
    },
  ],
};
