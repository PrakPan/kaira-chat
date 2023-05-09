import React, {useRef, useEffect} from 'react';
import styled from 'styled-components'
import ImageLoader from '../../../../ImageLoader';
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
    background-image: url("https://d31aoa0ehgvjdi.cloudfront.net/media/website/grey.png");
    min-height: 20vh;
    
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
const EditIcon  = styled.img`
    width: 1rem;
    height: 1rem;
`
const Booking = (props) =>{
  
    const detailsarr=[]
    if(props.details)
    for(var i=0; i<props.details.length; i++){
        detailsarr.push(
            <li className={props.blur ? 'blurry-text' : ''} style={{fontSize: "0.75rem", margin: "0.5rem 0", fontWeight: "300"}} >{props.details[i]}</li>
        );
    }
     
    let imagesarr = []
    if(props.images)
    for(var i =0 ; i < props.images.length; i++){
        imagesarr.push(props.images[i].image)
    }
    // if(window.innerWidth >= 768)
    return(
        <Container className="" onClick={props.images ? props.images.length ? () => props._setImagesHandler(imagesarr) : console.log('') : console.log('')} >
            <ImageContainer>
                <div style={{minHeight: '20vh'}}><ImageLoader borderRadius="10px 10px 0 0" fit="cover" url={props.images ? props.images.length ? props.images[0].image : 'media/website/grey.png' : 'media/website/grey.png'} height="25vh" width="100%"></ImageLoader></div>
                {/* {props.images ? props.images.length ?<PhotosButton onClick={() => props._setImagesHandler(imagesarr)}  className="font-lexend">
                    All Photos
                    </PhotosButton> : null : null} */}
                  
                    <div style={{position: 'absolute', bottom: '0.25rem', right: '0.25rem', display: 'flex', }}>
                            {props.type ? <EditButton className="font-lexend" style={{marginRight: '0.5rem'}}>{props.type}</EditButton> : null}
                            {props.star_category ? <EditButton className="font-lexend">{props.star_category+" star"}</EditButton> : null}

                    </div>
                    {props.tag ? <Tag star_category={props.star_category} tag={props.tag}></Tag> : null}
            </ImageContainer>
        
        </Container>
    );
//     else return(
// <Container className="border-thin">
//             <ImageContainer>
//             {/* <ImageLoader fit="cover" url={props.images[0].image} dimensions={{width: 1600, height: 900}} dimensionsMobile={{width: 1600, height: 900}} widthmobile="100%" height="20vh" ></ImageLoader> */}
//                 <ImageLoader blur={props.blur} url={props.images? props.images.length ? props.images[0].image : 'media/website/grey.png' : 'media/website/grey.png'} dimensionsMobile={{ width: 1600, height: 900 }}  fit="cover" width="100%" height="25vh"  borderRadius="10px 10px 0 0"/>
//                 <PhotosButton onClick={() => props._setImagesHandler(imagesarr)} className="font-lexend" style={{backgroundColor: "white", opacity: '0.7', borderRadius: "5px", position: "absolute", right: "0.5rem", top: "0.5rem", padding: "0.5rem", fontSize: "0.75rem" }}>                <FontAwesomeIcon icon={faImages} style={{marginRight: "0.5rem"}}></FontAwesomeIcon>
//                 All Photos</PhotosButton>
//                 <YellowContainer duration={props.duration} are_prices_hidden={props.are_prices_hidden} city={props.city} check_in={props.check_in} check_out={props.check_out} price={props.price} heading={props.heading}></YellowContainer>
//                 {/* {props.type==="Accommodation" ? <EditButton className="center-div" onClick={props.setShowBookingModal}>
//                 <EditIcon src={editicon}></EditIcon>
//                 </EditButton> : null} */}
//                 {props.tag ? <Tag tag={props.tag}></Tag> : null}
//             </ImageContainer>
       
// </Container>

    // );
}

export default Booking;