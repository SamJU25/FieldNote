import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM23Lessons: Record<string, LessonContent> = {
  "dsa-range-sqrt": {
    lessonId: "dsa-range-sqrt",
    subtitle:
      "Break the O(n) update bottleneck of static prefix sums by partitioning arrays into blocks of size floor(sqrt(n)), achieving O(1) point sum updates and O(sqrt(n)) range queries.",
    intro: {
      heading: "Dynamic Range Queries & Square Root Decomposition",
      explanation: [
        "Static prefix sums from Module 03 compute `range_sum(l, r) = pref[r + 1] - pref[l]` in `O(1)` time, yet changing a single element `arr[0]` invalidates every suffix slot and forces an `O(n)` rebuild. Across `q = 100,000` mixed updates and queries on `n = 100,000` items, that `O(q * n)` loop burns `10^10` operations and times out, while storing only the raw array flips the bottleneck to `O(n)` per query.",
        "**Square Root Decomposition** splits `arr` into blocks of size `B = max(1, floor(sqrt(n)))` (`316` when `n = 100,000`) and stores one total in `blocks[b]`. Point updates touch only `arr[idx]` and `blocks[idx // B]` in `O(1)` time, and range queries visit partial tails plus whole interior blocks in `O(sqrt(n))` time once you guard the same-block case (`l // B == r // B`) so the left and right tail loops never double-count overlapping elements.",
      ],
      analogy:
        "Picture a warehouse shelf of 100 bins grouped into 10-bin crates, each carrying a sticky note with the crate's total weight. When one bin changes, you only adjust its single crate note; when totaling bins 14 through 83, you count bins 14..19 individually, add the sticky notes on crates 2..7 directly, and count bins 80..83 individually.",
      realWorldUses: [
        "Real-time game scoreboards and analytics counters where moderate updates and range totals alternate continuously",
        "Threshold-counting and frequency queries on mutable arrays by pairing sorted per-block copies with Module 09 binary search",
      ],
    },
    sections: [
      {
        heading: "Why Static Prefix Sums Stall Under Updates",
        paragraphs: [
          "With `10^5` elements and `10^5` interleaved updates and queries, an `O(n)` update or `O(n)` query performs up to `10^10` operations and times out. Prefix sums from Module 03 precompute cumulative totals from index `0`, so changing `arr[0]` invalidates all `n` prefix slots.",
          "Replacing global prefixes with local block summaries limits the blast radius of every point change to a single block of length `B = floor(sqrt(n))`. At `n = 10^5`, `sqrt(n)` is roughly `316`, turning `10^10` total operations into roughly `3 * 10^7` fast sequential array reads.",
        ],
        table: {
          caption: "Comparing array query strategies across n elements",
          headers: ["Strategy", "Build", "Point Sum Update", "Range Sum Query", "Extra Space"],
          rows: [
            ["Raw array scan", "O(1)", "O(1)", "O(n)", "O(1)"],
            ["Static Prefix Sums (M03)", "O(n)", "O(n) rebuild", "O(1)", "O(n)"],
            ["Sqrt Decomposition (B = floor(sqrt(n)))", "O(n)", "O(1)", "O(sqrt(n))", "O(sqrt(n))"],
            ["Non-invertible Sqrt (min / max)", "O(n)", "O(sqrt(n)) rescan block", "O(sqrt(n))", "O(sqrt(n))"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Setting `B = max(1, floor(sqrt(n)))` balances the two halves of a query: scanning partial tails takes at most `2 * B` steps, and hopping across full middle blocks takes at most `ceil(n / B)` steps. Both halves meet at `O(sqrt(n))`.",
        },
      },
      {
        heading: "Block Indexing, O(1) Updates, and Three-Part Queries",
        paragraphs: [
          "Element `i` belongs to block `b = i // B` at local offset `i % B`. Block `b` covers indices `[b * B, min(n - 1, (b + 1) * B - 1)]`, where the final block may hold fewer than `B` items when `n` is not a perfect square. Allocating `num_blocks = (n + B - 1) // B` gives every element a valid block slot.",
          "For `range_sum(l, r)`, compute `b_left = l // B` and `b_right = r // B`. If `b_left == b_right`, scan `i` directly from `l` to `r` in one loop. Otherwise, sum the left tail `l .. (b_left + 1) * B - 1`, add `blocks[b]` for every strictly interior block `b_left + 1 .. b_right - 1`, and sum the right tail `b_right * B .. r`.",
        ],
        code: [
          "function build_sqrt(arr):",
          "    n ← len(arr)",
          "    B ← max(1, floor(sqrt(n)))",
          "    num_blocks ← (n + B - 1) // B",
          "    blocks ← array of size num_blocks filled with 0",
          "    for i from 0 to n - 1:",
          "        blocks[i // B] ← blocks[i // B] + arr[i]",
          "    return (B, blocks)",
          "",
          "function point_update(arr, blocks, B, idx, new_val):",
          "    delta ← new_val - arr[idx]",
          "    arr[idx] ← new_val",
          "    blocks[idx // B] ← blocks[idx // B] + delta",
          "",
          "function range_sum(arr, blocks, B, l, r):",
          "    b_left ← l // B",
          "    b_right ← r // B",
          "    total ← 0",
          "    if b_left == b_right:",
          "        for i from l to r: total ← total + arr[i]",
          "        return total",
          "    left_end ← (b_left + 1) * B - 1",
          "    for i from l to left_end: total ← total + arr[i]",
          "    for b from b_left + 1 to b_right - 1: total ← total + blocks[b]",
          "    for i from b_right * B to r: total ← total + arr[i]",
          "    return total",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Worked B = 3 trace on arr = [3, 1, 4, 1, 5, 9, 2, 6, 5] (blocks = [8, 15, 13])",
          headers: ["Operation", "Indices / Blocks Touched", "Reads or Writes", "State / Total After Step"],
          rows: [
            ["point_update(4, 10)", "arr[4] (5 -> 10), blocks[4 // 3 = 1]", "2 writes", "blocks = [8, 20, 13]"],
            ["range_sum(1, 2) broken (no guard)", "left tail [1..2] + right tail [0..2]", "5 reads (double-counts)", "1 + 4 + 3 + 1 + 4 = 13 (wrong)"],
            ["range_sum(1, 2) fixed (b_left == b_right == 0)", "single loop i = 1..2", "2 reads", "arr[1] + arr[2] = 1 + 4 = 5"],
            ["range_sum(1, 7) left tail", "arr[1], arr[2] inside block 0", "2 reads", "total = 1 + 4 = 5"],
            ["range_sum(1, 7) middle block", "blocks[1] (skips arr[3..5])", "1 read", "total = 5 + 20 = 25"],
            ["range_sum(1, 7) right tail", "arr[6], arr[7] inside block 2", "2 reads", "total = 25 + 2 + 6 = 33"],
          ],
          highlightCol: 3,
        },
        visual: {
          kind: "dsa-graph",
          caption: "Two-level block hierarchy: full interior block b1 answers [3..5] in 1 read while tails check elements directly",
          nodes: [
            { id: "b0", label: "8", x: 18, y: 20, badge: "b0 [0..2]", state: "dim" },
            { id: "b1", label: "20", x: 50, y: 20, badge: "b1 [3..5]", state: "active" },
            { id: "b2", label: "13", x: 82, y: 20, badge: "b2 [6..8]", state: "dim" },
            { id: "s0", label: "1+4", x: 18, y: 78, badge: "tail [1..2]", state: "visited" },
            { id: "s1", label: "B1:20", x: 50, y: 78, badge: "1,10,9", state: "dim" },
            { id: "s2", label: "2+6", x: 82, y: 78, badge: "tail [6..7]", state: "queued" },
          ],
          edges: [
            { from: "b0", to: "s0", state: "dim" },
            { from: "b1", to: "s1", state: "active" },
            { from: "b2", to: "s2", state: "dim" },
          ],
        },
        callout: {
          kind: "WATCH OUT",
          text: "Always check `if b_left == b_right` before running the three-phase loop. If `l` and `r` sit inside the same block, running both the left-tail loop and the right-tail loop scans indices outside `[l, r]` and double-counts elements.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build Block-Sum Decomposition Step by Step",
      subtitle: "Move from building B = 3 block totals to fixing the same-block boundary bug and running cross-block queries.",
      steps: [
        {
          label: "Step 1: Build block totals and update one cell in O(1)",
          explanation: "Divide the 9 elements into 3 blocks of size B = 3, then update `arr[4]` from `5` to `10` by shifting `blocks[4 // 3]` by `+5`.",
          code: [
            "arr ← [3, 1, 4, 1, 5, 9, 2, 6, 5], B ← 3",
            "blocks ← [8, 15, 13]",
            "delta ← 10 - arr[4]            // 5",
            "arr[4] ← 10",
            "blocks[4 // 3] ← blocks[1] + delta",
            "print(blocks)",
          ],
          activeLines: [3, 4, 5],
          output: "[8, 20, 13]",
        },
        {
          label: "Step 2: Broken three-phase query double-counts same-block ranges",
          explanation: "Without `if b_left == b_right`, `range_sum(1, 2)` runs both the left tail `[1..2]` and the right tail `[0..2]`, double-counting block 0.",
          code: [
            "b_left ← 1 // 3, b_right ← 2 // 3   // both 0",
            "total ← 0",
            "for i from 1 to (b_left + 1) * 3 - 1: total ← total + arr[i]",
            "for i from b_right * 3 to 2: total ← total + arr[i]",
            "print(total)                        // wrong: 5 + 8",
          ],
          activeLines: [3, 4],
          output: "13  (expected 5)",
        },
        {
          label: "Step 3: Guard same-block queries before running the three-phase scan",
          explanation: "Checking `if b_left == b_right` keeps `[1, 2]` in one loop (`5`), while `[1, 7]` combines tail `[1..2]` (`5`), `blocks[1]` (`20`), and tail `[6..7]` (`8`).",
          code: [
            "function range_sum(arr, blocks, B, l, r):",
            "    b_left ← l // B, b_right ← r // B",
            "    total ← 0",
            "    if b_left == b_right:",
            "        for i from l to r: total ← total + arr[i]",
            "        return total",
            "    for i from l to (b_left + 1) * B - 1: total ← total + arr[i]",
            "    for b from b_left + 1 to b_right - 1: total ← total + blocks[b]",
            "    for i from b_right * B to r: total ← total + arr[i]",
            "    return total",
            "print(range_sum(arr, blocks, 3, 1, 2), range_sum(arr, blocks, 3, 1, 7))",
          ],
          activeLines: [4, 5, 6, 7, 8, 9],
          output: "5, 33",
        },
      ],
    },
    walkthrough: {
      title: "Trace Build, Point Update, and Range Query on n = 9 (B = 3)",
      layout: "visual-first",
      steps: [
        {
          title: "Build 3 block summaries of size B = 3",
          tag: "MEMORY",
          explanation: [
            "Partition `arr = [3, 1, 4, 1, 5, 9, 2, 6, 5]` (`n = 9`) into blocks of size `B = floor(sqrt(9)) = 3`.",
            "Each cell `arr[i]` adds into `blocks[i // 3]`, producing `blocks = [8, 15, 13]`.",
          ],
          code: [
            "arr ← [3, 1, 4, 1, 5, 9, 2, 6, 5]",
            "B ← 3",
            "blocks ← [3+1+4, 1+5+9, 2+6+5]   // [8, 15, 13]",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "B", value: "3" },
            { name: "blocks", value: "[8, 15, 13]" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Each group of B = 3 raw cells maps to one block sum in blocks[0..2]",
            trays: [
              {
                label: "arr[0..8]",
                cells: [
                  { id: "a0", value: "3", index: 0, state: "done" },
                  { id: "a1", value: "1", index: 1, state: "done" },
                  { id: "a2", value: "4", index: 2, state: "done" },
                  { id: "a3", value: "1", index: 3 },
                  { id: "a4", value: "5", index: 4 },
                  { id: "a5", value: "9", index: 5 },
                  { id: "a6", value: "2", index: 6 },
                  { id: "a7", value: "6", index: 7 },
                  { id: "a8", value: "5", index: 8 },
                ],
                highlightRange: [0, 2],
              },
              {
                label: "blocks[0..2] (B = 3)",
                cells: [
                  { id: "b0", value: "8", index: 0, state: "done" },
                  { id: "b1", value: "15", index: 1 },
                  { id: "b2", value: "13", index: 2 },
                ],
                pointers: [{ index: 0, label: "b=0", tone: "ok" }],
              },
            ],
          },
        },
        {
          title: "Point update at idx = 4 (change 5 to 10) in O(1)",
          tag: "TRACE",
          explanation: [
            "Compute `delta = 10 - arr[4] = 5`, set `arr[4] = 10`, and find block `4 // 3 = 1`.",
            "Add `delta` directly to `blocks[1]` (`15 + 5 = 20`) without touching `blocks[0]` or `blocks[2]`.",
          ],
          code: [
            "delta ← 10 - arr[4]        // 10 - 5 = 5",
            "arr[4] ← 10",
            "b ← 4 // 3                 // b = 1",
            "blocks[1] ← blocks[1] + 5  // 15 + 5 = 20",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "delta", value: "5", changed: true },
            { name: "arr[4]", value: "10", changed: true },
            { name: "blocks[1]", value: "20", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Only arr[4] and its owning block summary blocks[1] change",
            trays: [
              {
                label: "arr[0..8]",
                cells: [
                  { id: "a0", value: "3", index: 0 },
                  { id: "a1", value: "1", index: 1 },
                  { id: "a2", value: "4", index: 2 },
                  { id: "a3", value: "1", index: 3 },
                  { id: "a4", value: "10", index: 4, state: "active" },
                  { id: "a5", value: "9", index: 5 },
                  { id: "a6", value: "2", index: 6 },
                  { id: "a7", value: "6", index: 7 },
                  { id: "a8", value: "5", index: 8 },
                ],
                pointers: [{ index: 4, label: "idx", tone: "coral" }],
              },
              {
                label: "blocks[0..2]",
                cells: [
                  { id: "b0", value: "8", index: 0 },
                  { id: "b1", value: "20", index: 1, state: "active" },
                  { id: "b2", value: "13", index: 2 },
                ],
                pointers: [{ index: 1, label: "4//3", tone: "coral" }],
              },
            ],
          },
        },
        {
          title: "Query range_sum(1, 7): scan left partial tail [1..2]",
          tag: "TRACE",
          explanation: [
            "Compute `b_left = 1 // 3 = 0` and `b_right = 7 // 3 = 2`. Since `0 != 2`, run the three-phase scan.",
            "Block `0` is only partially covered (`[1..2]` instead of `[0..2]`), so add `arr[1] + arr[2] = 1 + 4 = 5` directly.",
          ],
          code: [
            "b_left ← 1 // 3            // 0",
            "b_right ← 7 // 3           // 2",
            "left_end ← (0 + 1) * 3 - 1 // 2",
            "for i from 1 to 2: total ← total + arr[i]  // total = 5",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "b_left", value: "0" },
            { name: "b_right", value: "2" },
            { name: "total", value: "5", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Left tail scans arr[1..2] individually because index 0 sits outside [1, 7]",
            trays: [
              {
                label: "arr[0..8]",
                cells: [
                  { id: "a0", value: "3", index: 0, state: "dim" },
                  { id: "a1", value: "1", index: 1, state: "active" },
                  { id: "a2", value: "4", index: 2, state: "active" },
                  { id: "a3", value: "1", index: 3 },
                  { id: "a4", value: "10", index: 4 },
                  { id: "a5", value: "9", index: 5 },
                  { id: "a6", value: "2", index: 6 },
                  { id: "a7", value: "6", index: 7 },
                  { id: "a8", value: "5", index: 8, state: "dim" },
                ],
                pointers: [
                  { index: 1, label: "l", tone: "accent" },
                  { index: 7, label: "r", tone: "ok" },
                ],
                highlightRange: [1, 2],
              },
            ],
          },
        },
        {
          title: "Query range_sum(1, 7): add full middle block blocks[1]",
          tag: "PATTERN",
          explanation: [
            "Block `1` (`[3..5]`) lies completely inside `[1, 7]`. Read `blocks[1] = 20` in `O(1)` instead of reading `arr[3]`, `arr[4]`, and `arr[5]`.",
            "`total` jumps from `5` to `5 + 20 = 25`.",
          ],
          code: [
            "for b from b_left + 1 to b_right - 1:",
            "    total ← total + blocks[b]  // blocks[1] = 20",
            "// total = 25",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "b", value: "1" },
            { name: "blocks[1]", value: "20" },
            { name: "total", value: "25", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Full interior block b = 1 skips individual reads of arr[3..5] by reading blocks[1] = 20 directly",
            trays: [
              {
                label: "arr[0..8] (mid block [3..5] skipped in O(1))",
                cells: [
                  { id: "a0", value: "3", index: 0 },
                  { id: "a1", value: "1", index: 1, state: "done" },
                  { id: "a2", value: "4", index: 2, state: "done" },
                  { id: "a3", value: "1", index: 3, state: "dim" },
                  { id: "a4", value: "10", index: 4, state: "dim" },
                  { id: "a5", value: "9", index: 5, state: "dim" },
                  { id: "a6", value: "2", index: 6 },
                  { id: "a7", value: "6", index: 7 },
                  { id: "a8", value: "5", index: 8 },
                ],
                highlightRange: [3, 5],
              },
              {
                label: "blocks[0..2] (B = 3)",
                cells: [
                  { id: "b0", value: "8", index: 0, state: "dim" },
                  { id: "b1", value: "20", index: 1, state: "active" },
                  { id: "b2", value: "13", index: 2, state: "dim" },
                ],
                pointers: [{ index: 1, label: "+20 (total=25)", tone: "coral" }],
              },
            ],
          },
        },
        {
          title: "Query range_sum(1, 7): scan right partial tail [6..7]",
          tag: "CHECK",
          explanation: [
            "Block `2` (`[6..8]`) only contributes `arr[6] + arr[7] = 2 + 6 = 8` because index `8` is past `r = 7`.",
            "Final sum is `5 + 20 + 8 = 33`, verified against `1 + 4 + 1 + 10 + 9 + 2 + 6 = 33` in `5` reads instead of `7`.",
          ],
          code: [
            "for i from b_right * B to r:   // i = 6..7",
            "    total ← total + arr[i]     // 25 + 2 + 6 = 33",
            "return total                   // 33",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "right_tail", value: "2 + 6 = 8" },
            { name: "total", value: "33", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Right tail completes the query: 5 (left tail) + 20 (blocks[1]) + 8 (right tail) = 33",
            trays: [
              {
                label: "arr[0..8]",
                cells: [
                  { id: "a0", value: "3", index: 0, state: "dim" },
                  { id: "a1", value: "1", index: 1, state: "done" },
                  { id: "a2", value: "4", index: 2, state: "done" },
                  { id: "a3", value: "1", index: 3, state: "dim" },
                  { id: "a4", value: "10", index: 4, state: "dim" },
                  { id: "a5", value: "9", index: 5, state: "dim" },
                  { id: "a6", value: "2", index: 6, state: "active" },
                  { id: "a7", value: "6", index: 7, state: "active" },
                  { id: "a8", value: "5", index: 8, state: "dim" },
                ],
                highlightRange: [6, 7],
              },
              {
                label: "blocks[0..2]",
                cells: [
                  { id: "b0", value: "8", index: 0, state: "dim" },
                  { id: "b1", value: "20", index: 1, state: "done" },
                  { id: "b2", value: "13", index: 2, state: "dim" },
                ],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Double-counting when l and r share the same block",
        detail:
          "When `l // B == r // B`, running the three-phase query loop executes both `l .. left_end` and `right_start .. r`, overlapping on `[l, r]` and leaking out to block boundaries. Always return a single `for i from l to r` loop whenever `b_left == b_right`.",
        code: "if b_left == b_right:\n    for i from l to r: total ← total + arr[i]\n    return total",
      },
      {
        title: "Updating non-invertible summaries like min or max",
        detail:
          "You cannot update `blocks[b]` for `min` by looking only at `old_val` and `new_val`: if the old minimum leaves the block, a larger replacement forces you to find the new minimum inside that block. Recompute `blocks[b]` over `[b * B, min(n - 1, (b + 1) * B - 1)]` in `O(sqrt(n))` time.",
        code: "start ← b * B\nend ← min(n - 1, (b + 1) * B - 1)\nblocks[b] ← min(arr[i] for i in start..end)",
      },
      {
        title: "Out-of-bounds tail on the final partial block",
        detail:
          "When `n` is not divisible by `B`, the last block `(n - 1) // B` has fewer than `B` elements. Clamp its upper endpoint with `min(n - 1, (b + 1) * B - 1)` whenever scanning or rebuilding a block.",
      },
    ],
    practiceTask: {
      title: "Implement Dynamic Block Sum Structure",
      tier: "Warmup",
      goal: "Build `build_sqrt`, `point_update`, and `range_sum` using block size `B = max(1, floor(sqrt(n)))`.",
      constraints: [
        "1 <= len(arr) <= 10^5",
        "0 <= l <= r < len(arr)",
        "Target: O(1) point_update, O(sqrt(n)) range_sum",
      ],
      examples: [
        {
          input: "arr = [2, 4, 6, 8, 10], range_sum(1, 3), point_update(2, 1), range_sum(1, 3)",
          output: "18, 13",
        },
        {
          input: "arr = [5, -3, 2], point_update(1, 7), range_sum(0, 2)",
          output: "14",
          explanation: "Point update adjusts block[1 // B] by +10, raising full sum from 4 to 14.",
        },
      ],
      tasks: [
        "Allocate `num_blocks = (n + B - 1) // B` and accumulate each `arr[i]` into `blocks[i // B]`.",
        "Update `blocks[idx // B]` in `O(1)` using `new_val - arr[idx]`.",
        "Handle `b_left == b_right` separately before summing left tail, interior blocks, and right tail.",
      ],
      starterCode:
        "function build_sqrt(arr):\n    // TODO\nfunction point_update(arr, blocks, B, idx, new_val):\n    // TODO\nfunction range_sum(arr, blocks, B, l, r):\n    // TODO",
      expectedOutput: "18, 13\n14",
      hint: "On `n = 5`, `B = 2` gives 3 blocks: `[2, 4]`, `[6, 8]`, `[10]`. Always check `b_left == b_right` first.",
      complexity: { time: "O(1) update, O(sqrt(n)) query", space: "O(sqrt(n)) extra" },
      solutionCode:
        "function build_sqrt(arr):\n    n ← len(arr)\n    B ← max(1, floor(sqrt(n)))\n    num_blocks ← (n + B - 1) // B\n    blocks ← array of size num_blocks filled with 0\n    for i from 0 to n - 1:\n        blocks[i // B] ← blocks[i // B] + arr[i]\n    return (B, blocks)\n\nfunction point_update(arr, blocks, B, idx, new_val):\n    delta ← new_val - arr[idx]\n    arr[idx] ← new_val\n    blocks[idx // B] ← blocks[idx // B] + delta\n\nfunction range_sum(arr, blocks, B, l, r):\n    b_left ← l // B\n    b_right ← r // B\n    total ← 0\n    if b_left == b_right:\n        for i from l to r:\n            total ← total + arr[i]\n        return total\n    for i from l to (b_left + 1) * B - 1:\n        total ← total + arr[i]\n    for b from b_left + 1 to b_right - 1:\n        total ← total + blocks[b]\n    for i from b_right * B to r:\n        total ← total + arr[i]\n    return total",
    },
    practiceChallenges: [
      {
        title: "Mutable Block Subarray Sum",
        tier: "Warmup",
        goal: "Given an initial array `nums` and a list of operations `[\"add\", idx, delta]` and `[\"sum\", l, r]`, return the list of query answers.",
        constraints: [
          "1 <= len(nums) <= 5 * 10^4",
          "Up to 5 * 10^4 operations",
          "Target: O(1) add, O(sqrt(n)) sum",
        ],
        examples: [
          {
            input: "nums = [1, 3, 5, 7], ops = [[\"sum\", 0, 2], [\"add\", 1, 4], [\"sum\", 1, 3]]",
            output: "[9, 19]",
          },
          {
            input: "nums = [4, -1], ops = [[\"sum\", 1, 1], [\"add\", 1, 6], [\"sum\", 0, 1]]",
            output: "[-1, 9]",
            explanation: "Handles negative values and single-block b_left == b_right queries.",
          },
        ],
        tasks: [
          "Precompute `B = max(1, floor(sqrt(n)))` and `blocks`.",
          "For `\"add\"`, update `nums[idx]` and `blocks[idx // B]` by `delta`.",
          "For `\"sum\"`, return the three-phase range sum.",
        ],
        starterCode: "function process_sum_ops(nums, ops):\n    // TODO: return array of answers",
        expectedOutput: "[9, 19]\n[-1, 9]",
        hint: "Notice `[\"add\", idx, delta]` gives `delta` directly rather than `new_val`, so just add `delta` to both `nums[idx]` and `blocks[idx // B]`.",
        complexity: { time: "O(n + q * sqrt(n))", space: "O(sqrt(n)) extra" },
        solutionCode:
          "function process_sum_ops(nums, ops):\n    n ← len(nums)\n    B ← max(1, floor(sqrt(n)))\n    blocks ← array of size (n + B - 1) // B filled with 0\n    for i from 0 to n - 1:\n        blocks[i // B] ← blocks[i // B] + nums[i]\n    ans ← []\n    for op in ops:\n        if op[0] == \"add\":\n            idx ← op[1], delta ← op[2]\n            nums[idx] ← nums[idx] + delta\n            blocks[idx // B] ← blocks[idx // B] + delta\n        else:\n            l ← op[1], r ← op[2]\n            b_left ← l // B, b_right ← r // B\n            total ← 0\n            if b_left == b_right:\n                for i from l to r: total ← total + nums[i]\n            else:\n                for i from l to (b_left + 1) * B - 1: total ← total + nums[i]\n                for b from b_left + 1 to b_right - 1: total ← total + blocks[b]\n                for i from b_right * B to r: total ← total + nums[i]\n            ans.append(total)\n    return ans",
      },
      {
        title: "Dynamic Range Minimum With Block Rescan",
        tier: "Core",
        goal: "Support `set_val(idx, val)` and `range_min(l, r)` on a mutable array using block summaries.",
        constraints: [
          "1 <= len(nums) <= 5 * 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "Target: O(sqrt(n)) set_val and O(sqrt(n)) range_min",
        ],
        examples: [
          {
            input: "nums = [8, 3, 7, 2, 9, 4], range_min(0, 4), set_val(3, 10), range_min(0, 4)",
            output: "2, 3",
          },
          {
            input: "nums = [5, -4, 9], set_val(1, 6), range_min(0, 2)",
            output: "5",
            explanation: "Raising the old minimum -4 forces a block rescan so the new minimum 5 is found.",
          },
        ],
        tasks: [
          "Store the minimum of each block in `block_min[b]`.",
          "When `set_val(idx, val)` runs, assign `nums[idx] = val` and rescan block `b = idx // B` bounded by `min(n - 1, (b + 1) * B - 1)`.",
          "In `range_min(l, r)`, combine boundary elements and interior `block_min[b]` values with `min()`.",
        ],
        starterCode:
          "function set_val(nums, block_min, B, idx, val):\n    // TODO\nfunction range_min(nums, block_min, B, l, r):\n    // TODO",
        expectedOutput: "2, 3\n5",
        hint: "Never try to update `block_min[b]` as `min(block_min[b], val)` alone, because raising the old minimum requires discovering the next smallest element in block `b`.",
        complexity: { time: "O(sqrt(n)) per operation", space: "O(sqrt(n)) extra" },
        solutionCode:
          "function set_val(nums, block_min, B, idx, val):\n    nums[idx] ← val\n    b ← idx // B\n    start ← b * B\n    end ← min(len(nums) - 1, (b + 1) * B - 1)\n    best ← +INF\n    for i from start to end:\n        if nums[i] < best: best ← nums[i]\n    block_min[b] ← best\n\nfunction range_min(nums, block_min, B, l, r):\n    b_left ← l // B, b_right ← r // B\n    best ← +INF\n    if b_left == b_right:\n        for i from l to r: best ← min(best, nums[i])\n        return best\n    for i from l to (b_left + 1) * B - 1: best ← min(best, nums[i])\n    for b from b_left + 1 to b_right - 1: best ← min(best, block_min[b])\n    for i from b_right * B to r: best ← min(best, nums[i])\n    return best",
      },
      {
        title: "Count Elements >= k in Mutable Ranges",
        tier: "Stretch",
        goal: "Given `nums`, support `update(idx, val)` and `count_at_least(l, r, k)` returning how many indices `i` in `[l, r]` satisfy `nums[i] >= k`.",
        constraints: [
          "1 <= len(nums) <= 2 * 10^4",
          "Up to 2 * 10^4 operations",
          "Target: O(sqrt(n) log n) per query/update",
        ],
        examples: [
          {
            input: "nums = [2, 8, 4, 9, 1, 6], count_at_least(1, 5, 6), update(4, 7), count_at_least(1, 5, 6)",
            output: "3, 4",
          },
          {
            input: "nums = [1, 3, 2], count_at_least(0, 2, 5), update(0, 5), count_at_least(0, 2, 5)",
            output: "0, 1",
            explanation: "First query sees 0 items >= 5; updating index 0 to 5 increases count to 1.",
          },
        ],
        tasks: [
          "Maintain both raw `nums` and a sorted copy `sorted_blocks[b]` for each block `b`.",
          "For `count_at_least(l, r, k)`, scan partial tails directly in `nums` and use Module 09 binary search (`lower_bound(sorted_blocks[b], k)`) on full interior blocks.",
          "On `update(idx, val)`, overwrite `nums[idx]` and rebuild (or re-sort) only `sorted_blocks[idx // B]`.",
        ],
        starterCode:
          "function count_at_least(nums, sorted_blocks, B, l, r, k):\n    // TODO: linear tails + binary search on full blocks",
        expectedOutput: "3, 4\n0, 1",
        hint: "In a sorted block of length `m`, if `pos` is the first index where `sorted_blocks[b][pos] >= k`, then `m - pos` elements in that block meet the threshold.",
        complexity: { time: "O(sqrt(n) log n) per op", space: "O(n)" },
        solutionCode:
          "function count_at_least(nums, sorted_blocks, B, l, r, k):\n    b_left ← l // B, b_right ← r // B\n    cnt ← 0\n    if b_left == b_right:\n        for i from l to r:\n            if nums[i] >= k: cnt ← cnt + 1\n        return cnt\n    for i from l to (b_left + 1) * B - 1:\n        if nums[i] >= k: cnt ← cnt + 1\n    for b from b_left + 1 to b_right - 1:\n        pos ← lower_bound(sorted_blocks[b], k)\n        cnt ← cnt + (len(sorted_blocks[b]) - pos)\n    for i from b_right * B to r:\n        if nums[i] >= k: cnt ← cnt + 1\n    return cnt\n\nfunction update_block(nums, sorted_blocks, B, idx, val):\n    nums[idx] ← val\n    b ← idx // B\n    start ← b * B\n    end ← min(len(nums) - 1, (b + 1) * B - 1)\n    sorted_blocks[b] ← sorted(nums[start .. end])",
      },
    ],
  },

  "dsa-fenwick-tree": {
    lessonId: "dsa-fenwick-tree",
    subtitle:
      "Use 1-based indexing and the lowest-set-bit trick (i & -i) from Module 02 to support point updates and prefix sums in O(log n) time with a single O(n) array.",
    intro: {
      heading: "Fenwick Tree (Binary Indexed Tree)",
      explanation: [
        "Square Root Decomposition drops updates and queries from `O(n)` to `O(sqrt(n))`, yet `~316` steps at `n = 100,000` still lags behind an `O(log n)` (`~17` steps) **Fenwick Tree**. Reusing 0-based array indices triggers the classic Fenwick hang: calling `add` at `i = 0` runs `while i <= n: i += i & -i`, where `0 + (0 & -0)` evaluates to `0` forever.",
        "Leaving `bit[0]` unused and indexing `bit[1..n]` ensures every index `i >= 1` owns a positive power-of-two slice of length `lsb(i) = i & -i` ending at `i`. Walking upward with `i += i & -i` updates every ancestor covering `i`, while walking downward with `i -= i & -i` sums disjoint power-of-two slices in `O(log n)` time.",
      ],
      analogy:
        "Measuring a 13-meter hallway using power-of-two rods (8m, 4m, 2m, 1m) illustrates Fenwick spans. Counting 13 one-meter tiles takes 13 steps, whereas snapping together 3 rods (`8 + 4 + 1`) matches the `1`-bits of `13` in binary (`1101`).",
      realWorldUses: [
        "Dynamic frequency tables and running order-statistic counts over bounded integer keys",
        "Counting inversions in streaming rankings or permutations in O(n log n) time",
      ],
    },
    sections: [
      {
        heading: "How lsb(i) = i & -i Assigns Every Slot's Range",
        paragraphs: [
          "In two's-complement arithmetic (Module 02), `-i` flips every bit of `i` and adds `1`, so `i & -i` isolates the rightmost `1`-bit of `i`. For example, `6` (`0110` in binary) gives `6 & -6 = 2` (`0010`), and `4` (`0100`) gives `4 & -4 = 4`; by contrast, `0` (`0000`) gives `0 & -0 = 0`, which stalls any `i += i & -i` loop.",
          "Inside `bit[1..n]`, slot `bit[i]` stores the sum of the `lsb(i)` elements ending at `i`: `[i - (i & -i) + 1 .. i]`. On `arr = [2, 1, 4, 3, 2, 5, 1, 6]`, adding `5` at `idx = 3` (`0011`) visits `3 -> 4 -> 8`, while `prefix_sum(7)` (`0111`) walks `7 -> 6 -> 4 -> 0`.",
        ],
        table: {
          caption: "Concrete lsb(i) binary index trace on arr = [2, 1, 4, 3, 2, 5, 1, 6] (n = 8)",
          headers: ["Index i", "Binary", "lsb = i & -i", "Range Covered", "bit[i] Sum", "Next Parent (i + lsb)"],
          rows: [
            ["0 (invalid)", "0000", "0", "unused (loops at 0)", "-", "0 + 0 = 0 (infinite loop)"],
            ["1", "0001", "1", "[1..1] (1 cell)", "2", "1 + 1 = 2"],
            ["2", "0010", "2", "[1..2] (2 cells)", "3", "2 + 2 = 4"],
            ["3", "0011", "1", "[3..3] (1 cell)", "4", "3 + 1 = 4"],
            ["4", "0100", "4", "[1..4] (4 cells)", "10", "4 + 4 = 8"],
            ["5", "0101", "1", "[5..5] (1 cell)", "2", "5 + 1 = 6"],
            ["6", "0110", "2", "[5..6] (2 cells)", "7", "6 + 2 = 8"],
            ["7", "0111", "1", "[7..7] (1 cell)", "1", "7 + 1 = 8"],
            ["8", "1000", "8", "[1..8] (8 cells)", "24", "8 + 8 = 16 (> 8, stop)"],
          ],
          highlightCol: 2,
        },
        visual: {
          kind: "dsa-graph",
          caption: "Downward prefix links i -> i - (i & -i) decompose any 1-based prefix into O(log n) disjoint power-of-two blocks (contrast with 0-based M03 prefix sums and M15 heaps)",
          nodes: [
            { id: "f_b1", label: "2", x: 6, y: 16, badge: "i=1 [1..1]" },
            { id: "f_b2", label: "3", x: 24, y: 16, badge: "i=2 [1..2]" },
            { id: "f_b4", label: "10", x: 58, y: 16, badge: "i=4 [1..4]" },
            { id: "f_b8", label: "24", x: 88, y: 16, badge: "i=8 [1..8]" },
            { id: "f_b3", label: "4", x: 38, y: 48, badge: "i=3 [3..3]" },
            { id: "f_b5", label: "2", x: 55, y: 52, badge: "i=5 [5..5]" },
            { id: "f_b6", label: "7", x: 72, y: 52, badge: "i=6 [5..6]" },
            { id: "f_b7", label: "1", x: 86, y: 84, badge: "i=7 [7..7]" },
          ],
          edges: [
            { from: "f_b3", to: "f_b2", directed: true },
            { from: "f_b5", to: "f_b4", directed: true },
            { from: "f_b6", to: "f_b4", directed: true },
            { from: "f_b7", to: "f_b6", directed: true },
          ],
        },
        callout: {
          kind: "KEY IDEA",
          text: "Unlike **0-based** M03 static prefix arrays and M15 heaps, Fenwick Trees leave index `0` unused (`1`-based) because `0 & -0 = 0` stalls forever. Jumping `idx -= idx & -idx` strips the lowest `1`-bit each step, finishing `prefix_sum(idx)` in `O(log n)` additions.",
        },
      },
      {
        heading: "Point Add, Prefix Sum, Range Sum, and O(n) Build",
        paragraphs: [
          "To add `delta` to element `idx` (`1 <= idx <= n`), climb to every slot covering `idx` via `idx += idx & -idx` while `idx <= n`. Starting at `3` (`0011`), adding `3 & -3 = 1` jumps to `4` (`0100`), whose window `[1..4]` swallows `[3..3]`; adding `4 & -4 = 4` jumps to `8` (`1000`), whose window `[1..8]` swallows `[1..4]`.",
          "To compute `range_sum(l, r)` (`1 <= l <= r <= n`), subtract two prefix queries just as in Module 03: `prefix_sum(r) - prefix_sum(l - 1)`. Calling `add(i, arr[i])` for every index builds `bit[1..n]` in `O(n log n)`, whereas copying `arr` into `bit[1..n]` and pushing each `bit[i]` once into its immediate parent `p = i + (i & -i)` (when `p <= n`) finishes the build in `O(n)` time.",
        ],
        code: [
          "function add(bit, n, idx, delta):",
          "    while idx <= n:",
          "        bit[idx] ← bit[idx] + delta",
          "        idx ← idx + (idx & -idx)",
          "",
          "function prefix_sum(bit, idx):",
          "    total ← 0",
          "    while idx > 0:",
          "        total ← total + bit[idx]",
          "        idx ← idx - (idx & -idx)",
          "    return total",
          "",
          "function range_sum(bit, l, r):",
          "    return prefix_sum(bit, r) - prefix_sum(bit, l - 1)",
          "",
          "function build_fenwick(arr_1based, n):",
          "    bit ← array of size n + 1 filled with 0",
          "    for i from 1 to n:",
          "        bit[i] ← bit[i] + arr_1based[i]",
          "        p ← i + (i & -i)",
          "        if p <= n:",
          "            bit[p] ← bit[p] + bit[i]",
          "    return bit",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Fenwick Tree operations and bit-step direction",
          headers: ["Operation", "Bit Step", "Loop Guard", "Time Complexity"],
          rows: [
            ["add(idx, delta)", "idx += idx & -idx", "idx <= n", "O(log n)"],
            ["prefix_sum(idx)", "idx -= idx & -idx", "idx > 0", "O(log n)"],
            ["range_sum(l, r)", "prefix(r) - prefix(l - 1)", "1 <= l <= r <= n", "O(log n)"],
            ["build_fenwick(arr)", "p = i + (i & -i)", "i = 1..n", "O(n)"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Always convert 0-based input indices `i` to `i + 1` before calling `add` or `prefix_sum`. Passing `idx = 0` into `while idx <= n` spins forever because `0 + (0 & -0) == 0`.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build a 1-Based Fenwick Tree Step by Step",
      subtitle: "Fix the 0-based infinite loop trap, walk upward/downward with i & -i, and build in O(n).",
      steps: [
        {
          label: "Step 1: Broken 0-based index hangs at i = 0",
          explanation: "Passing `idx = 0` into `idx += idx & -idx` computes `0 + (0 & -0) = 0` on every iteration, so the loop never reaches `n`.",
          code: [
            "bit ← [0, 2, 3, 4, 10, 2, 7, 1, 24]",
            "idx ← 0, n ← 8",
            "while idx <= n:",
            "    bit[idx] ← bit[idx] + 5",
            "    idx ← idx + (idx & -idx)   // 0 + 0 = 0 forever!",
          ],
          activeLines: [2, 3, 5],
          output: "Infinite loop at idx = 0",
        },
        {
          label: "Step 2: Shift to 1-based indexing for add and prefix_sum",
          explanation: "Starting at 1-based `idx = 3` visits `3 -> 4 -> 8`, while `prefix_sum(7)` walks downward `7 -> 6 -> 4 -> 0`.",
          code: [
            "function add(bit, n, idx, delta):",
            "    while idx <= n:",
            "        bit[idx] ← bit[idx] + delta",
            "        idx ← idx + (idx & -idx)",
            "function prefix_sum(bit, idx):",
            "    total ← 0",
            "    while idx > 0:",
            "        total ← total + bit[idx]",
            "        idx ← idx - (idx & -idx)",
            "    return total",
            "add(bit, 8, 3, 5)              // updates bit[3]=9, bit[4]=15, bit[8]=29",
            "print(prefix_sum(bit, 7))      // bit[7] + bit[6] + bit[4] = 1 + 7 + 15",
          ],
          activeLines: [1, 2, 3, 4, 11, 12],
          output: "23",
        },
        {
          label: "Step 3: Build in O(n) via immediate parent and answer range_sum(3, 7)",
          explanation: "Pushing each `bit[i]` into `p = i + (i & -i)` constructs the tree in one pass, and `prefix_sum(7) - prefix_sum(2)` isolates `[3..7]`.",
          code: [
            "function build_fenwick(arr_1based, n):",
            "    bit ← array of size n + 1 filled with 0",
            "    for i from 1 to n:",
            "        bit[i] ← bit[i] + arr_1based[i]",
            "        p ← i + (i & -i)",
            "        if p <= n: bit[p] ← bit[p] + bit[i]",
            "    return bit",
            "function range_sum(bit, l, r):",
            "    return prefix_sum(bit, r) - prefix_sum(bit, l - 1)",
            "print(range_sum(bit, 3, 7))    // 23 - 3",
          ],
          activeLines: [4, 5, 6, 9],
          output: "20",
        },
      ],
    },
    walkthrough: {
      title: "Trace Fenwick Structure, Upward Update, and Downward Query on n = 8",
      layout: "visual-first",
      steps: [
        {
          title: "Inspect the 1-based Fenwick forest for [2, 1, 4, 3, 2, 5, 1, 6]",
          tag: "MEMORY",
          explanation: [
            "For `arr = [2, 1, 4, 3, 2, 5, 1, 6]` (1-indexed), `bit[1..8]` stores `[2, 3, 4, 10, 2, 7, 1, 24]`.",
            "Each node `i` covers `[i - (i & -i) + 1 .. i]`, forming a compact forest where `prefix_sum` links point toward `i - (i & -i)`.",
          ],
          code: [
            "// 1-based arr = [2, 1, 4, 3, 2, 5, 1, 6]",
            "bit ← [0, 2, 3, 4, 10, 2, 7, 1, 24]",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "n", value: "8" },
            { name: "bit[1..8]", value: "[2, 3, 4, 10, 2, 7, 1, 24]" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "1-based arr[1..8] and bit[0..8]: bit[0] stays unused (-) unlike 0-based M03 prefix sums and M15 heaps",
            trays: [
              {
                label: "1-based input arr[1..8]",
                cells: [
                  { id: "fa0", value: "-", index: 0, state: "dim" },
                  { id: "fa1", value: "2", index: 1 },
                  { id: "fa2", value: "1", index: 2 },
                  { id: "fa3", value: "4", index: 3 },
                  { id: "fa4", value: "3", index: 4 },
                  { id: "fa5", value: "2", index: 5 },
                  { id: "fa6", value: "5", index: 6 },
                  { id: "fa7", value: "1", index: 7 },
                  { id: "fa8", value: "6", index: 8 },
                ],
              },
              {
                label: "Fenwick array bit[0..8] after O(n) build",
                cells: [
                  { id: "f0", value: "-", index: 0, state: "dim" },
                  { id: "f1", value: "2", index: 1, state: "done" },
                  { id: "f2", value: "3", index: 2, state: "done" },
                  { id: "f3", value: "4", index: 3, state: "done" },
                  { id: "f4", value: "10", index: 4, state: "active" },
                  { id: "f5", value: "2", index: 5, state: "done" },
                  { id: "f6", value: "7", index: 6, state: "done" },
                  { id: "f7", value: "1", index: 7, state: "done" },
                  { id: "f8", value: "24", index: 8, state: "pivot" },
                ],
                pointers: [
                  { index: 0, label: "unused", tone: "coral" },
                  { index: 4, label: "[1..4]=10", tone: "accent" },
                  { index: 8, label: "[1..8]=24", tone: "ok" },
                ],
              },
            ],
          },
        },
        {
          title: "add(idx = 3, delta = +5): step 3 -> 4 -> 8",
          tag: "TRACE",
          explanation: [
            "Start at `idx = 3` (`0011`, `3 & -3 = 1`). Add `5` to `bit[3]` (`4 -> 9`), then jump to `3 + 1 = 4`.",
            "At `idx = 4` (`0100`, `4 & -4 = 4`), add `5` to `bit[4]` (`10 -> 15`) and jump to `4 + 4 = 8`.",
          ],
          code: [
            "bit[3] ← bit[3] + 5        // 4 -> 9, idx = 3 + 1 = 4",
            "bit[4] ← bit[4] + 5        // 10 -> 15, idx = 4 + 4 = 8",
            "bit[8] ← bit[8] + 5        // 24 -> 29, idx = 8 + 8 = 16 (stop)",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "idx", value: "3 -> 4 -> 8", changed: true },
            { name: "bit[3]", value: "9", changed: true },
            { name: "bit[4]", value: "15", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Upward update hits bit[3], bit[4], and bit[8] while skipping unrelated slots",
            trays: [
              {
                label: "bit[0..8] (slot 0 unused)",
                cells: [
                  { id: "f0", value: "-", index: 0, state: "dim" },
                  { id: "f1", value: "2", index: 1 },
                  { id: "f2", value: "3", index: 2 },
                  { id: "f3", value: "9", index: 3, state: "active" },
                  { id: "f4", value: "15", index: 4, state: "active" },
                  { id: "f5", value: "2", index: 5 },
                  { id: "f6", value: "7", index: 6 },
                  { id: "f7", value: "1", index: 7 },
                  { id: "f8", value: "24", index: 8, state: "pivot" },
                ],
                pointers: [
                  { index: 3, label: "+1", tone: "coral" },
                  { index: 4, label: "+4", tone: "accent" },
                  { index: 8, label: "next", tone: "ok" },
                ],
              },
            ],
          },
        },
        {
          title: "Complete add(3, +5) at bit[8] and terminate",
          tag: "TRACE",
          explanation: [
            "Add `5` to `bit[8]` (`24 -> 29`), then compute `8 + (8 & -8) = 16`.",
            "Since `16 > 8`, the `while idx <= n` loop exits in just 3 slot updates.",
          ],
          code: [
            "bit[8] ← bit[8] + 5        // 24 -> 29",
            "idx ← 8 + (8 & -8)         // 16 > 8 -> exit",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "bit[8]", value: "29", changed: true },
            { name: "idx", value: "16 (stop)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "All 3 ancestors covering index 3 (bit[3], bit[4], bit[8]) are now updated",
            trays: [
              {
                label: "bit[0..8]",
                cells: [
                  { id: "f0", value: "-", index: 0, state: "dim" },
                  { id: "f1", value: "2", index: 1 },
                  { id: "f2", value: "3", index: 2 },
                  { id: "f3", value: "9", index: 3, state: "done" },
                  { id: "f4", value: "15", index: 4, state: "done" },
                  { id: "f5", value: "2", index: 5 },
                  { id: "f6", value: "7", index: 6 },
                  { id: "f7", value: "1", index: 7 },
                  { id: "f8", value: "29", index: 8, state: "active" },
                ],
                pointers: [{ index: 8, label: "done", tone: "ok" }],
              },
            ],
          },
        },
        {
          title: "prefix_sum(7): climb down 7 -> 6 -> 4 -> 0",
          tag: "TRACE",
          explanation: [
            "`prefix_sum(7)` reads `bit[7] = 1` (`[7..7]`), subtracts `7 & -7 = 1` to reach `6`, reads `bit[6] = 7` (`[5..6]`), subtracts `6 & -6 = 2` to reach `4`, and reads `bit[4] = 15` (`[1..4]`).",
            "At `4 - (4 & -4) = 0`, the loop exits with `total = 1 + 7 + 15 = 23`.",
          ],
          code: [
            "total ← 0",
            "total ← total + bit[7]     // +1 = 1, idx = 7 - 1 = 6",
            "total ← total + bit[6]     // +7 = 8, idx = 6 - 2 = 4",
            "total ← total + bit[4]     // +15 = 23, idx = 4 - 4 = 0",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "path", value: "7 -> 6 -> 4 -> 0" },
            { name: "prefix_sum(7)", value: "23", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "prefix_sum(7) strips lowest 1-bits via idx -= idx & -idx: bit[7] + bit[6] + bit[4] = 1 + 7 + 15 = 23",
            trays: [
              {
                label: "bit[0..8] visited along 7 -> 6 -> 4 -> 0",
                cells: [
                  { id: "f0", value: "-", index: 0, state: "dim" },
                  { id: "f1", value: "2", index: 1, state: "dim" },
                  { id: "f2", value: "3", index: 2, state: "dim" },
                  { id: "f3", value: "9", index: 3, state: "dim" },
                  { id: "f4", value: "15", index: 4, state: "done" },
                  { id: "f5", value: "2", index: 5, state: "dim" },
                  { id: "f6", value: "7", index: 6, state: "done" },
                  { id: "f7", value: "1", index: 7, state: "active" },
                  { id: "f8", value: "29", index: 8, state: "dim" },
                ],
                pointers: [
                  { index: 4, label: "+15 (sum=23)", tone: "ok" },
                  { index: 6, label: "+7", tone: "accent" },
                  { index: 7, label: "start (+1)", tone: "coral" },
                ],
              },
            ],
          },
        },
        {
          title: "range_sum(3, 7) = prefix_sum(7) - prefix_sum(2)",
          tag: "CHECK",
          explanation: [
            "`prefix_sum(2)` reads `bit[2] = 3` (`2 - 2 = 0`), representing the prefix `[1..2]`.",
            "Subtracting gives `23 - 3 = 20`, matching `[9, 3, 2, 5, 1]` after the `+5` update at index `3`.",
          ],
          code: [
            "p7 ← prefix_sum(bit, 7)    // 23",
            "p2 ← prefix_sum(bit, 2)    // bit[2] = 3",
            "return p7 - p2             // 23 - 3 = 20",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "prefix_sum(7)", value: "23" },
            { name: "prefix_sum(2)", value: "3" },
            { name: "range_sum(3, 7)", value: "20", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "range_sum(3, 7) subtracts bit[2] (3) from bit[7]+bit[6]+bit[4] (23) to get 20",
            trays: [
              {
                label: "bit[0..8]",
                cells: [
                  { id: "f0", value: "-", index: 0, state: "dim" },
                  { id: "f1", value: "2", index: 1 },
                  { id: "f2", value: "3", index: 2, state: "pivot" },
                  { id: "f3", value: "9", index: 3 },
                  { id: "f4", value: "15", index: 4, state: "done" },
                  { id: "f5", value: "2", index: 5 },
                  { id: "f6", value: "7", index: 6, state: "done" },
                  { id: "f7", value: "1", index: 7, state: "done" },
                  { id: "f8", value: "29", index: 8 },
                ],
                pointers: [
                  { index: 2, label: "-p2", tone: "coral" },
                  { index: 7, label: "+p7", tone: "ok" },
                ],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using 0-based index 0 in a Fenwick Tree",
        detail:
          "Because `0 & -0 == 0`, calling `add(bit, n, 0, delta)` never advances `idx` and loops forever. Always convert 0-based indices by passing `idx + 1` to `add`, and compute `range_sum(l, r)` on 0-based `[l, r]` as `prefix_sum(r + 1) - prefix_sum(l)`.",
        code: "// 0-based [l, r] -> 1-based [l+1, r+1]\nsum ← prefix_sum(bit, r + 1) - prefix_sum(bit, l)",
      },
      {
        title: "Trying to compute general range minimum with a Fenwick Tree",
        detail:
          "`range_sum(l, r)` relies on subtraction to cancel `[1..l-1]` out of `[1..r]`. Because `min` and `max` have no inverse operation, you cannot cancel a prefix minimum out of a longer prefix minimum. Use a Segment Tree whenever you need arbitrary `[l, r]` min, max, or gcd queries.",
      },
      {
        title: "Replacing a value instead of adding a delta",
        detail:
          "Fenwick `add(idx, delta)` adds `delta` onto the existing element. When an input asks to overwrite `arr[idx] = new_val`, keep a copy of `arr` so you can pass `delta = new_val - arr[idx]` and update `arr[idx] = new_val`.",
      },
    ],
    predictChecks: [
      {
        prompt: "Someone passes 0-based index idx = 0 directly into Fenwick add(bit, n, idx, delta) without shifting to idx + 1. What happens inside the while loop?",
        code: "function add(bit, n, idx, delta):\n    while idx <= n:\n        bit[idx] += delta\n        idx += idx & -idx\nadd(bit, 5, 0, 10)",
        options: [
          { id: "a", label: "It updates bit[0] once and advances idx to 1" },
          { id: "b", label: "Because 0 & -0 == 0, idx stays 0 and the loop runs forever" },
          { id: "c", label: "It writes to bit[0..5] and exits after 6 steps" },
          { id: "d", label: "idx overflows negative and exits immediately" },
        ],
        correctId: "b",
        explanation: "In two's complement, -0 == 0, so 0 & -0 evaluates to 0. Adding 0 never advances idx past n, locking add() in an infinite loop. Always convert 0-based indices via idx + 1.",
      },
      {
        prompt: "For 0-based arr = [3, 5, 2, 7], we want the inclusive sum on [l = 1, r = 3] (5 + 2 + 7 = 14). What does this off-by-one range_sum return?",
        code: "// 1-based prefix_sum(k) sums arr[0 .. k-1]\nfunction range_sum(l, r):\n    return prefix_sum(r + 1) - prefix_sum(l + 1)\nreturn range_sum(1, 3)",
        options: [
          { id: "a", label: "14, the inclusive sum of indices 1..3" },
          { id: "b", label: "12, because r + 1 skips index 3" },
          { id: "c", label: "9 instead of 14, because prefix_sum(l + 1) subtracts arr[1] as well" },
          { id: "d", label: "17, because prefix_sum(2) returns 0" },
        ],
        correctId: "c",
        explanation: "1-based prefix_sum(l + 1) includes arr[0..l], so subtracting it drops arr[l] = 5 from the range. Inclusive 0-based [l, r] is prefix_sum(r + 1) - prefix_sum(l).",
      },
    ],
    practiceTask: {
      title: "Implement a 1-Based Fenwick Tree",
      tier: "Warmup",
      goal: "Write `build_fenwick`, `add`, `prefix_sum`, and `range_sum` using `idx & -idx`.",
      constraints: [
        "1 <= len(arr) <= 10^5",
        "1 <= idx, l, r <= len(arr)",
        "Target: O(n) build, O(log n) add and range_sum",
      ],
      examples: [
        {
          input: "arr_1based = [0, 3, 2, -1, 6, 5], range_sum(2, 5), add(3, 4), range_sum(2, 5)",
          output: "12, 16",
        },
        {
          input: "arr_1based = [0, 4, -2, 7], range_sum(2, 2), add(2, 5), range_sum(1, 3)",
          output: "-2, 14",
          explanation: "Single-element range_sum(2, 2) returns -2; adding 5 lifts full sum to 4 + 3 + 7 = 14.",
        },
      ],
      tasks: [
        "Build `bit[1..n]` in `O(n)` using `p = i + (i & -i)`.",
        "Implement `add` with `idx += idx & -idx` while `idx <= n`.",
        "Implement `prefix_sum` with `idx -= idx & -idx` while `idx > 0`, and `range_sum(l, r)` as `prefix_sum(r) - prefix_sum(l - 1)`.",
      ],
      starterCode:
        "function build_fenwick(arr_1based, n):\n    // TODO\nfunction add(bit, n, idx, delta):\n    // TODO\nfunction prefix_sum(bit, idx):\n    // TODO\nfunction range_sum(bit, l, r):\n    // TODO",
      expectedOutput: "12, 16\n-2, 14",
      hint: "On `arr_1based[2..5] = [2, -1, 6, 5]`, sum is `12`. Adding `4` at index `3` lifts `range_sum(2, 5)` to `16`.",
      complexity: { time: "O(n) build, O(log n) update/query", space: "O(n)" },
      solutionCode:
        "function build_fenwick(arr_1based, n):\n    bit ← array of size n + 1 filled with 0\n    for i from 1 to n:\n        bit[i] ← bit[i] + arr_1based[i]\n        p ← i + (i & -i)\n        if p <= n: bit[p] ← bit[p] + bit[i]\n    return bit\n\nfunction add(bit, n, idx, delta):\n    while idx <= n:\n        bit[idx] ← bit[idx] + delta\n        idx ← idx + (idx & -idx)\n\nfunction prefix_sum(bit, idx):\n    total ← 0\n    while idx > 0:\n        total ← total + bit[idx]\n        idx ← idx - (idx & -idx)\n    return total\n\nfunction range_sum(bit, l, r):\n    return prefix_sum(bit, r) - prefix_sum(bit, l - 1)",
    },
    practiceChallenges: [
      {
        title: "Dynamic Subarray Sum With 0-Based Queries",
        tier: "Warmup",
        goal: "Wrap a 1-based Fenwick Tree to support `set_val(i, val)` and `sum_range(l, r)` on a 0-based array `nums`.",
        constraints: [
          "1 <= len(nums) <= 10^5",
          "0 <= i, l <= r < len(nums)",
          "Target: O(log n) per call",
        ],
        examples: [
          {
            input: "nums = [1, 3, 5], sum_range(0, 2), set_val(1, 2), sum_range(0, 2)",
            output: "9, 8",
          },
          {
            input: "nums = [7], sum_range(0, 0), set_val(0, -3), sum_range(0, 0)",
            output: "7, -3",
            explanation: "Single-element array checks 0-based index 0 mapping to 1-based Fenwick slot 1.",
          },
        ],
        tasks: [
          "Build `bit[1..n]` from `nums[0..n-1]`.",
          "In `set_val(i, val)`, compute `delta = val - nums[i]`, store `nums[i] = val`, and call `add(i + 1, delta)`.",
          "In `sum_range(l, r)`, return `prefix_sum(r + 1) - prefix_sum(l)`.",
        ],
        starterCode:
          "class NumArray:\n    init(nums):\n        // TODO\n    function set_val(i, val):\n        // TODO\n    function sum_range(l, r):\n        // TODO",
        expectedOutput: "9, 8\n7, -3",
        hint: "Watch the index shift: 0-based `nums[l..r]` maps to 1-based `[l + 1 .. r + 1]`, so the prefix before it ends at `l`.",
        complexity: { time: "O(n) init, O(log n) update/query", space: "O(n)" },
        solutionCode:
          "class NumArray:\n    init(nums):\n        self.nums ← copy(nums)\n        self.n ← len(nums)\n        self.bit ← array of size self.n + 1 filled with 0\n        for i from 1 to self.n:\n            self.bit[i] ← self.bit[i] + nums[i - 1]\n            p ← i + (i & -i)\n            if p <= self.n: self.bit[p] ← self.bit[p] + self.bit[i]\n\n    function add(idx, delta):\n        while idx <= self.n:\n            self.bit[idx] ← self.bit[idx] + delta\n            idx ← idx + (idx & -idx)\n\n    function prefix_sum(idx):\n        total ← 0\n        while idx > 0:\n            total ← total + self.bit[idx]\n            idx ← idx - (idx & -idx)\n        return total\n\n    function set_val(i, val):\n        delta ← val - self.nums[i]\n        self.nums[i] ← val\n        self.add(i + 1, delta)\n\n    function sum_range(l, r):\n        return self.prefix_sum(r + 1) - self.prefix_sum(l)",
      },
      {
        title: "Count Smaller Numbers After Self (Bounded Keys)",
        tier: "Core",
        goal: "Given an integer array `nums` where `1 <= nums[i] <= M`, return an array `counts` where `counts[i]` is the number of elements `nums[j]` with `j > i` and `nums[j] < nums[i]`.",
        constraints: [
          "1 <= len(nums) <= 10^5",
          "1 <= nums[i] <= M <= 10^5",
          "Target: O(n log M) time, O(M) space",
        ],
        examples: [
          { input: "nums = [5, 2, 6, 1], M = 6", output: "[2, 1, 1, 0]" },
          { input: "nums = [3, 3, 2], M = 3", output: "[1, 1, 0]" },
        ],
        tasks: [
          "Allocate a Fenwick Tree `freq` of size `M + 1` tracking frequencies of elements seen so far.",
          "Iterate `i` from `n - 1` down to `0`.",
          "Record `counts[i] = prefix_sum(freq, nums[i] - 1)` (strictly smaller values), then call `add(freq, M, nums[i], 1)`.",
        ],
        starterCode: "function count_smaller_after(nums, M):\n    // TODO: scan right-to-left with frequency BIT",
        expectedOutput: "[2, 1, 1, 0]\n[1, 1, 0]",
        hint: "Scanning right-to-left guarantees that when you stand at `i`, the Fenwick Tree holds strictly elements at `j > i`.",
        complexity: { time: "O(n log M)", space: "O(n + M)" },
        solutionCode:
          "function count_smaller_after(nums, M):\n    n ← len(nums)\n    freq ← array of size M + 1 filled with 0\n    counts ← array of size n filled with 0\n    for i from n - 1 down to 0:\n        counts[i] ← prefix_sum(freq, nums[i] - 1)\n        add(freq, M, nums[i], 1)\n    return counts",
      },
      {
        title: "Range Add & Point Query via Difference Fenwick Tree",
        tier: "Stretch",
        goal: "Support `range_add(l, r, delta)` (adding `delta` to every element in 1-based `[l, r]`) and `point_get(idx)` on an initially zero array of length `n`, both in `O(log n)` time.",
        constraints: [
          "1 <= n <= 10^5",
          "1 <= l <= r <= n",
          "Target: O(log n) range_add and point_get",
        ],
        examples: [
          {
            input: "n = 5, range_add(2, 4, 10), range_add(3, 5, -3), point_get(3), point_get(2)",
            output: "7, 10",
          },
          {
            input: "n = 4, range_add(1, 3, 5), range_add(2, 2, 4), point_get(2), point_get(4)",
            output: "9, 0",
            explanation: "Point 2 gets both +5 and +4 (= 9); untouched boundary point 4 remains 0.",
          },
        ],
        tasks: [
          "Combine Module 03 difference arrays with a Fenwick Tree storing `diff[1..n]`.",
          "In `range_add(l, r, delta)`, call `add(l, delta)` and, if `r + 1 <= n`, `add(r + 1, -delta)`.",
          "In `point_get(idx)`, return `prefix_sum(idx)`.",
        ],
        starterCode:
          "function range_add(bit, n, l, r, delta):\n    // TODO\nfunction point_get(bit, idx):\n    // TODO",
        expectedOutput: "7, 10\n9, 0",
        hint: "Remember that the original array value at `idx` equals the prefix sum of its difference array `diff[1..idx]`.",
        complexity: { time: "O(log n) per operation", space: "O(n)" },
        solutionCode:
          "function range_add(bit, n, l, r, delta):\n    add(bit, n, l, delta)\n    if r + 1 <= n:\n        add(bit, n, r + 1, -delta)\n\nfunction point_get(bit, idx):\n    return prefix_sum(bit, idx)",
      },
    ],
  },

  "dsa-segment-tree": {
    lessonId: "dsa-segment-tree",
    subtitle:
      "Pack a recursive divide-and-conquer tree into a 4 * n array with 2i and 2i + 1 child indexing to answer arbitrary associative range queries and deferred lazy range updates in O(log n).",
    intro: {
      heading: "Segment Tree & Lazy Propagation",
      explanation: [
        "Fenwick Trees rely on subtraction to recover `[l, r]` from two prefixes, so non-invertible queries like `range_min(l, r)` or `range_gcd(l, r)` fail. A **Segment Tree** stores explicit merged summaries for recursive splits `[start, end]`, yet two bugs break early implementations: allocating `2 * n` slots crashes out of bounds on non-power-of-two lengths (for `n = 6`, leaf `[4]` lands at index `13 >= 12`), and forgetting to call `push_down` before reading children returns stale child values after a range update.",
        "Allocating `4 * n` slots for `tree` and `lazy` keeps `2 * node` and `2 * node + 1` in bounds for every `n`, supporting any associative combine (`min`, `max`, `sum`, `gcd`) in `O(log n)` time. When `range_add` hits a subtree completely inside `[l, r]`, it adds `(end - start + 1) * delta` to `tree[node]` and parks `delta` in `lazy[node]`, flushing `lazy[node]` downward only when a later visit splits that node.",
      ],
      analogy:
        "Inside a company org chart where each manager tracks their department's total budget: when headquarters issues a '+100 per person' bonus across teams 2 through 5, you drop a single '+100' memo on the highest managers whose whole subtree sits inside [2..5] and only pass that memo down to their two deputies when someone asks about a smaller sub-team later.",
      realWorldUses: [
        "Time-series monitoring dashboards answering dynamic range min, max, and percentile queries in O(log n)",
        "Calendar, bandwidth, and hotel-room reservation systems performing range availability updates and interval checks",
      ],
    },
    sections: [
      {
        heading: "Complete-Tree 4 * n Layout, Build, Point Update, and Range Query",
        paragraphs: [
          "Root node `1` covers `[0, n - 1]` (leaving index `0` unused, unlike 0-based Module 15 heaps with `2i + 1` and `2i + 2`). Whenever `start < end`, split at `mid = (start + end) // 2`: left child `2 * node` covers `[start, mid]` and right child `2 * node + 1` covers `[mid + 1, end]`. On `n = 6` (`[0..5]`), node `3` (`[3..5]`) splits into node `6` (`[3..4]`), whose children `[3]` and `[4]` land at indices `12` and `13` — crashing a `2 * 6 = 12` buffer, so always allocate `4 * n` slots.",
          "In `range_query(node, start, end, l, r)`, three mutually exclusive overlap cases appear: **no overlap** (`r < start or end < l`, return the identity element such as `+INF` for `min`, `0` for `sum` or `gcd`), **total overlap** (`l <= start and end <= r`, return `tree[node]` directly), and **partial overlap** (recurse on both children and merge their results). Pairing this with an M14/M18 DFS **Euler Tour** (`tin[u]..tout[u]`) turns subtree queries on arbitrary trees into contiguous segment-tree ranges.",
        ],
        code: [
          "// Example: Range Minimum Segment Tree (non-invertible merge)",
          "function build(tree, arr, node, start, end):",
          "    if start == end:",
          "        tree[node] ← arr[start]",
          "        return",
          "    mid ← (start + end) // 2",
          "    build(tree, arr, 2 * node, start, mid)",
          "    build(tree, arr, 2 * node + 1, mid + 1, end)",
          "    tree[node] ← min(tree[2 * node], tree[2 * node + 1])",
          "",
          "function point_update(tree, node, start, end, idx, val):",
          "    if start == end:",
          "        tree[node] ← val",
          "        return",
          "    mid ← (start + end) // 2",
          "    if idx <= mid:",
          "        point_update(tree, 2 * node, start, mid, idx, val)",
          "    else:",
          "        point_update(tree, 2 * node + 1, mid + 1, end, idx, val)",
          "    tree[node] ← min(tree[2 * node], tree[2 * node + 1])",
          "",
          "function range_min(tree, node, start, end, l, r):",
          "    if r < start or end < l:",
          "        return +INF",
          "    if l <= start and end <= r:",
          "        return tree[node]",
          "    mid ← (start + end) // 2",
          "    left_ans ← range_min(tree, 2 * node, start, mid, l, r)",
          "    right_ans ← range_min(tree, 2 * node + 1, mid + 1, end, l, r)",
          "    return min(left_ans, right_ans)",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Choosing between Module 23 range data structures",
          headers: ["Structure", "Build", "Point Update", "Range Update", "Range Query", "Handles min / gcd?", "Extra Space"],
          rows: [
            ["Sqrt Decomposition", "O(n)", "O(1) sum / O(sqrt(n)) min", "O(sqrt(n)) with lazy block", "O(sqrt(n))", "Yes", "O(sqrt(n))"],
            ["Fenwick Tree (BIT)", "O(n)", "O(log n)", "Point-query diff only", "O(log n)", "No (needs inverse)", "O(n)"],
            ["Segment Tree", "O(n)", "O(log n)", "O(n) without lazy", "O(log n)", "Yes", "4 * n"],
            ["Lazy Segment Tree", "O(n)", "O(log n)", "O(log n)", "O(log n)", "Yes", "8 * n (tree + lazy)"],
          ],
          highlightCol: 4,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Swapping `min` and `+INF` in the template above for `max` and `-INF`, `+` and `0`, or Module 01 `gcd` and `0` gives a working `O(log n)` Segment Tree for any associative operation without changing the recursion.",
        },
      },
      {
        heading: "Lazy Propagation: Deferred O(log n) Range-Add and Range-Sum",
        paragraphs: [
          "Updating every leaf inside `[l, r]` directly in `range_add` degrades back to `O(n)` whenever `r - l` is large. Instead, pair `tree[4 * n]` with `lazy[4 * n]` (initialized to `0`), where `lazy[node]` records a pending `+delta` owed to every element inside `node`'s interval `[start, end]` whose children have not received it yet.",
          "Whenever `range_add` finds a node **totally inside** `[l, r]`, call `apply(node, start, end, delta)`: add `(end - start + 1) * delta` to `tree[node]`, add `delta` to `lazy[node]`, and return immediately. Whenever either `range_add` or `range_sum` must descend past a partial node into its children, call `push_down(node, start, end)` first to flush `lazy[node]` into `2 * node` and `2 * node + 1` and reset `lazy[node] = 0`.",
        ],
        code: [
          "function apply(tree, lazy, node, start, end, delta):",
          "    tree[node] ← tree[node] + (end - start + 1) * delta",
          "    lazy[node] ← lazy[node] + delta",
          "",
          "function push_down(tree, lazy, node, start, end):",
          "    if lazy[node] != 0 and start < end:",
          "        mid ← (start + end) // 2",
          "        apply(tree, lazy, 2 * node, start, mid, lazy[node])",
          "        apply(tree, lazy, 2 * node + 1, mid + 1, end, lazy[node])",
          "        lazy[node] ← 0",
          "",
          "function range_add(tree, lazy, node, start, end, l, r, delta):",
          "    if r < start or end < l:",
          "        return",
          "    if l <= start and end <= r:",
          "        apply(tree, lazy, node, start, end, delta)",
          "        return",
          "    push_down(tree, lazy, node, start, end)",
          "    mid ← (start + end) // 2",
          "    range_add(tree, lazy, 2 * node, start, mid, l, r, delta)",
          "    range_add(tree, lazy, 2 * node + 1, mid + 1, end, l, r, delta)",
          "    tree[node] ← tree[2 * node] + tree[2 * node + 1]",
          "",
          "function range_sum(tree, lazy, node, start, end, l, r):",
          "    if r < start or end < l:",
          "        return 0",
          "    if l <= start and end <= r:",
          "        return tree[node]",
          "    push_down(tree, lazy, node, start, end)",
          "    mid ← (start + end) // 2",
          "    return range_sum(tree, lazy, 2 * node, start, mid, l, r) +",
          "           range_sum(tree, lazy, 2 * node + 1, mid + 1, end, l, r)",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Segment Tree [0..3] build, range_add(1, 3, +3), and range_sum(2, 2) trace on arr = [2, 5, 1, 4]",
          headers: ["Step", "Nodes Visited", "tree[1..7]", "lazy[1..7]", "Outcome"],
          rows: [
            ["build(1, 0, 3)", "1 -> 2,3 -> 4,5,6,7", "[12, 7, 5, 2, 5, 1, 4]", "[0, 0, 0, 0, 0, 0, 0]", "Leaves & parents built"],
            ["range_add(1, 3, +3)", "5 (+3 leaf), 3 (+3 subtree)", "[21, 10, 11, 2, 8, 1, 4]", "[0, 0, 3, 0, 3, 0, 0]", "Leaves 6, 7 untouched (lazy=3 on node 3)"],
            ["range_sum(2, 2) broken (no push)", "1 -> 3 -> 6 (stale)", "[21, 10, 11, 2, 8, 1, 4]", "[0, 0, 3, 0, 3, 0, 0]", "Returns stale tree[6] = 1 (wrong)"],
            ["range_sum(2, 2) fixed (push_down)", "1 -> 3 (push) -> 6, 7", "[21, 10, 11, 2, 8, 4, 7]", "[0, 0, 0, 0, 3, 3, 3]", "Flushes +3 to 6 & 7, returns 4"],
          ],
          highlightCol: 4,
        },
        visual: {
          kind: "dsa-array",
          caption: "Flat 1-based tree[0..7] and lazy[0..7] arrays after range_add(1, 3, +3) and range_sum(2, 2); root at 1 gives children 2i and 2i + 1 (unlike 0-based M15 heaps)",
          trays: [
            {
              label: "tree[0..7] (index 0 unused)",
              cells: [
                { id: "sec_t0", value: "-", index: 0, state: "dim" },
                { id: "sec_t1", value: "21", index: 1, state: "done" },
                { id: "sec_t2", value: "10", index: 2, state: "done" },
                { id: "sec_t3", value: "11", index: 3, state: "done" },
                { id: "sec_t4", value: "2", index: 4 },
                { id: "sec_t5", value: "8", index: 5 },
                { id: "sec_t6", value: "4", index: 6, state: "active" },
                { id: "sec_t7", value: "7", index: 7 },
              ],
              pointers: [{ index: 6, label: "ret=4", tone: "ok" }],
            },
            {
              label: "lazy[0..7]",
              cells: [
                { id: "sec_l0", value: "-", index: 0, state: "dim" },
                { id: "sec_l1", value: "0", index: 1 },
                { id: "sec_l2", value: "0", index: 2 },
                { id: "sec_l3", value: "0", index: 3, state: "done" },
                { id: "sec_l4", value: "0", index: 4 },
                { id: "sec_l5", value: "3", index: 5, state: "pivot" },
                { id: "sec_l6", value: "3", index: 6, state: "pivot" },
                { id: "sec_l7", value: "3", index: 7, state: "pivot" },
              ],
            },
          ],
        },
        callout: {
          kind: "WATCH OUT",
          text: "Always call `push_down` before descending into children in both `range_add` and `range_sum`, and scale `tree[node]` by segment length `(end - start + 1) * delta` (rather than `delta` alone) when updating sums.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build a Lazy Segment Tree Step by Step",
      subtitle: "Prevent the 2 * n out-of-bounds crash and the forgotten push_down bug on arr = [2, 5, 1, 4].",
      steps: [
        {
          label: "Step 1: Allocate 4 * n slots and build [0..3]",
          explanation: "On `n = 6`, a `2 * n = 12` buffer crashes when leaf `[4]` lands at index `13`. Allocating `4 * n` keeps every child `2 * node` and `2 * node + 1` in bounds.",
          code: [
            "arr ← [2, 5, 1, 4]",
            "tree ← array of size 4 * 4 filled with 0",
            "lazy ← array of size 4 * 4 filled with 0",
            "build(tree, arr, 1, 0, 3)",
            "print(tree[1..7])",
          ],
          activeLines: [2, 3, 4],
          output: "[12, 7, 5, 2, 5, 1, 4]",
        },
        {
          label: "Step 2: Broken lazy query without push_down reads stale leaf",
          explanation: "`range_add(1, 3, +3)` parks `lazy[3] = 3` (`tree[3] = 11`) without editing leaves `6` and `7`. Querying `[2, 2]` without calling `push_down(3)` returns stale `tree[6] = 1`.",
          code: [
            "range_add(tree, lazy, 1, 0, 3, 1, 3, 3)   // tree[3]=11, lazy[3]=3, tree[6]=1",
            "function broken_sum(node, s, e, l, r):",
            "    if r < s or e < l: return 0",
            "    if l <= s and e <= r: return tree[node]",
            "    mid ← (s + e) // 2                    // forgot push_down!",
            "    return broken_sum(2*node, s, mid, l, r) + broken_sum(2*node+1, mid+1, e, l, r)",
            "print(broken_sum(1, 0, 3, 2, 2))",
          ],
          activeLines: [1, 5],
          output: "1  (expected 4)",
        },
        {
          label: "Step 3: Flush lazy[node] with push_down before splitting",
          explanation: "Calling `push_down(3)` pushes `+3` into `tree[6]` (`1 -> 4`) and `tree[7]` (`4 -> 7`) and clears `lazy[3] = 0`, returning `4`.",
          code: [
            "function push_down(tree, lazy, node, s, e):",
            "    if lazy[node] != 0 and s < e:",
            "        mid ← (s + e) // 2",
            "        apply(tree, lazy, 2 * node, s, mid, lazy[node])",
            "        apply(tree, lazy, 2 * node + 1, mid + 1, e, lazy[node])",
            "        lazy[node] ← 0",
            "function range_sum(tree, lazy, node, s, e, l, r):",
            "    if r < s or e < l: return 0",
            "    if l <= s and e <= r: return tree[node]",
            "    push_down(tree, lazy, node, s, e)",
            "    mid ← (s + e) // 2",
            "    return range_sum(tree, lazy, 2*node, s, mid, l, r) + range_sum(tree, lazy, 2*node+1, mid+1, e, l, r)",
            "print(range_sum(tree, lazy, 1, 0, 3, 2, 2))",
          ],
          activeLines: [1, 4, 5, 6, 10],
          output: "4",
        },
      ],
    },
    walkthrough: {
      title: "Trace Lazy Range-Add and Push-Down on arr = [2, 5, 1, 4]",
      layout: "visual-first",
      steps: [
        {
          title: "Build sum Segment Tree on arr = [2, 5, 1, 4]",
          tag: "MEMORY",
          explanation: [
            "Node `1` covers `[0..3]` with sum `12`, splitting into node `2` (`[0..1] = 7`) and node `3` (`[2..3] = 5`).",
            "Leaves sit at indices `4..7` holding `[2, 5, 1, 4]`, and all `lazy[1..7]` tags start at `0`.",
          ],
          code: [
            "arr ← [2, 5, 1, 4]",
            "build(tree, arr, 1, 0, 3)   // tree[1..7] = [12, 7, 5, 2, 5, 1, 4]",
            "lazy ← [0, 0, 0, 0, 0, 0, 0, 0]",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "arr = [2, 5, 1, 4]",
              "tree = [0] * (4 * len(arr))  # build fills tree[1..7] = [12, 7, 5, 2, 5, 1, 4]",
              "lazy = [0] * (4 * len(arr))",
            ],
          },
          state: [
            { name: "tree[1..7]", value: "[12, 7, 5, 2, 5, 1, 4]" },
            { name: "lazy[1..7]", value: "[0, 0, 0, 0, 0, 0, 0]" },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "1-based complete binary tree layout: children of node i live at 2i and 2i + 1",
            nodes: [
              { id: "n1", label: "12", x: 50, y: 14, badge: "1 [0..3]" },
              { id: "n2", label: "7", x: 26, y: 50, badge: "2 [0..1]" },
              { id: "n3", label: "5", x: 74, y: 50, badge: "3 [2..3]" },
              { id: "n4", label: "2", x: 14, y: 86, badge: "4 [0]" },
              { id: "n5", label: "5", x: 38, y: 86, badge: "5 [1]" },
              { id: "n6", label: "1", x: 62, y: 86, badge: "6 [2]" },
              { id: "n7", label: "4", x: 86, y: 86, badge: "7 [3]" },
            ],
            edges: [
              { from: "n1", to: "n2" },
              { from: "n1", to: "n3" },
              { from: "n2", to: "n4" },
              { from: "n2", to: "n5" },
              { from: "n3", to: "n6" },
              { from: "n3", to: "n7" },
            ],
          },
        },
        {
          title: "range_add(1, 3, +3): defer at node 3, pull sums up",
          tag: "TRACE",
          explanation: [
            "Node `3` (`[2..3]`) sits completely inside `[1..3]`, so `apply` sets `tree[3] = 5 + 2*3 = 11` and `lazy[3] = +3` and returns without touching leaves `6` or `7`.",
            "On the left side, node `2` splits to leaf `5` (`[1]`: `tree[5] = 8, lazy[5] = 3`), then internal nodes pull `tree[2] = 2 + 8 = 10` and `tree[1] = 10 + 11 = 21`.",
          ],
          code: [
            "range_add(tree, lazy, 1, 0, 3, 1, 3, 3)",
            "// node 5 [1..1]: apply(+3) -> tree[5] = 8, lazy[5] = 3",
            "// node 3 [2..3]: apply(+3) -> tree[3] = 11, lazy[3] = 3 (stop!)",
            "// pull: tree[2] = 10, tree[1] = 21",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "tree[3]", value: "11", changed: true },
            { name: "lazy[3]", value: "3", changed: true },
            { name: "tree[1]", value: "21", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Leaf 5 updated directly (+3); node 3 caches lazy=+3 for [2..3] so leaves 6 and 7 are not visited during range_add",
            nodes: [
              { id: "n1", label: "21", x: 50, y: 14, badge: "1 [0..3]", state: "visited" },
              { id: "n2", label: "10", x: 26, y: 50, badge: "2 [0..1]", state: "visited" },
              { id: "n3", label: "11", x: 74, y: 50, badge: "3 lazy=+3", state: "active" },
              { id: "n4", label: "2", x: 14, y: 86, badge: "4 [0]", state: "dim" },
              { id: "n5", label: "8", x: 38, y: 86, badge: "5 (+3 applied)", state: "active" },
              { id: "n6", label: "1", x: 62, y: 86, badge: "6 (stale)", state: "dim" },
              { id: "n7", label: "4", x: 86, y: 86, badge: "7 (stale)", state: "dim" },
            ],
            edges: [
              { from: "n1", to: "n2", state: "active" },
              { from: "n1", to: "n3", state: "active" },
              { from: "n2", to: "n4", state: "dim" },
              { from: "n2", to: "n5", state: "active" },
              { from: "n3", to: "n6", state: "dim" },
              { from: "n3", to: "n7", state: "dim" },
            ],
          },
        },
        {
          title: "range_sum(2, 2): push_down lazy=+3 from node 3 to leaves 6 and 7",
          tag: "TRACE",
          explanation: [
            "Querying `[2..2]` reaches node `3` (`[2..3]`), which only partially overlaps `[2..2]` and holds `lazy[3] = 3`.",
            "`push_down` flushes `+3` to `node 6` (`tree[6] = 1 + 3 = 4`) and `node 7` (`tree[7] = 4 + 3 = 7`), then resets `lazy[3] = 0`.",
          ],
          code: [
            "push_down(tree, lazy, 3, 2, 3):",
            "    apply(6, 2, 2, 3)   // tree[6] = 4, lazy[6] = 3",
            "    apply(7, 3, 3, 3)   // tree[7] = 7, lazy[7] = 3",
            "    lazy[3] ← 0",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "lazy[3]", value: "0", changed: true },
            { name: "tree[6]", value: "4", changed: true },
            { name: "tree[7]", value: "7", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "push_down(3) delivers deferred +3 to both children before descending into [2..2]",
            nodes: [
              { id: "n1", label: "21", x: 50, y: 14, badge: "1 [0..3]" },
              { id: "n2", label: "10", x: 26, y: 50, badge: "2 [0..1]", state: "dim" },
              { id: "n3", label: "11", x: 74, y: 50, badge: "3 lazy=0", state: "visited" },
              { id: "n4", label: "2", x: 14, y: 86, badge: "4 [0]", state: "dim" },
              { id: "n5", label: "8", x: 38, y: 86, badge: "5 [1]", state: "dim" },
              { id: "n6", label: "4", x: 62, y: 86, badge: "6 +3 -> 4", state: "active" },
              { id: "n7", label: "7", x: 86, y: 86, badge: "7 +3 -> 7", state: "queued" },
            ],
            edges: [
              { from: "n1", to: "n2", state: "dim" },
              { from: "n1", to: "n3", state: "active" },
              { from: "n2", to: "n4", state: "dim" },
              { from: "n2", to: "n5", state: "dim" },
              { from: "n3", to: "n6", directed: true, state: "active" },
              { from: "n3", to: "n7", directed: true, state: "active" },
            ],
          },
        },
        {
          title: "Return total overlap answer from leaf 6",
          tag: "TRACE",
          explanation: [
            "Recursion steps left from node `3` into node `6` (`[2..2]`), which is totally covered by `[2..2]`.",
            "Right child node `7` (`[3..3]`) falls outside `[2..2]` and returns identity `0`, giving `4 + 0 = 4`.",
          ],
          code: [
            "left_ans ← range_sum(6, 2, 2, 2, 2)   // returns tree[6] = 4",
            "right_ans ← range_sum(7, 3, 3, 2, 2)  // outside -> returns 0",
            "return 4 + 0                           // 4",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "left_ans", value: "4", changed: true },
            { name: "right_ans", value: "0" },
            { name: "result", value: "4", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Leaf 6 returns updated value 4 immediately; leaf 7 returns 0 (disjoint)",
            nodes: [
              { id: "n1", label: "21", x: 50, y: 14, badge: "1 [0..3]" },
              { id: "n2", label: "10", x: 26, y: 50, badge: "2 [0..1]", state: "dim" },
              { id: "n3", label: "11", x: 74, y: 50, badge: "3 [2..3]", state: "visited" },
              { id: "n4", label: "2", x: 14, y: 86, badge: "4 [0]", state: "dim" },
              { id: "n5", label: "8", x: 38, y: 86, badge: "5 [1]", state: "dim" },
              { id: "n6", label: "4", x: 62, y: 86, badge: "6 ret 4", state: "active" },
              { id: "n7", label: "7", x: 86, y: 86, badge: "7 ret 0", state: "dim" },
            ],
            edges: [
              { from: "n1", to: "n2", state: "dim" },
              { from: "n1", to: "n3", state: "active" },
              { from: "n2", to: "n4", state: "dim" },
              { from: "n2", to: "n5", state: "dim" },
              { from: "n3", to: "n6", state: "active" },
              { from: "n3", to: "n7", state: "dim" },
            ],
          },
        },
        {
          title: "Verify flat tree[] and lazy[] arrays in memory",
          tag: "CHECK",
          explanation: [
            "The underlying array `[2, 5, 1, 4]` after `range_add(1, 3, +3)` conceptually equals `[2, 8, 4, 7]`.",
            "Every node in `tree[1..7]` now holds the exact sum of its segment (`21, 10, 11, 2, 8, 4, 7`), while `lazy[3]` has already returned to `0`.",
          ],
          code: [
            "// tree[1..7] = [21, 10, 11, 2, 8, 4, 7]",
            "// lazy[1..7] = [0, 0, 0, 0, 3, 3, 3]",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "tree[1..7]", value: "[21, 10, 11, 2, 8, 4, 7]" },
            { name: "lazy[1..7]", value: "[0, 0, 0, 0, 3, 3, 3]" },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "After range_sum(2, 2): push_down(3) zeroes lazy[3] while pushing +3 into leaves 6 (val=4, returned) and 7 (val=7)",
            nodes: [
              { id: "n1", label: "21", x: 50, y: 14, badge: "1 [0..3] l=0", state: "visited" },
              { id: "n2", label: "10", x: 26, y: 50, badge: "2 [0..1] l=0", state: "visited" },
              { id: "n3", label: "11", x: 74, y: 50, badge: "3 [2..3] l=0", state: "visited" },
              { id: "n4", label: "2", x: 14, y: 86, badge: "4 [0] l=0", state: "dim" },
              { id: "n5", label: "8", x: 38, y: 86, badge: "5 [1] l=3", state: "dim" },
              { id: "n6", label: "4", x: 62, y: 86, badge: "6 ret=4 (l=3)", state: "active" },
              { id: "n7", label: "7", x: 86, y: 86, badge: "7 [3] l=3", state: "queued" },
            ],
            edges: [
              { from: "n1", to: "n2", state: "dim" },
              { from: "n1", to: "n3", state: "active" },
              { from: "n2", to: "n4", state: "dim" },
              { from: "n2", to: "n5", state: "dim" },
              { from: "n3", to: "n6", state: "active" },
              { from: "n3", to: "n7", state: "active" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Allocating 2 * n instead of 4 * n slots",
        detail:
          "When `n` is not a power of 2 (for instance `n = 6`), the recursive binary tree is incomplete and leaf nodes reach indices past `2 * n` (`[4..4]` sits at index `13 >= 12`). Always allocate `4 * n` slots for `tree` and `lazy` so `2 * node + 1` stays within bounds.",
        code: "tree ← array of size 4 * n filled with 0\nlazy ← array of size 4 * n filled with 0",
      },
      {
        title: "Adding delta instead of (end - start + 1) * delta in lazy sum",
        detail:
          "When applying `+delta` to a range-sum node covering `[start, end]`, every one of the `end - start + 1` elements inside that interval rises by `delta`. Multiply `delta` by `end - start + 1` on `tree[node]` while storing unscaled `delta` in `lazy[node]`.",
        code: "tree[node] ← tree[node] + (end - start + 1) * delta\nlazy[node] ← lazy[node] + delta",
      },
      {
        title: "Forgetting push_down before reading children",
        detail:
          "Leaving a non-zero `lazy[node]` unpushed during a partial `range_add` or `range_sum` reads stale child values and corrupts the pulled-up parent sum `tree[node] = tree[2 * node] + tree[2 * node + 1]`.",
      },
    ],
    predictChecks: [
      {
        prompt: "arr = [0, 0, 0, 0]. range_add(0, 3, +5) sets tree[1] = 20, lazy[1] = 5, leaving children at 0. Calling range_sum(2, 3) without push_down returns what value?",
        code: "// Root node=1 covers [0, 3]: tree[1]=20, lazy[1]=5\n// Right child node=3 covers [2, 3]: tree[3]=0, lazy[3]=0\nfunction range_sum(node, s, e, l, r):\n    if r < s or e < l: return 0\n    if l <= s and e <= r: return tree[node]\n    // missing: push_down(node, s, e)\n    mid = (s + e) // 2\n    return range_sum(2*node, s, mid, l, r) + range_sum(2*node+1, mid+1, e, l, r)",
        options: [
          { id: "a", label: "10, the true sum of [2, 3]" },
          { id: "b", label: "20, returning the root's full sum" },
          { id: "c", label: "5, adding lazy[1] once" },
          { id: "d", label: "0 instead of 10, because lazy[1] = 5 never reaches node 3 before reading tree[3]" },
        ],
        correctId: "d",
        explanation: "Because range_sum(1, 0, 3, 2, 3) partially overlaps [0, 3], it splits into children 2 and 3 without pushing lazy[1] = 5 down, so node 3 returns its stale tree[3] = 0. Call push_down(node, s, e) before recursing.",
      },
      {
        prompt: "arr = [1, 1, 1, 1] (tree[1] = 4 for [0..3]). This range_add(0, 3, +5) omits (e - s + 1) * when updating tree[node]. What does range_sum(0, 3) return afterward?",
        code: "function range_add(node, s, e, l, r, delta):\n    if r < s or e < l: return\n    if l <= s and e <= r:\n        tree[node] += delta // BUG: missing (e - s + 1) *\n        lazy[node] += delta\n        return",
        options: [
          { id: "a", label: "9 instead of 24, because tree[1] adds delta once instead of across all 4 leaves" },
          { id: "b", label: "24, because lazy[1] = 5 adds the remaining 15 on query" },
          { id: "c", label: "5, because tree[1] overwrites 4" },
          { id: "d", label: "19, because (e - s) * delta adds 3 * 5" },
        ],
        correctId: "a",
        explanation: "A range-sum node covering [s, e] represents (e - s + 1) elements, each rising by delta. Adding unscaled delta adds 5 instead of 4 * 5 = 20, leaving tree[1] = 9. Write tree[node] += (e - s + 1) * delta.",
      },
    ],
    practiceTask: {
      title: "Implement Recursive Range-Min Segment Tree",
      tier: "Warmup",
      goal: "Build a `4 * n` recursive Segment Tree supporting `build`, `point_update`, and `range_min`.",
      constraints: [
        "1 <= len(arr) <= 10^5",
        "0 <= l <= r < len(arr)",
        "Target: O(n) build, O(log n) point_update and range_min",
      ],
      examples: [
        {
          input: "arr = [6, 2, 9, 4, 7], range_min(1, 4), point_update(1, 8), range_min(1, 4)",
          output: "2, 4",
        },
        {
          input: "arr = [-5, -1, -8], range_min(0, 1), point_update(0, -10), range_min(0, 2)",
          output: "-5, -10",
          explanation: "All-negative array verifies +INF identity returns -5 and tracks update to -10.",
        },
      ],
      tasks: [
        "Allocate `tree` of size `4 * n` and populate leaves at `start == end`.",
        "Pull `min(tree[2 * node], tree[2 * node + 1])` on the way back up in `build` and `point_update`.",
        "Return `+INF` on disjoint intervals and `tree[node]` on total overlap in `range_min`.",
      ],
      starterCode:
        "function build(tree, arr, node, start, end):\n    // TODO\nfunction point_update(tree, node, start, end, idx, val):\n    // TODO\nfunction range_min(tree, node, start, end, l, r):\n    // TODO",
      expectedOutput: "2, 4\n-5, -10",
      hint: "In `point_update`, compare `idx <= mid` to recurse into only the single branch containing `idx`, then recompute `tree[node]`.",
      complexity: { time: "O(n) build, O(log n) update/query", space: "O(n) (4 * n)" },
      solutionCode:
        "function build(tree, arr, node, start, end):\n    if start == end:\n        tree[node] ← arr[start]\n        return\n    mid ← (start + end) // 2\n    build(tree, arr, 2 * node, start, mid)\n    build(tree, arr, 2 * node + 1, mid + 1, end)\n    tree[node] ← min(tree[2 * node], tree[2 * node + 1])\n\nfunction point_update(tree, node, start, end, idx, val):\n    if start == end:\n        tree[node] ← val\n        return\n    mid ← (start + end) // 2\n    if idx <= mid:\n        point_update(tree, 2 * node, start, mid, idx, val)\n    else:\n        point_update(tree, 2 * node + 1, mid + 1, end, idx, val)\n    tree[node] ← min(tree[2 * node], tree[2 * node + 1])\n\nfunction range_min(tree, node, start, end, l, r):\n    if r < start or end < l:\n        return +INF\n    if l <= start and end <= r:\n        return tree[node]\n    mid ← (start + end) // 2\n    return min(range_min(tree, 2 * node, start, mid, l, r), range_min(tree, 2 * node + 1, mid + 1, end, l, r))",
    },
    practiceChallenges: [
      {
        title: "Dynamic Range Maximum Query",
        tier: "Warmup",
        goal: "Implement `update(idx, val)` and `range_max(l, r)` over a mutable integer array using a `4 * n` Segment Tree.",
        constraints: [
          "1 <= len(arr) <= 10^5",
          "-10^9 <= arr[i] <= 10^9",
          "Target: O(log n) update and range_max",
        ],
        examples: [
          {
            input: "arr = [4, 1, 7, 3, 5], range_max(0, 3), update(2, 0), range_max(0, 3)",
            output: "7, 4",
          },
          {
            input: "arr = [-9, -3, -7], range_max(0, 2), update(1, -12), range_max(0, 2)",
            output: "-3, -7",
            explanation: "Using -INF as the identity prevents all-negative ranges from clamping to 0.",
          },
        ],
        tasks: [
          "Build the Segment Tree with `max` as the merge operator.",
          "Use `-INF` as the identity value when `[start, end]` and `[l, r]` are disjoint.",
        ],
        starterCode:
          "function range_max(tree, node, start, end, l, r):\n    // TODO\nfunction update_max(tree, node, start, end, idx, val):\n    // TODO",
        expectedOutput: "7, 4\n-3, -7",
        hint: "Never return `0` on disjoint intervals for `range_max`, because all elements inside `[l, r]` could be negative; always return `-INF`.",
        complexity: { time: "O(n) build, O(log n) update/query", space: "O(n)" },
        solutionCode:
          "function update_max(tree, node, start, end, idx, val):\n    if start == end:\n        tree[node] ← val\n        return\n    mid ← (start + end) // 2\n    if idx <= mid:\n        update_max(tree, 2 * node, start, mid, idx, val)\n    else:\n        update_max(tree, 2 * node + 1, mid + 1, end, idx, val)\n    tree[node] ← max(tree[2 * node], tree[2 * node + 1])\n\nfunction range_max(tree, node, start, end, l, r):\n    if r < start or end < l:\n        return -INF\n    if l <= start and end <= r:\n        return tree[node]\n    mid ← (start + end) // 2\n    return max(range_max(tree, 2 * node, start, mid, l, r), range_max(tree, 2 * node + 1, mid + 1, end, l, r))",
      },
      {
        title: "Lazy Range Add and Range Sum",
        tier: "Core",
        goal: "Build a Lazy Segment Tree supporting `range_add(l, r, delta)` and `range_sum(l, r)` in `O(log n)` time.",
        constraints: [
          "1 <= len(arr) <= 10^5",
          "Up to 10^5 operations",
          "Target: O(log n) range_add and range_sum",
        ],
        examples: [
          {
            input: "arr = [1, 2, 3, 4], range_add(0, 2, 5), range_sum(1, 3), range_add(2, 3, -2), range_sum(0, 3)",
            output: "19, 21",
          },
          {
            input: "arr = [0, 0, 0], range_add(0, 1, 4), range_add(1, 2, -2), range_sum(1, 1), range_sum(0, 2)",
            output: "2, 4",
            explanation: "Overlapping range updates yield [4, 2, -2], so single-index sum(1, 1) pushes pending lazy tags.",
          },
        ],
        tasks: [
          "Write `apply(node, start, end, delta)` updating `tree[node]` by `(end - start + 1) * delta` and `lazy[node]` by `delta`.",
          "Write `push_down(node, start, end)` to push `lazy[node]` into both children and zero `lazy[node]`.",
          "Call `push_down` before splitting in both `range_add` and `range_sum`.",
        ],
        starterCode:
          "class LazySegTree:\n    init(arr):\n        // TODO\n    function range_add(l, r, delta):\n        // TODO\n    function range_sum(l, r):\n        // TODO",
        expectedOutput: "19, 21\n2, 4",
        hint: "Trace `arr = [1, 2, 3, 4]`: after `range_add(0, 2, 5)`, array is `[6, 7, 8, 4]` (`sum(1, 3) = 19`); after `range_add(2, 3, -2)`, array is `[6, 7, 6, 2]` (`sum(0, 3) = 21`).",
        complexity: { time: "O(n) init, O(log n) per op", space: "O(n) (8 * n)" },
        solutionCode:
          "class LazySegTree:\n    init(arr):\n        self.n ← len(arr)\n        self.tree ← array of size 4 * self.n filled with 0\n        self.lazy ← array of size 4 * self.n filled with 0\n        self._build(arr, 1, 0, self.n - 1)\n\n    function _build(arr, node, start, end):\n        if start == end:\n            self.tree[node] ← arr[start]\n            return\n        mid ← (start + end) // 2\n        self._build(arr, 2 * node, start, mid)\n        self._build(arr, 2 * node + 1, mid + 1, end)\n        self.tree[node] ← self.tree[2 * node] + self.tree[2 * node + 1]\n\n    function _apply(node, start, end, delta):\n        self.tree[node] ← self.tree[node] + (end - start + 1) * delta\n        self.lazy[node] ← self.lazy[node] + delta\n\n    function _push(node, start, end):\n        if self.lazy[node] != 0 and start < end:\n            mid ← (start + end) // 2\n            self._apply(2 * node, start, mid, self.lazy[node])\n            self._apply(2 * node + 1, mid + 1, end, self.lazy[node])\n            self.lazy[node] ← 0\n\n    function _add(node, start, end, l, r, delta):\n        if r < start or end < l: return\n        if l <= start and end <= r:\n            self._apply(node, start, end, delta)\n            return\n        self._push(node, start, end)\n        mid ← (start + end) // 2\n        self._add(2 * node, start, mid, l, r, delta)\n        self._add(2 * node + 1, mid + 1, end, l, r, delta)\n        self.tree[node] ← self.tree[2 * node] + self.tree[2 * node + 1]\n\n    function _sum(node, start, end, l, r):\n        if r < start or end < l: return 0\n        if l <= start and end <= r: return self.tree[node]\n        self._push(node, start, end)\n        mid ← (start + end) // 2\n        return self._sum(2 * node, start, mid, l, r) + self._sum(2 * node + 1, mid + 1, end, l, r)\n\n    function range_add(l, r, delta):\n        self._add(1, 0, self.n - 1, l, r, delta)\n\n    function range_sum(l, r):\n        return self._sum(1, 0, self.n - 1, l, r)",
      },
      {
        title: "First Index At Least Target From Left Bound",
        tier: "Stretch",
        goal: "Given a mutable array `arr`, support `set_val(idx, val)` and `first_at_least(l, target)` returning the smallest index `i >= l` with `arr[i] >= target` (or `-1` if none exists) in a single `O(log n)` tree descent.",
        constraints: [
          "1 <= len(arr) <= 10^5",
          "0 <= l < len(arr)",
          "Target: O(log n) per operation (no O(log^2 n) binary search wrapper)",
        ],
        examples: [
          {
            input: "arr = [2, 5, 1, 8, 4], first_at_least(2, 6), first_at_least(4, 6), set_val(4, 7), first_at_least(4, 6)",
            output: "3, -1, 4",
          },
          {
            input: "arr = [1, 4, 2], first_at_least(0, 10), set_val(1, 10), first_at_least(1, 10)",
            output: "-1, 1",
            explanation: "Root max < 10 prunes in O(1) returning -1; after set_val(1, 10), descent finds index 1.",
          },
        ],
        tasks: [
          "Store range maximums in `tree[4 * n]`.",
          "Prune immediately whenever `end < l` or `tree[node] < target` (return `-1`).",
          "At `start == end`, return `start`. Otherwise check the left child first; only descend right if the left child returns `-1`.",
        ],
        starterCode:
          "function first_at_least(tree, node, start, end, l, target):\n    // TODO: prune by end < l or tree[node] < target",
        expectedOutput: "3, -1, 4\n-1, 1",
        hint: "Checking `tree[node] < target` skips entire subtrees in `O(1)` without probing individual indices.",
        complexity: { time: "O(log n) per query/update", space: "O(n)" },
        solutionCode:
          "function first_at_least(tree, node, start, end, l, target):\n    if end < l or tree[node] < target:\n        return -1\n    if start == end:\n        return start\n    mid ← (start + end) // 2\n    left_res ← first_at_least(tree, 2 * node, start, mid, l, target)\n    if left_res != -1:\n        return left_res\n    return first_at_least(tree, 2 * node + 1, mid + 1, end, l, target)",
      },
    ],
  },
};

export const dsaM23PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m23",
  title: "Module 23 Practice Set: Range Queries",
  description:
    "Four mixed range-query challenges covering dynamic block updates, order-inversion counting, non-invertible interval peaks, and batch range credits.",
  problems: [
    {
      id: "dsa-m23-p1",
      title: "Warehouse Crate Inventory Updates",
      patternHint:
        "Partition the n bins into blocks of size B = floor(sqrt(n)) for O(1) point adjustments and O(sqrt(n)) aisle range totals (or use a 1-based prefix tree for O(log n)).",
      lessonRefId: "dsa-range-sqrt",
      goal: "A warehouse tracks item counts `bins[0..n-1]` across `n` numbered slots. Process a sequence of operations: `[\"restock\", idx, delta]` adds `delta` items to `bins[idx]`, and `[\"audit\", l, r]` outputs the total item count across `[l, r]` inclusive.",
      constraints: [
        "1 <= len(bins) <= 5 * 10^4",
        "Up to 5 * 10^4 operations",
        "Target: O(sqrt(n)) or O(log n) per audit",
      ],
      examples: [
        {
          input: "bins = [10, 4, 7, 2, 9, 5], ops = [[\"audit\", 1, 4], [\"restock\", 3, 6], [\"audit\", 1, 4]]",
          output: "[22, 28]",
          explanation: "Initially 4 + 7 + 2 + 9 = 22. Adding 6 at index 3 raises the slice sum to 28.",
        },
        {
          input: "bins = [5, 5, 5], ops = [[\"restock\", 0, -2], [\"audit\", 0, 1]]",
          output: "[8]",
        },
      ],
      tasks: [
        "Precompute block sums of size `B = max(1, floor(sqrt(n)))`.",
        "Update both `bins[idx]` and `blocks[idx // B]` in `O(1)` on `\"restock\"`.",
        "Handle same-block (`b_left == b_right`) and cross-block (`left tail + interior blocks + right tail`) sums on `\"audit\"`.",
      ],
      starterCode: "function process_warehouse(bins, ops):\n    // TODO: handle restock and audit operations",
      expectedOutput: "[22, 28]\n[8]",
      hint: "Keep the same-block guard `if b_left == b_right` so short audits like `[0, 1]` never double-count.",
      complexity: { time: "O(n + q * sqrt(n))", space: "O(sqrt(n)) extra" },
      solutionCode:
        "function process_warehouse(bins, ops):\n    n ← len(bins)\n    B ← max(1, floor(sqrt(n)))\n    blocks ← array of size (n + B - 1) // B filled with 0\n    for i from 0 to n - 1:\n        blocks[i // B] ← blocks[i // B] + bins[i]\n    out ← []\n    for op in ops:\n        if op[0] == \"restock\":\n            idx ← op[1], delta ← op[2]\n            bins[idx] ← bins[idx] + delta\n            blocks[idx // B] ← blocks[idx // B] + delta\n        else:\n            l ← op[1], r ← op[2]\n            b_left ← l // B, b_right ← r // B\n            total ← 0\n            if b_left == b_right:\n                for i from l to r: total ← total + bins[i]\n            else:\n                for i from l to (b_left + 1) * B - 1: total ← total + bins[i]\n                for b from b_left + 1 to b_right - 1: total ← total + blocks[b]\n                for i from b_right * B to r: total ← total + bins[i]\n            out.append(total)\n    return out",
    },
    {
      id: "dsa-m23-p2",
      title: "Dynamic Range Rank Inversions",
      patternHint:
        "Scan left-to-right (or right-to-left) with a 1-based Fenwick frequency table over [1..max_val] so each element queries smaller/larger prior values in O(log max_val).",
      lessonRefId: "dsa-fenwick-tree",
      goal: "Given an integer array `ranks` where `1 <= ranks[i] <= M`, return the total number of inverted pairs `(i, j)` such that `i < j` and `ranks[i] > ranks[j]`.",
      constraints: [
        "1 <= len(ranks) <= 10^5",
        "1 <= ranks[i] <= M <= 10^5",
        "Target: O(n log M) time, O(M) space",
      ],
      examples: [
        { input: "ranks = [4, 1, 3, 2], M = 4", output: "4", explanation: "Inverted pairs: (4,1), (4,3), (4,2), (3,2)." },
        { input: "ranks = [1, 2, 3, 4], M = 4", output: "0" },
      ],
      tasks: [
        "Allocate a 1-based frequency array `bit[1..M]` initialized to `0`.",
        "Walk `ranks` from right to left (`i = n - 1` down to `0`).",
        "Add `prefix_sum(bit, ranks[i] - 1)` to `inversions`, then call `add(bit, M, ranks[i], 1)`.",
      ],
      starterCode: "function count_inversions(ranks, M):\n    // TODO: count pairs i < j with ranks[i] > ranks[j]",
      expectedOutput: "4\n0",
      hint: "Every value already inserted into `bit` sits to the right of `i`, so `prefix_sum(bit, ranks[i] - 1)` counts all `j > i` with `ranks[j] < ranks[i]`.",
      complexity: { time: "O(n log M)", space: "O(M)" },
      solutionCode:
        "function add(bit, M, idx, delta):\n    while idx <= M:\n        bit[idx] ← bit[idx] + delta\n        idx ← idx + (idx & -idx)\n\nfunction prefix_sum(bit, idx):\n    total ← 0\n    while idx > 0:\n        total ← total + bit[idx]\n        idx ← idx - (idx & -idx)\n    return total\n\nfunction count_inversions(ranks, M):\n    bit ← array of size M + 1 filled with 0\n    inversions ← 0\n    for i from len(ranks) - 1 down to 0:\n        inversions ← inversions + prefix_sum(bit, ranks[i] - 1)\n        add(bit, M, ranks[i], 1)\n    return inversions",
    },
    {
      id: "dsa-m23-p3",
      title: "Live Peak Latency Monitor",
      patternHint:
        "Range max is non-invertible, so maintain a 4 * n recursive Segment Tree with max merging and -INF identity.",
      lessonRefId: "dsa-segment-tree",
      goal: "A telemetry monitor records endpoint response times `lat[0..n-1]`. Process operations `[\"set\", idx, ms]` (replacing `lat[idx]` with `ms`) and `[\"peak\", l, r]` (returning the maximum latency across `[l, r]`).",
      constraints: [
        "1 <= len(lat) <= 10^5",
        "0 <= ms <= 10^9",
        "Target: O(log n) per operation",
      ],
      examples: [
        {
          input: "lat = [12, 45, 30, 18, 52], ops = [[\"peak\", 0, 3], [\"set\", 1, 20], [\"peak\", 0, 3]]",
          output: "[45, 30]",
        },
        {
          input: "lat = [9, 4], ops = [[\"set\", 0, 2], [\"peak\", 0, 1]]",
          output: "[4]",
        },
      ],
      tasks: [
        "Build a `4 * n` tree array using `max(tree[2 * node], tree[2 * node + 1])`.",
        "Update single leaves in `O(log n)` and recompute ancestor maximums on return.",
        "Query `[l, r]` returning `-INF` on disjoint nodes and `tree[node]` on total overlap.",
      ],
      starterCode: "function monitor_latencies(lat, ops):\n    // TODO: return peak query results in O(log n) per op",
      expectedOutput: "[45, 30]\n[4]",
      hint: "Why not a prefix or Fenwick array? Replacing `45` with `20` can lower the range maximum, so you cannot invert prior prefixes.",
      complexity: { time: "O(n + q log n)", space: "O(n) (4 * n)" },
      solutionCode:
        "function build(tree, lat, node, s, e):\n    if s == e:\n        tree[node] ← lat[s]\n        return\n    mid ← (s + e) // 2\n    build(tree, lat, 2 * node, s, mid)\n    build(tree, lat, 2 * node + 1, mid + 1, e)\n    tree[node] ← max(tree[2 * node], tree[2 * node + 1])\n\nfunction update(tree, node, s, e, idx, val):\n    if s == e:\n        tree[node] ← val\n        return\n    mid ← (s + e) // 2\n    if idx <= mid: update(tree, 2 * node, s, mid, idx, val)\n    else: update(tree, 2 * node + 1, mid + 1, e, idx, val)\n    tree[node] ← max(tree[2 * node], tree[2 * node + 1])\n\nfunction query(tree, node, s, e, l, r):\n    if r < s or e < l: return -INF\n    if l <= s and e <= r: return tree[node]\n    mid ← (s + e) // 2\n    return max(query(tree, 2 * node, s, mid, l, r), query(tree, 2 * node + 1, mid + 1, e, l, r))\n\nfunction monitor_latencies(lat, ops):\n    n ← len(lat)\n    tree ← array of size 4 * n filled with -INF\n    build(tree, lat, 1, 0, n - 1)\n    out ← []\n    for op in ops:\n        if op[0] == \"set\":\n            update(tree, 1, 0, n - 1, op[1], op[2])\n        else:\n            out.append(query(tree, 1, 0, n - 1, op[1], op[2]))\n    return out",
    },
    {
      id: "dsa-m23-p4",
      title: "Batch Bonus Distribution Ledger",
      patternHint:
        "Both updates and queries span arbitrary ranges [l, r], so use a Segment Tree with lazy[] deferred range additions and (end - start + 1) scaling.",
      lessonRefId: "dsa-segment-tree",
      goal: "Manage an array of starting account balances `bal[0..n-1]`. Process `[\"credit\", l, r, amount]` (adding `amount` to every account in `[l, r]`) and `[\"total\", l, r]` (returning the combined balance across `[l, r]`).",
      constraints: [
        "1 <= len(bal) <= 10^5",
        "Up to 10^5 operations",
        "Target: O(log n) per operation",
      ],
      examples: [
        {
          input: "bal = [10, 20, 30, 40], ops = [[\"credit\", 1, 2, 5], [\"total\", 0, 2], [\"credit\", 0, 3, 10], [\"total\", 2, 3]]",
          output: "[70, 95]",
          explanation: "After credit(1,2,5): [10, 25, 35, 40] -> total(0,2) = 70. After credit(0,3,10): [20, 35, 45, 50] -> total(2,3) = 95.",
        },
        {
          input: "bal = [0, 0, 0], ops = [[\"credit\", 0, 2, 4], [\"total\", 1, 1]]",
          output: "[4]",
        },
      ],
      tasks: [
        "Build `tree[4 * n]` and initialize `lazy[4 * n]` to `0`.",
        "On total overlap in `credit`, apply `(end - start + 1) * amount` to `tree[node]` and `amount` to `lazy[node]`.",
        "Call `push_down` before descending into children in both `credit` and `total`.",
      ],
      starterCode: "function process_ledger(bal, ops):\n    // TODO: O(log n) batch range credit and range total",
      expectedOutput: "[70, 95]\n[4]",
      hint: "On `bal = [0, 0, 0]`, `credit(0, 2, 4)` tags only root node `1`; querying `total(1, 1)` triggers `push_down` so leaf `[1]` receives `+4`.",
      complexity: { time: "O(n + q log n)", space: "O(n) (8 * n)" },
      solutionCode:
        "function build_sum(tree, bal, node, s, e):\n    if s == e:\n        tree[node] ← bal[s]\n        return\n    mid ← (s + e) // 2\n    build_sum(tree, bal, 2 * node, s, mid)\n    build_sum(tree, bal, 2 * node + 1, mid + 1, e)\n    tree[node] ← tree[2 * node] + tree[2 * node + 1]\n\nfunction apply(tree, lazy, node, s, e, delta):\n    tree[node] ← tree[node] + (e - s + 1) * delta\n    lazy[node] ← lazy[node] + delta\n\nfunction push(tree, lazy, node, s, e):\n    if lazy[node] != 0 and s < e:\n        mid ← (s + e) // 2\n        apply(tree, lazy, 2 * node, s, mid, lazy[node])\n        apply(tree, lazy, 2 * node + 1, mid + 1, e, lazy[node])\n        lazy[node] ← 0\n\nfunction range_add(tree, lazy, node, s, e, l, r, delta):\n    if r < s or e < l: return\n    if l <= s and e <= r:\n        apply(tree, lazy, node, s, e, delta)\n        return\n    push(tree, lazy, node, s, e)\n    mid ← (s + e) // 2\n    range_add(tree, lazy, 2 * node, s, mid, l, r, delta)\n    range_add(tree, lazy, 2 * node + 1, mid + 1, e, l, r, delta)\n    tree[node] ← tree[2 * node] + tree[2 * node + 1]\n\nfunction range_sum(tree, lazy, node, s, e, l, r):\n    if r < s or e < l: return 0\n    if l <= s and e <= r: return tree[node]\n    push(tree, lazy, node, s, e)\n    mid ← (s + e) // 2\n    return range_sum(tree, lazy, 2 * node, s, mid, l, r) + range_sum(tree, lazy, 2 * node + 1, mid + 1, e, l, r)\n\nfunction process_ledger(bal, ops):\n    n ← len(bal)\n    tree ← array of size 4 * n filled with 0\n    lazy ← array of size 4 * n filled with 0\n    build_sum(tree, bal, 1, 0, n - 1)\n    out ← []\n    for op in ops:\n        if op[0] == \"credit\":\n            range_add(tree, lazy, 1, 0, n - 1, op[1], op[2], op[3])\n        else:\n            out.append(range_sum(tree, lazy, 1, 0, n - 1, op[1], op[2]))\n    return out",
    },
  ],
};
