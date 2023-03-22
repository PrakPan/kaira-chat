import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { RiBarChartHorizontalLine } from 'react-icons/ri';
import {
  faBars,
  faTimes,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
import Drawer from '@material-ui/core/Drawer';
import Link from 'next/link';
import Button from '../../ui/button/Index';

import { useRouter } from 'next/router';
import LoggedInMenu from './LoggedIn';
import * as authaction from '../../../store/actions/auth';
import { connect } from 'react-redux';
import ImageLoader from '../../ImageLoader';
import cross from '../../../public/assets/close.png';
import * as logout from '../../../store/actions/logout';
import Notifications from '../../modals/Notifications/Index';
import SearchMobile from '../../search/homepage/mobile/Index';
import { FaSearch } from 'react-icons/fa';
import ButtonYellow from '../../ButtonYellow';
// import ImageLoader from '../../ImageLoader';
const Container = styled.div`
  background-color: white;
  padding: 0 3vw;
  position: fixed !important;
  top: 0 !important;
  width: 100vw;
  height: 20vw;
  z-index: 998;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  /* grid-template-columns: ${(props) =>
    props.hidecta ? '0.1fr 1fr 2fr' : '0.3fr 1fr 3fr'}; */

  box-shadow: 0px 1px 1px 0px rgb(0 0 0 / 14%);
`;

const DrawerContainer = styled.div`
  width: 80vw;
  background-color: white;
  border-style: solid;
  border-color: #f7e700;
  border-width: 5px;
  height: 100vh;
`;
const ListContainer = styled.div`
  padding: 0.5rem 1rem;
`;
const ListItem = styled.div`
  text-align: right;
  margin-bottom: 1rem;
`;
const StyledLink = styled.a`
  text-decoration: none;
  color: black;
  font-size: 1rem;
  letter-spacing: 2px;
  font-weight: 300;
`;
const TTWLogo = styled.img`
  width: 15vw;
  height: auto;
`;
const Segregtation = styled.div`
  height: 2px;
  margin: 2rem 0 1rem 15%;
  background-color: #f7e700;
`;
const Cross = styled.img`
  width: 1.5rem;
  margin: 1rem;
`;
const IconContainer = styled.div`
  background: #f0f0f0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  width: 40px;
  height: 40px;
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
  top: -1rem;
  left: 2.95rem;
  z-index: 1000;
  color: black;
`;
const Mobile = (props) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  console.log('propss cta' + props.hidecta);
  const _handleNotifications = () => {
    setToggleMenu(false);
    setShowNotifications(true);
  };

  useEffect(() => {}, []);
  const router = useRouter();
  const _handleLogin = () => {
    setToggleMenu(false);
    props.authShowLogin();
  };
  useEffect(() => {}, [props.notOpenCount]);

  const _handleHomepageRedirect = () => {
    router.push('/');
  };
  return (
    <div key={props.notOpenCount}>
      <Container
        hidecta={props.hidecta}
        style={{
          display: 'flex',
          backgroundColor: 'white',
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', marginRight: '7px' }}
        >
          {props.notifications.length && props.notOpenCount ? (
            <RedDot className="center-div font-opensans">
              {props.notOpenCount}
            </RedDot>
          ) : null}
          {/* {props.token?<ImageLoader dimensions={{width: 200, height: 200}} dimensionsMobile={{width: 200, height: 200}} url={props.image!==null && props.image!=='null' ? props.image : "media/website/user.svg"} onclick={() => setToggleMenu(true)} width="3rem" leftalign height="3rem" widthmobile="3rem" borderRadius="50%"></ImageLoader>:null} */}
          {typeof window !== 'undefined' ? (
            <div>
              {/* {props.token  ? <FontAwesomeIcon style={{color:props.headerColor === 'black' ? 'white' : 'black', fontSize: '1rem', margin: '0 0 0 0.5rem', fontWeight: '300'}} icon={faEllipsisV} onClick={() => setToggleMenu(true)}></FontAwesomeIcon> : <FontAwesomeIcon style={{color:props.headerColor === 'black' ? 'white' : 'black', fontSize: '1.5rem', margin: '0 0 0 0.5rem', fontWeight: '300'}} icon={faBars} onClick={() => setToggleMenu(true)}></FontAwesomeIcon>} */}
              <RiBarChartHorizontalLine
                style={{
                  color: 'black',
                  fontSize: '1.5rem',
                  margin: '0 0 0 0.5rem',
                  fontWeight: '300',
                }}
                onClick={() => setToggleMenu(true)}
              />
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {/* <TTWLogo src={TTWlogowhite}></TTWLogo> */}
          {/* {props.headerColor === 'black' ? (
            <Link href="/">
              <ImageLoader
                dimensions={{ width: 200, height: 200 }}
                dimensionsMobile={{ width: 200, height: 200 }}
                hoverpointer
                onclick={_handleHomepageRedirect}
                width="15vw"
                leftalign
                widthmobile="15vw"
                url={'media/website/logowhite.svg'}
              ></ImageLoader>
            </Link>
          ) : ( */}
          {/* <Link href="/">
            <ImageLoader
              dimensions={{ width: 200, height: 200 }}
              dimensionsMobile={{ width: 200, height: 200 }}
              hoverpointer
              onclick={_handleHomepageRedirect}
              leftalign
              width="15vw"
              widthmobile="15vw"
              url={'media/website/logoblack.svg'}
            ></ImageLoader>
          </Link> */}
          {/* )} */}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          {/* {!props.hidecta ? (
            <div
              style={{}}
              className="center-div"
              onClick={() => setToggleSearch(true)}
            >
              <IconContainer>
                <FaSearch
                  style={{
                    color: 'black',
                  }}
                ></FaSearch>
              </IconContainer>
            </div>
          ) : null} */}
          <IconContainer>
            <LocalPhoneIcon
              style={{
                hieght: '100%',
                margin: 'auto 0',
                color: 'black',
              }}
              onClick={() => router.push('/contact')}
            />
          </IconContainer>

          <ButtonYellow
            style={{
              width: 'auto',
              padding: '8px 10px',
              display: `${props.hidecta ? 'none' : 'block'}`,
            }}
            onclick={() => router.push('/tailored-travel')}
          >
            Create a Trip
          </ButtonYellow>
          {/* {  !props.hidecta  ? 
                        <Button fontWeight="600" boxShadow  hoverBgColor="white" hoverColor="black" bgColor="#F7e700" borderStyle="none" borderRadius="5px" padding="0.75rem 0.75rem" link={'/tailored-travel'}>Create a Trip</Button> 
          : null} */}
        </div>

        <Drawer
          anchor="right"
          open={toggleMenu}
          onClose={() => setToggleMenu(false)}
          className="mobile-header-menu"
        >
          <DrawerContainer>
            <Cross onClick={() => setToggleMenu(false)} src={cross}></Cross>
            <ListContainer>
              {props.token ? (
                <LoggedInMenu
                  notOpenCount={props.notOpenCount}
                  notifications={props.notifications}
                  _handleNotifications={_handleNotifications}
                  onClose={() => setToggleMenu(false)}
                  onLogout={props.onLogout}
                  name={props.name}
                />
              ) : null}
              {props.token ? <Segregtation /> : null}
              {!props.token ? (
                <ListItem style={{ fontWeight: '600' }}>
                  <StyledLink
                    className="font-opensans"
                    style={{ fontWeight: '700', fontSize: '1.75rem' }}
                  >
                    Hi Traveler!
                  </StyledLink>
                </ListItem>
              ) : null}
              <ListItem>
                <Link href="/" className="next-link" passHref={true}>
                  {router.pathname === '/' ? (
                    <StyledLink
                      className="font-opensans"
                      style={{
                        borderStyle: 'none none solid none',
                        borderColor: '#f7e700',
                        borderWidth: '2px',
                      }}
                    >
                      Home
                    </StyledLink>
                  ) : (
                    <StyledLink
                      className="font-opensans"
                      style={{ fontWeight: '300' }}
                    >
                      Home
                    </StyledLink>
                  )}
                </Link>
              </ListItem>
              <ListItem>
                <Link href="/about-us" className="next-link" passHref={true}>
                  {router.pathname === '/about-us' ? (
                    <StyledLink
                      className="font-opensans"
                      style={{
                        borderStyle: 'none none soliitenaryd none',
                        borderColor: '#f7e700',
                        borderWidth: '2px',
                      }}
                    >
                      About Us
                    </StyledLink>
                  ) : (
                    <StyledLink
                      className="font-opensans"
                      style={{ fontWeight: '300' }}
                    >
                      About Us
                    </StyledLink>
                  )}
                </Link>
              </ListItem>
              {/* <ListItem>
                <Link href='/travel-experiences' className="next-link" passHref={true}>
                {router.pathname === '/travel-experiences' ? <StyledLink className="font-opensans"  style={{borderStyle: 'none none solid none', borderColor: '#f7e700', borderWidth: '2px',}}>Experiences</StyledLink> : <StyledLink className="font-opensans"  style={{fontWeight: '300'}}>Experiences</StyledLink>}
                </Link>
            </ListItem> */}
              <ListItem>
                <Link
                  href="/travel-guide"
                  className="next-link"
                  passHref={true}
                >
                  {router.pathname === '/travel-guide' ? (
                    <StyledLink
                      className="font-opensans"
                      style={{
                        borderStyle: 'none none solid none',
                        borderColor: '#f7e700',
                        borderWidth: '2px',
                      }}
                    >
                      Travel Guide
                    </StyledLink>
                  ) : (
                    <StyledLink
                      className="font-opensans"
                      style={{ fontWeight: '300' }}
                    >
                      Travel Guide
                    </StyledLink>
                  )}
                </Link>
              </ListItem>
              <ListItem>
                <StyledLink
                  href="http://blog.thetarzanway.com/"
                  className="font-opensans"
                  style={{ fontWeight: '300' }}
                >
                  Travel Feed
                </StyledLink>
              </ListItem>
              <ListItem>
                <Link
                  href="/tailored-travel"
                  className="next-link"
                  passHref={true}
                >
                  {router.pathname === '/tailored-travel' ? (
                    <StyledLink
                      className="font-opensans"
                      style={{
                        borderStyle: 'none none solid none',
                        borderColor: '#f7e700',
                        borderWidth: '2px',
                      }}
                    >
                      Tailor-Made Travel
                    </StyledLink>
                  ) : (
                    <StyledLink
                      className="font-opensans"
                      style={{ fontWeight: '300' }}
                    >
                      Tailor-Made Travel
                    </StyledLink>
                  )}
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="/testimonials"
                  className="next-link"
                  passHref={true}
                >
                  {router.pathname === '/testimonials' ? (
                    <StyledLink
                      className="font-opensans"
                      style={{
                        borderStyle: 'none none solid none',
                        borderColor: '#f7e700',
                        borderWidth: '2px',
                      }}
                    >
                      Testimonials
                    </StyledLink>
                  ) : (
                    <StyledLink
                      className="font-opensans"
                      style={{ fontWeight: '300' }}
                    >
                      Testimonials
                    </StyledLink>
                  )}
                </Link>
              </ListItem>
              <Segregtation />
              {!props.token ? (
                <ListItem>
                  <StyledLink
                    className="font-opensans"
                    style={{ fontWeight: '300' }}
                    onClick={_handleLogin}
                  >
                    Login
                  </StyledLink>
                </ListItem>
              ) : null}
              <ListItem>
                <Link href="/contact" className="next-link" passHref={true}>
                  {router.pathname === '/contact' ? (
                    <StyledLink
                      className="font-opensans"
                      style={{
                        borderStyle: 'none none solid none',
                        borderColor: '#f7e700',
                        borderWidth: '2px',
                      }}
                    >
                      Contact Us
                    </StyledLink>
                  ) : (
                    <StyledLink
                      className="font-opensans"
                      style={{ fontWeight: '300' }}
                    >
                      Contact Us
                    </StyledLink>
                  )}
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="/covid-19-safe-travel-india"
                  className="next-link"
                  passHref={true}
                >
                  {router.pathname === '/covid-19-safe-travel-india' ? (
                    <StyledLink
                      className="font-opensans"
                      style={{
                        borderStyle: 'none none solid none',
                        borderColor: '#f7e700',
                        borderWidth: '2px',
                      }}
                    >
                      COVID-19 Safety
                    </StyledLink>
                  ) : (
                    <StyledLink
                      className="font-opensans"
                      style={{ fontWeight: '300' }}
                    >
                      COVID-19 Safety
                    </StyledLink>
                  )}
                </Link>
              </ListItem>
              <ListItem>
                {/* <Link href='/about-us' className="next-link" passHref={true}> */}
                {/* <StyledLink className="font-opensans"  style={{fontWeight: '100'}}>Login</StyledLink> */}
                {/* </Link> */}
              </ListItem>
            </ListContainer>
          </DrawerContainer>
        </Drawer>
      </Container>
      {toggleSearch ? (
        <div className="hidden-desktop" style={{ width: '100%' }}>
          <SearchMobile
            onclose={() => setToggleSearch(false)}
            open={true}
          ></SearchMobile>
        </div>
      ) : null}

      <Notifications
        _deleteNotificationHandler={props._deleteNotificationHandler}
        _openAllNotificationsHandler={props._openAllNotificationsHandler}
        _deleteNotificationHandler={props._deleteNotificationHandler}
        notifications={props.notifications}
        show={showNotifications}
        handleClose={() => setShowNotifications(false)}
      ></Notifications>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    name: state.auth.name,
    image: state.auth.image,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    authShowLogin: () => dispatch(authaction.authShowLogin()),
    onLogout: () => dispatch(logout.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Mobile);
