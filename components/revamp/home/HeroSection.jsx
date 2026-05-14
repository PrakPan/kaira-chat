"use client";

import Image from "next/image";
import { heroImages } from "../assets";
import HeadingContent from "./HeadingContent";
import styles from "./HeroSection.module.scss";

const HeroSection = ({ title, subtitle }) => {
  return (
    <section className={styles.heroSection}>
      <HeadingContent title={title} subtitle={subtitle} />
      <div className={styles.backgroundWrapper}>
        {heroImages.map((image, index) => (
          <div key={index} className={styles.foregroundImage}>
            <Image
              src={image}
              alt={`Hero Image ${index + 1}`}
              priority={index < 2}
            />
          </div>
        ))}
      </div>
      <div className={styles.bottomGreeLine}></div>
    </section>
  );
};

export default HeroSection;
