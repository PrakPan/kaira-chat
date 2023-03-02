import React from 'react';
import styled from 'styled-components';
import ImageLoader from '../../components/ImageLoader';

/*
Description:
KeyBenefits component
------------------------------------------------------------------------------------------------
Props:
width
height
------------------------------------------------------------------------------------------------
Components used:
styled, ImageLoader
*/

const Container = styled.div`
@media screen and (min-width: 768px){
display: grid;
grid-template-columns: repeat(2, 1fr);
grid-gap:2rem;
padding:2rem;
}
`;

const Card = styled.div`
padding:1rem;
display: flex;
align-items: flex-start;
justify-content: flex-start;    
&:nth-of-type(2){
    grid-row: 1;
 } 
 &:nth-of-type(6){
    grid-row: 3;    
 } 
 @media screen and (min-width: 768px){
   padding:0rem;
}
`;

const Text = styled.p`
font-size: 0.8rem;
@media screen and (min-width: 768px){
    font-size: 1.4rem;
}
`;


const ImageHeading = styled.h1`
font-size: 1.5rem;
@media screen and (min-width: 768px){
    font-size: 1.8rem;
}
`;

const ImageNumber = styled.div`
background-color:#F7E700;
width:2.7rem;
padding: 0.8rem;
border-radius: 50%;
line-height: 1rem;
text-align: center;
color:black;
position: relative;
font-size: 1.5rem;
@media screen and (min-width: 768px){
    padding: 1.3rem;
    font-size: 2rem;
    line-height: 1.5rem;
    width:4rem;
  }
`;

const ImageText = styled.div`
padding:0rem 1rem 0rem;
@media screen and (min-width: 768px){
   padding:1rem 1.5rem 0rem;
}
`;

const KeyBenefits = (props) => {
   return (

      <Container>
         <Card>
            <ImageLoader dimensions={{ width: props.width, height: props.height }} url="media/ruby/cycletour.jpg" />
         </Card>
         <Card>
            <ImageNumber>
               1
            </ImageNumber>
            <ImageText >
               <ImageHeading className="font-opensans">Unique and Immersive</ImageHeading>
               <br />
               <Text className="font-nunito">
                  Unique Experiences highly unique UI write write write lorem ipsum text
               </Text>
            </ImageText>
         </Card>
         <Card>
            <ImageLoader dimensions={{ width: props.width, height: props.height }} url="media/ruby/cycletour.jpg" />
         </Card>
         <Card>
            <ImageNumber>
               2
            </ImageNumber>
            <ImageText>
               <ImageHeading className="font-opensans">Unique and Immersive</ImageHeading>
               <br />
               <Text className="font-nunito">
                  Unique Experiences highly unique UI write write write lorem ipsum text
               </Text>
            </ImageText>
         </Card>
         <Card>
            <ImageLoader dimensions={{ width: props.width, height: props.height }} url="media/ruby/cycletour.jpg" />
         </Card>
         <Card>
            <ImageNumber>
               3
            </ImageNumber>
            <ImageText>
               <ImageHeading className="font-opensans">Feedback and reports</ImageHeading>
               <br />
               <Text className="font-nunito">
                  Unique Experiences highly unique UI write write write lorem ipsum text
               </Text>
            </ImageText>
         </Card>
      </Container>

   );

}

export default KeyBenefits;