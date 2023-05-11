import React from 'react';
import {connect} from 'react-redux';
import * as authaction from '../../../store/actions/auth';
const Enquiry = (props) => {
  
  return(
      <div>
          {props.token}
      </div>
  );


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
  }
}
 
export default connect(mapStateToPros, mapDispatchToProps)(Enquiry);