import styled from "styled-components";
import BackgroundImageLoader from "../../components/UpdatedBackgroundImageLoader";

const LetsTalk = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-align: center;
  @media screen and (min-width: 768px) {
    font-size: 5rem;
  }
`;

const Text = styled.p`
  font-size: 1.25rem;
  color: white;
  width: 90%;
  margin: auto;
  text-align: center;
  @media screen and (min-width: 768px) {
    font-size: 2rem;
    width: 50%;
    font-weight: 300;
  }
`;

const TextContainer = styled.div`
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  width: 100%;
`;

const Image = () => {
  return (
    <BackgroundImageLoader
      filter="brightness(0.65)"
      url="media/website/contactcover.webp"
      center
      height={"60vh"}
      style={{ position: "relative" }}
    >
      <TextContainer>
        <LetsTalk className="">
          <b>Let's Talk</b>
        </LetsTalk>

        <Text className="font-nunito">
          We love to talk to our travel community. If you've anything you want
          to ask, feel free to get in touch.
        </Text>
      </TextContainer>
    </BackgroundImageLoader>
  );
};

export default Image;
