import React from 'react';
import styled from 'styled-components';
// import Button from '../../components/ui/button/Index';
import ImageLoader from '../../components/ImageLoader';
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 3rem;
  margin: 1rem;
  @media screen and (min-width: 768px) {
    grid-template-columns: 10vw 10vw 10vw 10vw 10vw;
    grid-gap: 5vw;
    width: max-content;
    margin: 5vw auto;
  }
`;



const FullImgContent = (props) => {
    return (

        <Container className='font-lexend'>
            <div className='center-div'><ImageLoader
            url="media/website/b2b/PricewaterhouseCoopers_Logo.png" 
            /></div>
           <div className='center-div'><ImageLoader
            url="media/website/b2b/icons8-physics-wallah-240.svg" 
            /></div>
            <div className='center-div'><ImageLoader
            url="media/website/b2b/TEG Logo.png" 
            /></div>
            <div className='center-div'><ImageLoader
            url="media/website/b2b/SAMA Logo.jpeg" 
            /></div>
            <div className='center-div'><ImageLoader
            url="media/website/b2b/Goodwind.jpeg" 
            /></div>
        </Container>
    );
}

export default FullImgContent;