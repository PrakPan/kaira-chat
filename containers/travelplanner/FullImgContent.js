import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/ui/button/Index';
import media from '../../components/media';
import {BsWhatsapp} from 'react-icons/bs';
// import urls from '../../services/urls';
// import Enquiry from './newenquiry/Index';
// import ImageLoader from '../../components/ImageLoader';
// import Banner from './BannerOne';
import TailoredForm from '../../components/tailoredform/Index';
import Rolodex from './Rolodex';
import ImageLoader from '../../components/ImageLoader';
 import {IoLogoWhatsapp} from 'react-icons/io'
import urls from '../../services/urls';
// import TailoredFormMobileModal from '../../components/modals/TailoredFomrMobile';
  const Container = styled.div`
  color:white;
 width: 100%;
 display: grid;
text-align: center;
position : relative;
  @media screen and (min-width: 768px){
    padding: 0;
    width: 90%;
    text-align: left;
    margin:  auto;
    grid-template-columns: auto 400px;
 
    }
`;
const Heading = styled.h1`
color: white;

width: 99%;
font-weight: 800;
margin-bottom: 1rem;
font-size: 35px;
@media screen and (min-width: 768px){
  font-size: 55px;
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
    padding: 1vh 0 0 0;


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

const IconText = styled.div`
font-size: 12px;
display : flex;
 align-items: center;
 text-align : center;
color : black;
    font-weight: 600;
    margin-top : 7px;
@media screen and (min-width: 768px){
    font-size: 16px;

}
`


const SubHeading = styled.div`
    font-size : 16px;
    line-height : 20px;
    font-weight : 400;
    @media screen and (min-width: 768px){
    font-size: 28px;
    line-height : 35px;

}
`
const IconsContainer = styled.div`
display : flex;
filter: invert(100%);
justify-content : space-between;
position : absolute;
bottom : 10px;
width : 100%;
padding-inline : 10px;
@media screen and (min-width: 768px){
width : 40%;
// bottom : -20%;
}

`
const FullImgContent = (props) => {
    let isPageWide = media('(min-width: 768px)');
    // const [showMoiblePlanner, setShowMobilePlanner] = useState(false);
// console.log('', props.children_cities)
    return (

        <Container className='font-lexend center-di text-cente'>
           <PaddingContianer >
            <Heading>{props.title}</Heading>
           {isPageWide?<SubHeading>Bid farewell to generic holiday packages.<br/>
Craft AI-personalized itineraries.</SubHeading> : <SubHeading>Say goodbye to packages.<br />
Craft AI-personalized itineraries.</SubHeading>}
            <div className='hidden-mobile'>
            {/* <Button  padding="0.75rem 1rem" fontSize="16px" fontWeight="600" bgColor="#f7e700" hoverBgColor="rgba(0, 0, 0, 0.6)" borderRadius="10px" color="black" borderWidth="0" margin='3rem 0rem' onclick={()=>window.location.href=urls.WHATSAPP+"?text=Hey, I need help planning my trip."}>Whatsapp now! <IoLogoWhatsapp style={{margin : '2px 0px 5px 8px' , fontSize : '1.5rem'}}/></Button> */}

            </div>
            {/* <SubText>As per your 
                <span style={{marginLeft: '6px', fontWeight: '800'}}>budget</span>
            </SubText> */}
            {/* <Rolodex></Rolodex> */}
           {/* <SubText>Get Benefit of Exclusive Festive Offers</SubText>  */}
           
            {/* <Button  onclick={isPageWide ? ()=> window.scrollTo(0,window.innerHeight) : ()=> window.scrollTo(0,window.innerHeight*0.7)  } onclickparams={null}  fontSizeDesktop="1.25rem" link="/" margin={"1rem auto 0 auto"} marginMobile="1.5rem auto" bgColor="#f7e700" borderRadius="10px" lineHeight="1"  hoverBgColor="black" hoverColor="white" borderWidth="0px" fontWeight="600" padding="0.75rem 1.5rem">
                <BsWhatsapp style={{fontSize: '1.5rem', margin: '-0.125rem 0.25rem 0 0'}}> </BsWhatsapp>
                View Trips</Button> */}
                <div className='hidden-desktop'>
                <Button padding="0.75rem 1rem" fontSize="14px" fontWeight="500" bgColor="#f7e700" borderRadius="10px" color="black" borderWidth="1px" onclick={() => props.setShowMobilePlanner(true)} margin="1rem auto 1rem auto">Start Planning</Button>
             </div>
                </PaddingContianer>
               {/* <Banner></Banner> */}
               <div className='hidden-mobile' style={{ }}>
                <TailoredForm destionType={'state'} page_id={props.page_id} children_cities={props.children_cities} destination={props.destination} cities={props.cities}></TailoredForm>
                
                </div>
              
                {/* <div className='hidden-desktpo'>
                    <div style={{backgroundColor: 'white', zIndex:'2', height: '100vh', width: '100vw', position: 'fixed', top: '0'}}>
                        <TailoredForm children_cities={props.children_cities} destination={props.destination} cities={props.cities}></TailoredForm>
                    </div>
                </div> */}
             
             <IconsContainer>
                <div>
                <ImageLoader height="2.5rem" width="2.5rem" widthmobile="2.5rem" url='media/icons/general/travel.png' />
                <IconText>Free Personalized <br/> Itineraries</IconText>
                </div>
                <div>
                <ImageLoader height="2.5rem" width="2.5rem" widthmobile="2.5rem" url='media/icons/general/booking.png' />
                <IconText>Fast, Flexible <br/> Bookings</IconText>
              
                </div>
                <div>
                <ImageLoader height="2.5rem" width="2.5rem" widthmobile="2.5rem" url='media/icons/general/money.png' />
                <IconText>No hidden <br />commissions</IconText>
              
                </div>
                
             </IconsContainer>

        </Container>
    );
}

export default FullImgContent;
