import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM06Lessons: Record<string, LessonContent> = {
  "dsa-hash-internals": {
    lessonId: "dsa-hash-internals",
    subtitle:
      "Understand why fixed 26-slot or direct-indexed arrays break on 10^9 key spaces, how hash(key) mod capacity maps keys to buckets, how chaining and linear probing handle collisions, and how load-factor resizing keeps operations O(1) average.",
    intro: {
      heading: "Hash Functions, Buckets & Collision Handling",
      explanation: [
        "Direct-indexed arrays (`arr[key]`) collapse once keys span `10^9` IDs or arbitrary strings (~4 GB wasted for `1,000` items), while naive `h mod capacity` in C++, Java, or JavaScript returns `-1` for `h = -5, cap = 4` and crashes array indexing. Even inside a hash table, clearing a deleted linear-probing slot back to `EMPTY` breaks searches for later keys in that cluster, and adversarial collisions into one bucket can degrade lookups into `O(n)` DoS scans.",
        "A **hash table** folds any key into `0 .. capacity - 1` using `((h mod capacity) + capacity) mod capacity`, resolves **collisions** via per-bucket lists (**chaining**) or `(idx + step) mod capacity` (**linear probing** with `DEL` tombstones), and doubles `capacity` when the **load factor** crosses a threshold so average operations remain `O(1)`.",
      ],
      analogy:
        "A coat check with 8 numbered hooks folds thousands of ticket numbers onto hooks 0..7 with modulo. If two coats map to hook 3, either hang both coats on hook 3 (chaining) or walk to hook 4, 5, ... until you find an open hook (linear probing). When the rack gets crowded, double the hooks and re-hang everything.",
      realWorldUses: [
        "Implementing built-in dictionaries, objects, and maps (`dict`, `HashMap`, `Map`, `unordered_map`) for O(1) average key-value lookup",
        "Caching user profiles, session tokens, or DNS records indexed by arbitrary strings or 64-bit IDs",
      ],
    },
    sections: [
      {
        heading: "Why [26] fails for 10^9 keys and how hash(key) mod capacity works",
        paragraphs: [
          "Direct indexing (`arr[key]`) only works when the key universe is tiny and contiguous, such as `'a'..'z'` (`26` slots). If keys are user IDs up to `10^9` (or 10-character strings with `26^10` possibilities), direct indexing requires billions of slots even when you only store `1,000` items.",
          "Instead, a hash table allocates `capacity` buckets proportional to `n`. A deterministic **hash function** maps any key to an integer `h`: `bucket = ((h mod capacity) + capacity) mod capacity` keeps `bucket` inside `0 .. capacity - 1` even for negative `h` (`h = -5, cap = 4` -> `((-1) + 4) mod 4 = 3`, valid, whereas raw `-5 % 4 = -1` crashes in C++/JS).",
        ],
        code: [
          "# Broken: constant hash forces every key into bucket 0 -> O(n) scan",
          "def bad_hash(key, M):",
          "    return 0",
          "",
          "# Working: deterministic polynomial rolling hash spreads keys across 0..M-1",
          "def bucket_hash(key, M):",
          "    h = 0",
          "    for ch in key:",
          "        h = (h * 31 + ord(ch)) % M",
          "    return ((h % M) + M) % M   # stays non-negative in C++/Java/JS too",
        ],
        codeLabel: "Python",
        output: "bad_hash(M=8): cat->0, dog->0, bird->0 | bucket_hash(M=8): cat->6, dog->4, bird->1",
        table: {
          caption: "Direct indexing vs hash tables for arbitrary keys",
          headers: ["Approach", "Key universe", "Memory for n = 1,000 items", "Lookup cost"],
          rows: [
            ["`counts[26]` direct array", "`'a'..'z'` only (`26` keys)", "`26` slots (`O(1)`)", "`O(1)` worst-case"],
            ["Direct array `arr[0..10^9]`", "Integers `0..10^9`", "`10^9` ints (~4 GB, infeasible)", "`O(1)` worst-case"],
            ["Hash table (`cap` buckets)", "Integers up to `10^9`, strings, tuples", "`O(n)` buckets (`~2,000` slots)", "`O(1)` avg / `O(n)` worst"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "KEY IDEA",
          text: "A hash function must be deterministic (the same key always yields the same bucket) and spread keys evenly across `0 .. capacity - 1`.",
        },
      },
      {
        heading: "Chaining vs linear probing, load factor, and resizing",
        paragraphs: [
          "Because a huge key space folds into finite buckets, collisions happen. **Chaining** keeps a small list of `(key, value)` pairs per bucket. **Linear probing** stores entries in one flat array: trace `cap = 4` with `14` (`14 mod 4 = 2`? Say `15` at `3`) and `7` (`7 mod 4 = 3`, collides -> probes to slot `0`). Deleting `15` from slot `3` must leave a `DEL` tombstone: clearing slot `3` to `EMPTY` stops `lookup(7)` at slot `3` and wrongly returns `false`, whereas `DEL` lets `lookup(7)` continue to slot `0` and hit `7`.",
          "Performance depends on the **load factor** `alpha = n / capacity`. Resizing doubles `capacity` (at `alpha >= 0.75` for chaining or `alpha >= 0.6` for probing) and re-inserts all `n` entries under the new modulo. Doubling keeps amortized inserts `O(1)` average, while poor hash functions or adversarial collision floods degrade lookups to `O(n)` worst-case.",
        ],
        table: {
          caption: "Chaining vs linear probing and average vs worst-case complexity",
          headers: ["Operation / Property", "Chaining", "Linear Probing", "Average vs Worst-Case"],
          rows: [
            ["Bucket storage", "Array of small per-bucket lists", "Flat array of slots (`EMPTY`, `DEL`, `(k, v)`)", "Both use `O(n)` space"],
            ["Search / Insert", "Hash -> scan bucket's short list", "Hash -> probe `(idx + step) mod cap`", "`O(1)` avg / `O(n)` worst"],
            ["Delete", "Remove entry from bucket's list", "Replace slot with `DEL` tombstone", "`O(1)` avg / `O(n)` worst"],
            ["Resize trigger", "Typically `n / cap >= 0.75` or `1.0`", "Must stay `< 1.0` (typically `>= 0.5 - 0.7`)", "`O(n)` single resize, `O(1)` amortized"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "WATCH OUT",
          text: "In linear probing, never clear a deleted slot back to `EMPTY`. Mark it as a `DEL` tombstone so searches for later keys in the same probe cluster keep scanning past the deleted position.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From Raw Modulo Bugs to Normalized Buckets & Tombstone Probing",
      steps: [
        {
          label: "Step 1: Raw h mod cap fails on negative hashes",
          explanation: "In languages where `-5 mod 8 == -5`, indexing `buckets[-5]` throws an out-of-bounds error.",
          code: [
            "function bucket_broken(h, cap):",
            "    return h mod cap   // -5 mod 8 = -5 in C++/Java/JS!",
          ],
          activeLines: [2],
          output: "bucket_broken(-5, 8) -> -5 (invalid slot!)",
        },
        {
          label: "Step 2: Normalize negative remainders into 0 .. cap - 1",
          explanation: "Adding `cap` once after `h mod cap` and taking `mod cap` again keeps every signed hash inside `0 .. cap - 1`.",
          code: [
            "function bucket_index(h, cap):",
            "    return ((h mod cap) + cap) mod cap",
          ],
          activeLines: [2],
          output: "bucket_index(-5, 8) -> 3",
        },
        {
          label: "Step 3: Linear probing with DEL tombstones",
          explanation: "Deleting writes `DEL` instead of `EMPTY` so searches keep probing past deleted cluster entries.",
          code: [
            "function probe_has(slots, cap, k):",
            "    idx ← bucket_index(k, cap)",
            "    for step from 0 to cap - 1:",
            "        if slots[idx] == EMPTY: return false",
            "        if slots[idx] == k: return true",
            "        idx ← (idx + 1) mod cap   // keeps going on DEL",
            "    return false",
          ],
          activeLines: [4, 5, 6],
          output: "Finds k after earlier DEL without breaking cluster",
        },
      ],
    },
    walkthrough: {
      title: "Trace bucket mapping, collisions, tombstones, and resizing",
      layout: "visual-first",
      steps: [
        {
          title: "Fold large keys into capacity = 4 buckets with mod",
          tag: "MEMORY",
          explanation: [
            "Suppose keys come from `1..10^9`, and we allocate `capacity = 4` buckets (`0..3`).",
            "Inserting `10` computes `bucket = 10 mod 4 = 2`, placing `10` directly in slot `2` in `O(1)` without allocating `10` or `10^9` slots.",
          ],
          code: [
            "cap ← 4",
            "table ← [EMPTY, EMPTY, EMPTY, EMPTY]",
            "idx ← ((10 mod cap) + cap) mod cap   // 2",
            "table[idx] ← 10",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "Key", value: "10 (from 0..10^9)" },
            { name: "Bucket idx", value: "10 mod 4 = 2", changed: true },
            { name: "Load n / cap", value: "1 / 4 = 0.25" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Buckets (capacity = 4)",
                cells: [
                  { id: "b0", value: "_", index: 0, state: "dim" },
                  { id: "b1", value: "_", index: 1, state: "dim" },
                  { id: "b2", value: "10", index: 2, state: "active" },
                  { id: "b3", value: "_", index: 3, state: "dim" },
                ],
                pointers: [{ index: 2, label: "10 mod 4 = 2", tone: "accent" }],
              },
            ],
            caption: "Modulo folds any integer key into [0..capacity-1].",
          },
        },
        {
          title: "Chaining appends colliding keys inside the same bucket",
          tag: "TRACE",
          explanation: [
            "Now insert `14`: `14 mod 4 = 2`, which already holds `10`.",
            "With **chaining**, bucket `2` stores a short list `[10, 14]`, and each other bucket stays untouched.",
          ],
          code: [
            "idx ← 14 mod 4   // 2 (collision with 10!)",
            "if 14 not in buckets[idx]:",
            "    buckets[idx].append(14)",
          ],
          activeLines: [1, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "Collision at", value: "bucket 2 (10 and 14)", changed: true },
            { name: "Load n / cap", value: "2 / 4 = 0.50" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Chaining buckets (cap = 4)",
                cells: [
                  { id: "c0", value: "[]", index: 0, state: "dim" },
                  { id: "c1", value: "[]", index: 1, state: "dim" },
                  { id: "c2", value: "10,14", index: 2, state: "active" },
                  { id: "c3", value: "[]", index: 3, state: "dim" },
                ],
                pointers: [{ index: 2, label: "chain len 2", tone: "coral" }],
              },
            ],
            caption: "Chaining keeps colliding entries together in bucket 2's list.",
          },
        },
        {
          title: "Linear probing places 14 at slot 3 after colliding at slot 2",
          tag: "TRACE",
          explanation: [
            "With **linear probing**, each slot holds at most one item. Inserting `14` (`14 mod 4 = 2`) sees `10` at slot `2`, so it probes `(2 + 1) mod 4 = 3` and claims slot `3`.",
            "Slot `0` and slot `1` remain open for subsequent insertions.",
          ],
          code: [
            "probe_insert(table, cap, key):",
            "    idx ← ((key mod cap) + cap) mod cap",
            "    while table[idx] != EMPTY and table[idx] != DEL:",
            "        idx ← (idx + 1) mod cap",
            "    table[idx] ← key",
          ],
          activeLines: [2, 3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "14 hash", value: "14 mod 4 = 2 (occupied by 10)" },
            { name: "14 placed at", value: "slot 3 (1 probe)", changed: true },
            { name: "Load n / cap", value: "2 / 4 = 0.50" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Linear probing flat table (cap = 4)",
                cells: [
                  { id: "lp0", value: "_", index: 0, state: "dim" },
                  { id: "lp1", value: "_", index: 1, state: "dim" },
                  { id: "lp2", value: "10", index: 2, state: "done" },
                  { id: "lp3", value: "14", index: 3, state: "active" },
                ],
                pointers: [
                  { index: 2, label: "14 tried 2", tone: "coral" },
                  { index: 3, label: "placed at 3", tone: "ok" },
                ],
              },
            ],
            caption: "Collision at slot 2 probes one step forward to claim open slot 3.",
          },
        },
        {
          title: "Linear probing wraps around mod capacity when inserting 7",
          tag: "TRACE",
          explanation: [
            "Next, inserting `7` (`7 mod 4 = 3`) finds slot `3` occupied by `14`.",
            "Probing wraps around via `(3 + 1) mod 4 = 0` and stores `7` in slot `0`, bringing load to `3 / 4 = 0.75`.",
          ],
          code: [
            "probe_insert(table, cap, key):",
            "    idx ← ((key mod cap) + cap) mod cap",
            "    while table[idx] != EMPTY and table[idx] != DEL:",
            "        idx ← (idx + 1) mod cap",
            "    table[idx] ← key",
          ],
          activeLines: [3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "7 hash", value: "7 mod 4 = 3 (occupied by 14)" },
            { name: "7 placed at", value: "slot 0 (wrapped)", changed: true },
            { name: "Load n / cap", value: "3 / 4 = 0.75" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Linear probing flat table (cap = 4)",
                cells: [
                  { id: "lp0", value: "7", index: 0, state: "active" },
                  { id: "lp1", value: "_", index: 1, state: "dim" },
                  { id: "lp2", value: "10", index: 2, state: "done" },
                  { id: "lp3", value: "14", index: 3, state: "done" },
                ],
                pointers: [
                  { index: 3, label: "7 tried 3", tone: "coral" },
                  { index: 0, label: "wrapped to 0", tone: "ok" },
                ],
              },
            ],
            caption: "Wrap-around probing keeps all keys inside the same flat array.",
          },
        },
        {
          title: "Delete in linear probing must leave a DEL tombstone",
          tag: "PITFALL",
          explanation: [
            "Suppose we delete `14` from slot `3` and then search for `7` (`7 mod 4 = 3`).",
            "If slot `3` became `EMPTY`, `lookup(7)` would stop at slot `3` and wrongly return `false`. Marking slot `3` as `DEL` tells `lookup(7)` to keep probing to slot `0` and find `7`.",
          ],
          callout: {
            kind: "WATCH OUT",
            text: "Insertions can reuse a `DEL` slot, but searches must never stop at `DEL`; stop only at `EMPTY` or after checking all `cap` slots.",
          },
          code: [
            "probe_has(table, cap, key):",
            "    idx ← ((key mod cap) + cap) mod cap",
            "    for step from 0 to cap - 1:",
            "        if table[idx] == EMPTY: return false",
            "        if table[idx] == key: return true",
            "        idx ← (idx + 1) mod cap   // skips DEL",
            "    return false",
          ],
          activeLines: [4, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "Deleted", value: "14 at slot 3 -> DEL", changed: true },
            { name: "lookup(7)", value: "3 (DEL) -> 0 (true)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Tombstone keeps probe chain intact",
                cells: [
                  { id: "lp0", value: "7", index: 0, state: "active" },
                  { id: "lp1", value: "_", index: 1, state: "dim" },
                  { id: "lp2", value: "10", index: 2, state: "done" },
                  { id: "lp3", value: "DEL", index: 3, state: "pivot" },
                ],
                pointers: [
                  { index: 3, label: "DEL (keep going)", tone: "coral" },
                  { index: 0, label: "found 7!", tone: "ok" },
                ],
              },
            ],
            caption: "Replacing 14 with DEL preserves the path from 3 to 0 for key 7.",
          },
        },
        {
          title: "Resize (4 -> 8) and rehash active keys (clearing tombstones)",
          tag: "PATTERN",
          explanation: [
            "After deleting `14`, `2` live keys (`10` and `7`) plus `1` `DEL` tombstone occupy `3 / 4 = 0.75` of the slots. Doubling `capacity` from `4` to `8` and rehashing only active entries clears every `DEL` tombstone.",
            "Recomputing `key mod 8` places `10` at `10 mod 8 = 2` and `7` at `7 mod 8 = 7`, dropping the live load factor to `2 / 8 = 0.25` with zero collisions.",
          ],
          code: [
            "if (n + tombstones) / cap >= 0.75:",
            "    new_cap ← cap * 2",
            "    new_table ← array of new_cap EMPTY slots",
            "    for each slot in old_table:",
            "        if slot != EMPTY and slot != DEL:",
            "            probe_insert(new_table, new_cap, slot)",
          ],
          activeLines: [1, 2, 5, 6],
          codeLabel: "Pseudocode",
          state: [
            { name: "Capacity", value: "4 -> 8", changed: true },
            { name: "Rehashed active keys", value: "10->2, 7->7 (DEL cleared)", changed: true },
            { name: "Load n / cap", value: "2 / 8 = 0.25" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Rehashed table (capacity = 8, live load = 0.25)",
                cells: [
                  { id: "r0", value: "_", index: 0, state: "dim" },
                  { id: "lp1", value: "_", index: 1, state: "dim" },
                  { id: "lp2", value: "10", index: 2, state: "done" },
                  { id: "lp3", value: "_", index: 3, state: "dim" },
                  { id: "r4", value: "_", index: 4, state: "dim" },
                  { id: "r5", value: "_", index: 5, state: "dim" },
                  { id: "r6", value: "_", index: 6, state: "dim" },
                  { id: "lp0", value: "7", index: 7, state: "active" },
                ],
                pointers: [
                  { index: 2, label: "10%8=2", tone: "ok" },
                  { index: 7, label: "7%8=7", tone: "coral" },
                ],
              },
            ],
            caption: "Doubling capacity and rehashing live entries removes DEL tombstones and disperses keys.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Negative hash values cause out-of-bounds indices",
        detail:
          "In C++, Java, and JavaScript, `-5 % 8` evaluates to `-5` rather than `3`. Always compute `((h % cap) + cap) % cap` before indexing a bucket array.",
        code: "idx ← ((hash(key) mod cap) + cap) mod cap",
      },
      {
        title: "Average O(1) is not a worst-case guarantee",
        detail:
          "If a weak hash function maps every key to bucket `0` (or every key creates one contiguous cluster), every lookup walks all `n` items (`O(n)` worst-case). Good hash functions and load-factor resizing keep average cost `O(1)`.",
      },
      {
        title: "Full-table infinite loop in linear probing",
        detail:
          "If an open-addressed table hits load factor `1.0` without resizing, `while table[idx] != EMPTY` loops forever when searching for a missing key. Always resize before `n == cap`, or cap probes at `cap` steps.",
      },
    ],
    practiceTask: {
      title: "Normalized Bucket Index",
      tier: "Warmup",
      goal: "Compute the valid `0 .. cap - 1` bucket index for any signed 64-bit integer hash `h` and positive capacity `cap`.",
      constraints: ["-10^18 <= h <= 10^18", "1 <= cap <= 10^9", "Time: O(1)"],
      examples: [
        { input: "h = -5, cap = 8", output: "3", explanation: "((-5 % 8) + 8) % 8 = 3." },
        { input: "h = 27, cap = 8", output: "3" },
      ],
      tasks: [
        "Compute `r = h mod cap`.",
        "Add `cap` if `r < 0` (or compute `((h mod cap) + cap) mod cap`) and return the result.",
      ],
      starterCode: "function bucket_index(h, cap):\n    // TODO: normalize negative h into 0..cap-1",
      expectedOutput: "3\n3",
      hint: "Adding `cap` once after `h mod cap` and taking `mod cap` again works uniformly for both negative and non-negative `h`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode: "function bucket_index(h, cap):\n    return ((h mod cap) + cap) mod cap",
    },
    practiceChallenges: [
      {
        title: "Normalized Bucket Index",
        tier: "Warmup",
        goal: "Compute the valid `0 .. cap - 1` bucket index for any signed 64-bit integer hash `h` and positive capacity `cap`.",
        constraints: ["-10^18 <= h <= 10^18", "1 <= cap <= 10^9", "Time: O(1)"],
        examples: [
          { input: "h = -5, cap = 8", output: "3", explanation: "((-5 % 8) + 8) % 8 = 3." },
          { input: "h = 27, cap = 8", output: "3" },
        ],
        tasks: [
          "Compute `r = h mod cap`.",
          "Add `cap` if `r < 0` (or compute `((h mod cap) + cap) mod cap`) and return the result.",
        ],
        starterCode: "function bucket_index(h, cap):\n    // TODO: normalize negative h into 0..cap-1",
        expectedOutput: "3\n3",
        hint: "Adding `cap` once after `h mod cap` and taking `mod cap` again works uniformly for both negative and non-negative `h`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode: "function bucket_index(h, cap):\n    return ((h mod cap) + cap) mod cap",
      },
      {
        title: "Linear-Probing Slot Locator",
        tier: "Core",
        goal: "Simulate linear probing insertion across `cap` slots for `keys` (skipping re-insertion of duplicates while still reporting their found slot index) and return the assigned slot for each key.",
        constraints: ["1 <= len(keys) <= cap <= 10^4", "-10^9 <= keys[i] <= 10^9"],
        examples: [
          { input: "cap = 4, keys = [10, 14, 7, 10]", output: "[2, 3, 0, 2]" },
          { input: "cap = 5, keys = [-1, 4]", output: "[4, 0]" },
        ],
        tasks: [
          "Normalize start bucket `idx = ((k mod cap) + cap) mod cap`.",
          "Probe `(idx + 1) mod cap` until `slots[idx]` is `EMPTY` or already equals `k`.",
        ],
        starterCode: "function locate_probing_slots(cap, keys):\n    // TODO: simulate linear probing table",
        expectedOutput: "[2, 3, 0, 2]\n[4, 0]",
        hint: "Stopping when `slots[idx] == k` prevents placing duplicate copies of the same key into two different slots.",
        complexity: { time: "O(n) average", space: "O(cap)" },
        solutionCode:
          "function locate_probing_slots(cap, keys):\n    slots ← array of cap EMPTY markers\n    out ← empty list\n    for each k in keys:\n        idx ← ((k mod cap) + cap) mod cap\n        while slots[idx] != EMPTY and slots[idx] != k:\n            idx ← (idx + 1) mod cap\n        slots[idx] ← k\n        out.append(idx)\n    return out",
      },
      {
        title: "Linear Probing with Tombstone Delete & Lookup",
        tier: "Stretch",
        goal: "Process a sequence of operations `[\"INS\", k]`, `[\"DEL\", k]`, and `[\"HAS\", k]` on a linear-probing table of fixed size `cap` (assuming live keys never exceed `cap - 1`), returning the boolean list for all `HAS` queries.",
        constraints: [
          "2 <= cap <= 2000",
          "Live keys < cap at all times",
          "Must support deleting keys without breaking probe chains",
        ],
        examples: [
          {
            input: "cap = 4, ops = [[\"INS\", 10], [\"INS\", 14], [\"INS\", 7], [\"DEL\", 14], [\"HAS\", 7], [\"HAS\", 14]]",
            output: "[true, false]",
            explanation: "Deleting 14 leaves DEL at slot 3 so HAS 7 still reaches slot 0.",
          },
          {
            input: "cap = 3, ops = [[\"INS\", 2], [\"INS\", 5], [\"DEL\", 2], [\"INS\", 5], [\"HAS\", 5], [\"HAS\", 2]]",
            output: "[true, false]",
            explanation: "INS 5 sees DEL at slot 2 but keeps probing to find existing key 5 at slot 0, avoiding duplicate insertion.",
          },
        ],
        tasks: [
          "Track three slot states: `EMPTY`, `DEL`, and an integer key.",
          "On `INS k`: first check if `k` already exists before stopping at `EMPTY`; otherwise insert into the first `DEL` or `EMPTY` slot seen.",
          "On `DEL k`: probe until `EMPTY` or `k`; if `k` is found, replace that slot with `DEL`.",
        ],
        starterCode: "function run_probing_ops(cap, ops):\n    // TODO: support INS, DEL (tombstone), and HAS",
        expectedOutput: "[true, false]\n[true, false]",
        hint: "During `INS k`, remember the first `DEL` index seen, keep scanning until `EMPTY` (or finding `k` already present), and only write to that saved `DEL` slot if `k` was not found later in the cluster!",
        complexity: { time: "O(ops) average", space: "O(cap)" },
        solutionCode:
          "function run_probing_ops(cap, ops):\n    slots ← array of cap EMPTY markers\n    ans ← empty list\n    for each (op, k) in ops:\n        idx ← ((k mod cap) + cap) mod cap\n        if op == \"INS\":\n            first_del ← -1\n            for step from 0 to cap - 1:\n                if slots[idx] == k:\n                    first_del ← -2; break\n                if slots[idx] == DEL and first_del == -1:\n                    first_del ← idx\n                if slots[idx] == EMPTY:\n                    target ← idx if first_del == -1 else first_del\n                    slots[target] ← k\n                    first_del ← -2; break\n                idx ← (idx + 1) mod cap\n            if first_del >= 0: slots[first_del] ← k\n        else if op == \"DEL\":\n            for step from 0 to cap - 1:\n                if slots[idx] == EMPTY: break\n                if slots[idx] == k:\n                    slots[idx] ← DEL; break\n                idx ← (idx + 1) mod cap\n        else:\n            found ← false\n            for step from 0 to cap - 1:\n                if slots[idx] == EMPTY: break\n                if slots[idx] == k:\n                    found ← true; break\n                idx ← (idx + 1) mod cap\n            ans.append(found)\n    return ans",
      },
    ],
  },

  "dsa-hash-sets": {
    lessonId: "dsa-hash-sets",
    subtitle:
      "Use Hash Sets for O(1) average deduplication and membership checks, group anagrams in O(n * L) using a 26-count key without sorting, and solve Longest Consecutive Sequence in O(n) by starting only when x - 1 is absent.",
    intro: {
      heading: "Hash Sets & Frequency Counting",
      explanation: [
        "Checking for duplicates or membership by scanning backward through earlier elements runs in `O(n^2)` time, and sorting every word in Group Anagrams adds an `O(L log L)` factor per word. Worse, in Longest Consecutive Sequence, walking forward from every element in `[1, 1, ..., 1, 2, 3]`—even with `(x - 1) not in s`—still repeats the full streak `n` times when `1` appears `n` times in the raw array.",
        "A **Hash Set** delivers `O(1)` average membership checks, turning deduplication into a single `O(n)` pass. A **Hash Map** paired with `'#'`-delimited `cnt[26]` signatures groups anagrams in `O(n * L)` without sorting, and iterating over the deduplicated set `s` with `(x - 1) not in s` solves Longest Consecutive Sequence in `O(n)` average time.",
      ],
      analogy:
        "A Hash Set works like a nightclub guest list: checking whether a name is already inside takes one lookup instead of reading every row from top to bottom. For consecutive sequences, picture numbered runners scattered in a field: only a runner whose `number - 1` is missing starts counting the streak forward, so nobody counts the same line twice.",
      realWorldUses: [
        "Removing duplicate user IDs, tags, or URLs in a single O(n) pass over a stream",
        "Detecting the longest unbroken run of invoice numbers, frame IDs, or sequence numbers in O(n) time",
      ],
    },
    sections: [
      {
        heading: "Hash Sets, frequency maps, and grouping anagrams without sorting",
        paragraphs: [
          "To deduplicate an array, keep a Hash Set `seen` and check `x in seen` in `O(1)` average time before `seen.add(x)`. When you also need occurrence counts for arbitrary integers or strings, store `freq[x] = freq.get(x, 0) + 1` in a Hash Map.",
          "To **Group Anagrams** (`[\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]`) without sorting, count `'a'..'z'` into `cnt[26]` in `O(L)` and join with `'#'` (`\"#\".join(map(str, cnt))`). Always include the delimiter: `[1, 12]` and `[11, 2]` stay distinct as `\"1#12#...\"` vs `\"11#2#...\"` (valid), whereas joining without `'#'` turns both into `\"112...\"` (broken collision).",
        ],
        table: {
          caption: "Hash Set and Hash Map frequency patterns",
          headers: ["Task", "Structure & Key", "Value stored", "Time / Space"],
          rows: [
            ["Deduplicate / membership", "Hash Set of `x`", "Presence only", "`O(n)` avg / `O(n)`"],
            ["Frequency count (large keys)", "Hash Map `freq[x]`", "Integer occurrence count", "`O(n)` avg / `O(n)`"],
            ["Group anagrams (no sort)", "Hash Map of `cnt[26]` joined with `'#'`", "List of matching words", "`O(n * L)` avg / `O(n * L)`"],
            ["Longest consecutive run", "Hash Set `s` of all numbers", "Presence (`(x - 1) in s` guard)", "`O(n)` avg / `O(n)`"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Never concatenate `cnt[26]` without a delimiter! Without `'#'`, counts `[1, 12]` and `[11, 2]` both form `\"112\"`, falsely merging non-anagrams.",
        },
      },
      {
        heading: "Longest Consecutive Sequence in O(n) via the x - 1 check",
        paragraphs: [
          "Trace `[100, 4, 200, 1, 3, 2]` inside Hash Set `s = {1, 2, 3, 4, 100, 200}`: at `x = 4`, `3 in s` is true (skip); at `x = 3`, `2 in s` is true (skip); at `x = 2`, `1 in s` is true (skip). Only `x = 1` (`0 not in s`), `x = 100` (`99 not in s`), and `x = 200` (`199 not in s`) start a forward `while (cur + 1) in s` walk.",
          "Iterating `for x in s` (the deduplicated set) instead of `for x in nums` ensures repeated values like `[1, 1, 1, ..., 1, 2, 3]` walk `[1, 2, 3]` once rather than `n` times, keeping total work `O(n)` average.",
        ],
        code: [
          "nums = [1, 1, 1, 1, 2, 3]   # repeated 1s trigger an O(n^2) trap on raw nums",
          "s = set(nums)",
          "",
          "# Broken at scale: looping raw nums re-walks [1, 2, 3] for every duplicate 1",
          "steps_raw = 0",
          "for x in nums:",
          "    if x - 1 not in s:",
          "        cur = x",
          "        while cur in s:",
          "            steps_raw += 1; cur += 1",
          "",
          "# Working: looping unique set(nums) starts each streak once -> O(n) total",
          "steps_set = 0; best = 0",
          "for x in set(nums):",
          "    if x - 1 not in s:",
          "        cur = x",
          "        while cur in s:",
          "            steps_set += 1; cur += 1",
          "        best = max(best, cur - x)",
        ],
        codeLabel: "Python",
        output: "best=3 | for x in nums: 12 inner steps (4x3) | for x in set(nums): 3 inner steps",
        table: {
          caption: "Why the x - 1 start guard reduces O(n^2) to O(n)",
          headers: ["Strategy", "Checks on [1, 2, 3, 4]", "Checks on [1, 1, ..., 1]", "Total time"],
          rows: [
            ["Walk `x+1..` from every `x`", "`4 + 3 + 2 + 1 = 10`", "`n` steps", "`O(n^2)` worst-case"],
            ["Loop raw `nums` with `x - 1` guard", "`1 + 1 + 1 + 4 = 7`", "Starts from `1` `n` times!", "`O(n^2)` if `1` repeats"],
            ["Loop unique set `s` with `x - 1` guard", "`1 + 1 + 1 + 4 = 7`", "Starts from `1` once", "`O(n)` average"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Always iterate over the deduplicated Hash Set `s` (not the raw input array) so repeated streak-start values like `[1, 1, 1, ..., 1, 2, 3]` are never walked multiple times.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From O(n^2) Scans to O(1)-Lookup Hash Sets & Streak Starts",
      steps: [
        {
          label: "Step 1: Naive O(n^2) forward scan per element",
          explanation: "Checking `x + 1, x + 2, ...` from every number re-walks `[2, 3, 4]`, `[3, 4]`, and `[4]`.",
          code: [
            "function longest_naive(nums):",
            "    s ← Hash Set of nums; best ← 0",
            "    for x in nums:",
            "        cur ← x",
            "        while (cur + 1) in s: cur += 1",
            "        best ← max(best, cur - x + 1)",
            "    return best",
          ],
          activeLines: [3, 5],
          output: "[1, 2, ..., n] -> O(n^2) steps",
        },
        {
          label: "Step 2: Add (x - 1) in s start guard (still weak on duplicates)",
          explanation: "Skipping `x` when `x - 1` exists avoids mid-streak starts, though looping `nums` still repeats duplicate `1`s.",
          code: [
            "function longest_with_guard(nums):",
            "    s ← Hash Set of nums; best ← 0",
            "    for x in nums:",
            "        if (x - 1) in s: continue",
            "        cur ← x",
            "        while (cur + 1) in s: cur += 1",
            "        best ← max(best, cur - x + 1)",
            "    return best",
          ],
          activeLines: [4],
          output: "[1, 1, ..., 1, 2, 3] -> still O(n^2) on raw nums",
        },
        {
          label: "Step 3: Iterate unique set s for true O(n) average",
          explanation: "Looping over `s` instead of `nums` guarantees each streak is walked once.",
          code: [
            "function longest_consecutive(nums):",
            "    s ← Hash Set of nums; best ← 0",
            "    for x in s:",
            "        if (x - 1) in s: continue",
            "        cur ← x",
            "        while (cur + 1) in s: cur += 1",
            "        best ← max(best, cur - x + 1)",
            "    return best",
          ],
          activeLines: [3, 4, 6],
          output: "longest_consecutive([100,4,200,1,3,2]) -> 4",
        },
      ],
    },
    walkthrough: {
      title: "Trace deduplication, cnt[26] anagram keys, and O(n) streak starts",
      layout: "visual-first",
      steps: [
        {
          title: "Deduplicate in O(1) average per item with a Hash Set",
          tag: "CONCEPT",
          explanation: [
            "Scan `[4, 2, 4, 7, 2]` left to right with an empty Hash Set `seen`.",
            "At index `2` (`x = 4`), `4 in seen` answers `true` in `O(1)` average without scanning earlier indices, so `4` is skipped.",
          ],
          code: [
            "seen ← empty Hash Set; out ← []",
            "for each x in nums:",
            "    if x not in seen:",
            "        seen.add(x)",
            "        out.append(x)",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "seen, out = set(), []",
              "for x in nums:",
              "    if x not in seen:",
              "        seen.add(x)",
              "        out.append(x)",
            ],
          },
          state: [
            { name: "i = 2 (x = 4)", value: "4 in seen -> true (skip)", changed: true },
            { name: "out", value: "[4, 2]" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input stream [4, 2, 4, 7, 2]",
                cells: [
                  { id: "d0", value: "4", index: 0, state: "done" },
                  { id: "d1", value: "2", index: 1, state: "done" },
                  { id: "d2", value: "4", index: 2, state: "pivot" },
                  { id: "d3", value: "7", index: 3, state: "dim" },
                  { id: "d4", value: "2", index: 4, state: "dim" },
                ],
                pointers: [{ index: 2, label: "already in seen", tone: "coral" }],
              },
              {
                label: "Unique items stored in seen",
                cells: [
                  { id: "u0", value: "4", index: 0, state: "active" },
                  { id: "u1", value: "2", index: 1, state: "active" },
                ],
              },
            ],
            caption: "A Hash Set checks membership in O(1) average instead of scanning out[].",
          },
        },
        {
          title: "Build a canonical cnt[26] key for \"eat\" without sorting",
          tag: "PATTERN",
          explanation: [
            "For `word = \"eat\"`, tally letters in a 26-slot array: `cnt[0] = 1` (`'a'`), `cnt[4] = 1` (`'e'`), `cnt[19] = 1` (`'t'`).",
            "Joining all 26 counts with `'#'` produces one deterministic key string in `O(L + 26)` time without ever sorting characters.",
          ],
          code: [
            "cnt ← array of 26 zeros",
            "for each ch in word:",
            "    cnt[ord(ch) - ord('a')] += 1",
            "key ← serialize_with_hash(cnt)",
          ],
          activeLines: [2, 3, 4],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "cnt = [0] * 26",
              "for ch in word:",
              "    cnt[ord(ch) - ord('a')] += 1",
              "key = \"#\".join(map(str, cnt))",
            ],
          },
          state: [
            { name: "word", value: "\"eat\"" },
            { name: "Non-zero slots", value: "a:1, e:1, t:1", changed: true },
            { name: "Canonical key", value: "\"1#0#0#0#1#...#1#...\"", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Selected slots of cnt[26] for \"eat\"",
                cells: [
                  { id: "a0", value: "a:1", index: 0, state: "active" },
                  { id: "a1", value: "b:0", index: 1, state: "dim" },
                  { id: "a2", value: "e:1", index: 2, state: "active" },
                  { id: "a3", value: "n:0", index: 3, state: "dim" },
                  { id: "a4", value: "t:1", index: 4, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "idx 0", tone: "ok" },
                  { index: 2, label: "idx 4", tone: "ok" },
                  { index: 4, label: "idx 19", tone: "ok" },
                ],
              },
            ],
            caption: "Any permutation of 'a', 'e', 't' produces the exact same 26-count signature.",
          },
        },
        {
          title: "Group anagrams under identical cnt[26] map keys",
          tag: "TRACE",
          explanation: [
            "Scanning `[\"eat\", \"tea\", \"tan\", \"ate\"]`: `\"eat\"`, `\"tea\"`, and `\"ate\"` share the key `(a:1, e:1, t:1)`, so all three append to Group 1.",
            "`\"tan\"` has `(a:1, n:1, t:1)`, forming Group 2 in the same `groups` Hash Map.",
          ],
          code: [
            "groups ← empty Hash Map",
            "for each w in words:",
            "    key ← count_key(w)",
            "    if key not in groups: groups[key] ← []",
            "    groups[key].append(w)",
          ],
          activeLines: [3, 4, 5],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "groups = {}",
              "for w in words:",
              "    key = count_key(w)",
              "    if key not in groups: groups[key] = []",
              "    groups[key].append(w)",
            ],
          },
          state: [
            { name: "Group 1 key (a1,e1,t1)", value: "[\"eat\", \"tea\", \"ate\"]", changed: true },
            { name: "Group 2 key (a1,n1,t1)", value: "[\"tan\"]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "groups[\"1#0#...#1#...#1#0\"] (a:1, e:1, t:1)",
                cells: [
                  { id: "g1-0", value: "eat", index: 0, state: "done" },
                  { id: "g1-1", value: "tea", index: 1, state: "done" },
                  { id: "g1-2", value: "ate", index: 2, state: "active" },
                ],
                pointers: [{ index: 2, label: "appended", tone: "ok" }],
              },
              {
                label: "groups[\"1#0#...#1#...#1#0\"] (a:1, n:1, t:1)",
                cells: [
                  { id: "g2-0", value: "tan", index: 0, state: "active" },
                ],
                pointers: [{ index: 0, label: "new bucket", tone: "accent" }],
              },
            ],
            caption: "Each distinct 26-count string acts as an exact O(1) bucket key for its anagram family.",
          },
        },
        {
          title: "Longest Consecutive Sequence skips x when x - 1 exists",
          tag: "TRACE",
          explanation: [
            "Load `nums = [100, 4, 200, 1, 3, 2]` into Hash Set `s`.",
            "When checking `4`, `3 in s` is `true`, so `4` is not a streak start and is skipped immediately without counting upward.",
          ],
          code: [
            "s ← Hash Set of all x in nums",
            "best ← 0",
            "for each x in s:",
            "    if (x - 1) in s: continue   // not a start",
            "    // walk forward from x...",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "s = set(nums)",
              "best = 0",
              "for x in s:",
              "    if (x - 1) in s: continue   # not a start",
              "    # walk forward from x...",
            ],
          },
          state: [
            { name: "Checking x = 4", value: "3 in s == true -> skip", changed: true },
            { name: "best so far", value: "1 (from 100)" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Unique keys in Hash Set s",
                cells: [
                  { id: "s0", value: "100", index: 0, state: "done" },
                  { id: "s1", value: "4", index: 1, state: "pivot" },
                  { id: "s2", value: "200", index: 2 },
                  { id: "s3", value: "1", index: 3 },
                  { id: "s4", value: "3", index: 4, state: "active" },
                  { id: "s5", value: "2", index: 5 },
                ],
                pointers: [
                  { index: 1, label: "x = 4 (skip)", tone: "coral" },
                  { index: 4, label: "x - 1 = 3 exists", tone: "accent" },
                ],
              },
            ],
            caption: "Because 3 is in s, 4 cannot start a maximal consecutive streak.",
          },
        },
        {
          title: "Start only at x = 1 (0 absent) and walk 1 -> 2 -> 3 -> 4",
          tag: "PATTERN",
          explanation: [
            "At `x = 1`, `0 in s` is `false`, confirming `1` is the true start of a consecutive run.",
            "The inner `while` loop advances `1 -> 2 -> 3 -> 4` (stopping when `5` is absent), recording `best = 4` in `O(n)` total steps.",
          ],
          code: [
            "    cur ← x",
            "    while (cur + 1) in s:",
            "        cur ← cur + 1",
            "    best ← max(best, cur - x + 1)",
            "return best",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "    cur = x",
              "    while (cur + 1) in s:",
              "        cur += 1",
              "    best = max(best, cur - x + 1)",
              "return best",
            ],
          },
          state: [
            { name: "Streak start", value: "x = 1 (0 absent)", changed: true },
            { name: "Streak walked", value: "1 -> 2 -> 3 -> 4 (len 4)", changed: true },
            { name: "best", value: "4", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Unique keys in Hash Set s (unordered)",
                cells: [
                  { id: "s0", value: "100", index: 0, state: "dim" },
                  { id: "s1", value: "4", index: 1, state: "done" },
                  { id: "s2", value: "200", index: 2, state: "dim" },
                  { id: "s3", value: "1", index: 3, state: "active" },
                  { id: "s4", value: "3", index: 4, state: "done" },
                  { id: "s5", value: "2", index: 5, state: "done" },
                ],
                pointers: [
                  { index: 3, label: "start: 1 (0 absent)", tone: "coral" },
                  { index: 1, label: "end: 4 (5 absent)", tone: "ok" },
                ],
              },
            ],
            caption: "Each element is walked at most once because only true starts trigger the inner loop.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Forgetting the delimiter in cnt[26] anagram keys",
        detail:
          "Joining counts without `'#'` merges `[1, 11]` and `[11, 1]` into the identical string `\"111\"`. Separating all 26 numbers with `'#'` keeps every 26-slot signature unique.",
      },
      {
        title: "Looping over raw nums instead of the deduplicated set",
        detail:
          "In Longest Consecutive Sequence, if `nums` has `50,000` copies of `1` followed by `2..50,000`, looping over `nums` starts the `50,000`-step walk `50,000` times (`O(n^2)`). Always loop `for each x in s` over the Hash Set itself.",
        code: "for each x in s:   // NOT for each x in nums",
      },
      {
        title: "Empty input in Longest Consecutive Sequence",
        detail:
          "Initialize `best = 0` so an empty list `[]` skips the loop and returns `0`.",
      },
    ],
    practiceTask: {
      title: "First Repeated Value",
      tier: "Warmup",
      goal: "Given an integer array `nums`, return the first value whose second occurrence appears earliest when scanning left to right, or `-1` if all elements are distinct.",
      constraints: ["0 <= len(nums) <= 10^5", "-10^9 <= nums[i] <= 10^9", "Target: O(n) avg time, O(n) space"],
      examples: [
        { input: "nums = [5, 1, 9, 1, 5]", output: "1", explanation: "1 repeats at index 3 before 5 repeats at index 4." },
        { input: "nums = [3, 7, 8]", output: "-1" },
      ],
      tasks: [
        "Create an empty Hash Set `seen`.",
        "Scan `nums`: if `x in seen` return `x`; otherwise `seen.add(x)`.",
      ],
      starterCode: "function first_repeated(nums):\n    // TODO: return first duplicate encountered in O(n) avg",
      expectedOutput: "1\n-1",
      hint: "Checking `x in seen` during a single left-to-right pass guarantees you catch the earliest second occurrence.",
      complexity: { time: "O(n) average", space: "O(n)" },
      solutionCode:
        "function first_repeated(nums):\n    seen ← empty Hash Set\n    for each x in nums:\n        if x in seen:\n            return x\n        seen.add(x)\n    return -1",
    },
    practiceChallenges: [
      {
        title: "First Repeated Value",
        tier: "Warmup",
        goal: "Given an integer array `nums`, return the first value whose second occurrence appears earliest when scanning left to right, or `-1` if all elements are distinct.",
        constraints: ["0 <= len(nums) <= 10^5", "-10^9 <= nums[i] <= 10^9", "Target: O(n) avg time, O(n) space"],
        examples: [
          { input: "nums = [5, 1, 9, 1, 5]", output: "1", explanation: "1 repeats at index 3 before 5 repeats at index 4." },
          { input: "nums = [3, 7, 8]", output: "-1" },
        ],
        tasks: [
          "Create an empty Hash Set `seen`.",
          "Scan `nums`: if `x in seen` return `x`; otherwise `seen.add(x)`.",
        ],
        starterCode: "function first_repeated(nums):\n    // TODO: return first duplicate encountered in O(n) avg",
        expectedOutput: "1\n-1",
        hint: "Checking `x in seen` during a single left-to-right pass guarantees you catch the earliest second occurrence.",
        complexity: { time: "O(n) average", space: "O(n)" },
        solutionCode:
          "function first_repeated(nums):\n    seen ← empty Hash Set\n    for each x in nums:\n        if x in seen:\n            return x\n        seen.add(x)\n    return -1",
      },
      {
        title: "Group Anagrams with 26-Count Key",
        tier: "Core",
        goal: "Group all anagram words in `words` using a delimited 26-letter frequency signature as the Hash Map key without sorting.",
        constraints: ["0 <= len(words) <= 10^4", "Lowercase 'a'..'z' only", "Do not call sort()"],
        examples: [
          {
            input: "words = [\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]",
            output: "[[\"eat\", \"tea\", \"ate\"], [\"tan\", \"nat\"], [\"bat\"]]",
          },
          {
            input: "words = [\"\", \"a\", \"\"]",
            output: "[[\"\", \"\"], [\"a\"]]",
            explanation: "Both empty strings share the all-zero 26-count signature and group together.",
          },
        ],
        tasks: [
          "Count letter frequencies of each word into `cnt[26]` and serialize with `'#'` delimiters.",
          "Append each word to `groups[key]` in one pass.",
        ],
        starterCode: "function group_anagrams(words):\n    // TODO: canonical cnt[26] key without sort()",
        expectedOutput: "[[\"eat\", \"tea\", \"ate\"], [\"tan\", \"nat\"], [\"bat\"]]\n[[\"\", \"\"], [\"a\"]]",
        hint: "Build the key string with a loop over `0..25` separated by `'#'` so counts never blur together.",
        complexity: { time: "O(n * L)", space: "O(n * L)" },
        solutionCode:
          "function count_key(w):\n    cnt ← array of 26 zeros\n    for each ch in w:\n        cnt[ord(ch) - ord('a')] += 1\n    key ← \"\"\n    for i from 0 to 25:\n        key ← key + str(cnt[i]) + \"#\"\n    return key\n\nfunction group_anagrams(words):\n    groups ← empty Hash Map\n    order ← empty list\n    for each w in words:\n        key ← count_key(w)\n        if key not in groups:\n            groups[key] ← empty list\n            order.append(key)\n        groups[key].append(w)\n    out ← empty list\n    for each key in order:\n        out.append(groups[key])\n    return out",
      },
      {
        title: "Longest Consecutive Sequence",
        tier: "Stretch",
        goal: "Given an unsorted integer array `nums` (which may contain duplicates and negatives), return the length of the longest consecutive integer sequence in `O(n)` average time.",
        constraints: ["0 <= len(nums) <= 10^5", "-10^9 <= nums[i] <= 10^9", "Target: O(n) avg time, O(n) space; no sorting"],
        examples: [
          { input: "nums = [100, 4, 200, 1, 3, 2]", output: "4", explanation: "Consecutive sequence is [1, 2, 3, 4]." },
          { input: "nums = [0, -1, 1, 2, 2]", output: "4", explanation: "Consecutive sequence is [-1, 0, 1, 2]." },
        ],
        tasks: [
          "Insert every element of `nums` into a Hash Set `s`.",
          "Iterate `for each x in s`: skip if `(x - 1) in s`; otherwise walk `cur` forward while `(cur + 1) in s` and update `best`.",
        ],
        starterCode: "function longest_consecutive(nums):\n    // TODO: O(n) average Hash Set solution",
        expectedOutput: "4\n4",
        hint: "Looping over `s` instead of `nums` prevents duplicate streak starts from degrading performance on inputs with heavy repetition.",
        complexity: { time: "O(n) average", space: "O(n)" },
        solutionCode:
          "function longest_consecutive(nums):\n    s ← Hash Set of all x in nums\n    best ← 0\n    for each x in s:\n        if (x - 1) in s:\n            continue\n        cur ← x\n        while (cur + 1) in s:\n            cur ← cur + 1\n        best ← max(best, cur - x + 1)\n    return best",
      },
    ],
  },

  "dsa-hash-lookup": {
    lessonId: "dsa-hash-lookup",
    subtitle:
      "Solve Two-Sum in a single O(n) pass by checking target - x before inserting, count Subarray Sum Equals K by combining M03 Prefix Sums with seen_prefix[curr - k], and apply the exact same pattern to Count Subarrays with XOR K.",
    intro: {
      heading: "Complement & Prefix-Map Lookups",
      explanation: [
        "Scanning backward for a pair or testing every subarray `[l..r]` runs in `O(n^2)` time—5 billion checks at `n = 100,000`. Even after switching to a Hash Map, two subtle bugs strike: inserting `seen_idx[x] = i` before querying `target - x` pairs `nums = [3, 4], target = 6` with itself (`[0, 0]`), and storing booleans instead of frequencies on Subarray Sum K misses repeated sums caused by negative numbers.",
        "Querying `seen_idx` *before* inserting fixes Two-Sum in one `O(n)` pass. Seeding a frequency map with `{0: 1}` and querying `seen_sum[curr - k]` (or `seen_xor[curr_xor ^ k]` for XOR) *before* incrementing `curr` counts every matching subarray in `O(n)` average time.",
      ],
      analogy:
        "Walking a trail with a step counter: if your counter currently reads 12 km and you want to know how many trail segments ending right under your feet measured 5 km, you check how many earlier trail markers you logged at `12 - 5 = 7` km rather than walking backward.",
      realWorldUses: [
        "Matching complementary payment or order amounts to a target budget in one real-time pass",
        "Counting all contiguous time slices whose net balance delta hits an exact target K (even with negative values)",
      ],
    },
    sections: [
      {
        heading: "Single-pass Two-Sum: check complement before inserting",
        paragraphs: [
          "Compare a linear scan vs a Hash Map lookup on `nums = [2, 7, 11, 15], target = 9`: nested loops test every pair `(i, j)`. With a Hash Map `seen_idx`, `i = 0` (`x = 2`) checks `9 - 2 = 7` (miss) and records `2 -> 0`; `i = 1` (`x = 7`) checks `9 - 7 = 2` (hit at `0`!) and returns `[0, 1]` in `O(1)` lookup.",
          "Look up `need = target - x` in `seen_idx` **before** writing `seen_idx[x] = i`. On `nums = [3, 4], target = 6`, inserting first lets `i = 0` (`x = 3`) find `6 - 3 = 3` at `0` (broken `[0, 0]`), whereas querying first returns nothing at `i = 0` and still matches `[3, 3], target = 6` when the second `3` arrives.",
        ],
        code: [
          "# Broken: inserting nums[i] before checking pairs [3] with itself when target=6",
          "def two_sum_bug(nums, target):",
          "    seen = {}",
          "    for i, x in enumerate(nums):",
          "        seen[x] = i                  # wrong: writes index before lookup",
          "        if target - x in seen:",
          "            return [seen[target - x], i]",
          "",
          "# Working: check complement first, then insert nums[i]",
          "def two_sum_ok(nums, target):",
          "    seen = {}",
          "    for i, x in enumerate(nums):",
          "        if target - x in seen:",
          "            return [seen[target - x], i]",
          "        seen[x] = i",
          "    return [-1, -1]",
        ],
        codeLabel: "Python",
        output: "two_sum_bug([3], 6) -> [0, 0] (self-pair!) | two_sum_ok([3], 6) -> [-1, -1] | two_sum_ok([3, 3], 6) -> [0, 1]",
        table: {
          caption: "Two-Sum implementations compared",
          headers: ["Variant", "What happens on [3, 4], target = 6", "Passes", "Time / Space"],
          rows: [
            ["Nested `(i, j)` loops", "Checks all pairs, returns `[-1, -1]`", "`O(n^2)`", "`O(n^2)` / `O(1)`"],
            ["Insert first, check second", "Finds `6 - 3 = 3` at `0` -> BUG `[0, 0]`", "1 pass", "Wrong on `x = target / 2`"],
            ["Check `target - x` before insert", "Checks `3` (absent), inserts `3->0`", "1 pass", "`O(n)` avg / `O(n)`"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Always query `seen_idx` *before* writing `seen_idx[x] = i`. Reversing those two lines pairs an element with itself whenever `2 * x == target`.",
        },
      },
      {
        heading: "Prefix Sums & Prefix XOR + Frequency Hash Map",
        paragraphs: [
          "From Module 03, subarray `[l..r]` sums to `pref[r + 1] - pref[l]`, so `curr - earlier == k` rearranges to `earlier == curr - k`. Seed `seen_sum = {0: 1}` (the empty prefix before index `0`). Trace `[2, -2, 2], k = 2`: `i=0` (`curr=2`) adds `seen[0]=1`, sets `seen[2]=1`; `i=1` (`curr=0`) adds `seen[-2]=0`, sets `seen[0]=2`; `i=2` (`curr=2`) adds `seen[0]=2` (both `[2,-2,2]` and `[2]`!) -> `ans = 3`.",
          "Because negative numbers and zeros repeat prefix values, storing *frequencies* (instead of booleans) counts every valid left boundary at once. By Module 02's XOR cancellation (`a ^ a = 0`), `curr_xor ^ earlier == k` rearranges to `earlier == curr_xor ^ k`, using the exact same `{0: 1}` seed and query-before-update order.",
          "When finding the **longest** subarray with sum `k` instead of the count, seed `first_idx = {0: -1}` and write `first_idx[curr] = i` only when `curr` is not yet in `first_idx` so later repeats never overwrite the earliest left boundary.",
        ],
        code: [
          "# Longest subarray with sum == k: keep the earliest index for each prefix sum",
          "nums = [1, -1, 1, -1]; k = 0",
          "first_idx = {0: -1}             # empty prefix ends at -1; never overwrite!",
          "curr = 0; best = 0",
          "for i, x in enumerate(nums):",
          "    curr += x",
          "    if curr - k in first_idx:",
          "        best = max(best, i - first_idx[curr - k])",
          "    if curr not in first_idx:      # dropping this guard overwrites {0: -1} -> {0: 1}",
          "        first_idx[curr] = i",
        ],
        codeLabel: "Python",
        output: "With non-overwrite rule: best=4 ([1, -1, 1, -1]) | If overwritten at i=1: best=2",
        table: {
          caption: "Side-by-side blueprint for Complement and Prefix-Map lookups",
          headers: ["Problem", "Running state", "Initial seed", "Lookup query (before update)", "Map update"],
          rows: [
            ["Two-Sum", "`x = nums[i]`", "`{}` (empty)", "`target - x` in `seen_idx`", "`seen_idx[x] = i`"],
            ["Subarray Sum Equals K", "`curr += x`", "`{0: 1}`", "`ans += seen_sum.get(curr - k, 0)`", "`seen_sum[curr] += 1`"],
            ["Subarray XOR Equals K", "`curr_xor ^= x`", "`{0: 1}`", "`ans += seen_xor.get(curr_xor ^ k, 0)`", "`seen_xor[curr_xor] += 1`"],
          ],
          highlightCol: 3,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Seeding `{0: 1}` represents the empty prefix before index `0`, so subarrays starting at index `0` (`curr == k`) are counted automatically without extra `if` branches.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From Self-Pair Bugs to Query-Before-Update Hash Maps",
      steps: [
        {
          label: "Step 1: Broken Two-Sum (inserts before querying)",
          explanation: "Storing `seen_idx[x] = i` first causes `x = target / 2` to match itself and return `[i, i]`.",
          code: [
            "function two_sum_broken(nums, target):",
            "    seen ← empty Hash Map",
            "    for i from 0 to len(nums) - 1:",
            "        seen[nums[i]] ← i   // WRONG order",
            "        if (target - nums[i]) in seen: return [seen[target - nums[i]], i]",
            "    return [-1, -1]",
          ],
          activeLines: [4, 5],
          output: "two_sum_broken([3, 4], 6) -> [0, 0] (bug!)",
        },
        {
          label: "Step 2: Query complement before inserting (valid Two-Sum)",
          explanation: "Checking `target - nums[i]` before inserting guarantees two distinct indices `j < i`.",
          code: [
            "function two_sum(nums, target):",
            "    seen ← empty Hash Map",
            "    for i from 0 to len(nums) - 1:",
            "        need ← target - nums[i]",
            "        if need in seen: return [seen[need], i]",
            "        seen[nums[i]] ← i",
            "    return [-1, -1]",
          ],
          activeLines: [4, 5, 6],
          output: "two_sum([3, 4], 6) -> [-1, -1]; two_sum([3, 3], 6) -> [0, 1]",
        },
        {
          label: "Step 3: Prefix-Sum frequency map seeded with {0: 1}",
          explanation: "Query `seen_sum.get(curr - k, 0)` before incrementing `seen_sum[curr]` so subarrays starting at index `0` and repeated sums both count.",
          code: [
            "function subarray_sum_k(nums, k):",
            "    seen_sum ← {0: 1}; curr ← 0; ans ← 0",
            "    for x in nums:",
            "        curr += x",
            "        ans += seen_sum.get(curr - k, 0)",
            "        seen_sum[curr] ← seen_sum.get(curr, 0) + 1",
            "    return ans",
          ],
          activeLines: [2, 5, 6],
          output: "subarray_sum_k([2, -2, 2], 2) -> 3",
        },
      ],
    },
    walkthrough: {
      title: "Trace single-pass Two-Sum, Subarray Sum K, and Subarray XOR K",
      layout: "visual-first",
      steps: [
        {
          title: "Two-Sum check-before-insert avoids self-pairing at i = 0",
          tag: "TRACE",
          explanation: [
            "On `nums = [3, 2, 4]`, `target = 6`, visit `i = 0` (`x = 3`). Compute `need = 6 - 3 = 3`.",
            "Because we check `seen_idx` before inserting `3 -> 0`, `3` is not found yet, avoiding the self-pair bug `[0, 0]`. Then we record `seen_idx[3] = 0`.",
          ],
          code: [
            "seen_idx ← empty Hash Map",
            "for i from 0 to len(nums) - 1:",
            "    need ← target - nums[i]",
            "    if need in seen_idx: return [seen_idx[need], i]",
            "    seen_idx[nums[i]] ← i",
          ],
          activeLines: [3, 4, 5],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "seen_idx = {}",
              "for i, x in enumerate(nums):",
              "    need = target - x",
              "    if need in seen_idx: return [seen_idx[need], i]",
              "    seen_idx[x] = i",
            ],
          },
          state: [
            { name: "i = 0 (x = 3)", value: "need = 3 (not in seen)", changed: true },
            { name: "seen_idx after i=0", value: "{3: 0}", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Two-Sum on [3, 2, 4], target = 6",
                cells: [
                  { id: "ts0", value: "3", index: 0, state: "active" },
                  { id: "ts1", value: "2", index: 1, state: "dim" },
                  { id: "ts2", value: "4", index: 2, state: "dim" },
                ],
                pointers: [{ index: 0, label: "need 3; +3->0", tone: "coral" }],
              },
            ],
            caption: "Checking before inserting stops index 0 from matching itself.",
          },
        },
        {
          title: "Two-Sum finds complement 2 at i = 2 in O(1)",
          tag: "TRACE",
          explanation: [
            "At `i = 1` (`x = 2`), `need = 4` is absent so we store `seen_idx[2] = 1`.",
            "At `i = 2` (`x = 4`), `need = 6 - 4 = 2` hits `seen_idx[2] == 1`, returning `[1, 2]` in one pass.",
          ],
          code: [
            "// i = 1: need 4 absent -> seen_idx[2] = 1",
            "// i = 2: x = 4, need = 6 - 4 = 2",
            "if 2 in seen_idx:",
            "    return [seen_idx[2], 2]   // [1, 2]",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "i = 2 (x = 4)", value: "need = 2 -> hit index 1!", changed: true },
            { name: "Answer", value: "[1, 2]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Match found at indices [1, 2]",
                cells: [
                  { id: "ts0", value: "3", index: 0, state: "dim" },
                  { id: "ts1", value: "2", index: 1, state: "done" },
                  { id: "ts2", value: "4", index: 2, state: "active" },
                ],
                pointers: [
                  { index: 1, label: "seen_idx[2] = 1", tone: "ok" },
                  { index: 2, label: "i = 2 (2 + 4 = 6)", tone: "coral" },
                ],
              },
            ],
            caption: "One map lookup pairs index 2 with earlier index 1.",
          },
        },
        {
          title: "Subarray Sum Equals K pairs M03 Prefix Sums with seen_prefix",
          tag: "CONCEPT",
          explanation: [
            "For `nums = [1, 2, -2, 2]`, `k = 2`, seed `seen_prefix = {0: 1}`.",
            "At `i = 0` (`curr = 1`), `1 - 2 = -1` adds `0` and stores `seen[1] = 1`. At `i = 1` (`curr = 3`), `3 - 2 = 1` finds `seen[1] = 1`, counting subarray `[2]` (`ans = 1`).",
          ],
          code: [
            "seen ← {0: 1}; curr ← 0; ans ← 0",
            "for each x in nums:",
            "    curr ← curr + x",
            "    ans ← ans + seen.get(curr - k, 0)",
            "    seen[curr] ← seen.get(curr, 0) + 1",
          ],
          activeLines: [3, 4, 5],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "seen = {0: 1}; curr = 0; ans = 0",
              "for x in nums:",
              "    curr += x",
              "    ans += seen.get(curr - k, 0)",
              "    seen[curr] = seen.get(curr, 0) + 1",
            ],
          },
          state: [
            { name: "After i = 1", value: "curr = 3, need = 1 -> +1", changed: true },
            { name: "seen_prefix", value: "{0:1, 1:1, 3:1}" },
            { name: "ans", value: "1", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input nums = [1, 2, -2, 2], k = 2",
                cells: [
                  { id: "n0", value: "1", index: 0, state: "done" },
                  { id: "n1", value: "2", index: 1, state: "active" },
                  { id: "n2", value: "-2", index: 2, state: "dim" },
                  { id: "n3", value: "2", index: 3, state: "dim" },
                ],
                pointers: [{ index: 1, label: "[2] sums 2", tone: "ok" }],
              },
              {
                label: "Prefix sums [0, 1, 3, ...]",
                cells: [
                  { id: "p0", value: "0", index: 0, state: "done" },
                  { id: "p1", value: "1", index: 1, state: "done" },
                  { id: "p2", value: "3", index: 2, state: "active" },
                ],
                pointers: [
                  { index: 1, label: "curr - k = 1", tone: "accent" },
                  { index: 2, label: "curr = 3", tone: "coral" },
                ],
              },
            ],
            caption: "Difference between prefix 3 and earlier prefix 1 equals k = 2.",
          },
        },
        {
          title: "Negatives repeat prefix sums, so frequencies count all matches",
          tag: "PITFALL",
          explanation: [
            "At `i = 2` (`-2`), `curr` drops back to `1`, raising `seen[1]` from `1` to `2`.",
            "At `i = 3` (`2`), `curr = 3` again queries `need = 3 - 2 = 1`. Because `seen[1] == 2`, we add `+2` at once for `[2, -2, 2]` and `[2]`, giving `ans = 3`.",
          ],
          callout: {
            kind: "WATCH OUT",
            text: "A boolean Hash Set cannot tell whether prefix sum `1` appeared once or twice. Storing frequency counts captures every repeating prefix caused by negatives or zeros.",
          },
          code: [
            "// i = 2 (-2): curr = 1 -> seen[1] becomes 2",
            "// i = 3 (2):  curr = 3",
            "ans ← ans + seen.get(3 - 2, 0)   // +2 -> ans = 3",
            "seen[3] ← seen.get(3, 0) + 1     // seen[3] = 2",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "seen[1]", value: "2 (at pref[1] & pref[3])", changed: true },
            { name: "i = 3 match", value: "+2 subarrays ([1..3], [3..3])", changed: true },
            { name: "Total ans", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Input nums = [1, 2, -2, 2], k = 2",
                cells: [
                  { id: "n0", value: "1", index: 0, state: "dim" },
                  { id: "n1", value: "2", index: 1, state: "done" },
                  { id: "n2", value: "-2", index: 2, state: "done" },
                  { id: "n3", value: "2", index: 3, state: "active" },
                ],
                pointers: [{ index: 3, label: "+2 matches", tone: "ok" }],
              },
              {
                label: "Full prefix sums [0, 1, 3, 1, 3] for [1, 2, -2, 2]",
                cells: [
                  { id: "p0", value: "0", index: 0, state: "dim" },
                  { id: "p1", value: "1", index: 1, state: "done" },
                  { id: "p2", value: "3", index: 2, state: "dim" },
                  { id: "p3", value: "1", index: 3, state: "done" },
                  { id: "p4", value: "3", index: 4, state: "active" },
                ],
                pointers: [
                  { index: 1, label: "pref 1 (#1)", tone: "ok" },
                  { index: 3, label: "pref 1 (#2)", tone: "ok" },
                  { index: 4, label: "curr = 3", tone: "coral" },
                ],
              },
            ],
            caption: "Two earlier occurrences of prefix 1 produce two valid subarrays ending at index 3.",
          },
        },
        {
          title: "Count Subarrays with XOR K mirrors Prefix Sum with ^",
          tag: "PATTERN",
          explanation: [
            "On `nums = [4, 2, 2, 6, 4]`, `k = 6`, replace `+` with `^` (XOR) and `curr - k` with `curr ^ k`.",
            "Prefix XORs are `[0, 4, 6, 4, 2, 6]`: `6^6=0` at `i=1` (`+1`), `2^6=4` hits `seen[4]=2` at `i=3` (`+2`), and `6^6=0` at `i=4` (`+1`), yielding `4` subarrays total.",
          ],
          code: [
            "seen_xor ← {0: 1}; curr_xor ← 0; ans ← 0",
            "for each x in nums:",
            "    curr_xor ← curr_xor ^ x",
            "    ans ← ans + seen_xor.get(curr_xor ^ k, 0)",
            "    seen_xor[curr_xor] ← seen_xor.get(curr_xor, 0) + 1",
          ],
          activeLines: [3, 4, 5],
          codeLabel: "Pseudocode",
          state: [
            { name: "i = 3 (x = 6)", value: "curr_xor=2, need=2^6=4 (+2)", changed: true },
            { name: "i = 4 (x = 4)", value: "curr_xor=6, need=6^6=0 (+1)", changed: true },
            { name: "Total XOR=6 subarrays", value: "4", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Prefix XORs [0, 4, 6, 4, 2, 6] for [4, 2, 2, 6, 4], k = 6",
                cells: [
                  { id: "px0", value: "0", index: 0, state: "done" },
                  { id: "px1", value: "4", index: 1, state: "done" },
                  { id: "px2", value: "6", index: 2, state: "done" },
                  { id: "px3", value: "4", index: 3, state: "done" },
                  { id: "px4", value: "2", index: 4, state: "done" },
                  { id: "px5", value: "6", index: 5, state: "active" },
                ],
                pointers: [
                  { index: 0, label: "px=0 seed", tone: "ok" },
                  { index: 5, label: "px=6 -> 0", tone: "coral" },
                ],
              },
            ],
            caption: "XOR is its own inverse: curr_xor ^ earlier == k iff earlier == curr_xor ^ k.",
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Missing {0: 1} seed drops subarrays starting at index 0",
        detail:
          "Whenever `curr == k` at index `r`, the subarray `[0..r]` sums (or XORs) to `k`. That matches `curr - k == 0` (or `curr_xor ^ k == 0`), which is only counted if `seen[0] = 1` was seeded before the loop.",
      },
      {
        title: "Updating the map before querying breaks k = 0",
        detail:
          "If `k = 0` and you increment `seen[curr]` before adding `seen[curr - 0]`, the current prefix counts itself as a 0-length subarray! Always query `seen[curr - k]` (or `seen[curr_xor ^ k]`) first, then update `seen[curr]`.",
        code: "ans += seen.get(curr - k, 0)   // 1st: query\nseen[curr] = seen.get(curr, 0) + 1   // 2nd: update",
      },
      {
        title: "Sliding window fails when negatives are present",
        detail:
          "Shrinking a window when `window_sum > k` assumes adding elements always increases the sum. Negative values break that assumption, whereas Prefix Sums + a Hash Map handle positives, zeros, and negatives in `O(n)`.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does this buggy Two-Sum return on nums = [3, 2, 4] with target = 6?",
        code: "seen ← {}\nfor i from 0 to len(nums) - 1:\n    seen[nums[i]] ← i\n    need ← target - nums[i]\n    if need in seen:\n        return [seen[need], i]",
        options: [
          { id: "a", label: "[1, 2]" },
          { id: "b", label: "[-1, -1]" },
          { id: "c", label: "[0, 2]" },
          { id: "d", label: "[0, 0] (index 0 pairs with itself)" },
        ],
        correctId: "d",
        explanation: "Inserting nums[0] = 3 into seen before checking target - nums[0] lets index 0 match itself when target == 2 * nums[0]. Query seen before inserting so i and seen[need] stay distinct.",
      },
      {
        prompt: "What does this buggy subarray-sum counter return for nums = [1, 2], k = 0?",
        code: "seen ← {0: 1}; curr ← 0; ans ← 0\nfor each x in nums:\n    curr ← curr + x\n    seen[curr] ← seen.get(curr, 0) + 1\n    ans ← ans + seen.get(curr - k, 0)\nreturn ans",
        options: [
          { id: "a", label: "2 (counts each prefix against itself when k = 0)" },
          { id: "b", label: "0 (the true count)" },
          { id: "c", label: "1 (counts only the full array)" },
          { id: "d", label: "3 (includes the seed entry {0: 1})" },
        ],
        correctId: "a",
        explanation: "Updating seen[curr] before querying seen[curr - k] adds 1 for the prefix you just inserted whenever k = 0, counting an empty slice at every index.",
      },
    ],
    practiceTask: {
      title: "Single-Pass Two-Sum Indices",
      tier: "Warmup",
      goal: "Given an integer array `nums` and `target`, return the 0-based index pair `[i, j]` (`i < j`) such that `nums[i] + nums[j] == target` in a single `O(n)` pass, or `[-1, -1]` if no pair exists.",
      constraints: ["2 <= len(nums) <= 10^5", "-10^9 <= nums[i], target <= 10^9", "Target: O(n) avg time, O(n) space"],
      examples: [
        { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]" },
        { input: "nums = [3, 3], target = 6", output: "[0, 1]" },
      ],
      tasks: [
        "Check `target - nums[i]` in `seen_idx` before writing `seen_idx[nums[i]] = i`.",
        "Return `[seen_idx[need], i]` on hit, or `[-1, -1]` after the loop.",
      ],
      starterCode: "function two_sum_single_pass(nums, target):\n    // TODO: check complement before insert",
      expectedOutput: "[1, 2]\n[0, 1]",
      hint: "In `[3, 2, 4]` with `target = 6`, checking before inserting keeps index `0` (`3`) from pairing with itself.",
      complexity: { time: "O(n) average", space: "O(n)" },
      solutionCode:
        "function two_sum_single_pass(nums, target):\n    seen_idx ← empty Hash Map\n    for i from 0 to len(nums) - 1:\n        need ← target - nums[i]\n        if need in seen_idx:\n            return [seen_idx[need], i]\n        seen_idx[nums[i]] ← i\n    return [-1, -1]",
    },
    practiceChallenges: [
      {
        title: "Single-Pass Two-Sum Indices",
        tier: "Warmup",
        goal: "Given an integer array `nums` and `target`, return the 0-based index pair `[i, j]` (`i < j`) such that `nums[i] + nums[j] == target` in a single `O(n)` pass, or `[-1, -1]` if no pair exists.",
        constraints: ["2 <= len(nums) <= 10^5", "-10^9 <= nums[i], target <= 10^9", "Target: O(n) avg time, O(n) space"],
        examples: [
          { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]" },
          { input: "nums = [3, 3], target = 6", output: "[0, 1]" },
        ],
        tasks: [
          "Check `target - nums[i]` in `seen_idx` before writing `seen_idx[nums[i]] = i`.",
          "Return `[seen_idx[need], i]` on hit, or `[-1, -1]` after the loop.",
        ],
        starterCode: "function two_sum_single_pass(nums, target):\n    // TODO: check complement before insert",
        expectedOutput: "[1, 2]\n[0, 1]",
        hint: "In `[3, 2, 4]` with `target = 6`, checking before inserting keeps index `0` (`3`) from pairing with itself.",
        complexity: { time: "O(n) average", space: "O(n)" },
        solutionCode:
          "function two_sum_single_pass(nums, target):\n    seen_idx ← empty Hash Map\n    for i from 0 to len(nums) - 1:\n        need ← target - nums[i]\n        if need in seen_idx:\n            return [seen_idx[need], i]\n        seen_idx[nums[i]] ← i\n    return [-1, -1]",
      },
      {
        title: "Count Subarrays Summing to K",
        tier: "Core",
        goal: "Count all contiguous subarrays in `nums` whose sum equals `k`, handling negative values and zeros in `O(n)` average time.",
        constraints: ["1 <= len(nums) <= 10^5", "-10^4 <= nums[i] <= 10^4", "Target: O(n) avg time, O(n) space"],
        examples: [
          { input: "nums = [1, 2, -2, 2], k = 2", output: "3" },
          { input: "nums = [1, -1, 0], k = 0", output: "3" },
        ],
        tasks: [
          "Seed `seen = {0: 1}`.",
          "Accumulate `curr += x`, add `seen.get(curr - k, 0)`, then increment `seen[curr]`.",
        ],
        starterCode: "function count_subarrays_sum_k(nums, k):\n    // TODO: prefix sum + frequency map",
        expectedOutput: "3\n3",
        hint: "Using a frequency map rather than a set counts multiple matching earlier prefixes when negative numbers bring `curr` back to an old sum.",
        complexity: { time: "O(n) average", space: "O(n)" },
        solutionCode:
          "function count_subarrays_sum_k(nums, k):\n    seen ← {0: 1}\n    curr ← 0\n    ans ← 0\n    for each x in nums:\n        curr ← curr + x\n        ans ← ans + seen.get(curr - k, 0)\n        seen[curr] ← seen.get(curr, 0) + 1\n    return ans",
      },
      {
        title: "Count Subarrays with XOR Equal to K",
        tier: "Stretch",
        goal: "Given non-negative integers `nums` and integer `k`, return the number of contiguous subarrays whose bitwise XOR equals `k` in `O(n)` average time.",
        constraints: ["1 <= len(nums) <= 10^5", "0 <= nums[i], k <= 10^9", "Target: O(n) avg time, O(n) space"],
        examples: [
          {
            input: "nums = [4, 2, 2, 6, 4], k = 6",
            output: "4",
            explanation: "[4, 2], [2, 2, 6], [6], and [4, 2, 2, 6, 4].",
          },
          { input: "nums = [5, 6, 7, 8, 9], k = 5", output: "2", explanation: "[5] and [5, 6, 7, 8, 9]." },
        ],
        tasks: [
          "Seed `seen_xor = {0: 1}`, `curr_xor = 0`, `ans = 0`.",
          "At each `x`, set `curr_xor = curr_xor ^ x`, add `seen_xor.get(curr_xor ^ k, 0)` to `ans`, then increment `seen_xor[curr_xor]`.",
        ],
        starterCode: "function count_subarrays_xor_k(nums, k):\n    // TODO: prefix XOR + frequency map",
        expectedOutput: "4\n2",
        hint: "Because `earlier ^ curr_xor == k` is equivalent to `earlier == curr_xor ^ k`, the XOR pattern is identical to Subarray Sum K with `^` replacing `+` and `-`.",
        complexity: { time: "O(n) average", space: "O(n)" },
        solutionCode:
          "function count_subarrays_xor_k(nums, k):\n    seen_xor ← {0: 1}\n    curr_xor ← 0\n    ans ← 0\n    for each x in nums:\n        curr_xor ← curr_xor ^ x\n        ans ← ans + seen_xor.get(curr_xor ^ k, 0)\n        seen_xor[curr_xor] ← seen_xor.get(curr_xor, 0) + 1\n    return ans",
      },
    ],
  },
  "dsa-bloom-filters": {
    lessonId: "dsa-bloom-filters",
    subtitle:
      "Save 10x-100x RAM on membership checks over billions of keys using a compact bit array and k independent hash functions, understanding why 'NO' is 100% certain while 'YES' carries a bounded false-positive rate.",
    intro: {
      heading: "Bloom Filters & Probabilistic Membership",
      explanation: [
        "Keeping 1 billion 64-byte URLs inside a Hash Set consumes ~100 GB of RAM because every full string must sit in memory. At the same time, trying to delete from a standard bit-array Bloom Filter by clearing bits back to `0` wipes bits shared by other keys and introduces silent false negatives.",
        "A **Bloom Filter** replaces stored keys with an `m`-bit array and `k` hash probes (`~9.6` bits per item for a `1%` false-positive rate): if **any probed bit is `0`**, the key is **100% definitely absent**; if **all `k` bits are `1`**, the key is **probably present** (or a bounded **false positive**). Swapping single bits for small integers (**Counting Bloom Filter**) supports deletions without breaking overlapping keys.",
      ],
      analogy:
        "Punching `k` tiny holes on a shared attendance punch-card records every guest without storing names. If any of Sarah's `3` hole positions is unpunched, Sarah definitely never signed in. If all `3` positions already have holes, Sarah probably signed in, though three other guests might have accidentally punched those same spots.",
      realWorldUses: [
        "LSM-tree storage engines (RocksDB, LevelDB, Cassandra, PostgreSQL) avoiding slow disk reads on SSTable files when a key definitely does not exist",
        "Browser Safe Browsing URL filters and CDN caches rejecting one-hit-wonder URLs before allocating cache memory",
      ],
    },
    sections: [
      {
        heading: "Hash Set vs Bloom Filter: Space-Accuracy Tradeoff",
        paragraphs: [
          "A Hash Set stores actual keys plus pointers (`32-80+ bytes` per item) for exact answers. A Bloom Filter stores **zero keys**, consuming `~9.6 bits` per item for a `1%` false-positive rate regardless of whether keys are 8 bytes or 500-byte URLs.",
          "Trace `m = 10` bits with `k = 2`: add `'alice'` -> sets bits `{1, 5}` to `1`; add `'bob'` -> sets `{3, 9}` to `1`. Query `'carol'` (`{1, 2}`): `bits[1] == 1` (hit), `bits[2] == 0` (miss -> definite NO). Query `'eve'` (`{5, 3}`): both `bits[5]` and `bits[3]` equal `1` -> false positive! Clearing bit `5` to delete `'alice'` breaks `'eve'`, wait—even worse, if `'dan'` used `{5, 8}`, deleting `'alice'` breaks `'dan'`, so a **Counting Bloom Filter** uses counters instead of 1-bit flags.",
        ],
        code: [
          "bits = [0] * 10   # fixed m = 10 bit array; k = 2 hash slots per key",
          "backing_db = {'alice', 'bob'}",
          "probes = {'alice': [1, 5], 'bob': [3, 9], 'carol': [1, 2], 'eve': [5, 3]}",
          "",
          "for key in ('alice', 'bob'):",
          "    for p in probes[key]:",
          "        bits[p] = 1",
          "",
          "def bloom_hit(key):",
          "    return all(bits[p] == 1 for p in probes[key])",
          "",
          "# Broken: treating bloom_hit('eve') == True as definite membership",
          "# Working: any 0 bit skips DB; all 1 bits must confirm against backing_db",
          "def check_member(key):",
          "    if not bloom_hit(key):",
          "        return 'Definite No (skip DB)'",
          "    return 'Confirmed In DB' if key in backing_db else 'False Positive (DB miss)'",
        ],
        codeLabel: "Python",
        output: "carol -> Definite No (skip DB) | alice -> Confirmed In DB | eve -> False Positive (DB miss)",
        table: {
          caption: "Hash Set vs Standard Bloom Filter vs Counting Bloom Filter",
          headers: ["Property", "Standard Hash Set", "Bloom Filter", "Counting Bloom Filter"],
          rows: [
            ["Memory per item", "`O(key_bytes + ptr)` (~50+ B)", "`~10 bits` for `1%` FP", "`~40 bits` (4-bit counters)"],
            ["Lookup guarantee", "Exact (`Yes` / `No`)", "Never false negative (`No` exact)", "Never false negative (`No` exact)"],
            ["False Positive (`p`)", "`0%`", "Tunable (`1%` at `m/n ~ 9.6, k ~ 7`)", "Tunable (`1%` at `m/n ~ 9.6, k ~ 7`)"],
            ["Supports Delete?", "Yes (`O(1)` avg)", "No (clearing `1` breaks others)", "Yes (decrement counters)"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Remember: if any probed bit is `0`, membership is 100% impossible. If all probed bits are `1`, you either saw the key or hit a collision across `k` bits (false positive).",
        },
      },
      {
        heading: "Sizing Bits (m), Hash Count (k) & False-Positive Probability",
        paragraphs: [
          "Too few hashes (`k = 1`) cause frequent single-bit collisions; too many hashes (`k = 30`) pack the bit array with `1`s so every unseen query hits `1`s. At the sweet spot—roughly `k ~ 0.693 * (m / n)`—half the bits stay `0` and half become `1` at target load `n`, minimizing false positives.",
          "For `n = 10,000,000` items at a `1%` false-positive rate, `9.6` bits/item needs `~12 MB` and `k = 7` probes (contrast ~500+ MB for a Hash Set). Using double hashing `h_i(x) = (h_a(x) + i * h_b(x)) mod m` generates all `k` probes from just two base hashes in `O(k)` time.",
        ],
        table: {
          caption: "Standard Bloom Filter Sizing Cheat Sheet (per inserted item n)",
          headers: ["Target False-Positive Rate", "Bits per Item (m / n)", "Optimal Hashes (k)", "Memory for 10M Items"],
          rows: [
            ["`10%` (`0.1`)", "`~4.8` bits/item", "`3` hashes", "`~6.0 MB`"],
            ["`1%` (`0.01`)", "`~9.6` bits/item", "`7` hashes", "`~12.0 MB`"],
            ["`0.1%` (`0.001`)", "`~14.4` bits/item", "`10` hashes", "`~18.0 MB`"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Overfilling a Bloom Filter far past its planned capacity `n` saturates almost every bit to `1`, pushing the false-positive rate rapidly toward `100%`.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From Single-Bit Filters to Multi-Hash & Counting Bloom Filters",
      steps: [
        {
          label: "Step 1: Single-hash bit filter (high collision rate)",
          explanation: "Using only `k = 1` bit per key makes every hash collision an immediate false positive.",
          code: [
            "bits ← array of m zeros",
            "function add_one(key):",
            "    bits[h1(key) mod m] ← 1",
            "function query_one(key):",
            "    return bits[h1(key) mod m] == 1",
          ],
          activeLines: [3, 5],
          output: "Single collision -> immediate false positive",
        },
        {
          label: "Step 2: Probe k independent slots (0% false negatives)",
          explanation: "An unseen key only triggers a false positive when all `k` of its probed bits collide with `1`s; any `0` guarantees absence.",
          code: [
            "function add_bloom(bits, slots):",
            "    for idx in slots: bits[idx] ← 1",
            "function might_contain(bits, slots):",
            "    for idx in slots:",
            "        if bits[idx] == 0: return false",
            "    return true",
          ],
          activeLines: [4, 5],
          output: "10M items at 1% FP -> ~12 MB instead of ~500 MB",
        },
        {
          label: "Step 3: Counting Bloom Filter for deletion",
          explanation: "Replace 1-bit flags with integer counters so removing `'alice'` decrements shared slots without erasing `'bob'`.",
          code: [
            "function remove_counting(cnt, slots):",
            "    for idx in slots:",
            "        if cnt[idx] > 0: cnt[idx] -= 1",
            "function query_counting(cnt, slots):",
            "    for idx in slots:",
            "        if cnt[idx] == 0: return false",
            "    return true",
          ],
          activeLines: [3, 6],
          output: "add(alice), add(bob), remove(alice), query(bob) -> true",
        },
      ],
    },
    walkthrough: {
      title: "Trace bit-array insertions, certain negatives, and a false positive",
      layout: "visual-first",
      steps: [
        {
          title: "Initialize m = 10 zero bits with k = 2 hash probes",
          tag: "MEMORY",
          explanation: [
            "Allocate a `10`-bit filter `bits[0..9]` all set to `0`, paired with two hash probes `h1(x)` and `h2(x)` mapping keys into `0..9`.",
            "Every query returns `true` only if both `bits[h1(x)] == 1` and `bits[h2(x)] == 1`.",
          ],
          code: [
            "m ← 10, bits ← [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]",
            "function add(key):",
            "    bits[h1(key) mod m] ← 1",
            "    bits[h2(key) mod m] ← 1",
            "function might_contain(key):",
            "    return bits[h1(key) mod m] == 1 and bits[h2(key) mod m] == 1",
          ],
          activeLines: [1],
          codeLabel: "Pseudocode · Bloom Filter",
          state: [
            { name: "Bit array m", value: "10 bits (all 0)", changed: true },
            { name: "Hashes k", value: "2" },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Filter bits[0..9]",
                cells: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
                  id: `bit-${i}`,
                  value: "0",
                  index: i,
                  state: "dim",
                })),
              },
            ],
          },
        },
        {
          title: "Insert 'alice' -> set bits[1] and bits[5] to 1",
          tag: "TRACE",
          explanation: [
            "Suppose `h1('alice') mod 10 = 1` and `h2('alice') mod 10 = 5`. Neither string `'alice'` nor its length is stored anywhere.",
            "Instead we flip only `bits[1]` and `bits[5]` from `0` to `1` in `O(k)` constant time.",
          ],
          code: [
            "m ← 10, bits ← [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]",
            "function add(key):",
            "    bits[h1(key) mod m] ← 1",
            "    bits[h2(key) mod m] ← 1",
            "function might_contain(key):",
            "    return bits[h1(key) mod m] == 1 and bits[h2(key) mod m] == 1",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode · Bloom Filter",
          state: [
            { name: "add('alice')", value: "h1=1, h2=5", changed: true },
            { name: "Ones set", value: "{1, 5}", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Filter bits[0..9] after add('alice')",
                cells: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
                  id: `bit-${i}`,
                  value: i === 1 || i === 5 ? "1" : "0",
                  index: i,
                  state: i === 1 || i === 5 ? "active" : "dim",
                })),
                pointers: [
                  { index: 1, label: "h1('alice')", tone: "coral" },
                  { index: 5, label: "h2('alice')", tone: "accent" },
                ],
              },
            ],
          },
        },
        {
          title: "Insert 'bob' -> set bits[3] and bits[8] to 1",
          tag: "TRACE",
          explanation: [
            "Now add `'bob'` with `h1('bob') mod 10 = 3` and `h2('bob') mod 10 = 8`.",
            "Four bits (`1, 3, 5, 8`) are now `1`. Notice we can query `'bob'` or `'alice'` at any time and get `true` with 0% false negatives.",
          ],
          code: [
            "m ← 10, bits ← [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]",
            "function add(key):",
            "    bits[h1(key) mod m] ← 1",
            "    bits[h2(key) mod m] ← 1",
            "function might_contain(key):",
            "    return bits[h1(key) mod m] == 1 and bits[h2(key) mod m] == 1",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode · Bloom Filter",
          state: [
            { name: "add('bob')", value: "h1=3, h2=8", changed: true },
            { name: "Ones set", value: "{1, 3, 5, 8}", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Filter bits[0..9] after add('bob')",
                cells: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
                  id: `bit-${i}`,
                  value: i === 1 || i === 3 || i === 5 || i === 8 ? "1" : "0",
                  index: i,
                  state: i === 3 || i === 8 ? "active" : i === 1 || i === 5 ? "done" : "dim",
                })),
                pointers: [
                  { index: 3, label: "h1('bob')", tone: "coral" },
                  { index: 8, label: "h2('bob')", tone: "accent" },
                ],
              },
            ],
          },
        },
        {
          title: "Query unseen 'zoe' -> bits[2] is 0 -> Definitely NO!",
          tag: "CHECK",
          explanation: [
            "Query `'zoe'`: `h1('zoe') = 1` (is `1`), `h2('zoe') = 2` (is `0`).",
            "Even though bit `1` matched, seeing a single `0` at index `2` proves with **100% certainty** that `'zoe'` was never inserted.",
          ],
          code: [
            "m ← 10, bits ← [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]",
            "function add(key):",
            "    bits[h1(key) mod m] ← 1",
            "    bits[h2(key) mod m] ← 1",
            "function might_contain(key):",
            "    return bits[h1(key) mod m] == 1 and bits[h2(key) mod m] == 1",
          ],
          activeLines: [6],
          codeLabel: "Pseudocode · Bloom Filter",
          state: [
            { name: "Query", value: "'zoe' (1, 2)", changed: true },
            { name: "bits[2]", value: "0 -> Definitely NO!", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Check 'zoe' at bits[1] and bits[2]",
                cells: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
                  id: `bit-${i}`,
                  value: i === 1 || i === 3 || i === 5 || i === 8 ? "1" : "0",
                  index: i,
                  state: i === 2 ? "pivot" : i === 1 || i === 3 || i === 5 || i === 8 ? "done" : "dim",
                })),
                pointers: [
                  { index: 1, label: "hit=1", tone: "ok" },
                  { index: 2, label: "miss=0", tone: "coral" },
                ],
              },
            ],
          },
        },
        {
          title: "Query unseen 'eve' -> hits bits[5]=1 and bits[3]=1 -> False Positive",
          tag: "PITFALL",
          explanation: [
            "Now query `'eve'`, which was never added: `h1('eve') = 5` (set by `'alice'`) and `h2('eve') = 3` (set by `'bob'`).",
            "Because all probed bits equal `1`, `might_contain('eve')` returns `true` (**Maybe / check real DB**). This is a textbook **false positive**!",
          ],
          code: [
            "m ← 10, bits ← [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]",
            "function add(key):",
            "    bits[h1(key) mod m] ← 1",
            "    bits[h2(key) mod m] ← 1",
            "function might_contain(key):",
            "    return bits[h1(key) mod m] == 1 and bits[h2(key) mod m] == 1",
          ],
          activeLines: [6],
          codeLabel: "Pseudocode · Bloom Filter",
          state: [
            { name: "Query", value: "'eve' (3, 5)", changed: true },
            { name: "bits[3], bits[5]", value: "both 1 -> False Positive", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            trays: [
              {
                label: "Check 'eve' at bits[3] and bits[5] -> both already 1",
                cells: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
                  id: `bit-${i}`,
                  value: i === 1 || i === 3 || i === 5 || i === 8 ? "1" : "0",
                  index: i,
                  state: i === 3 || i === 5 ? "active" : i === 1 || i === 8 ? "done" : "dim",
                })),
                pointers: [
                  { index: 3, label: "bob's 1!", tone: "coral" },
                  { index: 5, label: "alice's 1!", tone: "coral" },
                ],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Clearing bits during delete breaks other keys",
        detail: "Setting a bit back to 0 in a binary Bloom filter can delete evidence shared by another inserted item, introducing false negatives.",
      },
      {
        title: "Overfilling saturates the bit array",
        detail: "When more items are added than planned capacity n, most bits turn 1 and false-positive rate climbs quickly toward 100%.",
      },
      {
        title: "Using correlated hash functions",
        detail: "Pick independent hashes or double hashing h1(x) + i * h2(x) with nonzero odd h2 so k probes spread evenly across [0..m-1].",
      },
    ],
    predictChecks: [
      {
        prompt: "When might_contain(url) returns false, what is guaranteed?",
        code: "for i from 0 to k - 1:\n    if bits[probe(url, i)] == 0:\n        return false",
        options: [
          { id: "a", label: "100% certain that url was never inserted into this Bloom filter" },
          { id: "b", label: "Only 1 - p confident because Bloom filters can produce false negatives" },
          { id: "c", label: "Uncertain unless item count n is smaller than m" },
        ],
        correctId: "a",
        explanation: "Inserting url always turns every one of its k bits to 1 and inserts never clear bits to 0, so observing any 0 makes prior insertion impossible.",
      },
      {
        prompt: "Why cannot a standard binary Bloom filter support delete(key) by flipping k bits to 0?",
        code: "// UNSAFE delete:\nfor pos in positions(key):\n    bits[pos] ← 0",
        options: [
          { id: "a", label: "Computing hashes during deletion is O(n)" },
          { id: "b", label: "Clearing a shared bit could erase evidence of other keys and cause false negatives" },
          { id: "c", label: "Bit arrays are read-only once constructed" },
        ],
        correctId: "b",
        explanation: "Other distinct keys often hash onto some of the exact same 1 bits; clearing a shared bit breaks queries for unrelated keys.",
      },
    ],
    practiceTask: {
      title: "Bloom Filter Add & Query with Double Hashing",
      tier: "Warmup",
      goal: "Simulate a compact `m`-bit Bloom Filter using double hashing `pos(i) = (h1(key) + i * h2(key)) mod m` for `i = 0..k-1`: support `add(key)` and `might_contain(key)` over a sequence of operations.",
      constraints: ["1 <= m <= 10^6", "1 <= k <= 16", "Target: O(k) per operation"],
      examples: [
        { input: "m = 10, k = 2, ops = [add(a), add(b), query(b), query(z)] (z hits a 0 bit)", output: "[true, false]" },
        { input: "m = 8, k = 2, ops = [query(missing)]", output: "[false]", explanation: "Empty all-zero filter returns false with zero false positives." },
      ],
      tasks: [
        "Initialize integer bit array `bits` of size `m` to all zeros.",
        "For `i = 0..k-1`, compute `idx = (h1 + i * h2) mod m`; set on `add`, return `false` immediately if `bits[idx] == 0` on `might_contain`.",
      ],
      starterCode: "function bloom_simulate(m, k, h1_map, h2_map, ops):\n    // TODO: add sets k bits; query returns false iff any probed bit is 0\n    return results",
      expectedOutput: "[true, false]\n[false]",
      hint: "Make `h2` odd or nonzero (e.g., `(raw_h2 mod m) or 1`) so successive `i * h2` probes do not stay pinned at `h1`.",
      complexity: { time: "O(k) per op", space: "O(m bits)" },
      solutionCode:
        "function bloom_simulate(m, k, h1_map, h2_map, ops):\n    bits ← array of m zeros\n    out ← []\n    for (kind, key) in ops:\n        a ← h1_map[key] mod m\n        b ← h2_map[key] mod m\n        if kind == \"add\":\n            for i from 0 to k - 1: bits[(a + i * b) mod m] ← 1\n        else:\n            ok ← true\n            for i from 0 to k - 1:\n                if bits[(a + i * b) mod m] == 0:\n                    ok ← false\n                    break\n            out.append(ok)\n    return out",
    },
    practiceChallenges: [
      {
        title: "Bloom Filter Add & Query with Double Hashing",
        tier: "Warmup",
        goal: "Implement `add` and `might_contain` using `pos(i) = (h1 + i * h2) mod m` over `k` probes.",
        constraints: ["1 <= m <= 10^6", "1 <= k <= 16", "Target: O(k) per op"],
        examples: [
          { input: "m = 10, k = 2, ops = [add(a), add(b), query(b), query(z)] (z hits a 0 bit)", output: "[true, false]" },
          { input: "m = 8, k = 2, ops = [query(missing)]", output: "[false]" },
        ],
        tasks: ["Return `false` if any probed bit is `0`; otherwise `true`."],
        starterCode: "function bloom_simulate(m, k, h1_map, h2_map, ops):\n    // TODO: run double-hashing Bloom filter ops\n    return results",
        expectedOutput: "[true, false]\n[false]",
        hint: "Short-circuit query loops as soon as any `bits[idx] == 0`.",
        complexity: { time: "O(k) per op", space: "O(m bits)" },
        solutionCode:
          "function bloom_simulate(m, k, h1_map, h2_map, ops):\n    bits ← array of m zeros\n    out ← []\n    for (kind, key) in ops:\n        a ← h1_map[key] mod m\n        b ← h2_map[key] mod m\n        if kind == \"add\":\n            for i from 0 to k - 1: bits[(a + i * b) mod m] ← 1\n        else:\n            ok ← true\n            for i from 0 to k - 1:\n                if bits[(a + i * b) mod m] == 0:\n                    ok ← false\n                    break\n            out.append(ok)\n    return out",
      },
      {
        title: "Counting Bloom Filter with Safe Deletions",
        tier: "Core",
        goal: "Maintain integer counts `cnt[0..m-1]` so `add(key)` increments `k` slots, `remove(key)` decrements `k` slots when `cnt[idx] > 0`, and `might_contain(key)` checks all `k` counters `> 0`.",
        constraints: ["1 <= m <= 10^5", "Only remove keys known to be present", "Target: O(k) per op"],
        examples: [
          { input: "m = 6, positions: alice={1,4}, bob={1,2}; add(alice), add(bob), remove(alice), query(bob)", output: "[true]", explanation: "cnt[1] decrements from 2 down to 1, preserving bob." },
          { input: "m = 6, add(alice), remove(alice), query(alice)", output: "[false]" },
        ],
        tasks: [
          "Increment/decrement all `k` distinct slots for the key.",
          "Have `query` check every slot `cnt[idx] > 0`.",
        ],
        starterCode: "function counting_bloom(m, hashes_for_key, ops):\n    // TODO: support add, remove, and query operations\n    return results",
        expectedOutput: "[true]\n[false]",
        hint: "Unlike a binary array, decrementing `cnt[1]` from `2 -> 1` keeps `'bob'` intact when `'alice'` leaves.",
        complexity: { time: "O(k) per op", space: "O(m)" },
        solutionCode:
          "function counting_bloom(m, hashes_for_key, ops):\n    cnt ← array of m zeros\n    out ← []\n    for (kind, key) in ops:\n        slots ← hashes_for_key[key]\n        if kind == \"add\":\n            for s in slots: cnt[s] ← cnt[s] + 1\n        else if kind == \"remove\":\n            for s in slots:\n                if cnt[s] > 0: cnt[s] ← cnt[s] - 1\n        else:\n            ok ← true\n            for s in slots:\n                if cnt[s] == 0: ok ← false\n            out.append(ok)\n    return out",
      },
      {
        title: "Estimate Optimal Bit Size (m) and Hashes (k)",
        tier: "Stretch",
        goal: "Given expected item count `n` and target false-positive rate `p` (`0 < p < 1`), return integer `[m_bits, k_hashes]` using standard Bloom formulas `m = ceil(-n * ln(p) / (ln 2)^2)` and `k = max(1, round((m / n) * ln 2))`.",
        constraints: ["1 <= n <= 10^9", "10^-6 <= p < 1", "Target: O(1) time and space"],
        examples: [
          { input: "n = 1000, p = 0.01", output: "[9586, 7]" },
          { input: "n = 1000, p = 0.1", output: "[4793, 3]" },
        ],
        tasks: [
          "Compute `m = ceil((-n * ln(p)) / (ln(2)^2))`.",
          "Compute `k = max(1, round((m / n) * ln(2)))` and return `[m, k]`.",
        ],
        starterCode: "function bloom_optimal_params(n, p):\n    // TODO: return [m_bits, k_hashes]\n    return [m, k]",
        expectedOutput: "[9586, 7]\n[4793, 3]",
        hint: "With `p = 0.01`, `-ln(0.01) / (ln 2)^2` equals roughly `9.585` bits per inserted item.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "function bloom_optimal_params(n, p):\n    ln2 ← ln(2)\n    m ← ceil((-n * ln(p)) / (ln2 * ln2))\n    k ← max(1, round((m / n) * ln2))\n    return [m, k]",
      },
    ],
  },
};

