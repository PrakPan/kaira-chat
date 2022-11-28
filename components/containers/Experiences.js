import React, {useRef, useEffect} from 'react';
import styled from 'styled-components';
import ExperienceCard from '../cards/newitinerarycard-main/ExperienceCard';
import ItineraryCard from '../cards/itinerarycard/Index';
import PastItineraryCard from '../cards/pastitinerarycard/ExperienceCard';
import Carousel from '../FlickityCarousel';
import media from '../media';

const Container = styled.div`
@media screen and (min-width: 768px){

}
`;

const GridContainer = styled.div`
  @media screen and (min-width: 768px){
    display: grid;
    grid-template-columns: ${(props)=>(props.columns ? "repeat("+props.columns+",1fr)" : "repeat(3,1fr)")};
    grid-template-rows: auto;
    grid-gap: 2.5rem;
  }
`;

const TextContainer = styled.div`
line-height: 120%;
overflow: hidden;
padding-top: 1rem;
position: absolute;
visibility: hidden;
z-index: -1;
`;
const ShortText = styled.p`
font-size:1rem;
font-weight: 300;
@media screen and (min-width: 768px){
font-size: 0.85rem;
  /* font-size: ${(props)=>( props.theme.fontsizes.desktop.text.five ?props.theme.fontsizes.desktop.text.five:props.theme.fontsizes.desktop.text.five )}; */
font-weight: 300;
line-height: 1.5;

}
`; 
// const ShortText = styled.p`
// font-size: ${props => props.theme.fontsizes.mobile.text.default};
// font-weight: 300;
// @media screen and (min-width: 768px){
// font-size: ${props => props.theme.fontsizes.desktop.text.five};
// font-weight: 300;
// line-height: 1.5;

// }
// `; 

var i;

