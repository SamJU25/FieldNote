import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM07Lessons: Record<string, LessonContent> = {
  "dsa-opposite-pointers": {
    lessonId: "dsa-opposite-pointers",
    subtitle:
      "Converge left and right indices from both ends of an array or string to reverse, validate symmetry, and find sorted pairs in O(1) extra space.",
    intro: {
      heading: "Opposite-End Two Pointers",
      explanation: [
        "Checking all `(i, j)` pairs in nested loops takes `O(n^2)` time, and building filtered string copies wastes `O(n)` extra memory. Even with two pointers, running `left < right` on an unsorted array skips valid matches (`[15, 2, 11, 5], target = 13` discards `5` on step 1 and misses `2 + 11`), while writing `left <= right` on Two-Sum allows pairing an element with itself.",
        "Placing `left = 0` and `right = n - 1` at opposite ends and stepping inward solves array reversal, punctuation-skipping palindrome checks, and Sorted Two-Sum II in `O(n)` time and `O(1)` extra space—every step eliminates an entire row or column of candidate pairs without losing a valid solution.",
      ],
      analogy:
        "Two people start at opposite ends of a sorted bookshelf and walk toward each other: to swap books symmetrically they step one slot inward together, and to hit an exact combined page count they step right from the light side when too low or left from the heavy side when too high.",
      realWorldUses: [
        "Reversing byte buffers, audio frames, or text lines in-place when extra heap allocations are expensive",
        "Matching pairs in pre-sorted time-series logs or sorted price lists in linear time and constant space",
      ],
    },
    sections: [
      {
        heading: "Converging inward: reversing and skipping non-alphanumeric chars",
        paragraphs: [
          "To reverse an array `arr` in-place, initialize `left = 0` and `right = len(arr) - 1`. While `left < right`, call `swap(arr, left, right)` (`arr[left], arr[right] = arr[right], arr[left]` in Python 3) to exchange both ends in-place, then increment `left += 1` and decrement `right -= 1`. Each element moves at most once, taking `O(n)` time and `O(1)` extra space.",
          "The exact same inward loop checks whether a messy string `s` is an alphanumeric palindrome. Whenever `s[left]` or `s[right]` is punctuation or whitespace, skip it with an inner `while` loop guarded by `left < right` using `is_alnum(ch)` (`ch.isalnum()` in Python 3). Once both pointers rest on letters or digits, compare their lowercase characters (`to_lower(ch)` / `ch.lower()` in Python 3): any mismatch returns `false` immediately.",
        ],
        code: [
          "function reverse_in_place(arr):",
          "    left ← 0",
          "    right ← len(arr) - 1",
          "    while left < right:",
          "        swap(arr, left, right)",
          "        left ← left + 1",
          "        right ← right - 1",
          "",
          "function is_alnum_palindrome(s):",
          "    left ← 0",
          "    right ← len(s) - 1",
          "    while left < right:",
          "        while left < right and not is_alnum(s[left]):",
          "            left ← left + 1",
          "        while left < right and not is_alnum(s[right]):",
          "            right ← right - 1",
          "        if to_lower(s[left]) != to_lower(s[right]):",
          "            return false",
          "        left ← left + 1",
          "        right ← right - 1",
          "    return true",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Opposite-end two-pointer patterns at a glance",
          headers: ["Problem", "Loop guard", "Pointer update rule", "Complexity"],
          rows: [
            ["Reverse array", "left < right", "Swap ends, then left += 1, right -= 1", "O(n) time, O(1) space"],
            ["Valid alphanumeric palindrome", "left < right", "Skip non-alnum inside left < right, compare lowercase", "O(n) time, O(1) space"],
            ["Sorted Two-Sum II", "left < right", "sum < target -> left += 1; sum > target -> right -= 1", "O(n) time, O(1) space"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Stopping at `left < right` handles both even and odd lengths automatically: for an odd-length array, the lone middle element meets itself when `left == right` and needs neither a swap nor a self-comparison.",
        },
      },
      {
        heading: "Sorted Two-Sum II: why eliminating an endpoint cannot miss an answer",
        paragraphs: [
          "Suppose `nums` is already sorted in non-decreasing order (general sorting algorithms are covered later in M11) and we want two distinct indices `left < right` with `nums[left] + nums[right] == target`. Trace `[2, 5, 7, 11, 15], target = 16`: `2 + 15 = 17 > 16` (`right -> 3`), `2 + 11 = 13 < 16` (`left -> 1`), `5 + 11 = 16` -> `[1, 3]`.",
          "Why does advancing `left += 1` when `total < target` never miss an answer? Because `nums[right]` is the largest value still in `[left .. right]`. For every `j` with `left < j < right`, sorted order guarantees `nums[left] + nums[j] <= nums[left] + nums[right] < target`, so `nums[left]` cannot reach `target` with any remaining partner. (On unsorted `[15, 2, 11, 5], target = 13`, `15 + 5 = 20 > 13` would wrongly discard `5` and miss `2 + 11`, proving sorted order is required!)",
          "Symmetrically, when `total > target`, `nums[left]` is the smallest value still in `[left .. right]`. Every `i` with `left < i < right` satisfies `nums[i] + nums[right] >= nums[left] + nums[right] > target`, so `right -= 1` discards `nums[right]` without losing any valid pair.",
        ],
        code: [
          "function sorted_two_sum(nums, target):",
          "    left ← 0",
          "    right ← len(nums) - 1",
          "    while left < right:",
          "        total ← nums[left] + nums[right]",
          "        if total == target:",
          "            return [left, right]",
          "        else if total < target:",
          "            left ← left + 1",
          "        else:",
          "            right ← right - 1",
          "    return []",
        ],
        codeLabel: "Pseudocode",
        callout: {
          kind: "RULE OF THUMB",
          text: "Every pointer move in Sorted Two-Sum II eliminates an entire row or column of candidate pairs because monotonicity proves none of those pairs can ever equal `target`.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From O(n^2) Pair Loops to Converging Two-Pointer Scans",
      steps: [
        {
          label: "Step 1: Naive O(n^2) nested pair loop",
          explanation: "Testing every `(i, j)` pair with `i < j` works without sorting, at `O(n^2)` cost.",
          code: [
            "function two_sum_naive(nums, target):",
            "    for i from 0 to len(nums) - 2:",
            "        for j from i + 1 to len(nums) - 1:",
            "            if nums[i] + nums[j] == target: return [i, j]",
            "    return []",
          ],
          activeLines: [2, 3, 4],
          output: "O(n^2) checks",
        },
        {
          label: "Step 2: Converge left and right on sorted input (O(n))",
          explanation: "Start at `left = 0` and `right = n - 1` under `while left < right` so an index never pairs with itself.",
          code: [
            "function sorted_two_sum(nums, target):",
            "    left ← 0; right ← len(nums) - 1",
            "    while left < right:",
            "        total ← nums[left] + nums[right]",
            "        if total == target: return [left, right]",
            "        if total < target: left += 1",
            "        else: right -= 1",
            "    return []",
          ],
          activeLines: [3, 6, 7],
          output: "sorted_two_sum([2,5,7,11,15], 16) -> [1, 3]",
        },
        {
          label: "Step 3: Guard inner punctuation skips with left < right",
          explanation: "Keep `left < right` inside both inner `while` loops so punctuation-only strings never walk out of bounds.",
          code: [
            "function is_alnum_palindrome(s):",
            "    left ← 0; right ← len(s) - 1",
            "    while left < right:",
            "        while left < right and not is_alnum(s[left]): left += 1",
            "        while left < right and not is_alnum(s[right]): right -= 1",
            "        if to_lower(s[left]) != to_lower(s[right]): return false",
            "        left += 1; right -= 1",
            "    return true",
          ],
          activeLines: [4, 5],
          output: "is_alnum_palindrome(\"A man, a plan, a canal: Panama\") -> true",
        },
      ],
    },
    walkthrough: {
      title: "Trace Sorted Two-Sum II on [2, 5, 7, 11, 15] with target = 16",
      layout: "visual-first",
      steps: [
        {
          title: "Start at the extremes: smallest and largest values",
          tag: "CONCEPT",
          explanation: [
            "Initialize `left = 0` (`2`) and `right = 4` (`15`). We want two distinct indices summing to `16`.",
            "The first candidate pair gives `2 + 15 = 17`, which overshoots `target = 16`.",
          ],
          code: [
            "left ← 0; right ← len(nums) - 1",
            "while left < right:",
            "    total ← nums[left] + nums[right]",
            "    if total == target: return [left, right]",
            "    else if total < target: left ← left + 1",
            "    else: right ← right - 1",
          ],
          activeLines: [1, 3, 6],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "left, right = 0, len(nums) - 1",
              "while left < right:",
              "    total = nums[left] + nums[right]",
              "    if total == target: return [left, right]",
              "    elif total < target: left += 1",
              "    else: right -= 1",
            ],
          },
          state: [
            { name: "left", value: "0 (val = 2)" },
            { name: "right", value: "4 (val = 15)" },
            { name: "total", value: "17 > 16", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Sorted nums, target = 16",
                cells: [
                  { id: "p0", value: "2", index: 0, state: "active" },
                  { id: "p1", value: "5", index: 1 },
                  { id: "p2", value: "7", index: 2 },
                  { id: "p3", value: "11", index: 3 },
                  { id: "p4", value: "15", index: 4, state: "pivot" },
                ],
                pointers: [
                  { index: 0, label: "left", tone: "accent" },
                  { index: 4, label: "right", tone: "coral" },
                ],
              },
            ],
            caption: "2 + 15 = 17 exceeds 16; pairing 15 with any element >= 2 is also > 16.",
          },
        },
        {
          title: "Discard 15 by decrementing right",
          tag: "TRACE",
          explanation: [
            "Since `total = 17 > 16`, `15` paired with any larger index `i > 0` would still be `>= 17`. We mark index `4` eliminated and step `right` to `3` (`11`).",
            "Now `total = 2 + 11 = 13`, which is smaller than `16`.",
          ],
          code: [
            "left ← 0; right ← len(nums) - 1",
            "while left < right:",
            "    total ← nums[left] + nums[right]",
            "    if total == target: return [left, right]",
            "    else if total < target: left ← left + 1",
            "    else: right ← right - 1",
          ],
          activeLines: [2, 3, 5, 6],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "left, right = 0, len(nums) - 1",
              "while left < right:",
              "    total = nums[left] + nums[right]",
              "    if total == target: return [left, right]",
              "    elif total < target: left += 1",
              "    else: right -= 1",
            ],
          },
          state: [
            { name: "left", value: "0 (val = 2)" },
            { name: "right", value: "3 (val = 11)", changed: true },
            { name: "total", value: "13 < 16", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Sorted nums, target = 16",
                cells: [
                  { id: "p0", value: "2", index: 0, state: "active" },
                  { id: "p1", value: "5", index: 1 },
                  { id: "p2", value: "7", index: 2 },
                  { id: "p3", value: "11", index: 3, state: "pivot" },
                  { id: "p4", value: "15", index: 4, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "left", tone: "accent" },
                  { index: 3, label: "right", tone: "coral" },
                ],
              },
            ],
            caption: "15 is eliminated. Now 2 + 11 = 13 is too small, so 2 cannot reach 16 with any index <= 3.",
          },
        },
        {
          title: "Discard 2 by incrementing left",
          tag: "TRACE",
          explanation: [
            "Because `11` is the largest value remaining, pairing `2` with any index `j < 3` yields at most `13 < 16`.",
            "Eliminate index `0` and advance `left` to `1` (`5`). Check the new sum: `5 + 11 = 16`.",
          ],
          code: [
            "left ← 0; right ← len(nums) - 1",
            "while left < right:",
            "    total ← nums[left] + nums[right]",
            "    if total == target: return [left, right]",
            "    else if total < target: left ← left + 1",
            "    else: right ← right - 1",
          ],
          activeLines: [2, 3, 4, 5],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "left, right = 0, len(nums) - 1",
              "while left < right:",
              "    total = nums[left] + nums[right]",
              "    if total == target: return [left, right]",
              "    elif total < target: left += 1",
              "    else: right -= 1",
            ],
          },
          state: [
            { name: "left", value: "1 (val = 5)", changed: true },
            { name: "right", value: "3 (val = 11)" },
            { name: "total", value: "16 == 16", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Sorted nums, target = 16",
                cells: [
                  { id: "p0", value: "2", index: 0, state: "dim" },
                  { id: "p1", value: "5", index: 1, state: "active" },
                  { id: "p2", value: "7", index: 2 },
                  { id: "p3", value: "11", index: 3, state: "active" },
                  { id: "p4", value: "15", index: 4, state: "dim" },
                ],
                pointers: [
                  { index: 1, label: "left", tone: "ok" },
                  { index: 3, label: "right", tone: "ok" },
                ],
              },
            ],
            caption: "Exact match found at indices [1, 3] because 5 + 11 = 16.",
          },
        },
        {
          title: "Confirm result in O(n) time and O(1) space",
          tag: "CHECK",
          explanation: [
            "Return `[1, 3]` immediately. Out of `10` possible pairs, the inward sweep only evaluated `3` sums.",
            "Only two integer indices (`left` and `right`) were allocated, keeping auxiliary memory at `O(1)`.",
          ],
          code: [
            "left ← 0; right ← len(nums) - 1",
            "while left < right:",
            "    total ← nums[left] + nums[right]",
            "    if total == target: return [left, right]",
            "    else if total < target: left ← left + 1",
            "    else: right ← right - 1",
          ],
          activeLines: [4],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "left, right = 0, len(nums) - 1",
              "while left < right:",
              "    total = nums[left] + nums[right]",
              "    if total == target: return [left, right]",
              "    elif total < target: left += 1",
              "    else: right -= 1",
            ],
          },
          state: [
            { name: "Result", value: "[1, 3]", changed: true },
            { name: "Checks run", value: "3 (vs 10 pairs)" },
            { name: "Extra space", value: "O(1)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Match locked: nums[1] + nums[3] = 16",
                cells: [
                  { id: "p0", value: "2", index: 0, state: "dim" },
                  { id: "p1", value: "5", index: 1, state: "done" },
                  { id: "p2", value: "7", index: 2, state: "dim" },
                  { id: "p3", value: "11", index: 3, state: "done" },
                  { id: "p4", value: "15", index: 4, state: "dim" },
                ],
                pointers: [
                  { index: 1, label: "ans[0] = 1", tone: "ok" },
                  { index: 3, label: "ans[1] = 3", tone: "ok" },
                ],
              },
            ],
            caption: "Opposite-end convergence guarantees O(n) worst-case steps on any sorted input.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Missing `left < right` inside punctuation-skipping loops",
        detail:
          "If `s` contains only punctuation such as `\"...\"`, writing `while not is_alnum(s[left]): left += 1` without `left < right` runs past the end of the string and crashes. Always guard inner skips with `left < right`.",
      },
      {
        title: "Using `left <= right` in Two-Sum",
        detail:
          "In Two-Sum, you need two distinct indices. Allowing `left <= right` lets `left == right` add `nums[i] + nums[i]` against itself when `target == 2 * nums[i]`. Stick to `while left < right`.",
      },
      {
        title: "Applying Sorted Two-Sum to an unsorted array",
        detail:
          "Moving `right -= 1` only lowers the sum when `nums` is non-decreasing. On unsorted inputs, use a hash map (M06) for `O(n)` time, or wait until M11 covers sorting algorithms.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does this buggy sorted Two-Sum return for nums = [2, 5, 9], target = 10?",
        code: "left ← 0; right ← len(nums) - 1\nwhile left <= right:\n    total ← nums[left] + nums[right]\n    if total == target: return [left, right]\n    if total < target: left ← left + 1\n    else: right ← right - 1\nreturn [-1, -1]",
        options: [
          { id: "a", label: "[-1, -1]" },
          { id: "b", label: "[1, 1] (reuses index 1 twice)" },
          { id: "c", label: "[0, 2]" },
          { id: "d", label: "Infinite loop at left = 1, right = 1" },
        ],
        correctId: "b",
        explanation: "Using left <= right lets both pointers meet at index 1 and add nums[1] + nums[1] = 10. Two distinct indices require strictly left < right.",
      },
      {
        prompt: "What happens when this palindrome checker runs on s = \"...\" (length 3, all dots)?",
        code: "left ← 0; right ← len(s) - 1\nwhile left < right:\n    while not is_alnum(s[left]):\n        left ← left + 1\n    while not is_alnum(s[right]):\n        right ← right - 1\n    if to_lower(s[left]) != to_lower(s[right]): return false\n    left ← left + 1; right ← right - 1\nreturn true",
        options: [
          { id: "a", label: "Returns true after left crosses right at index 1" },
          { id: "b", label: "Returns false when left equals right" },
          { id: "c", label: "Index out-of-bounds crash because left advances past index 2" },
          { id: "d", label: "Infinite loop on s[0]" },
        ],
        correctId: "c",
        explanation: "Without a left < right guard inside the inner skip loop, an all-punctuation string drives left past len(s) - 1 and crashes reading s[3].",
      },
    ],
    practiceTask: {
      title: "Reverse Character Array In-Place",
      tier: "Warmup",
      goal: "Reverse an array of characters `chars` directly in-place using `O(1)` extra memory.",
      constraints: ["0 <= len(chars) <= 10^5", "Modify chars in-place", "Target: O(n) time, O(1) extra space"],
      examples: [
        { input: "chars = ['h', 'e', 'l', 'l', 'o']", output: "['o', 'l', 'l', 'e', 'h']" },
        { input: "chars = ['a', 'b', 'c', 'd']", output: "['d', 'c', 'b', 'a']" },
      ],
      tasks: [
        "Set `left = 0` and `right = len(chars) - 1`.",
        "While `left < right`, swap `chars[left]` with `chars[right]`, then increment `left` and decrement `right`.",
      ],
      starterCode: "function reverse_chars(chars):\n    // TODO: swap opposite ends inward in O(1) space",
      expectedOutput: "['o', 'l', 'l', 'e', 'h']\n['d', 'c', 'b', 'a']",
      hint: "Use a single temporary variable `tmp` to swap `chars[left]` and `chars[right]`, then move both pointers one step inward.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function reverse_chars(chars):\n    left ← 0\n    right ← len(chars) - 1\n    while left < right:\n        tmp ← chars[left]\n        chars[left] ← chars[right]\n        chars[right] ← tmp\n        left ← left + 1\n        right ← right - 1\n    return chars",
    },
    practiceChallenges: [
      {
        title: "Reverse Character Array In-Place",
        tier: "Warmup",
        goal: "Reverse `chars` in-place without allocating a second array.",
        constraints: ["0 <= len(chars) <= 10^5", "Target: O(n) time, O(1) extra space"],
        examples: [
          { input: "chars = ['h', 'e', 'l', 'l', 'o']", output: "['o', 'l', 'l', 'e', 'h']" },
          { input: "chars = ['a', 'b', 'c', 'd']", output: "['d', 'c', 'b', 'a']" },
        ],
        tasks: ["Swap `chars[left]` and `chars[right]` while `left < right`."],
        starterCode: "function reverse_chars(chars):\n    // TODO: reverse chars in-place",
        expectedOutput: "['o', 'l', 'l', 'e', 'h']\n['d', 'c', 'b', 'a']",
        hint: "When `left == right` on odd-length inputs, the center character stays where it is.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function reverse_chars(chars):\n    left ← 0\n    right ← len(chars) - 1\n    while left < right:\n        tmp ← chars[left]\n        chars[left] ← chars[right]\n        chars[right] ← tmp\n        left ← left + 1\n        right ← right - 1\n    return chars",
      },
      {
        title: "Alphanumeric Palindrome Validator",
        tier: "Core",
        goal: "Return `true` if string `s` reads the same forward and backward when considering only ASCII letters and digits (case-insensitive), using `O(1)` extra space.",
        constraints: ["0 <= len(s) <= 10^5", "Do not build a filtered string copy", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "s = \"A man, a plan, a canal: Panama\"", output: "true" },
          { input: "s = \"race a car\"", output: "false" },
          { input: "s = \".,!\"", output: "true", explanation: "Zero alphanumeric characters form an empty palindrome." },
        ],
        tasks: [
          "Advance `left` over non-alphanumeric characters while `left < right`.",
          "Retreat `right` over non-alphanumeric characters while `left < right`.",
          "Compare lowercase versions of `s[left]` and `s[right]`, returning `false` on mismatch.",
        ],
        starterCode: "function is_valid_palindrome(s):\n    // TODO: check symmetry in O(1) extra space",
        expectedOutput: "true\nfalse\ntrue",
        hint: "Check `'a' <= ch <= 'z'`, `'A' <= ch <= 'Z'`, or `'0' <= ch <= '9'` for alphanumeric characters, and normalize uppercase letters with `+32` ASCII offset.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function is_valid_palindrome(s):\n    left ← 0\n    right ← len(s) - 1\n    while left < right:\n        while left < right and not is_alnum(s[left]):\n            left ← left + 1\n        while left < right and not is_alnum(s[right]):\n            right ← right - 1\n        if to_lower(s[left]) != to_lower(s[right]):\n            return false\n        left ← left + 1\n        right ← right - 1\n    return true",
      },
      {
        title: "Closest Sorted Pair Sum",
        tier: "Stretch",
        goal: "Given a non-decreasing integer array `nums` (`length >= 2`) and integer `target`, return the sum `nums[i] + nums[j]` (`i < j`) closest to `target` (if tied, return the smaller sum) in `O(n)` time and `O(1)` space.",
        constraints: ["2 <= len(nums) <= 10^5", "nums is already sorted non-decreasing", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [-4, -1, 2, 5, 9], target = 3", output: "4", explanation: "-1 + 5 = 4 is distance 1 from 3 (and -4 + 9 = 5 is distance 2; -1 + 2 = 1 is distance 2)." },
          { input: "nums = [1, 3, 4, 7], target = 8", output: "8", explanation: "1 + 7 = 8 hits target exactly." },
        ],
        tasks: [
          "Initialize `best = nums[0] + nums[len(nums) - 1]`.",
          "At each `(left, right)`, compute `curr = nums[left] + nums[right]` and update `best` if `abs(curr - target) < abs(best - target)` (or equal distance with `curr < best`).",
          "Return `curr` immediately if `curr == target`; move `left += 1` if `curr < target`, else `right -= 1`.",
        ],
        starterCode: "function closest_sorted_pair_sum(nums, target):\n    // TODO: track closest pair sum in one inward pass",
        expectedOutput: "4\n8",
        hint: "Unlike exact Two-Sum, update `best` before deciding whether to move `left` or `right`, because the closest pair might not equal `target`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function closest_sorted_pair_sum(nums, target):\n    left ← 0\n    right ← len(nums) - 1\n    best ← nums[left] + nums[right]\n    while left < right:\n        curr ← nums[left] + nums[right]\n        diff_curr ← abs(curr - target)\n        diff_best ← abs(best - target)\n        if diff_curr < diff_best or (diff_curr == diff_best and curr < best):\n            best ← curr\n        if curr == target:\n            return curr\n        else if curr < target:\n            left ← left + 1\n        else:\n            right ← right - 1\n    return best",
      },
    ],
  },

  "dsa-read-write-pointers": {
    lessonId: "dsa-read-write-pointers",
    subtitle:
      "Use slow/fast read-write pointers to compact arrays in-place and extend to 3 pointers (lo, mid, hi) to partition three values in one pass.",
    intro: {
      heading: "Read/Write Compaction & 3-Way Partition",
      explanation: [
        "In-place filtering breaks in two classic ways: writing without preserving `write <= read` clobbers unread elements, and comparing `nums[read]` to `nums[read - 1]` instead of `nums[write - 1]` breaks once earlier overwrites shift values. On 3-way Dutch National Flag partitioning (`[2, 0, 1]`), advancing `mid += 1` right after swapping a `2` with `hi` skips the swapped-in `0` or `1` from the unexamined back zone.",
        "Keeping `write <= read` guarantees `nums[0 .. write - 1]` holds only finalized items while `nums[read .. n - 1]` stays untouched. Extending to three boundaries (`lo`, `mid`, `hi`) partitions three categories (`0`, `1`, `2`) in a single `O(n)` pass and `O(1)` space by holding `mid` stationary whenever a `2` swaps from `hi`.",
      ],
      analogy:
        "Picture sorting boxes on a conveyor belt with a single writing desk: `read` inspects the next arriving box, while `write` only advances when a box is kept. For three colors, you keep red at the left, blue at the right, and let white settle in the middle.",
      realWorldUses: [
        "Deduplicating sorted log timestamps or database keys in-place without allocating a second buffer",
        "Implementing 3-way pivot partitioning to group duplicate keys in a single linear sweep",
      ],
    },
    sections: [
      {
        heading: "Same-direction read/write compaction: deduplicate and move zeros",
        paragraphs: [
          "The core rule of same-direction compaction is `write <= read`: `nums[0 .. write - 1]` is finalized, while `nums[read .. n - 1]` is untouched input. Trace `remove_duplicates_sorted([1, 1, 2, 2, 3])` starting at `write = 1`: `read = 1` sees `1 == nums[0]` (skip); `read = 2` sees `2 != nums[0]` -> writes `nums[1] = 2`, `write = 2`; `read = 3` sees `2 == nums[1]` (skip); `read = 4` sees `3 != nums[1]` -> writes `nums[2] = 3`, `write = 3` -> prefix `[1, 2, 3]`.",
          "To move all `0`s to the back while preserving non-zero order, start `write = 0`. Whenever `nums[read] != 0`, swap `nums[write]` with `nums[read]` and increment `write += 1`. Every element in `[write .. read - 1]` is `0`, so swapping pushes non-zeros forward and shifts zeros backward in one pass.",
        ],
        code: [
          "// Broken 1: pop(0) / pop(i) shifts remaining elements left -> O(n^2) total",
          "// Broken 2: advancing write > read overwrites unread slots; comparing nums[read - 1] breaks after writes",
          "i ← 1",
          "while i < len(nums):",
          "    if nums[i] == nums[i - 1]:",
          "        nums.pop(i)           // O(n) tail shift on every duplicate",
          "    else:",
          "        i ← i + 1",
          "",
          "// Working: monotonic write <= read keeps nums[0..write-1] finalized, nums[read..n-1] untouched",
          "function remove_duplicates_sorted(nums):",
          "    n ← len(nums)",
          "    if n == 0: return 0",
          "    write ← 1",
          "    for read from 1 to n - 1:",
          "        if nums[read] != nums[write - 1]:",
          "            nums[write] ← nums[read]",
          "            write ← write + 1",
          "    return write",
          "",
          "function move_zeros(nums):",
          "    write ← 0",
          "    for read from 0 to len(nums) - 1:",
          "        if nums[read] != 0:",
          "            swap(nums, write, read)",
          "            write ← write + 1",
        ],
        codeLabel: "Pseudocode",
        output: "[1, 1, 2, 2, 3] -> pop loop: O(n^2) shifts | write/read compaction: prefix [1, 2, 3], write=3 in O(n)",
        table: {
          caption: "Comparing same-direction compaction and 3-way partitioning",
          headers: ["Algorithm", "Pointers", "Invariant maintained", "Complexity"],
          rows: [
            ["Deduplicate sorted array", "write, read", "nums[0..write-1] has unique items; write <= read", "O(n) time, O(1) space"],
            ["Move zeros to end", "write, read", "nums[0..write-1] non-zero; nums[write..read-1] all 0", "O(n) time, O(1) space"],
            ["Dutch National Flag (0/1/2)", "lo, mid, hi", "[0..lo-1]=0, [lo..mid-1]=1, [mid..hi]=unknown, [hi+1..n-1]=2", "O(n) time, O(1) space"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Comparing `nums[read]` against `nums[write - 1]` (instead of `nums[read - 1]`) works even after overwriting earlier duplicates, and extends naturally when allowing up to `k` duplicates (`nums[read] != nums[write - k]`).",
        },
      },
      {
        heading: "Dutch National Flag: 3-way partition with lo, mid, and hi",
        paragraphs: [
          "Suppose `nums` contains only `0`, `1`, and `2`, and we must group all `0`s first, `1`s second, and `2`s last in a single pass with `O(1)` extra space. Maintain three indices dividing the array into four zones: `[0 .. lo - 1]` holds `0`s, `[lo .. mid - 1]` holds `1`s, `[mid .. hi]` is the unexamined zone, and `[hi + 1 .. n - 1]` holds `2`s.",
          "Start with `lo = 0`, `mid = 0`, `hi = n - 1`, and loop `while mid <= hi`. At each step, inspect `nums[mid]`: if it is `0`, swap `nums[lo]` and `nums[mid]`, then advance both `lo += 1` and `mid += 1` (since `nums[lo]` came from the `1` zone or `lo == mid`). If `nums[mid] == 1`, advance `mid += 1`.",
          "If `nums[mid] == 2`, swap `nums[mid]` and `nums[hi]` and decrement `hi -= 1`, keeping `mid` unchanged! On `[2, 0, 1]`, swapping `mid=0` (`2`) with `hi=2` (`1`) brings `1` into `mid=0`; on `[2, 1, 0]`, swapping `mid=0` (`2`) with `hi=2` (`0`) brings `0` into `mid=0`—incrementing `mid` there would skip inspecting that `0` and leave `[0, 1, 2]` unsorted.",
        ],
        code: [
          "function sort_three_colors(nums):",
          "    lo ← 0; mid ← 0",
          "    hi ← len(nums) - 1",
          "    while mid <= hi:",
          "        if nums[mid] == 0:",
          "            swap(nums, lo, mid)",
          "            lo ← lo + 1",
          "            mid ← mid + 1",
          "        else if nums[mid] == 1:",
          "            mid ← mid + 1",
          "        else:",
          "            swap(nums, mid, hi)",
          "            hi ← hi - 1",
        ],
        codeLabel: "Pseudocode",
        callout: {
          kind: "WATCH OUT",
          text: "Why does `mid` advance after swapping a `0` with `lo` (`mid += 1`) yet stay put after swapping a `2` with `hi`? Because `[lo .. mid - 1]` is already known to contain only `1`s, whereas `nums[hi]` was unexamined!",
        },
      },
    ],
    guidedBuildUp: {
      title: "From Out-of-Place Buffers to In-Place Read/Write & 3-Way Partitions",
      steps: [
        {
          label: "Step 1: Out-of-place buffer deduplication (O(n) extra space)",
          explanation: "Appending to a new array avoids overwriting unread slots, at the cost of `O(n)` extra memory.",
          code: [
            "function dedup_copy(nums):",
            "    if len(nums) == 0: return []",
            "    out ← [nums[0]]",
            "    for read from 1 to len(nums) - 1:",
            "        if nums[read] != out[len(out) - 1]: out.append(nums[read])",
            "    return out",
          ],
          activeLines: [3, 5],
          output: "O(n) time, O(n) extra array",
        },
        {
          label: "Step 2: In-place write <= read compaction (O(1) space)",
          explanation: "Comparing `nums[read] != nums[write - 1]` overwrites only finalized slots behind `read`.",
          code: [
            "function remove_duplicates_sorted(nums):",
            "    if len(nums) == 0: return 0",
            "    write ← 1",
            "    for read from 1 to len(nums) - 1:",
            "        if nums[read] != nums[write - 1]:",
            "            nums[write] ← nums[read]",
            "            write += 1",
            "    return write",
          ],
          activeLines: [5, 6, 7],
          output: "[1,1,2,2,3] -> write=3, prefix [1,2,3]",
        },
        {
          label: "Step 3: 3-way Dutch National Flag (hold mid when swapping 2)",
          explanation: "Advance `mid` after placing `0` or `1`, but leave `mid` unchanged after swapping `2` with `hi` so the incoming item gets checked.",
          code: [
            "function sort_three_colors(nums):",
            "    lo ← 0; mid ← 0; hi ← len(nums) - 1",
            "    while mid <= hi:",
            "        if nums[mid] == 0:",
            "            swap(nums, lo, mid); lo += 1; mid += 1",
            "        else if nums[mid] == 1: mid += 1",
            "        else:",
            "            swap(nums, mid, hi); hi -= 1",
          ],
          activeLines: [5, 8],
          output: "[2,0,2,1,1,0] -> [0,0,1,1,2,2]",
        },
      ],
    },
    walkthrough: {
      title: "Trace Dutch National Flag on [2, 0, 2, 1, 1, 0]",
      layout: "visual-first",
      steps: [
        {
          title: "Initialize lo = 0, mid = 0, hi = 5",
          tag: "CONCEPT",
          explanation: [
            "All elements sit in the unknown zone `[0 .. 5]`. Inspect `nums[mid]` at index `0`, which is `2`.",
            "Since `2` belongs in the back zone `[hi + 1 .. n - 1]`, prepare to swap `mid(0)` with `hi(5)`.",
          ],
          code: [
            "while mid <= hi:",
            "    if nums[mid] == 0:",
            "        swap(nums, lo, mid); lo += 1; mid += 1",
            "    else if nums[mid] == 1:",
            "        mid += 1",
            "    else:",
            "        swap(nums, mid, hi); hi -= 1",
          ],
          activeLines: [1, 6, 7],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "while mid <= hi:",
              "    if nums[mid] == 0:",
              "        nums[lo], nums[mid] = nums[mid], nums[lo]; lo += 1; mid += 1",
              "    elif nums[mid] == 1:",
              "        mid += 1",
              "    else:",
              "        nums[mid], nums[hi] = nums[hi], nums[mid]; hi -= 1",
            ],
          },
          state: [
            { name: "lo", value: "0" },
            { name: "mid", value: "0 (val = 2)" },
            { name: "hi", value: "5 (val = 0)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Unknown region [0..5]",
                cells: [
                  { id: "d0", value: "2", index: 0, state: "pivot" },
                  { id: "d1", value: "0", index: 1 },
                  { id: "d2", value: "2", index: 2 },
                  { id: "d3", value: "1", index: 3 },
                  { id: "d4", value: "1", index: 4 },
                  { id: "d5", value: "0", index: 5, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "lo / mid", tone: "accent" },
                  { index: 5, label: "hi", tone: "coral" },
                ],
              },
            ],
            caption: "nums[mid] == 2 triggers a swap with nums[hi], shrinking hi without advancing mid.",
          },
        },
        {
          title: "Swap 2 to hi(5); inspect incoming 0 at mid(0)",
          tag: "TRACE",
          explanation: [
            "After swapping indices `0` and `5`, `2` locks into index `5`, `hi` decrements to `4`, and `mid` stays at `0`.",
            "Now `nums[0] == 0`! Because `lo == mid == 0`, the `nums[mid] == 0` branch will swap `0` in place and advance both `lo` and `mid`.",
          ],
          code: [
            "while mid <= hi:",
            "    if nums[mid] == 0:",
            "        swap(nums, lo, mid); lo += 1; mid += 1",
            "    else if nums[mid] == 1:",
            "        mid += 1",
            "    else:",
            "        swap(nums, mid, hi); hi -= 1",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "lo", value: "0" },
            { name: "mid", value: "0 (val = 0)", changed: true },
            { name: "hi", value: "4", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "0 arrives at index 0; 2 locked at index 5",
                cells: [
                  { id: "d5", value: "0", index: 0, state: "active" },
                  { id: "d1", value: "0", index: 1 },
                  { id: "d2", value: "2", index: 2 },
                  { id: "d3", value: "1", index: 3 },
                  { id: "d4", value: "1", index: 4 },
                  { id: "d0", value: "2", index: 5, state: "done" },
                ],
                pointers: [
                  { index: 0, label: "lo / mid", tone: "accent" },
                  { index: 4, label: "hi", tone: "coral" },
                ],
              },
            ],
            caption: "Holding mid steady on a 2-swap caught the 0 swapped in from index 5.",
          },
        },
        {
          title: "Lock both 0s at indices 0..1; hit 2 at mid = 2",
          tag: "TRACE",
          explanation: [
            "Both `nums[0] == 0` and `nums[1] == 0` advance `lo` and `mid` together to `2`, locking `[0, 0]` into `[0 .. 1]`.",
            "At `mid = 2`, `nums[2] == 2` triggers swapping `mid(2)` with `hi(4)` (`2` and `1`) and decrementing `hi` to `3`.",
          ],
          code: [
            "while mid <= hi:",
            "    if nums[mid] == 0:",
            "        swap(nums, lo, mid); lo += 1; mid += 1",
            "    else if nums[mid] == 1:",
            "        mid += 1",
            "    else:",
            "        swap(nums, mid, hi); hi -= 1",
          ],
          activeLines: [1, 6, 7],
          codeLabel: "Pseudocode",
          state: [
            { name: "lo", value: "2", changed: true },
            { name: "mid", value: "2 (val = 2)", changed: true },
            { name: "hi", value: "4" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Preparing to swap nums[2]=2 with nums[4]=1",
                cells: [
                  { id: "d5", value: "0", index: 0, state: "done" },
                  { id: "d1", value: "0", index: 1, state: "done" },
                  { id: "d2", value: "2", index: 2, state: "pivot" },
                  { id: "d3", value: "1", index: 3 },
                  { id: "d4", value: "1", index: 4, state: "active" },
                  { id: "d0", value: "2", index: 5, state: "done" },
                ],
                pointers: [
                  { index: 2, label: "lo / mid", tone: "accent" },
                  { index: 4, label: "hi", tone: "coral" },
                ],
              },
            ],
            caption: "Swap index 2 and index 4, then decrement hi to 3 while holding mid at 2.",
          },
        },
        {
          title: "Inspect incoming 1s across indices 2 and 3",
          tag: "TRACE",
          explanation: [
            "After swapping, `1` sits at `mid = 2`, `2` is locked at index `4`, and `hi` drops to `3`.",
            "Since `nums[2] == 1` and `nums[3] == 1`, the `else if nums[mid] == 1` branch advances `mid` across `[2 .. 3]` to `4` while `lo = 2` and `hi = 3`.",
          ],
          code: [
            "while mid <= hi:",
            "    if nums[mid] == 0:",
            "        swap(nums, lo, mid); lo += 1; mid += 1",
            "    else if nums[mid] == 1:",
            "        mid += 1",
            "    else:",
            "        swap(nums, mid, hi); hi -= 1",
          ],
          activeLines: [1, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "lo", value: "2" },
            { name: "mid", value: "2 (val = 1)" },
            { name: "hi", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Middle zone [2..3] holds 1s; hi = 3",
                cells: [
                  { id: "d5", value: "0", index: 0, state: "done" },
                  { id: "d1", value: "0", index: 1, state: "done" },
                  { id: "d4", value: "1", index: 2, state: "active" },
                  { id: "d3", value: "1", index: 3, state: "active" },
                  { id: "d2", value: "2", index: 4, state: "done" },
                  { id: "d0", value: "2", index: 5, state: "done" },
                ],
                pointers: [
                  { index: 2, label: "lo / mid", tone: "accent" },
                  { index: 3, label: "hi", tone: "coral" },
                ],
              },
            ],
            caption: "Advancing mid over 1 at indices 2 and 3 moves mid to 4, crossing hi = 3.",
          },
        },
        {
          title: "Loop exits when mid > hi",
          tag: "CHECK",
          explanation: [
            "Now `mid = 4 > hi = 3`, so the unknown region `[mid .. hi]` is empty and the loop stops.",
            "Every zone holds its target value: `[0..1] = 0`, `[2..3] = 1`, `[4..5] = 2`, completed in one `O(n)` pass and `O(1)` extra space.",
          ],
          code: [
            "while mid <= hi:",
            "    if nums[mid] == 0:",
            "        swap(nums, lo, mid); lo += 1; mid += 1",
            "    else if nums[mid] == 1:",
            "        mid += 1",
            "    else:",
            "        swap(nums, mid, hi); hi -= 1",
          ],
          activeLines: [1],
          codeLabel: "Pseudocode",
          state: [
            { name: "lo", value: "2" },
            { name: "mid", value: "4 (> hi)", changed: true },
            { name: "Final array", value: "[0, 0, 1, 1, 2, 2]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Partitioned result [0, 0, 1, 1, 2, 2]",
                cells: [
                  { id: "d5", value: "0", index: 0, state: "done" },
                  { id: "d1", value: "0", index: 1, state: "done" },
                  { id: "d4", value: "1", index: 2, state: "done" },
                  { id: "d3", value: "1", index: 3, state: "done" },
                  { id: "d2", value: "2", index: 4, state: "done" },
                  { id: "d0", value: "2", index: 5, state: "done" },
                ],
                pointers: [
                  { index: 2, label: "lo = 2", tone: "ok" },
                  { index: 3, label: "hi = 3", tone: "coral" },
                  { index: 4, label: "mid = 4", tone: "accent" },
                ],
              },
            ],
            caption: "Single-pass 3-way partition completes with zero extra array allocations.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Advancing `mid` after swapping a `2` into `hi`",
        detail:
          "The element swapped from `nums[hi]` into `nums[mid]` was never examined. Incrementing `mid` after a `2` swap skips inspecting it and can leave a `0` trapped in the middle `1` zone.",
      },
      {
        title: "Stopping at `mid < hi` instead of `mid <= hi`",
        detail:
          "When `mid == hi`, there is still one unexamined slot left in `[mid .. hi]`. Using `<` skips that last element, which breaks if `nums[hi]` is `0` and needs to swap left to `lo`.",
      },
      {
        title: "Missing empty-array guard in sorted deduplication",
        detail:
          "Starting `write = 1` assumes `nums[0]` exists. On an empty array `[]`, returning `write = 1` lies about the length. Always check `if len(nums) == 0: return 0` before setting `write = 1`.",
      },
    ],
    practiceTask: {
      title: "Move Zeros Preserving Relative Order",
      tier: "Warmup",
      goal: "Move all `0`s in `nums` to the end of the array in-place while preserving the original relative order of all non-zero elements.",
      constraints: ["1 <= len(nums) <= 10^5", "Modify nums in-place", "Target: O(n) time, O(1) space"],
      examples: [
        { input: "nums = [0, 1, 0, 3, 12]", output: "[1, 3, 12, 0, 0]" },
        { input: "nums = [0, 0, 5]", output: "[5, 0, 0]" },
      ],
      tasks: [
        "Track `write = 0` for the next non-zero destination slot.",
        "Loop `read` from `0` to `len(nums) - 1`; whenever `nums[read] != 0`, swap `nums[write]` with `nums[read]` and increment `write += 1`.",
      ],
      starterCode: "function move_zeros_in_place(nums):\n    // TODO: compact non-zeros forward in one pass",
      expectedOutput: "[1, 3, 12, 0, 0]\n[5, 0, 0]",
      hint: "Swapping `nums[write]` and `nums[read]` avoids needing a second loop to backfill trailing zeros.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function move_zeros_in_place(nums):\n    write ← 0\n    for read from 0 to len(nums) - 1:\n        if nums[read] != 0:\n            tmp ← nums[write]\n            nums[write] ← nums[read]\n            nums[read] ← tmp\n            write ← write + 1\n    return nums",
    },
    practiceChallenges: [
      {
        title: "Move Zeros Preserving Relative Order",
        tier: "Warmup",
        goal: "Shift every `0` to the end of `nums` in-place while keeping non-zero order unchanged.",
        constraints: ["1 <= len(nums) <= 10^5", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [0, 1, 0, 3, 12]", output: "[1, 3, 12, 0, 0]" },
          { input: "nums = [0, 0, 5]", output: "[5, 0, 0]" },
        ],
        tasks: ["Swap non-zero values at `read` into `write` and increment `write`."],
        starterCode: "function move_zeros_in_place(nums):\n    // TODO: single-pass in-place compaction",
        expectedOutput: "[1, 3, 12, 0, 0]\n[5, 0, 0]",
        hint: "When `write == read`, swapping swaps the element with itself harmlessly.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function move_zeros_in_place(nums):\n    write ← 0\n    for read from 0 to len(nums) - 1:\n        if nums[read] != 0:\n            tmp ← nums[write]\n            nums[write] ← nums[read]\n            nums[read] ← tmp\n            write ← write + 1\n    return nums",
      },
      {
        title: "Keep At Most Two Copies in Sorted Array",
        tier: "Core",
        goal: "Given a non-decreasing array `nums`, modify it in-place so each distinct value appears at most twice, returning the new valid length `write`.",
        constraints: ["0 <= len(nums) <= 10^5", "nums is already sorted non-decreasing", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [1, 1, 1, 2, 2, 3]", output: "5", explanation: "First 5 elements become [1, 1, 2, 2, 3]." },
          { input: "nums = [0, 0, 1, 1, 1, 1, 2, 3, 3]", output: "7", explanation: "First 7 elements become [0, 0, 1, 1, 2, 3, 3]." },
        ],
        tasks: [
          "Return `len(nums)` directly if `len(nums) <= 2`.",
          "Start `write = 2` and scan `read` from `2` to `n - 1`.",
          "Keep `nums[read]` whenever `nums[read] != nums[write - 2]`.",
        ],
        starterCode: "function dedup_at_most_two(nums):\n    // TODO: compact in-place allowing at most 2 copies per value",
        expectedOutput: "5\n7",
        hint: "Because `nums` is sorted, comparing `nums[read]` with `nums[write - 2]` guarantees we never keep a third copy.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function dedup_at_most_two(nums):\n    n ← len(nums)\n    if n <= 2:\n        return n\n    write ← 2\n    for read from 2 to n - 1:\n        if nums[read] != nums[write - 2]:\n            nums[write] ← nums[read]\n            write ← write + 1\n    return write",
      },
      {
        title: "Three-Way Priority Band Partition",
        tier: "Stretch",
        goal: "Given an integer array `nums` and cutoffs `low_cut <= high_cut`, rearrange `nums` in-place in one pass so all `< low_cut` come first, followed by values in `[low_cut .. high_cut]`, followed by values `> high_cut`.",
        constraints: ["0 <= len(nums) <= 10^5", "Single pass O(n) time, O(1) extra space"],
        examples: [
          { input: "nums = [9, 2, 5, 1, 7, 4, 8], low_cut = 4, high_cut = 7", output: "[2, 1, 5, 4, 7, 9, 8]", explanation: "<4: [2,1], [4..7]: [5,4,7], >7: [9,8] (any order within each band is valid)." },
          { input: "nums = [8, 5, 2], low_cut = 4, high_cut = 6", output: "[2, 5, 8]", explanation: "Swapping 8 with 2 brings <4 to front and moves >6 to the tail." },
        ],
        tasks: [
          "Maintain `lo = 0`, `mid = 0`, `hi = len(nums) - 1`.",
          "Swap `nums[mid] < low_cut` with `lo` and advance both `lo` and `mid`.",
          "Advance `mid` alone when `low_cut <= nums[mid] <= high_cut`; swap `nums[mid] > high_cut` with `hi` and decrement `hi` alone.",
        ],
        starterCode: "function partition_three_bands(nums, low_cut, high_cut):\n    // TODO: one-pass lo/mid/hi partition",
        expectedOutput: "[2, 1, 5, 4, 7, 9, 8]\n[2, 5, 8]",
        hint: "This is the Dutch National Flag rule generalized from exact values `{0, 1, 2}` to three range predicates.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function partition_three_bands(nums, low_cut, high_cut):\n    lo ← 0\n    mid ← 0\n    hi ← len(nums) - 1\n    while mid <= hi:\n        if nums[mid] < low_cut:\n            swap(nums, lo, mid)\n            lo ← lo + 1\n            mid ← mid + 1\n        else if nums[mid] <= high_cut:\n            mid ← mid + 1\n        else:\n            swap(nums, mid, hi)\n            hi ← hi - 1\n    return nums",
      },
    ],
  },

  "dsa-multi-pointers": {
    lessonId: "dsa-multi-pointers",
    subtitle:
      "Prove greedy two-pointer elimination on Container With Most Water, trap rainwater in O(1) space with left_max/right_max, and find unique sorted 3-Sum triplets.",
    intro: {
      heading: "Multi-Pointer Extensions: Container, Rain Water & Sorted Triplets",
      explanation: [
        "Testing every `(i, j)` pair of container walls or computing left/right max heights in nested loops costs `O(n^2)` time. Moving the *taller* wall instead of the shorter one drops the optimal container (`[1, 8, 6, 2, 5, 4, 8, 3, 7]`), and forgetting adjacent duplicate skips in Sorted 3-Sum (`[-2, -2, 0, 1, 2, 2]`) emits repeated triplets like `[-2, 0, 2]` twice.",
        "Always advancing the shorter wall eliminates only pairs strictly worse in both width and height, solving Container With Most Water and Trapping Rain Water in `O(n)` time and `O(1)` space—even on unsorted heights. Adding an anchor `i` plus inward `left`/`right` duplicate skips finds unique sorted 3-Sum triplets in `O(n^2)` time.",
      ],
      analogy:
        "Water never rises above the lower of two walls: whether you are filling a wide tank between two bars or checking how deep rain puddles sit between outer cliffs, the shorter boundary always decides how high the water can reach right now.",
      realWorldUses: [
        "Computing maximum-capacity bounding windows in signal charts or reservoir height profiles in one linear sweep",
        "Enumerating zero-balance or target-sum multi-item combinations from pre-sorted ledgers without duplicate results",
      ],
    },
    sections: [
      {
        heading: "Container With Most Water: why the shorter wall can be discarded",
        paragraphs: [
          "Given an array `height` of non-negative bar heights, choosing bars `left < right` traps water of area `(right - left) * min(height[left], height[right])`. Trace `[1, 8, 6, 2, 5, 4, 8, 3, 7]` from `left = 0 (1), right = 8 (7)` (`area = 8 * 1 = 8`): stepping the *shorter* wall `left -> 1 (8)` reaches `(8 - 1) * 7 = 49` (optimal!), whereas stepping the *taller* wall `right -> 7 (3)` would drop width to `7` while still capped at `height[0] = 1`.",
          "Suppose `height[left] <= height[right]`. Why can we advance `left += 1` without checking any pairs `(left, j)` for `left < j < right`? Every narrower pair has smaller width `(j - left) < (right - left)` and height `min(height[left], height[j]) <= height[left]`. Neither width nor height can improve while keeping `left`, so moving the shorter wall visits each bar once in `O(n)` time and `O(1)` space.",
        ],
        code: [
          "function max_water_container(height):",
          "    left ← 0",
          "    right ← len(height) - 1",
          "    best ← 0",
          "    while left < right:",
          "        width ← right - left",
          "        h ← min(height[left], height[right])",
          "        best ← max(best, width * h)",
          "        if height[left] <= height[right]:",
          "            left ← left + 1",
          "        else:",
          "            right ← right - 1",
          "    return best",
        ],
        codeLabel: "Pseudocode",
        callout: {
          kind: "KEY IDEA",
          text: "Moving the taller wall inward can never beat the current area because width shrinks by 1 and the water height stays capped by the shorter wall that did not move.",
        },
      },
      {
        heading: "Trapping Rain Water in O(1) space with left_max and right_max",
        paragraphs: [
          "The rainwater sitting directly above bar `i` equals `max(0, min(prefix_max[i], suffix_max[i]) - height[i])`. Instead of allocating two `O(n)` arrays using M03's single-pass prefix/suffix max scan pattern, we can maintain `left = 0`, `right = n - 1`, `left_max = 0` (tallest bar seen in `[0 .. left - 1]`), and `right_max = 0` (tallest bar seen in `[right + 1 .. n - 1]`).",
          "While `left <= right`: if `left_max <= right_max`, we know the true `suffix_max[left]` is at least `right_max >= left_max`. Update `left_max = max(left_max, height[left])`, add `left_max - height[left]` to `water`, and advance `left += 1`. Otherwise (`right_max < left_max`), `prefix_max[right]` is at least `left_max > right_max`, so update `right_max = max(right_max, height[right])`, add `right_max - height[right]`, and retreat `right -= 1`.",
        ],
        code: [
          "function trap_rainwater(height):",
          "    left ← 0; right ← len(height) - 1",
          "    left_max ← 0; right_max ← 0",
          "    water ← 0",
          "    while left <= right:",
          "        if left_max <= right_max:",
          "            left_max ← max(left_max, height[left])",
          "            water ← water + (left_max - height[left])",
          "            left ← left + 1",
          "        else:",
          "            right_max ← max(right_max, height[right])",
          "            water ← water + (right_max - height[right])",
          "            right ← right - 1",
          "    return water",
        ],
        codeLabel: "Pseudocode",
      },
      {
        heading: "Sorted 3-Sum: fixing an anchor and skipping adjacent duplicates",
        paragraphs: [
          "To find all unique triplets `[a, b, c]` summing to `0`, assume `nums` is **already sorted in non-decreasing order** (general sorting algorithms that turn unsorted arrays into sorted ones are covered in M11). Fix the first element at `i` from `0` to `n - 3`, and run opposite-end Two-Sum on `left = i + 1` and `right = n - 1` looking for `nums[i] + nums[left] + nums[right] == 0`.",
          "Because `nums` is sorted, all identical values sit next to each other. Two duplicate guards guarantee every returned triplet is unique without needing a hash set: skip `i` when `i > 0 and nums[i] == nums[i - 1]`, and after recording a valid triplet, skip repeated `nums[left]` and `nums[right]` values while `left < right`.",
        ],
        code: [
          "function sorted_three_sum(nums):",
          "    // Precondition: nums is already sorted non-decreasing (sorting taught in M11)",
          "    res ← []",
          "    n ← len(nums)",
          "    for i from 0 to n - 3:",
          "        if nums[i] > 0: break",
          "        if i > 0 and nums[i] == nums[i - 1]: continue",
          "        left ← i + 1; right ← n - 1",
          "        while left < right:",
          "            s ← nums[i] + nums[left] + nums[right]",
          "            if s < 0: left ← left + 1",
          "            else if s > 0: right ← right - 1",
          "            else:",
          "                res.append([nums[i], nums[left], nums[right]])",
          "                left ← left + 1; right ← right - 1",
          "                while left < right and nums[left] == nums[left - 1]: left ← left + 1",
          "                while left < right and nums[right] == nums[right + 1]: right ← right - 1",
          "    return res",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Multi-pointer extensions compared",
          headers: ["Problem", "Input order required?", "Pointer state", "Complexity"],
          rows: [
            ["Container With Most Water", "No (any heights)", "left, right; advance shorter wall", "O(n) time, O(1) space"],
            ["Trapping Rain Water", "No (any heights)", "left, right, left_max, right_max", "O(n) time, O(1) space"],
            ["Sorted 3-Sum", "Yes (pre-sorted; M11 covers sorting)", "Anchor i + inward left, right + dedup skips", "O(n^2) time, O(1) aux space"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Sorted 3-Sum assumes the input is already in non-decreasing order; on unsorted input, sort first (`O(n log n)`) before running the `O(n^2)` anchor sweep and duplicate skips.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From O(n^2) Pair Checks to Greedy Walls & Deduplicated 3-Sum",
      steps: [
        {
          label: "Step 1: Brute-force O(n^2) container pairs",
          explanation: "Measuring every `(i, j)` pair finds the max area, at `O(n^2)` time.",
          code: [
            "function max_water_naive(height):",
            "    best ← 0",
            "    for i from 0 to len(height) - 2:",
            "        for j from i + 1 to len(height) - 1:",
            "            best ← max(best, (j - i) * min(height[i], height[j]))",
            "    return best",
          ],
          activeLines: [3, 4, 5],
          output: "O(n^2) comparisons",
        },
        {
          label: "Step 2: Advance only the shorter wall in O(n)",
          explanation: "Keeping the shorter wall can never raise height as width shrinks, so stepping it inward is lossless.",
          code: [
            "function max_water_container(height):",
            "    left ← 0; right ← len(height) - 1; best ← 0",
            "    while left < right:",
            "        best ← max(best, (right - left) * min(height[left], height[right]))",
            "        if height[left] <= height[right]: left += 1",
            "        else: right -= 1",
            "    return best",
          ],
          activeLines: [5, 6],
          output: "max_water_container([1,8,6,2,5,4,8,3,7]) -> 49",
        },
        {
          label: "Step 3: Anchor i + inward left/right with duplicate skips (3-Sum)",
          explanation: "Skip repeated anchors `nums[i] == nums[i - 1]` and advance past identical `left`/`right` values after every hit.",
          code: [
            "function sorted_three_sum(nums):",
            "    res ← []",
            "    for i from 0 to len(nums) - 3:",
            "        if i > 0 and nums[i] == nums[i - 1]: continue",
            "        left ← i + 1; right ← len(nums) - 1",
            "        while left < right:",
            "            // adjust left/right on s < 0 or s > 0; on s == 0 append & skip duplicates",
            "    return res",
          ],
          activeLines: [4, 7],
          output: "[-2,-2,0,1,2,2] -> [[-2,0,2]]",
        },
      ],
    },
    walkthrough: {
      title: "Trace Sorted 3-Sum with duplicate skipping on [-2, -2, 0, 1, 2, 2]",
      layout: "visual-first",
      steps: [
        {
          title: "Anchor i = 0 (-2), start left = 1 and right = 5",
          tag: "CONCEPT",
          explanation: [
            "Fix `i = 0` (`nums[0] = -2`), then search `[1 .. 5]` with `left = 1` (`-2`) and `right = 5` (`2`).",
            "The sum is `-2 + (-2) + 2 = -2 < 0`, which is too small, so advance `left` to `2`.",
          ],
          code: [
            "for i from 0 to n - 3:",
            "    if i > 0 and nums[i] == nums[i - 1]: continue",
            "    left ← i + 1; right ← n - 1",
            "    while left < right:",
            "        s ← nums[i] + nums[left] + nums[right]",
            "        if s < 0: left ← left + 1",
            "        else if s > 0: right ← right - 1",
            "        else: record triplet and skip duplicate left/right",
          ],
          activeLines: [1, 3, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "0 (-2)" },
            { name: "left / right", value: "1 (-2) / 5 (2)" },
            { name: "sum s", value: "-2 < 0", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Sorted nums = [-2, -2, 0, 1, 2, 2]",
                cells: [
                  { id: "t0", value: "-2", index: 0, state: "pivot" },
                  { id: "t1", value: "-2", index: 1, state: "active" },
                  { id: "t2", value: "0", index: 2 },
                  { id: "t3", value: "1", index: 3 },
                  { id: "t4", value: "2", index: 4 },
                  { id: "t5", value: "2", index: 5, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "i", tone: "ok" },
                  { index: 1, label: "left", tone: "accent" },
                  { index: 5, label: "right", tone: "coral" },
                ],
              },
            ],
            caption: "Anchor i = 0 fixed; -2 + (-2) + 2 = -2 < 0 pushes left rightward.",
          },
        },
        {
          title: "Hit zero-sum triplet [-2, 0, 2] at i=0, left=2, right=5",
          tag: "TRACE",
          explanation: [
            "At `left = 2` (`0`) and `right = 5` (`2`), `s = -2 + 0 + 2 = 0`!",
            "Append `[-2, 0, 2]` to `res`, then step `left` to `3` and `right` to `4`.",
          ],
          code: [
            "for i from 0 to n - 3:",
            "    if i > 0 and nums[i] == nums[i - 1]: continue",
            "    left ← i + 1; right ← n - 1",
            "    while left < right:",
            "        s ← nums[i] + nums[left] + nums[right]",
            "        if s < 0: left ← left + 1",
            "        else if s > 0: right ← right - 1",
            "        else: record triplet and skip duplicate left/right",
          ],
          activeLines: [5, 8],
          codeLabel: "Pseudocode",
          state: [
            { name: "i / left / right", value: "0 / 2 / 5" },
            { name: "sum s", value: "0 (match!)", changed: true },
            { name: "res", value: "[[-2, 0, 2]]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Found valid triplet [-2, 0, 2]",
                cells: [
                  { id: "t0", value: "-2", index: 0, state: "done" },
                  { id: "t1", value: "-2", index: 1, state: "dim" },
                  { id: "t2", value: "0", index: 2, state: "done" },
                  { id: "t3", value: "1", index: 3 },
                  { id: "t4", value: "2", index: 4 },
                  { id: "t5", value: "2", index: 5, state: "done" },
                ],
                pointers: [
                  { index: 0, label: "i", tone: "ok" },
                  { index: 2, label: "left", tone: "accent" },
                  { index: 5, label: "right", tone: "coral" },
                ],
              },
            ],
            caption: "Record [-2, 0, 2], then advance left and retreat right past adjacent duplicates.",
          },
        },
        {
          title: "Skip adjacent duplicate 2 on right; inner loop ends",
          tag: "TRACE",
          explanation: [
            "Stepping inward gives `left = 3` (`1`) and `right = 4` (`2`), where `nums[4] == nums[5] == 2` triggers the duplicate-skip loop to move `right` to `3` (`1`).",
            "Now `left == right == 3`, so the inner loop for `i = 0` finishes without duplicating pairs.",
          ],
          code: [
            "res.append([nums[i], nums[left], nums[right]])",
            "left ← left + 1; right ← right - 1",
            "while left < right and nums[left] == nums[left - 1]: left ← left + 1",
            "while left < right and nums[right] == nums[right + 1]: right ← right - 1",
          ],
          activeLines: [2, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "left", value: "3", changed: true },
            { name: "right", value: "3 (after skipping dup 2 at 4)", changed: true },
            { name: "Inner loop", value: "left == right (done)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Duplicate 2 at index 4 skipped; left meets right at 3",
                cells: [
                  { id: "t0", value: "-2", index: 0, state: "done" },
                  { id: "t1", value: "-2", index: 1, state: "dim" },
                  { id: "t2", value: "0", index: 2, state: "dim" },
                  { id: "t3", value: "1", index: 3, state: "active" },
                  { id: "t4", value: "2", index: 4, state: "dim" },
                  { id: "t5", value: "2", index: 5, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "i", tone: "ok" },
                  { index: 3, label: "left / right", tone: "coral" },
                ],
              },
            ],
            caption: "Skipping nums[right] == nums[right + 1] jumps past repeated 2s immediately.",
          },
        },
        {
          title: "Skip duplicate anchor i = 1 (-2 == nums[0])",
          tag: "PITFALL",
          explanation: [
            "The outer loop moves to `i = 1`, where `nums[1] = -2` equals `nums[0] = -2`.",
            "Because `i > 0 and nums[i] == nums[i - 1]`, we `continue` immediately! Searching from `i = 1` could only rediscover subsets of `[-2, 0, 2]`.",
          ],
          code: [
            "for i from 0 to n - 3:",
            "    if nums[i] > 0: break",
            "    if i > 0 and nums[i] == nums[i - 1]: continue",
            "    left ← i + 1; right ← n - 1",
          ],
          activeLines: [1, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "1 (-2)", changed: true },
            { name: "nums[1] == nums[0]", value: "true -> continue", changed: true },
            { name: "res", value: "[[-2, 0, 2]]" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Duplicate anchor i = 1 skipped",
                cells: [
                  { id: "t0", value: "-2", index: 0, state: "dim" },
                  { id: "t1", value: "-2", index: 1, state: "pivot" },
                  { id: "t2", value: "0", index: 2 },
                  { id: "t3", value: "1", index: 3 },
                  { id: "t4", value: "2", index: 4 },
                  { id: "t5", value: "2", index: 5 },
                ],
                pointers: [
                  { index: 1, label: "i (skip dup)", tone: "coral" },
                ],
              },
            ],
            caption: "Without the anchor check, i = 1 would emit a duplicate [-2, 0, 2].",
          },
        },
        {
          title: "Anchor i = 2 (0): sum 0 + 1 + 2 = 3 > 0 shrinks right",
          tag: "TRACE",
          explanation: [
            "At `i = 2` (`0`), initialize `left = 3` (`1`) and `right = 5` (`2`). Their sum is `0 + 1 + 2 = 3 > 0`, so `right` steps down to `4` (`0 + 1 + 2 = 3 > 0` again) and then to `3` (`left == right`).",
            "No new zero-sum triplet exists starting at `i = 2`.",
          ],
          code: [
            "left ← i + 1; right ← n - 1",
            "while left < right:",
            "    s ← nums[i] + nums[left] + nums[right]",
            "    if s < 0: left ← left + 1",
            "    else if s > 0: right ← right - 1",
          ],
          activeLines: [1, 3, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "2 (0)", changed: true },
            { name: "left / right", value: "3 (1) / 5 (2)", changed: true },
            { name: "sum s", value: "3 > 0 (right retreats)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Anchor i = 2 checks left = 3, right = 5",
                cells: [
                  { id: "t0", value: "-2", index: 0, state: "dim" },
                  { id: "t1", value: "-2", index: 1, state: "dim" },
                  { id: "t2", value: "0", index: 2, state: "pivot" },
                  { id: "t3", value: "1", index: 3, state: "active" },
                  { id: "t4", value: "2", index: 4 },
                  { id: "t5", value: "2", index: 5, state: "active" },
                ],
                pointers: [
                  { index: 2, label: "i = 2", tone: "ok" },
                  { index: 3, label: "left", tone: "accent" },
                  { index: 5, label: "right", tone: "coral" },
                ],
              },
            ],
            caption: "0 + 1 + 2 = 3 > 0 pushes right down past index 4 to index 3 with no match.",
          },
        },
        {
          title: "Break early at positive anchor i = 3 and return unique triplets",
          tag: "CHECK",
          explanation: [
            "At `i = 3` (`1`), `nums[3] > 0` triggers `break` because all remaining numbers are positive and cannot sum to `0`.",
            "The search finishes in `O(n^2)` time and `O(1)` extra space, returning `[[-2, 0, 2]]`.",
          ],
          code: [
            "for i from 0 to n - 3:",
            "    if nums[i] > 0: break",
            "    if i > 0 and nums[i] == nums[i - 1]: continue",
            "    ...",
            "return res",
          ],
          activeLines: [2, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "3 (nums[3] = 1 > 0 -> break)", changed: true },
            { name: "Final res", value: "[[-2, 0, 2]]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Positive anchor early exit at i = 3",
                cells: [
                  { id: "t0", value: "-2", index: 0, state: "dim" },
                  { id: "t1", value: "-2", index: 1, state: "dim" },
                  { id: "t2", value: "0", index: 2, state: "dim" },
                  { id: "t3", value: "1", index: 3, state: "pivot" },
                  { id: "t4", value: "2", index: 4, state: "dim" },
                  { id: "t5", value: "2", index: 5, state: "dim" },
                ],
                pointers: [
                  { index: 3, label: "> 0 break", tone: "ok" },
                ],
              },
            ],
            caption: "Once nums[i] > 0 in a sorted array, no triplet starting at i can sum to 0.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Advancing the taller wall in Container With Most Water",
        detail:
          "Keeping the shorter wall and moving the taller wall shrinks width while leaving height capped at the shorter wall, so area can strictly never grow. Always advance the shorter side (ties can move either side).",
      },
      {
        title: "Updating `water` before updating `left_max` / `right_max`",
        detail:
          "If `height[left]` is a new tallest left wall, subtracting `old_left_max - height[left]` adds a negative depth! Always run `left_max = max(left_max, height[left])` *before* `water += left_max - height[left]`.",
      },
      {
        title: "Missing duplicate guards or passing unsorted inputs to Sorted 3-Sum",
        detail:
          "Sorted 3-Sum requires a non-decreasing input array (sorting algorithms are covered in M11) and must skip duplicates at both `i` (`nums[i] == nums[i - 1]`) and `left`/`right` after a match, otherwise duplicate triplets leak into the answer.",
      },
    ],
    practiceTask: {
      title: "Maximum Water Container",
      tier: "Warmup",
      goal: "Given an array `height` of `n` vertical line heights, find two lines that together with the x-axis hold the maximum area of water in `O(n)` time and `O(1)` extra space.",
      constraints: ["2 <= len(height) <= 10^5", "0 <= height[i] <= 10^4", "Target: O(n) time, O(1) space"],
      examples: [
        { input: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]", output: "49", explanation: "Bars at index 1 (height 8) and index 8 (height 7) give width 7 * height 7 = 49." },
        { input: "height = [1, 1]", output: "1" },
      ],
      tasks: [
        "Start `left = 0`, `right = len(height) - 1`, `best = 0`.",
        "Compute `(right - left) * min(height[left], height[right])` and update `best`.",
        "Advance `left += 1` if `height[left] <= height[right]`, else decrement `right -= 1`.",
      ],
      starterCode: "function max_area(height):\n    // TODO: O(n) two-pointer container area",
      expectedOutput: "49\n1",
      hint: "The shorter of the two walls limits the water height, so only moving the shorter wall inward can ever uncover a taller bounding pair.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function max_area(height):\n    left ← 0\n    right ← len(height) - 1\n    best ← 0\n    while left < right:\n        area ← (right - left) * min(height[left], height[right])\n        if area > best: best ← area\n        if height[left] <= height[right]:\n            left ← left + 1\n        else:\n            right ← right - 1\n    return best",
    },
    practiceChallenges: [
      {
        title: "Maximum Water Container",
        tier: "Warmup",
        goal: "Return the largest rectangular area `(right - left) * min(height[left], height[right])` in one inward sweep.",
        constraints: ["2 <= len(height) <= 10^5", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]", output: "49" },
          { input: "height = [1, 1]", output: "1" },
        ],
        tasks: ["Step the shorter pointer inward after updating `best`."],
        starterCode: "function max_area(height):\n    // TODO: greedy shorter-wall advance",
        expectedOutput: "49\n1",
        hint: "Stop when `left == right` because width `(right - left)` becomes `0`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function max_area(height):\n    left ← 0\n    right ← len(height) - 1\n    best ← 0\n    while left < right:\n        area ← (right - left) * min(height[left], height[right])\n        if area > best: best ← area\n        if height[left] <= height[right]:\n            left ← left + 1\n        else:\n            right ← right - 1\n    return best",
      },
      {
        title: "Sorted Three-Sum Triplets",
        tier: "Core",
        goal: "Given an already-sorted (non-decreasing) integer array `nums`, return all unique triplets `[nums[i], nums[j], nums[k]]` (`i < j < k`) whose sum is `0`.",
        constraints: ["0 <= len(nums) <= 3000", "nums is already sorted non-decreasing (sorting taught in M11)", "Target: O(n^2) time, O(1) auxiliary space"],
        examples: [
          { input: "nums = [-4, -1, -1, 0, 1, 2]", output: "[[-1, -1, 2], [-1, 0, 1]]" },
          { input: "nums = [0, 1, 1]", output: "[]" },
        ],
        tasks: [
          "Anchor `i` from `0` to `n - 3`, breaking early if `nums[i] > 0` and skipping `i > 0 and nums[i] == nums[i - 1]`.",
          "Run opposite-end `left = i + 1`, `right = n - 1` looking for sum `0`.",
          "Skip duplicate `nums[left]` and `nums[right]` immediately after recording each match.",
        ],
        starterCode: "function sorted_three_sum(nums):\n    // TODO: anchor + inward two pointers with duplicate skipping",
        expectedOutput: "[[-1, -1, 2], [-1, 0, 1]]\n[]",
        hint: "Guard your inner duplicate-skipping `while` loops with `left < right` so pointers never cross.",
        complexity: { time: "O(n^2)", space: "O(1)" },
        solutionCode:
          "function sorted_three_sum(nums):\n    res ← []\n    n ← len(nums)\n    for i from 0 to n - 3:\n        if nums[i] > 0: break\n        if i > 0 and nums[i] == nums[i - 1]: continue\n        left ← i + 1\n        right ← n - 1\n        while left < right:\n            s ← nums[i] + nums[left] + nums[right]\n            if s < 0:\n                left ← left + 1\n            else if s > 0:\n                right ← right - 1\n            else:\n                res.append([nums[i], nums[left], nums[right]])\n                left ← left + 1\n                right ← right - 1\n                while left < right and nums[left] == nums[left - 1]:\n                    left ← left + 1\n                while left < right and nums[right] == nums[right + 1]:\n                    right ← right - 1\n    return res",
      },
      {
        title: "Trapped Rainwater in Constant Space",
        tier: "Stretch",
        goal: "Given non-negative elevation bars `height`, compute total units of rainwater trapped between bars using `O(n)` time and `O(1)` extra space.",
        constraints: ["0 <= len(height) <= 10^5", "0 <= height[i] <= 10^5", "Target: O(n) time, O(1) extra space (no prefix arrays)"],
        examples: [
          { input: "height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]", output: "6" },
          { input: "height = [4, 2, 0, 3, 2, 5]", output: "9" },
        ],
        tasks: [
          "Track `left = 0`, `right = len(height) - 1`, `left_max = 0`, `right_max = 0`, and `water = 0`.",
          "While `left <= right`, process the side with the smaller running bound (`left_max <= right_max` processes `left`, else `right`).",
          "Update that side's running max before adding `bound - height[idx]` to `water`.",
        ],
        starterCode: "function trap_water_o1(height):\n    // TODO: compute trapped rainwater with O(1) extra space",
        expectedOutput: "6\n9",
        hint: "When `left_max <= right_max`, we know `suffix_max[left] >= right_max >= left_max`, so `left_max` alone determines the water level at `left`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function trap_water_o1(height):\n    left ← 0\n    right ← len(height) - 1\n    left_max ← 0\n    right_max ← 0\n    water ← 0\n    while left <= right:\n        if left_max <= right_max:\n            if height[left] > left_max: left_max ← height[left]\n            water ← water + (left_max - height[left])\n            left ← left + 1\n        else:\n            if height[right] > right_max: right_max ← height[right]\n            water ← water + (right_max - height[right])\n            right ← right - 1\n    return water",
      },
    ],
  },
};

