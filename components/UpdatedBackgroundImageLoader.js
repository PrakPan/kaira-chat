import React, { useState } from "react";
import ImageLoader from "./ImageLoader";

const SaifBackgroundImageLoader = (props) => {
  const [loaded, setLoaded] = useState(false);

  const handleImageLoad = () => {
    setLoaded(true);
  };

  return (
    <div
      style={{
        position: "relative", 
        zIndex: "0",
        height: props.height || "100%",
        width: props.width || "100%",
        borderRadius: props.borderRadius || "0",
        overflow: "hidden", 
        ...props.style,
      }}
    >
      <ImageLoader
        noLazy={props.noLazy}
        url={props.url}
        style={{
          filter: props.filter,
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          objectFit: props.resizeMode || "cover",
          zIndex: -1,
        }}
        height="100%"
        width="100%"
        dimensions={props.dimensions}
        dimensionsMobile={props.dimensionsMobile}
        borderRadius={props.borderRadius || "0"}
        noPlaceholder={props.noPlaceholder}
        onload={props.onload || handleImageLoad}
      />

      <div
        style={{
          width: "100%",
          height: "100%",
          padding: props.padding,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        {props.children}
      </div>
    </div>
  );
};


export default SaifBackgroundImageLoader;
