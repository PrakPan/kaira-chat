import React from 'react';
import styled from 'styled-components';


const Copyright1 = styled.p`
font-size: 0.5rem;
/* font-size: ${props => props.theme.fontsizes.mobile.text.five ? props.theme.fontsizes.mobile.text.five : props.theme.fontsizes.mobile.text.five}; */ 
text-align: center;
color: white;
margin: 0;
@media screen and (min-width: 768px){ 
  font-size: 1rem;
    /* font-size: ${props => props.theme.fontsizes.desktop.text.four ? props.theme.fontsizes.desktop.text.four : props.theme.fontsizes.desktop.text.four}; */

}
`;

const Copyright = (props) => {
    let date = new Date();
    const year = date.getFullYear();
  
    return <Copyright1>{"Copyright © 2018 - "+year+" Tarzan Way Travels Private Limited ® - All Rights Reserved"}</Copyright1>
}

export default Copyright;
