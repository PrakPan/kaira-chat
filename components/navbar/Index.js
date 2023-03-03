import React, { useState, useEffect } from 'react';
 
import * as logout from '../../store/actions/logout';
import * as authaction from '../../store/actions/auth';
import { connect } from 'react-redux';
 
import IndexDesktop from './Desktop';
import media from '../media';
import NewMobile from './mobile/Index';
import axiosnotificationsinstance from '../../services/user/notifications/notifications';
 



const Navbar = (props) => {
  let isPageWide = media('(min-width: 768px)')
    const [hideNav, setHideNav] = useState(false);

    const [headerColor, setHeaderColor] = useState('black')
    const [notOpenCount,  setNotOpenCount] = useState();

    let notopencount = 0;
 
    let [notifications, setNotifications] = useState([]);
    useEffect(() => {
        if(props.token)
        axiosnotificationsinstance.get("",  {headers: {
            'Authorization': `Bearer ${props.token}`
            }}).then(res => {
              
                for(var i = 0; i<res.data.length ; i++){
                  if(res.data[i].status == 'Not opened') {
                    notopencount = notopencount+1;
                  }
                }
                setNotifications(res.data);
                setNotOpenCount(notopencount);

            }).catch(err => {
        })
    },[ props.token]);

 

    useEffect(() => {

    let prevScroll = window.pageYOffset;
    let scrollhandler = () => {
       if(window.pageYOffset < 10){
        setHideNav(false); 
        setHeaderColor('black')
       }
       else setHeaderColor('white');
      let currentScroll = window.pageYOffset;
      //sfroll up
      if (prevScroll >= currentScroll ) {
         setHideNav(false);
      }
        //scroll down
      else {

         if(window.pageYOffset < 10) setHeaderColor('black');
         else setHideNav(true);
        // else setHeaderColor('black');
      }
      prevScroll = currentScroll;
    };
    window.addEventListener('scroll', scrollhandler);
    return () => {
      window.removeEventListener('scroll', scrollhandler);
    };
  });

  const _deleteNotificationHandler = (id) => {
    if(props.token)
    axiosnotificationsinstance.delete("?id="+id,  {headers: {
        'Authorization': `Bearer ${props.token}`
        }}).then(res => {

            setNotifications(res.data)
        }).catch(err => {
    })
   
}
const _openAllNotificationsHandler = () => {
  if(props.token)
  axiosnotificationsinstance.patch("", {},  {headers: {
      'Authorization': `Bearer ${props.token}`
      }}).then(res => {
        setNotOpenCount(0);
      }).catch(err => {
  })
}
 
    return(
      <div>
      <div className='hidden-desktop'><NewMobile _openAllNotificationsHandler={_openAllNotificationsHandler} hidecta={props.hidecta} ctaonclick={props.ctaonclick} _deleteNotificationHandler={_deleteNotificationHandler} notifications={notifications} _deleteNotificationHandler={_deleteNotificationHandler} headerColor={headerColor} hideNav={hideNav} notOpenCount={notOpenCount} ></NewMobile></div>
      <div   className='hidden-mobile'>
        <div style={{display: hideNav? 'none !important' : 'initial !important'}}>
          <IndexDesktop PW={props.PW} ctaonclick={props.ctaonclick} hidehomecta={props.hidehomecta} hidecta={props.hidecta} _deleteNotificationHandler={_deleteNotificationHandler} _openAllNotificationsHandler={_openAllNotificationsHandler} notOpenCount={notOpenCount} notifications={notifications} token={props.token} headerColor={headerColor} style={{}}></IndexDesktop>
        </div> 
      </div>
      </div>
    );
}
const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    name: state.auth.name,
    image: state.auth.image,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(logout.logout()),
    authShowLogin: () => dispatch(authaction.authShowLogin()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Navbar));
