"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { Icon } from "@/components/icon";
import type { InteractiveWidgetVisual } from "@/lib/lesson-types";
import { LineCodePanel, OutputStrip, StateChips, handleTabKeyDown, renderInlineRich } from "./rich-text";

type OperatorLabVisual = Extract<InteractiveWidgetVisual, { kind: "operator-lab" }>;
type TypeCastLabVisual = Extract<InteractiveWidgetVisual, { kind: "type-cast-lab" }>;
type SliceExplorerVisual = Extract<InteractiveWidgetVisual, { kind: "slice-explorer" }>;
type LoopStepperVisual = Extract<InteractiveWidgetVisual, { kind: "loop-stepper" }>;
type AsyncTimelineVisual = Extract<InteractiveWidgetVisual, { kind: "async-timeline" }>;
type RegexLabVisual = Extract<InteractiveWidgetVisual, { kind: "regex-lab" }>;

type ParsedPyVal =
  | { ok: true; kind: "int"; val: number; display: string }
  | { ok: true; kind: "float"; val: number; display: string }
  | { ok: true; kind: "bool"; val: boolean; display: string }
  | { ok: true; kind: "str"; val: string; display: string }
  | { ok: true; kind: "none"; val: null; display: "None" }
  | { ok: true; kind: "list" | "tuple" | "dict"; items: string[]; display: string }
  | { ok: false; err: string };

function splitTopLevelItems(inner: string): string[] | null {
  if (!inner.trim()) return [];
  const items: string[] = [];
  let buf = "";
  let depth = 0;
  let quote: '"' | "'" | null = null;
  let escaped = false;

  for (let i = 0; i < inner.length; i += 1) {
    const ch = inner[i];
    if (escaped) {
      buf += ch;
      escaped = false;
      continue;
    }
    if (ch === "\\" && quote) {
      buf += ch;
      escaped = true;
      continue;
    }
    if (quote) {
      buf += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      buf += ch;
      continue;
    }
    if (ch === "[" || ch === "(" || ch === "{") {
      depth += 1;
      buf += ch;
      continue;
    }
    if (ch === "]" || ch === ")" || ch === "}") {
      depth -= 1;
      if (depth < 0) return null;
      buf += ch;
      continue;
    }
    if (ch === "," && depth === 0) {
      const trimmed = buf.trim();
      if (!trimmed) return null;
      items.push(trimmed);
      buf = "";
      continue;
    }
    buf += ch;
  }

  if (quote || depth !== 0) return null;
  const tail = buf.trim();
  if (tail) items.push(tail);
  return items;
}

/** Safe literal parser mirroring everyday Python literals (`42`, `3.5`, `"hi"`, `True`, `None`, `[1, 2]`). */
function parsePythonLiteral(rawInput: string): ParsedPyVal {
  const s = rawInput.trim();
  if (!s) return { ok: false, err: "SyntaxError: enter a value such as 42, True, or \"hi\"" };
  if (s === "True") return { ok: true, kind: "bool", val: true, display: "True" };
  if (s === "False") return { ok: true, kind: "bool", val: false, display: "False" };
  if (s === "None") return { ok: true, kind: "none", val: null, display: "None" };

  if (
    (s.startsWith('"') && s.endsWith('"') && s.length >= 2) ||
    (s.startsWith("'") && s.endsWith("'") && s.length >= 2)
  ) {
    const inner = s.slice(1, -1);
    return { ok: true, kind: "str", val: inner, display: `"${inner}"` };
  }

  if (/^[+-]?\d+$/.test(s)) {
    const n = Number(s);
    return { ok: true, kind: "int", val: n, display: String(n) };
  }
  if (/^[+-]?(?:\d+\.\d*|\.\d+)$/.test(s)) {
    const n = Number(s);
    if (!Number.isNaN(n)) {
      const text = Number.isInteger(n) ? `${n}.0` : String(n);
      return { ok: true, kind: "float", val: n, display: text };
    }
  }
  if (s.startsWith("[") && s.endsWith("]")) {
    const items = splitTopLevelItems(s.slice(1, -1));
    if (!items) return { ok: false, err: "SyntaxError: invalid list syntax" };
    return { ok: true, kind: "list", items, display: s };
  }
  if (s.startsWith("(") && s.endsWith(")")) {
    const items = splitTopLevelItems(s.slice(1, -1));
    if (!items) return { ok: false, err: "SyntaxError: invalid tuple syntax" };
    return { ok: true, kind: "tuple", items, display: s };
  }
  if (s.startsWith("{") && s.endsWith("}")) {
    const items = splitTopLevelItems(s.slice(1, -1));
    if (!items) return { ok: false, err: "SyntaxError: invalid dictionary or set syntax" };
    return { ok: true, kind: "dict", items, display: s };
  }

  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(s)) {
    return {
      ok: false,
      err: `NameError: name '${s}' is not defined (wrap strings in quotes like "${s}")`,
    };
  }

  return { ok: false, err: "SyntaxError: invalid Python literal" };
}

function pyTruthiness(v: ParsedPyVal): boolean {
  if (!v.ok) return false;
  switch (v.kind) {
    case "bool":
      return v.val;
    case "int":
    case "float":
      return v.val !== 0;
    case "str":
      return v.val.length > 0;
    case "none":
      return false;
    case "list":
    case "tuple":
    case "dict":
      return v.items.length > 0;
  }
}

