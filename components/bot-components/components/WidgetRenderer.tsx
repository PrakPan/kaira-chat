import React, { useState, useContext, createContext } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WidgetNode {
  type: string;
  children?: WidgetNode[];
  key?: string;
  [key: string]: unknown;
}

interface WidgetRendererProps {
  widget: Record<string, unknown>;
  onAction?: (action: { type: string; payload?: Record<string, unknown> }) => void;
}

// ─── Form Context ─────────────────────────────────────────────────────────────

interface FormContextValue {
  values: Record<string, string>;
  setValue: (name: string, value: string) => void;
  submitAction: { type: string; payload?: Record<string, unknown> } | null;
  onAction?: WidgetRendererProps["onAction"];
}

const FormContext = createContext<FormContextValue | null>(null);

function useFormContext() {
  return useContext(FormContext);
}

// ─── Color map ────────────────────────────────────────────────────────────────

const BG_COLORS: Record<string, string> = {
  blue:       "#2563eb",
  green:      "#16a34a",
  red:        "#dc2626",
  yellow:     "#ca8a04",
  orange:     "#ea580c",
  purple:     "#7c3aed",
  pink:       "#db2777",
  gray:       "#9ca3af",
  "alpha-10": "rgba(0,0,0,0.08)",
  "alpha-20": "rgba(0,0,0,0.15)",
  primary:    "#FFD602",
  white:      "#ffffff",
};

function resolveBg(bg: string | undefined): string {
  if (!bg) return "transparent";
  if (BG_COLORS[bg]) return BG_COLORS[bg];
  const base = bg.replace(/-\d+$/, ""); // "blue-500" → "blue"
  return BG_COLORS[base] ?? bg;
}

function resolveGap(gap: number | undefined): number {
  return (gap ?? 0) * 4;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function DotsHorizontalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <circle cx="4"  cy="10" r="1.8" />
      <circle cx="10" cy="10" r="1.8" />
      <circle cx="16" cy="10" r="1.8" />
    </svg>
  );
}

function NotebookPencilIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 7h6M9 11h6M9 15h4" />
      <path d="M15 15l2-2 2 2-2 2-2-2z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Form node ────────────────────────────────────────────────────────────────

function FormNode({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"] }) {
  const children = (node.children ?? []) as WidgetNode[];
  const submitAction = node.onSubmitAction as { type: string; payload?: Record<string, unknown> } | null ?? null;

  // Collect all default values from Input/Select/Textarea children recursively
  function collectDefaults(nodes: WidgetNode[]): Record<string, string> {
    const defaults: Record<string, string> = {};
    for (const n of nodes) {
      if ((n.type === "Input" || n.type === "Textarea") && n.name) {
        defaults[n.name as string] = (n.defaultValue as string) ?? "";
      }
      if (n.type === "Select" && n.name) {
        defaults[n.name as string] = "";
      }
      if (n.children) {
        Object.assign(defaults, collectDefaults(n.children as WidgetNode[]));
      }
    }
    return defaults;
  }

  const [values, setValues] = useState<Record<string, string>>(collectDefaults(children));

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <FormContext.Provider value={{ values, setValue, submitAction, onAction }}>
      <div style={{ width: "100%" }}>
        {children.map((child, i) => (
          <NodeRenderer key={i} node={child} onAction={onAction} />
        ))}
      </div>
    </FormContext.Provider>
  );
}

// ─── Input node ───────────────────────────────────────────────────────────────

function InputNode({ node }: { node: WidgetNode }) {
  const form = useFormContext();
  const name = node.name as string;
  const value = form?.values[name] ?? (node.defaultValue as string) ?? "";

  return (
    <input
      type={(node.inputType as string) ?? "text"}
      placeholder={node.placeholder as string}
      value={value}
      required={node.required as boolean}
      pattern={node.pattern as string | undefined}
      onChange={(e) => form?.setValue(name, e.target.value)}
      style={{
        width: "100%",
        padding: "8px 12px",
        borderRadius: 8,
        border: "1.5px solid #e5e7eb",
        fontSize: 13,
        fontFamily: "'Inter', sans-serif",
        color: "#111827",
        background: "#fff",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.15s",
      }}
      onFocus={(e) => { e.target.style.borderColor = "#f59e0b"; }}
      onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }}
    />
  );
}

