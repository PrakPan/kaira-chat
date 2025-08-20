import React from 'react';
import { Image, ImageWrapper, HeadingOne, ChipsContainer, SingleChips } from '../styled/Styled';

const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

function Activity(props) {
    return (
        <>
            <ImageWrapper >
                <Image src={`${imgUrlEndPoint}${props.item.image}`} alt={props.item.name} />
            </ImageWrapper>
            <HeadingOne>{props.item.name}</HeadingOne>
            <ChipsContainer>
                {props.item?.category && <SingleChips className="purple">{props.item?.category}</SingleChips>}
                {props.item?.guide && <SingleChips className="green">{props.item.guide}</SingleChips>}
            </ChipsContainer>
        </>
    )
}

export default React.memo(Activity);