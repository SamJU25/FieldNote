import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM00Lessons: Record<string, LessonContent> = {
  "dsa-what-is-dsa": {
    lessonId: "dsa-what-is-dsa",
    subtitle:
      "Understand what data structures and algorithms are, how RAM stores values at addresses, and when variables share references.",
    intro: {
      heading: "What is DSA & How Does Memory Work?",
      explanation: [
        "Write `backup = scores` and then change `scores[0] = 0`, and `backup[0]` changes to `0` too. Or scan a `100,000`-item list from slot `0` on every lookup and watch your app freeze. Both bugs happen because code ignores how values live in RAM. A **data structure** organizes values in memory for fast reads and updates, and an **algorithm** is the step-by-step recipe that transforms inputs into an answer.",
        "Every variable lives inside numbered RAM bytes. Small scalars like integers copy by value into a fresh slot, whereas containers pass a **reference** (a memory address such as `0x108`) so two variable names can end up reading and mutating the exact same bytes.",
      ],
      analogy:
        "Think of organizing books on a library shelf versus following steps to find a title: the shelf layout is the data structure, and your search steps are the algorithm. Copying a sticky note with shelf number 0x108 lets two people edit the exact same book rather than buying a second copy.",
      realWorldUses: [
        "Picking a memory layout that keeps hot lookups fast in web backends, games, and mobile apps",
        "Avoiding shared-mutation bugs when helper functions receive references instead of fresh copies",
      ],
    },
    sections: [
      {
        heading: "Memory slots, addresses, and references",
        paragraphs: [
          "Picture RAM as a long numbered street of fixed-width slots labeled in hexadecimal (`0x` marks base-16 addresses such as `0x100`, `0x104`, `0x108`). Each integer slot holds a fixed number of bits (commonly 32 or 64 bits).",
          "Assigning a plain scalar variable (`b = a`) duplicates the value into a new slot, so changing `b` leaves `a` untouched. Assigning a container reference (`alias = box`) copies only the address `0x108`, so writing `alias[0] = 77` overwrites `box[0]` as well.",
        ],
        code: [
          "// Scalar copy vs reference alias",
          "a = 42; c = a; c = 99           // Valid independent copy -> a=42, c=99",
          "box = [9, 5]; alias = box       // Shared address 0x108",
          "alias[0] = 77                   // Mutates box[0] -> box=[77, 5]",
          "",
          "// Broken swap vs working swap",
          "a = b; b = a                    // Broken: overwrites a before saving -> a=17, b=17",
          "temp = a; a = b; b = temp       // Working: saves 42 first -> a=17, b=42",
        ],
        output: "a=42, c=99 | box=[77, 5] | swap -> a=17, b=42",
        table: {
          caption: "Data structure vs algorithm vs memory model",
          headers: ["Concept", "What it governs", "Concrete example"],
          rows: [
            ["Data structure", "Memory organization & access rules", "Fixed slots, stacked frames, key-value buckets"],
            ["Algorithm", "Exact step-by-step recipe", "Find max in one scan, swap two values, count halvings"],
            ["Value copy (`b = a`)", "Separate memory slot holds a copy", "Changing `b` leaves scalar `a` unchanged"],
            ["Reference alias (`r = box`)", "Two names hold the same memory address", "Updating `r` changes what `box` sees"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Choosing a better algorithm often depends on knowing which operations the underlying memory layout makes cheap or expensive.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build Safe Variable Swap and Independent Container Copy",
      subtitle: "Move from a naive overwrite bug to a temp-slot swap and an unaliased copy.",
      steps: [
        {
          label: "Step 1: Naive overwrite loses the first value",
          explanation: "Assigning `a = b` immediately destroys `42`, so `b = a` copies `17` back onto itself.",
          code: [
            "a ← 42, b ← 17",
            "a ← b          // 42 is lost here",
            "b ← a          // both become 17",
            "print(a, b)",
          ],
          activeLines: [2, 3],
          output: "17, 17",
        },
        {
          label: "Step 2: Save a in temp before overwriting",
          explanation: "Storing `42` in one scratch slot `temp` preserves it until `b` reads `temp`.",
          code: [
            "a ← 42, b ← 17",
            "temp ← a       // save 42 before overwriting a",
            "a ← b          // a becomes 17",
            "b ← temp       // b becomes 42",
            "print(a, b)",
          ],
          activeLines: [2, 3, 4],
          output: "17, 42",
        },
        {
          label: "Step 3: Allocate new slots instead of aliasing a container",
          explanation: "Copying elements into a fresh container gives `copy` its own address so editing `copy[0]` leaves `box[0]` untouched.",
          code: [
            "box ← [9, 5]",
            "copy ← [box[0], box[1]]   // new address, not box's address",
            "copy[0] ← 77",
            "print(box[0], copy[0])",
          ],
          activeLines: [2, 3],
          output: "9, 77",
        },
      ],
    },
    walkthrough: {
      title: "Step inside RAM: slots, values, and references",
      layout: "visual-first",
      steps: [
        {
          title: "RAM addresses sit at regular byte offsets",
          tag: "MEMORY",
          explanation: [
            "Each 32-bit integer takes 4 bytes in RAM, so consecutive memory slots live at `0x100`, `0x104`, `0x108`, and `0x10C`.",
            "Nothing extra needs to be searched to inspect a known address: the CPU reads the exact byte offset directly.",
          ],
          code: [
            "a ← 42        // stored at 0x100",
            "b ← 17        // stored at 0x104",
            "box ← [9, 5]  // container starts at 0x108",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Slot size", value: "4 bytes (32-bit)" },
            { name: "Address of a", value: "0x100" },
            { name: "Start of box", value: "0x108" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Numbered RAM cells (0x100..0x10C, 4-byte stride)",
                cells: [
                  { id: "m0", value: "42", index: 0, state: "active" },
                  { id: "m1", value: "17", index: 1 },
                  { id: "m2", value: "9", index: 2 },
                  { id: "m3", value: "5", index: 3 },
                ],
                pointers: [
                  { index: 0, label: "a (0x100)", tone: "coral" },
                  { index: 1, label: "b (0x104)", tone: "accent" },
                  { index: 2, label: "box[0]", tone: "ok" },
                ],
              },
            ],
            caption: "Each variable or container element occupies a numbered address in RAM.",
          },
        },
        {
          title: "Scalar copy creates an independent slot",
          tag: "TRACE",
          explanation: [
            "Writing `c ← a` copies the integer `42` into a fresh slot at `0x110`.",
            "Right after the copy, both `a` (`0x100`) and `c` (`0x110`) hold `42`, stored in two separate locations.",
          ],
          code: [
            "c ← a         // copy 42 into 0x110",
            "c ← 99        // next: overwrite only 0x110",
            "print(a, c)   // will print 42, 99",
          ],
          activeLines: [1],
          codeLabel: "Pseudocode",
          state: [
            { name: "a (0x100)", value: "42" },
            { name: "c (0x110)", value: "42", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Value copy: c gets its own copy of 42 at 0x110",
                cells: [
                  { id: "m0", value: "42", index: 0, state: "done" },
                  { id: "m1", value: "17", index: 1, state: "dim" },
                  { id: "m2", value: "9", index: 2, state: "dim" },
                  { id: "m3", value: "5", index: 3, state: "dim" },
                  { id: "m4", value: "42", index: 4, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "a = 42", tone: "ok" },
                  { index: 4, label: "c = 42", tone: "accent" },
                ],
              },
            ],
            caption: "Copying a scalar places an independent duplicate in a new RAM slot.",
          },
        },
        {
          title: "Overwriting scalar copy c leaves a unchanged",
          tag: "TRACE",
          explanation: [
            "Next, setting `c ← 99` updates only slot `0x110`.",
            "Variable `a` at `0x100` still holds `42` because integers copy by value rather than sharing an address.",
          ],
          code: [
            "c ← a         // copy 42 into 0x110",
            "c ← 99        // overwrites only 0x110",
            "print(a, c)   // 42, 99",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "a (0x100)", value: "42" },
            { name: "c (0x110)", value: "99", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After c <- 99: a at 0x100 stays 42",
                cells: [
                  { id: "m0", value: "42", index: 0, state: "done" },
                  { id: "m1", value: "17", index: 1, state: "dim" },
                  { id: "m2", value: "9", index: 2, state: "dim" },
                  { id: "m3", value: "5", index: 3, state: "dim" },
                  { id: "m4", value: "99", index: 4, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "a = 42", tone: "ok" },
                  { index: 4, label: "c = 99", tone: "coral" },
                ],
              },
            ],
            caption: "Mutating scalar copy c leaves original slot a untouched.",
          },
        },
        {
          title: "Reference aliasing shares the same memory slot",
          tag: "PITFALL",
          explanation: [
            "Writing `alias ← box` does not clone `9` and `5`. Both `box` and `alias` hold the same starting address `0x108`.",
            "Setting `alias[0] ← 77` writes into `0x108`, so reading `box[0]` immediately returns `77` too.",
          ],
          callout: {
            kind: "WATCH OUT",
            text: "Passing a container into a function usually shares its reference. Mutate in place only when intended, or copy first when callers need the original untouched.",
          },
          code: [
            "alias ← box      // copies address 0x108",
            "alias[0] ← 77    // writes to 0x108",
            "print(box[0])    // 77",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "Shared target", value: "0x108", changed: true },
            { name: "box[0] / alias[0]", value: "77 / 77", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Aliasing: box and alias both point to 0x108",
                cells: [
                  { id: "m0", value: "42", index: 0, state: "dim" },
                  { id: "m1", value: "17", index: 1, state: "dim" },
                  { id: "m2", value: "77", index: 2, state: "active" },
                  { id: "m3", value: "5", index: 3 },
                  { id: "m4", value: "99", index: 4, state: "dim" },
                ],
                pointers: [
                  { index: 2, label: "box & alias", tone: "coral" },
                ],
              },
            ],
            caption: "Two names pointing to 0x108 observe every update through either name.",
          },
        },
        {
          title: "Save a into scratch slot temp before swapping",
          tag: "CONCEPT",
          explanation: [
            "Swapping `a` and `b` starts by saving `temp ← a` (`42`) into a scratch slot so overwriting `a` will not lose `42`.",
            "Three fixed memory reads/writes always finish in constant effort regardless of how much other data sits in RAM.",
          ],
          code: [
            "swap(a, b):",
            "    temp ← a",
            "    a ← b",
            "    b ← temp",
          ],
          activeLines: [2],
          codeLabel: "Pseudocode",
          state: [
            { name: "a (0x100)", value: "42" },
            { name: "b (0x104)", value: "17" },
            { name: "temp", value: "42", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Before overwriting a: temp saves 42",
                cells: [
                  { id: "m0", value: "42", index: 0, state: "active" },
                  { id: "m1", value: "17", index: 1 },
                  { id: "m2", value: "77", index: 2, state: "dim" },
                  { id: "m3", value: "5", index: 3, state: "dim" },
                  { id: "m4", value: "99", index: 4, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "a = 42", tone: "coral" },
                  { index: 1, label: "b = 17", tone: "accent" },
                ],
              },
              {
                label: "Scratch slot temp",
                cells: [
                  { id: "tmp", value: "42", index: 0, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "temp = 42", tone: "ok" },
                ],
              },
            ],
            caption: "Saving a into temp prevents losing 42 when b overwrites a.",
          },
        },
        {
          title: "Complete swap(a, b) by writing b into a and temp into b",
          tag: "TRACE",
          explanation: [
            "Now `a ← b` copies `17` into `0x100` and `b ← temp` restores `42` into `0x104`.",
            "Both values traded places while all unrelated slots (`0x108..0x110`) remained untouched.",
          ],
          code: [
            "swap(a, b):",
            "    temp ← a",
            "    a ← b",
            "    b ← temp",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "a (0x100)", value: "17", changed: true },
            { name: "b (0x104)", value: "42", changed: true },
            { name: "Scratch slots", value: "1 (temp = 42)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After swap(a, b) using temp",
                cells: [
                  { id: "m1", value: "17", index: 0, state: "done" },
                  { id: "m0", value: "42", index: 1, state: "done" },
                  { id: "m2", value: "77", index: 2, state: "dim" },
                  { id: "m3", value: "5", index: 3, state: "dim" },
                  { id: "m4", value: "99", index: 4, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "a = 17", tone: "ok" },
                  { index: 1, label: "b = 42", tone: "ok" },
                ],
              },
              {
                label: "Scratch slot temp",
                cells: [
                  { id: "tmp", value: "42", index: 0, state: "dim" },
                ],
              },
            ],
            caption: "Simple, deterministic slot updates form the building blocks of every algorithm.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Overwriting before saving loses a value",
        detail:
          "Writing `a ← b` followed by `b ← a` sets both to `b`. Always save `temp ← a` first when swapping values without losing data.",
      },
      {
        title: "Alias vs shallow copy confusion",
        detail:
          "Giving a container a second variable name does not copy its elements. Only explicitly creating a new container separates their memory slots.",
      },
    ],
    practiceTask: {
      title: "Safe Three-Variable Swap",
      tier: "Warmup",
      goal: "Rotate three integer variables `(a, b, c)` left by one step using a single `temp` variable so `(a, b, c)` becomes `(b, c, a)`.",
      constraints: ["Use only 1 extra scalar variable", "Do not use container allocations"],
      examples: [
        { input: "a = 10, b = 20, c = 30", output: "(20, 30, 10)", explanation: "Each value moves left; old `a` wraps to `c`." },
        { input: "a = -4, b = 0, c = 7", output: "(0, 7, -4)" },
      ],
      tasks: [
        "Store `temp = a` before overwriting `a`.",
        "Assign `a = b`, `b = c`, and finally `c = temp`.",
      ],
      starterCode: "function rotate_left_three(a, b, c):\n    // TODO: rotate values using one temp variable\n    return (a, b, c)",
      expectedOutput: "(20, 30, 10)\n(0, 7, -4)",
      hint: "Save `a` into `temp` first, shift `b` into `a`, `c` into `b`, and restore `temp` into `c`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode: "function rotate_left_three(a, b, c):\n    temp ← a\n    a ← b\n    b ← c\n    c ← temp\n    return (a, b, c)",
    },
    practiceChallenges: [
      {
        title: "Safe Three-Variable Swap",
        tier: "Warmup",
        goal: "Rotate three integer variables `(a, b, c)` left by one step using one scratch variable.",
        constraints: ["Use 1 extra variable", "Time: constant"],
        examples: [
          { input: "a = 10, b = 20, c = 30", output: "(20, 30, 10)", explanation: "Each value shifts left one position; old a wraps to c." },
          { input: "a = -4, b = 0, c = 7", output: "(0, 7, -4)" },
        ],
        tasks: ["Save `temp = a`, shift `a = b`, `b = c`, then set `c = temp`."],
        starterCode: "function rotate_left_three(a, b, c):\n    // TODO: rotate with one temp variable",
        expectedOutput: "(20, 30, 10)\n(0, 7, -4)",
        hint: "Never overwrite a variable whose value is still needed later unless you saved it in `temp`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode: "function rotate_left_three(a, b, c):\n    temp ← a\n    a ← b\n    b ← c\n    c ← temp\n    return (a, b, c)",
      },
      {
        title: "Compute Byte Offset Address",
        tier: "Core",
        goal: "Given a starting memory address `base`, fixed slot width `bytes_per_slot`, and 0-based index `k`, return the byte address of slot `k`.",
        constraints: ["0 <= base <= 10^9", "bytes_per_slot in {1, 2, 4, 8}", "0 <= k <= 10^6"],
        examples: [
          { input: "base = 256, bytes_per_slot = 4, k = 3", output: "268", explanation: "256 + 3 * 4 = 268." },
          { input: "base = 1000, bytes_per_slot = 8, k = 0", output: "1000" },
        ],
        tasks: [
          "Write `slot_address(base, bytes_per_slot, k)` in your chosen language.",
          "Compute `base + k * bytes_per_slot` directly in one math step without looping.",
        ],
        starterCode: "function slot_address(base, bytes_per_slot, k):\n    // TODO: direct offset formula\n    return address",
        expectedOutput: "268\n1000",
        hint: "Slot `0` sits at `base`; each step skips `bytes_per_slot` bytes.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode: "function slot_address(base, bytes_per_slot, k):\n    return base + k * bytes_per_slot",
      },
      {
        title: "Trace Scalar Copy vs Reference Alias",
        tier: "Stretch",
        goal: "Implement a helper `clone_and_edit(pair, delta)` that returns an updated 2-item copy `[pair[0] + delta, pair[1]]` while leaving the caller's original `pair` unchanged.",
        constraints: ["Do not mutate input `pair`", "Extra space: O(1) for fixed 2-item output"],
        examples: [
          { input: "pair = [10, 25], delta = 5", output: "new=[15, 25], original=[10, 25]", explanation: "Allocating a new pair modifies slot 0 in the copy while keeping original[0] = 10." },
          { input: "pair = [3, -8], delta = -3", output: "new=[0, -8], original=[3, -8]", explanation: "Negative delta reduces only the new pair's first slot." },
        ],
        tasks: [
          "Avoid writing `copy ← pair` because that creates a shared alias.",
          "Allocate a fresh pair `[pair[0] + delta, pair[1]]` and return it.",
        ],
        starterCode: "function clone_and_edit(pair, delta):\n    // TODO: return fresh modified pair without mutating caller input",
        expectedOutput: "new=[15, 25], original=[10, 25]\nnew=[0, -8], original=[3, -8]",
        hint: "Build a brand-new 2-element pair rather than assigning `copy = pair` and editing `copy[0]`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode: "function clone_and_edit(pair, delta):\n    return [pair[0] + delta, pair[1]]",
      },
    ],
  },

  "dsa-time-complexity": {
    lessonId: "dsa-time-complexity",
    subtitle:
      "Measure how algorithm work scales as input size n grows by counting basic operations and dropping constants.",
    intro: {
      heading: "What is Big-O Time Complexity?",
      explanation: [
        "Suppose a duplicate check on 10,000 IDs compares every pair in a nested loop: that takes 100,000,000 steps. Increase the list to 1,000,000 IDs and the same loop jumps to `10^12` steps and freezes. **Big-O notation** measures how step count grows with input size `n`, so you spot that wall before writing code.",
        "Instead of timing runs in seconds on one laptop, Big-O names the growth curve (`O(1)`, `O(log n)`, `O(n)`, `O(n²)`). Here `log₂ n` is how many times you can halve `n` to reach `1`: for `1,000,000` items, halving takes about `20` steps.",
      ],
      analogy:
        "Finding a name in a phone list of `n` people: jumping straight to slot #5 is `O(1)`, opening the middle page repeatedly (`1000 -> 500 -> 250...`) is `O(log n)`, reading line-by-line top to bottom is `O(n)`, and comparing every person against every other person is `O(n²)`.",
      realWorldUses: [
        "Checking whether an `O(n²)` loop will time out when input grows from `n = 10` to `n = 100,000`",
        "Comparing two candidate approaches by operation growth rather than hardware speed",
      ],
    },
    sections: [
      {
        heading: "Counting steps, halving (`log₂ n`), and dropping constants",
        paragraphs: [
          "Count how many times the loop runs for input size `n`. Two separate loops over `n` items plus `5` setup lines take `2n + 5` steps. Once `n` hits `100,000`, the multiplier `2` and `+ 5` barely matter compared to the linear slope, so `2n + 5` simplifies to `O(n)`.",
          "When one loop of size `n` sits *inside* another loop of size `n` (such as comparing all pairs), total checks multiply to `n × n = n²`, giving `O(n²)`. If a loop halves `n` each step (`8 -> 4 -> 2 -> 1`), it finishes in `log₂ n` steps (`O(log n)`).",
        ],
        code: [
          "# Duplicate check on n = 10^5 (100,000) items",
          "# Slow: nested loop checks n*(n-1)/2 ~= 5 * 10^9 pairs (times out)",
          "for i in range(n):",
          "    for j in range(i + 1, n):",
          "        if ids[i] == ids[j]:",
          "            return True",
          "",
          "# Fast: single pass with a seen set takes <= 10^5 steps",
          "seen = set()",
          "for x in ids:",
          "    if x in seen:",
          "        return True",
          "    seen.add(x)",
        ],
        codeLabel: "Python",
        output: "n=10^5 -> nested loop: ~5 * 10^9 steps | set pass: <= 10^5 steps (or sorted pass: ~1.7 * 10^6)",
        table: {
          caption: "Common Big-O curves compared as n increases",
          headers: ["Notation", "Name", "Steps at n = 1,000", "Steps at n = 1,000,000", "Typical operation shape"],
          rows: [
            ["`O(1)`", "Constant", "1", "1", "Direct formula or single slot read"],
            ["`O(log n)`", "Logarithmic", "~10", "~20", "Halving `n` each iteration (`8 -> 4 -> 2 -> 1`)"],
            ["`O(n)`", "Linear", "1,000", "1,000,000", "Single scan visiting each item once"],
            ["`O(n log n)`", "Linearithmic", "~10,000", "~20,000,000", "Processing `n` items across `log₂ n` halving levels"],
            ["`O(n²)`", "Quadratic", "1,000,000", "10^12 (too slow)", "Checking all pairs `(i, j)` with nested loops"],
            ["`O(2^n)`", "Exponential", "2^1000", "Uncomputable", "Branching into two choices on every step"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "RULE OF THUMB",
          text: "Always check how many operations happen on the *worst-case* input (`n` at its maximum allowed value), not on tiny sample cases.",
        },
      },
      {
        heading: "Best vs Worst Case & Reading Input-Size Signals",
        paragraphs: [
          "In linear search over `n` items, finding the target at index `0` is the best case (`1` step), near the middle is the average case (`n / 2` steps), and scanning every item when the target is missing is the worst case (`n` steps). Benchmarks measure the worst case so one bad input cannot stall your program.",
          "Before coding, match the problem's max constraint `n` against the `~10^7` steps-per-second budget to rule out algorithms that will time out.",
        ],
        table: {
          caption: "Input size `n` & code pattern -> target Big-O guide",
          headers: ["Constraint or Signal", "Fast-enough Big-O", "Watch out for", "Typical Code Shape"],
          rows: [
            ["`n <= 20`", "`O(2^n)`", "Do not force brute force above `n = 25`", "Try all subsets / recursion"],
            ["`n <= 2,000`", "`O(n²)`", "Fails once `n` reaches `10^5` (`10^10` steps)", "Nested `for i ... for j ...` loops"],
            ["`n <= 10^6`", "`O(n log n)` or `O(n)`", "Avoid nested loops over `n`", "Single pass or divide-and-merge"],
            ["`n <= 10^9` or repeated queries", "`O(log n)` or `O(1)`", "Even a single `O(n)` loop times out", "Halving (`n // 2`) or math formula"],
          ],
          highlightCol: 1,
        },
      },
    ],
    guidedBuildUp: {
      title: "Speed Up Sum 1..n From O(n) Loop to O(1) Formula",
      steps: [
        {
          label: "Step 1: Brute-force `O(n)` loop (fails at `n = 10^9`)",
          explanation: "Adding `1 + 2 + ... + n` one number at a time works at `n = 5`, yet takes a billion loop iterations when `n = 10^9`.",
          code: [
            "function slow_sum(n):",
            "    total ← 0",
            "    for i from 1 to n:      // n iterations -> too slow for 10^9",
            "        total ← total + i",
            "    return total",
          ],
          activeLines: [3, 4],
          output: "slow_sum(5) = 15 (10^9 steps at n=10^9)",
        },
        {
          label: "Step 2: Replace the loop with `O(1)` math",
          explanation: "Gauss's identity `n * (n + 1) / 2` computes the exact same answer in 3 operations regardless of `n`.",
          code: [
            "function fast_sum(n):",
            "    return (n * (n + 1)) / 2   // 3 operations for any n",
          ],
          activeLines: [2],
          output: "fast_sum(1000000) = 500000500000",
        },
        {
          label: "Step 3: Divide the even factor first",
          explanation: "Dividing whichever of `n` or `n + 1` is even before multiplying keeps intermediate numbers half as large.",
          code: [
            "function fast_sum(n):",
            "    if n mod 2 == 0:",
            "        return (n / 2) * (n + 1)",
            "    return n * ((n + 1) / 2)",
          ],
          activeLines: [2, 3, 4],
          output: "fast_sum(5) = 15",
        },
      ],
    },
    walkthrough: {
      title: "How step counts separate as n doubles",
      layout: "visual-first",
      steps: [
        {
          title: "Count steps, not seconds",
          tag: "CONCEPT",
          explanation: [
            "Four algorithms work on just `2` items (`n = 2`). Each cube is one operation.",
            "Click `n = 2`, `4`, or `8` or click any platform directly on the stage to compare growth.",
          ],
          callout: {
            kind: "WATCH OUT",
            text: "Small test inputs hide slow `O(n²)` loops until `n` grows large.",
          },
          code: [
            "const_op(a):      1 step            // O(1)",
            "halve_op(n):      while n > 1: n//2 // O(log n)",
            "linear_op(n):     for i in 1..n     // O(n)",
            "quad_op(n):       for i..n for j..n // O(n²)",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Input size n", value: "2", changed: true },
            { name: "O(1) / O(log n)", value: "1 / 1" },
            { name: "O(n) / O(n²)", value: "2 / 4" },
          ],
          visual: {
            kind: "dsa-growth",
            n: 2,
            activeTier: "all",
            tiers: [
              { id: "const", label: "O(1)", name: "constant", steps: 1 },
              { id: "log", label: "O(log n)", name: "logarithmic", steps: 1 },
              { id: "linear", label: "O(n)", name: "linear", steps: 2 },
              { id: "quad", label: "O(n²)", name: "quadratic", steps: 4 },
            ],
            caption: "At n = 2, all four curves stay small enough to look similar.",
          },
        },
        {
          title: "Double the input to n = 4",
          tag: "TRACE",
          explanation: [
            "Doubling `n` from `2` to `4` separates linear from quadratic work.",
            "`O(1)` stays `1`, `O(log n)` adds `+1`, `O(n)` doubles (`4`), and `O(n²)` jumps `4x` (`16`).",
          ],
          code: [
            "benchmarks(n = 4):",
            "    cost_1    ← 1",
            "    cost_log  ← 2      // log₂(4)",
            "    cost_n    ← 4",
            "    cost_quad ← 16     // 4 × 4",
          ],
          activeLines: [4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Input size n", value: "4", changed: true },
            { name: "O(n) steps", value: "4", changed: true },
            { name: "O(n²) steps", value: "16", changed: true },
          ],
          visual: {
            kind: "dsa-growth",
            n: 4,
            activeTier: "all",
            tiers: [
              { id: "const", label: "O(1)", name: "constant", steps: 1 },
              { id: "log", label: "O(log n)", name: "logarithmic", steps: 2 },
              { id: "linear", label: "O(n)", name: "linear", steps: 4 },
              { id: "quad", label: "O(n²)", name: "quadratic", steps: 16 },
            ],
            caption: "Doubling n from 2 to 4 multiplies quadratic work by 4.",
          },
        },
        {
          title: "Double again to n = 8",
          tag: "TRACE",
          explanation: [
            "At `n = 8`, `O(log n)` takes `3` steps and `O(n)` takes `8` steps, while `O(n²)` jumps to `64` steps.",
            "Big-O keeps that dominant curve and drops constant multipliers like `2n` or `+ 5`.",
          ],
          code: [
            "benchmarks(n = 8):",
            "    cost_1    ← 1",
            "    cost_log  ← 3      // 8 -> 4 -> 2 -> 1",
            "    cost_n    ← 8",
            "    cost_quad ← 64     // 8 × 8",
          ],
          activeLines: [3, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "Input size n", value: "8", changed: true },
            { name: "O(log n) / O(n)", value: "3 / 8" },
            { name: "O(n²) steps", value: "64", changed: true },
          ],
          visual: {
            kind: "dsa-growth",
            n: 8,
            activeTier: "all",
            tiers: [
              { id: "const", label: "O(1)", name: "constant", steps: 1 },
              { id: "log", label: "O(log n)", name: "logarithmic", steps: 3 },
              { id: "linear", label: "O(n)", name: "linear", steps: 8 },
              { id: "quad", label: "O(n²)", name: "quadratic", steps: 64 },
            ],
            caption: "At n = 8, O(n²) takes 64 steps versus 3 steps for O(log n).",
          },
        },
        {
          title: "Spotlight: O(log n) cuts n in half",
          tag: "PATTERN",
          explanation: [
            "When every step divides the remaining work by 2, doubling `n` adds only 1 extra step.",
            "Even at `n = 1,000,000`, `log₂(1,000,000)` is about `20` steps.",
          ],
          callout: {
            kind: "KEY IDEA",
            text: "Whenever each iteration shrinks `n` by a constant factor (such as `n // 2`), think `O(log n)`.",
          },
          code: [
            "halve_count(n):",
            "    steps ← 0",
            "    while n > 1:",
            "        n ← floor(n / 2)",
            "        steps ← steps + 1",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Active curve", value: "O(log n)", changed: true },
            { name: "Steps at n = 8", value: "3" },
            { name: "Steps at n = 1,000,000", value: "~20" },
          ],
          visual: {
            kind: "dsa-growth",
            n: 8,
            activeTier: "log",
            tiers: [
              { id: "const", label: "O(1)", name: "constant", steps: 1 },
              { id: "log", label: "O(log n)", name: "logarithmic", steps: 3 },
              { id: "linear", label: "O(n)", name: "linear", steps: 8 },
              { id: "quad", label: "O(n²)", name: "quadratic", steps: 64 },
            ],
            caption: "O(log n) adds only +1 step each time input size doubles.",
          },
        },
        {
          title: "Spotlight: O(n) scales proportionally",
          tag: "PATTERN",
          explanation: [
            "Visiting each item from `1` to `n` once takes `n` steps. Doubling `n` doubles the step count.",
          ],
          code: [
            "find_sum(n):",
            "    total ← 0",
            "    for i from 1 to n:",
            "        total ← total + i",
            "    return total",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Active curve", value: "O(n)", changed: true },
            { name: "Steps at n = 8", value: "8" },
          ],
          visual: {
            kind: "dsa-growth",
            n: 8,
            activeTier: "linear",
            tiers: [
              { id: "const", label: "O(1)", name: "constant", steps: 1 },
              { id: "log", label: "O(log n)", name: "logarithmic", steps: 3 },
              { id: "linear", label: "O(n)", name: "linear", steps: 8 },
              { id: "quad", label: "O(n²)", name: "quadratic", steps: 64 },
            ],
            caption: "O(n) scales proportionally: doubling input doubles the work.",
          },
        },
        {
          title: "Spotlight: O(n²) multiplies loops",
          tag: "PITFALL",
          explanation: [
            "When an inner loop of size `n` runs inside an outer loop of size `n`, operations multiply to `n × n = n²`.",
            "Replacing a nested loop with a direct formula or single pass drops runtime dramatically as `n` grows.",
          ],
          code: [
            "count_pairs(n):",
            "    total ← 0",
            "    for i from 1 to n:",
            "        for j from 1 to n:",
            "            total ← total + 1",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Active curve", value: "O(n²)", changed: true },
            { name: "Steps at n = 8", value: "64" },
          ],
          visual: {
            kind: "dsa-growth",
            n: 8,
            activeTier: "quad",
            tiers: [
              { id: "const", label: "O(1)", name: "constant", steps: 1 },
              { id: "log", label: "O(log n)", name: "logarithmic", steps: 3 },
              { id: "linear", label: "O(n)", name: "linear", steps: 8 },
              { id: "quad", label: "O(n²)", name: "quadratic", steps: 64 },
            ],
            caption: "O(n²) grows quadratically and hits limits once n passes a few thousand.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Dropping constants does not drop distinct variables",
        detail:
          "`2n + 5` simplifies to `O(n)`, while a loop of `n` followed by a loop of `m` stays `O(n + m)` because `m` could be much larger than `n`.",
      },
      {
        title: "Hidden O(log n) loops can also double upward",
        detail:
          "Multiplying a loop variable by `2` each step (`p = p * 2` while `p < n`) runs `O(log n)` times, just like dividing `n` by `2`.",
      },
      {
        title: "Big-O vs Omega, Theta, and Amortized bounds",
        detail:
          "Textbooks write `Omega` for lower bounds, `Theta` for tight bounds, and `O` for upper bounds (in practice `O(...)` usually states the tight worst-case bound). When an occasional slow step like array resizing averages out across many fast steps, that average cost is called **amortized** `O(1)`.",
      },
    ],
    practiceTask: {
      title: "Halving Counter in O(log n)",
      tier: "Warmup",
      goal: "Given a positive integer `n`, count how many integer halvings (`floor(n / 2)`) reach `0`.",
      constraints: ["1 <= n <= 10^18", "Target time: O(log n)", "Extra space: O(1)"],
      examples: [
        { input: "n = 8", output: "4", explanation: "8 -> 4 -> 2 -> 1 -> 0 (4 steps)." },
        { input: "n = 1000000", output: "20", explanation: "About log₂(10^6) steps." },
      ],
      tasks: [
        "Write `count_halvings(n)` in your chosen language (Python, C++, Java, JS).",
        "Loop while `n > 0`, integer-divide `n` by `2`, and increment `steps`.",
      ],
      starterCode: "function count_halvings(n):\n    // TODO: count integer halvings until n == 0\n    return steps",
      expectedOutput: "4\n20",
      hint: "Keep `steps = 0`, divide `n = floor(n / 2)` inside `while n > 0`, and add `1` to `steps`.",
      complexity: { time: "O(log n)", space: "O(1)" },
      solutionCode: "function count_halvings(n):\n    steps ← 0\n    while n > 0:\n        n ← floor(n / 2)\n        steps ← steps + 1\n    return steps",
    },
    practiceChallenges: [
      {
        title: "Halving Counter in O(log n)",
        tier: "Warmup",
        goal: "Given a positive integer `n`, count how many integer halvings (`floor(n / 2)`) reach `0`.",
        constraints: ["1 <= n <= 10^18", "Target time: O(log n)", "Extra space: O(1)"],
        examples: [
          { input: "n = 8", output: "4", explanation: "8 -> 4 -> 2 -> 1 -> 0 takes 4 steps." },
          { input: "n = 1000000", output: "20" },
        ],
        tasks: ["Loop while `n > 0`, halve `n`, and count iterations."],
        starterCode: "function count_halvings(n):\n    // TODO: halve n until 0",
        expectedOutput: "4\n20",
        hint: "Use integer division (`// 2` in Python, `/ 2` on integers in C++/Java).",
        complexity: { time: "O(log n)", space: "O(1)" },
        solutionCode: "function count_halvings(n):\n    steps ← 0\n    while n > 0:\n        n ← floor(n / 2)\n        steps ← steps + 1\n    return steps",
      },
      {
        title: "Sum 1 to n in O(1) Instead of O(n)",
        tier: "Core",
        goal: "Compute `1 + 2 + ... + n` in O(1) time so `n = 10^9` finishes in one arithmetic step without a loop.",
        constraints: ["1 <= n <= 10^9 (use 64-bit integer)", "Target time: O(1)", "Extra space: O(1)"],
        examples: [
          { input: "n = 5", output: "15", explanation: "1 + 2 + 3 + 4 + 5 = 15." },
          { input: "n = 1000000", output: "500000500000" },
        ],
        tasks: [
          "Avoid looping `i = 1..n` because `n = 10^9` exceeds 1-second budgets.",
          "Apply the arithmetic sum formula `n * (n + 1) / 2` using 64-bit integers.",
        ],
        starterCode: "function fast_sum(n):\n    // TODO: compute 1 + 2 + ... + n in O(1) steps",
        expectedOutput: "15\n500000500000",
        hint: "Either `n` or `n + 1` is always even, so divide the even one first (`if n mod 2 == 0: (n / 2) * (n + 1)`) to avoid unnecessary intermediate growth.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode: "function fast_sum(n):\n    if n mod 2 == 0:\n        return (n / 2) * (n + 1)\n    return n * ((n + 1) / 2)",
      },
      {
        title: "Smallest Power of Two >= n",
        tier: "Stretch",
        goal: "Return the smallest power of `2` (`1, 2, 4, 8, ...`) that is greater than or equal to `n` in `O(log n)` steps.",
        constraints: ["1 <= n <= 10^15", "Target time: O(log n)", "Extra space: O(1)"],
        examples: [
          { input: "n = 5", output: "8", explanation: "4 < 5, and 8 >= 5." },
          { input: "n = 16", output: "16" },
        ],
        tasks: [
          "Start `p = 1` and double `p = p * 2` while `p < n`.",
          "Observe why multiplying by `2` matches `O(log n)` growth.",
        ],
        starterCode: "function next_power_of_two(n):\n    // TODO: double p starting from 1 until p >= n",
        expectedOutput: "8\n16",
        hint: "Use 64-bit integers (`long long` / `long`) so doubling near `10^15` never overflows.",
        complexity: { time: "O(log n)", space: "O(1)" },
        solutionCode: "function next_power_of_two(n):\n    p ← 1\n    while p < n:\n        p ← p * 2\n    return p",
      },
    ],
  },

  "dsa-loops-space-limits": {
    lessonId: "dsa-loops-space-limits",
    subtitle:
      "Count steps inside sequential, nested, and triangular loops, measure extra RAM usage, and read 10^7 constraint limits.",
    intro: {
      heading: "How Do Loops, Space Complexity & Constraints Fit Together?",
      explanation: [
        "A pair-checking loop (`for i = 0..n-1: for j = i..n-1`) finishes in under `5` milliseconds on `n = 1,000` items (`500,500` checks), so it passes local tests. Run that exact code on `n = 100,000` items and it attempts `~5 × 10^9` checks, hitting Time Limit Exceeded (TLE) against the `~10^7` steps-per-second limit. Counting loop bounds reveals whether loops add (`n + n = O(n)`) or multiply (`n × n = O(n²)`).",
        "Alongside time, **space complexity** measures only the *extra* memory your algorithm allocates beyond the caller's input (auxiliary space). Combining loop step counts with extra RAM usage lets you reject `O(n²)` loops and giant scratch buffers before writing code.",
      ],
      analogy:
        "Packing boxes for a move: carrying items one by one down a hallway takes `O(n)` trips using `O(1)` extra hand space, whereas piling every box into a rented spare truck allocates `O(n)` extra space first.",
      realWorldUses: [
        "Reading `n <= 10^5` in a problem statement and ruling out `O(n²)` nested or triangular loops before writing code",
        "Saving RAM on large inputs by keeping running scalar accumulators (`O(1)` space) instead of allocating duplicate lists (`O(n)` space)",
      ],
    },
    sections: [
      {
        heading: "Loop patterns, auxiliary space, and safe n limits",
        paragraphs: [
          "Consecutive loops run one after another, so their costs add (`O(n) + O(n) = O(n)`). Nested loops multiply, even when the inner loop shrinks with `i`: at `n = 8`, `8 + 7 + ... + 1 = 36` steps; at `n = 100,000`, `n(n + 1)/2 = 5,000,050,000` steps—still `O(n²)` and far past `10^7` steps per second.",
          "Typical interview and contest judges execute roughly `10^7` simple operations per second. Pick a loop structure whose worst-case count stays below `10^7`, and keep extra allocations within memory limits.",
        ],
        code: [
          "// Slow: triangular nested loop -> 5,000,050,000 steps at n = 100,000 (TLE)",
          "for i from 0 to n - 1:",
          "    for j from i to n - 1: checks += 1",
          "",
          "// Fast: two sequential loops -> 200,000 steps at n = 100,000 (OK, O(1) space)",
          "for x in vals: total += x",
          "for x in vals: if x > total / len(vals): above += 1",
        ],
        output: "n=100,000 -> nested: 5x10^9 steps (TLE) vs sequential: 2x10^5 steps (OK)",
        table: {
          caption: "Safe input limit guide (~10^7 ops/sec) & loop patterns",
          headers: ["Pattern", "Time cost", "Auxiliary space", "Max safe `n` (1s)"],
          rows: [
            ["Direct math / formula", "`O(1)`", "`O(1)`", "Up to `10^18`"],
            ["Single halving loop (`n //= 2`)", "`O(log n)`", "`O(1)`", "Up to `10^18`"],
            ["One pass or two sequential loops", "`O(n)`", "`O(1)` (scalars only)", "Up to `10^6`"],
            ["Divide & combine (`n × log₂ n`)", "`O(n log n)`", "Depends on method", "Up to `2 × 10^5`"],
            ["Nested `(i, j)` or triangular loop", "`O(n²)`", "`O(1)`", "Up to `~3,000`"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Auxiliary space excludes the caller's input container. Creating a new list of size `n` uses `O(n)` extra space, whereas keeping scalar counters (`best`, `total`) uses `O(1)` extra space.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Count Pairs With Even Sum: From O(n²) TLE to O(n), O(1) Space",
      subtitle: "Replace a nested pair scan with parity counters so n = 10^5 finishes in one pass.",
      steps: [
        {
          label: "Step 1: Nested pair loop (times out at n = 10^5)",
          explanation: "Checking every `(i, j)` pair works on 4 numbers (`6` checks) yet runs `~5 × 10^9` iterations at `n = 10^5`.",
          code: [
            "function count_even_pairs_slow(arr):",
            "    ans ← 0",
            "    for i from 0 to len(arr) - 1:",
            "        for j from i + 1 to len(arr) - 1:",
            "            if (arr[i] + arr[j]) mod 2 == 0: ans += 1",
            "    return ans",
          ],
          activeLines: [3, 4, 5],
          output: "[1, 2, 3, 4] -> 2 pairs (TLE at n=10^5)",
        },
        {
          label: "Step 2: Separate into two O(n) buffers (O(n) time, O(n) extra space)",
          explanation: "An even sum comes from `even + even` or `odd + odd`. Grouping into two lists drops time to `O(n)` while allocating `O(n)` extra RAM.",
          code: [
            "function count_even_pairs_buf(arr):",
            "    evens ← [], odds ← []   // O(n) extra space",
            "    for x in arr:",
            "        if x mod 2 == 0: evens.append(x)",
            "        else: odds.append(x)",
            "    e ← len(evens), o ← len(odds)",
            "    return e * (e - 1) / 2 + o * (o - 1) / 2",
          ],
          activeLines: [2, 6, 7],
          output: "[1, 2, 3, 4] -> 2 pairs (O(n) space)",
        },
        {
          label: "Step 3: Replace buffers with two scalar counters (O(n) time, O(1) space)",
          explanation: "Because only the counts `e` and `o` are needed, keeping two scalar integers gives `O(1)` auxiliary space.",
          code: [
            "function count_even_pairs(arr):",
            "    e ← 0, o ← 0            // O(1) auxiliary space",
            "    for x in arr:",
            "        if x mod 2 == 0: e += 1",
            "        else: o += 1",
            "    return e * (e - 1) / 2 + o * (o - 1) / 2",
          ],
          activeLines: [2, 4, 5, 6],
          output: "[1, 2, 3, 4] -> 2 pairs (O(1) space)",
        },
      ],
    },
    walkthrough: {
      title: "Tracing loop step counts and auxiliary space",
      layout: "visual-first",
      steps: [
        {
          title: "Sequential loops add: n + n = O(n)",
          tag: "CONCEPT",
          explanation: [
            "Loop 1 scans `n` numbers (`4` steps) and Loop 2 scans `n` numbers again (`4` steps). Total work is `4 + 4 = 8` (`2n`), which stays linear `O(n)`.",
            "Extra memory holds only scalar counters (`sum`, `count`), so auxiliary space is `O(1)`.",
          ],
          code: [
            "sum ← 0, above ← 0",
            "for i from 1 to n: sum ← sum + val(i)",
            "avg ← sum / n",
            "for i from 1 to n: if val(i) > avg: above += 1",
          ],
          activeLines: [2, 4],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "total, above = 0, 0",
              "for x in vals: total += x",
              "avg = total / len(vals)",
              "for x in vals:",
              "    if x > avg: above += 1",
            ],
            activeLines: [2, 5],
          },
          state: [
            { name: "Loop 1 + Loop 2", value: "4 + 4 = 8 steps (O(n))", changed: true },
            { name: "Extra RAM slots", value: "2 scalars -> O(1)" },
          ],
          visual: {
            kind: "dsa-growth",
            n: 8,
            activeTier: "const",
            tiers: [
              { id: "const", label: "2 slots", name: "O(1) scalar variables", steps: 2 },
              { id: "linear", label: "2n", name: "O(n) sequential loop steps", steps: 16 },
            ],
            caption: "Sequential loops add up to 2n steps (O(n) time) while keeping only 2 scalar variables (O(1) extra space).",
          },
        },
        {
          title: "Nested and triangular loops multiply to O(n²)",
          tag: "PITFALL",
          explanation: [
            "For `n = 8`, `j` starting at `i` runs `8 + 7 + ... + 1 = 36` checks (`n(n + 1)/2`), versus `16` for two sequential loops and `64` for a full square.",
            "Half of `n²` is still proportional to `n²`: at `n = 100,000`, `n(n + 1)/2 ≈ 5 × 10^9` steps, which far exceeds `10^7` per second.",
          ],
          code: [
            "checks ← 0",
            "for i from 0 to n - 1:",
            "    for j from i to n - 1:",
            "        checks ← checks + 1",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "n = 8 checks", value: "8+7+...+1 = 36", changed: true },
            { name: "n = 10^5 checks", value: "~5 × 10^9 (TLE!)", changed: true },
          ],
          visual: {
            kind: "dsa-growth",
            n: 8,
            activeTier: "quad",
            tiers: [
              { id: "linear", label: "2n", name: "two sequential", steps: 16 },
              { id: "log", label: "n(n+1)/2", name: "triangular", steps: 36 },
              { id: "quad", label: "n²", name: "full square", steps: 64 },
            ],
            caption: "At n = 8, triangular loops (36 steps) stay roughly half of full n² (64), still quadratic O(n²).",
          },
        },
        {
          title: "Different inputs use separate variables: O(a + b) vs O(a × b)",
          tag: "TRACE",
          explanation: [
            "With `a = 4` and `b = 8`, running Loop 1 (`a` steps) followed by Loop 2 (`b` steps) totals `4 + 8 = 12` steps (`O(a + b)`).",
            "Nesting the `b = 8` loop inside the `a = 4` loop multiplies steps to `4 × 8 = 32` (`O(a * b)`).",
          ],
          code: [
            "// Example: a = 4, b = 8",
            "// Sequential: O(a + b) -> 12 steps",
            "for i from 1 to a: work()",
            "for j from 1 to b: work()",
            "// Nested: O(a * b) -> 32 steps",
            "for i from 1 to a: for j from 1 to b: work()",
          ],
          activeLines: [3, 4, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "a = 4, b = 8 (seq)", value: "12 steps" },
            { name: "a = 4, b = 8 (nested)", value: "32 steps", changed: true },
          ],
          visual: {
            kind: "dsa-growth",
            n: 8,
            activeTier: "all",
            tiers: [
              { id: "linear", label: "a + b", name: "4 + 8 sequential", steps: 12 },
              { id: "quad", label: "a × b", name: "4 × 8 nested", steps: 32 },
            ],
            caption: "At a = 4 and b = 8, sequential bounds add (12) while nested bounds multiply (32).",
          },
        },
        {
          title: "Allocating an n-sized buffer uses O(n) extra space",
          tag: "CONCEPT",
          explanation: [
            "Suppose a function builds a scratch copy `buffer` of length `n` to store intermediate results.",
            "Even if the loop runs quickly in `O(n)` time, auxiliary space grows linearly as `O(n)` instead of `O(1)`.",
          ],
          code: [
            "with_buffer(n):",
            "    buffer ← allocate n slots  // O(n) extra space",
            "    for i from 0 to n - 1:",
            "        buffer[i] ← i * 2",
          ],
          activeLines: [2],
          codeLabel: "Pseudocode",
          state: [
            { name: "Time cost", value: "O(n)" },
            { name: "Extra RAM", value: "O(n) buffer slots", changed: true },
          ],
          visual: {
            kind: "dsa-growth",
            n: 8,
            activeTier: "linear",
            tiers: [
              { id: "const", label: "1 slot", name: "O(1) in-place scalars", steps: 1 },
              { id: "linear", label: "n slots", name: "O(n) extra buffer array", steps: 8 },
            ],
            caption: "Every new element added to input n allocates another scratch slot in RAM, scaling auxiliary space to O(n).",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Auxiliary space vs total space",
        detail:
          "Input of size `n` already exists in RAM. When comparing two algorithms on the same input, auxiliary space measures the *extra* memory each algorithm creates.",
      },
      {
        title: "Halving outer loop + linear inner work",
        detail:
          "If an outer loop halves `n` (`O(log n)`) and its inner loop runs `n` steps every round, steps multiply to `O(n log n)`, making it fast enough for `n <= 2 × 10^5`.",
      },
    ],
    practiceTask: {
      title: "Count Triangular Loop Iterations",
      tier: "Warmup",
      goal: "Given `n`, compute how many total times the inner body runs in `for i = 0..n-1: for j = i..n-1` in `O(1)` time without running the nested loop.",
      constraints: ["1 <= n <= 10^9", "Target time: O(1)", "Extra space: O(1)"],
      examples: [
        { input: "n = 4", output: "10", explanation: "4 + 3 + 2 + 1 = 10." },
        { input: "n = 100000", output: "5000050000", explanation: "Demonstrates why O(n²) times out at 10^5." },
      ],
      tasks: [
        "Observe that `j` from `i` to `n - 1` executes `n + (n - 1) + ... + 1` iterations.",
        "Return `n * (n + 1) / 2` using 64-bit integer arithmetic.",
      ],
      starterCode: "function count_triangular_steps(n):\n    // TODO: return exact iteration count in O(1)",
      expectedOutput: "10\n5000050000",
      hint: "Divide the even factor of `n` or `n + 1` by `2` first using 64-bit integers.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode: "function count_triangular_steps(n):\n    if n mod 2 == 0:\n        return (n / 2) * (n + 1)\n    return n * ((n + 1) / 2)",
    },
    practiceChallenges: [
      {
        title: "Count Triangular Loop Iterations",
        tier: "Warmup",
        goal: "Compute the exact iteration count of `for i = 0..n-1: for j = i..n-1` in `O(1)` time.",
        constraints: ["1 <= n <= 10^9", "Target time: O(1)", "Extra space: O(1)"],
        examples: [
          { input: "n = 4", output: "10", explanation: "4 + 3 + 2 + 1 = 10." },
          { input: "n = 100000", output: "5000050000", explanation: "Demonstrates why O(n^2) times out at 10^5 while the formula finishes in O(1)." },
        ],
        tasks: ["Use the triangular number formula `n * (n + 1) / 2` with 64-bit math."],
        starterCode: "function count_triangular_steps(n):\n    // TODO: compute iteration count in O(1)",
        expectedOutput: "10\n5000050000",
        hint: "Even when `j` starts at `i`, the loop count stays `O(n²)`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode: "function count_triangular_steps(n):\n    if n mod 2 == 0:\n        return (n / 2) * (n + 1)\n    return n * ((n + 1) / 2)",
      },
      {
        title: "Find Minimum and Maximum in One Pass",
        tier: "Core",
        goal: "Given `n` numbers in sequence `vals`, return `(min_val, max_val)` in one pass using `O(1)` extra space instead of copying or sorting.",
        constraints: ["1 <= len(vals) <= 10^6", "Target time: O(n)", "Extra space: O(1)"],
        examples: [
          { input: "vals = [7, -2, 19, 4, 0]", output: "(-2, 19)" },
          { input: "vals = [5]", output: "(5, 5)" },
        ],
        tasks: [
          "Initialize both `lo` and `hi` to `vals[0]`.",
          "Scan `vals` once, updating `lo` when smaller and `hi` when larger.",
        ],
        starterCode: "function min_max_single_pass(vals):\n    // TODO: single O(n) pass with two scalar variables",
        expectedOutput: "(-2, 19)\n(5, 5)",
        hint: "Only two scalar variables (`lo`, `hi`) are needed beyond the input itself.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode: "function min_max_single_pass(vals):\n    lo ← vals[0]\n    hi ← vals[0]\n    for each x in vals:\n        if x < lo: lo ← x\n        if x > hi: hi ← x\n    return (lo, hi)",
      },
      {
        title: "10^7 Constraint Feasibility Estimator",
        tier: "Stretch",
        goal: "Write a helper `passes_budget(n, nested_depth)` that returns `true` when `n^nested_depth <= 10^7` without overflowing integers when `n` is huge.",
        constraints: ["1 <= n <= 10^9", "nested_depth in {1, 2, 3}", "Do not compute huge n^3 blindly"],
        examples: [
          { input: "n = 3000, nested_depth = 2", output: "true", explanation: "3000² = 9,000,000 <= 10^7." },
          { input: "n = 100000, nested_depth = 2", output: "false", explanation: "10^10 > 10^7." },
        ],
        tasks: [
          "Multiply `ops = ops * n` `nested_depth` times, returning `false` early if `ops > 10,000,000` (or comparing before multiplying).",
          "Return `true` if `ops <= 10,000,000`.",
        ],
        starterCode: "function passes_budget(n, nested_depth):\n    // TODO: check n^nested_depth <= 10^7 without overflow",
        expectedOutput: "true\nfalse",
        hint: "Use `limit = 10000000`: before `ops = ops * n`, check `if ops > limit / n: return false` so 32-bit multiplication never overflows!",
        complexity: { time: "O(nested_depth)", space: "O(1)" },
        solutionCode: "function passes_budget(n, nested_depth):\n    limit ← 10000000\n    ops ← 1\n    for k from 1 to nested_depth:\n        if n > limit / ops:\n            return false\n        ops ← ops * n\n    return true",
      },
    ],
  },
  "dsa-p-vs-np": {
    lessonId: "dsa-p-vs-np",
    subtitle:
      "Distinguish polynomial-time solvability (P) from polynomial-time verification (NP), understand reductions and NP-Completeness, and apply practical heuristics when no fast exact algorithm is known.",
    intro: {
      heading: "P vs NP & Algorithmic Complexity Classes",
      explanation: [
        "A brute-force Subset Sum solver finishes in `32,768` steps at `n = 15`, yet explodes to `2^40 = 1.1 × 10^12` steps and hangs at `n = 40`. Hand someone a proposed answer—say indices `[1, 4]` for `nums = [4, 7, 1, 9, 5]` and `target = 12`—and checking `7 + 5 == 12` takes just `2` additions (`O(n)`).",
        "**P** collects decision problems solvable in polynomial time (`O(n^k)`). **NP** collects problems whose yes-answers (certificates) can be **verified** in polynomial time. Spotting an NP-Complete core early stops you from chasing a nonexistent `O(n log n)` exact algorithm.",
      ],
      analogy:
        "Solving a blank 25x25 Sudoku puzzle from scratch forces millions of backtracking guesses, whereas checking a completed grid takes seconds: scan each row, column, and box once. Solving feels hard; verifying is fast.",
      realWorldUses: [
        "Recognizing when a routing, scheduling, or subset-packing task is NP-Complete so teams choose bitmask DP, approximation, or SAT solvers",
        "Spotting reductions from known NP-Hard cores like 3-SAT or Subset Sum when an algorithm times out past n = 25",
      ],
    },
    sections: [
      {
        heading: "Polynomial Solving (P) vs Polynomial Verification (NP)",
        paragraphs: [
          "A problem sits in **P** when an algorithm computes the answer in at most `c * n^k` operations for some constant exponent `k`. A problem sits in **NP** (Nondeterministic Polynomial time) when any `true` instance has a short proof or candidate (**certificate**) that a deterministic verifier validates in polynomial time.",
          "Compare two graph questions on `V` vertices and `E` edges: shortest path between `s` and `t` is in **P** (`BFS` or `Dijkstra` solves it in `O(V + E)` or `O(E log V)`). **Hamiltonian Cycle** (visiting every vertex once) is in **NP**: checking `[v0, v1, ..., v_{n-1}]` takes `O(V)` steps, while every known exact solver takes exponential time (`O(2^n * n^2)` Held-Karp or `O(n!)` brute force).",
        ],
        code: [
          "// Certificate verification on nums = [4, 7, 1, 9, 5], target = 12:",
          "verify(nums, 12, [1, 4])   // Valid: distinct indices 1, 4 -> 7 + 5 = 12 -> true (2 steps)",
          "verify([6, 3, 2], 12, [0, 0]) // Invalid: index 0 reused -> false (rejected)",
          "// Versus blind solve at n = 40 -> 2^40 = 1.1 x 10^12 subset checks (TLE)",
        ],
        output: "verify([1, 4]) -> true | verify([0, 0]) -> false",
        table: {
          caption: "Comparing Complexity Classes by Solving Cost vs Verification Cost",
          headers: ["Class", "Meaning", "Solving Cost (Known)", "Verifying Cost", "Classic Examples"],
          rows: [
            ["`P`", "Solvable in polynomial time", "`O(n^k)`", "`O(n^k)`", "Sorting, Binary Search, BFS Shortest Path, MST"],
            ["`NP`", "Yes-instance verifiable in `O(n^k)`", "`O(n^k)` or exponential", "`O(n^k)` with certificate", "Sudoku, Subset Sum, 3-SAT, Hamiltonian Cycle"],
            ["`NP-Complete`", "In `NP` and every `NP` problem reduces to it", "Exponential best known", "`O(n^k)` with certificate", "3-SAT, Clique, Vertex Cover, 0/1 Knapsack decision"],
            ["`NP-Hard`", "At least as hard as every problem in `NP`", "Exponential / undecidable", "Need not be in `NP`", "TSP optimization, Halting Problem (undecidable)"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "KEY IDEA",
          text: "`NP` stands for Nondeterministic Polynomial time. Every `P` problem is also in `NP` because you can ignore the certificate and re-run the polynomial solver directly.",
        },
        visual: {
          kind: "dsa-growth",
          n: 16,
          activeTier: "all",
          tiers: [
            { id: "const", label: "O(1)", name: "Direct check", steps: 1 },
            { id: "log", label: "O(n)", name: "NP Certificate Verify", steps: 16 },
            { id: "linear", label: "O(n^2)", name: "Polynomial P Bound", steps: 256 },
            { id: "quad", label: "O(2^n)", name: "Exact Exponential Search", steps: 65536 },
          ],
          caption: "At n = 16, verifying one candidate certificate takes 16 steps while brute-force explores 65,536 subsets.",
        },
      },
      {
        heading: "Reductions, NP-Completeness & Practical Escapes",
        paragraphs: [
          "To prove a new problem `B` is **NP-Complete**, do two steps: (1) show `B` is in **NP** by writing a polynomial verifier, and (2) pick a known NP-Complete problem `A` and give a polynomial-time **reduction** mapping any instance of `A` into an instance of `B` with the same yes/no answer. If `B` had an `O(n^k)` solver, `A` (and all of `NP`) would become polynomial too.",
          "Reduction direction decides whether the proof holds: transform from known hard problem `A` to your problem `B` (`A <=_p B`). When you hit an NP-Hard core on real data, pick small `n` (`O(2^n)` bitmask DP for `n <= 20`), pseudo-polynomial DP (`O(n * W)` when `W <= 10^4`), approximation (`2x` Vertex Cover), or SAT/ILP solvers.",
        ],
        table: {
          caption: "Practical Escape Strategies When Facing NP-Hard Problems",
          headers: ["Structural Property", "Technique", "Resulting Complexity", "When It Works"],
          rows: [
            ["Tiny input (`n <= 22`)", "Bitmask DP / Meet-in-the-Middle", "`O(n * 2^n)` or `O(2^(n/2))`", "Permutations, TSP cities, small subsets"],
            ["Small numeric bound `W`", "Pseudo-polynomial DP", "`O(n * W)`", "Subset Sum / Knapsack with `W <= 10^5`"],
            ["Special graph structure", "Tree DP / Bipartite matching", "`O(V + E)` / `O(V * E)`", "Independent Set on trees (polynomial!)"],
            ["Near-optimal allowed", "Greedy 2-approximation", "`O(n log n)`", "Vertex Cover, Set Cover, Load Balancing"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Always check numeric bounds carefully: 0/1 Knapsack in `O(n * W)` looks polynomial in numbers, yet because the value `W` uses `b = log2(W)` input bits, `W = 2^b` is exponential in the bit-length of the input (pseudo-polynomial).",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build a Polynomial-Time Verifier for Subset Sum",
      subtitle: "Turn a naive sum loop into an airtight O(len(chosen)) NP certificate verifier.",
      steps: [
        {
          label: "Step 1: Sum selected elements (bug: accepts duplicate index [0, 0])",
          explanation: "Summing `nums[idx]` checks the total, yet `[0, 0]` on `nums = [6, 3, 2], target = 12` falsely passes by reusing index `0` twice.",
          code: [
            "function verify_subset_sum(nums, target, chosen):",
            "    total ← 0",
            "    for idx in chosen:",
            "        total ← total + nums[idx]",
            "    return total == target",
          ],
          activeLines: [3, 4],
          output: "[6, 3, 2], target=12, [0, 0] -> true (BUG)",
        },
        {
          label: "Step 2: Reject out-of-range indices",
          explanation: "Check `0 <= idx < len(nums)` before indexing so negative or oversized indices return `false` instead of crashing.",
          code: [
            "function verify_subset_sum(nums, target, chosen):",
            "    total ← 0",
            "    for idx in chosen:",
            "        if idx < 0 or idx >= len(nums): return false",
            "        total ← total + nums[idx]",
            "    return total == target",
          ],
          activeLines: [4],
          output: "idx=-1 -> false (bounds guarded)",
        },
        {
          label: "Step 3: Track seen indices to reject duplicates in O(len(chosen))",
          explanation: "Adding a hash set `seen` catches reused indices like `[0, 0]` while keeping verification strictly linear.",
          code: [
            "function verify_subset_sum(nums, target, chosen):",
            "    seen ← empty set, total ← 0",
            "    for idx in chosen:",
            "        if idx < 0 or idx >= len(nums) or idx in seen:",
            "            return false",
            "        seen.add(idx)",
            "        total ← total + nums[idx]",
            "    return total == target",
          ],
          activeLines: [2, 4, 5, 6],
          output: "[6, 3, 2], target=12, [0, 0] -> false | [4, 7, 1, 9, 5], [1, 4] -> true",
        },
      ],
    },
    walkthrough: {
      title: "Contrast polynomial certificate verification against exponential search growth",
      layout: "visual-first",
      steps: [
        {
          title: "Problem size n = 16: sorting vs Subset Sum search space",
          tag: "CONCEPT",
          explanation: [
            "At `n = 16`, polynomial `O(n log n)` sorting needs roughly `64` steps, while blind Subset Sum enumeration inspects `2^16 = 65,536` subsets.",
            "Click `Verify` vs `Solve` intuition: checking ONE candidate subset `[3, 7, 11]` against target `21` takes at most `n = 16` additions (`O(n)`), putting Subset Sum squarely in **NP**.",
          ],
          code: [
            "function verify_subset_sum(nums, target, chosen_indices):",
            "    seen ← empty set",
            "    total ← 0",
            "    for idx in chosen_indices:",
            "        if idx in seen or idx < 0 or idx >= len(nums): return false",
            "        seen.add(idx)",
            "        total ← total + nums[idx]",
            "    return total == target   // O(n) polynomial verifier",
          ],
          activeLines: [1, 8],
          codeLabel: "Pseudocode · NP Verifier",
          altCode: {
            label: "Python 3",
            lines: [
              "def verify_subset_sum(nums, target, chosen_indices):",
              "    seen = set()",
              "    total = 0",
              "    for idx in chosen_indices:",
              "        if idx in seen or idx < 0 or idx >= len(nums): return False",
              "        seen.add(idx)",
              "        total += nums[idx]",
              "    return total == target",
            ],
            activeLines: [1, 8],
          },
          state: [
            { name: "Input n", value: "16", changed: true },
            { name: "Solve O(2^n)", value: "65,536 ops" },
            { name: "Verify O(n)", value: "16 ops", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Given candidate picks vs searching 2^16 subsets",
                cells: [
                  { id: "p0", value: "3*", index: 0, state: "active" },
                  { id: "p1", value: "4", index: 1, state: "dim" },
                  { id: "p2", value: "7*", index: 2, state: "active" },
                  { id: "p3", value: "9", index: 3, state: "dim" },
                  { id: "p4", value: "11*", index: 4, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "3", tone: "ok" },
                  { index: 2, label: "+ 7", tone: "ok" },
                  { index: 4, label: "+ 11 = 21", tone: "ok" },
                ],
              },
            ],
            caption: "Verifying a supplied candidate checks just the picked slots in O(n) rather than branching over 2^n subsets.",
          },
        },
        {
          title: "Validate a Subset Sum certificate in a single linear pass",
          tag: "TRACE",
          explanation: [
            "Suppose `nums = [4, 7, 1, 9, 5]`, `target = 12`, and someone hands us the certificate indices `[1, 4]` (`7 + 5`).",
            "The verifier scans the `2` chosen indices, checks distinctness inside `seen`, sums `7 + 5 = 12 == target`, and outputs `true` in `O(n)` without exploring `2^n` options.",
          ],
          code: [
            "function verify_subset_sum(nums, target, chosen_indices):",
            "    seen ← empty set",
            "    total ← 0",
            "    for idx in chosen_indices:",
            "        if idx in seen or idx < 0 or idx >= len(nums): return false",
            "        seen.add(idx)",
            "        total ← total + nums[idx]",
            "    return total == target   // O(n) polynomial verifier",
          ],
          activeLines: [4, 5, 6, 7],
          codeLabel: "Pseudocode · NP Verifier",
          state: [
            { name: "Certificate", value: "[1, 4]", changed: true },
            { name: "total", value: "7 + 5 = 12", changed: true },
            { name: "Verdict", value: "true (O(n))" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Certificate check on nums (target = 12)",
                cells: [
                  { id: "c0", value: "4", index: 0, state: "dim" },
                  { id: "c1", value: "7", index: 1, state: "active" },
                  { id: "c2", value: "1", index: 2, state: "dim" },
                  { id: "c3", value: "9", index: 3, state: "dim" },
                  { id: "c4", value: "5", index: 4, state: "active" },
                ],
                pointers: [
                  { index: 1, label: "pick +7", tone: "coral" },
                  { index: 4, label: "pick +5", tone: "ok" },
                ],
              },
            ],
            caption: "A verifier never searches for [1, 4]; it sums and bounds-checks the provided indices in O(n).",
          },
        },
        {
          title: "Reduction chain: 3-SAT <=_p Clique <=_p Vertex Cover",
          tag: "PATTERN",
          explanation: [
            "Polynomial reductions wire NP-Complete problems into a shared chain: if you map any `3-SAT` formula in `O(poly)` steps into a graph `Clique` query, solving Clique fast would automatically solve 3-SAT fast too.",
            "Remember the arrow direction: `A <=_p B` means `B` is **at least as hard as** `A` (known hard problem reduces INTO candidate problem).",
          ],
          code: [
            "// Prove Problem B is NP-Complete:",
            "// 1. Show B is in NP (write O(n^k) certificate verifier)",
            "// 2. Reduce a known NP-Complete problem A -> B in O(n^k):",
            "function solve_A_via_B(instance_A):",
            "    instance_B ← poly_transform(instance_A)",
            "    return solve_B(instance_B)",
          ],
          activeLines: [4, 5, 6],
          codeLabel: "Pseudocode · Reduction Pattern",
          state: [
            { name: "Step 1", value: "B in NP (verifier)", changed: true },
            { name: "Step 2", value: "3-SAT -> Clique", changed: true },
            { name: "Step 3", value: "Clique -> Vertex Cover" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Polynomial Reduction Pipeline (A <=_p B)",
                cells: [
                  { id: "r0", value: "instance A", index: 0, state: "done" },
                  { id: "r1", value: "O(n^k) map", index: 1, state: "pivot" },
                  { id: "r2", value: "instance B", index: 2, state: "active" },
                  { id: "r3", value: "answer B == A", index: 3, state: "done" },
                ],
                pointers: [
                  { index: 1, label: "poly transform", tone: "accent" },
                  { index: 2, label: "solver B", tone: "ok" },
                ],
              },
            ],
            caption: "Polynomial reductions map known hard instances A into candidate instances B so solving B fast would solve A too.",
          },
        },
        {
          title: "Pseudo-polynomial trap vs true polynomial P",
          tag: "PITFALL",
          explanation: [
            "Subset Sum DP builds an `n x target` table in `O(n * target)` operations. When `target <= 10^4`, it flies in milliseconds!",
            "Complexity theory measures size in **input bits** (`b = log2(target)`). Since `target = 2^b` is exponential in the bit-length `b`, `O(n * target)` is pseudo-polynomial rather than true `P` when `target` is `10^18`.",
          ],
          code: [
            "function subset_sum_dp(nums, target):",
            "    dp ← boolean array of size (target + 1), dp[0] ← true",
            "    for x in nums:",
            "        for s from target down to x:",
            "            if dp[s - x]: dp[s] ← true",
            "    return dp[target]   // O(n * target) pseudo-polynomial",
          ],
          activeLines: [4, 6],
          codeLabel: "Pseudocode · Pseudo-Poly DP",
          state: [
            { name: "target = 10^3", value: "O(n * 10^3) fast", changed: true },
            { name: "target = 10^18", value: "Out of memory / TLE", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Bit-length vs Value Magnitude (target = 1,000,000 vs 20 bits)",
                cells: [
                  { id: "m0", value: "20b", index: 0, state: "done" },
                  { id: "m1", value: "10^6", index: 1, state: "active" },
                  { id: "m2", value: "30b", index: 2, state: "done" },
                  { id: "m3", value: "10^9", index: 3, state: "pivot" },
                ],
                pointers: [
                  { index: 1, label: "Fits RAM", tone: "ok" },
                  { index: 3, label: "Too huge for DP", tone: "coral" },
                ],
              },
            ],
            caption: "Adding just 10 bits multiplies DP table memory and runtime by 1,024x.",
          },
        },
        {
          title: "Decision rule: pick exact, bitmask, DP, or approximation",
          tag: "CHECK",
          explanation: [
            "When an interview or production problem reduces to an NP-Complete core, read the constraints immediately: `n <= 20` signals bitmask DP (`O(2^n)`), `target <= 10^4` signals pseudo-polynomial DP (`O(n * W)`), and trees turn NP-Hard Vertex Cover into linear `O(V)` Tree DP!",
          ],
          code: [
            "// Choose solver by constraint regime:",
            "if problem in P: run greedy / BFS / Dijkstra / MST",
            "else if n <= 20: run Bitmask DP or Meet-in-the-Middle",
            "else if weight_bound <= 10^5: run Pseudo-Poly DP",
            "else: run Approximation / Branch-and-Bound / SAT solver",
          ],
          activeLines: [2, 3, 4, 5],
          codeLabel: "Pseudocode · Practical Playbook",
          state: [
            { name: "If P", value: "Exact O(n^k)", changed: true },
            { name: "If NP-Hard + n<=20", value: "Bitmask O(2^n)", changed: true },
            { name: "If large n, W", value: "Approximation / ILP" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Pick escape strategy by constraint bound",
                cells: [
                  { id: "e0", value: "in P -> O(n log n)", index: 0, state: "done" },
                  { id: "e1", value: "n <= 20 -> Bitmask", index: 1, state: "active" },
                  { id: "e2", value: "W <= 10^5 -> Table DP", index: 2, state: "done" },
                  { id: "e3", value: "Large -> Approx", index: 3, state: "dim" },
                ],
                pointers: [{ index: 1, label: "Meet-in-Middle splits 2^16 -> 2^8", tone: "ok" }],
              },
            ],
            caption: "Constraint bounds pick the right tool: exact poly algorithms in P, small-n bitmask/DP escapes later in M20-M21.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Thinking NP means Non-Polynomial",
        detail: "NP means Nondeterministic Polynomial time (verifiable in O(n^k)). Every problem in P also sits inside NP.",
      },
      {
        title: "Reversing the reduction arrow",
        detail: "Reducing B -> A puts the hardness burden on A; to prove B is NP-Hard, transform a known hard problem A into B (A <=_p B).",
      },
      {
        title: "Mistaking O(n * W) Knapsack for true P",
        detail: "W takes log2(W) input bits, so O(n * W) is exponential in bit-length when W can grow up to 10^18.",
      },
    ],
    predictChecks: [
      {
        prompt: "Why does P subset-of NP hold even before knowing whether P == NP?",
        code: "function is_in_np(problem_in_P, instance):\n    return poly_solve(instance)",
        options: [
          { id: "a", label: "Any problem solvable in polynomial time can have a yes-answer verified in polynomial time by re-running the solver" },
          { id: "b", label: "NP stands for Non-Polynomial and excludes all P problems" },
          { id: "c", label: "Every problem in P uses exponential memory" },
        ],
        correctId: "a",
        explanation: "A deterministic O(n^k) algorithm is itself a valid polynomial-time verifier.",
      },
      {
        prompt: "You prove Vertex Cover <=_p NewProblem and write an O(n^2) verifier for NewProblem. What does this establish?",
        code: "// Step 1: O(n^2) verifier exists for NewProblem\n// Step 2: instance_VC -> poly_transform -> instance_New",
        options: [
          { id: "a", label: "NewProblem is in P" },
          { id: "b", label: "NewProblem is NP-Complete" },
          { id: "c", label: "NewProblem is unsolvable for all n" },
        ],
        correctId: "b",
        explanation: "Showing membership in NP plus reducing a known NP-Complete problem (Vertex Cover) INTO NewProblem proves NewProblem is NP-Complete.",
      },
    ],
    practiceTask: {
      title: "Polynomial Verifier for Subset Sum Certificate",
      tier: "Warmup",
      goal: "Given `nums`, `target`, and candidate index list `chosen`, return `true` iff every index is valid (`0 <= i < len(nums)`), all chosen indices are distinct, and the sum of selected elements equals `target` in `O(len(chosen))` time.",
      constraints: ["1 <= len(nums) <= 10^5", "Target: O(len(chosen)) avg time, O(len(chosen)) space"],
      examples: [
        { input: "nums = [4, 7, 1, 9, 5], target = 12, chosen = [1, 4]", output: "true" },
        { input: "nums = [6, 3, 2], target = 12, chosen = [0, 0]", output: "false", explanation: "Using index 0 twice is invalid even though 6 + 6 == 12." },
      ],
      tasks: [
        "Track visited indices in a hash set `seen` to reject duplicates.",
        "Bounds-check each index, accumulate `total`, and return `total == target`.",
      ],
      starterCode: "function verify_subset_sum(nums, target, chosen):\n    // TODO: O(len(chosen)) polynomial verifier\n    return false",
      expectedOutput: "true\nfalse",
      hint: "Without tracking `seen`, picking the same index `[0, 0]` multiple times would falsely verify.",
      complexity: { time: "O(len(chosen))", space: "O(len(chosen))" },
      solutionCode:
        "function verify_subset_sum(nums, target, chosen):\n    seen ← empty Hash Set\n    total ← 0\n    for idx in chosen:\n        if idx < 0 or idx >= len(nums) or idx in seen:\n            return false\n        seen.add(idx)\n        total ← total + nums[idx]\n    return total == target",
    },
    practiceChallenges: [
      {
        title: "Polynomial Verifier for Subset Sum Certificate",
        tier: "Warmup",
        goal: "Verify whether a proposed index certificate `chosen` sums to `target` using distinct valid indices from `nums`.",
        constraints: ["1 <= len(nums) <= 10^5", "Target: O(len(chosen)) time"],
        examples: [
          { input: "nums = [4, 7, 1, 9, 5], target = 12, chosen = [1, 4]", output: "true" },
          { input: "nums = [6, 3, 2], target = 12, chosen = [0, 0]", output: "false" },
        ],
        tasks: ["Reject out-of-range or repeated indices; verify sum equals `target`."],
        starterCode: "function verify_subset_sum(nums, target, chosen):\n    // TODO: check distinct bounds-valid indices sum to target\n    return false",
        expectedOutput: "true\nfalse",
        hint: "A hash set enforces distinct indices in `O(1)` average per index.",
        complexity: { time: "O(len(chosen))", space: "O(len(chosen))" },
        solutionCode:
          "function verify_subset_sum(nums, target, chosen):\n    seen ← empty Hash Set\n    total ← 0\n    for idx in chosen:\n        if idx < 0 or idx >= len(nums) or idx in seen:\n            return false\n        seen.add(idx)\n        total ← total + nums[idx]\n    return total == target",
      },
      {
        title: "Verify Proper Graph K-Coloring Certificate",
        tier: "Core",
        goal: "Given `n` vertices (`0..n-1`), undirected edge list `edges`, max color count `k`, and assignment array `colors`, verify in `O(V + E)` time whether every color is in `0..k-1` and no edge shares the same color on both endpoints.",
        constraints: ["1 <= n <= 10^5", "0 <= len(edges) <= 2 * 10^5", "Target: O(V + E) time, O(1) extra space"],
        examples: [
          { input: "n = 3, edges = [(0,1),(1,2),(2,0)], k = 3, colors = [0, 1, 2]", output: "true" },
          { input: "n = 3, edges = [(0,1),(1,2),(2,0)], k = 2, colors = [0, 1, 0]", output: "false", explanation: "Edge (2, 0) has color 0 on both endpoints." },
        ],
        tasks: [
          "Check `len(colors) == n` and every `0 <= colors[u] < k`.",
          "Scan all edges `(u, v)` and return `false` if `colors[u] == colors[v]`.",
        ],
        starterCode: "function verify_k_coloring(n, edges, k, colors):\n    // TODO: O(V + E) verifier for NP-Complete K-Coloring\n    return false",
        expectedOutput: "true\nfalse",
        hint: "Checking K-Coloring is easy `O(V + E)`, while finding whether a 3-coloring exists is NP-Complete.",
        complexity: { time: "O(V + E)", space: "O(1)" },
        solutionCode:
          "function verify_k_coloring(n, edges, k, colors):\n    if len(colors) != n: return false\n    for u from 0 to n - 1:\n        if colors[u] < 0 or colors[u] >= k: return false\n    for (u, v) in edges:\n        if colors[u] == colors[v]: return false\n    return true",
      },
      {
        title: "Meet-in-the-Middle Exact Subset Sum",
        tier: "Stretch",
        goal: "Given array `nums` of length `n <= 40` and integer `target`, determine whether ANY subset sums to `target` in `O(2^(n/2) * (n/2))` time (beating `O(2^n)` by splitting in half).",
        constraints: ["1 <= len(nums) <= 40", "-10^9 <= nums[i], target <= 10^9", "Target: O(2^(n/2) * log) time"],
        examples: [
          { input: "nums = [3, 34, 4, 12, 5, 2], target = 9", output: "true" },
          { input: "nums = [3, 34, 4, 12, 5, 2], target = 30", output: "false" },
        ],
        tasks: [
          "Enumerate all `2^(n/2)` subset sums for the left half and store them in a sorted array or hash set `left_sums`.",
          "Enumerate all subset sums `r` of the right half and binary-search or lookup `target - r` in `left_sums`.",
        ],
        starterCode: "function meet_in_middle_subset_sum(nums, target):\n    // TODO: split nums into two halves and combine sums\n    return false",
        expectedOutput: "true\nfalse",
        hint: "With `n = 40`, `2^40 ~ 10^12` times out, whereas `2^20 ~ 10^6` runs in milliseconds.",
        complexity: { time: "O(n * 2^(n/2))", space: "O(2^(n/2))" },
        solutionCode:
          "function subset_sums(arr):\n    res ← [0]\n    for x in arr:\n        next_res ← list(res)\n        for s in res:\n            next_res.append(s + x)\n        res ← next_res\n    return res\n\nfunction meet_in_middle_subset_sum(nums, target):\n    mid ← len(nums) // 2\n    left_set ← set(subset_sums(nums[0..mid - 1]))\n    for r in subset_sums(nums[mid..len(nums) - 1]):\n        if (target - r) in left_set: return true\n    return false",
      },
    ],
  },
};

export const dsaM00PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m0",
  title: "Module 00 Practice Set: Foundations & Complexity",
  description:
    "Four mixed problems combining memory reasoning, loop step counting, Big-O growth estimation, and constant extra-space solutions.",
  problems: [
    {
      id: "dsa-m0-p1",
      title: "Maximum Pair Difference Without Nested Loops",
      patternHint: "Track scalar running min and max in O(n) time and O(1) space instead of checking all (i, j) pairs.",
      lessonRefId: "dsa-loops-space-limits",
      goal: "Given `nums`, find the largest difference `nums[j] - nums[i]` across all pairs (`i` before or after `j`) while `n <= 10^5`.",
      constraints: ["1 <= len(nums) <= 10^5", "Nested O(n²) loop will time out", "Target: O(n) time, O(1) extra space"],
      examples: [
        { input: "nums = [4, 1, 9, 3, 7]", output: "8", explanation: "max(9) - min(1) = 8." },
        { input: "nums = [5, 5, 5]", output: "0" },
      ],
      tasks: [
        "Avoid comparing every pair `(i, j)` in a nested loop (`10^10` steps).",
        "Notice the largest gap between any two items is always `maximum - minimum`.",
      ],
      starterCode: "function max_pair_diff(nums):\n    // TODO: solve in one pass with O(1) extra space",
      expectedOutput: "8\n0",
      hint: "You only need `lo` and `hi` scanned once over `nums`, then return `hi - lo`.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode: "function max_pair_diff(nums):\n    lo ← nums[0]\n    hi ← nums[0]\n    for each x in nums:\n        if x < lo: lo ← x\n        if x > hi: hi ← x\n    return hi - lo",
    },
    {
      id: "dsa-m0-p2",
      title: "Check Exact Power of Two in O(log n)",
      patternHint: "Repeated integer halving checks (`n % 2`) shrink n by half each step (Lesson 00-2).",
      lessonRefId: "dsa-time-complexity",
      goal: "Determine whether positive integer `n` equals `2^k` for some `k >= 0` in logarithmic time.",
      constraints: ["1 <= n <= 10^18", "Target time: O(log n)", "Extra space: O(1)"],
      examples: [
        { input: "n = 16", output: "true", explanation: "16 -> 8 -> 4 -> 2 -> 1." },
        { input: "n = 12", output: "false", explanation: "12 -> 6 -> 3 (odd and > 1)." },
      ],
      tasks: [
        "While `n > 1` and `n` is divisible by `2`, divide `n` by `2`.",
        "Return `n == 1` at loop exit.",
      ],
      starterCode: "function is_power_of_two(n):\n    // TODO: halve while even, check n == 1",
      expectedOutput: "true\nfalse",
      hint: "If an odd factor (`> 1`) appears before reaching `1`, `n` cannot be a power of `2`.",
      complexity: { time: "O(log n)", space: "O(1)" },
      solutionCode: "function is_power_of_two(n):\n    while n > 1:\n        if n mod 2 != 0:\n            return false\n        n ← floor(n / 2)\n    return true",
    },
    {
      id: "dsa-m0-p3",
      title: "Inclusive Range Sum in O(1)",
      patternHint: "Apply the arithmetic series formula instead of looping from L to R when ranges exceed 10^8.",
      lessonRefId: "dsa-time-complexity",
      goal: "Compute `L + (L + 1) + ... + R` for huge bounds where an `O(R - L)` loop times out.",
      constraints: ["1 <= L <= R <= 10^9", "Use 64-bit ints", "Target: O(1) time, O(1) space"],
      examples: [
        { input: "L = 3, R = 7", output: "25", explanation: "3 + 4 + 5 + 6 + 7 = 25." },
        { input: "L = 10, R = 10", output: "10" },
      ],
      tasks: [
        "Compute `count = R - L + 1` terms.",
        "Average of first and last term times count gives `count * (L + R) / 2` in constant time.",
      ],
      starterCode: "function arithmetic_range_sum(L, R):\n    // TODO: constant-time formula using 64-bit integer math",
      expectedOutput: "25\n10",
      hint: "Divide whichever of `count` or `(L + R)` is even by `2` first.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode: "function arithmetic_range_sum(L, R):\n    count ← R - L + 1\n    total ← L + R\n    if count mod 2 == 0:\n        return (count / 2) * total\n    return count * (total / 2)",
    },
    {
      id: "dsa-m0-p4",
      title: "Independent Update vs Shared Alias Guard",
      patternHint: "Prevent unintended mutation through shared memory references by writing to an independent copy (Lesson 00-1).",
      lessonRefId: "dsa-what-is-dsa",
      goal: "Given integer pair `scores = [a, b]`, produce a boosted copy `[max(a, 0) + bonus, max(b, 0) + bonus]` without changing `scores` itself.",
      constraints: ["-10^6 <= a, b, bonus <= 10^6", "Caller's original `scores` must remain unmodified", "Time: O(1)"],
      examples: [
        { input: "scores = [-3, 12], bonus = 5", output: "result=[5, 17], original=[-3, 12]", explanation: "-3 clamps to 0 before adding 5; caller scores stays untouched." },
        { input: "scores = [-10, -1], bonus = 4", output: "result=[4, 4], original=[-10, -1]", explanation: "Both negative values clamp to 0 so result is [4, 4] while original remains [-10, -1]." },
      ],
      tasks: [
        "Avoid aliasing `out = scores` and overwriting `out[0]`.",
        "Construct a brand-new pair with clamped non-negative values plus `bonus`.",
      ],
      starterCode: "function apply_safe_bonus(scores, bonus):\n    // TODO: return new boosted pair without altering scores",
      expectedOutput: "result=[5, 17], original=[-3, 12]\nresult=[4, 4], original=[-10, -1]",
      hint: "Allocate fresh output slots `[max(scores[0], 0) + bonus, max(scores[1], 0) + bonus]`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode: "function apply_safe_bonus(scores, bonus):\n    first ← max(scores[0], 0) + bonus\n    second ← max(scores[1], 0) + bonus\n    return [first, second]",
    },
  ],
};