// ─── Select node ─────────────────────────────────────────────────────────────

function SelectNode({ node }: { node: WidgetNode }) {
  const form = useFormContext();
  const name = node.name as string;
  const value = form?.values[name] ?? "";
  const options = (node.options ?? []) as { label: string; value: string }[];
  const clearable = node.clearable as boolean | undefined;

  return (
    <select
      value={value}
      onChange={(e) => form?.setValue(name, e.target.value)}
      style={{
        width: "100%",
        padding: "8px 12px",
        borderRadius: 8,
        border: "1.5px solid #e5e7eb",
        fontSize: 13,
        fontFamily: "'Inter', sans-serif",
        color: value ? "#111827" : "#9ca3af",
        background: "#fff",
        outline: "none",
        boxSizing: "border-box",
        appearance: "none",
        cursor: "pointer",
        transition: "border-color 0.15s",
      }}
      onFocus={(e) => { e.target.style.borderColor = "#f59e0b"; }}
      onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }}
    >
      {(clearable || !value) && (
        <option value="">{node.placeholder as string ?? "Select…"}</option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

// ─── Textarea node ────────────────────────────────────────────────────────────

function TextareaNode({ node }: { node: WidgetNode }) {
  const form = useFormContext();
  const name = node.name as string;
  const value = form?.values[name] ?? "";

  return (
    <textarea
      placeholder={node.placeholder as string}
      value={value}
      rows={(node.rows as number) ?? 3}
      onChange={(e) => form?.setValue(name, e.target.value)}
      style={{
        width: "100%",
        padding: "8px 12px",
        borderRadius: 8,
        border: "1.5px solid #e5e7eb",
        fontSize: 13,
        fontFamily: "'Inter', sans-serif",
        color: "#111827",
        background: "#fff",
        outline: "none",
        boxSizing: "border-box",
        resize: "vertical",
        transition: "border-color 0.15s",
      }}
      onFocus={(e) => { e.target.style.borderColor = "#f59e0b"; }}
      onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }}
    />
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

function ButtonNode({
  node,
  onAction,
}: {
  node: WidgetNode;
  onAction?: WidgetRendererProps["onAction"];
}) {
  const form = useFormContext();
  const {
    label, iconStart, variant = "solid",
    color = "default", pill, onClickAction, submit,
  } = node;
  console.log("Rendering button with props:", { label, iconStart, variant, color, pill, onClickAction, submit });

  const handleClick = () => {
    // Form submit button — serialize form values as comma-separated string
    if (submit && form?.submitAction) {
      const csv = Object.entries(form.values)
        .map(([k, v]) => `${k}=${v}`)
        .join(", ");
      form.onAction?.({
        type: form.submitAction.type,
        payload: {
          ...form.submitAction.payload,
          formData: csv,
        },
      });
      return;
    }
    // Regular action button
    if (onClickAction) {
      onAction?.(onClickAction as { type: string; payload?: Record<string, unknown> });
    }
  };

  // ── ··· reorder handle ──
  if (iconStart === "dots-horizontal") {
    return (
      <button onClick={handleClick} style={{
        width: 36, height: 36, borderRadius: "50%",
        border: "1.5px solid #d1d5db",
         background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#6b7280", cursor: "pointer", flexShrink: 0, outline: "none",
      }}>
        <DotsHorizontalIcon />
      </button>
    );
  }

  // ── notebook-pencil edit ──
  if (iconStart === "notebook-pencil") {
    return (
      <button onClick={handleClick} style={{
        width: 36, height: 36, borderRadius: 8,
        border: "none", background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#374151", cursor: "pointer", outline: "none",
      }}>
        <NotebookPencilIcon />
      </button>
    );
  }

  // ── check-circle submit ──
  if (iconStart === "check-circle" || submit) {
    return (
      <button onClick={handleClick} style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "10px 20px",
        borderRadius: pill ? "9999px" : 10,
        border: "none",
        background: "#111827",
        color: "#fff",
        fontSize: 14, fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        cursor: "pointer", outline: "none",
      }}>
        {iconStart === "check-circle" && <CheckCircleIcon />}
        {label as string}
      </button>
    );
  }

  // ── Danger outline ──
  if (color === "danger" && variant === "outline") {
    return <></>;
  }

  // ── Primary solid ──
  if (color === "primary") {
  return (
    <button
      onClick={handleClick}
      style={{
        padding: "12px 20px",
        borderRadius: "8px",
        borderWidth: "2px",
        border: variant === "outline" ? "2px solid #111" : "none",
        background: variant === "solid" ? "#f8e000" : "transparent",
        backgroundColor: variant === "solid" ? "#f8e000" : "transparent",
        color: "#111",
        fontSize: "0.85rem",
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        cursor: "pointer",
        outline: "none",
      }}
    >
      {label as string}
    </button>
  );
}

  // ── Generic fallback ──
  return (
     <button
      onClick={handleClick}
      style={{
        padding: "12px 20px",
        borderRadius: "8px",
        borderWidth: "2px",
        border: variant === "outline" ? "2px solid #111" : "none",
        background: variant === "solid" ? "#f8e000" : "transparent",
        backgroundColor: variant === "solid" ? "#f8e000" : "transparent",
        color: "#111",
        fontSize: "0.85rem",
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        cursor: "pointer",
        outline: "none",
      }}
    >
      {label as string}
    </button>
  );
}


