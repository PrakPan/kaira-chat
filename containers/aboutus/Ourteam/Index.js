import React from 'react';
import styled from 'styled-components';
import Card from './Card';
// import Heading from '../../../components/heading/Heading';
import Heading from '../../../components/newheading/heading/Index';
import media from '../../../components/media';
import SwiperCarousel from '../../../components/SwiperCarousel';

const GridContainer = styled.div`
margin: auto;
display: grid;
grid-gap: 1rem;
width: 90%;
grid-template-columns: 1fr 1fr;
@media screen and (min-width: 768px){
    grid-template-columns: 1fr 1fr;
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
        name: "Devayani Pathak",
        designtaion: 'Operations Head',
        text: "With a passion for travel and an insatiable curiosity for different cultures and people, Devayani is always on the go. Whether it's a workcation or a solo trip to the mountains of Ladakh, she revels in new adventures and the thrill of the unknown. As the Operations Head, Devayani is the rock that holds everything together, calmly handling the stress and juggling the demands of her team with ease. Her positive attitude and warm smile are infectious, inspiring everyone around her to be their best.",
        tagline: 'Workation and Wanderlust Warrior',
        image: 'media/website/DSC00858.jpg',
   }
   ,
       {
        name: "Janhavi Banka",
        designtaion: 'Travel Specialist',
        text: "Janhavi is a force to be reckoned with, a true multi-talented marketing expert with a passion for design, humor, and sales. With a drive to succeed, she's been making sales from day one, and her positive spirit and hunger for success have earned her a reputation as a rising star in the company. Not content to simply excel in one role, she's always seeking out new challenges, constantly expanding her skill set and bringing new ideas to the table. Her charisma, passion, and can-do attitude make her a natural fit for TTW.",
        tagline: 'Dynamic Marketing Prodigy',
        image: 'media/website/323897539_1402891100515796_2539841130125477535_n.jpg',
   },  {
    name: "Devansh Chawla",
    designtaion: 'VP, Engineering',
    text: "An avid traveler, you'll often find Devansh with a backpack and a map, ready to explore the mountains. He's a multi-talented tech expert with a passion for design and frontend development. But he's not afraid to roll up his sleeves and take on any challenge that comes his way. With a love for good vibes and seeking new adventures, Devansh is also a fan of Indian rap music, adding a rhythm to his travels. You can also find him indulging in R&R, enjoying the scenic views and reflecting on life's simple pleasures.",
    tagline: 'Globe-Trotting Tech Wizard',
    image: 'media/website/grey.png',
},
    ]
    const cards =[
                        <Card name={team[0].name} designation={team[0].designation} text={team[0].text} tagline={team[0].tagline} url={team[0].image}></Card>,
                                        <Card name={team[1].name} designation={team[1].designation} text={team[1].text} tagline={team[1].tagline} url={team[1].image}></Card>,
                <Card name={team[2].name} designation={team[2].designtaion} text={team[2].text} tagline={team[2].tagline} url={team[2].image}></Card>,
                <Card name={team[3].name} designation={team[3].designtaion} text={team[3].text} tagline={team[3].tagline} url={team[3].image}></Card>,
                <Card name={team[4].name} designation={team[4].designtaion} text={team[4].text} tagline={team[4].tagline} url={team[4].image}></Card>


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
    else return (
      <div>
        <Heading bold align="center" aligndesktop="center" margin="1.5rem">
          Our Team
        </Heading>
        <SwiperCarousel
          slidesPerView={1.3}
          initialSlide={1}
          centeredSlides
          cards={cards}
        ></SwiperCarousel>
        <br></br>
      </div>
    );
}

export default Team;