import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styles from "./HeadingContent.module.scss";
import {
  setPendingFiles,
  setPendingSeed,
} from "../../../services/heroChatHandoff";

const SEED_PROMPTS = [
  { emoji: "🇯🇵", label: "10-day Japan trip" },
  { emoji: "💍", label: "Santorini or Amalfi" },
  { emoji: "🏰", label: "Europe in summer" },
  { emoji: "🌌", label: "Northern Lights" },
  { emoji: "✨", label: "Surprise me" },
];

const getSpeechRecognition = () => {
  if (typeof window === "undefined") return null;
  return (
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    null
  );
};

const HeadingContent = ({ title, subtitle }) => {
  const router = useRouter();
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);

  useEffect(() => {
    setMicSupported(!!getSpeechRecognition());
  }, []);

  useEffect(() => {
    return () => {
      // Tear down any active recognition session on unmount
      try {
        recognitionRef.current?.stop?.();
      } catch {
        /* noop */
      }
    };
  }, []);

  const goToChat = (seed, files) => {
    if (files && files.length) setPendingFiles(files);
    if (seed) setPendingSeed(seed);
    const url = seed ? `/chat?seed=${encodeURIComponent(seed)}` : "/chat";
    router.push(url);
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const seed = (value || "").trim();
    if (!seed && attachments.length === 0) return;
    goToChat(seed, attachments);
  };

  const seedFromPrompt = (label) => {
    setValue(label);
    inputRef.current?.focus();
  };

  const autoGrow = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const handleFilePick = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setAttachments((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeAttachment = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const startMic = () => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) return;
    if (isListening) {
      recognitionRef.current?.stop?.();
      return;
    }
    const rec = new Ctor();
    rec.lang = "en-IN";
    rec.interimResults = true;
    rec.continuous = false;
    let interim = "";

    rec.onresult = (event) => {
      interim = "";
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interim += transcript;
      }
      setValue((prev) => {
        const base = (prev || "").replace(/\s*$/, "");
        const merged = `${base}${base ? " " : ""}${finalText || interim}`.trim();
        return merged;
      });
      requestAnimationFrame(() => autoGrow(inputRef.current));
    };

    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    try {
      rec.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className={styles.headingContent}>
      <div className={styles.kicker}>
        <span className={styles.kickerDot}></span>
        Kaira is online · replies in ~2s
      </div>

      <h1 className={styles.title}>
        {title || (
          <>
            Your next trip is{" "}
            <span className="ttwSerif">one conversation</span> away.
          </>
        )}
      </h1>

      <p className={styles.lede}>
        {subtitle || (
          <>
            Tell Kaira your <b>vibe, budget, dates</b> — she hunts flights and
            stays from across the web, then a{" "}
            <span className="ttwSerif">local human</span> fine-tunes the plan.
            You pay only for what you pick.
          </>
        )}
      </p>

      <form className={styles.inputShell} onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          className={styles.inputArea}
          rows={1}
          placeholder="Try: 10 days Japan, cherry blossoms, under ₹2L per person"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            autoGrow(e.target);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        {attachments.length > 0 && (
          <div className={styles.attachRow}>
            {attachments.map((file, idx) => (
              <span key={`${file.name}-${idx}`} className={styles.attachChip}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
                {file.name}
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  className={styles.attachRemove}
                  onClick={() => removeAttachment(idx)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className={styles.inputFoot}>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={handleFilePick}
          />
          <button
            type="button"
            className={styles.iconBtn}
            title="Attach a document"
            aria-label="Attach a document"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.iconBtn} ${isListening ? styles.iconBtnActive : ""}`}
            title={micSupported ? (isListening ? "Stop dictating" : "Dictate") : "Voice input not supported in this browser"}
            aria-label="Dictate"
            disabled={!micSupported}
            onClick={startMic}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M19 10a7 7 0 0 1-14 0M12 19v3" />
            </svg>
          </button>
          <button type="submit" className={styles.sendBtn} aria-label="Send to Kaira">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </form>

      <div className={styles.prompts}>
        {SEED_PROMPTS.map((p) => (
          <button
            key={p.label}
            type="button"
            className={styles.prompt}
            onClick={() => seedFromPrompt(p.label)}
          >
            <span>{p.emoji}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeadingContent;
