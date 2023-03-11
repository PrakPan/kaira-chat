import React, {useState, useEffect} from 'react';
import Row from '../../components/experiencecity/info/Row';

import InformationTextContainer from '../../components/experiencecity/info/InformationTextContainer';
import RouteData from './Locations';
import FoodsData from '../../components/experiencecity/info/foods/index';
// import YellowNavbar from './YellowNavbar';
import styled from 'styled-components';
import { Element } from 'react-scroll';
import Faqs from '../../components/experiencecity/info/faqs/Index';
import Banner from './Banner/Index';
import Howtoreach from '../../components/experiencecity/info/Howtoreach';
import { useRef } from 'react'
import PoisData from '../../components/experiencecity/info/pois/Index';
import ExperiencesBlog from '../../components/containers/ExperiencesBlog';
// import homepagecontent from '../../public/content/homepage';
const Details = (props) => {
  const [menuHeading, setMenuHeading] = useState('overview');
  let offsets = {

  }
  const [offset, setOffset] = useState(null);
  const inputRef = useRef()
  const howtoreach = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eros enim, lobortis quis velit in, commodo maximus risus. Morbi fringilla dui neque, eu ultrices tortor auctor in. <br></br> <p class='font-opensans'><b>By Air</b></p>How to reach by air<p class='font-opensans'><b>By Air</b></p>How to reach by air"
  const DetailsContainer = styled.div`
    width: 100%;
    margin: 0 auto 10vh auto;
    @media screen and (min-width: 768px) {
      width: 80%;
      padding: 0;
      margin: 0 auto 10vh auto;

    }
  `;


    useEffect(()=> {
         
            window.addEventListener('scroll', _handleScroll);
             return () => {
            window.removeEventListener('scroll', _handleScroll);
          }
    })
  const overviewRef = useRef();
  const routeRef = useRef();
  const howtoreachRef = useRef();
  const inclusionsRef = useRef();
  const exclusionsRef = useRef();
  const faqsRef = useRef();
  const thingsRef = useRef();

  const _handleScroll = () => {
    
    offsets={
            'Overview': overviewRef.current.offsetTop,
            'Route':  routeRef.current.offsetTop,
            'How to reach': howtoreachRef.current.offsetTop,
            'Inclusions' : inclusionsRef.current.offsetTop,
            'Exclusions': exclusionsRef.current.offsetTop,
            'Things to Do': thingsRef.current.offsetTop,
            'FAQ/s':  faqsRef.current.offsetTop
          }
      if(window.pageYOffset > 300 && !offset) setOffset(offsets);
  }

  return (
    <div >
      {/* <YellowNavbar   price={props.data.payment_info[0].total_cost}></YellowNavbar> */}
      {/* <PageNavigation price={props.data.payment_info[0].total_cost} /> */}
      {/* <HeaderExtraPadding></HeaderExtraPadding> */}
      <DetailsContainer>
        <div ref={overviewRef} >
        <Element id='overview' >
          <Row heading='Overview' top="0" padding="0 1rem">
            <InformationTextContainer
              type='text'
              text={props.data.short_description} ></InformationTextContainer>
          </Row>
        </Element>
        </div>
        <Element id='thingstodo' ref={thingsRef}>
          <Row heading='Things to Do' top="0" padding="0 1rem">
          <PoisData pois foods={props.data.pois}></PoisData>
          </Row>
        </Element>
          
        <div ref={inclusionsRef} >
        <Element id='inclusions'  >
          <Row heading="What to Eat" top="0" padding="0 1rem">
            <FoodsData foods={props.data.foods}></FoodsData>
          </Row>
        </Element>
        </div>
        <div ref={exclusionsRef} >
        <Element id='exclusions' >
          <Row heading="Getting Around" top="0" padding="0 1rem">
            <InformationTextContainer
              type='text'
              text={props.data.conveyance_available}></InformationTextContainer>
          </Row>
        </Element>
        </div>
        <div ref={routeRef} >
        <Element id='overview' >
          <Row heading='Survival Tips & Tricks' top="0" padding="0 1rem" >
            <InformationTextContainer
              type='text'
              text={props.data.survival_tips_and_tricks}></InformationTextContainer>
          </Row>
        </Element>
        </div>
        <div ref={howtoreachRef} >
        <Element id='howtoreach' >
          <Row  heading='Folklore or Story' top="0" padding="0 1rem">
          <InformationTextContainer
              type='text'
              text={props.data.folklore_or_story}></InformationTextContainer>
          </Row>
        </Element>
        </div>
     
   
  
   
     
        <div ref={faqsRef} >
      
        </div>
        <Element id='howtoreach' >
          <Row  heading='Experiences' top="0" padding="0 1rem">
          {/* <ExperiencesBlog  page="testimonials" review heading={homepagecontent["Inidan Review"].name} text={homepagecontent["Inidan Review"].summary} img={homepagecontent["Inidan Review"].image} margin="2.5rem 0" experiences={homepagecontent["Live a different lifestyle"]} ></ExperiencesBlog> */}
          </Row>
        </Element>
      </DetailsContainer>
      {window.innerWidth < 768 ? <Banner experienceLoaded={props.experienceLoaded} openBooking={props.openBooking} payment={props.payment} offsets={offset} locations={props.data.locations} heading={menuHeading} text="Some text here" buttontext="Buy Now" color="black" buttonbgcolor="#F7e700" onclick={props.openBooking}></Banner> : null}
    </div>
  );
};

export default React.memo(Details);
