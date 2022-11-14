import React from 'react';
import styled from 'styled-components';
 import Card from '../cards/newitinerarycard-main/ExperienceCard';
 import PastItineraryCard from '../cards/pastitinerarycard/ExperienceCard';
 import BlogNew from '../cards/Blog';
import Carousel from '../FlickityCarousel';
import ExperiencesContainer from './Experiences';
import media from '../media';



const Container = styled.div`

display: grid;
margin: ${(props)=>(props.margin ? props.margin : "0")};
  @media screen and (min-width: 768px){
    grid-template-columns: 1fr 2fr;
    grid-gap: 2.5rem;
    margin-top: 5rem;

  }
`;
const GridContainer = styled.div`

    padding: 1rem 0;
    @media screen and (min-width: 768px){
      background-color: white;
      display: grid;
      grid-template-columns: repeat(2,1fr);
      grid-gap: 2.5rem;
      padding: 0;
    }
    @media screen and (min-width: 768px) and (min-height: 1024px) {
      grid-template-columns: 1fr;
    }
`; 
const Experiences= (props) => {
   let isPageWide = media('(min-width: 768px)')

    
  
   
  let experiencecards = [];

  props.experiences.map( experience => {
     if(props.pastitinerary){
      experiencecards.push(  
        <PastItineraryCard 
        // filter={props.itineraries[j].experience_filters[0]}
        key={experience.id}
        starting_cost={experience.payment_info ? experience.payment_info[0].cost : experience.starting_price}
        slug={experience.slug}
        id={experience.id}
        filter={experience.experience_filters[0]}
        rating={experience.rating}
        hardcoded={experience.payment_info ? true : false }
        text={experience.short_text} 
        experience={experience.name}
        cost={experience.payment_info ? experience.payment_info[0].cost : null}
        duration={experience.duration}
        location={experience["experience_region"]}
        images={experience.images ? experience.images : experience.main_image}>
        </PastItineraryCard >
        )
    }
    else experiencecards.push(              
        <Card
        key={experience.short_text}
        starting_cost={experience.payment_info ? experience.payment_info[0].cost : experience.starting_price}
        slug={experience.slug}
        id={experience.id}
        filter={experience.experience_filters[0]}
        rating={experience.rating}
        hardcoded={experience.payment_info ? true : false }
        text={experience.short_text} 
        experience={experience.name}
        cost={experience.payment_info ? experience.payment_info[0].cost : null}
        duration={experience.duration}
        location={experience["experience_region"]}
        images={experience.images ? experience.images : experience.main_image}>
        </Card>
      )
    
  });
  // if(typeof window !== 'undefined' ) 
  return(
  <div  >
  <div  className='hidden-mobile' >
     {props.experiences.length > 3  ? 
     <div><ExperiencesContainer pastitinerary={props.pastitinerary} experiences={[props.experiences[0], props.experiences[1], props.experiences[2]]}></ExperiencesContainer>
       <Container >  
          <div>
            <div className="netflix-containe">
            {props.pastitinerary ? 
             <PastItineraryCard 
             filter={props.experiences[3].experience_filters[0]}
             slug={props.experiences[3].slug}
             id={props.experiences[3].id}
             text={props.experiences[3].short_text} 
             experience={props.experiences[3].name}
             cost={props.experiences[3].payment_info ? props.experiences[3].payment_info[0].cost : null}
             duration={props.experiences[3].duration}
             rating={props.experiences[3].rating}
             hardcoded={props.experiences[3].payment_info ?true : false }
             location={props.experiences[3]["experience_region"]}          
             starting_cost={props.experiences[3].payment_info ? props.experiences[3].payment_info[0].cost : props.experiences[3].starting_price}
             images={props.experiences[3].images ? props.experiences[3].images : props.experiences[3].main_image}>
       </PastItineraryCard> :
            <Card 
              filter={props.experiences[3].experience_filters[0]}
              slug={props.experiences[3].slug}
              id={props.experiences[3].id}
              text={props.experiences[3].short_text} 
              experience={props.experiences[3].name}
              cost={props.experiences[3].payment_info ? props.experiences[3].payment_info[0].cost : null}
              duration={props.experiences[3].duration}
              rating={props.experiences[3].rating}
              hardcoded={props.experiences[3].payment_info ?true : false }
              location={props.experiences[3]["experience_region"]}          
              starting_cost={props.experiences[3].payment_info ? props.experiences[3].payment_info[0].cost : props.experiences[3].starting_price}
              images={props.experiences[3].images ? props.experiences[3].images : props.experiences[3].main_image}>
        </Card> }
            </div>
          </div>
          <div style={{width: "100%", margin: "auto"}}>
            <BlogNew link={props.link} page={props.page} img={props.img} heading={props.heading} review={props.review} text={props.text}></BlogNew>
            </div>
      </Container></div>  : null}
    </div>
  
 
    <Container className={  'hidden-desktop'}>  
    <div>
      <GridContainer>
        {typeof window !== 'undefined' ? <Carousel cards={experiencecards} experience pastitinerary={props.pastitinerary}></Carousel> : null}
      </GridContainer>
      <br></br>
    </div>
      <div style={{width: "90%", margin: "auto", paddingTop: "1.5rem"}}>
          <BlogNew page={props.page} link={props.link} img={props.img} heading={props.heading} text={props.text} review={props.review}></BlogNew>
      </div>
    </Container> </div>
  );
   
}

export default Experiences;
