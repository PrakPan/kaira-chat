import React, {useState} from 'react';
import styled from 'styled-components';
import ImageGallery from './slider/ImageSlider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCog, faCalendarWeek, faTags, faCoins, faRupeeSign, faStar, faStarHalf} from '@fortawesome/free-solid-svg-icons';
import Button from '../../ui/button/Index';
import Link from 'next/link';
import media from '../../media';
import { useRouter } from 'next/router';
import { getIndianPrice } from '../../../services/getIndianPrice';
import urls from '../../../services/urls';
import * as ga from '../../../services/ga/Index'
import Spinner from '../../Spinner';
import Info from './info/Index';

const Container = styled.div`
width: 100%;
background-color: white;
box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
border-radius: 10px;
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

padding: 1rem 1.5rem; 
box-sizing: border-box;
@media screen and (min-width: 768px){
}
`;
 
 
 
 

 
 
const ExperienceCard= (props) => {
    let isPageWide = media('(min-width: 768px)')
 

const router = useRouter();
const _handleRedirect = () => {
  router.push('/travel-experiences/'+props.slug)
}
 
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
    return(
      <Container className="netflix-ite">
        <ImageContainer>
              <ImageGallery budget={props.budget} group_type={props.group_type}   locations={props.locations} duration_number={props.duration_number} duration_unit={props.duration_unit}  duration={props.duration} PW={props.PW} filter={props.filter} rating={props.rating} experience={props.experience} filter={props.filter} location={props.location} cost={props.cost} duration={props.duration} images={props.images} name={props.experience}></ImageGallery>
       </ImageContainer>  
       <ContentContainer className="text-cente">
        <Info id={props.id}  number_of_adults={props.number_of_adults}  starting_cost={props.starting_cost}></Info>
       
       </ContentContainer>
       <div className='font-opensans text-center' style={{background: 'white' , borderWidth: '1px',  fontWeight: '600', borderColor: '#e4e4e4', borderStyle: 'solid none none none', color: 'black', padding: '0.4rem', letterSpacing: '0.2em', fontSize: '0.75rem', borderRadius: '0px 0px 8px 8px' , boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
        {props.PW ? 'PW EXCLUSIVE - 50% OFF' : 'TTW EXCLUSIVE'}
        </div>
      </Container> 
  ); 
}
 
export default ExperienceCard;
