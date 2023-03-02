import React, {useState, useRef} from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SubscribeBar from './SubscribeBar';
import i from '../../public/assets/icons/footer/info.svg'

const Heading = styled.div`
font-size: 1.5rem;
/* font-size: ${props => props.theme.fontsizes.mobile.headings.three ? props.theme.fontsizes.mobile.headings.three : props.theme.fontsizes.mobile.headings.three}; */
text-align: center;
color: white;
margin: 0;
padding: 1rem;
width: 100%;
@media screen and (min-width: 768px){
   font-size: 2.5rem;
    /* font-size: ${props => props.theme.fontsizes.desktop.headings.four ? props.theme.fontsizes.desktop.headings.four : props.theme.fontsizes.desktop.headings.four}; */
    padding: 2rem;
}
`;
const StyledFA = styled(FontAwesomeIcon)`
   font-size: ${props => props.theme.fontsizes.mobile.headings.four ? props.theme.fontsizes.mobile.headings.four : props.theme.fontsizes.mobile.headings.four};
   @media screen and (min-width: 768px){
    font-size: ${props => props.theme.fontsizes.desktop.headings.five ? props.theme.fontsizes.desktop.headings.five : props.theme.fontsizes.desktop.headings.five};
    }
    &:hover{
        cursor: pointer;
    }
`;
const I = styled.img`
width:1.5rem;
height: 1.5rem;
/* width: ${props => props.theme.fontsizes.mobile.headings.three ? props.theme.fontsizes.mobile.headings.three : props.theme.fontsizes.mobile.headings.three}; */
/* height: ${props => props.theme.fontsizes.mobile.headings.three ? props.theme.fontsizes.mobile.headings.three : props.theme.fontsizes.mobile.headings.three}; */
display: inline;
@media screen and (min-width: 768px){
    width: ${props => props.theme.fontsizes.desktop.headings.five ? props.theme.fontsizes.desktop.headings.five : props.theme.fontsizes.desktop.headings.five};
    height: ${props => props.theme.fontsizes.desktop.headings.five ? props.theme.fontsizes.desktop.headings.five : props.theme.fontsizes.desktop.headings.five};
}
&:hover{
        cursor: pointer;
}
`;
const Footer = (props) => {
    const [showOverlay, setShowOverlay] = useState(false);

  
    return(
        <div>
            <Heading className="font-opensans">
               <b>Subscribe Now (It's free) </b>
                <I src={i} onClick={props.openpannel}></I>
            </Heading>
           <SubscribeBar buttonColor="#F7e700"></SubscribeBar>
        </div>
    );
}

export default Footer;
