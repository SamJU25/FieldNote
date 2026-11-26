"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "@/components/icon";

function CopyCodeButton({ text, label = "Copy code" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(t);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Fallback ignored if clipboard permission is blocked
    }
  };

  return (
    <button
      type="button"
      className={`code-copy-btn ${copied ? "is-copied" : ""}`}
      aria-label={copied ? "Copied code" : label}
      onClick={handleCopy}
    >
      <Icon name={copied ? "check" : "edit"} size={12} />
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

/** Handle WAI-ARIA tablist keyboard navigation (ArrowLeft/Right/Home/End) and move focus. */
export function handleTabKeyDown(
  e: KeyboardEvent<HTMLButtonElement>,
  currentIndex: number,
  total: number,
  onSelect: (index: number) => void,
) {
  if (total <= 1) return;
  let nextIndex: number | null = null;
  if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % total;
  else if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + total) % total;
  else if (e.key === "Home") nextIndex = 0;
  else if (e.key === "End") nextIndex = total - 1;
  if (nextIndex === null) return;

  e.preventDefault();
  onSelect(nextIndex);
  const parent = e.currentTarget.parentElement;
  const tabs = parent?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
  tabs?.[nextIndex]?.focus();
}

function renderCodeSpan(codeText: string, key: string | number) {
  const shortClass = codeText.length <= 22 ? " is-short" : "";
  return (
    <code key={key} className={`inline-code${shortClass}`}>
      {codeText}
    </code>
  );
}

/** Render inline backtick code spans without full markdown formatting. */
export function renderInlineCode(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, idx) =>
    part.startsWith("`") && part.endsWith("`") && part.length >= 2 ? (
      renderCodeSpan(part.slice(1, -1), idx)
    ) : (
      <span key={idx}>{part}</span>
    ),
  );
}

/** Find a closing markdown delimiter (`**` or `*`) while skipping over inline `` `...` `` spans. */
function findClosingDelimiter(text: string, from: number, delim: "**" | "*"): number {
  let i = from;
  while (i < text.length) {
    if (text[i] === "`") {
      const codeEnd = text.indexOf("`", i + 1);
      if (codeEnd !== -1) {
        i = codeEnd + 1;
        continue;
      }
    }
    if (delim === "**") {
      if (text[i] === "*" && text[i + 1] === "*") return i;
    } else if (text[i] === "*" && text[i + 1] !== "*" && i > from && !/\s/.test(text[i - 1])) {
      return i;
    }
    i += 1;
  }
  return -1;
}

/** Find closing `)` for markdown URL `[label](url)` with balanced inner parentheses. */
function findBalancedUrlEnd(text: string, urlStart: number): number {
  let depth = 1;
  let i = urlStart;
  while (i < text.length) {
    const ch = text[i];
    if (ch === "(") {
      depth += 1;
    } else if (ch === ")") {
      depth -= 1;
      if (depth === 0) return i;
    } else if (/\s/.test(ch)) {
      return -1;
    }
    i += 1;
  }
  return -1;
}

