import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  setPendingFiles,
  setPendingSeed,
} from "../../../services/heroChatHandoff";
import { truncateAtSentence } from "../../../helper/truncateAtSentence";
import styles from "../../../styles/pages/revamp/destination.module.scss";

const FALLBACK_POLAROIDS = [
  {
    image:
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400&q=80",
    caption: "Kyoto, sakura",
  },
  {
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80",
    caption: "Hoi An at 6am",
  },
  {
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80",
    caption: "Bali ricefields",
  },
  {
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80",
    caption: "Angkor sunrise",
  },
];

const getSpeechRecognition = () => {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

const HeroV2 = ({
  destinationLabel,
  kicker,
  title,
  description,
  prompts = [],
  meta,
  polaroids = [],
  setShowTailoredModal,
  inputPlaceholder,
}) => {
  const router = useRouter();
  const textareaRef = useRef(null);
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
      try {
        recognitionRef.current?.stop?.();
      } catch {
        /* noop */
      }
    };
  }, []);

  const autoGrow = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  const goToChat = (seed, files) => {
    if (files && files.length) setPendingFiles(files);
    if (seed) setPendingSeed(seed);
    const url = seed ? `/chat?seed=${encodeURIComponent(seed)}` : "/chat";
    router.push(url);
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const seed = (value || "").trim();
    if (!seed && attachments.length === 0) {
      if (setShowTailoredModal) setShowTailoredModal(true);
      return;
    }
    goToChat(seed, attachments);
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
      requestAnimationFrame(() => autoGrow(textareaRef.current));
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

  const seedPrompt = (text) => {
    const stripped = text.replace(/^[^\s]+\s/, "").trim();
    setValue(stripped);
    textareaRef.current?.focus();
    requestAnimationFrame(() => autoGrow(textareaRef.current));
  };

  const polaroidImages = (polaroids && polaroids.length
    ? polaroids
    : FALLBACK_POLAROIDS
  ).slice(0, 4);
  const polClassNames = [styles.pol1, styles.pol2, styles.pol3, styles.pol4];

  return (
    <section className={styles.heroV2}>
      <div className={styles.container}>
        <div className={styles.heroV2Grid}>
          <div>
            {kicker && (
              <div className={styles.heroV2Kicker}>
                <span className="dot" />
                {kicker}
              </div>
            )}
            <h1>{title}</h1>
            {description && (
              <p className={styles.heroV2Lede}>
                {typeof description === "string"
                  ? truncateAtSentence(description, 300)
                  : description}
              </p>
            )}
            <form className={styles.heroV2Input} onSubmit={handleSubmit}>
              <textarea
                ref={textareaRef}
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
                placeholder={
                  inputPlaceholder ||
                  `Try: 10 days ${destinationLabel || "trip"}, your vibe, your budget`
                }
                rows={1}
              />

              {attachments.length > 0 && (
                <div className={styles.heroV2AttachRow}>
                  {attachments.map((file, idx) => (
                    <span
                      key={`${file.name}-${idx}`}
                      className={styles.heroV2AttachChip}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                      <span>{file.name}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${file.name}`}
                        className={styles.heroV2AttachRemove}
                        onClick={() => removeAttachment(idx)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.heroV2InputFoot}>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  hidden
                  onChange={handleFilePick}
                />
                <button
                  type="button"
                  className={styles.heroV2IconBtn}
                  title="Attach a document"
                  aria-label="Attach a document"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`${styles.heroV2IconBtn} ${
                    isListening ? styles.heroV2IconBtnActive : ""
                  }`}
                  title={
                    micSupported
                      ? isListening
                        ? "Stop dictating"
                        : "Dictate"
                      : "Voice input not supported in this browser"
                  }
                  aria-label="Dictate"
                  disabled={!micSupported}
                  onClick={startMic}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="2" width="6" height="12" rx="3" />
                    <path d="M19 10a7 7 0 0 1-14 0M12 19v3" />
                  </svg>
                </button>
                <button
                  type="submit"
                  className={styles.heroV2Send}
                  aria-label="Send to Kaira"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
            </form>
            {prompts.length > 0 && (
              <div className={styles.heroV2Prompts}>
                {prompts.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    className={styles.heroV2Prompt}
                    onClick={() => seedPrompt(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
            {meta && <div className={styles.heroV2Meta}>{meta}</div>}
          </div>

          <div className={styles.heroV2Collage}>
            {polaroidImages.map((p, i) => (
              <div
                key={i}
                className={`${styles.polaroid} ${polClassNames[i] || ""}`}
              >
                <div
                  className={styles.polaroidImg}
                  style={{ backgroundImage: `url('${p.image}')` }}
                />
                {p.caption && (
                  <div className={styles.polaroidCaption}>{p.caption}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroV2;
