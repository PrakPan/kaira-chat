import React from 'react';
import styled from "styled-components";
import HistoryIcon from '@mui/icons-material/History';
import useChat from './hook/UseChat';
import Button from './../ui/button/Index';
import { IconButton } from '@mui/material';


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

    const { handleOpenChatHistory } = useChat();

    return (
        <>
            <Heading className='font-montserrat'> Hello, I m your TarzanWay AI, your travel guide
                <IconButton className="![margin-left:1rem] float-right" color="#000" onClick={handleOpenChatHistory}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 11C8.45 11 7.97933 10.804 7.588 10.412C7.196 10.0207 7 9.55 7 9C7 8.45 7.196 7.979 7.588 7.587C7.97933 7.19567 8.45 7 9 7C9.55 7 10.021 7.19567 10.413 7.587C10.8043 7.979 11 8.45 11 9C11 9.55 10.8043 10.0207 10.413 10.412C10.021 10.804 9.55 11 9 11ZM9 18C6.68333 18 4.675 17.2373 2.975 15.712C1.275 14.1873 0.3 12.2833 0.05 10H2.1C2.33333 11.7333 3.104 13.1667 4.412 14.3C5.72067 15.4333 7.25 16 9 16C10.95 16 12.604 15.3207 13.962 13.962C15.3207 12.604 16 10.95 16 9C16 7.05 15.3207 5.39567 13.962 4.037C12.604 2.679 10.95 2 9 2C7.85 2 6.775 2.26667 5.775 2.8C4.775 3.33333 3.93333 4.06667 3.25 5H6V7H0V1H2V3.35C2.85 2.28333 3.88767 1.45833 5.113 0.875C6.33767 0.291667 7.63333 0 9 0C10.25 0 11.421 0.237333 12.513 0.712C13.6043 1.18733 14.5543 1.829 15.363 2.637C16.171 3.44567 16.8127 4.39567 17.288 5.487C17.7627 6.579 18 7.75 18 9C18 10.25 17.7627 11.4207 17.288 12.512C16.8127 13.604 16.171 14.554 15.363 15.362C14.5543 16.1707 13.6043 16.8127 12.513 17.288C11.421 17.7627 10.25 18 9 18Z" fill="#2AB0FC" />
                    </svg>
                </IconButton>
            </Heading>
            <SubText>I’m here to assist you in planning your experience. Ask me anything travel related.</SubText>
        </>
    )
}

export default Header;