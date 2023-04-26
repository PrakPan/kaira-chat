import React, {useState} from 'react';
import styled from 'styled-components'

import {getFirstName} from '../../../services/getfirstname';
import { useRouter } from 'next/router'

import  Link  from 'next/link';
import ImageLoader from '../../ImageLoader';
import { FaUserCircle } from 'react-icons/fa';


const ListItem = styled.div`
    text-align: left;

`;
const StyledLink = styled.a`
text-decoration: none;
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 21px;
text-align: center;
letter-spacing: 0.04em;
color: #01202B;

`;
const RedDot = styled.div`
width: 1rem;
padding: 0.15rem 0.25rem;
height: 1rem;
line-height: 1;
font-size: 0.75rem;
border-radius: 50%;
background-color: #f7e700;
display: inline-block;
position: relative;
top: -0.5rem;
color: black

`;
const LoggedIn = (props) =>{
    const router = useRouter();
 

    return(
        <>
            <ImageLoader borderRadius='50%' leftalign url={props.userImage && props.userImage !== 'null'?props.userImage: 'media/icons/navigation/profile-user.png'} width="36px" height="36px" widthmobile='36px' dimensions={{width: 300, height: 300}} /> 
            {props.token?
            <ListItem>
            {!props.name || props.name===''? "Hi Traveler!" : "Hi "+getFirstName(props.name)+"!"}
        </ListItem>
        : 
        <ListItem onClick={props._handleLogin}>Login/Signup</ListItem>
        }
            {/* <ListItem>
                <Link href='/dashboard' className="next-link" passHref={true}>
                    {router.pathname === '/dashboard' ? <StyledLink  style={{borderStyle: 'none none solid none', borderColor: '#f7e700', borderWidth: '2px', fontWeight: '300'}}>My Plans</StyledLink> : <StyledLink  style={{fontWeight: '300'}}>My Plans</StyledLink> }
                </Link>
            </ListItem>
            <ListItem style={{display: 'grid', gridTemplateColumns: 'auto max-content'}}>
                    <StyledLink onClick={props._handleNotifications}>
                        Notifications
                    </StyledLink>
                    {props.notifications.length && props.notOpenCount ? <div style={{fontSize: '0.75rem', width: '1.5rem', height: '1.5rem', backgroundColor: "#f7e700", marginLeft: '0.25rem', borderRadius: '50%', fontWeight: '600'}} className="font-lexend center-div">{props.notOpenCount}</div>:null}
            </ListItem>
          
            <ListItem>
                    <StyledLink onClick={props.onLogout}  style={{fontWeight: '300'}}>Logout</StyledLink> 
            </ListItem> */}
        </>
    );
}

export default LoggedIn;