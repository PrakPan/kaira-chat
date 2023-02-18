import React, {useState} from 'react';
import styled, {keyframes} from 'styled-components';
import ImageGallery from './slider/ImageSlider';
    import media from '../../media';
import { useRouter } from 'next/router';
 import urls from '../../../services/urls';
import * as ga from '../../../services/ga/Index'
 import Info from './info/Index';
const fadeInAnimation = keyframes`${fadeIn}`;
import { fadeIn } from 'react-animations'
import Summary from './Summary';
import Cost from './info/Cost';
import Button from '../../ui/button/Index';
const Container = styled.div`
width: 100%;
animation: 1s ${fadeInAnimation};
display: flex;
flex-direction: column;
background-color: white;
box-shadow: 0px 3px 0px 0px rgba(240, 240, 240, 1);
border-radius: 10px;
border: 1.5px solid rgba(236, 234, 234, 1);
  @media screen and (min-width: 768px){
    &:hover{
      cursor: pointer;
    }
  }

`;
const ImageContainer = styled.div`
position: relative;
text-align: center;
color: white;
`;


 
const ContentContainer = styled.div`
width: 100%;

padding: 0.75rem 0.75rem; 
box-sizing: border-box;
@media screen and (min-width: 768px){
}
`;
 
 
 
 

 
 
const ExperienceCard= (props) => {
    let isPageWide = media('(min-width: 768px)')
 

const router = useRouter();
 
 
const [loading, setLoading] = useState(false);

const redirect = () => {
  setLoading(true);
  router.push(urls.travel_experiences.BASE+props.slug)
  // setLoading(false)
}
 const _handleClick = () => {
  setLoading(true);
 

  setTimeout(redirect, 1000);
  
  ga.callback_event({
    action: 'CC-'+props.experience,
    
    callback: redirect,
  })
}
const _handleRedirect = () => {
  if(props.PW) router.push('/itinerary/physicswallah/'+props.id);
  else router.push('/itinerary/'+props.id)
 }
 const FONT_SIZES_DESKTOP = ['20px'];
     return(
      <Container className="netflix-ite" onClick={_handleRedirect}>
        <ImageContainer>
              <ImageGallery duration_number={props.duration_number ? props.duration_number : null} duration={props.duration}  images={props.images} ></ImageGallery>
       </ImageContainer> 
       <ContentContainer className="text-cente">
        <Info PW={props.PW} owner={props.data.owner} user_name={props.data.user_name} locations={props.locations} FONT_SIZES_DESKTOP={FONT_SIZES_DESKTOP} name={props.data ? props.data.name : props.name} PW={props.PW} id={props.id}  number_of_adults={props.number_of_adults}  starting_cost={props.starting_cost}></Info>

       </ContentContainer>
       {props.data ? props.data.payment_info ? props.data.payment_info.summary ? <Summary summary={props.data.payment_info.summary}></Summary> : null : null : null}
 
{/*       
       <div className='font-opensans text-center' style={{background: 'white' , borderWidth: '1px',  fontWeight: '400', borderColor: '#e4e4e4', borderStyle: 'solid none none none', color: 'black', padding: '0.4rem', letterSpacing: '0.2em', fontSize: '12px', borderRadius: '0px 0px 8px 8px' , boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
        {props.PW ? 'PW EXCLUSIVE - 50% OFF' : !props.myplan ? props.data ? props.data.user_name && props.data.user_name !== 'Physics wallah' && props.data.user_name!=='TTW' && props.data.user_name!=="TTW Exclusive" ? 'Created by ' + props.data.user_name :  'TTW EXCLUSIVE' : 'TTW EXCLUSIVE' : 'ITINERARY STATUS'}

        </div> */}
        <ContentContainer style={{display: 'flex', flexGrow: '1', flexDirection: 'column', justifyContent: 'flex-end'}}>
        <Cost PW={props.PW} starting_cost={props.starting_cost}></Cost>
        <Button borderRadius="6px" onclick={_handleRedirect} fontSizeDesktop="12px" borderWidth="1.25px" width="100%" fontWeight="600" bgColor="#f7e700">View Details</Button>
        </ContentContainer>
      </Container> 
  ); 
}
 
export default ExperienceCard;
