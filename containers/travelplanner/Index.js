import React, {useState, useRef, useEffect, createRef} from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled, { keyframes } from 'styled-components';
import FullImage from '../../components/FullImage';
 import DesktopBanner from '../../components/containers/Banner';
import Experiences from '../../components/containers/Experiences';
  
 import AsSeenIn from '../testimonial/AsSeenIn';
 import Heading from '../../components/newheading/heading/Index';
  import HowItWorks from '../../components/containers/HowItWorksSlideshow';

import media from '../../components/media';
  import * as ga from '../../services/ga/Index';
 import BannerOne from './BannerOne';
 import BannerTwo from './BannerTwo';
 import WhyUs from '../testimonial/whyttw/Index';
 import ChatWithUs from '../../components/containers/ChatWithUs/ChatWithUs';
import FullImgContent from './FullImgContent';
 import Reviews from './CaseStudies/Index';
 import Menu from './Menu';
import axiossearchinstance from '../../services/sales/search/Search';
import ExperienceCard from '../../components/cards/newitinerarycard-main/ExperienceCard';
import gif from '../../public/assets/loader.gif';
import Overview from './Overview';
import Button from '../../components/ui/button/Index';
import {IoIosArrowBack} from 'react-icons/io'
import urls from '../../services/urls';
import Locations from '../../components/containers/plannerlocations.js/Index';
import Map from './Map';
// import qs from qs;
var qs = require('qs');

const SetWidthContainer = styled.div`
width: 100%;
margin: auto;
@media screen and (min-width: 768px){
  width: 90%;
}
`;


const HowItWorksText = styled.p`
font-size: 1rem;
text-align: center;
width: 100%;
margin: 0 0;
font-weight: 300;

@media screen and (min-width: 768px){
  font-size: 1.25rem;
  font-weight: 300;
  margin: 0 0;

}
`;


const HowItWorksHeading = styled.p`
    text-align: center;
    font-weight: 600;
    margin: 1rem 0 0.5rem 0;
    @media screen and (min-width: 768px){
      font-size: 1.25rem;
      margin: 1rem 0 0.5rem 0;

    }
`;

