import React from "react";
import Lottie from "react-lottie";

const LottieAnimation = (props) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require("./animation.json"),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div>
      <Lottie options={defaultOptions} height={300} width={300} />
    </div>
  );
};

export default LottieAnimation;
