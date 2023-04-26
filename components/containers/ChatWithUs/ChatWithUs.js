import React, {useEffect} from 'react';
import styled from 'styled-components';
// import Heading from '../../heading/Heading';
import Heading from '../../newheading/heading/Index';
// import img from '../../../public/assets/talktous.svg';
import Link from 'next/link'
// import Button from '../../Button';
import Button from '../../ui/button/Index'
import theme from '../../../public/Themes';
import classes from './ChatWithUs.module.css';
import { useRouter } from 'next/router';
import urls from '../../../services/urls';
import ImageLoader from '../../ImageLoader';
import HowItWorks from '../HowItWorksSlideshow';
const Text = styled.p`
    width: 80%;
    margin: auto;
    text-align: center;
    font-weight: 300;
    
    @media screen and (min-width: 768px){
        width: 100%;
        font-size: 20px;
        margin: 0;
    }
`;
const ChatContainer = styled.div`
    display: grid;
    margin: ${(props)=>props.margin? props.margin: "auto"};
    @media screen and (min-width: 768px){
        grid-template-columns: 50% 50%;
        width: 80%;
        min-height: 60vh;
        margin: auto;
    }
`;
const HowItWorksHeading = styled.p`
     font-weight: 600;
    margin: 1rem 0 0.5rem 0;
    @media screen and (min-width: 768px){
      font-size: 1.25rem;
      margin: 2rem 0 0.5rem 0;

    }
`;

const HowItWorksText = styled.p`
font-size: 1rem;
 width: 100%;
margin: 0 0;
font-weight: 300;

@media screen and (min-width: 768px){
  font-size: 1.25rem;
  font-weight: 300;
  margin: 0 0;

}
`;

const ChatWithUs = (props) => {
    const HowitWorksHeadingsArr=[
        <HowItWorksHeading className="font-lexend">You select</HowItWorksHeading>,
        <HowItWorksHeading className="font-lexend">We prepare</HowItWorksHeading>,
        <HowItWorksHeading className="font-lexend">You make memories</HowItWorksHeading>,
      ];
      const HowitWorksContentsArr = [
        <HowItWorksText className="font-lexend">A short trek, a long honeymoon, a workcation, or personalize your own</HowItWorksText>,
          <HowItWorksText  className="font-lexend">A completely personalized plan by our travel experts and software</HowItWorksText>,
        <HowItWorksText  className="font-lexend">Enough planning, time to travel and make unforgettable memories</HowItWorksText>
      
      ];


 const howitworksimgs = ['media/website/whyus-1.webp', 'media/website/whyus-2.webp', 'media/website/whyus-3.webp']

    if(!props.link)
    return(
        <div className={classes.ChatContainer+" center-div"}>
                   {props.howitworks ?  <HowItWorks onclick={() => console.log('')} images={howitworksimgs} content={HowitWorksContentsArr} headings={HowitWorksHeadingsArr}></HowItWorks>
: 
            <ImageLoader url={props.img? props.img : 'media/website/talktous.svg'} width="90%" margin="auto"></ImageLoader>}
            <div className="center-div">
                <Heading fontSize="32px" margin="1rem" align="center" bold noline>{props.heading? props.heading : 'Come On! Talk to Us.'}</Heading>
                <Text className="font-nunito">{props.text? props.text : "We’ve a large community of bloggers, influencers, travelers and of course travel experts to help you out."}</Text>
                <Button
               boxShadow
                fontSizeDesktop={'16px'}
                margin="1rem auto"
                padding="0.5rem 2rem"
                borderStyle="solid"
                borderRadius="2rem"
                hoverColor="white"
                borderWidth="1px"
                hoverBgColor="black"
                hoverBorderColor="black"
                // onclick={() => router.push('/tailored-travel')}
                link={urls.CONTACT}
                >
                    {props.button ? props.button : "Contact Us"}
              </Button>
              
            </div>
        </div>
  ); 
  else return(
    <div className={classes.ChatContainer+" center-div"}>
            <ImageLoader url={props.img? props.img : 'media/website/talktous.svg'} width="90%" margin="auto"></ImageLoader>
    <div className="center-div">
        <Heading  fontSize="32px" margin="1rem" align="center" bold noline>{props.heading? props.heading : 'Come On! Talk to Us.'}</Heading>
        <Text className="font-nunito">{props.text? props.text : "We’ve a large community of bloggers, influencers, travelers and of course travel experts to help you out."}</Text>
    <Button
        boxShadow
        fontSizeDesktop={'16px'}
        margin="1rem auto"
        padding="0.5rem 2rem"
        borderStyle="solid"
        borderRadius="2rem"
        hoverColor="white"
        borderWidth="1px"
        hoverBgColor="black"
        hoverBorderColor="black"
        // onclick={() => router.push(props.link)}
        link={urls.CONTACT}
        >
            {props.button ? props.button : "Contact Us"}
      </Button>
   
    </div>
</div>
  );
}

export default ChatWithUs;
