import React from 'react';
import styled from 'styled-components';
// import Heading from '../heading/Heading';
import Heading from '../newheading/heading/Index';

// import Button from '../Button';
import Button from "../ui/button/Index"
import ReviewCard from '../../containers/testimonial/ReviewCard';
import Flickity from '../FlickityCarousel';
import media from '../media';
import { useRouter } from 'next/router';
import urls from '../../services/urls';
//Testimonials shown on homepage and listing page 

const GridContainer = styled.div`
display: grid;
grid-gap: 2rem;
  margin: 1.5rem 0 2.5rem 0;
  @media screen and (min-width: 768px){
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
    grid-gap: 0.5rem;
  }
`;

const Container = styled.div`
background-color: #F7e700;
padding: 1rem 0;
display: block !important;
  @media screen and (min-width: 768px){
    padding: 2rem;
  }
`;


const Testimonials= (props) => {
  let isPageWide = media('(min-width: 768px)')


     const reviews = [
      {
        name: "Uzay",
        image: "media/website/Uzay.png",
        location: "turkey",
        review: "A perfect company for your dreams, travel and volunteering Project. They are the best traveling company ın new Delhi. As a senior student in university I wanted to discover the most exotic part of the World, India .fter 2 weeks of web research and with luck, I was able to find Aryen, Shikhar, and Vaibhav in Tarzan Way Company. I know that it is difficult to find a trustworthy company in these days but you can trust TTW company in any terms. Don't miss that dream journey. Make your dreams to become real.",
        summary: "A perfect company for your dreams, travel and volunteering Project. They are the best traveling company ın new Delhi..."
    },
    {
        name: "Brian",
        image: "media/website/Brian.png",
        location: "us",
        review: "I have traveled to India once before for visiting a close friend. Going through Tarzan Way is the closest I could hope to reach the same experience. From the moment I asked for information, The team was incredibly helpful. Tarzan Way was able to put together a custom itinerary to meet my exact needs, including time period, budget, and desired activities. I felt secure in every communication and transaction, and they came through with many personal touches. I highly recommend it to anyone looking for a meaningful trip to India :)",
        summary: "From the moment I asked for information, The team was incredibly helpful. Tarzan Way was able to put together a custom itinerary to meet my exact needs...",
    },
    {
      name: 'Montserrat Zetina',
      location: 'mexico',
      image: 'media/website/Monsterrat.jpeg',
      review: "I wish I could say goodbye to both Aryen and Shikhar! I just wanna say thank you for everything they did for me. It was an amazing trip that I will always remember. It’s a really great job you are doing. I think is one of the best trips I would ever have in my life so thank you for that. I love the culture, the people, the food everything in India. I am sure I’ll return some day. Thank you so so much! I hope to see you both one day! You are such a great people :) And you’ll always have a home in Mexico <3",
      summary: "I just wanna say thank you for everything they did for me. It was an amazing trip..."
  },
    ]
      const cards = [
        <ReviewCard text={reviews[0].summary} review={reviews[0].review} name={reviews[0].name} location={reviews[0].location} url={reviews[0].image}></ReviewCard>,
        <ReviewCard text={reviews[1].summary} review={reviews[1].review} name={reviews[1].name} location={reviews[1].location} url={reviews[1].image}></ReviewCard>,
        <ReviewCard text={reviews[2].summary} review={reviews[2].review} name={reviews[2].name} location={reviews[2].location} url={reviews[2].image}></ReviewCard>

      ]
      const router = useRouter()

      const _handleRedirect = (e) => {
          router.push('/testimonials')
      }
  
  
        // if(isPageWide)
    return(
      <div ><Container className='hidden-mobile' style={{margin: props.margin? props.margin : '0'}}>  

          <GridContainer>
              <ReviewCard text={reviews[0].summary} review={reviews[0].review} name={reviews[0].name} location={reviews[0].location} url={reviews[0].image}></ReviewCard>
              <ReviewCard text={reviews[1].summary} review={reviews[1].review} name={reviews[1].name} location={reviews[1].location} url={reviews[1].image}></ReviewCard>
              <ReviewCard text={reviews[2].summary} review={reviews[2].review} name={reviews[2].name} location={reviews[2].location} url={reviews[2].image}></ReviewCard>
              {/* <Testimonial imgWidth="60%"></Testimonial> */}
          </GridContainer>
          {/* <Link href='/testimonials' style={{textDecoration: 'none'}}> */}
            <Button
            link={urls.TESTIMONIALS}
            margin="auto"
            padding="0.5rem 2rem"
            borderWidth="1px"
            borderRadius="2rem"
            onclick={null}
            hoverColor="white"
            hoverBgColor="black"
          
           
            >
              Show More
            </Button>
          {/* </Link> */}
      </Container>
  
  
    <Container className='hidden-desktop'>  
          <Heading align="center" aligndesktop="left" margin={!isPageWide ? "0" : "5rem 0"}  bold>Traveler Stories</Heading>        

         {typeof window !=='undefined' ? <Flickity cards={cards}></Flickity> : null}
         <Button
         link={urls.TESTIMONIALS}
         
            margin="1rem auto 0 auto"
            padding="0.5rem 2rem"
            borderWidth="1px"
            borderRadius="2rem"
            onclick={null}
            hoverColor="white"
            hoverBgColor="black"
          
            >
              Show More
            </Button>
      </Container></div>
  );
}

export default Testimonials;
