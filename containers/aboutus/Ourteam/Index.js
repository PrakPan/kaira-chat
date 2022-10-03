import React from 'react';
import styled from 'styled-components';
import Card from './Card';
import Carousel from '../../../components/FlickityCarousel';
// import Heading from '../../../components/heading/Heading';
import Heading from '../../../components/newheading/heading/Index';
import media from '../../../components/media';

const GridContainer = styled.div`
margin: auto;
display: grid;
grid-gap: 1rem;
width: 90%;
grid-template-columns: 1fr 1fr;
@media screen and (min-width: 768px){
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 4rem;
    width: 80%;
}       
@media (min-width: 768px) and (max-width: 1024px) {
            grid-template-columns: 1fr 1fr;
}

`;
const Team = (props) => {
    let isPageWide = media('(min-width: 768px)')


    const team=[
       {
           name: "Shikhar Chadha",
           designation: "CEO",
           text: "Always with innovative ideas and plans to bring in the company. He loves his work more than anything, and spends most of his time with the team or playing his piano. Enjoys traveling to remote areas, learning about cultures, reading, and adventure sports.",
            tagline: '"I have an idea" guy',
            image: 'media/website/shikhar.webp'
       },
       {
           name: "Shivaank Tripathi",
           designation: "CTO",
           text: "A passionate coder, you can often find him hunched over a laptop with a cup of coffee testing an algorithm or writing lines of code. You can have endless conversations with him about everything from space, Dan Brown novels, human psychology, and so on.",
            tagline: '"Let me think of a solution" guy',
            image: 'media/website/shivaank.webp'
       },
       {
            name: "Naman Mittal",
            designtaion: 'CMO',
            text: "Always keeping his calm and thinking of a solution for the brand. He’s either playing with his dog or reading about other brands and their stories. A polite guy who loves to go on a run and will talk to you about politics, music, and movies.",
            tagline: '"Relax & get the work done” guy',
            image: 'media/website/20200208_115722.jpg',
       }
    ]
    const cards =[
                        <Card name={team[0].name} designation={team[0].designation} text={team[0].text} tagline={team[0].tagline} url={team[0].image}></Card>,
                                        <Card name={team[1].name} designation={team[1].designation} text={team[1].text} tagline={team[1].tagline} url={team[1].image}></Card>,
                <Card name={team[2].name} designation={team[2].designtaion} text={team[2].text} tagline={team[2].tagline} url={team[2].image}></Card>


    ]
    if(isPageWide)
    return(
        <div>
            <Heading bold align="center" aligndesktop="center" margin="3.5rem" >Our Team</Heading>
            <GridContainer>
                {cards}
            </GridContainer>
            <br></br>
        </div>
    );
    else return(
         <div>
            <Heading bold align="center" aligndesktop="center" margin="1.5rem">Our Team</Heading>
            <Carousel cards={cards}></Carousel>
            <br></br>
        </div>
    )
}

export default Team;