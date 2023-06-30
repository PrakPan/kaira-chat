import styled from 'styled-components';
import BackgroundImageLoader from '../../components/UpdatedBackgroundImageLoader';
import media from '../../components/media';

  const LetsTalk = styled.h1`
   font-size: 2.5rem;
      /* font-size: ${props => props.theme.fontsizes.desktop.headings.three ? props.theme.fontsizes.desktop.headings.three : props.theme.fontsizes.desktop.headings.three}; */
      /* font-size: ${props => props.theme.fontsizes.mobile.headings.one ? props.theme.fontsizes.mobile.headings.one : props.theme.fontsizes.mobile.headings.one}; */
      font-weight: 700;
      color: white;
      text-align : center;
      @media screen and (min-width: 768px){
      font-size: 5rem;
        /* font-size: ${props => props.theme.fontsizes.desktop.headings.one ? props.theme.fontsizes.desktop.headings.one : props.theme.fontsizes.desktop.headings.one}; */

      }
  `;
  const Text = styled.p`
    font-size: 1.25rem;
    /* font-size: ${props => props.theme.fontsizes.desktop.text.three ? props.theme.fontsizes.desktop.text.three :props.theme.fontsizes.desktop.text.three}; */
      color: white;
      width: 90%;
      margin: auto;
      text-align: center;
      @media screen and (min-width: 768px){
      font-size: 2rem;
        /* font-size: ${props => props.theme.fontsizes.desktop.text.one ? props.theme.fontsizes.desktop.text.one : props.theme.fontsizes.desktop.text.one}; */
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
  let isPageWide = media('(min-width: 768px)')


  return (
    <BackgroundImageLoader
      filter="brightness(0.65)"
      // filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))"
      url="media/website/contactcover.webp"
      center
      height={"60vh"}
      // padding={isPageWide ? "15vh 0" : "100px 0"}
      style={{ position: "relative" }}
    >
      {/* <Animate> */}
      <TextContainer>
        <LetsTalk className="font-lexend">
          <b>Let's Talk</b>
        </LetsTalk>
        <Text className="font-nunito">
          We love to talk to our travel community. If you've anything you want
          to ask, feel free to get in touch.
        </Text>
      </TextContainer>
      {/* </Animate> */}
    </BackgroundImageLoader>
  );
}

export default Image;
