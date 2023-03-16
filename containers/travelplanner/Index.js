import React, {useState, useRef, useEffect, createRef} from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled, { keyframes } from 'styled-components';
import FullImage from '../../components/FullImage';
 import DesktopBanner from '../../components/containers/Banner';
import Experiences from '../../components/containers/Experiences';
  
 import AsSeenIn from '../testimonial/AsSeenIn';
//  import Heading from '../../components/newheading/heading/Index';
  import HowItWorks from '../../components/containers/HowItWorksSlideshow';

import media from '../../components/media';
  import * as ga from '../../services/ga/Index';
  import BannerTwo from './BannerTwo';
  import ChatWithUs from '../../components/containers/ChatWithUs/ChatWithUs';
import FullImgContent from './FullImgContent';
 import Reviews from './CaseStudies/Index';
 import Menu from './Menu';
import axiossearchinstance from '../../services/sales/search/Search';
import ExperienceCard from '../../components/cards/newitinerarycard-main/ExperienceCard';
import gif from '../../public/assets/loader.gif';
import Overview from './Overview';
import Button from '../../components/ui/button/Index';
import TailoredFormMobileModal from '../../components/modals/TailoredFomrMobile';
import {IoIosArrowBack} from 'react-icons/io'
import urls from '../../services/urls';
import Locations from '../../components/containers/newplannerlocations/Index';
import OldLocations from '../../components/containers/plannerlocations/Index';
import MobileBanner from './MobileBanner'
import PLANNER_PAGES from '../../public/content/planner';
import Map from './NewMap';
import WhyPlanWithUs from './PlanWithUs';
import WhatsappFloating from '../../components/WhatsappFloating'
import Carousel from '../../components/FlickityCarousel'
// import Experiences from '../../components/containers/Experiences';
// import qs from qs;
var qs = require('qs');

const SetWidthContainer = styled.div`
width: 100%;
margin: auto;
@media screen and (min-width: 768px){
  width: 85%;
}
`;


const HowItWorksText = styled.p`
font-size: 1rem;
 width: 100%;
margin: 0 0;
font-weight: 300;

@media screen and (min-width: 768px){
  font-size: 1.25rem;
  font-weight: 300;
  margin: 0 0;

}
`;

const MapGridContainer = styled.div`
    
    display: grid;
    grid-gap: 30px;

    @media screen and (min-width: 768px){
        width: 100%;

        grid-template-columns: auto 300px;
        grid-gap: 40px;
        margin: 0 auto 0 auto;
    }
`;
const MapContainer = styled.div`

@media screen and (min-width: 768px){
  padding-top: 108px;
}
`;

const HowItWorksHeading = styled.p`
     font-weight: 600;
    margin: 1rem 0 0.5rem 0;
    @media screen and (min-width: 768px){
      font-size: 1.25rem;
      margin: 2rem 0 0.5rem 0;

    }
`;

