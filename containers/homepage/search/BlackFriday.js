import React, {useState} from 'react';
import styled from 'styled-components';

//  import NewSearchMobile from '../../../components/search/homepage/mobile/Index';
import NewSearchDesktop from '../../../components/search/homepage/desktop/Index';
import media from '../../../components/media';
import Button from '../../../components/ui/button/Index';
 
const Container = styled.div`
width: 100%;
 
height: max-content;
text-align: center; 

@media screen and (min-width: 768px){
  position: asbolute;
  

}
`;

const Tagline = styled.h1`
color: white;
text-align: center;
 font-weight: 800;
margin: 0rem 0 0.5rem 0;

font-size: 2.2rem;
@media screen and (min-width: 768px){
  font-size: 5rem;
  margin: 0 auto 1rem auto;
   font-weight: 700;
   width: 100%;

}
`;
const SubText = styled.h3`
color: white;
    font-weight: 100;
    width: 99%;
    line-height: 1;
    font-size: 1.5rem;
    margin-bottom: 0rem;
    @media screen and (min-width: 768px){
        font-size: 2rem;
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
const SearchFullImg= (props) => {
    let isPageWide = media('(min-width: 768px)')

    const [showResult, setShowResult] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState(null);
   
   
  
    return(
        <Container className="center-dv"> 
 <BlackContainer>
            <Tagline className="font-opensans">{props.tagline}</Tagline>
             <SubText className="font-nunito">{props.text}</SubText>
             </BlackContainer>
             <div className='hidden-mobile' style={{width: '100%'}}><NewSearchDesktop></NewSearchDesktop></div>

             <div className='hidden-desktop'><Button onclick={props._handleTailoredClick} margin="auto" bgColor="#f7e700" color="black" bold  fontWeight="600" borderRadius="5px" borderWidth="0" fontSizeDesktop="1.25rem">Create a Trip</Button></div>
        </Container>
    );

}

export default SearchFullImg;