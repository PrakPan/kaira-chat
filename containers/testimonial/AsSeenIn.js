import React , {useState} from 'react';
import styled, { keyframes } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import Heading from '../../components/heading/Heading';
import media from '../../components/media';

const HeadingContainer = styled.div`
    border-style: solid none none none;
    border-color: #f7e700;
    border-width: 3px;
    width: 30%;
    margin: auto;
    @media screen and (min-width: 768px){ 
        border-width: 2px;

    }
`;
const HeadingNew = styled.p`
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    margin: ${(props) => (props.margin ? props.margin : "0 0 1rem 0")};
    @media screen and (min-width: 768px){ 
        font-size: 3rem;
        margin: ${(props) => (props.margin ? props.margin : "0")};

    }
`;

const DesktopSlideShow = keyframes`
0% {
  transform: translateX(0vw);  
}
100% {
  transform: translateX(-137vw);  
}
`;

const mobileSlideShow = keyframes`
0% {
    transform: translateX(0vw);       
    }
    100% {
    transform: translateX(-650vw);  
    }
`;



const MarqueeContainer = styled.div`
width: 100%;
overflow: hidden;
display:flex;
position: relative;
`;

const Img = styled.img`
width: 10rem;
max-height: 7rem;
padding: 1rem 1rem 2rem 1rem;
margin: auto;
animation: ${mobileSlideShow} 35s linear infinite;
@media screen and (min-width: 768px){ 
    width: 15rem;
    max-height: 7rem;
    padding: 2rem 3.5rem 2rem 3.5rem;
animation: ${DesktopSlideShow} 30s linear infinite;
}
`;

