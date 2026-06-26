import React from "react";
import { imgUrlEndPoint } from "../../theme/ThemeConstants.js";
import styles from "../../../styles/pages/revamp/destination.module.scss";

// Turns API snake/kebab values ("single_entry", "e-visa") into readable
// labels ("Single Entry", "E-Visa").
const prettify = (val) =>
  String(val || "")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

// Stay periods arrive prefixed with a stray "0" ("0Upto 30 Days"). Strip it.
const cleanStay = (val) =>
  String(val || "")
    .replace(/^0+(?=\D|$)/, "")
    .trim();

// Format an amount with its currency. INR gets the ₹ symbol + Indian grouping.
const fmtMoney = (amount, currency) => {
  const n = Number(amount);
  if (!isFinite(n)) return null;
  const symbol = currency === "INR" ? "₹" : currency ? `${currency} ` : "";
  return `${symbol}${n.toLocaleString("en-IN")}`;
};

const fileUrl = (file) =>
  file ? (file.startsWith("http") ? file : `${imgUrlEndPoint}${file}`) : null;

const isExpress = (type) => /express/i.test(String(type || ""));

const VisaSection = ({ visas, destinationName }) => {
  const list = Array.isArray(visas) ? visas.filter(Boolean) : [];
  if (list.length === 0) return null;

  return (
    <section className={`${styles.block} ${styles.visaBlock}`}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionHeadLeft}>
            <h2>
              Your {destinationName || "trip"} visa,{" "}
              <span className={styles.serif}>handled for you.</span>
            </h2>
            <p className={styles.lede}>
              Pick a processing speed — we prep the paperwork, double-check every
              document, and submit on your behalf.{" "}
              <span className={`${styles.serif} ${styles.visaNoWrap}`}>
                No embassy queues.
              </span>
            </p>
          </div>
        </div>

        <div className={styles.visaGrid}>
          {list.map((v, idx) => {
            const express = isExpress(v?.processing_type);
            // Service fee is excluded for now — show only the visa fee.
            const total = fmtMoney(v?.price, v?.currency);
            const stay = cleanStay(v?.stay_period);
            const checklist = fileUrl(v?.checklist_file);

            return (
              <div
                className={`${styles.visaCard} ${
                  express ? styles.visaCardExpress : ""
                }`}
                key={v?.id || idx}
              >
                <div className={styles.visaCardTop}>
                  <span className={styles.visaCat}>
                    {prettify(v?.category) || "Visa"}
                  </span>
                  <span
                    className={`${styles.visaProc} ${
                      express ? styles.visaProcExpress : ""
                    }`}
                  >
                    {express ? "⚡ " : ""}
                    {prettify(v?.processing_type) || "Standard"}
                  </span>
                </div>

                <div className={styles.visaTags}>
                  {v?.purpose && <span>{prettify(v.purpose)}</span>}
                  {v?.entry_type && <span>{prettify(v.entry_type)}</span>}
                </div>

                {stay && (
                  <div className={styles.visaStay}>
                    <span className={styles.visaStayLabel}>Duration of stay</span>
                    <span className={`${styles.visaStayValue} ${styles.serif}`}>
                      {stay}
                    </span>
                  </div>
                )}

                {total && (
                  <div className={styles.visaTotal}>
                    <span>Visa fee</span>
                    <span className={styles.visaTotalAmount}>
                      <b className={styles.serif}>{total}</b>
                      <span className={styles.visaPer}>/ person</span>
                    </span>
                  </div>
                )}

                {checklist ? (
                  <a
                    className={styles.visaChecklist}
                    href={checklist}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <path d="M7 10l5 5 5-5" />
                      <path d="M12 15V3" />
                    </svg>
                    Download checklist
                  </a>
                ) : (
                  <div className={styles.visaChecklistEmpty}>
                    Document checklist shared after you book
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className={styles.visaFootnote}>
          Prices are indicative and verified by our visa team before you pay ·
          Embassy fees may change without notice.
        </p>
      </div>
    </section>
  );
};

export default VisaSection;
