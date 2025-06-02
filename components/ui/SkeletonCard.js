import styled, { keyframes } from "styled-components";


const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
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
  background: #f0f0f0; /* Base color */
  
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
      rgba(255, 255, 255, 0.6) 50%,
      transparent 100%
    );
    animation: ${shimmer} 2s ease-in-out infinite;
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
  background: #e8e8e8; /* Base color */
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.8) 100%
    );
    animation: ${wave} 1.8s ease-in-out infinite;
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
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s ease-in-out infinite;
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
    />
  );
}