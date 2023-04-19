import React from 'react';
import styled from 'styled-components';
import ReviewCard from './ReviewCard';
import Flickity from '../../components/FlickityCarousel';
// import google from '../../public/assets/icons/reviewbrands/google.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import media from '../../components/media';
const Heading = styled.p`
    font-size: 1.5rem
    padding: 1rem 0;
    text-align: center;
    font-weight: 600;
    @media screen and (min-width: 768px){
        padding: 1rem;
        font-weight: 600;


    }
`;
const ReviewContainer = styled.div`
  display: block;
  @media screen and (min-width: 768px) {
    padding: 0 1.5rem 1.5rem 1.5rem;
    display: grid;
    grid-gap: 1.5rem;
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const ReviewColumnContainer = styled.div`
  margin: 2rem 0rem 2rem 0rem;
  @media screen and (min-width: 768px) {
    padding: 0rem;
  }
  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    padding: 2rem 0rem 0rem 0rem;
  }
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: max-content;
  grid-gap: 1.5rem;
`;

const ReviewGridContainer = styled.div`
  width: 80%;
  margin: 1.5rem auto 0 auto;
  @media screen and (min-width: 768px) {
    margin: 0 auto 0 auto;
    width: 40%;
    padding-bottom: 3rem;
  }
`;
const ReviewLogo = styled.img`
  width: 80%;
  margin: auto;
  display: block;
  @media screen and (min-width: 768px) {
    width: 40%;
  }
