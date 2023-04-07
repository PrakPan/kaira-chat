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
import {FaClipboard, FaSearch , FaPenSquare} from 'react-icons/fa'
import { MdAssignment, MdNotifications } from 'react-icons/md';
import {HiPhone} from 'react-icons/hi'
import {IoMdChatboxes} from 'react-icons/io'
import {BsShieldFillPlus} from 'react-icons/bs'
import {TbLogout} from 'react-icons/tb'
// import ImageLoader from '../../ImageLoader';
const Container = styled.div`
background-color: white;
padding: 0 5vw;
position: fixed !important;
top: 0 !important;
width: 100vw;
height: 72px;
z-index: 1500;
// display: grid;
// grid-template-columns: ${props=> props.hidecta? '0.1fr 1fr 0.1fr' : '0.3fr 1fr 1.5fr'} ;

display : flex;
justify-content : space-between;
box-shadow: 0px 1px 1px 0px rgb(0 0 0 / 14%);

`;

const DrawerContainer = styled.div`
width: 250px;
background-color: white;
height: 100vh;
padding-top : 65px;
`;
const ListContainer = styled.div`
    padding-block: 0.5rem;
`;
const ListItem = styled.div`
    // text-align: right;
    padding-block: 1rem;
    padding-inline : 15px;
    display : flex;
    gap : 13px;
    align-items : center;
    font-family : Poppins;
`;
const StyledLink = styled.a`
text-decoration : none;
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 16px;
color: #01202B;

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
const Heading = styled.p`
font-family: 'Poppins';
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 16px;
text-transform: uppercase;
color: #7A7A7A;
margin-block: 1rem;
padding-inline: 1rem;
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
            {type : 'main' , link : '/' , text : 'Home' , icon : 'media/icons/navigation/home-page.png'},
            {type : 'main' , link : '/dashboard' , text : 'My Plans' , icon : 'media/icons/navigation/clipboard.png'},
            {type : 'main' , onclick : ()=>_handleNotifications() , text : 'Notifications', icon: 'media/icons/navigation/bell.png' },
            // {type : 'main' ,link : '/travel-guide' , text : 'Travel Guide' },
            {type : 'main' ,link : 'http://blog.thetarzanway.com/' , text : 'Travel Feed' , icon : 'media/icons/navigation/chat.png' },
            {type : 'main' ,link : '/tailored-travel' , text : 'Tailor-made travel' , icon : 'media/icons/navigation/page.png' },
            {type : 'main' ,link : '/testimonials' , text : 'Testimonials' ,icon : 'media/icons/navigation/testimonial.png' },
            {type : 'others' ,link : '/contact' , text : 'Contact Us' , icon : 'media/icons/navigation/call.png'},
            {type : 'others' ,link : '/covid-19-safe-travel-india' , text : 'Covid 19 Safety' , icon : 'media/icons/navigation/health-insurance.png' },
        ] 
        const MainLinksDiv = LinksArr.map((e)=>{
            if(e.type === 'main')
        return <ListItem onClick={e.onclick && e.onclick} style={router.pathname===e.link ? {backgroundColor :  "#ffff4a45"} : {}} >
            {e.icon && <ImageLoader leftalign url={e.icon} height='20px' width='20px' dimensions={{height : 20 , width : 20}} widthmobile='20px' />}
           {e.link &&  <Link href={e.link} className='next-link' passHref={true}>
            <StyledLink>{e.text}</StyledLink>
            </Link>}
            {e.onclick && <StyledLink onClick={e.onclick}>{e.text}</StyledLink>}
            </ListItem>}
        )

        const OtherLinksDiv = LinksArr.map((e)=>
        {if(e.type == 'others') return <ListItem onClick={e.onclick && e.onclick} style={router.pathname===e.link ? {backgroundColor :  "#ffff4a45"} : {}}>
            {e.icon && <ImageLoader leftalign url={e.icon} height='20px' width='20px' dimensions={{height : 20 , width : 20}} widthmobile='20px' />}
           {e.link &&  <Link href={e.link} className='next-link' passHref={true}>
            <StyledLink>{e.text}</StyledLink>
            </Link>}
            {e.onclick && <StyledLink onClick={e.onclick}>{e.text}</StyledLink>}
            </ListItem>
        })

    //     <ListItem>
    //     <Link href='/' className="next-link" passHref={true}>
    //     {router.pathname === '/' ? <StyledLink style={{borderStyle: 'none none solid none', borderColor: '#f7e700', borderWidth: '2px', }}>Home</StyledLink> : <StyledLink style={{fontWeight: '300'}}>Home</StyledLink>}
    //     </Link>
    // </ListItem>

       return(
      <div key={props.notOpenCount} >
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
            {!props.hidecta &&<CompanyName>thetarzanway</CompanyName>}
            </div>
            {  !props.hidecta  ?
            <div style={{background : '#F0F0F0' , padding : '10px' , marginBlock : 'auto' , borderRadius : '50%'}} className="center-div" onClick={() => setToggleSearch(true)}>
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
      width='250px'
    >
      <DrawerContainer>
      {/* <Cross onClick={() => setToggleMenu(false)} src={cross}></Cross> */}
          <ListContainer>
              {/* {props.token ? <LoggedInMenu notOpenCount={props.notOpenCount} notifications={props.notifications} _handleNotifications={_handleNotifications} onClose={() => setToggleMenu(false)} onLogout={props.onLogout} name={props.name}/> : null}
              {props.token ? <Segregtation/> : null}
              {!props.token ?  <ListItem style={{fontWeight: '600'}}>
                <StyledLink style={{fontWeight: '700', fontSize: '1.75rem'}}>Login/Signup</StyledLink>    
            </ListItem> : null} */}

            <ListItem style={{backgroundColor : '#F8F8F8'}}>
                <LoggedInMenu  userImage={props.image} _handleLogin={_handleLogin} token={props.token} notOpenCount={props.notOpenCount} notifications={props.notifications} _handleNotifications={_handleNotifications} onClose={() => setToggleMenu(false)} onLogout={props.onLogout} name={props.name} />
            </ListItem>
            {MainLinksDiv}
            <Heading>OTHERS</Heading>
            {OtherLinksDiv}

           {props.token &&  <ListItem onClick={props.onLogout}>
            {<ImageLoader leftalign url={'media/icons/navigation/logout.png'} height='20px' width='20px' dimensions={{height : 20 , width : 20}} widthmobile='20px' />}
            <StyledLink>Logout</StyledLink>
            </ListItem>}



            {/* <ListItem>onclick
                <Link href='/' className="next-link" passHref={true}>
                {router.pathname === '/' ? <StyledLink style={{borderStyle: 'none none solid none', borderColor: '#f7e700', borderWidth: '2px', }}>Home</StyledLink> : <StyledLink style={{fontWeight: '300'}}>Home</StyledLink>}
                </Link>
            </ListItem>
            <ListItem>
                <Link href='/about-us' className="next-link" passHref={true}>
                    {router.pathname=== '/about-us' ? <StyledLink style={{borderStyle: 'none none solid none', borderColor: '#f7e700', borderWidth: '2px'}}>About Us</StyledLink> : <StyledLink style={{fontWeight: '300'}}>About Us</StyledLink>}
                </Link>
            </ListItem>
            <ListItem>
                <Link href='/travel-experiences' className="next-link" passHref={true}>
                {router.pathname === '/travel-experiences' ? <StyledLink  style={{borderStyle: 'none none solid none', borderColor: '#f7e700', borderWidth: '2px',}}>Experiences</StyledLink> : <StyledLink  style={{fontWeight: '300'}}>Experiences</StyledLink>}
                </Link>
            </ListItem>
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
                <Link href='/about-us' className="next-link" passHref={true}>
                    <StyledLink  style={{fontWeight: '100'}}>Login</StyledLink>
                </Link>
            </ListItem> */}
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