export const dsaM07PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m7",
  title: "Module 07 Practice Set: Pointer Strategies",
  description:
    "Four mixed problems combining inward symmetry checks, in-place stream compaction, single-pass 3-way partitioning, and sorted multi-element target matching.",
  problems: [
    {
      id: "dsa-m7-p1",
      title: "Check Normalized Phrase Symmetry",
      patternHint: "Converge opposite ends inward while skipping non-alphanumeric characters inside `left < right` (Lesson 07-1).",
      lessonRefId: "dsa-opposite-pointers",
      goal: "Given a string `phrase`, return `true` if keeping only ASCII letters and digits and folding uppercase letters to lowercase makes it read identically forward and backward, in `O(1)` extra space.",
      constraints: ["0 <= len(phrase) <= 10^5", "Do not allocate a cleaned copy string", "Target: O(n) time, O(1) space"],
      examples: [
        { input: "phrase = \"No lemon, no melon!\"", output: "true" },
        { input: "phrase = \"step on no 2 pets\"", output: "false" },
      ],
      tasks: [
        "Set `left = 0` and `right = len(phrase) - 1`.",
        "Inside `while left < right`, skip punctuation/spaces on both ends using `left < right` guards.",
        "Return `false` on the first lowercase character mismatch, or `true` once pointers meet.",
      ],
      starterCode: "function is_symmetric_phrase(phrase):\n    // TODO: verify symmetry in O(1) extra space",
      expectedOutput: "true\nfalse",
      hint: "Keep `left < right` inside both skip loops so punctuation-only strings never step out of bounds.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function is_symmetric_phrase(phrase):\n    left ← 0\n    right ← len(phrase) - 1\n    while left < right:\n        while left < right and not is_alnum(phrase[left]):\n            left ← left + 1\n        while left < right and not is_alnum(phrase[right]):\n            right ← right - 1\n        if to_lower(phrase[left]) != to_lower(phrase[right]):\n            return false\n        left ← left + 1\n        right ← right - 1\n    return true",
    },
    {
      id: "dsa-m7-p2",
      title: "Pack Active Sensor Readings Forward",
      patternHint: "Use a slow write index and a fast read index to compact valid entries forward while keeping relative order (Lesson 07-2).",
      lessonRefId: "dsa-read-write-pointers",
      goal: "Given an integer array `readings` where `-1` indicates a dropped sensor packet, move all valid readings (`!= -1`) to the front in their original order, fill any trailing slots with `-1`, and return the count of valid readings.",
      constraints: ["0 <= len(readings) <= 10^5", "Modify readings in-place", "Target: O(n) time, O(1) space"],
      examples: [
        { input: "readings = [-1, 14, -1, 22, 9, -1]", output: "3 (readings = [14, 22, 9, -1, -1, -1])" },
        { input: "readings = [-1, -1]", output: "0 (readings = [-1, -1])" },
      ],
      tasks: [
        "Initialize `write = 0`.",
        "Scan `read` from `0` to `len(readings) - 1`: whenever `readings[read] != -1`, swap `readings[write]` and `readings[read]` and increment `write`.",
        "Return `write`.",
      ],
      starterCode: "function pack_active_readings(readings):\n    // TODO: compact non -1 values forward and return valid count",
      expectedOutput: "3 (readings = [14, 22, 9, -1, -1, -1])\n0 (readings = [-1, -1])",
      hint: "Swapping `readings[write]` and `readings[read]` puts valid readings at the front and pushes `-1`s to the back in a single pass.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function pack_active_readings(readings):\n    write ← 0\n    for read from 0 to len(readings) - 1:\n        if readings[read] != -1:\n            tmp ← readings[write]\n            readings[write] ← readings[read]\n            readings[read] ← tmp\n            write ← write + 1\n    return write",
    },
    {
      id: "dsa-m7-p3",
      title: "Group Three Severity Levels In-Place",
      patternHint: "Divide the array into four regions with lo, mid, and hi boundaries in a single linear pass (Lesson 07-2).",
      lessonRefId: "dsa-read-write-pointers",
      goal: "Given an array `levels` whose elements are only `0` (low), `1` (medium), or `2` (high), rearrange `levels` in-place in one pass so all `0`s appear first, `1`s second, and `2`s last.",
      constraints: ["0 <= len(levels) <= 10^5", "Only one pass allowed (no counting pass)", "Target: O(n) time, O(1) space"],
      examples: [
        { input: "levels = [2, 1, 0, 2, 0, 1]", output: "[0, 0, 1, 1, 2, 2]" },
        { input: "levels = [1, 0]", output: "[0, 1]" },
      ],
      tasks: [
        "Set `lo = 0`, `mid = 0`, `hi = len(levels) - 1`.",
        "Loop `while mid <= hi`: swap `0` with `lo` (`lo += 1, mid += 1`), advance `mid += 1` on `1`, and swap `2` with `hi` (`hi -= 1` only).",
      ],
      starterCode: "function group_severity_levels(levels):\n    // TODO: single-pass 3-way partition in O(1) space",
      expectedOutput: "[0, 0, 1, 1, 2, 2]\n[0, 1]",
      hint: "Keep `mid` unchanged after swapping a `2` with `levels[hi]` so the newly swapped element gets inspected.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function group_severity_levels(levels):\n    lo ← 0\n    mid ← 0\n    hi ← len(levels) - 1\n    while mid <= hi:\n        if levels[mid] == 0:\n            swap(levels, lo, mid)\n            lo ← lo + 1\n            mid ← mid + 1\n        else if levels[mid] == 1:\n            mid ← mid + 1\n        else:\n            swap(levels, mid, hi)\n            hi ← hi - 1\n    return levels",
    },
    {
      id: "dsa-m7-p4",
      title: "Closest Sorted Triplet to Target",
      patternHint: "Fix outer index i, then sweep left and right inward on the remaining sorted suffix while tracking the smallest absolute gap (Lesson 07-3).",
      lessonRefId: "dsa-multi-pointers",
      goal: "Given an already-sorted (non-decreasing) integer array `nums` (`length >= 3`) and integer `target`, find three distinct indices `i < j < k` whose sum `nums[i] + nums[j] + nums[k]` is closest to `target`, and return that closest sum (if tied, return the smaller sum).",
      constraints: ["3 <= len(nums) <= 1000", "nums is already sorted non-decreasing (sorting taught in M11)", "Target: O(n^2) time, O(1) space"],
      examples: [
        { input: "nums = [-4, -1, 1, 2], target = 1", output: "2", explanation: "-1 + 1 + 2 = 2 (distance 1 from 1)." },
        { input: "nums = [0, 0, 0], target = 5", output: "0" },
      ],
      tasks: [
        "Initialize `best = nums[0] + nums[1] + nums[2]`.",
        "For `i` from `0` to `len(nums) - 3`, skip duplicate `nums[i] == nums[i - 1]` and scan `left = i + 1`, `right = len(nums) - 1`.",
        "Update `best` whenever `abs(curr - target)` improves (breaking ties in favor of smaller `curr`), return `curr` early on `curr == target`, and shift `left` or `right` based on `curr < target`.",
      ],
      starterCode: "function closest_sorted_triplet(nums, target):\n    // TODO: O(n^2) anchor + inward pair scan on sorted nums",
      expectedOutput: "2\n0",
      hint: "Return `target` immediately if `curr == target`, since distance `0` cannot be beaten.",
      complexity: { time: "O(n^2)", space: "O(1)" },
      solutionCode:
        "function closest_sorted_triplet(nums, target):\n    n ← len(nums)\n    best ← nums[0] + nums[1] + nums[2]\n    for i from 0 to n - 3:\n        if i > 0 and nums[i] == nums[i - 1]: continue\n        left ← i + 1\n        right ← n - 1\n        while left < right:\n            curr ← nums[i] + nums[left] + nums[right]\n            diff_curr ← abs(curr - target)\n            diff_best ← abs(best - target)\n            if diff_curr < diff_best or (diff_curr == diff_best and curr < best):\n                best ← curr\n            if curr == target:\n                return curr\n            else if curr < target:\n                left ← left + 1\n            else:\n                right ← right - 1\n    return best",
    },
  ],
};
