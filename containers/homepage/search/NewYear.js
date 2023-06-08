import React, {useState} from 'react';
import styled from 'styled-components';

//  import NewSearchMobile from '../../../components/search/homepage/mobile/Index';
import NewSearchDesktop from '../../../components/search/homepage/desktop/Index';
import media from '../../../components/media';
import Button from '../../../components/ui/button/Index';
 
const Container = styled.div`
width: 100%;
 
height: 100%;
background-color: rgba(0,0,0,0.4);

@media screen and (min-width: 768px){
  position: relative;
  

}
`;
const ContentContainer = styled.div`
margin: 5vw 1rem 0 5vw;
@media screen and (min-width: 768px){
    margin: 10vh 20vh;
}
`;
const Tagline = styled.h1`
color: white;
  font-weight: 800;

text-align: right;
  margin: 0rem 0 0.5rem 0;

font-size: 2rem;
@media screen and (min-width: 768px){
  font-size: 3.5rem;
  margin: 0 auto 1rem auto;
   font-weight: 700;
   width: 100%;

}
`;
const SubText = styled.h3`
color: white;
text-align: right;

    font-weight: 100;
    width: 99%;
    line-height: 1;
    font-size: 1.5rem;
    margin-bottom: 0rem;
    @media screen and (min-width: 768px){
        font-size: 2.25rem;
        margin-bottom: 0;
        line-height: normal;
    }

`;
const BlackContainer = styled.div`
    background-color: rgba(0,0,0,0.6);
     width: max-content;
    margin: auto auto 1rem auto;
    border-radius: 5px;
    padding: 1rem;
    @media screen and (min-width: 768px){
            padding: 2rem;
            margin-bottom: 3rem;
            margin-top: -10vh;
    }
`;
const Img = styled.img`
    width: 20vw;
    height: max-content;
    display: block;
    position: absolute;
    right: 0;
    bottom: 0;
    @media screen and (min-width: 768px){
        width:10vw;
        max-height: 70vh;

    }
`;
const SearchFullImg= (props) => {
    let isPageWide = media('(min-width: 768px)')

    const [showResult, setShowResult] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState(null);
   
   
  
    return(
        <Container className="center-dv"> 
        <ContentContainer>
        <Tagline className="font-lexend">{props.tagline}</Tagline>

            <SubText className="font-lexend">{props.text}</SubText>
             {/* <div className='hidden-deskto'><Button onclick={props._handleTailoredClick} margin="3rem 0 0 0vw" bgColor="#f7e700" color="black" bold  fontWeight="600" borderRadius="5px" borderWidth="0" fontSizeDesktop="1.25rem">Create a Trip</Button></div> */}

             </ContentContainer>
              {/* <div className='hidden-mobile' style={{width: '100%'}}><NewSearchDesktop></NewSearchDesktop></div> */}
                {/* <Img src="https://d31aoa0ehgvjdi.cloudfront.net/media/website/Untitled design (1).png">
                </Img> */}
             {/* <div className='hidden-mobile' style={{width: '100%'}}><NewSearchDesktop></NewSearchDesktop></div> */}

        </Container>
    );

}

export default SearchFullImg;