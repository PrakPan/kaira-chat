import React from 'react';
import { Image, ImageWrapper, HeadingOne, ChipsContainer, SingleChips } from '../styled/Styled';

const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
function Poi(props) {
    return (
        <>
            <ImageWrapper>
                <Image src={`${imgUrlEndPoint}${props.item.image}`} alt={props.item.name} />
            </ImageWrapper>
            <HeadingOne>{props.item.name}</HeadingOne>
            <ChipsContainer>{props.item.experience_filters.map((ex, i) => <SingleChips className={i % 2 ? 'purple' : 'green'} key={i}>{ex}</SingleChips>)}</ChipsContainer>

        </>
    )
}

export default React.memo(Poi);