import React from 'react';
import styled from 'styled-components';
import img from '../../public/assets/icons/seasons/sun-color.png';


const Container = styled.div`
    padding: 1rem;
    position: relative;
    border-radius: 10px;
    background-color: hsl(0,0%,97.75%);
`;
const Icon = styled.img`
    width: 3rem;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 10px;
`;

const Season= (props) => {

    return(
      <Container className="border-thi">
          <Icon src={img}></Icon>  
          <p className="font-lexend" style={{fontWeight: "600", textAlign: "center", margin: "1rem auto 0.5rem auto"}}>{props.season}</p>
          <p className="font-lexend" style={{fontWeight: "300", textAlign: "center", fontSize: "0.75rem"}}>{props.time_interval}</p>
          <hr></hr>
          <p className="font-lexend" style={{fontWeight: "300", textAlign: "center", fontSize: "0.75rem"}}>{props.text}</p>
      </Container>
  ); 
}

export default Season;
