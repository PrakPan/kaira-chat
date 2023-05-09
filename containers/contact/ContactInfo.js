import React from 'react';
import styled from 'styled-components';
// import Heading from '../../components/heading/Heading';
import Heading from '../../components/newheading/heading/Index';

// import Button from '../../components/Button';
import Button from '../../components/ui/button/Index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp} from "@fortawesome/free-brands-svg-icons"
// import { faCommentDots} from '@fortawesome/free-solid-svg-icons';
import urls from '../../services/urls';
const Container = styled.div`
background-color: white;
margin: auto;

@media screen and (min-width: 768px){
    padding: 2rem ;

}
`;
const GridContainer = styled.div`
width: 90%;
margin: auto;
@media screen and (min-width: 768px){
display: grid;
grid-template-columns: 50% 50%;
width: 100%;
margin: 2.5rem 0 0 0;

}
`;
const AddressContainer = styled.div`

padding: 1.5rem 0;
text-align: center;
@media screen and (min-width: 768px){
    border-style: none solid none none;
    border-width: 1px;
    padding: 2rem;
    text-align: left;
}
`;
const NumberContainer = styled.div`
padding: 1.5rem 0;
text-align: center;
border-style: solid none solid none;
border-width: 1px;
@media screen and (min-width: 768px){
padding: 2rem;
border: none;
text-align: left;
}
`;
const HeadingSmall = styled.p`
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 1.5rem;
        @media screen and (min-width: 768px){
    text-align: center;
    }
`;
const ReachOutHelper = styled.p`

`;
const ButtonContainer = styled.div`
display: grid;
overflow: hidden;
`;
const SocialContainer = styled.div`
margin: 1.5rem 0;
text-align: center;
`;
const SocialIcon = styled.img`
    width: 3rem;
    height: 3rem;

`;

const Contact = () => {

    const _openWhatsapp = () => {
        var win = window.open(urls.WHATSAPP, '_blank');
        win.focus();
    }
  return (
    <Container>
      <Heading align="center" aligndesktop="center" margin="1.5rem">
        Want to meet us?
      </Heading>
      <GridContainer>
        <AddressContainer>
          <HeadingSmall className="font-lexend" align="center">
            Address
          </HeadingSmall>
          <p
            style={{ fontSize: "1rem", textAlign: "center" }}
            className="font-nunito"
          >
            D-14 First Floor, Sector 20, Noida, Uttar Pradesh 201301
          </p>
          <br></br>
          <HeadingSmall
            className="font-lexend"
            align="center"
            style={{ marginTop: "1rem" }}
          >
            Call Us
          </HeadingSmall>
          <p
            style={{ fontSize: "1rem", textAlign: "center" }}
            className="font-nunito"
          >
            +91 95821 25476, +91 87872 00342
          </p>
        </AddressContainer>
        <NumberContainer>
          <HeadingSmall className="font-lexend" align="center">
            Reach Out
          </HeadingSmall>
          {/* <ReachOutHelper>Email us on</ReachOutHelper> */}
          <p
            style={{ fontSize: "1rem", textAlign: "center", color: "#0066b2" }}
            className="font-nunito"
          >
            info@thetarzanway.com
          </p>
          {/* <ReachOutHelper>or</ReachOutHelper> */}
          {/* <p style={{fontSize: '1rem', textAlign: "center"}} className="font-nunito">+91 9582125476</p> */}
          {/* <ButtonContainer>
            <Button borderStyle="none" margin="1rem auto" bgColor="#075E54" borderRadius="5px" color="white" onclick={_openWhatsapp} onclickparam={null}>
                <FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}} />
                WhatsApp
            </Button>
            <Button borderStyle="none" margin="1rem auto" bgColor="#f7e700" borderRadius="5px" color="black">
                <FontAwesomeIcon icon={faCommentDots} style={{marginRight: "0.5rem"}} />Chat Now </Button>
            </ButtonContainer> */}
          <ButtonContainer>
            <Button
              display="block"
              boxShadow
              borderStyle="none"
              margin="1rem auto"
              bgColor="#075E54"
              borderRadius="5px"
              color="white"
              onclick={_openWhatsapp}
              onclickparam={null}
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                style={{ marginRight: "0.5rem" }}
              />
              WhatsApp
            </Button>
            {/* <Button display="block" link={urls.ERROR404} boxShadow  borderStyle="none" margin="1rem auto" bgColor="#f7e700" borderRadius="5px" color="black">
                <FontAwesomeIcon icon={faCommentDots} style={{marginRight: "0.5rem"}} />Chat Now </Button> */}
          </ButtonContainer>
        </NumberContainer>
      </GridContainer>
      <AddressContainer style={{ border: "none" }}>
        <HeadingSmall className="font-lexend" align="center">
          Social Media
        </HeadingSmall>
        <SocialContainer>
          <a href="https://www.instagram.com/thetarzanway" target="_blank">
            <SocialIcon
              src={
                "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Instagramcolor_1.webp"
              }
            />
          </a>
          <a href="https://www.facebook.com/thetarzanway" target="_blank">
            <SocialIcon
              style={{ margin: "0 3rem" }}
              src={
                "https://d31aoa0ehgvjdi.cloudfront.net/media/website/facebookcolor.webp"
              }
            />
          </a>
          <a href="https://goo.gl/maps/vLgjywWXcv7AMBdK6" target="_blank">
            <SocialIcon
              src={
                "https://d31aoa0ehgvjdi.cloudfront.net/media/website/googlecolor.webp"
              }
            />
          </a>
        </SocialContainer>
      </AddressContainer>
    </Container>
  );
}

export default Contact;
