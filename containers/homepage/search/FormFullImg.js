import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../../components/ui/button/Index';
import media from '../../../components/media';
// import {BsWhatsapp} from 'react-icons/bs';
// import urls from '../../services/urls';
// import Enquiry from './newenquiry/Index';
// import ImageLoader from '../../components/ImageLoader';
// import Banner from './BannerOne';
import TailoredForm from '../../../components/tailoredform/Index';
import Rolodex from '../../travelplanner/Rolodex';
 
import TailoredFormMobileModal from '../../../components/modals/TailoredFomrMobile';
  const Container = styled.div`
  color:white;
 width: 100%;
 display: grid;
text-align: center;
  @media screen and (min-width: 768px){
     width: 90%;
    text-align: left;
    margin: auto;
    
    grid-template-columns: auto 400px;
 
    }
`;

const Heading = styled.h1`
color: white;

width: 99%;
font-weight: 700;
margin-bottom: 1rem;
font-size: 2rem;

@media screen and (min-width: 768px){
  font-size: 3rem;
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
    padding: 0 0 0 0;


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
    const [showMoiblePlanner, setShowMobilePlanner] = useState(false);
    return (

        <Container className='font-lexend center-di text-cente'>
           <PaddingContianer >
            <Heading>{props.tagline}</Heading>
             
            <Rolodex></Rolodex>
          
                <div className='hidden-desktop'>
                <Button bgColor="#f7e700" borderRadius="10px" color="black" borderWidth="0" onclick={() => setShowMobilePlanner(true)} margin="1rem auto">Build Now</Button>
             </div>
                </PaddingContianer>
               {/* <Banner></Banner> */}
               <div className='hidden-mobile' style={{}}>
                <TailoredForm children_cities={props.children_cities} destination={props.destination} cities={props.cities}></TailoredForm>
                
                </div>
              
                {/* <div className='hidden-desktpo'>
                    <div style={{backgroundColor: 'white', zIndex:'2', height: '100vh', width: '100vw', position: 'fixed', top: '0'}}>
                        <TailoredForm children_cities={props.children_cities} destination={props.destination} cities={props.cities}></TailoredForm>
                    </div>
                </div> */}
                <TailoredFormMobileModal children_cities={props.children_cities} destination={props.destination} onHide={() => setShowMobilePlanner(false)}    cities={props.cities} show={showMoiblePlanner} ></TailoredFormMobileModal>
             
        </Container>
    );
}

export default FullImgContent;