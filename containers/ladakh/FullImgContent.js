import React, {useState} from 'react';
import styled from 'styled-components';
const FullImg= (props) => {
    const [showResult, setShowResult] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState(null);
    const Container = styled.div`
    width: 100%;
    margin: auto;
    height: max-content;
    text-align: center; 
    padding: 15vh 1rem 10vh 1rem;
    @media screen and (min-width: 768px){
      position: asbolute;
      padding-top: 10vh;

    }
    `;
    const Tagline = styled.h1`
    color: white;
    margin-bottom:  2.5rem ;
    text-align: center;
    width: 90%;
    font-weight: 700;
    margin: 0 auto 1rem auto;
    font-size: ${props => props.theme.fontsizes.mobile.headings.one};
    @media screen and (min-width: 768px){
      font-size: ${props => props.theme.fontsizes.desktop.headings.one};
      margin-bottom: 2rem;

    }
    `;
    const SubText = styled.h3`
    color: white;
        font-weight: 100;
        font-size: ${props => props.theme.fontsizes.mobile.text.one};
        margin-bottom: 3rem;
        @media screen and (min-width: 768px){
            font-size: ${props => props.theme.fontsizes.desktop.text.one};
            margin-bottom: 6rem;
        }

    `;
    const SearchContainer = styled.div`
    margin: 0 auto;
    @media screen and (min-width: 768px){
        width: max-content;
    }
    @media screen and (min-width: 768px) and (min-height: 1024px) {

    }
    `;
    const _changeResultHandler = (event, val)   => {
    }
    const _onChangeHandler = (event) => {
        setInputValue(event.target.value);
    }
    return(
        <Container className="center-div"> 
            <Tagline className="font-opensans">{props.tagline}</Tagline> 
            <SubText className="font-nunito">{props.text}</SubText>
        </Container>
    );

}

export default FullImg;