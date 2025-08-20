import React from 'react';
import { Image, ImageWrapper, HeadingOne, ChipsContainer, SingleChips } from '../styled/Styled';

function Hotel(props) {
    const uniqueAccommodations = [...new Set(props.item.accommodation_type)];

    return (
        <>
            <ImageWrapper>
                <Image src={`${props.item.images[0].image}`} alt={props.item.name} />
            </ImageWrapper>
            <HeadingOne>{props.item.name}</HeadingOne>
            <ChipsContainer >{uniqueAccommodations.map((type, i) => <SingleChips className={i % 2 ? 'purple' : 'green'} key={i}>{type}</SingleChips>)}
                <SingleChips >{props.item.star_category} star hotel</SingleChips></ChipsContainer>
        </>

    )
}

export default React.memo(Hotel);