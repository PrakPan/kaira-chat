import React, { useMemo, useState } from "react";
import type { Message, ProgressStep, ThinkingTask } from "../../hooks/useChat";
import { WidgetRenderer } from "../WidgetRenderer";

interface MessageBubbleProps {
  message: Message;
  entities?: Record<string, { name: string; type: string }>;
  onWidgetAction?: (action: {
    type: string;
    payload?: Record<string, unknown>;
  }) => void;
}

// ─── Markdown renderer ────────────────────────────────────────────────────────

function renderContent(
  text: string,
  entities: Record<string, { name: string; type: string }> = {},
): React.ReactNode[] {
  const resolved = resolveEntityTokens(text, entities);
  const nodes: React.ReactNode[] = [];
  const lines = resolved.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^[\-\*•]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[\-\*•]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[\-\*•]\s/, ""));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`}>
          {items.map((item, idx) => (
            <li key={idx}>
              <span>{inlineFormat(item)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`}>
          {items.map((item, idx) => (
            <li key={idx}>{inlineFormat(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^(#+)/)?.[1].length ?? 1;
      const content = line.replace(/^#+\s/, "");
      const Tag = `h${Math.min(level, 3)}` as "h1" | "h2" | "h3";
      nodes.push(<Tag key={`h-${i}`}>{inlineFormat(content)}</Tag>);
      i++;
      continue;
    }

    if (/^>\s/.test(line)) {
      const content = line.replace(/^>\s/, "");
      nodes.push(
        <blockquote key={`bq-${i}`}>{inlineFormat(content)}</blockquote>,
      );
      i++;
      continue;
    }

    if (line.trim() === "") {
      nodes.push(<div key={`sp-${i}`} style={{ height: 6 }} />);
      i++;
      continue;
    }

    nodes.push(<p key={`p-${i}`}>{inlineFormat(line)}</p>);
    i++;
  }

  return nodes;
}

function inlineFormat(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i}>{part.slice(1, -1)}</code>;
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch)
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkMatch[1]}
        </a>
      );
    return part;
  });
}

function resolveEntityTokens(
  text: string,
  entities: Record<string, { name: string; type: string }>,
): string {
  return text.replace(/\[\[(\w+):([^\]]+)\]\]/g, (_, _type, id) => {
    const entity = entities[id];
    return entity ? `**${entity.name}**` : id;
  });
}

// ─── ProgressLoader ───────────────────────────────────────────────────────────

