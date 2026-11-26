import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM03Lessons: Record<string, LessonContent> = {
  "dsa-static-arrays": {
    lessonId: "dsa-static-arrays",
    subtitle:
      "Understand contiguous array addressing (base + i * size), middle shifting costs, and single-pass array scans.",
    intro: {
      heading: "Static Arrays, Contiguous Access & Shifting",
      explanation: [
        "Insert `99` at index `1` by looping forward (`for i = 1 to size - 1: arr[i + 1] = arr[i]`) and every trailing element gets overwritten by `29`—wiping out your array! Or initialize `first = 0, second = 0` to find the second largest item in `[-5, -1, -5, -3]` and it returns `0`, a number not even in the array.",
        "A **static array** stores fixed-width elements in one unbroken RAM block so `base + i * element_size` reads any index in `O(1)`. Keeping slots gap-free means middle inserts must shift right-to-left (`O(n)`), while single-pass scans track `null`-seeded variables to avoid sorting.",
      ],
      analogy:
        "Numbered theater seats in one unbroken row let you walk straight to seat #42 in one jump, whereas squeezing a latecomer into seat #2 forces everyone from seat #2 onward to slide down by one.",
      realWorldUses: [
        "Storing pixel rows, audio sample frames, and fixed-size sensor buffers for `O(1)` indexed reads",
        "Validating sorted order and tracking runner-up values in a single `O(n)` pass with `O(1)` extra space",
      ],
    },
    sections: [
      {
        heading: "Contiguous addressing vs shifting cost",
        paragraphs: [
          "Suppose an integer array starts at memory address `base = 0x200` with `4` bytes per integer. Index `3` lives at `0x200 + 3 * 4 = 0x20C`, regardless of whether the array holds `5` items or `5,000,000` items.",
          "By contrast, inserting at index `k` or deleting index `k` cannot leave an empty hole in the middle of a contiguous block. Up to `n - k` elements must move one slot over, making middle modifications `O(n)` in the worst case.",
        ],
        code: [
          "// Broken forward insert at idx=1 on [14, 29, 8, 41, _]:",
          "for i from 1 to 3: arr[i + 1] = arr[i]   // Copies 29 into slots 2, 3, 4 -> [14, 99, 29, 29, 29]!",
          "// Working backward insert (size - 1 down to idx):",
          "for i from 3 down to 1: arr[i + 1] = arr[i]  // [14, 99, 29, 8, 41]",
        ],
        output: "Forward shift (broken): [14, 99, 29, 29, 29] | Backward shift: [14, 99, 29, 8, 41]",
        table: {
          caption: "Static array operation costs (capacity N, current size n)",
          headers: ["Operation", "Time", "Extra Space", "Why"],
          rows: [
            ["Read or overwrite `arr[i]`", "`O(1)`", "`O(1)`", "Direct offset `base + i * size`"],
            ["Append/pop at end (`size < N`)", "`O(1)`", "`O(1)`", "Touches only slot `n` or `n - 1`"],
            ["Insert/delete at index `k`", "`O(n)`", "`O(1)`", "Shifts up to `n - k` trailing elements"],
            ["Check if sorted", "`O(n)`", "`O(1)`", "Compares adjacent pairs `arr[i]` and `arr[i + 1]`"],
            ["Second largest (single pass)", "`O(n)`", "`O(1)`", "Maintains two scalar variables (`first`, `second`)"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Random access is `O(1)` precisely because elements sit contiguously at predictable offsets. Maintaining that gap-free layout is what makes middle inserts and deletes cost `O(n)` shifts.",
        },
      },
      {
        heading: "Single-pass scans without sorting",
        paragraphs: [
          "Sorting an array to check order or find the second largest item wastes time (`O(n log n)`, covered in Module 11, or `O(n^2)` with nested scans). Checking if an array is non-decreasing needs only one loop from `0` to `n - 2` checking `arr[i] <= arr[i + 1]`.",
          "Finding the distinct second largest element also finishes in one `O(n)` pass by updating two scalar variables (`first` and `second`) seeded to `null` while guarding `x < first` so duplicates like `[10, 10, 4]` return `4`.",
        ],
        callout: {
          kind: "WATCH OUT",
          text: "When computing the distinct second largest value, skip elements equal to `first` (for example, `[10, 10, 4]` has distinct second largest `4`, not `10`), and avoid initializing variables to `0` when inputs can contain negative numbers.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Fix Array Shift Direction and Build Null-Seeded Runner-Up Scan",
      subtitle: "Prevent forward overwrite bugs and negative-input sentinel errors in static arrays.",
      steps: [
        {
          label: "Step 1: Broken forward insert (clobbers trailing values)",
          explanation: "Moving `i` left-to-right copies `arr[idx]` forward into every remaining slot.",
          code: [
            "function insert_broken(arr, size, idx, val):",
            "    for i from idx to size - 1:",
            "        arr[i + 1] ← arr[i]   // BUG: overwrites unread arr[i+1]",
            "    arr[idx] ← val",
          ],
          activeLines: [2, 3],
          output: "[14, 29, 8, 41, _] -> [14, 99, 29, 29, 29]",
        },
        {
          label: "Step 2: Shift right-to-left (size - 1 down to idx)",
          explanation: "Moving `i` backward vacates each slot before the element to its left moves into it.",
          code: [
            "function insert_at(arr, size, idx, val):",
            "    for i from size - 1 down to idx:",
            "        arr[i + 1] ← arr[i]",
            "    arr[idx] ← val",
            "    return size + 1",
          ],
          activeLines: [2, 3, 4],
          output: "[14, 99, 29, 8, 41], size=5",
        },
        {
          label: "Step 3: One-pass distinct second largest with null sentinels",
          explanation: "Seeding `first` and `second` as `null` handles negatives like `[-5, -1, -5, -3]`, and `x < first` skips duplicate peaks.",
          code: [
            "function second_largest(nums):",
            "    first ← null, second ← null",
            "    for each x in nums:",
            "        if first == null or x > first:",
            "            second ← first; first ← x",
            "        else if x < first and (second == null or x > second):",
            "            second ← x",
            "    return second",
          ],
          activeLines: [4, 5, 6, 7],
          output: "[-5, -1, -5, -3] -> -3 | [7, 7] -> null",
        },
      ],
    },
    walkthrough: {
      title: "Address arithmetic, shifting, and single-pass scans",
      layout: "visual-first",
      steps: [
        {
          title: "Jump to any index in O(1) via base + i * size",
          tag: "MEMORY",
          explanation: [
            "With `base = 0x200` and `4`-byte integers, index `3` sits at `0x200 + 3 * 4 = 0x20C`.",
            "The CPU computes one multiplication and one addition, jumping directly to `41` without scanning indices `0`, `1`, or `2`.",
          ],
          code: [
            "// base = 0x200, size = 4 bytes",
            "addr ← base + 3 * 4   // 0x20C",
            "val ← read_mem(addr)  // 41 in O(1)",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Formula", value: "0x200 + 3 * 4 = 0x20C" },
            { name: "arr[3]", value: "41", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Contiguous 4-byte slots (size = 4, capacity = 5)",
                cells: [
                  { id: "s0", value: "14", index: 0 },
                  { id: "s1", value: "29", index: 1 },
                  { id: "s2", value: "8", index: 2 },
                  { id: "s3", value: "41", index: 3, state: "active" },
                  { id: "s4", value: "_", index: 4, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "base (0x200)", tone: "accent" },
                  { index: 3, label: "0x20C -> 41", tone: "coral" },
                ],
              },
            ],
            caption: "Contiguous layout lets arr[i] resolve in one address calculation.",
          },
        },
        {
          title: "Middle insert shifts trailing items right-to-left",
          tag: "TRACE",
          explanation: [
            "To insert `99` at index `1` (`size = 4`, `capacity = 5`), loop backwards from `i = size - 1` down to `1` and copy `arr[i]` to `arr[i + 1]`.",
            "Looping right-to-left preserves every value before it is overwritten; forward looping would overwrite index `2` with `29` repeatedly.",
          ],
          code: [
            "insert_at(arr, size, idx, val):",
            "    for i from size - 1 down to idx:",
            "        arr[i + 1] ← arr[i]",
            "    arr[idx] ← val",
            "    return size + 1",
          ],
          activeLines: [2, 3, 4, 5],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "def insert_at(arr, size, idx, val):",
              "    for i in range(size - 1, idx - 1, -1):",
              "        arr[i + 1] = arr[i]",
              "    arr[idx] = val",
              "    return size + 1",
            ],
            activeLines: [2, 3, 4, 5],
          },
          state: [
            { name: "Shifted count", value: "3 elements (41, 8, 29)" },
            { name: "arr[1]", value: "99", changed: true },
            { name: "size", value: "5", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After insert_at(idx = 1, val = 99)",
                cells: [
                  { id: "s0", value: "14", index: 0 },
                  { id: "s_new", value: "99", index: 1, state: "active" },
                  { id: "s1", value: "29", index: 2, state: "done" },
                  { id: "s2", value: "8", index: 3, state: "done" },
                  { id: "s3", value: "41", index: 4, state: "done" },
                ],
                pointers: [
                  { index: 1, label: "inserted", tone: "coral" },
                  { index: 4, label: "shifted right", tone: "ok" },
                ],
                highlightRange: [2, 4],
              },
            ],
            caption: "Elements 29, 8, and 41 slide right one slot to open index 1.",
          },
        },
        {
          title: "Middle delete shifts trailing items left-to-right",
          tag: "PITFALL",
          explanation: [
            "Deleting index `2` (`29`) copies `arr[i + 1]` into `arr[i]` from `i = 2` up to `size - 2`, then decrements `size` to `4`.",
            "Slot `4` still holds stale bytes in RAM until overwritten, so tracking `size` separates live items from unused capacity.",
          ],
          code: [
            "delete_at(arr, size, idx):",
            "    for i from idx to size - 2:",
            "        arr[i] ← arr[i + 1]",
            "    return size - 1",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "def delete_at(arr, size, idx):",
              "    for i in range(idx, size - 1):",
              "        arr[i] = arr[i + 1]",
              "    return size - 1",
            ],
            activeLines: [2, 3, 4],
          },
          state: [
            { name: "Removed", value: "29 at idx 2" },
            { name: "size", value: "4", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After delete_at(idx = 2)",
                cells: [
                  { id: "s0", value: "14", index: 0 },
                  { id: "s_new", value: "99", index: 1 },
                  { id: "s2", value: "8", index: 2, state: "active" },
                  { id: "s3", value: "41", index: 3, state: "active" },
                  { id: "s4", value: "41", index: 4, state: "dim" },
                ],
                pointers: [
                  { index: 2, label: "shifted left", tone: "accent" },
                  { index: 4, label: "stale (size=4)", tone: "coral" },
                ],
              },
            ],
            caption: "Deleting in the middle slides all trailing elements left in O(n) time.",
          },
        },
        {
          title: "Check sorted order with adjacent pair scan",
          tag: "PATTERN",
          explanation: [
            "Loop `i` from `0` to `n - 2` and compare `arr[i]` with `arr[i + 1]`. The moment `arr[i] > arr[i + 1]`, return `false` immediately.",
            "Here `[14, 99, 8, 41]` fails at `i = 1` because `99 > 8`, saving work on the rest of the array.",
          ],
          code: [
            "is_sorted(arr, n):",
            "    for i from 0 to n - 2:",
            "        if arr[i] > arr[i + 1]:",
            "            return false",
            "    return true",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "def is_sorted(arr):",
              "    for i in range(len(arr) - 1):",
              "        if arr[i] > arr[i + 1]:",
              "            return False",
              "    return True",
            ],
            activeLines: [2, 3, 4],
          },
          state: [
            { name: "i", value: "1" },
            { name: "Comparison", value: "99 > 8 (inversion)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Adjacent pair check at i = 1",
                cells: [
                  { id: "s0", value: "14", index: 0, state: "done" },
                  { id: "s_new", value: "99", index: 1, state: "pivot" },
                  { id: "s2", value: "8", index: 2, state: "active" },
                  { id: "s3", value: "41", index: 3, state: "dim" },
                ],
                pointers: [
                  { index: 1, label: "arr[i] = 99", tone: "coral" },
                  { index: 2, label: "arr[i+1] = 8", tone: "accent" },
                ],
              },
            ],
            caption: "One inversion (arr[i] > arr[i + 1]) proves the array is unsorted.",
          },
        },
        {
          title: "Find distinct second largest in one O(n) scan",
          tag: "TRACE",
          explanation: [
            "Scan `[14, 99, 99, 41]` once with `first` and `second`. When `x > first`, demote old `first` into `second` and set `first ← x`.",
            "When `x == 99 == first`, skip it! When `x = 41`, since `41 < first` and `41 > second` (`14`), update `second ← 41`.",
          ],
          code: [
            "second_largest(arr, n):",
            "    first ← null; second ← null",
            "    for each x in arr:",
            "        if first == null or x > first:",
            "            second ← first; first ← x",
            "        else if x < first and (second == null or x > second):",
            "            second ← x",
            "    return second",
          ],
          activeLines: [6, 7],
          codeLabel: "Pseudocode",
          state: [
            { name: "first", value: "99" },
            { name: "second", value: "41", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Single-pass runner-up scan on [14, 99, 99, 41]",
                cells: [
                  { id: "u0", value: "14", index: 0, state: "dim" },
                  { id: "u1", value: "99", index: 1, state: "done" },
                  { id: "u2", value: "99", index: 2, state: "dim" },
                  { id: "u3", value: "41", index: 3, state: "active" },
                ],
                pointers: [
                  { index: 1, label: "first = 99", tone: "ok" },
                  { index: 3, label: "second = 41", tone: "coral" },
                ],
              },
            ],
            caption: "Duplicate 99 is ignored so second tracks the largest value strictly below first.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Shifting in the wrong loop direction",
        detail:
          "Inserting at `idx` requires moving elements from `size - 1` down to `idx` so each value vacates its slot before the item on its left overwrites it. Deleting at `idx` goes the opposite way: `idx` up to `size - 2`.",
      },
      {
        title: "Off-by-one bounds on adjacent comparisons",
        detail:
          "Comparing `arr[i]` and `arr[i + 1]` must stop at `i = n - 2`. Running up to `n - 1` reads out of bounds at `arr[n]`. Arrays with `0` or `1` elements have zero adjacent pairs and are trivially sorted.",
      },
      {
        title: "Duplicate max values in second-largest scans",
        detail:
          "If `first` is `50` and you see another `50`, setting `second = 50` gives the wrong distinct runner-up. Explicitly check `x < first` before updating `second`.",
      },
    ],
    practiceTask: {
      title: "Check Non-Decreasing Order",
      tier: "Warmup",
      goal: "Given an integer array `nums`, return `true` if every element satisfies `nums[i] <= nums[i + 1]`, or `false` otherwise, in one `O(n)` pass.",
      constraints: ["0 <= len(nums) <= 10^5", "Target time: O(n)", "Extra space: O(1)"],
      examples: [
        { input: "nums = [2, 2, 5, 9]", output: "true", explanation: "Equal neighbors (2 <= 2) are valid in non-decreasing order." },
        { input: "nums = [3, 8, 7, 10]", output: "false", explanation: "8 > 7 breaks order at index 1." },
      ],
      tasks: [
        "Handle empty or 1-element arrays by returning `true`.",
        "Loop `i` from `0` to `len(nums) - 2` and return `false` as soon as `nums[i] > nums[i + 1]`.",
      ],
      starterCode: "function is_non_decreasing(nums):\n    // TODO: return true if sorted in non-decreasing order",
      expectedOutput: "true\nfalse",
      hint: "Stop the loop at `len(nums) - 2` so `nums[i + 1]` never goes out of bounds.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode: "function is_non_decreasing(nums):\n    for i from 0 to len(nums) - 2:\n        if nums[i] > nums[i + 1]:\n            return false\n    return true",
    },
    practiceChallenges: [
      {
        title: "Check Non-Decreasing Order",
        tier: "Warmup",
        goal: "Return `true` if `nums[i] <= nums[i + 1]` holds for every adjacent pair, else `false`.",
        constraints: ["0 <= len(nums) <= 10^5", "Target time: O(n)", "Extra space: O(1)"],
        examples: [
          { input: "nums = [2, 2, 5, 9]", output: "true" },
          { input: "nums = [3, 8, 7, 10]", output: "false" },
        ],
        tasks: ["Scan `i` from `0` to `n - 2` and return `false` on the first inversion."],
        starterCode: "function is_non_decreasing(nums):\n    // TODO: single-pass adjacent check",
        expectedOutput: "true\nfalse",
        hint: "Equal adjacent elements (`2 <= 2`) are allowed.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode: "function is_non_decreasing(nums):\n    for i from 0 to len(nums) - 2:\n        if nums[i] > nums[i + 1]:\n            return false\n    return true",
      },
      {
        title: "Fixed-Buffer Insert at Index",
        tier: "Core",
        goal: "Given a fixed-capacity buffer `buf` with `size` live items (`size < len(buf)`), insert `val` at `idx` (`0 <= idx <= size`) by shifting right in-place and returning the new `size`.",
        constraints: ["0 <= idx <= size < len(buf) <= 10^5", "Do not allocate another array", "Time: O(n), Extra space: O(1)"],
        examples: [
          { input: "buf = [10, 20, 30, 0, 0], size = 3, idx = 1, val = 15", output: "buf=[10, 15, 20, 30, 0], size=4" },
          { input: "buf = [5, 8, 12, 0], size = 3, idx = 0, val = 2", output: "buf=[2, 5, 8, 12], size=4", explanation: "Inserting at index 0 shifts all 3 existing elements right into the spare slot." },
        ],
        tasks: [
          "Shift elements right starting from `i = size - 1` down to `idx`.",
          "Write `buf[idx] = val` and return `size + 1`.",
        ],
        starterCode: "function static_insert(buf, size, idx, val):\n    // TODO: shift right-to-left and insert val",
        expectedOutput: "buf=[10, 15, 20, 30, 0], size=4\nbuf=[2, 5, 8, 12], size=4",
        hint: "Loop backwards (`size - 1` down to `idx`) so `buf[i + 1] = buf[i]` never overwrites unread items.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode: "function static_insert(buf, size, idx, val):\n    for i from size - 1 down to idx:\n        buf[i + 1] ← buf[i]\n    buf[idx] ← val\n    return size + 1",
      },
      {
        title: "Distinct Second Largest in One Pass",
        tier: "Stretch",
        goal: "Return the second largest distinct integer in `nums` in a single pass with `O(1)` extra space, or `null` if fewer than 2 distinct values exist.",
        constraints: ["0 <= len(nums) <= 10^5", "-10^9 <= nums[i] <= 10^9", "No sorting or extra arrays"],
        examples: [
          { input: "nums = [-5, -1, -5, -3]", output: "-3", explanation: "Distinct values are -1, -3, -5; runner-up is -3." },
          { input: "nums = [7, 7, 7]", output: "null" },
        ],
        tasks: [
          "Track `first` and `second` initialized to `null` so negative integers work without sentinel bugs.",
          "When `x > first`, shift `first` into `second`; when `x < first`, update `second` if `second` is `null` or `x > second`.",
        ],
        starterCode: "function second_largest(nums):\n    // TODO: single pass returning distinct runner-up or null",
        expectedOutput: "-3\nnull",
        hint: "Using `null` instead of `-infinity` or `0` avoids sentinel bugs for arbitrary integers.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode: "function second_largest(nums):\n    first ← null\n    second ← null\n    for each x in nums:\n        if first == null or x > first:\n            second ← first\n            first ← x\n        else if x < first and (second == null or x > second):\n            second ← x\n    return second",
      },
    ],
  },

  "dsa-dynamic-arrays": {
    lessonId: "dsa-dynamic-arrays",
    subtitle:
      "See how dynamic arrays separate size from capacity, why 2x doubling yields O(1) amortized append, and why front operations stay O(n).",
    intro: {
      heading: "Dynamic Arrays & Amortized Resizing",
      explanation: [
        "Grow a dynamic buffer by `+1` slot per append and `100,000` pushes perform `~5 × 10^9` element copies (`O(n^2)` TLE). Even with a built-in dynamic array, draining `100,000` items with `while arr: arr.pop(0)` shifts `~5 × 10^9` elements and freezes—even though `append` and `pop()` at the back run in `O(1)` amortized time.",
        "A **dynamic array** wraps a contiguous buffer with two counters: **size** (live items) and **capacity** (allocated slots). Doubling capacity (`2 * capacity`) when `size == capacity` spreads rare `O(n)` copies over many `O(1)` writes so total copies across `n` appends stay under `n`.",
      ],
      analogy:
        "Upgrading to a binder with double the ring capacity whenever it fills up keeps almost every page insertion to one click; copies happen so rarely that the average time per page stays small.",
      realWorldUses: [
        "Appending streaming results (`list.append`, `push_back`) when total input size is unknown in advance",
        "Preventing accidental `O(n^2)` bottlenecks caused by calling `pop(0)` or `insert(0, x)` inside loops",
      ],
    },
    sections: [
      {
        heading: "Capacity vs size and why 2x beats +1",
        paragraphs: [
          "Suppose you grow capacity by `+1` slot each time the array fills up across `n` pushes. Copies happen on every push: `1 + 2 + 3 + ... + (n - 1) = n(n - 1)/2`, which is `O(n^2)` total work (`2,016` copies for `n = 64`).",
          "Doubling capacity (`1 -> 2 -> 4 -> 8 -> ... -> 64`) copies items only at powers of `2`. Across `n = 64` pushes, total copies equal `1 + 2 + 4 + 8 + 16 + 32 = 63 < n`, so `n` appends cost `< 2n` total operations (`O(1)` amortized per append).",
        ],
        code: [
          "// +1 resize at n = 64: 1 + 2 + ... + 63 = 2016 copies (O(n^2))",
          "// 2x resize at n = 64: 1 + 2 + 4 + 8 + 16 + 32 = 63 copies (O(n) -> O(1) amortized)",
          "// Front removal vs write-index compaction on n = 10^5:",
          "while len(arr) > 0: arr.pop(0)   // O(n^2) shifts -> TLE!",
          "for r in 0..n-1: if keep: arr[w++] = arr[r]  // O(n) single pass",
        ],
        output: "64 appends -> +1 policy: 2016 copies | 2x policy: 63 copies",
        table: {
          caption: "Growth strategies and endpoint operations on dynamic arrays",
          headers: ["Operation / Policy", "Worst-case 1 call", "Total for n calls", "Amortized per call"],
          rows: [
            ["Append with `+1` growth", "`O(n)`", "`O(n^2)`", "`O(n)` (too slow)"],
            ["Append with `2x` doubling", "`O(n)` on resize", "`< 2n` (`O(n)`)", "`O(1)`"],
            ["Pop from back (`pop()`)", "`O(1)`", "`O(n)`", "`O(1)`"],
            ["Pop/insert at front (`pop(0)`)", "`O(n)`", "`O(n^2)`", "`O(n)` (never amortized `O(1)`)"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "RULE OF THUMB",
          text: "End operations (`append`, `pop()`) on a dynamic array are fast (`O(1)` amortized). Front operations (`insert(0, x)`, `pop(0)`) shift all remaining items every single time (`O(n)`).",
        },
        visual: {
          kind: "dsa-growth",
          n: 64,
          activeTier: "all",
          tiers: [
            { id: "const", label: "avg / push", name: "2x amortized", steps: 2 },
            { id: "linear", label: "< 2n", name: "2x total copies", steps: 63 },
            { id: "quad", label: "n(n-1)/2", name: "+1 total copies", steps: 2016 },
          ],
          caption: "2x doubling keeps total copies below n across 64 appends, whereas +1 resizing explodes quadratically.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build Amortized 2x Doubling With Thrash-Free Shrinking",
      subtitle: "Move from O(n^2) +1 resizing to 2x doubling and quarter-capacity shrink hysteresis.",
      steps: [
        {
          label: "Step 1: Naive +1 growth copies O(n^2) elements",
          explanation: "Growing by `capacity + 1` forces every existing item to be copied on every single push.",
          code: [
            "if size == capacity:",
            "    capacity ← capacity + 1",
            "    copies ← copies + size   // 1+2+...+(n-1) = O(n^2)",
          ],
          activeLines: [2, 3],
          output: "n=64 -> 2,016 copies",
        },
        {
          label: "Step 2: Double capacity (2x) when size == capacity",
          explanation: "Doubling capacity ensures `copies` stays strictly below `n` across `n` consecutive appends.",
          code: [
            "if size == capacity:",
            "    copies ← copies + size",
            "    capacity ← capacity * 2",
            "size ← size + 1",
          ],
          activeLines: [2, 3, 4],
          output: "n=64 -> 63 copies (< 1 copy/push)",
        },
        {
          label: "Step 3: Shrink at size <= floor(capacity / 4) to stop thrashing",
          explanation: "Halving only when a buffer drops to 25% full leaves 50% headroom after shrinking, preventing resize loops on alternating push/pop.",
          code: [
            "function pop_with_hysteresis():",
            "    if size == 0: return",
            "    size ← size - 1",
            "    if capacity > 1 and size <= floor(capacity / 4):",
            "        capacity ← floor(capacity / 2)",
            "        copies ← copies + size",
          ],
          activeLines: [4, 5, 6],
          output: "size=2, cap=8 -> shrinks to cap=4 (2 copies)",
        },
      ],
    },
    walkthrough: {
      title: "Inside a 2x resize vs front-pop shifting",
      layout: "visual-first",
      steps: [
        {
          title: "Buffer fills up: size equals capacity (2 of 2)",
          tag: "CONCEPT",
          explanation: [
            "Our dynamic array starts with `size = 2` and `capacity = 2`, holding `[10, 20]`.",
            "Every slot in the current contiguous block is occupied, so appending `30` cannot fit in place.",
          ],
          code: [
            "// Dynamic array state before append(30)",
            "size ← 2",
            "capacity ← 2",
            "buf ← [10, 20]",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "size", value: "2" },
            { name: "capacity", value: "2" },
            { name: "Total copies", value: "0" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Current buffer (size = 2, capacity = 2)",
                cells: [
                  { id: "d0", value: "10", index: 0, state: "done" },
                  { id: "d1", value: "20", index: 1, state: "done" },
                ],
                pointers: [{ index: 1, label: "full (size == cap)", tone: "coral" }],
              },
            ],
            caption: "When size reaches capacity, the next append triggers reallocation.",
          },
        },
        {
          title: "Allocate 2x capacity (4 slots) and copy existing items",
          tag: "MEMORY",
          explanation: [
            "Because `size == capacity`, allocate a new buffer of length `2 * 2 = 4`, then copy `10` and `20` into slots `0` and `1`.",
            "This step pays `2` copy operations (`O(size)`), leaving `2` spare slots ready for future appends.",
          ],
          code: [
            "if size == capacity:",
            "    new_cap ← capacity * 2",
            "    new_buf ← allocate(new_cap)",
            "    for i from 0 to size - 1: new_buf[i] ← buf[i]",
            "    buf ← new_buf; capacity ← new_cap",
          ],
          activeLines: [2, 3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "size", value: "2" },
            { name: "capacity", value: "4", changed: true },
            { name: "Total copies", value: "2", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Reallocated 2x buffer (size = 2, capacity = 4)",
                cells: [
                  { id: "d0", value: "10", index: 0, state: "active" },
                  { id: "d1", value: "20", index: 1, state: "active" },
                  { id: "d2", value: "_", index: 2, state: "dim" },
                  { id: "d3", value: "_", index: 3, state: "dim" },
                ],
                pointers: [
                  { index: 1, label: "copied 2 items", tone: "accent" },
                  { index: 2, label: "free slots", tone: "ok" },
                ],
              },
            ],
            caption: "Doubling capacity copies old items once and buys empty headroom.",
          },
        },
        {
          title: "Appends 30 and 40 land in O(1) with zero copies",
          tag: "TRACE",
          explanation: [
            "Write `30` into `buf[2]` (`size = 3`) and `40` into `buf[3]` (`size = 4`). Neither append triggers a resize.",
            "Across pushes `1..4`, only `1 + 2 = 3` total copies occurred, so average work per push stays constant.",
          ],
          code: [
            "append(30): buf[2] ← 30; size ← 3   // 0 copies",
            "append(40): buf[3] ← 40; size ← 4   // 0 copies",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "size", value: "4", changed: true },
            { name: "capacity", value: "4" },
            { name: "Copies on 30, 40", value: "0" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Buffer after appending 30 and 40 (size = 4, capacity = 4)",
                cells: [
                  { id: "d0", value: "10", index: 0, state: "done" },
                  { id: "d1", value: "20", index: 1, state: "done" },
                  { id: "d2", value: "30", index: 2, state: "active" },
                  { id: "d3", value: "40", index: 3, state: "active" },
                ],
                pointers: [
                  { index: 2, label: "O(1) write", tone: "ok" },
                  { index: 3, label: "O(1) write", tone: "ok" },
                ],
              },
            ],
            caption: "Spare capacity absorbs consecutive appends in a single write each.",
          },
        },
        {
          title: "Doubling keeps total copies linear across n pushes",
          tag: "CHECK",
          explanation: [
            "Compare total element copies after `n = 64` pushes: growing by `+1` copies `63 * 64 / 2 = 2,016` items (`O(n^2)`), while `2x` doubling copies `1 + 2 + 4 + 8 + 16 + 32 = 63` items (`O(n)`).",
            "Dividing `< 2n` total work by `n` pushes proves amortized `O(1)` per append.",
          ],
          code: [
            "// n = 64 appends:",
            "// +1 growth copies: 1 + 2 + ... + 63 = 2016  -> O(n^2)",
            "// 2x growth copies: 1 + 2 + 4 + 8 + 16 + 32 = 63 -> O(n)",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "n appends", value: "64" },
            { name: "+1 total copies", value: "2,016" },
            { name: "2x total copies", value: "63", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "2x doubling keeps total copies < 2n (32 + 16 + ... + 1 = 63 copies for n = 64)",
                cells: [
                  { id: "c1", value: "cap 1 -> 2", index: 0, state: "done" },
                  { id: "c2", value: "cap 2 -> 4", index: 1, state: "done" },
                  { id: "c3", value: "cap 4 -> 8", index: 2, state: "done" },
                  { id: "c4", value: "...", index: 3, state: "dim" },
                  { id: "c5", value: "cap 32 -> 64", index: 4, state: "active" },
                ],
                pointers: [
                  { index: 4, label: "63 total copies / 64 pushes < 1 copy/push!", tone: "ok" },
                ],
              },
            ],
            caption: "Each 2x resize copies all earlier elements, so across 64 appends the geometric sum is 63 (< n) vs 2,016 for +1 sizing.",
          },
        },
        {
          title: "Before pop(0): buffer holds [10, 20, 30, 40]",
          tag: "CONCEPT",
          explanation: [
            "Amortized `O(1)` applies only to the back of the array. Start with `[10, 20, 30, 40]` (`size = 4, capacity = 4`) before removing index `0`.",
            "Removing `10` at index `0` leaves a hole at the front that must be closed immediately by shifting.",
          ],
          code: [
            "pop_front(buf, size):",
            "    removed ← buf[0]   // 10",
            "    for i from 0 to size - 2: buf[i] ← buf[i + 1]  // O(n)",
            "    return removed",
          ],
          activeLines: [2],
          codeLabel: "Pseudocode",
          state: [
            { name: "Target", value: "buf[0] = 10", changed: true },
            { name: "Items to shift", value: "20, 30, 40 (3 items)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Before pop(0) (size = 4, capacity = 4)",
                cells: [
                  { id: "d0", value: "10", index: 0, state: "pivot" },
                  { id: "d1", value: "20", index: 1 },
                  { id: "d2", value: "30", index: 2 },
                  { id: "d3", value: "40", index: 3 },
                ],
                pointers: [
                  { index: 0, label: "remove buf[0]", tone: "coral" },
                ],
              },
            ],
            caption: "Removing index 0 forces every trailing element to slide left.",
          },
        },
        {
          title: "After pop(0): remaining items shift left in O(n)",
          tag: "PITFALL",
          explanation: [
            "Calling `pop(0)` removes `10` and forces `20`, `30`, and `40` to slide left one slot.",
            "Doing `pop(0)` inside an `n`-step loop shifts `(n - 1) + (n - 2) + ... + 1 = O(n^2)` elements.",
          ],
          callout: {
            kind: "WATCH OUT",
            text: "Never drain a dynamic array by repeatedly calling `pop(0)` in a loop. Walk an index `i` forward or pop from the back instead.",
          },
          code: [
            "pop_front(buf, size):",
            "    removed ← buf[0]",
            "    for i from 0 to size - 2: buf[i] ← buf[i + 1]  // O(n)",
            "    return removed",
          ],
          activeLines: [3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Removed", value: "10" },
            { name: "Remaining shifted", value: "20, 30, 40", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After pop(0): every remaining element slides left",
                cells: [
                  { id: "d1", value: "20", index: 0, state: "active" },
                  { id: "d2", value: "30", index: 1, state: "active" },
                  { id: "d3", value: "40", index: 2, state: "active" },
                  { id: "d_empty", value: "_", index: 3, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "shifted from 1..3", tone: "coral" },
                ],
                highlightRange: [0, 2],
              },
            ],
            caption: "Front removal shifts n - 1 elements on every single call.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Amortized O(1) does not mean worst-case O(1)",
        detail:
          "The average over `n` pushes is `O(1)`, but an individual push that hits `size == capacity` pauses for `O(n)` copying. Pre-allocate capacity when predictable latency matters.",
      },
      {
        title: "Repeated pop(0) or insert(0, x) silently creates O(n^2) loops",
        detail:
          "Because `pop(0)` looks like a single method call, beginners often write `while len(arr) > 0: arr.pop(0)`. On `n = 100,000`, that shifts `~5 * 10^9` slots and times out.",
      },
      {
        title: "Shrinking too eagerly causes thrashing",
        detail:
          "If a dynamic array halves capacity immediately when `size == capacity / 2`, alternating `append` and `pop` at that boundary resizes on every single call (`O(n)` per step). Shrinking only when `size <= capacity / 4` prevents thrashing.",
      },
    ],
    practiceTask: {
      title: "Count Total Reallocation Copies Across n Appends",
      tier: "Warmup",
      goal: "Starting from `size = 0` and `capacity = 1`, simulate appending `n` items where hitting `size == capacity` doubles `capacity` and copies all `size` existing items. Return `(final_capacity, total_copies)`.",
      constraints: ["0 <= n <= 10^6", "Target time: O(n) or O(log n)", "Extra space: O(1)"],
      examples: [
        { input: "n = 5", output: "(8, 7)", explanation: "Copies happen at sizes 1, 2, 4 -> 1 + 2 + 4 = 7; final capacity = 8." },
        { input: "n = 1", output: "(1, 0)", explanation: "Fits into initial capacity 1 with 0 copies." },
      ],
      tasks: [
        "Loop `step` from `1` to `n`: before writing into `size`, if `size == capacity`, add `size` to `total_copies` and double `capacity`.",
        "Increment `size` and return `(capacity, total_copies)`.",
      ],
      starterCode: "function count_resize_copies(n):\n    // TODO: simulate n appends starting at capacity = 1",
      expectedOutput: "(8, 7)\n(1, 0)",
      hint: "On push `k`, a resize only happens if `size == capacity` before adding the new element.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode: "function count_resize_copies(n):\n    size ← 0\n    capacity ← 1\n    copies ← 0\n    for k from 1 to n:\n        if size == capacity:\n            copies ← copies + size\n            capacity ← capacity * 2\n        size ← size + 1\n    return (capacity, copies)",
    },
    practiceChallenges: [
      {
        title: "Count Total Reallocation Copies Across n Appends",
        tier: "Warmup",
        goal: "Simulate `n` appends starting from `size = 0, capacity = 1` with `2x` doubling and return `(final_capacity, total_copies)`.",
        constraints: ["0 <= n <= 10^6", "Time: O(n)", "Space: O(1)"],
        examples: [
          { input: "n = 5", output: "(8, 7)" },
          { input: "n = 1", output: "(1, 0)" },
        ],
        tasks: ["Double `capacity` and add `size` to `copies` whenever `size == capacity` before appending."],
        starterCode: "function count_resize_copies(n):\n    // TODO: simulate n appends",
        expectedOutput: "(8, 7)\n(1, 0)",
        hint: "When `n == 0`, return `(1, 0)` with zero copies.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode: "function count_resize_copies(n):\n    size ← 0\n    capacity ← 1\n    copies ← 0\n    for k from 1 to n:\n        if size == capacity:\n            copies ← copies + size\n            capacity ← capacity * 2\n        size ← size + 1\n    return (capacity, copies)",
      },
      {
        title: "Remove All Target Values Without O(n^2) Shifting",
        tier: "Core",
        goal: "Given array `nums` and integer `target`, compact all elements `!= target` to the front of `nums` in-place (preserving their relative order) and return the new length `w` in `O(n)` time.",
        constraints: ["0 <= len(nums) <= 10^5", "Do not call erase/pop inside the loop", "Target: O(n) time, O(1) extra space"],
        examples: [
          { input: "nums = [3, 2, 2, 3, 4], target = 3", output: "len=3, prefix=[2, 2, 4]" },
          { input: "nums = [5, 5], target = 5", output: "len=0, prefix=[]" },
        ],
        tasks: [
          "Maintain a slow write index `w = 0`.",
          "Scan `r` from `0` to `n - 1`: whenever `nums[r] != target`, write `nums[w] = nums[r]` and increment `w`.",
        ],
        starterCode: "function compact_without_target(nums, target):\n    // TODO: in-place O(n) compaction using write index w",
        expectedOutput: "len=3, prefix=[2, 2, 4]\nlen=0, prefix=[]",
        hint: "Using a single forward write pointer `w` writes every kept element once instead of shifting after every deletion.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode: "function compact_without_target(nums, target):\n    w ← 0\n    for r from 0 to len(nums) - 1:\n        if nums[r] != target:\n            nums[w] ← nums[r]\n            w ← w + 1\n    return w",
      },
      {
        title: "Hysteresis Dynamic Array Push & Pop",
        tier: "Stretch",
        goal: "Process a sequence of `ops` (`\"push\"` or `\"pop\"`) starting at `size = 0, capacity = 1`. Double `capacity` when `size == capacity` on push; halve `capacity` (`max(1, capacity / 2)`) after a pop when `size <= capacity / 4` (floor division). Return `(size, capacity, total_copies)`.",
        constraints: ["1 <= len(ops) <= 10^5", "Ignore pop when size == 0", "Time: O(len(ops)), Space: O(1)"],
        examples: [
          { input: "ops = [push, push, push, push, push, pop, pop, pop]", output: "(2, 4, 9)", explanation: "5 pushes copy 1 + 2 + 4 = 7 items (size=5, cap=8); 3 pops drop size to 2 <= 8/4, shrinking cap to 4 and copying 2 items (total copies=9)." },
          { input: "ops = [push, push, push, push, pop, pop, pop]", output: "(1, 2, 4)", explanation: "4 pushes grow cap 1->2->4 copying 1 + 2 = 3 items; 3 pops drop size to 1 <= 4/4, shrinking cap to 2 and copying 1 item (total copies=4)." },
        ],
        tasks: [
          "On a shrink resize (`capacity > 1` and `size <= floor(capacity / 4)`), halve `capacity` and add `size` to `total_copies`.",
          "Skip `pop` operations when `size == 0`.",
        ],
        starterCode: "function simulate_hysteresis(ops):\n    // TODO: track size, capacity, and total_copies across push/pop",
        expectedOutput: "(2, 4, 9)\n(1, 2, 4)",
        hint: "Shrinking at `capacity / 4` instead of `capacity / 2` guarantees `size` sits right at `capacity / 2` after shrinking, leaving plenty of room before the next resize.",
        complexity: { time: "O(len(ops))", space: "O(1)" },
        solutionCode: "function simulate_hysteresis(ops):\n    size ← 0\n    capacity ← 1\n    copies ← 0\n    for each op in ops:\n        if op == \"push\":\n            if size == capacity:\n                copies ← copies + size\n                capacity ← capacity * 2\n            size ← size + 1\n        else if op == \"pop\" and size > 0:\n            size ← size - 1\n            if capacity > 1 and size <= floor(capacity / 4):\n                capacity ← floor(capacity / 2)\n                copies ← copies + size\n    return (size, capacity, copies)",
      },
    ],
  },

  "dsa-kadane-majority": {
    lessonId: "dsa-kadane-majority",
    subtitle:
      "Build three O(n)-time, O(1)-space array scans: Kadane's max subarray sum, Boyer-Moore majority vote, and 3-reversal rotation.",
    intro: {
      heading: "Classic Array Scans: Kadane & Majority Vote",
      explanation: [
        "Seed Kadane's `best = 0` on `[-5, -2, -8]` and it wrongly returns `0`—even though every non-empty subarray sum is negative and the true answer is `-2`. Or return Boyer-Moore's `candidate` after a single pass on `[1, 2, 3]` and it outputs `3`, even though `3` appears once (`1 <= 3/2`) and no majority exists.",
        "Three `O(n)`-time, `O(1)`-space array patterns avoid these traps once seeded properly: **Kadane's algorithm** (`cur = nums[0], best = nums[0]`), **Boyer-Moore Majority Vote** (pair cancellation + Pass 2 frequency check), and **three-reversal rotation** (`k mod n`).",
      ],
      analogy:
        "For Kadane, picture hiking with a bag of profit and loss: if your running total drops below zero, carrying that debt into tomorrow shrinks future totals, so drop it and restart fresh. For Boyer-Moore, pair off opposing voters two by two: any true >50% majority still has at least one unmatched supporter standing at the end.",
      realWorldUses: [
        "Finding the highest-gain contiguous time window in telemetry, stock, or throughput logs (Kadane)",
        "Electing a strict majority consensus value across sensor readings in `O(1)` extra RAM (Boyer-Moore)",
      ],
    },
    sections: [
      {
        heading: "Three O(n)-time, O(1)-space array patterns",
        paragraphs: [
          "In **Kadane's algorithm**, at each element `x`, pick whichever is larger between extending (`cur + x`) or restarting at `x` (`cur = max(x, cur + x)`), then update `best = max(best, cur)`. Tracing `[-2, 1, -3, 4, -1, 2, 1]` yields `cur`: `-2 -> 1 -> -2 -> 4 -> 3 -> 5 -> 6` (`best = 6`). On `[-5, -2, -8]`, seeding `cur = best = -5` yields `-2` instead of a bogus `0`.",
          "In **Boyer-Moore Majority Vote**, seeing `candidate` adds `+1`, seeing another value subtracts `-1`, and `count == 0` picks a new `candidate`. Always run a Pass 2 count check (`freq > floor(n / 2)`) unless a majority is guaranteed—on `[1, 2, 3]`, Pass 1 ends on `candidate = 3`, which Pass 2 rejects. Finally, **three-reversal rotation** shifts right by `k mod n` by reversing `[0..n-1]`, `[0..k-1]`, and `[k..n-1]`.",
        ],
        code: [
          "// Kadane counterexample [-5, -2, -8]:",
          "best = 0; ...                     // Broken: returns 0 (empty subarray not allowed)",
          "cur = nums[0]; best = nums[0]     // Working: cur = -5 -> -2 -> -8, best = -2",
          "// Boyer-Moore unguaranteed majority on [1, 2, 3]:",
          "// Pass 1 ends at candidate=3, count=1 -> Pass 2 finds freq=1 <= 3//2 -> null",
        ],
        output: "kadane([-5, -2, -8]) -> -2 | majority([1, 2, 3]) -> null",
        table: {
          caption: "Classic O(n) single-pass / in-place array scans",
          headers: ["Algorithm", "Core invariant", "Time", "Extra space"],
          rows: [
            ["Kadane's Max Subarray", "`cur = max(x, cur + x)`, `best = max(best, cur)`", "`O(n)`", "`O(1)`"],
            ["Boyer-Moore Majority (`> n/2`)", "Cancel distinct pairs; verify candidate in pass 2", "`O(n)`", "`O(1)`"],
            ["3-Reversal Rotation (right by `k`)", "Reverse `[0..n-1]`, `[0..k-1]`, `[k..n-1]`", "`O(n)`", "`O(1)`"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Kadane initializes `cur = nums[0]` and `best = nums[0]` so all-negative inputs return the least negative single element rather than `0`. Boyer-Moore always needs a second `O(n)` count check whenever a majority is not guaranteed to exist.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Fix Kadane's Negative Bug and Add Boyer-Moore Verification",
      subtitle: "Move from zero-initialized Kadane to all-negative correctness and two-pass majority voting.",
      steps: [
        {
          label: "Step 1: Broken Kadane seeded at 0 (fails on [-5, -2, -8])",
          explanation: "Resetting `cur` to `0` or seeding `best = 0` lets `best` stay at `0` even when every element is negative.",
          code: [
            "function kadane_broken(nums):",
            "    cur ← 0, best ← 0       // BUG: wrong for all-negative arrays",
            "    for each x in nums:",
            "        cur ← max(0, cur + x)",
            "        best ← max(best, cur)",
            "    return best",
          ],
          activeLines: [2, 4],
          output: "[-5, -2, -8] -> 0 (BUG, expected -2)",
        },
        {
          label: "Step 2: Seed cur and best at nums[0] and iterate from index 1",
          explanation: "Comparing `max(nums[i], cur + nums[i])` allows `cur` to hold negative values while still restarting whenever `cur` hurts.",
          code: [
            "function max_subarray_sum(nums):",
            "    cur ← nums[0], best ← nums[0]",
            "    for i from 1 to len(nums) - 1:",
            "        cur ← max(nums[i], cur + nums[i])",
            "        best ← max(best, cur)",
            "    return best",
          ],
          activeLines: [2, 4, 5],
          output: "[-5, -2, -8] -> -2 | [-2, 1, -3, 4, -1, 2, 1] -> 6",
        },
        {
          label: "Step 3: Verify Boyer-Moore candidate in Pass 2",
          explanation: "Pass 1 picks a survivor in `O(1)` space; Pass 2 counts its occurrences so `[1, 2, 3]` returns `null` instead of `3`.",
          code: [
            "function strict_majority(nums):",
            "    cand ← null, count ← 0",
            "    for each x in nums:",
            "        if count == 0: cand ← x",
            "        count ← count + (1 if x == cand else -1)",
            "    freq ← count of cand in nums",
            "    return cand if freq > floor(len(nums) / 2) else null",
          ],
          activeLines: [6, 7],
          output: "[1, 2, 3] -> null | [3, 3, 4, 2, 3, 3, 5] -> 3",
        },
      ],
    },
    walkthrough: {
      title: "Step through Kadane, Boyer-Moore, and 3-reversal rotation",
      layout: "visual-first",
      steps: [
        {
          title: "Kadane drops negative baggage and restarts at 1",
          tag: "PATTERN",
          explanation: [
            "Start with `cur = -2, best = -2` on `[-2, 1, -3, 4, -1, 2, 1]`. At index `1` (`x = 1`), extending gives `-2 + 1 = -1`, while restarting gives `1`.",
            "Since `1 > -1`, `cur` resets to `1` and `best` updates to `1`.",
          ],
          code: [
            "cur ← nums[0]; best ← nums[0]",
            "for i from 1 to n - 1:",
            "    cur ← max(nums[i], cur + nums[i])",
            "    best ← max(best, cur)",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "i = 1 (x = 1)", value: "max(1, -2 + 1) = 1", changed: true },
            { name: "cur / best", value: "1 / 1", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Kadane at index 1: restart instead of keeping -2",
                cells: [
                  { id: "k0", value: "-2", index: 0, state: "dim" },
                  { id: "k1", value: "1", index: 1, state: "active" },
                  { id: "k2", value: "-3", index: 2 },
                  { id: "k3", value: "4", index: 3 },
                  { id: "k4", value: "-1", index: 4 },
                  { id: "k5", value: "2", index: 5 },
                  { id: "k6", value: "1", index: 6 },
                ],
                pointers: [{ index: 1, label: "cur = 1", tone: "coral" }],
              },
            ],
            caption: "Dropping a negative prefix is always better than carrying it forward.",
          },
        },
        {
          title: "Kadane captures peak contiguous streak [4, -1, 2, 1]",
          tag: "TRACE",
          explanation: [
            "At index `2` (`-3`), `cur` drops to `-2`, so at index `3` (`4`), Kadane restarts again at `cur = 4`.",
            "Through indices `3..6`, `cur` becomes `4 -> 3 -> 5 -> 6`, locking in `best = 6`.",
          ],
          code: [
            "cur ← max(nums[i], cur + nums[i])",
            "best ← max(best, cur)",
            "return best",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Best window", value: "[4, -1, 2, 1]" },
            { name: "cur / best", value: "6 / 6", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Peak subarray [3..6] sums to 6",
                cells: [
                  { id: "k0", value: "-2", index: 0, state: "dim" },
                  { id: "k1", value: "1", index: 1, state: "dim" },
                  { id: "k2", value: "-3", index: 2, state: "dim" },
                  { id: "k3", value: "4", index: 3, state: "done" },
                  { id: "k4", value: "-1", index: 4, state: "done" },
                  { id: "k5", value: "2", index: 5, state: "done" },
                  { id: "k6", value: "1", index: 6, state: "active" },
                ],
                pointers: [
                  { index: 3, label: "start", tone: "ok" },
                  { index: 6, label: "best = 6", tone: "coral" },
                ],
                highlightRange: [3, 6],
              },
            ],
            caption: "One linear pass finds the optimal contiguous sum in O(1) space.",
          },
        },
        {
          title: "Boyer-Moore cancels opposing pairs in O(1) space",
          tag: "PATTERN",
          explanation: [
            "Scan `[2, 2, 1, 1, 1, 2, 2]`: `candidate = 2` hits `count = 2`, cancels twice against `1`, reaches `count = 0` at index `4` (`candidate` switches to `1`), cancels against `2`, and switches back to `candidate = 2, count = 1` at the end.",
            "Every time `count` drops, two distinct elements canceled each other; the survivor is `2`.",
          ],
          code: [
            "candidate ← null; count ← 0",
            "for each x in nums:",
            "    if count == 0: candidate ← x",
            "    if x == candidate: count ← count + 1",
            "    else: count ← count - 1",
          ],
          activeLines: [3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "candidate", value: "2", changed: true },
            { name: "count", value: "1", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Boyer-Moore pass 1 on [2, 2, 1, 1, 1, 2, 2]",
                cells: [
                  { id: "b0", value: "2", index: 0, state: "dim" },
                  { id: "b1", value: "2", index: 1, state: "dim" },
                  { id: "b2", value: "1", index: 2, state: "dim" },
                  { id: "b3", value: "1", index: 3, state: "dim" },
                  { id: "b4", value: "1", index: 4, state: "pivot" },
                  { id: "b5", value: "2", index: 5, state: "dim" },
                  { id: "b6", value: "2", index: 6, state: "active" },
                ],
                pointers: [
                  { index: 4, label: "switched to 1", tone: "accent" },
                  { index: 6, label: "survivor = 2", tone: "ok" },
                ],
              },
            ],
            caption: "Pairwise cancellation leaves only the strict majority (> 7/2 = 3) surviving.",
          },
        },
        {
          title: "Always verify Boyer-Moore when majority is unguaranteed",
          tag: "PITFALL",
          explanation: [
            "On `[1, 2, 3]`, pass 1 ends with `candidate = 3, count = 1`, even though `3` appears only once (`1 <= floor(3 / 2)`).",
            "Pass 2 counts occurrences of `candidate` and rejects `3`, returning `null`.",
          ],
          callout: {
            kind: "WATCH OUT",
            text: "Skipping the second pass fails whenever an input has no element occurring strictly more than `floor(n / 2)` times.",
          },
          code: [
            "// Pass 2: verify candidate > floor(n / 2)",
            "freq ← 0",
            "for each x in nums:",
            "    if x == candidate: freq ← freq + 1",
            "if freq > floor(n / 2): return candidate",
            "return null",
          ],
          activeLines: [4, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "candidate", value: "3" },
            { name: "freq / limit", value: "1 <= 1 (fail)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Pass 2 rejects candidate 3 on [1, 2, 3]",
                cells: [
                  { id: "v0", value: "1", index: 0, state: "dim" },
                  { id: "v1", value: "2", index: 1, state: "dim" },
                  { id: "v2", value: "3", index: 2, state: "pivot" },
                ],
                pointers: [{ index: 2, label: "freq=1 (not > 1)", tone: "coral" }],
              },
            ],
            caption: "A strict majority must appear strictly more than n / 2 times.",
          },
        },
        {
          title: "Rotate right by k = 2: start with [1, 2, 3, 4, 5]",
          tag: "CONCEPT",
          explanation: [
            "To rotate `[1, 2, 3, 4, 5]` right by `k = 2` in `O(1)` extra space, first normalize `k ← k mod n = 2`.",
            "The last `k = 2` elements (`[4, 5]`) need to move to the front while `[1, 2, 3]` shift right.",
          ],
          code: [
            "rotate_right(nums, k):",
            "    if n == 0: return",
            "    k ← k mod n                // 2",
            "    // next: reverse(nums, 0, n - 1)",
          ],
          activeLines: [3],
          codeLabel: "Pseudocode",
          state: [
            { name: "nums", value: "[1, 2, 3, 4, 5]" },
            { name: "k mod n", value: "2" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Initial array [1, 2, 3, 4, 5] before reversals",
                cells: [
                  { id: "r0", value: "1", index: 0 },
                  { id: "r1", value: "2", index: 1 },
                  { id: "r2", value: "3", index: 2 },
                  { id: "r3", value: "4", index: 3, state: "active" },
                  { id: "r4", value: "5", index: 4, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "prefix n-k=3", tone: "accent" },
                  { index: 3, label: "last k=2", tone: "coral" },
                ],
              },
            ],
            caption: "Three in-place reversals move the tail [4, 5] to the front without a copy.",
          },
        },
        {
          title: "Reversal 1: reverse entire array [0..4]",
          tag: "TRACE",
          explanation: [
            "Reverse `[0..4]` in place, turning `[1, 2, 3, 4, 5]` into `[5, 4, 3, 2, 1]`.",
            "Both halves now sit in their target zones, just in reversed order.",
          ],
          code: [
            "    reverse(nums, 0, n - 1)   // [5, 4, 3, 2, 1]",
            "    reverse(nums, 0, k - 1)",
            "    reverse(nums, k, n - 1)",
          ],
          activeLines: [1],
          codeLabel: "Pseudocode",
          state: [
            { name: "After reverse(0, 4)", value: "[5, 4, 3, 2, 1]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After full reversal [0..4]",
                cells: [
                  { id: "r4", value: "5", index: 0, state: "active" },
                  { id: "r3", value: "4", index: 1, state: "active" },
                  { id: "r2", value: "3", index: 2, state: "done" },
                  { id: "r1", value: "2", index: 3, state: "done" },
                  { id: "r0", value: "1", index: 4, state: "done" },
                ],
                pointers: [
                  { index: 0, label: "front k=2", tone: "coral" },
                  { index: 2, label: "tail n-k=3", tone: "accent" },
                ],
              },
            ],
            caption: "Full reversal puts both halves into their target zones, just backwards.",
          },
        },
        {
          title: "Reversal 2: reverse first k = 2 elements [0..1]",
          tag: "TRACE",
          explanation: [
            "Reverse `[0..1]` (`[5, 4]` -> `[4, 5]`), restoring the front `k` elements to their original relative order.",
            "Next we will reverse the remaining tail `[2..4]` (`[3, 2, 1]` -> `[1, 2, 3]`).",
          ],
          code: [
            "    reverse(nums, 0, n - 1)   // [5, 4, 3, 2, 1]",
            "    reverse(nums, 0, k - 1)   // [4, 5, 3, 2, 1]",
            "    reverse(nums, k, n - 1)",
          ],
          activeLines: [2],
          codeLabel: "Pseudocode",
          state: [
            { name: "After reverse(0, 1)", value: "[4, 5, 3, 2, 1]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After reversing [0..1] -> [4, 5, 3, 2, 1]",
                cells: [
                  { id: "r3", value: "4", index: 0, state: "done" },
                  { id: "r4", value: "5", index: 1, state: "done" },
                  { id: "r2", value: "3", index: 2, state: "active" },
                  { id: "r1", value: "2", index: 3, state: "active" },
                  { id: "r0", value: "1", index: 4, state: "active" },
                ],
                highlightRange: [0, 1],
                pointers: [
                  { index: 0, label: "k=2 restored", tone: "ok" },
                  { index: 2, label: "reverse [2..4] next", tone: "coral" },
                ],
              },
            ],
            caption: "Reversing [0..1] fixes the rotated front; [2..4] still needs to be flipped back.",
          },
        },
        {
          title: "Reversal 3: reverse [2..4] to restore final order",
          tag: "TRACE",
          explanation: [
            "Reverse `[2..4]` (`[3, 2, 1]` -> `[1, 2, 3]`) to finish the rotation.",
            "Every element is swapped at most twice, finishing in `O(n)` time and `O(1)` extra space.",
          ],
          code: [
            "    reverse(nums, 0, n - 1)   // [5, 4, 3, 2, 1]",
            "    reverse(nums, 0, k - 1)   // [4, 5, 3, 2, 1]",
            "    reverse(nums, k, n - 1)   // [4, 5, 1, 2, 3]",
          ],
          activeLines: [3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Rotated by 2", value: "[4, 5, 1, 2, 3]", changed: true },
            { name: "Extra space", value: "O(1)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Final rotated array [4, 5, 1, 2, 3]",
                cells: [
                  { id: "r3", value: "4", index: 0, state: "done" },
                  { id: "r4", value: "5", index: 1, state: "done" },
                  { id: "r0", value: "1", index: 2, state: "done" },
                  { id: "r1", value: "2", index: 3, state: "done" },
                  { id: "r2", value: "3", index: 4, state: "done" },
                ],
                highlightRange: [0, 1],
                pointers: [
                  { index: 0, label: "k=2 rotated", tone: "ok" },
                  { index: 2, label: "restored order", tone: "accent" },
                ],
              },
            ],
            caption: "Reversing each half restores internal element order in place.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Initializing Kadane's best to 0 breaks all-negative inputs",
        detail:
          "For `[-5, -2, -8]`, the maximum non-empty subarray is `[-2]` (`-2`). Initializing `best = 0` would falsely return `0`. Always seed `cur = nums[0]` and `best = nums[0]` and iterate from index `1`.",
      },
      {
        title: "Equal to n/2 is not a strict majority",
        detail:
          "In `[1, 2, 1, 2]`, neither `1` nor `2` appears strictly more than `4 / 2 = 2` times. Verification checks `freq > floor(n / 2)`, not `>=`.",
      },
      {
        title: "Rotation when k >= n or array is empty",
        detail:
          "If `n = 5` and `k = 12`, reversing `[0..11]` crashes out of bounds. Always guard `n == 0` first and reduce `k = k mod n` (if `k == 0`, return immediately).",
      },
    ],
    practiceTask: {
      title: "Maximum Non-Empty Subarray Sum",
      tier: "Warmup",
      goal: "Given non-empty integer array `nums`, find the largest sum of any non-empty contiguous subarray in `O(n)` time and `O(1)` extra space.",
      constraints: ["1 <= len(nums) <= 10^5", "-10^4 <= nums[i] <= 10^4", "Target: O(n) time, O(1) space"],
      examples: [
        { input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]", output: "6", explanation: "[4, -1, 2, 1] sums to 6." },
        { input: "nums = [-8, -3, -6]", output: "-3", explanation: "Single element [-3] is best." },
      ],
      tasks: [
        "Initialize `cur = nums[0]` and `best = nums[0]`.",
        "For each element from index `1` onward, set `cur = max(nums[i], cur + nums[i])` and update `best = max(best, cur)`.",
      ],
      starterCode: "function max_subarray_sum(nums):\n    // TODO: Kadane's single-pass O(n) scan",
      expectedOutput: "6\n-3",
      hint: "Never seed `best` to `0` when all inputs can be negative.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode: "function max_subarray_sum(nums):\n    cur ← nums[0]\n    best ← nums[0]\n    for i from 1 to len(nums) - 1:\n        cur ← max(nums[i], cur + nums[i])\n        best ← max(best, cur)\n    return best",
    },
    practiceChallenges: [
      {
        title: "Maximum Non-Empty Subarray Sum",
        tier: "Warmup",
        goal: "Return the maximum sum of any non-empty contiguous subarray of `nums`.",
        constraints: ["1 <= len(nums) <= 10^5", "Time: O(n)", "Extra space: O(1)"],
        examples: [
          { input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]", output: "6" },
          { input: "nums = [-8, -3, -6]", output: "-3" },
        ],
        tasks: ["Extend or restart `cur` at each index and track `best`."],
        starterCode: "function max_subarray_sum(nums):\n    // TODO: Kadane's algorithm",
        expectedOutput: "6\n-3",
        hint: "Start `cur` and `best` at `nums[0]`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode: "function max_subarray_sum(nums):\n    cur ← nums[0]\n    best ← nums[0]\n    for i from 1 to len(nums) - 1:\n        cur ← max(nums[i], cur + nums[i])\n        best ← max(best, cur)\n    return best",
      },
      {
        title: "Verified Strict Majority Element",
        tier: "Core",
        goal: "Given `nums`, return the element appearing strictly more than `floor(n / 2)` times using `O(1)` extra space, or `null` if no such element exists.",
        constraints: ["1 <= len(nums) <= 10^5", "Do not use extra arrays or frequency maps", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [3, 3, 4, 2, 3, 3, 5]", output: "3", explanation: "3 appears 4 times (> 7/2 = 3)." },
          { input: "nums = [1, 2, 1, 2]", output: "null", explanation: "2 occurrences is not strictly > 2." },
        ],
        tasks: [
          "Run Boyer-Moore pass 1 to pick a candidate in `O(1)` space.",
          "Run pass 2 to verify `freq > floor(n / 2)`, returning `null` if verification fails.",
        ],
        starterCode: "function strict_majority(nums):\n    // TODO: Boyer-Moore candidate + verification pass",
        expectedOutput: "3\nnull",
        hint: "Pass 1 alone cannot distinguish `[1, 2, 3]` from an array with a true majority.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode: "function strict_majority(nums):\n    candidate ← null\n    count ← 0\n    for each x in nums:\n        if count == 0:\n            candidate ← x\n        if x == candidate:\n            count ← count + 1\n        else:\n            count ← count - 1\n    freq ← 0\n    for each x in nums:\n        if x == candidate:\n            freq ← freq + 1\n    if freq > floor(len(nums) / 2):\n        return candidate\n    return null",
      },
      {
        title: "Rotate Array Right In-Place by k Steps",
        tier: "Stretch",
        goal: "Rotate `nums` right by `k` positions in-place in `O(n)` time and `O(1)` extra space without allocating a copy.",
        constraints: ["0 <= len(nums) <= 10^5", "0 <= k <= 10^9", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [1, 2, 3, 4, 5, 6, 7], k = 3", output: "[5, 6, 7, 1, 2, 3, 4]" },
          { input: "nums = [10, 20], k = 5", output: "[20, 10]", explanation: "5 mod 2 = 1 step right." },
        ],
        tasks: [
          "Normalize `k = k mod n` (return early if `n == 0` or `k == 0`).",
          "Write helper `reverse(nums, l, r)` and apply it to `[0, n-1]`, `[0, k-1]`, and `[k, n-1]`.",
        ],
        starterCode: "function rotate_right(nums, k):\n    // TODO: 3-reversal rotation in O(1) extra space",
        expectedOutput: "[5, 6, 7, 1, 2, 3, 4]\n[20, 10]",
        hint: "Reversing a subrange swaps `nums[l]` and `nums[r]` while moving `l += 1, r -= 1` until `l >= r`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode: "function reverse_range(nums, l, r):\n    while l < r:\n        temp ← nums[l]\n        nums[l] ← nums[r]\n        nums[r] ← temp\n        l ← l + 1\n        r ← r - 1\n\nfunction rotate_right(nums, k):\n    n ← len(nums)\n    if n == 0:\n        return nums\n    k ← k mod n\n    if k == 0:\n        return nums\n    reverse_range(nums, 0, n - 1)\n    reverse_range(nums, 0, k - 1)\n    reverse_range(nums, k, n - 1)\n    return nums",
      },
    ],
  },

  "dsa-prefix-sums": {
    lessonId: "dsa-prefix-sums",
    subtitle:
      "Turn repeated range sums and batch interval updates into O(1) operations using 1D prefix sums, pivot scans, and difference arrays.",
    intro: {
      heading: "Prefix Sums & Difference Arrays",
      explanation: [
        "Answering `10^5` range-sum queries `[L..R]` over `10^5` items with a loop executes `~10^10` additions and times out. Worse, building an unpadded prefix array `pref` of length `n` and querying `pref[R] - pref[L - 1]` crashes or reads the wrong end at `L = 0` (`pref[-1]`). Precomputing `pref` of length `n + 1` with `pref[0] = 0` answers any inclusive query `[L..R]` in `O(1)` via `pref[R + 1] - pref[L]`.",
        "Its mirror image is the **difference array**: when you apply `q` range-add updates `[L..R] += v` before reading final values, record two boundary deltas (`diff[L] += v` and `diff[R + 1] -= v`) in an `n + 1` array and run one `O(n)` sweep at the end.",
      ],
      analogy:
        "A prefix sum works like highway mile markers: distance between Exit `l` and Exit `r` is `marker[r + 1] - marker[l]`. A difference array works like posting `+5` ('put on 5 coats') entering a tunnel and `-5` ('take off 5 coats') right after leaving; walking the route once sums your coat count at every mile.",
      realWorldUses: [
        "Answering millions of slice-sum queries over static metrics, revenue logs, or 1D histograms in `O(1)` each",
        "Applying batch range adjustments such as seat reservations, rate-limit windows, or calendar bookings in `O(n + q)`",
      ],
    },
    sections: [
      {
        heading: "Prefix sums vs difference arrays",
        paragraphs: [
          "Use **prefix sums** when reads outnumber updates: spend `O(n)` once to build `pref` (`[0, 3, 2, 6, 8, 13]` for `[3, -1, 4, 2, 5]`), then answer `[1..3]` in `O(1)` via `pref[4] - pref[1] = 8 - 3 = 5`. Equilibrium/pivot index problems use the same cumulative logic in `O(1)` extra space by keeping `left_sum` and computing `right_sum = total_sum - left_sum - arr[i]`.",
          "The exact same single-pass prefix/suffix pattern builds **prefix extremes** (`prefix_max[i] = max(prefix_max[i - 1], h[i])` left-to-right and `suffix_max[i] = max(suffix_max[i + 1], h[i])` right-to-left) in `O(n)` time, which Module 07 later uses for Trapping Rain Water.",
          "Use **difference arrays** when batch range updates finish before the final read: allocate `diff` of length `n + 1` filled with `0` so `diff[r + 1]` stays in bounds even at `r = n - 1`, add `+v` at `l` and `-v` at `r + 1`, and accumulate a running sum across `0..n - 1` at the end.",
        ],
        code: [
          "// Broken unpadded prefix query on arr = [3, -1, 4, 2, 5], query [0..2]:",
          "// unpadded = [3, 2, 6, 8, 13] -> unpadded[2] - unpadded[-1] = 6 - 13 = -7 (BUG!)",
          "// Working n+1 padded prefix (pref[0] = 0):",
          "// pref = [0, 3, 2, 6, 8, 13] -> pref[3] - pref[0] = 6 - 0 = 6",
        ],
        output: "Unpadded [0..2] (broken): -7 | Padded [0..2]: 6",
        table: {
          caption: "Comparing naive loops vs prefix sums vs difference arrays",
          headers: ["Workload (`n` items, `q` ops)", "Naive loop", "Prefix / Difference pattern", "Speedup"],
          rows: [
            ["`q` static range-sum queries", "`O(q * n)`", "Prefix sum: `O(n + q)`", "`O(1)` per query"],
            ["Find equilibrium / pivot index", "`O(n^2)`", "Running `left_sum` vs `total`: `O(n)`", "`O(1)` extra space"],
            ["`q` range-add updates + final array", "`O(q * n)`", "Difference array: `O(n + q)`", "`O(1)` per update"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Always give `pref` length `n + 1` with `pref[0] = 0`. That padding makes `pref[r + 1] - pref[l]` work uniformly for every `l >= 0` with zero `if l == 0` special cases.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Eliminate Inclusive [L..R] Off-By-One Bugs With n + 1 Padding",
      subtitle: "Move from unpadded prefix arrays to n + 1 prefix sums and difference arrays.",
      steps: [
        {
          label: "Step 1: Unpadded pref breaks at L = 0",
          explanation: "Without `pref[0] = 0`, querying `[0..r]` tries to read `pref[-1]` unless every call adds a special `if l == 0` branch.",
          code: [
            "pref[0] ← arr[0]",
            "for i from 1 to n - 1: pref[i] ← pref[i - 1] + arr[i]",
            "// Query [0..2]: pref[2] - pref[-1]  <- BUG / Crash!",
          ],
          activeLines: [3],
          output: "[3, -1, 4], query [0..2] -> off-by-one error",
        },
        {
          label: "Step 2: Pad pref to length n + 1 with pref[0] = 0",
          explanation: "Shifting indices by `+1` stores the sum of `0..k-1` at `pref[k]`, so `pref[r + 1] - pref[l]` works uniformly for all `l >= 0`.",
          code: [
            "pref ← array of length n + 1 filled with 0",
            "for i from 0 to n - 1:",
            "    pref[i + 1] ← pref[i] + arr[i]",
            "// Query [l..r]: pref[r + 1] - pref[l]",
          ],
          activeLines: [1, 3, 4],
          output: "[3, -1, 4], [0..2] -> 6 | [1..2] -> 3",
        },
        {
          label: "Step 3: Difference array of length n + 1 for O(1) range adds",
          explanation: "Marking `diff[l] += v` and `diff[r + 1] -= v` records any `[l..r]` update in 2 writes, then one sweep builds `out`.",
          code: [
            "diff ← array of length n + 1 filled with 0",
            "for each [l, r, v] in updates:",
            "    diff[l] ← diff[l] + v",
            "    diff[r + 1] ← diff[r + 1] - v",
            "running ← 0",
            "for i from 0 to n - 1: running += diff[i]; out[i] ← running",
          ],
          activeLines: [3, 4, 6],
          output: "n=5, [1..3]+4, [2..4]+2 -> [0, 4, 6, 6, 2]",
        },
      ],
    },
    walkthrough: {
      title: "Trace prefix sums, pivot index, and difference arrays",
      layout: "visual-first",
      steps: [
        {
          title: "Build n + 1 prefix array with pref[0] = 0",
          tag: "CONCEPT",
          explanation: [
            "For `arr = [3, -1, 4, 2, 5]`, `pref` starts at `pref[0] = 0` and sets `pref[i + 1] = pref[i] + arr[i]`.",
            "That produces `pref = [0, 3, 2, 6, 8, 13]`, where `pref[k]` equals the sum of the first `k` elements.",
          ],
          code: [
            "pref ← array of length n + 1 filled with 0",
            "for i from 0 to n - 1:",
            "    pref[i + 1] ← pref[i] + arr[i]",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "arr", value: "[3, -1, 4, 2, 5]" },
            { name: "pref", value: "[0, 3, 2, 6, 8, 13]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input arr (length n = 5)",
                cells: [
                  { id: "a0", value: "3", index: 0 },
                  { id: "a1", value: "-1", index: 1 },
                  { id: "a2", value: "4", index: 2 },
                  { id: "a3", value: "2", index: 3 },
                  { id: "a4", value: "5", index: 4 },
                ],
              },
              {
                label: "Prefix sum pref (length n + 1 = 6)",
                cells: [
                  { id: "p0", value: "0", index: 0, state: "pivot" },
                  { id: "p1", value: "3", index: 1, state: "done" },
                  { id: "p2", value: "2", index: 2, state: "done" },
                  { id: "p3", value: "6", index: 3, state: "done" },
                  { id: "p4", value: "8", index: 4, state: "done" },
                  { id: "p5", value: "13", index: 5, state: "done" },
                ],
                pointers: [{ index: 0, label: "pref[0] = 0", tone: "accent" }],
              },
            ],
            caption: "Each entry pref[k] holds the cumulative sum of arr[0..k-1].",
          },
        },
        {
          title: "Answer range sum [1..3] in O(1) via pref[r+1] - pref[l]",
          tag: "TRACE",
          explanation: [
            "To compute `arr[1] + arr[2] + arr[3]` (`-1 + 4 + 2 = 5`), subtract `pref[1]` (`3`) from `pref[4]` (`8`).",
            "`8 - 3 = 5` in two array reads, regardless of whether the range spans `3` items or `300,000` items.",
          ],
          code: [
            "range_sum(pref, l, r):",
            "    return pref[r + 1] - pref[l]   // pref[4] - pref[1] = 8 - 3 = 5",
          ],
          activeLines: [2],
          codeLabel: "Pseudocode",
          state: [
            { name: "Query [l, r]", value: "[1, 3]" },
            { name: "pref[4] - pref[1]", value: "8 - 3 = 5", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Target slice arr[1..3] = -1 + 4 + 2 = 5",
                cells: [
                  { id: "a0", value: "3", index: 0, state: "dim" },
                  { id: "a1", value: "-1", index: 1, state: "active" },
                  { id: "a2", value: "4", index: 2, state: "active" },
                  { id: "a3", value: "2", index: 3, state: "active" },
                  { id: "a4", value: "5", index: 4, state: "dim" },
                ],
                highlightRange: [1, 3],
              },
              {
                label: "O(1) lookup in pref",
                cells: [
                  { id: "p0", value: "0", index: 0, state: "dim" },
                  { id: "p1", value: "3", index: 1, state: "pivot" },
                  { id: "p2", value: "2", index: 2, state: "dim" },
                  { id: "p3", value: "6", index: 3, state: "dim" },
                  { id: "p4", value: "8", index: 4, state: "active" },
                  { id: "p5", value: "13", index: 5, state: "dim" },
                ],
                pointers: [
                  { index: 1, label: "pref[l] = 3", tone: "coral" },
                  { index: 4, label: "pref[r+1] = 8", tone: "ok" },
                ],
              },
            ],
            caption: "Subtracting the prefix before l leaves only the sum of [l..r].",
          },
        },
        {
          title: "Find equilibrium / pivot index in O(1) extra space",
          tag: "PATTERN",
          explanation: [
            "On `[1, 7, 3, 6, 5, 6]`, `total = 28`. Track running `left_sum`; at index `i`, strict right sum equals `total - left_sum - arr[i]`.",
            "At `i = 3` (`arr[3] = 6`), `left_sum = 1 + 7 + 3 = 11` and `right_sum = 28 - 11 - 6 = 11`, so index `3` is the pivot!",
          ],
          code: [
            "total ← sum(arr); left_sum ← 0",
            "for i from 0 to n - 1:",
            "    right_sum ← total - left_sum - arr[i]",
            "    if left_sum == right_sum: return i",
            "    left_sum ← left_sum + arr[i]",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "i = 3 (val = 6)", value: "pivot found", changed: true },
            { name: "left_sum / right_sum", value: "11 / 11", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Equilibrium index 3: left [1, 7, 3] == right [5, 6]",
                cells: [
                  { id: "e0", value: "1", index: 0, state: "done" },
                  { id: "e1", value: "7", index: 1, state: "done" },
                  { id: "e2", value: "3", index: 2, state: "done" },
                  { id: "e3", value: "6", index: 3, state: "pivot" },
                  { id: "e4", value: "5", index: 4, state: "active" },
                  { id: "e5", value: "6", index: 5, state: "active" },
                ],
                pointers: [{ index: 3, label: "11 == 11", tone: "coral" }],
              },
            ],
            caption: "Tracking total and left_sum eliminates allocating a full prefix array.",
          },
        },
        {
          title: "Range Update 1: add +4 to [1..3] via diff[1] and diff[4]",
          tag: "MEMORY",
          explanation: [
            "Start with `5` zeros (`diff` has length `6` so `r + 1 = 5` stays in bounds). Update 1 adds `+4` to `[1..3]` by recording `diff[1] += 4` and `diff[4] -= 4`.",
            "Only those two boundary slots change in `O(1)` time regardless of how wide the range is.",
          ],
          code: [
            "diff ← array of length n + 1 filled with 0",
            "range_add(diff, 1, 3, 4):",
            "    diff[1] ← diff[1] + 4",
            "    diff[4] ← diff[4] - 4",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Update 1", value: "[1..3] + 4" },
            { name: "diff", value: "[0, 4, 0, 0, -4, 0]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Difference array diff after Update 1",
                cells: [
                  { id: "df0", value: "0", index: 0, state: "dim" },
                  { id: "df1", value: "+4", index: 1, state: "active" },
                  { id: "df2", value: "0", index: 2 },
                  { id: "df3", value: "0", index: 3 },
                  { id: "df4", value: "-4", index: 4, state: "pivot" },
                  { id: "df5", value: "0", index: 5, state: "dim" },
                ],
                pointers: [
                  { index: 1, label: "+4 starts", tone: "ok" },
                  { index: 4, label: "-4 ends", tone: "coral" },
                ],
              },
            ],
            caption: "Update 1 marks only the entry index (1) and the exit index (4).",
          },
        },
        {
          title: "Range Update 2: add +2 to [2..4] via diff[2] and diff[5]",
          tag: "MEMORY",
          explanation: [
            "Next, Update 2 adds `+2` to `[2..4]` by writing `diff[2] += 2` and `diff[5] -= 2`.",
            "Both overlapping range updates sit inside `diff` using only 4 total writes.",
          ],
          code: [
            "range_add(diff, 2, 4, 2):",
            "    diff[2] ← diff[2] + 2",
            "    diff[5] ← diff[5] - 2",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Update 2", value: "[2..4] + 2" },
            { name: "diff", value: "[0, 4, 2, 0, -4, -2]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Difference array diff after Update 2 (length n + 1 = 6)",
                cells: [
                  { id: "df0", value: "0", index: 0, state: "dim" },
                  { id: "df1", value: "+4", index: 1, state: "done" },
                  { id: "df2", value: "+2", index: 2, state: "active" },
                  { id: "df3", value: "0", index: 3 },
                  { id: "df4", value: "-4", index: 4, state: "done" },
                  { id: "df5", value: "-2", index: 5, state: "pivot" },
                ],
                pointers: [
                  { index: 1, label: "+4", tone: "accent" },
                  { index: 2, label: "+2 starts", tone: "ok" },
                  { index: 4, label: "-4", tone: "accent" },
                  { index: 5, label: "-2 ends", tone: "coral" },
                ],
              },
            ],
            caption: "Each range update changes only two boundary deltas in O(1) time.",
          },
        },
        {
          title: "Sweep running sum across diff[0..n-1] to get final values",
          tag: "TRACE",
          explanation: [
            "Walk `i` from `0` to `4` accumulating `running += diff[i]` into `out[i]`.",
            "The running sum produces `[0, 4, 6, 6, 2]`: indices `2` and `3` reflect both updates (`4 + 2 = 6`), while index `4` drops `-4` and keeps `+2`.",
          ],
          code: [
            "running ← 0",
            "for i from 0 to n - 1:",
            "    running ← running + diff[i]",
            "    out[i] ← running",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "running = 0",
              "for i in range(n):",
              "    running += diff[i]",
              "    out[i] = running",
            ],
            activeLines: [2, 3, 4],
          },
          state: [
            { name: "Final output", value: "[0, 4, 6, 6, 2]", changed: true },
            { name: "Total time", value: "O(n + q)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Reconstructed array out[0..4]",
                cells: [
                  { id: "out0", value: "0", index: 0, state: "dim" },
                  { id: "out1", value: "4", index: 1, state: "done" },
                  { id: "out2", value: "6", index: 2, state: "active" },
                  { id: "out3", value: "6", index: 3, state: "active" },
                  { id: "out4", value: "2", index: 4, state: "done" },
                ],
                highlightRange: [2, 3],
                pointers: [{ index: 2, label: "4 + 2 = 6", tone: "ok" }],
              },
            ],
            caption: "One final prefix sweep turns endpoint deltas into exact values across all n slots.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Off-by-one in pref[r + 1] - pref[l]",
        detail:
          "Because `pref` has `n + 1` elements with `pref[0] = 0`, `pref[i]` holds the sum of indices `0..i - 1`. An inclusive query `[l, r]` therefore subtracts `pref[l]`, not `pref[l - 1]`.",
      },
      {
        title: "Difference array index out of bounds at r = n - 1",
        detail:
          "Writing `diff[r + 1] -= v` touches index `n` when `r = n - 1`. Always allocate `diff` with `n + 1` slots (ignoring index `n` during the final `0..n - 1` sweep), or check `if r + 1 < n`.",
      },
      {
        title: "Prefix sums assume a static array between queries",
        detail:
          "If single elements are modified after every query, rebuilding `pref` takes `O(n)` per update. Use prefix sums when reads vastly outnumber point edits, and difference arrays when batch updates finish before reads.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does this buggy range_sum(pref, l, r) output on nums = [4, -2, 7, 1, 5] for query [l, r] = [1, 3]?",
        code: "pref ← [0, 4, 2, 9, 10, 15]\nfunction range_sum(pref, l, r):\n    return pref[r + 1] - pref[l - 1]",
        options: [
          { id: "a", label: "6 (the exact sum of [-2, 7, 1])" },
          { id: "b", label: "5 (drops index 3 from the right end)" },
          { id: "c", label: "10 (includes nums[0] = 4 by subtracting pref[0] instead of pref[1])" },
          { id: "d", label: "Index error because l - 1 is out of bounds" },
        ],
        correctId: "c",
        explanation: "Because pref has a leading 0 at index 0, pref[1] already holds nums[0] = 4. Subtracting pref[l - 1] shifts the left boundary one slot too far left, and crashes when l = 0.",
      },
      {
        prompt: "You allocate diff of length n = 5 (indices 0..4) and run this update for [l, r, val] = [1, 4, 3]. What happens?",
        code: "diff ← [0, 0, 0, 0, 0]   // length n = 5\nfunction add_range(diff, l, r, val):\n    diff[l] ← diff[l] + val\n    diff[r + 1] ← diff[r + 1] - val",
        options: [
          { id: "a", label: "Final sweep produces [0, 3, 3, 3, 0], dropping index 4" },
          { id: "b", label: "Out-of-bounds crash on diff[5] because r + 1 equals n" },
          { id: "c", label: "Final sweep produces [0, 3, 3, 3, 3] with no error" },
          { id: "d", label: "diff[4] becomes -3 instead of 0" },
        ],
        correctId: "b",
        explanation: "When an update touches the last index r = n - 1, writing diff[r + 1] accesses index n. Allocating diff with length n + 1 (or guarding r + 1 < n) prevents the out-of-bounds write.",
      },
    ],
    practiceTask: {
      title: "Batch Range Sum Queries",
      tier: "Warmup",
      goal: "Given integer array `nums` and a list of inclusive queries `[l, r]`, build a prefix sum array once and return the answer to every query in `O(1)` per query.",
      constraints: ["1 <= len(nums) <= 10^5", "1 <= len(queries) <= 10^5", "0 <= l <= r < len(nums)", "Target: O(n + q) time"],
      examples: [
        { input: "nums = [4, -2, 7, 1, 5], queries = [[0, 2], [1, 4], [3, 3]]", output: "[9, 11, 1]" },
        { input: "nums = [-5, 3, 0, -2], queries = [[0, 3], [0, 0], [2, 3]]", output: "[-4, -5, -2]", explanation: "Handles negative values, single-index [0, 0], and full-array queries via pref[r + 1] - pref[l]." },
      ],
      tasks: [
        "Build `pref` of length `n + 1` with `pref[0] = 0` and `pref[i + 1] = pref[i] + nums[i]`.",
        "For each `[l, r]`, append `pref[r + 1] - pref[l]` to the result list.",
      ],
      starterCode: "function answer_range_sums(nums, queries):\n    // TODO: precompute pref of length n + 1 and answer each [l, r]",
      expectedOutput: "[9, 11, 1]\n[-4, -5, -2]",
      hint: "Padding `pref[0] = 0` handles `l = 0` queries with the exact same `pref[r + 1] - pref[l]` formula.",
      complexity: { time: "O(n + q)", space: "O(n)" },
      solutionCode: "function answer_range_sums(nums, queries):\n    n ← len(nums)\n    pref ← array of length n + 1 filled with 0\n    for i from 0 to n - 1:\n        pref[i + 1] ← pref[i] + nums[i]\n    ans ← []\n    for each [l, r] in queries:\n        ans.append(pref[r + 1] - pref[l])\n    return ans",
    },
    practiceChallenges: [
      {
        title: "Batch Range Sum Queries",
        tier: "Warmup",
        goal: "Build a `1D` prefix sum array and answer every inclusive `[l, r]` query in `O(1)` time.",
        constraints: ["1 <= n, q <= 10^5", "Target: O(n + q) time, O(n) space"],
        examples: [
          { input: "nums = [4, -2, 7, 1, 5], queries = [[0, 2], [1, 4], [3, 3]]", output: "[9, 11, 1]" },
          { input: "nums = [-5, 3, 0, -2], queries = [[0, 3], [0, 0], [2, 3]]", output: "[-4, -5, -2]", explanation: "Handles negative values, single-index [0, 0], and full-array queries via pref[r + 1] - pref[l]." },
        ],
        tasks: ["Construct `pref[0..n]` and evaluate `pref[r + 1] - pref[l]` for each query."],
        starterCode: "function answer_range_sums(nums, queries):\n    // TODO: precompute pref and answer queries",
        expectedOutput: "[9, 11, 1]\n[-4, -5, -2]",
        hint: "Never loop from `l` to `r` inside the query loop.",
        complexity: { time: "O(n + q)", space: "O(n)" },
        solutionCode: "function answer_range_sums(nums, queries):\n    n ← len(nums)\n    pref ← array of length n + 1 filled with 0\n    for i from 0 to n - 1:\n        pref[i + 1] ← pref[i] + nums[i]\n    ans ← []\n    for each [l, r] in queries:\n        ans.append(pref[r + 1] - pref[l])\n    return ans",
      },
      {
        title: "Leftmost Pivot Index",
        tier: "Core",
        goal: "Return the smallest index `i` where the sum of elements strictly to the left of `i` equals the sum strictly to the right of `i`, or `-1` if none exists.",
        constraints: ["1 <= len(nums) <= 10^5", "-10^4 <= nums[i] <= 10^4", "Target: O(n) time, O(1) extra space"],
        examples: [
          { input: "nums = [1, 7, 3, 6, 5, 6]", output: "3", explanation: "1 + 7 + 3 = 11 == 5 + 6." },
          { input: "nums = [2, 1, -1]", output: "0", explanation: "Left of 0 is 0; right is 1 + (-1) = 0." },
        ],
        tasks: [
          "Compute `total` once in an initial pass.",
          "Scan `i` from `0` to `n - 1` tracking `left_sum`, checking `left_sum == total - left_sum - nums[i]` before adding `nums[i]`.",
        ],
        starterCode: "function pivot_index(nums):\n    // TODO: find leftmost equilibrium index in O(1) extra space",
        expectedOutput: "3\n0",
        hint: "Elements at index `0` have an empty left side (sum `0`), and elements at `n - 1` have an empty right side (sum `0`).",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode: "function pivot_index(nums):\n    total ← 0\n    for each x in nums:\n        total ← total + x\n    left_sum ← 0\n    for i from 0 to len(nums) - 1:\n        if left_sum == total - left_sum - nums[i]:\n            return i\n        left_sum ← left_sum + nums[i]\n    return -1",
      },
      {
        title: "Batch Interval Additions",
        tier: "Stretch",
        goal: "Start with `n` zeros, apply `updates` of `[l, r, val]` (adding `val` to every index in `[l..r]`), and return the final length-`n` array in `O(n + q)` time.",
        constraints: ["1 <= n <= 10^5", "0 <= len(updates) <= 10^5", "0 <= l <= r < n", "Target: O(n + q) time"],
        examples: [
          { input: "n = 5, updates = [[1, 3, 2], [2, 4, 3], [0, 2, -2]]", output: "[-2, 0, 3, 5, 3]" },
          { input: "n = 4, updates = [[0, 3, 5], [1, 2, -5], [3, 3, 2]]", output: "[5, 0, 0, 7]", explanation: "Negative updates cancel the middle slice while a single-index update touches [3, 3] at the end boundary." },
        ],
        tasks: [
          "Allocate `diff` of size `n + 1` initialized to `0`.",
          "Apply `diff[l] += val` and `diff[r + 1] -= val` for each update, then sweep `0..n - 1` with a running sum.",
        ],
        starterCode: "function apply_range_additions(n, updates):\n    // TODO: difference array updates + single prefix sweep",
        expectedOutput: "[-2, 0, 3, 5, 3]\n[5, 0, 0, 7]",
        hint: "Return only the first `n` values from the sweep; slot `diff[n]` exists only to catch `r = n - 1`.",
        complexity: { time: "O(n + q)", space: "O(n)" },
        solutionCode: "function apply_range_additions(n, updates):\n    diff ← array of length n + 1 filled with 0\n    for each [l, r, val] in updates:\n        diff[l] ← diff[l] + val\n        diff[r + 1] ← diff[r + 1] - val\n    out ← array of length n filled with 0\n    running ← 0\n    for i from 0 to n - 1:\n        running ← running + diff[i]\n        out[i] ← running\n    return out",
      },
    ],
  },
};

