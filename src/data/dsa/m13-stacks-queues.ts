import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM13Lessons: Record<string, LessonContent> = {
  "dsa-stack-basics": {
    lessonId: "dsa-stack-basics",
    subtitle:
      "Build Last-In, First-Out (LIFO) stacks backed by arrays, validate nested brackets, track O(1) running minimums, and evaluate Reverse Polish (Postfix) expressions.",
    intro: {
      heading: "Stack (LIFO) & Expression Parsing",
      explanation: [
        "Counting open brackets with a single integer fails on crossed pairs like `\"([)]\"`: `open` climbs to `2` and drops back to `0`, falsely reporting valid even though `)` closed `[` out of order. Tracking a running minimum with a single `min_val` integer fails the same way—popping that minimum forces an `O(n)` rescan of every remaining item.",
        "A **stack** fixes both problems by restricting insertions and removals to a single end called the **top** (**LIFO: Last-In, First-Out**). Backed by a contiguous array (`M03`) with a `top` index, `push`, `pop`, and `peek` all run in `O(1)` time without `O(n)` index-0 shifts, letting you match the most recent unmatched opener, save parallel `mins` snapshots, or hold pending operands in postfix math.",
      ],
      analogy:
        "A spring-loaded stack of cafeteria trays only lets you place a tray on top or lift the top tray off. Reaching a tray buried near the bottom requires lifting every tray placed above it first.",
      realWorldUses: [
        "Validating nested delimiters (`()`, `[]`, `{}`, HTML/XML tags) in code editors, linters, and compilers",
        "Supporting undo/redo history and evaluating arithmetic expressions via the program call stack (`M10`)",
      ],
    },
    sections: [
      {
        heading: "Array-backed LIFO operations and bracket matching",
        paragraphs: [
          "An array-backed stack keeps a backing buffer `data` and an integer `top` (or uses a dynamic array's tail). `push(x)` writes at the end (`data[top + 1] ← x`, `top ← top + 1`), `pop()` reads `data[top]` and decrements `top`, and `peek()` returns `data[top]` without modifying `top`. Every operation touches one slot at the tail, avoiding the `O(n)` element shifts caused by inserting or removing at index `0`.",
          "Compare a broken bracket counter against a stack on `\"([)]\"`: a counter sees `(`, `[`, `)`, `]` and ends at `open == 0` (wrongly returning `true`), while a stack pushes `'('`, pushes `'['`, then pops `'['` when `')'` arrives and catches `'[' != '('` immediately (`false`). Also check `is_empty(stack)` both before popping on `\"]\"` (preventing underflow) and after the loop on `\"((\"` (rejecting unclosed openers).",
        ],
        code: [
          "function is_valid_brackets(s):",
          "    pairs ← { ')': '(', ']': '[', '}': '{' }",
          "    stack ← []",
          "    for ch in s:",
          "        if ch in pairs:",
          "            if is_empty(stack) or pop(stack) != pairs[ch]:",
          "                return false",
          "        else:",
          "            push(stack, ch)",
          "    return is_empty(stack)",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Array-backed Stack operations and time complexity",
          headers: ["Operation", "Behavior", "Time", "Boundary guard"],
          rows: [
            ["push(x)", "Write x at top + 1 and increment top", "O(1) amortized", "Grow dynamic array if capacity is reached"],
            ["pop()", "Read element at top and decrement top", "O(1)", "Check not is_empty(stack) before popping"],
            ["peek() / top()", "Return top element without removing it", "O(1)", "Check not is_empty(stack) before reading"],
            ["is_empty() / size()", "Check top < 0 (or len == 0)", "O(1)", "Always validate empty stack at end of bracket scan"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Checking `is_empty(stack)` only inside the loop is not enough for inputs like `\"((\"` or `\"([\"`. If the loop finishes with leftover openers still sitting on the stack, you must return `false`.",
        },
      },
      {
        heading: "Min Stack in O(1) and Reverse Polish (Postfix) evaluation",
        paragraphs: [
          "A **Min Stack** supports `push`, `pop`, `top`, and `get_min()` all in `O(1)` time. Keeping a single `min_val` integer fails as soon as the minimum element is popped, because you would have to scan the remaining elements (`O(n)`) to find the new minimum. Instead, store a parallel `mins` stack (or pair `(val, min_so_far)` in each frame): on `push(x)`, push `min(x, mins[-1])` onto `mins`; on `pop()`, pop both `vals` and `mins` together so the previous minimum is restored immediately.",
          "In **Reverse Polish Notation (RPN / Postfix)**, operators follow their operands (`[\"5\", \"3\", \"-\"]` means `5 - 3 = 2`). Scan tokens left to right: push numbers onto an operand stack; when an operator arrives, pop `right ← pop(stack)` first and `left ← pop(stack)` second, compute `left op right`, and push the result back. Keeping `left` before `right` matters for non-commutative operators like `-` and `/`.",
        ],
        code: [
          "class MinStack:",
          "    init(): vals ← []; mins ← []",
          "    function push(x):",
          "        vals.push(x)",
          "        cur_min ← x if is_empty(mins) else min(x, mins.peek())",
          "        mins.push(cur_min)",
          "    function pop(): vals.pop(); mins.pop()",
          "    function get_min(): return mins.peek()",
          "",
          "function eval_rpn(tokens):",
          "    st ← []",
          "    for tok in tokens:",
          "        if tok in ['+', '-', '*', '/']:",
          "            right ← st.pop()",
          "            left ← st.pop()",
          "            if tok == '+': st.push(left + right)",
          "            else if tok == '-': st.push(left - right)",
          "            else if tok == '*': st.push(left * right)",
          "            else: st.push(trunc_toward_zero(left / right))",
          "        else:",
          "            st.push(to_int(tok))",
          "    return st.pop()",
        ],
        codeLabel: "Pseudocode",
        visual: {
          kind: "dsa-array",
          trays: [
            {
              label: "Input RPN tokens",
              cells: [
                { id: "t0", value: "\"5\"", index: 0, state: "active" },
                { id: "t1", value: "\"3\"", index: 1 },
                { id: "t2", value: "\"-\"", index: 2 },
                { id: "t3", value: "\"4\"", index: 3 },
                { id: "t4", value: "\"*\"", index: 4 },
              ],
              pointers: [{ index: 0, label: "i = 0", tone: "coral" }],
            },
          ],
          caption: "Numbers are pushed onto the operand stack; operators pop two operands and push the result.",
        },
        callout: {
          kind: "KEY IDEA",
          text: "For RPN evaluation, the first value popped is always the right operand (`b`) and the second value popped is the left operand (`a`), so subtraction computes `a - b`, never `b - a`.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From Broken Bracket Counter to Complete LIFO Validator",
      steps: [
        {
          label: "Step 1: Naive open counter (fails on \"([)]\")",
          explanation: "Counting opens and closes tracks total counts, yet misses out-of-order nesting like `\"([)]\"`.",
          code: [
            "function is_valid_counter(s):",
            "    open ← 0",
            "    for ch in s:",
            "        if ch in '([{': open ← open + 1",
            "        else: open ← open - 1",
            "        if open < 0: return false",
            "    return open == 0",
          ],
          activeLines: [4, 5, 7],
          output: "is_valid_counter(\"([)]\") -> true (BUG)",
        },
        {
          label: "Step 2: Stack matcher (catches \"([)]\", misses \"((\")",
          explanation: "Pushing openers onto a stack and matching on pop rejects `\"([)]\"`, yet returning `true` at loop end misses leftover openers.",
          code: [
            "function is_valid_no_end_check(s):",
            "    pairs ← { ')': '(', ']': '[', '}': '{' }",
            "    stack ← []",
            "    for ch in s:",
            "        if ch in pairs:",
            "            if is_empty(stack) or pop(stack) != pairs[ch]: return false",
            "        else: push(stack, ch)",
            "    return true",
          ],
          activeLines: [6, 8],
          output: "is_valid_no_end_check(\"((\") -> true (BUG)",
        },
        {
          label: "Step 3: Complete LIFO bracket validator",
          explanation: "Check `is_empty(stack)` on closing mismatches and again after the loop so unclosed openers fail.",
          code: [
            "function is_valid_brackets(s):",
            "    pairs ← { ')': '(', ']': '[', '}': '{' }",
            "    stack ← []",
            "    for ch in s:",
            "        if ch in pairs:",
            "            if is_empty(stack) or pop(stack) != pairs[ch]: return false",
            "        else: push(stack, ch)",
            "    return is_empty(stack)",
          ],
          activeLines: [6, 8],
          output: "\"([)]\" -> false, \"((\") -> false, \"([])\" -> true",
        },
      ],
    },
    walkthrough: {
      title: "Trace Reverse Polish evaluation on [\"5\", \"3\", \"-\", \"4\", \"*\"]",
      layout: "visual-first",
      steps: [
        {
          title: "Start scanning the RPN token array at index 0",
          tag: "CONCEPT",
          explanation: [
            "We want to evaluate the postfix expression `[\"5\", \"3\", \"-\", \"4\", \"*\"]`, which represents `(5 - 3) * 4` without needing parentheses.",
            "We scan `tokens` left to right from `i = 0` while keeping an initially empty operand stack `st`.",
          ],
          code: [
            "tokens ← [\"5\", \"3\", \"-\", \"4\", \"*\"]",
            "st ← []",
            "// Ready to process tok = tokens[0]",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "tokens = [\"5\", \"3\", \"-\", \"4\", \"*\"]",
              "st = []",
              "# Ready to process tok = tokens[0]",
            ],
          },
          state: [
            { name: "i", value: "0" },
            { name: "st", value: "[]" },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Empty Operand Stack st (before i = 0)",
            items: [
              { id: "empty", label: "(empty)", sub: "tokens = [\"5\", \"3\", \"-\", \"4\", \"*\"]", state: "dim" },
            ],
            caption: "Stack st starts empty; numbers push onto TOP and operators pop right then left.",
          },
        },
        {
          title: "Push first operand 5 at i = 0 onto the empty stack",
          tag: "TRACE",
          explanation: [
            "Token `0` (`\"5\"`) is an integer, so we convert it to `5` and push it onto `st`.",
            "With one item on the stack, `5` sits at `TOP` as we advance to `i = 1`.",
          ],
          code: [
            "tok ← tokens[0]     // \"5\"",
            "st.push(to_int(tok))",
            "// st is now [5]",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "0 -> 1", changed: true },
            { name: "st (bottom -> top)", value: "[5]", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Operand Stack After Pushing 5 (i = 0)",
            items: [
              { id: "v5", label: "5", sub: "pushed at i=0", state: "active" },
            ],
            caption: "First operand 5 enters the stack at TOP.",
          },
        },
        {
          title: "Push second operand 3 at i = 1 above 5",
          tag: "TRACE",
          explanation: [
            "Token `1` (`\"3\"`) is also an integer, so we push `3` onto the stack above `5`.",
            "Now `3` sits at `TOP` above `5` and will pop first when `'-'` arrives at `i = 2`.",
          ],
          code: [
            "tok ← tokens[1]     // \"3\"",
            "st.push(to_int(tok))",
            "// st is now [5, 3]",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "1", changed: true },
            { name: "st (bottom -> top)", value: "[5, 3]", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Operand Stack After Pushing 3 (i = 1)",
            items: [
              { id: "v5", label: "5", sub: "pushed at i=0", state: "default" },
              { id: "v3", label: "3", sub: "pushed at i=1", state: "active" },
            ],
            caption: "3 sits on TOP, so it will be popped as the right operand when '-' arrives.",
          },
        },
        {
          title: "Operator '-' pops right=3, left=5, and pushes 5 - 3 = 2",
          tag: "PATTERN",
          explanation: [
            "At `i = 2`, token `\"-\"` is an operator. We pop `right ← st.pop()` (`3`) and then `left ← st.pop()` (`5`).",
            "Compute `left - right = 5 - 3 = 2` and push `2` back onto the stack.",
          ],
          code: [
            "right ← st.pop()      // 3",
            "left ← st.pop()       // 5",
            "st.push(left - right) // 5 - 3 = 2",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "right", value: "3", changed: true },
            { name: "left", value: "5", changed: true },
            { name: "st", value: "[2]", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Stack After Evaluating 5 - 3",
            items: [
              { id: "v2", label: "2", sub: "5 - 3 = 2", state: "active" },
            ],
            caption: "Popping right first and left second preserves subtraction order.",
          },
        },
        {
          title: "Push 4 onto the stack at index 3",
          tag: "TRACE",
          explanation: [
            "At `i = 3`, token `\"4\"` is an integer, so we push `4` onto the stack above `2`.",
            "The stack now holds `[2, 4]`, waiting for the final operator.",
          ],
          code: [
            "st.push(4)    // tok = \"4\"",
          ],
          activeLines: [1],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "3", changed: true },
            { name: "st", value: "[2, 4]", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Stack After Pushing 4",
            items: [
              { id: "v2", label: "2", sub: "sub-result", state: "default" },
              { id: "v4", label: "4", sub: "pushed at i=3", state: "active" },
            ],
            caption: "2 stays saved underneath until '*' consumes both values.",
          },
        },
        {
          title: "Operator '*' pops 4 and 2, returning final answer 8",
          tag: "CHECK",
          explanation: [
            "At `i = 4`, token `\"*\"` pops `right = 4` and `left = 2`, multiplies `2 * 4 = 8`, and pushes `8`.",
            "With all tokens processed, `st.pop()` returns `8` as the final value.",
          ],
          code: [
            "right ← st.pop()      // 4",
            "left ← st.pop()       // 2",
            "st.push(left * right) // 8",
            "return st.pop()       // 8",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "4", changed: true },
            { name: "Final result", value: "8", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Final Stack Result",
            items: [
              { id: "v8", label: "8", sub: "2 * 4 = 8 (return)", state: "done" },
            ],
            caption: "A valid RPN expression ends with exactly one value left on the stack.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Swapping left and right operands in RPN",
        detail:
          "Writing `st.pop() - st.pop()` evaluates `right - left` in languages that evaluate left-to-right! Always store `right ← st.pop()` first and `left ← st.pop()` second before computing `left - right` or `left / right`.",
      },
      {
        title: "Forgetting to check empty stack before pop or after the loop",
        detail:
          "In bracket matching, `\"]\"` causes an underflow if you call `pop()` on an empty stack, and `\"(((\"` leaks unclosed openers if you return `true` instead of `is_empty(stack)` at the end.",
      },
      {
        title: "Min Stack using only one scalar minimum variable",
        detail:
          "A single `min_val` cannot recover the previous minimum once the current minimum is popped. Pairing every value with its running minimum (or using a second `mins` stack) keeps `get_min()` at `O(1)` across all pops.",
      },
    ],
    practiceTask: {
      title: "Validate Nested Brackets",
      tier: "Warmup",
      goal: "Given a string `s` containing only `(`, `)`, `[`, `]`, `{`, `}`, return `true` if every opener is closed in the proper LIFO order, and `false` otherwise.",
      constraints: ["1 <= len(s) <= 10^5", "Characters only from ()[]{}", "Target: O(n) time, O(n) space"],
      examples: [
        { input: "s = \"({[]})\"", output: "true" },
        { input: "s = \"([)]\"", output: "false" },
      ],
      tasks: [
        "Map each closing bracket to its matching opener.",
        "Push openers onto a stack; on each closer, verify the stack is non-empty and its popped top matches.",
        "Return `is_empty(stack)` after scanning the whole string.",
      ],
      starterCode: "function is_valid_brackets(s):\n    // TODO: validate balanced brackets with a stack",
      expectedOutput: "true\nfalse",
      hint: "An odd-length string can never be valid, and `\"((\"` fails only when you check `is_empty(stack)` at the end.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "function is_valid_brackets(s):\n    pairs ← { ')': '(', ']': '[', '}': '{' }\n    stack ← []\n    for ch in s:\n        if ch in pairs:\n            if is_empty(stack) or stack.pop() != pairs[ch]:\n                return false\n        else:\n            stack.push(ch)\n    return is_empty(stack)",
    },
    practiceChallenges: [
      {
        title: "Validate Nested Brackets",
        tier: "Warmup",
        goal: "Return `true` if string `s` of `()[]{}` brackets is properly matched and nested, else `false`.",
        constraints: ["1 <= len(s) <= 10^5", "Target: O(n) time, O(n) space"],
        examples: [
          { input: "s = \"({[]})\"", output: "true" },
          { input: "s = \"([)]\"", output: "false" },
        ],
        tasks: [
          "Push every opening bracket onto `stack`.",
          "For every closing bracket, check non-empty stack and exact opener match, then return `is_empty(stack)`.",
        ],
        starterCode: "function is_valid_brackets(s):\n    // TODO: validate brackets using LIFO stack",
        expectedOutput: "true\nfalse",
        hint: "Store a lookup map `pairs = { ')': '(', ']': '[', '}': '{' }` so all three bracket types share one branch.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function is_valid_brackets(s):\n    pairs ← { ')': '(', ']': '[', '}': '{' }\n    stack ← []\n    for ch in s:\n        if ch in pairs:\n            if is_empty(stack) or stack.pop() != pairs[ch]:\n                return false\n        else:\n            stack.push(ch)\n    return is_empty(stack)",
      },
      {
        title: "Evaluate Reverse Polish Expression",
        tier: "Core",
        goal: "Given an array of RPN tokens `tokens` (integers and `+`, `-`, `*`, `/`), evaluate the expression and return the integer result (division truncates toward zero).",
        constraints: ["1 <= len(tokens) <= 10^4", "Expression is guaranteed valid", "Target: O(n) time, O(n) space"],
        examples: [
          { input: "tokens = [\"2\", \"1\", \"+\", \"3\", \"*\"]", output: "9" },
          { input: "tokens = [\"4\", \"13\", \"5\", \"/\", \"+\"]", output: "6" },
        ],
        tasks: [
          "Push integer tokens onto an operand stack.",
          "When seeing an operator, pop `right` then `left`, compute `left op right`, and push the result.",
        ],
        starterCode: "function eval_rpn(tokens):\n    // TODO: evaluate postfix tokens with a stack",
        expectedOutput: "9\n6",
        hint: "Remember `-6 / 4` truncates toward zero to `-1`, not floor `-2`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function eval_rpn(tokens):\n    st ← []\n    for tok in tokens:\n        if tok in ['+', '-', '*', '/']:\n            right ← st.pop()\n            left ← st.pop()\n            if tok == '+': st.push(left + right)\n            else if tok == '-': st.push(left - right)\n            else if tok == '*': st.push(left * right)\n            else: st.push(trunc_toward_zero(left / right))\n        else:\n            st.push(to_int(tok))\n    return st.pop()",
      },
      {
        title: "Stack With O(1) Running Minimum",
        tier: "Stretch",
        goal: "Design `MinStack` supporting `push(val)`, `pop()`, `top()`, and `get_min()` in `O(1)` time per operation.",
        constraints: ["Up to 3 * 10^4 operations", "pop/top/get_min called on non-empty stack", "Target: O(1) time per call"],
        examples: [
          {
            input: "push(-2), push(0), push(-3), get_min(), pop(), top(), get_min()",
            output: "-3, 0, -2",
          },
          {
            input: "push(2), push(1), push(1), pop(), get_min()",
            output: "1",
            explanation: "Duplicate minimums push twice onto mins so one pop leaves the remaining 1 intact.",
          },
        ],
        tasks: [
          "Maintain `vals` and a synchronized `mins` stack (or `(val, min_so_far)` pairs).",
          "Update `mins` on every `push` with `min(val, mins.peek())` and pop both stacks on `pop()`.",
        ],
        starterCode:
          "class MinStack:\n    init():\n        // TODO\n    function push(val):\n        // TODO\n    function pop():\n        // TODO\n    function top():\n        // TODO\n    function get_min():\n        // TODO",
        expectedOutput: "-3, 0, -2\n1",
        hint: "Synchronizing a second `mins` stack avoids special-case equality checks when duplicate minimums are pushed.",
        complexity: { time: "O(1) per op", space: "O(n)" },
        solutionCode:
          "class MinStack:\n    init():\n        vals ← []\n        mins ← []\n    function push(val):\n        vals.push(val)\n        cur_min ← val if is_empty(mins) else min(val, mins.peek())\n        mins.push(cur_min)\n    function pop():\n        vals.pop()\n        mins.pop()\n    function top():\n        return vals.peek()\n    function get_min():\n        return mins.peek()",
      },
    ],
  },

  "dsa-queue-deque": {
    lessonId: "dsa-queue-deque",
    subtitle:
      "See why naive array pop(0) costs O(n), build an O(1) circular ring buffer with modulo wraparound, implement a Queue using two Stacks, and generalize to a Deque.",
    intro: {
      heading: "Queue (FIFO), Circular Buffer & Deque",
      explanation: [
        "Using a plain dynamic array as a FIFO queue by calling `list.pop(0)` looks fine on 10 elements, yet removing index `0` shifts all `n - 1` remaining elements one slot left in `O(n)` time. Running a 100,000-node BFS or task pipeline this way explodes into `O(n^2)` total shifts and stalls.",
        "A **circular ring buffer** removes the shift by wrapping `head` and `tail` indices around a fixed array using `(idx + 1) mod cap`, keeping `enqueue` and `dequeue` at `O(1)`. Pairing two stacks (`in_stack` and `out_stack`) gives amortized `O(1)` FIFO transfers, and allowing `O(1)` push and pop at both ends gives a **Deque**.",
      ],
      analogy:
        "On a circular sushi conveyor belt with numbered plates `0..cap-1`, instead of sliding every plate on the counter left whenever a customer eats the front plate, the server advances a `head` flag one plate forward around the ring.",
      realWorldUses: [
        "Buffering incoming network packets, print jobs, and background worker tasks in strict FIFO arrival order",
        "Powering fixed-memory producer-consumer ring buffers and double-ended sliding-window structures",
      ],
    },
    sections: [
      {
        heading: "Why pop(0) shifts O(n) and how a circular buffer avoids it",
        paragraphs: [
          "If a queue stores `n` elements in `arr[0..n-1]` and removes `arr[0]` by shifting `arr[1..n-1]` into `arr[0..n-2]`, a single `dequeue` touches `n - 1` elements (`O(n)`), making `n` enqueues followed by `n` dequeues take `O(n^2)` total work. Advancing an unwrapped `tail ← tail + 1` in a fixed 4-slot array also breaks: after 4 enqueues and 1 dequeue, `tail = 4` writes out of bounds even though slot `0` is empty.",
          "A **circular buffer (ring buffer)** allocates a fixed array `buf` of capacity `cap`, plus `head` (front item), `tail` (next free back slot), and `size`. Enqueue writes `buf[tail] ← x` and wraps `tail ← (tail + 1) mod cap` (so `tail = 3` wraps to `0` when `cap = 4`); dequeue reads `buf[head]` and wraps `head ← (head + 1) mod cap`. Tracking `size` distinguishes empty (`size == 0`) from full (`size == cap`) without wasting an extra slot.",
        ],
        code: [
          "class CircularQueue:",
          "    init(cap):",
          "        buf ← array of size cap",
          "        head ← 0; tail ← 0; size ← 0; capacity ← cap",
          "    function enqueue(x):",
          "        if size == capacity: return false",
          "        buf[tail] ← x",
          "        tail ← (tail + 1) mod capacity",
          "        size ← size + 1",
          "        return true",
          "    function dequeue():",
          "        if size == 0: return null",
          "        val ← buf[head]",
          "        head ← (head + 1) mod capacity",
          "        size ← size - 1",
          "        return val",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Queue and Deque implementation tradeoffs",
          headers: ["Representation", "Push back / front", "Pop front / back", "Memory & locality"],
          rows: [
            ["Plain array (`pop(0)`)", "O(1) back / O(n) front", "O(n) front / O(1) back", "Contiguous, but front shifts cost O(n)"],
            ["Circular Ring Buffer", "O(1) both ends", "O(1) both ends", "Contiguous cache-friendly array; resize on full if unbounded"],
            ["Doubly Linked List (M12)", "O(1) both ends", "O(1) both ends", "Unbounded capacity, but per-node pointer overhead"],
            ["Two Stacks (Queue only)", "O(1) enqueue", "O(1) amortized dequeue", "Reverses elements lazily from in_stack to out_stack"],
          ],
          highlightCol: 2,
        },
        visual: {
          kind: "dsa-structure",
          mode: "queue",
          title: "Logical FIFO Queue View (Behind Circular Array Storage)",
          items: [
            { id: "q30", label: "30", sub: "buf[2] (head)", state: "done" },
            { id: "q40", label: "40", sub: "buf[3]", state: "default" },
            { id: "q50", label: "50", sub: "buf[0] (newest)", state: "active" },
          ],
          caption: "Even though 50 sits at physical index 0 after wraparound, logically it waits behind 30 and 40.",
        },
        callout: {
          kind: "KEY IDEA",
          text: "To step backward in a circular Deque (`push_front` or `pop_back`), use `(idx - 1 + cap) mod cap` so index `0` wraps to `cap - 1` without negative modulo bugs.",
        },
      },
      {
        heading: "Queue using Two Stacks (amortized O(1)) and Deque operations",
        paragraphs: [
          "Two LIFO stacks implement a FIFO queue: keep `in_stack` for `enqueue` and `out_stack` for `dequeue` and `peek`. Each `enqueue(x)` pushes `x` onto `in_stack` in `O(1)`. Whenever `dequeue()` or `peek()` needs the front item and `out_stack` is empty, pop every element from `in_stack` and push it onto `out_stack`. That single pour reverses `in_stack` so the oldest item lands on top of `out_stack`.",
          "Even though one `dequeue` can take `O(n)` steps during a pour, each element enters `in_stack` once, transfers to `out_stack` at most once, and leaves `out_stack` once (`3` stack ops total per item). Across any sequence of `m` operations, total time is `O(m)`, which is **amortized O(1)** per operation. Meanwhile, a **Deque** supports `push_front`, `push_back`, `pop_front`, and `pop_back` all in `O(1)`.",
        ],
        code: [
          "class StackQueue:",
          "    init(): in_stack ← []; out_stack ← []",
          "    function enqueue(x): in_stack.push(x)",
          "    function move_if_needed():",
          "        if is_empty(out_stack):",
          "            while not is_empty(in_stack):",
          "                out_stack.push(in_stack.pop())",
          "    function peek():",
          "        move_if_needed()",
          "        return out_stack.peek()",
          "    function dequeue():",
          "        move_if_needed()",
          "        return out_stack.pop()",
        ],
        codeLabel: "Pseudocode",
        callout: {
          kind: "WATCH OUT",
          text: "Only pour `in_stack` into `out_stack` when `out_stack` is completely empty. Pouring while `out_stack` still has older elements buries the older items underneath newer ones and breaks FIFO order!",
        },
      },
    ],
    guidedBuildUp: {
      title: "From O(n) list.pop(0) to an O(1) Circular Ring Buffer",
      steps: [
        {
          label: "Step 1: Naive array queue with pop(0) (O(n) dequeue)",
          explanation: "Appending to the back is `O(1)`, yet removing from index `0` shifts all `n - 1` remaining items left.",
          code: [
            "class NaiveQueue:",
            "    init(): buf ← []",
            "    function enqueue(x): buf.append(x)",
            "    function dequeue(): return buf.pop(0)  // O(n) shift!",
          ],
          activeLines: [4],
          output: "100,000 items -> ~5 * 10^9 element shifts",
        },
        {
          label: "Step 2: Wrap tail and head with modulo (missing capacity guard)",
          explanation: "Using `(idx + 1) mod cap` avoids shifting, yet `head == tail` alone cannot tell empty from full.",
          code: [
            "class RingDraft:",
            "    init(cap): buf ← array(cap); head ← 0; tail ← 0; c ← cap",
            "    function enqueue(x):",
            "        buf[tail] ← x",
            "        tail ← (tail + 1) mod c",
            "    function dequeue():",
            "        val ← buf[head]",
            "        head ← (head + 1) mod c; return val",
          ],
          activeLines: [5, 8],
          output: "Overwrites unread front item if full!",
        },
        {
          label: "Step 3: Complete CircularQueue tracking size",
          explanation: "Adding `size` rejects writes when `size == cap` and reads when `size == 0`, keeping both ops `O(1)`.",
          code: [
            "class CircularQueue:",
            "    init(cap): buf ← array(cap); head ← 0; tail ← 0; size ← 0; c ← cap",
            "    function enqueue(x):",
            "        if size == c: return false",
            "        buf[tail] ← x; tail ← (tail + 1) mod c; size ← size + 1; return true",
            "    function dequeue():",
            "        if size == 0: return null",
            "        val ← buf[head]; head ← (head + 1) mod c; size ← size - 1; return val",
          ],
          activeLines: [4, 7],
          output: "enqueue/dequeue -> strict O(1), zero shifts",
        },
      ],
    },
    walkthrough: {
      title: "Trace a 4-slot Circular Ring Buffer wrapping around index 0",
      layout: "visual-first",
      steps: [
        {
          title: "Initialize an empty 4-slot ring buffer",
          tag: "MEMORY",
          explanation: [
            "Allocate `buf` with capacity `4` (`indices 0..3`). Set `head ← 0`, `tail ← 0`, and `size ← 0`.",
            "Both `head` (next read) and `tail` (next write) start at index `0`.",
          ],
          code: [
            "cap ← 4",
            "buf ← [_, _, _, _]",
            "head ← 0; tail ← 0; size ← 0",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "cap = 4",
              "buf = [None] * cap",
              "head = tail = size = 0",
            ],
          },
          state: [
            { name: "head", value: "0" },
            { name: "tail", value: "0" },
            { name: "size", value: "0" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Circular buffer buf (cap = 4)",
                cells: [
                  { id: "b0", value: "_", index: 0, state: "dim" },
                  { id: "b1", value: "_", index: 1, state: "dim" },
                  { id: "b2", value: "_", index: 2, state: "dim" },
                  { id: "b3", value: "_", index: 3, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "head / tail", tone: "accent" },
                ],
              },
            ],
            caption: "Empty ring buffer: size == 0 distinguishes empty from full even when head == tail.",
          },
        },
        {
          title: "Enqueue 10, 20, and 30 in O(1) each",
          tag: "TRACE",
          explanation: [
            "Write `10`, `20`, and `30` at indices `0`, `1`, and `2`, advancing `tail ← (tail + 1) mod 4` each time.",
            "Now `head = 0`, `tail = 3`, and `size = 3`.",
          ],
          code: [
            "enqueue(10)   // buf[0]=10, tail=1",
            "enqueue(20)   // buf[1]=20, tail=2",
            "enqueue(30)   // buf[2]=30, tail=3",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "buf[0] = 10; buf[1] = 20; buf[2] = 30",
              "tail = 3; size = 3",
              "# cap=4, head stays at 0",
            ],
          },
          state: [
            { name: "head", value: "0" },
            { name: "tail", value: "3", changed: true },
            { name: "size", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After enqueue(10), enqueue(20), enqueue(30)",
                cells: [
                  { id: "b0", value: "10", index: 0, state: "done" },
                  { id: "b1", value: "20", index: 1 },
                  { id: "b2", value: "30", index: 2, state: "active" },
                  { id: "b3", value: "_", index: 3, state: "dim" },
                ],
                pointers: [
                  { index: 0, label: "head", tone: "ok" },
                  { index: 3, label: "tail", tone: "coral" },
                ],
              },
            ],
            caption: "head (green) marks the front item 10; tail (coral) points to the next open slot after newest item 30.",
          },
        },
        {
          title: "Dequeue 10 and 20 by advancing head (zero shifting)",
          tag: "TRACE",
          explanation: [
            "Two `dequeue()` calls return `10` then `20` and move `head` from `0 -> 1 -> 2`, lowering `size` to `1`.",
            "Item `30` stays right where it is at `buf[2]` without shifting any elements!",
          ],
          code: [
            "dequeue()     // returns 10, head=(0+1)%4=1",
            "dequeue()     // returns 20, head=(1+1)%4=2",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "Dequeued", value: "10, 20", changed: true },
            { name: "head", value: "2", changed: true },
            { name: "tail", value: "3" },
            { name: "size", value: "1", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "After two dequeues: slots 0 and 1 are free again",
                cells: [
                  { id: "b0", value: "_", index: 0, state: "dim" },
                  { id: "b1", value: "_", index: 1, state: "dim" },
                  { id: "b2", value: "30", index: 2, state: "done" },
                  { id: "b3", value: "_", index: 3, state: "dim" },
                ],
                pointers: [
                  { index: 2, label: "head", tone: "ok" },
                  { index: 3, label: "tail", tone: "coral" },
                ],
              },
            ],
            caption: "Front removal takes O(1) because head (green) increments in place while tail stays at index 3.",
          },
        },
        {
          title: "Enqueue 40 and 50: tail wraps around to index 0",
          tag: "PATTERN",
          explanation: [
            "`enqueue(40)` writes to `buf[3]` and wraps `tail ← (3 + 1) mod 4 = 0`!",
            "`enqueue(50)` then writes to `buf[0]` and sets `tail ← 1`. All three active items (`30, 40, 50`) coexist with `size = 3`.",
          ],
          code: [
            "enqueue(40)   // buf[3]=40, tail=(3+1)%4=0",
            "enqueue(50)   // buf[0]=50, tail=(0+1)%4=1",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "head", value: "2" },
            { name: "tail", value: "1", changed: true },
            { name: "size", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Wrapped ring buffer: active items occupy [2], [3], [0]",
                cells: [
                  { id: "b0", value: "50", index: 0, state: "active" },
                  { id: "b1", value: "_", index: 1, state: "dim" },
                  { id: "b2", value: "30", index: 2, state: "done" },
                  { id: "b3", value: "40", index: 3 },
                ],
                pointers: [
                  { index: 1, label: "tail", tone: "coral" },
                  { index: 2, label: "head", tone: "ok" },
                ],
              },
            ],
            caption: "Modulo wraparound reuses freed slots [0] and [1]: head (green) stays at 30 while newest item 50 (coral) sits before tail.",
          },
        },
        {
          title: "Logical FIFO view matches [30, 40, 50]",
          tag: "CHECK",
          explanation: [
            "Reading `size = 3` slots starting at `head = 2` (`(head + offset) mod 4`) gives the exact FIFO sequence `30 -> 40 -> 50`.",
            "The next `dequeue()` reads `30` from `head`, and the next `enqueue(60)` writes to `tail` (`buf[1]`).",
          ],
          code: [
            "// Logical FIFO order: buf[(head + k) mod 4] for k in 0..size-1",
            "// k=0 -> buf[2]=30 (FRONT)",
            "// k=1 -> buf[3]=40",
            "// k=2 -> buf[0]=50 (BACK)",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Front", value: "30 (buf[2])" },
            { name: "Back", value: "50 (buf[0])" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Physical ring buffer buf[0..3] (head = 2, tail = 1)",
                cells: [
                  { id: "b0", value: "50", index: 0, state: "active" },
                  { id: "b1", value: "_", index: 1, state: "dim" },
                  { id: "b2", value: "30", index: 2, state: "done" },
                  { id: "b3", value: "40", index: 3 },
                ],
                pointers: [
                  { index: 1, label: "tail", tone: "coral" },
                  { index: 2, label: "head", tone: "ok" },
                ],
              },
              {
                label: "Logical FIFO queue order (reading size=3 from head)",
                cells: [
                  { id: "q30", value: "30 (buf[2])", index: 0, state: "done" },
                  { id: "q40", value: "40 (buf[3])", index: 1 },
                  { id: "q50", value: "50 (buf[0])", index: 2, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "front", tone: "ok" },
                  { index: 2, label: "back", tone: "coral" },
                ],
              },
            ],
            caption: "Even though 50 sits at physical index 0, reading (head + k) mod 4 aligns the logical queue [30, 40, 50].",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Negative index wraparound in circular Deques",
        detail:
          "In languages like Java, C++, or JavaScript, `-1 mod cap` evaluates to `-1`, not `cap - 1`. Always compute `(idx - 1 + cap) mod cap` whenever stepping `head` or `tail` backward.",
      },
      {
        title: "Ambiguous head == tail in fixed ring buffers",
        detail:
          "Both an empty buffer (`size == 0`) and a completely full buffer (`size == cap`) have `head == tail`. Maintaining an explicit `size` counter (or reserving one unused slot) resolves the ambiguity.",
      },
      {
        title: "Pouring in_stack into a non-empty out_stack",
        detail:
          "In a Two-Stack Queue, never transfer items from `in_stack` while `out_stack` still contains elements. Only pour when `is_empty(out_stack)` is true.",
      },
    ],
    practiceTask: {
      title: "Implement a Fixed-Capacity Circular Queue",
      tier: "Warmup",
      goal: "Design `MyCircularQueue(k)` supporting `en_queue(value)`, `de_queue()`, `front()`, `rear()`, `is_empty()`, and `is_full()` all in `O(1)` time.",
      constraints: ["1 <= k <= 1000", "Up to 3000 operations", "Target: O(1) time per call, O(k) space"],
      examples: [
        { input: "k=3; en_queue(1), en_queue(2), en_queue(3), en_queue(4), rear(), is_full(), de_queue(), en_queue(4), rear()", output: "true, true, true, false, 3, true, true, true, 4" },
        { input: "k=1; en_queue(7), is_full(), de_queue(), front(), de_queue()", output: "true, true, true, -1, false", explanation: "Checks empty front() returning -1 and de_queue() returning false on empty capacity-1 ring." },
      ],
      tasks: [
        "Store `buf` of length `k`, `head = 0`, `size = 0` (compute `tail = (head + size) mod k`).",
        "Return `false` if `en_queue` is called when `size == k`, and `false` if `de_queue` is called when `size == 0`.",
      ],
      starterCode:
        "class MyCircularQueue:\n    init(k):\n        // TODO: initialize fixed array and pointers\n    function en_queue(value):\n        // TODO\n    function de_queue():\n        // TODO\n    function front():\n        // TODO\n    function rear():\n        // TODO",
      expectedOutput: "true, true, true, false, 3, true, true, true, 4\ntrue, true, true, -1, false",
      hint: "Tracking `(head, size, cap)` lets you compute `rear` directly as `buf[(head + size - 1) mod cap]` without keeping a separate `tail` variable.",
      complexity: { time: "O(1) per op", space: "O(k)" },
      solutionCode:
        "class MyCircularQueue:\n    init(k):\n        buf ← array of size k\n        cap ← k\n        head ← 0\n        size ← 0\n    function is_empty(): return size == 0\n    function is_full(): return size == cap\n    function en_queue(value):\n        if size == cap: return false\n        tail ← (head + size) mod cap\n        buf[tail] ← value\n        size ← size + 1\n        return true\n    function de_queue():\n        if size == 0: return false\n        head ← (head + 1) mod cap\n        size ← size - 1\n        return true\n    function front():\n        return -1 if size == 0 else buf[head]\n    function rear():\n        return -1 if size == 0 else buf[(head + size - 1) mod cap]",
    },
    practiceChallenges: [
      {
        title: "Implement a Fixed-Capacity Circular Queue",
        tier: "Warmup",
        goal: "Build a ring-buffer queue of fixed size `k` with `O(1)` `en_queue`, `de_queue`, `front`, `rear`, `is_empty`, and `is_full`.",
        constraints: ["1 <= k <= 1000", "Target: O(1) time per call"],
        examples: [
          { input: "k=3; en_queue(1), en_queue(2), en_queue(3), en_queue(4), rear(), de_queue(), en_queue(4), rear()", output: "true, true, true, false, 3, true, true, 4" },
          { input: "k=1; en_queue(7), de_queue(), front(), de_queue()", output: "true, true, -1, false", explanation: "Emptying a size-1 queue makes front() return -1 and further de_queue() return false." },
        ],
        tasks: [
          "Track `head`, `size`, and `cap` so empty (`size == 0`) and full (`size == cap`) are unambiguous.",
          "Wrap indices using modulo `cap`.",
        ],
        starterCode:
          "class MyCircularQueue:\n    init(k):\n        // TODO\n    function en_queue(value):\n        // TODO\n    function de_queue():\n        // TODO\n    function front():\n        // TODO\n    function rear():\n        // TODO",
        expectedOutput: "true, true, true, false, 3, true, true, 4\ntrue, true, -1, false",
        hint: "If `size == 0`, both `front()` and `rear()` should return `-1`.",
        complexity: { time: "O(1) per op", space: "O(k)" },
        solutionCode:
          "class MyCircularQueue:\n    init(k):\n        buf ← array of size k\n        cap ← k\n        head ← 0\n        size ← 0\n    function en_queue(value):\n        if size == cap: return false\n        buf[(head + size) mod cap] ← value\n        size ← size + 1\n        return true\n    function de_queue():\n        if size == 0: return false\n        head ← (head + 1) mod cap\n        size ← size - 1\n        return true\n    function front():\n        return -1 if size == 0 else buf[head]\n    function rear():\n        return -1 if size == 0 else buf[(head + size - 1) mod cap]",
      },
      {
        title: "Build a FIFO Queue Using Two Stacks",
        tier: "Core",
        goal: "Implement `push(x)`, `pop()`, `peek()`, and `empty()` for a FIFO queue using only two LIFO stacks with amortized `O(1)` time per operation.",
        constraints: ["Up to 10^4 calls", "Only standard stack push/pop/peek/empty allowed", "Target: O(1) amortized per call"],
        examples: [
          { input: "push(1), push(2), peek(), pop(), push(3), pop(), pop()", output: "1, 1, 2, 3" },
          { input: "empty(), push(5), empty(), pop(), empty()", output: "true, false, 5, true", explanation: "empty() checks both in_stack and out_stack before and after draining the queue." },
        ],
        tasks: [
          "Push new items onto `in_stack`.",
          "Pour `in_stack` into `out_stack` only when `out_stack` is empty before `pop()` or `peek()`.",
        ],
        starterCode:
          "class StackQueue:\n    init():\n        // TODO\n    function push(x):\n        // TODO\n    function pop():\n        // TODO\n    function peek():\n        // TODO\n    function empty():\n        // TODO",
        expectedOutput: "1, 1, 2, 3\ntrue, false, 5, true",
        hint: "The queue is empty only when both `in_stack` and `out_stack` are empty.",
        complexity: { time: "O(1) amortized", space: "O(n)" },
        solutionCode:
          "class StackQueue:\n    init():\n        in_stack ← []\n        out_stack ← []\n    function push(x):\n        in_stack.push(x)\n    function shift():\n        if is_empty(out_stack):\n            while not is_empty(in_stack):\n                out_stack.push(in_stack.pop())\n    function peek():\n        shift()\n        return out_stack.peek()\n    function pop():\n        shift()\n        return out_stack.pop()\n    function empty():\n        return is_empty(in_stack) and is_empty(out_stack)",
      },
      {
        title: "Circular Double-Ended Queue (Deque)",
        tier: "Stretch",
        goal: "Implement `MyCircularDeque(k)` supporting `insert_front(val)`, `insert_last(val)`, `delete_front()`, `delete_last()`, `get_front()`, and `get_rear()` in `O(1)` time.",
        constraints: ["1 <= k <= 1000", "Up to 2000 operations", "Target: O(1) time per operation"],
        examples: [
          { input: "k=3; insert_last(1), insert_last(2), insert_front(3), insert_front(4), get_rear(), delete_last(), insert_front(4), get_front()", output: "true, true, true, false, 2, true, true, 4" },
          { input: "k=2; insert_front(7), delete_front(), get_front(), get_rear()", output: "true, true, -1, -1", explanation: "Wrap-around front insert then delete leaves size 0, so both ends return -1." },
        ],
        tasks: [
          "Use `(head - 1 + cap) mod cap` when inserting at the front, and `(head + 1) mod cap` when deleting from the front.",
          "Track `size` so `rear_idx = (head + size - 1) mod cap` and `insert_last` writes at `(head + size) mod cap`.",
        ],
        starterCode:
          "class MyCircularDeque:\n    init(k):\n        // TODO\n    function insert_front(val):\n        // TODO\n    function insert_last(val):\n        // TODO\n    function delete_front():\n        // TODO\n    function delete_last():\n        // TODO\n    function get_front():\n        // TODO\n    function get_rear():\n        // TODO",
        expectedOutput: "true, true, true, false, 2, true, true, 4\ntrue, true, -1, -1",
        hint: "Inserting at the front moves `head` backward by 1 first (`head = (head - 1 + cap) % cap`) and then writes `buf[head] = val`.",
        complexity: { time: "O(1) per op", space: "O(k)" },
        solutionCode:
          "class MyCircularDeque:\n    init(k):\n        buf ← array of size k\n        cap ← k\n        head ← 0\n        size ← 0\n    function insert_front(val):\n        if size == cap: return false\n        head ← (head - 1 + cap) mod cap\n        buf[head] ← val\n        size ← size + 1\n        return true\n    function insert_last(val):\n        if size == cap: return false\n        buf[(head + size) mod cap] ← val\n        size ← size + 1\n        return true\n    function delete_front():\n        if size == 0: return false\n        head ← (head + 1) mod cap\n        size ← size - 1\n        return true\n    function delete_last():\n        if size == 0: return false\n        size ← size - 1\n        return true\n    function get_front():\n        return -1 if size == 0 else buf[head]\n    function get_rear():\n        return -1 if size == 0 else buf[(head + size - 1) mod cap]",
      },
    ],
  },

  "dsa-monotonic-stack": {
    lessonId: "dsa-monotonic-stack",
    subtitle:
      "Maintain a monotonic increasing or decreasing stack of indices so every element is pushed once and popped at most once in O(n), solving Next Greater Element, Daily Temperatures, and Largest Rectangle in Histogram.",
    intro: {
      heading: "Monotonic Stack Pattern",
      explanation: [
        "Scanning ahead with a nested `for j > i` loop to find the next warmer day or nearest shorter histogram bar repeats comparisons on every index and runs in `O(n^2)` time—on 100,000 elements, that takes billions of operations and times out.",
        "A **monotonic stack** cuts that to `O(n)` by storing **indices** in strictly increasing or decreasing value order. Whenever a newcomer `i` breaks the stack's sorted order, the `while` loop pops waiting indices because `i` is the exact boundary element they needed; each index enters once and leaves at most once (`<= 2n` stack ops total).",
      ],
      analogy:
        "Picture commuters standing in a line looking right for the first person taller than them. Anyone shorter than the newcomer immediately gets their answer and steps out of the waiting line, so the remaining line stays strictly decreasing in height from back to front.",
      realWorldUses: [
        "Computing stock-span streaks and next price breakouts across financial time series in a single pass",
        "Finding largest rectangular bounding boxes in histogram bars, image masks, and matrix-row heights",
      ],
    },
    sections: [
      {
        heading: "Monotonic decreasing stack: Next Greater & Daily Temperatures",
        paragraphs: [
          "To find the **next greater element** (or wait days until a warmer temperature in **Daily Temperatures**), keep a stack of unresolved indices whose values are **monotonically decreasing** from bottom to top (`nums[st[0]] >= nums[st[1]] >= ...`). When `nums[i]` arrives and `nums[i] > nums[st.peek()]`, index `i` is the first greater element to the right of `st.peek()`. Pop `prev ← st.pop()`, record `ans[prev] ← i - prev` (for days waited) or `ans[prev] ← nums[i]` (for value), and repeat while the top is smaller.",
          "Compare storing raw **values** vs **indices**: pushing `73` onto `st` tells you `74 > 73`, yet loses how many days passed (`1 - 0 = 1`) and breaks when duplicate values appear. Storing **indices** lets you read both value (`temps[prev]`) and distance (`i - prev`).",
        ],
        code: [
          "function daily_temperatures(temps):",
          "    n ← len(temps)",
          "    ans ← array of n zeros",
          "    st ← []    // monotonic decreasing stack of indices",
          "    for i from 0 to n - 1:",
          "        while not is_empty(st) and temps[i] > temps[st.peek()]:",
          "            prev ← st.pop()",
          "            ans[prev] ← i - prev",
          "        st.push(i)",
          "    return ans",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Choosing monotonic stack order and pop condition",
          headers: ["Target boundary", "Stack order (bottom -> top)", "Pop while incoming x ...", "What popped idx learns"],
          rows: [
            ["Next Greater Element", "Monotonic decreasing (strict or non-increasing)", "x > val[top]", "First greater item to right is x"],
            ["Next Greater or Equal", "Strictly decreasing", "x >= val[top]", "First >= item to right is x"],
            ["Next Smaller Element", "Monotonic increasing (non-decreasing)", "x < val[top]", "First smaller item to right is x"],
            ["Largest Rectangle (Histogram)", "Monotonic increasing heights", "x < heights[top]", "Right boundary is i; left boundary is new stack top"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Amortized O(n) analysis: each index `0..n-1` is pushed onto `st` exactly once and popped at most once. Therefore, the inner `while` loop executes at most `n` pops across the entire `for` loop.",
        },
      },
      {
        heading: "Step-by-step push/pop dry run on [73, 74, 75, 71, 69, 72]",
        paragraphs: [
          "Tracing every push and pop on `temps = [73, 74, 75, 71, 69, 72]` shows why the stack stays decreasing by value and why unresolved elements keep their default `0` when the loop ends.",
        ],
        table: {
          caption: "Daily Temperatures monotonic stack trace on [73, 74, 75, 71, 69, 72]",
          headers: ["Step (i, temp)", "While Condition & Pops", "Stack After Push (idx:val)", "ans Snapshot"],
          rows: [
            ["i = 0 (73)", "Stack empty -> 0 pops", "[0:73]", "[0, 0, 0, 0, 0, 0]"],
            ["i = 1 (74)", "74 > 73 -> pop 0, ans[0] = 1 - 0 = 1", "[1:74]", "[1, 0, 0, 0, 0, 0]"],
            ["i = 2 (75)", "75 > 74 -> pop 1, ans[1] = 2 - 1 = 1", "[2:75]", "[1, 1, 0, 0, 0, 0]"],
            ["i = 3 (71)", "71 <= 75 -> 0 pops", "[2:75, 3:71]", "[1, 1, 0, 0, 0, 0]"],
            ["i = 4 (69)", "69 <= 71 -> 0 pops", "[2:75, 3:71, 4:69]", "[1, 1, 0, 0, 0, 0]"],
            ["i = 5 (72)", "72 > 69 -> pop 4 (ans[4]=1); 72 > 71 -> pop 3 (ans[3]=2); 72 <= 75 stop", "[2:75, 5:72]", "[1, 1, 0, 2, 1, 0]"],
          ],
          highlightCol: 2,
        },
      },
      {
        heading: "Monotonic increasing stack: Largest Rectangle in Histogram",
        paragraphs: [
          "For **Largest Rectangle in Histogram**, a bar of height `h = heights[mid]` can extend leftward until the first strictly shorter bar `left_bound` and rightward until the first strictly shorter bar `right_bound`. Its maximum width is `(right_bound - left_bound - 1)`.",
          "Maintain a **monotonically increasing** stack of bar indices (`heights[st]` non-decreasing). Iterate `i` from `0` to `n`, treating `cur_h = 0` at sentinel `i = n` so every remaining bar gets popped. Whenever `cur_h < heights[st.peek()]`, pop `mid ← st.pop()` (`h ← heights[mid]`). Here `i` is the right boundary, and the **new** stack top (or `-1` if the stack is now empty) is the left boundary! Width is `i if is_empty(st) else i - st.peek() - 1`.",
        ],
        code: [
          "function largest_rectangle_area(heights):",
          "    n ← len(heights)",
          "    st ← []    // increasing bar indices",
          "    best ← 0",
          "    for i from 0 to n:",
          "        cur_h ← 0 if i == n else heights[i]",
          "        while not is_empty(st) and cur_h < heights[st.peek()]:",
          "            h ← heights[st.pop()]",
          "            width ← i if is_empty(st) else i - st.peek() - 1",
          "            best ← max(best, h * width)",
          "        st.push(i)",
          "    return best",
        ],
        codeLabel: "Pseudocode",
        callout: {
          kind: "WATCH OUT",
          text: "Do not forget the trailing `0`-height sentinel at `i = n` (or a final cleanup loop after `i = n - 1`). Without it, bars still sitting in the increasing stack at the end of the array are never popped or measured.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From O(n^2) Nested Scans to an O(n) Monotonic Index Stack",
      steps: [
        {
          label: "Step 1: Brute-force nested scan (O(n^2))",
          explanation: "Searching forward from every index `i` repeats work across descending runs and times out on large inputs.",
          code: [
            "function daily_temps_naive(temps):",
            "    n ← len(temps); ans ← array of n zeros",
            "    for i from 0 to n - 1:",
            "        for j from i + 1 to n - 1:",
            "            if temps[j] > temps[i]:",
            "                ans[i] ← j - i; break",
            "    return ans",
          ],
          activeLines: [4, 5, 6],
          output: "100,000 descending items -> ~5 * 10^9 checks",
        },
        {
          label: "Step 2: Decreasing stack of values (loses distance)",
          explanation: "Popping smaller values resolves next greater value, yet cannot compute `i - prev` distance without indices.",
          code: [
            "function next_greater_values(temps):",
            "    st ← []",
            "    for temp in temps:",
            "        while not is_empty(st) and temp > st.peek():",
            "            resolved ← st.pop()",
            "        st.push(temp)",
          ],
          activeLines: [4, 5, 6],
          output: "Knows temp > resolved, missing wait days!",
        },
        {
          label: "Step 3: Monotonic decreasing stack of indices (O(n))",
          explanation: "Storing indices gives both `temps[prev]` comparison and `i - prev` distance in `<= 2n` stack ops.",
          code: [
            "function daily_temperatures(temps):",
            "    ans ← array of len(temps) zeros; st ← []",
            "    for i from 0 to len(temps) - 1:",
            "        while not is_empty(st) and temps[i] > temps[st.peek()]:",
            "            prev ← st.pop()",
            "            ans[prev] ← i - prev",
            "        st.push(i)",
            "    return ans",
          ],
          activeLines: [4, 5, 6, 7],
          output: "[73, 74, 75, 71, 69, 72] -> [1, 1, 0, 2, 1, 0]",
        },
      ],
    },
    walkthrough: {
      title: "Trace Daily Temperatures on [73, 74, 75, 71, 69, 72]",
      layout: "visual-first",
      steps: [
        {
          title: "i = 0 (73): push index 0 onto empty monotonic stack",
          tag: "CONCEPT",
          explanation: [
            "Initialize `ans ← [0, 0, 0, 0, 0, 0]` and empty stack `st`. At `i = 0` (`73`), `st` is empty so nothing resolves.",
            "Push index `0` onto `st = [0]` to wait for a warmer future temperature.",
          ],
          code: [
            "function daily_temperatures(temps):",
            "    ans ← array of len(temps) zeros; st ← []",
            "    for i from 0 to len(temps) - 1:",
            "        while st not empty and temps[i] > temps[st.peek()]:",
            "            prev ← st.pop(); ans[prev] ← i - prev",
            "        st.push(i)",
            "    return ans",
          ],
          activeLines: [2, 3, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "0 (73)" },
            { name: "st (indices)", value: "[0]", changed: true },
            { name: "ans", value: "[0, 0, 0, 0, 0, 0]" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "temps[]",
                cells: [
                  { id: "d0", value: "73", index: 0, state: "active" },
                  { id: "d1", value: "74", index: 1 },
                  { id: "d2", value: "75", index: 2 },
                  { id: "d3", value: "71", index: 3 },
                  { id: "d4", value: "69", index: 4 },
                  { id: "d5", value: "72", index: 5 },
                ],
                pointers: [{ index: 0, label: "i", tone: "coral" }],
              },
              {
                label: "ans[] (days waited)",
                cells: [
                  { id: "a0", value: "0", index: 0 },
                  { id: "a1", value: "0", index: 1 },
                  { id: "a2", value: "0", index: 2 },
                  { id: "a3", value: "0", index: 3 },
                  { id: "a4", value: "0", index: 4 },
                  { id: "a5", value: "0", index: 5 },
                ],
              },
            ],
            caption: "Stack holds waiting indices [0]; warmer days resolve them on arrival.",
          },
        },
        {
          title: "i = 1 (74): pops 0 (ans[0] = 1), then i = 2 (75) pops 1 (ans[1] = 1)",
          tag: "TRACE",
          explanation: [
            "At `i = 1` (`74 > 73`), `while` pops `0`, writes `ans[0] = 1 - 0 = 1`, and pushes `1`.",
            "At `i = 2` (`75 > 74`), `while` pops `1`, writes `ans[1] = 2 - 1 = 1`, and pushes `2` (`st = [2]`).",
          ],
          code: [
            "function daily_temperatures(temps):",
            "    ans ← array of len(temps) zeros; st ← []",
            "    for i from 0 to len(temps) - 1:",
            "        while st not empty and temps[i] > temps[st.peek()]:",
            "            prev ← st.pop(); ans[prev] ← i - prev",
            "        st.push(i)",
            "    return ans",
          ],
          activeLines: [4, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "2 (75)", changed: true },
            { name: "st (indices)", value: "[2] (75)", changed: true },
            { name: "ans", value: "[1, 1, 0, 0, 0, 0]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "temps[]",
                cells: [
                  { id: "d0", value: "73", index: 0, state: "done" },
                  { id: "d1", value: "74", index: 1, state: "done" },
                  { id: "d2", value: "75", index: 2, state: "active" },
                  { id: "d3", value: "71", index: 3 },
                  { id: "d4", value: "69", index: 4 },
                  { id: "d5", value: "72", index: 5 },
                ],
                pointers: [{ index: 2, label: "i", tone: "coral" }],
              },
              {
                label: "ans[] (days waited)",
                cells: [
                  { id: "a0", value: "1", index: 0, state: "done" },
                  { id: "a1", value: "1", index: 1, state: "done" },
                  { id: "a2", value: "0", index: 2 },
                  { id: "a3", value: "0", index: 3 },
                  { id: "a4", value: "0", index: 4 },
                  { id: "a5", value: "0", index: 5 },
                ],
              },
            ],
            caption: "Indices 0 and 1 popped and recorded 1 day; index 2 (75) now waits on top of st.",
          },
        },
        {
          title: "i = 3 (71) and i = 4 (69): cooler days stack without popping",
          tag: "TRACE",
          explanation: [
            "At `i = 3` (`71 <= 75`) and `i = 4` (`69 <= 71`), the `while` condition fails so nothing pops.",
            "Both push in strict decreasing temperature order: `st = [2 (75), 3 (71), 4 (69)]`.",
          ],
          code: [
            "function daily_temperatures(temps):",
            "    ans ← array of len(temps) zeros; st ← []",
            "    for i from 0 to len(temps) - 1:",
            "        while st not empty and temps[i] > temps[st.peek()]:",
            "            prev ← st.pop(); ans[prev] ← i - prev",
            "        st.push(i)",
            "    return ans",
          ],
          activeLines: [3, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "4 (69)", changed: true },
            { name: "st (indices)", value: "[2, 3, 4] (75>71>69)", changed: true },
            { name: "ans", value: "[1, 1, 0, 0, 0, 0]" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "temps[]",
                cells: [
                  { id: "d0", value: "73", index: 0, state: "done" },
                  { id: "d1", value: "74", index: 1, state: "done" },
                  { id: "d2", value: "75", index: 2, state: "pivot" },
                  { id: "d3", value: "71", index: 3, state: "pivot" },
                  { id: "d4", value: "69", index: 4, state: "active" },
                  { id: "d5", value: "72", index: 5 },
                ],
                pointers: [{ index: 4, label: "i", tone: "coral" }],
              },
              {
                label: "ans[] (days waited)",
                cells: [
                  { id: "a0", value: "1", index: 0, state: "done" },
                  { id: "a1", value: "1", index: 1, state: "done" },
                  { id: "a2", value: "0", index: 2 },
                  { id: "a3", value: "0", index: 3 },
                  { id: "a4", value: "0", index: 4 },
                  { id: "a5", value: "0", index: 5 },
                ],
              },
            ],
            caption: "Indices [2, 3, 4] hold decreasing temps [75, 71, 69] waiting for a warmer day.",
          },
        },
        {
          title: "i = 5 (72): pops 4 (69) and 3 (71), stops at 2 (75)",
          tag: "PATTERN",
          explanation: [
            "At `i = 5` (`72 > 69`), pop `4` (`ans[4] = 5 - 4 = 1`). Next `72 > 71`, pop `3` (`ans[3] = 5 - 3 = 2`).",
            "Against `2` (`75 > 72`), `while` stops! Push `5`, leaving `st = [2, 5]`.",
          ],
          code: [
            "function daily_temperatures(temps):",
            "    ans ← array of len(temps) zeros; st ← []",
            "    for i from 0 to len(temps) - 1:",
            "        while st not empty and temps[i] > temps[st.peek()]:",
            "            prev ← st.pop(); ans[prev] ← i - prev",
            "        st.push(i)",
            "    return ans",
          ],
          activeLines: [4, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "5 (72)", changed: true },
            { name: "st (indices)", value: "[2, 5]", changed: true },
            { name: "ans", value: "[1, 1, 0, 2, 1, 0]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "temps[]",
                cells: [
                  { id: "d0", value: "73", index: 0, state: "done" },
                  { id: "d1", value: "74", index: 1, state: "done" },
                  { id: "d2", value: "75", index: 2, state: "pivot" },
                  { id: "d3", value: "71", index: 3, state: "done" },
                  { id: "d4", value: "69", index: 4, state: "done" },
                  { id: "d5", value: "72", index: 5, state: "active" },
                ],
                pointers: [{ index: 5, label: "i", tone: "coral" }],
              },
              {
                label: "ans[] (days waited)",
                cells: [
                  { id: "a0", value: "1", index: 0, state: "done" },
                  { id: "a1", value: "1", index: 1, state: "done" },
                  { id: "a2", value: "0", index: 2 },
                  { id: "a3", value: "2", index: 3, state: "active" },
                  { id: "a4", value: "1", index: 4, state: "active" },
                  { id: "a5", value: "0", index: 5 },
                ],
              },
            ],
            caption: "Day 5 (72) resolves both 4 (1 day) and 3 (2 days) in one while loop, stopping at 75.",
          },
        },
        {
          title: "Loop ends: remaining indices [2, 5] keep default 0",
          tag: "CHECK",
          explanation: [
            "Indices `2` (`75`) and `5` (`72`) never saw a warmer day later in the array.",
            "Because `ans` was prefilled with `0`s, `return ans` yields `[1, 1, 0, 2, 1, 0]` in `O(n)` total time.",
          ],
          code: [
            "function daily_temperatures(temps):",
            "    ans ← array of len(temps) zeros; st ← []",
            "    for i from 0 to len(temps) - 1:",
            "        while st not empty and temps[i] > temps[st.peek()]:",
            "            prev ← st.pop(); ans[prev] ← i - prev",
            "        st.push(i)",
            "    return ans",
          ],
          activeLines: [7],
          codeLabel: "Pseudocode",
          state: [
            { name: "ans", value: "[1, 1, 0, 2, 1, 0]" },
            { name: "Total pushes/pops", value: "6 pushes, 4 pops (O(n))" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "temps[]",
                cells: [
                  { id: "d0", value: "73", index: 0, state: "done" },
                  { id: "d1", value: "74", index: 1, state: "done" },
                  { id: "d2", value: "75", index: 2, state: "dim" },
                  { id: "d3", value: "71", index: 3, state: "done" },
                  { id: "d4", value: "69", index: 4, state: "done" },
                  { id: "d5", value: "72", index: 5, state: "dim" },
                ],
              },
              {
                label: "Final ans[] array",
                cells: [
                  { id: "a0", value: "1", index: 0, state: "done" },
                  { id: "a1", value: "1", index: 1, state: "done" },
                  { id: "a2", value: "0", index: 2, state: "dim" },
                  { id: "a3", value: "2", index: 3, state: "done" },
                  { id: "a4", value: "1", index: 4, state: "done" },
                  { id: "a5", value: "0", index: 5, state: "dim" },
                ],
              },
            ],
            caption: "Every index pushed once and popped at most once guarantees O(n) total work.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Pushing values instead of indices onto the monotonic stack",
        detail:
          "Storing values loses distance information (`i - prev_idx`) and breaks when duplicate values appear. Push indices and look up `nums[idx]` whenever comparing.",
      },
      {
        title: "Using >= instead of > for strictly greater problems",
        detail:
          "If `temps[i] == temps[st.peek()]`, the temperature is not strictly warmer. Using `>=` would wrongly assign a wait count to an equal-temperature day.",
      },
      {
        title: "Wrong left boundary in Largest Rectangle in Histogram",
        detail:
          "When popping `mid`, the left boundary is the element still underneath `mid` (`st.peek()` after popping `mid`), not `mid - 1`. Neighboring bars popped earlier might have been taller and already merged into `mid`'s rectangle.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does this buggy daily_temperatures return on temps = [70, 70, 75]?",
        code: "ans ← [0, 0, 0]; st ← []\nfor i from 0 to len(temps) - 1:\n    while not is_empty(st) and temps[i] >= temps[st.peek()]:\n        prev ← st.pop()\n        ans[prev] ← i - prev\n    st.push(i)\nreturn ans",
        options: [
          { id: "a", label: "[2, 1, 0]" },
          { id: "b", label: "[1, 1, 0] (equal temperature 70 wrongly pops index 0)" },
          { id: "c", label: "[0, 1, 0]" },
          { id: "d", label: "[2, 0, 0]" },
        ],
        correctId: "b",
        explanation: "Using >= treats an equal 70-degree day as strictly warmer, so day 1 pops day 0 with wait 1 instead of letting day 0 wait until day 2 (wait 2).",
      },
      {
        prompt: "What does this buggy histogram-area code return for heights = [1, 5, 3, 1]?",
        code: "st ← []; best ← 0\nfor i from 0 to len(heights):\n    cur_h ← 0 if i == len(heights) else heights[i]\n    while not is_empty(st) and cur_h < heights[st.peek()]:\n        mid ← st.pop()\n        width ← i - mid\n        best ← max(best, heights[mid] * width)\n    st.push(i)\nreturn best",
        options: [
          { id: "a", label: "6 (finds the 3 x 2 rectangle across indices 1 and 2)" },
          { id: "b", label: "4 (only counts the base height 1 across all 4 bars)" },
          { id: "c", label: "3 (loses bar 1)" },
          { id: "d", label: "5 (width = i - mid misses bar 1 when popping bar 2, giving 3 x 1 instead of 3 x 2)" },
        ],
        correctId: "d",
        explanation: "Because taller bar 1 was popped earlier, bar 2's rectangle of height 3 extends left to st.peek() + 1 = 1 (width i - st.peek() - 1 = 2, area 6), not i - mid = 1.",
      },
    ],
    practiceTask: {
      title: "Days Until a Warmer Temperature",
      tier: "Warmup",
      goal: "Given an integer array `temps`, return an array `ans` where `ans[i]` is how many days you must wait after day `i` to get a strictly warmer temperature, or `0` if no warmer day exists later.",
      constraints: ["1 <= len(temps) <= 10^5", "30 <= temps[i] <= 100", "Target: O(n) time, O(n) space"],
      examples: [
        { input: "temps = [73, 74, 75, 71, 69, 72, 76, 73]", output: "[1, 1, 4, 2, 1, 1, 0, 0]" },
        { input: "temps = [30, 40, 50]", output: "[1, 1, 0]" },
      ],
      tasks: [
        "Initialize `ans` with `n` zeros and an empty stack `st`.",
        "For each `i`, pop indices while `temps[i] > temps[st.peek()]`, writing `ans[prev] = i - prev`, then push `i`.",
      ],
      starterCode: "function daily_temperatures(temps):\n    // TODO: compute wait days in O(n) using a monotonic stack",
      expectedOutput: "[1, 1, 4, 2, 1, 1, 0, 0]\n[1, 1, 0]",
      hint: "Keep indices on the stack in non-increasing temperature order so each warmer arrival pops all cooler days waiting at the top.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "function daily_temperatures(temps):\n    n ← len(temps)\n    ans ← array of n zeros\n    st ← []\n    for i from 0 to n - 1:\n        while not is_empty(st) and temps[i] > temps[st.peek()]:\n            prev ← st.pop()\n            ans[prev] ← i - prev\n        st.push(i)\n    return ans",
    },
    practiceChallenges: [
      {
        title: "Days Until a Warmer Temperature",
        tier: "Warmup",
        goal: "Compute for each day `i` the number of days until a strictly warmer temperature, or `0` if none.",
        constraints: ["1 <= len(temps) <= 10^5", "Target: O(n) time, O(n) space"],
        examples: [
          { input: "temps = [73, 74, 75, 71, 69, 72, 76, 73]", output: "[1, 1, 4, 2, 1, 1, 0, 0]" },
          { input: "temps = [80, 75, 70]", output: "[0, 0, 0]", explanation: "Strictly cooling days never trigger pops, keeping all waits at 0." },
        ],
        tasks: [
          "Maintain a decreasing stack of unresolved day indices.",
          "Pop and fill `ans[prev] = i - prev` whenever `temps[i] > temps[st.peek()]`.",
        ],
        starterCode: "function daily_temperatures(temps):\n    // TODO: monotonic decreasing stack",
        expectedOutput: "[1, 1, 4, 2, 1, 1, 0, 0]\n[0, 0, 0]",
        hint: "Initialize `ans` to zeros so days still on the stack at the end automatically stay `0`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function daily_temperatures(temps):\n    n ← len(temps)\n    ans ← array of n zeros\n    st ← []\n    for i from 0 to n - 1:\n        while not is_empty(st) and temps[i] > temps[st.peek()]:\n            prev ← st.pop()\n            ans[prev] ← i - prev\n        st.push(i)\n    return ans",
      },
      {
        title: "Next Greater Element Across Array",
        tier: "Core",
        goal: "Given two distinct-value arrays `nums1` (a subset of `nums2`) and `nums2`, return for each `x` in `nums1` the first greater element to the right of `x` in `nums2`, or `-1` if none exists.",
        constraints: ["1 <= len(nums1) <= len(nums2) <= 10^4", "All values in each array are unique", "Target: O(len(nums1) + len(nums2)) time"],
        examples: [
          { input: "nums1 = [4, 1, 2], nums2 = [1, 3, 4, 2]", output: "[-1, 3, -1]" },
          { input: "nums1 = [2, 4], nums2 = [1, 2, 3, 4]", output: "[3, -1]" },
        ],
        tasks: [
          "Scan `nums2` with a decreasing stack and record `next_greater[popped_val] = cur_val` in an M06 Hash Map.",
          "Look up each value in `nums1` in `next_greater` (defaulting to `-1`).",
        ],
        starterCode: "function next_greater_element(nums1, nums2):\n    // TODO: precompute next greater for nums2 via monotonic stack + hash map",
        expectedOutput: "[-1, 3, -1]\n[3, -1]",
        hint: "Since values in `nums2` are unique, you can map `popped_value -> cur_value` directly in a hash map during one scan of `nums2`.",
        complexity: { time: "O(len(nums1) + len(nums2))", space: "O(len(nums2))" },
        solutionCode:
          "function next_greater_element(nums1, nums2):\n    next_map ← {}\n    st ← []\n    for x in nums2:\n        while not is_empty(st) and x > st.peek():\n            next_map[st.pop()] ← x\n        st.push(x)\n    res ← []\n    for x in nums1:\n        res.append(next_map[x] if x in next_map else -1)\n    return res",
      },
      {
        title: "Largest Rectangle in Histogram",
        tier: "Stretch",
        goal: "Given an array `heights` of non-negative bar heights (each of width `1`), return the area of the largest rectangle that fits inside the histogram.",
        constraints: ["1 <= len(heights) <= 10^5", "0 <= heights[i] <= 10^4", "Target: O(n) time, O(n) space"],
        examples: [
          { input: "heights = [2, 1, 5, 6, 2, 3]", output: "10" },
          { input: "heights = [2, 4]", output: "4" },
        ],
        tasks: [
          "Maintain an increasing stack of bar indices across `i = 0..n` (using sentinel height `0` at `i = n`).",
          "When `cur_h < heights[st.peek()]`, pop `h = heights[st.pop()]`, compute `width = i if is_empty(st) else i - st.peek() - 1`, and update `best`.",
        ],
        starterCode: "function largest_rectangle_area(heights):\n    // TODO: compute max histogram area in O(n)",
        expectedOutput: "10\n4",
        hint: "At `i = 4` (`height = 2`) in `[2, 1, 5, 6, 2, 3]`, bar `6` pops (`width = 1`, area `6`), then bar `5` pops with `st.peek() = 1` (`width = 4 - 1 - 1 = 2`, area `10`).",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function largest_rectangle_area(heights):\n    n ← len(heights)\n    st ← []\n    best ← 0\n    for i from 0 to n:\n        cur_h ← 0 if i == n else heights[i]\n        while not is_empty(st) and cur_h < heights[st.peek()]:\n            h ← heights[st.pop()]\n            width ← i if is_empty(st) else i - st.peek() - 1\n            best ← max(best, h * width)\n        st.push(i)\n    return best",
      },
    ],
  },

  "dsa-monotonic-queue": {
    lessonId: "dsa-monotonic-queue",
    subtitle:
      "Combine the M13-2 Deque with M08 Sliding Window boundaries: evict expired front indices and weaker back candidates to compute every k-window maximum in O(n) total time.",
    intro: {
      heading: "Monotonic Queue & Sliding Window Maximum",
      explanation: [
        "Rescanning all `k` items inside every sliding window to find its maximum costs `O(n * k)` time—on `n = 100,000` and `k = 10,000`, that is a billion comparisons. Unlike a rolling sum (`M08`), `max` has no inverse: when the largest element leaves the left edge, subtracting it does not reveal the second-largest item.",
        "Pairing the sliding window with a **monotonic decreasing Deque** (`M13-2`) brings total time down to `O(n)`. Discarding out-of-range front indices (`<= i - k`) and popping dominated back candidates (`<= nums[i]`) guarantees `dq.front()` always holds the current window's maximum index.",
      ],
      analogy:
        "In a rolling 3-minute camera frame tracking marathoners, if a faster runner enters the frame now, any slower runner already inside the frame can never win a medal in this frame or any future frame, so they immediately drop out of contention; meanwhile, the leader drops out once they run past the left edge of the camera.",
      realWorldUses: [
        "Tracking rolling peak latency, CPU spikes, or bandwidth maxima over fixed time windows in telemetry streams",
        "Speeding up constrained window-best DP recurrences (`M20` and `M21`) from O(n * k) down to O(n)",
      ],
    },
    sections: [
      {
        heading: "Two eviction rules: expired front and dominated back",
        paragraphs: [
          "Store **indices** in a Deque `dq` so values stay monotonically decreasing from front to back (`nums[dq[0]] > nums[dq[1]] > ...`). Compare storing raw values vs indices on `[5, 3, 5], k = 2`: a value-only deque holds `[5, 3]` then pops `3` and `5` at `i = 2`, yet if the input were `[5, 3, 2], k = 2`, seeing `dq.front() == 5` does not tell you whether `5` sat at expired index `0` or active index `1`. Storing indices makes `dq.front() <= i - k` unambiguous.",
          "At each step `i` from `0` to `n - 1`, enforce two invariants in order: first expire the front (`if dq` non-empty and `dq.front() <= i - k`, call `dq.pop_front()`), then pop weaker back candidates (`while dq` non-empty and `nums[dq.back()] <= nums[i]`, call `dq.pop_back()`), then push `i` and record `nums[dq.front()]` once `i >= k - 1`.",
        ],
        code: [
          "function max_sliding_window(nums, k):",
          "    dq ← empty Deque    // stores indices with strictly decreasing nums[idx]",
          "    res ← []",
          "    for i from 0 to len(nums) - 1:",
          "        if not is_empty(dq) and dq.front() <= i - k:",
          "            dq.pop_front()    // expired outside [i - k + 1, i]",
          "        while not is_empty(dq) and nums[dq.back()] <= nums[i]:",
          "            dq.pop_back()     // dominated by newer, >= candidate",
          "        dq.push_back(i)",
          "        if i >= k - 1:",
          "            res.append(nums[dq.front()])",
          "    return res",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Comparing Sliding Window Maximum approaches",
          headers: ["Approach", "Time complexity", "Extra space", "Why it behaves that way"],
          rows: [
            ["Rescan each window of size k", "O(n * k)", "O(1)", "Re-examines up to k elements at every step"],
            ["Monotonic Deque (indices)", "O(n)", "O(k)", "Each index is pushed once and popped (front or back) at most once"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "KEY IDEA",
          text: "A deque is required instead of a plain queue or stack because you need `pop_back()` to evict dominated smaller elements and `pop_front()` to expire old indices that slide past `i - k`.",
        },
      },
      {
        heading: "Why O(n) holds and how to adapt for Window Minimum",
        paragraphs: [
          "Just like a monotonic stack, every index `0..n-1` is pushed via `dq.push_back(i)` once and removed at most once (either by `pop_front` when it expires or `pop_back` when a larger newcomer arrives). At most `2n` deque operations occur across the whole array, giving strict `O(n)` time and `O(k)` deque space.",
          "Switching from **Sliding Window Maximum** to **Sliding Window Minimum** requires changing only a single comparison: flip `nums[dq.back()] <= nums[i]` to `nums[dq.back()] >= nums[i]` so the deque maintains increasing values with the smallest element at `dq.front()`.",
        ],
        code: [
          "// Minimum variation: change only the back-eviction comparison",
          "while not is_empty(dq) and nums[dq.back()] >= nums[i]:",
          "    dq.pop_back()",
        ],
        codeLabel: "Pseudocode",
        callout: {
          kind: "RULE OF THUMB",
          text: "Only record `nums[dq.front()]` once `i >= k - 1` (after the first full window `[0..k-1]` is formed), and always check `dq.front() <= i - k` before pushing or reading.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From O(n * k) Window Rescans to an O(n) Monotonic Deque",
      steps: [
        {
          label: "Step 1: Rescan each k-window (O(n * k))",
          explanation: "Taking `max` over `[i - k + 1 .. i]` from scratch re-reads `k` elements on every step.",
          code: [
            "function max_window_naive(nums, k):",
            "    res ← []",
            "    for i from k - 1 to len(nums) - 1:",
            "        res.append(max(nums[i - k + 1 .. i]))",
            "    return res",
          ],
          activeLines: [4],
          output: "n=100k, k=10k -> 10^9 comparisons",
        },
        {
          label: "Step 2: Monotonic decreasing deque without front expiration",
          explanation: "Evicting weaker back items keeps candidates decreasing, yet forgetting `dq.front() <= i - k` leaves stale maxima.",
          code: [
            "function max_window_no_expire(nums, k):",
            "    dq ← Deque(); res ← []",
            "    for i from 0 to len(nums) - 1:",
            "        while not is_empty(dq) and nums[dq.back()] <= nums[i]:",
            "            dq.pop_back()",
            "        dq.push_back(i)",
            "        if i >= k - 1: res.append(nums[dq.front()])",
            "    return res",
          ],
          activeLines: [4, 7],
          output: "Stale max at index 0 pollutes later windows!",
        },
        {
          label: "Step 3: Complete O(n) monotonic deque with front expiration",
          explanation: "Expire `dq.front() <= i - k` before pushing `i` so `dq.front()` is always inside the active window.",
          code: [
            "function max_sliding_window(nums, k):",
            "    dq ← Deque(); res ← []",
            "    for i from 0 to len(nums) - 1:",
            "        if not is_empty(dq) and dq.front() <= i - k: dq.pop_front()",
            "        while not is_empty(dq) and nums[dq.back()] <= nums[i]: dq.pop_back()",
            "        dq.push_back(i)",
            "        if i >= k - 1: res.append(nums[dq.front()])",
            "    return res",
          ],
          activeLines: [4, 5, 7],
          output: "[1, 3, -1, -3, 5, 3], k=3 -> [3, 3, 5, 5]",
        },
      ],
    },
    walkthrough: {
      title: "Trace max_sliding_window([1, 3, -1, -3, 5, 3], k = 3)",
      layout: "visual-first",
      steps: [
        {
          title: "i = 0..1: 3 dominates and evicts 1 from deque back",
          tag: "CONCEPT",
          explanation: [
            "At `i = 0`, `dq = [0 (1)]`. At `i = 1`, `nums[1] = 3 >= nums[0] = 1`, so `idx 0` is popped from back and `dq = [1 (3)]`.",
            "Because `i < k - 1 = 2`, the first 3-item window is not full yet (`res = []`).",
          ],
          code: [
            "function max_sliding_window(nums, k):",
            "    dq ← Deque(); res ← []",
            "    for i from 0 to len(nums) - 1:",
            "        if dq not empty and dq.front() <= i - k: dq.pop_front()",
            "        while dq not empty and nums[dq.back()] <= nums[i]: dq.pop_back()",
            "        dq.push_back(i)",
            "        if i >= k - 1: res.append(nums[dq.front()])",
            "    return res",
          ],
          activeLines: [5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "i", value: "1 (val=3)", changed: true },
            { name: "dq (indices)", value: "[1 (3)]", changed: true },
            { name: "res", value: "[]" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "nums[] (k = 3)",
                cells: [
                  { id: "m0", value: "1", index: 0, state: "dim" },
                  { id: "m1", value: "3", index: 1, state: "active" },
                  { id: "m2", value: "-1", index: 2 },
                  { id: "m3", value: "-3", index: 3 },
                  { id: "m4", value: "5", index: 4 },
                  { id: "m5", value: "3", index: 5 },
                ],
                pointers: [{ index: 1, label: "i", tone: "coral" }],
                highlightRange: [0, 1],
              },
            ],
            caption: "Index 0 (1) can never beat index 1 (3) in any window containing both, so it is dropped immediately.",
          },
        },
        {
          title: "i = 2 (-1): window [0..2] completes, records max = 3",
          tag: "TRACE",
          explanation: [
            "`-1 < 3`, so index `2` joins behind `1` (`dq = [1 (3), 2 (-1)]`) as backup in case `3` expires later.",
            "Now `i = 2 >= k - 1`, so `res` records `nums[dq.front()] = nums[1] = 3`.",
          ],
          code: [
            "function max_sliding_window(nums, k):",
            "    dq ← Deque(); res ← []",
            "    for i from 0 to len(nums) - 1:",
            "        if dq not empty and dq.front() <= i - k: dq.pop_front()",
            "        while dq not empty and nums[dq.back()] <= nums[i]: dq.pop_back()",
            "        dq.push_back(i)",
            "        if i >= k - 1: res.append(nums[dq.front()])",
            "    return res",
          ],
          activeLines: [6, 7],
          codeLabel: "Pseudocode",
          state: [
            { name: "Window", value: "[0..2] = [1, 3, -1]" },
            { name: "dq (indices)", value: "[1 (3), 2 (-1)]", changed: true },
            { name: "res", value: "[3]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Window [0..2] · front=idx 1 (3)",
                cells: [
                  { id: "m0", value: "1", index: 0, state: "dim" },
                  { id: "m1", value: "3", index: 1, state: "done" },
                  { id: "m2", value: "-1", index: 2, state: "active" },
                  { id: "m3", value: "-3", index: 3 },
                  { id: "m4", value: "5", index: 4 },
                  { id: "m5", value: "3", index: 5 },
                ],
                pointers: [
                  { index: 0, label: "L", tone: "accent" },
                  { index: 2, label: "R", tone: "coral" },
                ],
                highlightRange: [0, 2],
              },
            ],
            caption: "First full 3-item window [0..2] outputs front = 3.",
          },
        },
        {
          title: "i = 3 (-3): window [1..3] keeps 3 at front, res = [3, 3]",
          tag: "TRACE",
          explanation: [
            "`dq.front() = 1 > 3 - 3 = 0`, so `idx 1` (`3`) is still inside window `[1..3]`.",
            "`-3 < -1`, so `idx 3` appends behind `2` (`dq = [1, 2, 3]`) and `res` records `3`.",
          ],
          code: [
            "function max_sliding_window(nums, k):",
            "    dq ← Deque(); res ← []",
            "    for i from 0 to len(nums) - 1:",
            "        if dq not empty and dq.front() <= i - k: dq.pop_front()",
            "        while dq not empty and nums[dq.back()] <= nums[i]: dq.pop_back()",
            "        dq.push_back(i)",
            "        if i >= k - 1: res.append(nums[dq.front()])",
            "    return res",
          ],
          activeLines: [4, 6, 7],
          codeLabel: "Pseudocode",
          state: [
            { name: "Window", value: "[1..3] = [3, -1, -3]" },
            { name: "dq (indices)", value: "[1, 2, 3]", changed: true },
            { name: "res", value: "[3, 3]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Window [1..3] · front=idx 1 (3)",
                cells: [
                  { id: "m0", value: "1", index: 0, state: "dim" },
                  { id: "m1", value: "3", index: 1, state: "done" },
                  { id: "m2", value: "-1", index: 2, state: "pivot" },
                  { id: "m3", value: "-3", index: 3, state: "active" },
                  { id: "m4", value: "5", index: 4 },
                  { id: "m5", value: "3", index: 5 },
                ],
                pointers: [
                  { index: 1, label: "L", tone: "accent" },
                  { index: 3, label: "R", tone: "coral" },
                ],
                highlightRange: [1, 3],
              },
            ],
            caption: "Candidates [1, 2, 3] hold decreasing values 3 > -1 > -3 inside window [1..3].",
          },
        },
        {
          title: "i = 4 (5): front idx 1 expires, 5 evicts 3 and 2 from back",
          tag: "PATTERN",
          explanation: [
            "`dq.front() = 1 <= 4 - 3 = 1`, so `idx 1` expires via `pop_front()`!",
            "`nums[4] = 5` dominates `-3` (`3`) and `-1` (`2`), flushing both from the back. `dq` becomes `[4 (5)]`, recording `res = [3, 3, 5]`.",
          ],
          code: [
            "function max_sliding_window(nums, k):",
            "    dq ← Deque(); res ← []",
            "    for i from 0 to len(nums) - 1:",
            "        if dq not empty and dq.front() <= i - k: dq.pop_front()",
            "        while dq not empty and nums[dq.back()] <= nums[i]: dq.pop_back()",
            "        dq.push_back(i)",
            "        if i >= k - 1: res.append(nums[dq.front()])",
            "    return res",
          ],
          activeLines: [4, 5, 6, 7],
          codeLabel: "Pseudocode",
          state: [
            { name: "Window", value: "[2..4] = [-1, -3, 5]" },
            { name: "dq (indices)", value: "[4 (5)]", changed: true },
            { name: "res", value: "[3, 3, 5]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Window [2..4] · front=idx 4 (5)",
                cells: [
                  { id: "m0", value: "1", index: 0, state: "dim" },
                  { id: "m1", value: "3", index: 1, state: "dim" },
                  { id: "m2", value: "-1", index: 2, state: "dim" },
                  { id: "m3", value: "-3", index: 3, state: "dim" },
                  { id: "m4", value: "5", index: 4, state: "active" },
                  { id: "m5", value: "3", index: 5 },
                ],
                pointers: [
                  { index: 2, label: "L", tone: "accent" },
                  { index: 4, label: "R", tone: "coral" },
                ],
                highlightRange: [2, 4],
              },
            ],
            caption: "Front drops expired idx 1; back drops dominated -3 and -1 before pushing idx 4 (5).",
          },
        },
        {
          title: "i = 5 (3): window [3..5] records final max = 5",
          tag: "CHECK",
          explanation: [
            "`dq.front() = 4 > 5 - 3 = 2`, so `5` remains valid. `3 < 5` joins behind `5` (`dq = [4, 5]`).",
            "`res` appends `5`, returning `[3, 3, 5, 5]` in `O(n)` total time.",
          ],
          code: [
            "function max_sliding_window(nums, k):",
            "    dq ← Deque(); res ← []",
            "    for i from 0 to len(nums) - 1:",
            "        if dq not empty and dq.front() <= i - k: dq.pop_front()",
            "        while dq not empty and nums[dq.back()] <= nums[i]: dq.pop_back()",
            "        dq.push_back(i)",
            "        if i >= k - 1: res.append(nums[dq.front()])",
            "    return res",
          ],
          activeLines: [7, 8],
          codeLabel: "Pseudocode",
          state: [
            { name: "Window", value: "[3..5] = [-3, 5, 3]" },
            { name: "dq (indices)", value: "[4, 5]", changed: true },
            { name: "res", value: "[3, 3, 5, 5]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Final window [3..5] · res = [3, 3, 5, 5]",
                cells: [
                  { id: "m0", value: "1", index: 0, state: "dim" },
                  { id: "m1", value: "3", index: 1, state: "dim" },
                  { id: "m2", value: "-1", index: 2, state: "dim" },
                  { id: "m3", value: "-3", index: 3 },
                  { id: "m4", value: "5", index: 4, state: "done" },
                  { id: "m5", value: "3", index: 5, state: "active" },
                ],
                pointers: [
                  { index: 3, label: "L", tone: "accent" },
                  { index: 5, label: "R", tone: "coral" },
                ],
                highlightRange: [3, 5],
              },
            ],
            caption: "Final output res = [3, 3, 5, 5], computed in one linear pass.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Storing values in the deque instead of indices",
        detail:
          "If you store values instead of indices, you cannot tell whether `dq.front()` has expired past `i - k`, especially when duplicate maximum values appear inside the window. Always store indices.",
      },
      {
        title: "Recording output before the first full window finishes",
        detail:
          "During indices `0` through `k - 2`, the window has fewer than `k` elements. Guard `res.append(nums[dq.front()])` with `if i >= k - 1`.",
      },
      {
        title: "Using < instead of <= when evicting the back",
        detail:
          "Using `<=` drops an older equal value so only the newer index remains; that keeps the deque compact and drops expired indices sooner without losing the true maximum.",
      },
    ],
    practiceTask: {
      title: "Maximum in Every Fixed Window",
      tier: "Warmup",
      goal: "Given an integer array `nums` and window width `k` (`1 <= k <= len(nums)`), return an array containing the maximum element of every contiguous subarray of size `k`.",
      constraints: ["1 <= k <= len(nums) <= 10^5", "-10^4 <= nums[i] <= 10^4", "Target: O(n) time, O(k) space"],
      examples: [
        { input: "nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3", output: "[3, 3, 5, 5, 6, 7]" },
        { input: "nums = [9, 11], k = 2", output: "[11]" },
      ],
      tasks: [
        "Pop `dq.front()` if `dq.front() <= i - k`.",
        "Pop `dq.back()` while `nums[dq.back()] <= nums[i]`, push `i` at back, and append `nums[dq.front()]` once `i >= k - 1`.",
      ],
      starterCode: "function max_sliding_window(nums, k):\n    // TODO: return each k-window maximum in O(n) time",
      expectedOutput: "[3, 3, 5, 5, 6, 7]\n[11]",
      hint: "Keep indices in `dq` ordered by strictly decreasing `nums[idx]` from front to back.",
      complexity: { time: "O(n)", space: "O(k)" },
      solutionCode:
        "function max_sliding_window(nums, k):\n    dq ← empty Deque\n    res ← []\n    for i from 0 to len(nums) - 1:\n        if not is_empty(dq) and dq.front() <= i - k:\n            dq.pop_front()\n        while not is_empty(dq) and nums[dq.back()] <= nums[i]:\n            dq.pop_back()\n        dq.push_back(i)\n        if i >= k - 1:\n            res.append(nums[dq.front()])\n    return res",
    },
    practiceChallenges: [
      {
        title: "Maximum in Every Fixed Window",
        tier: "Warmup",
        goal: "Return the maximum value inside every contiguous window of length `k` as it slides across `nums`.",
        constraints: ["1 <= k <= len(nums) <= 10^5", "Target: O(n) time, O(k) space"],
        examples: [
          { input: "nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3", output: "[3, 3, 5, 5, 6, 7]" },
          { input: "nums = [9, -2, 4], k = 1", output: "[9, -2, 4]", explanation: "With k = 1, every incoming element immediately expires older front entries." },
        ],
        tasks: [
          "Evict expired front index (`<= i - k`) and smaller-or-equal back indices.",
          "Collect `nums[dq.front()]` for every `i >= k - 1`.",
        ],
        starterCode: "function max_sliding_window(nums, k):\n    // TODO: monotonic decreasing deque",
        expectedOutput: "[3, 3, 5, 5, 6, 7]\n[9, -2, 4]",
        hint: "Store indices rather than values so expiration checks `dq.front() <= i - k` take `O(1)`.",
        complexity: { time: "O(n)", space: "O(k)" },
        solutionCode:
          "function max_sliding_window(nums, k):\n    dq ← empty Deque\n    res ← []\n    for i from 0 to len(nums) - 1:\n        if not is_empty(dq) and dq.front() <= i - k:\n            dq.pop_front()\n        while not is_empty(dq) and nums[dq.back()] <= nums[i]:\n            dq.pop_back()\n        dq.push_back(i)\n        if i >= k - 1:\n            res.append(nums[dq.front()])\n    return res",
      },
      {
        title: "Longest Subarray With Bounded Spread",
        tier: "Core",
        goal: "Given an integer array `nums` and non-negative integer `limit`, return the length of the longest contiguous subarray where `max(subarray) - min(subarray) <= limit`.",
        constraints: ["1 <= len(nums) <= 10^5", "0 <= limit <= 10^9", "Target: O(n) time, O(n) space"],
        examples: [
          { input: "nums = [8, 2, 4, 7], limit = 4", output: "2" },
          { input: "nums = [10, 1, 2, 4, 7, 2], limit = 5", output: "4" },
        ],
        tasks: [
          "Maintain two monotonic deques of indices as `right` expands: `max_dq` (decreasing) and `min_dq` (increasing).",
          "While `nums[max_dq.front()] - nums[min_dq.front()] > limit`, increment `left` and pop whichever deque front equals `left - 1`.",
        ],
        starterCode: "function longest_bounded_subarray(nums, limit):\n    // TODO: track window max and min in O(n) with two monotonic deques",
        expectedOutput: "2\n4",
        hint: "Unlike fixed-size windows, here `left` moves dynamically only when `nums[max_dq.front()] - nums[min_dq.front()] > limit`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function longest_bounded_subarray(nums, limit):\n    max_dq ← empty Deque\n    min_dq ← empty Deque\n    left ← 0; best ← 0\n    for right from 0 to len(nums) - 1:\n        while not is_empty(max_dq) and nums[max_dq.back()] <= nums[right]:\n            max_dq.pop_back()\n        while not is_empty(min_dq) and nums[min_dq.back()] >= nums[right]:\n            min_dq.pop_back()\n        max_dq.push_back(right)\n        min_dq.push_back(right)\n        while nums[max_dq.front()] - nums[min_dq.front()] > limit:\n            left ← left + 1\n            if max_dq.front() < left: max_dq.pop_front()\n            if min_dq.front() < left: min_dq.pop_front()\n        best ← max(best, right - left + 1)\n    return best",
      },
      {
        title: "Maximum Sum Subarray With Length at Most K",
        tier: "Stretch",
        goal: "Given an integer array `nums` (which may include negatives) and `k >= 1`, return the maximum sum of any non-empty contiguous subarray of length at most `k`.",
        constraints: ["1 <= k <= len(nums) <= 10^5", "-10^4 <= nums[i] <= 10^4", "Target: O(n) time, O(n) space"],
        examples: [
          { input: "nums = [2, -1, 3, -5, 4], k = 2", output: "4" },
          { input: "nums = [-3, -1, -2], k = 2", output: "-1" },
        ],
        tasks: [
          "Build prefix sums `pref[0] = 0`, `pref[i] = pref[i - 1] + nums[i - 1]` (`M03`), so subarray `[j..i-1]` has sum `pref[i] - pref[j]`.",
          "Use an increasing deque of prefix indices `j` (keeping `j >= i - k`) so `pref[dq.front()]` is the smallest valid prefix to subtract from `pref[i]`.",
        ],
        starterCode: "function max_subarray_at_most_k(nums, k):\n    // TODO: prefix sums + monotonic increasing deque in O(n)",
        expectedOutput: "4\n-1",
        hint: "Before pushing prefix index `i`, expire `dq.front() < i - k`, update `best = max(best, pref[i] - pref[dq.front()])`, then pop back indices where `pref[dq.back()] >= pref[i]`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "function max_subarray_at_most_k(nums, k):\n    n ← len(nums)\n    pref ← array of n + 1 zeros\n    for i from 0 to n - 1:\n        pref[i + 1] ← pref[i] + nums[i]\n    dq ← empty Deque\n    dq.push_back(0)\n    best ← nums[0]\n    for i from 1 to n:\n        while not is_empty(dq) and dq.front() < i - k:\n            dq.pop_front()\n        best ← max(best, pref[i] - pref[dq.front()])\n        while not is_empty(dq) and pref[dq.back()] >= pref[i]:\n            dq.pop_back()\n        dq.push_back(i)\n    return best",
      },
    ],
  },
};