const ProgressLoader: React.FC<{ steps: ProgressStep[] }> = ({ steps }) => {
  const [expanded, setExpanded] = useState(false);
  const allDone = steps.length > 0 && steps.every((s) => s.done);
  const latest = steps[steps.length - 1];
  if (!latest) return null;

  // ── In-progress: bordered card with bulb + current message ──
  if (!allDone) {
    return (
      <div
        style={{
          marginBottom: 12,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          padding: "10px 14px 12px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 8,
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V17a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2.8C7.21 13.16 6 11.22 6 9a6 6 0 0 1 6-6z" />
          </svg>
          <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>
            Thinking
          </span>
          <svg width="12" height="12" viewBox="0 0 20 20" fill="#9ca3af">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div
          key={latest.text}
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#374151",
            paddingLeft: 2,
            animation: "thinkFadeIn 0.15s ease-out",
          }}
        >
          {latest.text}
        </div>

        <style>{`
          @keyframes thinkFadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ── Done: no card, collapsible toggle ──
  return (
    <div style={{ marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginBottom: expanded ? 12 : 0,
        }}
      >
        <span style={{ fontSize: 14, color: "#374151", fontWeight: 400 }}>
          Searched {steps.length} {steps.length === 1 ? "query" : "queries"}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="#9ca3af"
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {expanded && (
        <div style={{ paddingLeft: 2 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 20,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "1.5px solid #d1d5db",
                    background: "#fff",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      flex: 1,
                      background: "#e5e7eb",
                      minHeight: 16,
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#9ca3af",
                  paddingLeft: 10,
                  paddingBottom: i < steps.length - 1 ? 12 : 0,
                  lineHeight: "20px",
                }}
              >
                {step.text}
              </div>
            </div>
          ))}

          <div style={{ display: "flex", alignItems: "center", marginTop: 7 }}>
            <div
              style={{ width: 20, display: "flex", justifyContent: "center" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="10" />
                <path
                  d="M9 12l2 2 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span style={{ fontSize: 14, color: "#9ca3af", paddingLeft: 10 }}>
              Done
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ThinkingBlock ────────────────────────────────────────────────────────────
// Driven by workflow thought tasks from the SSE stream.
// While tasks are streaming in (not all done) → open, animated.
// Once workflow.item.done fires (all tasks marked done) AND content starts → collapses to a toggleable pill.

// ─── ThinkingBlock ────────────────────────────────────────────────────────────
// Matches ChatKit design:
// • While thinking: rounded border card, lightbulb icon, "Thinking >" header,
//   shows only the LATEST (current) task below in bold — single message at a time
// • When done: no card border, "Thought for Xs ∨" header (toggleable),
//   full task list with circle icons + vertical connector lines, "Done" at bottom

const ThinkingBlock: React.FC<{
  tasks: ThinkingTask[];
  isStreaming: boolean;
}> = ({ tasks, isStreaming }) => {
  const allDone = tasks.length > 0 && tasks.every((t) => t.done);
  const isThinking = !allDone || isStreaming;
  const [expanded, setExpanded] = useState(false);

  // Timer: count seconds while thinking
  const [seconds, setSeconds] = useState(0);
  const finalSeconds = React.useRef<number>(0);
  React.useEffect(() => {
    if (!isThinking) {
      finalSeconds.current = seconds;
      return;
    }
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isThinking]);

  const cleanContent = (text: string) => text.replace(/\*\*/g, "");

  // Current active task (last non-done, or last task while streaming)
  const currentTask = isThinking
    ? ([...tasks].reverse().find((t) => !t.done) ?? tasks[tasks.length - 1])
    : null;

  // ── Thinking state: bordered card ──────────────────────────────────────────
  if (isThinking) {
    return (
      <div
        style={{
          marginBottom: 12,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          padding: "10px 14px 12px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 8,
          }}
        >
          {/* Lightbulb icon */}
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V17a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2.8C7.21 13.16 6 11.22 6 9a6 6 0 0 1 6-6z" />
          </svg>
          <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>
            Thinking
          </span>
          {/* Right chevron */}
          <svg width="12" height="12" viewBox="0 0 20 20" fill="#9ca3af">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Current single task — bold, animated fade */}
        {currentTask && (
          <div
            key={currentTask.content}
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              paddingLeft: 2,
              animation: "thinkFadeIn 0.15s ease-out",
            }}
          >
            {cleanContent(currentTask.content)}
          </div>
        )}

        <style>{`
          @keyframes thinkFadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ── Done state: no card, toggle list ───────────────────────────────────────
  const displaySeconds = finalSeconds.current || seconds;

  return (
    <div
      style={{
        marginBottom: 12,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header — clickable */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginBottom: expanded ? 12 : 0,
        }}
      >
        <span style={{ fontSize: 14, color: "#374151", fontWeight: 400 }}>
          Thought for {displaySeconds}s
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="#9ca3af"
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Expanded task list */}
      {expanded && (
        <div style={{ paddingLeft: 2 }}>
          {tasks.map((task, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "flex-start", gap: 0 }}
            >
              {/* Icon + vertical line column */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 20,
                  flexShrink: 0,
                }}
              >
                {/* Circle icon */}
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "1.5px solid #d1d5db",
                    background: "#fff",
                    flexShrink: 0,
                    marginTop: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                {/* Vertical connector (not after last item) */}
                {i < tasks.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      flex: 1,
                      background: "#e5e7eb",
                      minHeight: 16,
                    }}
                  />
                )}
              </div>

              {/* Task text */}
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#9ca3af",
                  paddingLeft: 10,
                  paddingBottom: i < tasks.length - 1 ? 12 : 0,
                  lineHeight: "20px",
                }}
              >
                {cleanContent(task.content)}
              </div>
            </div>
          ))}

          {/* Done row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              marginTop: "7px",
            }}
          >
            <div
              style={{ width: 20, display: "flex", justifyContent: "center" }}
            >
              {/* Circled checkmark */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="10" />
                <path
                  d="M9 12l2 2 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: 14,
                color: "#9ca3af",
                paddingLeft: 10,
                fontWeight: 400,
              }}
            >
              Done
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MessageBubble ────────────────────────────────────────────────────────────

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onWidgetAction,
  entities = {},
}) => {
  const rendered = useMemo(
    () => renderContent(message.content, entities ?? {}),
    [message.content, entities],
  );
  const isUser = message.role === "user";

  if (message.type === "widget" && message.widgetItem) {
    return (
      <WidgetRenderer
        widget={message.widgetItem.widget}
        onAction={onWidgetAction}
      />
    );
  }

  if (isUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            maxWidth: "85%",
            background: "#f8fafc",
            color: "#0d0d0d",
            padding: "10px 16px",
            borderRadius: 12,
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            lineHeight: "24px",
            fontWeight: 400,
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  // ── Derive display state ──────────────────────────────────────────────────
  const hasProgress = (message.progressSteps?.length ?? 0) > 0;
  const hasTasks = (message.thinkingTasks?.length ?? 0) > 0;
  const hasContent = !!message.content;
  const streaming = !!message.isStreaming;
  const allTasksDone = hasTasks && message.thinkingTasks!.every((t) => t.done);

  // Show thinking block if we have tasks (whether streaming or done)
  const showThinking = hasTasks;
  // Show dots only when truly nothing else: no progress, no tasks, no content
  const showDots = !hasProgress && !hasTasks && !hasContent && streaming;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          width: "98%",
        }}
      >
        <div
          className="chatWrapper"
          style={{ padding: "10px 16px", color: "#374151", minWidth: "98%" }}
        >
          {/* Progress steps (e.g. from progress_update events) */}
          {hasProgress && <ProgressLoader steps={message.progressSteps!} />}

          {/* Thinking block — shows tasks, collapses to pill once done + content arrives */}
          {showThinking && (
            <ThinkingBlock
              tasks={message.thinkingTasks!}
              // Still "streaming" visually until both workflow done AND content has started
              isStreaming={!allTasksDone || (!hasContent && streaming)}
            />
          )}

          {/* Main response content */}
          {hasContent && (
            <div
              style={{
                willChange: "contents",
                transition: "opacity 0.1s ease",
              }}
            >
              {renderContent(message.content, entities ?? {})}
            </div>
          )}

          {/* Fallback bubble dots */}
          {showDots && <ThinkingDots />}
        </div>
      </div>
    </div>
  );
};

export const ThinkingDots: React.FC = () => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "12px 16px",
      // borderRadius: "18px 18px 18px 4px",
      // background: "#f1f3f4",
      alignSelf: "flex-start",
      marginTop: 4,
    }}
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#111",
          display: "inline-block",
          animation: "thinkPulse 1.4s infinite ease-in-out",
          animationDelay: `${[-0.32, -0.16, 0][i]}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes thinkPulse {
        0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
        40%            { transform: scale(1);   opacity: 1; }
      }
    `}</style>
  </div>
);
