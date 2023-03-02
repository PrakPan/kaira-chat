import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {Modal} from 'react-bootstrap';
import styled from 'styled-components';
import * as authaction from '../../../store/actions/auth';
import LoggedOut from './LoggedOut';
const Enquiry = (props) => {
  return(
    //Handle logged in case (to do)
      <div>
          <Modal show={props.show} onHide={props.handleClose} size="lg">
            <Modal.Header style={{borderStyle: "solid solid none solid", borderColor: "#F7e700", borderWidth: "0.5rem"}} closeButton>
            </Modal.Header>
            <Modal.Body style={{borderStyle: "none solid solid solid", borderColor: "#F7e700", borderWidth: "0.5rem", minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <LoggedOut title="Life in a Pahadi Village"></LoggedOut>
            </Modal.Body>
      </Modal>
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