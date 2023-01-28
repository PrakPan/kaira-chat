import React, {useState, useEffect} from 'react';
import Row from '../../components/experiencecity/info/Row';

import InformationTextContainer from '../../components/experiencecity/info/InformationTextContainer';
import FoodsData from '../../components/experiencecity/info/foods/Index';
import styled from 'styled-components';
import { Element } from 'react-scroll';
import Banner from './Banner/Index';
import { useRef } from 'react'
import PoisData from '../../components/experiencecity/info/pois/Index';
import ExperiencesBlog from '../../components/containers/ExperiencesBlog';
import homepagecontent from '../../public/content/homepage';
import media from '../../components/media';
// import Heading from '../../components/heading/Heading';
import Heading from '../../components/newheading/heading/Index';
import Accordions from './Accordion';


const HeadingContainer = styled.div`
height: max-content;
position: sticky;
background-color:white;
padding-bottom: 0.5rem;
z-index: 1040;
width: 100%;
@media screen and (min-width: 768px){
    top: 15vh;
    z-index: 1;
}
`;
const Details = (props) => {
  let isPageWide = media('(min-width: 768px)')

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
  const thingsRef = useRef();
  const gettingAroundRef = useRef();
  const whattoeatRef = useRef();
  const survivalRef = useRef();
  const folkloreRef = useRef();
  const experiencesRef= useRef();

  const _handleScroll = () => {
     
    // offsets={
    //         'Overview': overviewRef.current.offsetTop,
    //         'Things to do':  thingsRef.current.offsetTop,
    //         'Getting Around': gettingAroundRef.current.offsetTop,
    //         'What to Eat' : whattoeatRef.current.offsetTop,
    //         'Survival Tips & Tricks': survivalRef.current.offsetTop,
    //         'Folklore or Story': folkloreRef.current.offsetTop,
    //         'Experiences':  experiencesRef.current.offsetTop
    //       }
    //   if(typeof window !=='undefined')
    //   if(window.pageYOffset > 300 && !offset) setOffset(offsets);
  }
  console.log(props.data)

  return (
    <div >
   
      {/* <DetailsContainer>
        <div ref={overviewRef} >
        <Element id='overview' >
          {props.data.short_description ? <Row heading='Overview' top={!isPageWide ? '0' : "12vh"} padding="0 1rem">
            <InformationTextContainer
              type='text'
              text={props.data.short_description} ></InformationTextContainer>
          </Row> : null}
        </Element>
        </div>
        <div  ref={thingsRef}>
         <Element id='thingstodo'>
         {props.data.pois.length ?<Row heading='Things to do' top={!isPageWide ? '0' : "12vh"} padding="0 1rem">
          <PoisData slug={props.slug} pois={props.data.pois} _openPoiModal={(poi) => props._openPoiModal(poi)} ></PoisData>
          </Row> : null}
        </Element> 
          </div>
   
        <div ref={gettingAroundRef} >
        <Element id='gettingaround' >
          {props.data.conveyance_available ? <Row heading="Getting Around" top={!isPageWide ? '0' : "12vh"} padding="0 1rem">
            <InformationTextContainer
              type='text'
              text={props.data.conveyance_available}></InformationTextContainer>
          </Row> : null}
        </Element>
        </div>
        <div ref={whattoeatRef} >
        <Element id='whattoeat'  >
          {props.data.foods.length ? <Row heading="What to Eat" top={!isPageWide ? '0' : "12vh"} padding="0 1rem">
            <FoodsData foods={props.data.foods}></FoodsData>
          </Row> : null}
        </Element>
        </div>
        <div ref={survivalRef} >
        <Element id='survival' >
          {props.data.survival_tips_and_tricks ? <Row heading='Survival Tips & Tricks' top={!isPageWide ? '0' : "12vh"} padding="0 1rem" >
            <InformationTextContainer
              type='text'
              text={props.data.survival_tips_and_tricks}></InformationTextContainer>
          </Row> : null}
        </Element>
        </div>
        <div ref={folkloreRef} >
        <Element id='folklore' >
          {props.data.folklore_or_story ? <Row  heading='Folklore or Story' top={!isPageWide ? '0' : "12vh"} padding="0 1rem">
          <InformationTextContainer
              type='text'
              text={props.data.folklore_or_story}></InformationTextContainer>
          </Row> : null}
        </Element>
        </div>
     
        <div ref={experiencesRef}>
      
        </div>
      </DetailsContainer> */}
      <Accordions folklore={props.data.folklore_or_story} survival_tips_and_tricks={props.data.survival_tips_and_tricks} foods={props.data.foods ? props.data.foods.length  ? props.data.foods : [] : []}conveyance_available={props.data.conveyance_available}  overview={props.data.short_description} pois={props.data.pois ? props.data.pois.length ? props.data.pois : [] : []} slug={props.slug}  _openPoiModal={(poi) => props._openPoiModal(poi)} ></Accordions>
     
      <div className='hidden-desktop'><Banner data={props.data} experienceLoaded={props.experienceLoaded} openBooking={props.openBooking} payment={props.payment} offsets={offset} locations={props.data.locations} heading={menuHeading} text="Some text here" buttontext="Buy Now" color="black" buttonbgcolor="#F7e700" onclick={props.openBooking}></Banner></div>
    </div>
  );
};

export default React.memo(Details);
