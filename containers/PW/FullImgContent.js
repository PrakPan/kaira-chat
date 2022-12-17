import React from 'react';
import styled from 'styled-components';
import Button from '../../components/ui/button/Index';
import media from '../../components/media';
import {BsWhatsapp} from 'react-icons/bs';
import urls from '../../services/urls';
import Enquiry from './newenquiry/Index';
import ImageLoader from '../../components/ImageLoader';
import Banner from './BannerOne';
const Container = styled.div`
    text-align: center;
 color:white;
 width: 100%;
 display: flex;
 flex-direction: column;
 @media screen and (min-width: 768px){
    padding: 0 7.5vh;
 
    }
`;
const Heading = styled.h1`
color: white;

width: 99%;
font-weight: 700;
margin-bottom: 1rem;
font-size: 2rem;
@media screen and (min-width: 768px){
  font-size: 4rem;
  font-weight: 700;

}
`;
const SubText = styled.h3`
color: white;
    font-weight: 100;
    width: 99%;
    font-size: 1.2rem;
     @media screen and (min-width: 768px){
        font-size: 2rem;
     }

`;

const PaddingContianer = styled.div`
padding: 5vh 0 0 0;
flex-grow: 1;
@media screen and (min-width: 768px){
    padding: 10vh 0 0 0;

}
`
const LogosContainer = styled.div`
display: grid;
grid-template-columns: max-content max-content;
width: max-content;
margin: auto;
 grid-gap: 0.5rem;
 padding-bottom: 0.5rem;


@media screen and (min-width: 768px){
 }
`
;
const LogoText = styled.div`
font-size: 12px;
color: black; 
display : flex;
 align-items: center;

 font-weight: 800;
@media screen and (min-width: 768px){
    font-size: 18px;

}
`;
const FullImgContent = (props) => {
    let isPageWide = media('(min-width: 768px)');

    return (

        <Container className='font-opensans center-di text-center'>
           <PaddingContianer >
            <Heading>Physics Wallah Holidays</Heading>
            <SubText>
                {/* <span style={{marginLeft: '6px', fontWeight: '800'}}>TTWxPW</span> */}
                50% amount of your holiday will be paid by Physics Wallah
            </SubText>
           {/* <SubText>Get Benefit of Exclusive Festive Offers</SubText>  */}
           
            <Button  onclick={isPageWide ? ()=> window.scrollTo(0,window.innerHeight) : ()=> window.scrollTo(0,window.innerHeight*0.7)  } onclickparams={null}  fontSizeDesktop="1.25rem" link="/" margin={"1rem auto 0 auto"} marginMobile="1.5rem auto" bgColor="#f7e700" borderRadius="10px" lineHeight="1"  hoverBgColor="black" hoverColor="white" borderWidth="0px" fontWeight="600" padding="0.75rem 1.5rem">
                {/* <BsWhatsapp style={{fontSize: '1.5rem', margin: '-0.125rem 0.25rem 0 0'}}> </BsWhatsapp> */}
                View Trips</Button>
                </PaddingContianer>
               {/* <Banner></Banner> */}
               <LogosContainer>
            <div style={{backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', padding: '0.5rem', borderRadius: '5px'}}>
                <ImageLoader leftalign url="media/website/pwlogo.png" width="3rem" widthmobile="2rem" height="auto"></ImageLoader>
                <LogoText className="font-opesans hden-mobile" style={{}}>Physics Wallah</LogoText>
                </div>
                <div style={{backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', padding: '0.5rem', borderRadius: '5px'}}>
                <ImageLoader leftalign url="media/website/logoblack.svg" width="3rem" widthmobile="2rem"  height="auto"></ImageLoader>
                <LogoText className="font-opesans hiden-mobile" style={{}}>The Tarzan Way</LogoText>
                </div>
            </LogosContainer>
        </Container>
    );
}

export default FullImgContent;