const GridContainer = styled.div`
display: grid;
padding: 1rem;
grid-gap: 1rem;


@media screen and (min-width: 768px){
  padding:  1rem 0;
  grid-gap: 1.5rem;
  grid-template-columns: 1fr 1fr 1fr;
}
`;
const MinHeightContainer = styled.div`
min-height: 40vh;

@media screen and (min-width: 768px){
  min-height: 40vh;
}
`;
const Heading = styled.h2`
font-size: 32px;
font-weight: 700;
margin: 1.5rem 0.5rem;
text-align: center;

@media screen and (min-width: 768px){
  text-align: left;
  margin: 3.5rem 0rem;

}
`;
const  Homepage = (props) =>{
   
			
let isPageWide = media('(min-width: 768px)');

// const [loading, setLoading] = useState(true);
const [itinerariesExclusiveJSX, setItinerariesExclusiveJSX] = useState([]);
 const [itinerariesCustomerJSX, setItinerariesCustomerJSX] = useState([]);
const [itinerariesToShowCustomerJSX, setItinerariesToShowCustomerJSX] = useState([]);
const [filters, setFilters] = useState({
  'Trek': true,
  'Road Trip': true,
}
) 


//  useEffect(() => {
 
//   let itineraries_exclusive = [];
//   let itineraries_customer = [];

//  let locations = [];
// try{
// for(var i = 0 ; i < props.experienceData.locations.length; i++ ){
//   locations.push(props.experienceData.locations[i].name);
// }
// }catch{

// }
//   axiossearchinstance.post(`?search_type=itinerary&owner=TTW&limit=9&offset=`+offsetExclusive, { 
//     "city_list": locations
//    }).then(res => {
//     setLoading(false);
//     console.log(res.data)
//      for(var i =0 ; i<res.data.results.length; i++){
//        itineraries_exclusive.push(
//       <ExperienceCard 
//           data={res.data.results[i]}
//          key={res.data.results[i].short_text}
//          hardcoded={res.data.results[i].payment_info ?true : false }
//          filter={res.data.results[i].experience_filters ? res.data.results[i].experience_filters[0] : null}
//          rating={res.data.results[i].rating}
//          slug={res.data.results[i].slug}
//          id={res.data.results[i].id}
//          number_of_adults={res.data.results[i].number_of_adults}
//          locations={res.data.results[i]["itinerary_locations"]}
//          text={res.data.results[i].short_text} 
//          experience={res.data.results[i].name}
//          cost={res.data.results[i].payment_info ? res.data.results[i].payment_info.length ? res.data.results[i].payment_info[0].cost : null: null}
//          duration_number={res.data.results[i].duration_number}
//          duration_unit={res.data.results[i].duration_unit}
//         location={res.data.results[i]["experience_region"]}
//          starting_cost={res.data.results[i].payment_info?   res.data.results[i].payment_info.per_person_total_cost : res.data.results[i].starting_price }
//        images={res.data.results[i].images}></ExperienceCard>
//       )
 
//     }
   
//     setItinerariesExclusiveJSX(itineraries_exclusive.slice());
 
//     setOffsetExclusive(offsetExclusive+res.data.results.length);
//     if(!res.data.next) setOffsetExclusive(-1);
 
//     // setItinerariesToShowExclusiveJSX(itineraries_exclusive.slice(0,9));
 
//   }).catch(err => {
//     setLoading(false);

//   });

//   axiossearchinstance.post(`?search_type=itinerary&owner=USER`, { 
//     "city_list": locations
//    }).then(res => {
//     setLoading(false);
//      for(var i =0 ; i<res.data.length; i++){
  
//       itineraries_customer.push(
//         <ExperienceCard 
//             data={res.data[i]}
//            key={res.data[i].short_text}
//            hardcoded={res.data[i].payment_info ?true : false }
//            filter={res.data[i].experience_filters ? res.data[i].experience_filters[0] : null}
//            rating={res.data[i].rating}
//            slug={res.data[i].slug}
//            id={res.data[i].id}
//            number_of_adults={res.data[i].number_of_adults}
//            locations={res.data[i]["itinerary_locations"]}
//            text={res.data[i].short_text} 
//            experience={res.data[i].name}
//            cost={res.data[i].payment_info ? res.data[i].payment_info.length ? res.data[i].payment_info[0].cost : null: null}
//            duration_number={res.data[i].duration_number}
//            duration_unit={res.data[i].duration_unit}
//           location={res.data[i]["experience_region"]}
//            starting_cost={res.data[i].payment_info?   res.data[i].payment_info.per_person_total_cost : res.data[i].starting_price }
//          images={res.data[i].images}></ExperienceCard>
//         )
//     }
   
//      setItinerariesCustomerJSX(itineraries_customer);

//      setOffsetCustomer(9);

//      setItinerariesToShowCustomerJSX(itineraries_customer.slice(0,9));

//   }).catch(() => {
//     setLoading(false);

//   });
//  }, [props.experienceData])
 const [itinerariesToIndexExclusive, setItinerariesToIndexExclusive] = useState([]);
 const [itinerariesToIndexCustomer, setItinerariesToIndexCusstomer] = useState([]);
// console.log(props.experienceData);
 useEffect(() => {
  let iti_exclusive =[];
  let iti_customer  = [];
   try{
  for(var i =0; i< props.experienceData.itinerary_data.length; i++){
    if(props.experienceData.itinerary_data[i].owner==='TTW')
    iti_exclusive.push(
      <ExperienceCard 
            data={props.experienceData.itinerary_data[i]}
           key={props.experienceData.itinerary_data[i].short_text}
           hardcoded={props.experienceData.itinerary_data[i].payment_info ?true : false }
           filter={props.experienceData.itinerary_data[i].experience_filters ? props.experienceData.itinerary_data[i].experience_filters[0] : null}
           rating={props.experienceData.itinerary_data[i].rating}
           slug={props.experienceData.itinerary_data[i].slug}
           id={props.experienceData.itinerary_data[i].id}
           number_of_adults={props.experienceData.itinerary_data[i].number_of_adults}
           locations={props.experienceData.itinerary_data[i]["itinerary_locations"]}
           text={props.experienceData.itinerary_data[i].short_text} 
           experience={props.experienceData.itinerary_data[i].name}
           cost={props.experienceData.itinerary_data[i].payment_info ? props.experienceData.itinerary_data[i].payment_info.length ? props.experienceData.itinerary_data[i].payment_info[0].cost : null: null}
           duration_number={props.experienceData.itinerary_data[i].duration_number}
           duration_unit={props.experienceData.itinerary_data[i].duration_unit}
          location={props.experienceData.itinerary_data[i]["experience_region"]}
           starting_cost={props.experienceData.itinerary_data[i].payment_info?   props.experienceData.itinerary_data[i].payment_info.per_person_total_cost : props.experienceData.itinerary_data[i].starting_price }
         images={props.experienceData.itinerary_data[i].images}></ExperienceCard>
    )
    else 
    iti_customer.push(
      <ExperienceCard 
            data={props.experienceData.itinerary_data[i]}
           key={props.experienceData.itinerary_data[i].short_text}
           hardcoded={props.experienceData.itinerary_data[i].payment_info ?true : false }
           filter={props.experienceData.itinerary_data[i].experience_filters ? props.experienceData.itinerary_data[i].experience_filters[0] : null}
           rating={props.experienceData.itinerary_data[i].rating}
           slug={props.experienceData.itinerary_data[i].slug}
           id={props.experienceData.itinerary_data[i].id}
           number_of_adults={props.experienceData.itinerary_data[i].number_of_adults}
           locations={props.experienceData.itinerary_data[i]["itinerary_locations"]}
           text={props.experienceData.itinerary_data[i].short_text} 
           experience={props.experienceData.itinerary_data[i].name}
           cost={props.experienceData.itinerary_data[i].payment_info ? props.experienceData.itinerary_data[i].payment_info.length ? props.experienceData.itinerary_data[i].payment_info[0].cost : null: null}
           duration_number={props.experienceData.itinerary_data[i].duration_number}
           duration_unit={props.experienceData.itinerary_data[i].duration_unit}
          location={props.experienceData.itinerary_data[i]["experience_region"]}
           starting_cost={props.experienceData.itinerary_data[i].payment_info?   props.experienceData.itinerary_data[i].payment_info.per_person_total_cost : props.experienceData.itinerary_data[i].starting_price }
         images={props.experienceData.itinerary_data[i].images}></ExperienceCard>
    )

  }
  setItinerariesToIndexExclusive(iti_exclusive.slice());
  setItinerariesToIndexCusstomer(iti_customer.slice());

  // setOffsetExclusive(iti.length);
} catch{

}
}, [])

 const [offsetExclusive, setOffsetExclusive] = useState(0);
 const [offsetCustomer, setOffsetCustomer] = useState(0);

const _showMoreExclusiveItineraries = () => {
  // if(offsetExclusive > itinerariesExclusiveJSX.length) return 0 ;
  // else {
    // let itineraries = itinerariesExclusiveJSX.slice();
    //  for(var i = offsetExclusive; i < offsetExclusive + 9 ; i++ ){
    //   itineraries.push(itinerariesExclusiveJSX[i]);
    // }
    // setOffsetExclusive(offsetExclusive+9);
    // setItinerariesToShowExclusiveJSX(itineraries)
    let itineraries = itinerariesExclusiveJSX.slice();
setLoading(true);
    let locations = [];
try{
for(var i = 0 ; i < props.experienceData.locations.length; i++ ){
  locations.push(props.experienceData.locations[i].name);
}
}catch{

}
  axiossearchinstance.post(`?search_type=itinerary&owner=TTW&limit=9&offset=`+offsetExclusive, { 
    "city_list": locations
   }).then(res => {
    setLoading(false);
    // console.log(res.data)
     for(var i =0 ; i<res.data.results.length; i++){
       itineraries.push(
      <ExperienceCard 
          data={res.data.results[i]}
         key={res.data.results[i].short_text}
         hardcoded={res.data.results[i].payment_info ?true : false }
         filter={res.data.results[i].experience_filters ? res.data.results[i].experience_filters[0] : null}
         rating={res.data.results[i].rating}
         slug={res.data.results[i].slug}
         id={res.data.results[i].id}
         number_of_adults={res.data.results[i].number_of_adults}
         locations={res.data.results[i]["itinerary_locations"]}
         text={res.data.results[i].short_text} 
         experience={res.data.results[i].name}
         cost={res.data.results[i].payment_info ? res.data.results[i].payment_info.length ? res.data.results[i].payment_info[0].cost : null: null}
         duration_number={res.data.results[i].duration_number}
         duration_unit={res.data.results[i].duration_unit}
        location={res.data.results[i]["experience_region"]}
         starting_cost={res.data.results[i].payment_info?   res.data.results[i].payment_info.per_person_total_cost : res.data.results[i].starting_price }
       images={res.data.results[i].images}></ExperienceCard>
      )
 
    }
   
    setItinerariesExclusiveJSX(itineraries.slice());
 
    setOffsetExclusive(itineraries.length);
 
    // setItinerariesToShowExclusiveJSX(itineraries_exclusive.slice(0,9));
 
  }).catch(err => {
    setLoading(false);

  });

  // }
}

const _showMoreCustomerItineraries = () => {
  if(offsetCustomer > itinerariesCustomerJSX.length) return 0 ;
  else {
    let itineraries = itinerariesToShowCustomerJSX.slice();
    // console.log('itineraries_length' , itineraries.length)
    for(var i = offsetCustomer; i < offsetCustomer + 9 ; i++ ){
      itineraries.push(itinerariesCustomerJSX[i]);
    }
    setOffsetCustomer(offsetCustomer+9);
    setItinerariesToShowCustomerJSX(itineraries)
  }
}
//JSX for How it works 

const HowitWorksHeadingsArr=[
  <HowItWorksHeading className="font-opensans">You select</HowItWorksHeading>,
  <HowItWorksHeading className="font-opensans">We prepare</HowItWorksHeading>,
  <HowItWorksHeading className="font-opensans">You make memories</HowItWorksHeading>,
];
const HowitWorksContentsArr = [
  <HowItWorksText className="font-opensans">A short trek, a long honeymoon, a workcation, or personalize your own</HowItWorksText>,
    <HowItWorksText  className="font-opensans">A completely personalized plan by our travel experts and software</HowItWorksText>,
  <HowItWorksText  className="font-opensans">Enough planning, time to travel and make unforgettable memories</HowItWorksText>

];
const howitworksimgs = ['media/website/whyus-1.webp', 'media/website/whyus-2.webp', 'media/website/whyus-3.webp']


const router = useRouter()

const [desktopBannerLoading, setDesktopBannerLoading] = useState(false);


const _handleTailoredRedirect = () => {
  if(props.experienceData.destination)
  router.push('/tailored-travel?search_text='+props.experienceData.destination)
  else   router.push('/tailored-travel')

}
const _handleTailoredClick = () => {
  setDesktopBannerLoading(true);
  setTimeout(_handleTailoredRedirect, 1000);

  ga.callback_event({
    action: 'TT-Desktopbanner',
    
    callback: _handleTailoredRedirect,
  })

}
const [overviewHeading, setOverviewHeading] = useState(null);
const [showMoiblePlanner, setShowMobilePlanner] = useState(false);

useEffect(() => {
  // The counter changed!
  setOverviewHeading(props.experienceData.overview_heading)
}, [router.query.link, props.experienceData])

    return (
    <div className={  "Homepage"  } id="homepage-anchor" style={{visibility: props.hidden ? 'hidden' : 'visible'}}>
      <FullImage height='38rem' url={props.experienceData.image} filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))"  >
          <FullImgContent setShowMobilePlanner={setShowMobilePlanner}  page_id={props.experienceData.id} destination={props.experienceData.destination} cities={props.experienceData.locations} children_cities={props.experienceData.children} title={props.experienceData.banner_heading}/>
      </FullImage>
      <SetWidthContainer>