const Experiences= (props) => {
  let isPageWide = media('(min-width: 768px)')

  const TextRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null) ];
  useEffect(() => {
   }, [TextRefs])
  const text = [
    "With this immersive experiential travel program, the focus is providing insight, to the travelers, into the lifestyle, culture and local traditions of a Pahadi Village. Travelers are encouraged to interact with the local community, and, celebrate wearing the fabric of diversity and pluralism.",
    "In this week-long experiential travel program, take a break from the rapacious world and uplift your spirits by living in the remotest corner of Ladakh with the <em>Changpa</em> Tribe.",
    "In this 4-day learning travel program, edify yourself to channelize ideas through actions. Learn the most majestic form of art: theatre, and, broaden your horizons by expanding your purview.",
    "A 4+ weeks, immersive travel experience covering 16+ locations all across North India while participating in volunteer work along with a lot of adventurous activities. With meaningful insight into the Indian culture and traditions and celebration of the cultural diversity and vibrancy of this land this experience is a must for every traveler."
];
const Experiences = [
  "Life in a Pahadi Village",
  "Social Travel: North India",
  "Volunteer in Rishikesh",
  "Life of a Nomad",
  ]

   
 
    let experiencecards=[];

     if(props.columns){
      for( i = 0; i  < props.columns; i++){
        experiencecards.push(
          <ExperienceCard 
          key={props.experiences[i].id}
            slug={props.experiences[i].slug}
            rating={props.experiences[i].rating}
            budget={props.experiences[i].budget}
            group_type={props.experience[i].group_type}
            number_of_adults={props.experience[i].number_of_adults}
            filter={props.experiences[i].experience_filters[0]}
            id={props.experiences[i].id}
            text={props.experiences[i].short_text} 
            experience={props.experiences[i].name} 
            images={props.experiences[i].images}
            cost={props.experiences[i].payment_info ? props.experiences[i].payment_info[0].cost : null}
            duration={props.experiences[i].duration}
            location={props.experiences[i].locations[0].name}
            starting_cost={props.experiences[i].starting_cost}
            hardcoded={props.experiences[j].payment_info ?true : false }
            >
            </ExperienceCard>
        );
      }
    }
    else{
      if(props.experiences && !props.pastitinerary)
      for(var j = 0; j<props.experiences.length; j++){
    
       
        //get height of text 
        // if height of text more than maxheight set maxheight to new height
        experiencecards.push(  
          <ExperienceCard 
          key={props.experiences[j].short_text}
          hardcoded={props.experiences[j].payment_info ?true : false }
          filter={props.experiences[j].experience_filters ?  props.experiences[j].experience_filters.length  ? props.experiences[j].experience_filters[0]  : null :  null}
          rating={props.experiences[j].rating}
          slug={props.experiences[j].slug}
          id={props.experiences[j].id}
          budget={props.experiences[j].budget}
          group_type={props.experiences[j].group_type}
          number_of_adults={props.experiences[j].number_of_adults}
          text={props.experiences[j].short_text} 
          experience={props.experiences[j].name}
           duration={props.experiences[j].duration}
          location={props.experiences[j]["experience_region"]}
          starting_cost={props.experiences[j].payment_info? props.experiences[j].payment_info.per_person_total_cost : props.experiences[j].starting_price }
        images={props.experiences[j].images}>
          
          </ExperienceCard>
          )
      }
      else if(props.itineraries){
        for(var j = 0; j<props.itineraries.length; j++){
    
         
          //get height of text 
          // if height of text more than maxheight set maxheight to new height
          experiencecards.push(  
            <ItineraryCard 
            // filter={props.itineraries[j].experience_filters[0]}
            key={props.itineraries[j].itinerary_id}
            budget={props.itineraries[j].budget}
            
            rating={props.itineraries[j].rating}
            slug={props.itineraries[j].slug}
            id={props.itineraries[j].itinerary_id}
            text={props.itineraries[j].short_text} 
            name={props.itineraries[j].name}
            duration={props.itineraries[j].duration_number+" "+props.itineraries[j].duration_unit}
            locations={props.itineraries[j]["locations"]}
            starting_cost={props.itineraries[j]["starting_cost"]}
            itinerary_status={props.itineraries[j]["itinerary_status"]}
            itineraryDate={props.itineraries[j]["created_at"]}
            timeRequired={props.itineraries[j]["time_needed_for_itinerary_completion"]}
            status={props.itineraries[j]["itinerary_status"]}
          image={props.itineraries[j].images[0]}>
            
            </ItineraryCard >
            )
        }
      }
      else if(props.pastitinerary){
        for(var j = 0; j<props.experiences.length; j++){

        experiencecards.push(  
          <PastItineraryCard 
          // filter={props.itineraries[j].experience_filters[0]}
          key={props.experiences[j].short_text}
           filter={props.experiences[j].experience_filters[0]}
          rating={props.experiences[j].rating}
          slug={props.experiences[j].slug}
          id={props.experiences[j].id}
          text={props.experiences[j].short_text} 
          experience={props.experiences[j].name}
          cost={props.experiences[j].payment_info ? props.experiences[j].payment_info[0].cost : null}
          duration={props.experiences[j].duration}
          location={props.experiences[j]["experience_region"]}
          starting_cost={props.experiences[j].payment_info? props.experiences[j].payment_info[0].cost : props.experiences[j].starting_price }
        images={props.experiences[j].images}>
        
          
          </PastItineraryCard >
          )
        }
      }
      //loop through experiences again, push to experiencecards with min height set to maxheight
    }


      // if(isPageWide)
    return(
      <>
      <Container className='hidden-mobile'>        
          <GridContainer className="netflix-containe">
             {props.three ? [experiencecards[0], experiencecards[1],experiencecards[2]] : experiencecards}

          </GridContainer>
      </Container>

    <div className='hidden-desktop'>       
           <div style={{ padding: "1rem 0"}}>
            {typeof window !=='undefined' ? <Carousel experience cards={experiencecards}></Carousel> :null }
    </div>
  </div></>
  );
  
}

export default Experiences;
