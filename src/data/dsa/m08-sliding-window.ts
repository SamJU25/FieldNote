import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM08Lessons: Record<string, LessonContent> = {
  "dsa-fixed-window": {
    lessonId: "dsa-fixed-window",
    subtitle:
      "Reuse the previous length-k window result via + nums[right] - nums[left] so sliding across n items runs in O(n) time instead of O(n * k).",
    intro: {
      heading: "Fixed-Size Sliding Window",
      explanation: [
        "Recomputing every contiguous `k`-length slice with an inner loop performs `k` additions per start index, taking `O(n * k)` steps—over `2.5 * 10^9` operations when `n = 10^5` and `k = 5 * 10^4`. Even when sliding, forgetting to subtract `nums[left]` turns a fixed window into a growing prefix, while dividing `window_sum / k` inside the loop wastes floating-point precision on every step.",
        "Consecutive length-`k` windows overlap on `k - 1` middle elements. Updating the running state in `O(1)` per slide—adding incoming `nums[right]` and subtracting outgoing `nums[left]` once `right - left + 1 == k`—scans the entire array in `O(n)` time and `O(1)` extra space.",
      ],
      analogy:
        "Picture sliding a cardboard cutout of width `k` across a row of numbered tiles: shifting the frame one tile right pushes only the leftmost tile out of the frame and brings one new tile inside, while the `k - 1` tiles in the middle never move.",
      realWorldUses: [
        "Computing rolling `k`-second moving averages and peak throughput spikes on live telemetry streams",
        "Counting the maximum number of vowels or matching flags inside any length-`k` text slice in O(n) time and O(1) space",
      ],
    },
    sections: [
      {
        heading: "Reusing the k - 1 overlap: O(n * k) rescan vs O(n) slide",
        paragraphs: [
          "Trace `nums = [2, 1, 5, 1, 3, 2]` with `k = 3`. Window `[0..2]` sums to `2 + 1 + 5 = 8`. Slide to `[1..3]`: `8 + 1 - 2 = 7`. Slide to `[2..4]`: `7 + 3 - 1 = 9` (best!). Slide to `[3..5]`: `9 + 2 - 5 = 6`. Each slide runs two `O(1)` updates instead of re-summing `k` elements.",
          "In M03 you saw that a prefix sum array also answers fixed range queries in `O(1)` per index, at the cost of `O(n)` extra memory. A fixed-size sliding window achieves the same `O(n)` runtime while keeping auxiliary memory at `O(1)`.",
        ],
        table: {
          caption: "Comparing approaches for all contiguous windows of length k",
          headers: ["Approach", "Work per slide", "Total time", "Extra space", "When to prefer"],
          rows: [
            ["Brute force rescan", "Re-sum `k` items", "`O(n * k)`", "`O(1)`", "Never once `n * k > 10^7`"],
            ["Prefix sum array (M03)", "`pref[r + 1] - pref[l]`", "`O(n)`", "`O(n)`", "When querying arbitrary `[l, r]` ranges later"],
            ["Fixed sliding window", "`+ nums[right] - nums[left]`", "`O(n)`", "`O(1)`", "Any sequential fixed-length `k` scan"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Every fixed-size slide changes only two boundaries: add the newly entered element at `right` and subtract the newly exited element at `left` (`right - k`). The `k - 1` middle elements carry forward untouched.",
        },
      },
      {
        heading: "Max sum, max average, and max vowels of length k",
        paragraphs: [
          "One fixed-window template handles sums, averages, and character counts alike. Maintain `left = 0` and advance `right` from `0` to `n - 1`: add `arr[right]` to your running state, and once the window reaches size `k` (`right - left + 1 == k`), update `best`, subtract `arr[left]`, and increment `left` by `1`.",
          "For maximum average of length `k`, track the integer `best_sum` inside the loop and divide by `k` once at the end (`best_sum / k`) to avoid repeated floating-point rounding inside the loop. For maximum vowels in a substring of length `k`, add `1` when `s[right]` is a vowel and subtract `1` when outgoing `s[left]` is a vowel.",
        ],
        code: [
          "function max_vowels(s, k):",
          "    left ← 0, vowels ← 0, best ← 0",
          "    for right from 0 to len(s) - 1:",
          "        if s[right] in {'a', 'e', 'i', 'o', 'u'}:",
          "            vowels ← vowels + 1",
          "        if right - left + 1 == k:",
          "            best ← max(best, vowels)",
          "            if s[left] in {'a', 'e', 'i', 'o', 'u'}:",
          "                vowels ← vowels - 1",
          "            left ← left + 1",
          "    return best",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Fixed-size sliding window variants using the same left/right loop",
          headers: ["Problem", "Incoming update (+)", "Outgoing update (-)", "Answer returned"],
          rows: [
            ["Max sum of length `k`", "`window_sum += nums[right]`", "`window_sum -= nums[left]`", "`best_sum`"],
            ["Max average of length `k`", "`window_sum += nums[right]`", "`window_sum -= nums[left]`", "`best_sum / k`"],
            ["Max vowels in length `k`", "`vowels += is_vowel(s[right])`", "`vowels -= is_vowel(s[left])`", "`best_vowels`"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Always guard edge cases where `k <= 0` or `k > len(arr)`. Also keep `window_sum` in a 64-bit integer when array values can reach `10^4` or `10^9` across `10^5` elements.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From O(n * k) Rescans to O(1)-Per-Slide Fixed Windows",
      steps: [
        {
          label: "Step 1: Naive O(n * k) inner sum loop",
          explanation: "Re-summing `k` elements at every start index repeats `k - 1` additions on every slide.",
          code: [
            "function max_sum_naive(nums, k):",
            "    best ← -INF",
            "    for start from 0 to len(nums) - k:",
            "        cur ← 0",
            "        for j from start to start + k - 1: cur += nums[j]",
            "        best ← max(best, cur)",
            "    return best",
          ],
          activeLines: [3, 5],
          output: "O(n * k) steps -> times out for large n, k",
        },
        {
          label: "Step 2: Reuse overlap via + nums[right] - nums[left] (O(n))",
          explanation: "Add `nums[right]`; once `right - left + 1 == k`, update `best`, subtract `nums[left]`, and advance `left`.",
          code: [
            "function max_sum_k(nums, k):",
            "    left ← 0; window_sum ← 0; best ← -INF",
            "    for right from 0 to len(nums) - 1:",
            "        window_sum += nums[right]",
            "        if right - left + 1 == k:",
            "            best ← max(best, window_sum)",
            "            window_sum -= nums[left]",
            "            left += 1",
            "    return best",
          ],
          activeLines: [4, 5, 7, 8],
          output: "max_sum_k([2, 1, 5, 1, 3, 2], 3) -> 9",
        },
        {
          label: "Step 3: Guard bounds and adapt to vowel counting",
          explanation: "Return `0` if `k <= 0` or `k > len(s)`, then swap integer addition for `+1`/`-1` vowel checks.",
          code: [
            "function max_vowels(s, k):",
            "    if k <= 0 or k > len(s): return 0",
            "    left ← 0; vowels ← 0; best ← 0",
            "    for right from 0 to len(s) - 1:",
            "        if is_vowel(s[right]): vowels += 1",
            "        if right - left + 1 == k:",
            "            best ← max(best, vowels)",
            "            if is_vowel(s[left]): vowels -= 1",
            "            left += 1",
            "    return best",
          ],
          activeLines: [2, 5, 8],
          output: "max_vowels(\"abciiidef\", 3) -> 3",
        },
      ],
    },
    walkthrough: {
      title: "Slide a length-3 window across nums = [2, 1, 5, 1, 3, 2]",
      layout: "visual-first",
      steps: [
        {
          title: "Build the initial window [0..2] of size k = 3",
          tag: "CONCEPT",
          explanation: [
            "Start with `left = 0` and sum the first `k = 3` elements (`nums[0..2]`): `2 + 1 + 5 = 8`.",
            "Now `right = 2` completes our first full window (`right - left + 1 == 3`), so `best` starts at `8`.",
          ],
          code: [
            "// nums = [2, 1, 5, 1, 3, 2], k = 3",
            "window_sum ← nums[0] + nums[1] + nums[2]",
            "best ← window_sum",
            "left ← 0",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "# nums = [2, 1, 5, 1, 3, 2], k = 3",
              "window_sum = sum(nums[:k])",
              "best = window_sum",
              "left = 0",
            ],
          },
          state: [
            { name: "Window", value: "[0..2] -> [2, 1, 5]" },
            { name: "window_sum", value: "8", changed: true },
            { name: "best", value: "8", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Initial fixed frame (k = 3)",
                cells: [
                  { id: "c0", value: "2", index: 0, state: "active" },
                  { id: "c1", value: "1", index: 1, state: "active" },
                  { id: "c2", value: "5", index: 2, state: "active" },
                  { id: "c3", value: "1", index: 3, state: "dim" },
                  { id: "c4", value: "3", index: 4, state: "dim" },
                  { id: "c5", value: "2", index: 5, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "left", tone: "coral" },
                  { index: 2, label: "right", tone: "accent" },
                ],
                highlightRange: [0, 2],
              },
            ],
            caption: "First k = 3 elements establish baseline window_sum = 8 and best = 8.",
          },
        },
        {
          title: "Slide right to [1..3]: add nums[3] and subtract nums[0]",
          tag: "TRACE",
          explanation: [
            "Instead of re-adding `1 + 5 + 1`, reuse `window_sum = 8`: add incoming `nums[3] = 1` and subtract outgoing `nums[0] = 2`, then advance `left` to `1`.",
            "`window_sum` becomes `8 + 1 - 2 = 7`. Since `7 < 8`, `best` stays `8`.",
          ],
          code: [
            "for right from k to len(nums) - 1:",
            "    window_sum ← window_sum + nums[right] - nums[left]",
            "    left ← left + 1",
            "    best ← max(best, window_sum)",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "for right in range(k, len(nums)):",
              "    window_sum += nums[right] - nums[left]",
              "    left += 1",
              "    best = max(best, window_sum)",
            ],
          },
          state: [
            { name: "Slide delta", value: "+1 (right=3) - 2 (left=0)" },
            { name: "window_sum", value: "7", changed: true },
            { name: "best", value: "8" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Window slides to [1..3] (shared [1, 5] kept)",
                cells: [
                  { id: "c0", value: "2", index: 0, state: "dim" },
                  { id: "c1", value: "1", index: 1, state: "active" },
                  { id: "c2", value: "5", index: 2, state: "active" },
                  { id: "c3", value: "1", index: 3, state: "active" },
                  { id: "c4", value: "3", index: 4, state: "dim" },
                  { id: "c5", value: "2", index: 5, state: "dim" },
                ],
                pointers: [
                  { index: 1, label: "left", tone: "coral" },
                  { index: 3, label: "right", tone: "accent" },
                ],
                highlightRange: [1, 3],
              },
            ],
            caption: "Middle elements 1 and 5 stay inside; only boundary elements change.",
          },
        },
        {
          title: "Slide right to [2..4]: new peak window_sum = 9",
          tag: "TRACE",
          explanation: [
            "Next iteration (`right = 4`): add `nums[4] = 3` and subtract outgoing `nums[1] = 1`, then advance `left` to `2`.",
            "`window_sum` rises to `7 + 3 - 1 = 9`, beating `8`, so `best` updates to `9`.",
          ],
          code: [
            "for right from k to len(nums) - 1:",
            "    window_sum ← window_sum + nums[right] - nums[left]",
            "    left ← left + 1",
            "    best ← max(best, window_sum)",
          ],
          activeLines: [2, 4],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "for right in range(k, len(nums)):",
              "    window_sum += nums[right] - nums[left]",
              "    left += 1",
              "    best = max(best, window_sum)",
            ],
          },
          state: [
            { name: "Slide delta", value: "+3 (right=4) - 1 (left=1)" },
            { name: "window_sum", value: "9", changed: true },
            { name: "best", value: "9", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Window slides to [2..4] -> sum = 9 (new best)",
                cells: [
                  { id: "c0", value: "2", index: 0, state: "dim" },
                  { id: "c1", value: "1", index: 1, state: "dim" },
                  { id: "c2", value: "5", index: 2, state: "done" },
                  { id: "c3", value: "1", index: 3, state: "done" },
                  { id: "c4", value: "3", index: 4, state: "done" },
                  { id: "c5", value: "2", index: 5, state: "dim" },
                ],
                pointers: [
                  { index: 2, label: "left", tone: "ok" },
                  { index: 4, label: "right", tone: "ok" },
                ],
                highlightRange: [2, 4],
              },
            ],
            caption: "Subarray [5, 1, 3] reaches sum 9 in O(1) incremental work.",
          },
        },
        {
          title: "Final slide [3..5]: finish in O(n) time and O(1) space",
          tag: "PATTERN",
          explanation: [
            "At `right = 5`, add `nums[5] = 2` and subtract `nums[2] = 5`, advancing `left` to `3`. `window_sum` becomes `9 + 2 - 5 = 6`.",
            "Every element entered the window at most once and exited at most once, so `best = 9` returns in `O(n)` time with only scalar state.",
          ],
          code: [
            "for right from k to len(nums) - 1:",
            "    window_sum ← window_sum + nums[right] - nums[left]",
            "    left ← left + 1",
            "    best ← max(best, window_sum)",
            "return best",
          ],
          activeLines: [2, 5],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "for right in range(k, len(nums)):",
              "    window_sum += nums[right] - nums[left]",
              "    left += 1",
              "    best = max(best, window_sum)",
              "return best",
            ],
          },
          state: [
            { name: "Slide delta", value: "+2 (right=5) - 5 (left=2)" },
            { name: "window_sum", value: "6", changed: true },
            { name: "Returned best", value: "9" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Final window [3..5] -> sum = 6, answer = 9",
                cells: [
                  { id: "c0", value: "2", index: 0, state: "dim" },
                  { id: "c1", value: "1", index: 1, state: "dim" },
                  { id: "c2", value: "5", index: 2, state: "dim" },
                  { id: "c3", value: "1", index: 3, state: "active" },
                  { id: "c4", value: "3", index: 4, state: "active" },
                  { id: "c5", value: "2", index: 5, state: "active" },
                ],
                pointers: [
                  { index: 3, label: "left", tone: "coral" },
                  { index: 5, label: "right", tone: "accent" },
                ],
                highlightRange: [3, 5],
              },
            ],
            caption: "All 4 windows of length 3 inspected in a single pass with O(1) extra space.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Subtracting the wrong outgoing index",
        detail:
          "Before incrementing `left`, the element leaving the window is `nums[left]` (which equals `nums[right - k]`). Incrementing `left` before subtracting `nums[left]` drops the wrong item and corrupts the running sum.",
      },
      {
        title: "Averaging inside the loop instead of once at the end",
        detail:
          "Dividing `window_sum / k` on every step repeats floating-point division and risks tiny precision drift. Track the integer `best_sum` throughout the loop and divide by `k` once when returning.",
      },
      {
        title: "Forgetting k > len(arr) or negative values",
        detail:
          "If `nums` can hold negative values, initialize `best` to the first window sum (not `0`), otherwise an all-negative array like `[-4, -2, -7]` would falsely return `0`. Also guard `k <= 0` or `k > len(nums)` before reading `nums[0..k-1]`.",
      },
    ],
    practiceTask: {
      title: "Maximum Sum of Any Length-K Subarray",
      tier: "Warmup",
      goal: "Given an integer array `nums` and integer `k`, return the largest sum of any contiguous subarray of length `k` in `O(n)` time and `O(1)` extra space.",
      constraints: [
        "1 <= k <= len(nums) <= 10^5",
        "-10^4 <= nums[i] <= 10^4",
        "Target: O(n) time, O(1) extra space",
      ],
      examples: [
        { input: "nums = [2, 1, 5, 1, 3, 2], k = 3", output: "9", explanation: "Subarray [5, 1, 3] has sum 9." },
        { input: "nums = [-4, -2, -7, -1], k = 2", output: "-6", explanation: "Contiguous pairs [-4, -2], [-2, -7], and [-7, -1] sum to -6, -9, and -8; largest is -6." },
      ],
      tasks: [
        "Initialize `window_sum` as the sum of `nums[0..k-1]` and set `best = window_sum`.",
        "Slide `right` from `k` to `len(nums) - 1`, adding `nums[right]` and subtracting `nums[right - k]`, updating `best` each step.",
      ],
      starterCode: "function max_sum_k(nums, k):\n    // TODO: O(n) fixed sliding window\n    return best",
      expectedOutput: "9\n-6",
      hint: "Initialize `best = window_sum` (not `0`) so negative window sums are handled accurately.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function max_sum_k(nums, k):\n    window_sum ← 0\n    for i from 0 to k - 1:\n        window_sum ← window_sum + nums[i]\n    best ← window_sum\n    for right from k to len(nums) - 1:\n        window_sum ← window_sum + nums[right] - nums[right - k]\n        best ← max(best, window_sum)\n    return best",
    },
    practiceChallenges: [
      {
        title: "Maximum Sum of Any Length-K Subarray",
        tier: "Warmup",
        goal: "Given an integer array `nums` and integer `k`, return the maximum sum across all contiguous subarrays of exact length `k`.",
        constraints: ["1 <= k <= len(nums) <= 10^5", "-10^4 <= nums[i] <= 10^4", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [2, 1, 5, 1, 3, 2], k = 3", output: "9" },
          { input: "nums = [-4, -2, -7, -1], k = 2", output: "-6", explanation: "Contiguous pairs give -6, -9, and -8; largest is -6." },
        ],
        tasks: [
          "Compute the initial sum of indices `0..k-1`.",
          "Slide one index at a time using `+ nums[right] - nums[right - k]`.",
        ],
        starterCode: "function max_sum_k(nums, k):\n    // TODO: compute initial sum then slide right\n    return best",
        expectedOutput: "9\n-6",
        hint: "Fixed-size windows still work when `nums` has negative numbers because no conditional shrinking happens; just start `best` at the first window sum.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function max_sum_k(nums, k):\n    window_sum ← 0\n    for i from 0 to k - 1:\n        window_sum ← window_sum + nums[i]\n    best ← window_sum\n    for right from k to len(nums) - 1:\n        window_sum ← window_sum + nums[right] - nums[right - k]\n        best ← max(best, window_sum)\n    return best",
      },
      {
        title: "Maximum Average Subarray of Length K",
        tier: "Core",
        goal: "Given an integer array `nums` and integer `k`, return the maximum average value of any contiguous subarray of length `k`.",
        constraints: ["1 <= k <= len(nums) <= 10^5", "-10^4 <= nums[i] <= 10^4", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [1, 12, -5, -6, 50, 3], k = 4", output: "12.75", explanation: "(12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75." },
          { input: "nums = [5], k = 1", output: "5.0" },
        ],
        tasks: [
          "Track integer `window_sum` and `best_sum` across all length-`k` windows.",
          "Return `float(best_sum) / k` once after the loop ends.",
        ],
        starterCode: "function max_average_k(nums, k):\n    // TODO: find best integer sum of length k, divide once\n    return best_avg",
        expectedOutput: "12.75\n5.0",
        hint: "Maximizing `sum / k` for constant positive `k` is identical to maximizing `sum`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function max_average_k(nums, k):\n    window_sum ← 0\n    for i from 0 to k - 1:\n        window_sum ← window_sum + nums[i]\n    best_sum ← window_sum\n    for right from k to len(nums) - 1:\n        window_sum ← window_sum + nums[right] - nums[right - k]\n        best_sum ← max(best_sum, window_sum)\n    return float(best_sum) / k",
      },
      {
        title: "Maximum Vowels in a Substring of Length K",
        tier: "Stretch",
        goal: "Given a lowercase string `s` and integer `k`, return the maximum number of vowel letters (`'a'`, `'e'`, `'i'`, `'o'`, `'u'`) in any contiguous substring of length `k`.",
        constraints: ["1 <= k <= len(s) <= 10^5", "s contains lowercase English letters", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "s = \"abciiidef\", k = 3", output: "3", explanation: "\"iii\" contains 3 vowels." },
          { input: "s = \"rhythms\", k = 4", output: "0" },
        ],
        tasks: [
          "Write a small `is_vowel(ch)` check returning `1` for `'a','e','i','o','u'` and `0` otherwise.",
          "Slide `[left, right]` across `s` using `vowels += is_vowel(s[right])`, recording `best` at size `k`, then subtracting `is_vowel(s[left])` and incrementing `left`.",
        ],
        starterCode: "function max_vowels(s, k):\n    // TODO: O(n) fixed window vowel counter\n    return best",
        expectedOutput: "3\n0",
        hint: "Treat each character as `1` if it is a vowel and `0` if it is a consonant; then it behaves identically to max sum of size `k`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function max_vowels(s, k):\n    left ← 0, vowels ← 0, best ← 0\n    for right from 0 to len(s) - 1:\n        if s[right] in {'a', 'e', 'i', 'o', 'u'}:\n            vowels ← vowels + 1\n        if right - left + 1 == k:\n            best ← max(best, vowels)\n            if s[left] in {'a', 'e', 'i', 'o', 'u'}:\n                vowels ← vowels - 1\n            left ← left + 1\n    return best",
      },
    ],
  },

  "dsa-variable-window": {
    lessonId: "dsa-variable-window",
    subtitle:
      "Expand right and shrink left while invalid in O(2n) = O(n) worst-case time (O(1) amortized per pointer move) on non-negative arrays, and know when negatives break monotonicity.",
    intro: {
      heading: "Variable-Size Sliding Window",
      explanation: [
        "Two common bugs ruin variable sliding windows: writing `if window_sum > k` instead of `while window_sum > k` removes only one element when a huge value like `10` enters `[1, 1, 1, 10], k = 5`, leaving `window_sum = 12 > 5`! Worse, running a shrinking window on arrays with negative numbers (`[5, -4, 3], k = 4`) drops `5` early and misses the full 3-element answer.",
        "A **variable-size sliding window** expands `right` by `1` each step and runs a `while` loop on `left` until the window condition holds—moving both pointers forward at most `n` times each (`2n = O(n)` total). Because shrinking relies on **monotonicity** (removing a non-negative element never raises the sum), negative numbers require M06 Prefix Sum + Hash Map instead.",
      ],
      analogy:
        "Stretching an elastic tape measure across a row of positive weights: you pull the right end forward one item at a time, and whenever the tape gets too heavy (or reaches the target weight), you pull the left end inward until the rule holds. Because neither hand ever backs up, both hands together cross the row at most twice.",
      realWorldUses: [
        "Finding the longest stretch of requests or tasks whose total cost stays under a budget `k`",
        "Locating the shortest burst of log events whose cumulative load reaches or exceeds a threshold `target`",
      ],
    },
    sections: [
      {
        heading: "Expand right, shrink left, and the 2n = O(n) worst-case bound",
        paragraphs: [
          "Trace `nums = [1, 1, 1, 10], k = 5` (longest with `sum <= 5`): after `right = 0..2`, `best = 3` (`[1, 1, 1]`). At `right = 3`, `10` enters (`window_sum = 13 > 5`). A buggy `if window_sum > k` drops only `nums[0] = 1`, leaving `[1, 1, 10]` (`12 > 5`!). A `while window_sum > k` loop shrinks `left` all the way to `4` (`window_sum = 0`), preserving `best = 3`.",
          "Variable windows appear in two opposite shapes on non-negative arrays: **longest valid** (`while window_sum > k`, update `best` *after* the loop) and **shortest valid** (`while window_sum >= target`, update `best` *inside* the loop before dropping `nums[left]`). Since `left` never moves backward, `right` (`n` steps) + `left` (`<= n` steps) caps total moves at `2n = O(n)`.",
        ],
        code: [
          "# Broken: single-step if drops only one element, leaving sum > target",
          "def longest_if_bug(nums, target):",
          "    left = 0; window_sum = 0; best = 0",
          "    for right, x in enumerate(nums):",
          "        window_sum += x",
          "        if window_sum > target:        # bug: [1, 1, 1, 10] leaves [1, 1, 10] with sum=12 > 5!",
          "            window_sum -= nums[left]; left += 1",
          "        best = max(best, right - left + 1)",
          "    return best, window_sum",
          "",
          "# Working: while window_invalid loop shrinks until window_sum <= target",
          "def longest_while_ok(nums, target):",
          "    left = 0; window_sum = 0; best = 0",
          "    for right, x in enumerate(nums):",
          "        window_sum += x",
          "        while window_sum > target:     # window_invalid: shrinks left to 4, sum=0",
          "            window_sum -= nums[left]; left += 1",
          "        best = max(best, right - left + 1)",
          "    return best, window_sum",
        ],
        codeLabel: "Python",
        output: "nums=[1, 1, 1, 10], target=5 -> if shrink: best=3, sum=12 (> 5!) | while shrink: best=3, sum=0",
        table: {
          caption: "Two core variable-size sliding window patterns (non-negative inputs)",
          headers: ["Goal", "Inner while condition", "When to update best", "Initial best & empty guard"],
          rows: [
            ["Longest subarray with `sum <= k`", "`while window_sum > k` (invalid)", "After `while` loop exits (`right - left + 1`)", "`best = 0`"],
            ["Shortest subarray with `sum >= target`", "`while window_sum >= target` (valid)", "Inside `while` loop before removing `nums[left]`", "`best = INF`, return `0` if unchanged"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "KEY IDEA",
          text: "A nested `while` loop is still `O(n)` overall whenever `left` only moves forward. Each element enters the window once (via `right += 1`) and leaves at most once (via `left += 1`), capping total pointer moves at `2n`.",
        },
      },
      {
        heading: "Why negative numbers break monotonic shrinking",
        paragraphs: [
          "Suppose `nums = [5, -4, 3]` and you want the longest subarray with `sum <= 4`. At `right = 0`, `window_sum = 5 > 4`, so a variable window shrinks `left` to `1` and discards `5`. Later at `right = 2`, it finds `[-4, 3]` (length `2`), completely missing `[5, -4, 3]` (sum `4`, length `3`).",
          "Shrinking `left` assumes that removing `nums[left]` decreases `window_sum` and adding future elements increases `window_sum`. When negative numbers exist, adding an element can *lower* the sum and removing a negative `nums[left]` can *raise* the sum. Whenever negative values are allowed (such as finding subarrays with exact sum `k`), switch to **M06 Prefix Sum + Hash Map** (`prefix_sum - k`).",
        ],
        table: {
          caption: "Does Variable-Size Sliding Window apply?",
          headers: ["Input domain & condition", "Monotonicity holds?", "Algorithm to use"],
          rows: [
            ["Non-negative numbers, `sum <= k` (longest)", "Yes (adding increases, removing decreases)", "Variable sliding window (`O(n)` time, `O(1)` space)"],
            ["Positive numbers, `sum >= target` (shortest)", "Yes (adding increases, removing decreases)", "Variable sliding window (`O(n)` time, `O(1)` space)"],
            ["Positive and negative numbers, `sum == k`", "No (future negatives can cancel excess)", "M06 Prefix Sum + Hash Map (`O(n)` time, `O(n)` space)"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Never apply variable-size shrinking to subarray sum problems that allow negative numbers. If `nums[i]` can be negative, discarding `nums[left]` early can skip valid longer or shorter answers later in the array.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From Single-Step Shrink Bugs to Longest & Shortest Variable Windows",
      steps: [
        {
          label: "Step 1: Broken single-step if shrink",
          explanation: "Using `if window_sum > k` drops only one item when a large number enters, leaving the window invalid.",
          code: [
            "function longest_broken(nums, k):",
            "    left ← 0; window_sum ← 0; best ← 0",
            "    for right from 0 to len(nums) - 1:",
            "        window_sum += nums[right]",
            "        if window_sum > k:   // WRONG: should be while",
            "            window_sum -= nums[left]; left += 1",
            "        best ← max(best, right - left + 1)",
            "    return best",
          ],
          activeLines: [5],
          output: "longest_broken([1, 1, 1, 10], 5) -> 3? Wait: [1,1,10] gives wrong state!",
        },
        {
          label: "Step 2: Shrink with while while invalid (longest sum <= k)",
          explanation: "Looping `while window_sum > k` restores validity before measuring `right - left + 1` in `O(2n) = O(n)` total moves.",
          code: [
            "function longest_subarray_at_most_k(nums, k):",
            "    left ← 0; window_sum ← 0; best ← 0",
            "    for right from 0 to len(nums) - 1:",
            "        window_sum += nums[right]",
            "        while window_sum > k:",
            "            window_sum -= nums[left]; left += 1",
            "        best ← max(best, right - left + 1)",
            "    return best",
          ],
          activeLines: [5, 7],
          output: "longest_subarray_at_most_k([1, 1, 1, 10], 5) -> 3",
        },
        {
          label: "Step 3: Record best inside while valid (shortest sum >= target)",
          explanation: "To minimize length, record `right - left + 1` while `window_sum >= target` holds, then shrink `left`.",
          code: [
            "function min_subarray_len(target, nums):",
            "    left ← 0; window_sum ← 0; best ← INF",
            "    for right from 0 to len(nums) - 1:",
            "        window_sum += nums[right]",
            "        while window_sum >= target:",
            "            best ← min(best, right - left + 1)",
            "            window_sum -= nums[left]; left += 1",
            "    return 0 if best == INF else best",
          ],
          activeLines: [5, 6, 7],
          output: "min_subarray_len(7, [2, 3, 1, 2, 4, 3]) -> 2",
        },
      ],
    },
    walkthrough: {
      title: "Find minimum length subarray with sum >= 7 on [2, 3, 1, 2, 4, 3]",
      layout: "visual-first",
      steps: [
        {
          title: "Expand right across indices 0..2 while sum < 7",
          tag: "CONCEPT",
          explanation: [
            "Start with `left = 0`, `window_sum = 0`, `best = INF`. Expanding `right` through `0`, `1`, and `2` accumulates `2 + 3 + 1 = 6`.",
            "Since `6 < 7`, the `while window_sum >= 7` shrink loop does not run yet.",
          ],
          code: [
            "// nums = [2, 3, 1, 2, 4, 3], target = 7",
            "left ← 0, window_sum ← 0, best ← INF",
            "for right from 0 to len(nums) - 1:",
            "    window_sum ← window_sum + nums[right]",
            "    while window_sum >= target:",
            "        best ← min(best, right - left + 1)",
            "        window_sum ← window_sum - nums[left]",
            "        left ← left + 1",
          ],
          activeLines: [4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Window", value: "[0..2] -> [2, 3, 1]" },
            { name: "window_sum", value: "6 (< 7)", changed: true },
            { name: "best", value: "INF" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Expanding right until sum reaches target = 7",
                cells: [
                  { id: "v0", value: "2", index: 0, state: "active" },
                  { id: "v1", value: "3", index: 1, state: "active" },
                  { id: "v2", value: "1", index: 2, state: "active" },
                  { id: "v3", value: "2", index: 3, state: "dim" },
                  { id: "v4", value: "4", index: 4, state: "dim" },
                  { id: "v5", value: "3", index: 5, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "left", tone: "coral" },
                  { index: 2, label: "right", tone: "accent" },
                ],
                highlightRange: [0, 2],
              },
            ],
            caption: "Sum 6 is still below 7, so left stays at 0.",
          },
        },
        {
          title: "Expand right = 3: sum hits 8 >= 7, record best = 4",
          tag: "TRACE",
          explanation: [
            "Adding `nums[3] = 2` pushes `window_sum` to `8 >= 7`.",
            "Inside `while window_sum >= 7`, record candidate length `3 - 0 + 1 = 4`, so `best` updates from `INF` to `4`.",
          ],
          code: [
            "    window_sum ← window_sum + nums[right]",
            "    while window_sum >= target:",
            "        best ← min(best, right - left + 1)",
            "        window_sum ← window_sum - nums[left]",
            "        left ← left + 1",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Window", value: "[0..3] -> [2, 3, 1, 2]" },
            { name: "window_sum", value: "8 (>= 7)", changed: true },
            { name: "best", value: "4", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "First valid window [0..3] of length 4",
                cells: [
                  { id: "v0", value: "2", index: 0, state: "active" },
                  { id: "v1", value: "3", index: 1, state: "active" },
                  { id: "v2", value: "1", index: 2, state: "active" },
                  { id: "v3", value: "2", index: 3, state: "active" },
                  { id: "v4", value: "4", index: 4, state: "dim" },
                  { id: "v5", value: "3", index: 5, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "left", tone: "coral" },
                  { index: 3, label: "right", tone: "accent" },
                ],
                highlightRange: [0, 3],
              },
            ],
            caption: "Window [0..3] meets target 7, updating best to 4 before shrinking.",
          },
        },
        {
          title: "Shrink left to 1: sum drops to 6 < 7 and loop stops",
          tag: "TRACE",
          explanation: [
            "Subtract `nums[0] = 2` and increment `left` to `1`. Now `[1..3]` (`[3, 1, 2]`) has `window_sum = 6 < 7`.",
            "The `while` loop exits because any shorter subarray ending at index `3` will also sum below `7`.",
          ],
          code: [
            "    while window_sum >= target:",
            "        best ← min(best, right - left + 1)",
            "        window_sum ← window_sum - nums[left]",
            "        left ← left + 1",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Window", value: "[1..3] -> [3, 1, 2]" },
            { name: "window_sum", value: "6 (< 7)", changed: true },
            { name: "best", value: "4" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After shrinking left to 1 (sum = 6 < 7)",
                cells: [
                  { id: "v0", value: "2", index: 0, state: "dim" },
                  { id: "v1", value: "3", index: 1, state: "active" },
                  { id: "v2", value: "1", index: 2, state: "active" },
                  { id: "v3", value: "2", index: 3, state: "active" },
                  { id: "v4", value: "4", index: 4, state: "dim" },
                  { id: "v5", value: "3", index: 5, state: "dim" },
                ],
                pointers: [
                  { index: 1, label: "left", tone: "coral" },
                  { index: 3, label: "right", tone: "accent" },
                ],
                highlightRange: [1, 3],
              },
            ],
            caption: "Removing nums[0] = 2 drops sum below 7, pausing left at index 1.",
          },
        },
        {
          title: "Expand right = 4 (+4 -> 10) and shrink once to [2..4] (best = 3)",
          tag: "TRACE",
          explanation: [
            "Adding `nums[4] = 4` raises `window_sum` from `6` to `10 >= 7`. Shrinking `left = 1` drops `nums[1] = 3` and leaves `[2..4]` (`[1, 2, 4]`, `sum = 7 >= 7`).",
            "Because `[2..4]` is still valid, we record `best = min(4, 3) = 3` before the next shrink iteration drops `nums[2] = 1`.",
          ],
          code: [
            "    window_sum ← window_sum + nums[right]",
            "    while window_sum >= target:",
            "        best ← min(best, right - left + 1)",
            "        window_sum ← window_sum - nums[left]",
            "        left ← left + 1",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Window", value: "[2..4] -> [1, 2, 4]" },
            { name: "window_sum", value: "7 (>= 7)", changed: true },
            { name: "best", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Intermediate valid window [2..4] sets best = 3",
                cells: [
                  { id: "v0", value: "2", index: 0, state: "dim" },
                  { id: "v1", value: "3", index: 1, state: "dim" },
                  { id: "v2", value: "1", index: 2, state: "active" },
                  { id: "v3", value: "2", index: 3, state: "active" },
                  { id: "v4", value: "4", index: 4, state: "active" },
                  { id: "v5", value: "3", index: 5, state: "dim" },
                ],
                pointers: [
                  { index: 2, label: "left", tone: "coral" },
                  { index: 4, label: "right", tone: "accent" },
                ],
                highlightRange: [2, 4],
              },
            ],
            caption: "After dropping 3, [1, 2, 4] still sums to 7 >= 7 and improves best to 3.",
          },
        },
        {
          title: "Finish shrinking [2..4] -> [3..4] (sum = 6 < 7)",
          tag: "TRACE",
          explanation: [
            "Subtracting `nums[2] = 1` and advancing `left` to `3` drops `window_sum` to `6 < 7` on `[3..4]` (`[2, 4]`).",
            "The inner `while` loop pauses at `left = 3`, ready for the final element at `right = 5`.",
          ],
          code: [
            "    while window_sum >= target:",
            "        best ← min(best, right - left + 1)",
            "        window_sum ← window_sum - nums[left]",
            "        left ← left + 1",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Window", value: "[3..4] -> [2, 4]" },
            { name: "window_sum", value: "6 (< 7)", changed: true },
            { name: "best", value: "3" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Tightened to [3..4] after recording best = 3",
                cells: [
                  { id: "v0", value: "2", index: 0, state: "dim" },
                  { id: "v1", value: "3", index: 1, state: "dim" },
                  { id: "v2", value: "1", index: 2, state: "dim" },
                  { id: "v3", value: "2", index: 3, state: "active" },
                  { id: "v4", value: "4", index: 4, state: "active" },
                  { id: "v5", value: "3", index: 5, state: "dim" },
                ],
                pointers: [
                  { index: 3, label: "left", tone: "coral" },
                  { index: 4, label: "right", tone: "accent" },
                ],
                highlightRange: [3, 4],
              },
            ],
            caption: "Dropping nums[2] = 1 pauses left at index 3 with sum 6 < 7.",
          },
        },
        {
          title: "Expand right = 5 (+3 -> 9) and shrink to optimal [4..5] (len 2)",
          tag: "PATTERN",
          explanation: [
            "Adding `nums[5] = 3` reaches `window_sum = 9 >= 7`. Shrinking `left = 3` removes `2`, leaving `[4..5]` (`[4, 3]`, `sum = 7`), which sets `best = 2`.",
            "One last shrink moves `left` past `4` (`sum = 3 < 7`) and ends the pass. Total moves: `right` took `6` steps and `left` took `5` steps (`11 <= 2n = 12`).",
          ],
          code: [
            "    while window_sum >= target:",
            "        best ← min(best, right - left + 1)",
            "        window_sum ← window_sum - nums[left]",
            "        left ← left + 1",
            "return 0 if best == INF else best",
          ],
          activeLines: [2, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Optimal window", value: "[4..5] -> [4, 3] (sum = 7)" },
            { name: "Total pointer moves", value: "6 right + 5 left = 11 <= 2n" },
            { name: "Returned best", value: "2", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Optimal subarray [4, 3] found at [4..5] -> best = 2",
                cells: [
                  { id: "v0", value: "2", index: 0, state: "dim" },
                  { id: "v1", value: "3", index: 1, state: "dim" },
                  { id: "v2", value: "1", index: 2, state: "dim" },
                  { id: "v3", value: "2", index: 3, state: "dim" },
                  { id: "v4", value: "4", index: 4, state: "done" },
                  { id: "v5", value: "3", index: 5, state: "done" },
                ],
                pointers: [
                  { index: 4, label: "left (at best)", tone: "ok" },
                  { index: 5, label: "right", tone: "ok" },
                ],
                highlightRange: [4, 5],
              },
            ],
            caption: "Both pointers together crossed the array fewer than 2n times.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Updating best inside vs outside the shrink loop",
        detail:
          "For longest valid subarray (`sum <= k`), update `best` *after* the `while window_sum > k` loop restores validity. For shortest valid subarray (`sum >= target`), update `best` *inside* `while window_sum >= target` before popping `nums[left]`.",
      },
      {
        title: "Returning sentinel INF when no subarray qualifies",
        detail:
          "In shortest-window problems, if all elements combined still sum below `target`, `best` stays `INF`. Always convert `best == INF` to `0` at return time.",
      },
      {
        title: "Negative numbers break variable-size shrinking",
        detail:
          "When `nums` contains negatives, shrinking `left` can increase `window_sum` and later elements can decrease it. Use M06 Prefix Sum + Hash Map instead of variable sliding window whenever negatives appear.",
      },
    ],
    practiceTask: {
      title: "Longest Subarray With Sum <= K",
      tier: "Warmup",
      goal: "Given a non-negative integer array `nums` and integer `k`, return the maximum length of a contiguous subarray whose sum is at most `k`.",
      constraints: [
        "1 <= len(nums) <= 10^5",
        "0 <= nums[i] <= 10^4",
        "0 <= k <= 10^9",
        "Target: O(n) time, O(1) extra space",
      ],
      examples: [
        { input: "nums = [3, 1, 2, 7, 4, 2, 1, 1, 5], k = 8", output: "4", explanation: "Subarray [4, 2, 1, 1] has sum 8 and length 4." },
        { input: "nums = [10, 12], k = 5", output: "0", explanation: "No non-empty subarray has sum <= 5." },
      ],
      tasks: [
        "Expand `right` across `nums` adding `nums[right]` to `window_sum`.",
        "While `window_sum > k`, subtract `nums[left]` and increment `left`; then update `best = max(best, right - left + 1)`.",
      ],
      starterCode: "function longest_subarray_le_k(nums, k):\n    // TODO: variable sliding window on non-negative nums\n    return best",
      expectedOutput: "4\n0",
      hint: "Update `best` only *after* `while window_sum > k` finishes so the window `[left, right]` is guaranteed valid.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function longest_subarray_le_k(nums, k):\n    left ← 0, window_sum ← 0, best ← 0\n    for right from 0 to len(nums) - 1:\n        window_sum ← window_sum + nums[right]\n        while window_sum > k:\n            window_sum ← window_sum - nums[left]\n            left ← left + 1\n        best ← max(best, right - left + 1)\n    return best",
    },
    practiceChallenges: [
      {
        title: "Longest Subarray With Sum <= K",
        tier: "Warmup",
        goal: "Given a non-negative array `nums` and integer `k`, return the length of the longest contiguous subarray with sum `<= k`.",
        constraints: ["1 <= len(nums) <= 10^5", "0 <= nums[i] <= 10^4", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [3, 1, 2, 7, 4, 2, 1, 1, 5], k = 8", output: "4" },
          { input: "nums = [10, 12], k = 5", output: "0" },
        ],
        tasks: [
          "Expand `right`, shrink `left` while `window_sum > k`, and update `best` afterward.",
        ],
        starterCode: "function longest_subarray_le_k(nums, k):\n    // TODO: O(n) variable sliding window\n    return best",
        expectedOutput: "4\n0",
        hint: "When `nums[right] > k`, the `while` loop shrinks `left` past `right` (`left = right + 1`), making `right - left + 1 == 0` automatically.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function longest_subarray_le_k(nums, k):\n    left ← 0, window_sum ← 0, best ← 0\n    for right from 0 to len(nums) - 1:\n        window_sum ← window_sum + nums[right]\n        while window_sum > k:\n            window_sum ← window_sum - nums[left]\n            left ← left + 1\n        best ← max(best, right - left + 1)\n    return best",
      },
      {
        title: "Minimum Size Subarray With Sum >= Target",
        tier: "Core",
        goal: "Given an array of positive integers `nums` and integer `target`, return the minimal length of a contiguous subarray whose sum is at least `target`, or `0` if none exists.",
        constraints: ["1 <= len(nums) <= 10^5", "1 <= nums[i] <= 10^4", "1 <= target <= 10^9", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [2, 3, 1, 2, 4, 3], target = 7", output: "2", explanation: "[4, 3] has sum 7 and length 2." },
          { input: "nums = [1, 1, 1, 1], target = 10", output: "0" },
        ],
        tasks: [
          "Expand `right` and add `nums[right]` to `window_sum`.",
          "While `window_sum >= target`, update `best = min(best, right - left + 1)` and shrink `left`.",
        ],
        starterCode: "function min_subarray_len(target, nums):\n    // TODO: shrink while sum >= target\n    return best_or_zero",
        expectedOutput: "2\n0",
        hint: "Record `best` *before* subtracting `nums[left]`, and convert an untouched `INF` sentinel to `0` when returning.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function min_subarray_len(target, nums):\n    left ← 0, window_sum ← 0, best ← INF\n    for right from 0 to len(nums) - 1:\n        window_sum ← window_sum + nums[right]\n        while window_sum >= target:\n            best ← min(best, right - left + 1)\n            window_sum ← window_sum - nums[left]\n            left ← left + 1\n    return 0 if best == INF else best",
      },
      {
        title: "Longest Ones Window With At Most One Zero",
        tier: "Stretch",
        goal: "Given a binary array `nums` containing only `0` and `1`, return the longest contiguous subarray that contains at most one `0`.",
        constraints: ["1 <= len(nums) <= 10^5", "nums[i] in {0, 1}", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "nums = [1, 0, 1, 1, 0, 1]", output: "4", explanation: "Subarrays [1, 0, 1, 1] and [1, 1, 0, 1] each have length 4 and contain one 0." },
          { input: "nums = [0, 0]", output: "1" },
        ],
        tasks: [
          "Maintain a scalar count `zeros` inside `[left, right]`.",
          "While `zeros > 1`, decrement `zeros` if `nums[left] == 0` and increment `left`; update `best = max(best, right - left + 1)`.",
        ],
        starterCode: "function longest_with_one_zero(nums):\n    // TODO: variable window keeping zeros <= 1\n    return best",
        expectedOutput: "4\n1",
        hint: "Counting `0`s inside `[left, right]` is identical to keeping a subarray sum of flipped bits `1 - nums[i]` at most `1`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function longest_with_one_zero(nums):\n    left ← 0, zeros ← 0, best ← 0\n    for right from 0 to len(nums) - 1:\n        if nums[right] == 0:\n            zeros ← zeros + 1\n        while zeros > 1:\n            if nums[left] == 0:\n                zeros ← zeros - 1\n            left ← left + 1\n        best ← max(best, right - left + 1)\n    return best",
      },
    ],
  },

  "dsa-window-hashing": {
    lessonId: "dsa-window-hashing",
    subtitle:
      "Combine M08 window bounds with M06 Hash Sets and Hash Maps for unique-character streaks, k-replacement runs, and Minimum Window Substring.",
    intro: {
      heading: "Sliding Window with Hash Maps & Sets",
      explanation: [
        "Scanning the window frequency map on every step adds an `O(alphabet)` factor, and two quota bugs break Minimum Window Substring: setting `required = len(t)` instead of `len(need)` (distinct chars) stalls forever on `t = \"AA\"` (`len(need) = 1`, never `2`), while incrementing `formed` on every match instead of exact `window[ch] == need[ch]` lets `'AAA'` satisfy `t = \"ABC\"`!",
        "Pairing M08 bounds `[left, right]` with an M06 Hash Set (`seen`), frequency map + `max_freq`, or `formed == required` distinct-quota counter keeps every expand and shrink step `O(1)` and solves distinct-character, `k`-replacement, and minimum-cover problems in `O(n)` time.",
      ],
      analogy:
        "Picture a checkpoint tent spanning `[left, right]` with a live tally board (Hash Map) listing every badge color currently inside. When someone steps in at `right`, you add one mark; whenever a rule breaks or a quota is met, people step out at `left` and erase one mark.",
      realWorldUses: [
        "Measuring the longest streak of distinct session IDs or characters without repeats",
        "Locating the shortest log snippet or search excerpt containing every required keyword",
      ],
    },
    sections: [
      {
        heading: "Three hash-backed sliding window templates",
        paragraphs: [
          "For **Longest Substring Without Repeating Characters**, keep a Hash Set `seen` of characters inside `[left, right]`. Before inserting `s[right]`, shrink `left` while `s[right] in seen` (removing `s[left]`), then add `s[right]` and update `best = max(best, right - left + 1)`.",
          "For **Longest Repeating Character Replacement**, track `counts[ch]` and the highest single-character count `max_freq` seen so far. In a window of size `len = right - left + 1`, the remaining `len - max_freq` characters are the ones that must be replaced; if `len - max_freq > k`, shrink `left` by `1` and decrement `counts[s[left]]`. You do not need to scan `counts` to lower `max_freq` on shrink because only a strictly *higher* `max_freq` can ever produce a longer valid window later.",
        ],
        table: {
          caption: "Comparing the three M08 + M06 hash-backed window patterns",
          headers: ["Classic Problem", "M06 Structure", "Window Condition", "Time / Space"],
          rows: [
            ["Longest Substring Without Repeating Characters", "Hash Set `seen` (or `last_seen` map)", "Shrink while `s[right] in seen`", "`O(n)` time, `O(min(n, alphabet))` space"],
            ["Longest Repeating Character Replacement", "Frequency Map `counts` + scalar `max_freq`", "Shrink when `(right - left + 1) - max_freq > k`", "`O(n)` time, `O(alphabet)` space"],
            ["Minimum Window Substring", "`need` map + `window` map + `formed == required`", "Shrink while `formed == required`", "`O(|s| + |t|)` time, `O(|s| + |t|)` space"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Combining M08 pointers with an M06 Hash Set or Hash Map keeps each expand and shrink step `O(1)`, avoiding `O(n^2)` substring slicing and avoiding repeated full-map scans.",
        },
      },
      {
        heading: "Why formed == required runs in O(1) per step",
        paragraphs: [
          "In **Minimum Window Substring**, you want the shortest substring of `s` containing every character of `t` with at least `t`'s multiplicity. Checking `all(window[ch] >= need[ch])` across the entire `need` map on every pointer move would multiply runtime by the size of the alphabet.",
          "Instead, compute `need[ch]` from `t` and set `required = len(need)` (the number of *distinct* keys in `need`). Maintain `formed`, which increments by `1` only at the exact moment `window[ch]` reaches `need[ch]`, and decrements by `1` only when shrinking causes `window[ch]` to fall strictly below `need[ch]`. Testing whether the window covers all of `t` is then a single `O(1)` comparison: `formed == required`.",
        ],
        code: [
          "function min_window(s, t):",
          "    if len(t) == 0: return \"\"",
          "    need ← char frequency map of t",
          "    window ← empty map, required ← len(need), formed ← 0",
          "    left ← 0, best_len ← INF, best_start ← 0",
          "    for right from 0 to len(s) - 1:",
          "        ch ← s[right]",
          "        window[ch] ← window.get(ch, 0) + 1",
          "        if ch in need and window[ch] == need[ch]:",
          "            formed ← formed + 1",
          "        while formed == required:",
          "            if right - left + 1 < best_len:",
          "                best_len ← right - left + 1",
          "                best_start ← left",
          "            out ← s[left]",
          "            window[out] ← window[out] - 1",
          "            if out in need and window[out] < need[out]:",
          "                formed ← formed - 1",
          "            left ← left + 1",
          "    return \"\" if best_len == INF else s[best_start : best_start + best_len]  // slice [best_start .. best_start + best_len - 1]",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "How formed updates when need = { A: 2, B: 1 } (required = 2)",
          headers: ["Event", "window['A']", "window['B']", "formed", "Why"],
          rows: [
            ["First `'A'` enters", "`1`", "`0`", "`0`", "`1 != 2`, quota for `'A'` not met yet"],
            ["Second `'A'` enters", "`2`", "`0`", "`1`", "`window['A'] == need['A']` met"],
            ["Third `'A'` enters", "`3`", "`0`", "`1`", "Already met; never double-count `'A'`"],
            ["First `'B'` enters", "`3`", "`1`", "`2`", "`formed == required` (window valid!)"],
            ["Extra `'A'` leaves", "`2`", "`1`", "`2`", "`2 >= 2`, still valid so `formed` stays `2`"],
            ["Second `'A'` leaves", "`1`", "`1`", "`1`", "`1 < 2`, fell below quota so `formed` drops"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "WATCH OUT",
          text: "`required` is the count of distinct characters in `t` (`len(need)`), not `len(t)`. Only increment `formed` on exact equality (`window[ch] == need[ch]`) and only decrement `formed` when shrinking drops strictly below (`window[out] < need[out]`).",
        },
      },
    ],
    guidedBuildUp: {
      title: "From Hash-Set Unique Streaks to Distinct-Quota Minimum Windows",
      steps: [
        {
          label: "Step 1: Shrink Hash Set until duplicate leaves",
          explanation: "Remove `s[left]` inside `while s[right] in seen` so `[left, right]` stays duplicate-free.",
          code: [
            "function longest_unique_substring(s):",
            "    seen ← empty Hash Set; left ← 0; best ← 0",
            "    for right from 0 to len(s) - 1:",
            "        while s[right] in seen:",
            "            seen.remove(s[left]); left += 1",
            "        seen.add(s[right])",
            "        best ← max(best, right - left + 1)",
            "    return best",
          ],
          activeLines: [4, 5],
          output: "longest_unique_substring(\"abcabcbb\") -> 3",
        },
        {
          label: "Step 2: Frequency map + max_freq for k replacements",
          explanation: "Track `counts[ch]` and `max_freq`; shrink `left` when `(right - left + 1) - max_freq > k`.",
          code: [
            "function character_replacement(s, k):",
            "    counts ← empty map; left ← 0; max_freq ← 0; best ← 0",
            "    for right from 0 to len(s) - 1:",
            "        counts[s[right]] ← counts.get(s[right], 0) + 1",
            "        max_freq ← max(max_freq, counts[s[right]])",
            "        if (right - left + 1) - max_freq > k:",
            "            counts[s[left]] -= 1; left += 1",
            "        best ← max(best, right - left + 1)",
            "    return best",
          ],
          activeLines: [5, 6],
          output: "character_replacement(\"AABABBA\", 1) -> 4",
        },
        {
          label: "Step 3: Distinct quota formed == len(need) for Minimum Window",
          explanation: "Increment `formed` only when `window[ch] == need[ch]` and decrement only when `window[out] < need[out]`.",
          code: [
            "// required ← len(need), formed ← 0",
            "if ch in need and window[ch] == need[ch]: formed += 1",
            "while formed == required:",
            "    update_best(left, right)",
            "    out ← s[left]; window[out] -= 1",
            "    if out in need and window[out] < need[out]: formed -= 1",
            "    left += 1",
          ],
          activeLines: [2, 3, 6],
          output: "min_window(\"ADOBECBA\", \"ABC\") -> \"CBA\"",
        },
      ],
    },
    walkthrough: {
      title: "Trace Minimum Window Substring on s = \"ADOBECBA\", t = \"ABC\"",
      layout: "visual-first",
      steps: [
        {
          title: "Expand right through 0..4: A and B satisfied, C still missing",
          tag: "CONCEPT",
          explanation: [
            "For `t = \"ABC\"`, `need = {A: 1, B: 1, C: 1}` so `required = 3`.",
            "Scanning `\"ADOBE\"` (`right = 0..4`) fills `window[A] = 1` and `window[B] = 1`, giving `formed = 2 < 3`. Irrelevant characters `D`, `O`, `E` never increment `formed`.",
          ],
          code: [
            "// s = \"ADOBECBA\", t = \"ABC\" -> need={A:1,B:1,C:1}, required=3",
            "ch ← s[right]",
            "window[ch] ← window.get(ch, 0) + 1",
            "if ch in need and window[ch] == need[ch]:",
            "    formed ← formed + 1",
          ],
          activeLines: [3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Window", value: "[0..4] -> \"ADOBE\"" },
            { name: "window (A,B,C)", value: "A:1, B:1, C:0" },
            { name: "formed / required", value: "2 / 3" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Expanding right: waiting for 'C'",
                cells: [
                  { id: "h0", value: "A", index: 0, state: "active" },
                  { id: "h1", value: "D", index: 1, state: "active" },
                  { id: "h2", value: "O", index: 2, state: "active" },
                  { id: "h3", value: "B", index: 3, state: "active" },
                  { id: "h4", value: "E", index: 4, state: "active" },
                  { id: "h5", value: "C", index: 5, state: "dim" },
                  { id: "h6", value: "B", index: 6, state: "dim" },
                  { id: "h7", value: "A", index: 7, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "left", tone: "coral" },
                  { index: 4, label: "right", tone: "accent" },
                ],
                highlightRange: [0, 4],
              },
            ],
            caption: "formed is 2/3 because 'C' has not entered the window yet.",
          },
        },
        {
          title: "Expand right = 5 ('C'): formed == 3, record \"ADOBEC\" (len 6)",
          tag: "TRACE",
          explanation: [
            "At `right = 5`, `'C'` arrives so `window[C] = 1 == need[C]`, lifting `formed` to `3 == required`.",
            "The shrink loop records `[0..5]` (`\"ADOBEC\"`, `best_len = 6`, `best_start = 0`).",
          ],
          code: [
            "while formed == required:",
            "    if right - left + 1 < best_len:",
            "        best_len ← right - left + 1",
            "        best_start ← left",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Window", value: "[0..5] -> \"ADOBEC\"" },
            { name: "formed / required", value: "3 / 3", changed: true },
            { name: "best", value: "\"ADOBEC\" (len 6)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "First valid cover [0..5] -> len 6",
                cells: [
                  { id: "h0", value: "A", index: 0, state: "done" },
                  { id: "h1", value: "D", index: 1, state: "done" },
                  { id: "h2", value: "O", index: 2, state: "done" },
                  { id: "h3", value: "B", index: 3, state: "done" },
                  { id: "h4", value: "E", index: 4, state: "done" },
                  { id: "h5", value: "C", index: 5, state: "done" },
                  { id: "h6", value: "B", index: 6, state: "dim" },
                  { id: "h7", value: "A", index: 7, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "left", tone: "ok" },
                  { index: 5, label: "right", tone: "ok" },
                ],
                highlightRange: [0, 5],
              },
            ],
            caption: "formed == required triggers candidate recording and left shrinking.",
          },
        },
        {
          title: "Pop 'A' at left = 0, then expand right = 6 ('B')",
          tag: "TRACE",
          explanation: [
            "Popping `s[0] = 'A'` drops `window[A]` to `0 < 1`, so `formed` falls to `2` and `left` advances to `1` (`\"DOBEC\"`).",
            "Next iteration adds `s[6] = 'B'`, raising `window[B]` to `2`. Because `'B'` already met its quota of `1`, `formed` stays `2`.",
          ],
          code: [
            "// 1. Shrink left = 0 ('A' leaves)",
            "window['A'] -= 1; formed -= 1; left ← 1",
            "// 2. Expand right = 6 ('B' enters)",
            "ch ← s[right]",
            "window[ch] ← window.get(ch, 0) + 1",
            "// window['B'] = 2 != need['B'], formed stays 2",
          ],
          activeLines: [2, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Window", value: "[1..6] -> \"DOBECB\"" },
            { name: "window (A,B,C)", value: "A:0, B:2, C:1", changed: true },
            { name: "formed / required", value: "2 / 3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Duplicate 'B' arrives while 'A' is still missing",
                cells: [
                  { id: "h0", value: "A", index: 0, state: "dim" },
                  { id: "h1", value: "D", index: 1, state: "active" },
                  { id: "h2", value: "O", index: 2, state: "active" },
                  { id: "h3", value: "B", index: 3, state: "active" },
                  { id: "h4", value: "E", index: 4, state: "active" },
                  { id: "h5", value: "C", index: 5, state: "active" },
                  { id: "h6", value: "B", index: 6, state: "active" },
                  { id: "h7", value: "A", index: 7, state: "dim" },
                ],
                pointers: [
                  { index: 1, label: "left", tone: "coral" },
                  { index: 6, label: "right", tone: "accent" },
                ],
                highlightRange: [1, 6],
              },
            ],
            caption: "window[B] is 2 (surplus copy), while formed stays 2/3 because A is 0.",
          },
        },
        {
          title: "Expand right = 7 ('A'): formed == 3 again on \"DOBECBA\"",
          tag: "TRACE",
          explanation: [
            "At `right = 7`, `'A'` enters and lifts `window[A]` to `1 == need[A]`, restoring `formed = 3 == required`.",
            "Now `[1..7]` (`\"DOBECBA\"`, len `7`) is valid and ready to shrink from the left.",
          ],
          code: [
            "ch ← s[right]   // 'A' at index 7",
            "window[ch] ← window.get(ch, 0) + 1",
            "if ch in need and window[ch] == need[ch]:",
            "    formed ← formed + 1",
          ],
          activeLines: [1, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Window", value: "[1..7] -> \"DOBECBA\"" },
            { name: "window (A,B,C)", value: "A:1, B:2, C:1", changed: true },
            { name: "formed / required", value: "3 / 3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Rightmost 'A' restores formed == 3",
                cells: [
                  { id: "h0", value: "A", index: 0, state: "dim" },
                  { id: "h1", value: "D", index: 1, state: "active" },
                  { id: "h2", value: "O", index: 2, state: "active" },
                  { id: "h3", value: "B", index: 3, state: "active" },
                  { id: "h4", value: "E", index: 4, state: "active" },
                  { id: "h5", value: "C", index: 5, state: "active" },
                  { id: "h6", value: "B", index: 6, state: "active" },
                  { id: "h7", value: "A", index: 7, state: "active" },
                ],
                pointers: [
                  { index: 1, label: "left", tone: "coral" },
                  { index: 7, label: "right", tone: "accent" },
                ],
                highlightRange: [1, 7],
              },
            ],
            caption: "All three required letters exist inside [1..7], with one surplus 'B'.",
          },
        },
        {
          title: "Shrink past D, O, and surplus B to [4..7] (\"ECBA\", len 4)",
          tag: "TRACE",
          explanation: [
            "Shrinking `left` drops `'D'`, `'O'`, and the extra `'B'` at index `3`: `window[B]` drops from `2` to `1`, which still satisfies `need[B] = 1`, so `formed` stays `3`!",
            "Now `[4..7]` (`\"ECBA\"`) beats `6` and updates `best_len = 4`, `best_start = 4` before popping `'E'`.",
          ],
          code: [
            "while formed == required:",
            "    if right - left + 1 < best_len:",
            "        best_len ← right - left + 1",
            "        best_start ← left",
            "    out ← s[left]; window[out] -= 1",
            "    if out in need and window[out] < need[out]: formed -= 1",
            "    left ← left + 1",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Window", value: "[4..7] -> \"ECBA\"", changed: true },
            { name: "window (A,B,C)", value: "A:1, B:1, C:1", changed: true },
            { name: "best", value: "\"ECBA\" (len 4)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Intermediate shrink [4..7] keeps formed = 3 after dropping surplus 'B'",
                cells: [
                  { id: "h0", value: "A", index: 0, state: "dim" },
                  { id: "h1", value: "D", index: 1, state: "dim" },
                  { id: "h2", value: "O", index: 2, state: "dim" },
                  { id: "h3", value: "B", index: 3, state: "dim" },
                  { id: "h4", value: "E", index: 4, state: "active" },
                  { id: "h5", value: "C", index: 5, state: "active" },
                  { id: "h6", value: "B", index: 6, state: "active" },
                  { id: "h7", value: "A", index: 7, state: "active" },
                ],
                pointers: [
                  { index: 4, label: "left", tone: "coral" },
                  { index: 7, label: "right", tone: "accent" },
                ],
                highlightRange: [4, 7],
              },
            ],
            caption: "Dropping surplus 'B' at index 3 leaves window['B'] = 1, keeping formed == 3.",
          },
        },
        {
          title: "Shrink past E to [5..7] -> optimal \"CBA\" (len 3)",
          tag: "PATTERN",
          explanation: [
            "Dropping `'E'` advances `left` to `5` (`\"CBA\"`), updating `best_len = 3` and `best_start = 5`.",
            "Next, popping `'C'` drops `formed` to `2`, ending the shrink loop and returning `\"CBA\"`.",
          ],
          code: [
            "while formed == required:",
            "    if right - left + 1 < best_len:",
            "        best_len ← right - left + 1",
            "        best_start ← left",
            "    // pops E -> records [5..7] len 3; next pop 'C' drops formed to 2",
            "return s[best_start : best_start + best_len]",
          ],
          activeLines: [2, 3, 4, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "Best window", value: "[5..7] -> \"CBA\"", changed: true },
            { name: "window (A,B,C) at [5..7]", value: "A:1, B:1, C:1" },
            { name: "Returned answer", value: "\"CBA\" (len 3)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Optimal cover \"CBA\" at [5..7] (len 3)",
                cells: [
                  { id: "h0", value: "A", index: 0, state: "dim" },
                  { id: "h1", value: "D", index: 1, state: "dim" },
                  { id: "h2", value: "O", index: 2, state: "dim" },
                  { id: "h3", value: "B", index: 3, state: "dim" },
                  { id: "h4", value: "E", index: 4, state: "dim" },
                  { id: "h5", value: "C", index: 5, state: "done" },
                  { id: "h6", value: "B", index: 6, state: "done" },
                  { id: "h7", value: "A", index: 7, state: "done" },
                ],
                pointers: [
                  { index: 5, label: "left (at best)", tone: "ok" },
                  { index: 7, label: "right", tone: "ok" },
                ],
                highlightRange: [5, 7],
              },
            ],
            caption: "Shrinking [4..7] -> [5..7] captures optimal \"CBA\" before losing 'C'.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Decrementing formed on surplus target characters",
        detail:
          "If `t` needs one `'B'` and the window holds two `'B'`s, removing one `'B'` leaves `window['B'] == 1 >= need['B']`. Only decrement `formed` when `window[out] < need[out]`.",
      },
      {
        title: "Jumping left backward with last_seen map",
        detail:
          "If you optimize Longest Substring Without Repeating Characters by storing `last_seen[ch]` instead of a `while` loop, you must write `left = max(left, last_seen[ch] + 1)`. Otherwise an old index from before `left` pulls the window backward and reintroduces duplicates.",
      },
      {
        title: "Thinking max_freq must be recomputed on shrink",
        detail:
          "In Longest Repeating Character Replacement, decrementing `counts[s[left]]` without lowering `max_freq` never over-reports a valid answer: `best` only increases when `(right - left + 1)` grows strictly larger than before, which can only happen when `max_freq` increases.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does this buggy longest-unique-substring code return on s = \"abba\"?",
        code: "last_seen ← {}; left ← 0; best ← 0\nfor right from 0 to len(s) - 1:\n    ch ← s[right]\n    if ch in last_seen:\n        left ← last_seen[ch] + 1\n    last_seen[ch] ← right\n    best ← max(best, right - left + 1)\nreturn best",
        options: [
          { id: "a", label: "2 (ignores stale index 0)" },
          { id: "b", label: "1 (resets best on the second 'b')" },
          { id: "c", label: "4 (counts the whole string)" },
          { id: "d", label: "3 (left jumps backward to index 1 and accepts \"bba\")" },
        ],
        correctId: "d",
        explanation: "At right = 3 ('a'), last_seen['a'] = 0 sits behind left = 2, so setting left = 0 + 1 pulls left backward and includes duplicate 'b's. Use left = max(left, last_seen[ch] + 1).",
      },
      {
        prompt: "In Minimum Window Substring on s = \"AABC\", t = \"ABC\", why does this shrink step miss \"ABC\"?",
        code: "while formed == required:\n    update_best(left, right)\n    out ← s[left]\n    window[out] ← window[out] - 1\n    if out in need:\n        formed ← formed - 1\n    left ← left + 1",
        options: [
          { id: "a", label: "Popping the surplus 'A' at index 0 decrements formed even though window['A'] == 1 still satisfies need['A']" },
          { id: "b", label: "The loop skips updating best on the final character 'C'" },
          { id: "c", label: "required is 4 instead of 3 for t = \"ABC\"" },
          { id: "d", label: "left stops moving once window['A'] reaches 0" },
        ],
        correctId: "a",
        explanation: "When the first 'A' leaves, window['A'] drops from 2 to 1, which still meets need['A'] = 1. Decrementing formed unconditionally exits the shrink loop before [1..3] (\"ABC\") is recorded.",
      },
    ],
    practiceTask: {
      title: "Longest Substring Without Repeating Characters",
      tier: "Warmup",
      goal: "Given a string `s`, return the length of the longest contiguous substring that contains no duplicate characters.",
      constraints: [
        "0 <= len(s) <= 10^5",
        "s may contain letters, digits, symbols, and spaces",
        "Target: O(n) time, O(min(n, alphabet)) extra space",
      ],
      examples: [
        { input: "s = \"abcabcbb\"", output: "3", explanation: "\"abc\" has length 3." },
        { input: "s = \"pwwkew\"", output: "3", explanation: "\"wke\" has length 3 (\"pwke\" is not contiguous)." },
      ],
      tasks: [
        "Maintain a Hash Set `seen` for the characters currently inside `[left, right]`.",
        "While `s[right] in seen`, remove `s[left]` from `seen` and increment `left`; then add `s[right]` and update `best`.",
      ],
      starterCode: "function length_of_longest_substring(s):\n    // TODO: sliding window + Hash Set\n    return best",
      expectedOutput: "3\n3",
      hint: "Shrink `left` inside a `while s[right] in seen` loop before adding `s[right]` to `seen`.",
      complexity: { time: "O(n)", space: "O(min(n, alphabet))" },
      solutionCode:
        "function length_of_longest_substring(s):\n    seen ← empty set\n    left ← 0, best ← 0\n    for right from 0 to len(s) - 1:\n        while s[right] in seen:\n            seen.remove(s[left])\n            left ← left + 1\n        seen.add(s[right])\n        best ← max(best, right - left + 1)\n    return best",
    },
    practiceChallenges: [
      {
        title: "Longest Substring Without Repeating Characters",
        tier: "Warmup",
        goal: "Given a string `s`, find the length of the longest contiguous substring with all distinct characters.",
        constraints: ["0 <= len(s) <= 10^5", "Target: O(n) time, O(min(n, alphabet)) space"],
        examples: [
          { input: "s = \"abcabcbb\"", output: "3" },
          { input: "s = \"bbbbb\"", output: "1" },
          { input: "s = \"pwwkew\"", output: "3" },
        ],
        tasks: [
          "Keep `seen` containing the exact characters inside `[left, right]`.",
          "Shrink `left` until `s[right]` is no longer duplicated, insert `s[right]`, and record `best`.",
        ],
        starterCode: "function length_of_longest_substring(s):\n    // TODO: O(n) unique-character window\n    return best",
        expectedOutput: "3\n1\n3",
        hint: "If using a `last_seen` map instead of a set, guard `left = max(left, last_seen[ch] + 1)` so `left` never moves backward.",
        complexity: { time: "O(n)", space: "O(min(n, alphabet))" },
        solutionCode:
          "function length_of_longest_substring(s):\n    seen ← empty set\n    left ← 0, best ← 0\n    for right from 0 to len(s) - 1:\n        while s[right] in seen:\n            seen.remove(s[left])\n            left ← left + 1\n        seen.add(s[right])\n        best ← max(best, right - left + 1)\n    return best",
      },
      {
        title: "Longest Repeating Character Replacement",
        tier: "Core",
        goal: "Given an uppercase string `s` and integer `k`, you may replace at most `k` characters with any uppercase letter. Return the length of the longest substring containing only one repeating letter after replacements.",
        constraints: ["1 <= len(s) <= 10^5", "0 <= k <= len(s)", "Target: O(n) time, O(alphabet) space"],
        examples: [
          { input: "s = \"ABAB\", k = 2", output: "4", explanation: "Replace both 'A's or both 'B's." },
          { input: "s = \"AABABBA\", k = 1", output: "4", explanation: "Replace the middle 'B' in \"AABA\" -> \"AAAA\" (or \"ABBA\" -> \"BBBB\")." },
        ],
        tasks: [
          "Track `counts[s[right]]` and `max_freq = max(max_freq, counts[s[right]])`.",
          "If `(right - left + 1) - max_freq > k`, decrement `counts[s[left]]` and increment `left`; update `best = max(best, right - left + 1)`.",
        ],
        starterCode: "function character_replacement(s, k):\n    // TODO: frequency map + max_freq window\n    return best",
        expectedOutput: "4\n4",
        hint: "Needed replacements in `[left, right]` equal `window_length - max_freq`. Shrink by `1` whenever that exceeds `k`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function character_replacement(s, k):\n    counts ← empty map\n    left ← 0, max_freq ← 0, best ← 0\n    for right from 0 to len(s) - 1:\n        counts[s[right]] ← counts.get(s[right], 0) + 1\n        max_freq ← max(max_freq, counts[s[right]])\n        if (right - left + 1) - max_freq > k:\n            counts[s[left]] ← counts[s[left]] - 1\n            left ← left + 1\n        best ← max(best, right - left + 1)\n    return best",
      },
      {
        title: "Minimum Window Substring",
        tier: "Stretch",
        goal: "Given strings `s` and `t`, return the shortest contiguous substring of `s` that contains every character in `t` (including duplicates), or `\"\"` if no such substring exists.",
        constraints: [
          "1 <= len(s), len(t) <= 10^5",
          "Target: O(|s| + |t|) time, O(|s| + |t|) space",
        ],
        examples: [
          { input: "s = \"ADOBECODEBANC\", t = \"ABC\"", output: "\"BANC\"", explanation: "\"BANC\" has length 4 and includes A, B, and C." },
          { input: "s = \"a\", t = \"aa\"", output: "\"\"" },
        ],
        tasks: [
          "Build `need` frequency map from `t` and set `required = len(need)`.",
          "Expand `right`, increment `formed` when `window[ch] == need[ch]`, and shrink `left` while `formed == required` to capture the shortest span.",
        ],
        starterCode: "function min_window(s, t):\n    // TODO: formed == required sliding window\n    return result",
        expectedOutput: "\"BANC\"\n\"\"",
        hint: "Store `(best_len, best_start)` integers while looping and slice `s` once at the very end so substring copying stays `O(n)`.",
        complexity: { time: "O(|s| + |t|)", space: "O(|s| + |t|)" },
        solutionCode:
          "function min_window(s, t):\n    if len(t) == 0 or len(t) > len(s): return \"\"\n    need ← empty map\n    for ch in t: need[ch] ← need.get(ch, 0) + 1\n    window ← empty map\n    required ← len(need), formed ← 0\n    left ← 0, best_len ← INF, best_start ← 0\n    for right from 0 to len(s) - 1:\n        ch ← s[right]\n        window[ch] ← window.get(ch, 0) + 1\n        if ch in need and window[ch] == need[ch]:\n            formed ← formed + 1\n        while formed == required:\n            if right - left + 1 < best_len:\n                best_len ← right - left + 1\n                best_start ← left\n            out ← s[left]\n            window[out] ← window[out] - 1\n            if out in need and window[out] < need[out]:\n                formed ← formed - 1\n            left ← left + 1\n    return \"\" if best_len == INF else s[best_start : best_start + best_len]",
      },
    ],
  },
};