export const dsaM03PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m3",
  title: "Module 03 Practice Set: Arrays & Prefix Patterns",
  description:
    "Four mixed array problems covering in-place compaction without quadratic shifting, dynamic buffer growth, single-pass optimal streaks, and bulk interval tallies.",
  problems: [
    {
      id: "dsa-m3-p1",
      title: "Shift-Free Zero Compaction",
      patternHint: "Maintain a slow write index while scanning forward once instead of calling erase/pop inside a loop (Lessons 03-1 & 03-2).",
      lessonRefId: "dsa-static-arrays",
      goal: "Given integer array `readings`, move all `0` values to the end while keeping the relative order of all non-zero readings intact, in-place in `O(n)` time and `O(1)` extra space.",
      constraints: ["1 <= len(readings) <= 10^5", "Must modify `readings` in-place", "Do not use pop/erase inside a loop"],
      examples: [
        { input: "readings = [0, 4, 0, 12, -3]", output: "[4, 12, -3, 0, 0]" },
        { input: "readings = [7, 8]", output: "[7, 8]" },
      ],
      tasks: [
        "Keep write pointer `w = 0` and scan `r` from `0` to `n - 1`.",
        "Whenever `readings[r] != 0`, write `readings[r]` into `readings[w]` (or swap `readings[w]` and `readings[r]`) and increment `w`, then zero-fill `w..n - 1`.",
      ],
      starterCode: "function move_zeros_end(readings):\n    // TODO: compact non-zeros to front in O(n) time, O(1) space",
      expectedOutput: "[4, 12, -3, 0, 0]\n[7, 8]",
      hint: "Copying non-zero items to `readings[w]` and filling `w..n - 1` with `0` performs at most `2n` writes with zero shifting.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode: "function move_zeros_end(readings):\n    w ← 0\n    for r from 0 to len(readings) - 1:\n        if readings[r] != 0:\n            readings[w] ← readings[r]\n            w ← w + 1\n    for i from w to len(readings) - 1:\n        readings[i] ← 0\n    return readings",
    },
    {
      id: "dsa-m3-p2",
      title: "Event Buffer Copy Counter",
      patternHint: "Track live size, doubling capacity, and copy cost on reallocation across a stream of appends and tail pops (Lesson 03-2).",
      lessonRefId: "dsa-dynamic-arrays",
      goal: "An event buffer starts with `size = 0` and `capacity = 1`. Process `events` (`+1` appends one item; `-1` pops the newest item if `size > 0`). Whenever `+1` arrives while `size == capacity`, double `capacity` and copy all `size` existing items. Return `(final_size, final_capacity, total_copied)`.",
      constraints: ["1 <= len(events) <= 10^5", "Capacity never shrinks on -1", "Target: O(len(events)) time, O(1) space"],
      examples: [
        { input: "events = [1, 1, -1, 1, 1]", output: "(3, 4, 3)", explanation: "Resizes happen before 2nd push (copies 1, cap->2) and 4th push (copies 2, cap->4)." },
        { input: "events = [-1, 1, -1, 1, 1]", output: "(2, 2, 1)", explanation: "Leading pop on empty buffer is ignored; popping before the 3rd push drops size to 0 before only 1 resize copy." },
      ],
      tasks: [
        "On `+1`: if `size == capacity`, add `size` to `copied` and double `capacity`; then increment `size`.",
        "On `-1`: if `size > 0`, decrement `size` without changing `capacity`.",
      ],
      starterCode: "function simulate_event_buffer(events):\n    // TODO: return (size, capacity, total_copied)",
      expectedOutput: "(3, 4, 3)\n(2, 2, 1)",
      hint: "The `-1` event drops the back item in `O(1)` with `0` copies and leaves spare capacity intact.",
      complexity: { time: "O(len(events))", space: "O(1)" },
      solutionCode: "function simulate_event_buffer(events):\n    size ← 0\n    capacity ← 1\n    copied ← 0\n    for each ev in events:\n        if ev == 1:\n            if size == capacity:\n                copied ← copied + size\n                capacity ← capacity * 2\n            size ← size + 1\n        else if ev == -1 and size > 0:\n            size ← size - 1\n    return (size, capacity, copied)",
    },
    {
      id: "dsa-m3-p3",
      title: "Best Net Profit Streak",
      patternHint: "Decide at each day whether extending the current streak beats restarting fresh at today's delta (Lesson 03-3).",
      lessonRefId: "dsa-kadane-majority",
      goal: "Given daily profit/loss changes `deltas` (at least 1 day), find the highest total net profit achievable over any non-empty contiguous stretch of consecutive days.",
      constraints: ["1 <= len(deltas) <= 10^5", "-10^5 <= deltas[i] <= 10^5", "Target: O(n) time, O(1) extra space"],
      examples: [
        { input: "deltas = [3, -5, 4, 2, -1, 5, -9, 2]", output: "10", explanation: "Days [4, 2, -1, 5] sum to 10." },
        { input: "deltas = [-4, -1, -7]", output: "-1", explanation: "At least one day must be chosen." },
      ],
      tasks: [
        "Seed both `running` and `best` to `deltas[0]`.",
        "Scan `i` from `1` to `n - 1`, setting `running = max(deltas[i], running + deltas[i])` and updating `best`.",
      ],
      starterCode: "function best_profit_streak(deltas):\n    // TODO: single O(n) scan returning highest non-empty contiguous sum",
      expectedOutput: "10\n-1",
      hint: "If `running` turns negative before day `i`, restarting at `deltas[i]` always beats carrying the negative sum forward.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode: "function best_profit_streak(deltas):\n    running ← deltas[0]\n    best ← deltas[0]\n    for i from 1 to len(deltas) - 1:\n        running ← max(deltas[i], running + deltas[i])\n        if running > best:\n            best ← running\n    return best",
    },
    {
      id: "dsa-m3-p4",
      title: "Slot Reservation Tally",
      patternHint: "Mark only interval entry and exit deltas in an (n + 1)-slot buffer, then sweep once (Lesson 03-4).",
      lessonRefId: "dsa-prefix-sums",
      goal: "A venue has `n` time slots numbered `0` to `n - 1`. Given `bookings` where each entry `[first, last, guests]` reserves `guests` seats across every slot from `first` through `last` inclusive, return the final total guests per slot.",
      constraints: ["1 <= n <= 10^5", "0 <= len(bookings) <= 10^5", "0 <= first <= last < n", "Target: O(n + q) time"],
      examples: [
        { input: "n = 5, bookings = [[0, 2, 10], [1, 4, 5], [2, 2, 3]]", output: "[10, 15, 18, 5, 5]" },
        { input: "n = 4, bookings = [[3, 3, 7], [0, 1, 4]]", output: "[4, 4, 0, 7]", explanation: "Booking at slot 3 uses diff[n], while slot 2 keeps 0." },
      ],
      tasks: [
        "Record `+guests` at `diff[first]` and `-guests` at `diff[last + 1]` in an `(n + 1)`-slot array.",
        "Run one cumulative sum sweep across `0..n - 1` to populate the final guest counts.",
      ],
      starterCode: "function tally_slot_reservations(n, bookings):\n    // TODO: compute final guests per slot in O(n + q) time",
      expectedOutput: "[10, 15, 18, 5, 5]\n[4, 4, 0, 7]",
      hint: "Allocating `diff` of length `n + 1` lets `last = n - 1` write `-guests` to `diff[n]` without bounds errors.",
      complexity: { time: "O(n + q)", space: "O(n)" },
      solutionCode: "function tally_slot_reservations(n, bookings):\n    diff ← array of length n + 1 filled with 0\n    for each [first, last, guests] in bookings:\n        diff[first] ← diff[first] + guests\n        diff[last + 1] ← diff[last + 1] - guests\n    totals ← array of length n filled with 0\n    running ← 0\n    for i from 0 to n - 1:\n        running ← running + diff[i]\n        totals[i] ← running\n    return totals",
    },
  ],
};
