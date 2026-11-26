"use client";

import { useId, useState } from "react";
import type { InteractiveWidgetVisual } from "@/lib/lesson-types";
import { LineCodePanel, OutputStrip, StateChips, handleTabKeyDown, renderInlineRich } from "./rich-text";

type ParamLabVisual = Extract<InteractiveWidgetVisual, { kind: "param-lab" }>;
type ObjectModelLabVisual = Extract<InteractiveWidgetVisual, { kind: "object-model-lab" }>;

function EarlyWinPrintLab({ caption }: { caption?: string }) {
  const [name, setName] = useState("Python");
  const [reps, setReps] = useState(2);
  const [showMath, setShowMath] = useState(true);
  const [sepMode, setSepMode] = useState<"space" | "dash">("space");

  const safeName = name.trim() || "world";
  const escaped = safeName.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const lines = [
    `name = "${escaped}"`,
    `print("Hello,", name, "!"${sepMode === "dash" ? ', sep=" - "' : ""})`,
  ];
  if (showMath) {
    lines.push(`print("Next milestone:", ${reps} * 5)`);
  }
  if (reps > 1) {
    lines.push(`print("Ready! " * ${reps})`);
  }

  const sep = sepMode === "dash" ? " - " : " ";
  const outLines = [`Hello,${sep}${safeName}${sep}!`];
  if (showMath) {
    outLines.push(`Next milestone: ${reps * 5}`);
  }
  if (reps > 1) {
    outLines.push("Ready! ".repeat(reps));
  }

  return (
    <div className="interactive-lab param-lab">
      <div className="lab-header">
        <span className="lab-title">Run your first Python lines right here</span>
        <code className="lab-freq-tag">in-browser preview</code>
      </div>

      <div className="param-controls-grid">
        <label className="param-field">
          <span>Your greeting target</span>
          <input
            type="text"
            maxLength={18}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Python"
          />
        </label>

        <label className="param-field">
          <span>Repeat count: <strong className="tabular">{reps}</strong></span>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="lab-pill-row" role="group" aria-label="Script toggles">
        <button
          type="button"
          className={`lab-pill-btn ${showMath ? "is-active" : ""}`}
          aria-pressed={showMath}
          onClick={() => setShowMath((v) => !v)}
        >
          {showMath ? "Include math line" : "+ Add math line"}
        </button>
        <button
          type="button"
          className={`lab-pill-btn ${sepMode === "dash" ? "is-active" : ""}`}
          aria-pressed={sepMode === "dash"}
          onClick={() => setSepMode((m) => (m === "space" ? "dash" : "space"))}
        >
          {sepMode === "dash" ? 'sep=" - "' : 'sep=" " (default)'}
        </button>
      </div>

      <div className="param-split-stage">
        <LineCodePanel lines={lines} activeLines={[2]} label="hello.py (live)" />
        <OutputStrip title="Simulated terminal output" output={outLines.join("\n")} />
      </div>

      <p className="lab-note">
        Notice each print(...) call prints left-to-right and moves to a new line automatically. Once you install Python below, this exact file runs identically in your terminal.
      </p>
      {caption && <p className="visual-caption">{renderInlineRich(caption)}</p>}
    </div>
  );
}

