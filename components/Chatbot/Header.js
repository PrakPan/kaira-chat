import React from 'react';
import styled from "styled-components";
import HistoryIcon from '@mui/icons-material/History';


const Heading = styled.p`
    font-size : 20px;
    font-weight: 600;
    margin-bottom : 0px;
    font-family: Montserrat;
`
const SubText = styled.p`
  font-size : 14px;
  font-weight: 400;
  margin-bottom : 0px;
  opacity: 0.5;
  padding-bottom: 10px;
  border-bottom : 1px solid #EBE1E1;
  font-family: Montserrat;
`


function Header() {
    return (
        <>
            <Heading className='font-montserrat'> Hello, I m your TarzanWay AI, your travel guide    <HistoryIcon className='float-right'></HistoryIcon></Heading>
            <SubText>I’m here to assist you in planning your experience. Ask me anything travel related.</SubText>
        </>
    )
}

export default Header;