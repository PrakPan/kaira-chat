import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes} from '@fortawesome/free-solid-svg-icons';
import Gallery from './Gallery';


const Container = styled.div`
    height: 100vh;
    width: 100%;
    max-width: 100vw !important;
    background-color: black;
    padding-top: 0.5rem;
    position: fixed;
    top: 0;
    left: 0;

`;
const Cross = styled.p`
    color: white;
    text-align: right;
    margin: 0 1rem;
    font-size: 1.5rem;
    font-weight: 100;
`;


const FullScreenGallery = (props) => {
    return(
    
        <Container style={{zIndex: "2000"}}>
            <Cross >
                <FontAwesomeIcon icon={faTimes} onClick={props.closeGalleryHandler}></FontAwesomeIcon>
            </Cross>
            
            <Gallery images={props.images}>
            </Gallery>  
           
        </Container>
       
    );
  
}

export default React.memo(FullScreenGallery); 