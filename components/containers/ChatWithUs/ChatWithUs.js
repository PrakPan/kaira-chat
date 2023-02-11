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
const Text = styled.p`
    width: 80%;
    margin: auto;
    text-align: center;
    font-weight: 300;
    
    @media screen and (min-width: 768px){
        width: 100%;
        font-size: 24px;
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

const ChatWithUs = (props) => {



const router = useRouter();

    if(!props.link)
    return(
        <div className={classes.ChatContainer+" center-div"}>
            <ImageLoader url={props.img? props.img : 'media/website/talktous.svg'} width="90%" margin="auto"></ImageLoader>
            <div className="center-div">
                <Heading   margin="1rem" align="center" bold noline>{props.heading? props.heading : 'Come On! Talk to Us.'}</Heading>
                <Text className="font-nunito">{props.text? props.text : "We’ve a large community of bloggers, influencers, travelers and of course travel experts to help you out."}</Text>
                <Button
               boxShadow
                fontSizeDesktop={'1.25rem'}
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
        <Heading    margin="1rem" align="center" bold noline>{props.heading? props.heading : 'Come On! Talk to Us.'}</Heading>
        <Text className="font-nunito">{props.text? props.text : "We’ve a large community of bloggers, influencers, travelers and of course travel experts to help you out."}</Text>
    <Button
        boxShadow
        fontSizeDesktop={'1.25rem'}
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
