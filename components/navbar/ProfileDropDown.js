import React,{useEffect, useRef} from 'react';
import styled from 'styled-components';
 
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown} from '@fortawesome/free-solid-svg-icons';
import ImageLoader from '../ImageLoader';
import {getFirstName} from '../../services/getfirstname';
import urls from '../../services/urls';
import { FaBell, FaRegListAlt, FaUser } from 'react-icons/fa';
import {MdOutlineLogout,MdAssignment } from 'react-icons/md'
import usePageLoaded from '../custom hooks/usePageLoaded';

const CenterNav=styled.div`
width:100%;
height:3rem;
display:flex;
align-items:center;

 `;


 
 

const ProfileList=styled.span`
// font-family: 'Open Sans';
font-weight : 500;
text-align:center;
padding:1rem 0rem 0.5rem 0rem;
display:flex;
justify-content: flex-start;
gap : 0.5rem;
align-items: center;
cursor:pointer;
transition: all 0.2s ease-in-out;
&:hover{
    color:lightgrey;
}
div{
    text-align : left;   
   }

`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
margin: 0 0.5rem 0 0.5rem;

@media screen and (min-width: 768px){

margin: 0 0 0 0.5rem;
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

@media screen and (min-width: 768px){
    border-top: none;
    width: max-content;
    top : 3rem;
    border-radius: 1rem !important; 
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    left:-100%;
    padding: 0rem 1rem 1rem 1rem;
    border-radius:0.5rem;
    height: auto;
    margin-top: ${props => (props.showProfileList ? `0.2rem` : '-50rem')};
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

    
    let AuthMenu = <ProfileContainer className={props.headerColor==="white" ? "border" : ""} style={{backgroundColor: props.headerColor === 'black' ? 'rgba(0,0,0,0.7)' : 'white', color: 'rgba(0,0,0,0.7)'}} showProfileList={props.showDropDownProfileList} showProfileListMobile={props.showDropDownProfileListMobile}>  
                     <Link onClick={props.authShowLogin}><ProfileList>Login</ProfileList></Link>
                   </ProfileContainer>;

    if(props.token) AuthMenu = (
      <ProfileContainer
        className={props.headerColor === "white" ? "border" : ""}
        style={{
          backgroundColor:
            props.headerColor === "black" ? "rgba(0,0,0,0.7)" : "white",
          color: "rgba(0,0,0,0.7)",
        }}
        showProfileList={props.showDropDownProfileList}
      >
        <ProfileList style={{ borderStyle: "none" }}>
          <FaUser /> <div>{"Hi " + firstname}</div>
        </ProfileList>
        <ProfileList
          style={{ display: "grid", gridTemplateColumns: "auto max-content" }}
          onClick={props._handleNotifications}
        >
          <FaBell />
          <div>Notifications</div>
          {props.notOpenedCount ? (
            <div
              style={{
                fontWeight: "700",
                fontSize: "0.75rem",
                backgroundColor: "#f7e700",
                width: "1.25rem",
                height: "1.25rem",
                marginLeft: "0.5rem",
                color: "black",
                borderRadius: "50%",
              }}
              className="center-div"
            >
              {props.notOpenedCount}
            </div>
          ) : null}
        </ProfileList>
        {/* <Link to='/profile/profile' style={{ textDecoration: 'none'}}  className="font-nunito"><ProfileList>Profile</ProfileList></Link> */}
        {/* <Link to='/profile/plans' style={{ textDecoration: 'none'}}   className="font-nunito"><ProfileList>Saved Plans</ProfileList></Link> */}
        {/* <Link to='/profile/notifications' style={{ textDecoration: 'none'}}   className="font-nunito"><ProfileList>Previous Plans</ProfileList></Link> */}
        {/* <Link to='/profile/messages' style={{ textDecoration: 'none'}}   className="font-nunito"> <ProfileList>Messages</ProfileList></Link> */}

        <Link
          style={{ textDecoration: "none" }}
          href={urls.DASHBOARD}
          className="next-link"
          passHref={true}
        >
          <ProfileList>
            <MdAssignment />
            <div>My Plans</div>
          </ProfileList>
        </Link>
        <ProfileList onClick={props.onLogout}>
          <MdOutlineLogout /> <div>Logout</div>
        </ProfileList>
      </ProfileContainer>
    );
    return(
        <div ref={profileRef} style={{marginRight: '2.5rem' , position : 'relative'}}>
            {props.notifications.length && props.notOpenedCount ? <RedDot className="center-div">1</RedDot> : null}
            {/* <RedDot/> */}
            <CenterNav className=''>
              <ImageLoader borderRadius="50%" url={ props.image !== 'null' && props.image!== null ? props.image : 'media/icons/navigation/profile-user.png'} width="2rem" height="2rem" dimensions={{width: 300, height: 300}} onclick={props.toggleProfileList}/>   
              {/* <ExpandProfile src={props.headerColor==="black" ? ExpandProfileIcon : null} onClick={props.toggleProfileList}/>    */}
              {isPageLoaded  ? <StyledFontAwesomeIcon icon={faChevronDown} onClick={props.toggleProfileList} style={{ color: props.headerColor === "black" ? 'white' : 'black'}}></StyledFontAwesomeIcon> : null}
            </CenterNav>
             {AuthMenu}
        </div>
    );
}



export default (ProfileDropDown);