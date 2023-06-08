import React from 'react';
// import Button from '../../components/Button';
import Button from '../../components/ui/button/Index';
import styled from 'styled-components';
import ImageLoader from '../../components/ImageLoader';
import urls from '../../services/urls';
const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-image:  url("https://d31aoa0ehgvjdi.cloudfront.net/media/website/worldMapYellow.jpg");
    background-color: rgba(100,100,100, 0.3);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

`;
const LinksContainer = styled.div`
    
    @media screen and (min-width: 768px){
        width: max-content;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 2rem;
    }
`;
const Heading = styled.div`
    font-size: 25vw;
    font-weight: 600;
    display: flex;
    line-height: 1;
    margin: 10vh 0;
    @media screen and (min-width: 768px){
        font-size: 15vw;

    }
`;
const Tagline = styled.p`
    font-weight: 100;
    font-size: 1.5rem;
    text-align: center;
    margin: 1rem;
`;


const NotFound = (props) => {
    const redirectToPage = (url) => {
        window.location.href = url; 
    }
 
  return(
    <Container className="center-div">
        <Heading className="font-opensnans">
            <div className="font-lexend" style={{margin: '0', display: 'inline', height: 'max-content', lineHeight: '1'}}>4</div>
        {/* <Icon src={alien}></Icon> */}
        <ImageLoader display="inline" url="media/website/404.svg" widthMobile='25vw' heightMobile="25vw" height="15vw" width="15vw" dimensions={{width: 800, height: 800}}></ImageLoader>
        <div className="font-lexend" style={{margin: '0',  display: 'inline', height: 'max-content',  lineHeight: '1'}}>4</div>

        </Heading>
        <Tagline className="font-nunito">We’re not on the same page, really.</Tagline>
        <LinksContainer>
        <Button borderWidth="1px" width="100%" margin=" 1rem 0" borderRadius="2rem" padding="0.25rem 1rem" boxShadow link={urls.HOMEPAGE} >Home</Button>
        <Button borderWidth="1px"  width="100%" borderRadius="2rem"  margin=" 1rem 0"padding="0.25rem 1rem" boxShadow link={urls.travel_experiences.BASE} >Experiences</Button>
        <Button borderWidth="1px"  width="100%"  borderRadius="2rem" margin=" 1rem 0" padding="0.25rem 1rem" boxShadow link={urls.CONTACT} >Contact Us</Button>
        </LinksContainer>

    </Container>
 
  );
}

export default NotFound;