<MapGridContainer>
  <Overview  locations={props.experienceData.locations} overview_heading={overviewHeading} overview_text={props.experienceData.overview_text}></Overview>
  <MapContainer>
    <Map locations={props.experienceData.locations}></Map>
    </MapContainer>
  </MapGridContainer>
  <Button  link={isPageWide? '/tailored-travel' : null} onclick={ !isPageWide? () => setShowMobilePlanner(true) : null}   borderWidth="1px"  fontWeight="600" borderRadius="6px" margin="2rem auto" padding="0.5rem 2rem" >Create your travel plan now!</Button> 

  </SetWidthContainer>
<SetWidthContainer>

<Heading align="left" style={{ margin:"3.5rem 0 3.5rem 0"}}>How it works?</Heading>       
<div><BannerTwo page_id={props.experienceData.id} _handleTailoredRedirect={_handleTailoredRedirect}  destination={props.experienceData.destination} cities={props.experienceData.locations} ></BannerTwo></div>


  {itinerariesToIndexCustomer.length ? <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "2.5rem 0 2.5rem 0"}  bold>{'Trips by our users'}</Heading>    : null}     
  {/* {itinerariesToIndexCustomer.length ? 
  <GridContainer>
    { itinerariesToIndexCustomer}
 
  </GridContainer> : null
  }
   */}
   {
    itinerariesToIndexCustomer.length ? <Experiences experiences={props.experienceData.itinerary_data}></Experiences>:null
   }
                <Button  link={isPageWide? '/tailored-travel' : null} onclick={ !isPageWide? () => setShowMobilePlanner(true) : null} borderWidth="1px" fontWeight="600" borderRadius="6px" margin="2rem auto" padding="0.5rem 2rem" >Unlock your adventure</Button> 

  {/* {
    !loading  && itinerariesCustomerJSX.length && (itinerariesCustomerJSX.length >=  offsetCustomer)? <Button margin="0 auto 1rem auto" borderWidth="1px" borderRadius="6px" fontSizeDesktop="12px" fontWeight="600"padding="0.5rem 2rem" onclick={_showMoreCustomerItineraries} >View More</Button> 
    : null
  } */}
     
       <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "2.5rem 0 4.5rem 0"}  bold>{props.experienceData.destination ? "Top locations across "+props.experienceData.destination : "Top Locations"}</Heading>        
 <Locations locations={props.experienceData.locations} viewall ></Locations>
 {/* <Carousel cards={props.experienceData.locations} /> */}

