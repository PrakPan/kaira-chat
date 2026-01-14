import React from "react";
import styled from "styled-components";
import ReviewCard from "./ReviewCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import media from "../../components/media";
import SwiperCarousel from "../../components/SwiperCarousel";

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
  let isPageWide = media("(min-width: 768px)");

  const reviews = [
    {
      name: "Riya & Karan, Delhi",
      location: "An unforgettable honeymoon in Bali!",
      review: "TarzanWay made our Bali trip so personal — from a private villa setup to a surprise candlelight dinner by the beach. Everything felt curated just for us. Couldn’t have asked for a better start to our marriage!",
      sourceImage: "/01R.jpg",
      summary: "TarzanWay made our Bali trip so personal — from a private villa setup to a surprise candlelight dinner by the beach..."
    },
    {
      name: "Tanya, Bangalore",
      location: "Perfect winter escape to Europe",
      review: "I was worried about the visa process, but their team handled it so smoothly! We explored Germany and Austria during Christmas — it truly felt like a fairytale with all the markets and lights.",
      sourceImage: "/winterr.jpg",
      summary: "I was worried about the visa process, but their team handled it so smoothly! We explored Germany and Austria during Christmas..."
    },
    {
      name: "Rahul Mehta, Mumbai",
      location: "Incredible service and constant support",
      review: "From the first call to landing back home, the TarzanWay team was just a message away. They even rebooked one of our activities in Vietnam last-minute with zero hassle. That kind of support is rare.",
      sourceImage: "/03R.jpg",
      summary: "From the first call to landing back home, the TarzanWay team was just a message away. They even rebooked one of our activities..."
    },
    {
      name: "Isha, Madhya Pradesh",
      location: "Solo trip turned life-changing!",
      review: "I booked a solo trip to Japan — the AI itinerary suggested such offbeat places I’d never have found myself. Met amazing people, had local food tours, and even joined a pottery workshop!",
      sourceImage: "/04R.jpg",
      summary: "I booked a solo trip to Japan — the AI itinerary suggested such offbeat places I’d never have found myself..."
    },
    {
      name: "The Shah Family, Delhi",
      location: "Best family vacation ever",
      review: "We did a 10-day trip to Dubai and Singapore with our kids. Every detail — from hotel selection to kid-friendly activities — was spot-on. It felt like traveling with a planner who knows your family personally.",
      sourceImage: "/05R.jpg",
      summary: "We did a 10-day trip to Dubai and Singapore with our kids. Every detail — from hotel selection to kid-friendly activities — was spot-on..."
    },
    {
      name: "Oliver & Grace, Manchester",
      location: "Truly personalized experience",
      review: "I’ve used a few travel platforms before, but TarzanWay’s customisation tool is next-level. They really get your travel style — ours was food + culture, and the itinerary delivered exactly that.",
      sourceImage: "/truly.jpg",
      summary: "I’ve used a few travel platforms before, but TarzanWay’s customisation tool is next-level. They really get your travel style..."
    },
    {
      name: "Priya Menon, Bangalore",
      location: "Kerala was a dream!",
      review: "The houseboat experience was straight out of a movie. The local guide they arranged was so warm and knowledgeable — it felt like exploring with a friend rather than a tour.",
      sourceImage: "/kerala.jpg",
      summary: "The houseboat experience was straight out of a movie. The local guide they arranged was so warm and knowledgeable..."
    },
    {
      name: "Daniel C, Goa",
      location: "Exceeded expectations — and then some!",
      review: "I planned a last-minute New Year trip through them. The itinerary came together in hours, and everything went perfectly. This is my third trip with TarzanWay, and they keep raising the bar.",
      sourceImage: "/08R.jpg",
      summary: "I planned a last-minute New Year trip through them. The itinerary came together in hours, and everything went perfectly..."
    },
    {
      name: "Krishnan, Bengaluru",
      image: "media/review/175705428832380628585815429688.png",
      heading: "Munnar Tea Estate Walk",
      review: "We weren’t expecting to enjoy a tea plantation tour this much! Our guide shared stories of workers, traditions, and even plucked fresh tea leaves with us. The rolling green hills looked like a painting.",
      summary: "We weren’t expecting to enjoy a tea plantation tour this much! Our guide shared stories of workers, traditions,..."
    },
    {
      name: "Megha and Friends, Ahmedabad",
      image: "media/review/175705445291637659072875976562.png",
      heading: "Amazing Kerala Experience",
      review: "The pottery workshop turned out to be such a fun bonding activity! Our instructor was patient, and within minutes we were all laughing, covered in clay, and making surprisingly good pots. It felt both creative and therapeutic — a unique Kerala experience beyond the usual sightseeing.",
      summary: "The pottery workshop turned out to be such a fun bonding activity! Our instructor was patient, and within minutes we were all laughing..."
    },
    {
      name: "Priya, Delhi",
      image: "media/review/175705461243901562690734863281.png",
      heading: "Unforgettable Dreamy Escape to Kerala",
      review: "Evenings at Varkala were magical. The cliff cafés, sunset views, and yoga by the beach gave our trip a soulful balance between fun and relaxation",
      summary: "Evenings at Varkala were magical. The cliff cafés, sunset views,..."
    },
    {
      name: "Puneet Raheja and Family",
      image: "media/review/174799650875761675834655761719/.jpg",
      heading: "Highly recommend TTW for family-friendly holidays.",
      review: "Our trip to Bhutan with The Tarzan Way was a wonderful experience. Everything was well planned, smooth, and perfectly suited for a family vacation. The stays were comfortable, the activities were engaging for our kids, and we felt safe and cared for throughout.\r\nThe itinerary had the right mix of sightseeing, cultural experiences, and free time. It was a great way for our family to bond and explore a beautiful destination together. \r\nHighly recommend TTW for family-friendly holidays.",
      summary: "Our trip to Bhutan with The Tarzan Way was a wonderful experience. Everything was well planned, smooth, and perfectly..."
    },
    {
      name: "Uzay",
      image: "media/website/Uzay.png",
      location: "turkey",
      review:
        "A perfect company for your dreams, travel and volunteering Project. They are the best traveling company ın new Delhi. As a senior student in university I wanted to discover the most exotic part of the World, India .fter 2 weeks of web research and with luck, I was able to find Aryen, Shikhar, and Vaibhav in Tarzan Way Company. I know that it is difficult to find a trustworthy company in these days but you can trust TTW company in any terms. Don't miss that dream journey. Make your dreams to become real.",
      summary:
        "A perfect company for your dreams, travel and volunteering Project. They are the best traveling company ın new Delhi...",
    },
    {
      name: "Brian",
      image: "media/website/Brian.png",
      location: "us",
      review:
        "I have traveled to India once before for visiting a close friend. Going through Tarzan Way is the closest I could hope to reach the same experience. From the moment I asked for information, The team was incredibly helpful. Tarzan Way was able to put together a custom itinerary to meet my exact needs, including time period, budget, and desired activities. I felt secure in every communication and transaction, and they came through with many personal touches. I highly recommend it to anyone looking for a meaningful trip to India :)",
      summary:
        "From the moment I asked for information, The team was incredibly helpful. Tarzan Way was able to put together a custom itinerary to meet my exact needs...",
    },
    {
      name: "Vardaan Khosla",
      image: "media/website/Vardaan.jpeg",
      location: "india",
      review:
        "I never thought a travel agency could be so transparent about their prices. They gave me the best price on my trip all around India and were so helpful. Best service by far, I had missed my bus to Jaipur at 2AM but they were very cooperative and booked another bus for me at the same time. Would recommend it to everyone for everything related to their travel needs!!",
      summary:
        "I never thought a travel agency could be so transparent about their prices. They gave me the best price on my trip...",
    },
    {
      name: "Anisha Pal",
      image: "media/website/Anisha Pal.png",
      location: "india",
      review:
        "This travel agency is literally the BEST! They were so transparent about their prices and gave me the best price on my trip all around India and were so helpful. Best service by far! Would recommend it to everyone for everything related to their travel needs! They're so cooperative and friendly. Perfect for people like us, the wanderers in search of solace, calm and serenity!",
      summary:
        "This travel agency is literally the BEST!They were so transparent about their prices...",
    },
    {
      name: "Medya Danisman",
      image: "media/website/Medya Danisman.jpg",
      location: "france",
      review:
        "I had a wonderful experience, with Naman my coordinator and other team members ! I didn't know much about India if not negative informations we have through media... but they showed me the beautiful side of India I'll never forget. I felt very secure knowing that there is someone I can reach at any moment (and that happened A LOT), fast response and quick solutions ! For someone who is not familiar with Indian Culture and the country, I only can 1000% recommend ! At the end, TTW became more my friends and family than a regular travel agency !",
      summary:
        "I had a wonderful experience, with Naman my coordinator and other team members...",
    },
    {
      name: "Montserrat Zetina",
      location: "mexico",
      image: "media/website/Monsterrat.jpeg",
      review:
        "I wish I could say goodbye to both Aryen and Shikhar! I just wanna say thank you for everything they did for me. It was an amazing trip that I will always remember. It’s a really great job you are doing. I think is one of the best trips I would ever have in my life so thank you for that. I love the culture, the people, the food everything in India. I am sure I’ll return some day. Thank you so so much! I hope to see you both one day! You are such a great people :) And you’ll always have a home in Mexico <3",
      summary:
        "I just wanna say thank you for everything they did for me. It was an amazing trip...",
    },
    {
      name: "Sayani",
      image: "media/website/image.jpg",
      location: "india",
      review:
        "The safari arranged by then was great. The driver who took us for the safari was very friendly and nice. Thanks a lot Tanvi! Your entire team has been very very supportive . Wouldn't have been possible to have such a good trip without you guys",
      summary:
        "Thanks a lot Tanvi! Your entire team has been very very supportive. Wouldn't have been possible ...",
    },
    {
      name: "Aastha Narula",
      image: "media/website/Aastha Narula1.jpeg",
      location: "india",
      review:
        "It was a wonderful experience with The Tarzan Way. Specially the efforts made by the coordinator were highly appreciated. Everything was good. We had some issues with the hotel but that was also very well handled by the coordinator. So overall it was a great experience. We can plan another trip with the same company and their team.",
      summary: "It was a wonderful experience with The Tarzan Way...",
    },
    {
      name: "Aziza",
      image: "media/website/Aziza.png",
      location: "indonesia",
      review:
        "The Tarzan Way isn’t your typical travel agent, they will create a personalized travel itinerary which will escalate your journey in India. The team work with passion and professionalism. They are super communicative and responsive too. Trust me, you’ll be in a good hand. I’ll definitely recommend it!",
      summary:
        "The Tarzan Way isn’t your typical travel agent, they will create a personalized travel itinerary which will escalate your journey in India....",
    },
    {
      name: "Jasleen",
      image: "media/website/Jasleen.jpeg",
      location: "india",
      review:
        "Firstly, I'd like to start by expressing gratitude to you and your entire team for this amazing, amazing excursion!!!😍 And also, for this, and every other text that you've sent! Before the trip, during the trip and even now! You have been the most understanding person ever. And I really really appreciate the way you talk. The professionalism, the politeness, the sweetness. Thank you!",
      summary:
        "Firstly, I'd like to start by expressing gratitude to you and your entire team for this amazing, amazing excursion...",
    },
    {
      name: "Shivam Sachdev",
      location: "us",
      review:
        "My friends and I planned a week long road trip from Delhi to many cities in Uttarakhand during the pandemic. It was a great experience from the planning to booking. The team is really polite and helpful with all your requests and the best part is they really care about how our trip is going. Made some really good friends with these people, would definitely recommend tarzan way for your travel plans.",
      image: "media/website/Shivam.jpeg",
      summary:
        "My friends and I planned a week long road trip from Delhi to many cities in Uttarakhand during the pandemic. It was a great experience...",
    }
  ];
  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

  let FlickityCards = [];
  for (var i = 0; i < reviews.length; i++) {
    FlickityCards.push(
      <ReviewCard
        text={reviews[i].summary}
        review={reviews[i].review}
        name={reviews[i].name}
        location={reviews[i].location}
        url={reviews[i]?.sourceImage ? `${reviews[i].sourceImage}` : reviews[i].image}
        imgUrlEndPoint={reviews[i]?.sourceImage ? true : ''}
      ></ReviewCard>
    );
  }

  if (isPageWide) {
    if (!isPageWide)
      return (
        <div style={{ background: "#F7e700", padding: "1rem 0" }}>
          <div className="center-div">
            <Heading className="" margin="0" padding="0">
              Stories from around the world
            </Heading>
          </div>
        </div>
      );
    else
      return (
        <div style={{ background: "#F7e700" }}>
          <ReviewContainer>
            {/* <ReviewColumnContainer style={{ padding: "0 0 2rem 0 !important" }}>
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
            </ReviewColumnContainer> */}
            {/* <div className="grid grid-cols-3 gap-6"> */}
            {[0, 1, 2].map((col) => (
              <ReviewColumnContainer key={col}>
                {reviews.filter((_, i) => i % 3 === col).map((item) => (<>
                  <ReviewCard
                    key={item.id}
                    text={item.summary}
                    review={item.review}
                    name={item.name}
                    location={item.location}
                    url={item?.sourceImage ? `${item.sourceImage}` : item.image}
                    imgUrlEndPoint={item?.sourceImage ? true : ''}
                  />
                </>
                ))}
              </ReviewColumnContainer>
            ))}
            {/* </div> */}


          </ReviewContainer>
          <ReviewGridContainer>
            <div
              className="center-div"
              style={{ flexDirection: "row", marginBottom: "0.5rem" }}
            >
              <FontAwesomeIcon icon={faStar} style={{ fontSize: "1rem" }} /> &nbsp; &nbsp;
              <a target="blank" href="https://www.google.com/search?sca_esv=a28496639b382774&rlz=1C5CHFA_enIN1049IN1049&sxsrf=AE3TifNgnS5_NLsFc0vqOOkgMvMgve-KSg:1766565214525&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E6TeLrRiOOBypGL7MjsjPJ6isQgeCtaAv26Gfml7YliEn1nTckYdmPP6fPyfCXd0FidlZuXO9io52AkUNNIhBCxuFBop&q=The+Tarzan+Way+Reviews&sa=X&ved=2ahUKEwiki9ag6NWRAxVvUGwGHaZYLUUQ0bkNegQILxAE&biw=1710&bih=893&dpr=2"
                className="text-blue" style={{ margin: "0" }}>
                Read more
              </a>
              &nbsp; &nbsp;
              <FontAwesomeIcon icon={faStar} style={{ fontSize: "1rem" }} />
            </div>
            <ReviewLogo
              src={
                "https://d31aoa0ehgvjdi.cloudfront.net/media/website/googlereviews.png"
              }
            ></ReviewLogo>
          </ReviewGridContainer>
        </div>
      );
  } else
    return (
      <div style={{ background: "#F7e700", padding: "1rem 0 1.5rem 0" }}>
        <SwiperCarousel
          slidesPerView={1.3}
          initialSlide={1}
          centeredSlides
          cards={FlickityCards}
        ></SwiperCarousel>
        <ReviewGridContainer>
          <div
            className="center-div"
            style={{ flexDirection: "row", marginBottom: "0.5rem" }}
          >
            <FontAwesomeIcon icon={faStar} style={{ fontSize: "1rem" }} />
            <Heading
              className=""
              style={{ margin: "0 0.5rem 0 0.5rem" }}
            >
              {" "}
              Read more{" "}
            </Heading>
            <FontAwesomeIcon icon={faStar} style={{ fontSize: "1rem" }} />
          </div>
          <ReviewLogo
            src={
              "https://d31aoa0ehgvjdi.cloudfront.net/media/website/googlereviews.png"
            }
          ></ReviewLogo>
        </ReviewGridContainer>
      </div>
    );
};

export default TestimonialReviews;
