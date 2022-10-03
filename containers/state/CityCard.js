import React, {useEffect} from 'react';
import styled from 'styled-components';
import ImageLoader from '../../components/ImageLoader';
const Container = styled.div`
    display: grid;
    border-radius: 5px;
    @media screen and (min-width: 768px){
        grid-template-columns: 40% 60%;

    }

`;

const CityCard = (props) => {

  return(
   <Container className="border-thin">
       <ImageLoader fit="cover" width="100%" height="20vh" dimensionsMobile={{width: 900, height: 600}} dimensions={{width: 600, height: 900}} url={props.image}></ImageLoader>
       <div>
           <p style={{textAlign: "left", fontSize: "1rem", margin: "0.5rem", fontWeight: "600"}} className="font-opensans">{props.title}</p>
            <div style={{overflow: "scroll", padding: "0 0.5rem"}}>
                <p style={{textAlign: "left", fontWeight: "200", marginBottom: "0.5rem", maxHeight: "30vh", fontSize: "1rem"}} className="font-nuntito">{props.text} </p>
            </div>
       </div>
   </Container>

  );
}

export default CityCard;
