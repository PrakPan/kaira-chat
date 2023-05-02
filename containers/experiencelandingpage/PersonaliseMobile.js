import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
// import Button from '../../components/Button'
import Button from '../../components/ui/button/Index'
import Link from 'next/link';
import openTailoredModal from '../../services/openTailoredModal'
import { useRouter } from 'next/router';

const Container = styled.div`
display: initial;
z-index: 998 !important;
width: 72vw;
position: fixed;
left: 12.5vw;
bottom: 0;
margin-bottom: 1rem;
@media screen and (min-width: 768px){
    display: none;
}
`;

const GridContainer = styled.div`
background-color: rgba(0,0,0,0.7);
color: white;
padding: 0.5rem 1rem;
border-radius: 2rem;

`;
const Text = styled.p`
    font-size: 1rem;
    margin: 0;
    text-align: center;
    @media screen and (min-width: 768px){
        text-align: left;
        font-size: 1.25rem;
        display: inline;
        margin: 0 2.5vw;
    }
`;
const StyledLink = styled(Link)`
  text-decoration: none !important;
  color: black !important;
  &:hover{
    color: black;
    text-decoration: none;

  }`;
  const router = useRouter()
const Banner = (props) => {
    const [showBanner, setShowBanner ] = useState(false);

    useEffect(() => {
      let scrollhandler = () => {
        let currentScroll = window.pageYOffset;
        if ( currentScroll > window.innerHeight / 2) {
          setShowBanner(true);
        } else {
          setShowBanner(false);
        }

      };
      window.addEventListener('scroll', scrollhandler);
      return () => {
        window.removeEventListener('scroll', scrollhandler);
      };
    });
    
    if(showBanner)
    return(
                <Container>
                  <GridContainer>
                    <div className="center-div">
                      <Text className="font-lexend">{props.text}</Text>
                    </div>
              <div className="center-div">
                  <Button boxShadow  onclick={props.onclick? props.onclick : openTailoredModal(router)} hoverBgColor="#F7e700" bgColor="#F7e700" width="max-content" borderStyle="none" padding="0.5rem 0.5rem" borderRadius="2rem"><StyledLink>Start Now</StyledLink></Button>
              </div>
              </GridContainer>
              </Container>

  ); 
  else return null;
}

export default Banner;
