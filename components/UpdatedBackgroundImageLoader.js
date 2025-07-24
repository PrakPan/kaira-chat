import React, { useState } from "react";
import ImageLoader from "./ImageLoader";

const SaifBackgroundImageLoader = (props) => {
  const [loaded, setLoaded] = useState(false);

  const handleImageLoad = () => {
    setLoaded(true);
  };

  return (
    <>
      <div
        className={loaded ? "" : "bg-gray-50"}
        style={{
          position: "static",
          zIndex: "0",
          top: "0",
          left: "0",
          height: props.height ? props.height : "100%",
          width: props.width ? props.width : "100%",
          borderRadius: props.borderRadius ? props.borderRadius : "0",
          filter: props.filter,
          ...props.style,
        }}
      >
        <ImageLoader
          noLazy={props.noLazy}
          url={props.url}
          style={{ filter: props.filter }}
          height={props.height ? props.height : "100%"}
          width={props.width ? props.width : "100%"}
          dimensions={props.dimensions}
          dimensionsMobile={props.dimensionsMobile}
          borderRadius={props.borderRadius ? props.borderRadius : "0"}
          noPlaceholder={props.noPlaceholder}
          resizeMode={props.resizeMode}
          onload={props.onload ? props.onload : handleImageLoad}
        />
      </div>

      {loaded && (
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: props.padding,
          }}
        >
          {props.children}
        </div>
      )}
    </>
  );
};

export default SaifBackgroundImageLoader;
