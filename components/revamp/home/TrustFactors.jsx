import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HeroSection.module.scss";

const TrustFactors = () => {
  return (
    <div>
      <ul className={styles.featuresContainer}>
        <li className={styles.featureItem}>
          <div className={styles.featureIcon}>
            <Image
              src="/google.svg"
              width={24}
              height={24}
              alt="5 Star Rating"
              loading="lazy"
              fetchPriority="low"
              className="rounded-circle"
            />
          </div>
          <span className={styles.featureText}>4.8+ rated</span>
        </li>

        <li className={styles.featureItem}>
          <div className={styles.featureIcon}>
            <Image
              src="/assets/trustfactor/trust-factor-3.svg"
              width={24}
              height={24}
              alt="All Taxes & Fees Included"
              loading="lazy"
              fetchPriority="low"
            />
          </div>
          <span className={styles.featureText}>
            All Taxes &amp; Fees Included
          </span>
        </li>

        <li className={styles.featureItem}>
          <div className={styles.featureIcon}>
            <Image
              src="/assets/trustfactor/trust-factor-2.svg"
              width={24}
              height={24}
              alt="24/7 Support"
              loading="lazy"
              fetchPriority="low"
            />
          </div>
          <span className={styles.featureText}>24/7 Support</span>
        </li>

        <li className={styles.featureItem}>
          <div className={styles.featureIcon}>
            <Image
              src="/assets/trustfactor/trust-factor-4.svg"
              width={24}
              height={24}
              alt="Secure Payments"
              loading="lazy"
              fetchPriority="low"
            />
          </div>
          <span className={styles.featureText}>Secure Payments</span>
        </li>
      </ul>

      <div className={styles.featuresBg}>
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
         <path 
              d="M 0 30 Q 100 10, 200 30 T 400 30 T 600 30 T 800 30 T 1000 30 T 1200 30 T 1400 30" 
              stroke="rgba(255, 255, 255, 0.15)" 
              strokeWidth="2" 
              fill="none"
              className={styles.bgCurve}
            />
            <path 
              d="M 100 50 Q 200 35, 300 50 T 500 50 T 700 50 T 900 50 T 1100 50 T 1300 50" 
              stroke="rgba(255, 255, 255, 0.12)" 
              strokeWidth="2" 
              fill="none"
              className={styles.bgCurve}
            />
            <path 
              d="M 0 40 Q 150 25, 300 40 T 600 40 T 900 40 T 1200 40 T 1500 40" 
              stroke="rgba(255, 255, 255, 0.1)" 
              strokeWidth="2" 
              fill="none"
              className={styles.bgCurve}
            />
            <path 
              d="M 50 20 Q 180 5, 310 20 T 570 20 T 830 20 T 1090 20 T 1350 20" 
              stroke="rgba(255, 255, 255, 0.08)" 
              strokeWidth="2" 
              fill="none"
              className={styles.bgCurve}
              />
        </svg>
      </div>
    </div>
  );
};

export default TrustFactors;