function BoxNode({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"] }) {
  const { size, width, height, background, radius, children, align, justify } = node;

  const pxWidth  = width != null ? `${width as number}px` : size != null ? `${size as number}px` : undefined;
  const pxHeight = height != null
    ? (typeof height === "string" ? height : `${height as number}px`)
    : size != null ? `${size as number}px` : undefined;

  const borderRadius =
    radius === "full" ? "9999px" : radius === "sm" ? "4px" :
    radius === "md"   ? "8px"   : radius === "lg"  ? "14px" : "6px";

  const hasChildren = Array.isArray(children) && (children as WidgetNode[]).length > 0;

  return (
    <div style={{
      width: pxWidth, height: pxHeight, minWidth: pxWidth,
      background: resolveBg(background as string | undefined),
      borderRadius, flexShrink: 0,
      display: "flex",
      alignItems: ALIGN_MAP[align as string] ?? "center",
      justifyContent: JUSTIFY_MAP[justify as string] ?? "center",
    }}>
      {hasChildren && (children as WidgetNode[]).map((child, i) => (
        <NodeRenderer key={i} node={child} onAction={onAction} />
      ))}
    </div>
  );
}

// ─── Text nodes ───────────────────────────────────────────────────────────────

function TextNode({ node }: { node: WidgetNode }) {
  const { value, size = "md", weight = "normal", type } = node;
  const fsMap: Record<string, number> = { xs: 11, sm: 13, md: 14, lg: 16, xl: 19 };
  const fwMap: Record<string, number> = { normal: 400, medium: 500, semibold: 600, bold: 700 };
  return (
    <span style={{
      fontSize: fsMap[size as string] ?? 14,
      fontWeight: fwMap[weight as string] ?? 400,
      color: type === "Caption" ? "#9ca3af" : "#111827",
      fontFamily: "'Inter', sans-serif",
      lineHeight: 1.4,
    }}>
      {value as string}
    </span>
  );
}

function LabelNode({ node }: { node: WidgetNode }) {
  return (
    <label
      htmlFor={node.fieldName as string | undefined}
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: "#6b7280",
        fontFamily: "'Inter', sans-serif",
        display: "block",
      }}
    >
      {node.value as string}
    </label>
  );
}

// ─── Spacer ───────────────────────────────────────────────────────────────────

function SpacerNode() {
  return <div style={{ flex: 1 }} />;
}

// ─── Row ──────────────────────────────────────────────────────────────────────

const ALIGN_MAP: Record<string, string> = {
  start: "flex-start", center: "center", end: "flex-end", stretch: "stretch",
};
const JUSTIFY_MAP: Record<string, string> = {
  start: "flex-start", center: "center", end: "flex-end",
  between: "space-between", around: "space-around",
};

