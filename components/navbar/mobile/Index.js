import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { faBars, faTimes, faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import Drawer from '@material-ui/core/Drawer';
import  Link  from 'next/link';
import Button from '../../ui/button/Index';
import {CgMenuLeftAlt} from 'react-icons/cg'
import { useRouter } from 'next/router'
import LoggedInMenu from './LoggedIn';
import * as authaction from '../../../store/actions/auth';
import { connect } from 'react-redux';
import ImageLoader from '../../ImageLoader';
import cross from '../../../public/assets/close.png';
import * as logout from '../../../store/actions/logout';
import Notifications from '../../modals/Notifications/Index';
import SearchMobile from '../../search/homepage/mobile/Index';
import {FaSearch} from 'react-icons/fa'
// import ImageLoader from '../../ImageLoader';
const Container = styled.div`
background-color: white;
padding: 0 3vw;
position: fixed !important;
top: 0 !important;
width: 100vw;
height: 20vw;
z-index: 1500;
// display: grid;
// grid-template-columns: ${props=> props.hidecta? '0.1fr 1fr 0.1fr' : '0.3fr 1fr 1.5fr'} ;

display : flex;
justify-content : space-between;
padding-right : 1.5rem;
box-shadow: 0px 1px 1px 0px rgb(0 0 0 / 14%);
`;

const DrawerContainer = styled.div`
width: 80vw;
background-color: white;
height: 100vh;
padding-top : 72px;
`;
const ListContainer = styled.div`
    padding: 0.5rem 1rem;
`;
const ListItem = styled.div`
    // text-align: right;
    margin-bottom: 1rem;

`;
const StyledLink = styled.a`
    text-decoration: none;
    color: black;
    font-size: 1rem;
    letter-spacing: 2px;
    font-weight: 300;
`;
const TTWLogo= styled.img`
  width: 15vw;
  height: auto;


`;
const Segregtation = styled.div`
    height: 2px;
    margin: 2rem 0  1rem 15%;
    background-color: #f7e700;
`;
const Cross=styled.img`
    width: 1.5rem;
    margin: 1rem;
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

const CompanyName =styled.div`
position: absolute;
left: 34px;
top: 23px;
font-size : 14px;
font-weight : 600;
`
const Mobile = (props) => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [toggleSearch, setToggleSearch] = useState(false);
    const [showLogo , setShowLogo] = useState(false)
    const _handleNotifications = ( ) => {
        setToggleMenu(false);
        setShowNotifications(true);
    }

  useEffect(() => {
    setShowLogo(true)
    },[])
    const router = useRouter();
    const _handleLogin = () => {
        setToggleMenu(false);
        props.authShowLogin();
    }
    useEffect(() => {
       },[ props.notOpenCount]);

       const _handleHomepageRedirect = () => {
            router.push('/');
       }

       const LinksArr = [
            {type : 'main' , link : '/dashboard' , text : 'My Plans' },
            {type : 'main' , onclick : ()=>_handleNotifications() , text : 'Notifications' },
            {type : 'main' ,link : '/travel-guide' , text : 'Travel Guide' },
            {type : 'main' ,link : 'http://blog.thetarzanway.com/' , text : 'Travel Feed' },
            {type : 'main' ,link : '/tailored-travel' , text : 'Tailor-made travel' },
            {type : 'main' ,link : '/testimonials' , text : 'Testimonials' },
            {type : 'others' ,link : '/contact' , text : 'Contact Us' },
            {type : 'others' ,link : '/covid-19-safe-travel-india' , text : 'Covid 19 Safety' },
            {type : 'others' ,onclick : ()=> props.onLogout(), text : 'Logout' },
        ] 

        const LinksDiv = LinksArr.map((e)=>
        <div onClick={e.onclick? e.onclick : ()=>router.push(e.link)}>
            <div style={{height : '50px' , width : '50px' , border : '1px solid red'}}></div>
            <div>
            {e.text}
            </div>
            </div>
        )


       return(
      <div key={props.notOpenCount}>
    <Container hidecta={props.hidecta} style={{ backgroundColor: props.headerColor === 'black' ? 'rgba(0,0,0,0.7)': 'white'}}>
    <div style={{display:'flex', alignItems: 'center' , marginRight : '-10px'}}>
        {props.notifications.length && props.notOpenCount ? <RedDot className="center-div ">{props.notOpenCount}</RedDot> : null}
            {/* {props.token?<ImageLoader dimensions={{width: 200, height: 200}} dimensionsMobile={{width: 200, height: 200}} url={props.image!==null && props.image!=='null' ? props.image : "media/website/user.svg"} onclick={() => setToggleMenu(true)} width="3rem" leftalign height="3rem" widthmobile="3rem" borderRadius="50%"></ImageLoader>:null} */}
            {typeof window !=='undefined' ? <div>
                {/* {props.token  ? <FontAwesomeIcon style={{color:props.headerColor === 'black' ? 'white' : 'black', fontSize: '1rem', margin: '0 0 0 0.5rem', fontWeight: '300'}} icon={faEllipsisV} onClick={() => setToggleMenu(true)}></FontAwesomeIcon> : <FontAwesomeIcon style={{color:props.headerColor === 'black' ? 'white' : 'black', fontSize: '1.5rem', margin: '0 0 0 0.5rem', fontWeight: '300'}} icon={faBars} onClick={() => setToggleMenu(true)}></FontAwesomeIcon>} */}
                {/* <FontAwesomeIcon style={{color:props.headerColor === 'black' ? 'white' : 'black', fontSize: '1.5rem', margin: '0 0 0 0.5rem', fontWeight: '300'}} icon={CgMenuLeftAlt} onClick={() => setToggleMenu(true)}></FontAwesomeIcon> */}

                <CgMenuLeftAlt style={{fontSize: '1.5rem', fontWeight: '900'}} onClick={() => setToggleMenu(!toggleMenu)} />
                </div> : null}
                
        </div>

         <div style={{position : 'relative', marginLeft : '-20%' , marginBlock : 'auto'}}>
             {/* <TTWLogo src={TTWlogowhite}></TTWLogo> */}
             {showLogo && <Link  href='/'><ImageLoader  dimensions={{width: 200, height: 200}} dimensionsMobile={{width: 200, height: 200}}  hoverpointer  onclick={_handleHomepageRedirect} width="3rem" leftalign widthmobile="15vw" url={'media/website/logoblack.svg'} ></ImageLoader></Link>}
            <CompanyName>thetarzanway</CompanyName>
            </div>
            {  !props.hidecta  ?
            <div style={{}} className="center-div" onClick={() => setToggleSearch(true)}>
            <FaSearch style={{ color: props.headerColor === 'black' ? 'white': 'black'}}></FaSearch> 
            </div>
          : null}

            {/* <LocalPhoneIcon style={{hieght : '100%',margin : 'auto 0' , color : props.headerColor === 'black' ? 'white' : 'black'}} onClick={() => router.push('/contact')} /> */}
            {/* {  !props.hidecta  ? 
                        <Button fontWeight="600" boxShadow  hoverBgColor="white" hoverColor="black" bgColor="#F7e700" borderStyle="none" borderRadius="5px" padding="0.75rem 0.75rem" link={'/tailored-travel'}>Create a Trip</Button> 
          : null} */}
            
        <Drawer
      anchor='left'
      open={toggleMenu}
      onClose={() => setToggleMenu(false)}
      className="mobile-header-menu"
    >
      <DrawerContainer>
      {/* <Cross onClick={() => setToggleMenu(false)} src={cross}></Cross> */}
          <ListContainer>
              {props.token ? <LoggedInMenu notOpenCount={props.notOpenCount} notifications={props.notifications} _handleNotifications={_handleNotifications} onClose={() => setToggleMenu(false)} onLogout={props.onLogout} name={props.name}/> : null}
              {props.token ? <Segregtation/> : null}
              {!props.token ?  <ListItem style={{fontWeight: '600'}}>
                <StyledLink style={{fontWeight: '700', fontSize: '1.75rem'}}>Login/Signup</StyledLink>    
            </ListItem> : null}

            <ListItem>
                <Link href='/' className="next-link" passHref={true}>
                {router.pathname === '/' ? <StyledLink style={{borderStyle: 'none none solid none', borderColor: '#f7e700', borderWidth: '2px', }}>Home</StyledLink> : <StyledLink style={{fontWeight: '300'}}>Home</StyledLink>}
                </Link>
            </ListItem>
            <ListItem>
                <Link href='/about-us' className="next-link" passHref={true}>
                    {router.pathname=== '/about-us' ? <StyledLink style={{borderStyle: 'none none solid none', borderColor: '#f7e700', borderWidth: '2px'}}>About Us</StyledLink> : <StyledLink style={{fontWeight: '300'}}>About Us</StyledLink>}
                </Link>
            </ListItem>
            {/* <ListItem>
                <Link href='/travel-experiences' className="next-link" passHref={true}>
                {router.pathname === '/travel-experiences' ? <StyledLink  style={{borderStyle: 'none none solid none', borderColor: '#f7e700', borderWidth: '2px',}}>Experiences</StyledLink> : <StyledLink  style={{fontWeight: '300'}}>Experiences</StyledLink>}
                </Link>
            </ListItem> */}
            <ListItem>
                <Link href='/travel-guide' className="next-link" passHref={true}>
                {router.pathname === '/travel-guide' ? <StyledLink  style={{borderStyle: 'none none solid none', borderColor: '#f7e700', borderWidth: '2px',}}>Travel Guide</StyledLink> : <StyledLink  style={{fontWeight: '300'}}>Travel Guide</StyledLink>}
                </Link>
            </ListItem>
            <ListItem>
                    <StyledLink href="http://blog.thetarzanway.com/"  style={{fontWeight: '300'}}>Travel Feed</StyledLink>
            </ListItem>
            <ListItem>
                <Link href='/tailored-travel' className="next-link" passHref={true}>
                {router.pathname === '/tailored-travel' ? <StyledLink  style={{borderStyle: 'none none solid none', borderColor: '#f7e700', borderWidth: '2px',}}>Tailor-Made Travel</StyledLink> :  <StyledLink  style={{fontWeight: '300'}}>Tailor-Made Travel</StyledLink>}
                </Link>
            </ListItem>
            <ListItem>
                <Link href='/testimonials' className="next-link" passHref={true}>
                {router.pathname === '/testimonials' ? <StyledLink  style={{borderStyle: 'none none solid none', borderColor: '#f7e700', borderWidth: '2px',}}>Testimonials</StyledLink> :  <StyledLink  style={{fontWeight: '300'}}>Testimonials</StyledLink>}
                </Link>
            </ListItem>
            <Segregtation/>
            {!props.token ? <ListItem>
                <StyledLink  style={{fontWeight: '300'}} onClick={_handleLogin}>Login</StyledLink>
            </ListItem> : null}
            <ListItem>
                <Link href='/contact' className="next-link" passHref={true}>
                {router.pathname === '/contact' ? <StyledLink  style={{borderStyle: 'none none solid none', borderColor: '#f7e700', borderWidth: '2px',}}>Contact Us</StyledLink> :  <StyledLink  style={{fontWeight: '300'}}>Contact Us</StyledLink>}
                </Link>
            </ListItem>
            <ListItem>
                <Link href='/covid-19-safe-travel-india' className="next-link" passHref={true}>
                {router.pathname === '/covid-19-safe-travel-india' ? <StyledLink  style={{borderStyle: 'none none solid none', borderColor: '#f7e700', borderWidth: '2px',}}>COVID-19 Safety</StyledLink> :  <StyledLink  style={{fontWeight: '300'}}>COVID-19 Safety</StyledLink>}
                </Link>
            </ListItem>
            <ListItem>
                {/* <Link href='/about-us' className="next-link" passHref={true}> */}
                    {/* <StyledLink  style={{fontWeight: '100'}}>Login</StyledLink> */}
                {/* </Link> */}
            </ListItem>
          </ListContainer>
      </DrawerContainer>
    </Drawer>
    </Container>
    {toggleSearch ? <div className='hidden-desktop' style={{width: '100%'}}><SearchMobile onclose={() => setToggleSearch(false)} open={true}></SearchMobile></div> : null}

    <Notifications _deleteNotificationHandler={props._deleteNotificationHandler} _openAllNotificationsHandler={props._openAllNotificationsHandler} _deleteNotificationHandler={props._deleteNotificationHandler} notifications={props.notifications} show={showNotifications} handleClose={() => setShowNotifications(false)}></Notifications>
    </div>
  );
}

const mapStateToProps = (state) => {
    return {
      token: state.auth.token,
      name: state.auth.name,
      image: state.auth.image
    };
  };
  const mapDispatchToProps = (dispatch) => {
    return {
      authShowLogin: () => dispatch(authaction.authShowLogin()),
      onLogout: () => dispatch(logout.logout()),

    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(Mobile);