`;
const TestimonialReviews = () => {
  let isPageWide = media('(min-width: 768px)');

  {
    /*
    let reviews = [];

    for (var i = 0; i < 11; i++) {
        reviews.push(
            <Card className="font-nunito text-center">
                <ImageLoader dimensions={{ width: 225, height: 220 }} borderRadius={"50%"} width="50%" url="media/ruby/cycletour.jpg" />
                <br />
                <h2><b>Shikhar Chadha</b></h2>
                <h3><Icon src={LocationIcon} />Delhi</h3>
                <p>“Random Review Lorem Ipsum Random Review Lorem
                Ipsum Random Review Lorem Ipsum Random Review
                Lorem IpsumRandom Review Lorem IpsumRandom Review Lorem IpsumRandom Random
                Ipsum Random Review Lorem Ipsum Random Review
                Lorem IpsumRandom Review Lorem IpsumRandom Review Lorem IpsumRandom Random”
            </p>
            </Card>
        )
    }
    */
  }
  const reviews = [
    {
      name: 'Uzay',
      image: 'media/website/Uzay.png',
      location: 'turkey',
      review:
        "A perfect company for your dreams, travel and volunteering Project. They are the best traveling company ın new Delhi. As a senior student in university I wanted to discover the most exotic part of the World, India .fter 2 weeks of web research and with luck, I was able to find Aryen, Shikhar, and Vaibhav in Tarzan Way Company. I know that it is difficult to find a trustworthy company in these days but you can trust TTW company in any terms. Don't miss that dream journey. Make your dreams to become real.",
      summary:
        'A perfect company for your dreams, travel and volunteering Project. They are the best traveling company ın new Delhi...',
    },
    {
      name: 'Brian',
      image: 'media/website/Brian.png',
      location: 'us',
      review:
        'I have traveled to India once before for visiting a close friend. Going through Tarzan Way is the closest I could hope to reach the same experience. From the moment I asked for information, The team was incredibly helpful. Tarzan Way was able to put together a custom itinerary to meet my exact needs, including time period, budget, and desired activities. I felt secure in every communication and transaction, and they came through with many personal touches. I highly recommend it to anyone looking for a meaningful trip to India :)',
      summary:
        'From the moment I asked for information, The team was incredibly helpful. Tarzan Way was able to put together a custom itinerary to meet my exact needs...',
    },
    {
      name: 'Vardaan Khosla',
      image: 'media/website/Vardaan.jpeg',
      location: 'india',
      review:
        'I never thought a travel agency could be so transparent about their prices. They gave me the best price on my trip all around India and were so helpful. Best service by far, I had missed my bus to Jaipur at 2AM but they were very cooperative and booked another bus for me at the same time. Would recommend it to everyone for everything related to their travel needs!!',
      summary:
        'I never thought a travel agency could be so transparent about their prices. They gave me the best price on my trip...',
    },

    {
      name: 'Anisha Pal',
      image: 'media/website/Anisha Pal.png',
      location: 'india',
      review:
        "This travel agency is literally the BEST! They were so transparent about their prices and gave me the best price on my trip all around India and were so helpful. Best service by far! Would recommend it to everyone for everything related to their travel needs! They're so cooperative and friendly. Perfect for people like us, the wanderers in search of solace, calm and serenity!",
      summary:
        'This travel agency is literally the BEST!They were so transparent about their prices...',
    },
    {
      name: 'Medya Danisman',
      image: 'media/website/Medya Danisman.jpg',
      location: 'france',
      review:
        "I had a wonderful experience, with Naman my coordinator and other team members ! I didn't know much about India if not negative informations we have through media... but they showed me the beautiful side of India I'll never forget. I felt very secure knowing that there is someone I can reach at any moment (and that happened A LOT), fast response and quick solutions ! For someone who is not familiar with Indian Culture and the country, I only can 1000% recommend ! At the end, TTW became more my friends and family than a regular travel agency !",
      summary:
        'I had a wonderful experience, with Naman my coordinator and other team members...',
    },

    {
      name: 'Montserrat Zetina',
      location: 'mexico',
      image: 'media/website/Monsterrat.jpeg',
      review:
        'I wish I could say goodbye to both Aryen and Shikhar! I just wanna say thank you for everything they did for me. It was an amazing trip that I will always remember. It’s a really great job you are doing. I think is one of the best trips I would ever have in my life so thank you for that. I love the culture, the people, the food everything in India. I am sure I’ll return some day. Thank you so so much! I hope to see you both one day! You are such a great people :) And you’ll always have a home in Mexico <3',
      summary:
        'I just wanna say thank you for everything they did for me. It was an amazing trip...',
    },
    {
      name: 'Sayani',
      image: 'media/website/image.jpg',
      location: 'india',
      review:
        "The safari arranged by then was great. The driver who took us for the safari was very friendly and nice. Thanks a lot Tanvi! Your entire team has been very very supportive . Wouldn't have been possible to have such a good trip without you guys",
      summary:
        "Thanks a lot Tanvi! Your entire team has been very very supportive. Wouldn't have been possible ...",
    },
    {
      name: 'Aastha Narula',
      image: 'media/website/Aastha Narula1.jpeg',
      location: 'india',
      review:
        'It was a wonderful experience with The Tarzan Way. Specially the efforts made by the coordinator were highly appreciated. Everything was good. We had some issues with the hotel but that was also very well handled by the coordinator. So overall it was a great experience. We can plan another trip with the same company and their team.',
      summary: 'It was a wonderful experience with The Tarzan Way...',
    },
    {
      name: 'Aziza',
      image: 'media/website/Aziza.png',
      location: 'indonesia',
      review:
        'The Tarzan Way isn’t your typical travel agent, they will create a personalized travel itinerary which will escalate your journey in India. The team work with passion and professionalism. They are super communicative and responsive too. Trust me, you’ll be in a good hand. I’ll definitely recommend it!',
      summary:
        'The Tarzan Way isn’t your typical travel agent, they will create a personalized travel itinerary which will escalate your journey in India....',
    },

    {
      name: 'Jasleen',
      image: 'media/website/Jasleen.jpeg',
      location: 'india',
      review:
        "Firstly, I'd like to start by expressing gratitude to you and your entire team for this amazing, amazing excursion!!!😍 And also, for this, and every other text that you've sent! Before the trip, during the trip and even now! You have been the most understanding person ever. And I really really appreciate the way you talk. The professionalism, the politeness, the sweetness. Thank you!",
      summary:
        "Firstly, I'd like to start by expressing gratitude to you and your entire team for this amazing, amazing excursion...",
    },

    {
      name: 'Shivam Sachdev',
      location: 'us',
      review:
        'My friends and I planned a week long road trip from Delhi to many cities in Uttarakhand during the pandemic. It was a great experience from the planning to booking. The team is really polite and helpful with all your requests and the best part is they really care about how our trip is going. Made some really good friends with these people, would definitely recommend tarzan way for your travel plans.',
      image: 'media/website/Shivam.jpeg',
      summary:
        'My friends and I planned a week long road trip from Delhi to many cities in Uttarakhand during the pandemic. It was a great experience...',
    },
  ];
  const mobilereviews = [
    {
      name: 'Uzay',
      image: 'media/website/Uzay.png',
      location: 'turkey',
      review:
        "A perfect company for your dreams, travel and volunteering Project. They are the best traveling company ın new Delhi. As a senior student in university I wanted to discover the most exotic part of the World, India .fter 2 weeks of web research and with luck, I was able to find Aryen, Shikhar, and Vaibhav in Tarzan Way Company. I know that it is difficult to find a trustworthy company in these days but you can trust TTW company in any terms. Don't miss that dream journey. Make your dreams to become real.",
      summary:
        'A perfect company for your dreams, travel and volunteering Project. They are the best traveling company ın new Delhi...',
    },
  ];
  let FlickityCards = [];
  for (var i = 0; i < reviews.length; i++) {
    FlickityCards.push(
      <ReviewCard
        text={reviews[i].summary}
        review={reviews[i].review}
        name={reviews[i].name}
        location={reviews[i].location}
        url={reviews[i].image}
      ></ReviewCard>
    );
  }
  if (isPageWide) {
    if (!isPageWide)
      //chage to ipdad
      return (
        <div style={{ background: '#F7e700', padding: '1rem 0' }}>
          <div className="center-div">
            <Heading className="font-opensans" margin="0" padding="0">
              Stories from around the world
            </Heading>
          </div>
          {/* <Flickity twocards borderRadius="10px" cards={[<ReviewCard  text={reviews[0].review} name={reviews[0].name}></ReviewCard>, <ReviewCard text={reviews[0].review} name={reviews[0].name}></ReviewCard>, <ReviewCard  text={reviews[0].review} name={reviews[0].name}></ReviewCard>, <ReviewCard  text={reviews[0].review} name={reviews[0].name}></ReviewCard>]}></Flickity> */}
        </div>
      );
    else
      return (
        <div style={{ background: '#F7e700' }}>
          <ReviewContainer>
            <ReviewColumnContainer style={{ padding: '0 0 2rem 0 !important' }}>
              <ReviewCard
                text={reviews[0].summary}
                review={reviews[0].review}
                name={reviews[0].name}
                location={reviews[0].location}
                url={reviews[0].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[1].summary}
                review={reviews[1].review}
                name={reviews[1].name}
                location={reviews[1].location}
                url={reviews[1].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[2].summary}
                review={reviews[2].review}
                name={reviews[2].name}
                location={reviews[2].location}
                url={reviews[2].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[3].summary}
                review={reviews[3].review}
                name={reviews[3].name}
                location={reviews[3].location}
                url={reviews[3].image}
              ></ReviewCard>
              {/* <ReviewCard text={reviews[0].summary} review={reviews[0].review} name={reviews[0].name} location={reviews[0].location}></ReviewCard> */}
            </ReviewColumnContainer>
            <ReviewColumnContainer>
              <ReviewCard
                text={reviews[4].summary}
                review={reviews[4].review}
                name={reviews[4].name}
                location={reviews[4].location}
                url={reviews[4].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[5].summary}
                review={reviews[5].review}
                name={reviews[5].name}
                location={reviews[5].location}
                url={reviews[5].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[6].summary}
                review={reviews[6].review}
                name={reviews[6].name}
                location={reviews[6].location}
                url={reviews[6].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[7].summary}
                review={reviews[7].review}
                name={reviews[7].name}
                location={reviews[7].location}
                url={reviews[7].image}
              ></ReviewCard>
              {/* <ReviewCard text={reviews[0].summary} review={reviews[0].review} name={reviews[0].name} location={reviews[0].location}></ReviewCard> */}
            </ReviewColumnContainer>
            <ReviewColumnContainer>
              <ReviewCard
                text={reviews[8].summary}
                review={reviews[8].review}
                name={reviews[8].name}
                url={reviews[8].image}
                location={reviews[8].location}
              ></ReviewCard>
              <ReviewCard
                text={reviews[9].summary}
                review={reviews[9].review}
                name={reviews[9].name}
                location={reviews[9].location}
                url={reviews[9].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[10].summary}
                review={reviews[10].review}
                name={reviews[10].name}
                location={reviews[10].location}
                url={reviews[10].image}
              ></ReviewCard>
              <ReviewCard
                text={reviews[0].summary}
                review={reviews[0].review}
                name={reviews[0].name}
                location={reviews[0].location}
                url={reviews[0].image}
              ></ReviewCard>
              {/* <ReviewCard text={reviews[0].summary} review={reviews[0].review} name={reviews[0].name} location={reviews[0].location}></ReviewCard> */}
            </ReviewColumnContainer>
          </ReviewContainer>
          {/* <ButtonContainer className="center-div">
                <Button hoverColor={"white"} hoverBgColor={"black"} borderRadius={"5px"} width={"13rem"}>More Stories</Button>
            </ButtonContainer> */}
          <ReviewGridContainer>
            <div
              className="center-div"
              style={{ flexDirection: 'row', marginBottom: '0.5rem' }}
            >
              <FontAwesomeIcon icon={faStar} style={{ fontSize: '1rem' }} />
              <Heading className="font-opensans" style={{ margin: '0' }}>
                Read more
              </Heading>
              <FontAwesomeIcon icon={faStar} style={{ fontSize: '1rem' }} />
            </div>
            <ReviewLogo
              src={
                'https://d31aoa0ehgvjdi.cloudfront.net/media/website/googlereviews.png'
              }
            ></ReviewLogo>
          </ReviewGridContainer>
        </div>
      );
  } else
    return (
      <div style={{ background: '#F7e700', padding: '1rem 0 1.5rem 0' }}>
        <Flickity borderRadius="10px" cards={FlickityCards}></Flickity>
        <ReviewGridContainer>
          <div
            className="center-div"
            style={{ flexDirection: 'row', marginBottom: '0.5rem' }}
          >
            <FontAwesomeIcon icon={faStar} style={{ fontSize: '1rem' }} />
            <Heading
              className="font-opensans"
              style={{ margin: '0 0.5rem 0 0.5rem' }}
            >
              {' '}
              Read more{' '}
            </Heading>
            <FontAwesomeIcon icon={faStar} style={{ fontSize: '1rem' }} />
          </div>
          <ReviewLogo
            src={
              'https://d31aoa0ehgvjdi.cloudfront.net/media/website/googlereviews.png'
            }
          ></ReviewLogo>
        </ReviewGridContainer>
      </div>
    );
  // else return null;
};

export default TestimonialReviews;
