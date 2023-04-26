import React, {useState,  useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';

import styled from 'styled-components';
import SubscribeBar from './SubscribeBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook , faLinkedin, faTwitter, faPinterestP} from "@fortawesome/free-brands-svg-icons"
import { faTimes} from '@fortawesome/free-solid-svg-icons';
import content from '../../public/assets/icons/footer/content.svg';
import offers from '../../public/assets/icons/footer/offer.svg';
import community from '../../public/assets/icons/footer/community.svg';
import media from '../media';
const useStyles = makeStyles({
  paper: {
    backgroundColor: "#F7e700"
  }
});
const Container = styled.div`
    background-color: #F7e700;
    padding: 0.5rem 0;
        @media screen and (min-width: 768px){ 
                padding: 1rem 0;

    }
`;
const GridContainer = styled.div`
  margin: auto;
  display: grid; 
    grid-template-columns: 1fr 1fr 1fr;
    @media screen and (min-width: 768px){ 
  grid-template-columns: 1fr 1fr 1fr;
  width: 80%;

    }
   
`;
const ContentContainer = styled.div`

  text-align: center;
  
`;
const Icon = styled.img`
    width: 40%;
    display: block;
    margin: 2rem auto;
    @media screen and (min-width: 768px){ 
        width: 15%;
    }
`;
const SubscribeDrawer = (props) =>  {
  let isPageWide = media('(min-width: 768px)')

  const [subscribe, setSubscribe] = useState(false);

   useEffect(() => {

    });
  const classes = useStyles();

  const Heading = styled.h1`
    font-weight: 700;
    font-size: ${props => props.theme.fontsizes.mobile.headings.one};
    text-align: center;
    margin: 1rem auto 2rem auto;
    @media screen and (min-width: 768px){ 
        font-size: ${props => props.theme.fontsizes.desktop.headings.four};
    }

  `;
  const Subheading = styled.h3`
    font-weight: 600;
    font-size: ${props => props.theme.fontsizes.mobile.text.three};
    text-align: center;
    margin-bottom: 1.5rem ;
    @media screen and (min-width: 768px){ 
        font-size: ${props => props.theme.fontsizes.desktop.text.two};
    }

  `;
  const P = styled.p`
   font-weight: 300;
    font-size: ${props => props.theme.fontsizes.desktop.text.four};
    text-align: center;
    width: 80%;
    margin: auto;
    line-height: 1.5;
  `;
  const CrossContainer = styled.div`
    text-align: right;
    margin: auto;

    @media screen and (min-width: 768px){ 
        width: 70%;
        padding: 1rem;
    }
       &:hover{
        cursor: pointer;
    }
  `;
  const StyledCrossFontAwesomeIcon = styled(FontAwesomeIcon)`
    margin: 0 0.5rem; 
    @media screen and (min-width: 768px){ 
        font-size: ${props => props.theme.fontsizes.desktop.headings.four};
        position: absolute;
        right: 1rem;
        margin: 0;
    }
 
  `;
  return (
            <Container>
                <StyledCrossFontAwesomeIcon icon={faTimes} onClick={props.onhide} />
              <Heading>Subscribe (It's Free)</Heading>
              <GridContainer>
                <ContentContainer>
                    <Subheading className="font-lexend"> Latest Travel Content </Subheading>
                    <Icon src={content}/>
                    {isPageWide ? <P>We will keep you updated with interesting travel tips, breath-taking places, travel facts and so much more.</P> : null}
                </ContentContainer>
                <ContentContainer style={{borderStyle: isPageWide ? "none solid none solid" : 'none', borderWidth: "1px"}}>
                    <Subheading className="font-lexend"> Exciting Offers </Subheading>
                    <Icon src={offers}/>
                     {isPageWide ? <P>Want to find a trip and get 30% off? Along with our partners, we will keep you up to date with the latest offers and travel deals.</P>: null}
                </ContentContainer>
                <ContentContainer>
                    <Subheading className="font-lexend">Community Support</Subheading>
                    <Icon src={community}/>
                     {isPageWide ? <P>Become a part of our community? Want to travel? Have a question? Confused? We're always there and available for you.</P>: null}
                </ContentContainer>
              </GridContainer>
              <SubscribeBar buttonTextColor="white" margin="3rem auto 0 auto"></SubscribeBar>
              <p style={{textAlign: "center", margin: "3rem auto 0 auto"}}>
                            <a href="https://www.instagram.com/thetarzanway" target="_blank"><FontAwesomeIcon style={{color: "black", fontSize:  isPageWide ? '2rem' :'2.5rem', marginRight: '2rem'}} icon={faInstagram} /></a>
                            <a href="https://www.facebook.com/thetarzanway/" target="_blank"><FontAwesomeIcon style={{color: "black",fontSize:  isPageWide  ? '2rem' :'2.5rem', marginRight: '2rem'}} icon={faFacebook} /></a>
                            <a href="https://twitter.com/thetarzanway" target="_blank"><FontAwesomeIcon style={{color: "black", fontSize: isPageWide  ? '2rem' :'2rem', marginRight:'2rem'}} icon={faTwitter} /></a>
                            <a href="https://linkedin.com/company/thetarzanway" target="_blank"><FontAwesomeIcon style={{color: "black", fontSize: isPageWide ? '2rem' :'2.5rem', marginRight: '2rem'}} icon={faLinkedin} /></a>
                            <a href="https://in.pinterest.com/thetarzanway/" target="_blank"><FontAwesomeIcon style={{color: "black", fontSize: isPageWide  ? '2rem' :'2.5rem'}} icon={faPinterestP} /></a>                                              
                </p>
            </Container>
  );
}

export default SubscribeDrawer;