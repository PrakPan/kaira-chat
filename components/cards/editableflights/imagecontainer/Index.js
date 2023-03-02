import React, {useRef, useEffect} from 'react';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faImages} from '@fortawesome/free-solid-svg-icons';
import ImageLoader from '../../../ImageLoader';
import YellowContainer from './YellowContainer';
import GridContainer from './GridContainer';
import bg from '../../../../public/assets/grey.png';
import Tag from './Tag';
const Container = styled.div`
    width: 100%;        


    border-radius: 10px;
    @media screen and (min-width: 768px){
        border-radius: 10px;
    }
    
`;
const ImageContainer = styled.div`
    width: 100%;
    position: relative;
    background-image: url(${bg});
    min-height: 25vh;
    
`;


const PhotosButton = styled.div`
    &:hover{
        cursor: pointer;
    }
`;

const EditButton = styled.div`
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    background-color: rgba(	247, 231, 0, 0.8);
    padding: 0rem;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    &:hover{
        cursor: pointer;
    }

`;
const EditIcon  = styled.img`
    width: 1rem;
    height: 1rem;
`
const Booking = (props) =>{
  
    const detailsarr=[]
    for(var i=0; i<props.details.length; i++){
        detailsarr.push(
            <li className={props.blur ? 'blurry-text' : ''} style={{fontSize: "0.75rem", margin: "0.5rem 0", fontWeight: "300"}} >{props.details[i]}</li>
        );
    }
     
    let imagesarr = []

    for(var i =0 ; i < props.images.length; i++){
        imagesarr.push(props.images[i].image)
    }
    if(window.innerWidth >= 768)
    return(
        <Container className="">
            <ImageContainer>
                <div style={{minHeight: '25vh'}}><ImageLoader borderRadius="10px 10px 0 0" fit="cover" url={props.images.length ? props.images[0].image : 'media/website/grey.png'} dimensions={{width: 800, height: 450}} dimensionsMobile={{width: 800, height: 450}} height="25vh" width="100%"></ImageLoader></div>
                {/* {props.images.length ?<PhotosButton onClick={() => props._setImagesHandler(imagesarr)} className="font-opensans" style={{backgroundColor: "white", opacity: '0.7', borderRadius: "5px", position: "absolute", right: "0.5rem", top: "0.5rem", padding: "0.5rem", fontSize: "0.75rem" }}>
                     <FontAwesomeIcon icon={faImages} style={{marginRight: "0.5rem"}}></FontAwesomeIcon>
                    All Photos
                    </PhotosButton> : null} */}
                    <YellowContainer getTime={props.getTime} getDate={props.getDate} data={props.data} are_prices_hidden={props.are_prices_hidden} city={props.city} check_in={props.check_in} check_out={props.check_out} price={props.price} heading={props.heading}></YellowContainer>
                    {/* {props.type === "Accommodation" ? <EditButton className="center-div" onClick={props.setShowBookingModal }>
                        <EditIcon src={editicon}></EditIcon>
                    </EditButton> : null}   */}
                    {props.tag ? <Tag tag={props.tag}></Tag> : null}
            </ImageContainer>
        
        </Container>
    );
    else return(
<Container className="border-thin">
            <ImageContainer>
            {/* <ImageLoader fit="cover" url={props.images[0].image} dimensions={{width: 1600, height: 900}} dimensionsMobile={{width: 1600, height: 900}} widthmobile="100%" height="20vh" ></ImageLoader> */}
                <ImageLoader blur={props.blur} url={props.images.length ? props.images[0].image : 'media/website/grey.png'} dimensionsMobile={{ width: 800, height: 450 }}  fit="cover" width="100%" height="25vh"  borderRadius="10px 10px 0 0"/>
                {/* <PhotosButton onClick={() => props._setImagesHandler(imagesarr)} className="font-opensans" style={{backgroundColor: "white", opacity: '0.7', borderRadius: "5px", position: "absolute", right: "0.5rem", top: "0.5rem", padding: "0.5rem", fontSize: "0.75rem" }}>                <FontAwesomeIcon icon={faImages} style={{marginRight: "0.5rem"}}></FontAwesomeIcon>
                All Photos</PhotosButton> */}
                <YellowContainer  data={props.data} are_prices_hidden={props.are_prices_hidden} city={props.city} check_in={props.check_in} check_out={props.check_out} price={props.price} heading={props.heading}></YellowContainer>
                {/* {props.type==="Accommodation" ? <EditButton className="center-div" onClick={props.setShowBookingModal}>
                <EditIcon src={editicon}></EditIcon>
                </EditButton> : null} */}
                {props.tag ? <Tag tag={props.tag}></Tag> : null}
            </ImageContainer>
       
</Container>

    );
}

export default Booking;