'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import styles from './HeroSection.module.scss';
import f1 from '../assets/1.png';
import f2 from '../assets/2.png';
import f3 from '../assets/3.png';
import f4 from '../assets/4.png';

const collect = [f1, f2, f3, f4];

const HeroSection = ({ title, subtitle }) => {
  const imageRefs = useRef([]);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);


  return (
    <section ref={sectionRef} className={styles.heroSection}>
        <div ref={containerRef} className={styles.backgroundWrapper}>
          {collect.map((image, index) => (
            <div
              key={index}
              ref={(el) => (imageRefs.current[index] = el)}
              className={styles.foregroundImage}
            >
              <img src={image.src} alt={`Background ${index + 1}`} />
            </div>
          ))}
        </div>
    </section>
  );
};

export default HeroSection;
