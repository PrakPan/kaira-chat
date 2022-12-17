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
import andamancontent from '../../public/content/campaigns/Andaman';
import Reviews from './CaseStudies/Index';
import BannerMobile from './MobileBanner';
import Enquiry from './newenquiry/Index';
import Menu from './Menu';
import axiossearchinstance from '../../services/sales/search/Search';
import ExperienceCard from '../../components/cards/newitinerarycard-main/ExperienceCard';
import gif from '../../public/assets/loader.gif';

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
  padding: 2rem;
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
// const [isWindow, setIsWindow] = useState(false);

			
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
const [itinerariesJSX, setItinerariesJSX] = useState(null);
const [filters, setFilters] = useState({
  'Trek': true,
  'Road Trip': true,
}
) 
const _populateResultsHandelr = (filters) => {
  let itineraries = [];
  // axios.get(`/myController/myAction?${[1,2,3].map((n, index) => `storeIds[${index}]=${n}`).join('&')}`);
  setLoading(true);

  axiossearchinstance.post(`?search_type=itinerary&page_id=1`, { 
    "theme_category": filters
   }).then(res => {
    setLoading(false);

    // console.log(res)
    for(var i =0 ; i<res.data.length; i++){
      itineraries.push(
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
   
    setItinerariesJSX(itineraries);
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
  let itineraries = [];
  // axios.get(`/myController/myAction?${[1,2,3].map((n, index) => `storeIds[${index}]=${n}`).join('&')}`);

  axiossearchinstance.post(`?search_type=itinerary&page_id=1`, { 
    "theme_category": []
   }).then(res => {
    setLoading(false);
     for(var i =0 ; i<res.data.length; i++){
      itineraries.push(
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
   
    setItinerariesJSX(itineraries);
  }).catch(err => {
    setLoading(false);

  });



  
  
 
 }, [])

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
  router.push('/tailored-travel?search_text=Rajasthan')
}
const _handleTailoredClick = () => {
  setDesktopBannerLoading(true);
  setTimeout(_handleTailoredRedirect, 1000);

  ga.callback_event({
    action: 'TT-Desktopbanner',
    
    callback: _handleTailoredRedirect,
  })

}
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
let width = 200;
let height = 200;
try{
width = Math.round(window.innerWidth*0.8);
height=Math.round(window.innerWidth*0.3);

}catch{
}
   return (
    <div className={  "Homepage"  } id="homepage-anchor" style={{visibility: props.hidden ? 'hidden' : 'visible'}}>
      <FullImage url="media/website/Andaman.jpeg" filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))"  >
          <FullImgContent/>
      </FullImage>
      {/* <div className='hidden-desktop'><Enquiry></Enquiry></div> */}
<BannerOne></BannerOne>
<Menu _toggleFilterHandler={_toggleFilterHandler } filters={filters}></Menu>
<SetWidthContainer>
  {!loading ? <GridContainer>
    { itinerariesJSX}
 
  </GridContainer> : <MinHeightContainer className='center-div'><img src={gif} style={{width: '3rem', height: '3rem', display: 'block', margin: 'auto'}}/> </MinHeightContainer>
  }
      {/* <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Top Selling Experiences</Heading>        
        <Experiences  three margin="2.5rem 0" experiences={andamancontent["Top Selling Experiences"]} ></Experiences>
        <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Customer Tales</Heading>        
        <Experiences  three margin="2.5rem 0" experiences={andamancontent["Customer Tales"]} pastitinerary></Experiences>
 */}
</SetWidthContainer>
    {/* <DesktopBanner loading={desktopBannerLoading} onclick={_handleTailoredClick} text="Want to personalize your own experience?"></DesktopBanner> */}
      <SetWidthContainer>
         <Heading align="center" aligndesktop="center" margin={!isPageWide  ? "2.5rem 0.5rem" : "4rem"} thincaps >HOW IT WORKS?</Heading>
        {/* <div style={{width: '100%' , position: 'relative', paddingBottom:  '56.25%', height: '0'}}>
          <iframe style={{position: 'relative', top: '0', left: '0', border: '0', height: '100%'}} src="https://www.youtube.com/embed/NQ5aHR_HNzg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>      
        </div> */}
       
        {/* <div style={{width: typeof window !== "undefined" ? window.innerWidth / 2 : '300', height:  typeof window !== "undefined"? window.innerWidth/3 : '300' ,  position: 'relative', margin: 'auto' }}> */}
         {/* <div style={{width: 'max-content', margin: 'auto'}}>
          <iframe width={typeof window != "undefined" ? Math.round(window.innerWidth*0.4) : '300'} height={typeof window != "undefined" ? Math.round(window.innerWidth * 0.3) : '300'} src="https://www.youtube.com/embed/NQ5aHR_HNzg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>     
        </div> */}
        <div className="hidden-mobile" style={{width: 'max-content', margin: 'auto', display: 'block'}}>
          <iframe width={typeof window !== "undefined" ? Math.round(window.innerWidth*0.8) : '300'} height={typeof window !== "undefined" ? Math.round(window.innerWidth * 0.3) : '300'} src="https://www.youtube.com/embed/NQ5aHR_HNzg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>      
        </div>
        <div className="hidden-desktop" style={{width: 'max-content', margin: 'auto', display: 'block'}}>
          <iframe width={typeof window !== "undefined" ? Math.round(window.innerWidth*0.9) : '300'} height={typeof window !== "undefined" ? Math.round(window.innerWidth * 0.5) : '200'} src="https://www.youtube.com/embed/NQ5aHR_HNzg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>      
        </div>
        <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>What our customers say?</Heading>        
       <Reviews></Reviews>
        {/* <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Unique Andaman</Heading>        
        <Experiences  three margin="2.5rem 0" experiences={andamancontent["Unique Andaman"]} ></Experiences> */}
        {/* <div className='hidden-desktop'><BannerMobile></BannerMobile></div>  */}
        </SetWidthContainer>
    <WhyUs></WhyUs>
{/*Add Banner*/}
  

   
    
  
 
      <SetWidthContainer>
      
        <AsSeenIn disablelinks></AsSeenIn>
        <div className='hidden-mobile'><BannerTwo></BannerTwo></div>

        <ChatWithUs></ChatWithUs>
      </SetWidthContainer>

 
    </div>
  );
}


export default Homepage;

