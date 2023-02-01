import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
  
import ProfilDropDown from './ProfileDropDown';
import ProfileDropDownLoggedOut from './ProfileDropDownLoggedOut';
import  Link  from 'next/link';
import * as logout from '../../store/actions/logout';
import * as authaction from '../../store/actions/auth';
import { connect } from 'react-redux';
import { useRouter } from 'next/router'
// import Button from '../Button';
import Button from '../ui/button/Index';
import Notifications from '../modals/Notifications/Index';
import urls from '../../services/urls';
import ImageLoader from '../ImageLoader';
import * as ga from '../../services/ga/Index';
import {FaSearch} from 'react-icons/fa';
import DesktopSearch from '../search/header/desktop/Index';
const NavItemsContainer = styled.div`
  display: none;

  @media screen and (min-width: 768px) {
    margin-right: 0rem;
    display: flex;
    align-items: center;
  }
`;

const NavbarContainer = styled.div`
position: relative;
  color: black;
  display: flex;
  @media screen and (min-width: 768px) {
    transition: all 0.3s ease-in-out;
    height: 10vh;
    width: 100%;
    &:hover {
      opacity: 1;
    }
  }
`;

const CenterNav = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
   &:hover{
    cursor: pointer;
  }

`;

const TTWLogoContainer = styled(CenterNav)`
  justify-content: center; 
   @media screen and (min-width: 768px) {
    justify-content: flex-start;
    margin-left: 2rem;
   
  }
`;



const NavItem = styled.div`
  font-family: 'Open Sans';
  color: white;
  padding: 1rem 0rem 0.5rem 0rem;
  @media screen and (min-width: 768px) {
    cursor: pointer;
    padding: 0rem ;
    margin: 0 1.5rem;
    white-space: nowrap;
    border: none;
    transition: all 0.2s ease-in-out;
    &:hover {
      color: lightgrey;
    }
  }
`;

const Header = styled.div`
  position: fixed !important;
  z-index: 900;   
  height: ${(props) => (props.changeHeight ? `100%` : '0')};
  transition: height ease-out 0.5s;
  top: 0 !important;
  width: 100vw !important;

box-shadow: 0px 1px 1px 0px rgb(0 0 0 / 14%);
  @media screen and (min-width: 768px) {
    height: 10vh;
  }
`;
const CompanyName = styled.p`
  &:hover{
    cursor: pointer;
  };
  margin-left: 0.5rem;
