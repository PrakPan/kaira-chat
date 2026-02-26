import React, { useMemo } from "react";
import type { Message, ProgressStep } from "../../hooks/useChat";
import { WidgetRenderer } from "../WidgetRenderer";
import { CHATKIT_API_URL } from "../../lib/chatkitConfig";

interface MessageBubbleProps {
  message: Message;
  onWidgetAction?: (action: { type: string; payload?: Record<string, unknown> }) => void;
}

// Lightweight markdown-to-JSX renderer (no external deps)
function renderContent(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Bullet list
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
        </ul>
      );
      continue;
    }

    // Ordered list
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
        </ol>
      );
      continue;
    }

    // Heading
    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^(#+)/)?.[1].length ?? 1;
      const content = line.replace(/^#+\s/, "");
      const Tag = `h${Math.min(level, 3)}` as "h1" | "h2" | "h3";
      nodes.push(
        <Tag key={`h-${i}`}>{inlineFormat(content)}</Tag>
      );
      i++;
      continue;
    }

    // Blockquote
    if (/^>\s/.test(line)) {
      const content = line.replace(/^>\s/, "");
      nodes.push(
        <blockquote key={`bq-${i}`}>{inlineFormat(content)}</blockquote>
      );
      i++;
      continue;
    }

    // Empty line -> spacer
    if (line.trim() === "") {
      nodes.push(<div key={`sp-${i}`} style={{ height: 6 }} />);
      i++;
      continue;
    }

    // Regular paragraph
    nodes.push(
      <p key={`p-${i}`}>{inlineFormat(line)}</p>
    );
    i++;
  }

  return nodes;
}

function inlineFormat(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer">
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onWidgetAction }) => {
  const rendered = useMemo(() => renderContent(message.content), [message.content]);
  const isUser = message.role === "user";

  // Add above the existing return in the assistant branch:
const ProgressLoader: React.FC<{ steps: ProgressStep[] }> = ({ steps }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "8px 0" }}>
    {steps.map((step, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, 
        fontFamily: "'Inter', sans-serif", fontSize: 13, color: step.done ? "#9ca3af" : "#374151" }}>
        {step.done ? (
          <svg width="14" height="14" viewBox="0 0 20 20" fill="#10b981">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="animate-spin" style={{color:"#6b7280"}}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/>
          </svg>
        )}
        <span>{step.text}</span>
      </div>
    ))}
  </div>
);

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
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <div
          style={{
            maxWidth: "85%",
            background: "#fffaf5",
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

  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, maxWidth: "98%" }}>
        {/* Bot message wrapped in chatWrapper for scoped CSS styles */}
        <div className="chatWrapper" style={{ padding: "10px 16px", color: "#374151", minWidth: 0 }}>
         {(message.progressSteps?.length ?? 0) > 0 && (
  <ProgressLoader steps={message.progressSteps!} />
)}
{message.content || message.isStreaming ? (
  <>
    {rendered}
    {message.isStreaming && !message.content && <ThinkingDots />}
  </>
) : (!message.progressSteps?.length && <ThinkingDots />)}
        </div>
      </div>
    </div>
  );
};

// Uses .typingIndicator + .thinking + .typingDots from injected chatbot CSS
export const ThinkingDots: React.FC = () => (
  <div className="typingIndicator" style={{ marginTop: 4 }}>
    <span className="thinking">
      
      <span className="typingDots">
        <span />
        <span />
        <span />
      </span>
    </span>
  </div>
);