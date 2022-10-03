import React, {useEffect} from 'react';
import styled from 'styled-components';
import img1 from '../../assets/icons/experiences-covid/1.webp';
import img2 from '../../assets/icons/experiences-covid/2.webp'
import img3 from '../../assets/icons/experiences-covid/3.webp'

const Container = styled.div`
    @media screen and (min-width: 768px){
    padding: 3rem 0;
    }
    background-color: hsl(0,0%,93%);
`;
const Text = styled.p`
    text-align: center;
    @media screen and (min-width: 768px){
        font-size: ${props => props.theme.fontsizes.desktop.text.two};
        width: 80%;
        margin: 0 auto  3rem auto;
        font-weight: 300;
    }
`;
const GridContainer = styled.div`
    display: grid;
    @media screen and (min-width: 768px){
        grid-template-columns: 1fr 1fr 1fr;
        margin: auto;
        width: 80%;

    }
`;
const Icon = styled.img`
    display: block;
    margin: auto;
    width: 80%;
    @media screen and (min-width: 768px){
        width: 35%;
    }
`;
const SubText = styled.p`
    @media screen and (min-width: 768px){

        text-align: center;
        margin: auto;
        font-size: ${props => props.theme.fontsizes.desktop.text.default};
        font-weight: 600;
        margin: 1rem;
    } 
`;
const Covid = () => {
 
  return(
    <Container>
        <Text className="font-opensans">All our travel experiences are highly curated and safe after extensive research.

We are constantly adding more & more experiences. Feel free to contact us for any questions or enquiries.

</Text>
   <GridContainer>
       <div>
           <Icon src={img1}/>
            <SubText className="font-opensans text-center">Social distancing maintained</SubText>
       </div>
        <div>
            <Icon src={img2}/>
            <SubText className="font-opensans">Slot Booking for avoiding crowds</SubText>
        </div>
       <div>
            <Icon src={img3}/>
            <SubText className="font-opensans">Travel safe by caravans</SubText>
       </div>
   </GridContainer>
   <a href="#" style={{margin: "auto", width: "max-content", display: "block", color: "#207EA9"}}>Know More</a>
   </Container>
  );
}

export default Covid;