`;


const StyledLink = styled.a`
text-decoration: none;
display: block;
margin: auto;
width: max-content;
padding : 0.5rem 0;
border-style: none none solid none;
border-color: transparent;
border-width: 1px;
&:hover {
  font-weight: 600;
  color: black;
  text-decoration: none;
  border-style: none none solid none;
  border-color: #f7e700;
  border-width: 1px;
}
`;

const Navbar = (props) => {
  const router = useRouter()
 

  // localStorage.setItem('NavbarHeight', 4);
  // let prevScroll = window.pageYOffset;



  const [showMobileNavItems, setShowMobileNavItems] = useState(false);

  {
    /* toggle hamburger */
  }
  const [
    showDropDownProfileListMobile,
    setShowDropDownProfileListMobile,
  ] = useState(false);
  {
    /* toggle mobile profilelist */
  }
  const [showDropDownProfileList, setShowDropDownProfileList] = useState(false);
  {
    /* toggle desktop profilelist */
  }
  const [hideNav , setHideNav] = useState(false);
  {
    /* hide/show navbar on scroll */
  }
  const [Height, setHeight] = useState(false);

  const toggleMobileNavItems = () => {
    setShowMobileNavItems(!showMobileNavItems);
    if (showDropDownProfileListMobile == true) {
      setShowDropDownProfileListMobile(false);
    }
    if (showDropDownProfileListMobile == false) {
      setHeight(!Height);
    }
  };

  const toggleProfileList = () => {
    setShowDropDownProfileList(!showDropDownProfileList);
    setShowDropDownProfileListMobile(!showDropDownProfileListMobile);
    if (showMobileNavItems == true) {
      setShowMobileNavItems(false);
    }
    if (showMobileNavItems == false) {
      setHeight(!Height);
    }
  };

  const [showNotifications, setShowNotifications] = useState(false);
  const _handleNotifications = ( ) => {
      setShowNotifications(true);
  }
  // const router  = useRouter();
  const _handleHomepageRedirect = (  ) => {
    router.push('/')
  }
  const _handlePWRedirect = (  ) => {
    router.push('/corporates/physicswallah')
  }
  const _handleTailoredRedirect = () => {
    router.push('/tailored-travel')
  }
  const _handleTailoredClick = () => {
    // setDesktopBannerLoading(true);
    setTimeout(_handleTailoredRedirect, 1000);
  
    ga.callback_event({
      action: 'TT-Header',
      
      callback: _handleTailoredRedirect,
    })
  
  }
  const [toggleSearch, setToggleSearch] = useState(false);
     return (
    <div>
    <Header changeHeight={Height} >
      <NavbarContainer bgColor={props.bgColor} hideNav={props.hideNav} style={{backgroundColor: props.headerColor === 'black' ? 'rgba(0,0,0,0.7)': 'white', opacity : props.hideNav ? '0' : '1'}}>
      {/* <div style={{position: 'absolute', left: '50%'}} className="center-div" onClick={() => setToggleSearch(true)}><FaSearch className="hover-pointer" style={{ color: props.headerColor === 'black' ? 'white': 'black', width: '16px', height:  '16px', marginTop: '25px'}}></FaSearch></div> */}
      {false ? <DesktopSearch onclose={() => setToggleSearch(false)}></DesktopSearch> : 
         <CenterNav>
          
          <TTWLogoContainer>
            {/* <Link href='/'> */}
        {props.hidehomecta ? 
props.headerColor === 'black'? <ImageLoader  width="7vh" widthmobile="15vh"  leftalign url={'media/website/logowhite.svg'} margin="0.5rem 0.5rem 0.5rem 2rem"></ImageLoader>: <ImageLoader   hoverpointer  leftalign width="7vh" widthmobile="15vh"  margin="0.5rem 0.5rem 0.5rem 2rem" url={'media/website/logoblack.svg'}></ImageLoader> : 
        props.headerColor === 'black'?<Link href={!props.PW? urls.HOMEPAGE : '/corporates/physicswallah'}><ImageLoader hoverpointer  onclick={!props.PW ? _handleHomepageRedirect : _handlePWRedirect} width="7vh" widthmobile="15vh"  leftalign url={'media/website/logowhite.svg'} margin="0.5rem 0.5rem 0.5rem 2rem"></ImageLoader></Link> : <Link href={urls.HOMEPAGE}><ImageLoader   hoverpointer  onclick={!props.PW ? _handleHomepageRedirect : _handlePWRedirect} leftalign width="7vh" widthmobile="15vh"  margin="0.5rem 0.5rem 0.5rem 2rem" url={'media/website/logoblack.svg'}></ImageLoader></Link> 
        }           <div>

  {/* {props.headerColor === 'black'? <Link href={urls.HOMEPAGE}><ImageLoader hoverpointer  onclick={_handleHomepageRedirect} width="7vh" widthmobile="15vh"  leftalign url={'media/website/logowhite.svg'} margin="0.5rem 0.5rem 0.5rem 2rem"></ImageLoader></Link> : <Link href={urls.HOMEPAGE}><ImageLoader   hoverpointer  onclick={_handleHomepageRedirect} leftalign width="7vh" widthmobile="15vh"  margin="0.5rem 0.5rem 0.5rem 2rem" url={'media/website/logoblack.svg'}></ImageLoader></Link> } */}
        {props.hidehomecta ?  
            <CompanyName style={{color: props.headerColor === 'black' ? 'white': 'black', margin: "0 0rem 0 0.25rem", fontSize: "2.25vh", fontWeight: '700', lineHeight: 1, display: !props.PW ? 'inline' : 'block', letterSpacing: '0'}} className="font-opensans">{'thetarzanway'}</CompanyName>
         : 
          <Link href={!props.PW? urls.HOMEPAGE : '/corporates/physicswallah'}><CompanyName style={{color: props.headerColor === 'black' ? 'white': 'black', margin: "0 0 0 0.25rem", fontSize: "2.25vh", fontWeight: '700', lineHeight: 1, display: 'inline', letterSpacing: '0'}} className="font-opensans">thetarzanway</CompanyName></Link>

      }
      {
       props.PW ?  
       <Link href={'/corporates/physicswallah'}><CompanyName style={{color: props.headerColor === 'black' ? 'white': 'black', margin: "0.5vh 0 0 0.25rem", fontSize: "1.75vh", fontWeight: '300', lineHeight: '1.2', display: !props.PW ? 'inline' : 'block', letterSpacing: '0'}} className="font-opensans">{'Physics Wallah Holidays'}</CompanyName></Link>
: null
      }
              {/* <p style={{margin: "0", fontSize: "3vh", fontWeight: '700', lineHeight: 1, display: 'inline', letterSpacing: '-2px'}} className="font-opensans">thetarzanway</p> */}
              </div> 
        {/* </Link> */}
          
          </TTWLogoContainer>
          {/* <SearchBar />  */}
          <NavItemsContainer style={{ marginRight: props.token ? '0rem' : '0'}}>
            
            {/* <NavItem>
              <Link href={urls.travel_experiences.BASE} className="next-link" passHref={true}>
               {router.pathname === '/travel-experiences' ? <StyledLink style={{color: props.headerColor === 'black' ? 'white' : 'black', borderColor:  '#f7e700'}}>Experiences</StyledLink> : <StyledLink style={{color: props.headerColor === 'black' ? 'white' : 'black'}}>Experiences</StyledLink>}
              </Link>
            </NavItem> */}
            {/* <NavItem>
                <StyledLink href="http://blog.thetarzanway.com/" style={{color: props.headerColor === 'black' ? 'white' : 'black'}}>Feed</StyledLink>
            </NavItem> */}
            <NavItem style={{margin: '0'}}>
              <Link href={urls.travel_guide.BASE} className="next-link" passHref={true}>
              { router.pathname === '/travel-guide' ?  <StyledLink style={{color: props.headerColor === 'black' ? 'white' : 'black', borderColor:  '#f7e700'}}>Travel Guide</StyledLink> :  <StyledLink style={{color: props.headerColor === 'black' ? 'white' : 'black'}}>Travel Guide</StyledLink>}
              </Link>
            </NavItem>
            <NavItem>
              <Link href={urls.CONTACT} passHref={true}>
              {  router.pathname === '/contact' ?<StyledLink style={{color: props.headerColor === 'black' ? 'white' : 'black', borderColor: '#f7e700'}}>Contact</StyledLink> : <StyledLink style={{color: props.headerColor === 'black' ? 'white' : 'black'}}>Contact</StyledLink>}
              </Link>
            </NavItem>
            {/* <NavItem style={{padding: "0"}}>
              <Link href={urls.ABOUT_US} passHref={true}>
                {router.pathname === '/about-us' ? <StyledLink style={{color: props.headerColor === 'black' ? 'white' : 'black', borderColor:  '#f7e700'}}>About Us</StyledLink> : <StyledLink style={{color: props.headerColor === 'black' ? 'white' : 'black'}}>About Us</StyledLink>}
              </Link>
            </NavItem> */}
          {/* <NavItem>
              <Button>Login</Button>
          </NavItem> */}
          {  !props.hidecta  ? 
                        <Button fontWeight="600" boxShadow  hoverBgColor="white" hoverColor="black" bgColor="#F7e700" borderStyle="none" borderRadius="5px" margin="0 1.5rem 0 0" padding="0.75rem 0.75rem" onclick={props.ctaonclick? props.ctaonclick : _handleTailoredClick}>Create a Trip</Button> 
          : null}
          {props.token ? 
          <ProfilDropDown
            setShowDropDownProfileList={setShowDropDownProfileList}
            showDropDownProfileList={showDropDownProfileList}
            showDropDownProfileListMobile={showDropDownProfileListMobile}
            toggleProfileList={toggleProfileList}
            onLogout={props.onLogout}
            authShowLogin={props.authShowLogin}
            token={props.token}
            headerColor={props.headerColor}
            name={props.name}
            image={props.image}
            notifications={props.notifications}
            _handleNotifications={_handleNotifications}
            notOpenedCount={props.notOpenCount} 
          /> : 
          <ProfileDropDownLoggedOut
            setShowDropDownProfileList={setShowDropDownProfileList}
            showDropDownProfileList={showDropDownProfileList}
            showDropDownProfileListMobile={showDropDownProfileListMobile}
            toggleProfileList={toggleProfileList}
            onLogout={props.onLogout}
            authShowLogin={props.authShowLogin}
            token={props.token}
            headerColor={props.headerColor}
               /> }
          </NavItemsContainer>
        </CenterNav> }
      </NavbarContainer>
            <Notifications _deleteNotificationHandler={props._deleteNotificationHandler} _openAllNotificationsHandler={props._openAllNotificationsHandler} notifications={props.notifications} show={showNotifications} handleClose={() => setShowNotifications(false)} ></Notifications>
    </Header></div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    name: state.auth.name,
    image: state.auth.image
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(logout.logout()),
    authShowLogin: () => dispatch(authaction.authShowLogin()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