const GridContainer = styled.div`
display: grid;
padding: 1rem;
grid-gap: 1rem;


@media screen and (min-width: 768px){
  padding: 2rem 0;
  grid-gap: 2rem;
  grid-template-columns: 1fr 1fr 1fr;
}
`;
const MinHeightContainer = styled.div`
min-height: 40vh;

@media screen and (min-width: 768px){
  min-height: 60vh;
}
`;
const  Homepage = (props) =>{
   
			
let isPageWide = media('(min-width: 768px)');
let cards = [];
const ID_LIST= [
  'a4f1e1c6-f259-448b-be72-b044a78a82cb',
  'ae3eb149-584f-4179-b311-ccf1497341f5',

];
const DATA=[
	{
		"id": "ae3eb149-584f-4179-b311-ccf1497341f5",
		"images": [
			"media/experiences/166331126839925050735473632812.jpg",
			"media/experiences/166331126849031925201416015625.jpg",
			"media/experiences/166504024451419639587402343750.jpg",
			"media/experiences/166331126871775841712951660156.jpg",
			"media/experiences/166331126881593394279479980469.jpg",
			"media/experiences/166331126891320276260375976562.jpg"
		],
		"itinerary_locations": null,
		"payment_info": {
			"total_cost": 0,
			"per_person_total_cost": 1200000
		},
		"name": "Exotic Highlights of Kerala",
		"duration_unit": "days",
		"duration_number": 8,
		"locations": [],
		"budget": null,
		"experience_filters_selected": [
			"Adventure and Outdoors",
			"Nature and Retreat",
			"Isolated",
			"Shopping"
		],
		"group_type": null,
		"number_of_adults": 1,
		"number_of_children": null,
		"number_of_infants": null,
		"review": null,
		"is_stock": true,
		"released_for_customer_on": null,
		"user_name": "TTW Exclusive",
		"user_location": {
			"region": "",
			"country": "",
			"location": ""
		},
		"itinerary_status": "ITINERARY_NOT_PREPARED",
		"theme_category": [
			"Tailored"
		],
		"duration_based_category": [
			"Week Long Vacation"
		],
		"budget_based_category": [
			"Average"
		],
		"group_type_category": [
			"Family"
		],
		"slug": "8-days-kerala-generic-itinerary"
	}
];
const [loading, setLoading] = useState(true);
const [itinerariesExclusiveJSX, setItinerariesExclusiveJSX] = useState([]);
const [itinerariesToShowExclusiveJSX, setItinerariesToShowExclusiveJSX] = useState([]);
const [itinerariesCustomerJSX, setItinerariesCustomerJSX] = useState([]);
const [itinerariesToShowCustomerJSX, setItinerariesToShowCustomerJSX] = useState([]);
const [filters, setFilters] = useState({
  'Trek': true,
  'Road Trip': true,
}
) 
const _populateResultsHandelr = (filters) => {
  let itineraries_exclusive = [];
  let itineraries_customer = [];

  // axios.get(`/myController/myAction?${[1,2,3].map((n, index) => `storeIds[${index}]=${n}`).join('&')}`);
  setLoading(true);

  axiossearchinstance.post(`?search_type=itinerary&page_id=1`, { 
    "theme_category": filters
   }).then(res => {
    setLoading(false);

    // console.log(res)
    for(var i =0 ; i<res.data.length; i++){
      itineraries_exclusive.push(
      <ExperienceCard 
         key={res.data[i].short_text}
         hardcoded={res.data[i].payment_info ?true : false }
         filter={res.data[i].experience_filters ? res.data[i].experience_filters[0] : null}
         rating={res.data[i].rating}
         slug={res.data[i].slug}
         id={res.data[i].id}
         number_of_adults={res.data[i].number_of_adults}
         PW={true}
         locations={res.data[i]["itinerary_locations"]}

         

         text={res.data[i].short_text} 
         experience={res.data[i].name}
         cost={res.data[i].payment_info ? res.data[i].payment_info.length ? res.data[i].payment_info[0].cost : null: null}
         duration_number={res.data[i].duration_number}
         duration_unit={res.data[i].duration_unit}

         location={res.data[i]["experience_region"]}
         starting_cost={res.data[i].payment_info?   res.data[i].payment_info.per_person_total_cost : res.data[i].starting_price }
       images={res.data[i].images}></ExperienceCard>
      )

    
    }
   
    setItinerariesExclusiveJSX(itineraries_exclusive);
    setItinerariesCustomerJSX(itineraries_customer);

  }).catch(err => {
    setLoading(false);

  });
}
const _fetchResultsHandler = (filter) => {
  let FILTERS = [];
   switch(filter){
    case 'Trek':
      if(!filters["Trek"]) FILTERS.push("Trek");
      if(filters["Road Trip"]) FILTERS.push('Road Trip');
      break;
    case 'Road Trip': 
      if(!filters["Road Trip"]) FILTERS.push("Road Trip");
      if(filters["Trek"]) FILTERS.push('Trek');
      break;
    default:
      FILTERS.push('Road Trip');
      FILTERS.push('Trek');

   

  }
 
   _populateResultsHandelr(FILTERS)

}

const _toggleFilterHandler = (filter_text) => {
   switch(filter_text){
    case 'Treks':
        _fetchResultsHandler('Trek');
        setFilters({...filters, 'Trek' : !filters['Trek']});

        break;
    case 'Road Trips':
      _fetchResultsHandler('Road Trip');
      setFilters({...filters, 'Road Trip' : !filters['Road Trip']})
      break;
    default: 
    _fetchResultsHandler();
  }

}

 useEffect(() => {
 
  let itineraries_exclusive = [];
  let itineraries_customer = [];

  // axios.get(`/myController/myAction?${[1,2,3].map((n, index) => `storeIds[${index}]=${n}`).join('&')}`);
let locations = [];
try{
for(var i = 0 ; i < props.experienceData.locations.length; i++ ){
  locations.push(props.experienceData.locations[i].name);
}
}catch{

}
  axiossearchinstance.post(`?search_type=itinerary`, { 
    "city_list": locations
   }).then(res => {
    setLoading(false);
     for(var i =0 ; i<res.data.length; i++){
      if(res.data[i].owner === 'TTW')
      itineraries_exclusive.push(
      <ExperienceCard 
          data={res.data[i]}
         key={res.data[i].short_text}
         hardcoded={res.data[i].payment_info ?true : false }
         filter={res.data[i].experience_filters ? res.data[i].experience_filters[0] : null}
         rating={res.data[i].rating}
         slug={res.data[i].slug}
         id={res.data[i].id}
         number_of_adults={res.data[i].number_of_adults}
         locations={res.data[i]["itinerary_locations"]}
         text={res.data[i].short_text} 
         experience={res.data[i].name}
         cost={res.data[i].payment_info ? res.data[i].payment_info.length ? res.data[i].payment_info[0].cost : null: null}
         duration_number={res.data[i].duration_number}
         duration_unit={res.data[i].duration_unit}
        location={res.data[i]["experience_region"]}
         starting_cost={res.data[i].payment_info?   res.data[i].payment_info.per_person_total_cost : res.data[i].starting_price }
       images={res.data[i].images}></ExperienceCard>
      )
      else
      itineraries_customer.push(
        <ExperienceCard 
            data={res.data[i]}
           key={res.data[i].short_text}
           hardcoded={res.data[i].payment_info ?true : false }
           filter={res.data[i].experience_filters ? res.data[i].experience_filters[0] : null}
           rating={res.data[i].rating}
           slug={res.data[i].slug}
           id={res.data[i].id}
           number_of_adults={res.data[i].number_of_adults}
           locations={res.data[i]["itinerary_locations"]}
           text={res.data[i].short_text} 
           experience={res.data[i].name}
           cost={res.data[i].payment_info ? res.data[i].payment_info.length ? res.data[i].payment_info[0].cost : null: null}
           duration_number={res.data[i].duration_number}
           duration_unit={res.data[i].duration_unit}
          location={res.data[i]["experience_region"]}
           starting_cost={res.data[i].payment_info?   res.data[i].payment_info.per_person_total_cost : res.data[i].starting_price }
         images={res.data[i].images}></ExperienceCard>
        )
    }
   
    setItinerariesExclusiveJSX(itineraries_exclusive);
    setItinerariesCustomerJSX(itineraries_customer);

    setOffsetExclusive(9);
    setOffsetCustomer(9);

    setItinerariesToShowExclusiveJSX(itineraries_exclusive.slice(0,9));
    setItinerariesToShowCustomerJSX(itineraries_customer.slice(0,9));

  }).catch(err => {
    setLoading(false);

  });



  
  
 
 }, [props.experienceData])
 const [offsetExclusive, setOffsetExclusive] = useState(0);
 const [offsetCustomer, setOffsetCustomer] = useState(0);

const _showMoreExclusiveItineraries = () => {
  if(offsetExclusive > itinerariesExclusiveJSX.length) return 0 ;
  else {
    let itineraries = itinerariesToShowExclusiveJSX.slice();
    // console.log('itineraries_length' , itineraries.length)
    for(var i = offsetExclusive; i < offsetExclusive + 9 ; i++ ){
      itineraries.push(itinerariesExclusiveJSX[i]);
    }
    setOffsetExclusive(offsetExclusive+9);
    setItinerariesToShowExclusiveJSX(itineraries)
  }
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

// const _handleExperiencesRedirect = (e) => {
//     router.push('/travel-experiences')
// }
const _handleTailoredRedirect = () => {
  router.push('/tailored-travel?search_text='+props.experienceData.destination)
}
const _handleTailoredClick = () => {
  setDesktopBannerLoading(true);
  setTimeout(_handleTailoredRedirect, 1000);

  ga.callback_event({
    action: 'TT-Desktopbanner',
    
    callback: _handleTailoredRedirect,
  })

}

const TOP_LOCATIONS = [
  {
      "tagline": "Mountain Paradise",
      "id": 114,
      "name": "Ladakh",
      "slug": 'ladakh-trip-planner',
      "state": {
        "name": "Ladakh"
      },
      "image": "media/website/ayandrali-dutta-GAWiEPB0uEk-unsplash.jpeg",
      "url": "",
  },
  {
      "tagline": "Heaven on Earth",
      "name": "Kashmir",
      "slug": 'kashmir-trip-planner',
      "id":152,
      "state": {
        "name": "Kashmir",
      },
      "image": "media/website/praneet-kumar-H8dcf-v98mA-unsplash.jpeg",
      "url": "",
  },
  {
      "id": 278,
      "tagline": "Awe-Inspiring",
      "name": "Andaman",
      "slug": 'andaman-trip-planner',
      "state":{
        "name": "Andaman And Nicobar Islands",
      },
      "image": "media/website/Andaman.jpeg",
      "url": "",
  },
  {
    "tagline": "Splendid",
    "name": "Goa",
    "id": 277,
    "slug": 'goa-trip-planner',
    "state": {
      "name": "Goa"
    },
    "image": "media/website/Goa.jpg",
    "url": "",
},
  {
      "tagline": "Experience Heritage",
      "name": "Rajasthan",
      "id": 298,
      "slug": 'rajasthan-trip-planner',
      "state": {
        "name": "Rajasthan",
      },
      "image": "media/website/Jodhpur.jpeg",
      "url": "",
  },
  
  
];
const EXPERIENCE = {  
  "id":"ifgPvZyQcBXXPYdJ",
  "slug": "bedazzling-friendcation-in-andaman",
  "experience_filters": ["Nature"],
  "name": "Bedazzling Friendcation In Andaman",
  "experience_region": "Andaman",
  "rating": 4.9,
  "duration": "8 days",
  "short_text": "Enjoy a trip with your friends at this Tropical Paradise for a week.",
   "images": {
      "main_image": "media/experiences/166273742279767060279846191406.jpg",
      "main_image_alt_text": null,
    },
    "payment_info": [
      {
        "cost": 4911951,
        "currency": "USD",
        "total_cost": 185000,
        "service_fee": 15000,
        "duration": "8 days"
      }
    ],
};
const openWhatsapp = () => {
  window.location.href=urls.WHATSAPP+"?text=I need help planning my trip to "+props.experienceData.destination+".";
}
console.log(props.experienceData);
   return (
    <div className={  "Homepage"  } id="homepage-anchor" style={{visibility: props.hidden ? 'hidden' : 'visible'}}>
      <FullImage url={props.experienceData.image} filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))"  >
          <FullImgContent destination={props.experienceData.destination} cities={props.experienceData.locations} title={props.experienceData.banner_heading}/>
      </FullImage>
      {/* <div className='hidden-desktop'><Enquiry></Enquiry></div> */}
{/* <BannerOne></BannerOne> */}
{/* <Menu openWhatsapp={openWhatsapp} _toggleFilterHandler={_toggleFilterHandler } filters={filters}></Menu> */}
<Overview overview_heading={props.experienceData.overview_heading} overview_text={props.experienceData.overview_text}></Overview>
<SetWidthContainer>
{itinerariesExclusiveJSX.length ? <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : " 0 0 2.5rem 0"}  bold>{'Exclusives across '+props.experienceData.destination}</Heading>    : null}     

  {!loading ? <GridContainer>
    { itinerariesToShowExclusiveJSX}
 
  </GridContainer> : <MinHeightContainer className='center-div'><img src={gif} style={{width: '3rem', height: '3rem', display: 'block', margin: 'auto'}}/> </MinHeightContainer>
  }
  {
    !loading && itinerariesExclusiveJSX.length && (itinerariesExclusiveJSX.length >=  offsetExclusive)? <Button margin="auto" borderWidth="1px" borderRadius="2rem" padding="0.25rem 2rem" onclick={_showMoreExclusiveItineraries} >View More</Button> 
    : null
  }
  {itinerariesCustomerJSX.length ? <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "0 0 2.5rem 0"}  bold>{'Trips by our users'}</Heading>    : null}     
  {!loading ? <GridContainer>
    { itinerariesToShowCustomerJSX}
 
  </GridContainer> : null
  }
  {
    !loading  && itinerariesCustomerJSX.length && (itinerariesCustomerJSX.length >=  offsetCustomer)? <Button margin="0 auto 1rem auto" borderWidth="1px" borderRadius="2rem" padding="0.25rem 2rem" onclick={_showMoreCustomerItineraries} >View More</Button> 
    : null
  }
      {/* <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Top Selling Experiences</Heading>        
        <Experiences  three margin="2.5rem 0" experiences={andamancontent["Top Selling Experiences"]} ></Experiences>
        <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Customer Tales</Heading>        
        <Experiences  three margin="2.5rem 0" experiences={andamancontent["Customer Tales"]} pastitinerary></Experiences>
 */}
