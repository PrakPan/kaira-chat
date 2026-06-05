import React, { useState, useEffect } from "react";
import styles from "../../../styles/pages/revamp/destination.module.scss";

const ImageWithSkeleton = ({
  src,
  alt = "",
  className,
  style,
  asBackground = false,
  children,
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!src) {
      setLoaded(true);
      return;
    }
    setLoaded(false);
    const img = new window.Image();
    img.src = src;
    if (img.complete) {
      setLoaded(true);
    } else {
      img.onload = () => setLoaded(true);
      img.onerror = () => setLoaded(true);
    }
  }, [src]);

  if (asBackground) {
    return (
      <div
        className={className}
        style={{
          ...style,
          backgroundImage: loaded && src ? `url('${src}')` : undefined,
        }}
      >
        {!loaded && <div className={styles.imgSkeleton} aria-hidden />}
        {children}
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      {!loaded && <div className={styles.imgSkeleton} aria-hidden />}
      {src && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          loading="lazy"
          style={{
            opacity: loaded ? 1 : 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
      {children}
    </div>
  );
};

export default ImageWithSkeleton;
