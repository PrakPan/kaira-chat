import React from 'react';
import { Image, ImageWrapper, HeadingOne, SubHeading } from '../styled/Styled';

const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
const airlineImgUrlEndPoint = `${imgUrlEndPoint}media/airlines/`;

function Flight(props) {
    return (
        <>
            <ImageWrapper className="flight-wrapper">
                <Image src={`${airlineImgUrlEndPoint}${props.item.segments[0].airline.code}.png`} alt={props.item.segments[0].airline.name} />
            </ImageWrapper>
            <HeadingOne>{props.item.segments[0].airline.name} ({props.item.segments[0]?.airline.code} - {props.item.segments[0]?.airline.flight_number})</HeadingOne>
            <SubHeading><b>{new Date(props.item.segments[0].origin.departure_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", })}</b>
                ({props.item.segments[0].origin.city_code})
                - &nbsp;
                <b>{new Date(props.item.segments[0].destination.arrival_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", })}</b>
                ({props.item.segments[0].destination.city_code})
            </SubHeading>
        </>
    )
}

export default React.memo(Flight);