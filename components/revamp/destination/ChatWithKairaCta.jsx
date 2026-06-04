import React from "react";
import styles from "../../../styles/pages/revamp/destination.module.scss";

// Single source of truth for the primary planning CTA used across every
// destination page (continent / country / state / city / theme). Keeps the
// label and the inline chevron identical everywhere.
const ChatWithKairaCta = ({
  label = "Chat with Kaira",
  onClick,
  className = "",
  style,
}) => (
  <button
    type="button"
    className={`${styles.btnPrimary} ${className}`.trim()}
    onClick={onClick}
    style={style}
  >
    {label}
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 10L10 2M10 2H4M10 2V8" />
    </svg>
  </button>
);

export default ChatWithKairaCta;
