import styled, { keyframes, css } from "styled-components";


const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const ttwShimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

const wave = keyframes`
  0% {
    transform: translateX(-100%) skewX(-15deg);
  }
  100% {
    transform: translateX(200%) skewX(-15deg);
  }
`;

const LoadingBox = styled.div`
  border-radius: ${(props) => props.borderRadius || "7px"};
  width: ${(props) => props.width || "auto"};
  height: ${(props) => props.height || "auto"};
  margin-top: ${(props) => props.mt};
  margin-bottom: ${(props) => props.mb};
  margin-left: ${(props) => props.ml};
  margin-right: ${(props) => props.mr};
  margin: ${(props) => props.margin};
  overflow: hidden;
  position: relative;
  background: #f4f3ec; /* Kaira warm paper base */

  /* Create the shimmer effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.55) 45%,
      rgba(247, 231, 0, 0.1) 50%,
      rgba(255, 255, 255, 0.55) 55%,
      transparent 100%
    );
    animation: ${shimmer} 1.6s ease-in-out infinite;
  }
`;

const LoadingBoxWave = styled.div`
  border-radius: ${(props) => props.borderRadius || "7px"};
  width: ${(props) => props.width || "auto"};
  height: ${(props) => props.height || "auto"};
  margin-top: ${(props) => props.mt};
  margin-bottom: ${(props) => props.mb};
  margin-left: ${(props) => props.ml};
  margin-right: ${(props) => props.mr};
  margin: ${(props) => props.margin};
  overflow: hidden;
  position: relative;
  background: #efeee7; /* Kaira warm paper base */

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: ${(props) => props.isNotAnimate ? '' : `linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.8) 100%
    )`};
    animation: ${(props) =>
    props.isNotAnimate
      ? ""
      : css`${wave} 1.8s ease-in-out infinite`};
  }
`;

const LoadingBoxGradient = styled.div`
  border-radius: ${(props) => props.borderRadius || "7px"};
  width: ${(props) => props.width || "auto"};
  height: ${(props) => props.height || "auto"};
  margin-top: ${(props) => props.mt};
  margin-bottom: ${(props) => props.mb};
  margin-left: ${(props) => props.ml};
  margin-right: ${(props) => props.mr};
  margin: ${(props) => props.margin};
  overflow: hidden;
  background: linear-gradient(
    90deg,
    #ececec 0%,
    #f6f5f0 50%,
    #ececec 100%
  );
  background-size: 200% 100%;
  animation: ${ttwShimmer} 1.4s ease-in-out infinite;
`;

export default function SkeletonCard({
  width,
  height,
  mt,
  mb,
  ml,
  mr,
  margin,
  borderRadius,
  variant = "default",
  isNotAnimate = false
}) {

  const Component = variant === "wave" ? LoadingBoxWave :
    variant === "gradient" ? LoadingBoxGradient :
      LoadingBox;

  return (
    <Component
      width={width}
      height={height}
      ml={ml}
      mr={mr}
      mt={mt}
      margin={margin}
      mb={mb}
      borderRadius={borderRadius}
      isNotAnimate={isNotAnimate}
    />
  );
}