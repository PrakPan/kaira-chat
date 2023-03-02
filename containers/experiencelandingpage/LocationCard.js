import React, {useEffect} from 'react';
import styled from 'styled-components';
import ImageLoader from '../../components/ImageLoader';
const Container = styled.div`
    display: grid;
    border-radius: 5px;
    @media screen and (min-width: 768px){
        grid-template-columns: 40% 60%;
        height: 40vh;

    }

`;

const CityCard = (props) => {

  return(
   <Container className="border-thin">
       <ImageLoader width="100%" height="40vh" maxHeight="40vh" dimensionsMobile={{width: 900, height: 600}} dimensions={{width: 600, height: 900}} url={props.image}></ImageLoader>
       <div >
           <p style={{textAlign: "center", fontSize: "1.5rem", marginBottom: "0.5rem"}}>{props.title}</p>
            <div style={{overflowY: "scroll", padding: "0 0.5rem"}}>
                <p style={{textAlign: "center", fontWeight: "200", marginBottom: "0.5rem", maxHeight: "30vh"}}>{props.text} </p>
            </div>
       </div>
   </Container>
  );

}

export default CityCard;