function NumberRoundingLab({ caption }: { caption?: string }) {
  const uid = useId();
  const [mode, setMode] = useState<"division" | "float" | "round" | "precedence">("division");
  const [valA, setValA] = useState(8);
  const [halfChoice, setHalfChoice] = useState<1.5 | 2.5 | 3.5 | 4.5>(2.5);
  const [groupParens, setGroupParens] = useState(false);

  const modes: { id: "division" | "float" | "round" | "precedence"; label: string }[] = [
    { id: "division", label: "/ vs //" },
    { id: "float", label: "0.1 + 0.2" },
    { id: "round", label: "Banker's round()" },
    { id: "precedence", label: "2 + 3 * 4" },
  ];

  let codeLines: string[] = [];
  let result = "";
  let note = "";

  if (mode === "division") {
    const exact = valA / 2;
    const exactStr = Number.isInteger(exact) ? `${exact}.0` : String(exact);
    const floored = Math.floor(valA / 2);
    codeLines = [
      `a = ${valA}`,
      `print(a / 2)    # exact division -> always float`,
      `print(a // 2)   # floor division -> whole quotient`,
    ];
    result = `${exactStr}\n${floored}`;
    note =
      Number.isInteger(exact)
        ? `Even when ${valA} divides cleanly by 2, / returns float (${exactStr}) while // returns int (${floored}).`
        : `${valA} / 2 returns exact float ${exactStr}, while ${valA} // 2 drops the .5 remainder to ${floored}.`;
  } else if (mode === "float") {
    codeLines = [
      "total = 0.1 + 0.2",
      "print(repr(total))",
      "print(total == 0.3)",
    ];
    result = "0.30000000000000004\nFalse";
    note =
      "Binary floats cannot represent 1/10 or 1/5 cleanly in base 2, so compare tolerances (math.isclose) or use Decimal for money.";
  } else if (mode === "round") {
    const rounded = Math.round(halfChoice);
    const evenRounded =
      Math.abs(halfChoice - Math.floor(halfChoice) - 0.5) < 1e-9
        ? Math.floor(halfChoice) % 2 === 0
          ? Math.floor(halfChoice)
          : Math.ceil(halfChoice)
        : rounded;
    codeLines = [
      `x = ${halfChoice}`,
      "print(round(x))   # Python ties go to the nearest EVEN int",
    ];
    result = String(evenRounded);
    note = `At exact .5 ties, Python chooses the nearest even neighbor (${halfChoice} -> ${evenRounded}) instead of always rounding up.`;
  } else {
    const expr = groupParens ? "(2 + 3) * 4" : "2 + 3 * 4";
    const val = groupParens ? 20 : 14;
    codeLines = [
      `expr = ${expr}`,
      "print(expr)",
    ];
    result = String(val);
    note = groupParens
      ? "Parentheses force 2 + 3 = 5 first, then 5 * 4 = 20."
      : "Multiplication has tighter binding than +, so 3 * 4 = 12 runs before 2 + 12 = 14.";
  }

  return (
    <div className="interactive-lab param-lab">
      <div className="lab-header">
        <span className="lab-title">Numeric & precedence explorer</span>
        <code className="lab-freq-tag">{mode}</code>
      </div>

      <div className="lab-pill-row" role="tablist" aria-label="Numeric concepts">
        {modes.map((m, idx) => {
          const selected = m.id === mode;
          return (
            <button
              key={m.id}
              id={`${uid}-tab-${idx}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${uid}-panel`}
              tabIndex={selected ? 0 : -1}
              className={`lab-pill-btn ${selected ? "is-active" : ""}`}
              onClick={() => setMode(m.id)}
              onKeyDown={(e) => handleTabKeyDown(e, idx, modes.length, (next) => setMode(modes[next].id))}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${modes.findIndex((m) => m.id === mode)}`} className="lab-panel-body">
        {mode === "division" && (
          <label className="param-field">
            <span>Dividend a = <strong className="tabular">{valA}</strong></span>
            <input type="range" min={3} max={12} step={1} value={valA} onChange={(e) => setValA(Number(e.target.value))} />
          </label>
        )}

        {mode === "round" && (
          <div className="lab-pill-row" role="group" aria-label="Tie-break inputs">
            {([1.5, 2.5, 3.5, 4.5] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={halfChoice === v}
                className={`lab-pill-btn tabular ${halfChoice === v ? "is-active" : ""}`}
                onClick={() => setHalfChoice(v)}
              >
                round({v})
              </button>
            ))}
          </div>
        )}

        {mode === "precedence" && (
          <div className="lab-pill-row" role="group" aria-label="Grouping toggle">
            <button
              type="button"
              aria-pressed={!groupParens}
              className={`lab-pill-btn mono ${!groupParens ? "is-active" : ""}`}
              onClick={() => setGroupParens(false)}
            >
              2 + 3 * 4
            </button>
            <button
              type="button"
              aria-pressed={groupParens}
              className={`lab-pill-btn mono ${groupParens ? "is-active" : ""}`}
              onClick={() => setGroupParens(true)}
            >
              (2 + 3) * 4
            </button>
          </div>
        )}

        <LineCodePanel lines={codeLines} activeLines={[2]} label="Python" variant="mini" />
        <OutputStrip title="Evaluated output" output={result} />
        <p className="lab-note">{note}</p>
      </div>
      {caption && <p className="visual-caption">{renderInlineRich(caption)}</p>}
    </div>
  );
}

function FStringFormatLab({ caption }: { caption?: string }) {
  const uid = useId();
  const [spec, setSpec] = useState<".2f" | ",.2f" | ".1%" | "raw">(",.2f");
  const presets: {
    id: ".2f" | ",.2f" | ".1%" | "raw";
    label: string;
    code: string[];
    output: string;
    note: string;
  }[] = [
    {
      id: ".2f",
      label: ":.2f (fixed decimals)",
      code: ['price = 49.5', 'print(f"Total: ${price:.2f}")'],
      output: "Total: $49.50",
      note: "Forces two digits after the decimal point instead of printing $49.5.",
    },
    {
      id: ",.2f",
      label: ":,.2f (thousands)",
      code: ['revenue = 12450.5', 'print(f"${revenue:,.2f}")'],
      output: "$12,450.50",
      note: "Combines comma grouping with fixed two-decimal formatting for readable totals.",
    },
    {
      id: ".1%",
      label: ":.1% (percent)",
      code: ['ratio = 0.874', 'print(f"Pass rate: {ratio:.1%}")'],
      output: "Pass rate: 87.4%",
      note: "Multiplies by 100 automatically and appends % cleanly without manual * 100 math.",
    },
    {
      id: "raw",
      label: 'r"..." vs "\\n"',
      code: ['bad = "C:\\new\\log.txt"', 'good = r"C:\\new\\log.txt"', 'print(bad)', 'print(good)'],
      output: "C:\new\\log.txt -> newline break after C:\nC:\\new\\log.txt",
      note: 'Prefix r"..." keeps backslashes literal instead of turning \\n into a line break.',
    },
  ];
  const current = presets.find((p) => p.id === spec) ?? presets[0];

  return (
    <div className="interactive-lab param-lab">
      <div className="lab-header">
        <span className="lab-title">f-string & escape lab</span>
        <code className="lab-freq-tag">{current.id === "raw" ? 'r"..."' : `{val:${current.id}}`}</code>
      </div>

      <div className="lab-pill-row" role="tablist" aria-label="Format specifiers">
        {presets.map((p, idx) => {
          const selected = p.id === spec;
          return (
            <button
              key={p.id}
              id={`${uid}-tab-${idx}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${uid}-panel`}
              tabIndex={selected ? 0 : -1}
              className={`lab-pill-btn mono ${selected ? "is-active" : ""}`}
              onClick={() => setSpec(p.id)}
              onKeyDown={(e) => handleTabKeyDown(e, idx, presets.length, (n) => setSpec(presets[n].id))}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" className="lab-panel-body">
        <LineCodePanel lines={current.code} activeLines={[current.code.length]} label="Python" variant="mini" />
        <OutputStrip title="Formatted output" output={current.output} />
        <p className="lab-note">{current.note}</p>
      </div>
      {caption && <p className="visual-caption">{renderInlineRich(caption)}</p>}
    </div>
  );
}

function BitwiseLab({ caption }: { caption?: string }) {
  const [n, setN] = useState(-3);
  const [parenthesized, setParenthesized] = useState(true);

  // 8-bit two's complement display
  const u8 = ((n % 256) + 256) % 256;
  const bits = Array.from({ length: 8 }, (_, idx) => (u8 >> (7 - idx)) & 1);
  const pyMod2 = ((n % 2) + 2) % 2;
  const bitParity = n & 1;
  const notN = -(n + 1);
  const brokenPrecedence = n & 0; // (n & (1 == 0)) always 0
  const fixedEven = (n & 1) === 0;

  return (
    <div className="interactive-lab param-lab">
      <div className="lab-header">
        <span className="lab-title">8-bit & operator precedence explorer</span>
        <code className="lab-freq-tag">n = {n}</code>
      </div>

      <div className="param-controls-grid">
        <label className="param-field">
          <span>Integer value n = <strong className="tabular">{n}</strong></span>
          <input type="range" min={-8} max={15} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} />
        </label>
        <div className="lab-pill-row" role="group" aria-label="Quick values">
          {[-3, -1, 0, 5, 12].map((presetVal) => (
            <button
              key={presetVal}
              type="button"
              aria-pressed={n === presetVal}
              className={`lab-pill-btn tabular ${n === presetVal ? "is-active" : ""}`}
              onClick={() => setN(presetVal)}
            >
              {presetVal}
            </button>
          ))}
        </div>
      </div>

      <div className="bit-board" role="group" aria-label={`8-bit two's complement pattern for ${n}`}>
        {bits.map((b, idx) => (
          <div key={idx} className={`bit-cell ${b === 1 ? "is-one" : ""} ${idx === 7 ? "is-lsb" : ""}`}>
            <span className="bit-weight">{idx === 0 ? "-128" : 1 << (7 - idx)}</span>
            <strong className="tabular">{b}</strong>
          </div>
        ))}
      </div>

      <div className="lab-pill-row" role="group" aria-label="Precedence expression toggle">
        <button
          type="button"
          aria-pressed={!parenthesized}
          className={`lab-pill-btn mono ${!parenthesized ? "is-active" : ""}`}
          onClick={() => setParenthesized(false)}
        >
          n & 1 == 0 (Bug)
        </button>
        <button
          type="button"
          aria-pressed={parenthesized}
          className={`lab-pill-btn mono ${parenthesized ? "is-active" : ""}`}
          onClick={() => setParenthesized(true)}
        >
          (n & 1) == 0 (Fixed)
        </button>
      </div>

      <StateChips
        items={[
          {
            name: parenthesized ? "(n & 1) == 0" : "n & (1 == 0)",
            value: parenthesized ? String(fixedEven) : `${brokenPrecedence} (falsy trap!)`,
            changed: !parenthesized,
          },
          { name: "n & 1", value: String(bitParity) },
          { name: "n % 2 (Python)", value: String(pyMod2) },
          { name: "~n", value: String(notN) },
        ]}
      />

      <p className="lab-note">
        {!parenthesized
          ? "In Python and C-like languages, == binds tighter than &, so n & 1 == 0 silently becomes n & (1 == 0) = n & 0 = 0 every time."
          : `Bit 0 (the LSB) equals ${bitParity}, so (n & 1) == 0 cleanly tests parity (${fixedEven ? "Even" : "Odd"}) even for negatives like -3.`}
      </p>
      {caption && <p className="visual-caption">{renderInlineRich(caption)}</p>}
    </div>
  );
}

function PrefixSumLab({ caption }: { caption?: string }) {
  const nums = [3, 1, 4, 2, 5];
  const padded = [0];
  for (const x of nums) padded.push(padded[padded.length - 1] + x);

  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(3);
  const [usePadding, setUsePadding] = useState(true);

  const safeR = Math.max(left, right);
  const sum = padded[safeR + 1] - padded[left];

  return (
    <div className="interactive-lab param-lab">
      <div className="lab-header">
        <span className="lab-title">Prefix sum range query lab</span>
        <code className="lab-freq-tag">
          [{left}..{safeR}] = {sum}
        </code>
      </div>

      <div className="param-controls-grid">
        <label className="param-field">
          <span>Left index L = <strong className="tabular">{left}</strong></span>
          <input
            type="range"
            min={0}
            max={nums.length - 1}
            value={left}
            onChange={(e) => {
              const nextL = Number(e.target.value);
              setLeft(nextL);
              if (nextL > right) setRight(nextL);
            }}
          />
        </label>
        <label className="param-field">
          <span>Right index R = <strong className="tabular">{safeR}</strong></span>
          <input
            type="range"
            min={left}
            max={nums.length - 1}
            value={safeR}
            onChange={(e) => setRight(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="lab-pill-row" role="group" aria-label="Prefix layout comparison">
        <button
          type="button"
          aria-pressed={!usePadding}
          className={`lab-pill-btn ${!usePadding ? "is-active" : ""}`}
          onClick={() => {
            setUsePadding(false);
            setLeft(0);
          }}
        >
          Unpadded pref[r] - pref[l-1] (L=0 Trap)
        </button>
        <button
          type="button"
          aria-pressed={usePadding}
          className={`lab-pill-btn ${usePadding ? "is-active" : ""}`}
          onClick={() => setUsePadding(true)}
        >
          n+1 Padded pref[r+1] - pref[l]
        </button>
      </div>

      <div className="prefix-rows">
        <div className="dsa-array-cells">
          {nums.map((v, i) => {
            const inRange = i >= left && i <= safeR;
            return (
              <div key={i} className={`dsa-array-cell ${inRange ? "is-active" : "is-dim"}`}>
                <span className="dsa-cell-idx">{i}</span>
                <strong className="dsa-cell-val tabular">{v}</strong>
              </div>
            );
          })}
        </div>

        <div className="dsa-array-cells">
          {(usePadding ? padded : padded.slice(1)).map((pVal, idx) => {
            const isPlus = usePadding ? idx === safeR + 1 : idx === safeR;
            const isMinus = usePadding ? idx === left : idx === left - 1;
            const cls = isPlus ? "is-done" : isMinus ? "is-pivot" : "";
            return (
              <div key={idx} className={`dsa-array-cell ${cls}`}>
                <span className="dsa-cell-idx">{usePadding ? `p[${idx}]` : `u[${idx}]`}</span>
                <strong className="dsa-cell-val tabular">{pVal}</strong>
              </div>
            );
          })}
        </div>
      </div>

      <OutputStrip
        title={usePadding ? "O(1) padded formula" : "Unpadded hazard at L = 0"}
        output={
          usePadding
            ? `pref[${safeR + 1}] - pref[${left}] = ${padded[safeR + 1]} - ${padded[left]} = ${sum}`
            : left === 0
              ? `pref[-1] reads the LAST element (${padded[padded.length - 1]}) in Python -> WRONG RESULT (${padded[safeR + 1] - padded[padded.length - 1]} instead of ${padded[safeR + 1]})`
              : `pref[${safeR}] - pref[${left - 1}] = ${padded[safeR + 1]} - ${padded[left]} = ${sum} (only works when L > 0)`
        }
        tone={!usePadding && left === 0 ? "error" : "default"}
      />
      {caption && <p className="visual-caption">{renderInlineRich(caption)}</p>}
    </div>
  );
}

function DpStairsLab({ caption }: { caption?: string }) {
  const [n, setN] = useState(5);
  const [strategy, setStrategy] = useState<"naive" | "memo" | "rolling">("naive");

  // Fibonacci / climb ways for n steps
  const ways = (k: number): number => {
    if (k <= 1) return 1;
    let a = 1;
    let b = 1;
    for (let i = 2; i <= k; i += 1) {
      const next = a + b;
      a = b;
      b = next;
    }
    return b;
  };
  const naiveCalls = (k: number): number => {
    if (k <= 1) return 1;
    return 1 + naiveCalls(k - 1) + naiveCalls(k - 2);
  };

  const calls = strategy === "naive" ? naiveCalls(n) : n + 1;
  const answer = ways(n);
  const slots: string[] = [];
  for (let i = 0; i <= n; i += 1) {
    slots.push(String(ways(i)));
  }

  return (
    <div className="interactive-lab param-lab">
      <div className="lab-header">
        <span className="lab-title">DP state reuse vs exponential branching</span>
        <code className="lab-freq-tag">{calls} steps computed</code>
      </div>

      <div className="param-controls-grid">
        <label className="param-field">
          <span>Staircase size n = <strong className="tabular">{n}</strong></span>
          <input type="range" min={3} max={9} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} />
        </label>
        <div className="lab-pill-row" role="group" aria-label="DP strategy">
          {(
            [
              ["naive", "Naive O(2^n)"],
              ["memo", "Memo O(n) / -1 sentinel"],
              ["rolling", "Rolling O(1) space"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={strategy === id}
              className={`lab-pill-btn ${strategy === id ? "is-active" : ""}`}
              onClick={() => setStrategy(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <StateChips
        items={[
          { name: "ways(n)", value: String(answer) },
          { name: "Function calls / steps", value: String(calls), changed: strategy === "naive" },
          { name: "Extra memory", value: strategy === "rolling" ? "2 scalars O(1)" : `${n + 1} slots O(n)` },
        ]}
      />

      {strategy !== "rolling" ? (
        <div className="dsa-array-cells">
          {slots.map((val, i) => (
            <div key={i} className={`dsa-array-cell ${i === n ? "is-done" : "is-active"}`}>
              <span className="dsa-cell-idx">dp[{i}]</span>
              <strong className="dsa-cell-val tabular">{val}</strong>
            </div>
          ))}
        </div>
      ) : (
        <StateChips
          items={[
            { name: "prev2", value: String(ways(Math.max(0, n - 2))) },
            { name: "prev1", value: String(ways(Math.max(1, n - 1))) },
            { name: "cur = prev1 + prev2", value: String(answer), changed: true },
          ]}
        />
      )}

      <p className="lab-note">
        {strategy === "naive"
          ? `Without caching, climb(${n}) repeats subproblems ${calls} times; doubling n explodes exponentially.`
          : strategy === "memo"
            ? "Initialize unvisited entries with -1 (not 0!) so a real zero-way count never triggers endless recomputation."
            : "Notice dp[i] only looks back two steps (prev1, prev2), shrinking O(n) table space down to two variables."}
      </p>
      {caption && <p className="visual-caption">{renderInlineRich(caption)}</p>}
    </div>
  );
}

export function ParamLab({ visual }: { visual: ParamLabVisual }) {
  switch (visual.variant) {
    case "early-win-print":
      return <EarlyWinPrintLab caption={visual.caption} />;
    case "number-rounding":
      return <NumberRoundingLab caption={visual.caption} />;
    case "fstring-format":
      return <FStringFormatLab caption={visual.caption} />;
    case "bitwise":
      return <BitwiseLab caption={visual.caption} />;
    case "prefix-sum":
      return <PrefixSumLab caption={visual.caption} />;
    case "dp-stairs":
      return <DpStairsLab caption={visual.caption} />;
  }
}

function SelfBindingLab({ caption }: { caption?: string }) {
  const [callForm, setCallForm] = useState<"instance" | "explicit">("instance");
  const [depositAmt, setDepositAmt] = useState(40);
  const baseBal = 100;

  const code =
    callForm === "instance"
      ? [
          "acct = BankAccount('Sam', 100)",
          `acct.deposit(${depositAmt})`,
        ]
      : [
          "acct = BankAccount('Sam', 100)",
          `BankAccount.deposit(acct, ${depositAmt})`,
        ];

  return (
    <div className="interactive-lab param-lab">
      <div className="lab-header">
        <span className="lab-title">How Python translates obj.method(x)</span>
        <code className="lab-freq-tag">self === acct</code>
      </div>

      <div className="lab-pill-row" role="group" aria-label="Call style">
        <button
          type="button"
          aria-pressed={callForm === "instance"}
          className={`lab-pill-btn mono ${callForm === "instance" ? "is-active" : ""}`}
          onClick={() => setCallForm("instance")}
        >
          acct.deposit(x)
        </button>
        <button
          type="button"
          aria-pressed={callForm === "explicit"}
          className={`lab-pill-btn mono ${callForm === "explicit" ? "is-active" : ""}`}
          onClick={() => setCallForm("explicit")}
        >
          BankAccount.deposit(acct, x)
        </button>
      </div>

      <label className="param-field">
        <span>Deposit amount = <strong className="tabular">{depositAmt}</strong></span>
        <input type="range" min={10} max={100} step={10} value={depositAmt} onChange={(e) => setDepositAmt(Number(e.target.value))} />
      </label>

      <LineCodePanel lines={code} activeLines={[2]} label="Under the hood" variant="mini" />

      <StateChips
        items={[
          { name: "self (bound automatically)", value: "acct object" },
          { name: "amount parameter", value: String(depositAmt) },
          { name: "self.balance after", value: String(baseBal + depositAmt), changed: true },
        ]}
      />

      <p className="lab-note">
        Both calls run the exact same function: Python reads the class of acct and supplies acct automatically as parameter #1 (self).
      </p>
      {caption && <p className="visual-caption">{renderInlineRich(caption)}</p>}
    </div>
  );
}

function HashBucketLab({ caption }: { caption?: string }) {
  const [scenario, setScenario] = useState<"eq-only" | "frozen" | "mutated">("eq-only");

  const scenarios = {
    "eq-only": {
      label: "__eq__ without __hash__",
      code: [
        "class User: def __eq__(self, o): return self.id == o.id",
        "seen = {User(1)}",
      ],
      bucket: "N/A",
      output: "TypeError: unhashable type: 'User'",
      isError: true,
      note: "Defining __eq__ automatically sets __hash__ = None in Python so equal objects can never land in conflicting hash buckets.",
    },
    frozen: {
      label: "Immutable key (works)",
      code: [
        "@dataclass(frozen=True)",
        "class Point: x: int; y: int",
        "seen = {Point(2, 5)}; print(Point(2, 5) in seen)",
      ],
      bucket: "Bucket #3 -> Point(2, 5)",
      output: "True",
      isError: false,
      note: "Hash locates Bucket #3 in O(1), then __eq__ confirms equality inside that bucket.",
    },
    mutated: {
      label: "Mutated field (lost item bug)",
      code: [
        "p = MutablePoint(2, 5)",
        "seen = {p}          # stored at hash((2, 5)) -> Bucket #3",
        "p.x = 99            # lookup now checks hash((99, 5)) -> Bucket #6!",
        "print(p in seen)",
      ],
      bucket: "Stored in Bucket #3, searched in Bucket #6",
      output: "False (ghost entry leaks inside set!)",
      isError: true,
      note: "Never mutate fields hashed by __hash__ while an object sits inside a set or dict key.",
    },
  }[scenario];

  return (
    <div className="interactive-lab param-lab">
      <div className="lab-header">
        <span className="lab-title">Set / dict hash bucket simulator</span>
        <code className="lab-freq-tag">{scenarios.bucket}</code>
      </div>

      <div className="lab-pill-row" role="group" aria-label="Hashing scenario">
        {(["eq-only", "frozen", "mutated"] as const).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={scenario === k}
            className={`lab-pill-btn ${scenario === k ? "is-active" : ""}`}
            onClick={() => setScenario(k)}
          >
            {k === "eq-only" ? "1. __eq__ only" : k === "frozen" ? "2. Frozen hash+eq" : "3. Mutated key"}
          </button>
        ))}
      </div>

      <LineCodePanel lines={scenarios.code} activeLines={[scenarios.code.length]} label="Python" variant="mini" />
      <OutputStrip title="Lookup outcome" output={scenarios.output} tone={scenarios.isError ? "error" : "default"} />
      <p className="lab-note">{scenarios.note}</p>
      {caption && <p className="visual-caption">{renderInlineRich(caption)}</p>}
    </div>
  );
}

export function ObjectModelLab({ visual }: { visual: ObjectModelLabVisual }) {
  if (visual.variant === "self-binding") {
    return <SelfBindingLab caption={visual.caption} />;
  }
  return <HashBucketLab caption={visual.caption} />;
}
