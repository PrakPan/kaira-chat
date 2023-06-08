import React, {useEffect} from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../../components/ImageLoader';
const Container = styled.div`
    display: grid;
    border-radius: 5px;
    @media screen and (min-width: 768px){
        grid-template-columns: 40% 60%;
        height: 40vh;
    }

`;

const ImageContainer = styled.div`
    @media screen and (min-width: 768px){
        height: 40vh;
    }
`;
const CityCard = (props) => {

  return(
   <Container className="border-thin">
       <ImageContainer>
                <ImageLoader  fit="cover" width="100%" height="100%" dimensionsMobile={{width: 900, height: 600}} dimensions={{width: 600, height: 900}} url={props.image}></ImageLoader>
        </ImageContainer>
       <div className='font-lexend'> 
           <p style={{textAlign: "center", fontSize: "1.5rem", margin: "0.5rem"}} >{props.title}</p>
            <div style={{overflowY: "scroll", padding: "0 0.5rem", overflowX: 'hidden'}}>
                <p  style={{textAlign: "center", fontWeight: "200", marginBottom: "0.5rem", maxHeight: "30vh"}}>{props.text} </p>
            </div>
       </div>
   </Container>

  );
}

export default (CityCard);
