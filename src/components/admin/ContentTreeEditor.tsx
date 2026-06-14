"use client";

import type { ReactNode } from "react";

/** Jenerik içerik ağacı editörü — string / sayı / boolean / dizi / nesne render eder.
 *  Hem "Site Metinleri" hem "Anasayfa İçeriği" panelleri bunu kullanır. */

export type Json = string | number | boolean | Json[] | { [k: string]: Json };

export function setByPath(root: Json, path: (string | number)[], value: Json): Json {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const copy = [...root];
    copy[head as number] = setByPath(copy[head as number], rest, value);
    return copy;
  }
  const obj = { ...(root as Record<string, Json>) };
  obj[head as string] = setByPath(obj[head as string], rest, value);
  return obj;
}

function prettyLabel(key: string, labels?: Record<string, string>): string {
  if (labels?.[key]) return labels[key];
  if (/^\d+$/.test(key)) return `#${Number(key) + 1}`;
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

const inputCls =
  "w-full bg-cream-soft border border-cream-line rounded-xl px-3.5 py-2.5 text-xs text-fg focus:border-gold focus:outline-none transition-colors";

function ValueEditor({
  k,
  value,
  path,
  onSet,
  depth,
  labels,
}: {
  k: string;
  value: Json;
  path: (string | number)[];
  onSet: (path: (string | number)[], v: Json) => void;
  depth: number;
  labels?: Record<string, string>;
}) {
  // string
  if (typeof value === "string") {
    return (
      <label className="block">
        <span className="block text-[0.65rem] font-semibold text-fg-muted uppercase tracking-wider mb-1">
          {prettyLabel(k, labels)}
        </span>
        {value.length > 55 ? (
          <textarea
            value={value}
            onChange={(e) => onSet(path, e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
          />
        ) : (
          <input type="text" value={value} onChange={(e) => onSet(path, e.target.value)} className={inputCls} />
        )}
      </label>
    );
  }

  // sayı
  if (typeof value === "number") {
    return (
      <label className="block">
        <span className="block text-[0.65rem] font-semibold text-fg-muted uppercase tracking-wider mb-1">
          {prettyLabel(k, labels)}
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onSet(path, Number(e.target.value))}
          className={`${inputCls} w-28`}
        />
      </label>
    );
  }

  // boolean → şık toggle
  if (typeof value === "boolean") {
    return (
      <label className="flex items-center justify-between gap-3 cursor-pointer rounded-xl border border-cream-line bg-cream-soft/60 px-3.5 py-2.5">
        <span className="text-xs font-semibold text-fg">{prettyLabel(k, labels)}</span>
        <button
          type="button"
          role="switch"
          aria-checked={value}
          onClick={() => onSet(path, !value)}
          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${value ? "bg-gold" : "bg-cream-line"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : ""}`}
          />
        </button>
      </label>
    );
  }

  // dizi / nesne
  const entries: [string, Json][] = Array.isArray(value)
    ? value.map((v, i) => [String(i), v])
    : Object.entries(value as Record<string, Json>);

  return (
    <div className={depth === 0 ? "rounded-2xl border border-cream-line bg-cream-soft/50 p-4" : ""}>
      <p
        className={`font-bold text-fg mb-3 ${
          depth === 0
            ? "text-sm font-[family-name:var(--font-cinzel)] uppercase tracking-[0.1em] text-gold-deep flex items-center gap-2"
            : "text-[0.7rem] uppercase tracking-wider text-fg-muted"
        }`}
      >
        {depth === 0 && <span className="w-1.5 h-1.5 rotate-45 bg-gold" />}
        {prettyLabel(k, labels)}
      </p>
      <div className={depth === 0 ? "space-y-3" : "space-y-3 pl-3 border-l border-gold/20"}>
        {entries.map(([ck, cv]) => (
          <ValueEditor
            key={ck}
            k={ck}
            value={cv}
            path={[...path, Array.isArray(value) ? Number(ck) : ck]}
            onSet={onSet}
            depth={depth + 1}
            labels={labels}
          />
        ))}
      </div>
    </div>
  );
}

export function ContentTreeEditor({
  value,
  onSet,
  labels,
}: {
  value: Record<string, Json>;
  onSet: (path: (string | number)[], v: Json) => void;
  labels?: Record<string, string>;
}): ReactNode {
  return (
    <div className="space-y-5">
      {Object.entries(value).map(([k, v]) => (
        <ValueEditor key={k} k={k} value={v} path={[k]} onSet={onSet} depth={0} labels={labels} />
      ))}
    </div>
  );
}