export const dsaM13PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m13",
  title: "Module 13 Practice Set: Stacks & Queues",
  description:
    "Four mixed problems covering LIFO simplification, rolling buffer timing, linear-time neighbor visibility, and rolling window extrema.",
  problems: [
    {
      id: "dsa-m13-p1",
      title: "Simplify Unix File Path",
      patternHint: "Split the path on '/' and process segments in LIFO order: skip '.' and empty segments, pop on '..', and push normal directory names.",
      lessonRefId: "dsa-stack-basics",
      goal: "Given an absolute Unix-style path string `path`, return its canonical simplified path starting with `/` (no trailing slash unless root `/`, collapsing `//`, `.`, and resolving `..` up one directory).",
      constraints: ["1 <= len(path) <= 3000", "Path starts with '/'", "Target: O(n) time, O(n) space"],
      examples: [
        { input: "path = \"/home//foo/../bar/.\"", output: "/home/bar" },
        { input: "path = \"/../\"", output: "/" },
      ],
      tasks: [
        "Split `path` by `/`.",
        "Ignore `\"\"` and `\".\"`, pop from the directory stack on `\"..\"` if non-empty, and push directory names otherwise.",
        "Join remaining segments with `/` prefixed by `/`.",
      ],
      starterCode: "function simplify_path(path):\n    // TODO: return canonical Unix path",
      expectedOutput: "/home/bar\n/",
      hint: "Popping on `\"..\"` when the stack is already empty should be a safe no-op, keeping you at `/`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "function simplify_path(path):\n    st ← []\n    for part in split(path, '/'):\n        if part == \"\" or part == \".\":\n            continue\n        else if part == \"..\":\n            if not is_empty(st):\n                st.pop()\n        else:\n            st.push(part)\n    return \"/\" + join(st, \"/\")",
    },
    {
      id: "dsa-m13-p2",
      title: "Recent Request Rate Window",
      patternHint: "Keep arriving timestamps in FIFO order and evict front entries older than t - 3000 in amortized O(1) per ping.",
      lessonRefId: "dsa-queue-deque",
      goal: "Design `RecentCounter` with `ping(t)` that records a request at strictly increasing millisecond `t` and returns how many requests arrived in the inclusive range `[t - 3000, t]`.",
      constraints: ["1 <= t <= 10^9", "t strictly increases across calls", "Up to 10^4 calls", "Target: O(1) amortized per ping"],
      examples: [
        { input: "ping(1), ping(100), ping(3001), ping(3002)", output: "1, 2, 3, 3" },
        { input: "ping(1), ping(3002), ping(6005)", output: "1, 1, 1", explanation: "Each gap exceeds 3000 ms, so the previous request is dequeued before counting." },
      ],
      tasks: [
        "Enqueue `t` at the back of an internal FIFO queue.",
        "While `q.front() < t - 3000`, dequeue from the front.",
        "Return the current queue size.",
      ],
      starterCode:
        "class RecentCounter:\n    init():\n        // TODO: initialize FIFO queue\n    function ping(t):\n        // TODO: record t and return count in [t - 3000, t]",
      expectedOutput: "1, 2, 3, 3\n1, 1, 1",
      hint: "Because `t` strictly increases, any timestamp once `< t - 3000` can never fall back inside a future window.",
      complexity: { time: "O(1) amortized", space: "O(W) where W <= 3001" },
      solutionCode:
        "class RecentCounter:\n    init():\n        q ← empty Queue\n    function ping(t):\n        q.enqueue(t)\n        while q.front() < t - 3000:\n            q.dequeue()\n        return size(q)",
    },
    {
      id: "dsa-m13-p3",
      title: "Count Surviving Asteroid Collisions",
      patternHint: "Track surviving asteroids left-to-right on a stack; collisions happen only when a negative (left-moving) asteroid meets a positive (right-moving) top.",
      lessonRefId: "dsa-monotonic-stack",
      goal: "Given an array `asteroids` where `|val|` is size and sign is direction (`+` right, `-` left, same speed), return the state after all collisions (smaller explodes; equal sizes both explode).",
      constraints: ["2 <= len(asteroids) <= 10^4", "asteroids[i] != 0", "Target: O(n) time, O(n) space"],
      examples: [
        { input: "asteroids = [5, 10, -5]", output: "[5, 10]" },
        { input: "asteroids = [8, -8]", output: "[]" },
        { input: "asteroids = [10, 2, -5]", output: "[10]" },
      ],
      tasks: [
        "Iterate through `a` in `asteroids`; set `alive = true`.",
        "While `alive` and stack non-empty and `st.peek() > 0` and `a < 0`, compare `abs(a)` against `st.peek()`.",
        "Push `a` only if `alive` remains `true` after resolving collisions.",
      ],
      starterCode: "function asteroid_collision(asteroids):\n    // TODO: simulate collisions in one pass",
      expectedOutput: "[5, 10]\n[]\n[10]",
      hint: "A left-moving asteroid followed by a right-moving asteroid (`[-5, 10]`) moves apart and never collides!",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "function asteroid_collision(asteroids):\n    st ← []\n    for a in asteroids:\n        alive ← true\n        while alive and not is_empty(st) and st.peek() > 0 and a < 0:\n            if st.peek() < -a:\n                st.pop()\n            else if st.peek() == -a:\n                st.pop()\n                alive ← false\n            else:\n                alive ← false\n        if alive:\n            st.push(a)\n    return st",
    },
    {
      id: "dsa-m13-p4",
      title: "Peak Sensor Reading Per Window",
      patternHint: "Pair the sliding window with a deque of candidate indices kept in strictly decreasing value order from front to back.",
      lessonRefId: "dsa-monotonic-queue",
      goal: "Given a stream array `readings` and window size `k`, return the maximum reading inside every consecutive `k`-length window in `O(n)` total time.",
      constraints: ["1 <= k <= len(readings) <= 10^5", "-10^5 <= readings[i] <= 10^5", "Target: O(n) time, O(k) space"],
      examples: [
        { input: "readings = [4, 2, 12, 3, 8, 7], k = 3", output: "[12, 12, 12, 8]" },
        { input: "readings = [7, 2, 4], k = 2", output: "[7, 4]" },
      ],
      tasks: [
        "Drop `dq.front()` if `dq.front() <= i - k`.",
        "Pop `dq.back()` while `readings[dq.back()] <= readings[i]` and push `i`.",
        "Record `readings[dq.front()]` whenever `i >= k - 1`.",
      ],
      starterCode: "function peak_window_readings(readings, k):\n    // TODO: return peak reading for every k-length window in O(n)",
      expectedOutput: "[12, 12, 12, 8]\n[7, 4]",
      hint: "Storing indices in the deque lets you check window expiration (`<= i - k`) in `O(1)` without extra counters.",
      complexity: { time: "O(n)", space: "O(k)" },
      solutionCode:
        "function peak_window_readings(readings, k):\n    dq ← empty Deque\n    res ← []\n    for i from 0 to len(readings) - 1:\n        if not is_empty(dq) and dq.front() <= i - k:\n            dq.pop_front()\n        while not is_empty(dq) and readings[dq.back()] <= readings[i]:\n            dq.pop_back()\n        dq.push_back(i)\n        if i >= k - 1:\n            res.append(readings[dq.front()])\n    return res",
    },
  ],
};
