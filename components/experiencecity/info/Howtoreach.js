import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeatherAlt, faHeart, faPlaneDeparture, faTrain, faCar, faBus} from '@fortawesome/free-solid-svg-icons';
import icon1 from '../../../public/assets/icons/howtoreach/plane.svg';
import icon4 from '../../../public/assets/icons/howtoreach/bus.svg';
import icon3 from '../../../public/assets/icons/howtoreach/car.svg';
import icon2 from '../../../public/assets/icons/howtoreach/train.svg';


const P = styled.p`
font-weight: 300;
text-align: center;
@media screen and (min-width: 768px) {
  text-align: left;
 font-size:1.25rem ;
  /* font-size: ${props => props.theme.fontsizes.desktop.text.three}; */
}
`;
const Container = styled.div`

@media screen and (min-width: 768px){


}
`;
const Subheading = styled.div`
  font-weight: 600;
  text-align: center;
  margin: 1.75rem 0;
  @media screen and (min-width: 768px) {
      font-size:1.25rem ;
      /* font-size: ${props => props.theme.fontsizes.desktop.text.three}; */
      text-align: left;
  }
`;
const Span = styled.span`
  font-size: 1rem;
  margin: auto;
  @media screen and (min-width: 768px) {
      font-size: 20px;
      text-align: left;
  }
`;
const Icon = styled.img`
  width: 1.5rem;
  height: auto;
 
`;
const Howtoreach = (props) => {
  
    return(
        <Container>
            <P>{props.text}</P>
            <Subheading className="font-lexend"><div style={{display: "inline", width: 'max-content', padding: '0.5rem', backgroundColor: "#F7e700", borderRadius: '50%'}}><Icon src={icon1}/></div> By Air</Subheading>
            <P>{props.air}</P>
            <Subheading className="font-lexend"><div style={{display: "inline", width: 'max-content', padding: '0.5rem', backgroundColor: "#F7e700", borderRadius: '50%'}}><Icon  src={icon2}/></div> By Train</Subheading>
            <P>{props.train}</P>
            <Subheading className="font-lexend"><div style={{display: "inline", width: 'max-content', padding: '0.5rem', backgroundColor: "#F7e700",   borderRadius: '50%'}}><Icon src={icon3}/></div> By Road</Subheading>
            <P>{props.road}</P>
            <Subheading className="font-lexend"><div style={{display: "inline", width: 'max-content', padding: '0.5rem', backgroundColor: "#F7e700",   borderRadius: '50%'}}><Icon src={icon4}/></div> By Public Transport</Subheading>
            <P>{props.public}</P>
        </Container>
  ); 
}

export default React.memo(Howtoreach);
