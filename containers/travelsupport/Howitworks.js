import React, {useState} from 'react';
import styled from 'styled-components';
import media from '../../components/media';
 import travelsupportcontent from '../../public/content/travelsupport';
import ImageLoader from '../../components/ImageLoader';

const Container = styled.div`
    display: grid !important;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px){

        width: 100%;
        margin: auto;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 2rem;
    }
`;
const Arrow = styled.img`
    width: 1.5rem;
    margin: auto 0.5rem;
`;

const TextContainer = styled.div`

`;

const ImageContainer = styled.div`
    padding: auto 1rem;
`;


const HowItWorksHeading = styled.p`
    text-align: center;
    font-weight: 600;
    margin: 1rem 0 0.5rem 0;
    font-size: 1.25rem;

    @media screen and (min-width: 768px){
      font-size: 1.25rem;
      margin: 1rem 0 0.5rem 0;

    }
`;

const HowItWorksText = styled.p`
text-align: center;
width: 90%;
margin: 0 0 1rem 0;
font-weight: 100;
font-size: 1.25rem;

@media screen and (min-width: 768px){
  font-size: 1.25rem;
  font-weight: 100;
  margin: 0 0;

}
`;
const HowItWorksSlideshow = (props) =>{
     
   
     
    const slidesdesktop = [
        <div key={0} style={{}} >
                <ImageContainer className="center-div">
                <ImageLoader url ={props.images[0]} width="50%" margin="auto"  widthmobile={props.vertical ? '40%' : '60%'} />
        </ImageContainer>
        <TextContainer className="center-div">
            <HowItWorksHeading className='font-lexend'>{travelsupportcontent.howitworks[0].heading}</HowItWorksHeading>
            <HowItWorksText className='font-lexend'>{travelsupportcontent.howitworks[0].text}</HowItWorksText>
        </TextContainer>
    
    </div>,
    <div key={1} style={{}}>
            <ImageContainer className="center-div">
            <ImageLoader url ={props.images[1]} width="50%" margin="auto"  widthmobile={props.vertical ? '40%' : '60%'} />
        </ImageContainer>
        <TextContainer className="center-div">
            <HowItWorksHeading className='font-lexend'>{travelsupportcontent.howitworks[1].heading}</HowItWorksHeading>
            <HowItWorksText className='font-lexend'>{travelsupportcontent.howitworks[1].text}</HowItWorksText>
        </TextContainer>
    
    </div>,
    <div key={2} style={{}}>
         <ImageContainer className="center-div">
         <ImageLoader url ={props.images[2]} width="50%" margin="auto"  widthmobile={props.vertical ? '40%' : '60%'} />
        </ImageContainer>
        <TextContainer className="center-div">
            <HowItWorksHeading className='font-lexend'>{travelsupportcontent.howitworks[2].heading}</HowItWorksHeading>
            <HowItWorksText className='font-lexend'>{travelsupportcontent.howitworks[2].text}</HowItWorksText>
        </TextContainer>
       
    </div>
    ]
    // if(!isPageWide )
    return(
    <>
    
        <Container  >
            {slidesdesktop}
        </Container>
        </>
    );
    
} 

export default  (HowItWorksSlideshow);