function evalCustomBinaryOp(
  leftRaw: string,
  op: string,
  rightRaw: string,
): { result: string; typeName: string; note: string; isError?: boolean } {
  const l = parsePythonLiteral(leftRaw);
  const r = parsePythonLiteral(rightRaw);
  if (!l.ok || !r.ok) {
    const bad = !l.ok ? l.err : !r.ok ? r.err : "SyntaxError";
    const isName = bad.startsWith("NameError:");
    return {
      result: bad,
      typeName: isName ? "NameError" : "SyntaxError",
      note: isName
        ? "Bare words in Python are variable names; wrap text in quotes such as `\"hi\"`."
        : "Enter a simple number, quoted string, list, boolean (`True`/`False`), or `None`.",
      isError: true,
    };
  }

  const numVal = (v: ParsedPyVal): number | null => {
    if (!v.ok) return null;
    if (v.kind === "int" || v.kind === "float") return v.val;
    if (v.kind === "bool") return v.val ? 1 : 0;
    return null;
  };
  const isFloat = (v: ParsedPyVal) => v.ok && v.kind === "float";

  if (op === "and" || op === "or") {
    const lTruth = pyTruthiness(l);
    const chosen = op === "and" ? (lTruth ? r : l) : (lTruth ? l : r);
    return {
      result: chosen.display,
      typeName: chosen.kind,
      note:
        op === "and"
          ? "Python `and` returns the first falsy value, or the last value if all are truthy."
          : "Python `or` returns the first truthy value immediately (short-circuit).",
    };
  }

  if (op === "==") {
    const ln = numVal(l);
    const rn = numVal(r);
    const eq = ln !== null && rn !== null ? ln === rn : l.kind === r.kind && l.display === r.display;
    return { result: eq ? "True" : "False", typeName: "bool", note: "Value equality check." };
  }
  if (op === "!=") {
    const ln = numVal(l);
    const rn = numVal(r);
    const eq = ln !== null && rn !== null ? ln === rn : l.kind === r.kind && l.display === r.display;
    return { result: !eq ? "True" : "False", typeName: "bool", note: "Inequality check." };
  }

  if (op === "in") {
    if (l.kind === "str" && r.kind === "str") {
      const found = r.val.includes(l.val);
      return { result: found ? "True" : "False", typeName: "bool", note: "Substring membership test." };
    }
    if (r.kind === "list" || r.kind === "tuple") {
      const found = r.items.includes(l.display) || r.items.includes(leftRaw.trim());
      return { result: found ? "True" : "False", typeName: "bool", note: "Checks each item in the sequence." };
    }
    return {
      result: `TypeError: argument of type '${r.kind}' is not iterable`,
      typeName: "TypeError",
      note: "Membership (`in`) requires a string or collection on the right.",
      isError: true,
    };
  }

  if (op === "<" || op === "<=" || op === ">" || op === ">=") {
    const ln = numVal(l);
    const rn = numVal(r);
    let okCompare: boolean | null = null;
    if (ln !== null && rn !== null) {
      okCompare = op === "<" ? ln < rn : op === "<=" ? ln <= rn : op === ">" ? ln > rn : ln >= rn;
    } else if (l.kind === "str" && r.kind === "str") {
      okCompare = op === "<" ? l.val < r.val : op === "<=" ? l.val <= r.val : op === ">" ? l.val > r.val : l.val >= r.val;
    }
    if (okCompare === null) {
      return {
        result: `TypeError: '${op}' not supported between '${l.kind}' and '${r.kind}'`,
        typeName: "TypeError",
        note: "Python cannot compare unrelated types like `int` and `str` with `<` or `>`.",
        isError: true,
      };
    }
    return { result: okCompare ? "True" : "False", typeName: "bool", note: "Comparisons always return `True` or `False`." };
  }

  if (op === "+" && l.kind === "str" && r.kind === "str") {
    return { result: `"${l.val + r.val}"`, typeName: "str", note: "`+` on two strings joins (concatenates) them." };
  }
  if (op === "*") {
    if (l.kind === "str" && r.kind === "int") {
      const times = Math.max(0, Math.min(20, r.val));
      return {
        result: `"${l.val.repeat(times)}"`,
        typeName: "str",
        note: "Multiplying a string by an `int` repeats it.",
      };
    }
    if (r.kind === "str" && l.kind === "int") {
      const times = Math.max(0, Math.min(20, l.val));
      return {
        result: `"${r.val.repeat(times)}"`,
        typeName: "str",
        note: "Multiplying an `int` by a string repeats it.",
      };
    }
  }

  const ln = numVal(l);
  const rn = numVal(r);
  if (ln === null || rn === null) {
    return {
      result: `TypeError: unsupported operand type(s) for ${op}: '${l.kind}' and '${r.kind}'`,
      typeName: "TypeError",
      note: "Convert strings with `int()` or `float()` before doing math.",
      isError: true,
    };
  }

  if ((op === "/" || op === "//" || op === "%") && rn === 0) {
    return {
      result: "ZeroDivisionError: division by zero",
      typeName: "ZeroDivisionError",
      note: "Dividing or taking remainder modulo `0` raises `ZeroDivisionError`.",
      isError: true,
    };
  }

  const formatNum = (val: number, floatOut: boolean) => {
    if (!floatOut && Number.isInteger(val)) return { result: String(val), typeName: "int" };
    const text = Number.isInteger(val) ? `${val}.0` : String(Number(val.toFixed(6)));
    return { result: text, typeName: "float" };
  };

  const anyFloat = isFloat(l) || isFloat(r);
  switch (op) {
    case "+":
      return { ...formatNum(ln + rn, anyFloat), note: "Numeric addition." };
    case "-":
      return { ...formatNum(ln - rn, anyFloat), note: "Numeric subtraction." };
    case "*":
      return { ...formatNum(ln * rn, anyFloat), note: "Numeric multiplication." };
    case "/": {
      const res = formatNum(ln / rn, true);
      return { ...res, note: "True division (`/`) always produces a `float`, even for `8 / 2`." };
    }
    case "//": {
      const val = Math.floor(ln / rn);
      return { ...formatNum(val, anyFloat), note: "Floor division (`//`) rounds toward negative infinity." };
    }
    case "%": {
      const mod = ((ln % rn) + rn) % rn;
      return { ...formatNum(mod, anyFloat), note: "Modulo (`%`) returns the remainder (sign follows divisor)." };
    }
    case "**": {
      const val = Math.pow(ln, rn);
      const floatPow = anyFloat || rn < 0;
      return { ...formatNum(val, floatPow), note: "Exponentiation (`**`) raises left to the right power." };
    }
    default:
      return { result: "Unsupported operator", typeName: "error", note: "Choose another operator.", isError: true };
  }
}

