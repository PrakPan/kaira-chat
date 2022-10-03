import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import Spinner from '../Spinner';
import * as authaction from '../../store/actions/auth';
const CheckAuthRedirect = (props) => {
    //Set AuthRediect (redux) from authredirectpath from parent
    props.setAuthRedircet(props.authRedirectPath);

    if(props.checkAuthCompleted){
      //Token present implies authenticated, render children
      if(props.token !== null){
        return <div>
          {props.children}
          </div>
        }
        //No token present, show login modal, render empty div
        else{ 
          props.authHideLoginClose();
           props.authShowLogin(); 
           if(props.redirectOnFail) props.redirectOnFail();
          return <div></div>;
        }
    }
    else return <Spinner></Spinner>


}
const mapStateToPros = (state) => {
    return{
      token: state.auth.token,
      checkAuthCompleted: state.auth.checkAuthCompleted,
    }
  }
const mapDispatchToProps = dispatch => {
  return{
    setAuthRedircet: (path) => dispatch(authaction.setAuthRedirect(path)),
    authShowLogin : () => dispatch(authaction.authShowLogin()),
    authHideLoginClose: ()=>dispatch(authaction.authHideLoginClose())
  }
}
 
export default connect(mapStateToPros, mapDispatchToProps)(CheckAuthRedirect)