export const dsaM08PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m8",
  title: "Module 08 Practice Set: Sliding Window",
  description:
    "Four mixed problems combining fixed-length rolling updates, variable-length monotonic bounds, and hash-backed window tracking.",
  problems: [
    {
      id: "dsa-m8-p1",
      title: "Peak Qualifying Intervals Over K Seconds",
      patternHint: "Maintain a rolling length-k sum (`+ arr[right] - arr[right - k]`) and compare against `k * threshold` to avoid floating-point division.",
      lessonRefId: "dsa-fixed-window",
      goal: "Given an integer array `arr` of throughput readings and integers `k` and `threshold`, return how many contiguous subarrays of length `k` have an average greater than or equal to `threshold`.",
      constraints: [
        "1 <= k <= len(arr) <= 10^5",
        "0 <= arr[i], threshold <= 10^4",
        "Target: O(n) time, O(1) extra space",
      ],
      examples: [
        { input: "arr = [2, 2, 2, 2, 5, 5, 5, 8], k = 3, threshold = 4", output: "3", explanation: "Subarrays [2, 5, 5], [5, 5, 5], and [5, 5, 8] have averages 4.0, 5.0, and 6.0." },
        { input: "arr = [11, 13, 17, 23, 29, 31, 7, 5, 2, 3], k = 3, threshold = 5", output: "6" },
      ],
      tasks: [
        "Compare `window_sum >= k * threshold` instead of dividing by `k` every step.",
        "Sum the first `k` items, check the threshold, then slide across `k..len(arr) - 1` adding `arr[right]` and subtracting `arr[right - k]`.",
      ],
      starterCode: "function count_qualifying_spans(arr, k, threshold):\n    // TODO: O(n) rolling length-k sum check\n    return count",
      expectedOutput: "3\n6",
      hint: "Average `>= threshold` is exact integer math `window_sum >= k * threshold`.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function count_qualifying_spans(arr, k, threshold):\n    target_sum ← k * threshold\n    window_sum ← 0\n    for i from 0 to k - 1:\n        window_sum ← window_sum + arr[i]\n    count ← 1 if window_sum >= target_sum else 0\n    for right from k to len(arr) - 1:\n        window_sum ← window_sum + arr[right] - arr[right - k]\n        if window_sum >= target_sum:\n            count ← count + 1\n    return count",
    },
    {
      id: "dsa-m8-p2",
      title: "Longest Continuous Productive Streak",
      patternHint: "Non-negative daily error counts make the running sum monotonic: expand right and shrink left while `window_sum > budget`.",
      lessonRefId: "dsa-variable-window",
      goal: "Given a non-negative integer array `errors` of daily error counts and an integer `budget`, return the maximum number of consecutive days whose total errors do not exceed `budget`.",
      constraints: [
        "1 <= len(errors) <= 10^5",
        "0 <= errors[i] <= 10^4",
        "0 <= budget <= 10^9",
        "Target: O(n) time, O(1) extra space",
      ],
      examples: [
        { input: "errors = [1, 2, 1, 0, 1, 1, 0], budget = 4", output: "5", explanation: "Subarray [1, 0, 1, 1, 0] has sum 3 <= 4 and length 5." },
        { input: "errors = [6, 7], budget = 3", output: "0" },
      ],
      tasks: [
        "Advance `right` across `errors`, adding `errors[right]` to `window_sum`.",
        "Shrink `left` while `window_sum > budget`, then update `best = max(best, right - left + 1)`.",
      ],
      starterCode: "function longest_streak(errors, budget):\n    // TODO: O(n) time, O(1) space\n    return best",
      expectedOutput: "5\n0",
      hint: "Each pointer moves forward at most `n` times, keeping total operations within `2n`.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "function longest_streak(errors, budget):\n    left ← 0, window_sum ← 0, best ← 0\n    for right from 0 to len(errors) - 1:\n        window_sum ← window_sum + errors[right]\n        while window_sum > budget:\n            window_sum ← window_sum - errors[left]\n            left ← left + 1\n        best ← max(best, right - left + 1)\n    return best",
    },
    {
      id: "dsa-m8-p3",
      title: "Maximum Score From a Distinct Element Run",
      patternHint: "Pair a Hash Set `seen` with a running `window_sum`: shrink left whenever `nums[right]` is already in `seen`.",
      lessonRefId: "dsa-window-hashing",
      goal: "Given an array of positive integers `nums`, return the maximum sum possible from a contiguous subarray containing only unique values.",
      constraints: [
        "1 <= len(nums) <= 10^5",
        "1 <= nums[i] <= 10^4",
        "Target: O(n) time, O(n) extra space",
      ],
      examples: [
        { input: "nums = [4, 2, 4, 5, 6]", output: "17", explanation: "Distinct subarray [2, 4, 5, 6] sums to 17." },
        { input: "nums = [5, 2, 1, 2, 5, 2, 1, 2, 5]", output: "8", explanation: "Distinct subarray [5, 2, 1] sums to 8." },
      ],
      tasks: [
        "Track active values in a Hash Set `seen` along with `window_sum`.",
        "While `nums[right] in seen`, remove `nums[left]` from `seen`, subtract `nums[left]` from `window_sum`, and advance `left`; then add `nums[right]` and update `best`.",
      ],
      starterCode: "function max_distinct_subarray_sum(nums):\n    // TODO: combine Hash Set distinctness with running sum\n    return best",
      expectedOutput: "17\n8",
      hint: "Every element is added to `seen` and `window_sum` once and removed at most once.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "function max_distinct_subarray_sum(nums):\n    seen ← empty set\n    left ← 0, window_sum ← 0, best ← 0\n    for right from 0 to len(nums) - 1:\n        while nums[right] in seen:\n            seen.remove(nums[left])\n            window_sum ← window_sum - nums[left]\n            left ← left + 1\n        seen.add(nums[right])\n        window_sum ← window_sum + nums[right]\n        best ← max(best, window_sum)\n    return best",
    },
    {
      id: "dsa-m8-p4",
      title: "Shortest Log Slice Covering All Required Alerts",
      patternHint: "Use `need`, `window`, and `formed == required` to shrink `left` while every required alert code remains covered.",
      lessonRefId: "dsa-window-hashing",
      goal: "Given strings `logs` and `alerts`, return the shortest contiguous substring of `logs` that contains every character of `alerts` with matching multiplicity, or `\"\"` if impossible.",
      constraints: [
        "1 <= len(logs), len(alerts) <= 10^5",
        "Target: O(|logs| + |alerts|) time",
      ],
      examples: [
        { input: "logs = \"ADOBECODEBANC\", alerts = \"ABC\"", output: "\"BANC\"", explanation: "Shortest span containing A, B, and C has length 4." },
        { input: "logs = \"aa\", alerts = \"aaa\"", output: "\"\"" },
      ],
      tasks: [
        "Count required alert frequencies in `need` with `required = len(need)`.",
        "Expand `right`, increment `formed` on exact quota match, and shrink `left` while `formed == required` to minimize span length.",
      ],
      starterCode: "function shortest_covering_slice(logs, alerts):\n    // TODO: formed == required quota window\n    return result",
      expectedOutput: "\"BANC\"\n\"\"",
      hint: "Save `(best_len, best_start)` indices instead of slicing strings inside the loop.",
      complexity: { time: "O(|logs| + |alerts|)", space: "O(|logs| + |alerts|)" },
      solutionCode:
        "function shortest_covering_slice(logs, alerts):\n    if len(alerts) == 0 or len(alerts) > len(logs): return \"\"\n    need ← empty map\n    for ch in alerts: need[ch] ← need.get(ch, 0) + 1\n    window ← empty map\n    required ← len(need), formed ← 0\n    left ← 0, best_len ← INF, best_start ← 0\n    for right from 0 to len(logs) - 1:\n        ch ← logs[right]\n        window[ch] ← window.get(ch, 0) + 1\n        if ch in need and window[ch] == need[ch]:\n            formed ← formed + 1\n        while formed == required:\n            if right - left + 1 < best_len:\n                best_len ← right - left + 1\n                best_start ← left\n            out ← logs[left]\n            window[out] ← window[out] - 1\n            if out in need and window[out] < need[out]:\n                formed ← formed - 1\n            left ← left + 1\n    return \"\" if best_len == INF else logs[best_start : best_start + best_len]",
    },
  ],
};