</SetWidthContainer>
 <Map locations={props.experienceData.locations}></Map>
    <DesktopBanner loading={desktopBannerLoading} onclick={_handleTailoredClick} text="Want to personalize your own experience?"></DesktopBanner>
      <SetWidthContainer>
      <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "2.55rem 0"}  bold>Trending Destination</Heading>        

      <Locations locations={TOP_LOCATIONS} viewall planner></Locations>

         <Heading align="center" aligndesktop="center" margin={!isPageWide  ? "2.5rem 0.5rem" : "4rem"} thincaps >HOW IT WORKS?</Heading>
        <HowItWorks onclick={_handleTailoredRedirect} images={howitworksimgs} content={HowitWorksContentsArr} headings={HowitWorksHeadingsArr}></HowItWorks>
        <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "2.5rem 0"}  bold>What our customers say?</Heading>        
       <Reviews></Reviews>
        {/* <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Unique Andaman</Heading>        
        <Experiences  three margin="2.5rem 0" experiences={andamancontent["Unique Andaman"]} ></Experiences> */}
        {/* <div className='hidden-desktop'><BannerMobile></BannerMobile></div>  */}
        </SetWidthContainer>
    {/* <WhyUs></WhyUs> */}
{/*Add Banner*/}
  

   
    
  
 
      <SetWidthContainer>
      
        <AsSeenIn disablelinks></AsSeenIn>
        <div className='hidden-mobile'><BannerTwo cities={props.experienceData.locations} ></BannerTwo></div>

        <ChatWithUs></ChatWithUs>
      </SetWidthContainer>

 
    </div>
  );
}


export default Homepage;

