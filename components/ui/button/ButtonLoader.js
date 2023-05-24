import styled from "styled-components";
import Lottie from "react-lottie";
import animationData from "../../../public/assets/icons/button-loader.json";

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
    width: ${(props) => props.width};
    height: ${(props) => props.height || '1rem'};
    margin-top: ${(props) => props.mt};
    margin-bottom: ${(props) => props.mb};
    margin-left: ${(props) => props.ml};
    margin-right: ${(props) => props.mr};
    margin: ${(props) => props.margin};
    // overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    div {
      position: absolute;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 50px;
    }
  `;
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
  };

  const greater = lottieDimension || Math.max(width, height) || 250;
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