export const dsaM06PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m6",
  title: "Module 06 Practice Set: Hashing",
  description:
    "Four mixed problems combining hash bucket indexing, open addressing, canonical frequency keys, O(n) streak detection, and prefix-map lookups.",
  problems: [
    {
      id: "dsa-m6-p1",
      title: "Assign Open Parking Bays",
      patternHint: "Normalize signed IDs with ((id mod cap) + cap) mod cap and step forward circularly until finding an empty bay or matching ID (Lesson 06-1).",
      lessonRefId: "dsa-hash-internals",
      goal: "A garage has `cap` numbered bays `0 .. cap - 1`. Each incoming vehicle ID prefers bay `((id mod cap) + cap) mod cap`. If its preferred bay is already taken by another vehicle, it checks `(bay + 1) mod cap`, wrapping around until finding an open bay (or returning its own bay if already parked). If the garage is completely full for a new ID, return `-1` for that arrival. Return the list of assigned bays.",
      constraints: ["1 <= cap <= 5000", "1 <= len(ids) <= 5000", "-10^9 <= ids[i] <= 10^9"],
      examples: [
        { input: "cap = 4, ids = [10, 14, 7, 22]", output: "[2, 3, 0, 1]" },
        { input: "cap = 2, ids = [5, 7, 9]", output: "[1, 0, -1]" },
      ],
      tasks: [
        "Initialize `bays` of length `cap` with `EMPTY` markers.",
        "For each `id`, start at `idx = ((id mod cap) + cap) mod cap` and probe up to `cap` steps until `bays[idx] == EMPTY` or `bays[idx] == id`.",
        "Assign `bays[idx] = id` and append `idx` (or `-1` if all `cap` bays are occupied by other IDs).",
      ],
      starterCode: "function assign_bays(cap, ids):\n    // TODO: simulate normalized modulo placement and wrap-around probing",
      expectedOutput: "[2, 3, 0, 1]\n[1, 0, -1]",
      hint: "Cap the inner probe loop at `cap` iterations so a full garage outputs `-1` instead of looping forever.",
      complexity: { time: "O(n) average", space: "O(cap)" },
      solutionCode:
        "function assign_bays(cap, ids):\n    bays ← array of cap EMPTY markers\n    out ← empty list\n    for each id in ids:\n        idx ← ((id mod cap) + cap) mod cap\n        placed ← -1\n        for step from 0 to cap - 1:\n            if bays[idx] == EMPTY or bays[idx] == id:\n                bays[idx] ← id\n                placed ← idx\n                break\n            idx ← (idx + 1) mod cap\n        out.append(placed)\n    return out",
    },
    {
      id: "dsa-m6-p2",
      title: "Bundle Matching Letter Tags",
      patternHint: "Build a delimited 26-letter frequency signature key cnt[26] instead of sorting each tag (Lesson 06-2).",
      lessonRefId: "dsa-hash-sets",
      goal: "Given a list of lowercase ASCII tags `tags`, bundle together all tags that contain the exact same characters with the exact same multiplicities, preserving first-seen group order.",
      constraints: ["0 <= len(tags) <= 10^4", "Lowercase 'a'..'z' only", "Do not call sort()"],
      examples: [
        {
          input: "tags = [\"arc\", \"car\", \"bat\", \"rac\", \"tab\"]",
          output: "[[\"arc\", \"car\", \"rac\"], [\"bat\", \"tab\"]]",
        },
        { input: "tags = [\"solo\"]", output: "[[\"solo\"]]" },
      ],
      tasks: [
        "Count each tag's 26 letter occurrences into `cnt[26]` and join with `'#'`.",
        "Group tags in a Hash Map keyed by that 26-count signature.",
      ],
      starterCode: "function bundle_tags(tags):\n    // TODO: group equivalent tags in O(n * L) without sorting",
      expectedOutput: "[[\"arc\", \"car\", \"rac\"], [\"bat\", \"tab\"]]\n[[\"solo\"]]",
      hint: "Using `'#'` between every count guarantees `[1, 10]` and `[11, 0]` never produce the same string key.",
      complexity: { time: "O(n * L)", space: "O(n * L)" },
      solutionCode:
        "function signature(tag):\n    cnt ← array of 26 zeros\n    for each ch in tag:\n        cnt[ord(ch) - ord('a')] += 1\n    key ← \"\"\n    for i from 0 to 25:\n        key ← key + str(cnt[i]) + \"#\"\n    return key\n\nfunction bundle_tags(tags):\n    groups ← empty Hash Map\n    order ← empty list\n    for each tag in tags:\n        key ← signature(tag)\n        if key not in groups:\n            groups[key] ← empty list\n            order.append(key)\n        groups[key].append(tag)\n    out ← empty list\n    for each key in order:\n        out.append(groups[key])\n    return out",
    },
    {
      id: "dsa-m6-p3",
      title: "Longest Unbroken Ticket Run",
      patternHint: "Store all tickets in a Hash Set and only count upward from v when v - 1 is absent (Lesson 06-2).",
      lessonRefId: "dsa-hash-sets",
      goal: "Given an unsorted integer list `tickets`, return the maximum count of consecutive integer ticket numbers (`v, v + 1, ..., v + len - 1`) present anywhere in `tickets`, in `O(n)` average time.",
      constraints: ["0 <= len(tickets) <= 10^5", "-10^9 <= tickets[i] <= 10^9", "Target: O(n) avg time without sorting"],
      examples: [
        { input: "tickets = [18, 5, 20, 4, 19, 17, 5]", output: "4", explanation: "Longest consecutive run is [17, 18, 19, 20]." },
        { input: "tickets = []", output: "0" },
      ],
      tasks: [
        "Insert all values from `tickets` into a Hash Set `s`.",
        "Iterate over unique `v` in `s`; skip whenever `(v - 1) in s` is true, otherwise count upward while `(cur + 1) in s`.",
      ],
      starterCode: "function longest_ticket_run(tickets):\n    // TODO: find longest consecutive run in O(n) avg",
      expectedOutput: "4\n0",
      hint: "Iterating over the Hash Set `s` rather than `tickets` avoids re-walking streaks when start values repeat.",
      complexity: { time: "O(n) average", space: "O(n)" },
      solutionCode:
        "function longest_ticket_run(tickets):\n    s ← Hash Set of all v in tickets\n    best ← 0\n    for each v in s:\n        if (v - 1) in s:\n            continue\n        cur ← v\n        while (cur + 1) in s:\n            cur ← cur + 1\n        best ← max(best, cur - v + 1)\n    return best",
    },
    {
      id: "dsa-m6-p4",
      title: "Longest Target-Sum Segment",
      patternHint: "Track running prefix sum curr and store only the FIRST index where each sum occurred (seeded with {0: -1}) so i - first_idx[curr - target] is maximized (Lesson 06-3).",
      lessonRefId: "dsa-hash-lookup",
      goal: "Given an integer array `nums` (allowing positive, zero, and negative values) and an integer `target`, return the length of the longest contiguous subarray summing to `target`, or `0` if none exists.",
      constraints: ["1 <= len(nums) <= 10^5", "-10^4 <= nums[i] <= 10^4", "Target: O(n) avg time, O(n) space"],
      examples: [
        { input: "nums = [1, -1, 5, -2, 3], target = 3", output: "4", explanation: "[1, -1, 5, -2] sums to 3." },
        { input: "nums = [-2, -1, 2, 1], target = 1", output: "2", explanation: "[-1, 2] sums to 1." },
      ],
      tasks: [
        "Seed `first_idx = {0: -1}`, `curr = 0`, `best = 0`.",
        "At index `i`, update `curr += nums[i]` and check if `curr - target` is in `first_idx` to update `best = max(best, i - first_idx[curr - target])`.",
        "Insert `first_idx[curr] = i` only if `curr` is not already in `first_idx` so the leftmost start index is preserved.",
      ],
      starterCode: "function longest_segment_sum_k(nums, target):\n    // TODO: prefix sum + earliest-index Hash Map",
      expectedOutput: "4\n2",
      hint: "Never overwrite `first_idx[curr]` if `curr` was seen earlier: keeping the smaller index maximizes `i - first_idx[curr - target]`.",
      complexity: { time: "O(n) average", space: "O(n)" },
      solutionCode:
        "function longest_segment_sum_k(nums, target):\n    first_idx ← {0: -1}\n    curr ← 0\n    best ← 0\n    for i from 0 to len(nums) - 1:\n        curr ← curr + nums[i]\n        need ← curr - target\n        if need in first_idx:\n            best ← max(best, i - first_idx[need])\n        if curr not in first_idx:\n            first_idx[curr] ← i\n    return best",
    },
  ],
};
