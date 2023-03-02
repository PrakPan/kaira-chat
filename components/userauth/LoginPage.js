import React, {useState, useEffect, Fragment, useRef} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Button1 from '../Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
// import { Redirect } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal';
import {connect} from 'react-redux';
import * as authaction from '../../store/actions/auth';
import * as otpaction from '../../store/actions/getOtp';
import axios from 'axios';
import Spinner from '../Spinner';
import styled from 'styled-components';
import theme from '../../public/Themes';
import extensions from './extensionsdata';


import google from '../../public/assets/icons/google.svg';
import {checkEmail} from '../../services/validations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes} from '@fortawesome/free-solid-svg-icons';
import GoogleLogin from 'react-google-login';
// import FacebookLogin from 'react-facebook-login';


const useStyles = makeStyles(themes => ({
    '@global': {
      body: {
        backgroundColor: themes.palette.common.white,
      },
    },
    paper: {
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      padding: "0",


    },
    avatar: {
      backgroundColor: themes.palette.secondary.main,
    },
    form: {
      width: '90%', 
      margin: "0 auto",
    },
    submit: {
      margin: "1rem 0",
      backgroundColor: theme.colors.brandColor,
      color: "black",
      borderRadius: "2rem",
      '&:hover':{
        backgroundColor: "#F7e700"
      }
    },
    google: {
      margin: "1rem 0",
      backgroundColor: "white",
      color: "black",
      borderRadius: "2rem",

    },
    height: {
      height: "1.5rem !important",
    }
  }));
  var userDetails = {
    firstName: "",
    lastName: "",
    email: "",
}
const LogIn = (props) => {
  const mobileRef = useRef();
  let mobilevariable = ""; //store mobile number before storing in state
  let otpvariable=""; //store otp number, before storing in state(UPDATE)
  const [mobile, setMobile] = useState("+91");
  const [otpResent, setOtpResent] = useState(false);
  const classes = useStyles();
  const [extension, setExtension] = useState('India');  //store extension
  let firstname=null; //JSX for first name
  let lastname=null;//JSX for last name
  let resendotp = null;//JSX for resend otp
  let email=null;//JSX for email
  let password = null;//JSX for OTP
  let mobileInput=null; //JSX for mobile input field
  let ExtensionOptions = [];

  const url = new URL(window.location.href);

    const CountryCodeOption = styled.div`
    &:hover{
      cursor: pointer;
    }
    text-align: center;
    height: 2rem !important;
    margin: 0.5rem;
    `;

    const CountryImg = styled.img`
      height: 100%;
    `;
    const UpdatePhone = styled.p`
    padding: 0 8px;
    &:hover{
      cursor: pointer;
    }
    `;
    const ResendOtp = styled.p`
    float: right;
    &:hover{
      cursor: pointer;
    }
  `;
  
  useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
 
      }, []);

  for(const country in extensions){
        ExtensionOptions.push(
          <CountryCodeOption key={country} value={country}>
                  <CountryImg src={extensions[country].img}></CountryImg>
          </CountryCodeOption>
        )
      }
      //Change user details on key press 
  const _userDetailsOnChangeHandler = (event, target) =>{
        userDetails = {
              ...userDetails,
              [target]: event.target.value,
          }
      }
   
  //Change extension on click
  const handleExtensionChange = (event) => {
    setExtension(event.target.value); 
    };
  const checkNewUserData = () => {
    if((userDetails.firstName && userDetails.lastName && userDetails.email)){
      if(!checkEmail(userDetails.email)){
        alert("Please enter a valid email");
        return 0;
      }
      else return 1;
    }
    else{
      alert("Please fill the form.")
      return 0;
    }

  }
  //Submit OTP 
  const submitOtpHandler = (event) =>{
    event.preventDefault();
    if(props.newUser){
      const newUserValidity = checkNewUserData();
      if(newUserValidity) props.onAuth(mobile,otpvariable,userDetails.firstName+" "+userDetails.lastName, userDetails.email);
      
  
  }
  else {
      // localStorage.setItem('contact', mobile);
      props.onAuth(mobile,otpvariable, null, null);
  }
    
  }
  //Store OTP
  const handleOtpChange = (event) => {
    // setOtp(event.target.value) [ADD]
    otpvariable=event.target.value; 
  }
  //Set Mobile 
  const handleMobileChange = (event) => {
    mobilevariable=event.target.value;
    // setMobile(extensions[extension].label + event.target.value)
  }
  
  //Dispatch Action 
  const otpHandler = () => {
    setMobile(extensions[extension].label + mobilevariable ); //Store mobile in state before OTP requested
    props.onOtp(extensions[extension].label + mobilevariable);
  }
  //TEST 
  const resetOtpHandler = () => {
    const authData = {
      "username": mobile
    }
    axios.post("https://apis.tarzanway.com/user/resend/otp/", authData)
        .then(response => {
        });
        setOtpResent(true);
  }
  
 //Mobile, name, email, password, JSX
  mobileInput = <Grid item xs={9}>
  <TextField
      key="mobile"
      error={props.mobileFail ? true: false}
      helperText={props.mobileFail ? "Invalid Number" : null}
      disabled={props.otpSent ? true : false}
      variant="outlined"
      required
      fullWidth
      name="mobile"
      label="Mobile Number"
      type="mobile"
      id="mobile"
      onChange={handleMobileChange}
      className="loginform"
      inputRef={mobileRef}
    />
  </Grid>
  firstname = 
        <Grid item xs={12} sm={6}>
              <TextField
                key="fname"
                required
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                fullWidth
                id="firstName"
                label="First Name"
                onChange={event => {_userDetailsOnChangeHandler(event,'firstName')}}
                className="loginform"
              />
          </Grid>;
    lastname=<Grid item xs={12} sm={6}>
              <TextField
                    key="lname"
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={event => {_userDetailsOnChangeHandler(event,'lastName')}}
                        className="loginform"

              />
            </Grid>;
    email=<Grid item xs={12}>
              <TextField
              key="email"
                error={props.emailFail ? true : false}
                helperText={props.emailFail ? "Email Already Taken" : null}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={event => {_userDetailsOnChangeHandler(event,'email')}}
                        className="loginform"

              />
    </Grid>;
     password=<Grid item xs={12}>
      <TextField
      key="otp"
        error={props.otpFail ? true : false}
        helperText={props.otpFail ? "OTP is not valid" : null}
        variant="outlined"
        required
        fullWidth
        name="otp"
        label="Enter OTP"
        type="otp"
        id="otp"
        autoComplete="current-password"
        onChange={handleOtpChange}
                className="loginform"

      />
      </Grid>;

