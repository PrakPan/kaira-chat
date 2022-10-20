import React from 'react';
import styled from 'styled-components';
// import Heading from '../../../heading/Heading';
import ImageLoader from '../../../ImageLoader';
  import Filters from './Filters';
import Location from './Location';
 import { getHumanTime } from '../../../../services/getHumanTime';
import { getIndianPrice } from '../../../../services/getIndianPrice';
import bg from '../../../../public/assets/grey.png';

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
 

 

const Name = styled.h2`
    font-size: 2rem;
    font-weight: 800;
    text-align: center;
    margin: 1rem 0;
`;
const DetailsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    @media screen and (min-width: 768px){
        width: 40%;
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
    width: 100%;
    position: relative;
    background-image: url(${bg});
    min-height: 20vh;
    @media screen and (min-width: 768px){
        margin: auto;
        width: 40%;
    }
    
`;


const PhotosButton = styled.div`
    &:hover{
        cursor: pointer;
    }
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    border-radius: 2rem;
    position: absolute;
    right: 0.25rem;
    top: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    letterSpacing: 1px;
    font-weight: 300;
`;


const EditButton = styled.div`
&:hover{
    cursor: pointer;
}
background-color: rgba(255, 255, 255, 0.8);
color: black;
border-radius: 2rem;
padding: 0.35rem 1.5rem;
font-size: 0.85rem;
letterSpacing: 1px;
font-weight: 400;

`;

const Overview = (props) => {
    let images = [];
    try{
    for(var i=0; i<props.images.length; i++){
        images.push(props.images[i].image);
    }
}catch{

}
 console.log('im',props.images);
  return(
      <Container>
        <Name align="center" aligndesktop="center" margin="0" className="font-opensans" bold noline>{props.data.name}</Name>
        {/* <ImageContainer>
        {props.images.length ?<PhotosButton onClick={() => props._setImagesHandler(imagesarr)} className="font-opensans" style={{backgroundColor: "white", opacity: '0.7', borderRadius: "5px", position: "absolute", right: "0.5rem", top: "0.5rem", padding: "0.5rem", fontSize: "0.75rem" }}>
                     <FontAwesomeIcon icon={faImages} style={{marginRight: "0.5rem"}}></FontAwesomeIcon>
                    All Photos
                    </PhotosButton> : null}
                    <ImageTag tag={"Stays"}></ImageTag>
        <ImageLoader url={props.images.length ? props.images[0].image: 'media/website/grey.png'} dimensions={{width: 1600, height: 900}} dimensionsMobile={{width: 1600, height: 900}} width="60%" margin="auto"/> 

        </ImageContainer> */}
          <ImageContainer>
                 <ImageLoader   url={props.images ? props.images.length ? props.images[0].image : 'media/website/grey.png' : 'media/website/grey.png'} height="30vh" width="100%"></ImageLoader> 
                {props.images ? props.images.length ?<PhotosButton onClick={() => props._setImagesHandler(images)}  className="font-opensans">
                     {/* <FontAwesomeIcon icon={faImages} style={{marginRight: "0.5rem"}}></FontAwesomeIcon> */}
                    All Photos
                    </PhotosButton> : null : null}
                  
                    <div style={{position: 'absolute', bottom: '0.25rem', right: '0.25rem', display: 'flex', }}>
                            <EditButton className="font-opensans" style={{marginRight: '0.5rem'}}>Hotel</EditButton>
                            {/* <EditButton className="font-opensans">5 star</EditButton> */}

                    </div>
                    {props.tag ? <Tag star_category={props.star_category} tag={props.tag}></Tag> : null}
            </ImageContainer>
        
        <DetailsContainer>
            <Location data={props.data}></Location>
            {/* {props.data.rooms_available? props.data.rooms_available.length && props.data.rooms_available[0].prices.min_price  ? <Cost className='font-opensans'>{ "₹ "+getIndianPrice(Math.round(props.data.rooms_available[0].prices.min_price/100))}</Cost> : null : null} */}
            {/* {props.data.check_in && props.data.check_out ? <CheckIn className='font-opensans'>{"Check in: "+getHumanTime(props.data.check_in.slice(0,-3))+" ; Check out:"+getHumanTime(props.data.check_out.slice(0,-3))}</CheckIn> : null} */}
           <div style={{display: 'grid', gridTemplateColumns: 'max-content max-content', gridGap: '1rem'}}>
           {props.data.check_in ? 
           <div className='font-opensans text-center'>
            <CheckIn style={{fontWeight: '600', fontSize: '0.9rem'}}  className='font-opensans'>{"Check in"}</CheckIn>
            <CheckIn style={{fontWeight: '300', fontSize: '0.75rem'}}  className='font-opensans'>{getHumanTime(props.data.check_in.slice(0,-3))}</CheckIn>

           </div>
            : null}
            {props.data.check_in ? 
           <div className='font-opensans text-center'>
            <CheckIn style={{fontWeight: '600', fontSize: '0.9rem'}} className='font-opensans'>{"Check in"}</CheckIn>
            <CheckIn style={{fontWeight: '300', fontSize: '0.75rem'}}  className='font-opensans'>{getHumanTime(props.data.check_in.slice(0,-3))}</CheckIn>

           </div>
            : null}

           </div>
        </DetailsContainer>
        {/* <Filters data={props.data}></Filters> */}
        {/* <Icons></Icons> */}
        {/* {props.data.check_in && props.data.check_out ? <CheckIn className='font-opensans'>{"Check in: "+getHumanTime(props.data.check_in.slice(0,-3))+" ; Check out:"+getHumanTime(props.data.check_out.slice(0,-3))}</CheckIn> : null} */}
      </Container>
  );

}

export default Overview;