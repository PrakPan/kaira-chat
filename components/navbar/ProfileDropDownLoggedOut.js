import React,{useEffect, useRef} from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown} from '@fortawesome/free-solid-svg-icons';
import ImageLoader from '../ImageLoader';
import {getFirstName} from '../../services/getfirstname';
import urls from '../../services/urls';
import { FaUserCircle } from 'react-icons/fa';
import usePageLoaded from '../custom hooks/usePageLoaded';


const CenterNav=styled.div`
width:100%;
height:3rem;
display:flex;
align-items:center;
gap : 5px;
`;


const ExpandProfile=styled.img`
height:1rem;
width:1rem;
display: inline;
margin: 0rem 0.3rem 0rem 0rem;
cursor:pointer;
z-index:1;
@media screen and (min-width: 768px){
    margin: 0rem 3rem 0rem 0.5rem;
    height:1rem;
    width:1rem;

}
`;

const ProfileImage=styled.img`
margin: 0rem 0 0rem 0rem;
border-radius: 50%;
height:3rem;
width:3rem;
display: inline;

cursor:pointer;
z-index:1;
@media screen and (min-width: 768px){
    margin: 0rem
}
`;

const ProfileList=styled.span`
// font-family: 'Open Sans';

text-align:center;
display:flex;
justify-content: center;
align-items: center;
cursor:pointer;
transition: all 0.2s ease-in-out;
&:hover{
    color:lightgrey;
}
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
font-size: 0.75rem;
@media screen and (min-width: 768px){
margin: 0 1rem 0 0.25rem;
     &:hover{
        cursor: pointer;
    }
}
`;
const RedDot = styled.div`
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: #f7e700;
    position: relative;
    top: 0.75rem;
    left: 2.25rem;
    z-index: 1000;
    font-size: 0.75rem;

`;
const ProfileContainer=styled.div`
border-top: none;
position:absolute;
padding:0rem 1rem 1rem 1rem;
width:15rem;
right: -0.5rem;
left:auto;
transition: opacity 0.2s linear; 
height: auto;
margin-top: ${props => (props.showProfileList ? `0` : '-40rem')};
opacity: ${props => (props.showProfileList ? `1` : '0')};
font-weight : 600;

@media screen and (min-width: 768px){
    border-top: none;
    width: max-content;
    left:auto;
    padding: 1rem 2.5rem;
    border-radius: 1rem !important; 
    height: auto;
    margin-top: ${props => (props.showProfileList ? `0.1rem` : '-50rem')};
    opacity: ${props => (props.showProfileList ? `1` : '0')};
    transition: opacity 0.2s linear; 
   
}
`;
const ProfileDropDown =(props)=>{
  const isPageLoaded = usePageLoaded();

    
    let firstname;
    if(props.name){
        firstname=getFirstName(props.name);
    }
    else firstname = "Traveler";
    let profileRef = useRef();

    useEffect(() => {
        let handler = (event) => {
            if (!profileRef.current.contains(event.target)){
                props.setShowDropDownProfileList(false);
            }
        }
        document.addEventListener("mousedown", handler);
        return()=>{
            document.removeEventListener("mousedown", handler)
        }
    });

    
    let AuthMenu = <ProfileContainer className={"border"} style={{backgroundColor:'white', color: 'rgba(0,0,0,0.7)'}} showProfileList={props.showDropDownProfileList} showProfileListMobile={props.showDropDownProfileListMobile}>  
                     <ProfileList onClick={props.authShowLogin}>Login</ProfileList>
                   </ProfileContainer>;


   
    return(
        <div style={{position : 'relative'}} ref={profileRef}>
            <CenterNav onClick={props.toggleProfileList}>
              <ImageLoader borderRadius="50%" url={'media/icons/navigation/profile-user.png'} width="2rem" height="2rem" dimensions={{width: 300, height: 300}}/>   

            {isPageLoaded  ? <StyledFontAwesomeIcon icon={faChevronDown} onClick={props.toggleProfileList} style={{ color:'black'}}></StyledFontAwesomeIcon> : null}
            </CenterNav>
             {AuthMenu}
        </div>
    );
}



export default (ProfileDropDown);