const _handlePhoneUpdate = () => {
      props.onResetLogin();
      mobileRef.current.focus();
}

const googleResponse = (response) => {
}
  return(
    <div className={classes.paper}>
    
      {/* <StyledCrossFontAwesomeIcon icon={faTimes} onClick={props.onhide} /> */}
      {/* <div style={{display: "grid", gridTemplateColumns: "33% 33% 33%", margin: "5vh 0"}}>
        <div style={{textAlign: "center"}}>
          <img src={icon1} style={{width: "40%", margin: "auto"}}></img>
          <p className="font-nunito" style={{margin: "1rem", textAlign: "center", fontSize: '0.75rem'}}>Fast Bookings & cancellations</p>
        </div>
        <div style={{textAlign: "center"}}>
        <img src={icon2} style={{width: "40%", margin: "auto"}}></img>
        <p className="font-nunito" style={{margin: "1rem", textAlign: "center", fontSize: '0.75rem'}}>Interact with our community</p>
        </div>
        <div style={{textAlign: "center"}}>
        <img src={icon3} style={{width: "40%", margin: "auto"}}></img>
        <p className="font-nunito" style={{margin: "1rem", textAlign: "center", fontSize: '0.75rem'}}>Exclusive offers & discounts</p>


        </div>
      </div> */}
      <form className={classes.form} noValidate >
        <Grid container spacing={2}>
          <Grid item xs={3}>
          <TextField
          className="country-code-field"
          select
          label={extension}
          fullWidth

          value={extension}
          onChange={handleExtensionChange}
          variant="outlined"
                  className="loginform"

          >
          {ExtensionOptions}
        </TextField>
          </Grid>
          {mobileInput}
          <Grid item xs={12}>
              <Typography variant="overline"
              >
              {props.otpSent && !otpResent ? "OTP HAS BEEN SENT" : null}
              {props.otpSent && otpResent ? "OTP HAS BEEN RESENT" : null}

              </Typography>
              <br></br>

          </Grid>
          {props.newUser ? firstname : null}
          {props.newUser ? lastname : null}
          {props.newUser ? email : null}
          {props.otpSent ? password : null}
          {props.otpSent ? 
            <UpdatePhone style={{textAlign: 'left', width: '100%'}}>
              <u onClick={_handlePhoneUpdate}>Update Phone</u>
              <ResendOtp onClick={resetOtpHandler} ><u>Resend Otp</u></ResendOtp>
            </UpdatePhone>        
           : null}
      </Grid>
    
          <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={otpHandler}
          style={{display: !props.otpSent ? 'initial' : 'none' }}
        >
          Get OTP
            {props.loading ? <Spinner display="inline" size={16} margin="0 0 0 0.5rem"></Spinner>: null}
        </Button>
        <div style={{display: !props.otpSent ? 'initial' : 'none' }}><p style={{textAlign: 'center', fontWeight: '300'}} className="font-nunito">Or login using social media</p></div>
        <Grid container spacing={2}>
          {/* <Grid item xs={6}>
  

        <GoogleLogin
          clientId="905616545950-uvachhjv75hejrp9plvodags7s1tqq20.apps.googleusercontent.com"
          buttonText=""
          className="google-login-button"
          onSuccess={props.onGoogleAuth}
          onFailure={googleResponse}
          render={renderProps => (
            <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.google}
                      onClick={renderProps.onClick}
                      
                    >
                      <img src={google} style={{height: '1.5rem', margin: "0 0.5rem"}}></img>
                    </Button>          )}
        />
        </Grid> */}
        <Grid item xs={12}>
     

        <GoogleLogin
          clientId="905616545950-uvachhjv75hejrp9plvodags7s1tqq20.apps.googleusercontent.com"
          buttonText=""
          className="google-login-button"
          onSuccess={props.onGoogleAuth}
          onFailure={googleResponse}
          render={renderProps => (
            <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.google}
                      onClick={renderProps.onClick}
                      
                    >
                      <img src={google} style={{height: '1.5rem', margin: "0 0.5rem"}}></img>
                    </Button>          )}
        />
        </Grid>
        {/* <Grid item xs={6}>
        <FacebookLogin
          appId= "189892422091317"
          fields="name,email,picture"
          callback={props.onFbAuth}
          className="google-login-button"
          render={renderProps => (
            <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.google}
            onClick={renderProps.onClick}
            
          >
          <img src={facebook} style={{height: '1.5rem', margin: "0 0.5rem"}}></img>
        </Button>          )}
        />
        </Grid> */}
        </Grid>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          style={{display: props.otpSent && props.token === null ?  'initial' : 'none' }}
          onClick={submitOtpHandler}
       >
          Login
          {props.loading ? <Spinner display="inline" size={16} margin="0 0 0 0.5rem"></Spinner>: null}
        </Button>
      </form>
      {/* {props.token !== null ? <Redirect to={props.authRedirectPath}></Redirect>: null} */}
    </div>
     
    );

}
const mapStateToPros = (state) => {
  return{
    otpFail : state.auth.otpFail,
    mobileFail: state.auth.mobileFail,
    otpSent: state.auth.otpSent,
    loading: state.auth.loading,
    newUser: state.auth.newUser,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial
  }
}
const mapDispatchToProps = dispatch => {
    return{
      onAuth: (mobile, password, name, email) => dispatch(authaction.auth(mobile, password, name, email)),
      onOtp: (mobile, setNewUser) => dispatch(otpaction.getotp(mobile, setNewUser)),
      onResetLogin: () => dispatch(authaction.authResetLogin()),
      onGoogleAuth: (response) => dispatch(authaction.googleAuth(response)),
      onFbAuth: (response) => dispatch(authaction.fbAuth(response))

    }
  }
export default connect(mapStateToPros,mapDispatchToProps)((LogIn));