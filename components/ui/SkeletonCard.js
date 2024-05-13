import styled from "styled-components";
import Lottie from "react-lottie";
import animationData from "../../public/assets/skeleton_square.json";

export default function SkeletonCard({
  width,
  height,
  mt,
  mb,
  ml,
  mr,
  margin,
  borderRadius,
  lottieDimension,
}) {
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
    opacity: 0.8;
    background: yellow;
  `;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
  };

  const greater = lottieDimension || Math.max(width, height) || "auto";

  return (
    <LoadingBox
      width={width}
      height={height}
      ml={ml}
      mr={mr}
      mt={mt}
      margin={margin}
      mb={mb}
      borderRadius={borderRadius}
    >
      <Lottie options={defaultOptions} width={greater} height={greater} />
    </LoadingBox>
  );
}
