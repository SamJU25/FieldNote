import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM15Lessons: Record<string, LessonContent> = {
  "dsa-heap-internals": {
    lessonId: "dsa-heap-internals",
    subtitle:
      "Pack a complete binary tree into a flat array with index arithmetic, maintain heap order in O(log n) via sift-up and sift-down, build heaps in O(n) with Floyd's algorithm, and sort in-place with O(1) extra space.",
    intro: {
      heading: "Binary Heaps: Complete Trees Stored in Flat Arrays",
      explanation: [
        "Pulling the smallest element repeatedly from a changing collection exposes a costly tradeoff in plain arrays: an unsorted array inserts in `O(1)` yet scans all `n` items (`O(n)`) to find the minimum, while a sorted array reads the minimum in `O(1)` yet shifts `O(n)` elements on insertion or `pop(0)`. Building a priority queue by pushing `n` items one by one also wastes `O(n log n)` work when bottom-up heapify finishes in `O(n)`.",
        "A **binary heap** resolves both bottlenecks inside one contiguous array using two invariants: the **shape invariant** (every level fills left-to-right with zero gaps, mapping `parent = (i - 1) // 2`) and the **heap-order invariant** (`heap[parent] <= heap[child]` in a Min-Heap). Peek runs in `O(1)`, push (**sift-up**) and pop (**sift-down**) run in `O(log n)`, and **Floyd's algorithm** builds the heap in `O(n)`.",
      ],
      analogy:
        "Picture an emergency triage desk where patients are not sorted alphabetically or ranked end-to-end. The only rule is that the person at the front of each small chain outranks the two people directly behind them. Whenever a new urgent case arrives, they only compare upward along their own short chain (`O(log n)` hops) instead of reshuffling the whole waiting room.",
      realWorldUses: [
        "Operating system task schedulers picking the highest-priority runnable thread in `O(log n)` time",
        "Event-driven simulation loops and worker pools always advancing to the earliest deadline or timestamp",
      ],
    },
    sections: [
      {
        heading: "Flat array index math and the two heap invariants",
        paragraphs: [
          "Because a complete binary tree fills level by level from left to right with no missing slots, storing nodes in a contiguous array `heap[0..n-1]` makes `left` and `right` node pointers unnecessary. For any 0-based index `i`, its parent sits at `(i - 1) // 2`, its left child at `2 * i + 1`, and its right child at `2 * i + 2`.",
          "In a **Min-Heap**, `heap[0]` is always the global minimum because every path downward is non-decreasing. Note that siblings (`heap[1]` and `heap[2]`) have no ordering requirement between each other: the second-smallest element can sit at either index `1` or index `2`. If your language only provides a Min-Heap, storing negated numeric keys `-x` gives Max-Heap behavior.",
        ],
        code: [
          "function parent(i):",
          "    return (i - 1) // 2",
          "",
          "function left_child(i):",
          "    return 2 * i + 1",
          "",
          "function right_child(i):",
          "    return 2 * i + 2",
          "",
          "function peek_min(heap):",
          "    if len(heap) == 0:",
          "        throw Error(\"empty heap\")",
          "    return heap[0]",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Priority Queue backing structures compared",
          headers: ["Operation", "Unsorted Array", "Sorted Array", "Binary Min-Heap"],
          rows: [
            ["Peek minimum", "O(n)", "O(1)", "O(1)"],
            ["Push (insert)", "O(1) amortized", "O(n) shift", "O(log n)"],
            ["Pop minimum", "O(n) scan + swap", "O(1) from end / O(n) from front", "O(log n)"],
            ["Build from n items", "O(n)", "O(n log n) sort", "O(n) bottom-up"],
            ["Extra pointer memory", "0", "0", "0 (contiguous array)"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "KEY IDEA",
          text: "A binary heap is only partially ordered: every parent dominates its children, while siblings and nodes across branches stay unordered. Giving up full sorting is exactly what drops push and pop from `O(n)` down to `O(log n)`.",
        },
      },
      {
        heading: "Push (sift-up) and Pop-Min (sift-down) in O(log n)",
        paragraphs: [
          "To push a new value `x`, append `x` at the end of the array (index `n - 1`) to preserve the complete-tree shape invariant, then run **sift-up**: while `i > 0` and `heap[i] < heap[parent(i)]`, swap the node with its parent and move `i` up. Because a complete tree of `n` nodes has height `floor(log2 n)`, sift-up performs at most `O(log n)` swaps.",
          "To pop the minimum, never delete `heap[0]` and shift `n - 1` items left (`O(n)`). Instead, read `heap[0]`, move the very last element `heap[n - 1]` into `heap[0]`, shrink the array by one, and run **sift-down**: inspect `left = 2 * i + 1` and `right = 2 * i + 2`, find the **smaller** existing child, and swap if that child is smaller than `heap[i]`. For `[10, 3, 7]`, swapping `10` with its larger child `7` gives `[7, 3, 10]` (broken: `7 > 3`), while picking smaller child `3` gives `[3, 10, 7]` (valid).",
        ],
        code: [
          "function heap_push(heap, x):",
          "    heap.append(x)",
          "    sift_up(heap, len(heap) - 1)",
          "",
          "function sift_up(heap, i):",
          "    while i > 0:",
          "        p ← (i - 1) // 2",
          "        if heap[i] >= heap[p]:",
          "            break",
          "        swap(heap, i, p)",
          "        i ← p",
          "",
          "function heap_pop(heap):",
          "    min_val ← heap[0]",
          "    last ← heap.pop_back()",
          "    if len(heap) > 0:",
          "        heap[0] ← last",
          "        sift_down(heap, 0, len(heap))",
          "    return min_val",
          "",
          "function sift_down(heap, i, n):",
          "    while 2 * i + 1 < n:",
          "        left ← 2 * i + 1",
          "        right ← 2 * i + 2",
          "        best ← left",
          "        if right < n and heap[right] < heap[left]:",
          "            best ← right",
          "        if heap[i] <= heap[best]:",
          "            break",
          "        swap(heap, i, best)",
          "        i ← best",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Sift-Up vs Sift-Down mechanics in a Min-Heap",
          headers: ["Property", "Sift-Up (Push)", "Sift-Down (Pop / Heapify)"],
          rows: [
            ["Starting index", "Last slot (n - 1)", "Root (0) or internal node i"],
            ["Direction", "Bottom -> Up toward index 0", "Top -> Down toward leaves"],
            ["Comparisons per level", "1 (with parent)", "Up to 2 (compare children, then parent)"],
            ["Stop condition", "i == 0 or heap[i] >= heap[p]", "No children or heap[i] <= min_child"],
            ["Worst-case time", "O(log n)", "O(log n)"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "WATCH OUT",
          text: "In `sift_down` on a Min-Heap, always compare with the smaller of the two children. Swapping with the larger child would place a larger value above its smaller sibling and break heap order immediately.",
        },
      },
      {
        heading: "Floyd's O(n) bottom-up heapify and O(1)-space Heap Sort",
        paragraphs: [
          "Building a heap by calling `heap_push` `n` times from an empty array costs `O(n log n)` because half of all nodes sit at the bottom level and can sift up `log n` levels. **Floyd's bottom-up heapify** flips the work: treat the input array as an existing complete tree, skip all leaves (indices `n // 2` through `n - 1` are trivial 1-node heaps), and call `sift_down` backward from `(n // 2) - 1` down to `0`.",
          "Because `n / 2` leaves move 0 steps, `n / 4` nodes move at most 1 step, `n / 8` move at most 2 steps, and so on, the total work is bounded by `n * sum(h / 2^(h+1)) <= n`, proving **O(n)** build time! **Heap Sort** uses this directly to sort an array in-place in `O(n log n)` time and `O(1)` auxiliary space: first heapify into a **Max-Heap** in `O(n)`, then repeatedly swap `arr[0]` (the largest remaining item) into `arr[end]` and shrink the active heap boundary `end` from `n - 1` down to `1`.",
        ],
        code: [
          "function build_min_heap(arr):",
          "    n ← len(arr)",
          "    for i from (n // 2) - 1 down to 0:",
          "        sift_down(arr, i, n)",
          "",
          "function heap_sort_asc(arr):",
          "    n ← len(arr)",
          "    for i from (n // 2) - 1 down to 0:",
          "        sift_down_max(arr, i, n)",
          "    for end from n - 1 down to 1:",
          "        swap(arr, 0, end)",
          "        sift_down_max(arr, 0, end)",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Heap construction and sorting tradeoffs",
          headers: ["Algorithm", "Time", "Extra Space", "Notes"],
          rows: [
            ["Repeated heap_push (n times)", "O(n log n)", "O(1) or O(n)", "Leaves pay the steepest sift-up cost"],
            ["Floyd bottom-up heapify", "O(n)", "O(1)", "Leaves do 0 work; sum of heights converges to linear"],
            ["Heap Sort (Max-Heap)", "O(n log n)", "O(1)", "Guaranteed worst-case O(n log n), in-place, unstable"],
            ["Merge Sort (M11)", "O(n log n)", "O(n)", "Stable, better cache locality, needs O(n) buffer"],
          ],
          highlightCol: 1,
        },
        visual: {
          kind: "dsa-array",
          caption: "In-place Heap Sort flat array: Max-Heap prefix [0..end-1] shrinks as locked suffix grows rightward",
          trays: [
            {
              label: "1. Initial Max-Heap [0..4]",
              highlightRange: [0, 4],
              cells: [
                { id: "hm15", value: "15", index: 0, state: "active" },
                { id: "hm11", value: "11", index: 1 },
                { id: "hm9", value: "9", index: 2 },
                { id: "hm7", value: "7", index: 3 },
                { id: "hm4", value: "4", index: 4, state: "pivot" },
              ],
              pointers: [
                { index: 0, label: "max", tone: "coral" },
                { index: 4, label: "end=4", tone: "accent" },
              ],
            },
            {
              label: "2. After swap(arr, 0, 4) + sift_down_max(arr, 0, 4)",
              highlightRange: [0, 3],
              cells: [
                { id: "hn11", value: "11", index: 0, state: "active" },
                { id: "hn7", value: "7", index: 1 },
                { id: "hn9", value: "9", index: 2 },
                { id: "hn4", value: "4", index: 3 },
                { id: "hn15", value: "15", index: 4, state: "done" },
              ],
              pointers: [
                { index: 0, label: "next max", tone: "coral" },
                { index: 4, label: "locked", tone: "ok" },
              ],
            },
          ],
        },
        callout: {
          kind: "RULE OF THUMB",
          text: "Use a Max-Heap when sorting ascending with Heap Sort: each pop swaps the largest element at index `0` directly to its final sorted position at `arr[end]`.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From O(n log n) Push-Build to O(log n) Sift-Down & O(n) Floyd Heapify",
      steps: [
        {
          label: "Step 1: Push via flat append + sift_up (O(log n))",
          explanation: "Appending to the tail preserves the complete-tree shape; bubbling up restores parent-child order.",
          code: [
            "function heap_push(heap, x):",
            "    heap.append(x)",
            "    i ← len(heap) - 1",
            "    while i > 0 and heap[i] < heap[(i - 1) // 2]:",
            "        swap(heap, i, (i - 1) // 2)",
            "        i ← (i - 1) // 2",
          ],
          activeLines: [4, 5],
          output: "Building n items via n pushes -> O(n log n)",
        },
        {
          label: "Step 2: Pop root by swapping last leaf to index 0 + sift_down",
          explanation: "Moving `heap[-1]` to `heap[0]` avoids an `O(n)` front shift, and picking the smaller child restores order.",
          code: [
            "function heap_pop(heap):",
            "    min_val ← heap[0]; last ← heap.pop_back()",
            "    if len(heap) > 0:",
            "        heap[0] ← last",
            "        sift_down(heap, 0, len(heap))",
            "    return min_val",
          ],
          activeLines: [4, 5],
          output: "pop_min -> O(log n), zero array shifts",
        },
        {
          label: "Step 3: Floyd's bottom-up heapify (O(n) total work)",
          explanation: "Skipping leaves `[n//2 .. n-1]` and running `sift_down` from `(n // 2) - 1` down to `0` builds the heap in linear time.",
          code: [
            "function build_min_heap(arr):",
            "    n ← len(arr)",
            "    for i from (n // 2) - 1 down to 0:",
            "        sift_down(arr, i, n)",
          ],
          activeLines: [3, 4],
          output: "build_min_heap([9, 5, 6, 2, 3]) -> [2, 3, 6, 5, 9] in O(n)",
        },
      ],
    },
    walkthrough: {
      title: "Trace push sift-up, pop-min sift-down, and array mapping",
      layout: "visual-first",
      steps: [
        {
          title: "Complete Min-Heap as tree and flat array",
          tag: "MEMORY",
          explanation: [
            "Start with the 6-element Min-Heap `[4, 7, 9, 12, 15, 11]`.",
            "Node `9` at index `2` has left child `11` at `2*2 + 1 = 5` and parent `4` at `(2 - 1) // 2 = 0`.",
          ],
          code: [
            "heap ← [4, 7, 9, 12, 15, 11]",
            "heap_push(heap, 2)",
            "heap_pop(heap)",
          ],
          activeLines: [1],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "import heapq",
              "heap = [4, 7, 9, 12, 15, 11]; heapq.heapify(heap)   # O(n)",
              "heapq.heappush(heap, 2); smallest = heapq.heappop(heap)",
            ],
          },
          state: [
            { name: "heap", value: "[4, 7, 9, 12, 15, 11]" },
            { name: "len(heap)", value: "6" },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Each node index i maps to parent (i-1)//2 and children 2i+1, 2i+2",
            nodes: [
              { id: "n0", label: "4", x: 50, y: 12, badge: "i=0" },
              { id: "n1", label: "7", x: 26, y: 48, badge: "i=1" },
              { id: "n2", label: "9", x: 74, y: 48, badge: "i=2" },
              { id: "n3", label: "12", x: 14, y: 86, badge: "i=3" },
              { id: "n4", label: "15", x: 38, y: 86, badge: "i=4" },
              { id: "n5", label: "11", x: 62, y: 86, badge: "i=5" },
            ],
            edges: [
              { from: "n0", to: "n1", directed: true },
              { from: "n0", to: "n2", directed: true },
              { from: "n1", to: "n3", directed: true },
              { from: "n1", to: "n4", directed: true },
              { from: "n2", to: "n5", directed: true },
            ],
          },
        },
        {
          title: "Append 2 at index 6 and swap upward with parent 9 at index 2",
          tag: "TRACE",
          explanation: [
            "`heap_push(heap, 2)` appends `2` at index `6` (`p = (6 - 1) // 2 = 2`, `heap[2] = 9`).",
            "Since `2 < 9`, we swap indices `6` and `2`, placing `2` at `i = 2` and `9` at `i = 6`.",
          ],
          code: [
            "heap.append(2)            // i = 6",
            "p ← (6 - 1) // 2          // p = 2 (val 9)",
            "if heap[6] < heap[2]: swap(heap, 6, 2)",
            "i ← 2",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "heap", value: "[4, 7, 2, 12, 15, 11, 9]", changed: true },
            { name: "i", value: "2", changed: true },
            { name: "swapped", value: "idx 6 <-> idx 2 (2 < 9)", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "After first swap: 2 sits at i=2 and 9 drops to i=6",
            nodes: [
              { id: "n0", label: "4", x: 50, y: 12, badge: "i=0" },
              { id: "n1", label: "7", x: 26, y: 48, badge: "i=1" },
              { id: "n2", label: "2", x: 74, y: 48, badge: "i=2", state: "active" },
              { id: "n3", label: "12", x: 14, y: 86, badge: "i=3" },
              { id: "n4", label: "15", x: 38, y: 86, badge: "i=4" },
              { id: "n5", label: "11", x: 62, y: 86, badge: "i=5" },
              { id: "n6", label: "9", x: 86, y: 86, badge: "i=6", state: "visited" },
            ],
            edges: [
              { from: "n0", to: "n1", directed: true },
              { from: "n0", to: "n2", directed: true },
              { from: "n1", to: "n3", directed: true },
              { from: "n1", to: "n4", directed: true },
              { from: "n2", to: "n5", directed: true },
              { from: "n2", to: "n6", directed: true, state: "active" },
            ],
          },
        },
        {
          title: "Sift 2 up to root index 0",
          tag: "TRACE",
          explanation: [
            "Now `2` sits at `i = 2` with parent `p = (2 - 1) // 2 = 0` (`heap[0] = 4`).",
            "Because `2 < 4`, swap indices `2` and `0` so `2` reaches `i = 0` and sift-up stops.",
          ],
          code: [
            "p ← (2 - 1) // 2          // p = 0 (val 4)",
            "if heap[2] < heap[0]: swap(heap, 2, 0)",
            "i ← 0                     // loop ends",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "heap", value: "[2, 7, 4, 12, 15, 11, 9]", changed: true },
            { name: "i", value: "0", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Sift-up restores Min-Heap invariant in 2 swaps (log2 7 approx 2.8)",
            nodes: [
              { id: "n0", label: "2", x: 50, y: 12, badge: "i=0", state: "active" },
              { id: "n1", label: "7", x: 26, y: 48, badge: "i=1" },
              { id: "n2", label: "4", x: 74, y: 48, badge: "i=2", state: "visited" },
              { id: "n3", label: "12", x: 14, y: 86, badge: "i=3" },
              { id: "n4", label: "15", x: 38, y: 86, badge: "i=4" },
              { id: "n5", label: "11", x: 62, y: 86, badge: "i=5" },
              { id: "n6", label: "9", x: 86, y: 86, badge: "i=6" },
            ],
            edges: [
              { from: "n0", to: "n1", directed: true },
              { from: "n0", to: "n2", directed: true, state: "active" },
              { from: "n1", to: "n3", directed: true },
              { from: "n1", to: "n4", directed: true },
              { from: "n2", to: "n5", directed: true },
              { from: "n2", to: "n6", directed: true },
            ],
          },
        },
        {
          title: "Pop minimum 2 by replacing root with last element 9",
          tag: "TRACE",
          explanation: [
            "`heap_pop` saves `min_val = 2`, pops `9` from the back (`i = 6`), and writes `9` into `heap[0]`.",
            "Now `9` at `i = 0` is larger than both children (`left = 7` at `i = 1`, `right = 4` at `i = 2`).",
          ],
          code: [
            "min_val ← heap[0]         // 2",
            "last ← heap.pop_back()    // 9",
            "heap[0] ← last",
            "sift_down(heap, 0, 6)",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "min_val", value: "2", changed: true },
            { name: "heap[0]", value: "9", changed: true },
            { name: "len(heap)", value: "6", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Last element 9 moves to root; sift-down compares children 7 and 4",
            nodes: [
              { id: "n0", label: "9", x: 50, y: 12, badge: "i=0", state: "active" },
              { id: "n1", label: "7", x: 26, y: 48, badge: "L=7" },
              { id: "n2", label: "4", x: 74, y: 48, badge: "R=4 (min)", state: "queued" },
              { id: "n3", label: "12", x: 14, y: 86, badge: "i=3" },
              { id: "n4", label: "15", x: 38, y: 86, badge: "i=4" },
              { id: "n5", label: "11", x: 62, y: 86, badge: "i=5" },
            ],
            edges: [
              { from: "n0", to: "n1", directed: true },
              { from: "n0", to: "n2", directed: true, state: "active" },
              { from: "n1", to: "n3", directed: true },
              { from: "n1", to: "n4", directed: true },
              { from: "n2", to: "n5", directed: true },
            ],
          },
        },
        {
          title: "Sift 9 down past smaller child 4 to restore Min-Heap",
          tag: "CHECK",
          explanation: [
            "Picking `best = 2` (`4 < 7`) and swapping `heap[0]` with `heap[2]` puts `4` at the root and `9` at `i = 2`.",
            "At `i = 2`, the only child is `11` at `i = 5`. Since `9 <= 11`, sift-down stops and `[4, 7, 9, 12, 15, 11]` is a valid Min-Heap.",
          ],
          code: [
            "best ← 2                  // heap[2]=4 < heap[1]=7",
            "swap(heap, 0, 2)",
            "i ← 2                     // child heap[5]=11 >= 9 -> stop",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "heap", value: "[4, 7, 9, 12, 15, 11]", changed: true },
            { name: "returned", value: "2" },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Final valid Min-Heap: 4 at root, 9 settles at i=2 above child 11 (i=5)",
            nodes: [
              { id: "n0", label: "4", x: 50, y: 12, badge: "min (i=0)", state: "visited" },
              { id: "n1", label: "7", x: 26, y: 48, badge: "i=1" },
              { id: "n2", label: "9", x: 74, y: 48, badge: "i=2", state: "active" },
              { id: "n3", label: "12", x: 14, y: 86, badge: "i=3" },
              { id: "n4", label: "15", x: 38, y: 86, badge: "i=4" },
              { id: "n5", label: "11", x: 62, y: 86, badge: "i=5", state: "queued" },
            ],
            edges: [
              { from: "n0", to: "n1", directed: true },
              { from: "n0", to: "n2", directed: true, state: "active" },
              { from: "n1", to: "n3", directed: true },
              { from: "n1", to: "n4", directed: true },
              { from: "n2", to: "n5", directed: true, state: "active" },
            ],
          },
        },
        {
          title: "Heap Sort step 1: build Max-Heap and swap root 15 to end",
          tag: "PATTERN",
          explanation: [
            "To sort `[11, 4, 15, 7, 9]` ascending in `O(1)` extra space, first Floyd-heapify into Max-Heap `[15, 11, 9, 7, 4]`.",
            "Then swap `arr[0]` (`15`) with `arr[4]` (`4`) to lock `15` at its final sorted slot, and call `sift_down_max(arr, 0, 4)`.",
          ],
          code: [
            "build_max_heap(arr)           // [15, 11, 9, 7, 4]",
            "swap(arr, 0, 4)               // [4, 11, 9, 7 | 15]",
            "sift_down_max(arr, 0, 4)      // [11, 7, 9, 4 | 15]",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Initial Max-Heap", value: "[15, 11, 9, 7, 4]" },
            { name: "After end=4", value: "[11, 7, 9, 4 | 15]", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Max-Heap tree [11, 7, 9, 4] covers indices [0..3]; arr[4] = 15 locks as sorted",
            nodes: [
              { id: "h0", label: "11", x: 50, y: 14, badge: "i=0 max", state: "active" },
              { id: "h1", label: "7", x: 26, y: 50, badge: "i=1" },
              { id: "h2", label: "9", x: 74, y: 50, badge: "i=2" },
              { id: "h3", label: "4", x: 14, y: 86, badge: "i=3" },
              { id: "h4", label: "15", x: 38, y: 86, badge: "i=4 locked", state: "visited" },
            ],
            edges: [
              { from: "h0", to: "h1", directed: true },
              { from: "h0", to: "h2", directed: true },
              { from: "h1", to: "h3", directed: true },
            ],
          },
        },
        {
          title: "Heap Sort step 2: shrink active prefix as largest items lock in",
          tag: "PATTERN",
          explanation: [
            "Next iteration (`end = 3`) swaps `arr[0]` (`11`) with `arr[3]` (`4`), locks `11` at index `3`, and sifts `[0..2]` into `[9, 7, 4]`.",
            "Repeating down to `end = 1` finishes `[4, 7, 9, 11, 15]` in-place with `O(1)` extra space.",
          ],
          code: [
            "for end from n - 1 down to 1:",
            "    swap(arr, 0, end)",
            "    sift_down_max(arr, 0, end)",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "active heap", value: "[0..2] ([9, 7, 4])", changed: true },
            { name: "sorted suffix", value: "[11, 15]", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Max-Heap [9, 7, 4] shrinks to [0..2] while arr[3]=11 and arr[4]=15 stay locked at the tail",
            nodes: [
              { id: "h0", label: "9", x: 50, y: 14, badge: "i=0 max", state: "active" },
              { id: "h1", label: "7", x: 26, y: 50, badge: "i=1" },
              { id: "h2", label: "4", x: 74, y: 50, badge: "i=2" },
              { id: "h3", label: "11", x: 14, y: 86, badge: "i=3 locked", state: "visited" },
              { id: "h4", label: "15", x: 38, y: 86, badge: "i=4 locked", state: "visited" },
            ],
            edges: [
              { from: "h0", to: "h1", directed: true },
              { from: "h0", to: "h2", directed: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Searching an arbitrary value in a heap is O(n), not O(log n)",
        detail:
          "Unlike a Binary Search Tree, a heap makes no left-vs-right ordering promise. A value larger than the left child can still live deep in the right subtree, so arbitrary lookup or deletion by value scans `O(n)` slots unless paired with an auxiliary index map.",
        code: "// Min-Heap [2, 10, 4, 20, 30, 5, 6]: 5 is in the right subtree even though 5 < 10!",
      },
      {
        title: "Swapping with the wrong child in sift-down",
        detail:
          "Always verify `right < n` before reading `heap[right]`, and pick the smaller child in a Min-Heap (or larger child in a Max-Heap). Comparing against only `left` or swapping with the larger child breaks the parent-child invariant.",
        code: "best ← left\nif right < n and heap[right] < heap[left]:\n    best ← right",
      },
      {
        title: "Negating MIN_INT when simulating a Max-Heap",
        detail:
          "In 32-bit or 64-bit signed integers, `-(-2^31)` overflows back to `-2^31`. Use a custom comparator or wider integer type when values can hit the signed minimum bound.",
        code: "// Safe custom comparator instead of unary minus on 32-bit ints\ncompare(a, b) := (b - a)  // or explicit a > b",
      },
      {
        title: "Heap Sort is unstable and uses a Max-Heap for ascending output",
        detail:
          "Swapping `arr[0]` to the back of the array can jump equal values over each other, so Heap Sort is not stable. Also remember to build a Max-Heap (not Min-Heap) for ascending in-place sorting.",
      },
    ],
    practiceTask: {
      title: "Implement Core Min-Heap Operations",
      tier: "Warmup",
      goal: "Write `sift_up`, `heap_push`, and `heap_pop` on a 0-based dynamic array Min-Heap.",
      constraints: [
        "0 <= n <= 10^5",
        "Each push and pop must run in O(log n) time",
        "O(1) auxiliary space beyond the heap array",
      ],
      examples: [
        { input: "push(5), push(2), push(8), pop(), push(1), pop()", output: "2, 1" },
        { input: "push(4), pop(), push(9), push(3), pop()", output: "4, 3", explanation: "Popping the sole element empties the array before later pushes." },
      ],
      tasks: [
        "Append to the end in `heap_push` and bubble upward via `(i - 1) // 2`.",
        "Move the last element to `heap[0]` in `heap_pop` and sift down past the smaller child.",
      ],
      starterCode:
        "function heap_push(heap, x):\n    // TODO\n\nfunction heap_pop(heap):\n    // TODO",
      expectedOutput: "2, 1\n4, 3",
      hint: "Handle the 1-element edge case in `heap_pop`: when `pop_back()` empties the array, do not assign `heap[0] = last`.",
      complexity: { time: "O(log n) per op", space: "O(1) extra" },
      solutionCode:
        "function heap_push(heap, x):\n    heap.append(x)\n    i ← len(heap) - 1\n    while i > 0:\n        p ← (i - 1) // 2\n        if heap[i] >= heap[p]:\n            break\n        swap(heap, i, p)\n        i ← p\n\nfunction heap_pop(heap):\n    res ← heap[0]\n    last ← heap.pop_back()\n    if len(heap) > 0:\n        heap[0] ← last\n        i ← 0\n        n ← len(heap)\n        while 2 * i + 1 < n:\n            left ← 2 * i + 1\n            right ← 2 * i + 2\n            best ← left\n            if right < n and heap[right] < heap[left]:\n                best ← right\n            if heap[i] <= heap[best]:\n                break\n            swap(heap, i, best)\n            i ← best\n    return res",
    },
    practiceChallenges: [
      {
        title: "Implement Core Min-Heap Operations",
        tier: "Warmup",
        goal: "Write `sift_up`, `heap_push`, and `heap_pop` on a 0-based dynamic array Min-Heap.",
        constraints: [
          "0 <= n <= 10^5",
          "Each push and pop must run in O(log n) time",
          "O(1) auxiliary space beyond the heap array",
        ],
        examples: [
          { input: "push(5), push(2), push(8), pop(), push(1), pop()", output: "2, 1" },
          { input: "push(4), pop(), push(9), push(3), pop()", output: "4, 3", explanation: "Handles popping down to an empty heap and pushing again." },
        ],
        tasks: [
          "Append `x` at the tail and swap upward with `p = (i - 1) // 2` while `heap[i] < heap[p]`.",
          "Move the last item to `heap[0]` in `heap_pop` and sift down through the smaller child.",
        ],
        starterCode:
          "function heap_push(heap, x):\n    // TODO\n\nfunction heap_pop(heap):\n    // TODO",
        expectedOutput: "2, 1\n4, 3",
        hint: "Guard `if len(heap) > 0:` before assigning `heap[0] = last` after popping the last item.",
        complexity: { time: "O(log n) per op", space: "O(1) extra" },
        solutionCode:
          "function heap_push(heap, x):\n    heap.append(x)\n    i ← len(heap) - 1\n    while i > 0:\n        p ← (i - 1) // 2\n        if heap[i] >= heap[p]:\n            break\n        swap(heap, i, p)\n        i ← p\n\nfunction heap_pop(heap):\n    res ← heap[0]\n    last ← heap.pop_back()\n    if len(heap) > 0:\n        heap[0] ← last\n        i ← 0\n        n ← len(heap)\n        while 2 * i + 1 < n:\n            left ← 2 * i + 1\n            right ← 2 * i + 2\n            best ← left\n            if right < n and heap[right] < heap[left]:\n                best ← right\n            if heap[i] <= heap[best]:\n                break\n            swap(heap, i, best)\n            i ← best\n    return res",
      },
      {
        title: "Build a Min-Heap in Linear O(n) Time",
        tier: "Core",
        goal: "Given an arbitrary integer array `arr`, transform `arr` in-place into a valid Min-Heap using Floyd's bottom-up algorithm in `O(n)` time.",
        constraints: ["0 <= len(arr) <= 10^5", "In-place mutation required", "Target: O(n) time, O(1) space"],
        examples: [
          { input: "arr = [9, 5, 6, 2, 3]", output: "[2, 3, 6, 5, 9]" },
          { input: "arr = [5, 4, 3, 2, 1]", output: "[1, 2, 3, 5, 4]", explanation: "Floyd's sift-down from i=1 swaps 4 with 1, then i=0 pushes 5 down via 1 and 2." },
        ],
        tasks: [
          "Write `sift_down(arr, i, n)` picking the smaller of `2i + 1` and `2i + 2`.",
          "Loop `i` from `(n // 2) - 1` down to `0` calling `sift_down(arr, i, n)`.",
        ],
        starterCode: "function build_min_heap(arr):\n    // TODO: Floyd's O(n) bottom-up heapify",
        expectedOutput: "[2, 3, 6, 5, 9]\n[1, 2, 3, 5, 4]",
        hint: "Indices `n // 2` through `n - 1` have `2 * i + 1 >= n`, so they are already leaf heaps.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "function sift_down(arr, i, n):\n    while 2 * i + 1 < n:\n        left ← 2 * i + 1\n        right ← 2 * i + 2\n        best ← left\n        if right < n and arr[right] < arr[left]:\n            best ← right\n        if arr[i] <= arr[best]:\n            break\n        swap(arr, i, best)\n        i ← best\n\nfunction build_min_heap(arr):\n    n ← len(arr)\n    for i from (n // 2) - 1 down to 0:\n        sift_down(arr, i, n)",
      },
      {
        title: "In-Place Heap Sort in O(1) Extra Space",
        tier: "Stretch",
        goal: "Sort an integer array `arr` in ascending order using `O(n log n)` worst-case time and `O(1)` auxiliary space.",
        constraints: ["0 <= len(arr) <= 10^5", "Do not allocate a merge buffer", "Target: O(n log n) time, O(1) space"],
        examples: [
          { input: "arr = [4, 10, 3, 5, 1]", output: "[1, 3, 4, 5, 10]" },
          { input: "arr = [7, 2, 7, 1]", output: "[1, 2, 7, 7]" },
        ],
        tasks: [
          "Heapify `arr` into a Max-Heap using `sift_down_max(arr, i, n)` from `(n // 2) - 1` down to `0`.",
          "For `end` from `n - 1` down to `1`, swap `arr[0]` with `arr[end]` and sift down index `0` within size `end`.",
        ],
        starterCode: "function heap_sort(arr):\n    // TODO: Max-Heapify then extract maximums to arr[end]",
        expectedOutput: "[1, 3, 4, 5, 10]\n[1, 2, 7, 7]",
        hint: "Passing `end` as the heap size boundary to `sift_down_max` prevents the sift from touching already-sorted values at `arr[end..n-1]`.",
        complexity: { time: "O(n log n)", space: "O(1)" },
        solutionCode:
          "function sift_down_max(arr, i, n):\n    while 2 * i + 1 < n:\n        left ← 2 * i + 1\n        right ← 2 * i + 2\n        best ← left\n        if right < n and arr[right] > arr[left]:\n            best ← right\n        if arr[i] >= arr[best]:\n            break\n        swap(arr, i, best)\n        i ← best\n\nfunction heap_sort(arr):\n    n ← len(arr)\n    for i from (n // 2) - 1 down to 0:\n        sift_down_max(arr, i, n)\n    for end from n - 1 down to 1:\n        swap(arr, 0, end)\n        sift_down_max(arr, 0, end)",
      },
    ],
  },

  "dsa-heap-top-k": {
    lessonId: "dsa-heap-top-k",
    subtitle:
      "Use a bounded size-k heap to select Top-K items in O(n log k), combine M06 Hash Maps with heaps to rank frequencies, and merge k sorted streams from M12 in O(N log k).",
    intro: {
      heading: "Top-K Selection and K-Way Merge",
      explanation: [
        "Sorting an entire `1,000,000`-item dataset in `O(N log N)` time just to extract the top `10` elements wastes roughly `20x` more comparisons and forces you to buffer all `N` elements in memory upfront—which fails outright on continuous data streams.",
        "Keeping a **Min-Heap capped at size `k`** holds only the top `k` candidates seen so far, dropping time to `O(N log k)` and memory to `O(k)`. Pairing an **M06 Hash Map** with a size-`k` heap ranks **Top K Frequent Elements** in `O(n + m log k)`, and holding one active head per list merges **k sorted linked lists** in `O(N log k)`.",
      ],
      analogy:
        "A VIP lounge with `k` seats only needs the doorman to watch the lowest-scoring guest inside. When a new guest walks up, the doorman compares them solely against that weakest seated guest: if they score lower, reject them immediately in `O(1)`; if higher, evict the weakest seated guest and admit the newcomer in `O(log k)`.",
      realWorldUses: [
        "Maintaining live top-k leaderboards and ranking top-k frequent queries or error codes over event streams",
        "External K-way merge sort combining k pre-sorted disk shards into one sorted output stream",
      ],
    },
    sections: [
      {
        heading: "Why a size-k Min-Heap beats full sorting when k << n",
        paragraphs: [
          "To find the **Kth Largest** element, keep a **Min-Heap** capped at size `k`, never a size-`k` Max-Heap. Compare on `[3, 8, 2, 10]` with `k = 2`: a bounded Max-Heap holds `[8, 3]` and its root `8` evicts `8` when `10` arrives, losing the 2nd-largest item! A bounded **Min-Heap** holds `[3, 8]` with root `3` (the weakest of the top `k`), so `10 > 3` evicts `3` and leaves `[8, 10]` with `heap[0] = 8`.",
          "Look at the scaling gap when `n = 1,000,000` and `k = 10`: full sorting runs roughly `20,000,000` comparison steps (`n log2 n`) and mutates or copies `10^6` slots, whereas a size-`10` Min-Heap does at most `3.3` comparisons per replacement (`n log2 k`) in `O(k)` memory, and works even on an infinite data stream where `n` is unknown upfront.",
        ],
        code: [
          "function kth_largest(nums, k):",
          "    min_heap ← []",
          "    for x in nums:",
          "        if len(min_heap) < k:",
          "            heap_push(min_heap, x)",
          "        else if x > min_heap[0]:",
          "            heap_pop(min_heap)",
          "            heap_push(min_heap, x)",
          "    return min_heap[0]",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Finding Kth Largest across n elements",
          headers: ["Approach", "Time", "Extra Space", "Streaming Support"],
          rows: [
            ["Sort descending, read arr[k - 1]", "O(n log n)", "O(1) to O(n)", "No (needs all n items)"],
            ["Max-Heap of all n, pop k times", "O(n + k log n)", "O(n)", "No (stores all n items)"],
            ["Min-Heap of size k (keep top k)", "O(n log k)", "O(k)", "Yes (processes one item at a time)"],
          ],
          highlightCol: 2,
        },
        visual: {
          kind: "dsa-array",
          caption: "Stream [3, 8, 2, 10, 5, 9] vs final Size-3 Min-Heap retaining the top 3 items [8, 10, 9]",
          trays: [
            {
              label: "Input Stream",
              cells: [
                { id: "kin0", value: "3", index: 0, state: "dim" },
                { id: "kin1", value: "8", index: 1, state: "done" },
                { id: "kin2", value: "2", index: 2, state: "dim" },
                { id: "kin3", value: "10", index: 3, state: "done" },
                { id: "kin4", value: "5", index: 4, state: "dim" },
                { id: "kin5", value: "9", index: 5, state: "done" },
              ],
            },
            {
              label: "Final Size-3 Min-Heap Backing Array",
              cells: [
                { id: "kkh0", value: "8", index: 0, state: "active" },
                { id: "kkh1", value: "10", index: 1, state: "done" },
                { id: "kkh2", value: "9", index: 2, state: "done" },
              ],
              pointers: [{ index: 0, label: "3rd largest", tone: "ok" }],
            },
          ],
        },
        callout: {
          kind: "KEY IDEA",
          text: "Remember the Top-K inversion rule: use a **Min-Heap** of size `k` to find the **Kth Largest** (evicting small items), and a **Max-Heap** of size `k` to find the **Kth Smallest** (evicting large items).",
        },
      },
      {
        heading: "Top K Frequent Elements: M06 Hash Map + bounded Min-Heap",
        paragraphs: [
          "Combine an M06 Hash Map with a bounded heap in two stages. First, scan `nums` once to build `counts[val] = freq` in `O(n)` time. Suppose there are `m <= n` distinct keys.",
          "Second, iterate over `(val, freq)` pairs in `counts` and maintain a size-`k` Min-Heap ordered by `freq`. Whenever `len(heap) > k`, pop the lowest-frequency pair. Total time is `O(n + m log k)` and space is `O(m + k)` (note: if frequencies are strictly integers in `1..n` and all keys are known upfront, M11-style bucket grouping by frequency array reaches `O(n)` time, while the heap generalizes to arbitrary floating-point scores or weighted counts).",
        ],
        code: [
          "function top_k_frequent(nums, k):",
          "    counts ← {}                      // M06 Hash Map",
          "    for x in nums:",
          "        counts[x] ← counts.get(x, 0) + 1",
          "",
          "    min_heap ← []                    // pairs (freq, val)",
          "    for (val, freq) in counts.items():",
          "        heap_push(min_heap, (freq, val))",
          "        if len(min_heap) > k:",
          "            heap_pop(min_heap)",
          "",
          "    result ← []",
          "    while len(min_heap) > 0:",
          "        (freq, val) ← heap_pop(min_heap)",
          "        result.append(val)",
          "    return result",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Top-K Frequent Elements method comparison",
          headers: ["Method", "Time", "Space", "Best When"],
          rows: [
            ["Hash Map + Sort all m keys", "O(n + m log m)", "O(m)", "k is close to m"],
            ["Hash Map + Size-k Min-Heap", "O(n + m log k)", "O(m + k)", "k << m or weights are non-integer"],
            ["Hash Map + Frequency Buckets", "O(n)", "O(n)", "Integer counts bounded by n"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Do not push all `m` unique keys into a Max-Heap and pop `k` times if `k << m` and memory is tight: capping a Min-Heap at `k` entries keeps heap operations at `O(log k)` instead of `O(log m)`.",
        },
      },
      {
        heading: "Merge K Sorted Lists from M12 in O(N log k)",
        paragraphs: [
          "Suppose you have `k` sorted linked lists containing `N` total nodes. Merging them sequentially one list into an accumulator costs `O(N * k)` because the combined list grows to length `N` and gets re-scanned repeatedly.",
          "With a **K-way merge Min-Heap**, push the `head` of every non-empty list into a Min-Heap as a tuple `(node.val, list_idx, node)`. The heap never holds more than `k` entries. Each iteration pops the smallest node, appends it to an M12 dummy sentinel chain (`tail.next ← node`), and if `node.next != null`, pushes `(node.next.val, list_idx, node.next)` back in. Each of the `N` nodes enters and leaves the heap once: **O(N log k)** time and **O(k)** auxiliary space.",
        ],
        code: [
          "function merge_k_lists(lists):",
          "    min_heap ← []",
          "    for idx from 0 to len(lists) - 1:",
          "        if lists[idx] != null:",
          "            heap_push(min_heap, (lists[idx].val, idx, lists[idx]))",
          "",
          "    dummy ← Node(0)",
          "    tail ← dummy",
          "    while len(min_heap) > 0:",
          "        (val, idx, node) ← heap_pop(min_heap)",
          "        tail.next ← node",
          "        tail ← tail.next",
          "        if node.next != null:",
          "            heap_push(min_heap, (node.next.val, idx, node.next))",
          "    return dummy.next",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Merging k sorted lists of N total nodes",
          headers: ["Strategy", "Time", "Extra Space", "Why"],
          rows: [
            ["Merge lists 0..k-1 sequentially", "O(N * k)", "O(1)", "Earlier nodes are re-traversed up to k times"],
            ["Min-Heap K-way merge", "O(N log k)", "O(k)", "Each of N nodes pays one O(log k) push + pop"],
            ["Pairwise divide-and-conquer merge", "O(N log k)", "O(1) iterative", "Halves k each round across log k passes"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "RULE OF THUMB",
          text: "Include a unique tie-breaker like `list_idx` between `node.val` and `node` in `(node.val, idx, node)` so tuple comparison never attempts to compare two `ListNode` references when values tie.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From O(n log n) Full Sort to O(n log k) Bounded Size-k Min-Heap",
      steps: [
        {
          label: "Step 1: Naive full sort (O(n log n) time, O(n) buffer)",
          explanation: "Sorting the entire array requires storing all `n` elements upfront and fails on infinite streams.",
          code: [
            "function kth_largest_sort(nums, k):",
            "    sorted_desc ← sort(nums, descending=true)",
            "    return sorted_desc[k - 1]",
          ],
          activeLines: [2, 3],
          output: "1,000,000 items -> ~20,000,000 comparisons",
        },
        {
          label: "Step 2: Unbounded Max-Heap (still O(n) memory)",
          explanation: "Building a Max-Heap of all `n` values pops `k` times, yet still holds every input item in memory.",
          code: [
            "function kth_largest_maxheap(nums, k):",
            "    max_heap ← build_max_heap(nums)",
            "    for step from 1 to k - 1: heap_pop_max(max_heap)",
            "    return max_heap[0]",
          ],
          activeLines: [2, 3],
          output: "O(n + k log n) time, O(n) space (non-streaming)",
        },
        {
          label: "Step 3: Size-k Min-Heap streaming selection (O(n log k) time, O(k) space)",
          explanation: "Evicting `min_heap[0]` whenever `len(min_heap) > k` retains only the top `k` items in `O(k)` space.",
          code: [
            "function kth_largest(nums, k):",
            "    min_heap ← []",
            "    for x in nums:",
            "        if len(min_heap) < k: heap_push(min_heap, x)",
            "        else if x > min_heap[0]:",
            "            heap_pop(min_heap); heap_push(min_heap, x)",
            "    return min_heap[0]",
          ],
          activeLines: [4, 5, 6],
          output: "kth_largest([3, 8, 2, 10, 5, 9], 3) -> 8",
        },
      ],
    },
    walkthrough: {
      title: "Trace size-k Min-Heap selection for Kth Largest (k = 3)",
      layout: "visual-first",
      steps: [
        {
          title: "Fill the size-3 Min-Heap with the first 3 numbers",
          tag: "CONCEPT",
          explanation: [
            "Input stream is `[3, 8, 2, 10, 5, 9]` with `k = 3`.",
            "The first three elements `[3, 8, 2]` fill the Min-Heap, placing the current 3rd-largest candidate `2` at `heap[0]`.",
          ],
          code: [
            "min_heap ← []",
            "for x in nums:",
            "    if len(min_heap) < k:",
            "        heap_push(min_heap, x)",
            "    else if x > min_heap[0]:",
            "        heap_pop(min_heap)",
            "        heap_push(min_heap, x)",
            "return min_heap[0]",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "min_heap = []",
              "for x in nums:",
              "    if len(min_heap) < k:",
              "        heapq.heappush(min_heap, x)",
              "    elif x > min_heap[0]:",
              "        heapq.heapreplace(min_heap, x)",
              "return min_heap[0]",
            ],
          },
          state: [
            { name: "k", value: "3" },
            { name: "processed", value: "[3, 8, 2]", changed: true },
            { name: "heap[0]", value: "2", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "After first 3 items, heap[0] = 2 is the smallest of the top 3 seen",
            nodes: [
              { id: "n0", label: "2", x: 50, y: 20, badge: "min (i=0)", state: "active" },
              { id: "n1", label: "8", x: 28, y: 72, badge: "i=1" },
              { id: "n2", label: "3", x: 72, y: 72, badge: "i=2" },
            ],
            edges: [
              { from: "n0", to: "n1", directed: true },
              { from: "n0", to: "n2", directed: true },
            ],
          },
        },
        {
          title: "10 beats root 2: evict 2 and push 10",
          tag: "TRACE",
          explanation: [
            "Next input `x = 10`. Since `10 > min_heap[0]` (`10 > 2`), `2` can never be in the final top 3.",
            "Pop `2` and push `10`, sifting `3` up to the root (`[3, 8, 10]`).",
          ],
          code: [
            "else if x > min_heap[0]:   // x = 10 > 2",
            "    heap_pop(min_heap)     // evict 2",
            "    heap_push(min_heap, x) // insert 10",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "x", value: "10", changed: true },
            { name: "evicted", value: "2", changed: true },
            { name: "heap[0]", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Heap stays capped at size k = 3 with [3, 8, 10]",
            nodes: [
              { id: "n0", label: "3", x: 50, y: 20, badge: "min (i=0)", state: "visited" },
              { id: "n1", label: "8", x: 28, y: 72, badge: "i=1" },
              { id: "n2", label: "10", x: 72, y: 72, badge: "i=2", state: "active" },
            ],
            edges: [
              { from: "n0", to: "n1", directed: true },
              { from: "n0", to: "n2", directed: true, state: "active" },
            ],
          },
        },
        {
          title: "5 beats root 3: evict 3 and push 5",
          tag: "TRACE",
          explanation: [
            "Next input `x = 5`. Since `5 > 3`, `heap_pop` pops `3` (promoting `8` over `10` to `[8, 10]`) and `heap_push(5)` appends `5` at `i = 2` and sifts it up to root.",
            "That leaves `[5, 10, 8]` with `heap[0] = 5`, `heap[1] = 10`, and `heap[2] = 8`.",
          ],
          code: [
            "else if x > min_heap[0]:   // x = 5 > 3",
            "    heap_pop(min_heap)     // evict 3 -> [8, 10]",
            "    heap_push(min_heap, x) // insert 5 -> [5, 10, 8]",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "x", value: "5", changed: true },
            { name: "evicted", value: "3", changed: true },
            { name: "heap", value: "[5, 10, 8]", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "After heap_pop + heap_push(5): heap holds [5, 10, 8] with root 5",
            nodes: [
              { id: "n0", label: "5", x: 50, y: 20, badge: "min (i=0)", state: "active" },
              { id: "n1", label: "10", x: 28, y: 72, badge: "i=1" },
              { id: "n2", label: "8", x: 72, y: 72, badge: "i=2", state: "visited" },
            ],
            edges: [
              { from: "n0", to: "n1", directed: true },
              { from: "n0", to: "n2", directed: true, state: "active" },
            ],
          },
        },
        {
          title: "9 beats root 5: evict 5 and push 9",
          tag: "TRACE",
          explanation: [
            "Final input `x = 9`. Since `9 > 5`, pop `5` and push `9`.",
            "`8` rises to `heap[0]`, leaving `[8, 10, 9]` inside the size-3 Min-Heap.",
          ],
          code: [
            "else if x > min_heap[0]:   // x = 9 > 5",
            "    heap_pop(min_heap)     // evict 5",
            "    heap_push(min_heap, x) // insert 9",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "x", value: "9", changed: true },
            { name: "evicted", value: "5", changed: true },
            { name: "heap[0]", value: "8", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Final top 3 elements are {8, 9, 10}; root 8 is the 3rd largest",
            nodes: [
              { id: "n0", label: "8", x: 50, y: 20, badge: "min (i=0)", state: "visited" },
              { id: "n1", label: "10", x: 28, y: 72, badge: "i=1" },
              { id: "n2", label: "9", x: 72, y: 72, badge: "i=2", state: "active" },
            ],
            edges: [
              { from: "n0", to: "n1", directed: true },
              { from: "n0", to: "n2", directed: true, state: "active" },
            ],
          },
        },
        {
          title: "Read heap[0] as the Kth Largest in O(1)",
          tag: "CHECK",
          explanation: [
            "Every element discarded (`2, 3, 5`) was strictly smaller than all 3 elements remaining in `min_heap` (`8, 9, 10`).",
            "Therefore `min_heap[0] = 8` is guaranteed to be the 3rd largest value overall.",
          ],
          code: [
            "return min_heap[0]         // 8",
          ],
          activeLines: [1],
          codeLabel: "Pseudocode",
          state: [
            { name: "answer", value: "8", changed: true },
            { name: "total space", value: "O(k) = 3 slots" },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Final Size-3 Min-Heap tree [8, 10, 9]: min_heap[0] = 8 is the 3rd largest overall",
            nodes: [
              { id: "n0", label: "8", x: 50, y: 20, badge: "3rd (i=0)", state: "active" },
              { id: "n1", label: "10", x: 28, y: 72, badge: "i=1", state: "visited" },
              { id: "n2", label: "9", x: 72, y: 72, badge: "i=2", state: "visited" },
            ],
            edges: [
              { from: "n0", to: "n1", directed: true },
              { from: "n0", to: "n2", directed: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Picking a Max-Heap instead of a Min-Heap for Kth Largest",
        detail:
          "If you cap a Max-Heap at size `k` and pop whenever `len > k`, you evict the largest elements and end up keeping the `k` smallest! Always keep the heap type whose root is the boundary you want to evict.",
        code: "// Kth Largest  -> Min-Heap of size k (root = smallest of top k)\n// Kth Smallest -> Max-Heap of size k (root = largest of bottom k)",
      },
      {
        title: "Missing tie-breaker when pushing ListNode tuples",
        detail:
          "In Python and typed priority queues, pushing `(node.val, node)` throws a comparison error when two lists share the same head value. Always insert a unique integer `idx` as `(node.val, idx, node)`.",
        code: "heap_push(min_heap, (node.val, idx, node))",
      },
      {
        title: "Skipping null checks when seeding Merge K Lists",
        detail:
          "The input array `lists` often contains empty lists (`null` heads). Guard `if lists[idx] != null:` during initialization and `if node.next != null:` after popping.",
      },
    ],
    predictChecks: [
      {
        prompt: "This function tries to find the 2nd largest element in [4, 9, 2, 10, 7] using a max-heap capped at k = 2. What does it return?",
        code: "max_heap = []\nfor x in [4, 9, 2, 10, 7]:\n    max_heap.push(x)\n    if len(max_heap) > 2:\n        max_heap.pop_max()\nreturn max_heap.peek_max()",
        options: [
          { id: "a", label: "9, the true 2nd largest element" },
          { id: "b", label: "4, because pop_max() evicts the largest elements and keeps the 2 smallest" },
          { id: "c", label: "2, because the root of a max-heap shifts to the minimum after 3 pops" },
          { id: "d", label: "10, because 10 is pushed after 9 and stays at the root" },
        ],
        correctId: "b",
        explanation: "Capping a max-heap at size k = 2 evicts 9, 10, and 7 on overflow, leaving [4, 2]. Its root 4 is the 2nd smallest element; finding Kth largest requires a min-heap of size k.",
      },
      {
        prompt: "This Kth Largest snippet for k = 3 and nums = [5, 1, 8, 3, 9] pops when len(min_heap) == 3 instead of > 3. What does it return?",
        code: "min_heap = []\nfor x in [5, 1, 8, 3, 9]:\n    min_heap.push(x)\n    if len(min_heap) == 3:\n        min_heap.pop_min()\nreturn min_heap.peek_min()",
        options: [
          { id: "a", label: "5, the true 3rd largest element" },
          { id: "b", label: "9, because 8 gets evicted on the final iteration" },
          { id: "c", label: "8, because popping at len == 3 shrinks the heap to k - 1 = 2 elements" },
          { id: "d", label: "Throws an empty-heap error on the final peek_min()" },
        ],
        correctId: "c",
        explanation: "Triggering pop_min() when len == k drops the heap down to k - 1 = 2 items after every 3rd push, leaving [8, 9] whose root 8 is the 2nd largest instead of the 3rd. Pop when len(min_heap) > k.",
      },
    ],
    practiceTask: {
      title: "Kth Largest Element via Size-k Min-Heap",
      tier: "Warmup",
      goal: "Given an integer array `nums` and `1 <= k <= len(nums)`, return the `k`th largest element in `O(n log k)` time and `O(k)` space.",
      constraints: [
        "1 <= k <= len(nums) <= 10^5",
        "Do not sort the whole array",
        "Target: O(n log k) time, O(k) space",
      ],
      examples: [
        { input: "nums = [3, 2, 1, 5, 6, 4], k = 2", output: "5" },
        { input: "nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4", output: "4" },
      ],
      tasks: [
        "Maintain a Min-Heap capped at size `k`.",
        "Push the first `k` values, then only replace `heap[0]` when `x > heap[0]`.",
        "Return `heap[0]`.",
      ],
      starterCode: "function kth_largest(nums, k):\n    // TODO: size-k Min-Heap",
      expectedOutput: "5\n4",
      hint: "Checking `x > heap[0]` before popping avoids an unnecessary push+pop on elements smaller than the current top-k threshold.",
      complexity: { time: "O(n log k)", space: "O(k)" },
      solutionCode:
        "function kth_largest(nums, k):\n    h ← []\n    for x in nums:\n        if len(h) < k:\n            heap_push(h, x)\n        else if x > h[0]:\n            heap_pop(h)\n            heap_push(h, x)\n    return h[0]",
    },
    practiceChallenges: [
      {
        title: "Kth Largest Element via Size-k Min-Heap",
        tier: "Warmup",
        goal: "Return the `k`th largest value in `nums` using a size-`k` Min-Heap in `O(n log k)` time.",
        constraints: ["1 <= k <= len(nums) <= 10^5", "Target: O(n log k) time, O(k) space"],
        examples: [
          { input: "nums = [3, 2, 1, 5, 6, 4], k = 2", output: "5" },
          { input: "nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4", output: "4", explanation: "Duplicate values fill separate slots in the size-k Min-Heap." },
        ],
        tasks: [
          "Push into `min_heap` while `len < k`.",
          "Whenever `x > min_heap[0]`, pop the root and push `x`.",
        ],
        starterCode: "function kth_largest(nums, k):\n    // TODO",
        expectedOutput: "5\n4",
        hint: "After one full scan, the root of the size-`k` Min-Heap is the `k`th largest element.",
        complexity: { time: "O(n log k)", space: "O(k)" },
        solutionCode:
          "function kth_largest(nums, k):\n    min_heap ← []\n    for x in nums:\n        if len(min_heap) < k:\n            heap_push(min_heap, x)\n        else if x > min_heap[0]:\n            heap_pop(min_heap)\n            heap_push(min_heap, x)\n    return min_heap[0]",
      },
      {
        title: "Top K Frequent Elements",
        tier: "Core",
        goal: "Given an integer array `nums` and integer `k`, return the `k` most frequent elements using an M06 Hash Map and a bounded Min-Heap in `O(n + m log k)` time.",
        constraints: [
          "1 <= k <= unique_count <= len(nums) <= 10^5",
          "Answer may be returned in any order",
          "Target: O(n log k) time, O(n) space",
        ],
        examples: [
          { input: "nums = [1, 1, 1, 2, 2, 3], k = 2", output: "[1, 2]" },
          { input: "nums = [4, 4, 2, 5, 5, 5, 2, 2], k = 2", output: "[2, 5]" },
        ],
        tasks: [
          "Count each element's frequency in a Hash Map `counts`.",
          "Iterate through `(val, freq)` and keep a Min-Heap of size `k` ordered by `freq`.",
          "Extract the `k` values remaining in the heap.",
        ],
        starterCode: "function top_k_frequent(nums, k):\n    // TODO: Hash Map + size-k Min-Heap",
        expectedOutput: "[1, 2]\n[2, 5]",
        hint: "Store `(freq, val)` tuples in the Min-Heap so the heap compares frequencies first.",
        complexity: { time: "O(n log k)", space: "O(n)" },
        solutionCode:
          "function top_k_frequent(nums, k):\n    counts ← {}\n    for x in nums:\n        counts[x] ← counts.get(x, 0) + 1\n    min_heap ← []\n    for (val, freq) in counts.items():\n        heap_push(min_heap, (freq, val))\n        if len(min_heap) > k:\n            heap_pop(min_heap)\n    res ← []\n    while len(min_heap) > 0:\n        (freq, val) ← heap_pop(min_heap)\n        res.append(val)\n    return res",
      },
      {
        title: "Merge K Sorted Linked Lists",
        tier: "Stretch",
        goal: "Given an array `lists` of `k` sorted singly linked lists (total `N` nodes), merge them into one sorted linked list in `O(N log k)` time and `O(k)` extra space.",
        constraints: [
          "0 <= k <= 10^4",
          "0 <= total nodes N <= 10^5",
          "Target: O(N log k) time, O(k) heap space",
        ],
        examples: [
          { input: "lists = [[1, 4, 5], [1, 3, 4], [2, 6]]", output: "[1, 1, 2, 3, 4, 4, 5, 6]" },
          { input: "lists = [[], [2]]", output: "[2]" },
        ],
        tasks: [
          "Push `(head.val, i, head)` for every non-null list head.",
          "Pop the smallest node, attach it to an M12 dummy tail, and push `node.next` if non-null.",
        ],
        starterCode: "function merge_k_lists(lists):\n    // TODO: K-way merge with Min-Heap",
        expectedOutput: "[1, 1, 2, 3, 4, 4, 5, 6]\n[2]",
        hint: "Use `(node.val, idx, node)` so equal values break ties by `idx` without comparing `Node` pointers.",
        complexity: { time: "O(N log k)", space: "O(k)" },
        solutionCode:
          "function merge_k_lists(lists):\n    min_heap ← []\n    for i from 0 to len(lists) - 1:\n        if lists[i] != null:\n            heap_push(min_heap, (lists[i].val, i, lists[i]))\n    dummy ← Node(0)\n    tail ← dummy\n    while len(min_heap) > 0:\n        (val, i, node) ← heap_pop(min_heap)\n        tail.next ← node\n        tail ← tail.next\n        if node.next != null:\n            heap_push(min_heap, (node.next.val, i, node.next))\n    return dummy.next",
      },
    ],
  },

  "dsa-two-heaps-scheduler": {
    lessonId: "dsa-two-heaps-scheduler",
    subtitle:
      "Balance a Max-Heap and Min-Heap to track streaming medians in O(log n) add / O(1) query, and combine a greedy Max-Heap with a cooldown FIFO queue to schedule tasks with zero wasted slots.",
    intro: {
      heading: "Two-Heaps Streaming Median & Greedy Priority Scheduling",
      explanation: [
        "Re-sorting an array every time a new score arrives to read the running median costs `O(n log n)` per update (`O(n^2 log n)` across `n` events), and a single binary heap exposes only one boundary (`min` or `max`), never the middle element.",
        "Splitting the stream across two facing heaps—a **Max-Heap `lo`** for the smaller half and a **Min-Heap `hi`** for the larger half—exposes both center values at `lo[0]` and `hi[0]` for `O(log n)` updates and `O(1)` median queries. In the second half of this lesson, pairing a **Max-Heap** with a cooldown **FIFO Queue** schedules repeated tasks in minimum CPU ticks.",
      ],
      analogy:
        "Picture two bleachers facing each other across a center aisle: `lo` seats the lighter half of the audience with the heaviest person right on the aisle, while `hi` seats the heavier half with the lightest person right on the aisle. Finding the median never requires sorting the stadium; you glance at the one or two people sitting on the aisle.",
      realWorldUses: [
        "Computing real-time p50 response latency metrics and balanced bid/ask order-book midpoints",
        "CPU/GPU task dispatchers enforcing per-resource cooldown intervals between identical jobs",
      ],
    },
    sections: [
      {
        heading: "Two-Heaps protocol: order invariant + size invariant",
        paragraphs: [
          "Maintain two invariants after every `add_num(x)`: (1) **Order invariant**: every value in `lo` (Max-Heap) is `<=` every value in `hi` (Min-Heap), and (2) **Balance invariant**: `len(lo)` is either equal to `len(hi)` (even total count) or `len(hi) + 1` (odd total count).",
          "Instead of writing error-prone `if/else` cases comparing `x` against both tops, use the 3-step canonical push: (1) push `x` into `lo`, (2) pop `lo.max` and push it into `hi` (preserving `max(lo) <= min(hi)` even if `x` belonged in `hi`!), and (3) if `len(hi) > len(lo)`, pop `hi.min` and push it back into `lo`. Then `find_median()` returns `lo[0]` when `len(lo) > len(hi)` and `(lo[0] + hi[0]) / 2` when equal.",
        ],
        code: [
          "class MedianFinder:",
          "    init():",
          "        lo ← MaxHeap()    // smaller half",
          "        hi ← MinHeap()    // larger half",
          "",
          "    function add_num(x):",
          "        lo.push(x)",
          "        hi.push(lo.pop_max())",
          "        if len(hi) > len(lo):",
          "            lo.push(hi.pop_min())",
          "",
          "    function find_median():",
          "        if len(lo) > len(hi):",
          "            return lo.peek()",
          "        return (lo.peek() + hi.peek()) / 2.0",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Roles of lo and hi in MedianFinder",
          headers: ["Property", "lo (Lower Half)", "hi (Upper Half)"],
          rows: [
            ["Heap kind", "Max-Heap", "Min-Heap"],
            ["Root exposes", "Largest of the small half", "Smallest of the large half"],
            ["Allowed size", "len(hi) or len(hi) + 1", "len(lo) or len(lo) - 1"],
            ["Odd count median", "lo.peek() directly", "Not used"],
            ["Even count median", "Average of lo.peek() and hi.peek()", "Average of lo.peek() and hi.peek()"],
          ],
          highlightCol: 1,
        },
        visual: {
          kind: "dsa-graph",
          caption: "Two balanced heaps after [5, 15, 1, 3, 8]: Max-Heap lo (left) & Min-Heap hi (right); median = 5",
          nodes: [
            { id: "slo0", label: "5", x: 26, y: 22, badge: "lo[0] med", state: "active" },
            { id: "slo1", label: "1", x: 12, y: 74, badge: "lo[1]", state: "visited" },
            { id: "slo2", label: "3", x: 40, y: 74, badge: "lo[2]", state: "visited" },
            { id: "shi0", label: "8", x: 74, y: 22, badge: "hi[0] min", state: "queued" },
            { id: "shi1", label: "15", x: 62, y: 74, badge: "hi[1]" },
          ],
          edges: [
            { from: "slo0", to: "slo1", directed: true },
            { from: "slo0", to: "slo2", directed: true },
            { from: "shi0", to: "shi1", directed: true },
          ],
        },
        callout: {
          kind: "KEY IDEA",
          text: "Routing every new `x` through `lo -> hi` and then rebalancing `hi -> lo` when `len(hi) > len(lo)` guarantees `max(lo) <= min(hi)` automatically in 4 lines of code.",
        },
      },
      {
        heading: "Two-Heaps size and order rebalance trace on [5, 15, 1, 3, 8]",
        paragraphs: [
          "Compare a naive size-alternating push (`if len(lo) <= len(hi): lo.push(x) else: hi.push(x)`) against the canonical 3-step transfer on `[5, 15, 1, 3, 8]`: if `1` entered `lo` while `15` sat in `hi`, and then `3` alternated into `hi`, `lo = [5, 1]` and `hi = [3, 15]` would break `max(lo) <= min(hi)` (`5 > 3`) and report the wrong median `4.0`. Routing through `lo -> hi` and rebalancing `hi -> lo` prevents that crossing on every push.",
        ],
        table: {
          caption: "Step-by-step Two-Heaps rebalance trace on [5, 15, 1, 3, 8]",
          headers: ["Call", "After lo.push(x) & hi.push(lo.pop_max())", "len(hi) > len(lo)?", "lo (Max) / hi (Min)", "find_median()"],
          rows: [
            ["add(5)", "lo=[], hi=[5]", "Yes (1 > 0) -> move 5 to lo", "lo:[5] / hi:[]", "5"],
            ["add(15)", "lo=[5], hi=[15]", "No (1 == 1)", "lo:[5] / hi:[15]", "(5 + 15) / 2 = 10.0"],
            ["add(1)", "lo=[1], hi=[5, 15]", "Yes (2 > 1) -> move 5 to lo", "lo:[5, 1] / hi:[15]", "5"],
            ["add(3)", "lo=[3, 1], hi=[5, 15]", "No (2 == 2)", "lo:[3, 1] / hi:[5, 15]", "(3 + 5) / 2 = 4.0"],
            ["add(8)", "lo=[3, 1], hi=[5, 15, 8]", "Yes (3 > 2) -> move 5 to lo", "lo:[5, 1, 3] / hi:[8, 15]", "5"],
          ],
          highlightCol: 4,
        },
      },
      {
        heading: "Greedy Max-Heap + Cooldown Queue (Task Scheduler)",
        paragraphs: [
          "Given task labels like `['A','A','A','B','B','B']` and cooldown `n`, identical tasks must wait `n` intervals before running again. Why pick the task with the **highest remaining count** first? High-frequency tasks create the most rigid spacing constraints; delaying them leaves unavoidable idle gaps at the tail of the schedule.",
          "Count frequencies with an M06 Hash Map, push all positive counts into a **Max-Heap**, and keep a **FIFO Queue** of `(remaining_count, ready_tick)` pairs for cooling tasks. At each `tick = tick + 1`: if the Max-Heap is non-empty, pop `cnt`, decrement `cnt ← cnt - 1`, and if `cnt > 0`, enqueue `(cnt, tick + n)`. Then if the front of the queue has `ready_tick == tick`, dequeue it and push `remaining_count` back into the Max-Heap. Repeat until both structures are empty.",
        ],
        code: [
          "function least_interval(tasks, n):",
          "    counts ← {}                      // M06 Hash Map",
          "    for t in tasks:",
          "        counts[t] ← counts.get(t, 0) + 1",
          "",
          "    max_heap ← MaxHeap(counts.values())",
          "    cooldown ← Queue()               // stores (cnt, ready_tick)",
          "    tick ← 0",
          "",
          "    while not max_heap.empty() or not cooldown.empty():",
          "        tick ← tick + 1",
          "        if not max_heap.empty():",
          "            cnt ← max_heap.pop_max() - 1",
          "            if cnt > 0:",
          "                cooldown.enqueue((cnt, tick + n))",
          "        if not cooldown.empty() and cooldown.front().ready_tick == tick:",
          "            (ready_cnt, _) ← cooldown.dequeue()",
          "            max_heap.push(ready_cnt)",
          "",
          "    return tick",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Comparing Lesson 3 multi-structure patterns",
          headers: ["Pattern", "Structures Combined", "Core Invariant", "Complexity"],
          rows: [
            ["Streaming Median", "Max-Heap (lo) + Min-Heap (hi)", "max(lo) <= min(hi) and 0 <= len(lo)-len(hi) <= 1", "O(log n) add, O(1) median"],
            ["Task Scheduler", "Max-Heap + FIFO Cooldown Queue", "Always execute ready task with largest remaining count", "O(T log A) where A <= 26"],
          ],
          highlightCol: 2,
        },
        visual: {
          kind: "dsa-array",
          caption: "Task Scheduler trace for [A,A,A,B,B,B], cooldown n=2: Max-Heap + Cooldown Queue schedule takes 8 ticks",
          trays: [
            {
              label: "Execution timeline (tick 1..8)",
              cells: [
                { id: "ts1", value: "t1: A", index: 0, state: "active" },
                { id: "ts2", value: "t2: B", index: 1, state: "active" },
                { id: "ts3", value: "t3: idle", index: 2, state: "dim" },
                { id: "ts4", value: "t4: A", index: 3, state: "done" },
                { id: "ts5", value: "t5: B", index: 4, state: "done" },
                { id: "ts6", value: "t6: idle", index: 5, state: "dim" },
                { id: "ts7", value: "t7: A", index: 6, state: "done" },
                { id: "ts8", value: "t8: B", index: 7, state: "done" },
              ],
              pointers: [
                { index: 0, label: "A ready t=4", tone: "accent" },
                { index: 3, label: "re-queued", tone: "ok" },
              ],
            },
          ],
        },
        callout: {
          kind: "WATCH OUT",
          text: "Increment `tick` before recording `ready_tick = tick + n` and check `cooldown.front().ready_tick == tick` at the end of that tick. That handles `n = 0` automatically (`ready_tick == tick` re-enables the task immediately for the very next tick) and matches `n = 2` (`t=1` runs A, `t=2` and `t=3` cool, `t=4` runs A).",
        },
      },
    ],
    guidedBuildUp: {
      title: "From O(n log n) Re-Sort per Update to O(log n) Two-Heaps MedianFinder",
      steps: [
        {
          label: "Step 1: Naive re-sort on every query/insert (O(n log n) per step)",
          explanation: "Sorting the entire buffer for each incoming value takes `O(n^2 log n)` across `n` stream items.",
          code: [
            "class NaiveMedian:",
            "    init(): nums ← []",
            "    function add_num(x): nums.append(x); sort(nums)",
            "    function find_median():",
            "        m ← len(nums) // 2",
            "        return nums[m] if len(nums) % 2 == 1 else (nums[m - 1] + nums[m]) / 2.0",
          ],
          activeLines: [3],
          output: "50,000 updates -> billions of comparisons",
        },
        {
          label: "Step 2: Broken size-only split across lo and hi",
          explanation: "Alternating pushes by size alone allows a large item into `lo` or small item into `hi`, breaking `max(lo) <= min(hi)`.",
          code: [
            "function add_broken(x):",
            "    if len(lo) <= len(hi): lo.push(x)",
            "    else: hi.push(x)    // BUG: x could be < lo.peek()!",
          ],
          activeLines: [2, 3],
          output: "[5, 15, 1, 3] -> lo=[5,1], hi=[3,15] -> median 4.0? (5 > 3!)",
        },
        {
          label: "Step 3: Canonical 3-step lo -> hi -> rebalance MedianFinder",
          explanation: "Pushing `x` into `lo`, moving `lo.pop_max()` to `hi`, and moving `hi.pop_min()` back if `len(hi) > len(lo)` preserves both invariants.",
          code: [
            "function add_num(x):",
            "    lo.push(x)",
            "    hi.push(lo.pop_max())",
            "    if len(hi) > len(lo): lo.push(hi.pop_min())",
            "function find_median():",
            "    return lo.peek() if len(lo) > len(hi) else (lo.peek() + hi.peek()) / 2.0",
          ],
          activeLines: [2, 3, 4],
          output: "O(log n) add_num, O(1) find_median",
        },
      ],
    },
    walkthrough: {
      title: "Trace MedianFinder across the stream [5, 15, 1, 3, 8]",
      layout: "visual-first",
      steps: [
        {
          title: "Add 5: lo gets 5 -> moved to hi -> rebalanced back to lo",
          tag: "CONCEPT",
          explanation: [
            "Push `5` into `lo`, move `lo.pop_max()` (`5`) into `hi`. Now `len(hi) = 1 > len(lo) = 0`.",
            "Rebalance moves `5` back to `lo`. With `lo = [5]` and `hi = []`, `find_median()` returns `lo.peek() = 5`.",
          ],
          code: [
            "function add_num(x):",
            "    lo.push(x)",
            "    hi.push(lo.pop_max())",
            "    if len(hi) > len(lo):",
            "        lo.push(hi.pop_min())",
            "function find_median():",
            "    return lo.peek() if len(lo) > len(hi) else (lo.peek() + hi.peek()) / 2.0",
          ],
          activeLines: [2, 3, 4, 5],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "def add_num(x):          # lo stores -val for Max-Heap",
              "    heapq.heappush(lo, -x)",
              "    heapq.heappush(hi, -heapq.heappop(lo))",
              "    if len(hi) > len(lo):",
              "        heapq.heappush(lo, -heapq.heappop(hi))",
              "def find_median():",
              "    return -lo[0] if len(lo) > len(hi) else (-lo[0] + hi[0]) / 2.0",
            ],
          },
          state: [
            { name: "x", value: "5", changed: true },
            { name: "lo (max)", value: "[5]", changed: true },
            { name: "hi (min)", value: "[]" },
            { name: "median", value: "5", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "After add_num(5): lo holds [5] and hi is empty -> median is lo[0] = 5",
            trays: [
              {
                label: "lo (Max-Heap, smaller half) | hi (Min-Heap): empty",
                cells: [{ id: "m5", value: "5", index: 0, state: "active" }],
                pointers: [{ index: 0, label: "lo.max", tone: "accent" }],
              },
            ],
          },
        },
        {
          title: "Add 15: lo pushes 15, sends 15 to hi, sizes balance at 1 vs 1",
          tag: "TRACE",
          explanation: [
            "`lo.push(15)` gives `[15, 5]`; popping `lo.max` moves `15` into `hi`.",
            "Now `len(lo) = 1` and `len(hi) = 1` (`len(hi) <= len(lo)`), so no rebalance needed. Median is `(5 + 15) / 2 = 10.0`.",
          ],
          code: [
            "lo.push(15)            // lo = [15, 5]",
            "hi.push(lo.pop_max())  // moves 15 -> hi = [15], lo = [5]",
            "// len(hi) == len(lo) == 1 -> balanced",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "x", value: "15", changed: true },
            { name: "lo (max)", value: "[5]" },
            { name: "hi (min)", value: "[15]", changed: true },
            { name: "median", value: "10.0", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Even count (2 items): average of lo.max (5) and hi.min (15) = 10.0",
            trays: [
              {
                label: "lo (Max-Heap)",
                cells: [{ id: "m5", value: "5", index: 0, state: "active" }],
                pointers: [{ index: 0, label: "lo.max", tone: "accent" }],
              },
              {
                label: "hi (Min-Heap)",
                cells: [{ id: "m15", value: "15", index: 0, state: "active" }],
                pointers: [{ index: 0, label: "hi.min", tone: "ok" }],
              },
            ],
          },
        },
        {
          title: "Add 1: routes 5 into hi, then rebalances 5 back to lo",
          tag: "TRACE",
          explanation: [
            "`lo.push(1)` gives `[5, 1]`; `lo.pop_max()` moves `5` into `hi` (`hi = [5, 15]`, `lo = [1]`).",
            "Because `len(hi) = 2 > len(lo) = 1`, `hi.pop_min()` returns `5` back to `lo`, leaving `lo = [5, 1]` and `hi = [15]`. Median is `5`.",
          ],
          code: [
            "lo.push(1)             // lo = [5, 1]",
            "hi.push(lo.pop_max())  // hi = [5, 15], lo = [1]",
            "if len(hi) > len(lo):",
            "    lo.push(hi.pop_min()) // lo = [5, 1], hi = [15]",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "x", value: "1", changed: true },
            { name: "lo (max)", value: "[5, 1]", changed: true },
            { name: "hi (min)", value: "[15]" },
            { name: "median", value: "5", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Odd count (3 items): lo holds [5, 1] with lo.max=5, hi holds [15]",
            trays: [
              {
                label: "lo (Max-Heap)",
                cells: [
                  { id: "m5", value: "5", index: 0, state: "active" },
                  { id: "m1", value: "1", index: 1 },
                ],
                pointers: [{ index: 0, label: "lo.max", tone: "accent" }],
              },
              {
                label: "hi (Min-Heap)",
                cells: [{ id: "m15", value: "15", index: 0, state: "done" }],
                pointers: [{ index: 0, label: "hi.min", tone: "ok" }],
              },
            ],
          },
        },
        {
          title: "Add 3: lo pushes 3, sends 5 to hi -> balanced [3, 1] and [5, 15]",
          tag: "TRACE",
          explanation: [
            "`lo.push(3)` produces `[5, 1, 3]`. Popping `lo.max` moves `5` to `hi` (`[5, 15]`).",
            "Sizes are `2` and `2`! `find_median()` computes `(3 + 5) / 2 = 4.0`.",
          ],
          code: [
            "lo.push(3)             // lo = [5, 1, 3]",
            "hi.push(lo.pop_max())  // hi = [5, 15], lo = [3, 1]",
            "// len(hi) == len(lo) == 2",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "x", value: "3", changed: true },
            { name: "lo (max)", value: "[3, 1]", changed: true },
            { name: "hi (min)", value: "[5, 15]", changed: true },
            { name: "median", value: "4.0", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Even count (4 items): lo[0]=3 (Max-Heap) vs hi[0]=5 (Min-Heap) -> median = 4.0",
            trays: [
              {
                label: "lo (Max-Heap backing array)",
                cells: [
                  { id: "l4_0", value: "3", index: 0, state: "active" },
                  { id: "l4_1", value: "1", index: 1 },
                ],
                pointers: [{ index: 0, label: "lo[0] max", tone: "accent" }],
              },
              {
                label: "hi (Min-Heap backing array)",
                cells: [
                  { id: "h4_0", value: "5", index: 0, state: "done" },
                  { id: "h4_1", value: "15", index: 1 },
                ],
                pointers: [{ index: 0, label: "hi[0] min", tone: "ok" }],
              },
            ],
          },
        },
        {
          title: "Add 8: crosses lo -> hi -> returns 5 to lo",
          tag: "CHECK",
          explanation: [
            "`lo.push(8)` puts `8` at `lo.max`, so `lo.pop_max()` moves `8` into `hi` (`hi = [5, 15, 8]`).",
            "`len(hi) = 3 > len(lo) = 2`, so `hi.pop_min()` moves `5` back into `lo`. Final state: `lo = [5, 1, 3]`, `hi = [8, 15]`, median = `5`.",
          ],
          code: [
            "lo.push(8)             // lo = [8, 1, 3]",
            "hi.push(lo.pop_max())  // hi = [5, 15, 8], lo = [3, 1]",
            "lo.push(hi.pop_min())  // lo = [5, 1, 3], hi = [8, 15]",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "x", value: "8", changed: true },
            { name: "lo (max)", value: "[5, 1, 3]", changed: true },
            { name: "hi (min)", value: "[8, 15]", changed: true },
            { name: "median", value: "5", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Final odd state: lo[0]=5 (med) with children lo[1..2]=[1,3] & hi[0]=8 with hi[1]=15",
            trays: [
              {
                label: "lo (Max-Heap backing array)",
                cells: [
                  { id: "l5_0", value: "5", index: 0, state: "active" },
                  { id: "l5_1", value: "1", index: 1, state: "done" },
                  { id: "l5_2", value: "3", index: 2, state: "done" },
                ],
                pointers: [{ index: 0, label: "lo[0] med=5", tone: "accent" }],
              },
              {
                label: "hi (Min-Heap backing array)",
                cells: [
                  { id: "h5_0", value: "8", index: 0, state: "done" },
                  { id: "h5_1", value: "15", index: 1 },
                ],
                pointers: [{ index: 0, label: "hi[0] min", tone: "ok" }],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Comparing sizes without enforcing max(lo) <= min(hi)",
        detail:
          "If you only alternate pushing into `lo` and `hi` by heap size without passing `x` through the boundary, a huge value could get trapped in `lo` or a tiny value in `hi`. Always route through `lo -> hi` (or check `x <= lo.peek()`).",
        code: "// Broken: if len(lo) <= len(hi): lo.push(x) else: hi.push(x)\n// Fixed: lo.push(x); hi.push(lo.pop_max()); if len(hi) > len(lo): lo.push(hi.pop_min())",
      },
      {
        title: "Forgetting to negate back when reading Max-Heap lo",
        detail:
          "When simulating `lo` with a Min-Heap via negated values (`-x`), remember to negate back (`-lo[0]`) inside `find_median()` and when transferring from `lo` to `hi`.",
        code: "hi.push(-lo.pop_min())",
      },
      {
        title: "Off-by-one errors in cooldown ready_tick",
        detail:
          "With `n = 2`, a task executed at tick `1` cannot run at ticks `2` or `3`, and becomes eligible again for tick `4`. Check your loop against `n = 0` and `n = 2` on `['A', 'A']` to confirm `1 + n` total ticks.",
      },
    ],
    predictChecks: [
      {
        prompt: "This MedianFinder balances heap sizes without routing new numbers across the lo/hi boundary. What does lo.peek_max() return after adding [10, 1, 2]?",
        code: "// lo: max-heap, hi: min-heap\nfunction add_num(x):\n    if len(lo) <= len(hi): lo.push(x)\n    else: hi.push(x)\n// add_num(10), add_num(1), add_num(2)\nreturn lo.peek_max()",
        options: [
          { id: "a", label: "2, the true median of [10, 1, 2]" },
          { id: "b", label: "1, because hi swaps its minimum into lo" },
          { id: "c", label: "5.5, the average of lo.peek_max() and hi.peek_min()" },
          { id: "d", label: "10, because 10 stays trapped in lo while 1 sits in hi" },
        ],
        correctId: "d",
        explanation: "Without routing through lo -> hi, 10 enters lo and 1 enters hi, breaking max(lo) <= min(hi). After adding 2 to lo, lo holds [10, 2] and hi holds [1], so lo.peek_max() returns 10 instead of 2.",
      },
      {
        prompt: "With cooldown n = 2 and tasks ['A', 'A'], a task running at tick 1 must wait 2 ticks before running again. What total ticks does this loop return when ready_tick = tick + n?",
        code: "tick = 0; ready = [] // max_heap starts with [(2, 'A')]\nwhile max_heap or ready:\n    tick += 1\n    while ready and ready[0][0] <= tick:\n        max_heap.push(ready.pop_front()[1])\n    if max_heap:\n        cnt = max_heap.pop_max() - 1\n        if cnt > 0: ready.push((tick + n, cnt))\nreturn tick",
        options: [
          { id: "a", label: "3 instead of 4, because 'A' becomes eligible after only 1 idle tick" },
          { id: "b", label: "4, which is the correct total ticks for n = 2" },
          { id: "c", label: "5, because ready checks ready[0][0] <= tick one tick late" },
          { id: "d", label: "2, because max_heap becomes empty at tick 1" },
        ],
        correctId: "a",
        explanation: "Executing 'A' at tick 1 and queuing ready_tick = tick + n = 3 lets 'A' run again at tick 3 (A, idle, A), leaving 1 idle tick instead of n = 2. Setting ready_tick = tick + n + 1 = 4 fixes the gap.",
      },
    ],
    practiceTask: {
      title: "Implement Streaming MedianFinder",
      tier: "Warmup",
      goal: "Build a `MedianFinder` class with `add_num(x)` in `O(log n)` and `find_median()` in `O(1)`.",
      constraints: [
        "Up to 5 * 10^4 calls to add_num and find_median",
        "find_median is only called when at least 1 number has been added",
        "Target: O(log n) add, O(1) query",
      ],
      examples: [
        { input: "add(1), add(2), median(), add(3), median()", output: "1.5, 2.0" },
        { input: "add(-5), add(-5), median(), add(10), median()", output: "-5.0, -5.0", explanation: "Duplicate negative numbers balance across lo and hi." },
      ],
      tasks: [
        "Maintain `lo` (Max-Heap) and `hi` (Min-Heap).",
        "Keep `len(lo) == len(hi)` or `len(lo) == len(hi) + 1` with `max(lo) <= min(hi)`.",
      ],
      starterCode:
        "class MedianFinder:\n    init():\n        // TODO\n    function add_num(x):\n        // TODO\n    function find_median():\n        // TODO",
      expectedOutput: "1.5, 2.0\n-5.0, -5.0",
      hint: "Push `x` to `lo`, pop `lo` to `hi`, and if `len(hi) > len(lo)` pop `hi` back to `lo`.",
      complexity: { time: "O(log n) add, O(1) query", space: "O(n)" },
      solutionCode:
        "class MedianFinder:\n    init():\n        lo ← MaxHeap()\n        hi ← MinHeap()\n\n    function add_num(x):\n        lo.push(x)\n        hi.push(lo.pop_max())\n        if len(hi) > len(lo):\n            lo.push(hi.pop_min())\n\n    function find_median():\n        if len(lo) > len(hi):\n            return float(lo.peek())\n        return (lo.peek() + hi.peek()) / 2.0",
    },
    practiceChallenges: [
      {
        title: "Implement Streaming MedianFinder",
        tier: "Warmup",
        goal: "Design `MedianFinder` supporting `add_num(num)` and `find_median()` on an incoming integer stream.",
        constraints: ["-10^5 <= num <= 10^5", "Target: O(log n) add, O(1) find_median"],
        examples: [
          { input: "add(1), add(2), median(), add(3), median()", output: "1.5, 2.0" },
          { input: "add(-5), add(-5), median(), add(10), median()", output: "-5.0, -5.0", explanation: "Negative duplicates split between lo and hi." },
        ],
        tasks: [
          "Push into `lo` (Max-Heap), transfer max of `lo` to `hi` (Min-Heap).",
          "If `len(hi) > len(lo)`, transfer min of `hi` back to `lo`.",
        ],
        starterCode: "class MedianFinder:\n    init():\n        // TODO",
        expectedOutput: "1.5, 2.0\n-5.0, -5.0",
        hint: "Because `len(lo) >= len(hi)` always holds, an odd total count puts the exact median at `lo.peek()`.",
        complexity: { time: "O(log n) add, O(1) median", space: "O(n)" },
        solutionCode:
          "class MedianFinder:\n    init():\n        lo ← MaxHeap()\n        hi ← MinHeap()\n    function add_num(num):\n        lo.push(num)\n        hi.push(lo.pop_max())\n        if len(hi) > len(lo):\n            lo.push(hi.pop_min())\n    function find_median():\n        if len(lo) > len(hi):\n            return float(lo.peek())\n        return (lo.peek() + hi.peek()) / 2.0",
      },
      {
        title: "Minimum Ticks for Cooldown Task Scheduler",
        tier: "Core",
        goal: "Given a list of task labels `tasks` and non-negative cooldown `n`, return the minimum total CPU ticks needed to finish all tasks so any two identical tasks have at least `n` ticks between them.",
        constraints: [
          "1 <= len(tasks) <= 10^4",
          "0 <= n <= 100",
          "Target: O(T log A) time where A is distinct task labels",
        ],
        examples: [
          { input: "tasks = ['A','A','A','B','B','B'], n = 2", output: "8" },
          { input: "tasks = ['A','A','A','B','B','B'], n = 0", output: "6" },
        ],
        tasks: [
          "Count frequencies in a Hash Map and load counts into a Max-Heap.",
          "Track cooling tasks `(remaining, ready_tick)` in a FIFO Queue and advance `tick` until both are empty.",
        ],
        starterCode: "function least_interval(tasks, n):\n    // TODO: Max-Heap + cooldown Queue",
        expectedOutput: "8\n6",
        hint: "When `max_heap` is empty during a tick, still increment `tick` (CPU idle) and check whether the queue front wakes up at `tick`.",
        complexity: { time: "O(T log A)", space: "O(A)" },
        solutionCode:
          "function least_interval(tasks, n):\n    counts ← {}\n    for t in tasks:\n        counts[t] ← counts.get(t, 0) + 1\n    max_heap ← MaxHeap(counts.values())\n    q ← Queue()\n    tick ← 0\n    while not max_heap.empty() or not q.empty():\n        tick ← tick + 1\n        if not max_heap.empty():\n            cnt ← max_heap.pop_max() - 1\n            if cnt > 0:\n                q.enqueue((cnt, tick + n))\n        if not q.empty() and q.front().ready_tick == tick:\n            (ready_cnt, _) ← q.dequeue()\n            max_heap.push(ready_cnt)\n    return tick",
      },
      {
        title: "Rearrange String Without Adjacent Duplicates",
        tier: "Stretch",
        goal: "Given a string `s`, rearrange its characters so no two adjacent characters are identical. Return any valid rearrangement, or `\"\"` if impossible.",
        constraints: [
          "1 <= len(s) <= 5000",
          "Lowercase English letters",
          "Target: O(n log A) time where A <= 26",
        ],
        examples: [
          { input: "s = \"aab\"", output: "\"aba\"" },
          { input: "s = \"aaab\"", output: "\"\"" },
        ],
        tasks: [
          "Count character frequencies and push `(count, ch)` into a Max-Heap.",
          "Hold the previously used `(prev_cnt, prev_ch)` for 1 step (`cooldown = 1`) before pushing it back into the heap.",
          "If the heap empties while `prev_cnt > 0`, return `\"\"`.",
        ],
        starterCode: "function reorganize_string(s):\n    // TODO: greedy Max-Heap with 1-step hold",
        expectedOutput: "\"aba\"\n\"\"",
        hint: "Instead of a full queue when `n = 1`, a single `prev` tuple `(prev_cnt, prev_ch)` acts as a size-1 cooldown slot.",
        complexity: { time: "O(n log A)", space: "O(A)" },
        solutionCode:
          "function reorganize_string(s):\n    counts ← {}\n    for ch in s:\n        counts[ch] ← counts.get(ch, 0) + 1\n    max_heap ← MaxHeap()\n    for (ch, cnt) in counts.items():\n        max_heap.push((cnt, ch))\n    res ← []\n    prev ← null\n    while not max_heap.empty():\n        (cnt, ch) ← max_heap.pop_max()\n        res.append(ch)\n        if prev != null:\n            max_heap.push(prev)\n            prev ← null\n        if cnt - 1 > 0:\n            prev ← (cnt - 1, ch)\n    if prev != null:\n        return \"\"\n    return join(res)",
      },
    ],
  },
};

export const dsaM15PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m15",
  title: "Module 15 Practice Set: Heaps & Priority Queues",
  description:
    "Four mixed problems covering dynamic extreme extraction, bounded selection, K-way matrix merging, and streaming center tracking.",
  problems: [
    {
      id: "dsa-m15-p1",
      title: "Last Remaining Stone Weight",
      patternHint: "Build a Max-Heap in O(n) via Floyd heapify (or negated Min-Heap), then repeatedly extract the two largest stones.",
      lessonRefId: "dsa-heap-internals",
      goal: "You are given an array `stones` of positive integer weights. On each turn, take the two heaviest stones `y >= x` and smash them together: if `x == y`, both vanish; if `x != y`, the stone of weight `y - x` remains. Return the weight of the final stone, or `0` if none remain.",
      constraints: [
        "1 <= len(stones) <= 10^4",
        "1 <= stones[i] <= 10^5",
        "Target: O(n log n) time, O(n) space",
      ],
      examples: [
        { input: "stones = [2, 7, 4, 1, 8, 1]", output: "1", explanation: "8 & 7 -> 1; 4 & 2 -> 2; 2 & 1 -> 1; 1 & 1 -> 0; remaining 1." },
        { input: "stones = [5, 5]", output: "0" },
      ],
      tasks: [
        "Heapify `stones` into a Max-Heap (or negate values in a Min-Heap).",
        "While `len(heap) > 1`, pop `y` then `x`, and push `y - x` whenever `y != x`.",
        "Return `heap[0]` if non-empty, else `0`.",
      ],
      starterCode: "function last_stone_weight(stones):\n    // TODO: simulate repeated heaviest-pair smashing",
      expectedOutput: "1\n0",
      hint: "Negating every integer into a Min-Heap gives Max-Heap extraction without writing a separate Max-Heap class.",
      complexity: { time: "O(n log n)", space: "O(n)" },
      solutionCode:
        "function last_stone_weight(stones):\n    max_heap ← MaxHeap(stones)\n    while len(max_heap) > 1:\n        y ← max_heap.pop_max()\n        x ← max_heap.pop_max()\n        if y != x:\n            max_heap.push(y - x)\n    if len(max_heap) == 0:\n        return 0\n    return max_heap.peek()",
    },
    {
      id: "dsa-m15-p2",
      title: "Closest Delivery Coordinates to Origin",
      patternHint: "Maintain a size-k Max-Heap keyed by squared distance x^2 + y^2 so the farthest kept point sits at the root for O(log k) eviction.",
      lessonRefId: "dsa-heap-top-k",
      goal: "Given an array of 2D coordinates `points` where `points[i] = [x, y]` and an integer `k`, return the `k` points closest to `(0, 0)` by Euclidean distance (comparing `x^2 + y^2` avoids square roots).",
      constraints: [
        "1 <= k <= len(points) <= 10^5",
        "-10^4 <= x, y <= 10^4",
        "Target: O(n log k) time, O(k) space",
      ],
      examples: [
        { input: "points = [[1, 3], [-2, 2]], k = 1", output: "[[-2, 2]]" },
        { input: "points = [[3, 3], [5, -1], [-2, 4]], k = 2", output: "[[3, 3], [-2, 4]]" },
      ],
      tasks: [
        "Compute `dist2 = x * x + y * y` for each point (no `sqrt` needed).",
        "Push `(dist2, x, y)` into a Max-Heap capped at size `k` (evicting the largest `dist2` whenever `len > k`).",
        "Return the `k` `[x, y]` pairs remaining in the heap.",
      ],
      starterCode: "function k_closest_points(points, k):\n    // TODO: return k closest points in O(n log k)",
      expectedOutput: "[[-2, 2]]\n[[3, 3], [-2, 4]]",
      hint: "You want the `k` SMALLEST distances, so by the Top-K inversion rule use a **Max-Heap** of size `k` (or push `(-dist2, x, y)` into a Min-Heap).",
      complexity: { time: "O(n log k)", space: "O(k)" },
      solutionCode:
        "function k_closest_points(points, k):\n    max_heap ← MaxHeap()\n    for (x, y) in points:\n        dist2 ← x * x + y * y\n        max_heap.push((dist2, x, y))\n        if len(max_heap) > k:\n            max_heap.pop_max()\n    res ← []\n    while len(max_heap) > 0:\n        (d, x, y) ← max_heap.pop_max()\n        res.append([x, y])\n    return res",
    },
    {
      id: "dsa-m15-p3",
      title: "Kth Smallest Value Across Sorted Rows",
      patternHint: "Treat the m rows as m sorted arrays and run a K-way merge Min-Heap holding (val, r, c) for at most min(m, k) active rows.",
      lessonRefId: "dsa-heap-top-k",
      goal: "Given an `m x m` matrix where each row is sorted in non-decreasing order and an integer `k` (`1 <= k <= m * m`), return the `k`th smallest element in the matrix using `O(min(m, k))` heap space.",
      constraints: [
        "1 <= m <= 500",
        "1 <= k <= m * m",
        "Target: O(k log m) time, O(m) space",
      ],
      examples: [
        { input: "matrix = [[1, 5, 9], [10, 11, 13], [12, 13, 15]], k = 8", output: "13" },
        { input: "matrix = [[-5]], k = 1", output: "-5" },
      ],
      tasks: [
        "Seed a Min-Heap with `(matrix[r][0], r, 0)` for `r` from `0` to `min(m, k) - 1`.",
        "Repeat `k` times: pop `(val, r, c)`, and if `c + 1 < m`, push `(matrix[r][c + 1], r, c + 1)`.",
        "Return the `val` popped on the `k`th iteration.",
      ],
      starterCode: "function kth_smallest_in_matrix(matrix, k):\n    // TODO: K-way merge across sorted rows",
      expectedOutput: "13\n-5",
      hint: "Only the first element of each row needs to enter the heap initially; pushing column `c + 1` happens lazily when `(r, c)` is popped.",
      complexity: { time: "O(min(m, k) + k log min(m, k))", space: "O(min(m, k))" },
      solutionCode:
        "function kth_smallest_in_matrix(matrix, k):\n    m ← len(matrix)\n    min_heap ← []\n    for r from 0 to min(m, k) - 1:\n        heap_push(min_heap, (matrix[r][0], r, 0))\n    ans ← 0\n    for step from 1 to k:\n        (val, r, c) ← heap_pop(min_heap)\n        ans ← val\n        if c + 1 < m:\n            heap_push(min_heap, (matrix[r][c + 1], r, c + 1))\n    return ans",
    },
    {
      id: "dsa-m15-p4",
      title: "Live Center Tracker for Incoming Scores",
      patternHint: "Maintain two facing heaps (Max-Heap lo and Min-Heap hi) keeping max(lo) <= min(hi) and len(lo) - len(hi) in {0, 1}.",
      lessonRefId: "dsa-two-heaps-scheduler",
      goal: "Implement `ScoreCenter()` supporting `record(score)` to ingest a new integer score and `center()` to return the current median score (average of the two middle scores when total count is even) in `O(1)` query time.",
      constraints: [
        "Up to 5 * 10^4 operations",
        "center() is called only after at least one record()",
        "Target: O(log n) record, O(1) center",
      ],
      examples: [
        { input: "record(10), record(20), center(), record(30), center(), record(5), center()", output: "15.0, 20.0, 15.0" },
        { input: "record(-4), center(), record(-4), record(8), center()", output: "-4.0, -4.0", explanation: "Single negative item returns -4.0; three items [-4, -4, 8] put -4.0 at the center." },
      ],
      tasks: [
        "Keep lower half in Max-Heap `lo` and upper half in Min-Heap `hi`.",
        "Route `score` via `lo.push(score)` -> `hi.push(lo.pop_max())` -> rebalance `lo` if `len(hi) > len(lo)`.",
        "Return `lo.peek()` when `len(lo) > len(hi)` else `(lo.peek() + hi.peek()) / 2.0`.",
      ],
      starterCode:
        "class ScoreCenter:\n    init():\n        // TODO\n    function record(score):\n        // TODO\n    function center():\n        // TODO",
      expectedOutput: "15.0, 20.0, 15.0\n-4.0, -4.0",
      hint: "Check `record(5)` after `[10, 20, 30]`: `5` stays in `lo = [10, 5]` while `hi = [20, 30]`, so `(10 + 20) / 2.0 = 15.0`.",
      complexity: { time: "O(log n) record, O(1) center", space: "O(n)" },
      solutionCode:
        "class ScoreCenter:\n    init():\n        lo ← MaxHeap()\n        hi ← MinHeap()\n\n    function record(score):\n        lo.push(score)\n        hi.push(lo.pop_max())\n        if len(hi) > len(lo):\n            lo.push(hi.pop_min())\n\n    function center():\n        if len(lo) > len(hi):\n            return float(lo.peek())\n        return (lo.peek() + hi.peek()) / 2.0",
    },
  ],
};
