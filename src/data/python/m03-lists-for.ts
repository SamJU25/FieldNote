import type { LessonContent, ModulePracticeSet, ModuleQuiz } from "@/lib/lesson-types";

export const m03Lessons: Record<string, LessonContent> = {
  "py-lists-intro": {
    lessonId: "py-lists-intro",
    subtitle: "Group multiple items into an ordered `list`, access positions with `[index]`, slice sublists, and measure length.",
    intro: {
      heading: "Ordered Collections With Lists and Slices",
      explanation: [
        "Storing five daily temperatures in separate variables (`day1`, `day2`, `day3`) breaks down as soon as you track a full week or month. Wrapping them in square brackets (`temps = [28, 31, 29, 33, 27]`) keeps the whole ordered sequence under one name.",
        "Python numbers list slots from `0` at the left end and `-1` at the right end, and lets you slice sub-ranges (`temps[:3]`) into new lists without changing the original.",
      ],
      analogy: "A pill organizer labeled Sunday through Saturday keeps seven doses in one numbered row, so you can grab slot 0 or the last slot right away.",
      realWorldUses: [
        "Storing ordered daily temperatures, leaderboard scores, or shopping cart items under one variable",
        "Slicing the top 3 results (`scores[:3]`) or most recent log entries (`events[-5:]`) for display",
      ],
    },
    sections: [
      {
        heading: "List Creation & Zero-Based Indexing",
        paragraphs: [
          "Create an ordered `list` using square brackets `[...]`. Python numbers slots from `0` at the left (`temps[0]`), while negative indices count from the right (`temps[-1]` is always the last element). Asking for an index past the end raises `IndexError`.",
          "Check how many elements sit in a list with `len(temps)`.",
        ],
        code: [
          "# Pain: separate variables (day1 = 28, day2 = 31) do not scale",
          "temps = [28, 31, 29, 33, 27]",
          "print(temps[0])              # 28 (first day — slots start at 0)",
          "print(temps[-1])             # 27 (last day — counts from the end)",
          "# print(temps[5])            # INVALID -> IndexError: list index out of range",
          "print(\"Days:\", len(temps))   # Days: 5",
        ],
        output: "28\n27\nDays: 5",
      },
      {
        heading: "Slicing (`[start:stop:step]`) & Membership (`in`, `not in`)",
        paragraphs: [
          "Slicing `items[start:stop]` returns a new list starting at `start` and stopping just before `stop`. Leave out `start` to begin at `0`, leave out `stop` to go to the end, and unlike `[index]`, an out-of-range slice stop stops at the list end instead of raising `IndexError`.",
          "An optional third number (`items[start:stop:step]`) picks every `step`-th item (so `[1:-1:2]` skips edges and takes every second element, while `[::-1]` steps backward to reverse a copy). Use `in` / `not in` to test whether a value is inside the list.",
        ],
        visual: {
          kind: "slice-explorer",
          caption: "Click slice presets or adjust start, stop, and step to inspect selected list elements",
          items: ["10", "20", "30", "40", "50"],
          mode: "list",
          initialStart: 1,
          initialStop: 4,
          initialStep: 1,
        },
        code: [
          "nums = [10, 20, 30, 40, 50]",
          "print(nums[1:4])      # [20, 30, 40] (index 1 up to 3)",
          "print(nums[:2])       # [10, 20]     (first 2 items)",
          "print(nums[1:99])     # [20, 30, 40, 50] (clamps instead of IndexError)",
          "print(nums[::-1])     # [50, 40, 30, 20, 10]",
          "print(30 in nums, 99 not in nums)",
        ],
        table: {
          caption: "List Indexing, Slicing & Combining Reference",
          headers: ["Expression", "What It Returns", "Example -> Result"],
          rows: [
            ["`items[0]` / `items[-1]`", "First item / last item (`IndexError` if empty)", "`[\"a\", \"b\", \"c\"][-1]` -> `'c'`"],
            ["`items[a:b]`", "New slice from `a` up to `b - 1` (clamps at list end)", "`[10, 20, 30][1:9]` -> `[20, 30]`"],
            ["`items[::-1]`", "New reversed copy without changing the original", "`[1, 2, 3][::-1]` -> `[3, 2, 1]`"],
            ["`a + b` / `x in items`", "Combine lists into a new list / check membership", "`[1, 2] + [3]` -> `[1, 2, 3]`"],
            ["`len(items)` / `x in items`", "Item count / membership boolean", "`20 in [10, 20]` -> `True`"],
          ],
        },
        output: "[20, 30, 40]\n[10, 20]\n[20, 30, 40, 50]\n[50, 40, 30, 20, 10]\nTrue True",
      },
    ],
    guidedBuildUp: {
      title: "Build a Top-3 Scoreboard Slice Step by Step",
      steps: [
        {
          label: "Step 1: Store ordered scores",
          explanation: "Put five scores into one `scores` list and check how many entries it holds with `len(scores)`.",
          code: ["scores = [88, 95, 72, 91, 64]", "print(\"Count:\", len(scores))"],
          activeLines: [1, 2],
          output: "Count: 5",
        },
        {
          label: "Step 2: Read first and last slots",
          explanation: "Read slot `0` and slot `-1` without hard-coding the length (`scores[4]`).",
          code: [
            "scores = [88, 95, 72, 91, 64]",
            "print(\"First:\", scores[0])",
            "print(\"Last:\", scores[-1])",
          ],
          activeLines: [2, 3],
          output: "First: 88\nLast: 64",
        },
        {
          label: "Step 3: Slice top 3 & check membership",
          explanation: "Take `scores[:3]` (indices `0, 1, 2`) and check if `95` made the cut.",
          code: [
            "scores = [88, 95, 72, 91, 64]",
            "top3 = scores[:3]",
            "print(\"Top 3:\", top3)",
            "print(\"95 in top 3:\", 95 in top3)",
          ],
          activeLines: [2, 3, 4],
          output: "Top 3: [88, 95, 72]\n95 in top 3: True",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Positive Indexing, Negative Indexing, Slicing & Slice Clamping",
      steps: [
        {
          title: "Positive index `items[1]` reads from the left",
          tag: "TRACE",
          explanation: ["Positive indices start at `0` on the left, so `items[1]` selects `'b'`."],
          code: ["items = [\"a\", \"b\", \"c\", \"d\"]", "print(items[1])", "print(items[-1])", "print(items[1:3])", "print(items[2:99])"],
          activeLines: [1, 2],
          visual: {
            kind: "memory",
            caption: "Positive index 1 selects slot 1 ('b')",
            frames: [{ name: "Variables", bindings: [{ label: "items", targetId: "list0", highlight: true }] }],
            objects: [
              {
                id: "list0",
                typeLabel: "list",
                value: "4 items",
                mutable: true,
                cells: [
                  { index: "0", value: "'a'" },
                  { index: "1", value: "'b'", active: true },
                  { index: "2", value: "'c'" },
                  { index: "3 (-1)", value: "'d'" },
                ],
              },
            ],
          },
          output: "b",
        },
        {
          title: "Negative index `items[-1]` reads from the right",
          tag: "TRACE",
          explanation: ["Negative index `-1` points directly to the last element (`'d'`)."],
          code: ["items = [\"a\", \"b\", \"c\", \"d\"]", "print(items[1])", "print(items[-1])", "print(items[1:3])", "print(items[2:99])"],
          activeLines: [3],
          visual: {
            kind: "memory",
            caption: "Negative index -1 selects the last slot ('d')",
            frames: [{ name: "Variables", bindings: [{ label: "items", targetId: "list0", highlight: true }] }],
            objects: [
              {
                id: "list0",
                typeLabel: "list",
                value: "4 items",
                mutable: true,
                cells: [
                  { index: "0", value: "'a'" },
                  { index: "1", value: "'b'" },
                  { index: "2", value: "'c'" },
                  { index: "3 (-1)", value: "'d'", active: true },
                ],
              },
            ],
          },
          output: "b\nd",
        },
        {
          title: "Slice `items[1:3]` allocates a brand-new sublist",
          tag: "CONCEPT",
          explanation: ["Slicing starts at `1` (`'b'`) and stops before `3` (`'d'`), creating `['b', 'c']` without altering `items`."],
          code: ["items = [\"a\", \"b\", \"c\", \"d\"]", "print(items[1])", "print(items[-1])", "print(items[1:3])", "print(items[2:99])"],
          activeLines: [4],
          visual: {
            kind: "memory",
            caption: "items[1:3] copies slots 1 and 2 into a separate list",
            frames: [
              {
                name: "Variables",
                bindings: [
                  { label: "items", targetId: "list0" },
                { label: "items[2:99]", targetId: "list1", highlight: true },
                ],
              },
            ],
            objects: [
              {
                id: "list0",
                typeLabel: "list",
                value: "4 items",
                mutable: true,
                cells: [
                  { index: "0", value: "'a'", dim: true },
                  { index: "1", value: "'b'", active: true },
                  { index: "2", value: "'c'", active: true },
                  { index: "3 (-1)", value: "'d'", dim: true },
                ],
              },
              {
                id: "list1",
                typeLabel: "list (new)",
                value: "['b', 'c']",
                mutable: true,
                highlight: true,
                cells: [
                  { index: "0", value: "'b'", active: true },
                  { index: "1", value: "'c'", active: true },
                ],
              },
            ],
          },
          output: "b\nd\n['b', 'c']",
        },
        {
          title: "Out-of-bounds slice `items[2:99]` stops at the end",
          tag: "PATTERN",
          explanation: ["Whereas `items[99]` raises `IndexError`, slicing `items[2:99]` stops at the end of the list and returns `['c', 'd']`."],
          code: ["items = [\"a\", \"b\", \"c\", \"d\"]", "print(items[1])", "print(items[-1])", "print(items[1:3])", "print(items[2:99])"],
          activeLines: [5],
          state: [{ name: "items[2:99]", value: "['c', 'd']", changed: true }],
          visual: {
            kind: "memory",
            caption: "items[2:99] clamps stop at index 4 (end of list) and copies slots 2 and 3 into a new list.",
            frames: [
              {
                name: "Variables",
                bindings: [
                  { label: "items", targetId: "list0" },
                { label: "items[2:99]", targetId: "list1", highlight: true },
                ],
              },
            ],
            objects: [
              {
                id: "list0",
                typeLabel: "list",
                value: "4 items",
                mutable: true,
                cells: [
                  { index: "0", value: "'a'", dim: true },
                  { index: "1", value: "'b'", dim: true },
                  { index: "2", value: "'c'", active: true },
                  { index: "3 (-1)", value: "'d'", active: true },
                ],
              },
              {
                id: "list1",
                typeLabel: "list (new)",
                value: "['c', 'd']",
                mutable: true,
                highlight: true,
                cells: [
                  { index: "0", value: "'c'", active: true },
                  { index: "1", value: "'d'", active: true },
                ],
              },
            ],
          },
          output: "b\nd\n['b', 'c']\n['c', 'd']",
        },
      ],
    },
    trickyPoints: [
      {
        title: "Indexing `fruits[4]` on a 4-item list raises `IndexError`",
        detail: "Valid indices for length `N` run from `0` to `N - 1` (or `-N` to `-1`).",
      },
      {
        title: "Empty list `nums[-1]` raises `IndexError`",
        detail: "Always check `if nums:` before reading `nums[0]` or `nums[-1]`.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(letters[1:3])` output?",
        code: "letters = [\"p\", \"y\", \"t\", \"h\", \"o\", \"n\"]\nprint(letters[1:3])",
        options: [
          { id: "a", label: "`['p', 'y', 't']`" },
          { id: "b", label: "`['y', 't']`" },
          { id: "c", label: "`['y', 't', 'h']`" },
        ],
        correctId: "b",
        explanation: "Slices include index `1` (`'y'`) and stop right before index `3` (`'h'`).",
      },
      {
        prompt: "What does `print(nums[0:99])` return when `nums` has 3 elements?",
        code: "nums = [10, 20, 30]\nprint(nums[0:99])",
        options: [
          { id: "a", label: "`IndexError`" },
          { id: "b", label: "`[10, 20, 30]`" },
          { id: "c", label: "`[]`" },
        ],
        correctId: "b",
        explanation: "Slicing clamps out-of-range bounds automatically instead of crashing.",
      },
    ],
    practiceTask: {
      title: "Warmup: Endpoints & Reversed Copy",
      tier: "Warmup",
      goal: "Store `items = [\"Mon\", \"Tue\", \"Wed\"]`, then print its first item (`items[0]`), last item (`items[-1]`), and a reversed copy (`items[::-1]`).",
      constraints: ["Do not modify the original items list", "Works for 1-item lists like [42] too"],
      examples: [
        { input: "items = [\"Mon\", \"Tue\", \"Wed\"]", output: "Mon\nWed\n['Wed', 'Tue', 'Mon']" },
        { input: "items = [42]", output: "42\n42\n[42]" },
      ],
      tasks: [
        "Start with `items = [\"Mon\", \"Tue\", \"Wed\"]`.",
        "Print `items[0]`, `items[-1]`, and `items[::-1]` on separate lines.",
      ],
      starterCode: "# Exercise M03.1 Warmup: endpoints + reversed slice\nitems = [\"Mon\", \"Tue\", \"Wed\"]\n# TODO: print first item, last item, and reversed copy\n",
      expectedOutput: "Mon\nWed\n['Wed', 'Tue', 'Mon']\n42\n42\n[42]",
      hint: "Use `items[0]` for the first item, `items[-1]` for the last item, and `items[::-1]` for a reversed slice.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "items = [\"Mon\", \"Tue\", \"Wed\"]\nprint(items[0])\nprint(items[-1])\nprint(items[::-1])\n\nitems = [42]\nprint(items[0])\nprint(items[-1])\nprint(items[::-1])",
    },
    practiceChallenges: [
      {
        title: "Core: Safe Top-K Slice & Presence Check",
        tier: "Core",
        goal: "Slice the first `k` items of `items` without crashing even if `len(items) < k`, check whether `target in items`, and print both results.",
        constraints: ["k >= 0", "Original items must stay unchanged"],
        examples: [
          { input: "items = [28, 31, 29, 33], k = 3, target = 33", output: "[28, 31, 29]\nTrue" },
          { input: "items = [10, 20], k = 5, target = 99", output: "[10, 20]\nFalse" },
        ],
        tasks: [
          "Slice `first_k = items[:k]` (safe even when `k > len(items)`).",
          "Check `has_target = target in items` and print `first_k` and `has_target`.",
        ],
        starterCode: "# Exercise M03.1 Core: clamped top-k slice\nitems = [28, 31, 29, 33]\nk = 3\ntarget = 33\n# TODO: slice first k items, check target in items, and print both\n",
        expectedOutput: "[28, 31, 29]\nTrue\n[10, 20]\nFalse",
        hint: "Python slicing handles `k` larger than `len(items)` automatically, so `items[:k]` never raises an error.",
        complexity: { time: "O(n)", space: "O(k)" },
        solutionCode:
          "items = [28, 31, 29, 33]\nk = 3\ntarget = 33\nprint(items[:k])\nprint(target in items)\n\nitems = [10, 20]\nk = 5\ntarget = 99\nprint(items[:k])\nprint(target in items)",
      },
      {
        title: "Stretch: Middle Window Without Edges",
        tier: "Stretch",
        goal: "Strip the first and last element from `items`, print every 2nd remaining element (`items[1:-1:2]`), and confirm it produces `[]` when `len(items) <= 2`.",
        constraints: ["Works for empty and 2-element lists"],
        examples: [
          { input: "items = [10, 20, 30, 40, 50, 60]", output: "[20, 40]" },
          { input: "items = [1, 2]", output: "[]" },
        ],
        tasks: [
          "Print `items[1:-1:2]` for `items = [10, 20, 30, 40, 50, 60]`.",
          "Also try `items = [1, 2]` to confirm it evaluates to `[]`.",
        ],
        starterCode: "# Exercise M03.1 Stretch: stepped interior slice\nitems = [10, 20, 30, 40, 50, 60]\n# TODO: drop first/last and print every 2nd remaining item\n",
        expectedOutput: "[20, 40]\n[]",
        hint: "When `len(items) <= 2`, index `1` meets or crosses `-1`, so `items[1:-1:2]` evaluates to `[]`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "items = [10, 20, 30, 40, 50, 60]\nprint(items[1:-1:2])\n\nitems = [1, 2]\nprint(items[1:-1:2])",
      },
    ],
  },

  "py-lists-modify": {
    lessonId: "py-lists-modify",
    subtitle: "Mutate lists with `append`, `extend`, `insert`, `pop`, `remove`, and distinguish `sort()` from `sorted()`.",
    intro: {
      heading: "Modifying Lists In Place vs Returning New Lists",
      explanation: [
        "Assigning `scores = scores.sort()` wipes out your list and leaves `scores` holding `None`, and calling `cart.append([\"tea\", \"jam\"])` tucks a nested sublist inside `cart` rather than adding two separate items.",
        "Dot methods (`cart.append(x)`, `scores.sort()`) mutate the list directly in memory and return `None`, while standalone functions (`sorted(scores)`, `len(cart)`) leave the original list untouched and return a new value.",
      ],
      analogy: "Writing on a whiteboard updates the board in place (`append`, `sort`), while photocopying the board onto a second sheet (`sorted`) hands you a reordered copy and leaves the original writing unchanged.",
      realWorldUses: [
        "Appending incoming jobs and popping the front item (`pop(0)`) in a task queue",
        "Sorting a copy with `sorted(scores)` for display while preserving arrival order",
      ],
    },
    sections: [
      {
        heading: "Adding Items: `.append()`, `.extend()`, `.insert()` & Functions vs Methods",
        paragraphs: [
          "Use `.append(x)` to push one element onto the end, `.extend(seq)` to splice every element of another sequence onto the end, and `.insert(pos, x)` to insert at index `pos`.",
          "Standalone functions like `len(cart)` or `sorted(scores)` accept the list inside parentheses and return a new answer without changing it, while mutating methods like `cart.append(...)` update that object directly and return `None`.",
        ],
        table: {
          caption: "List Mutation Methods & Non-Mutating Functions",
          headers: ["Method / Syntax", "Behavior", "Return Value", "Notes"],
          rows: [
            ["`lst.append(x)`", "Appends one element to the end", "`None`", "`O(1)` amortized"],
            ["`lst.extend(seq)`", "Appends every item of `seq` (`lst += seq`)", "`None`", "Flattens 1 level vs `.append(seq)`"],
            ["`lst.pop()` / `lst.pop(i)`", "Removes and returns last item (or at index `i`)", "Removed item", "`pop(0)` shifts later elements"],
            ["`sorted(lst)`", "Builds a new sorted list", "New `list`", "Leaves original unchanged"],
            ["`lst.sort()`", "Sorts list in place", "`None`", "Never assign `lst = lst.sort()`"],
            ["`lst.remove(x)` / `del lst[i]`", "Deletes first matching value / deletes index `i`", "`None`", "`remove` raises `ValueError` if absent"],
          ],
          highlightCol: 2,
        },
        code: [
          "cart = [\"milk\", \"bread\"]",
          "cart.append(\"eggs\")",
          "cart.insert(1, \"butter\")",
          "cart.extend([\"tea\", \"jam\"])      # flat: ['milk', 'butter', 'bread', 'eggs', 'tea', 'jam']",
          "# cart.append([\"tea\", \"jam\"])    # nested: [..., ['tea', 'jam']]",
          "# cart.remove(\"honey\")           # INVALID -> ValueError: list.remove(x): x not in list",
          "print(cart)",
        ],
        output: "['milk', 'butter', 'bread', 'eggs', 'tea', 'jam']",
      },
      {
        heading: "Removing Items & `scores.sort()` vs `sorted(scores)`",
        paragraphs: [
          "`.pop(i)` removes by index and hands the item back; `.remove(val)` deletes the first matching value (check `if val in lst:` first if unsure). `del lst[i]` removes by index or slice.",
          "Calling `ordered = scores.sort()` sets `ordered` to `None` while mutating `scores`. Use `sorted(scores, reverse=True)` whenever you want a new sorted copy without touching `scores`.",
        ],
        visual: {
          kind: "memory-sim",
          caption: "Switch scenarios to compare in-place append/pop mutation and sort() vs sorted()",
          scenarios: [
            {
              label: "In-place append() & pop(0)",
              code: [
                "tasks = [\"Scan\", \"Parse\"]",
                "tasks.append(\"Save\")",
                "first = tasks.pop(0)",
              ],
              steps: [
                {
                  line: 1,
                  note: "tasks points to a 2-item list in memory.",
                  frames: [{ name: "Variables", bindings: [{ label: "tasks", targetId: "tlist", highlight: true }] }],
                  objects: [
                    {
                      id: "tlist",
                      typeLabel: "list",
                      value: "['Scan', 'Parse']",
                      mutable: true,
                      cells: [{ index: "0", value: "'Scan'" }, { index: "1", value: "'Parse'" }],
                    },
                  ],
                },
                {
                  line: 2,
                  note: "tasks.append('Save') updates the existing list in place; no new list is created.",
                  frames: [{ name: "Variables", bindings: [{ label: "tasks", targetId: "tlist", highlight: true }] }],
                  objects: [
                    {
                      id: "tlist",
                      typeLabel: "list",
                      value: "['Scan', 'Parse', 'Save']",
                      mutable: true,
                      highlight: true,
                      cells: [{ index: "0", value: "'Scan'" }, { index: "1", value: "'Parse'" }, { index: "2", value: "'Save'", active: true }],
                    },
                  ],
                },
                {
                  line: 3,
                  note: "tasks.pop(0) removes 'Scan' from index 0, shifts remaining items left, and binds first to 'Scan'.",
                  frames: [
                    {
                      name: "Variables",
                      bindings: [
                        { label: "tasks", targetId: "tlist", highlight: true },
                        { label: "first", targetId: "scan_val", highlight: true },
                      ],
                    },
                  ],
                  objects: [
                    {
                      id: "tlist",
                      typeLabel: "list",
                      value: "['Parse', 'Save']",
                      mutable: true,
                      highlight: true,
                      cells: [{ index: "0", value: "'Parse'" }, { index: "1", value: "'Save'" }],
                    },
                    { id: "scan_val", typeLabel: "str", value: "'Scan'", highlight: true },
                  ],
                },
              ],
            },
            {
              label: "sorted(nums) vs nums.sort()",
              code: [
                "nums = [40, 10, 30]",
                "copy_list = sorted(nums)",
                "res = nums.sort()",
              ],
              steps: [
                {
                  line: 1,
                  note: "nums points to [40, 10, 30].",
                  frames: [{ name: "Variables", bindings: [{ label: "nums", targetId: "orig", highlight: true }] }],
                  objects: [
                    {
                      id: "orig",
                      typeLabel: "list",
                      value: "[40, 10, 30]",
                      mutable: true,
                      cells: [{ index: "0", value: "40" }, { index: "1", value: "10" }, { index: "2", value: "30" }],
                    },
                  ],
                },
                {
                  line: 2,
                  note: "sorted(nums) creates a separate sorted list [10, 30, 40] for copy_list; nums stays unchanged.",
                  frames: [
                    {
                      name: "Variables",
                      bindings: [
                        { label: "nums", targetId: "orig" },
                        { label: "copy_list", targetId: "sorted_copy", highlight: true },
                      ],
                    },
                  ],
                  objects: [
                    {
                      id: "orig",
                      typeLabel: "list",
                      value: "[40, 10, 30]",
                      mutable: true,
                      cells: [{ index: "0", value: "40" }, { index: "1", value: "10" }, { index: "2", value: "30" }],
                    },
                    {
                      id: "sorted_copy",
                      typeLabel: "list (new)",
                      value: "[10, 30, 40]",
                      mutable: true,
                      highlight: true,
                      cells: [{ index: "0", value: "10", active: true }, { index: "1", value: "30", active: true }, { index: "2", value: "40", active: true }],
                    },
                  ],
                },
                {
                  line: 3,
                  note: "nums.sort() rearranges nums directly in place and returns None into res!",
                  frames: [
                    {
                      name: "Variables",
                      bindings: [
                        { label: "nums", targetId: "orig", highlight: true },
                        { label: "copy_list", targetId: "sorted_copy" },
                        { label: "res", targetId: "none_val", highlight: true },
                      ],
                    },
                  ],
                  objects: [
                    {
                      id: "orig",
                      typeLabel: "list",
                      value: "[10, 30, 40]",
                      mutable: true,
                      highlight: true,
                      cells: [{ index: "0", value: "10", active: true }, { index: "1", value: "30", active: true }, { index: "2", value: "40", active: true }],
                    },
                    {
                      id: "sorted_copy",
                      typeLabel: "list (new)",
                      value: "[10, 30, 40]",
                      mutable: true,
                      cells: [{ index: "0", value: "10" }, { index: "1", value: "30" }, { index: "2", value: "40" }],
                    },
                    { id: "none_val", typeLabel: "NoneType", value: "None", highlight: true },
                  ],
                },
              ],
            },
          ],
        },
        code: [
          "scores = [40, 10, 30]",
          "# ordered = scores.sort()           # BUG -> mutates scores and sets ordered = None",
          "ordered = sorted(scores)            # [10, 30, 40], scores untouched",
          "scores.sort(reverse=True)           # mutates scores in place",
          "print(ordered, scores)",
        ],
        output: "[10, 30, 40] [40, 30, 10]",
        callout: {
          kind: "WATCH OUT",
          text: "`scores = scores.sort()` overwrites `scores` with `None`. Call `scores.sort()` as its own statement or assign `sorted(scores)`.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build a Task Queue Without Mutating the Source",
      steps: [
        {
          label: "Step 1: Copy source list and append a task",
          explanation: "Start with `q = tasks.copy()` so `tasks` stays untouched, then push `\"review\"` onto the end.",
          code: [
            "tasks = [\"email\"]",
            "q = tasks.copy()",
            "q.append(\"review\")",
            "print(q)",
          ],
          activeLines: [2, 3],
          output: "['email', 'review']",
        },
        {
          label: "Step 2: Extend a batch and pop the front item",
          explanation: "Splice two new tasks with `.extend(...)` and pull slot `0` with `.pop(0)`.",
          code: [
            "tasks = [\"email\"]",
            "q = tasks.copy()",
            "q.append(\"review\")",
            "q.extend([\"test\", \"deploy\"])",
            "first = q.pop(0)",
            "print(first, q)",
          ],
          activeLines: [4, 5],
          output: "email ['review', 'test', 'deploy']",
        },
        {
          label: "Step 3: Create a sorted copy without altering queue order",
          explanation: "Call `sorted(q)` so `ranked` is alphabetical while `q` keeps its arrival order.",
          code: [
            "tasks = [\"email\"]",
            "q = tasks.copy()",
            "q.append(\"review\")",
            "q.extend([\"test\", \"deploy\"])",
            "first = q.pop(0)",
            "ranked = sorted(q)",
            "print(ranked, q)",
          ],
          activeLines: [6, 7],
          output: "['deploy', 'review', 'test'] ['review', 'test', 'deploy']",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `.append()`, `.extend()`, `.pop(0)`, and `sorted()`",
      steps: [
        {
          title: "Append one string vs extend a batch of strings",
          tag: "MEMORY",
          explanation: ["`.append(\"review\")` adds 1 item; `.extend([\"test\", \"deploy\"])` adds 2 separate items instead of a nested list."],
          code: ["tasks = [\"email\"]", "tasks.append(\"review\")", "tasks.extend([\"test\", \"deploy\"])", "first = tasks.pop(0)", "ranked = sorted(tasks)"],
          activeLines: [1, 2, 3],
          state: [{ name: "tasks", value: "['email', 'review', 'test', 'deploy']", changed: true }],
          visual: {
            kind: "memory",
            caption: ".append and .extend grow the same list object in place.",
            frames: [{ name: "Variables", bindings: [{ label: "tasks", targetId: "tasks_list", highlight: true }] }],
            objects: [
              {
                id: "tasks_list",
                typeLabel: "list",
                value: "4 items",
                mutable: true,
                highlight: true,
                cells: [
                  { index: "0", value: "'email'" },
                  { index: "1", value: "'review'", active: true },
                  { index: "2", value: "'test'", active: true },
                  { index: "3", value: "'deploy'", active: true },
                ],
              },
            ],
          },
        },
        {
          title: "Pop index `0` and capture the removed value",
          tag: "MEMORY",
          explanation: ["`tasks.pop(0)` extracts `'email'` into `first` and leaves 3 items in `tasks`."],
          code: ["tasks = [\"email\"]", "tasks.append(\"review\")", "tasks.extend([\"test\", \"deploy\"])", "first = tasks.pop(0)", "ranked = sorted(tasks)"],
          activeLines: [4],
          state: [
            { name: "first", value: "'email'", changed: true },
            { name: "tasks", value: "['review', 'test', 'deploy']", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "pop(0) removes index 0, shifts remaining items left, and returns 'email'.",
            frames: [
              {
                name: "Variables",
                bindings: [
                  { label: "tasks", targetId: "tasks_list" },
                  { label: "first", targetId: "first_val", highlight: true },
                ],
              },
            ],
            objects: [
              {
                id: "tasks_list",
                typeLabel: "list",
                value: "3 items",
                mutable: true,
                cells: [
                  { index: "0", value: "'review'" },
                  { index: "1", value: "'test'" },
                  { index: "2", value: "'deploy'" },
                ],
              },
              { id: "first_val", typeLabel: "str", value: "'email'", highlight: true },
            ],
          },
        },
        {
          title: "Create a sorted copy with `sorted(tasks)`",
          tag: "MEMORY",
          explanation: ["`sorted(tasks)` builds a new alphabetically ordered list `ranked` while leaving `tasks` in arrival order."],
          code: ["tasks = [\"email\"]", "tasks.append(\"review\")", "tasks.extend([\"test\", \"deploy\"])", "first = tasks.pop(0)", "ranked = sorted(tasks)"],
          activeLines: [5],
          state: [
            { name: "tasks", value: "['review', 'test', 'deploy']" },
            { name: "ranked", value: "['deploy', 'review', 'test']", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "sorted(tasks) allocates a separate sorted list ranked while tasks stays untouched.",
            frames: [
              {
                name: "Variables",
                bindings: [
                  { label: "tasks", targetId: "tasks_list" },
                  { label: "ranked", targetId: "ranked_list", highlight: true },
                ],
              },
            ],
            objects: [
              {
                id: "tasks_list",
                typeLabel: "list",
                value: "arrival order",
                mutable: true,
                cells: [
                  { index: "0", value: "'review'" },
                  { index: "1", value: "'test'" },
                  { index: "2", value: "'deploy'" },
                ],
              },
              {
                id: "ranked_list",
                typeLabel: "list (new)",
                value: "sorted copy",
                mutable: true,
                highlight: true,
                cells: [
                  { index: "0", value: "'deploy'", active: true },
                  { index: "1", value: "'review'", active: true },
                  { index: "2", value: "'test'", active: true },
                ],
              },
            ],
          },
        },
        {
          title: "Contrast `tasks.sort()` returning `None`",
          tag: "PITFALL",
          explanation: ["In-place `.sort()` mutates the target list directly and always returns `None`."],
          code: ["res = tasks.sort()", "print(res, tasks)"],
          activeLines: [1, 2],
          state: [
            { name: "res", value: "None", changed: true },
            { name: "tasks", value: "['deploy', 'review', 'test']" },
          ],
          visual: {
            kind: "memory",
            caption: "list.sort() reorders tasks in place and returns None instead of a new list.",
            frames: [
              {
                name: "Variables",
                bindings: [
                  { label: "res", targetId: "none_val", highlight: true },
                  { label: "tasks", targetId: "tasks_list" },
                ],
              },
            ],
            objects: [
              { id: "none_val", typeLabel: "NoneType", value: "None", highlight: true },
              {
                id: "tasks_list",
                typeLabel: "list (mutated)",
                value: "3 items",
                mutable: true,
                cells: [
                  { index: "0", value: "'deploy'", active: true },
                  { index: "1", value: "'review'", active: true },
                  { index: "2", value: "'test'", active: true },
                ],
              },
            ],
          },
          output: "None ['deploy', 'review', 'test']",
        },
      ],
    },
    trickyPoints: [
      {
        title: "Calling `.remove(x)` when `x` is absent raises `ValueError`",
        detail: "Check `if x in items: items.remove(x)` before removing unvalidated values.",
      },
      {
        title: "Confusing `.append([3, 4])` with `.extend([3, 4])`",
        detail: "`.append([3, 4])` adds a single nested list item (`[1, 2, [3, 4]]`), whereas `.extend([3, 4])` splices `[1, 2, 3, 4]`.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(res, nums)` print?",
        code: "nums = [3, 1, 2]\nres = nums.sort()\nprint(res, nums)",
        options: [
          { id: "a", label: "`[1, 2, 3] [1, 2, 3]`" },
          { id: "b", label: "`None [1, 2, 3]`" },
          { id: "c", label: "`None [3, 1, 2]`" },
        ],
        correctId: "b",
        explanation: "`.sort()` mutates `nums` in place and returns `None`.",
      },
      {
        prompt: "What does `print(len(a), len(b))` output?",
        code: "a = [1, 2]\nb = [1, 2]\na.extend([3, 4])\nb.append([3, 4])\nprint(len(a), len(b))",
        options: [
          { id: "a", label: "`4 3`" },
          { id: "b", label: "`3 3`" },
          { id: "c", label: "`4 4`" },
        ],
        correctId: "a",
        explanation: "`.extend([3, 4])` expands to length `4`, while `.append([3, 4])` appends one nested list (`len == 3`).",
      },
    ],
    practiceTask: {
      title: "Warmup: Append, Extend & Pop Queue",
      tier: "Warmup",
      goal: "Copy `tasks` into `q`, append `\"review\"`, extend with `extra`, pop index `0` into `first`, and print `first` and `q`.",
      constraints: ["Do not mutate the original tasks list"],
      examples: [
        { input: "tasks = [\"email\"], extra = [\"test\", \"deploy\"]", output: "email\n['review', 'test', 'deploy']" },
        { input: "tasks = [], extra = [\"ship\"]", output: "review\n['ship']" },
      ],
      tasks: [
        "Make a working copy `q = tasks.copy()`.",
        "Append `\"review\"`, extend with `extra`, pop index `0`, and print `first` and `q`.",
      ],
      starterCode: "# Exercise M03.2 Warmup: append, extend, pop(0)\ntasks = [\"email\"]\nextra = [\"test\", \"deploy\"]\n# TODO: copy tasks into q, append \"review\", extend extra, pop(0), and print\n",
      expectedOutput: "email\n['review', 'test', 'deploy']\nreview\n['ship']",
      hint: "Copy `tasks` with `.copy()` first so `tasks` stays untouched.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "tasks = [\"email\"]\nextra = [\"test\", \"deploy\"]\nq = tasks.copy()\nq.append(\"review\")\nq.extend(extra)\nfirst = q.pop(0)\nprint(first)\nprint(q)\n\ntasks = []\nextra = [\"ship\"]\nq = tasks.copy()\nq.append(\"review\")\nq.extend(extra)\nfirst = q.pop(0)\nprint(first)\nprint(q)",
    },
    practiceChallenges: [
      {
        title: "Core: Safe Remove & Non-Mutating Sort",
        tier: "Core",
        goal: "Copy `readings` into `cleaned`, remove `bad_val` only if present, append `new_val`, then print `cleaned` and `sorted(cleaned, reverse=True)`.",
        constraints: ["Never raise ValueError if bad_val is missing"],
        examples: [
          { input: "readings = [22, 999, 19, 25], bad_val = 999, new_val = 21", output: "[22, 19, 25, 21]\n[25, 22, 21, 19]" },
          { input: "readings = [10, 30], bad_val = 999, new_val = 20", output: "[10, 30, 20]\n[30, 20, 10]" },
        ],
        tasks: [
          "Copy `cleaned = readings.copy()` and guard `.remove(bad_val)` with `if bad_val in cleaned:`.",
          "Append `new_val`, then print `cleaned` and `sorted(cleaned, reverse=True)`.",
        ],
        starterCode: "# Exercise M03.2 Core: guarded remove and ranked copy\nreadings = [22, 999, 19, 25]\nbad_val = 999\nnew_val = 21\n# TODO: copy, remove bad_val if present, append new_val, and print cleaned + sorted desc\n",
        expectedOutput: "[22, 19, 25, 21]\n[25, 22, 21, 19]\n[10, 30, 20]\n[30, 20, 10]",
        hint: "Use `sorted(cleaned, reverse=True)` so `cleaned` keeps its insertion order.",
        complexity: { time: "O(n log n)", space: "O(n)" },
        solutionCode:
          "readings = [22, 999, 19, 25]\nbad_val = 999\nnew_val = 21\ncleaned = readings.copy()\nif bad_val in cleaned:\n    cleaned.remove(bad_val)\ncleaned.append(new_val)\nprint(cleaned)\nprint(sorted(cleaned, reverse=True))\n\nreadings = [10, 30]\nbad_val = 999\nnew_val = 20\ncleaned = readings.copy()\nif bad_val in cleaned:\n    cleaned.remove(bad_val)\ncleaned.append(new_val)\nprint(cleaned)\nprint(sorted(cleaned, reverse=True))",
      },
      {
        title: "Stretch: Replace First & Last Without Losing Sorted Rank",
        tier: "Stretch",
        goal: "Given non-empty `scores`, save `orig_sorted = sorted(scores)` first, then update a copy by setting slot `0` to `new_first` and popping the last element only if `len(updated) >= 2`, and print both lists.",
        constraints: ["1 <= len(scores)", "Original scores list must remain unmodified"],
        examples: [
          { input: "scores = [30, 10, 20], new_first = 99", output: "[10, 20, 30]\n[99, 10]" },
          { input: "scores = [50], new_first = 77", output: "[50]\n[77]" },
        ],
        tasks: [
          "Compute `orig_sorted = sorted(scores)` first.",
          "Update a `.copy()` of `scores`, overwriting index `0` with `new_first` and popping last only when `len(updated) >= 2`.",
          "Print `orig_sorted` and `updated`.",
        ],
        starterCode: "# Exercise M03.2 Stretch: preserve input while transforming copy\nscores = [30, 10, 20]\nnew_first = 99\n# TODO: sort original non-destructively, then patch copy and print both\n",
        expectedOutput: "[10, 20, 30]\n[99, 10]\n[50]\n[77]",
        hint: "Guard `.pop()` with `if len(updated) >= 2:`.",
        complexity: { time: "O(n log n)", space: "O(n)" },
        solutionCode:
          "scores = [30, 10, 20]\nnew_first = 99\norig_sorted = sorted(scores)\nupdated = scores.copy()\nupdated[0] = new_first\nif len(updated) >= 2:\n    updated.pop()\nprint(orig_sorted)\nprint(updated)\n\nscores = [50]\nnew_first = 77\norig_sorted = sorted(scores)\nupdated = scores.copy()\nupdated[0] = new_first\nif len(updated) >= 2:\n    updated.pop()\nprint(orig_sorted)\nprint(updated)",
      },
    ],
  },

  "py-for-lists": {
    lessonId: "py-for-lists",
    subtitle: "Iterate sequences element by element with `for item in collection:` without mutating the source list.",
    intro: {
      heading: "Walking Sequences With `for ... in`",
      explanation: [
        "Calling `nums.remove(n)` inside `for n in nums:` shifts later items left while the loop cursor keeps stepping forward, so adjacent matches like `4` in `[2, 4, 6]` get skipped completely. Writing `for x in nums: x *= 2` also leaves `nums` untouched because `x` is only a temporary loop variable.",
        "Walk sequences with `for item in items:` to read one element per pass, and append matching or transformed values into a separate output list rather than editing the source list mid-loop.",
      ],
      analogy: "Inspecting items on a moving grocery belt works best when you place approved items into a new basket: pulling cans off the belt while your eyes step slot by slot makes you skip the can that slid into the gap.",
      realWorldUses: [
        "Filtering log lines, sensor readings, or affordable prices into a new list",
        "Transforming raw scores or tags into normalized values without mutating source data",
      ],
    },
    sections: [
      {
        heading: "Iterating Sequences with `for ... in` and Nested `if`",
        paragraphs: [
          "In `for student in students:`, Python binds `student` to each item in turn and executes the 4-space indented loop body.",
          "You can indent an `if` block inside the loop body (8 spaces total) to process matching items selectively.",
        ],
        code: [
          "scores = [45, 88, 52, 91]",
          "for s in scores:",
          "    if s >= 60:",
          "        print(s, \"-> Pass\")",
          "    else:",
          "        print(s, \"-> Retry\")",
        ],
        output: "45 -> Retry\n88 -> Pass\n52 -> Retry\n91 -> Pass",
      },
      {
        heading: "Two Classic Traps: Mutating Mid-Loop (`remove`) & Rebinding `x *= 2`",
        paragraphs: [
          "Calling `nums.remove(n)` inside `for n in nums:` shifts remaining elements left under the internal loop cursor, causing elements right after removed items to be skipped. Build a new filtered list instead.",
          "Likewise, `for x in nums: x *= 2` only rebinds the loop variable `x` temporarily without modifying the list. Append `x * 2` into a new list instead.",
        ],
        code: [
          "nums = [2, 4, 5, 6]",
          "# Broken filter: removing 2 shifts 4 to index 0, so cursor 1 reads 5 and skips 4 -> [4, 5]",
          "for x in nums:",
          "    x *= 2             # changes local x only, leaving nums unchanged",
          "print(\"Unchanged:\", nums)",
          "odds_only = []",
          "for n in nums:",
          "    if n % 2 != 0:",
          "        odds_only.append(n)",
          "print(\"Odds:\", odds_only)",
        ],
        table: {
          caption: "`for` Loop Iteration Safety",
          headers: ["Pattern", "Behavior", "Safe When Filtering?"],
          rows: [
            ["`for x in items:`", "Reads items left-to-right (`x *= 2` will not mutate `items`)", "Yes when appending matches to a new list"],
            ["`nums.remove(n)` inside loop", "Shifts remaining indices left while cursor advances", "No: skips elements!"],
            ["`for ch in text:`", "Iterates each character of a `str`", "Strings are immutable"],
          ],
        },
        visual: {
          kind: "loop-stepper",
          caption: "Step through building a filtered list without modifying the source list",
          code: [
            "odds = []",
            "for n in [2, 5, 8, 9]:",
            "    if n % 2 != 0:",
            "        odds.append(n)",
            "print(odds)",
          ],
          iterations: [
            { label: "Start", activeLine: 1, vars: [{ name: "odds", value: "[]", changed: true }], output: "", status: "Initialize empty result list" },
            { label: "n=2 (even)", activeLine: 3, vars: [{ name: "n", value: "2", changed: true }, { name: "odds", value: "[]" }], output: "", status: "2 % 2 != 0 is False -> skip" },
            { label: "n=5 (odd)", activeLine: 4, vars: [{ name: "n", value: "5", changed: true }, { name: "odds", value: "[5]", changed: true }], output: "", status: "Appended 5" },
            { label: "n=8 (even)", activeLine: 3, vars: [{ name: "n", value: "8", changed: true }, { name: "odds", value: "[5]" }], output: "", status: "8 % 2 != 0 is False -> skip" },
            { label: "n=9 (odd)", activeLine: 4, vars: [{ name: "n", value: "9", changed: true }, { name: "odds", value: "[5, 9]", changed: true }], output: "", status: "Appended 9" },
            { label: "Print result", activeLine: 5, vars: [{ name: "n", value: "9" }, { name: "odds", value: "[5, 9]" }], output: "[5, 9]", status: "Loop complete" },
          ],
        },
        output: "Unchanged: [2, 4, 5, 6]\nOdds: [5]",
      },
    ],
    guidedBuildUp: {
      title: "Filter Passing Scores Into a New List",
      steps: [
        {
          label: "Step 1: Walk scores read-only",
          explanation: "Visit each score one by one using `for s in scores:`.",
          code: [
            "scores = [45, 88, 52, 91]",
            "for s in scores:",
            "    print(s)",
          ],
          activeLines: [2, 3],
          output: "45\n88\n52\n91",
        },
        {
          label: "Step 2: Collect passing scores into a new list",
          explanation: "Initialize `passed = []` above the loop and append scores where `s >= 60`.",
          code: [
            "scores = [45, 88, 52, 91]",
            "passed = []",
            "for s in scores:",
            "    if s >= 60:",
            "        passed.append(s)",
            "print(passed)",
          ],
          activeLines: [2, 4, 5],
          output: "[88, 91]",
        },
        {
          label: "Step 3: Verify the source list stayed untouched",
          explanation: "Print both `passed` and `scores` to confirm no indices shifted or vanished.",
          code: [
            "scores = [45, 88, 52, 91]",
            "passed = []",
            "for s in scores:",
            "    if s >= 60:",
            "        passed.append(s)",
            "print(\"Passed:\", passed)",
            "print(\"Source:\", scores)",
          ],
          activeLines: [6, 7],
          output: "Passed: [88, 91]\nSource: [45, 88, 52, 91]",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Why `nums.remove(n)` Skips `4` vs Safe New List Filtering",
      steps: [
        {
          title: "Pass 1 (index 0): `n = 2` is removed, shifting `4` into index `0`",
          tag: "PITFALL",
          explanation: ["At index `0`, `n = 2` matches `n % 2 == 0`, so `remove(2)` deletes it. Remaining elements slide left: `[4, 5, 6]`."],
          code: ["nums = [2, 4, 5, 6]","for n in nums:","    if n % 2 == 0:","        nums.remove(n)","print(nums)"],
          activeLines: [2, 3, 4],
          state: [
            { name: "cursor", value: "0" },
            { name: "n", value: "2", changed: true },
            { name: "nums", value: "[4, 5, 6]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Removing 2 at cursor = 0 shifts 4 left into index 0 before the next step.",
            trays: [
              {
                label: "nums (after remove)",
                cells: [
                  { id: "n4", value: "4", index: 0, state: "pivot" },
                  { id: "n5", value: "5", index: 1, state: "default" },
                  { id: "n6", value: "6", index: 2, state: "default" },
                ],
                pointers: [{ index: 0, label: "cursor = 0", tone: "coral" }],
              },
            ],
          },
        },
        {
          title: "Pass 2 (index 1): cursor steps to `5` and skips `4`",
          tag: "TRACE",
          explanation: ["The loop increments its index to `1`, which now holds `5` (`4` slid back into index `0` and is never inspected)."],
          code: ["nums = [2, 4, 5, 6]","for n in nums:","    if n % 2 == 0:","        nums.remove(n)","print(nums)"],
          activeLines: [2, 3],
          state: [
            { name: "cursor", value: "1", changed: true },
            { name: "n", value: "5", changed: true },
            { name: "nums", value: "[4, 5, 6]" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "cursor advances to index 1 (value 5), completely skipping 4 at index 0.",
            trays: [
              {
                label: "nums",
                cells: [
                  { id: "n4", value: "4", index: 0, state: "dim" },
                  { id: "n5", value: "5", index: 1, state: "active" },
                  { id: "n6", value: "6", index: 2, state: "default" },
                ],
                pointers: [{ index: 1, label: "cursor = 1", tone: "accent" }],
              },
            ],
          },
        },
        {
          title: "Pass 3 (index 2): `n = 6` is removed -> broken result `[4, 5]`",
          tag: "PITFALL",
          explanation: ["Index `2` holds `6`, which gets removed, leaving stray even number `4` inside `nums`."],
          code: ["nums = [2, 4, 5, 6]","for n in nums:","    if n % 2 == 0:","        nums.remove(n)","print(nums)"],
          activeLines: [4, 5],
          state: [
            { name: "cursor", value: "2", changed: true },
            { name: "nums", value: "[4, 5]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "cursor = 2 reaches end after removing 6; even value 4 remains trapped inside nums.",
            trays: [
              {
                label: "nums (buggy)",
                cells: [
                  { id: "n4", value: "4", index: 0, state: "pivot" },
                  { id: "n5", value: "5", index: 1, state: "done" },
                ],
                pointers: [{ index: 0, label: "skipped 4!", tone: "coral" }],
              },
            ],
          },
          output: "[4, 5]",
        },
        {
          title: "Fix: build `odds = []` so source `nums` never shifts",
          tag: "PATTERN",
          explanation: ["Reading `nums` read-only and appending matches to `odds` inspects every element and returns `[5]` reliably."],
          code: ["odds = []","for n in [2, 4, 5, 6]:","    if n % 2 != 0:","        odds.append(n)"],
          activeLines: [1, 2, 3, 4],
          state: [{ name: "odds", value: "[5]", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "Iterating nums read-only inspects all 4 items and appends only odd items to odds.",
            trays: [
              {
                label: "source (read-only)",
                cells: [
                  { id: "s2", value: "2", index: 0, state: "dim" },
                  { id: "s4", value: "4", index: 1, state: "dim" },
                  { id: "s5", value: "5", index: 2, state: "done" },
                  { id: "s6", value: "6", index: 3, state: "dim" },
                ],
              },
              {
                label: "odds (output)",
                cells: [{ id: "o5", value: "5", index: 0, state: "active" }],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Writing `for x in nums: x *= 2` expecting `nums` to change",
        detail: "Reassigning `x` only rebinds the loop variable; build a new list `[...]` to keep doubled values.",
      },
      {
        title: "Calling `.remove()` on the list currently being iterated",
        detail: "Use a new filtered list (`kept.append(x)`) so elements cannot shift past the loop cursor.",
      },
    ],
    predictChecks: [
      {
        prompt: "How many times does `\"hi\"` get printed?",
        code: "for ch in \"cat\":\n    print(\"hi\")",
        options: [
          { id: "a", label: "1 time" },
          { id: "b", label: "3 times (once per character)" },
          { id: "c", label: "Error (cannot iterate a string)" },
        ],
        correctId: "b",
        explanation: "Strings are character sequences (`'c'`, `'a'`, `'t'`), so the loop runs 3 times.",
      },
      {
        prompt: "Why does `nums.remove(n)` inside `for n in nums:` leave `4` in `[2, 4, 6]`?",
        code: "nums = [2, 4, 6]\nfor n in nums:\n    if n % 2 == 0:\n        nums.remove(n)\nprint(nums)",
        options: [
          { id: "a", label: "Removing `2` shifts `4` left to index `0`, so step 2 reads index `1` (`6`) and skips `4`" },
          { id: "b", label: "Python raises `RuntimeError` immediately" },
          { id: "c", label: "All items are removed (`[]`)" },
        ],
        correctId: "a",
        explanation: "Mutating a list changes slot indices underneath the iterator.",
      },
    ],
    practiceTask: {
      title: "Warmup: Filter Affordable Prices",
      tier: "Warmup",
      goal: "Build and print a new list containing every price from `prices` strictly under `limit`.",
      constraints: ["Do not mutate prices"],
      examples: [
        { input: "prices = [120, 45, 290, 15, 85], limit = 100", output: "[45, 15, 85]" },
        { input: "prices = [100, 150], limit = 100", output: "[]" },
      ],
      tasks: [
        "Initialize `under = []` before the loop.",
        "Append `p` when `p < limit` and print `under` after the loop.",
      ],
      starterCode: "# Exercise M03.3 Warmup: safe non-mutating filter\nprices = [120, 45, 290, 15, 85]\nlimit = 100\n# TODO: collect prices strictly below limit and print under\n",
      expectedOutput: "[45, 15, 85]\n[]",
      hint: "Keep strict comparison `p < limit` so exact `100` is excluded.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "prices = [120, 45, 290, 15, 85]\nlimit = 100\nunder = []\nfor p in prices:\n    if p < limit:\n        under.append(p)\nprint(under)\n\nprices = [100, 150]\nlimit = 100\nunder = []\nfor p in prices:\n    if p < limit:\n        under.append(p)\nprint(under)",
    },
    practiceChallenges: [
      {
        title: "Core: Strip Empty Tags Without Mutating Input",
        tier: "Core",
        goal: "Loop over `raw_tags`, build and print a new list containing only non-empty tags, and leave `raw_tags` unchanged.",
        constraints: ["Do not call .remove() while looping"],
        examples: [
          { input: "raw_tags = [\"python\", \"\", \"\", \"loops\"]", output: "['python', 'loops']" },
          { input: "raw_tags = [\"\", \"\"]", output: "[]" },
        ],
        tasks: [
          "Collect items where `tag != \"\"` into `clean = []` (back-to-back empty strings `\"\", \"\"` will not be skipped!).",
          "Print `clean`.",
        ],
        starterCode: "# Exercise M03.3 Core: strip consecutive empty strings\nraw_tags = [\"python\", \"\", \"\", \"loops\"]\n# TODO: build clean tag list without mutating raw_tags and print it\n",
        expectedOutput: "['python', 'loops']\n[]",
        hint: "Append to a fresh list `clean = []` whenever `if tag:` holds.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "raw_tags = [\"python\", \"\", \"\", \"loops\"]\nclean = []\nfor tag in raw_tags:\n    if tag:\n        clean.append(tag)\nprint(clean)\n\nraw_tags = [\"\", \"\"]\nclean = []\nfor tag in raw_tags:\n    if tag:\n        clean.append(tag)\nprint(clean)",
      },
      {
        title: "Stretch: Drop Matching Evens & Double Odds",
        tier: "Stretch",
        goal: "Given `nums`, keep only odd numbers and double each odd number (`n * 2`) into a brand-new list `out`, then print `out` without modifying `nums`.",
        constraints: ["Adjacent even numbers like [2, 4, 6] must all be dropped"],
        examples: [
          { input: "nums = [2, 4, 5, 6, 3]", output: "[10, 6]" },
          { input: "nums = [2, 4, 6]", output: "[]" },
        ],
        tasks: [
          "Test `if n % 2 != 0:` inside `for n in nums:`.",
          "Append `n * 2` to `out` rather than changing `n` in place, then print `out`.",
        ],
        starterCode: "# Exercise M03.3 Stretch: filter + transform into new list\nnums = [2, 4, 5, 6, 3]\n# TODO: keep odd elements, double them into out, and print out\n",
        expectedOutput: "[10, 6]\n[]",
        hint: "Reassigning `n *= 2` would not update `nums` anyway; append `n * 2` to `out`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "nums = [2, 4, 5, 6, 3]\nout = []\nfor n in nums:\n    if n % 2 != 0:\n        out.append(n * 2)\nprint(out)\n\nnums = [2, 4, 6]\nout = []\nfor n in nums:\n    if n % 2 != 0:\n        out.append(n * 2)\nprint(out)",
      },
    ],
  },

  "py-for-range": {
    lessonId: "py-for-range",
    subtitle: "Generate integer sequences and index loops with `range(stop)` and `range(start, stop, step)`.",
    intro: {
      heading: "Counting and Indexing With `range()`",
      explanation: [
        "Writing `range(1, 5)` to count from `1` through `5` leaves out `5` because Python always stops before the upper bound, and writing `range(5, 0)` to count down produces `[]` with zero turns because the default step moves upward by `+1`.",
        "`range(start, stop, step)` generates integers on demand up to (excluding) `stop`, and `range(len(items))` supplies slot numbers `0..len-1` whenever you need to write updated values back into `items[i]`.",
      ],
      analogy: "Elevator floor announcements call out stops 1 through 5 in order without printing a paper ticket for every floor first, just as `range(1, 6)` produces numbers one turn at a time.",
      realWorldUses: [
        "Repeating fixed-count simulations or countdowns with explicit start, stop, and step",
        "Updating every slot (or every second slot) of a numeric list in place by index",
      ],
    },
    sections: [
      {
        heading: "Counting, Custom Steps & `list(range(...))`",
        paragraphs: [
          "`range(stop)` produces `0, 1, ..., stop - 1`. Pass two arguments `range(1, 6)` to start at `1`, or three arguments `range(start, stop, step)` to step by `2` or count down with `-1`.",
          "To materialize a `range` into a list (for display or equality tests), wrap it in `list(range(...))`.",
        ],
        code: [
          "print(list(range(1, 5)))      # [1, 2, 3, 4] (misses 5 because stop is exclusive)",
          "print(list(range(1, 6)))      # [1, 2, 3, 4, 5]",
          "print(list(range(5, 0)))      # [] (default step +1 cannot count down)",
          "print(list(range(5, 0, -1)))  # [5, 4, 3, 2, 1]",
          "for n in range(0, 10, 2):",
          "    print(n, end=\" \")",
        ],
        table: {
          caption: "`range()` Signatures & Common Index Loops",
          headers: ["Call", "Generated Numbers", "Typical Use"],
          rows: [
            ["`range(5)`", "`0, 1, 2, 3, 4`", "Repeat 5 times from index `0`"],
            ["`range(1, 6)`", "`1, 2, 3, 4, 5`", "1-based counting (`stop = last + 1`)"],
            ["`range(0, 10, 2)`", "`0, 2, 4, 6, 8`", "Fixed even/odd steps"],
            ["`range(5, 0, -1)`", "`5, 4, 3, 2, 1`", "Countdown (requires negative step)"],
            ["`range(len(items))`", "`0 .. len(items) - 1`", "Mutate slots in place (`items[i] += 2`)"],
          ],
        },
        visual: {
          kind: "loop-stepper",
          caption: "Step through range(2, 9, 3) to see why 11 stops before 9",
          code: [
            "for x in range(2, 9, 3):",
            "    print(x)",
            "print(\"Done\")",
          ],
          iterations: [
            { label: "Pass 1 (x=2)", activeLine: 2, vars: [{ name: "x", value: "2", changed: true }], output: "2", status: "2 < 9 -> enters loop" },
            { label: "Pass 2 (x=5)", activeLine: 2, vars: [{ name: "x", value: "5", changed: true }], output: "2\n5", status: "2 + 3 = 5 < 9" },
            { label: "Pass 3 (x=8)", activeLine: 2, vars: [{ name: "x", value: "8", changed: true }], output: "2\n5\n8", status: "5 + 3 = 8 < 9" },
            { label: "Stop (next 11 >= 9)", activeLine: 3, vars: [{ name: "x", value: "8" }], output: "2\n5\n8\nDone", status: "11 is not < 9 -> exits loop" },
          ],
        },
        output: "[1, 2, 3, 4]\n[1, 2, 3, 4, 5]\n[]\n[5, 4, 3, 2, 1]\n0 2 4 6 8 ",
      },
      {
        heading: "Updating Elements In Place via `for i in range(len(items)):`",
        paragraphs: [
          "Stick to `for item in items:` when reading values. Reach for `for i in range(len(items)):` when you must write back into a specific list slot (`temps[i] += 2`).",
        ],
        code: [
          "temps = [20, 22, 19]",
          "# for t in temps: t += 2    # BUG: updates local t only, temps stays [20, 22, 19]",
          "for i in range(len(temps)):",
          "    temps[i] += 2",
          "print(\"Adjusted:\", temps)",
        ],
        output: "Adjusted: [22, 24, 21]",
      },
    ],
    guidedBuildUp: {
      title: "Calibrate Sensor Slots by Index",
      steps: [
        {
          label: "Step 1: Generate valid list indices",
          explanation: "Use `range(len(temps))` to visit slot numbers `0`, `1`, and `2`.",
          code: [
            "temps = [20, 22, 19]",
            "for i in range(len(temps)):",
            "    print(i, temps[i])",
          ],
          activeLines: [2, 3],
          output: "0 20\n1 22\n2 19",
        },
        {
          label: "Step 2: Update each slot in place",
          explanation: "Write back through `temps[i] += 2` so the list changes in place.",
          code: [
            "temps = [20, 22, 19]",
            "for i in range(len(temps)):",
            "    temps[i] += 2",
            "print(temps)",
          ],
          activeLines: [3, 4],
          output: "[22, 24, 21]",
        },
        {
          label: "Step 3: Step every second slot with a step argument",
          explanation: "Pass `2` as the step in `range(0, len(temps), 2)` to adjust only slots `0` and `2`.",
          code: [
            "temps = [20, 22, 19]",
            "for i in range(0, len(temps), 2):",
            "    temps[i] += 2",
            "print(temps)",
          ],
          activeLines: [2, 3],
          output: "[22, 22, 21]",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Positive Step, Empty Reverse Trap & In-Place Index Update",
      steps: [
        {
          title: "Include final bound `5` using `stop = 6` in `range(1, 6)`",
          tag: "CONCEPT",
          explanation: ["`range(1, 6)` stops right before `6`, yielding `[1, 2, 3, 4, 5]`."],
          code: ["print(list(range(1, 6)))","print(list(range(5, 0)))","print(list(range(5, 0, -1)))","nums = [10, 20]","for i in range(len(nums)):","    nums[i] += 5"],
          activeLines: [1],
          state: [{ name: "range(1, 6)", value: "[1, 2, 3, 4, 5]", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "stop = 6 is exclusive, so range(1, 6) yields 1 through 5 and stops before 6.",
            trays: [
              {
                label: "range(1, 6)",
                cells: [
                  { id: "r1", value: "1", index: 0, state: "done" },
                  { id: "r2", value: "2", index: 1, state: "done" },
                  { id: "r3", value: "3", index: 2, state: "done" },
                  { id: "r4", value: "4", index: 3, state: "done" },
                  { id: "r5", value: "5", index: 4, state: "done" },
                  { id: "r6", value: "6 (stop)", index: 5, state: "dim" },
                ],
                highlightRange: [0, 4],
              },
            ],
          },
          output: "[1, 2, 3, 4, 5]",
        },
        {
          title: "Catch empty `range(5, 0)` when step `+1` is omitted",
          tag: "PITFALL",
          explanation: ["Because default step is `+1` and `5 > 0`, `range(5, 0)` produces `[]` immediately."],
          code: ["print(list(range(1, 6)))","print(list(range(5, 0)))","print(list(range(5, 0, -1)))","nums = [10, 20]","for i in range(len(nums)):","    nums[i] += 5"],
          activeLines: [2],
          state: [{ name: "range(5, 0)", value: "[]", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "Default step +1 moves upward from 5, so 5 < 0 fails immediately and yields an empty list [].",
            trays: [
              {
                label: "range(5, 0) -> [] (5 > 0 with step +1 yields 0 items)",
                cells: [],
              },
            ],
          },
          output: "[1, 2, 3, 4, 5]\n[]",
        },
        {
          title: "Add negative step `-1` for descending sequence",
          tag: "TRACE",
          explanation: ["`range(5, 0, -1)` counts backward `5, 4, 3, 2, 1` and stops before `0`."],
          code: ["print(list(range(1, 6)))","print(list(range(5, 0)))","print(list(range(5, 0, -1)))","nums = [10, 20]","for i in range(len(nums)):","    nums[i] += 5"],
          activeLines: [3],
          state: [{ name: "range(5, 0, -1)", value: "[5, 4, 3, 2, 1]", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "step = -1 counts down from 5 and stops right before exclusive bound 0.",
            trays: [
              {
                label: "range(5, 0, -1)",
                cells: [
                  { id: "d5", value: "5", index: 0, state: "done" },
                  { id: "d4", value: "4", index: 1, state: "done" },
                  { id: "d3", value: "3", index: 2, state: "done" },
                  { id: "d2", value: "2", index: 3, state: "done" },
                  { id: "d1", value: "1", index: 4, state: "done" },
                  { id: "d0", value: "0 (stop)", index: 5, state: "dim" },
                ],
                highlightRange: [0, 4],
              },
            ],
          },
          output: "[1, 2, 3, 4, 5]\n[]\n[5, 4, 3, 2, 1]",
        },
        {
          title: "Update slots directly with `for i in range(len(nums))`",
          tag: "TRACE",
          explanation: ["Looping indices `0, 1` modifies `nums[0]` (`15`) and `nums[1]` (`25`) directly in place."],
          code: ["print(list(range(1, 6)))","print(list(range(5, 0)))","print(list(range(5, 0, -1)))","nums = [10, 20]","for i in range(len(nums)):","    nums[i] += 5"],
          activeLines: [4, 5, 6],
          state: [{ name: "nums", value: "[15, 25]", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "range(len(nums)) generates indices 0 and 1 so nums[i] += 5 updates each slot in place.",
            trays: [
              {
                label: "nums (updated)",
                cells: [
                  { id: "u0", value: "15", index: 0, state: "active" },
                  { id: "u1", value: "25", index: 1, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "i = 0 (+5)", tone: "ok" },
                  { index: 1, label: "i = 1 (+5)", tone: "ok" },
                ],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "`range(1, 5)` stops at `4`, not `5`",
        detail: "Always pass `end + 1` as the `stop` bound when an upper endpoint must be included.",
      },
      {
        title: "`range(5, 0)` returns empty `[]` without `-1`",
        detail: "Countdown loops require explicit negative step `range(5, 0, -1)`.",
      },
    ],
    predictChecks: [
      {
        prompt: "Which numbers does `range(2, 9, 3)` generate?",
        code: "for x in range(2, 9, 3):\n    print(x)",
        options: [
          { id: "a", label: "`2`, `5`, `8`" },
          { id: "b", label: "`2`, `5`, `8`, `11`" },
          { id: "c", label: "`3`, `6`, `9`" },
        ],
        correctId: "a",
        explanation: "`2 -> 5 -> 8`; adding `3` again gives `11`, which reaches/exceeds `9` and stops.",
      },
      {
        prompt: "What does `list(range(5, 0))` produce without `-1`?",
        code: "print(list(range(5, 0)))",
        options: [
          { id: "a", label: "`[5, 4, 3, 2, 1]`" },
          { id: "b", label: "`[]` (empty)" },
          { id: "c", label: "`ValueError`" },
        ],
        correctId: "b",
        explanation: "Default step `+1` cannot reach `0` downward from `5`, so the range is empty.",
      },
    ],
    practiceTask: {
      title: "Warmup: Sum Even Numbers Between Two Bounds",
      tier: "Warmup",
      goal: "Sum every integer from `start` to `end` (inclusive) stepping by `2`, and print the total.",
      constraints: ["start <= end"],
      examples: [
        { input: "start = 2, end = 20", output: "110" },
        { input: "start = 4, end = 4", output: "4" },
      ],
      tasks: [
        "Loop with `range(start, end + 1, 2)`.",
        "Accumulate `total` and print it after the loop.",
      ],
      starterCode: "# Exercise M03.4 Warmup: stepped inclusive sum\nstart = 2\nend = 20\n# TODO: sum range(start, end + 1, 2) and print total\n",
      expectedOutput: "110\n4",
      hint: "Add `+ 1` to `end` so exact `end` is visited when reachable.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "start = 2\nend = 20\ntotal = 0\nfor n in range(start, end + 1, 2):\n    total += n\nprint(total)\n\nstart = 4\nend = 4\ntotal = 0\nfor n in range(start, end + 1, 2):\n    total += n\nprint(total)",
    },
    practiceChallenges: [
      {
        title: "Core: Countdown List Generator",
        tier: "Core",
        goal: "Build and print a list counting down from `n` to `1` inclusive (or `[]` if `n <= 0`).",
        constraints: ["Return `[]` when `n <= 0`"],
        examples: [
          { input: "n = 5", output: "[5, 4, 3, 2, 1]" },
          { input: "n = 0", output: "[]" },
        ],
        tasks: [
          "Print `list(range(n, 0, -1))`.",
          "Try changing `n` to `0` to confirm it prints `[]`.",
        ],
        starterCode: "# Exercise M03.4 Core: negative-step range countdown\nn = 5\n# TODO: build and print [n, ..., 1]\n",
        expectedOutput: "[5, 4, 3, 2, 1]\n[]",
        hint: "When `n = 0`, `range(0, 0, -1)` is automatically empty `[]`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "n = 5\nprint(list(range(n, 0, -1)))\n\nn = 0\nprint(list(range(n, 0, -1)))",
      },
      {
        title: "Stretch: Scale Only Even Indices In Place",
        tier: "Stretch",
        goal: "Using `range(0, len(out), 2)` to update a copy `out` in place, add `bonus` to every element at an even index (`0, 2, 4, ...`) and print `out`.",
        constraints: ["Works for empty and 1-element lists"],
        examples: [
          { input: "nums = [10, 20, 30, 40, 50], bonus = 5", output: "[15, 20, 35, 40, 55]" },
          { input: "nums = [], bonus = 5", output: "[]" },
        ],
        tasks: [
          "Copy `out = nums.copy()` first.",
          "Loop `for i in range(0, len(out), 2):` and add `bonus` to `out[i]`, then print `out`.",
        ],
        starterCode: "# Exercise M03.4 Stretch: index-stepped slot update\nnums = [10, 20, 30, 40, 50]\nbonus = 5\n# TODO: update indices 0, 2, 4... on a copy and print out\n",
        expectedOutput: "[15, 20, 35, 40, 55]\n[]",
        hint: "Passing step `2` directly into `range(0, len(out), 2)` skips odd indices with zero `if` checks.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "nums = [10, 20, 30, 40, 50]\nbonus = 5\nout = nums.copy()\nfor i in range(0, len(out), 2):\n    out[i] += bonus\nprint(out)\n\nnums = []\nbonus = 5\nout = nums.copy()\nfor i in range(0, len(out), 2):\n    out[i] += bonus\nprint(out)",
      },
    ],
  },

  "py-accumulators": {
    lessonId: "py-accumulators",
    subtitle: "Build running sums, counts, filtered lists, and max/min trackers with trace tables and empty-list guards.",
    intro: {
      heading: "Accumulating Totals, Counts, and Extremes Over a Loop",
      explanation: [
        "Starting a maximum tracker with `max_val = 0` looks right on positive data, then quietly returns `0` for `[-12, -4, -19]` even though `0` never appeared in the list. Placing `total = 0` inside a `for` loop likewise resets your sum every pass and leaves only the last item.",
        "Running totals, counts, filters, and min/max trackers all follow one 3-step structure: initialize before the loop (seeding extremes from `nums[0]` after an `if not nums:` guard), update inside the loop, and read the result after the loop finishes.",
      ],
      analogy: "A grocery checkout register starts the receipt total at 0 before the first item scans, adds each barcode one by one, and reads the sum after the basket is empty; resetting the register mid-belt would erase earlier items.",
      realWorldUses: [
        "Computing sums, averages, and threshold counts over sensor logs or expenses",
        "Tracking min/max bounds on datasets that may be negative or empty",
      ],
    },
    sections: [
      {
        heading: "The 3-Part Accumulator Pattern & Built-In `sum()`",
        paragraphs: [
          "1. Initialize before the loop (`total = 0`, `count = 0`, `kept = []`). 2. Iterate over items. 3. Update inside the loop (`total += x`). Reading or resetting the accumulator inside the loop erases prior iterations.",
          "For a simple unconditioned sum, Python's built-in `sum(expenses)` replaces the 3-line sum loop. Explicit accumulators matter when filtering or updating multiple summaries in one pass.",
        ],
        code: [
          "expenses = [12, 8, 25, 15]",
          "# BUG: putting total = 0 inside the loop resets it every pass -> prints 15",
          "total = 0",
          "for amount in expenses:",
          "    total += amount",
          "print(\"Loop total:\", total, \"sum():\", sum(expenses))",
        ],
        table: {
          caption: "Accumulator Initialization & Updates",
          headers: ["Goal", "Init Before Loop", "Update Inside Loop / Shortcut"],
          rows: [
            ["Running sum / product", "`total = 0` (`prod = 1`)", "`total += x` (or built-in `sum(items)`)"],
            ["Counting matches", "`count = 0`", "`if cond: count += 1`"],
            ["Collecting filtered items", "`kept = []`", "`if cond: kept.append(x)`"],
            ["Running max / min", "`if not nums:` guard, else `best = nums[0]`", "`if x > best: best = x`"],
          ],
        },
        output: "Loop total: 60 sum(): 60",
        callout: {
          kind: "WATCH OUT",
          text: "Placing `total = 0` inside the `for` loop resets `total` every pass, leaving only the final item at the end.",
        },
      },
      {
        heading: "Guarding `largest = nums[0]` on Empty & Negative Lists",
        paragraphs: [
          "Initializing `largest = 0` fails whenever every value in `nums` is negative (`[-12, -4, -19]` would report `0`). Seed `largest = nums[0]` so your starting candidate comes from the dataset itself.",
          "Always guard `if not nums:` before reading `nums[0]`, because accessing `[0]` on an empty list raises `IndexError`.",
        ],
        visual: {
          kind: "loop-stepper",
          caption: "Step through how total and count accumulate without resetting inside the loop",
          code: [
            "total = 0",
            "count = 0",
            "for x in [10, 5, 20]:",
            "    total += x",
            "    count += 1",
            "print(f\"Done: total={total}, count={count}\")",
          ],
          iterations: [
            { label: "Start", activeLine: 1, vars: [{ name: "total", value: "0", changed: true }, { name: "count", value: "0", changed: true }], output: "", status: "Initialize before loop" },
            { label: "Pass 1 (x=10)", activeLine: 4, vars: [{ name: "x", value: "10" }, { name: "total", value: "10", changed: true }, { name: "count", value: "1", changed: true }], output: "" },
            { label: "Pass 2 (x=5)", activeLine: 4, vars: [{ name: "x", value: "5" }, { name: "total", value: "15", changed: true }, { name: "count", value: "2", changed: true }], output: "" },
            { label: "Pass 3 (x=20)", activeLine: 5, vars: [{ name: "x", value: "20" }, { name: "total", value: "35", changed: true }, { name: "count", value: "3", changed: true }], output: "" },
            { label: "Print summary", activeLine: 6, vars: [{ name: "total", value: "35" }, { name: "count", value: "3" }], output: "Done: total=35, count=3", status: "Loop complete" },
          ],
        },
        code: [
          "nums = [-12, -4, -19]",
          "# largest = 0          # BUG -> reports 0 even though every item is negative",
          "# largest = nums[0]    # INVALID on [] -> IndexError",
          "if not nums:",
          "    print(\"Empty\")",
          "else:",
          "    largest = nums[0]",
          "    for n in nums:",
          "        if n > largest:",
          "            largest = n",
          "    print(\"Largest:\", largest)",
        ],
        output: "Largest: -4",
      },
    ],
    guidedBuildUp: {
      title: "Track Maximum Value Without Crashing or Failing on Negatives",
      steps: [
        {
          label: "Step 1: Guard an empty list before indexing",
          explanation: "Check `if not temps:` first so `temps[0]` never runs on `[]`.",
          code: [
            "temps = [-12, -4, -19]",
            "if not temps:",
            "    print(\"Empty\")",
          ],
          activeLines: [2, 3],
        },
        {
          label: "Step 2: Seed `best` from `temps[0]`",
          explanation: "Start `best = temps[0]` (`-12`) rather than `0` so negative readings compete fairly.",
          code: [
            "temps = [-12, -4, -19]",
            "if not temps:",
            "    print(\"Empty\")",
            "else:",
            "    best = temps[0]",
            "    print(\"Seed:\", best)",
          ],
          activeLines: [5, 6],
          output: "Seed: -12",
        },
        {
          label: "Step 3: Scan remaining values and print the winner",
          explanation: "Update `best = t` whenever `t > best` and print `best` after the loop ends.",
          code: [
            "temps = [-12, -4, -19]",
            "if not temps:",
            "    print(\"Empty\")",
            "else:",
            "    best = temps[0]",
            "    for t in temps:",
            "        if t > best:",
            "            best = t",
            "    print(\"Largest:\", best)",
          ],
          activeLines: [6, 7, 8, 9],
          output: "Largest: -4",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Empty-Guard + Negative-Safe Maximum (`[-12, -4, -19]`)",
      steps: [
        {
          title: "Guard `if not nums:` before indexing `nums[0]`",
          tag: "PATTERN",
          explanation: ["Checking `if not nums:` prevents `IndexError` when the input is `[]`."],
          code: ["nums = [-12, -4, -19]","if not nums:","    largest = None","else:","    largest = nums[0]","    for n in nums:","        if n > largest:","            largest = n"],
          activeLines: [1, 2],
          state: [{ name: "bool(nums)", value: "True (3 items)", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "nums has 3 items so if not nums is False and the loop proceeds to inspect indices 0..2.",
            trays: [
              {
                label: "nums (non-empty)",
                cells: [
                  { id: "m0", value: "-12", index: 0, state: "default" },
                  { id: "m1", value: "-4", index: 1, state: "default" },
                  { id: "m2", value: "-19", index: 2, state: "default" },
                ],
                pointers: [{ index: 0, label: "len = 3 -> safe", tone: "ok" }],
              },
            ],
          },
        },
        {
          title: "Seed `largest = nums[0]` (`-12`)",
          tag: "MEMORY",
          explanation: ["Using `nums[0]` (`-12`) instead of `0` guarantees negative numbers are compared fairly."],
          code: ["nums = [-12, -4, -19]","if not nums:","    largest = None","else:","    largest = nums[0]","    for n in nums:","        if n > largest:","            largest = n"],
          activeLines: [5],
          state: [{ name: "largest", value: "-12", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "Initialize largest = nums[0] (-12) instead of 0.",
            trays: [
              {
                label: "nums",
                cells: [
                  { id: "m0", value: "-12", index: 0, state: "active" },
                  { id: "m1", value: "-4", index: 1, state: "default" },
                  { id: "m2", value: "-19", index: 2, state: "default" },
                ],
                pointers: [
                  { index: 0, label: "best = -12", tone: "ok" },
                  { index: 0, label: "scan = 0", tone: "accent" },
                ],
              },
            ],
          },
        },
        {
          title: "Pass 2 (`n = -4`): `-4 > -12` updates `largest` to `-4`",
          tag: "MEMORY",
          explanation: ["`-4` beats `-12`, so `largest` updates to `-4`."],
          code: ["nums = [-12, -4, -19]","if not nums:","    largest = None","else:","    largest = nums[0]","    for n in nums:","        if n > largest:","            largest = n"],
          activeLines: [7, 8],
          state: [
            { name: "n", value: "-4", changed: true },
            { name: "largest", value: "-4", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "-4 beats -12, so best moves forward to index 1 (-4).",
            trays: [
              {
                label: "nums",
                cells: [
                  { id: "m0", value: "-12", index: 0, state: "dim" },
                  { id: "m1", value: "-4", index: 1, state: "active" },
                  { id: "m2", value: "-19", index: 2, state: "default" },
                ],
                pointers: [
                  { index: 1, label: "best = -4", tone: "ok" },
                  { index: 1, label: "scan = 1", tone: "accent" },
                ],
              },
            ],
          },
        },
        {
          title: "Pass 3 (`n = -19`): `-19 > -4` is `False` -> keeps `-4`",
          tag: "CHECK",
          explanation: ["Final maximum is `-4`, never falsely `0`."],
          code: ["nums = [-12, -4, -19]","if not nums:","    largest = None","else:","    largest = nums[0]","    for n in nums:","        if n > largest:","            largest = n"],
          activeLines: [6, 7],
          state: [
            { name: "n", value: "-19", changed: true },
            { name: "largest", value: "-4" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "-19 is not greater than -4, so best stays at -4.",
            trays: [
              {
                label: "nums",
                cells: [
                  { id: "m0", value: "-12", index: 0, state: "dim" },
                  { id: "m1", value: "-4", index: 1, state: "done" },
                  { id: "m2", value: "-19", index: 2, state: "dim" },
                ],
                pointers: [
                  { index: 1, label: "best = -4", tone: "ok" },
                  { index: 2, label: "scan = 2", tone: "accent" },
                ],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Initializing `largest = 0` fails on all-negative inputs (`[-5, -2]`)",
        detail: "Always initialize `largest = nums[0]` after verifying `nums` is non-empty.",
      },
      {
        title: "Resetting `total = 0` inside the loop body",
        detail: "Keep accumulator setup above `for ...:`, indented one level outward.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(total)` print when `total = 0` sits inside the loop?",
        code: "for x in [5, 10, 2]:\n    total = 0\n    total += x\nprint(total)",
        options: [
          { id: "a", label: "`17`" },
          { id: "b", label: "`2`" },
          { id: "c", label: "`0`" },
        ],
        correctId: "b",
        explanation: "`total = 0` runs on every iteration, keeping only the final element `2`.",
      },
      {
        prompt: "Why is `best = nums[0]` preferred over `best = 0` for maximum tracking?",
        code: "nums = [-12, -4, -19]\nbest = nums[0]\nfor n in nums:\n    if n > best:\n        best = n",
        options: [
          { id: "a", label: "If all values are negative, `best = 0` wrongly reports `0` as the maximum" },
          { id: "b", label: "`best = 0` raises `ValueError`" },
          { id: "c", label: "`nums[0]` doubles loop speed" },
        ],
        correctId: "a",
        explanation: "Seeding from an actual element avoids fake sentinel bounds like `0`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Running Sum & Match Counter",
      tier: "Warmup",
      goal: "Compute `total` (sum of all elements in `scores`) and `count` (how many are `>= 60`), then print `total` and `count`.",
      constraints: ["Do not initialize total inside the loop"],
      examples: [
        { input: "scores = [55, 82, 49, 94]", output: "280 2" },
        { input: "scores = []", output: "0 0" },
      ],
      tasks: [
        "Initialize `total = 0` and `count = 0` before the loop.",
        "Update both inside the loop and print `total, count` after it finishes.",
      ],
      starterCode: "# Exercise M03.5 Warmup: sum + conditional count\nscores = [55, 82, 49, 94]\n# TODO: compute total and count >= 60, then print both\n",
      expectedOutput: "280 2\n0 0",
      hint: "On empty `[]`, the loop executes 0 times and prints `0 0` automatically.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "scores = [55, 82, 49, 94]\ntotal = 0\ncount = 0\nfor s in scores:\n    total += s\n    if s >= 60:\n        count += 1\nprint(total, count)\n\nscores = []\ntotal = 0\ncount = 0\nfor s in scores:\n    total += s\n    if s >= 60:\n        count += 1\nprint(total, count)",
    },
    practiceChallenges: [
      {
        title: "Core: Empty-Safe Min & Max Tracker",
        tier: "Core",
        goal: "Find and print `low` and `high` for `temps` without calling `min()` or `max()`, or print `Empty` if `temps` is empty.",
        constraints: ["Works for all-negative numbers and empty lists"],
        examples: [
          { input: "temps = [-4, -12, -2, -9]", output: "-12 -2" },
          { input: "temps = []", output: "Empty" },
        ],
        tasks: [
          "Check `if not temps:` first and print `\"Empty\"`.",
          "In the `else:` branch, initialize `low = temps[0]` and `high = temps[0]`, update both in one loop, and print `low, high`.",
        ],
        starterCode: "# Exercise M03.5 Core: min/max tracker without builtins\ntemps = [-4, -12, -2, -9]\n# TODO: guard empty, track low and high from temps[0], then print\n",
        expectedOutput: "-12 -2\nEmpty",
        hint: "Use `if not temps:` / `else:` so `temps[0]` is only accessed when the list has at least one item.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "temps = [-4, -12, -2, -9]\nif not temps:\n    print(\"Empty\")\nelse:\n    low = temps[0]\n    high = temps[0]\n    for t in temps:\n        if t < low:\n            low = t\n        if t > high:\n            high = t\n    print(low, high)\n\ntemps = []\nif not temps:\n    print(\"Empty\")\nelse:\n    low = temps[0]\n    high = temps[0]\n    for t in temps:\n        if t < low:\n            low = t\n        if t > high:\n            high = t\n    print(low, high)",
      },
      {
        title: "Stretch: Running Balance & Minimum Watermark",
        tier: "Stretch",
        goal: "Apply signed `changes` (`+` deposits, `-` withdrawals) starting from `start_balance`, and print the ending balance and lowest balance seen.",
        constraints: ["Check lowest watermark after each transaction"],
        examples: [
          { input: "start_balance = 100, changes = [-40, -80, 50]", output: "30 -20" },
          { input: "start_balance = 50, changes = []", output: "50 50" },
        ],
        tasks: [
          "Initialize `bal = start_balance` and `lowest = start_balance`.",
          "Update `bal += d` and `if bal < lowest: lowest = bal` on each step, then print `bal, lowest`.",
        ],
        starterCode: "# Exercise M03.5 Stretch: running balance + lowest watermark\nstart_balance = 100\nchanges = [-40, -80, 50]\n# TODO: track ending balance and minimum point, then print both\n",
        expectedOutput: "30 -20\n50 50",
        hint: "Starting both `bal` and `lowest` at `start_balance` handles an empty `changes` list automatically.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "start_balance = 100\nchanges = [-40, -80, 50]\nbal = start_balance\nlowest = start_balance\nfor d in changes:\n    bal += d\n    if bal < lowest:\n        lowest = bal\nprint(bal, lowest)\n\nstart_balance = 50\nchanges = []\nbal = start_balance\nlowest = start_balance\nfor d in changes:\n    bal += d\n    if bal < lowest:\n        lowest = bal\nprint(bal, lowest)",
      },
    ],
  },

  "py-any-all": {
    lessonId: "py-any-all",
    subtitle: "Answer whole-collection yes/no questions (`at least one` vs `every single one`) with `any()` and `all()`.",
    intro: {
      heading: "Collective Truth Checks With `any()` and `all()`",
      explanation: [
        "Calling `all(fields)` on an empty list `[]` returns `True` rather than `False`, letting empty form submissions pass validation checks. Passing strings like `\"0\"` into `any()` or `all()` also catches beginners off guard because every non-empty string is truthy.",
        "`any(iterable)` returns `True` as soon as at least one item is truthy, while `all(iterable)` returns `True` only when every item is truthy. Both stop scanning early once the answer is decided.",
      ],
      analogy: "A smoke alarm panel uses `any()`—one sensor tripping sets off the siren—while a rocket launch checklist uses `all()`, requiring every switch on the board to read green before liftoff.",
      realWorldUses: [
        "Raising an alert if `any()` sensor reading crosses a safety threshold",
        "Validating non-empty checklists with `bool(fields) and all(fields)`",
      ],
    },
    sections: [
      {
        heading: "`any()` vs `all()`, Short-Circuiting & Empty Edge Cases",
        paragraphs: [
          "`any(flags)` scans `flags` left to right and returns `True` on the first truthy element. If it reaches the end without seeing a truthy element (including `any([])`), it returns `False`.",
          "`all(flags)` returns `False` on the first falsy element. If every element passes, or if the list is empty (`all([])`), it returns `True` (*vacuous truth*: zero elements failed).",
        ],
        table: {
          caption: "`any()` and `all()` Behavior Summary",
          headers: ["Call", "Meaning", "Empty Input `[]`", "Stops Early At"],
          rows: [
            ["`any(seq)`", "At least one truthy item?", "`False`", "First truthy element"],
            ["`all(seq)`", "Zero falsy items (every item truthy)?", "`True` (vacuous truth!)", "First falsy element"],
          ],
          highlightCol: 2,
        },
        code: [
          "readings = [18, 22, 31, 20]",
          "alerts = []",
          "for temp in readings:",
          "    alerts.append(temp >= 30)",
          "print(\"Any spike:\", any(alerts))             # True (stops at index 2)",
          "print(\"All high:\", all(alerts))              # False (stops at index 0)",
          "print(\"Empty raw:\", any([]), all([]))        # False True (vacuous truth!)",
          "print(\"Guarded all:\", bool([]) and all([]))  # False (rejects empty list)",
          "print(\"String '0':\", any([0, \"0\"]))          # True ('0' is non-empty str)",
        ],
        output: "Any spike: True\nAll high: False\nEmpty raw: False True\nGuarded all: False\nString '0': True",
        callout: {
          kind: "WATCH OUT",
          text: "`all([])` returns `True`! When checking whether all submitted tasks passed and zero tasks exist, guard `bool(flags) and all(flags)` if empty input should mean failure.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Validate a Submission Checklist With `any()` and `all()`",
      steps: [
        {
          label: "Step 1: Collect boolean flags from readings",
          explanation: "Build one boolean per item (`s >= 60`) into `passed_flags`.",
          code: [
            "scores = [72, 88, 55]",
            "passed_flags = []",
            "for s in scores:",
            "    passed_flags.append(s >= 60)",
            "print(passed_flags)",
          ],
          activeLines: [2, 3, 4],
          output: "[True, True, False]",
        },
        {
          label: "Step 2: Summarize with `any()` and `all()`",
          explanation: "Ask whether at least one passed (`any`) and whether every score passed (`all`).",
          code: [
            "scores = [72, 88, 55]",
            "passed_flags = []",
            "for s in scores:",
            "    passed_flags.append(s >= 60)",
            "print(\"Any passed:\", any(passed_flags))",
            "print(\"All passed:\", all(passed_flags))",
          ],
          activeLines: [5, 6],
          output: "Any passed: True\nAll passed: False",
        },
        {
          label: "Step 3: Reject empty checklists explicitly",
          explanation: "Prefix `bool(passed_flags) and` so an empty list `[]` evaluates to `False` instead of `True`.",
          code: [
            "passed_flags = []",
            "ready = bool(passed_flags) and all(passed_flags)",
            "print(\"Ready:\", ready)",
          ],
          activeLines: [2, 3],
          output: "Ready: False",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Flag Accumulation and Empty-Input Behavior for `any()` / `all()`",
      steps: [
        {
          title: "Collect boolean check flags over `readings`",
          tag: "CONCEPT",
          explanation: ["Each reading appends `temp >= 30` (`[False, False, True, False]`)."],
          code: ["alerts = []","for temp in [18, 22, 31, 20]:","    alerts.append(temp >= 30)","print(any(alerts), all(alerts))","print(any([]), all([]))"],
          activeLines: [1, 2, 3],
          state: [{ name: "alerts", value: "[False, False, True, False]", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "Each temp >= 30 test writes a boolean flag into alerts.",
            trays: [
              {
                label: "alerts",
                cells: [
                  { id: "a0", value: "False", index: 0, state: "default" },
                  { id: "a1", value: "False", index: 1, state: "default" },
                  { id: "a2", value: "True", index: 2, state: "active" },
                  { id: "a3", value: "False", index: 3, state: "default" },
                ],
              },
            ],
          },
        },
        {
          title: "`any(alerts)` stops at the first `True` (index 2)",
          tag: "CONCEPT",
          explanation: ["Indices 0 and 1 are `False`, index 2 is `True`, so `any(alerts)` returns `True` without checking index 3."],
          code: ["alerts = []","for temp in [18, 22, 31, 20]:","    alerts.append(temp >= 30)","print(any(alerts), all(alerts))","print(any([]), all([]))"],
          activeLines: [4],
          state: [{ name: "any(alerts)", value: "True", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "any() short-circuits at index 2 (True) and skips index 3.",
            trays: [
              {
                label: "any(alerts)",
                cells: [
                  { id: "a0", value: "False", index: 0, state: "dim" },
                  { id: "a1", value: "False", index: 1, state: "dim" },
                  { id: "a2", value: "True", index: 2, state: "active" },
                  { id: "a3", value: "False", index: 3, state: "dim" },
                ],
                pointers: [{ index: 2, label: "stop -> True", tone: "ok" }],
              },
            ],
          },
        },
        {
          title: "`all(alerts)` stops immediately on the first `False` (index 0)",
          tag: "CONCEPT",
          explanation: ["Because index 0 is already `False`, `all(alerts)` immediately evaluates to `False`."],
          code: ["alerts = []","for temp in [18, 22, 31, 20]:","    alerts.append(temp >= 30)","print(any(alerts), all(alerts))","print(any([]), all([]))"],
          activeLines: [4],
          state: [{ name: "all(alerts)", value: "False", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "all() short-circuits immediately at index 0 (False).",
            trays: [
              {
                label: "all(alerts)",
                cells: [
                  { id: "a0", value: "False", index: 0, state: "pivot" },
                  { id: "a1", value: "False", index: 1, state: "dim" },
                  { id: "a2", value: "True", index: 2, state: "dim" },
                  { id: "a3", value: "False", index: 3, state: "dim" },
                ],
                pointers: [{ index: 0, label: "stop -> False", tone: "coral" }],
              },
            ],
          },
          output: "True False",
        },
        {
          title: "Empty list edge cases (`any([]) == False`, `all([]) == True`)",
          tag: "CONCEPT",
          explanation: ["`any([])` finds no truthy items (`False`), while `all([])` finds no failing items (`True`)."],
          code: ["alerts = []","for temp in [18, 22, 31, 20]:","    alerts.append(temp >= 30)","print(any(alerts), all(alerts))","print(any([]), all([]))"],
          activeLines: [5],
          state: [
            { name: "any([])", value: "False", changed: true },
            { name: "all([])", value: "True", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Empty list [] gives any([]) -> False (no True found) and all([]) -> True (no False found).",
            trays: [
              {
                label: "any([]) -> False (0 truthy items -> False)",
                cells: [],
              },
              {
                label: "all([]) -> True (0 falsy items -> True)",
                cells: [],
              },
            ],
          },
          output: "True False\nFalse True",
        },
      ],
    },
    trickyPoints: [
      {
        title: "Forgetting `all([])` returns `True`",
        detail: "If an empty checklist must be rejected, return `len(items) > 0 and all(...)`.",
      },
      {
        title: "Passing integers or strings instead of booleans (`any([0, \"0\"])`)",
        detail: "Both `any()` and `all()` test Python truthiness, so `\"0\"` and `-1` count as truthy values (`True`).",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(any([]), all([]))` output?",
        code: "print(any([]), all([]))",
        options: [
          { id: "a", label: "`False False`" },
          { id: "b", label: "`False True`" },
          { id: "c", label: "`True True`" },
        ],
        correctId: "b",
        explanation: "Empty iterables contain no truthy items (`any([]) == False`) and zero failing items (`all([]) == True`).",
      },
      {
        prompt: "What does `print(all([\"ok\", \"0\", \"yes\"]))` output?",
        code: "print(all([\"ok\", \"0\", \"yes\"]))",
        options: [
          { id: "a", label: "`True` (`\"0\"` is a non-empty truthy string)" },
          { id: "b", label: "`False` (`\"0\"` looks like zero)" },
          { id: "c", label: "Raises `TypeError`" },
        ],
        correctId: "a",
        explanation: "Every non-empty string in Python is truthy.",
      },
    ],
    practiceTask: {
      title: "Warmup: Battery Alert & Readiness Flags",
      tier: "Warmup",
      goal: "Given `batteries`, build boolean flag lists `low_flags` and `ready_flags`, then print `any(low_flags)` and `all(ready_flags)`.",
      constraints: ["1 <= len(batteries)"],
      examples: [
        { input: "batteries = [85, 62, 18, 90]", output: "True False" },
        { input: "batteries = [60, 75, 95]", output: "False True" },
      ],
      tasks: [
        "Append `b < 20` to `low_flags` and `b >= 50` to `ready_flags`.",
        "Print `any(low_flags), all(ready_flags)`.",
      ],
      starterCode: "# Exercise M03.6 Warmup: any() and all() summary\nbatteries = [85, 62, 18, 90]\n# TODO: build low_flags and ready_flags and print any()/all()\n",
      expectedOutput: "True False\nFalse True",
      hint: "Collect one boolean per reading into each list, then pass both lists to `any()` and `all()` inside `print()`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "batteries = [85, 62, 18, 90]\nlow_flags = []\nready_flags = []\nfor b in batteries:\n    low_flags.append(b < 20)\n    ready_flags.append(b >= 50)\nprint(any(low_flags), all(ready_flags))\n\nbatteries = [60, 75, 95]\nlow_flags = []\nready_flags = []\nfor b in batteries:\n    low_flags.append(b < 20)\n    ready_flags.append(b >= 50)\nprint(any(low_flags), all(ready_flags))",
    },
    practiceChallenges: [
      {
        title: "Core: Guard Non-Empty Required Fields",
        tier: "Core",
        goal: "Print `True` only if `fields` is non-empty and every string inside `fields` is non-empty (`\"\"` rejects), otherwise `False`.",
        constraints: ["Empty list [] must print False"],
        examples: [
          { input: "fields = [\"Ada\", \"ada@x.com\"]", output: "True" },
          { input: "fields = []", output: "False" },
        ],
        tasks: [
          "Compute `is_valid = bool(fields) and all(fields)` and print `is_valid`.",
          "Try changing `fields` to `[\"Ada\", \"\"]` or `[]` to confirm both print `False`.",
        ],
        starterCode: "# Exercise M03.6 Core: reject empty list with all()\nfields = [\"Ada\", \"ada@x.com\"]\n# TODO: require at least one field and all non-empty, then print result\n",
        expectedOutput: "True\nFalse",
        hint: "Without `bool(fields) and ...`, `all([])` would wrongly give `True`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "fields = [\"Ada\", \"ada@x.com\"]\nprint(bool(fields) and all(fields))\n\nfields = []\nprint(bool(fields) and all(fields))",
      },
      {
        title: "Stretch: Blocked Keyword Scanner",
        tier: "Stretch",
        goal: "Print `True` if any keyword from `banned` appears inside `message`, else `False`.",
        constraints: ["All strings are already lowercase"],
        examples: [
          { input: "message = \"free gift inside\", banned = [\"spam\", \"free\"]", output: "True" },
          { input: "message = \"meeting at noon\", banned = []", output: "False" },
        ],
        tasks: [
          "Build `hits = []` tracking `w in message` for each keyword `w` in `banned`.",
          "Print `any(hits)`.",
        ],
        starterCode: "# Exercise M03.6 Stretch: keyword any() scanner\nmessage = \"free gift inside\"\nbanned = [\"spam\", \"free\"]\n# TODO: check if any banned substring appears in message and print result\n",
        expectedOutput: "True\nFalse",
        hint: "When `banned` is `[]`, `any([])` prints `False` automatically.",
        complexity: { time: "O(b * m)", space: "O(b)" },
        solutionCode:
          "message = \"free gift inside\"\nbanned = [\"spam\", \"free\"]\nhits = []\nfor w in banned:\n    hits.append(w in message)\nprint(any(hits))\n\nmessage = \"meeting at noon\"\nbanned = []\nhits = []\nfor w in banned:\n    hits.append(w in message)\nprint(any(hits))",
      },
    ],
  },
};

export const m03Quiz: ModuleQuiz = {
  moduleId: "py-m3",
  title: "Module 03 Quiz: Lists & for Loops",
  description: "10 questions covering list indexing/slicing, modifying/sorting lists, `for` loops, `range()`, accumulators, and `any()`/`all()`.",
  questions: [
    {
      id: "m3-q1",
      prompt: "What is `colors[-2]` for `colors = [\"red\", \"green\", \"blue\", \"gold\"]`?",
      options: [
        { id: "a", label: "`\"green\"`" },
        { id: "b", label: "`\"blue\"`" },
        { id: "c", label: "`\"gold\"`" },
      ],
      correctId: "b",
      explanation: "`-1` is the last (`\"gold\"`), so `-2` is second from the end (`\"blue\"`).",
      lessonRefId: "py-lists-intro",
    },
    {
      id: "m3-q2",
      prompt: "What does `[10, 20, 30, 40][1:3]` return?",
      options: [
        { id: "a", label: "`[20, 30, 40]`" },
        { id: "b", label: "`[10, 20, 30]`" },
        { id: "c", label: "`[20, 30]`" },
      ],
      correctId: "c",
      explanation: "Indices `1` and `2` (`20`, `30`) are included; index `3` is excluded.",
      lessonRefId: "py-lists-intro",
    },
    {
      id: "m3-q3",
      prompt: "Why does this loop fail to remove `4` when removing even numbers from `[2, 4, 5]`?",
      code: "nums = [2, 4, 5]\nfor n in nums:\n    if n % 2 == 0:\n        nums.remove(n)\nprint(nums)  # prints [4, 5]",
      options: [
        { id: "a", label: "Removing `2` shifts `4` into index `0`, so the loop cursor moves to index `1` (`5`) and skips `4`" },
        { id: "b", label: "`.remove()` only works on odd numbers" },
        { id: "c", label: "`%` cannot check `4`" },
      ],
      correctId: "a",
      explanation: "Modifying a list's length while iterating over it shifts elements under the loop index.",
      lessonRefId: "py-for-lists",
    },
    {
      id: "m3-q4",
      prompt: "What happens if you write `b = nums.sort()`?",
      options: [
        { id: "a", label: "`b` holds a new sorted list" },
        { id: "b", label: "`nums` sorts in place and `b` becomes `None`" },
        { id: "c", label: "`nums` stays unsorted" },
      ],
      correctId: "b",
      explanation: "`.sort()` mutates `nums` directly and returns `None`; use `sorted(nums)` for a new sorted list.",
      lessonRefId: "py-lists-modify",
    },
    {
      id: "m3-q5",
      prompt: "What does `.pop(0)` return on `q = [100, 200]`?",
      options: [
        { id: "a", label: "`100` (and leaves `[200]`)" },
        { id: "b", label: "`200` (and leaves `[100]`)" },
        { id: "c", label: "`None`" },
      ],
      correctId: "a",
      explanation: "`.pop(0)` removes the element at index `0` and returns it.",
      lessonRefId: "py-lists-modify",
    },
    {
      id: "m3-q6",
      prompt: "What does `print(any([]), all([]))` output?",
      code: "print(any([]), all([]))",
      options: [
        { id: "a", label: "`False False`" },
        { id: "b", label: "`True True`" },
        { id: "c", label: "`False True`" },
      ],
      correctId: "c",
      explanation: "`any([])` is `False` (no truthy element exists), while `all([])` is `True` (no element failed).",
      lessonRefId: "py-any-all",
    },
    {
      id: "m3-q7",
      prompt: "How many iterations does `for i in range(1, 5):` run?",
      options: [
        { id: "a", label: "5 iterations (`1, 2, 3, 4, 5`)" },
        { id: "b", label: "4 iterations (`1, 2, 3, 4`)" },
        { id: "c", label: "3 iterations (`2, 3, 4`)" },
      ],
      correctId: "b",
      explanation: "`range(1, 5)` includes `1` and stops before `5`, giving `1, 2, 3, 4`.",
      lessonRefId: "py-for-range",
    },
    {
      id: "m3-q8",
      prompt: "Which `range(...)` counts down `5, 4, 3`?",
      options: [
        { id: "a", label: "`range(5, 3, -1)`" },
        { id: "b", label: "`range(5, 2)`" },
        { id: "c", label: "`range(5, 2, -1)`" },
      ],
      correctId: "c",
      explanation: "Step `-1` goes down from `5` stopping right before `2` -> `5, 4, 3`.",
      lessonRefId: "py-for-range",
    },
    {
      id: "m3-q9",
      prompt: "Where must `count = 0` be initialized when counting matching items in a `for` loop?",
      options: [
        { id: "a", label: "Before (above) the `for` loop" },
        { id: "b", label: "Inside the `for` loop body" },
        { id: "c", label: "After the `for` loop" },
      ],
      correctId: "a",
      explanation: "Initializing before the loop lets each iteration keep adding to the running count.",
      lessonRefId: "py-accumulators",
    },
    {
      id: "m3-q10",
      prompt: "Why is `best = 0` risky when finding the maximum of an unknown list of integers?",
      options: [
        { id: "a", label: "Loops stop when a variable is `0`" },
        { id: "b", label: "`0` cannot be compared with `>`" },
        { id: "c", label: "If every number in the list is negative, `0` wrongly wins over the real maximum" },
      ],
      correctId: "c",
      explanation: "Start `best = nums[0]` so your initial candidate comes from the list itself.",
      lessonRefId: "py-accumulators",
    },
  ],
};

export const m03PracticeSet: ModulePracticeSet = {
  moduleId: "py-m3",
  title: "Module 03 Practice Set: Lists, Slices, Loops & Accumulators",
  description:
    "Four exercises combining safe list slicing, non-mutating filtering, range stepping, negative-safe accumulators, and any/all checks.",
  problems: [
    {
      id: "py-m3-p1",
      title: "Filter Out Outliers Into New Ranked Copy",
      patternHint: "Build a new list for elements inside bounds rather than calling .remove() while looping.",
      lessonRefId: "py-for-lists",
      goal: "Given `nums` and inclusive `[low, high]` bounds, build and print a descending sorted list of values inside `[low, high]` without altering `nums`.",
      constraints: ["Do not mutate nums", "Must handle empty list and negative bounds"],
      examples: [
        { input: "nums = [12, 999, -5, 40, 18], low = 0, high = 50", output: "[40, 18, 12]" },
        { input: "nums = [-10, -2, -50], low = -20, high = 0", output: "[-2, -10]" },
      ],
      tasks: [
        "Filter `low <= x <= high` into `kept = []`.",
        "Print `sorted(kept, reverse=True)`.",
      ],
      starterCode: "# Practice M03.1: non-mutating filter + sort\nnums = [12, 999, -5, 40, 18]\nlow = 0\nhigh = 50\n# TODO: collect values inside [low, high] and print sorted desc\n",
      expectedOutput: "[40, 18, 12]\n[-2, -10]",
      hint: "Chained comparison `low <= x <= high` filters directly inside the `for` loop.",
      complexity: { time: "O(n log n)", space: "O(n)" },
      solutionCode:
        "nums = [12, 999, -5, 40, 18]\nlow = 0\nhigh = 50\nkept = []\nfor x in nums:\n    if low <= x <= high:\n        kept.append(x)\nprint(sorted(kept, reverse=True))\n\nnums = [-10, -2, -50]\nlow = -20\nhigh = 0\nkept = []\nfor x in nums:\n    if low <= x <= high:\n        kept.append(x)\nprint(sorted(kept, reverse=True))",
    },
    {
      id: "py-m3-p2",
      title: "Top Three & Reversed Tail Slices",
      patternHint: "Use slices on reversed sorted copies, checking length boundaries first.",
      lessonRefId: "py-lists-intro",
      goal: "From `scores`, build `top_three` (the 3 highest elements descending) and `bottom_rev` (the last 2 elements of the original list reversed), and print each on its own line.",
      constraints: ["1 <= len(scores) <= 10^4"],
      examples: [
        { input: "scores = [40, 90, 20, 70]", output: "[90, 70, 40]\n[70, 20]" },
        { input: "scores = [15]", output: "[15]\n[15]" },
      ],
      tasks: [
        "Sort a copy descending and slice `top_three = sorted(scores, reverse=True)[:3]`.",
        "Slice the tail reversed using `bottom_rev = scores[-2:][::-1]` and print both lists.",
      ],
      starterCode: "# Practice M03.2: non-mutating top-3 + reversed tail\nscores = [40, 90, 20, 70]\n# TODO: compute top_three and bottom_rev and print each on its own line\n",
      expectedOutput: "[90, 70, 40]\n[70, 20]\n[15]\n[15]",
      hint: "Both slicing steps (`[:3]` and `[-2:]`) handle 1-element lists without raising `IndexError`.",
      complexity: { time: "O(n log n)", space: "O(n)" },
      solutionCode:
        "scores = [40, 90, 20, 70]\ntop_three = sorted(scores, reverse=True)[:3]\nbottom_rev = scores[-2:][::-1]\nprint(top_three)\nprint(bottom_rev)\n\nscores = [15]\ntop_three = sorted(scores, reverse=True)[:3]\nbottom_rev = scores[-2:][::-1]\nprint(top_three)\nprint(bottom_rev)",
    },
    {
      id: "py-m3-p3",
      title: "Alternating Index Sum & Minimum Finder",
      patternHint: "Use range(0, len(nums), 2) for even indices and seed best from nums[0] after guarding empty.",
      lessonRefId: "py-accumulators",
      goal: "Compute `even_sum` (sum of elements at indices `0, 2, 4, ...`) and `low` (overall minimum) for `nums`, printing `0 None` if `nums` is empty.",
      constraints: ["Works for all-negative numbers and empty lists"],
      examples: [
        { input: "nums = [-5, 100, -12, 50, -3]", output: "-20 -12" },
        { input: "nums = []", output: "0 None" },
      ],
      tasks: [
        "Check `if not nums:` first and print `0, None`.",
        "In the `else:` branch, sum `nums[i]` for `i in range(0, len(nums), 2)`, track `low = nums[0]` across all elements, and print `even_sum, low`.",
      ],
      starterCode: "# Practice M03.3: even-index sum + negative-safe minimum\nnums = [-5, 100, -12, 50, -3]\n# TODO: guard empty, compute even_sum and overall min, then print both\n",
      expectedOutput: "-20 -12\n0 None",
      hint: "Keep `even_sum = 0` and loop `for i in range(0, len(nums), 2): even_sum += nums[i]`.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "nums = [-5, 100, -12, 50, -3]\nif not nums:\n    print(0, None)\nelse:\n    even_sum = 0\n    for i in range(0, len(nums), 2):\n        even_sum += nums[i]\n    low = nums[0]\n    for x in nums:\n        if x < low:\n            low = x\n    print(even_sum, low)\n\nnums = []\nif not nums:\n    print(0, None)\nelse:\n    even_sum = 0\n    for i in range(0, len(nums), 2):\n        even_sum += nums[i]\n    low = nums[0]\n    for x in nums:\n        if x < low:\n            low = x\n    print(even_sum, low)",
    },
    {
      id: "py-m3-p4",
      title: "Batch Quality Gate With `any()` and `all()`",
      patternHint: "Build boolean condition lists and guard non-empty lists before trusting all().",
      lessonRefId: "py-any-all",
      goal: "Given integer `scores`, print `\"empty\"` if `not scores`, `\"critical\"` if any score is `< 40`, `\"pass\"` if all scores are `>= 60`, otherwise `\"mixed\"`.",
      constraints: ["0 <= s <= 100 for each s in scores"],
      examples: [
        { input: "scores = [72, 35, 88]", output: "critical" },
        { input: "scores = []", output: "empty" },
      ],
      tasks: [
        "Check `if not scores:` first so `all([])` never gives a false `\"pass\"`.",
        "Build `crit_flags` (`s < 40`) and `pass_flags` (`s >= 60`) inside `else:`, then print the status using `any()` and `all()`.",
      ],
      starterCode: "# Practice M03.4: batch quality classification\nscores = [72, 35, 88]\n# TODO: print empty, critical, pass, or mixed\n",
      expectedOutput: "critical\nempty",
      hint: "Test `any(crit_flags)` before `all(pass_flags)` inside an `if / elif / else` chain.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "scores = [72, 35, 88]\nif not scores:\n    print(\"empty\")\nelse:\n    crit_flags = []\n    pass_flags = []\n    for s in scores:\n        crit_flags.append(s < 40)\n        pass_flags.append(s >= 60)\n    if any(crit_flags):\n        print(\"critical\")\n    elif all(pass_flags):\n        print(\"pass\")\n    else:\n        print(\"mixed\")\n\nscores = []\nif not scores:\n    print(\"empty\")\nelse:\n    crit_flags = []\n    pass_flags = []\n    for s in scores:\n        crit_flags.append(s < 40)\n        pass_flags.append(s >= 60)\n    if any(crit_flags):\n        print(\"critical\")\n    elif all(pass_flags):\n        print(\"pass\")\n    else:\n        print(\"mixed\")",
    },
  ],
};
