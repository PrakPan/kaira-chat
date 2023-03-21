import React, {useRef, useEffect} from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import ExperienceCard from '../../../components/cards/newitinerarycard-main/ExperienceCard';
import ItineraryCard from '../../../components/cards/newitinerarycard-myplan/ExperienceCard';
import PastItineraryCard from '../../../components/cards/Testimonial';
import PageDotFlickity from '../../../components/PageDotsFlickity'
import Carousel from '../../../components/FlickityCarousel'
import media from '../../../components/media'
const Container = styled.div`
@media screen and (min-width: 768px){

}
`;

const Button = styled.button`
background : white;
color : #01202B;
border : 1.5px solid #01202B;
font-size : 16px;
padding : 13px 68px;
display: block;
margin : 15px auto;
border-radius : 8px;

`

const GridContainer = styled.div`
  @media screen and (min-width: 768px){
    display: grid;
    grid-template-columns: ${(props)=>(props.columns ? "repeat("+props.columns+",1fr)" : "repeat(3,1fr)")};
    grid-template-rows: auto;
    grid-gap: 2rem;
    heigth : 500px;
  }
`;
var i;

const Experiences= (props) => {
  let isPageWide = media('(min-width: 768px)')

  const [more,setMore] = useState(false)
  const TextRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null) ];
  useEffect(() => {
   }, [TextRefs])

    let experiencecards=[];

     if(props.columns){
      for( i = 0; i  < props.columns; i++){
        experiencecards.push(
          <ExperienceCard 
          data={props.experiences[i]}
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
            starting_cost={props.experiences[i].payment_info ? props.experiences[i].payment_info.per_person_total_cost : null}
            duration={props.experiences[i].duration ? props.experiences[i].duration : props.experiences[i].duration_number && props.experiences[i].duration_unit ?  props.experiences[i].duration_number + " "+ props.experiences[i].duration_unit : null }
            location={props.experiences[i].locations[0].name}
            locations={props.experiences[i].itinerary_locations}
            hardcoded={props.experiences[i].payment_info ?true : false }
            >
            </ExperienceCard>
        );
      }
    }
    else{
      if(props.experiences && !props.pastitinerary)
      for(var j = 0; j<props.experiences.length; j++){
    
           experiencecards.push(  
          <ExperienceCard 
          data={props.experiences[j]}
          myplan={props.myplan}
          key={props.experiences[j].short_text}
          hardcoded={props.experiences[j].payment_info ?true : false }
          filter={props.experiences[j].experience_filters ?  props.experiences[j].experience_filters.length  ? props.experiences[j].experience_filters[0]  : null :  null}
          rating={props.experiences[j].rating}
          slug={props.experiences[j].slug}
          id={props.experiences[j].id}
          budge14pxt={props.experiences[j].budget}
          group_type={props.experiences[j].group_type}
          number_of_adults={props.experiences[j].number_of_adults}
          text={props.experiences[j].short_text} 
          experience={props.experiences[j].name}
          duration={props.experiences[j].duration ? props.experiences[j].duration : props.experiences[j].duration_number && props.experiences[j].duration_unit ?  props.experiences[j].duration_number + " "+ props.experiences[j].duration_unit : null }
          location={props.experiences[j]["experience_region"]}
          starting_cost={props.experiences[j].payment_info? props.experiences[j].payment_info.per_person_total_cost ?  props.experiences[j].payment_info.per_person_total_cost : props.experiences[j].starting_price : props.experiences[j].starting_price }
        images={props.experiences[j].images}
        locations={props.experiences[j].itinerary_locations}
        >
          </ExperienceCard>
          )
      }
      else if(props.itineraries){
        for(var j = 0; j<props.itineraries.length; j++){
    
             experiencecards.push(  
            <ItineraryCard 
            data={props.itineraries[j]}
            myplan={props.myplan}
            key={props.itineraries[j].short_text}
            hardcoded={props.itineraries[j].payment_info ?true : false }
            filter={props.itineraries[j].experience_filters ?  props.itineraries[j].experience_filters.length  ? props.itineraries[j].experience_filters[0]  : null :  null}
            rating={props.itineraries[j].rating}
            slug={props.itineraries[j].slug}
            id={props.itineraries[j].id}
            budget={props.itineraries[j].budget}
            group_type={props.itineraries[j].group_type}
            number_of_adults={props.itineraries[j].number_of_adults}
            text={props.itineraries[j].short_text} 
            experience={props.itineraries[j].name}
             duration={props.itineraries[j].duration}
            location={props.itineraries[j]["experience_region"]}
            starting_cost={props.itineraries[j].payment_info? props.itineraries[j].payment_info.per_person_total_cost ?  props.itineraries[j].payment_info.per_person_total_cost : props.itineraries[j].starting_price : props.itineraries[j].starting_price }
          images={props.itineraries[j].images}
          locations={props.itineraries[j].itinerary_locations}
          >
            
            </ItineraryCard >
            )
        }
      }
      else if(props.pastitinerary){
        for(var j = 0; j<props.experiences.length; j++){

        experiencecards.push(  
          <PastItineraryCard 
          data={props.experiences[j]}
          key={props.experiences[j].short_text}
           filter={props.experiences[j].experience_filters[0]}
          rating={props.experiences[j].rating}
          slug={props.experiences[j].slug}
          id={props.experiences[j].id}
          text={props.experiences[j].short_text} 
          experience={props.experiences[j].name}
          cost={props.experiences[j].payment_info ? props.experiences[j].payment_info[0].cost : null}
          duration={props.experiences[j].duration ? props.experiences[j].duration : props.experiences[j].duration_number && props.experiences[j].duration_unit ?  props.experiences[j].duration_number + " "+ props.experiences[j].duration_unit : null }
          heading={props.experiences[j].name}
          destination={props.experiences[j]["experience_region"]}
          starting_cost={props.experiences[j].payment_info? props.experiences[j].payment_info.per_person_total_cost : props.experiences[j].starting_price }
        image={props.experiences[j].images.main_image}
        locations={props.experiences[j].itinerary_locations}

        >
        
          
          </PastItineraryCard >
          )
        }
      }
    }
    return(
      <>
      {isPageWide?
      <Container>        
      {/* <GridContainer columns={props.cols} className="netflix-containe">
         {!more ? [experiencecards[0], experiencecards[1],experiencecards[2]] : experiencecards}
      </GridContainer> */}
      <div>
      <Carousel initialIndex hideSides numberOfCards={3} cards={experiencecards} />
      </div>
      {/* <div style={{width:'100%', marginInline : 'auto'}}>
      <Button onClick={()=>setMore(!more)}>{more?'Show Less' : 'View all'}</Button>
      </div> */}

  </Container>
:
<PageDotFlickity cards={experiencecards} padding={'1rem 0.2rem'} />  
}
      
  </>
  );
  
}

export default Experiences;
