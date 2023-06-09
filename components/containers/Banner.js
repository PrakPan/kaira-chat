import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Button from '../ui/button/Index';
/* Bottom floating banner for Desktop only
  Inputs: text, onclick
*/
const Container = styled.div`

display: none;
@media screen and (min-width: 768px){
  display: initial;
  z-index: 998 !important;
  width: 100vw;
  position: fixed;
  left: 0;
  bottom: 0;
  margin-bottom: 1rem;
 

}
`;

const GridContainer = styled.div`
background-color: rgba(0,0,0,0.7);
color: white;
padding: 0.5rem 1rem;
display: grid;
width: max-content;
margin: auto;
grid-template-columns: auto max-content;
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
                <Button display="inline-block" boxShadow onclick={props.onclick}  hoverColor="white" hoverBgColor="black" bgColor="#F7e700"  borderStyle="none" padding="0.5rem 0.5rem" borderRadius="2rem">
                  {props.cta ? props.cta : 'Start Planning'}
                </Button>
              </GridContainer>
              </Container>

  ); 
  else return null;
}

export default Banner;