/** Render links, inline code, bold, and italic spans safely across backticks. */
export function renderInlineRich(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let i = 0;
  let buf = "";

  const flushPlain = () => {
    if (buf) {
      nodes.push(<span key={`t-${nodes.length}`}>{buf}</span>);
      buf = "";
    }
  };

  while (i < text.length) {
    if (text[i] === "[") {
      const mid = text.indexOf("](", i + 1);
      if (mid !== -1 && !text.slice(i + 1, mid).includes("]")) {
        const close = findBalancedUrlEnd(text, mid + 2);
        if (close !== -1) {
          const label = text.slice(i + 1, mid);
          const href = text.slice(mid + 2, close);
          if (/^https?:\/\/\S+$/.test(href)) {
            flushPlain();
            nodes.push(
              <a
                key={`a-${nodes.length}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                {renderInlineCode(label)}
              </a>,
            );
            i = close + 1;
            continue;
          }
        }
      }
    }
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        flushPlain();
        nodes.push(renderCodeSpan(text.slice(i + 1, end), `c-${nodes.length}`));
        i = end + 1;
        continue;
      }
    }
    if (text[i] === "*" && text[i + 1] === "*") {
      const end = findClosingDelimiter(text, i + 2, "**");
      if (end !== -1) {
        flushPlain();
        nodes.push(
          <strong key={`b-${nodes.length}`}>{renderInlineCode(text.slice(i + 2, end))}</strong>,
        );
        i = end + 2;
        continue;
      }
    }
    if (text[i] === "*" && text[i + 1] && !/\s/.test(text[i + 1]) && text[i + 1] !== "*") {
      const end = findClosingDelimiter(text, i + 1, "*");
      if (end !== -1) {
        flushPlain();
        nodes.push(
          <em key={`e-${nodes.length}`}>{renderInlineCode(text.slice(i + 1, end))}</em>,
        );
        i = end + 1;
        continue;
      }
    }
    buf += text[i];
    i += 1;
  }
  flushPlain();
  return nodes;
}

/** Render explanation blocks with semantic `<ul>`/`<ol>` lists and paragraphs. */
export function renderParagraphs(blocks: string[]): ReactNode[] {
  const out: ReactNode[] = [];
  blocks.forEach((block, bIdx) => {
    const lines = block.split("\n");
    let idx = 0;
    while (idx < lines.length) {
      const line = lines[idx];
      if (/^-\s+/.test(line)) {
        const items: string[] = [];
        while (idx < lines.length && /^-\s+/.test(lines[idx])) {
          items.push(lines[idx].replace(/^-\s+/, ""));
          idx += 1;
        }
        out.push(
          <ul key={`ul-${bIdx}-${idx}`} className="prose-list">
            {items.map((item, j) => (
              <li key={j}>{renderInlineRich(item)}</li>
            ))}
          </ul>,
        );
        continue;
      }
      if (/^\d+\.\s+/.test(line)) {
        const items: string[] = [];
        while (idx < lines.length && /^\d+\.\s+/.test(lines[idx])) {
          items.push(lines[idx].replace(/^\d+\.\s+/, ""));
          idx += 1;
        }
        out.push(
          <ol key={`ol-${bIdx}-${idx}`} className="prose-list">
            {items.map((item, j) => (
              <li key={j}>{renderInlineRich(item)}</li>
            ))}
          </ol>,
        );
        continue;
      }
      if (line.trim().length > 0) {
        out.push(<p key={`p-${bIdx}-${idx}`}>{renderInlineRich(line)}</p>);
      }
      idx += 1;
    }
  });
  return out;
}

export function LineCodePanel({
  lines,
  activeLines,
  subgoals,
  label = "Python",
  variant = "lesson",
}: {
  lines: string[];
  activeLines?: number[];
  subgoals?: { line: number; label: string }[];
  label?: string;
  variant?: "lesson" | "mini";
}) {
  const preRef = useRef<HTMLPreElement>(null);
  const activeSet = new Set(activeLines ?? []);
  const subgoalMap = new Map((subgoals ?? []).map((sg) => [sg.line, sg.label]));
  const firstActiveLine = activeLines && activeLines.length > 0 ? activeLines[0] : null;
  const activeKey = activeLines?.join(",") ?? "";

  useEffect(() => {
    const pre = preRef.current;
    if (!pre || firstActiveLine === null) return;
    if (pre.scrollHeight <= pre.clientHeight + 4) return;
    const row = pre.querySelector<HTMLElement>(`[data-line="${firstActiveLine}"]`);
    if (!row) return;
    const targetTop = Math.max(0, row.offsetTop - pre.clientHeight / 2 + row.clientHeight / 2);
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    pre.scrollTo({ top: targetTop, behavior: reduced ? "auto" : "smooth" });
  }, [activeKey, firstActiveLine]);

  const pre = (
    <pre ref={preRef} className={variant === "mini" ? "loop-mini-code" : "lesson-code-pre"}>
      <code>
        {lines.map((line, i) => {
          const lineNum = i + 1;
          const isActive = activeSet.has(lineNum);
          const subgoal = subgoalMap.get(lineNum);
          return (
            <div
              key={lineNum}
              data-line={lineNum}
              className={`code-line-row ${isActive ? "is-active" : ""}`}
            >
              <span className="code-line-no">{lineNum}</span>
              <span className="code-line-text">{line || " "}</span>
              {subgoal && <span className="code-subgoal-pill">{subgoal}</span>}
            </div>
          );
        })}
      </code>
    </pre>
  );

  if (variant === "mini") return pre;

  return (
    <div className="lesson-code-card">
      <div className="lesson-code-head">
        <span>{label}</span>
        <div className="lesson-code-head-right">
          {activeLines && activeLines.length > 0 && (
            <span className="code-line-badge">Line {activeLines.join(", ")}</span>
          )}
          <CopyCodeButton text={lines.join("\n")} label={`Copy ${label} snippet`} />
        </div>
      </div>
      {pre}
    </div>
  );
}

export function StateChips({
  items,
  prevItems,
  title,
}: {
  items: { name: string; value: string; changed?: boolean }[];
  prevItems?: { name: string; value: string; changed?: boolean }[];
  title?: string;
}) {
  if (items.length === 0) return null;
  const prevMap = prevItems ? new Map(prevItems.map((it) => [it.name, it.value])) : null;
  const chips = (
    <div className="state-chips">
      {items.map((st) => {
        const diffChanged =
          prevMap !== null &&
          prevMap.size > 0 &&
          (!prevMap.has(st.name) || prevMap.get(st.name) !== st.value);
        const isChanged = Boolean(st.changed || diffChanged);
        return (
          <span key={st.name} className={`state-chip ${isChanged ? "is-changed" : ""}`}>
            <code>{st.name}</code> ={" "}
            <strong key={`${st.name}-${st.value}`} className={isChanged ? "state-val-pop" : undefined}>
              {st.value}
            </strong>
          </span>
        );
      })}
    </div>
  );
  if (!title) return chips;
  return (
    <div className="state-strip">
      <span className="state-strip-title">{title}</span>
      {chips}
    </div>
  );
}

export function OutputStrip({
  title,
  output,
  emptyLabel,
}: {
  title: string;
  output?: string;
  emptyLabel?: string;
}) {
  if (!output && !emptyLabel) return null;
  return (
    <div className={`output-strip ${!output ? "is-empty" : ""}`}>
      <span>{title}</span>
      <pre>{output || emptyLabel}</pre>
    </div>
  );
}
