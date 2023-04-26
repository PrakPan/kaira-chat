import styled from 'styled-components';
import Lottie from 'react-lottie'
import animationData from '../../public/assets/icons/junction-loader.json'

export default function SkeletonCard({width,height,mt,mb,ml,mr,margin,borderRadius,lottieDimension}){
    const LoadingBox = styled.div`
    height : 100%;
    width:100%
  `;
    const defaultOptions = {
        loop : true,
        autoplay : true,
        animationData,
      }

    return (
        <LoadingBox width={width} height={height} ml={ml} mr={mr} mt={mt} margin={margin} mb={mb} borderRadius={borderRadius}>
        <Lottie options={defaultOptions} width='100%' height='100%'   />
        </LoadingBox>
    )
}