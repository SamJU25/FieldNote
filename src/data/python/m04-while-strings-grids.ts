import type { LessonContent, ModulePracticeSet, ModuleQuiz } from "@/lib/lesson-types";

export const m04Lessons: Record<string, LessonContent> = {
  "py-while-loops": {
    lessonId: "py-while-loops",
    subtitle: "Repeat work until a changing state condition turns False, while guaranteeing every loop moves toward stopping.",
    intro: {
      heading: "Condition-Driven Loops With `while`",
      explanation: [
        "A `for` loop stalls when you cannot count the steps ahead of time—like halving a download or draining fuel until a tank runs low—and writing a `while` loop without updating the tested variable traps your script in an endless loop.",
        "Every working `while` loop rests on three parts: starting state before the header, the boolean test in `while cond:`, and an update inside the body that moves that condition toward `False`.",
      ],
      analogy: "Pumping air into a bike tire follows a pressure target rather than a fixed pump count: you squeeze the handle, read the gauge, and keep pumping until the needle reaches 60 PSI.",
      realWorldUses: [
        "Halving remaining work or draining a budget/fuel tank until a threshold is reached",
        "Retrying an action until a changing runtime condition flips False",
      ],
    },
    sections: [
      {
        heading: "Condition-Controlled `while` Loops & Termination",
        paragraphs: [
          "`while condition:` works like a repeating `if`: check the condition; if `True`, run the indented body; jump back to re-check the condition; exit as soon as it evaluates to `False`.",
          "If nothing inside the loop changes the tested variables (such as forgetting `step += 1`), the loop runs forever as an infinite loop (`Ctrl+C` stops it in a terminal).",
        ],
        code: [
          "step = 1",
          "# while step <= 3: print(\"Lap\", step)  # BUG: missing step += 1 -> infinite loop",
          "while step <= 3:                        # < 3 runs 2 laps; <= 3 runs 3 laps",
          "    print(\"Lap\", step)",
          "    step += 1                           # moves step toward stopping",
          "print(\"Finished\")",
        ],
        table: {
          caption: "Choosing Between `for` and `while` Loops",
          headers: ["Loop Kind", "When to Use", "Example"],
          rows: [
            ["`for` loop", "Fixed step count or existing collection", "`for item in cart:`, `for i in range(5):`"],
            ["`while` loop", "Continue until a condition flips `False`", "`while savings < 250:`, `while mb > 5:`"],
          ],
        },
        visual: {
          kind: "loop-stepper",
          caption: "Step through each iteration as savings climbs until 250 < 250 becomes False",
          code: [
            "savings = 100",
            "months = 0",
            "while savings < 250:",
            "    savings += 50",
            "    months += 1",
            "print(f\"Reached ${savings} in {months} months\")",
          ],
          iterations: [
            { label: "Start", activeLine: 1, vars: [{ name: "savings", value: "100", changed: true }, { name: "months", value: "0", changed: true }], output: "", status: "100 < 250 is True" },
            { label: "Month 1", activeLine: 4, vars: [{ name: "savings", value: "150", changed: true }, { name: "months", value: "1", changed: true }], output: "", status: "150 < 250 is True" },
            { label: "Month 2", activeLine: 4, vars: [{ name: "savings", value: "200", changed: true }, { name: "months", value: "2", changed: true }], output: "", status: "200 < 250 is True" },
            { label: "Month 3", activeLine: 4, vars: [{ name: "savings", value: "250", changed: true }, { name: "months", value: "3", changed: true }], output: "", status: "Next header check: 250 < 250 will fail" },
            { label: "Exit & Print", activeLine: 6, vars: [{ name: "savings", value: "250" }, { name: "months", value: "3" }], output: "Reached $250 in 3 months", status: "Loop exited" },
          ],
        },
        output: "Lap 1\nLap 2\nLap 3\nFinished",
        callout: {
          kind: "RULE OF THUMB",
          text: "Confirm initial state above `while`, the stopping test in the header, and progress inside every branch of the body.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Halve Remaining Download Size Until Threshold",
      steps: [
        {
          label: "Step 1: Set starting state and exit guard",
          explanation: "Initialize `mb_left = 40` and `steps = 0` before checking `while mb_left > 5:`.",
          code: [
            "mb_left = 40",
            "steps = 0",
            "while mb_left > 5:",
            "    break",
          ],
          activeLines: [1, 2, 3],
        },
        {
          label: "Step 2: Shrink `mb_left` inside the body",
          explanation: "Halve `mb_left //= 2` on each pass so `mb_left` moves toward `<= 5` (`40 -> 20 -> 10 -> 5`).",
          code: [
            "mb_left = 40",
            "steps = 0",
            "while mb_left > 5:",
            "    mb_left //= 2",
            "print(mb_left)",
          ],
          activeLines: [4, 5],
          output: "5",
        },
        {
          label: "Step 3: Count passes and print the final summary",
          explanation: "Increment `steps += 1` inside the loop and print both ending values once `5 > 5` turns `False`.",
          code: [
            "mb_left = 40",
            "steps = 0",
            "while mb_left > 5:",
            "    mb_left //= 2",
            "    steps += 1",
            "print(mb_left, steps)",
          ],
          activeLines: [5, 6],
          output: "5 3",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace a Halving Loop (`mb_left //= 2`) Down to Termination",
      steps: [
        {
          title: "Initialize `mb_left = 40` and `steps = 0` before header check",
          tag: "CONCEPT",
          explanation: ["Header `40 > 5` evaluates to `True`, entering iteration 1."],
          code: ["mb_left = 40", "steps = 0", "while mb_left > 5:", "    mb_left //= 2", "    steps += 1", "print(mb_left, steps)"],
          activeLines: [1, 2, 3],
          state: [
            { name: "mb_left", value: "40", changed: true },
            { name: "steps", value: "0", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "mb_left starts at 40, above the > 5 exit gate.",
            trays: [
              {
                label: "Halving trajectory",
                cells: [
                  { id: "h40", value: "40", index: 0, state: "active" },
                  { id: "h20", value: "20", index: 1, state: "dim" },
                  { id: "h10", value: "10", index: 2, state: "dim" },
                  { id: "h5", value: "5 (stop)", index: 3, state: "dim" },
                ],
                pointers: [{ index: 0, label: "mb_left = 40", tone: "accent" }],
              },
            ],
          },
        },
        {
          title: "Pass 1: integer-divide `40 // 2` -> `20` (`steps = 1`)",
          tag: "TRACE",
          explanation: ["`mb_left` shrinks to `20`, moving closer to stopping threshold `5`."],
          code: ["mb_left = 40", "steps = 0", "while mb_left > 5:", "    mb_left //= 2", "    steps += 1", "print(mb_left, steps)"],
          activeLines: [4, 5],
          state: [
            { name: "mb_left", value: "20", changed: true },
            { name: "steps", value: "1", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "First pass halves 40 to 20 and increments steps to 1.",
            trays: [
              {
                label: "Halving trajectory",
                cells: [
                  { id: "h40", value: "40", index: 0, state: "done" },
                  { id: "h20", value: "20", index: 1, state: "active" },
                  { id: "h10", value: "10", index: 2, state: "dim" },
                  { id: "h5", value: "5 (stop)", index: 3, state: "dim" },
                ],
                pointers: [{ index: 1, label: "mb_left = 20", tone: "accent" }],
              },
            ],
          },
        },
        {
          title: "Pass 2 & 3: `20 -> 10 -> 5` (`steps = 3`)",
          tag: "TRACE",
          explanation: ["`20 > 5` drops to `10` (`steps = 2`); `10 > 5` drops to `5` (`steps = 3`)."],
          code: ["mb_left = 40", "steps = 0", "while mb_left > 5:", "    mb_left //= 2", "    steps += 1", "print(mb_left, steps)"],
          activeLines: [4, 5],
          state: [
            { name: "mb_left", value: "5", changed: true },
            { name: "steps", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Two more passes shrink mb_left from 20 -> 10 -> 5.",
            trays: [
              {
                label: "Halving trajectory",
                cells: [
                  { id: "h40", value: "40", index: 0, state: "done" },
                  { id: "h20", value: "20", index: 1, state: "done" },
                  { id: "h10", value: "10", index: 2, state: "done" },
                  { id: "h5", value: "5 (stop)", index: 3, state: "active" },
                ],
                pointers: [{ index: 3, label: "mb_left = 5", tone: "coral" }],
              },
            ],
          },
        },
        {
          title: "Exit check: strict `5 > 5` is `False` -> prints `5 3`",
          tag: "CHECK",
          explanation: ["Strict `>` rejects `5 > 5`, ending the loop and executing line 6."],
          code: ["mb_left = 40", "steps = 0", "while mb_left > 5:", "    mb_left //= 2", "    steps += 1", "print(mb_left, steps)"],
          activeLines: [3, 6],
          state: [
            { name: "mb_left", value: "5" },
            { name: "steps", value: "3" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "While header re-tests 5 > 5 -> False, leaving mb_left at 5 and jumping directly to line 6.",
            trays: [
              {
                label: "Halving trajectory",
                cells: [
                  { id: "h40", value: "40", index: 0, state: "done" },
                  { id: "h20", value: "20", index: 1, state: "done" },
                  { id: "h10", value: "10", index: 2, state: "done" },
                  { id: "h5", value: "5 (exit)", index: 3, state: "done" },
                ],
                pointers: [{ index: 3, label: "5 > 5 False (exit)", tone: "ok" }],
              },
            ],
          },
          output: "5 3",
        },
      ],
    },
    trickyPoints: [
      {
        title: "Off-by-one between `<` and `<=`",
        detail: "Starting at `step = 1` with `step < 4` executes 3 turns (`1, 2, 3`); `step <= 4` executes 4 turns (`1, 2, 3, 4`).",
      },
      {
        title: "Zero iterations when initial condition is already `False`",
        detail: "If `downloaded = 60` and the header says `while downloaded < 50:`, the loop body runs `0` times.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(n)` output right after the `while` loop ends?",
        code: "n = 10\nwhile n > 4:\n    n -= 3\nprint(n)",
        options: [
          { id: "a", label: "`4`" },
          { id: "b", label: "`1`" },
          { id: "c", label: "`7`" },
        ],
        correctId: "a",
        explanation: "`10 -> 7 -> 4`; when checked at `4`, `4 > 4` is `False`, so the loop stops at `4`.",
      },
      {
        prompt: "How many times does the loop body execute?",
        code: "i = 1\ncount = 0\nwhile i <= 4:\n    count += 1\n    i += 1\nprint(count)",
        options: [
          { id: "a", label: "`3`" },
          { id: "b", label: "`4`" },
          { id: "c", label: "`5`" },
        ],
        correctId: "b",
        explanation: "`i` runs through `1, 2, 3, 4`, executing the body 4 times before `i = 5` exits.",
      },
    ],
    practiceTask: {
      title: "Warmup: Download Doubling Steps",
      tier: "Warmup",
      goal: "Start `downloaded = start_mb` and keep doubling (`*= 2`) while `downloaded < target_mb`, then print `downloaded` and `minutes`.",
      constraints: ["start_mb >= 1", "Prints start_mb and 0 if already >= target_mb"],
      examples: [
        { input: "start_mb = 1, target_mb = 50", output: "64 6" },
        { input: "start_mb = 60, target_mb = 50", output: "60 0" },
      ],
      tasks: [
        "Initialize `downloaded = start_mb` and `minutes = 0`.",
        "While `downloaded < target_mb`, double `downloaded` and increment `minutes`, then `print(downloaded, minutes)`.",
      ],
      starterCode: "# Exercise M04.1 Warmup: doubling while loop\nstart_mb = 1\ntarget_mb = 50\ndownloaded = start_mb\nminutes = 0\n# TODO: double until >= target_mb and count steps\nprint(downloaded, minutes)\n",
      expectedOutput: "64 6\n60 0",
      hint: "Check `while downloaded < target_mb:` so starting above `target_mb` takes `0` minutes.",
      complexity: { time: "O(log target)", space: "O(1)" },
      solutionCode:
        "# Case 1\nstart_mb = 1\ntarget_mb = 50\ndownloaded = start_mb\nminutes = 0\nwhile downloaded < target_mb:\n    downloaded *= 2\n    minutes += 1\nprint(downloaded, minutes)\n\n# Case 2\nstart_mb = 60\ntarget_mb = 50\ndownloaded = start_mb\nminutes = 0\nwhile downloaded < target_mb:\n    downloaded *= 2\n    minutes += 1\nprint(downloaded, minutes)",
    },
    practiceChallenges: [
      {
        title: "Core: Fuel Drain Cycles",
        tier: "Core",
        goal: "Burn `burn` liters per hour starting from `fuel` while `fuel >= burn`, then print `fuel` (leftover) and `hours`.",
        constraints: ["burn >= 1", "Leftover must stay non-negative"],
        examples: [
          { input: "fuel = 25, burn = 7", output: "4 3" },
          { input: "fuel = 5, burn = 7", output: "5 0" },
        ],
        tasks: [
          "Loop `while fuel >= burn:` subtracting `burn` and counting `hours`.",
          "Print `fuel` and `hours` with `print(fuel, hours)`.",
        ],
        starterCode: "# Exercise M04.1 Core: non-negative drain loop\nfuel = 25\nburn = 7\nhours = 0\n# TODO: loop while fuel >= burn\nprint(fuel, hours)\n",
        expectedOutput: "4 3\n5 0",
        hint: "Guarding `fuel >= burn` stops before `fuel` drops below zero.",
        complexity: { time: "O(fuel / burn)", space: "O(1)" },
        solutionCode:
          "# Case 1\nfuel = 25\nburn = 7\nhours = 0\nwhile fuel >= burn:\n    fuel -= burn\n    hours += 1\nprint(fuel, hours)\n\n# Case 2\nfuel = 5\nburn = 7\nhours = 0\nwhile fuel >= burn:\n    fuel -= burn\n    hours += 1\nprint(fuel, hours)",
      },
      {
        title: "Stretch: Sum of Base-10 Digits via `while`",
        tier: "Stretch",
        goal: "Compute and print the sum of digits of positive/zero integer `n` by repeatedly stripping `n % 10` and reducing `n //= 10` in a `while n > 0:` loop (without converting to `str`).",
        constraints: ["n >= 0", "Do not use str(n)"],
        examples: [
          { input: "n = 4829", output: "23" },
          { input: "n = 0", output: "0" },
        ],
        tasks: [
          "Initialize `total = 0`.",
          "While `n > 0`: add `n % 10` to `total`, then update `n //= 10`, and `print(total)`.",
        ],
        starterCode: "# Exercise M04.1 Stretch: digit extraction while loop\nn = 4829\ntotal = 0\n# TODO: strip last digit with % 10 and // 10\nprint(total)\n",
        expectedOutput: "23\n0",
        hint: "Floor division `n //= 10` guarantees `n` reaches `0`.",
        complexity: { time: "O(log10 n)", space: "O(1)" },
        solutionCode:
          "for n in [4829, 0]:\n    total = 0\n    while n > 0:\n        total += n % 10\n        n //= 10\n    print(total)",
      },
    ],
  },

  "py-break-continue": {
    lessonId: "py-break-continue",
    subtitle: "Exit loops early with `break`, skip single passes with `continue`, and avoid counter bugs.",
    intro: {
      heading: "Early Exit (`break`) and Pass Skipping (`continue`)",
      explanation: [
        "Scanning thousands of log entries after finding your match wastes time, while placing `continue` above `i += 1` inside a `while` loop skips the counter update forever and hangs your script.",
        "`break` exits the innermost enclosing loop at once, whereas `continue` abandons only the remaining lines of the current pass and jumps back to the loop header.",
      ],
      analogy: "Flipping through a deck of cards to find the Ace of Spades uses `continue` to toss jokers aside and `break` to stop searching the moment the Ace turns up.",
      realWorldUses: [
        "Stopping a search or log scan as soon as the first critical match appears (`break`)",
        "Skipping blank lines, comments, or negative entries during stream parsing (`continue`)",
      ],
    },
    sections: [
      {
        heading: "`break`, `continue`, and `pass`",
        paragraphs: [
          "`break` stops the innermost loop directly enclosing it and jumps to the line right after that loop. `continue` jumps back to the loop header for the next turn without running the rest of the body.",
          "`pass` is only an empty syntax placeholder (`if todo: pass`) that does nothing; unlike `continue`, lines below `pass` still run.",
        ],
        code: [
          "for n in [3, -1, 7, 0, 9]:",
          "    if n < 0:",
          "        continue  # skip negatives (-1)",
          "    if n == 0:",
          "        break     # exit loop at once (9 is skipped)",
          "    print(n)",
          "# In while loops, update i += 1 before continue:",
          "# while i < 4: if i == 2: continue; i += 1  # BUG: stuck at i = 2 forever",
        ],
        table: {
          caption: "`break` vs `continue` vs `pass`",
          headers: ["Keyword", "Effect on Innermost Loop", "Common Use"],
          rows: [
            ["`break`", "Terminates the loop at once", "Stop searching once found"],
            ["`continue`", "Skips to next iteration check", "Ignore blanks, comments, invalid items"],
            ["`pass`", "No-op placeholder", "Temporary empty branch stub"],
          ],
        },
        visual: {
          kind: "loop-stepper",
          caption: "Watch continue skip -1 and break exit on 0 before 9 is ever visited",
          code: [
            "for n in [3, -1, 7, 0, 9]:",
            "    if n < 0:",
            "        continue",
            "    if n == 0:",
            "        break",
            "    print(n)",
          ],
          iterations: [
            { label: "n=3", activeLine: 6, vars: [{ name: "n", value: "3", changed: true }], output: "3", status: "Normal pass -> prints 3" },
            { label: "n=-1 (continue)", activeLine: 3, vars: [{ name: "n", value: "-1", changed: true }], output: "3", status: "continue skips print(n) and jumps to 7" },
            { label: "n=7", activeLine: 6, vars: [{ name: "n", value: "7", changed: true }], output: "3\n7", status: "Normal pass -> prints 7" },
            { label: "n=0 (break)", activeLine: 5, vars: [{ name: "n", value: "0", changed: true }], output: "3\n7", status: "break exits loop immediately (9 skipped)" },
          ],
        },
        output: "3\n7",
      },
    ],
    guidedBuildUp: {
      title: "Skip Negatives and Stop at Zero",
      steps: [
        {
          label: "Step 1: Collect elements from `nums`",
          explanation: "Start with `kept = []` and walk every value in `nums`.",
          code: [
            "nums = [3, -1, 7, 0, 9]",
            "kept = []",
            "for n in nums:",
            "    kept.append(n)",
            "print(kept)",
          ],
          activeLines: [2, 3, 4],
          output: "[3, -1, 7, 0, 9]",
        },
        {
          label: "Step 2: Skip negatives with `continue`",
          explanation: "Jump past `-1` before appending so negative entries stay out of `kept`.",
          code: [
            "nums = [3, -1, 7, 0, 9]",
            "kept = []",
            "for n in nums:",
            "    if n < 0:",
            "        continue",
            "    kept.append(n)",
            "print(kept)",
          ],
          activeLines: [4, 5],
          output: "[3, 7, 0, 9]",
        },
        {
          label: "Step 3: Exit the loop at `0` with `break`",
          explanation: "Stop scanning as soon as `n == 0` appears so `0` and `9` are never appended.",
          code: [
            "nums = [3, -1, 7, 0, 9]",
            "kept = []",
            "for n in nums:",
            "    if n < 0:",
            "        continue",
            "    if n == 0:",
            "        break",
            "    kept.append(n)",
            "print(kept)",
          ],
          activeLines: [6, 7],
          output: "[3, 7]",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace the `continue`-Before-Update Bug and Its Fix",
      steps: [
        {
          title: "`i = 0` and `i = 1` print and advance `i` to `2`",
          tag: "TRACE",
          explanation: ["Neither `0` nor `1` triggers `i == 2`, so `i += 1` executes normally."],
          code: ["i = 0", "while i < 4:", "    if i == 2:", "        continue  # BUG: skips i += 1 below", "        print(i)", "        i += 1"],
          activeLines: [5, 6],
          state: [
            { name: "i", value: "2", changed: true },
            { name: "printed", value: "0, 1", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "0 and 1 run print and reach i += 1, advancing i to 2.",
            trays: [
              {
                label: "i range(0..3)",
                cells: [
                  { id: "v0", value: "0 (print)", index: 0, state: "done" },
                  { id: "v1", value: "1 (print)", index: 1, state: "done" },
                  { id: "v2", value: "2", index: 2, state: "active" },
                  { id: "v3", value: "3", index: 3, state: "default" },
                ],
                pointers: [{ index: 2, label: "i = 2", tone: "accent" }],
              },
            ],
          },
          output: "0\n1",
        },
        {
          title: "Bug at `i = 2`: `continue` skips `i += 1` forever",
          tag: "PITFALL",
          explanation: ["`continue` jumps directly back to `while i < 4:` while `i` is still `2`."],
          code: ["i = 0", "while i < 4:", "    if i == 2:", "        continue  # BUG: infinite loop", "        print(i)", "        i += 1"],
          activeLines: [2, 3, 4],
          state: [{ name: "i", value: "2 (stuck)", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "At i = 2, continue jumps back before reaching i += 1, trapping the loop at index 2.",
            trays: [
              {
                label: "i range(0..3)",
                cells: [
                  { id: "v0", value: "0 (print)", index: 0, state: "done" },
                  { id: "v1", value: "1 (print)", index: 1, state: "done" },
                  { id: "v2", value: "2 (stuck!)", index: 2, state: "pivot" },
                  { id: "v3", value: "3", index: 3, state: "dim" },
                ],
                pointers: [{ index: 2, label: "i = 2 (stuck)", tone: "coral" }],
              },
            ],
          },
        },
        {
          title: "Fix 1: advance `i += 1` inside the `if i == 2:` guard before `continue`",
          tag: "PATTERN",
          explanation: ["Incrementing `i += 1` before `continue` ensures `i` advances to `3`."],
          code: ["i = 0", "while i < 4:", "    if i == 2:", "        i += 1", "        continue", "        print(i)", "        i += 1"],
          activeLines: [4, 5],
          state: [
            { name: "i", value: "3", changed: true },
            { name: "printed", value: "0, 1", changed: false },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Incrementing before continue skips printing 2 while moving i to 3.",
            trays: [
              {
                label: "i range(0..3)",
                cells: [
                  { id: "v0", value: "0 (print)", index: 0, state: "done" },
                  { id: "v1", value: "1 (print)", index: 1, state: "done" },
                  { id: "v2", value: "2 (skip)", index: 2, state: "dim" },
                  { id: "v3", value: "3", index: 3, state: "active" },
                ],
                pointers: [{ index: 3, label: "i = 3", tone: "ok" }],
              },
            ],
          },
        },
        {
          title: "Complete run prints `0`, `1`, `3` and exits at `i = 4`",
          tag: "CHECK",
          explanation: ["When `i` reaches `4`, `4 < 4` is `False` and the loop ends."],
          code: ["i = 0", "while i < 4:", "    if i == 2:", "        i += 1", "        continue", "        print(i)", "        i += 1"],
          activeLines: [6, 7],
          state: [{ name: "i", value: "4", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "3 prints and increments i to 4, ending the while i < 4 loop.",
            trays: [
              {
                label: "i range(0..3)",
                cells: [
                  { id: "v0", value: "0 (print)", index: 0, state: "done" },
                  { id: "v1", value: "1 (print)", index: 1, state: "done" },
                  { id: "v2", value: "2 (skip)", index: 2, state: "dim" },
                  { id: "v3", value: "3 (print)", index: 3, state: "done" },
                ],
              },
            ],
          },
          output: "0\n1\n3",
        },
      ],
    },
    trickyPoints: [
      {
        title: "`continue` in a `while` loop above counter increment",
        detail: "Always increment loop counters before calling `continue` (or use a `for` loop instead).",
      },
      {
        title: "`break` exits only the innermost enclosing loop",
        detail: "In nested loops, an inner `break` stops only the inner loop.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does this loop print?",
        code: "for x in range(1, 6):\n    if x == 3:\n        continue\n    if x == 5:\n        break\n    print(x)",
        options: [
          { id: "a", label: "`1`, `2`, `4`" },
          { id: "b", label: "`1`, `2`" },
          { id: "c", label: "`1`, `2`, `3`, `4`" },
        ],
        correctId: "a",
        explanation: "`x=3` skips printing via `continue`, `x=4` prints, and `x=5` exits via `break`.",
      },
      {
        prompt: "What happens when `i += 1` sits below `continue` in a `while` loop?",
        code: "i = 0\nwhile i < 5:\n    if i == 2:\n        continue\n    i += 1",
        options: [
          { id: "a", label: "Loop exits at `2`" },
          { id: "b", label: "Infinite loop with `i` stuck at `2`" },
          { id: "c", label: "Skips `2` and continues to `3`" },
        ],
        correctId: "b",
        explanation: "`continue` jumps back to `while i < 5:` without executing `i += 1`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Collect Positive Numbers Until Zero",
      tier: "Warmup",
      goal: "Walk `nums`, skip negative entries with `continue`, stop completely at `0` with `break`, and print the collected list.",
      constraints: ["Ignore elements appearing after first 0"],
      examples: [
        { input: "nums = [3, -1, 7, 0, 9]", output: "[3, 7]" },
        { input: "nums = [0, 4, 5]", output: "[]" },
      ],
      tasks: [
        "Use `if n < 0: continue`.",
        "Use `if n == 0: break`, append positive `n` to `kept`, then `print(kept)`.",
      ],
      starterCode: "# Exercise M04.2 Warmup: continue + break scan\nnums = [3, -1, 7, 0, 9]\nkept = []\n# TODO: skip negatives, break on 0\nprint(kept)\n",
      expectedOutput: "[3, 7]\n[]",
      hint: "Test `n == 0` and `n < 0` before `.append(n)`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "for nums in [[3, -1, 7, 0, 9], [0, 4, 5]]:\n    kept = []\n    for n in nums:\n        if n < 0:\n            continue\n        if n == 0:\n            break\n        kept.append(n)\n    print(kept)",
    },
    practiceChallenges: [
      {
        title: "Core: Log Filter Until Critical Marker",
        tier: "Core",
        goal: "Scan `logs`, skip empty lines or `#` comments (`continue`), halt when `\"CRITICAL\"` appears (`break`), and print `kept` and `stopped`.",
        constraints: ["Check line == \"\" before line[0]"],
        examples: [
          { input: "logs = [\"# h\", \"\", \"OK: boot\", \"CRITICAL: disk\", \"OK: end\"]", output: "['OK: boot'] True" },
          { input: "logs = [\"# h\", \"OK: done\"]", output: "['OK: done'] False" },
        ],
        tasks: [
          "Skip empty strings or `#` lines with `continue`.",
          "Set `stopped = True` and `break` on `\"CRITICAL\" in line`, then `print(kept, stopped)`.",
        ],
        starterCode: "# Exercise M04.2 Core: guarded log scanner\nlogs = [\"# h\", \"\", \"OK: boot\", \"CRITICAL: disk\", \"OK: end\"]\nkept = []\nstopped = False\n# TODO: filter blanks/comments, stop at CRITICAL\nprint(kept, stopped)\n",
        expectedOutput: "['OK: boot'] True\n['OK: done'] False",
        hint: "Put `if line == \"\" or line[0] == \"#\": continue` at the top of the loop.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "for logs in [[\"# h\", \"\", \"OK: boot\", \"CRITICAL: disk\", \"OK: end\"], [\"# h\", \"OK: done\"]]:\n    kept = []\n    stopped = False\n    for line in logs:\n        if line == \"\" or line[0] == \"#\":\n            continue\n        if \"CRITICAL\" in line:\n            stopped = True\n            break\n        kept.append(line)\n    print(kept, stopped)",
      },
      {
        title: "Stretch: Safe `while` Index Hopper With `continue`",
        tier: "Stretch",
        goal: "Use a `while i < len(nums):` loop to sum elements while skipping even values at odd indices, guaranteeing `i` always increments even when skipping with `continue`, then print `total`.",
        constraints: ["Must use while i < len(nums) with continue"],
        examples: [
          { input: "nums = [10, 4, 5, 7, 2]", output: "24" },
          { input: "nums = []", output: "0" },
        ],
        tasks: [
          "Skip whenever `i % 2 == 1 and nums[i] % 2 == 0`.",
          "Increment `i += 1` before `continue` so the loop never hangs, then `print(total)`.",
        ],
        starterCode: "# Exercise M04.2 Stretch: safe while counter update\nnums = [10, 4, 5, 7, 2]\ni = 0\ntotal = 0\n# TODO: advance i before continue on odd index + even value\nprint(total)\n",
        expectedOutput: "24\n0",
        hint: "In `[10, 4, 5, 7, 2]`, index `1` (`4`) is skipped (`10 + 5 + 7 + 2 = 24`).",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "for nums in [[10, 4, 5, 7, 2], []]:\n    i = 0\n    total = 0\n    while i < len(nums):\n        if i % 2 == 1 and nums[i] % 2 == 0:\n            i += 1\n            continue\n        total += nums[i]\n        i += 1\n    print(total)",
      },
    ],
  },

  "py-sentinel-loops": {
    lessonId: "py-sentinel-loops",
    subtitle: "Process open-ended streams and user prompts using sentinel stop markers, `while True: ... break`, and retry caps.",
    intro: {
      heading: "Sentinel-Controlled Loops and Retry Caps",
      explanation: [
        "Reading prompts or event streams of unknown length forces you to duplicate `input()` above and inside a `while` loop—or risk trapping users in an infinite loop when wrong guesses keep coming without an attempt cap.",
        "A sentinel value (`\"done\"`, `0`, or `-1`) lets one `while True:` loop read once, test for the stop token before accumulating, and exit via `break`, while pairing retry loops with a hard limit (`attempts < max_tries`) stops runaway execution.",
      ],
      analogy: "A deli ticket scanner keeps tallying items one after another until the cashier scans the `'done'` barcode (`break`), while a keypad lock stops accepting entries after three wrong PIN attempts.",
      realWorldUses: [
        "Interactive CLI menus and REPL command readers (`while True:` until `'quit'`)",
        "Bounded authentication or network retry loops",
      ],
    },
    sections: [
      {
        heading: "`while True:` + Sentinel `break` vs Bounded Retries",
        paragraphs: [
          "Reading from `input()` inside `while True:` lets you keep the read statement in one single place, check `if entry == \"done\": break` right away, validate or skip noise with `continue`, and accumulate valid items below (string cleanup helpers like `.replace()`, `.isdigit()`, `.strip()`, and `.upper()` are covered in full in the next lesson).",
          "For finite-attempt validation (such as 3 PIN tries), use `while attempts < max_tries:` combined with an early `break` on success so the loop stops as soon as the user either succeeds or hits the retry cap.",
        ],
        code: [
          "events = [\"10\", \"bad\", \"14.5\", \"0\", \"99\"]",
          "total = 0.0",
          "idx = 0",
          "while idx < len(events):        # guard stops at stream end if \"0\" is absent",
          "    raw = events[idx]",
          "    idx += 1",
          "    if raw == \"0\":              # check sentinel before validating/adding",
          "        break",
          "    if not raw.replace(\".\", \"\", 1).isdigit():",
          "        continue",
          "    total += float(raw)",
          "print(f\"Total: ${total:.2f}\")",
        ],
        table: {
          caption: "Sentinel & Retry Loop Patterns",
          headers: ["Loop Pattern", "Stop Condition", "Common Trap"],
          rows: [
            ["`while True:` + `break`", "Sentinel token (`\"done\"`, `0`)", "Check sentinel before adding to accumulators"],
            ["Bounded retry loop", "`tries < max_tries` + match `break`", "Forgetting to cap attempts lets errors hang"],
            ["Index buffer loop", "`idx >= len(stream)` guard", "Infinite loop if end-of-stream is omitted"],
          ],
        },
        output: "Total: $24.50",
        callout: {
          kind: "WATCH OUT",
          text: "Every `while True:` loop needs an unconditional path to `break`, and stream consumers need an index/end guard too.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Verify PIN Attempts With a Retry Cap",
      steps: [
        {
          label: "Step 1: Cap attempts in the `while` condition",
          explanation: "Initialize `tries = 0` and `unlocked = False`, then bound the loop by both `len(guesses)` and `max_tries` (`3`).",
          code: [
            "guesses = [\"0000\", \"4242\", \"9999\"]",
            "tries = 0",
            "unlocked = False",
            "while tries < len(guesses) and tries < 3:",
            "    break",
          ],
          activeLines: [2, 3, 4],
        },
        {
          label: "Step 2: Read the next guess and increment `tries`",
          explanation: "Pull `g = guesses[tries]` and advance `tries += 1` before checking so wrong guesses still move toward `3`.",
          code: [
            "guesses = [\"0000\", \"4242\", \"9999\"]",
            "tries = 0",
            "unlocked = False",
            "while tries < len(guesses) and tries < 3:",
            "    g = guesses[tries]",
            "    tries += 1",
            "print(tries)",
          ],
          activeLines: [5, 6],
          output: "3",
        },
        {
          label: "Step 3: Exit early on match with `break`",
          explanation: "Set `unlocked = True` and `break` as soon as `g == \"4242\"`, skipping `\"9999\"`.",
          code: [
            "guesses = [\"0000\", \"4242\", \"9999\"]",
            "tries = 0",
            "unlocked = False",
            "while tries < len(guesses) and tries < 3:",
            "    g = guesses[tries]",
            "    tries += 1",
            "    if g == \"4242\":",
            "        unlocked = True",
            "        break",
            "print(unlocked, tries)",
          ],
          activeLines: [7, 8, 9, 10],
          output: "True 2",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Sentinel Reading + Bounded PIN Retries",
      steps: [
        {
          title: "Attempt 1 (`\"0000\"`): wrong PIN increments `tries` to `1`",
          tag: "TRACE",
          explanation: ["`\"0000\" != \"4242\"` fails to unlock, so the loop advances to attempt `2`."],
          code: ["guesses = [\"0000\", \"4242\", \"9999\"]","tries = 0","unlocked = False","while tries < len(guesses) and tries < 3:","    g = guesses[tries]","    tries += 1","    if g == \"4242\":","        unlocked = True","        break"],
          activeLines: [4, 5, 6, 7],
          state: [
            { name: "g", value: "\"0000\"", changed: true },
            { name: "tries", value: "1", changed: true },
            { name: "unlocked", value: "False" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Try 1 tests '0000' -> mismatch; cursor advances to index 1.",
            trays: [
              {
                label: "guesses",
                cells: [
                  { id: "g0", value: "'0000'", index: 0, state: "pivot" },
                  { id: "g1", value: "'4242'", index: 1, state: "default" },
                  { id: "g2", value: "'9999'", index: 2, state: "default" },
                ],
                pointers: [{ index: 0, label: "tries = 1", tone: "coral" }],
              },
            ],
          },
        },
        {
          title: "Attempt 2 (`\"4242\"`): sets `unlocked = True` and triggers `break`",
          tag: "CHECK",
          explanation: ["`g == \"4242\"` matches on try `2`, setting `unlocked = True` and breaking immediately."],
          code: ["guesses = [\"0000\", \"4242\", \"9999\"]","tries = 0","unlocked = False","while tries < len(guesses) and tries < 3:","    g = guesses[tries]","    tries += 1","    if g == \"4242\":","        unlocked = True","        break"],
          activeLines: [7, 8, 9],
          state: [
            { name: "g", value: "\"4242\"", changed: true },
            { name: "tries", value: "2", changed: true },
            { name: "unlocked", value: "True", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Try 2 matches '4242', sets unlocked = True, and triggers break before inspecting index 2.",
            trays: [
              {
                label: "guesses",
                cells: [
                  { id: "g0", value: "'0000'", index: 0, state: "pivot" },
                  { id: "g1", value: "'4242'", index: 1, state: "done" },
                  { id: "g2", value: "'9999' (skip)", index: 2, state: "dim" },
                ],
                pointers: [{ index: 1, label: "tries = 2 (break!)", tone: "ok" }],
              },
            ],
          },
        },
        {
          title: "Handle retry limit exhausted (`tries == 3`, all wrong)",
          tag: "PITFALL",
          explanation: ["If all guesses fail, `tries < 3` turns `False` so the loop exits with `unlocked == False` instead of looping forever."],
          code: ["guesses = [\"1111\", \"2222\", \"3333\", \"4242\"]", "# 4th entry never checked when cap is 3"],
          activeLines: [1, 2],
          state: [{ name: "unlocked", value: "False", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "Cap tries < 3 stops checking after index 2, so the 4th guess is ignored.",
            trays: [
              {
                label: "guesses (cap = 3)",
                cells: [
                  { id: "c0", value: "'1111'", index: 0, state: "pivot" },
                  { id: "c1", value: "'2222'", index: 1, state: "pivot" },
                  { id: "c2", value: "'3333'", index: 2, state: "pivot" },
                  { id: "c3", value: "'4242'", index: 3, state: "dim" },
                ],
                highlightRange: [0, 2],
                pointers: [{ index: 2, label: "cap tries = 3", tone: "coral" }],
              },
            ],
          },
        },
        {
          title: "Sentinel stream loop reads until stop token `\"done\"`",
          tag: "PATTERN",
          explanation: ["Checking `if tok == \"done\": break` processes arbitrary length up to the sentinel marker."],
          code: ["stream = [\"a\", \"b\", \"done\", \"c\"]", "# stops at 'done' -> ['a', 'b']"],
          activeLines: [1, 2],
          state: [{ name: "collected", value: "['a', 'b']", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "Sentinel token 'done' halts collection immediately, leaving 'c' unread.",
            trays: [
              {
                label: "stream",
                cells: [
                  { id: "s0", value: "'a'", index: 0, state: "done" },
                  { id: "s1", value: "'b'", index: 1, state: "done" },
                  { id: "s2", value: "'done'", index: 2, state: "pivot" },
                  { id: "s3", value: "'c'", index: 3, state: "dim" },
                ],
                highlightRange: [0, 1],
                pointers: [{ index: 2, label: "sentinel stop", tone: "coral" }],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using `while True:` without verifying both sentinel and empty-stream guards",
        detail: "When reading from a list or stream buffer instead of `input()`, also guard index exhaustion (`if idx >= len(items): break`).",
      },
      {
        title: "Forgetting to check sentinel before validating numbers",
        detail: "If `\"0\"` means quit, test `if val == 0: break` before accepting or accumulating it.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `collect_until_done([\"pen\", \"\", \"mug\", \"done\", \"hat\"])` collect if empty strings are skipped?",
        code: "out = []\nfor s in [\"pen\", \"\", \"mug\", \"done\", \"hat\"]:\n    if s == \"done\":\n        break\n    if s == \"\":\n        continue\n    out.append(s)\nprint(out)",
        options: [
          { id: "a", label: "`['pen', 'mug', 'hat']`" },
          { id: "b", label: "`['pen', 'mug']`" },
          { id: "c", label: "`['pen', '', 'mug']`" },
        ],
        correctId: "b",
        explanation: "`\"\"` skips via `continue`, `\"done\"` exits via `break`, ignoring `\"hat\"`.",
      },
      {
        prompt: "Why cap a PIN loop with `tries < 3` even when `break` exits on match?",
        code: "while tries < 3:\n    ...",
        options: [
          { id: "a", label: "To guarantee the loop terminates even if the correct PIN is never entered" },
          { id: "b", label: "Python does not allow `while True`" },
          { id: "c", label: "It resets `tries` to `0`" },
        ],
        correctId: "a",
        explanation: "A retry bound guarantees termination when valid input never arrives.",
      },
    ],
    practiceTask: {
      title: "Warmup: Running Total Until Sentinel `0`",
      tier: "Warmup",
      goal: "Sum numbers from `entries` ignoring negatives, stopping when `0` is encountered, and print `total`.",
      constraints: ["Stop on exact 0; handle list with no 0"],
      examples: [
        { input: "entries = [10, -3, 14.5, 0, 50]", output: "24.5" },
        { input: "entries = [-1, 5]", output: "5" },
      ],
      tasks: [
        "Walk `entries` sequentially.",
        "`break` on `0`, `continue` on `< 0`, else add to `total`, then `print(total)`.",
      ],
      starterCode: "# Exercise M04.3 Warmup: sentinel price sum\nentries = [10, -3, 14.5, 0, 50]\ntotal = 0\n# TODO: stop at 0, skip negatives\nprint(total)\n",
      expectedOutput: "24.5\n5",
      hint: "Test `if x == 0: break` before `if x < 0: continue`.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "for entries in [[10, -3, 14.5, 0, 50], [-1, 5]]:\n    total = 0\n    for x in entries:\n        if x == 0:\n            break\n        if x < 0:\n            continue\n        total += x\n    print(total)",
    },
    practiceChallenges: [
      {
        title: "Core: Bounded Attempt PIN Checker",
        tier: "Core",
        goal: "Simulate checking `guesses` against `secret` with at most `max_tries` attempts, then print `unlocked` and `tries`.",
        constraints: ["max_tries >= 1", "Stop immediately upon match or hitting max_tries"],
        examples: [
          { input: "guesses = [\"1111\", \"4242\", \"9999\"], secret = \"4242\", max_tries = 3", output: "True 2" },
          { input: "guesses = [\"1111\", \"2222\", \"3333\", \"4242\"], secret = \"4242\", max_tries = 3", output: "False 3" },
        ],
        tasks: [
          "Loop `while tries < len(guesses) and tries < max_tries:`.",
          "Increment `tries`, set `unlocked = True` and `break` on match, then `print(unlocked, tries)`.",
        ],
        starterCode: "# Exercise M04.3 Core: capped attempt verifier\nguesses = [\"1111\", \"4242\", \"9999\"]\nsecret = \"4242\"\nmax_tries = 3\ntries = 0\nunlocked = False\n# TODO: bound attempts and stop early on match\nprint(unlocked, tries)\n",
        expectedOutput: "True 2\nFalse 3",
        hint: "In example 2, index 3 (`\"4242\"`) is never reached because `max_tries` is `3`.",
        complexity: { time: "O(min(len, max_tries))", space: "O(1)" },
        solutionCode:
          "cases = [\n    [[\"1111\", \"4242\", \"9999\"], \"4242\", 3],\n    [[\"1111\", \"2222\", \"3333\", \"4242\"], \"4242\", 3],\n]\nfor case in cases:\n    guesses = case[0]\n    secret = case[1]\n    max_tries = case[2]\n    tries = 0\n    unlocked = False\n    while tries < len(guesses) and tries < max_tries:\n        guess = guesses[tries]\n        tries += 1\n        if guess == secret:\n            unlocked = True\n            break\n    print(unlocked, tries)",
      },
      {
        title: "Stretch: Batch Commands Until Stop Sentinel",
        tier: "Stretch",
        goal: "Read command strings from `stream` using `while True:` and index `i`: strip outer whitespace, skip empty/whitespace-only entries, stop on `\"stop\"` (case-insensitive) or stream end, and print uppercase commands.",
        constraints: ["Case-insensitive sentinel 'stop'", "Must handle streams without 'stop'"],
        examples: [
          { input: "stream = [\" ping \", \"\", \"status\", \" STOP \", \"drop\"]", output: "['PING', 'STATUS']" },
          { input: "stream = [\"build\"]", output: "['BUILD']" },
        ],
        tasks: [
          "Guard `if i >= len(stream): break` first inside `while True:`.",
          "Clean `cmd = stream[i].strip().upper()`, advance `i += 1`, break on `\"STOP\"`, skip `\"\"`, append valid commands, then `print(cmds)`.",
        ],
        starterCode: "# Exercise M04.3 Stretch: while True buffer sentinel\nstream = [\" ping \", \"\", \"status\", \" STOP \", \"drop\"]\ncmds = []\ni = 0\n# TODO: process until 'STOP' or end of stream\nprint(cmds)\n",
        expectedOutput: "['PING', 'STATUS']\n['BUILD']",
        hint: "Normalize once with `.strip().upper()` (string cleanup methods covered in Lesson 4-5) and test `if cmd == \"STOP\": break`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "for stream in [[\" ping \", \"\", \"status\", \" STOP \", \"drop\"], [\"build\"]]:\n    cmds = []\n    i = 0\n    while True:\n        if i >= len(stream):\n            break\n        cmd = stream[i].strip().upper()\n        i += 1\n        if cmd == \"STOP\":\n            break\n        if cmd == \"\":\n            continue\n        cmds.append(cmd)\n    print(cmds)",
      },
    ],
  },

  "py-nested-loops": {
    lessonId: "py-nested-loops",
    subtitle: "Nest loops to walk 2D grids (`grid[r][c]`), reset per-row accumulators, and exit outer search loops with a flag.",
    intro: {
      heading: "Two-Dimensional Iteration With Nested Loops",
      explanation: [
        "Summing rows of a 2D grid breaks as soon as `row_sum = 0` sits above the outer loop, leaking Row 0's sum into Row 1 (`210` instead of `150`). Writing `break` inside the inner loop also surprises learners when the outer loop keeps walking the rest of the rows.",
        "Nest an inner loop inside an outer loop to walk `grid[row][col]` row by row, reset per-row accumulators at the top of each outer pass, and pair an inner `break` with a `found` flag when searching.",
      ],
      analogy: "Checking every seat in a movie theater works row by row: you walk down Row A from seat 1 to seat 10, reset your row count to zero, and then walk Row B from seat 1 to seat 10.",
      realWorldUses: [
        "Summing or counting cells row by row across spreadsheets, seating charts, and image grids",
        "Searching a 2D table and halting both outer and inner loops on the first match",
      ],
    },
    sections: [
      {
        heading: "Nested Execution Order, Triangular Bounds & Inner `break`",
        paragraphs: [
          "For every single step of the outer loop (`row`), the inner loop finishes completely (`col`) before `row` increments. An outer count of `3` wrapping an inner count of `4` executes the inner body `12` times.",
          "An inner loop can also depend on the outer variable (`for col in range(row):` for triangles, or `for j in range(i + 1, n):` for unique pairs). Because `break` stops only the inner loop, use a boolean `found` flag to break the outer loop too.",
        ],
        visual: {
          kind: "loop-stepper",
          caption: "Step through (row, col) pairs to watch col restart for each outer row",
          code: [
            "for row in [1, 2]:",
            "    for col in [1, 2]:",
            "        print(row, col)",
          ],
          iterations: [
            { label: "row=1, col=1", activeLine: 3, vars: [{ name: "row", value: "1", changed: true }, { name: "col", value: "1", changed: true }], output: "1 1" },
            { label: "row=1, col=2", activeLine: 3, vars: [{ name: "row", value: "1" }, { name: "col", value: "2", changed: true }], output: "1 1\n1 2" },
            { label: "row=2, col=1", activeLine: 3, vars: [{ name: "row", value: "2", changed: true }, { name: "col", value: "1", changed: true }], output: "1 1\n1 2\n2 1", status: "Outer row advanced -> inner col restarted" },
            { label: "row=2, col=2", activeLine: 3, vars: [{ name: "row", value: "2" }, { name: "col", value: "2", changed: true }], output: "1 1\n1 2\n2 1\n2 2", status: "Grid complete" },
          ],
        },
        code: [
          "for row in range(1, 4):",
          "    for col in range(row):",
          "        print(\"*\", end=\"\")",
          "    print()",
        ],
        output: "*\n**\n***",
      },
      {
        heading: "2D Lists (`grid[r][c]`), Dimensions & Row-Level Resets",
        paragraphs: [
          "`len(grid)` returns row count while `len(grid[r])` gives column count for row `r` (safe even on jagged grids). Name outer and inner variables distinctly (`r`/`c`) so inner variables never overwrite outer indices.",
          "Reset per-row counters (`row_sum = 0`) right inside the outer loop above the inner loop so rows stay independent.",
        ],
        code: [
          "grid = [[10, 20, 30], [40, 50, 60]]",
          "# row_sum = 0  # BUG above outer loop -> Row 1 prints 210 instead of 150",
          "for r in range(len(grid)):",
          "    row_sum = 0",
          "    for c in range(len(grid[r])):",
          "        row_sum += grid[r][c]",
          "    print(f\"Row {r}: {row_sum}\")",
        ],
        table: {
          caption: "2D Grid & Nested Loop Habits",
          headers: ["Pattern", "Meaning", "Common Mistake"],
          rows: [
            ["`grid[r][c]`", "Cell at row `r`, column `c`", "Swapping row and col order"],
            ["`len(grid)` vs `len(grid[r])`", "Row count vs column count", "Using `len(grid)` for columns on `2x5` grids"],
            ["`row_sum = 0` inside outer loop", "Resets before each row", "Initializing above outer loop leaks row sums"],
            ["Inner `break`", "Stops only inner loop", "Use outer `if found: break`"],
          ],
        },
        output: "Row 0: 60\nRow 1: 150",
      },
    ],
    guidedBuildUp: {
      title: "Compute Per-Row Totals Across a 2D Grid",
      steps: [
        {
          label: "Step 1: Walk rows with `range(len(grid))`",
          explanation: "Start an outer loop over row indices `0` and `1`.",
          code: [
            "grid = [[5, 10], [3, 7]]",
            "for r in range(len(grid)):",
            "    print(\"Row\", r, grid[r])",
          ],
          activeLines: [2, 3],
          output: "Row 0 [5, 10]\nRow 1 [3, 7]",
        },
        {
          label: "Step 2: Reset `row_sum = 0` inside the outer loop",
          explanation: "Clear `row_sum` at the top of each row before walking `grid[r][c]` in the inner loop.",
          code: [
            "grid = [[5, 10], [3, 7]]",
            "for r in range(len(grid)):",
            "    row_sum = 0",
            "    for c in range(len(grid[r])):",
            "        row_sum += grid[r][c]",
            "    print(row_sum)",
          ],
          activeLines: [3, 4, 5],
          output: "15\n10",
        },
        {
          label: "Step 3: Collect row totals into a summary list",
          explanation: "Append `row_sum` after the inner loop ends so `totals` holds `[15, 10]`.",
          code: [
            "grid = [[5, 10], [3, 7]]",
            "totals = []",
            "for r in range(len(grid)):",
            "    row_sum = 0",
            "    for c in range(len(grid[r])):",
            "        row_sum += grid[r][c]",
            "    totals.append(row_sum)",
            "print(totals)",
          ],
          activeLines: [2, 7, 8],
          output: "[15, 10]",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `row_sum` Reset Across Rows vs the Outer-Init Leak Bug",
      steps: [
        {
          title: "Row 0 (`[5, 10]`): initializes `row_sum = 0` inside outer loop -> `15`",
          tag: "TRACE",
          explanation: ["Entering outer row 0 resets `row_sum = 0`, then inner loop sums `5 + 10 = 15`."],
          code: ["grid = [[5, 10], [3, 7]]","for row in grid:","    row_sum = 0","    for val in row:","        row_sum += val","    print(\"Row:\", row_sum)"],
          activeLines: [2, 3, 4, 5, 6],
          state: [
            { name: "row", value: "[5, 10]", changed: true },
            { name: "row_sum", value: "15", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "row 0 initializes row_sum = 0 inside the outer loop, totaling 5 + 10 = 15.",
            trays: [
              {
                label: "row 0",
                cells: [
                  { id: "r0c0", value: "5", index: 0, state: "active" },
                  { id: "r0c1", value: "10", index: 1, state: "active" },
                ],
                pointers: [{ index: 1, label: "row_sum = 15", tone: "ok" }],
              },
              {
                label: "row 1",
                cells: [
                  { id: "r1c0", value: "3", index: 0, state: "dim" },
                  { id: "r1c1", value: "7", index: 1, state: "dim" },
                ],
              },
            ],
          },
          output: "Row: 15",
        },
        {
          title: "Row 1 (`[3, 7]`): resets `row_sum = 0` -> `10`",
          tag: "TRACE",
          explanation: ["Starting row 1 re-runs line 3 so `row_sum` starts fresh at `0` -> `10`."],
          code: ["grid = [[5, 10], [3, 7]]","for row in grid:","    row_sum = 0","    for val in row:","        row_sum += val","    print(\"Row:\", row_sum)"],
          activeLines: [3, 5, 6],
          state: [
            { name: "row", value: "[3, 7]", changed: true },
            { name: "row_sum", value: "10", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "row 1 resets row_sum back to 0 before summing 3 + 7 = 10.",
            trays: [
              {
                label: "row 0",
                cells: [
                  { id: "r0c0", value: "5", index: 0, state: "done" },
                  { id: "r0c1", value: "10", index: 1, state: "done" },
                ],
              },
              {
                label: "row 1",
                cells: [
                  { id: "r1c0", value: "3", index: 0, state: "active" },
                  { id: "r1c1", value: "7", index: 1, state: "active" },
                ],
                pointers: [{ index: 1, label: "row_sum = 10", tone: "ok" }],
              },
            ],
          },
          output: "Row: 15\nRow: 10",
        },
        {
          title: "Pitfall: setting `row_sum = 0` above outer loop leaks `15` into row 1 (`25`)",
          tag: "PITFALL",
          explanation: ["Without resetting inside the outer loop, row 1 accumulates on top of `15`."],
          code: ["row_sum = 0  # BUG above outer loop","for row in [[5, 10], [3, 7]]:","    for val in row:","        row_sum += val"],
          activeLines: [1, 3, 4],
          state: [{ name: "row_sum (leaked)", value: "25", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "Initializing row_sum = 0 outside keeps adding row 1 onto row 0's 15 -> 25.",
            trays: [
              {
                label: "row 0",
                cells: [
                  { id: "r0c0", value: "5", index: 0, state: "pivot" },
                  { id: "r0c1", value: "10", index: 1, state: "pivot" },
                ],
              },
              {
                label: "row 1 (leaked)",
                cells: [
                  { id: "r1c0", value: "3", index: 0, state: "pivot" },
                  { id: "r1c1", value: "7", index: 1, state: "pivot" },
                ],
                pointers: [{ index: 1, label: "leaked sum = 25", tone: "coral" }],
              },
            ],
          },
        },
        {
          title: "Stopping nested search with a `found` flag",
          tag: "PATTERN",
          explanation: ["Inner `break` sets `found = True` so the outer loop breaks too."],
          code: ["if target_hit:", "    found = True", "    break", "# in outer loop: if found: break"],
          activeLines: [1, 2, 3],
          state: [{ name: "found", value: "True", changed: true }],
          visual: {
            kind: "dsa-array",
            caption: "Inner break stops row 0 at 10; setting found = True lets the outer loop stop before row 1.",
            trays: [
              {
                label: "row 0",
                cells: [
                  { id: "r0c0", value: "5", index: 0, state: "dim" },
                  { id: "r0c1", value: "10 (hit!)", index: 1, state: "done" },
                ],
                pointers: [{ index: 1, label: "found=True (break)", tone: "ok" }],
              },
              {
                label: "row 1 (skipped)",
                cells: [
                  { id: "r1c0", value: "3", index: 0, state: "dim" },
                  { id: "r1c1", value: "7", index: 1, state: "dim" },
                ],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using `len(grid)` as the inner column bound fails on rectangular matrices",
        detail: "Use `len(grid[r])` for the inner loop bound so non-square `2 x 5` grids never crash or miss columns.",
      },
      {
        title: "Reusing the same loop variable (`i`) in both loops",
        detail: "Always keep distinct names like `r` and `c` (or `i` and `j`).",
      },
    ],
    predictChecks: [
      {
        prompt: "How many `*` stars print total?",
        code: "for r in range(3):\n    for c in range(4):\n        print(\"*\", end=\"\")",
        options: [
          { id: "a", label: "`7`" },
          { id: "b", label: "`12`" },
          { id: "c", label: "`4`" },
        ],
        correctId: "b",
        explanation: "`3` outer rows x `4` inner columns = `12` prints.",
      },
      {
        prompt: "Given `m = [[1, 2], [3, 4]]`, what is `m[1][0]`?",
        code: "m = [[1, 2], [3, 4]]\nprint(m[1][0])",
        options: [
          { id: "a", label: "`2`" },
          { id: "b", label: "`3`" },
          { id: "c", label: "`1`" },
        ],
        correctId: "b",
        explanation: "`m[1]` selects `[3, 4]` and `[0]` selects `3`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Sum All Cells in a Rectangular Grid",
      tier: "Warmup",
      goal: "Walk every row and column of `matrix` and print the grand sum.",
      constraints: ["Handles rectangular grids and empty grids"],
      examples: [
        { input: "matrix = [[2, 4], [6, 8]]", output: "20" },
        { input: "matrix = []", output: "0" },
      ],
      tasks: [
        "Initialize `total = 0` outside both loops.",
        "Add every cell value across nested loops, then `print(total)`.",
      ],
      starterCode: "# Exercise M04.4 Warmup: 2D grid total\nmatrix = [[2, 4], [6, 8]]\ntotal = 0\n# TODO: sum all cells across rows and cols\nprint(total)\n",
      expectedOutput: "20\n0",
      hint: "Loop `for row in matrix:` then `for val in row:`.",
      complexity: { time: "O(r * c)", space: "O(1)" },
      solutionCode:
        "for matrix in [[[2, 4], [6, 8]], []]:\n    total = 0\n    for row in matrix:\n        for val in row:\n            total += val\n    print(total)",
    },
    practiceChallenges: [
      {
        title: "Core: Per-Row Present Counter",
        tier: "Core",
        goal: "Count `\"P\"` marks in each row of `seats` and print `row_counts` and `total`.",
        constraints: ["Reset row counter inside the outer loop"],
        examples: [
          { input: "seats = [[\"P\", \"A\", \"P\"], [\"P\", \"P\", \"P\"], [\"A\", \"P\", \"A\"]]", output: "[2, 3, 1] 6" },
          { input: "seats = [[]]", output: "[0] 0" },
        ],
        tasks: [
          "Reset `row_p = 0` before the inner loop.",
          "Append `row_p` to `row_counts` after each row finishes, then `print(row_counts, total)`.",
        ],
        starterCode: "# Exercise M04.4 Core: row totals + grand total\nseats = [[\"P\", \"A\", \"P\"], [\"P\", \"P\", \"P\"], [\"A\", \"P\", \"A\"]]\nrow_counts = []\ntotal = 0\n# TODO: count 'P' per row and overall\nprint(row_counts, total)\n",
        expectedOutput: "[2, 3, 1] 6\n[0] 0",
        hint: "Append `row_p` at outer-loop indent after the inner loop ends.",
        complexity: { time: "O(r * c)", space: "O(r)" },
        solutionCode:
          "for seats in [[[\"P\", \"A\", \"P\"], [\"P\", \"P\", \"P\"], [\"A\", \"P\", \"A\"]], [[]]]:\n    row_counts = []\n    total = 0\n    for row in seats:\n        row_p = 0\n        for mark in row:\n            if mark == \"P\":\n                row_p += 1\n                total += 1\n        row_counts.append(row_p)\n    print(row_counts, total)",
      },
      {
        title: "Stretch: First Coordinate Search (`break` Outer Loop)",
        tier: "Stretch",
        goal: "Find the first row `r` and column `c` where `grid[r][c] == target` (row-major scan), printing `found_r` and `found_c`, or `None` if absent.",
        constraints: ["Works on rectangular non-square grids", "Stop scanning immediately on first hit"],
        examples: [
          { input: "grid = [[\".\", \".\", \"X\"], [\".\", \"X\", \".\"]], target = \"X\"", output: "0 2" },
          { input: "grid = [[\".\", \".\"]], target = \"X\"", output: "None" },
        ],
        tasks: [
          "Use `for r in range(len(grid)):` and `for c in range(len(grid[r])):`.",
          "Track `found = False`, `found_r = -1`, `found_c = -1`, break both loops once found, and print `found_r, found_c` or `None`.",
        ],
        starterCode: "# Exercise M04.4 Stretch: first row and col coordinate match\ngrid = [[\".\", \".\", \"X\"], [\".\", \"X\", \".\"]]\ntarget = \"X\"\nfound = False\nfound_r = -1\nfound_c = -1\n# TODO: scan row-major, break both loops on first match\nif found:\n    print(found_r, found_c)\nelse:\n    print(None)\n",
        expectedOutput: "0 2\nNone",
        hint: "Set `found = True`, store `found_r = r` and `found_c = c`, `break` the inner loop, and check `if found: break` in the outer loop.",
        complexity: { time: "O(r * c)", space: "O(1)" },
        solutionCode:
          "for grid in [[[\".\", \".\", \"X\"], [\".\", \"X\", \".\"]], [[\".\", \".\"]]]:\n    target = \"X\"\n    found = False\n    found_r = -1\n    found_c = -1\n    for r in range(len(grid)):\n        for c in range(len(grid[r])):\n            if grid[r][c] == target:\n                found = True\n                found_r = r\n                found_c = c\n                break\n        if found:\n            break\n    if found:\n        print(found_r, found_c)\n    else:\n        print(None)",
      },
    ],
  },

  "py-string-tools": {
    lessonId: "py-string-tools",
    subtitle: "Inspect characters with slicing/indexing and transform strings via `strip`, `lower`, `split`, `join`, and alignment specs.",
    intro: {
      heading: "Inspecting and Cleaning Text Data",
      explanation: [
        "User input often arrives padded like `\" Ada   Lovelace  \"`, calling `raw.strip()` without saving its return value discards the cleanup, and calling `.split(\" \")` fills your list with empty `\"\"` slots on repeated spaces. Trying `code[0] = \"A\"` raises `TypeError` because strings cannot be mutated in place.",
        "Strings support `[index]` and `[start:stop:step]` slicing like lists, and chaining `.strip().lower().split()` before re-gluing with `.join()` handles messy CSV, CLI, and form text.",
      ],
      analogy: "Editing a printed receipt means printing a fresh slip because ink on paper cannot shift over; string methods like `.strip()` and `.split()` produce a fresh cleaned string for you to store.",
      realWorldUses: [
        "Normalizing user emails, slugs, and whitespace-padded file lines",
        "Splitting delimited log fields and formatting padded console tables",
      ],
    },
    sections: [
      {
        heading: "String Indexing, Slicing & Immutability",
        paragraphs: [
          "Access individual characters with `[0]` / `[-1]`, extract slices (`[start:stop:step]`), and test substrings with `in` / `not in`.",
          "Because `str` objects cannot be modified in place (`s[0] = \"X\"` raises `TypeError`), build modified text as a new string (`\"A\" + code[1:]`) or save the return value of string methods.",
        ],
        visual: {
          kind: "slice-explorer",
          caption: "Experiment with positive/negative string slices and [::-1] on 'PYTHON'",
          items: ["P", "Y", "T", "H", "O", "N"],
          mode: "string",
          initialStart: 0,
          initialStop: 3,
          initialStep: 1,
        },
        code: [
          "code = \"PY-2026-ML\"",
          "# code[0] = \"A\"          # INVALID -> TypeError: 'str' object does not support item assignment",
          "fixed = \"A\" + code[1:]",
          "print(code[:2], code[-2:], \"2026\" in code, fixed)",
        ],
        output: "PY ML True AY-2026-ML",
      },
      {
        heading: "Methods (`strip`, `split`, `join`, `startswith`, `find`) & Width Padding",
        paragraphs: [
          "Chain methods left to right (`raw.strip().lower()`). Notice `.split()` with zero arguments collapses arbitrary runs of whitespace and strips edges (`\" a b \".split() == ['a', 'b']`), whereas `.split(\" \")` preserves empty `''` slots between repeated spaces.",
          "Every item passed to `sep.join(parts)` must already be a `str` (`\"-\".join([1, 2])` raises `TypeError`).",
        ],
        table: {
          caption: "Common String Methods & Format Specifiers",
          headers: ["Method / Spec", "Effect", "Example -> Result"],
          rows: [
            ["`.strip()` / `.replace(a, b, n)`", "Trims outer spaces / swaps substrings (`n` times)", "`\" hi \".strip()` -> `'hi'`"],
            ["`.lower()` / `.upper()` / `.title()`", "Changes letter case", "`\"Ada\".lower()` -> `'ada'`"],
            ["`.split()` vs `.split(sep)`", "Splits whitespace runs vs exact delimiter", "`\"a b\".split()` -> `['a', 'b']`"],
            ["`sep.join(parts)`", "Joins strings into one `str`", "`\"-\".join([\"a\", \"b\"])` -> `'a-b'`"],
            ["`.startswith()` / `.endswith()`", "Checks prefix/suffix (`bool`)", "`\"app.py\".endswith(\".py\")` -> `True`"],
            ["`.isdigit()` / `.find(sub)`", "All-digits check / first index (`-1` missing)", "`\"2026\".isdigit()` -> `True`"],
            ["`f\"{n:02d}\"`, `f\"{s:>8}\"`", "Zero-pad integers or right-align text", "`f\"{7:02d}\"` -> `'07'`"],
          ],
        },
        code: [
          "raw = \" Ada.Lovelace@MAIL.COM  \"",
          "email = raw.strip().lower()",
          "print(email.startswith(\"ada\"), email.find(\"@\"))",
          "print(\" a   b \".split(), \" a   b \".split(\" \"))",
          "# \"-\".join([1, 2])        # INVALID -> TypeError: expected str instance, int found",
          "print(\"-\".join(\" a b c \".split()))",
        ],
        output: "True 12\n['a', 'b'] ['', 'a', '', '', 'b', '']\na-b-c",
      },
    ],
    guidedBuildUp: {
      title: "Normalize Messy User Input Into a Clean Handle",
      steps: [
        {
          label: "Step 1: Trim edges and lowercase (save the result)",
          explanation: "Assign `clean = raw.strip().lower()` so the trimmed, lowercase copy is kept.",
          code: [
            "raw = \" Ada   Lovelace  \"",
            "clean = raw.strip().lower()",
            "print(clean)",
          ],
          activeLines: [2, 3],
          output: "ada   lovelace",
        },
        {
          label: "Step 2: Collapse inner space runs with `.split()`",
          explanation: "Call zero-argument `.split()` to drop multiple spaces into clean word tokens.",
          code: [
            "raw = \" Ada   Lovelace  \"",
            "clean = raw.strip().lower()",
            "words = clean.split()",
            "print(words)",
          ],
          activeLines: [3, 4],
          output: "['ada', 'lovelace']",
        },
        {
          label: "Step 3: Glue tokens back with `.join()`",
          explanation: "Join the string list with `\"-\"` to build the final handle.",
          code: [
            "raw = \" Ada   Lovelace  \"",
            "clean = raw.strip().lower()",
            "words = clean.split()",
            "handle = \"-\".join(words)",
            "print(handle)",
          ],
          activeLines: [4, 5],
          output: "ada-lovelace",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `.strip().lower().split()` Normalization vs `.split(\" \")`",
      steps: [
        {
          title: "Unassigned `raw.strip()` leaves `raw` unchanged",
          tag: "PITFALL",
          explanation: ["Strings are immutable; ignoring `.strip()`'s return value keeps the surrounding spaces."],
          code: ["raw = \" Ada Lovelace  \"", "raw.strip()  # discarded!", "clean = raw.strip().lower()", "words = clean.split()", "handle = \"-\".join(words)"],
          activeLines: [1, 2],
          state: [{ name: "raw", value: "\" Ada Lovelace  \"" }],
          visual: {
            kind: "pipeline",
            caption: "Unassigned raw.strip() builds a temporary str and discards it while raw stays untouched.",
            nodes: [
              { id: "r", label: "' Ada Lovelace  '", sublabel: "raw (unchanged)", active: true, tone: "warm" },
              { id: "st", label: ".strip() (discarded)", sublabel: "not assigned", tone: "muted" },
              { id: "out", label: "raw kept", sublabel: "' Ada Lovelace  '" },
            ],
            links: [{ from: "r", to: "st", active: true }],
          },
        },
        {
          title: "Chain `.strip().lower()` left-to-right",
          tag: "TRACE",
          explanation: ["Trim outer spaces first, then lowercase the returned string into `clean`."],
          code: ["raw = \" Ada Lovelace  \"", "raw.strip()  # discarded!", "clean = raw.strip().lower()", "words = clean.split()", "handle = \"-\".join(words)"],
          activeLines: [3],
          state: [{ name: "clean", value: "\"ada lovelace\"", changed: true }],
          visual: {
            kind: "pipeline",
            caption: "Method chaining feeds raw through strip() then lower() into clean.",
            nodes: [
              { id: "r", label: "' Ada Lovelace  '", sublabel: "raw" },
              { id: "st", label: ".strip()", sublabel: "'Ada Lovelace'", active: true, tone: "accent" },
              { id: "lo", label: ".lower()", sublabel: "clean = 'ada lovelace'", tone: "ok" },
            ],
            links: [
              { from: "r", to: "st", active: true },
              { from: "st", to: "lo", active: true },
            ],
          },
        },
        {
          title: "Collapse runs of whitespace with zero-arg `.split()`",
          tag: "CONCEPT",
          explanation: ["`clean.split()` collapses 3 inner spaces and gives `['ada', 'lovelace']` (`clean.split(' ')` would produce empty strings)."],
          code: ["raw = \" Ada Lovelace  \"", "raw.strip()  # discarded!", "clean = raw.strip().lower()", "words = clean.split()", "handle = \"-\".join(words)"],
          activeLines: [4],
          state: [{ name: "words", value: "['ada', 'lovelace']", changed: true }],
          visual: {
            kind: "pipeline",
            caption: "Zero-arg .split() collapses whitespace gaps and produces clean tokens ['ada', 'lovelace'].",
            nodes: [
              { id: "cln", label: "'ada   lovelace'", sublabel: "clean" },
              { id: "sp", label: ".split()", sublabel: "drop all gaps", active: true, tone: "accent" },
              { id: "w", label: "['ada', 'lovelace']", sublabel: "words", tone: "ok" },
            ],
            links: [
              { from: "cln", to: "sp", active: true },
              { from: "sp", to: "w", active: true },
            ],
          },
        },
        {
          title: "Re-assemble into `\"ada-lovelace\"` using `\"-\".join(words)`",
          tag: "CHECK",
          explanation: ["Separator string `\"-\"` calls `.join(words)` over all string pieces."],
          code: ["raw = \" Ada Lovelace  \"", "raw.strip()  # discarded!", "clean = raw.strip().lower()", "words = clean.split()", "handle = \"-\".join(words)"],
          activeLines: [5],
          state: [{ name: "handle", value: "\"ada-lovelace\"", changed: true }],
          visual: {
            kind: "pipeline",
            caption: "'-'.join(words) places '-' strictly between tokens, never at ends.",
            nodes: [
              { id: "w", label: "['ada', 'lovelace']", sublabel: "2 tokens" },
              { id: "j", label: "'-'.join(...)", sublabel: "'ada-lovelace'", active: true, tone: "ok" },
            ],
            links: [{ from: "w", to: "j", label: "glue '-'", active: true }],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Calling `text.strip()` without saving or writing `text[0] = 'X'`",
        detail: "Assign the result (`text = text.strip()`), and construct a new string instead of mutating indices.",
      },
      {
        title: "Passing non-strings to `sep.join([1, 2])` raises `TypeError`",
        detail: "Convert integers with `str(x)` before passing a sequence to `.join()`.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(\"-\".join(\"a b c\".split()))` output?",
        code: "print(\"-\".join(\"a b c\".split()))",
        options: [
          { id: "a", label: "`['a', 'b', 'c']`" },
          { id: "b", label: "`a-b-c`" },
          { id: "c", label: "`a--b-c`" },
        ],
        correctId: "b",
        explanation: "Zero-arg `.split()` collapses double spaces into `['a', 'b', 'c']` before joining with `\"-\"`.",
      },
      {
        prompt: "What does `print(f\"{7:02d} {1250:,}\")` print?",
        code: "print(f\"{7:02d} {1250:,}\")",
        options: [
          { id: "a", label: "`7 1250`" },
          { id: "b", label: "`07 1,250`" },
          { id: "c", label: "`7.00 1.250`" },
        ],
        correctId: "b",
        explanation: "`:02d` zero-pads integers to width 2 (`07`), and `:,` adds thousands grouping (`1,250`).",
      },
    ],
    practiceTask: {
      title: "Warmup: Validate Extension & Numeric Token",
      tier: "Warmup",
      goal: "Strip outer spaces on `filename` and `year_text`, then print `cleaned_file.endswith(ext)` and `cleaned_year.isdigit()`.",
      constraints: ["Strip whitespace before checking suffix and digits"],
      examples: [
        { input: "filename = \" report_2026.csv \", ext = \".csv\", year_text = \"2026\"", output: "True True" },
        { input: "filename = \"notes.txt\", ext = \".csv\", year_text = \"20a6\"", output: "False False" },
      ],
      tasks: [
        "Strip both `filename` and `year_text`.",
        "Print `cleaned_file.endswith(ext)` and `cleaned_year.isdigit()` using `print(...)`.",
      ],
      starterCode: "# Exercise M04.5 Warmup: suffix and digit check\nfilename = \" report_2026.csv \"\next = \".csv\"\nyear_text = \"2026\"\n# TODO: strip whitespace then check endswith and isdigit\nprint(False, False)\n",
      expectedOutput: "True True\nFalse False",
      hint: "Strip whitespace first so trailing spaces never fail `.endswith()` or `.isdigit()`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "cases = [\n    [\" report_2026.csv \", \".csv\", \"2026\"],\n    [\"notes.txt\", \".csv\", \"20a6\"],\n]\nfor case in cases:\n    filename = case[0]\n    ext = case[1]\n    year_text = case[2]\n    print(filename.strip().endswith(ext), year_text.strip().isdigit())",
    },
    practiceChallenges: [
      {
        title: "Core: Slugify Messy User Name",
        tier: "Core",
        goal: "Convert messy user input into a lowercase hyphenated handle collapsing extra inner whitespace and print it.",
        constraints: ["Handle leading/trailing spaces and multiple middle spaces"],
        examples: [
          { input: "raw_name = \" Sam Rahman \"", output: "sam-rahman" },
          { input: "raw_name = \"Ada\"", output: "ada" },
        ],
        tasks: [
          "Lowercase and split `raw_name` with zero-arg `.split()`.",
          "Join words with `\"-\"` and `print(handle)`.",
        ],
        starterCode: "# Exercise M04.5 Core: whitespace-collapse handle slug\nraw_name = \" Sam Rahman \"\n# TODO: normalize case, collapse whitespace, join with '-'\nprint(\"\")\n",
        expectedOutput: "sam-rahman\nada",
        hint: "`\"-\".join(raw_name.lower().split())` trims edges and collapses gaps in one step.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "for raw_name in [\" Sam Rahman \", \"Ada\"]:\n    handle = \"-\".join(raw_name.lower().split())\n    print(handle)",
      },
      {
        title: "Stretch: Clean CSV Token Pipeline (`split`, `strip`, `join`)",
        tier: "Stretch",
        goal: "Given comma-separated `raw_line`, trim whitespace around each token, skip empty tokens, convert non-empty tokens to lowercase, rejoin with `\" | \"`, and print the result.",
        constraints: ["Must ignore empty commas such as 'red, , BLUE,'"],
        examples: [
          { input: "raw_line = \" red, GREEN , , blue  \"", output: "red | green | blue" },
          { input: "raw_line = \"  A , , b  \"", output: "a | b" },
        ],
        tasks: [
          "Split on `\",\"`.",
          "Strip and lowercase each part, keeping only parts where `tok != \"\"`, then print `\" | \".join(clean)`.",
        ],
        starterCode: "# Exercise M04.5 Stretch: comma-token cleaner\nraw_line = \" red, GREEN , , blue  \"\nclean = []\n# TODO: split ',', strip/lower, skip empty, join with ' | '\nprint(\" | \".join(clean))\n",
        expectedOutput: "red | green | blue\na | b",
        hint: "Use `\" | \".join(clean)` so an empty list prints `\"\"`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "for raw_line in [\" red, GREEN , , blue  \", \"  A , , b  \"]:\n    clean = []\n    for part in raw_line.split(\",\"):\n        tok = part.strip().lower()\n        if tok:\n            clean.append(tok)\n    print(\" | \".join(clean))",
      },
    ],
  },
};

export const m04Quiz: ModuleQuiz = {
  moduleId: "py-m4",
  title: "Module 04 Quiz: while Loops, Sentinels, Grids & Text",
  description: "10 questions covering `while` termination, `break` vs `continue`, sentinel loops, nested 2D loops, and string methods.",
  questions: [
    {
      id: "m4-q1",
      prompt: "When should you prefer `while` over `for`?",
      options: [
        { id: "a", label: "When looping until an open-ended condition changes" },
        { id: "b", label: "When printing every item in a known list" },
        { id: "c", label: "Whenever counting 5 times" },
      ],
      correctId: "a",
      explanation: "Use `for` for fixed counts/sequences and `while` when termination depends on changing state.",
      lessonRefId: "py-while-loops",
    },
    {
      id: "m4-q2",
      prompt: "What happens if a `while x < 5:` loop forgets to update `x`?",
      options: [
        { id: "a", label: "Python runs it 5 times automatically" },
        { id: "b", label: "Python skips the loop" },
        { id: "c", label: "It creates an infinite loop that never stops" },
      ],
      correctId: "c",
      explanation: "If `x < 5` stays True forever, the loop never terminates on its own.",
      lessonRefId: "py-while-loops",
    },
    {
      id: "m4-q3",
      prompt: "What does `continue` do inside a loop?",
      options: [
        { id: "a", label: "Stops the entire loop immediately" },
        { id: "b", label: "Skips remaining lines in this turn and starts the next iteration" },
        { id: "c", label: "Restarts the script from line 1" },
      ],
      correctId: "b",
      explanation: "`continue` skips just the rest of the current iteration, whereas `break` exits the loop completely.",
      lessonRefId: "py-break-continue",
    },
    {
      id: "m4-q4",
      prompt: "In a `while True:` sentinel loop, what handles user input equal to `\"done\"`?",
      options: [
        { id: "a", label: "`pass`" },
        { id: "b", label: "`continue`" },
        { id: "c", label: "`break`" },
      ],
      correctId: "c",
      explanation: "Test for the sentinel (`\"done\"`) and exit immediately with `break`.",
      lessonRefId: "py-sentinel-loops",
    },
    {
      id: "m4-q5",
      prompt: "If `msg = \" Hi!  \"`, what is `msg` after running `msg.strip()` (without assignment)?",
      options: [
        { id: "a", label: "`\"Hi!\"`" },
        { id: "b", label: "Still `\" Hi!  \"` (string methods return new strings)" },
        { id: "c", label: "`\"Hi!  \"`" },
      ],
      correctId: "b",
      explanation: "Strings are immutable; assign `msg = msg.strip()` to keep the trimmed string.",
      lessonRefId: "py-string-tools",
    },
    {
      id: "m4-q6",
      prompt: "What does `\"one two three\".split()` return?",
      options: [
        { id: "a", label: "`['one', '', 'two', '', '', 'three']`" },
        { id: "b", label: "`('one', 'two', 'three')`" },
        { id: "c", label: "`['one', 'two', 'three']`" },
      ],
      correctId: "c",
      explanation: "Zero-argument `.split()` collapses runs of whitespace into separate tokens.",
      lessonRefId: "py-string-tools",
    },
    {
      id: "m4-q7",
      prompt: "Which joins `[\"2026\", \"11\", \"24\"]` into `\"2026-11-24\"`?",
      options: [
        { id: "a", label: "`\"2026-11-24\".split(\"-\")`" },
        { id: "b", label: "`\"-\".join([\"2026\", \"11\", \"24\"])`" },
        { id: "c", label: "`[\"2026\", \"11\", \"24\"].join(\"-\")`" },
      ],
      correctId: "b",
      explanation: "The separator calls `.join(list_of_strings)`.",
      lessonRefId: "py-string-tools",
    },
    {
      id: "m4-q8",
      prompt: "What does `grid[1][0]` access in `grid = [[1, 2], [3, 4]]`?",
      options: [
        { id: "a", label: "`1`" },
        { id: "b", label: "`2`" },
        { id: "c", label: "`3`" },
      ],
      correctId: "c",
      explanation: "Row index `1` is `[3, 4]`, and column index `0` inside that row is `3`.",
      lessonRefId: "py-nested-loops",
    },
    {
      id: "m4-q9",
      prompt: "How many times does `print(\"x\")` execute?",
      code: "for a in [1, 2]:\n    for b in [10, 20, 30]:\n        print(\"x\")",
      options: [
        { id: "a", label: "6 times" },
        { id: "b", label: "5 times" },
        { id: "c", label: "3 times" },
      ],
      correctId: "a",
      explanation: "2 outer steps x 3 inner steps = 6 calls.",
      lessonRefId: "py-nested-loops",
    },
    {
      id: "m4-q10",
      prompt: "Why reset `row_sum = 0` inside the outer `for row in grid:` loop?",
      options: [
        { id: "a", label: "Python deletes variables outside loops" },
        { id: "b", label: "So each row starts fresh instead of adding onto earlier rows" },
        { id: "c", label: "Only to prevent SyntaxError" },
      ],
      correctId: "b",
      explanation: "Initializing before the inner loop prevents carrying prior row totals forward.",
      lessonRefId: "py-nested-loops",
    },
  ],
};

export const m04PracticeSet: ModulePracticeSet = {
  moduleId: "py-m4",
  title: "Module 04 Practice Set: while, Sentinels, 2D Grids & Text",
  description:
    "Four mixed exercises combining condition loops, sentinel input streams, 2D row/column scans, and string normalization.",
  problems: [
    {
      id: "py-m4-p1",
      title: "Power-of-2 Doubling Threshold",
      patternHint: "Use a while loop that doubles until crossing target, handling values already above target.",
      lessonRefId: "py-while-loops",
      goal: "Starting from `start` (`>= 1`), find the smallest doubled value `>= limit` and print `val` and `steps`.",
      constraints: ["start >= 1", "0 steps if start >= limit"],
      examples: [
        { input: "start = 3, limit = 20", output: "24 3" },
        { input: "start = 25, limit = 20", output: "25 0" },
      ],
      tasks: [
        "Initialize `val = start`, `steps = 0`.",
        "While `val < limit`: double `val` and add `1` to `steps`, then `print(val, steps)`.",
      ],
      starterCode: "# Practice M04.1: while doubling threshold\nstart = 3\nlimit = 20\nval = start\nsteps = 0\n# TODO: double val until >= limit\nprint(val, steps)\n",
      expectedOutput: "24 3\n25 0",
      hint: "`3 -> 6 -> 12 -> 24` crosses `20` in `3` steps.",
      complexity: { time: "O(log limit)", space: "O(1)" },
      solutionCode:
        "for pair in [[3, 20], [25, 20]]:\n    start = pair[0]\n    limit = pair[1]\n    val = start\n    steps = 0\n    while val < limit:\n        val *= 2\n        steps += 1\n    print(val, steps)",
    },
    {
      id: "py-m4-p2",
      title: "Sentinel Queue With Skip Rules",
      patternHint: "Process tokens sequentially: exit immediately on 'QUIT', skip blanks/comments, and collect trimmed uppercase items.",
      lessonRefId: "py-sentinel-loops",
      goal: "Walk `stream` up to `\"QUIT\"` (case-insensitive), ignoring empty strings or `#` lines, and print the cleaned uppercase strings list.",
      constraints: ["Stop before items after QUIT"],
      examples: [
        { input: "stream = [\" ok\", \"\", \"#skip\", \"go\", \"quit\", \"late\"]", output: "['OK', 'GO']" },
        { input: "stream = [\"QUIT\", \"a\"]", output: "[]" },
      ],
      tasks: [
        "Trim each element with `.strip()`.",
        "If `.upper() == \"QUIT\"` break; if `\"\"` or `.startswith(\"#\")` continue; append `.upper()`, then `print(out)`.",
      ],
      starterCode: "# Practice M04.2: sentinel command stream\nstream = [\" ok\", \"\", \"#skip\", \"go\", \"quit\", \"late\"]\nout = []\n# TODO: stop on QUIT, skip blanks/comments\nprint(out)\n",
      expectedOutput: "['OK', 'GO']\n[]",
      hint: "Strip whitespace before checking `\"\"`, `#`, or `QUIT`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "for stream in [[\" ok\", \"\", \"#skip\", \"go\", \"quit\", \"late\"], [\"QUIT\", \"a\"]]:\n    out = []\n    for raw in stream:\n        s = raw.strip()\n        if s.upper() == \"QUIT\":\n            break\n        if s == \"\" or s.startswith(\"#\"):\n            continue\n        out.append(s.upper())\n    print(out)",
    },
    {
      id: "py-m4-p3",
      title: "Highest-Sum Row in a 2D Grid",
      patternHint: "Reset row_sum = 0 inside the outer loop and track the best row index.",
      lessonRefId: "py-nested-loops",
      goal: "Print `best_idx` and `best_sum` for non-empty `grid`, breaking ties in favor of the earlier row.",
      constraints: ["grid has >= 1 row", "Cell integers may be negative"],
      examples: [
        { input: "grid = [[2, 5], [9, 1], [10, 0]]", output: "1 10" },
        { input: "grid = [[-5, -2], [-10, -1]]", output: "0 -7" },
      ],
      tasks: [
        "Seed `best_idx = 0` and `best_sum = None`.",
        "Reset `row_sum = 0` at the start of every outer row iteration, update `best_sum` after the inner loop, and `print(best_idx, best_sum)`.",
      ],
      starterCode: "# Practice M04.3: row maximum index and sum\ngrid = [[2, 5], [9, 1], [10, 0]]\nbest_idx = 0\nbest_sum = None\n# TODO: reset row_sum per row and track best row\nprint(best_idx, best_sum)\n",
      expectedOutput: "1 10\n0 -7",
      hint: "Using `if best_sum is None or row_sum > best_sum:` after the inner loop works for all-negative grids without hardcoding `0`.",
      complexity: { time: "O(r * c)", space: "O(1)" },
      solutionCode:
        "for grid in [[[2, 5], [9, 1], [10, 0]], [[-5, -2], [-10, -1]]]:\n    best_idx = 0\n    best_sum = None\n    for r in range(len(grid)):\n        row_sum = 0\n        for val in grid[r]:\n            row_sum += val\n        if best_sum is None or row_sum > best_sum:\n            best_sum = row_sum\n            best_idx = r\n    print(best_idx, best_sum)",
    },
    {
      id: "py-m4-p4",
      title: "Normalize Pipe-Delimited Full Names",
      patternHint: "Split records, collapse inner whitespace via zero-arg .split(), and format Title Case.",
      lessonRefId: "py-string-tools",
      goal: "Given `raw = \" ada LOVELACE | grace hopper \"`, print `['Ada Lovelace', 'Grace Hopper']`.",
      constraints: ["Ignore empty segments if trailing separator exists"],
      examples: [
        { input: "raw = \" ada LOVELACE | grace hopper \"", output: "['Ada Lovelace', 'Grace Hopper']" },
        { input: "raw = \"   | sam lee  \"", output: "['Sam Lee']" },
      ],
      tasks: [
        "Split `raw` on `\"|\"`.",
        "Collapse spaces with zero-arg `.split()`, apply `.title()`, join words with `\" \"`, append to `names`, and `print(names)`.",
      ],
      starterCode: "# Practice M04.4: pipe-record text normalizer\nraw = \" ada LOVELACE | grace hopper \"\nnames = []\n# TODO: split '|', normalize spacing & Title Case\nprint(names)\n",
      expectedOutput: "['Ada Lovelace', 'Grace Hopper']\n['Sam Lee']",
      hint: "`\" \".join(seg.split()).title()` turns `\" ada LOVELACE \"` directly into `\"Ada Lovelace\"`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "for raw in [\" ada LOVELACE | grace hopper \", \"   | sam lee  \"]:\n    names = []\n    for seg in raw.split(\"|\"):\n        words = seg.split()\n        if words:\n            names.append(\" \".join(words).title())\n    print(names)",
    },
  ],
};