const CUSTOM_OPS = ["+", "-", "*", "/", "//", "%", "**", "==", "!=", "<", ">", "<=", ">=", "and", "or", "in"];

export function OperatorLab({ visual }: { visual: OperatorLabVisual }) {
  const tabBaseId = useId();
  const [idx, setIdx] = useState(0);
  const [customMode, setCustomMode] = useState(false);
  const [leftInput, setLeftInput] = useState("10");
  const [opInput, setOpInput] = useState("//");
  const [rightInput, setRightInput] = useState("3");

  const current = visual.presets[Math.min(idx, Math.max(0, visual.presets.length - 1))];
  const customEval = useMemo(
    () => evalCustomBinaryOp(leftInput, opInput, rightInput),
    [leftInput, opInput, rightInput],
  );

  if (!current) return null;

  const isPresetError = !customMode && current.result.includes("Error");
  const displayLeft = customMode ? leftInput : current.left;
  const displayOp = customMode ? opInput : current.op;
  const displayRight = customMode ? rightInput : current.right;
  const displayResult = customMode ? customEval.result : current.result;
  const displayType = customMode ? customEval.typeName : current.typeName;
  const displayNote = customMode ? customEval.note : current.note;
  const isError = customMode ? Boolean(customEval.isError) : isPresetError;
  const activeTabIndex = customMode ? visual.presets.length : idx;
  const totalTabs = visual.presets.length + 1;

  return (
    <div className="interactive-lab">
      <div className="lab-header">
        <span className="lab-title">Operator explorer</span>
        {!customMode && current.frequency ? (
          <span className="lab-freq-tag">{current.frequency}</span>
        ) : null}
      </div>

      <div className="lab-pill-row" role="tablist" aria-label="Operator expressions">
        {visual.presets.map((preset, i) => {
          const selected = !customMode && i === idx;
          return (
            <button
              key={preset.label}
              id={`${tabBaseId}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${tabBaseId}-panel`}
              tabIndex={selected ? 0 : -1}
              className={`lab-pill-btn ${selected ? "is-active" : ""}`}
              onClick={() => {
                setCustomMode(false);
                setIdx(i);
              }}
              onKeyDown={(e) =>
                handleTabKeyDown(e, i, totalTabs, (next) => {
                  if (next === visual.presets.length) setCustomMode(true);
                  else {
                    setCustomMode(false);
                    setIdx(next);
                  }
                })
              }
            >
              {preset.label}
            </button>
          );
        })}
        <button
          id={`${tabBaseId}-tab-custom`}
          type="button"
          role="tab"
          aria-selected={customMode}
          aria-controls={`${tabBaseId}-panel`}
          tabIndex={customMode ? 0 : -1}
          className={`lab-pill-btn ${customMode ? "is-active" : ""}`}
          onClick={() => setCustomMode(true)}
          onKeyDown={(e) =>
            handleTabKeyDown(e, activeTabIndex, totalTabs, (next) => {
              if (next === visual.presets.length) setCustomMode(true);
              else {
                setCustomMode(false);
                setIdx(next);
              }
            })
          }
        >
          Custom sandbox
        </button>
      </div>

      <div
        id={`${tabBaseId}-panel`}
        role="tabpanel"
        aria-labelledby={
          customMode ? `${tabBaseId}-tab-custom` : `${tabBaseId}-tab-${idx}`
        }
        className="lab-panel-body"
      >
        {customMode && (
          <div className="op-sandbox-row">
            <input
              type="text"
              aria-label="Left operand"
              value={leftInput}
              onChange={(e) => setLeftInput(e.target.value)}
              placeholder='e.g. 10 or "hi"'
            />
            <label className="visually-hidden" htmlFor={`${tabBaseId}-op-select`}>
              Python operator
            </label>
            <select
              id={`${tabBaseId}-op-select`}
              name="python-operator"
              className="op-select"
              value={opInput}
              onChange={(e) => setOpInput(e.target.value)}
            >
              {CUSTOM_OPS.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
            <input
              type="text"
              aria-label="Right operand"
              value={rightInput}
              onChange={(e) => setRightInput(e.target.value)}
              placeholder='e.g. 3 or "hello"'
            />
          </div>
        )}

        <div className="op-equation-stage">
          {displayLeft && <div className="op-token">{displayLeft}</div>}
          <div className="op-symbol">{displayOp}</div>
          {displayRight && <div className="op-token">{displayRight}</div>}
          <span className="op-arrow" aria-hidden="true">→</span>
          <div className={`op-result-box ${isError ? "is-error" : ""}`}>
            <strong>{displayResult}</strong>
            <small>type: {displayType}</small>
          </div>
        </div>

        <p className="lab-note">{renderInlineRich(displayNote)}</p>
      </div>
      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}

function evaluatePythonCasts(rawText: string): {
  typeLabel: string;
  asInt: string;
  asFloat: string;
  asStr: string;
  asBool: string;
  note: string;
} {
  const parsed = parsePythonLiteral(rawText);
  if (!parsed.ok) {
    const isName = parsed.err.startsWith("NameError:");
    const errTag = isName ? "NameError" : "SyntaxError";
    return {
      typeLabel: errTag,
      asInt: errTag,
      asFloat: errTag,
      asStr: errTag,
      asBool: errTag,
      note: isName
        ? parsed.err
        : "Enter a literal like `42`, `3.9`, `\"42\"`, `\"abc\"`, `True`, `0`, `\"\"`, or `[]`.",
    };
  }

  const boolStr = pyTruthiness(parsed) ? "True" : "False";

  if (parsed.kind === "int") {
    return {
      typeLabel: "int",
      asInt: String(parsed.val),
      asFloat: `${parsed.val}.0`,
      asStr: `"${parsed.val}"`,
      asBool: boolStr,
      note:
        parsed.val === 0
          ? "Integer `0` converts directly to `float` (`0.0`) and `str`, and is the ONLY falsy integer."
          : "Non-zero integers are `True` under `bool(x)` and keep their digits under `str(x)`.",
    };
  }
  if (parsed.kind === "float") {
    const truncated = Math.trunc(parsed.val);
    return {
      typeLabel: "float",
      asInt: String(truncated),
      asFloat: parsed.display,
      asStr: `"${parsed.display}"`,
      asBool: boolStr,
      note: "`int(float)` truncates toward zero, dropping decimals without rounding.",
    };
  }
  if (parsed.kind === "bool") {
    return {
      typeLabel: "bool",
      asInt: parsed.val ? "1" : "0",
      asFloat: parsed.val ? "1.0" : "0.0",
      asStr: `"${parsed.display}"`,
      asBool: parsed.display,
      note: "`bool` is a subtype of `int`: `True == 1` and `False == 0`.",
    };
  }
  if (parsed.kind === "none") {
    return {
      typeLabel: "NoneType",
      asInt: "TypeError",
      asFloat: "TypeError",
      asStr: '"None"',
      asBool: "False",
      note: "`None` represents missing data: `bool(None)` is `False`, and numeric casts raise `TypeError`.",
    };
  }
  if (parsed.kind !== "str") {
    return {
      typeLabel: parsed.kind,
      asInt: "TypeError",
      asFloat: "TypeError",
      asStr: `"${parsed.display}"`,
      asBool: boolStr,
      note: "Empty containers (`[]`, `()`, `{}`) are `False`; non-empty containers are `True`.",
    };
  }

  // String
  const trimmed = parsed.val.trim();
  const intOk = /^[+-]?\d+$/.test(trimmed);
  const floatOk = /^[+-]?(?:\d+\.\d*|\.\d+|\d+)$/.test(trimmed);
  return {
    typeLabel: "str",
    asInt: intOk ? String(Number(trimmed)) : "ValueError",
    asFloat: floatOk
      ? Number.isInteger(Number(trimmed))
        ? `${Number(trimmed)}.0`
        : String(Number(trimmed))
      : "ValueError",
    asStr: `"${parsed.val}"`,
    asBool: boolStr,
    note:
      parsed.val === ""
        ? "An empty string `\"\"` has length 0, so `bool(\"\")` is `False` and numeric casts raise `ValueError`."
        : intOk
          ? `Numeric text \`"${parsed.val}"\` converts directly into \`int\` and \`float\`.`
          : floatOk
            ? `Decimal text \`"${parsed.val}"\` parses into \`float\`, but \`int()\` raises \`ValueError\` directly; call \`int(float(x))\` if truncation is intended.`
            : "Every non-empty string (even `\"False\"` or `\"0\"`) has `bool(x) == True`. Non-numeric strings raise `ValueError` on `int()`/`float()`.",
  };
}

export function TypeCastLab({ visual }: { visual: TypeCastLabVisual }) {
  const tabBaseId = useId();
  const [idx, setIdx] = useState(0);
  const [customMode, setCustomMode] = useState(false);
  const [customRaw, setCustomRaw] = useState('"42"');

  const current = visual.items[Math.min(idx, Math.max(0, visual.items.length - 1))];
  const customResult = useMemo(() => evaluatePythonCasts(customRaw), [customRaw]);

  if (!current) return null;

  const activeData = customMode ? customResult : current;
  const conversions = [
    { fn: "int(x)", value: activeData.asInt },
    { fn: "float(x)", value: activeData.asFloat },
    { fn: "str(x)", value: activeData.asStr },
    { fn: "bool(x)", value: activeData.asBool },
  ];
  const activeTabIndex = customMode ? visual.items.length : idx;
  const totalTabs = visual.items.length + 1;

  return (
    <div className="interactive-lab">
      <div className="lab-header">
        <span className="lab-title">Data type & casting</span>
        <span className="lab-freq-tag">type(x) = {activeData.typeLabel}</span>
      </div>

      <div className="lab-pill-row" role="tablist" aria-label="Input values">
        {visual.items.map((item, i) => {
          const selected = !customMode && i === idx;
          return (
            <button
              key={`${item.raw}-${i}`}
              id={`${tabBaseId}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${tabBaseId}-panel`}
              tabIndex={selected ? 0 : -1}
              className={`lab-pill-btn mono ${selected ? "is-active" : ""}`}
              onClick={() => {
                setCustomMode(false);
                setIdx(i);
              }}
              onKeyDown={(e) =>
                handleTabKeyDown(e, i, totalTabs, (next) => {
                  if (next === visual.items.length) setCustomMode(true);
                  else {
                    setCustomMode(false);
                    setIdx(next);
                  }
                })
              }
            >
              x = {item.raw}
            </button>
          );
        })}
        <button
          id={`${tabBaseId}-tab-custom`}
          type="button"
          role="tab"
          aria-selected={customMode}
          aria-controls={`${tabBaseId}-panel`}
          tabIndex={customMode ? 0 : -1}
          className={`lab-pill-btn ${customMode ? "is-active" : ""}`}
          onClick={() => setCustomMode(true)}
          onKeyDown={(e) =>
            handleTabKeyDown(e, activeTabIndex, totalTabs, (next) => {
              if (next === visual.items.length) setCustomMode(true);
              else {
                setCustomMode(false);
                setIdx(next);
              }
            })
          }
        >
          Custom input
        </button>
      </div>

      <div
        id={`${tabBaseId}-panel`}
        role="tabpanel"
        aria-labelledby={
          customMode ? `${tabBaseId}-tab-custom` : `${tabBaseId}-tab-${idx}`
        }
        className="lab-panel-body"
      >
        {customMode && (
          <div className="cast-input-row">
            <label htmlFor={`${tabBaseId}-cast-input`}>
              <code>x =</code>
            </label>
            <input
              id={`${tabBaseId}-cast-input`}
              type="text"
              value={customRaw}
              onChange={(e) => setCustomRaw(e.target.value)}
              placeholder='42, 3.9, "42", "abc", "", True, None, []'
            />
          </div>
        )}

        <div className="cast-grid">
          {conversions.map((c) => {
            const isError = c.value.includes("Error");
            return (
              <div key={c.fn} className={`cast-card ${isError ? "is-error" : ""}`}>
                <span className="cast-fn">{c.fn}</span>
                <strong className="cast-val">{c.value}</strong>
              </div>
            );
          })}
        </div>

        <p className="lab-note">{renderInlineRich(activeData.note)}</p>
      </div>
      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}

function computePythonSliceIndices(
  length: number,
  start: number | null,
  stop: number | null,
  step: number,
): number[] {
  if (step === 0 || length === 0) return [];
  const norm = (val: number | null, defaultVal: number): number => {
    if (val === null) return defaultVal;
    const adjusted = val < 0 ? length + val : val;
    if (step > 0) return Math.max(0, Math.min(length, adjusted));
    return Math.max(-1, Math.min(length - 1, adjusted));
  };

  const s = norm(start, step > 0 ? 0 : length - 1);
  const e = norm(stop, step > 0 ? length : -1);
  const picked: number[] = [];
  if (step > 0) {
    for (let i = s; i < e; i += step) picked.push(i);
  } else {
    for (let i = s; i > e; i += step) picked.push(i);
  }
  return picked;
}

export function SliceExplorer({ visual }: { visual: SliceExplorerVisual }) {
  const len = visual.items.length;
  const [start, setStart] = useState<number | null>(visual.initialStart ?? 0);
  const [stop, setStop] = useState<number | null>(
    visual.initialStop === undefined ? Math.min(3, len) : visual.initialStop,
  );
  const [step, setStep] = useState<number>(visual.initialStep ?? 1);

  const selectedIndices = useMemo(
    () => computePythonSliceIndices(len, start, stop, step),
    [len, start, stop, step],
  );
  const selectedOrderMap = useMemo(() => {
    const map = new Map<number, number>();
    selectedIndices.forEach((index, pos) => map.set(index, pos));
    return map;
  }, [selectedIndices]);

  const sliceExpr =
    step === 1
      ? `[${start ?? ""}:${stop ?? ""}]`
      : `[${start ?? ""}:${stop ?? ""}:${step}]`;

  const resultLabel =
    step === 0
      ? "ValueError: slice step cannot be zero"
      : visual.mode === "string"
        ? `"${selectedIndices.map((i) => visual.items[i]).join("")}"`
        : `[${selectedIndices.map((i) => visual.items[i]).join(", ")}]`;

  const clampWide = (val: number) => Math.max(-len - 3, Math.min(len + 100, val));

  return (
    <div className="interactive-lab">
      <div className="lab-header">
        <span className="lab-title">Slice explorer</span>
        <code className={`lab-expr-tag ${step === 0 ? "is-error" : ""}`}>
          items{sliceExpr} → {resultLabel}
        </code>
      </div>

      <div className="lab-pill-row" role="group" aria-label="Slice presets">
        <button
          type="button"
          aria-pressed={start === 0 && stop === Math.min(3, len) && step === 1}
          className={`lab-pill-btn mono ${start === 0 && stop === Math.min(3, len) && step === 1 ? "is-active" : ""}`}
          onClick={() => {
            setStart(0);
            setStop(Math.min(3, len));
            setStep(1);
          }}
        >
          [:3]
        </button>
        <button
          type="button"
          aria-pressed={start === 1 && stop === Math.min(4, len) && step === 1}
          className={`lab-pill-btn mono ${start === 1 && stop === Math.min(4, len) && step === 1 ? "is-active" : ""}`}
          onClick={() => {
            setStart(1);
            setStop(Math.min(4, len));
            setStep(1);
          }}
        >
          [1:4]
        </button>
        <button
          type="button"
          aria-pressed={start === -2 && stop === null && step === 1}
          className={`lab-pill-btn mono ${start === -2 && stop === null && step === 1 ? "is-active" : ""}`}
          onClick={() => {
            setStart(-2);
            setStop(null);
            setStep(1);
          }}
        >
          [-2:]
        </button>
        <button
          type="button"
          aria-pressed={start === null && stop === null && step === -1}
          className={`lab-pill-btn mono ${start === null && stop === null && step === -1 ? "is-active" : ""}`}
          onClick={() => {
            setStart(null);
            setStop(null);
            setStep(-1);
          }}
        >
          [::-1]
        </button>
        <button
          type="button"
          aria-pressed={start === 0 && stop === 99 && step === 1}
          className={`lab-pill-btn mono ${start === 0 && stop === 99 && step === 1 ? "is-active" : ""}`}
          onClick={() => {
            setStart(0);
            setStop(99);
            setStep(1);
          }}
        >
          [0:99] (safe clamp)
        </button>
      </div>

      <div className="slice-controls-row">
        <div className="slice-ctrl">
          <span>start</span>
          <div className="slice-step-btns">
            <button
              type="button"
              aria-label="Decrease start index"
              disabled={start !== null && start <= -len - 3}
              onClick={() => setStart((v) => clampWide((v ?? 0) - 1))}
            >
              -
            </button>
            <code>{start === null ? "None" : start}</code>
            <button
              type="button"
              aria-label="Increase start index"
              disabled={start !== null && start >= len + 100}
              onClick={() => setStart((v) => clampWide((v ?? 0) + 1))}
            >
              +
            </button>
            <button
              type="button"
              className="slice-none-btn"
              aria-label={start === null ? "Set start index to 0" : "Clear start index to None"}
              onClick={() => setStart((v) => (v === null ? 0 : null))}
            >
              {start === null ? "set" : "clear"}
            </button>
          </div>
        </div>

        <div className="slice-ctrl">
          <span>stop</span>
          <div className="slice-step-btns">
            <button
              type="button"
              aria-label="Decrease stop index"
              disabled={stop !== null && stop <= -len - 3}
              onClick={() => setStop((v) => clampWide((v ?? len) - 1))}
            >
              -
            </button>
            <code>{stop === null ? "None" : stop}</code>
            <button
              type="button"
              aria-label="Increase stop index"
              disabled={stop !== null && stop >= len + 100}
              onClick={() => setStop((v) => clampWide((v ?? len - 1) + 1))}
            >
              +
            </button>
            <button
              type="button"
              className="slice-none-btn"
              aria-label={stop === null ? `Set stop index to ${len}` : "Clear stop index to None"}
              onClick={() => setStop((v) => (v === null ? len : null))}
            >
              {stop === null ? "set" : "clear"}
            </button>
          </div>
        </div>

        <div className="slice-ctrl">
          <span>step</span>
          <div className="slice-step-btns">
            {[-2, -1, 0, 1, 2].map((sVal) => (
              <button
                key={sVal}
                type="button"
                aria-pressed={step === sVal}
                className={step === sVal ? "is-picked" : ""}
                onClick={() => setStep(sVal)}
              >
                {sVal}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="slice-cells-scroll">
        <div className="slice-cells-row">
          {visual.items.map((item, i) => {
            const order = selectedOrderMap.get(i);
            const active = order !== undefined;
            const dim = selectedIndices.length > 0 && !active;
            return (
              <div key={`${item}-${i}`} className={`slice-cell ${active ? "is-active" : ""} ${dim ? "is-dim" : ""}`}>
                <span className="slice-idx-pos">{i}</span>
                <div className="slice-val-box">
                  <strong>{item}</strong>
                  {order !== undefined && <small className="slice-order-tag">#{order + 1}</small>}
                </div>
                <span className="slice-idx-neg">{i - len}</span>
              </div>
            );
          })}
        </div>
      </div>

      {step === 0 ? (
        <div className="lab-empty-msg is-error">
          {renderInlineRich(
            "`step = 0` cannot advance forward or backward, so Python immediately raises `ValueError: slice step cannot be zero`.",
          )}
        </div>
      ) : selectedIndices.length === 0 ? (
        <div className="lab-empty-msg">
          {renderInlineRich(
            `Empty slice (${resultLabel}): moving by step \`${step}\` from \`start=${start ?? "default"}\` never crosses \`stop=${stop ?? "default"}\`, so Python returns an empty sequence instead of raising an error.`,
          )}
        </div>
      ) : null}

      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}

export function LoopStepper({ visual }: { visual: LoopStepperVisual }) {
  const tabBaseId = useId();
  const [iterIdx, setIterIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const count = visual.iterations.length;
  const safeIdx = Math.min(iterIdx, Math.max(0, count - 1));
  const current = visual.iterations[safeIdx];
  const hasAnyOutput = useMemo(
    () => visual.iterations.some((it) => Boolean(it.output)),
    [visual.iterations],
  );

  useEffect(() => {
    if (!playing || count <= 1) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setInterval(() => {
      setIterIdx((prev) => {
        if (prev >= count - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, reduced ? 1400 : 1150);
    return () => window.clearInterval(timer);
  }, [playing, count]);

  if (!current) return null;

  const progressPct = count <= 1 ? 1 : (safeIdx + 1) / count;

  return (
    <div className="interactive-lab">
      <div className="lab-header">
        <span className="lab-title">
          Execution stepper · <span className="tabular">{safeIdx + 1} / {count}</span>
        </span>
        <div className="loop-transport">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setPlaying(false);
              setIterIdx((i) => Math.max(0, i - 1));
            }}
            disabled={safeIdx === 0}
          >
            Prev
          </button>
          <button
            type="button"
            className={`btn btn-sm ${playing ? "btn-primary" : "btn-secondary"}`}
            onClick={() => {
              if (!playing && safeIdx >= count - 1) setIterIdx(0);
              setPlaying((p) => !p);
            }}
          >
            <Icon name={playing ? "pause" : "play"} size={13} />
            <span>{playing ? "Pause" : "Auto-step"}</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setPlaying(false);
              setIterIdx((i) => Math.min(count - 1, i + 1));
            }}
            disabled={safeIdx >= count - 1}
          >
            Next
          </button>
          {safeIdx > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setPlaying(false);
                setIterIdx(0);
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {count > 1 && (
        <div className="lab-progress-rail" aria-hidden="true">
          <div className="lab-progress-fill" style={{ transform: `scaleX(${progressPct})` }} />
        </div>
      )}

      <div className="lab-pill-row" role="tablist" aria-label="Execution steps">
        {visual.iterations.map((it, i) => {
          const selected = i === safeIdx;
          return (
            <button
              key={`${it.label}-${i}`}
              id={`${tabBaseId}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${tabBaseId}-panel`}
              tabIndex={selected ? 0 : -1}
              className={`lab-pill-btn ${selected ? "is-active" : ""}`}
              onClick={() => {
                setPlaying(false);
                setIterIdx(i);
              }}
              onKeyDown={(e) =>
                handleTabKeyDown(e, i, count, (next) => {
                  setPlaying(false);
                  setIterIdx(next);
                })
              }
            >
              {it.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${tabBaseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${tabBaseId}-tab-${safeIdx}`}
        className="loop-stage-grid"
      >
        <LineCodePanel
          lines={visual.code}
          activeLines={[current.activeLine]}
          variant="mini"
        />

        <div className="loop-state-panel">
          {current.status && <div className="loop-status-tag">{renderInlineRich(current.status)}</div>}
          {current.callStack && current.callStack.length > 0 && (
            <div className="call-stack-panel" aria-label="Call stack">
              <span className="call-stack-title">Call stack</span>
              <div className="call-stack-frames">
                {current.callStack.map((frame, fIdx) => (
                  <div key={`${frame.fn}-${fIdx}`} className={`call-stack-frame status-${frame.status ?? "active"}`}>
                    <code>{frame.fn}</code>
                    <span className="call-stack-meta tabular">
                      L{frame.line} · {frame.status ?? "active"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <StateChips items={current.vars} />
          {hasAnyOutput && (
            <OutputStrip
              title="Console output"
              output={current.output}
              emptyLabel="(no output printed yet)"
            />
          )}
        </div>
      </div>

      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}

export function AsyncTimelineLab({ visual }: { visual: AsyncTimelineVisual }) {
  const tabBaseId = useId();
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  const scenario = visual.scenarios[Math.min(scenarioIdx, Math.max(0, visual.scenarios.length - 1))];
  const totalMs = Math.max(1, scenario?.totalMs ?? 400);
  const [playheadMs, setPlayheadMs] = useState<number>(totalMs);

  useEffect(() => {
    if (!playing) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepMs = reduced ? Math.max(25, Math.round(totalMs / 5)) : Math.max(5, Math.round(totalMs / 40));
    const timer = window.setInterval(() => {
      setPlayheadMs((prev) => {
        if (prev >= totalMs) {
          setPlaying(false);
          return totalMs;
        }
        return Math.min(totalMs, prev + stepMs);
      });
    }, reduced ? 320 : 55);
    return () => window.clearInterval(timer);
  }, [playing, totalMs]);

  if (!scenario) return null;
  const clampedMs = Math.min(playheadMs, totalMs);

  return (
    <div className="interactive-lab async-timeline">
      <div className="lab-header">
        <span className="lab-title">Execution timeline</span>
        <div className="async-header-badges">
          {scenario.gilNote && <span className="lab-freq-tag">{scenario.gilNote}</span>}
          <span className="lab-expr-tag tabular">{clampedMs} / {totalMs} ms</span>
        </div>
      </div>

      {visual.scenarios.length > 1 && (
        <div className="lab-pill-row" role="tablist" aria-label="Concurrency scenarios">
          {visual.scenarios.map((sc, i) => {
            const selected = i === scenarioIdx;
            return (
              <button
                key={sc.label}
                id={`${tabBaseId}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${tabBaseId}-panel`}
                tabIndex={selected ? 0 : -1}
                className={`lab-pill-btn ${selected ? "is-active" : ""}`}
                onClick={() => {
                  setPlaying(false);
                  setScenarioIdx(i);
                  setPlayheadMs(sc.totalMs);
                }}
                onKeyDown={(e) =>
                  handleTabKeyDown(e, i, visual.scenarios.length, (next) => {
                    setPlaying(false);
                    setScenarioIdx(next);
                    setPlayheadMs(visual.scenarios[next]?.totalMs ?? totalMs);
                  })
                }
              >
                {sc.label}
              </button>
            );
          })}
        </div>
      )}

      <div
        id={`${tabBaseId}-panel`}
        role="tabpanel"
        aria-labelledby={visual.scenarios.length > 1 ? `${tabBaseId}-tab-${scenarioIdx}` : undefined}
        className="lab-panel-body"
      >
        <div className="async-scrubber-bar">
          <button
            type="button"
            className={`btn btn-sm ${playing ? "btn-primary" : "btn-secondary"}`}
            onClick={() => {
              if (!playing && clampedMs >= totalMs) setPlayheadMs(0);
              setPlaying((p) => !p);
            }}
          >
            <Icon name={playing ? "pause" : "play"} size={13} />
            <span>{playing ? "Pause" : "Replay"}</span>
          </button>
          <input
            type="range"
            min={0}
            max={totalMs}
            step={Math.max(1, Math.round(totalMs / 100))}
            value={clampedMs}
            aria-label="Timeline playhead in milliseconds"
            className="async-range-input"
            onChange={(e) => {
              setPlaying(false);
              setPlayheadMs(Number(e.target.value));
            }}
          />
        </div>

        <div className="async-lanes-scroll">
          <div className="async-lanes">
          {scenario.lanes.map((lane) => (
            <div key={lane.name} className="async-lane-row">
              <span className="async-lane-name"><code>{lane.name}</code></span>
              <div className="async-lane-track">
                {lane.segments.map((seg, sIdx) => {
                  const leftPct = (seg.startMs / totalMs) * 100;
                  const fullSpanMs = Math.max(0, seg.endMs - seg.startMs);
                  const visibleEnd = Math.min(seg.endMs, clampedMs);
                  const visibleSpanMs = Math.max(0, visibleEnd - seg.startMs);
                  const widthPct = (visibleSpanMs / totalMs) * 100;
                  const maxWidthPct = (fullSpanMs / totalMs) * 100;
                  const isActiveNow = clampedMs > seg.startMs && clampedMs <= seg.endMs;
                  return (
                    <div
                      key={`${lane.name}-${sIdx}`}
                      className={`async-seg-shell state-${seg.state} ${isActiveNow ? "is-live" : ""}`}
                      style={{ left: `${leftPct}%`, width: `${maxWidthPct}%` }}
                      title={`${seg.label} (${seg.startMs}–${seg.endMs} ms)`}
                    >
                      <div
                        className={`async-seg-fill state-${seg.state}`}
                        style={{
                          transform: `scaleX(${fullSpanMs > 0 ? widthPct / maxWidthPct : 0})`,
                        }}
                      />
                      <span className="async-seg-label">{seg.label}</span>
                    </div>
                  );
                })}
                <div
                  className="async-playhead-line"
                  style={{ transform: `translateX(${(clampedMs / totalMs) * 100}%)` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
          </div>
        </div>

        <div className="async-legend">
          <span><i className="async-dot state-running" /> Running CPU</span>
          <span><i className="async-dot state-waiting" /> Awaiting I/O</span>
          <span><i className="async-dot state-blocked" /> Blocked / Contention</span>
          <span><i className="async-dot state-cancelled" /> Timed out / Cancelled</span>
        </div>

        <p className="lab-note">{renderInlineRich(scenario.summary)}</p>
      </div>
      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}

export function RegexLab({ visual }: { visual: RegexLabVisual }) {
  const tabBaseId = useId();
  const [idx, setIdx] = useState(0);
  const preset = visual.presets[Math.min(idx, Math.max(0, visual.presets.length - 1))];

  if (!preset) return null;

  const sortedMatches = [...preset.matches].sort((a, b) => a.start - b.start);
  const segments: ReactNode[] = [];
  let cursor = 0;
  sortedMatches.forEach((m, mIdx) => {
    const start = Math.max(cursor, Math.min(m.start, preset.text.length));
    const end = Math.max(start, Math.min(m.end, preset.text.length));
    if (start > cursor) {
      segments.push(<span key={`plain-${mIdx}`}>{preset.text.slice(cursor, start)}</span>);
    }
    if (end > start) {
      segments.push(
        <mark key={`hit-${mIdx}`} className="regex-match-span">
          {preset.text.slice(start, end)}
        </mark>,
      );
    }
    cursor = end;
  });
  if (cursor < preset.text.length) {
    segments.push(<span key="tail">{preset.text.slice(cursor)}</span>);
  }

  const allGroups = sortedMatches.flatMap((m, mIdx) =>
    Object.entries(m.groups ?? {}).map(([k, v]) => ({ key: `${mIdx}-${k}`, name: k, value: v })),
  );

  return (
    <div className="interactive-lab regex-lab">
      <div className="lab-header">
        <span className="lab-title">Regex match inspector</span>
        <code className="lab-freq-tag">re.{preset.mode}</code>
      </div>

      <div className="lab-pill-row" role="tablist" aria-label="Regex presets">
        {visual.presets.map((p, i) => {
          const selected = i === idx;
          return (
            <button
              key={p.label}
              id={`${tabBaseId}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${tabBaseId}-panel`}
              tabIndex={selected ? 0 : -1}
              className={`lab-pill-btn ${selected ? "is-active" : ""}`}
              onClick={() => setIdx(i)}
              onKeyDown={(e) => handleTabKeyDown(e, i, visual.presets.length, setIdx)}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${tabBaseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${tabBaseId}-tab-${idx}`}
        className="lab-panel-body"
      >
        <div className="regex-pattern-bar">
          <span>Pattern</span>
          <code>{`r"${preset.pattern.replace(/"/g, '\\"')}"`}</code>
          {preset.replacement !== undefined && (
            <>
              <span>→ Replace</span>
              <code>{JSON.stringify(preset.replacement)}</code>
            </>
          )}
        </div>

        <div className="regex-text-stage">
          <span className="regex-stage-label">Input string ({sortedMatches.length} {sortedMatches.length === 1 ? "match" : "matches"})</span>
          <pre className="regex-highlight-pre"><code>{segments}</code></pre>
        </div>

        {allGroups.length > 0 && (
          <div className="state-strip">
            <span className="state-strip-title">Captured groups</span>
            <div className="state-chips">
              {allGroups.map((g) => (
                <span key={g.key} className="state-chip is-changed">
                  <code>{g.name}</code> = <strong>{JSON.stringify(g.value)}</strong>
                </span>
              ))}
            </div>
          </div>
        )}

        <OutputStrip title={`re.${preset.mode} result`} output={preset.resultText} />
        <p className="lab-note">{renderInlineRich(preset.note)}</p>
      </div>
      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}
