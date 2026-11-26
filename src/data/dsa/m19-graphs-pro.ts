import type { LessonContent, ModulePracticeSet } from "@/lib/lesson-types";

export const dsaM19Lessons: Record<string, LessonContent> = {
  "dsa-dsu-union-find": {
    lessonId: "dsa-dsu-union-find",
    subtitle:
      "Maintain dynamic connected components in near-constant O(alpha(n)) amortized time using a parent array, path compression inside find(x), and union by rank or size.",
    intro: {
      heading: "Disjoint Set Union: Near-Constant Dynamic Connectivity",
      explanation: [
        "Running BFS or DFS every time a new edge arrives costs `O(V + E)` per query, which times out on dynamic streams of merges and connectivity checks. Storing a flat `parent` array fixes the setup cost, yet naive linking (`parent[b] = a` or attaching roots in arrival order) builds skewed `O(n)` chains like `4 -> 3 -> 2 -> 1 -> 0` that still trigger TLE—and forgetting the `ra == rb` guard corrupts component sizes and counts.",
        "Disjoint Set Union (DSU), also called Union-Find, partitions `{0, 1, ..., n - 1}` into upside-down parent trees inside one array (`parent[i] = i` initially). Combining **union by rank (or size)**—attaching the shallower or smaller root under the taller or larger root—with **path compression** inside `find(x)` flattens lookup paths so `m` operations finish in `O(m * alpha(n))` amortized time (`alpha(n) <= 4` for all practical `n`).",
      ],
      analogy:
        "Picture corporate reporting chains where every merger points the smaller team's CEO directly to the larger company's CEO, and whenever an employee asks who sits at the top, everyone along that lookup chain updates their badge to point straight to the top CEO.",
      realWorldUses: [
        "Dynamic network connectivity and undirected cycle detection as links arrive one by one",
        "Kruskal's Minimum Spanning Tree algorithm filtering out edges that would close a cycle",
      ],
    },
    sections: [
      {
        heading: "Parent Array, Chain Bottleneck, and Path Compression",
        paragraphs: [
          "DSU stores `parent[0..n-1]` in one contiguous array where `parent[x] == x` marks a root representative, avoiding node allocations and child pointers. Calling `find(x)` follows `parent` pointers upward until reaching a root (`parent[root] == root`).",
          "Without optimizations, merging `union(1, 0)`, `union(2, 1)`, `union(3, 2)` builds a 4-node chain `3 -> 2 -> 1 -> 0` where every `find(3)` walks `O(n)` hops. **Path compression** inside `find(x)` fixes this in a second pass: once `root` is found, every visited node along the path has `parent[x]` rewritten straight to `root`.",
        ],
        code: [
          "// Invalid: linking nodes directly breaks a's old subtree",
          "// parent[a] = b",
          "",
          "// Valid: resolve roots first and compress the lookup path",
          "class UnionFind:",
          "    init(n):",
          "        parent ← [0, 1, ..., n - 1]",
          "        rank ← [0] * n",
          "        components ← n",
          "",
          "    function find(x):",
          "        root ← x",
          "        while parent[root] != root:",
          "            root ← parent[root]",
          "        // Path compression: rewire every visited node straight to root",
          "        while parent[x] != root:",
          "            nxt ← parent[x]",
          "            parent[x] ← root",
          "            x ← nxt",
          "        return root",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Disjoint Set strategies compared across m operations on n items",
          headers: ["Approach", "find(x)", "union(a, b)", "m Operations Total"],
          rows: [
            ["Component ID array (Quick-Find)", "O(1)", "O(n) relabel", "O(m * n)"],
            ["Plain parent tree (Quick-Union)", "O(n) worst", "O(n) worst", "O(m * n)"],
            ["Union by rank/size only", "O(log n)", "O(log n)", "O(m log n)"],
            ["Path compression + Union by rank/size", "O(alpha(n)) ~ O(1)", "O(alpha(n)) ~ O(1)", "O(m * alpha(n))"],
          ],
          highlightCol: 3,
        },
        visual: {
          kind: "dsa-array",
          caption: "Initial singleton DSU arrays: each vertex i points to itself with component size 1",
          trays: [
            {
              label: "parent[]",
              cells: [
                { id: "sp0", value: "0", index: 0 },
                { id: "sp1", value: "1", index: 1 },
                { id: "sp2", value: "2", index: 2 },
                { id: "sp3", value: "3", index: 3 },
                { id: "sp4", value: "4", index: 4 },
              ],
            },
            {
              label: "size[]",
              cells: [
                { id: "ss0", value: "1", index: 0 },
                { id: "ss1", value: "1", index: 1 },
                { id: "ss2", value: "1", index: 2 },
                { id: "ss3", value: "1", index: 3 },
                { id: "ss4", value: "1", index: 4 },
              ],
            },
          ],
        },
        callout: {
          kind: "KEY IDEA",
          text: "Path compression is self-accelerating: the first `find(x)` down a deep branch flattens it, and every later lookup for any node on that branch reaches the root in one hop.",
        },
      },
      {
        heading: "Union by Rank vs Union by Size and Cycle Detection",
        paragraphs: [
          "Path compression alone still hits `O(log n)` worst-case sequences if unions attach larger trees under smaller ones. **Union by rank** keeps an upper bound `rank[root]` on tree height and attaches the lower-rank root under the higher-rank root, incrementing `rank` by `1` only on ties. **Union by size** tracks `size[root]` (the vertex count of the component), attaches the smaller tree under the larger one, and adds `size[ra] += size[rb]`.",
          "Watch the dry-run on `n = 4`: after `union(0, 1)` (`parent=[0,0,2,3], size=[2,1,1,1]`), calling `union(0, 1)` a second time gets `ra = 0, rb = 0`. Without `if ra == rb: return false`, adding `size[0] += size[0]` would corrupt `size[0]` to `4` and drop `components` by `1` even though no merge occurred.",
        ],
        code: [
          "    function union(a, b):",
          "        ra ← find(a)",
          "        rb ← find(b)",
          "        if ra == rb:",
          "            return false              // already connected (cycle if edge added)",
          "        if rank[ra] < rank[rb]:",
          "            swap(ra, rb)",
          "        parent[rb] ← ra",
          "        if rank[ra] == rank[rb]:",
          "            rank[ra] ← rank[ra] + 1",
          "        components ← components - 1",
          "        return true",
          "",
          "function has_cycle(n, edges):",
          "    uf ← UnionFind(n)",
          "    for (u, v) in edges:",
          "        if not uf.union(u, v):",
          "            return true",
          "    return false",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Union by Rank vs Union by Size",
          headers: ["Property", "Union by Rank", "Union by Size"],
          rows: [
            ["Root metadata stored", "Height upper bound (0 initially)", "Component vertex count (1 initially)"],
            ["Attach rule", "Smaller rank under larger rank", "Smaller size under larger size"],
            ["Metadata update", "rank[ra] += 1 only when rank[ra] == rank[rb]", "size[ra] += size[rb] on every merge"],
            ["Extra query supported", "None beyond connectivity", "O(1) component_size(x) via size[find(x)]"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Never link `a` and `b` directly with `parent[a] = b`. Always resolve `ra = find(a)` and `rb = find(b)` first, guard against `ra == rb`, and attach one root to the other.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From Naive Parent Chain to O(alpha(n)) DSU",
      subtitle: "Add the cycle guard, union by size, and iterative path compression step by step.",
      steps: [
        {
          label: "Step 1: Basic parent array (vulnerable to O(n) chains)",
          explanation: "Start with `parent[i] = i` and resolve roots in `find(x)`. Without balancing or compression, repeated merges like `(1,0), (2,1), (3,2)` form a tall chain.",
          code: [
            "parent ← [0, 1, ..., n - 1]",
            "function find(x):",
            "    while parent[x] != x: x ← parent[x]",
            "    return x",
            "function union(a, b):",
            "    parent[find(b)] ← find(a)",
          ],
          activeLines: [3, 6],
          output: "chain 3 -> 2 -> 1 -> 0 takes 3 hops",
        },
        {
          label: "Step 2: Guard ra == rb and attach smaller root under larger",
          explanation: "Exit early when `ra == rb` to detect cycles and avoid corrupting `size[]`, then attach the smaller tree under the larger root so tree depth stays at most `O(log n)`.",
          code: [
            "function union(a, b):",
            "    ra ← find(a); rb ← find(b)",
            "    if ra == rb: return false",
            "    if size[ra] < size[rb]: swap(ra, rb)",
            "    parent[rb] ← ra",
            "    size[ra] ← size[ra] + size[rb]",
            "    return true",
          ],
          activeLines: [3, 4, 5, 6],
          output: "ra == rb skipped; smaller root joins larger",
        },
        {
          label: "Step 3: Compress visited nodes straight to root inside find(x)",
          explanation: "After finding `root`, walk `x` up once more and point every node on the path directly to `root`, lowering amortized cost per operation to `O(alpha(n))`.",
          code: [
            "function find(x):",
            "    root ← x",
            "    while parent[root] != root:",
            "        root ← parent[root]",
            "    while parent[x] != root:",
            "        nxt ← parent[x]; parent[x] ← root; x ← nxt",
            "    return root",
          ],
          activeLines: [5, 6],
          output: "find(4) returns 1 and sets parent[4] = 1",
        },
      ],
    },
    walkthrough: {
      title: "Tracing Union by Size, Path Compression, and Cycle Detection",
      layout: "visual-first",
      steps: [
        {
          title: "Initialize 5 isolated singleton components",
          tag: "MEMORY",
          explanation: [
            "Start with `n = 5` vertices `{0, 1, 2, 3, 4}`. Every index points to itself (`parent[i] = i`), every component has `size[i] = 1`, and `components = 5`.",
          ],
          code: [
            "parent ← [0, 1, 2, 3, 4]",
            "size ← [1, 1, 1, 1, 1]",
            "components ← 5",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          altCode: {
            label: "Python 3",
            lines: [
              "parent = list(range(5))",
              "size = [1] * 5",
              "components = 5",
            ],
          },
          state: [
            { name: "parent", value: "[0, 1, 2, 3, 4]" },
            { name: "size", value: "[1, 1, 1, 1, 1]" },
            { name: "components", value: "5" },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Each vertex starts as its own singleton root tree (parent[i] = i, size[i] = 1)",
            nodes: [
              { id: "s0", label: "0", x: 12, y: 50, badge: "p=0,sz=1", state: "active" },
              { id: "s1", label: "1", x: 31, y: 50, badge: "p=1,sz=1", state: "default" },
              { id: "s2", label: "2", x: 50, y: 50, badge: "p=2,sz=1", state: "default" },
              { id: "s3", label: "3", x: 69, y: 50, badge: "p=3,sz=1", state: "default" },
              { id: "s4", label: "4", x: 88, y: 50, badge: "p=4,sz=1", state: "default" },
            ],
            edges: [],
          },
        },
        {
          title: "Merge pairs (1, 2) and (3, 4) into two size-2 trees",
          tag: "TRACE",
          explanation: [
            "`union(1, 2)` attaches root `2` under root `1` (`size[1] = 2`), and `union(3, 4)` attaches root `4` under root `3` (`size[3] = 2`).",
            "`components` drops from `5` down to `3` (`{0}`, `{1, 2}`, `{3, 4}`).",
          ],
          code: [
            "union(1, 2)   // parent[2] ← 1, size[1] ← 2",
            "union(3, 4)   // parent[4] ← 3, size[3] ← 2",
            "components ← 3",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "parent", value: "[0, 1, 1, 3, 3]", changed: true },
            { name: "size", value: "[1, 2, 1, 2, 1]", changed: true },
            { name: "components", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Parent pointers after union(1, 2) and union(3, 4)",
            nodes: [
              { id: "n0", label: "0", x: 14, y: 50, badge: "sz=1" },
              { id: "n1", label: "1", x: 42, y: 22, badge: "root,sz=2", state: "visited" },
              { id: "n2", label: "2", x: 42, y: 78, badge: "p=1" },
              { id: "n3", label: "3", x: 76, y: 22, badge: "root,sz=2", state: "visited" },
              { id: "n4", label: "4", x: 76, y: 78, badge: "p=3" },
            ],
            edges: [
              { from: "n2", to: "n1", directed: true, state: "active" },
              { from: "n4", to: "n3", directed: true, state: "active" },
            ],
          },
        },
        {
          title: "Merge equal-size trees (1, 3) creating depth-2 path 4 -> 3 -> 1",
          tag: "TRACE",
          explanation: [
            "`union(1, 3)` compares `size[1] = 2` and `size[3] = 2`. Root `3` attaches under root `1`, updating `parent[3] = 1` and `size[1] = 4`.",
            "Notice node `4` is now 2 hops away from root `1` (`4 -> 3 -> 1`).",
          ],
          code: [
            "ra ← find(1)   // 1 (size 2)",
            "rb ← find(3)   // 3 (size 2)",
            "parent[3] ← 1",
            "size[1] ← size[1] + size[3]   // 4",
          ],
          activeLines: [3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "parent", value: "[0, 1, 1, 1, 3]", changed: true },
            { name: "size[1]", value: "4", changed: true },
            { name: "components", value: "2", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "After union(1, 3): 4 points to 3 which points to root 1",
            nodes: [
              { id: "n0", label: "0", x: 14, y: 50, badge: "sz=1" },
              { id: "n1", label: "1", x: 52, y: 18, badge: "root,sz=4", state: "visited" },
              { id: "n2", label: "2", x: 34, y: 60, badge: "p=1" },
              { id: "n3", label: "3", x: 64, y: 48, badge: "p=1", state: "queued" },
              { id: "n4", label: "4", x: 82, y: 84, badge: "p=3", state: "active" },
            ],
            edges: [
              { from: "n2", to: "n1", directed: true },
              { from: "n3", to: "n1", directed: true, state: "active" },
              { from: "n4", to: "n3", directed: true, state: "active" },
            ],
          },
        },
        {
          title: "Run find(4) and compress path 4 -> 1 directly",
          tag: "TRACE",
          explanation: [
            "Calling `find(4)` walks `4 -> 3 -> 1` to discover `root = 1`.",
            "The compression loop rewires `parent[4] = 1` directly, flattening node `4` to depth 1 for all future lookups.",
          ],
          code: [
            "root ← find_root(4)   // walks 4 -> 3 -> 1",
            "while parent[x] != root:",
            "    parent[x] ← root  // sets parent[4] ← 1",
            "return 1",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "root", value: "1", changed: true },
            { name: "parent[4]", value: "1", changed: true },
            { name: "parent", value: "[0, 1, 1, 1, 1]", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Path compression rewires node 4 straight to root 1",
            nodes: [
              { id: "n0", label: "0", x: 14, y: 50, badge: "sz=1" },
              { id: "n1", label: "1", x: 56, y: 20, badge: "root,sz=4", state: "visited" },
              { id: "n2", label: "2", x: 34, y: 74, badge: "p=1" },
              { id: "n3", label: "3", x: 56, y: 74, badge: "p=1" },
              { id: "n4", label: "4", x: 78, y: 74, badge: "p=1", state: "active" },
            ],
            edges: [
              { from: "n2", to: "n1", directed: true },
              { from: "n3", to: "n1", directed: true },
              { from: "n4", to: "n1", directed: true, state: "active" },
            ],
          },
        },
        {
          title: "Detect cycle when edge (2, 4) shares root 1",
          tag: "CHECK",
          explanation: [
            "Suppose undirected edge `(2, 4)` arrives next. `find(2)` returns `1` and `find(4)` returns `1` in a single hop each.",
            "Because `ra == rb`, `union(2, 4)` returns `false` without altering `size` or `components`, proving `(2, 4)` closes a cycle.",
          ],
          code: [
            "ra ← find(2)   // 1",
            "rb ← find(4)   // 1",
            "if ra == rb: return false   // cycle detected!",
          ],
          activeLines: [3],
          codeLabel: "Pseudocode",
          state: [
            { name: "ra == rb", value: "1 == 1 (cycle)", changed: true },
            { name: "parent", value: "[0, 1, 1, 1, 1]" },
            { name: "components", value: "2" },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Compressed forest: link (2, 4) connects two nodes already rooted at 1, closing a cycle",
            nodes: [
              { id: "n0", label: "0", x: 14, y: 50, badge: "sz=1" },
              { id: "n1", label: "1", x: 56, y: 20, badge: "root,sz=4", state: "visited" },
              { id: "n2", label: "2", x: 34, y: 74, badge: "root=1", state: "active" },
              { id: "n3", label: "3", x: 56, y: 74, badge: "p=1" },
              { id: "n4", label: "4", x: 78, y: 74, badge: "root=1", state: "active" },
            ],
            edges: [
              { from: "n2", to: "n1", directed: true, state: "dim" },
              { from: "n3", to: "n1", directed: true, state: "dim" },
              { from: "n4", to: "n1", directed: true, state: "dim" },
              { from: "n2", to: "n4", directed: false, weight: "CYCLE!", state: "active" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Missing the ra == rb guard before updating size or components",
        detail:
          "If `find(a)` and `find(b)` return the same root `r` and you forget `if ra == rb: return false`, running `size[r] += size[r]` doubles the component size and corrupts `components`.",
        code: "if ra == rb:\n    return false   // Exit before merging or decrementing components",
      },
      {
        title: "Thinking rank equals exact tree height after path compression",
        detail:
          "Path compression shrinks tree height without decrementing `rank[root]`. That is intentional and mathematically valid: `rank` only needs to remain an upper bound on height to preserve `O(alpha(n))` complexity.",
      },
      {
        title: "Reading non-root entries in size[] or parent[] directly",
        detail:
          "Only `size[find(x)]` holds the true component size. Stale values left inside `size[child]` or `parent[x]` before calling `find(x)` do not reflect completed merges or compression.",
        code: "function component_size(x):\n    return size[find(x)]",
      },
    ],
    predictChecks: [
      {
        prompt: "Nodes 0 and 1 share root 0 with size[0] = 2 and components = 1. Calling union(0, 1) without the ra == rb guard leaves size[0] and components at what values?",
        code: "function union(a, b):\n    ra = find(a); rb = find(b)\n    // missing: if ra == rb: return false\n    parent[rb] = ra\n    size[ra] += size[rb]\n    components -= 1\n    return true",
        options: [
          { id: "a", label: "size[0] = 2, components = 1" },
          { id: "b", label: "size[0] = 3, components = 0" },
          { id: "c", label: "size[0] = 4, components = 0" },
          { id: "d", label: "size[0] = 2, components = 0" },
        ],
        correctId: "c",
        explanation: "When ra == rb == 0, size[ra] += size[rb] adds size[0] to itself (2 + 2 = 4) and decrements components to 0. Return false immediately whenever ra == rb.",
      },
      {
        prompt: "Nodes 0, 1, 2 start separate (size = [1, 1, 1]). After union(0, 1) (root 0) and union(1, 2) (root 0), what do size[1] and size[find(1)] print?",
        code: "union(0, 1) // parent[1] = 0, size[0] = 2\nunion(1, 2) // find(1) = 0, parent[2] = 0, size[0] = 3\nprint(size[1], size[find(1)])",
        options: [
          { id: "a", label: "size[1] is 1 (stale), while size[find(1)] is 3" },
          { id: "b", label: "size[1] is 2, while size[find(1)] is 3" },
          { id: "c", label: "Both print 3, because union(1, 2) updates size[1]" },
          { id: "d", label: "size[1] is 3, while size[find(1)] is 2" },
        ],
        correctId: "a",
        explanation: "Union by size updates only size[root]. After node 1 attaches under root 0, size[1] keeps its old value 1, so callers must read size[find(1)] to get the component size 3.",
      },
    ],
    practiceTask: {
      title: "Implement UnionFind with Path Compression & Union by Size",
      tier: "Warmup",
      goal: "Build a `UnionFind(n)` structure supporting `find(x)`, `union(a, b)`, `connected(a, b)`, and `component_size(x)` in `O(alpha(n))` amortized time.",
      constraints: [
        "1 <= n <= 10^5",
        "Up to 2 * 10^5 find/union/query calls",
        "Target: O(alpha(n)) amortized per operation, O(n) space",
      ],
      examples: [
        {
          input: "n = 4, union(0, 1), union(1, 2), connected(0, 2), component_size(0), connected(0, 3)",
          output: "true, 3, false",
        },
        {
          input: "n = 3, union(0, 1), union(0, 1), component_size(0), connected(1, 2)",
          output: "2, false",
          explanation: "Duplicate union(0, 1) hits ra == rb and skips merging, keeping component_size(0) at 2.",
        },
      ],
      tasks: [
        "Initialize `parent = [0..n-1]`, `size = [1]*n`, and `components = n`.",
        "Compress every visited node to `root` inside `find(x)`.",
        "Merge smaller `size` root under larger `size` root in `union(a, b)`.",
      ],
      starterCode:
        "class UnionFind:\n    init(n):\n        // TODO\n    function find(x):\n        // TODO\n    function union(a, b):\n        // TODO\n    function connected(a, b):\n        // TODO\n    function component_size(x):\n        // TODO",
      expectedOutput: "true, 3, false\n2, false",
      hint: "Keep the `if ra == rb: return false` check at the top of `union` before swapping `ra, rb` by size.",
      complexity: { time: "O(alpha(n)) amortized per op", space: "O(n)" },
      solutionCode:
        "class UnionFind:\n    init(n):\n        parent ← [0, 1, ..., n - 1]\n        size ← [1] * n\n        components ← n\n\n    function find(x):\n        root ← x\n        while parent[root] != root:\n            root ← parent[root]\n        while parent[x] != root:\n            nxt ← parent[x]\n            parent[x] ← root\n            x ← nxt\n        return root\n\n    function union(a, b):\n        ra ← find(a)\n        rb ← find(b)\n        if ra == rb:\n            return false\n        if size[ra] < size[rb]:\n            swap(ra, rb)\n        parent[rb] ← ra\n        size[ra] ← size[ra] + size[rb]\n        components ← components - 1\n        return true\n\n    function connected(a, b):\n        return find(a) == find(b)\n\n    function component_size(x):\n        return size[find(x)]",
    },
    practiceChallenges: [
      {
        title: "Dynamic Connected Component Counter",
        tier: "Warmup",
        goal: "Given `n` vertices `0..n-1` and a list of undirected `edges`, return the number of connected components after all edges are processed.",
        constraints: [
          "1 <= n <= 10^5",
          "0 <= len(edges) <= 2 * 10^5",
          "Target: O(n + E * alpha(n)) time, O(n) space",
        ],
        examples: [
          { input: "n = 5, edges = [[0, 1], [1, 2], [3, 4]]", output: "2" },
          { input: "n = 4, edges = [[0, 1], [1, 2], [2, 0]]", output: "2" },
        ],
        tasks: [
          "Initialize `components = n` inside `UnionFind(n)`.",
          "Call `union(u, v)` for every edge and decrement `components` only when `ra != rb`.",
          "Return `uf.components`.",
        ],
        starterCode: "function count_components(n, edges):\n    // TODO: return connected component count",
        expectedOutput: "2\n2",
        hint: "Duplicate or cyclic edges where `find(u) == find(v)` must not reduce `components`.",
        complexity: { time: "O(n + E * alpha(n))", space: "O(n)" },
        solutionCode:
          "function count_components(n, edges):\n    uf ← UnionFind(n)\n    for (u, v) in edges:\n        uf.union(u, v)\n    return uf.components",
      },
      {
        title: "First Edge Closing an Undirected Cycle",
        tier: "Core",
        goal: "Given `n` vertices `1..n` and `n` undirected `edges` formed by adding one extra edge to a tree, return the extra edge `[u, v]` that closes a cycle (if multiple appear in the order, return the last one in `edges`).",
        constraints: [
          "3 <= n <= 10^4",
          "len(edges) == n, vertices labeled 1..n",
          "Target: O(n * alpha(n)) time, O(n) space",
        ],
        examples: [
          { input: "edges = [[1, 2], [1, 3], [2, 3]]", output: "[2, 3]" },
          { input: "edges = [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]", output: "[1, 4]" },
        ],
        tasks: [
          "Allocate `UnionFind(n + 1)` for 1-based vertex labels.",
          "Iterate through `edges` in order; whenever `not uf.union(u, v)`, return `[u, v]`.",
        ],
        starterCode: "function find_redundant_connection(edges):\n    // TODO: return the edge that creates a cycle",
        expectedOutput: "[2, 3]\n[1, 4]",
        hint: "A tree on `n` vertices has `n - 1` acyclic edges, so the single extra edge is the unique edge whose endpoints already share a DSU root.",
        complexity: { time: "O(n * alpha(n))", space: "O(n)" },
        solutionCode:
          "function find_redundant_connection(edges):\n    n ← len(edges)\n    uf ← UnionFind(n + 1)\n    for (u, v) in edges:\n        if not uf.union(u, v):\n            return [u, v]\n    return []",
      },
      {
        title: "Largest Cluster Size After Each Merge",
        tier: "Stretch",
        goal: "Given `n` vertices `0..n-1` and an incoming stream of undirected `edges`, return an array where the `i`-th value is the size of the largest connected component immediately after processing `edges[i]`.",
        constraints: [
          "1 <= n <= 10^5",
          "1 <= len(edges) <= 10^5",
          "Target: O(n + E * alpha(n)) time, O(n) space",
        ],
        examples: [
          { input: "n = 5, edges = [[0, 1], [3, 4], [1, 2], [2, 3]]", output: "[2, 2, 3, 5]" },
          { input: "n = 4, edges = [[0, 1], [0, 1], [2, 3]]", output: "[2, 2, 2]", explanation: "Redundant edge [0, 1] does not increase component size, and separate pair [2, 3] leaves max_size at 2." },
        ],
        tasks: [
          "Maintain `max_size = 1` alongside `UnionFind(n)` with union by size.",
          "After each successful merge into root `ra`, update `max_size = max(max_size, uf.size[ra])`.",
          "Append `max_size` to the output list after every edge.",
        ],
        starterCode: "function largest_cluster_stream(n, edges):\n    // TODO: return running maximum component size",
        expectedOutput: "[2, 2, 3, 5]\n[2, 2, 2]",
        hint: "Component sizes only grow monotonically on unions, so tracking a single `max_size` integer avoids scanning `size[]`.",
        complexity: { time: "O(n + E * alpha(n))", space: "O(n)" },
        solutionCode:
          "function largest_cluster_stream(n, edges):\n    uf ← UnionFind(n)\n    max_size ← 1\n    ans ← []\n    for (u, v) in edges:\n        if uf.union(u, v):\n            r ← uf.find(u)\n            if uf.size[r] > max_size:\n                max_size ← uf.size[r]\n        ans.append(max_size)\n    return ans",
      },
    ],
  },

  "dsa-mst-kruskal-prim": {
    lessonId: "dsa-mst-kruskal-prim",
    subtitle:
      "Connect all V vertices with minimum total edge weight using Kruskal's edge sort + DSU cycle check in O(E log E) or Prim's Cut-Property Min-Heap expansion in O(E log V).",
    intro: {
      heading: "Minimum Spanning Trees: Connecting Every Vertex at Minimum Cost",
      explanation: [
        "Picking the cheapest edges blindly to wire `V` stations breaks in two ways. In **Kruskal's algorithm**, accepting an edge `(0, 2, w=3)` when `0` and `2` are already linked via `0-1-2` closes a cycle, hits `V - 1` edges early, and leaves another vertex isolated; in **Prim's algorithm**, marking `visited[v] = true` when pushing to the Min-Heap freezes an expensive `4`-cost edge instead of waiting for a cheaper `2`-cost path, while forgetting `if visited[u]: continue` on pop double-counts vertices from stale heap entries.",
        "Both algorithms solve **Minimum Spanning Tree (MST)** wiring (`V - 1` acyclic edges minimizing total weight) using the **Cut Property**: across any split `(S, V - S)`, the lightest crossing edge belongs to an MST. Kruskal sorts all `E` edges and uses **DSU** to reject cycles in `O(E log E)` time, while Prim grows one component outward from vertex `0` with a **Min-Heap** in `O(E log V)` time.",
      ],
      analogy:
        "Kruskal sorts every fiber-optic cable bid nationwide from cheapest to costliest and signs each contract that links two previously isolated towns. Prim starts in one city and repeatedly lays the cheapest cable out from the wired grid to an unreached town.",
      realWorldUses: [
        "Designing minimum-length fiber, electrical, or water distribution networks across stations",
        "Single-linkage hierarchical clustering by removing the heaviest MST edges to form k clusters",
      ],
    },
    sections: [
      {
        heading: "Kruskal's Algorithm: Sorted Edges + DSU Cycle Check",
        paragraphs: [
          "Sort `edges` by `weight` ascending in `O(E log E)` time, then scan each `(u, v, w)` and call `uf.union(u, v)`. Trace `n = 4` with sorted edges `[(0,1,1), (1,2,2), (0,2,3), (2,3,4)]`: `(0,1,1)` and `(1,2,2)` merge `{0, 1, 2}` (`total = 3`). Next comes `(0,2,3)`, where `find(0) == find(2)`—without DSU rejecting it, you would add `3`, reach `3` edges, and miss vertex `3` completely.",
          "Accepting an edge only when `uf.union(u, v)` returns `true` keeps the subgraph acyclic. Stop as soon as `edges_used == n - 1`, and return `-1` if the loop ends with `edges_used != n - 1` (meaning the graph is disconnected).",
        ],
        code: [
          "function kruskal_mst(n, edges):",
          "    if n <= 1: return 0",
          "    // edges: list of (u, v, w)",
          "    sort edges ascending by w            // O(E log E)",
          "    uf ← UnionFind(n)",
          "    total_cost ← 0",
          "    edges_used ← 0",
          "    for (u, v, w) in edges:",
          "        if uf.union(u, v):               // false on cycle edge (0,2,3)",
          "            total_cost ← total_cost + w",
          "            edges_used ← edges_used + 1",
          "            if edges_used == n - 1:",
          "                break",
          "    if edges_used != n - 1:",
          "        return -1                        // disconnected graph",
          "    return total_cost",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Kruskal vs Prim MST comparison",
          headers: ["Dimension", "Kruskal's Algorithm", "Prim's Algorithm (Min-Heap)"],
          rows: [
            ["Core tools", "Sorting (M11) + DSU", "Adjacency list + Min-Heap (M15)"],
            ["Time complexity", "O(E log E)", "O(E log V) (or O(V^2) dense array scan)"],
            ["Extra space", "O(V + E) for sorted edges + DSU", "O(V + E) for visited + heap"],
            ["Best suited for", "Sparse graphs & pre-given edge lists", "Dense graphs & implicit all-pairs graphs"],
            ["Disconnected behavior", "Produces Minimum Spanning Forest", "Covers only start vertex's component"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Because `E <= V^2` in any simple graph, `log E <= 2 log V`. So Kruskal's `O(E log E)` and Prim's `O(E log V)` share the same bound on sparse graphs, while array-based `O(V^2)` Prim wins on dense `E ~ V^2` graphs.",
        },
      },
      {
        heading: "Prim's Algorithm: Stale Heap Entries & Cut Property",
        paragraphs: [
          "Prim grows one tree `S` starting from vertex `0` by always popping the lightest crossing edge out of `S`. Trace edges `0-1 (w=1)`, `0-2 (w=4)`, and `1-2 (w=2)`: popping `0` pushes `(1, 1)` and `(4, 2)`. Next `(1, 1)` pops and pushes `(2, 2)`. The heap now holds both `(2, 2)` and the heavier `(4, 2)`.",
          "When `(2, 2)` pops first, `visited[2]` becomes `true` at cost `2`. Later `(4, 2)` surfaces as a stale entry and `if visited[u]: continue` discards it. Contrast Valid vs Invalid: marking `visited[v] = true` at push time would freeze vertex `2` at cost `4` instead of `2`; mark `visited[u] = true` only when `u` is popped.",
        ],
        code: [
          "// Invalid: visited[v] = true on push locks in heavier edge (4, 2)",
          "// Valid: push (edge_w, v), mark visited[u] = true only on pop",
          "function prim_mst(n, adj):",
          "    // adj[u] stores (v, w) pairs",
          "    visited ← [false] * n",
          "    min_heap ← MinHeap()                 // stores (w, u)",
          "    min_heap.push((0, 0))",
          "    total_cost ← 0",
          "    visited_count ← 0",
          "    while not min_heap.empty() and visited_count < n:",
          "        (w, u) ← min_heap.pop_min()",
          "        if visited[u]:",
          "            continue                     // discard stale (4, 2)",
          "        visited[u] ← true",
          "        total_cost ← total_cost + w",
          "        visited_count ← visited_count + 1",
          "        for (v, edge_w) in adj[u]:",
          "            if not visited[v]:",
          "                min_heap.push((edge_w, v))",
          "    if visited_count != n:",
          "        return -1",
          "    return total_cost",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Cut Property invariants inside Prim's loop",
          headers: ["Step", "Invariant Maintained"],
          rows: [
            ["Heap contents", "Every entry (w, v) is an edge crossing from visited S to V - S when pushed"],
            ["Popped minimum", "First time v is popped, w is the globally lightest edge entering v from S"],
            ["Stale duplicate skip", "if visited[u]: continue discards heavier backup edges pushed earlier"],
            ["Early termination", "Stopping at visited_count == n skips remaining unused heap entries"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Do not set `visited[v] = true` when pushing `(edge_w, v)` onto the Min-Heap in Prim's. A later node in `S` can offer a cheaper edge to `v`, so mark `visited[u] = true` only on pop.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build MST Selection: Cycle Guard, Bounds, and Stale PQ Skip",
      subtitle: "Move from Kruskal's sorted edge filter to early exit and Prim's heap variant.",
      steps: [
        {
          label: "Step 1: Sort edges and reject cycles with DSU",
          explanation: "Sort edges by weight ascending and add `(u, v, w)` only when `uf.union(u, v)` returns `true`, skipping cycle edges like `(0, 2, w=3)`.",
          code: [
            "sort edges ascending by w",
            "uf ← UnionFind(n); total ← 0",
            "for (u, v, w) in edges:",
            "    if uf.union(u, v):",
            "        total ← total + w",
          ],
          activeLines: [1, 4, 5],
          output: "skips (0, 2, w=3) because find(0) == find(2)",
        },
        {
          label: "Step 2: Stop at n - 1 edges and guard disconnected graphs",
          explanation: "Return `0` immediately when `n <= 1`, exit early once `edges_used == n - 1`, and return `-1` if fewer than `n - 1` edges connected the graph.",
          code: [
            "if n <= 1: return 0",
            "edges_used ← 0",
            "for (u, v, w) in edges:",
            "    if uf.union(u, v):",
            "        total ← total + w; edges_used ← edges_used + 1",
            "        if edges_used == n - 1: return total",
            "return -1",
          ],
          activeLines: [1, 6, 7],
          output: "stops at 3 edges (cost 7), returns -1 if < n - 1",
        },
        {
          label: "Step 3: Prim's Min-Heap with pop-time visited check",
          explanation: "Mark `visited[u] = true` only when popping `(w, u)` and discard duplicate heap entries with `if visited[u]: continue`.",
          code: [
            "min_heap.push((0, 0))",
            "while not min_heap.empty() and visited_count < n:",
            "    (w, u) ← min_heap.pop_min()",
            "    if visited[u]: continue",
            "    visited[u] ← true; total ← total + w; visited_count += 1",
            "    for (v, ew) in adj[u]:",
            "        if not visited[v]: min_heap.push((ew, v))",
          ],
          activeLines: [4, 5, 7],
          output: "pops (2, 2) before stale (4, 2); skips stale entry",
        },
      ],
    },
    walkthrough: {
      title: "Tracing Kruskal's MST on a 5-Vertex Weighted Graph",
      layout: "visual-first",
      steps: [
        {
          title: "Sort all 7 undirected edges by weight ascending",
          tag: "CONCEPT",
          explanation: [
            "Start with `n = 5` vertices `{0, 1, 2, 3, 4}` and sort the 7 edges ascending: `(0,1,1)`, `(2,3,2)`, `(1,2,3)`, `(0,2,4)`, `(3,4,5)`, `(1,4,6)`, `(1,3,7)`.",
            "Initialize `UnionFind(5)` with `total_cost = 0` and `edges_used = 0`.",
          ],
          code: [
            "sort(edges by w)   // [(0,1,1), (2,3,2), (1,2,3), (0,2,4), (3,4,5), ...]",
            "uf ← UnionFind(5)",
            "total_cost ← 0, edges_used ← 0",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "edges_used", value: "0 / 4" },
            { name: "total_cost", value: "0" },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Weighted undirected graph with V = 5 and E = 7",
            nodes: [
              { id: "n0", label: "0", x: 16, y: 50 },
              { id: "n1", label: "1", x: 46, y: 18 },
              { id: "n2", label: "2", x: 46, y: 82 },
              { id: "n3", label: "3", x: 82, y: 82 },
              { id: "n4", label: "4", x: 82, y: 18 },
            ],
            edges: [
              { from: "n0", to: "n1", weight: "1" },
              { from: "n2", to: "n3", weight: "2" },
              { from: "n1", to: "n2", weight: "3" },
              { from: "n0", to: "n2", weight: "4" },
              { from: "n3", to: "n4", weight: "5" },
              { from: "n1", to: "n4", weight: "6" },
              { from: "n1", to: "n3", weight: "7" },
            ],
          },
        },
        {
          title: "Accept lightest edges (0, 1, w=1) and (2, 3, w=2)",
          tag: "TRACE",
          explanation: [
            "`union(0, 1)` succeeds (`total_cost = 1`), then `union(2, 3)` succeeds (`total_cost = 3`).",
            "We now have 3 components `{0, 1}`, `{2, 3}`, `{4}` and `edges_used = 2`.",
          ],
          code: [
            "uf.union(0, 1)   // true -> total_cost = 1, edges_used = 1",
            "uf.union(2, 3)   // true -> total_cost = 3, edges_used = 2",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "accepted", value: "(0,1,w=1), (2,3,w=2)", changed: true },
            { name: "edges_used", value: "2 / 4", changed: true },
            { name: "total_cost", value: "3", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Edges (0,1) and (2,3) link two separate disjoint pairs",
            nodes: [
              { id: "n0", label: "0", x: 16, y: 50, state: "visited" },
              { id: "n1", label: "1", x: 46, y: 18, state: "visited" },
              { id: "n2", label: "2", x: 46, y: 82, state: "active" },
              { id: "n3", label: "3", x: 82, y: 82, state: "active" },
              { id: "n4", label: "4", x: 82, y: 18 },
            ],
            edges: [
              { from: "n0", to: "n1", weight: "1", state: "active" },
              { from: "n2", to: "n3", weight: "2", state: "active" },
              { from: "n1", to: "n2", weight: "3" },
              { from: "n0", to: "n2", weight: "4" },
              { from: "n3", to: "n4", weight: "5" },
              { from: "n1", to: "n4", weight: "6" },
              { from: "n1", to: "n3", weight: "7" },
            ],
          },
        },
        {
          title: "Accept (1, 2, w=3) to merge {0,1} and {2,3}",
          tag: "TRACE",
          explanation: [
            "`find(1)` and `find(2)` belong to distinct sets, so `union(1, 2)` merges `{0, 1, 2, 3}`.",
            "`total_cost` becomes `3 + 3 = 6` with `edges_used = 3`.",
          ],
          code: [
            "if uf.union(1, 2):",
            "    total_cost ← 6",
            "    edges_used ← 3",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "edge", value: "(1, 2) w=3", changed: true },
            { name: "edges_used", value: "3 / 4", changed: true },
            { name: "total_cost", value: "6", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Edge (1,2) merges the two pairs into component {0,1,2,3}",
            nodes: [
              { id: "n0", label: "0", x: 16, y: 50, state: "visited" },
              { id: "n1", label: "1", x: 46, y: 18, state: "active" },
              { id: "n2", label: "2", x: 46, y: 82, state: "active" },
              { id: "n3", label: "3", x: 82, y: 82, state: "visited" },
              { id: "n4", label: "4", x: 82, y: 18 },
            ],
            edges: [
              { from: "n0", to: "n1", weight: "1", state: "active" },
              { from: "n2", to: "n3", weight: "2", state: "active" },
              { from: "n1", to: "n2", weight: "3", state: "active" },
              { from: "n0", to: "n2", weight: "4" },
              { from: "n3", to: "n4", weight: "5" },
              { from: "n1", to: "n4", weight: "6" },
              { from: "n1", to: "n3", weight: "7" },
            ],
          },
        },
        {
          title: "Reject (0, 2, w=4) because it creates a cycle",
          tag: "PITFALL",
          explanation: [
            "Next sorted edge is `(0, 2, w=4)`. Checking DSU finds `find(0) == find(2)` because `0 - 1 - 2` already connects them.",
            "`uf.union(0, 2)` returns `false`, so we skip `(0, 2)` and keep `total_cost = 6`.",
          ],
          code: [
            "if uf.union(0, 2):    // returns false! (0 and 2 already connected)",
            "    // skipped",
          ],
          activeLines: [1],
          codeLabel: "Pseudocode",
          state: [
            { name: "edge", value: "(0, 2) w=4 -> SKIP", changed: true },
            { name: "edges_used", value: "3 / 4" },
            { name: "total_cost", value: "6" },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Edge (0,2) is rejected because 0 and 2 already share a DSU root",
            nodes: [
              { id: "n0", label: "0", x: 16, y: 50, state: "queued" },
              { id: "n1", label: "1", x: 46, y: 18, state: "visited" },
              { id: "n2", label: "2", x: 46, y: 82, state: "queued" },
              { id: "n3", label: "3", x: 82, y: 82, state: "visited" },
              { id: "n4", label: "4", x: 82, y: 18 },
            ],
            edges: [
              { from: "n0", to: "n1", weight: "1", state: "active" },
              { from: "n2", to: "n3", weight: "2", state: "active" },
              { from: "n1", to: "n2", weight: "3", state: "active" },
              { from: "n0", to: "n2", weight: "4", state: "dim" },
              { from: "n3", to: "n4", weight: "5" },
              { from: "n1", to: "n4", weight: "6" },
              { from: "n1", to: "n3", weight: "7" },
            ],
          },
        },
        {
          title: "Accept (3, 4, w=5), reach V - 1 = 4 edges, and stop",
          tag: "CHECK",
          explanation: [
            "`union(3, 4)` succeeds and brings vertex `4` into the tree (`total_cost = 6 + 5 = 11`, `edges_used = 4 == n - 1`).",
            "Kruskal breaks early without needing to inspect `(1, 4, 6)` or `(1, 3, 7)`.",
          ],
          code: [
            "if uf.union(3, 4):",
            "    total_cost ← 11, edges_used ← 4",
            "    if edges_used == 4: break   // MST complete!",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "edges_used", value: "4 / 4 (done)", changed: true },
            { name: "total_cost", value: "11", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Final MST connects all 5 vertices with 4 edges of total cost 11",
            nodes: [
              { id: "n0", label: "0", x: 16, y: 50, state: "visited" },
              { id: "n1", label: "1", x: 46, y: 18, state: "visited" },
              { id: "n2", label: "2", x: 46, y: 82, state: "visited" },
              { id: "n3", label: "3", x: 82, y: 82, state: "visited" },
              { id: "n4", label: "4", x: 82, y: 18, state: "visited" },
            ],
            edges: [
              { from: "n0", to: "n1", weight: "1", state: "active" },
              { from: "n2", to: "n3", weight: "2", state: "active" },
              { from: "n1", to: "n2", weight: "3", state: "active" },
              { from: "n0", to: "n2", weight: "4", state: "dim" },
              { from: "n3", to: "n4", weight: "5", state: "active" },
              { from: "n1", to: "n4", weight: "6", state: "dim" },
              { from: "n1", to: "n3", weight: "7", state: "dim" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Returning partial cost on a disconnected graph",
        detail:
          "If a graph has two disconnected islands, Kruskal stops with fewer than `V - 1` edges and Prim finishes only the starting component. Always check `edges_used == n - 1` (or `visited_count == n`) before returning an MST total.",
        code: "if edges_used != n - 1:\n    return -1",
      },
      {
        title: "Running Kruskal or Prim on a directed graph",
        detail:
          "MST algorithms assume undirected edges. On a directed graph, a minimum spanning arborescence requires specialized algorithms (Edmonds/Chu-Liu), not Kruskal or Prim.",
      },
      {
        title: "Dense implicit graphs favor O(V^2) Prim over Kruskal",
        detail:
          "When `n = 1000` points form a complete graph (`E ~ 500,000` edges), sorting all `E` edges takes more memory and time than running Prim's `min_dist[v]` scan in `O(V^2)` time and `O(V)` space.",
      },
    ],
    practiceTask: {
      title: "Minimum Spanning Tree Cost with Kruskal",
      tier: "Warmup",
      goal: "Given `n` vertices `0..n-1` and undirected weighted edges `[u, v, w]`, return the minimum total weight of a spanning tree, or `-1` if the graph is disconnected.",
      constraints: [
        "1 <= n <= 10^4",
        "0 <= len(edges) <= 10^5",
        "Target: O(E log E) time, O(n) DSU space",
      ],
      examples: [
        {
          input: "n = 4, edges = [[0, 1, 1], [0, 2, 4], [1, 2, 2], [2, 3, 3]]",
          output: "6",
        },
        {
          input: "n = 3, edges = [[0, 1, 5]]",
          output: "-1",
        },
      ],
      tasks: [
        "Handle the `n == 1` edge case (`0` cost).",
        "Sort `edges` by `w` ascending and merge with `UnionFind(n)`.",
        "Return `total_cost` if `edges_used == n - 1`, else `-1`.",
      ],
      starterCode:
        "function mst_cost(n, edges):\n    // TODO: Kruskal's MST using UnionFind",
      expectedOutput: "6\n-1",
      hint: "Make sure `n == 1` returns `0` immediately because `n - 1 == 0` edges are already satisfied.",
      complexity: { time: "O(E log E)", space: "O(V + E)" },
      solutionCode:
        "function mst_cost(n, edges):\n    if n <= 1:\n        return 0\n    sort edges ascending by w\n    parent ← [0, 1, ..., n - 1]\n    rank ← [0] * n\n    function find(x):\n        while parent[x] != x:\n            parent[x] ← parent[parent[x]]\n            x ← parent[x]\n        return x\n    total_cost ← 0\n    edges_used ← 0\n    for (u, v, w) in edges:\n        ra ← find(u); rb ← find(v)\n        if ra != rb:\n            if rank[ra] < rank[rb]: swap(ra, rb)\n            parent[rb] ← ra\n            if rank[ra] == rank[rb]: rank[ra] += 1\n            total_cost ← total_cost + w\n            edges_used ← edges_used + 1\n            if edges_used == n - 1:\n                return total_cost\n    return -1",
    },
    practiceChallenges: [
      {
        title: "Minimum Cost to Connect All Cities",
        tier: "Warmup",
        goal: "Given `n` cities labeled `1..n` and bidirectional road options `[u, v, cost]`, return the minimum total cost to connect all `n` cities, or `-1` if impossible.",
        constraints: [
          "1 <= n <= 10^4",
          "1 <= cost <= 10^5",
          "Target: O(E log E) time",
        ],
        examples: [
          { input: "n = 3, roads = [[1, 2, 5], [1, 3, 6], [2, 3, 1]]", output: "6" },
          { input: "n = 4, roads = [[1, 2, 3], [3, 4, 4]]", output: "-1" },
        ],
        tasks: [
          "Sort `roads` by `cost` ascending.",
          "Initialize 1-based `parent[0..n]` and `rank[0..n]` directly to accept `n - 1` acyclic roads.",
        ],
        starterCode: "function min_connect_cities(n, roads):\n    // TODO: return minimum total road cost or -1",
        expectedOutput: "6\n-1",
        hint: "With 1-based city IDs `1..n`, allocate `parent` and `rank` of size `n + 1` (`parent[i] = i`) and return `total` as soon as `used == n - 1`.",
        complexity: { time: "O(E log E)", space: "O(n)" },
        solutionCode:
          "function min_connect_cities(n, roads):\n    if n <= 1:\n        return 0\n    sort roads ascending by cost\n    parent ← [0, 1, ..., n]\n    rank ← array of size (n + 1) filled with 0\n    function find(x):\n        while parent[x] != x:\n            parent[x] ← parent[parent[x]]\n            x ← parent[x]\n        return x\n    total ← 0\n    used ← 0\n    for (u, v, cost) in roads:\n        ru ← find(u); rv ← find(v)\n        if ru != rv:\n            if rank[ru] < rank[rv]: ru, rv ← rv, ru\n            parent[rv] ← ru\n            if rank[ru] == rank[rv]: rank[ru] ← rank[ru] + 1\n            total ← total + cost\n            used ← used + 1\n            if used == n - 1:\n                return total\n    return -1",
      },
      {
        title: "Minimum Manhattan Wiring Across Coordinates",
        tier: "Core",
        goal: "Given `n` 2D coordinates `points[i] = [x, y]`, connect all points with minimum total Manhattan distance `|x1 - x2| + |y1 - y2|`.",
        constraints: [
          "1 <= n <= 1000",
          "-10^6 <= x, y <= 10^6",
          "Target: O(n^2) time, O(n) space via array-scan Prim's",
        ],
        examples: [
          { input: "points = [[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]", output: "20" },
          { input: "points = [[5, -2]]", output: "0", explanation: "A single point requires zero edges, so total MST weight is 0." },
        ],
        tasks: [
          "Maintain `min_dist[i]` initialized to `INF` (`min_dist[0] = 0`) and `in_mst[i] = false`.",
          "Repeat `n` times: pick unvisited `u` with smallest `min_dist[u]`, add to `total`, and update `min_dist[v]` for every unvisited `v`.",
        ],
        starterCode: "function min_cost_connect_points(points):\n    // TODO: O(n^2) Prim's without materializing all O(n^2) edges",
        expectedOutput: "20\n0",
        hint: "On a complete graph of 1000 points, scanning `min_dist[0..n-1]` avoids allocating 500,000 edge tuples.",
        complexity: { time: "O(n^2)", space: "O(n)" },
        solutionCode:
          "function min_cost_connect_points(points):\n    n ← len(points)\n    min_dist ← [INF] * n\n    in_mst ← [false] * n\n    min_dist[0] ← 0\n    total ← 0\n    for step from 0 to n - 1:\n        u ← -1\n        for i from 0 to n - 1:\n            if not in_mst[i] and (u == -1 or min_dist[i] < min_dist[u]):\n                u ← i\n        in_mst[u] ← true\n        total ← total + min_dist[u]\n        for v from 0 to n - 1:\n            if not in_mst[v]:\n                d ← abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])\n                if d < min_dist[v]:\n                    min_dist[v] ← d\n    return total",
      },
      {
        title: "Complete a Network with Pre-Existing Links",
        tier: "Stretch",
        goal: "Given `n` nodes `1..n`, already-built free edges `existing`, and candidate paid edges `candidates = [u, v, cost]`, return the minimum additional cost to connect all `n` nodes (or `-1` if impossible).",
        constraints: [
          "1 <= n <= 10^4",
          "0 <= len(existing), len(candidates) <= 10^5",
          "Target: O(E log E) time, O(n) space",
        ],
        examples: [
          {
            input: "n = 6, existing = [[1, 4], [4, 5], [2, 3]], candidates = [[1, 2, 5], [1, 3, 10], [1, 6, 2], [5, 6, 5]]",
            output: "7",
          },
          {
            input: "n = 4, existing = [[1, 2], [2, 1]], candidates = [[2, 3, 5]]",
            output: "-1",
            explanation: "Node 4 has no edges in existing or candidates, leaving the network disconnected (-1).",
          },
        ],
        tasks: [
          "Pre-merge all `existing` edges into 1-based `parent[0..n]` / `rank[0..n]` at zero cost (guarding for cycles inside `existing`!).",
          "Sort `candidates` by `cost` ascending and union edges until `components_left == 1` (decrementing only when `find(u) != find(v)`).",
        ],
        starterCode: "function min_additional_cost(n, existing, candidates):\n    // TODO: pre-union existing edges, then Kruskal on candidates",
        expectedOutput: "7\n-1",
        hint: "If `existing` itself contains cycles, counting `edges_used` breaks; instead track `components_left = n` and decrement only when `find(u) != find(v)` merges two roots.",
        complexity: { time: "O(E log E)", space: "O(n)" },
        solutionCode:
          "function min_additional_cost(n, existing, candidates):\n    parent ← [0, 1, ..., n]\n    rank ← array of size (n + 1) filled with 0\n    function find(x):\n        while parent[x] != x:\n            parent[x] ← parent[parent[x]]\n            x ← parent[x]\n        return x\n    function union_roots(a, b):\n        ra ← find(a); rb ← find(b)\n        if ra == rb: return false\n        if rank[ra] < rank[rb]: ra, rb ← rb, ra\n        parent[rb] ← ra\n        if rank[ra] == rank[rb]: rank[ra] ← rank[ra] + 1\n        return true\n    components_left ← n\n    for (u, v) in existing:\n        if union_roots(u, v):\n            components_left ← components_left - 1\n    if components_left == 1:\n        return 0\n    sort candidates ascending by cost\n    added_cost ← 0\n    for (u, v, cost) in candidates:\n        if union_roots(u, v):\n            added_cost ← added_cost + cost\n            components_left ← components_left - 1\n            if components_left == 1:\n                return added_cost\n    return -1",
      },
    ],
  },

  "dsa-shortest-paths": {
    lessonId: "dsa-shortest-paths",
    subtitle:
      "Match single-source shortest path algorithms to edge weights: Dijkstra's Min-Heap with stale entry skipping (w >= 0), 0-1 BFS with a Deque (w in {0, 1}), and Bellman-Ford's V - 1 edge relaxations (negative weights & cycles).",
    intro: {
      heading: "Single-Source Shortest Paths: Matching the Algorithm to Weights",
      explanation: [
        "Run Dijkstra on `0 -> 2 (4)`, `0 -> 1 (5)`, `1 -> 2 (-3)` and it fails without raising an error: Dijkstra pops `(4, 2)` first, treats vertex `2` as settled at distance `4`, and misses the shorter `0 -> 1 -> 2` path of total weight `5 + (-3) = 2` (and if you let settled nodes re-enter, negative cycles loop forever). Conversely, running Dijkstra's heap when every weight is `0` or `1` pays an avoidable `log V` factor on every push.",
        "Three algorithms cover all single-source weighted graphs: **Dijkstra's algorithm** uses a **Min-Heap** in `O((V + E) log V)` when `w >= 0` (discarding stale heap entries with `if d > dist[u]: continue`), **0-1 BFS** uses an M13 **Deque** in `O(V + E)` when `w` is `0` or `1`, and **Bellman-Ford** runs `V - 1` edge-relaxation rounds in `O(V * E)` to handle negative weights and catch reachable **negative-weight cycles**.",
      ],
      analogy:
        "Dijkstra acts like water ripples settling the nearest reachable junction first because future edges only add non-negative cost. 0-1 BFS works like a doorway queue where free 0-cost doors send you to the front while 1-ticket doors place you at the back. Bellman-Ford updates a town-wide bulletin for V - 1 rounds so negative discounts finish rippling across every path.",
      realWorldUses: [
        "GPS turn-by-turn navigation and OSPF internet packet routing on non-negative edge costs",
        "Detecting currency exchange arbitrage loops (negative-weight log-rate cycles) with Bellman-Ford",
      ],
    },
    sections: [
      {
        heading: "Dijkstra's Algorithm: Stale Entries & Negative-Weight Counterexample",
        paragraphs: [
          "Dijkstra sets `dist[src] = 0`, all other `dist[v] = INF`, and pushes `(0, src)`. Because binary heaps lack `O(log V)` decrease-key by vertex ID without an index table, we push a new `(new_dist, v)` whenever `dist[v]` drops and leave the older tuple in the heap. On `0 -> 2 (5)`, `0 -> 1 (2)`, `1 -> 2 (1)`, `(3, 2)` pops before `(5, 2)`; when `(5, 2)` surfaces later, `if d > dist[u]: continue` discards it in `O(1)`.",
          "Contrast that with the negative-edge counterexample `0 -> 2 (4)`, `0 -> 1 (5)`, `1 -> 2 (-3)`: popping `(4, 2)` settles `dist[2] = 4` before `1` is even expanded, so if settled nodes are locked, `dist[2]` stays wrong at `4` instead of `2`. Dijkstra requires `w >= 0` on every edge.",
        ],
        code: [
          "// Counterexample where settled-node Dijkstra returns 4 instead of 2:",
          "// edges: 0->2 (w=4), 0->1 (w=5), 1->2 (w=-3)",
          "",
          "// Valid for w >= 0:",
          "function dijkstra(n, adj, src):",
          "    dist ← [INF] * n",
          "    dist[src] ← 0",
          "    pq ← MinHeap()                       // stores (d, u)",
          "    pq.push((0, src))",
          "    while not pq.empty():",
          "        (d, u) ← pq.pop_min()",
          "        if d > dist[u]:",
          "            continue                     // stale heap entry skip",
          "        for (v, w) in adj[u]:",
          "            if d + w < dist[v]:",
          "                dist[v] ← d + w",
          "                pq.push((dist[v], v))",
          "    return dist",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Single-Source Shortest Path algorithms by weight constraints",
          headers: ["Algorithm", "Allowed Weights", "Core Structure", "Time Complexity", "Negative Cycles"],
          rows: [
            ["Standard BFS (M18)", "All equal (w = 1)", "FIFO Queue", "O(V + E)", "Not supported"],
            ["0-1 BFS", "w in {0, 1}", "Deque (M13)", "O(V + E)", "Not supported"],
            ["Dijkstra", "w >= 0", "Min-Heap (M15)", "O((V + E) log V)", "Breaks on negative edges"],
            ["Bellman-Ford", "Any real weight", "Edge list + V-1 passes", "O(V * E)", "Detects on V-th pass"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "WATCH OUT",
          text: "Never run Dijkstra when edges can be negative. Once a node `u` is popped, Dijkstra assumes `dist[u]` is final; a negative edge reached later can undercut it.",
        },
      },
      {
        heading: "0-1 BFS (Deque) and Bellman-Ford (V - 1 Relaxations)",
        paragraphs: [
          "When weights belong strictly to `{0, 1}`, deque entries hold at most two distances (`d` at the front, `d + 1` at the back). **0-1 BFS** pops `u` from the front, relaxes `dist[v] = dist[u] + w`, and pushes `v` to the `front` for `w == 0` or `back` for `w == 1`—keeping distances sorted in `O(V + E)` without a heap. Never mark `visited[v]` on push: a `0`-edge can later reach `v` cheaper than an earlier `1`-edge.",
          "**Bellman-Ford** fixes the negative-edge counterexample `0 -> 2 (4), 0 -> 1 (5), 1 -> 2 (-3)`: Round 1 sets `dist = [0, 5, 4]`, and Round 2 relaxes `1 -> 2 (-3)` to settle `dist[2] = 2`. Running `V - 1` rounds settles all simple shortest paths, and if the `V`-th pass still relaxes an edge with `dist[u] != INF`, a reachable **negative-weight cycle** exists.",
        ],
        code: [
          "function zero_one_bfs(n, adj, src):",
          "    dist ← [INF] * n",
          "    dist[src] ← 0",
          "    dq ← Deque([src])",
          "    while not dq.empty():",
          "        u ← dq.pop_front()",
          "        for (v, w) in adj[u]:",
          "            if dist[u] + w < dist[v]:",
          "                dist[v] ← dist[u] + w",
          "                if w == 0: dq.push_front(v)",
          "                else:      dq.push_back(v)",
          "    return dist",
          "",
          "function bellman_ford(n, edges, src):",
          "    dist ← [INF] * n",
          "    dist[src] ← 0",
          "    for round from 1 to n - 1:",
          "        changed ← false",
          "        for (u, v, w) in edges:",
          "            if dist[u] != INF and dist[u] + w < dist[v]:",
          "                dist[v] ← dist[u] + w",
          "                changed ← true",
          "        if not changed: break",
          "    for (u, v, w) in edges:              // V-th pass cycle check",
          "        if dist[u] != INF and dist[u] + w < dist[v]:",
          "            return null                   // negative cycle reachable",
          "    return dist",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "0-1 BFS Deque invariant vs Bellman-Ford Pass invariant",
          headers: ["Property", "0-1 BFS", "Bellman-Ford"],
          rows: [
            ["Queue / Loop rule", "w=0 -> push_front, w=1 -> push_back", "Relax all E edges for V - 1 rounds"],
            ["Monotonicity", "Deque contains at most two values: d and d+1", "After round k, shortest paths <= k edges are exact"],
            ["Early stop", "Deque empties", "A full round triggers zero relaxations"],
          ],
          highlightCol: 1,
        },
        callout: {
          kind: "KEY IDEA",
          text: "Guard every Bellman-Ford relaxation with `dist[u] != INF`. Otherwise `INF + (-5) < INF` evaluates true on finite sentinel values and corrupts unreachable vertices.",
        },
      },
    ],
    guidedBuildUp: {
      title: "From Basic Heap Relaxation to Stale-Skip & Bellman-Ford",
      subtitle: "Build Dijkstra with stale-entry filtering, then add negative-weight relaxation.",
      steps: [
        {
          label: "Step 1: Min-Heap relaxation from dist[src] = 0",
          explanation: "Initialize `dist[src] = 0` and push `(d + w, v)` whenever a path through `u` beats the current `dist[v]`.",
          code: [
            "dist ← [INF] * n; dist[src] ← 0",
            "pq ← MinHeap([(0, src)])",
            "while not pq.empty():",
            "    (d, u) ← pq.pop_min()",
            "    for (v, w) in adj[u]:",
            "        if d + w < dist[v]:",
            "            dist[v] ← d + w; pq.push((dist[v], v))",
          ],
          activeLines: [4, 6, 7],
          output: "updates dist[2] = 3 after initial 5",
        },
        {
          label: "Step 2: Discard stale heap tuples with d > dist[u]",
          explanation: "Because earlier pushes stay in the heap, skip any popped `(d, u)` whose `d` is already worse than `dist[u]` so `adj[u]` is scanned once.",
          code: [
            "while not pq.empty():",
            "    (d, u) ← pq.pop_min()",
            "    if d > dist[u]:",
            "        continue",
            "    for (v, w) in adj[u]:",
            "        if d + w < dist[v]:",
            "            dist[v] ← d + w; pq.push((dist[v], v))",
          ],
          activeLines: [3, 4],
          output: "skips stale (5, 2) because 5 > dist[2] (3)",
        },
        {
          label: "Step 3: Switch to Bellman-Ford when edges can be negative",
          explanation: "Run `n - 1` relaxation passes guarding `dist[u] != INF`, then check on the `n`-th pass whether any edge still shrinks `dist[v]` (a reachable negative cycle).",
          code: [
            "for round from 1 to n - 1:",
            "    for (u, v, w) in edges:",
            "        if dist[u] != INF and dist[u] + w < dist[v]:",
            "            dist[v] ← dist[u] + w",
            "for (u, v, w) in edges:",
            "    if dist[u] != INF and dist[u] + w < dist[v]:",
            "        return null",
          ],
          activeLines: [3, 6, 7],
          output: "handles 1 -> 2 (-3) to get 2; flags negative cycle",
        },
      ],
    },
    walkthrough: {
      title: "Tracing Dijkstra's Min-Heap Relaxation and Stale Entry Skip",
      layout: "visual-first",
      steps: [
        {
          title: "Initialize dist[] with 0 at source and INF elsewhere",
          tag: "MEMORY",
          explanation: [
            "Start at `src = 0` on a 5-vertex directed weighted graph. Set `dist = [0, INF, INF, INF, INF]` and push `(0, 0)` into the Min-Heap.",
          ],
          code: [
            "dist ← [0, INF, INF, INF, INF]",
            "pq ← [(0, 0)]",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "dist", value: "[0, INF, INF, INF, INF]" },
            { name: "pq", value: "[(0, 0)]" },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Initial directed weighted graph with source 0 at distance 0",
            nodes: [
              { id: "n0", label: "0", x: 14, y: 50, badge: "d=0", state: "active" },
              { id: "n1", label: "1", x: 40, y: 18, badge: "d=INF" },
              { id: "n2", label: "2", x: 40, y: 82, badge: "d=INF" },
              { id: "n3", label: "3", x: 70, y: 24, badge: "d=INF" },
              { id: "n4", label: "4", x: 86, y: 68, badge: "d=INF" },
            ],
            edges: [
              { from: "n0", to: "n1", weight: "2", directed: true },
              { from: "n0", to: "n2", weight: "5", directed: true },
              { from: "n1", to: "n2", weight: "1", directed: true },
              { from: "n1", to: "n3", weight: "6", directed: true },
              { from: "n2", to: "n3", weight: "2", directed: true },
              { from: "n2", to: "n4", weight: "4", directed: true },
              { from: "n3", to: "n4", weight: "1", directed: true },
            ],
          },
        },
        {
          title: "Pop (0, 0) and relax outgoing edges to 1 and 2",
          tag: "TRACE",
          explanation: [
            "Pop `(0, 0)`. Edge `0 -> 1` (weight `2`) sets `dist[1] = 2`, and `0 -> 2` (weight `5`) sets `dist[2] = 5`.",
            "Both `(2, 1)` and `(5, 2)` enter the Min-Heap.",
          ],
          code: [
            "(d, u) ← pq.pop_min()    // (0, 0)",
            "dist[1] ← 2, pq.push((2, 1))",
            "dist[2] ← 5, pq.push((5, 2))",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "popped", value: "(0, 0)", changed: true },
            { name: "dist", value: "[0, 2, 5, INF, INF]", changed: true },
            { name: "pq", value: "[(2, 1), (5, 2)]", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Vertex 0 settles; vertices 1 (d=2) and 2 (d=5) enter the Min-Heap",
            nodes: [
              { id: "n0", label: "0", x: 14, y: 50, badge: "d=0", state: "visited" },
              { id: "n1", label: "1", x: 40, y: 18, badge: "d=2", state: "queued" },
              { id: "n2", label: "2", x: 40, y: 82, badge: "d=5", state: "queued" },
              { id: "n3", label: "3", x: 70, y: 24, badge: "d=INF" },
              { id: "n4", label: "4", x: 86, y: 68, badge: "d=INF" },
            ],
            edges: [
              { from: "n0", to: "n1", weight: "2", directed: true, state: "active" },
              { from: "n0", to: "n2", weight: "5", directed: true, state: "active" },
              { from: "n1", to: "n2", weight: "1", directed: true },
              { from: "n1", to: "n3", weight: "6", directed: true },
              { from: "n2", to: "n3", weight: "2", directed: true },
              { from: "n2", to: "n4", weight: "4", directed: true },
              { from: "n3", to: "n4", weight: "1", directed: true },
            ],
          },
        },
        {
          title: "Pop (2, 1) and improve dist[2] from 5 down to 3",
          tag: "TRACE",
          explanation: [
            "Pop `(2, 1)`. Via `1 -> 2` (weight `1`), `2 + 1 = 3 < 5`, so `dist[2]` drops to `3` and `(3, 2)` is pushed alongside the older `(5, 2)` already in the heap.",
            "Edge `1 -> 3` (weight `6`) sets `dist[3] = 8` and pushes `(8, 3)`.",
          ],
          code: [
            "(d, u) ← pq.pop_min()    // (2, 1)",
            "if 2 + 1 < dist[2]: dist[2] ← 3, pq.push((3, 2))",
            "if 2 + 6 < dist[3]: dist[3] ← 8, pq.push((8, 3))",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "popped", value: "(2, 1)", changed: true },
            { name: "dist", value: "[0, 2, 3, 8, INF]", changed: true },
            { name: "pq", value: "[(3, 2), (5, 2), (8, 3)]", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Edge 1->2 improves dist[2] to 3; stale (5, 2) remains in heap",
            nodes: [
              { id: "n0", label: "0", x: 14, y: 50, badge: "d=0", state: "visited" },
              { id: "n1", label: "1", x: 40, y: 18, badge: "d=2", state: "visited" },
              { id: "n2", label: "2", x: 40, y: 82, badge: "d=3", state: "active" },
              { id: "n3", label: "3", x: 70, y: 24, badge: "d=8", state: "queued" },
              { id: "n4", label: "4", x: 86, y: 68, badge: "d=INF" },
            ],
            edges: [
              { from: "n0", to: "n1", weight: "2", directed: true },
              { from: "n0", to: "n2", weight: "5", directed: true, state: "dim" },
              { from: "n1", to: "n2", weight: "1", directed: true, state: "active" },
              { from: "n1", to: "n3", weight: "6", directed: true, state: "active" },
              { from: "n2", to: "n3", weight: "2", directed: true },
              { from: "n2", to: "n4", weight: "4", directed: true },
              { from: "n3", to: "n4", weight: "1", directed: true },
            ],
          },
        },
        {
          title: "Pop (3, 2) and relax outgoing edges 2 -> 3 and 2 -> 4",
          tag: "TRACE",
          explanation: [
            "Pop `(3, 2)`. Since `3 == dist[2]`, relax outgoing edges: `2 -> 3` (weight `2`) lowers `dist[3]` from `8` to `3 + 2 = 5`, and `2 -> 4` (weight `4`) sets `dist[4] = 3 + 4 = 7`.",
            "Both `(5, 3)` and `(7, 4)` enter the Min-Heap alongside the stale `(5, 2)`.",
          ],
          code: [
            "(d, u) ← pq.pop_min()    // (3, 2)",
            "if 3 + 2 < dist[3]: dist[3] ← 5, pq.push((5, 3))",
            "if 3 + 4 < dist[4]: dist[4] ← 7, pq.push((7, 4))",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "popped", value: "(3, 2)", changed: true },
            { name: "dist", value: "[0, 2, 3, 5, 7]", changed: true },
            { name: "pq", value: "[(5, 2), (5, 3), (7, 4), (8, 3)]", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Vertex 2 settles at d=3, updating 3 (d=5) and 4 (d=7)",
            nodes: [
              { id: "n0", label: "0", x: 14, y: 50, badge: "d=0", state: "visited" },
              { id: "n1", label: "1", x: 40, y: 18, badge: "d=2", state: "visited" },
              { id: "n2", label: "2", x: 40, y: 82, badge: "d=3", state: "visited" },
              { id: "n3", label: "3", x: 70, y: 24, badge: "d=5", state: "active" },
              { id: "n4", label: "4", x: 86, y: 68, badge: "d=7", state: "queued" },
            ],
            edges: [
              { from: "n0", to: "n1", weight: "2", directed: true },
              { from: "n0", to: "n2", weight: "5", directed: true, state: "dim" },
              { from: "n1", to: "n2", weight: "1", directed: true },
              { from: "n1", to: "n3", weight: "6", directed: true, state: "dim" },
              { from: "n2", to: "n3", weight: "2", directed: true, state: "active" },
              { from: "n2", to: "n4", weight: "4", directed: true, state: "active" },
              { from: "n3", to: "n4", weight: "1", directed: true },
            ],
          },
        },
        {
          title: "Pop stale (5, 2) and skip since 5 > dist[2]",
          tag: "PITFALL",
          explanation: [
            "Next, `(5, 2)` pops from the Min-Heap, left over from the initial `0 -> 2` push.",
            "Because `d = 5 > dist[2] = 3`, the stale-entry check `if d > dist[u]: continue` discards `(5, 2)` immediately without re-scanning `2`'s neighbors.",
          ],
          code: [
            "(d, u) ← pq.pop_min()    // (5, 2)",
            "if d > dist[u]:          // 5 > 3 -> stale!",
            "    continue             // skip re-scanning node 2",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "popped", value: "(5, 2) -> SKIP (5 > 3)", changed: true },
            { name: "dist", value: "[0, 2, 3, 5, 7]" },
            { name: "pq", value: "[(5, 3), (7, 4), (8, 3)]", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Stale heap tuple (5, 2) is discarded in O(1) because dist[2] is already 3",
            nodes: [
              { id: "n0", label: "0", x: 14, y: 50, badge: "d=0", state: "visited" },
              { id: "n1", label: "1", x: 40, y: 18, badge: "d=2", state: "visited" },
              { id: "n2", label: "2", x: 40, y: 82, badge: "d=3 skip", state: "queued" },
              { id: "n3", label: "3", x: 70, y: 24, badge: "d=5", state: "visited" },
              { id: "n4", label: "4", x: 86, y: 68, badge: "d=7", state: "visited" },
            ],
            edges: [
              { from: "n0", to: "n1", weight: "2", directed: true },
              { from: "n0", to: "n2", weight: "5", directed: true, state: "dim" },
              { from: "n1", to: "n2", weight: "1", directed: true },
              { from: "n1", to: "n3", weight: "6", directed: true, state: "dim" },
              { from: "n2", to: "n3", weight: "2", directed: true, state: "dim" },
              { from: "n2", to: "n4", weight: "4", directed: true, state: "dim" },
              { from: "n3", to: "n4", weight: "1", directed: true },
            ],
          },
        },
        {
          title: "Pop (5, 3), relax 3 -> 4 to 6, and discard remaining stale entries",
          tag: "CHECK",
          explanation: [
            "Pop `(5, 3)`: edge `3 -> 4` (weight `1`) improves `dist[4]` from `7` to `5 + 1 = 6` and pushes `(6, 4)`.",
            "`(6, 4)` settles vertex `4`, then stale `(7, 4)` and `(8, 3)` are skipped. Final shortest distances: `[0, 2, 3, 5, 6]`.",
          ],
          code: [
            "// Pop (5, 3): 5 + 1 < 7 -> dist[4] ← 6",
            "// Pop (6, 4): settled",
            "// Skip stale (7, 4) and (8, 3)",
            "return [0, 2, 3, 5, 6]",
          ],
          activeLines: [1, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "dist", value: "[0, 2, 3, 5, 6]", changed: true },
            { name: "pq", value: "[] (empty)", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Relaxing 3 -> 4 settles dist[4] = 6; final shortest paths from 0 are [0, 2, 3, 5, 6]",
            nodes: [
              { id: "n0", label: "0", x: 14, y: 50, badge: "d=0", state: "visited" },
              { id: "n1", label: "1", x: 40, y: 18, badge: "d=2", state: "visited" },
              { id: "n2", label: "2", x: 40, y: 82, badge: "d=3", state: "visited" },
              { id: "n3", label: "3", x: 70, y: 24, badge: "d=5", state: "visited" },
              { id: "n4", label: "4", x: 86, y: 68, badge: "d=6!", state: "active" },
            ],
            edges: [
              { from: "n0", to: "n1", weight: "2", directed: true, state: "default" },
              { from: "n0", to: "n2", weight: "5", directed: true, state: "dim" },
              { from: "n1", to: "n2", weight: "1", directed: true, state: "default" },
              { from: "n1", to: "n3", weight: "6", directed: true, state: "dim" },
              { from: "n2", to: "n3", weight: "2", directed: true, state: "default" },
              { from: "n2", to: "n4", weight: "4", directed: true, state: "dim" },
              { from: "n3", to: "n4", weight: "1", directed: true, state: "active" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Skipping the stale-entry check in Dijkstra",
        detail:
          "Without `if d > dist[u]: continue`, popping outdated tuples re-scans `adj[u]` redundantly and can blow up runtime on graphs with frequent distance improvements.",
        code: "if d > dist[u]:\n    continue",
      },
      {
        title: "Using a push-time visited flag in 0-1 BFS",
        detail:
          "A vertex `v` may be reached first via a `1`-edge (pushed to the back) and later via a `0`-edge with smaller total cost (pushed to the front). Never block `v` with `visited[v]` at push time; always compare `dist[u] + w < dist[v]`.",
      },
      {
        title: "Forgetting prev_dist snapshot in hop-limited Bellman-Ford",
        detail:
          "When computing shortest paths with at most `k` edges (like Cheapest Flights Within K Stops), relaxing directly into `dist` lets paths chain multiple edges inside a single round. Copy `prev = dist.copy()` before each round and read `prev[u] + w`.",
        code: "prev ← dist.copy()\nfor (u, v, w) in edges:\n    if prev[u] != INF and prev[u] + w < dist[v]:\n        dist[v] ← prev[u] + w",
      },
    ],
    predictChecks: [
      {
        prompt: "On edges 0->1 (w=5), 0->2 (w=1), 2->1 (w=2), 1->3 (w=1), Dijkstra pops (5, 1) after (3, 1) already relaxed 1. Without the stale-entry check, what happens when (5, 1) is popped?",
        code: "// Earlier: (3, 1) was popped -> dist[1] = 3, dist[3] = 4\n// Next pop from min-heap: (d, u) = (5, 1)\n// missing: if d > dist[u]: continue\nfor (v, w) in adj[u]:\n    if d + w < dist[v]:\n        dist[v] = d + w\n        heap.push((dist[v], v))",
        options: [
          { id: "a", label: "dist[3] is overwritten with 6, giving the wrong shortest path" },
          { id: "b", label: "dist[3] stays 4, but adj[1] is scanned again; repeated stale pops degrade time to O(V * E)" },
          { id: "c", label: "The min-heap enters an infinite loop pushing (6, 3)" },
          { id: "d", label: "dist[1] is reset from 3 back to 5" },
        ],
        correctId: "b",
        explanation: "Because 5 + 1 < 4 is false, dist[3] remains 4 when relaxing with d + w. Even so, scanning every edge in adj[1] for outdated heap entries degrades Dijkstra to quadratic work on dense graphs.",
      },
      {
        prompt: "We want the cheapest cost from node 0 to node 2 using at most 1 edge (0 stops), with edges 0->1 (w=1) and 1->2 (w=2). What does one round return without a prev snapshot?",
        code: "dist = [0, INF, INF]\n// 1 round (at most 1 edge), reading dist directly:\nfor (u, v, w) in [(0, 1, 1), (1, 2, 2)]:\n    if dist[u] != INF and dist[u] + w < dist[v]:\n        dist[v] = dist[u] + w\nreturn dist[2]",
        options: [
          { id: "a", label: "INF, because node 1 starts at INF before the round" },
          { id: "b", label: "1, the weight of edge 0 -> 1" },
          { id: "c", label: "2, because only edge 1 -> 2 updates dist[2]" },
          { id: "d", label: "3, because edge 1 -> 2 chains onto the updated dist[1] = 1 in the same round" },
        ],
        correctId: "d",
        explanation: "Updating dist[1] = 1 in place lets edge (1, 2, 2) read dist[1] = 1 and set dist[2] = 3 in the same round, violating the 1-edge cap. Snapshot prev = copy(dist) before each round and read prev[u].",
      },
    ],
    practiceTask: {
      title: "Dijkstra Single-Source Shortest Distances",
      tier: "Warmup",
      goal: "Given `n` vertices `0..n-1`, directed weighted edges `[u, v, w]` (`w >= 0`), and `src`, return an array `dist` of length `n` where unreachable vertices hold `-1`.",
      constraints: [
        "1 <= n <= 10^5",
        "0 <= w <= 10^4",
        "Target: O((V + E) log V) time, O(V + E) space",
      ],
      examples: [
        {
          input: "n = 4, edges = [[0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 1]], src = 0",
          output: "[0, 3, 1, 4]",
        },
        {
          input: "n = 3, edges = [[1, 2, 5]], src = 0",
          output: "[0, -1, -1]",
          explanation: "Source 0 cannot reach 1 or 2, so remaining INF slots map to -1.",
        },
      ],
      tasks: [
        "Build adjacency list `adj[u]` storing `(v, w)` pairs.",
        "Run Min-Heap Dijkstra starting with `(0, src)` and `if d > dist[u]: continue`.",
        "Replace any remaining `INF` values with `-1` before returning.",
      ],
      starterCode:
        "function shortest_distances(n, edges, src):\n    // TODO: Dijkstra with stale entry check",
      expectedOutput: "[0, 3, 1, 4]\n[0, -1, -1]",
      hint: "Initialize `dist = [INF] * n` with `dist[src] = 0`, and only push `(d + w, v)` when `d + w < dist[v]`.",
      complexity: { time: "O((V + E) log V)", space: "O(V + E)" },
      solutionCode:
        "function shortest_distances(n, edges, src):\n    adj ← [[] for _ in 0..n-1]\n    for (u, v, w) in edges:\n        adj[u].append((v, w))\n    dist ← [INF] * n\n    dist[src] ← 0\n    pq ← MinHeap([(0, src)])\n    while not pq.empty():\n        (d, u) ← pq.pop_min()\n        if d > dist[u]:\n            continue\n        for (v, w) in adj[u]:\n            if d + w < dist[v]:\n                dist[v] ← d + w\n                pq.push((dist[v], v))\n    return [d if d < INF else -1 for d in dist]",
    },
    practiceChallenges: [
      {
        title: "Minimum Signal Broadcast Delay",
        tier: "Warmup",
        goal: "Given `n` network nodes `1..n`, directed links `[u, v, time]`, and sender node `k`, return the minimum time for all `n` nodes to receive the signal, or `-1` if any node is unreachable.",
        constraints: [
          "1 <= n <= 100",
          "0 <= time <= 100",
          "Target: O((V + E) log V) time",
        ],
        examples: [
          { input: "n = 4, links = [[2, 1, 1], [2, 3, 1], [3, 4, 1]], k = 2", output: "2" },
          { input: "n = 2, links = [[1, 2, 1]], k = 2", output: "-1" },
        ],
        tasks: [
          "Run Dijkstra from `k` over 1-based nodes `1..n`.",
          "Take the maximum value in `dist[1..n]`; if any entry is `INF`, return `-1`.",
        ],
        starterCode: "function network_delay_time(n, links, k):\n    // TODO: max shortest path from k via Dijkstra",
        expectedOutput: "2\n-1",
        hint: "Because the broadcast travels along all branches simultaneously, the total completion time equals `max(dist[1..n])`.",
        complexity: { time: "O((V + E) log V)", space: "O(V + E)" },
        solutionCode:
          "function network_delay_time(n, links, k):\n    adj ← [[] for _ in 0..n]\n    for (u, v, w) in links:\n        adj[u].append((v, w))\n    dist ← [INF] * (n + 1)\n    dist[k] ← 0\n    pq ← MinHeap([(0, k)])\n    while not pq.empty():\n        (d, u) ← pq.pop_min()\n        if d > dist[u]: continue\n        for (v, w) in adj[u]:\n            if d + w < dist[v]:\n                dist[v] ← d + w\n                pq.push((dist[v], v))\n    ans ← max(dist[1..n])\n    return -1 if ans == INF else ans",
      },
      {
        title: "Minimum Toll Route on Binary Roads",
        tier: "Core",
        goal: "Given `n` junctions `0..n-1` and directed roads `[u, v, toll]` where every `toll` is strictly `0` (free lane) or `1` (paid lane), return the minimum total toll from `src` to `dst`, or `-1` if unreachable.",
        constraints: [
          "1 <= n <= 10^5",
          "toll in {0, 1}",
          "Target: O(V + E) time, O(V + E) space via Deque 0-1 BFS",
        ],
        examples: [
          { input: "n = 4, roads = [[0, 1, 1], [0, 2, 0], [2, 3, 0], [3, 1, 0], [1, 3, 1]], src = 0, dst = 1", output: "0" },
          { input: "n = 3, roads = [[1, 2, 0]], src = 0, dst = 2", output: "-1", explanation: "No directed path leaves junction 0, so destination 2 returns -1." },
        ],
        tasks: [
          "Build adjacency list `adj[u]` storing `(v, toll)`.",
          "Run Deque 0-1 BFS: push `v` to front when `toll == 0`, else push `v` to back.",
          "Return `dist[dst]` if `< INF`, else `-1`.",
        ],
        starterCode: "function min_toll_route(n, roads, src, dst):\n    // TODO: O(V + E) 0-1 BFS with Deque",
        expectedOutput: "0\n-1",
        hint: "Avoid a heap here: `dq.push_front(v)` for `w == 0` and `dq.push_back(v)` for `w == 1` preserves ascending order in `O(1)` per push.",
        complexity: { time: "O(V + E)", space: "O(V + E)" },
        solutionCode:
          "function min_toll_route(n, roads, src, dst):\n    adj ← [[] for _ in 0..n-1]\n    for (u, v, w) in roads:\n        adj[u].append((v, w))\n    dist ← [INF] * n\n    dist[src] ← 0\n    dq ← Deque([src])\n    while not dq.empty():\n        u ← dq.pop_front()\n        if u == dst:\n            return dist[u]\n        for (v, w) in adj[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] ← dist[u] + w\n                if w == 0: dq.push_front(v)\n                else:      dq.push_back(v)\n    return -1",
      },
      {
        title: "Reachable Negative Cycle Detection",
        tier: "Stretch",
        goal: "Given `n` vertices `0..n-1`, directed edges `[u, v, w]` (weights may be negative), and `src`, return `true` if a negative-weight cycle is reachable from `src`, else `false`.",
        constraints: [
          "1 <= n <= 500",
          "0 <= len(edges) <= 5000",
          "Target: O(V * E) time, O(V) space",
        ],
        examples: [
          { input: "n = 3, edges = [[0, 1, 2], [1, 2, -5], [2, 0, 1]], src = 0", output: "true" },
          { input: "n = 3, edges = [[0, 1, 4], [1, 2, -2]], src = 0", output: "false" },
        ],
        tasks: [
          "Run `n - 1` Bellman-Ford passes from `dist[src] = 0`, checking `dist[u] != INF` before relaxing.",
          "Run one more pass (`n`-th pass) over `edges`; return `true` if any edge still reduces `dist[v]`.",
        ],
        starterCode: "function has_negative_cycle(n, edges, src):\n    // TODO: Bellman-Ford V-th pass check",
        expectedOutput: "true\nfalse",
        hint: "If all `n - 1` rounds finish and the `n`-th round still relaxes an edge, a path of `n` edges beat every path of `<= n - 1` edges, forcing a cycle of negative sum.",
        complexity: { time: "O(V * E)", space: "O(V)" },
        solutionCode:
          "function has_negative_cycle(n, edges, src):\n    dist ← [INF] * n\n    dist[src] ← 0\n    for r from 1 to n - 1:\n        changed ← false\n        for (u, v, w) in edges:\n            if dist[u] != INF and dist[u] + w < dist[v]:\n                dist[v] ← dist[u] + w\n                changed ← true\n        if not changed:\n            return false\n    for (u, v, w) in edges:\n        if dist[u] != INF and dist[u] + w < dist[v]:\n            return true\n    return false",
      },
    ],
  },

  "dsa-all-pairs-tarjan": {
    lessonId: "dsa-all-pairs-tarjan",
    subtitle:
      "Precompute all-pairs shortest paths in O(V^3) with Floyd-Warshall's intermediate vertex loop and discover bridges, articulation points, and Strongly Connected Components in O(V + E) using Tarjan's tin/low timestamps and Kosaraju's two-pass DFS.",
    intro: {
      heading: "All-Pairs Shortest Paths and Structural Graph Decomposition",
      explanation: [
        "Running Bellman-Ford `V` times for an all-pairs distance table costs `O(V^2 * E)` (`O(V^4)` on dense graphs), while putting `k` inside `(i, j)` in Floyd-Warshall skips multi-hop shortcuts like `0 -> 1 -> 2 -> 3`. On directed graphs, running naive DFS from every vertex cannot isolate cyclic clusters, and in Tarjan's SCC algorithm omitting the `on_stack` guard lets a cross-edge to an already-popped component drag `low[u]` down and merge separate SCCs.",
        "**Floyd-Warshall** solves all-pairs shortest paths in `O(V^3)` time and `O(V^2)` space by iterating the intermediate hub `k = 0..V-1` as the outermost loop. Separately, a single `O(V + E)` DFS using `tin[u]` discovery times and `low[u]` earliest reachable ancestors finds undirected **bridges**, **articulation points**, and—paired with `on_stack` or **Kosaraju's two-pass DFS**—directed **Strongly Connected Components (SCCs)**.",
      ],
      analogy:
        "Floyd-Warshall opens connecting airport hubs one city k at a time and asks every origin-destination pair (i, j) whether routing through hub k beats their current best fare. Tarjan's low-link works like cave explorers tagging entry times (tin) and reporting the oldest shortcut (low) reachable without crossing back over the entrance rope.",
      realWorldUses: [
        "Precomputing all-pairs distance tables and auditing single-point-of-failure cables (bridges) and routers (articulation points)",
        "Condensing directed cyclic dependencies into an acyclic DAG of SCCs for build systems and 2-SAT",
      ],
    },
    sections: [
      {
        heading: "Floyd-Warshall: Why Hub k Must Be the Outermost Loop",
        paragraphs: [
          "Initialize an `n x n` matrix `dist` with `dist[i][i] = 0`, `dist[i][j] = min(weights)` for direct edges, and `INF` elsewhere. Put `k` from `0` to `n - 1` on the **outside** and test every `(i, j)` pair: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.",
          "Counterexample for wrong loop order (`i -> j -> k`) on path `0 -> 1 (2), 1 -> 2 (2), 2 -> 3 (2)`: when `(i=0, j=3)` tests `k = 2`, `dist[0][2]` is still `INF` because `(0, 2)` via `k = 1` has not run yet, so `dist[0][3]` stays `INF`. With `k` outside, `k = 1` settles `dist[0][2] = 4` before `k = 2` ever reads it, and checking `dist[i][i] < 0` afterward catches any negative cycle.",
        ],
        code: [
          "// Invalid: for i -> for j -> for k leaves dist[0][3] = INF on 0->1->2->3",
          "// Valid: k outermost ensures hubs 0..k-1 are already settled",
          "function floyd_warshall(n, edges):",
          "    dist ← n x n matrix filled with INF",
          "    for i from 0 to n - 1: dist[i][i] ← 0",
          "    for (u, v, w) in edges:",
          "        dist[u][v] ← min(dist[u][v], w)",
          "    for k from 0 to n - 1:               // k must be the outermost loop",
          "        for i from 0 to n - 1:",
          "            if dist[i][k] == INF: continue",
          "            for j from 0 to n - 1:",
          "                if dist[k][j] == INF: continue",
          "                cand ← dist[i][k] + dist[k][j]",
          "                if cand < dist[i][j]:",
          "                    dist[i][j] ← cand",
          "    return dist",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "All-Pairs Shortest Path algorithms compared",
          headers: ["Method", "Time Complexity", "Space", "Negative Edges", "Best Fit"],
          rows: [
            ["V x Dijkstra", "O(V * (V + E) log V)", "O(V + E)", "No", "Sparse non-negative graphs"],
            ["V x Bellman-Ford", "O(V^2 * E)", "O(V + E)", "Yes", "Rarely used for all-pairs"],
            ["Floyd-Warshall", "O(V^3)", "O(V^2)", "Yes (checks dist[i][i] < 0)", "Dense graphs or n <= 400"],
          ],
          highlightCol: 1,
        },
        visual: {
          kind: "dsa-dp-grid",
          caption: "Completed 3x3 Floyd-Warshall distance matrix after k=2: every indirect hub path relaxed",
          rowHeaders: ["0", "1", "2"],
          colHeaders: ["0", "1", "2"],
          cells: [
            { r: 0, c: 0, value: "0" },
            { r: 0, c: 1, value: "4" },
            { r: 0, c: 2, value: "6", state: "optimal" },
            { r: 1, c: 0, value: "5", state: "optimal" },
            { r: 1, c: 1, value: "0" },
            { r: 1, c: 2, value: "2", state: "source" },
            { r: 2, c: 0, value: "3", state: "source" },
            { r: 2, c: 1, value: "7", state: "optimal" },
            { r: 2, c: 2, value: "0" },
          ],
          formulaNote: "dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) for k = 0, 1, 2",
        },
        callout: {
          kind: "WATCH OUT",
          text: "Never put `k` inside `(i, j)`. If `k` is the innermost loop, `dist[i][k]` and `dist[k][j]` have not yet been relaxed through earlier hubs `0..k-1`, so multi-hop shortest paths are missed.",
        },
      },
      {
        heading: "Tarjan's tin & low: Bridges, Articulation Points & SCC on_stack Guard",
        paragraphs: [
          "In an undirected DFS, record entry time `tin[u]` and `low[u] = tin[u]`. For neighbor `v != parent`: if `v` is already visited (`tin[v] != -1`), update `low[u] = min(low[u], tin[v])` (using `tin[v]`, never `low[v]`); otherwise recurse on `v` and pull `low[u] = min(low[u], low[v])`. Edge `(u, v)` is a **bridge** when `low[v] > tin[u]`, and vertex `u` is an **articulation point** when `parent != -1 and low[v] >= tin[u]` (or when root `u` has `>= 2` DFS tree children).",
          "On directed graphs, trace `0 -> 1 -> 2 -> 0` plus cross-edge `3 -> 1` in **Tarjan SCC**: DFS from `0` finds cycle `{0, 1, 2}`, pops it (`on_st[1] = false`), and later `dfs(3)` crosses `3 -> 1`. Because `on_st[1]` is `false`, `else if on_st[v]` ignores `tin[1]` so `low[3] == tin[3]` keeps `[3]` separate. **Kosaraju's algorithm** gets the same SCCs in two `O(V + E)` passes: push finish order in Pass 1, then traverse reversed edges in Pass 2 from the top of the stack.",
        ],
        code: [
          "function find_bridges(n, adj):",
          "    tin ← [-1] * n, low ← [0] * n",
          "    timer ← 0, bridges ← []",
          "    function dfs(u, parent):",
          "        tin[u] ← low[u] ← timer; timer ← timer + 1",
          "        for v in adj[u]:",
          "            if v == parent: continue",
          "            if tin[v] != -1:",
          "                low[u] ← min(low[u], tin[v])",
          "            else:",
          "                dfs(v, u)",
          "                low[u] ← min(low[u], low[v])",
          "                if low[v] > tin[u]:",
          "                    bridges.append([u, v])",
          "                if parent != -1 and low[v] >= tin[u]:",
          "                    is_cut[u] ← true          // non-root articulation point",
          "                children ← children + 1",
          "        if parent == -1 and children >= 2: is_cut[u] ← true",
          "    for i from 0 to n - 1:",
          "        if tin[i] == -1: dfs(i, -1)",
          "    return bridges",
          "",
          "// Directed Strongly Connected Components (Tarjan SCC)",
          "function tarjan_scc(n, adj):",
          "    tin ← [-1] * n, low ← [0] * n, on_st ← [false] * n",
          "    st ← [], sccs ← [], timer ← 0",
          "    function dfs(u):",
          "        tin[u] ← low[u] ← timer; timer += 1",
          "        st.push(u); on_st[u] ← true",
          "        for v in adj[u]:",
          "            if tin[v] == -1: dfs(v); low[u] ← min(low[u], low[v])",
          "            else if on_st[v]: low[u] ← min(low[u], tin[v])  // ignore popped SCCs",
          "        if low[u] == tin[u]:",
          "            comp ← []",
          "            repeat: w ← st.pop(); on_st[w] ← false; comp.append(w)",
          "            until w == u",
          "            sccs.append(comp)",
        ],
        codeLabel: "Pseudocode",
        table: {
          caption: "Tarjan structural rules in O(V + E) DFS",
          headers: ["Structure", "Graph Type", "Condition", "Why It Works"],
          rows: [
            ["Bridge edge (u, v)", "Undirected", "low[v] > tin[u]", "Subtree v has zero back-edges to u or above u"],
            ["Articulation point u", "Undirected", "Non-root: low[v] >= tin[u]; Root: >= 2 children", "Removing u traps subtree v away from ancestors"],
            ["Strongly Connected Component", "Directed", "Tarjan: low[u] == tin[u] (with on_stack); or Kosaraju 2-pass", "Maximal mutual-reachability cluster forms one node in SCC DAG"],
          ],
          highlightCol: 2,
        },
        callout: {
          kind: "KEY IDEA",
          text: "On a back-edge `(u, v)`, always update `low[u] = min(low[u], tin[v])` using `tin[v]`, never `low[v]`. Using `low[v]` on back-edges can leak a grandchild's shortcut past an articulation point and hide valid cut vertices.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build Floyd-Warshall & Tarjan SCC Step by Step",
      subtitle: "Order the hub loop, guard INF and negative cycles, and enforce on_stack in Tarjan SCC.",
      steps: [
        {
          label: "Step 1: Initialize distance matrix and place hub k outside (i, j)",
          explanation: "Set diagonal entries to `0` and direct edges to their minimum weight, then relax `dist[i][j]` with `k` as the outermost loop.",
          code: [
            "dist ← [[INF] * n for _ in 0..n-1]",
            "for i from 0 to n - 1: dist[i][i] ← 0",
            "for (u, v, w) in edges: dist[u][v] ← min(dist[u][v], w)",
            "for k from 0 to n - 1:",
            "    for i from 0 to n - 1:",
            "        for j from 0 to n - 1:",
            "            dist[i][j] ← min(dist[i][j], dist[i][k] + dist[k][j])",
          ],
          activeLines: [4, 5, 6, 7],
          output: "k outside settles multi-hop 0 -> 1 -> 2 -> 3",
        },
        {
          label: "Step 2: Guard INF additions and detect negative cycles",
          explanation: "Skip unreachable pairs where `dist[i][k] == INF` or `dist[k][j] == INF`, then scan `dist[i][i] < 0` after all `n` hubs finish.",
          code: [
            "for k from 0 to n - 1:",
            "    for i from 0 to n - 1:",
            "        if dist[i][k] == INF: continue",
            "        for j from 0 to n - 1:",
            "            if dist[k][j] == INF: continue",
            "            dist[i][j] ← min(dist[i][j], dist[i][k] + dist[k][j])",
            "for i from 0 to n - 1:",
            "    if dist[i][i] < 0: return \"NEGATIVE_CYCLE\"",
          ],
          activeLines: [3, 5, 8],
          output: "skips INF pairs; catches dist[i][i] < 0",
        },
        {
          label: "Step 3: Tarjan SCC with on_st guard on directed cross-edges",
          explanation: "Push `u` onto `st` with `on_st[u] = true`, update `low[u]` from visited `v` only when `on_st[v]` is true, and pop an SCC whenever `low[u] == tin[u]`.",
          code: [
            "tin[u] ← low[u] ← timer; timer += 1",
            "st.push(u); on_st[u] ← true",
            "for v in adj[u]:",
            "    if tin[v] == -1: dfs(v); low[u] ← min(low[u], low[v])",
            "    else if on_st[v]: low[u] ← min(low[u], tin[v])",
            "if low[u] == tin[u]:",
            "    pop until u (setting on_st[w] ← false) into one SCC",
          ],
          activeLines: [2, 5, 6, 7],
          output: "cross-edge 3 -> 1 ignored since on_st[1] is false",
        },
      ],
    },
    walkthrough: {
      title: "Tracing Floyd-Warshall Hub Relaxation & Tarjan's Bridge Detection",
      layout: "visual-first",
      steps: [
        {
          title: "Floyd-Warshall: Initialize 3x3 distance matrix from direct edges",
          tag: "MEMORY",
          explanation: [
            "Consider 3 directed nodes `{0, 1, 2}` with edges `0->1 (4)`, `1->2 (2)`, `0->2 (9)`, and `2->0 (3)`.",
            "Diagonal cells start at `0`, direct edges fill in their weights, and missing edges start at `INF`.",
          ],
          code: [
            "dist[0][1] ← 4, dist[1][2] ← 2",
            "dist[0][2] ← 9, dist[2][0] ← 3",
            "for k from 0 to 2: relax all (i, j) via k",
          ],
          activeLines: [1, 2],
          codeLabel: "Pseudocode",
          state: [
            { name: "k", value: "init" },
            { name: "dist[0][2]", value: "9" },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Directed weighted graph before Floyd-Warshall intermediate passes (d[0][2]=9 direct, d[2][1]=INF)",
            nodes: [
              { id: "f0", label: "0", x: 18, y: 26, badge: "d[0][2]=9", state: "active" },
              { id: "f1", label: "1", x: 82, y: 26, badge: "d[1][0]=INF", state: "default" },
              { id: "f2", label: "2", x: 50, y: 80, badge: "d[2][1]=INF", state: "default" },
            ],
            edges: [
              { from: "f0", to: "f1", weight: "4", directed: true, state: "active" },
              { from: "f1", to: "f2", weight: "2", directed: true, state: "active" },
              { from: "f0", to: "f2", weight: "9", directed: true },
              { from: "f2", to: "f0", weight: "3", directed: true, state: "active" },
            ],
          },
        },
        {
          title: "Floyd-Warshall k = 0: Relax 2 -> 1 through hub 0",
          tag: "TRACE",
          explanation: [
            "Start with hub `k = 0`. Routing `2 -> 0 -> 1` computes `dist[2][0] + dist[0][1] = 3 + 4 = 7`, beating `INF`.",
            "`dist[2][1]` updates to `7`, while paths starting at `1` cannot yet use hub `0` because `dist[1][0] = INF`.",
          ],
          code: [
            "k ← 0",
            "cand ← dist[2][0] + dist[0][1]   // 3 + 4 = 7",
            "if 7 < dist[2][1]: dist[2][1] ← 7",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "k", value: "0", changed: true },
            { name: "dist[2][1]", value: "7 (was INF)", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Hub k=0 relaxes 2 -> 0 -> 1 (3 + 4 = 7), setting dist[2][1] = 7",
            nodes: [
              { id: "f0", label: "0", x: 18, y: 26, badge: "hub k=0", state: "active" },
              { id: "f1", label: "1", x: 82, y: 26, badge: "from 2: 7", state: "queued" },
              { id: "f2", label: "2", x: 50, y: 80, badge: "d[2][1]=7!", state: "visited" },
            ],
            edges: [
              { from: "f0", to: "f1", weight: "4", directed: true, state: "active" },
              { from: "f1", to: "f2", weight: "2", directed: true },
              { from: "f0", to: "f2", weight: "9", directed: true },
              { from: "f2", to: "f0", weight: "3", directed: true, state: "active" },
            ],
          },
        },
        {
          title: "Floyd-Warshall k = 1: Relax 0 -> 2 through hub 1",
          tag: "TRACE",
          explanation: [
            "Next with hub `k = 1`, routing `0 -> 1 -> 2` gives `dist[0][1] + dist[1][2] = 4 + 2 = 6`, beating direct edge `9`.",
            "`dist[0][2]` updates to `6`, while `dist[2][1] = 7` from `k = 0` remains in place.",
          ],
          code: [
            "k ← 1",
            "cand ← dist[0][1] + dist[1][2]   // 4 + 2 = 6",
            "if 6 < dist[0][2]: dist[0][2] ← 6",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "k", value: "1", changed: true },
            { name: "dist[0][2]", value: "6 (was 9)", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Hub k=1 relaxes 0 -> 1 -> 2 (4 + 2 = 6 < 9), updating dist[0][2] = 6",
            nodes: [
              { id: "f0", label: "0", x: 18, y: 26, badge: "d[0][2]=6!", state: "visited" },
              { id: "f1", label: "1", x: 82, y: 26, badge: "hub k=1", state: "active" },
              { id: "f2", label: "2", x: 50, y: 80, badge: "target 6", state: "queued" },
            ],
            edges: [
              { from: "f0", to: "f1", weight: "4", directed: true, state: "active" },
              { from: "f1", to: "f2", weight: "2", directed: true, state: "active" },
              { from: "f0", to: "f2", weight: "9", directed: true, state: "dim" },
              { from: "f2", to: "f0", weight: "3", directed: true },
            ],
          },
        },
        {
          title: "Floyd-Warshall k = 2: Relax 1 -> 0 through hub 2",
          tag: "TRACE",
          explanation: [
            "Finally with hub `k = 2`, routing `1 -> 2 -> 0` computes `dist[1][2] + dist[2][0] = 2 + 3 = 5`, replacing `INF`.",
            "Every pair `(i, j)` now holds its true all-pairs shortest path distance across `{0, 1, 2}`.",
          ],
          code: [
            "k ← 2",
            "cand ← dist[1][2] + dist[2][0]   // 2 + 3 = 5",
            "if 5 < dist[1][0]: dist[1][0] ← 5",
          ],
          activeLines: [1, 2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "k", value: "2", changed: true },
            { name: "dist[1][0]", value: "5 (was INF)", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Hub k=2 relaxes 1 -> 2 -> 0 (2 + 3 = 5), completing all-pairs distances",
            nodes: [
              { id: "f0", label: "0", x: 18, y: 26, badge: "from 1: 5", state: "queued" },
              { id: "f1", label: "1", x: 82, y: 26, badge: "d[1][0]=5!", state: "visited" },
              { id: "f2", label: "2", x: 50, y: 80, badge: "hub k=2", state: "active" },
            ],
            edges: [
              { from: "f0", to: "f1", weight: "4", directed: true },
              { from: "f1", to: "f2", weight: "2", directed: true, state: "active" },
              { from: "f0", to: "f2", weight: "9", directed: true },
              { from: "f2", to: "f0", weight: "3", directed: true, state: "active" },
            ],
          },
        },
        {
          title: "Tarjan Bridges: DFS visits 0 -> 1 -> 2 -> 3 assigning tin & low",
          tag: "TRACE",
          explanation: [
            "Now trace Tarjan's bridge finder on undirected graph `0-1, 1-2, 2-0, 2-3` starting at `0`.",
            "DFS walks `0 -> 1 -> 2 -> 3`, setting `tin[u] = low[u] = 0, 1, 2, 3` respectively.",
          ],
          code: [
            "dfs(0) -> tin=0, low=0",
            "  dfs(1) -> tin=1, low=1",
            "    dfs(2) -> tin=2, low=2",
            "      dfs(3) -> tin=3, low=3",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "tin", value: "[0, 1, 2, 3]", changed: true },
            { name: "low", value: "[0, 1, 2, 3]", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Initial DFS tree timestamps along path 0 -> 1 -> 2 -> 3",
            nodes: [
              { id: "n0", label: "0", x: 18, y: 24, badge: "t=0,l=0", state: "visited" },
              { id: "n1", label: "1", x: 18, y: 76, badge: "t=1,l=1", state: "visited" },
              { id: "n2", label: "2", x: 54, y: 50, badge: "t=2,l=2", state: "visited" },
              { id: "n3", label: "3", x: 86, y: 50, badge: "t=3,l=3", state: "active" },
            ],
            edges: [
              { from: "n0", to: "n1", state: "active" },
              { from: "n1", to: "n2", state: "active" },
              { from: "n2", to: "n0" },
              { from: "n2", to: "n3", state: "active" },
            ],
          },
        },
        {
          title: "Backtrack 3 -> 2: detect bridge (2, 3) since low[3] > tin[2]",
          tag: "TRACE",
          explanation: [
            "Leaf `3` has no neighbors other than parent `2`, so `low[3]` stays `3`.",
            "Returning to `2`, `low[3] (3) > tin[2] (2)` proves `3` cannot reach `2` or `0..1` by any alternate path, flagging `(2, 3)` as a **bridge**.",
          ],
          code: [
            "low[2] ← min(low[2], low[3])   // min(2, 3) = 2",
            "if low[3] > tin[2]:            // 3 > 2 is true!",
            "    bridges.append([2, 3])",
          ],
          activeLines: [2, 3],
          codeLabel: "Pseudocode",
          state: [
            { name: "low[3] > tin[2]", value: "3 > 2 (BRIDGE!)", changed: true },
            { name: "bridges", value: "[[2, 3]]", changed: true },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Edge (2, 3) satisfies low[3] > tin[2], confirming it is a bridge",
            nodes: [
              { id: "n0", label: "0", x: 18, y: 24, badge: "t=0,l=0", state: "visited" },
              { id: "n1", label: "1", x: 18, y: 76, badge: "t=1,l=1", state: "visited" },
              { id: "n2", label: "2", x: 54, y: 50, badge: "t=2,l=2", state: "active" },
              { id: "n3", label: "3", x: 86, y: 50, badge: "t=3,l=3", state: "visited" },
            ],
            edges: [
              { from: "n0", to: "n1" },
              { from: "n1", to: "n2" },
              { from: "n2", to: "n0" },
              { from: "n2", to: "n3", state: "active" },
            ],
          },
        },
        {
          title: "Back-edge 2 -> 0 drops low[2] and low[1] to 0; 2 is also the articulation point",
          tag: "CHECK",
          explanation: [
            "Node `2` inspects visited neighbor `0` (`0 != parent 1`) and updates `low[2] = min(2, tin[0]) = 0`.",
            "Backtracking pulls `low[1] = min(1, low[2]) = 0`, so cycle edges `(0,1), (1,2), (2,0)` are safe (forming one biconnected cycle / SCC `{0, 1, 2}` if directed), while `low[3] (3) >= tin[2] (2)` also makes vertex `2` an **articulation point** separating `3`.",
          ],
          code: [
            "// at 2, back-edge 2->0: low[2] ← min(2, tin[0]) = 0",
            "// at 1: low[1] ← min(1, low[2]) = 0; 0 > 1 false",
            "// articulation at 2: low[3] >= tin[2] -> cut vertex 2!",
            "return [[2, 3]]",
          ],
          activeLines: [1, 2, 3, 4],
          codeLabel: "Pseudocode",
          state: [
            { name: "low", value: "[0, 0, 0, 3]", changed: true },
            { name: "bridges", value: "[[2, 3]]" },
          ],
          visual: {
            kind: "dsa-graph",
            caption: "Back-edge 2-0 drops low[1..2] to 0; only bridge [2, 3] has low[v] > tin[u]",
            nodes: [
              { id: "n0", label: "0", x: 18, y: 24, badge: "t=0,l=0", state: "visited" },
              { id: "n1", label: "1", x: 18, y: 76, badge: "t=1,l=0", state: "visited" },
              { id: "n2", label: "2", x: 54, y: 50, badge: "t=2,l=0", state: "visited" },
              { id: "n3", label: "3", x: 86, y: 50, badge: "t=3,l=3", state: "active" },
            ],
            edges: [
              { from: "n0", to: "n1", state: "dim" },
              { from: "n1", to: "n2", state: "dim" },
              { from: "n2", to: "n0", state: "dim" },
              { from: "n2", to: "n3", state: "active" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Putting k inside (i, j) in Floyd-Warshall",
        detail:
          "If `k` is not the outermost loop, `dist[i][k]` and `dist[k][j]` may still hold outdated direct weights instead of shortest paths through hubs `0..k-1`, causing multi-hop shortest paths to fail.",
        code: "// RIGHT: for k -> for i -> for j\n// WRONG: for i -> for j -> for k",
      },
      {
        title: "Using low[v] instead of tin[v] on back-edges in Tarjan",
        detail:
          "On a back-edge to a visited ancestor `v`, updating `low[u] = min(low[u], low[v])` instead of `min(low[u], tin[v])` breaks articulation point detection because `u` can only climb as high as `v` directly, not through `v`'s other branches.",
      },
      {
        title: "Forgetting on_stack[w] in directed Tarjan SCC",
        detail:
          "In directed graphs, a cross-edge `(u, w)` can point to a vertex `w` whose SCC was already popped earlier. Always check `if on_stack[w]` before relaxing `low[u] = min(low[u], tin[w])`.",
      },
    ],
    practiceTask: {
      title: "Find All Bridges in an Undirected Graph",
      tier: "Warmup",
      goal: "Given `n` vertices `0..n-1` and undirected `connections`, return all bridge edges whose removal disconnects the graph.",
      constraints: [
        "2 <= n <= 10^5",
        "n - 1 <= len(connections) <= 10^5, no duplicate edges",
        "Target: O(V + E) time, O(V + E) space",
      ],
      examples: [
        {
          input: "n = 4, connections = [[0, 1], [1, 2], [2, 0], [1, 3]]",
          output: "[[1, 3]]",
        },
        {
          input: "n = 3, connections = [[0, 1], [1, 2], [2, 0]]",
          output: "[]",
          explanation: "Every edge belongs to a cycle, so low[v] <= tin[u] everywhere and there are no bridges.",
        },
      ],
      tasks: [
        "Build undirected adjacency list `adj`.",
        "Track `tin[u]`, `low[u]`, and `timer` across DFS skipping `v == parent`.",
        "Collect `[u, v]` whenever `low[v] > tin[u]`.",
      ],
      starterCode:
        "function find_bridges(n, connections):\n    // TODO: Tarjan's tin/low bridge detection",
      expectedOutput: "[[1, 3]]\n[]",
      hint: "Initialize `tin = [-1] * n` so unvisited checks are `tin[v] == -1`, and guard against `v == parent`.",
      complexity: { time: "O(V + E)", space: "O(V + E)" },
      solutionCode:
        "function find_bridges(n, connections):\n    adj ← [[] for _ in 0..n-1]\n    for (u, v) in connections:\n        adj[u].append(v)\n        adj[v].append(u)\n    tin ← [-1] * n\n    low ← [0] * n\n    timer ← 0\n    bridges ← []\n    function dfs(u, parent):\n        tin[u] ← low[u] ← timer\n        timer ← timer + 1\n        for v in adj[u]:\n            if v == parent:\n                continue\n            if tin[v] != -1:\n                low[u] ← min(low[u], tin[v])\n            else:\n                dfs(v, u)\n                low[u] ← min(low[u], low[v])\n                if low[v] > tin[u]:\n                    bridges.append([u, v])\n    for i from 0 to n - 1:\n        if tin[i] == -1:\n            dfs(i, -1)\n    return bridges",
    },
    practiceChallenges: [
      {
        title: "All-Pairs Matrix & Negative Cycle Check",
        tier: "Warmup",
        goal: "Given `n` vertices `0..n-1` and directed weighted edges `[u, v, w]`, run Floyd-Warshall and return `\"NEGATIVE_CYCLE\"` if any `dist[i][i] < 0`, else return the shortest distance matrix.",
        constraints: [
          "1 <= n <= 200",
          "-10^4 <= w <= 10^4",
          "Target: O(V^3) time, O(V^2) space",
        ],
        examples: [
          { input: "n = 3, edges = [[0, 1, 4], [1, 2, 2], [0, 2, 9]]", output: "[[0, 4, 6], [INF, 0, 2], [INF, INF, 0]]" },
          { input: "n = 2, edges = [[0, 1, 1], [1, 0, -3]]", output: "NEGATIVE_CYCLE" },
        ],
        tasks: [
          "Keep `k` as the outer loop from `0` to `n - 1`.",
          "Skip pairs where `dist[i][k] == INF` or `dist[k][j] == INF` to prevent `INF` overflow.",
          "Check `dist[i][i] < 0` for all `i` after the triple loop.",
        ],
        starterCode: "function floyd_warshall_check(n, edges):\n    // TODO: O(V^3) all-pairs relaxation + negative cycle check",
        expectedOutput: "[[0, 4, 6], [INF, 0, 2], [INF, INF, 0]]\nNEGATIVE_CYCLE",
        hint: "If multiple edges exist between `(u, v)`, initialize `dist[u][v] = min(dist[u][v], w)` before running `k`.",
        complexity: { time: "O(V^3)", space: "O(V^2)" },
        solutionCode:
          "function floyd_warshall_check(n, edges):\n    dist ← [[INF] * n for _ in 0..n-1]\n    for i from 0 to n - 1: dist[i][i] ← 0\n    for (u, v, w) in edges:\n        dist[u][v] ← min(dist[u][v], w)\n    for k from 0 to n - 1:\n        for i from 0 to n - 1:\n            if dist[i][k] == INF: continue\n            for j from 0 to n - 1:\n                if dist[k][j] == INF: continue\n                if dist[i][k] + dist[k][j] < dist[i][j]:\n                    dist[i][j] ← dist[i][k] + dist[k][j]\n    for i from 0 to n - 1:\n        if dist[i][i] < 0:\n            return \"NEGATIVE_CYCLE\"\n    return dist",
      },
      {
        title: "Articulation Points (Cut Vertices) in a Network",
        tier: "Core",
        goal: "Given `n` servers `0..n-1` and undirected links `edges`, return all sorted server IDs whose removal increases the number of connected components.",
        constraints: [
          "1 <= n <= 10^5",
          "0 <= len(edges) <= 10^5",
          "Target: O(V + E) time, O(V + E) space",
        ],
        examples: [
          { input: "n = 5, edges = [[0, 1], [1, 2], [2, 0], [1, 3], [3, 4]]", output: "[1, 3]" },
          { input: "n = 4, edges = [[0, 1], [1, 2], [2, 3], [3, 0]]", output: "[]", explanation: "Removing any single node on a 4-cycle leaves the remaining 3 nodes connected." },
        ],
        tasks: [
          "Count `children` in the DFS tree for each vertex `u`.",
          "Mark `is_cut[u] = true` when `parent != -1 and low[v] >= tin[u]`, OR when `parent == -1 and children >= 2`.",
          "Collect sorted indices where `is_cut[i]` is true.",
        ],
        starterCode: "function find_articulation_points(n, edges):\n    // TODO: Tarjan cut-vertex check",
        expectedOutput: "[1, 3]\n[]",
        hint: "A single vertex can satisfy `low[v] >= tin[u]` across multiple children, so record `is_cut[u] = true` in a boolean array to avoid duplicates.",
        complexity: { time: "O(V + E)", space: "O(V + E)" },
        solutionCode:
          "function find_articulation_points(n, edges):\n    adj ← [[] for _ in 0..n-1]\n    for (u, v) in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    tin ← [-1] * n\n    low ← [0] * n\n    is_cut ← [false] * n\n    timer ← 0\n    function dfs(u, parent):\n        tin[u] ← low[u] ← timer\n        timer ← timer + 1\n        children ← 0\n        for v in adj[u]:\n            if v == parent:\n                continue\n            if tin[v] != -1:\n                low[u] ← min(low[u], tin[v])\n            else:\n                children ← children + 1\n                dfs(v, u)\n                low[u] ← min(low[u], low[v])\n                if parent != -1 and low[v] >= tin[u]:\n                    is_cut[u] ← true\n        if parent == -1 and children >= 2:\n            is_cut[u] ← true\n    for i from 0 to n - 1:\n        if tin[i] == -1:\n            dfs(i, -1)\n    return [i for i in 0..n-1 if is_cut[i]]",
      },
      {
        title: "Count Strongly Connected Components (Kosaraju / Tarjan)",
        tier: "Stretch",
        goal: "Given `n` vertices `0..n-1` and directed edges `[u, v]`, return the total number of Strongly Connected Components (SCCs).",
        constraints: [
          "1 <= n <= 10^5",
          "0 <= len(edges) <= 2 * 10^5",
          "Target: O(V + E) time, O(V + E) space",
        ],
        examples: [
          { input: "n = 5, edges = [[0, 2], [2, 1], [1, 0], [0, 3], [3, 4]]", output: "3" },
          { input: "n = 4, edges = [[0, 1], [1, 2], [2, 3]]", output: "4", explanation: "A directed path has zero cycles, so every vertex is its own singleton SCC." },
        ],
        tasks: [
          "Pass 1 (Kosaraju): run DFS on `adj` and push each vertex to `order` stack upon finishing.",
          "Build reversed graph `rev_adj` where every `(u, v)` becomes `(v, u)`.",
          "Pass 2: pop vertices from `order`; each unvisited vertex starts a new SCC DFS on `rev_adj`.",
        ],
        starterCode: "function count_sccs(n, edges):\n    // TODO: Kosaraju's two-pass DFS or Tarjan's stack SCC",
        expectedOutput: "3\n4",
        hint: "In Kosaraju, the last vertex finished in Pass 1 belongs to a source SCC of the condensation DAG, so traversing `rev_adj` from it cannot leak out into other SCCs.",
        complexity: { time: "O(V + E)", space: "O(V + E)" },
        solutionCode:
          "function count_sccs(n, edges):\n    adj ← [[] for _ in 0..n-1]\n    rev ← [[] for _ in 0..n-1]\n    for (u, v) in edges:\n        adj[u].append(v)\n        rev[v].append(u)\n    vis ← [false] * n\n    order ← []\n    function dfs1(u):\n        vis[u] ← true\n        for v in adj[u]:\n            if not vis[v]: dfs1(v)\n        order.append(u)\n    for i from 0 to n - 1:\n        if not vis[i]: dfs1(i)\n    vis2 ← [false] * n\n    sccs ← 0\n    function dfs2(u):\n        vis2[u] ← true\n        for v in rev[u]:\n            if not vis2[v]: dfs2(v)\n    while len(order) > 0:\n        u ← order.pop_back()\n        if not vis2[u]:\n            sccs ← sccs + 1\n            dfs2(u)\n    return sccs",
      },
    ],
  },
};

export const dsaM19PracticeSet: ModulePracticeSet = {
  moduleId: "dsa-m19",
  title: "Module 19 Practice Set: Pro Graphs (DSU, MST & Shortest Paths)",
  description:
    "Four mixed problems combining dynamic connectivity, minimum-cost spanning trees, constrained shortest paths, and all-pairs threshold routing.",
  problems: [
    {
      id: "dsa-m19-p1",
      title: "Redundant Fiber Link",
      patternHint: "Use Disjoint Set Union (Union-Find) with path compression and return the edge whose endpoints already share a root.",
      lessonRefId: "dsa-dsu-union-find",
      goal: "A datacenter network starts as a tree connecting `n` racks labeled `1..n`, and one extra cable was added so `edges` now contains `n` undirected pairs `[u, v]`. Return the extra cable `[u, v]` that creates a loop (if multiple choices exist in the loop, return the one appearing last in `edges`).",
      constraints: [
        "3 <= n <= 10^4",
        "len(edges) == n",
        "Target: O(n * alpha(n)) time, O(n) space",
      ],
      examples: [
        { input: "edges = [[1, 2], [1, 3], [2, 3]]", output: "[2, 3]" },
        { input: "edges = [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]", output: "[1, 4]" },
      ],
      tasks: [
        "Initialize `UnionFind(n + 1)` with path compression and union by size.",
        "Process `edges` from index `0` to `n - 1`; return the edge where `union(u, v)` returns `false`.",
      ],
      starterCode: "function redundant_fiber_link(edges):\n    // TODO: detect the cycle-closing cable",
      expectedOutput: "[2, 3]\n[1, 4]",
      hint: "Because `n - 1` edges form a tree, every earlier edge succeeds and the exact edge that completes the cycle is the first one rejected by `union`.",
      complexity: { time: "O(n * alpha(n))", space: "O(n)" },
      solutionCode:
        "function redundant_fiber_link(edges):\n    n ← len(edges)\n    parent ← [0, 1, ..., n]\n    function find(x):\n        while parent[x] != x:\n            parent[x] ← parent[parent[x]]\n            x ← parent[x]\n        return x\n    for (u, v) in edges:\n        ru ← find(u); rv ← find(v)\n        if ru == rv:\n            return [u, v]\n        parent[rv] ← ru\n    return []",
    },
    {
      id: "dsa-m19-p2",
      title: "Minimum Grid Wiring Cost",
      patternHint: "Compute a Minimum Spanning Tree over the implicit complete graph using Prim's algorithm in O(n^2) time and O(n) space.",
      lessonRefId: "dsa-mst-kruskal-prim",
      goal: "Given `n` server racks placed on a 2D floor at `racks[i] = [x, y]`, connecting rack `i` and rack `j` uses `|x_i - x_j| + |y_i - y_j|` meters of cable. Return the minimum total cable length required to link all racks into one connected network.",
      constraints: [
        "1 <= n <= 1000",
        "-10^6 <= x, y <= 10^6",
        "Target: O(n^2) time, O(n) space",
      ],
      examples: [
        { input: "racks = [[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]", output: "20" },
        { input: "racks = [[3, 12], [-2, 5], [-4, 1]]", output: "18" },
      ],
      tasks: [
        "Track `min_dist[i]` (best cost to reach rack `i` from the wired set) and `wired[i]` boolean flags.",
        "Repeat `n` times: pick unwired rack `u` with smallest `min_dist[u]`, add its cost, and relax `min_dist[v]` for all unwired `v`.",
      ],
      starterCode: "function min_grid_wiring(racks):\n    // TODO: return minimum total Manhattan cable length",
      expectedOutput: "20\n18",
      hint: "On `n = 1000` racks, keeping a 1D `min_dist` array avoids sorting `500,000` pairwise edges.",
      complexity: { time: "O(n^2)", space: "O(n)" },
      solutionCode:
        "function min_grid_wiring(racks):\n    n ← len(racks)\n    min_dist ← [INF] * n\n    wired ← [false] * n\n    min_dist[0] ← 0\n    total ← 0\n    for step from 0 to n - 1:\n        u ← -1\n        for i from 0 to n - 1:\n            if not wired[i] and (u == -1 or min_dist[i] < min_dist[u]):\n                u ← i\n        wired[u] ← true\n        total ← total + min_dist[u]\n        for v from 0 to n - 1:\n            if not wired[v]:\n                cost ← abs(racks[u][0] - racks[v][0]) + abs(racks[u][1] - racks[v][1])\n                if cost < min_dist[v]:\n                    min_dist[v] ← cost\n    return total",
    },
    {
      id: "dsa-m19-p3",
      title: "Cheapest Transit with Limited Transfers",
      patternHint: "Run k + 1 Bellman-Ford edge-relaxation rounds with a snapshot of the previous round's distances so each pass adds at most one flight leg.",
      lessonRefId: "dsa-shortest-paths",
      goal: "Given `n` airports `0..n-1`, directed flights `[from, to, price]`, origin `src`, destination `dst`, and maximum allowed layover stops `k`, return the cheapest total fare from `src` to `dst` using at most `k` stops (`k + 1` flights), or `-1` if no valid route exists.",
      constraints: [
        "1 <= n <= 100",
        "0 <= k < n",
        "1 <= price <= 10^4",
        "Target: O(k * E) time, O(V) space",
      ],
      examples: [
        { input: "n = 4, flights = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], src = 0, dst = 3, k = 1", output: "700" },
        { input: "n = 3, flights = [[0, 1, 100], [1, 2, 100], [0, 2, 500]], src = 0, dst = 2, k = 0", output: "500" },
      ],
      tasks: [
        "Initialize `dist = [INF] * n` with `dist[src] = 0`.",
        "Run `k + 1` passes; at the start of each pass, copy `prev = dist.copy()` and relax every `[u, v, price]` using `prev[u] + price`.",
        "Return `dist[dst]` if `< INF`, else `-1`.",
      ],
      starterCode: "function cheapest_transit(n, flights, src, dst, k):\n    // TODO: hop-bounded shortest path",
      expectedOutput: "700\n500",
      hint: "Without copying `prev = dist.copy()` per round, a single round could chain `0 -> 1 -> 2 -> 3` and violate the `k`-stop cap.",
      complexity: { time: "O(k * E)", space: "O(V)" },
      solutionCode:
        "function cheapest_transit(n, flights, src, dst, k):\n    dist ← [INF] * n\n    dist[src] ← 0\n    for step from 0 to k:\n        prev ← dist.copy()\n        for (u, v, price) in flights:\n            if prev[u] != INF and prev[u] + price < dist[v]:\n                dist[v] ← prev[u] + price\n    return -1 if dist[dst] == INF else dist[dst]",
    },
    {
      id: "dsa-m19-p4",
      title: "Smallest Neighborhood Within Distance Budget",
      patternHint: "Compute all-pairs shortest paths with Floyd-Warshall in O(n^3) and count reachable neighbors <= threshold for every city.",
      lessonRefId: "dsa-all-pairs-tarjan",
      goal: "Given `n` cities `0..n-1`, bidirectional roads `[u, v, weight]`, and a budget `threshold`, find the city `i` with the smallest number of other cities reachable via paths of total weight at most `threshold`. If multiple cities tie for fewest reachable neighbors, return the city with the largest index.",
      constraints: [
        "2 <= n <= 100",
        "1 <= weight, threshold <= 10^4",
        "Target: O(n^3) time, O(n^2) space",
      ],
      examples: [
        { input: "n = 4, roads = [[0, 1, 3], [1, 2, 1], [1, 3, 4], [2, 3, 1]], threshold = 4", output: "3" },
        { input: "n = 3, roads = [[0, 1, 5]], threshold = 2", output: "2", explanation: "All three cities reach 0 neighbors within threshold 2; tie-breaking picks largest index 2." },
      ],
      tasks: [
        "Initialize `dist` symmetrically (`dist[u][v] = dist[v][u] = min(...)`, `dist[i][i] = 0`).",
        "Run Floyd-Warshall with `k` as the outermost loop.",
        "For each city `i`, count `j != i` with `dist[i][j] <= threshold` and update `best_city` using `<=` so ties pick the larger index.",
      ],
      starterCode: "function smallest_neighborhood(n, roads, threshold):\n    // TODO: all-pairs shortest paths + tie-break on largest index",
      expectedOutput: "3\n2",
      hint: "In the first example, city `0` and city `3` both reach `2` neighbors within cost `4`, and `<=` tie-breaking selects index `3`.",
      complexity: { time: "O(n^3)", space: "O(n^2)" },
      solutionCode:
        "function smallest_neighborhood(n, roads, threshold):\n    dist ← [[INF] * n for _ in 0..n-1]\n    for i from 0 to n - 1: dist[i][i] ← 0\n    for (u, v, w) in roads:\n        dist[u][v] ← min(dist[u][v], w)\n        dist[v][u] ← min(dist[v][u], w)\n    for k from 0 to n - 1:\n        for i from 0 to n - 1:\n            if dist[i][k] == INF: continue\n            for j from 0 to n - 1:\n                if dist[k][j] == INF: continue\n                if dist[i][k] + dist[k][j] < dist[i][j]:\n                    dist[i][j] ← dist[i][k] + dist[k][j]\n    best_city ← -1\n    best_count ← n + 1\n    for i from 0 to n - 1:\n        cnt ← 0\n        for j from 0 to n - 1:\n            if i != j and dist[i][j] <= threshold:\n                cnt ← cnt + 1\n        if cnt <= best_count:\n            best_count ← cnt\n            best_city ← i\n    return best_city",
    },
  ],
};
