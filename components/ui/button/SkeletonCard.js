import react from 'react'
import styled from 'styled-components';
import Lottie from 'react-lottie'
import animationData from '../../../public/assets/skeleton_square.json'

export default function SkeletonCard({width,height,mt,mb,ml,mr}){
    const LoadingBox = styled.div`
    border-radius: 7px;
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    margin-top : ${(props) => props.mt};
    margin-bottom : ${(props) => props.mb};
    margin-left : ${props=>props.ml};
    margin-right : ${props=>props.mr};
    overflow : hidden;
  `;
    const defaultOptions = {
        loop : true,
        autoplay : true,
        animationData,
      }

      const greater = Math.max(width,height)
    return (
        <LoadingBox width={width} height={height} ml={ml} mr={mr} mt={mt} mb={mb}>
        <Lottie options={defaultOptions} width={greater} height={greater}   />
        </LoadingBox>
    )
}