const Container = styled.div`

margin-bottom: 1rem;

`;
const InnerContainer = styled.div`
    height: 30rem;
`;
const GridContainer = styled.div`
    margin: auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    @media screen and (min-width: 768px){
            // width: 80%;

        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    }

`;
const LogoContainer = styled.div`


`;
const NewImg = styled.img`
    width: 90%;
    display: block;
    margin: auto;

    @media screen and (min-width: 768px){
            width: 70%;
            margin: 2rem auto;
    }
`;
const ContentContainer = styled.div`
    margin: auto;
    padding-bottom: 2rem;
    @media screen and (min-width: 768px){
        width: 70%; 
        padding: 2rem;
    }

`;
const ReviewHeading = styled.h3`
      font-size: 1rem;
         text-align: center;
        font-weight: 400;
    line-height: 1.5;
        &:before{
            content: open-quote;
            font-family: "Font Awesome 5 Free";
            font-size:2.5rem ;
             padding: 0;
            display: inline-block;
            line-height: 1;
        }
        margin: 2rem;
        @media screen and (min-width: 768px){
           font-size: 1.5rem;
              &:before{
            content: open-quote;
            font-family: "Font Awesome 5 Free";
              padding: 0;
            margin-right: 0.5rem;            
            display: inline-block;
            text-align: left;
            line-height: 1;

            }
        }
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
        font-size: ${props => props.theme.fontsizes.desktop.text.three ?  props.theme.fontsizes.desktop.text.three :  props.theme.fontsizes.desktop.text.three};
        margin: 0;
`;
const ReadFull = styled.a`
    text-align: center;
    text-decoration: none;
    display: block;
    width: max-content;
    color: black;
    margin:auto;
    border-style: none none solid none;
    border-color: transparent;
    border-width: 1px;
    &:hover{
        cursor: pointer;
        border-color: black;
        color: black;
    }
    width: max-content;
    margin: auto;
`;
const LogoOuterContainer = styled.div`
    border-style: none none solid none;
    border-width: 3px;
    border-color: transparent;
    &:hover{

        cursor: pointer;
    }
`;
const AsSeenIn = (props) => {
    let isPageWide = media('(min-width: 768px)')


    const [selected, setSelected] = useState(0);
    const Quotes = [
      "In addition to providing worry-free travel as regards health concerns, The Tarzan Way does a complete surrender to nature along with teaching reasonable self-dependency, isolationist travel aligns nicely with responsible tourism.",
      "While creating a highly personalized experience, companies need to keep in mind the traveler’s purpose and what a particular location may have to offer, The Tarzan Way is doing a great job for that.",
      "The Tarzan Way wants to revamp the entire traveler experience by making it more streamlined and customer-friendly.",
      "A young team of entrepreneurs taking on the travel industry with The Tarzan Way is a travel & tech-based venture that aims at simplifying travel for its users and does so brilliantly.",
      "The Tarzan Way provides the best information for traveling with live support to travelers to ensure a hassle free travel experience.",
      `Giving an employer's perspective, Shikhar Chadha, CEO of travel firm The Tarzan Way, said, "Initially, WFH was very difficult because we were not familiar with it. Coordinating on phone was challenging but eventually we adapted to working remotely."`,
      "Imagine you're a traveler, and you want to visit some place; You might be interested in an exciting road trip, or thrilling treks, maybe a heritage walk and what not. What market has to offer you",
    ];
    const Urls = [
      "https://www.outlookindia.com/outlooktraveller/explore/story/70734/the-new-travel-trends-of-the-covid-19-era",
      "https://indianexpress.com/article/lifestyle/destination-of-the-week/travelling-in-the-new-normal-how-pandemic-has-changed-the-rules-of-the-game-7058162/",
      "https://www.phocuswire.com/startup-stage-the-tarzan-way-wants-to-celebrate-the-uniqueness-of-every-traveler",
      "https://www.brilliantread.com/interview-with-shikhar-chadha-founder-at-the-tarzan-way/",
      "https://yourstory.com/hindi/noida-startup-the-tarzan-way-providing-unique-travel-plan",
      "https://hr.economictimes.indiatimes.com/news/trends/employee-experience/how-work-from-home-culture-is-changing-the-face-of-work/83780507",
      "https://www.f6s.com/companies/sustainable-tourism/india/co",
    ];
    return (
      <Container>
        <InnerContainer>
          <div>
            {/* <HeadingNew className="font-lexend" margin={props.margin}>
              What They Say
            </HeadingNew> */}
            {/* <HeadingContainer></HeadingContainer> */}
          </div>
          <GridContainer>
            <LogoOuterContainer
              className="center-div"
              onMouseEnter={() => setSelected(0)}
              style={{
                borderColor: selected === 0 ? "#F7e700" : "transparent",
              }}
            >
              <LogoContainer className="center-div">
                <NewImg
                  src={
                    "https://d31aoa0ehgvjdi.cloudfront.net/eyJidWNrZXQiOiJ0aGV0YXJ6YW53YXktd2ViIiwia2V5IjoibWVkaWEvd2Vic2l0ZS9vdXRsb29rLnBuZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTUwLCJoZWlnaHQiOjE1MCwiZml0IjoiY292ZXIifX19"
                  }
                />
              </LogoContainer>
            </LogoOuterContainer>
            <LogoOuterContainer
              className="center-div"
              onMouseEnter={() => setSelected(1)}
              style={{
                borderColor: selected === 1 ? "#F7e700" : "transparent",
              }}
            >
              <LogoContainer className="center-div">
                <NewImg
                  src={
                    "https://d31aoa0ehgvjdi.cloudfront.net/eyJidWNrZXQiOiJ0aGV0YXJ6YW53YXktd2ViIiwia2V5IjoibWVkaWEvd2Vic2l0ZS9pbmRpYW5leHByZXNzLnBuZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTUwLCJoZWlnaHQiOjQxLCJmaXQiOiJjb250YWluIn19fQ=="
                  }
                />
              </LogoContainer>
            </LogoOuterContainer>
            <LogoOuterContainer
              className="center-div"
              onMouseEnter={() => setSelected(2)}
              style={{
                borderColor: selected === 2 ? "#F7e700" : "transparent",
              }}
            >
              <LogoContainer className="center-div">
                <NewImg
                  src={
                    "https://d31aoa0ehgvjdi.cloudfront.net/eyJidWNrZXQiOiJ0aGV0YXJ6YW53YXktd2ViIiwia2V5IjoibWVkaWEvd2Vic2l0ZS9waG9jdXN3aXJlLnBuZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTUwLCJoZWlnaHQiOjI5LCJmaXQiOiJjb3ZlciJ9fX0="
                  }
                />
              </LogoContainer>
            </LogoOuterContainer>
            {isPageWide ? (
              <LogoOuterContainer
                className="center-div"
                onMouseEnter={() => setSelected(3)}
                style={{
                  borderColor: selected === 3 ? "#F7e700" : "transparent",
                }}
              >
                <LogoContainer className="center-div">
                  <NewImg
                    src={
                      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/brilliant.png"
                    }
                  />
                </LogoContainer>
              </LogoOuterContainer>
            ) : null}
            {isPageWide ? (
              <LogoOuterContainer
                className="center-div"
                onMouseEnter={() => setSelected(4)}
                style={{
                  borderColor: selected === 4 ? "#F7e700" : "transparent",
                }}
              >
                <LogoContainer className="center-div">
                  <NewImg
                    src={
                      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/yourstory.png"
                    }
                  />
                </LogoContainer>
              </LogoOuterContainer>
            ) : null}
            {isPageWide ? (
              <LogoOuterContainer
                className="center-div"
                onMouseEnter={() => setSelected(5)}
                style={{
                  borderColor: selected === 5 ? "#F7e700" : "transparent",
                }}
              >
                <LogoContainer className="center-div">
                  <NewImg
                    src={
                      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/economic-times.jpg"
                    }
                  />
                </LogoContainer>
              </LogoOuterContainer>
            ) : null}
            {isPageWide ? (
              <LogoOuterContainer
                className="center-div"
                onMouseEnter={() => setSelected(6)}
                style={{
                  borderColor: selected === 6 ? "#F7e700" : "transparent",
                }}
              >
                <LogoContainer className="center-div">
                                <NewImg
                                    style={{width : '80px' , height : '80px'}}
                    src={
                      "https://d31aoa0ehgvjdi.cloudfront.net/media/website/f6s-logo.png"
                    }
                  />
                </LogoContainer>
              </LogoOuterContainer>
            ) : null}
          </GridContainer>
          <ContentContainer>
            <ReviewHeading className="font-lexend">
              {Quotes[selected]}
            </ReviewHeading>
            {!props.disablelinks ? (
              <ReadFull
                href={Urls[selected]}
                target="_blank"
                className="font-lexend"
              >
                Full Article
              </ReadFull>
            ) : null}
          </ContentContainer>
        </InnerContainer>
      </Container>
    );
}

export default AsSeenIn;