import styled from 'styled-components';
import Lottie from 'react-lottie'
import animationData from '../../public/assets/icons/junction-loader.json'

export default function SkeletonCard(props){
    const LoadingBox = styled.div`
    height : ${props=>props.height || '100%'};
    width:${props=>props.width || '100%'};
    margin : auto;
  `;
    const defaultOptions = {
        loop : true,
        autoplay : true,
        animationData,
      }

    return (
        <LoadingBox width={props.width} height={props.width}>
        <Lottie options={defaultOptions} width={props.width} height={props.width} margin='auto'  />
        </LoadingBox>
    )
}