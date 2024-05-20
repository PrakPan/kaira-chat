import styled from "styled-components";
import H8 from "../heading/H8";
import H9 from "../heading/H9";
import media from "../../components/media";

const Flex = styled.div`
  display: grid;
  grid-template-columns: max-content auto;
  grid-column-gap: 20px;
  @media screen and (min-width: 768px) {
    margin-block: 0.75rem;
  }
`;

const Icon = styled.div`
  font-size: 55px;
  margin-top: -20px;
  height: 4.5rem;
  width: 4.5rem;
  text-align: center;
`;

const Items = styled.div`
  display: grid;
  grid-row-gap: 1rem;

  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 2fr;
    margin-inline: 0px;
    grid-column-gap: 2rem;
  }
`;

const ImagesArr = ["🌴", "🌍", "📱", "🕰️", "🦜", "💰"];

const HeadingArr = [
  "Personalization in seconds",
  "Best Real-Time Negotiated Bookings",
  "Book-it-all in one click",
  "24x7 Live Assistance as you explore",
  "Offbeat Experiences, curated for you",
  "Transparent Pricing - No Commissions",
];

const TextArr = [
  "Personalized and flexible itineraries crafted by our AI-powered planner",
  "Dedicated travel experts negotiate the best prices within your budget",
  "Book all your personalized and flexible travel needs in just one click",
  "24x7 support that keeps you swinging all day and night, no monkey business!",
  "Discover offbeat adventures, activities & experiences.",
  "Transparent pricing with no hidden fees - pay only a small service fee!",
];

const WhyPlanWithUs = (props) => {
  let isPageWide = media("(min-width: 768px)");

  const newArr = [];

  for (let i = 0; i < ImagesArr.length; i++) {
    newArr.push(
      <Flex>
        <Icon>{ImagesArr[i]}</Icon>
        <div>
          <H8
            style={{
              fontSize: isPageWide ? "18px" : "14px",
              marginTop: "-5px",
              marginBottom: "5px",
            }}
            className="font-lexend"
          >
            {HeadingArr[i]}
          </H8>
          <H9
            style={{
              fontSize: isPageWide ? "15px" : "12px",
              paddingRight: "5px",
            }}
            className="font-lexend"
          >
            {TextArr[i]}
          </H9>
        </div>
      </Flex>
    );
  }

  return (
    <Items>
      {newArr.map((e, i) => (
        <div key={i}>{e}</div>
      ))}
    </Items>
  );
};

export default WhyPlanWithUs;
