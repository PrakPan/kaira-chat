import React, {useState} from 'react';
import styled from 'styled-components';
// import Heading from '../../components/heading/Heading';
import Heading from '../../components/newheading/heading/Index';
import media from '../../components/media';;
import FlickityExperiences from '../../components/containers/FlickityExperiences/Index';
import Experiences from '../../components/containers/Experiences';
import FlickityLocations from '../../components/containers/FlickityLocations/Index';
import Blogs from '../../components/containers/Blogs'
import PersonaliseBox from '../../components/containers/Personalise';
import ChatWithUs from '../../components/containers/ChatWithUs/ChatWithUs';
import Testimonials from '../../components/containers/Testimonials';
import WhyUs from '../../components/containers/WhyUs';

const SetWidthContainer = styled.div`
width: 100%;
margin: auto;
@media screen and (min-width: 768px){
  width: 80%;
}
`;

const  Details = (props) => {
     let isPageWide = media('(min-width: 768px)')

    let JSX = [];
    for(var i = 0; i < props.data[0].length ; i++){
        JSX.push(
            <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>{props.data[0][i].name}</Heading>        
          )
        let experiences  = [];
        let blogs = [];
        let cities = [];

        for(var j =0 ; j < props.data[0][i].experiences.length; j++){
                experiences.push(
                        props.data[0][i].experiences[j]
                )
        }
        if(experiences.length < 4) JSX.push(<Experiences    margin="1.5rem 0" experiences={experiences}></Experiences>)
        else JSX.push(<FlickityExperiences    margin="1.5rem 0" experiences={experiences}></FlickityExperiences>)
        if(props.data[0][i].experiences.length) JSX.push(<div style={{height: '5rem'}}></div>)
        for(var j =0 ; j < props.data[0][i].cities.length; j++){
            cities.push(
                    props.data[0][i].cities[j]
            )
        }
        JSX.push(<FlickityLocations locations={cities}></FlickityLocations>)     

        for(var j =0 ; j < props.data[0][i].blogs.length; j++){
            blogs.push(
                    props.data[0][i].blogs[j]
            )
        }
        JSX.push(<Blogs cityblogs={blogs} margin={isPageWide ? "5rem 0" : "1.5rem 0"}></Blogs>)
    }
    return (
        <div>
    <SetWidthContainer>
        {JSX}
        {!isPageWide  ? <PersonaliseBox></PersonaliseBox> : null}
        <Heading margin={!isPageWide  ? "1.5rem" : '5rem'} align="center" aligndesktop="center" bold>Why Us</Heading>
        <div style={{width: "90%", margin: "auto"}}><WhyUs></WhyUs></div>
      
    </SetWidthContainer>
    <Testimonials></Testimonials>
      <ChatWithUs></ChatWithUs>
    </div>
    );

}

export default Details;