import React,{useEffect, useRef} from 'react';
import styled from 'styled-components';
 
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown} from '@fortawesome/free-solid-svg-icons';
import ImageLoader from '../ImageLoader';
import {getFirstName} from '../../services/getfirstname';
import urls from '../../services/urls';


const CenterNav=styled.div`
width:100%;
height:3rem;
display:flex;
align-items:center;
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
font-family: 'Open Sans';

text-align:center;
padding:1rem 0rem 0.5rem 0rem;
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
const ProfileDropDown =(props)=>{
    const ProfileContainer=styled.div`
    border-top: none;
    position:absolute;
    padding:0rem 1rem 1rem 1rem;
    margin: 0rem 0.5rem 0rem 0rem;
    width:15rem;
    right: -0.5rem;
    left:auto;
    transition: opacity 0.2s linear; 
    height: auto;
    margin-top: ${props => (props.showProfileList ? `0` : '-40rem')};
    opacity: ${props => (props.showProfileList ? `1` : '0')};
  
    @media screen and (min-width: 768px){
        border-top: none;
        width: max-content;
        right:0;
        left:auto;
        padding: 0rem 3rem 1rem  3rem;
        margin: 0.5rem 0.5rem 0rem 0rem;
        border-radius:0.5rem;
        height: auto;
        margin-top: ${props => (props.showProfileList ? `1.25rem` : '-50rem')};
        opacity: ${props => (props.showProfileList ? `1` : '0')};
        transition: opacity 0.2s linear; 
       
    }
    `;
    
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

    
    let AuthMenu = <ProfileContainer className={props.headerColor==="white" ? "border" : ""} style={{backgroundColor: props.headerColor === 'black' ? 'rgba(0,0,0,0.7)' : 'white', color: props.headerColor === 'white' ? 'rgba(0,0,0,0.7)' : 'white'}} showProfileList={props.showDropDownProfileList} showProfileListMobile={props.showDropDownProfileListMobile}>  
                     <ProfileList onClick={props.authShowLogin}>Login</ProfileList>
                   </ProfileContainer>;

   
    return(
        <div ref={profileRef}>
            <CenterNav onClick={props.toggleProfileList}>
              <ImageLoader hoverpointer url={ props.headerColor ==='white' ?  "media/icons/login/user.png" : "media/icons/login/user (1).png"} width="2rem" height="2rem" dimensions={{width: 300, height: 300}} onclick={props.toggleProfileList}/>
            {typeof window !== 'undefined'  ? <StyledFontAwesomeIcon icon={faChevronDown} onClick={props.toggleProfileList} style={{ color: props.headerColor === "black" ? 'white' : 'black'}}></StyledFontAwesomeIcon> : null}
            </CenterNav>
             {AuthMenu}
        </div>
    );
}



export default (ProfileDropDown);

