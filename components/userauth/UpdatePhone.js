import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Button } from '@mui/material';
import Button1 from '../Button';
import { TextField } from '@mui/material';
import { Grid } from '@mui/material';

import { connect } from 'react-redux';
import * as authaction from '../../store/actions/auth';
import * as otpaction from '../../store/actions/getOtp';
import axios from 'axios';
import styled from 'styled-components';
import theme from '../../public/Themes';

const UpdatePhone = (props) => {
  return (
    //     <Grid item xs={12}>
    //   <TextField
    //   key="otp"
    //     // error={props.otpFail ? true : false}
    //     // helperText={props.otpFail ? "OTP is not valid" : null}
    //     variant="outlined"
    //     required
    //     fullWidth
    //     name="otp"
    //     label="Enter OTP"
    //     type="otp"
    //     id="otp"
    //     autoComplete="current-password"
    //     // onChange={handleOtpChange}
    //     className="loginform"

    //   />
    //   </Grid>
    <div>1</div>
  );
};

const mapStateToPros = (state) => {
  return {
    otpFail: state.auth.otpFail,
    mobileFail: state.auth.mobileFail,
    otpSent: state.auth.otpSent,
    loading: state.auth.loading,
    newUser: state.auth.newUser,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (mobile, password, name, email) =>
      dispatch(authaction.auth(mobile, password, name, email)),
    onOtp: (mobile, setNewUser) =>
      dispatch(otpaction.getotp(mobile, setNewUser)),
    onResetLogin: () => dispatch(authaction.authResetLogin()),
    onGoogleAuth: (response) => dispatch(authaction.googleAuth(response)),
    onFbAuth: (response) => dispatch(authaction.fbAuth(response)),
  };
};
export default connect(mapStateToPros, mapDispatchToProps)(UpdatePhone);
