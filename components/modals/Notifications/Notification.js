import React, {useEffect} from 'react';
import styled from 'styled-components';
import cross from '../../../public/assets/close.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash} from '@fortawesome/free-solid-svg-icons';
import {useRouter} from 'next/router';
const Heading = styled.p`
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    line-height: 1;
`;

const Text = styled.p`
    font-weight: 300;
    margin-bottom: 0;
    font-size: 0.75rem;


`
const Container = styled.div`
    display: grid;
    grid-template-columns: auto max-content;
    grid-gap: 0.5rem;
    padding: 0.5rem;
    border-style: none none solid none;
    border-color: hsl(0,0%,97%);
    border-width: 2px;
    margin: 0 0.5rem 0.5rem 0.5rem;

`;
const Cross = styled.img`
    width: 1rem;
    height: auto;

`;
const NotificationClickContainer  = styled.div`
&:hover{
    cursor: pointer;
}
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
    color: #e4e4e4;
    &:hover{
        cursor: pointer;
        color: red;
    }
`;
const Notification = (props) => {
     const router = useRouter();
    const _handleRedirect = () => {
        router.push(props.cta_link);
    }

  return(
     <Container className="border-thi" >
        <NotificationClickContainer onClick={_handleRedirect}>
             <Heading className="font-opensans">Woohoo! Your package has arrived 🎉</Heading>
            <Text className="font-nunito">Your travel experience to Manali is prepared by our travel experts. 🥳 You can check it out here.</Text>
        </NotificationClickContainer >
        <div className='center-div'>
            <StyledFontAwesomeIcon icon={faTrash}  onClick={(id) => props._deleteNotificationHandler(props.id)}></StyledFontAwesomeIcon>
        </div>
    </Container>
  );


}

 
export default (Notification);