</SetWidthContainer>
 {/* <Map locations={props.experienceData.locations}></Map> */}
    <DesktopBanner loading={desktopBannerLoading} onclick={_handleTailoredClick} text={`Craft a personalized itinerary to ${props.experienceData.destination} now!`}></DesktopBanner>
    <div className='hidden-desktop'><MobileBanner handleClick={() => setShowMobilePlanner(true)} city={props.experienceData.destination} /></div>
      <SetWidthContainer >
      <Heading >Other Destinations</Heading>        
      <OldLocations locations={PLANNER_PAGES} viewall planner></OldLocations>

         {/* <Heading align="center" aligndesktop="center" margin={!isPageWide  ? "2.5rem 0.5rem" : "4rem"} thincaps >HOW IT WORKS?</Heading> */}
        {/* <HowItWorks onclick={_handleTailoredRedirect} images={howitworksimgs} content={HowitWorksContentsArr} headings={HowitWorksHeadingsArr}></HowItWorks> */}
        
        <Heading style={{ margin:"3.5rem 0 3.5rem 0"}}>Why plan with us?</Heading>        
        <WhyPlanWithUs page_id={props.experienceData.id} _handleTailoredRedirect={_handleTailoredRedirect}  destination={props.experienceData.destination} cities={props.experienceData.locations} />


        <Heading style={{ margin:"4rem 0 2.5rem 0"}}>What our customers say?</Heading>        
       <Reviews></Reviews>

        {/* <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Unique Andaman</Heading>        
        <Experiences  three margin="2.5rem 0" experiences={andamancontent["Unique Andaman"]} ></Experiences> */}
        {/* <div className='hidden-desktop'><BannerMobile></BannerMobile></div>  */}
        </SetWidthContainer>
    {/* <WhyUs></WhyUs> */}
{/*Add Banner*/}
  

   
    
  
 
      <SetWidthContainer>
       
        {/* <AsSeenIn disablelinks margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "2.55rem 0"} ></AsSeenIn> */}
        {/* <div className='hidden-mobil'><BannerTwo page_id={props.experienceData.id} _handleTailoredRedirect={_handleTailoredRedirect}  destination={props.experienceData.destination} cities={props.experienceData.locations} ></BannerTwo></div> */}

      

        <ChatWithUs planner page_id={props.experienceData.id} ></ChatWithUs>
        {/* <div style={{display: 'none'}}>
           {itinerariesToIndex}
        </div> */}
      </SetWidthContainer>
      <TailoredFormMobileModal page_id={props.experienceData.id} destination={props.experienceData.destination} cities={props.experienceData.locations} children_cities={props.experienceData.children}  onHide={() => setShowMobilePlanner(false)}    show={showMoiblePlanner} ></TailoredFormMobileModal>

        <WhatsappFloating message={"Hey, I need help planning my trip to "+props.experienceData.destination} />
    </div>
  );
}


export default Homepage;
