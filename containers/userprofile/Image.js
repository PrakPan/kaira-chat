import React from 'react';
import styled from 'styled-components';

const Image = () => {
  // background-image: linear-gradient(rgba(0, 0, 0, 0.5),
  //   rgba(0, 0, 0, 0.5)), url(${img});
    const HeaderHeight = localStorage.getItem('Header') + "px";
    const Container = styled.div`
    
    width: 100%;
    height: 40vh;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    padding: 66px 0;
    text-align: center;
    @media screen and (min-width: 768px){
        height: 50vh;
    }`;
    const LetsTalk = styled.h1`
        font-size: ${props => props.theme.fontsizes.desktop.headings.three};
        color: white;
        @media screen and (min-width: 768px){
          font-size: ${props => props.theme.fontsizes.desktop.headings.one};

        }
    `;

  return(
    <Container>
    </Container>
  );
}

export default Image;
