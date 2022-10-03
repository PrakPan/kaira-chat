import React from 'react';
import styled from 'styled-components';
// import Heading from '../../../heading/Heading';
import ImageLoader from '../../../ImageLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faImages} from '@fortawesome/free-solid-svg-icons';
import Filters from './Filters';
import Location from './Location';
import Icons from './Icons';
import { getHumanTime } from '../../../../services/getHumanTime';
import { getIndianPrice } from '../../../../services/getIndianPrice';
import ImageTag from './ImageTag';

const Container = styled.div`
border-style: none none solid none;
border-width: 1px;
border-color: #E4e4e4;
padding: 0 1rem 1rem 1rem;
display: grid;
grid-gap: 1rem;
max-width: 100%;
@media screen and (min-width: 768px){
    grid-template-columns: 1fr;
}
@media screen and (min-width: 768px) and (min-height: 1024px) {
    grid-template-columns: 1fr;
}
`;
const ApproxTime = styled.div`
    width: max-content;
    border-radius: 2rem;
    background-color: #f7e700;
    padding: 0.25rem 1rem;
    margin: 1rem auto;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
    margin-right: 0.5rem;
`;

const Name = styled.h2`
    font-size: 2rem;
    font-weight: 800;
    text-align: center;
`;
const DetailsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    @media screen and (min-width: 768px){
        width: 60%;
        margin: auto;
    }
`;
const CheckIn = styled.div`
font-size: 0.9rem;
font-weight:  300;
@media screen and (min-width: 768px){
    width: 60%;
    margin: auto;
}
`;
const Cost = styled.div`
font-weight: 600;
text-align: right;
&:before{
  content: 'Starting From';
  display: block;
  text-align: right;
  line-height:1;
  font-weight: 300;
  font-size: 0.75rem;
  text-decoration: none !important;

}
`;
const ImageContainer = styled.div`
    position: relative;

`;
const PhotosButton=styled.div`
    background-color: red;
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    width: max-content;
    z-index: 1000;
    &:hover{
        cursor: pointer;
    }
    @media screen and (min-width: 768px){
        left: 21%;

    }
`;

const Overview = (props) => {
 
  
  return(
      <Container>
        <Name align="center" aligndesktop="center" margin="0" className="font-opensans" bold noline>{props.data.name}</Name>
        <ImageContainer>
        {props.images.length ?<PhotosButton onClick={() => props._setImagesHandler(imagesarr)} className="font-opensans" style={{backgroundColor: "white", opacity: '0.7', borderRadius: "5px", position: "absolute", right: "0.5rem", top: "0.5rem", padding: "0.5rem", fontSize: "0.75rem" }}>
                     <FontAwesomeIcon icon={faImages} style={{marginRight: "0.5rem"}}></FontAwesomeIcon>
                    All Photos
                    </PhotosButton> : null}
                    <ImageTag tag={"Stays"}></ImageTag>
        <ImageLoader url={props.images.length ? props.images[0].image: 'media/website/grey.png'} dimensions={{width: 1600, height: 900}} dimensionsMobile={{width: 1600, height: 900}} width="60%" margin="auto"/> 

        </ImageContainer>
        <DetailsContainer>
            <Location data={props.data}></Location>
            {props.data.rooms_available? props.data.rooms_available.length && props.data.rooms_available[0].prices.min_price  ? <Cost className='font-opensans'>{ "₹ "+getIndianPrice(Math.round(props.data.rooms_available[0].prices.min_price/100))}</Cost> : null : null}

        </DetailsContainer>
        <Filters data={props.data}></Filters>
        {/* <Icons></Icons> */}
        {props.data.check_in && props.data.check_out ? <CheckIn className='font-opensans'>{"Check in: "+getHumanTime(props.data.check_in.slice(0,-3))+" ; Check out:"+getHumanTime(props.data.check_out.slice(0,-3))}</CheckIn> : null}
      </Container>
  );

}

export default Overview;