function RowNode({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"] }) {
  const { children = [], gap, align, justify } = node;
  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      gap: resolveGap(gap as number | undefined),
      alignItems: ALIGN_MAP[align as string] ?? "center", // ← center by default
      justifyContent: JUSTIFY_MAP[justify as string] ?? "flex-start",
      width: "auto", // ← don't force 100%
    }}>
      {(children as WidgetNode[]).map((child, i) => (
        <NodeRenderer key={i} node={child} onAction={onAction} />
      ))}
    </div>
  );
}
// ─── Col ──────────────────────────────────────────────────────────────────────
function ColNode({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"] }) {
  const { children = [], gap, align, width } = node;
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      gap: gap != null ? `${gap as number}px` : 0,       // raw px
      alignItems: ALIGN_MAP[align as string] ?? "flex-start",
      width: width != null ? `${width as number}px` : "auto", // raw px
      flexShrink: 0,
    }}>
      {(children as WidgetNode[]).map((child, i) => (
        <NodeRenderer key={i} node={child} onAction={onAction} />
      ))}
    </div>
  );
}

function IconNode({ node }: { node: WidgetNode }) {
  const colorMap: Record<string, string> = { secondary: "#9ca3af", primary: "#111827" };
  const color = colorMap[node.color as string] ?? "#9ca3af";
  if (node.name === "dots-horizontal") {
    return <span style={{ color, display: "flex" }}><DotsHorizontalIcon /></span>;
  }
  return null;
}

function ListViewItemNode({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"]; isLast?: boolean }) {
  const children = (node.children ?? []) as WidgetNode[];
  return (
    <div style={{
      display: "flex", flexDirection: "row", alignItems: "center",
      gap: node.gap != null ? `${(node.gap as number) * 4}px` : "8px", // gap={3} → 12px
      padding: "2px 0",
    }}>
      {children.map((child, i) => (
        <NodeRenderer key={i} node={child} onAction={onAction} />
      ))}
    </div>
  );
}

function ListViewNode({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"] }) {
  const children = (node.children ?? []) as WidgetNode[];
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      {children.map((item, idx) => (
        <ListViewItemNode key={(item.key as string) ?? idx} node={item} onAction={onAction} />
      ))}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function CardNode({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"] }) {
  const children = (node.children ?? []) as WidgetNode[];
  const size = node.size as string | undefined;
  const customPadding = node.padding as number | undefined;
  const padding = customPadding
    ? customPadding * 4
    : size === "sm" ? 12 : size === "lg" ? 20 : 16;

  return (
    <div style={{
      padding,
      width: "100%",
      marginTop: 10,
      // background: "#fafafa",
      // borderRadius: 14,
      // border: "1px solid #f0f0f0",
      boxSizing: "border-box",
    }}>
      {children.map((child, i) => (
        <NodeRenderer key={i} node={child} onAction={onAction} />
      ))}
    </div>
  );
}

// ─── Node dispatcher ─────────────────────────────────────────────────────────

function NodeRenderer({
  node, onAction,
}: {
  node: WidgetNode;
  onAction?: WidgetRendererProps["onAction"];
}) {
  switch (node.type) {
    case "Card":         return <CardNode node={node} onAction={onAction} />;
    case "Form":         return <FormNode node={node} onAction={onAction} />;
    case "ListView":     return <ListViewNode node={node} onAction={onAction} />;
    case "ListViewItem": return <ListViewItemNode node={node} onAction={onAction} isLast />;
    case "Row":          return <RowNode node={node} onAction={onAction} />;
    case "Col":          return <ColNode node={node} onAction={onAction} />;
    case "Box":          return <BoxNode node={node} />;
    case "Button":       return <ButtonNode node={node} onAction={onAction} />;
    case "Input":        return <InputNode node={node} />;
    case "Select":       return <SelectNode node={node} />;
    case "Textarea":     return <TextareaNode node={node} />;
    case "Label":        return <LabelNode node={node} />;
    case "Text":
    case "Title":
    case "Caption":      return <TextNode node={node} />;
    case "Spacer":       return <SpacerNode />;
    case "Divider":
      return <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "4px 0" }} />;
    case "Icon": return <IconNode node={node} />;
    default:
      return (
        <pre style={{
          fontSize: 10, color: "#9ca3af", background: "#f9fafb",
          borderRadius: 6, padding: 6, overflow: "auto",
        }}>
          {JSON.stringify(node, null, 2)}
        </pre>
      );
  }
}

// ─── Public export ────────────────────────────────────────────────────────────

export function WidgetRenderer({ widget, onAction }: WidgetRendererProps) {
  return (
    <div style={{ width: "fit-content", maxWidth: 320, paddingBottom: 4 }}>
      <NodeRenderer node={widget as WidgetNode} onAction={onAction} />
    </div>
  );
}