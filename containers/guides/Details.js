import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import media from '../../components/media';
import Heading from '../../components/newheading/heading/Index';
import FlickityExperiences from '../../components/containers/FlickityExperiences/Index';
import Experiences from '../../components/containers/Experiences';
import Banner from '../homepage/banner/Mobile';
import Blogs from '../../components/containers/Blogs'
import FlickityLocations from '../../components/containers/FlickityLocations/Index';

const SetWidthContainer = styled.div`
width: 100%;
margin: auto;
@media screen and (min-width: 768px){
  width: 80%;
}
`;
const content = {
  "locations": [
    {
        "tagline": "The Hippy",
        "city": "Kasol",
        "slug": 'kasol',
        "image": "media/cities/162653335312065196037292480469.jpg",
        "url": "",

    },
    {
        "tagline": "Splendid",
        "city": "Goa",
        "slug": 'goa',

        "image": "media/website/Goa.jpg",
        "url": "",
    },
    {
        "tagline": "Awe-Inspiring",
        "city": "Andaman",
        "slug": 'andaman_and_nicobar_islands',
        "image": "media/website/Andaman.jpeg",
        "url": "",
    },
    {
        "tagline": "Tranquil",
        "city": "Rishikesh",
        "slug": 'rishikesh',
        "image": "media/website/Rishikesh.jpeg",
        "url": "",
    },
    {
        "tagline": "The Noble",
        "city": "Manali",
        "slug": 'manali',

        "image": "media/website/Manali.jpeg",
        "url": "",
    }
    , {
      "tagline": "The Noble",
      "city": "Manali",
      "slug": 'manali',

      "image": "media/website/Manali.jpeg",
      "url": "",
  },



],
"locations blog": {
  "locations": [
    {
        "tagline": "The Hippy",
        "city": "Kasol",
        "slug": 'kasol',
        "image": "media/cities/162653335312065196037292480469.jpg",
        "url": "",

    },
    {
        "tagline": "Splendid",
        "city": "Goa",
        "slug": 'goa',

        "image": "media/website/Goa.jpg",
        "url": "",
    },
    {
        "tagline": "Awe-Inspiring",
        "city": "Andaman",
        "slug": 'andaman_and_nicobar_islands',
        "image": "media/website/Andaman.jpeg",
        "url": "",
    },
    {
        "tagline": "Tranquil",
        "city": "Rishikesh",
        "slug": 'rishikesh',
        "image": "media/website/Rishikesh.jpeg",
        "url": "",
    },
    {
        "tagline": "The Noble",
        "city": "Manali",
        "slug": 'manali',

        "image": "media/website/Manali.jpeg",
        "url": "",
    },
    {
      "tagline": "Awe-Inspiring",
      "city": "Andaman",
      "slug": 'andaman_and_nicobar_islands',
      "image": "media/website/Andaman.jpeg",
      "url": "",
  },
  {
      "tagline": "Tranquil",
      "city": "Rishikesh",
      "slug": 'rishikesh',
      "image": "media/website/Rishikesh.jpeg",
      "url": "",
  },
  {
      "tagline": "The Noble",
      "city": "Manali",
      "slug": 'manali',

      "image": "media/website/Manali.jpeg",
      "url": "",
  }
  ],
  "blog": {
    "heading": "An Introduction to Workcation",
    "text": "“Workcation” (noun) - The act of working while on a vacation to feed your wanderlust and enjoy your work life.",
    "image": "media/website/laptop-1.jpeg",
    "link": "https://www.thetarzanway.com/post/introduction-workation-uttarakhand"
  },
  "review": {
      
    name: "Aziza",
    image: "media/website/Aziza.png",
    location: "indonesia",
    review: "The Tarzan Way isn’t your typical travel agent, they will create a personalized travel itinerary which will escalate your journey in India. The team work with passion and professionalism. They are super communicative and responsive too. Trust me, you’ll be in a good hand. I’ll definitely recommend it!",
    summary: "The Tarzan Way isn’t your typical travel agent, they will create a personalized travel itinerary which will escalate your journey in India...."

},
}
}
const Segment = styled.div`

`;
const Details = (props) => {
  let isPageWide = media('(min-width: 768px)')
  let JSX = [];

    useEffect(()=> {
         
    },[props.data])

    for(var i =0; i < props.data.length; i++){
      JSX.push(
        <Heading key={i} align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>{props.data[i].name}</Heading>        
      )

      // Show experinces and 1 blog if possible 

     

        //show 4 experiences 
        let experiences = [];
        let blogs=  [];
        let locations = [];

       
        // if(props.data[i].experiences.length) JSX.push(<div style={{height: '5rem'}}></div>)

      //show remaining blogs 
     
      //show locations
      if(props.data[i].cities.length){
        for(var j = 0; j < props.data[i].cities.length ; j++)
          locations.push(props.data[i].cities[j]);
        JSX.push(
          <FlickityLocations locations={locations}></FlickityLocations>
        )
        JSX.push(<div key={i+1000} style={{margin: '5rem'}}></div>)
      }
      if(props.data[i].experiences.length){
        for(var j = 0; j < props.data[i].experiences.length ; j++)
            experiences.push(props.data[i].experiences[j]);
        if(props.data[i].experiences.length > 3)
          JSX.push(<FlickityExperiences    margin="0" experiences={experiences}></FlickityExperiences>)
        else JSX.push(<Experiences    margin="0" experiences={experiences}></Experiences>)
        JSX.push(<div key={i+2000} style={{margin: '5rem'}}></div>)
      }
        if(props.data[i].blogs.length){
           for(var j = 0; j < props.data[i].blogs.length ; j++)
            blogs.push(props.data[i].blogs[j])
         JSX.push(<Blogs cityblogs={blogs} margin="0"></Blogs>)

        }
      
    }
  return (
    <div >
    <SetWidthContainer>
       {JSX}
      </SetWidthContainer>
      {!isPageWide ? <Banner text="Want to craft your own travel experience?"  buttontext="Start Now" color="black" buttonbgcolor="#f7e700"></Banner> :  null}
      {/* {!isPageWide? <Banner data={props.data} experienceLoaded={props.experienceLoaded} openBooking={props.openBooking} payment={props.payment} offsets={offset} locations={props.data.locations} heading={menuHeading} text="Some text here" buttontext="Buy Now" color="black" buttonbgcolor="#F7e700" onclick={props.openBooking}></Banner> : null} */}
    </div>
  );
};

export default React.memo(Details);
