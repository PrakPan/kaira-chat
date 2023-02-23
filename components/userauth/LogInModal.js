import React, {useState, useEffect, Fragment, useRef} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
// import { Redirect } from 'react-router-dom'
import {connect} from 'react-redux';
import * as authaction from '../../store/actions/auth';
import * as otpaction from '../../store/actions/getOtp';
import axios from 'axios';
import Spinner from '../Spinner';
import styled from 'styled-components';
import extensions from '../../public/content/extensionsdata';
import icon1 from '../../public/assets/icons/login/booking.png';
import icon2 from '../../public/assets/icons/login/community.png';
import icon3 from '../../public/assets/icons/login/offer.png';
import Link from 'next/link';
import google from '../../public/assets/icons/google.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes} from '@fortawesome/free-solid-svg-icons';
import GoogleLogin from 'react-google-login';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
const useStyles = makeStyles(themes => ({
    '@global': {
      body: {
        backgroundColor: 'white'
      },
    },
    paper: {
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      padding: "0",
      position: 'relative',
      color: 'black'


    },
  
    form: {
      width: '95%', 
      margin: "0 auto",
    },
    submit: {
      margin: "1rem 0",
      backgroundColor: '#f7e700 !important',
      textTransform: 'none !important',
      color: "black !important",
      borderRadius: "2rem !important",
      '&:hover':{
        backgroundColor: "#F7e700 !important"
      }
    }, 
    updatephone: {
      margin: "2rem 0 2rem 1rem !important",
      backgroundColor: '#f7e700 !important',
      textTransform: 'none !important',
      color: "black !important",
      borderRadius: "2rem !important",
      '&:hover':{
        backgroundColor: "#F7e700 !important"
      }
    },
    google: {
      margin: "1rem 0  !important",
      backgroundColor: "white !important",
      color: "black !important",
      borderRadius: "2rem !important", 
       '&:hover':{
        backgroundColor: "#e4e4e4 !important"
      }

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
    const StyledCrossFontAwesomeIcon = styled(FontAwesomeIcon)`
    position: absolute;
    right: 0;
    top: 0;
    margin: 1rem;
    font-size: 1.5rem;

    @media screen and (min-width: 768px){ 
     
    }
 
  `;


  const CountryCodeOption = styled.div`
  &:hover{
    cursor: pointer;
  }
  text-align: center;
  height: 2rem !important;
  margin: 0.5rem;
  `;


const LogIn = (props) => {
  const mobileRef = useRef();
  let mobilevariable = ""; //store mobile number before storing in state

  let otpvariable=""; //store otp number, before storing in state(UPDATE)
  const [mobile, setMobile] = useState("+91");
  const [otpResent, setOtpResent] = useState(false);
  const [whatsapp, setWhatsapp] = useState(true);
  const classes = useStyles();
  const [extension, setExtension] = useState('India');  //store extension
  let firstname=null; //JSX for first name
  let lastname=null;//JSX for last name
   let email=null;//JSX for email
  let password = null;//JSX for OTP
  let mobileInput=null; //JSX for mobile input field
  let ExtensionOptions = [];
 
    
  useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
      }, []);


      useEffect(() => {
        if((props.token  && props.phone && props.name ) && (props.token  && props.name && props.phone!== 'null' ) && (props.token  && props.name && props.phone!== null )) props.authCloseLogin();

      }, [props.name, props.phone, props.token]);

      const handleExtensionChangeOption = (country) => {
        setExtension(country); 
      };
  for(const country in extensions){
        ExtensionOptions.push(
          <CountryCodeOption key={country} value={country} onClick={() => handleExtensionChangeOption(country)}>
                  <CountryImg src={extensions[country].img}  onClick={() => handleExtensionChangeOption(country)}></CountryImg>
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
    const handleMobileBlur = (event) => {
      setMobile(event.target.value);
     }
  const checkNewUserData = () => {

    return 1;
  }

  //Submit OTP 
  const submitOtpHandler = (event) =>{
     event.preventDefault();
    if(props.newUser ){
      const newUserValidity = checkNewUserData();
      if(newUserValidity) props.onAuth(extensions[extension].label+mobile,otpvariable,userDetails.firstName+" "+userDetails.lastName, userDetails.email, whatsapp);
  }
else if(( props.otpSent && !props.name  )){
  props.onAuth(extensions[extension].label+mobile,otpvariable,userDetails.firstName+" "+userDetails.lastName, null, whatsapp);
}
else if((props.otpSent && !props.name && !props.email)){
  props.onAuth(extensions[extension].label+mobile,otpvariable,userDetails.firstName+" "+userDetails.lastName, userDetails.email, whatsapp);

}
else if(props.otpSent &&  !props.email){
  props.onAuth(extensions[extension].label+mobile,otpvariable,null, userDetails.email, whatsapp);

}
  else {
      props.onAuth(extensions[extension].label+mobile,otpvariable, null, null, whatsapp);
  }
    
  }
  //Store OTP
  const handleOtpChange = (event) => {
    otpvariable=event.target.value; 
  }
  //Set Mobile 
  const handleMobileChange = (event) => {
    mobilevariable=event.target.value;
  }
  
  //Dispatch Action 
  const otpHandler = () => {
    props.onOtp(extensions[extension].label+mobile);
  }
  //TEST 
  const resetOtpHandler = () => {
    const authData = {
      "username": extensions[extension].label+mobile
    }
    axios.post("https://dev.apis.tarzanway.com/user/resend/otp/", authData)
        .then(response => {
        });
        setOtpResent(true);
  }
  //Update phone
  const _updatePhoneHandler = () => {
    props.onUpdate({'phone': extensions[extension].label + mobile})
  }
 //Mobile, name, email, password, JSX
  mobileInput = <Grid item xs={9}>
  <TextField
      key="mobile"
      error={props.mobileFail ? true: false}
      helperText={props.mobileFail ? props.mobilefailmessage : null}
      disabled={props.otpSent ? true : false}
      variant="outlined"
      required
      fullWidth
      name="mobile"
      label="Mobile Number"
      type="mobile"
      id="mobile"
      onChange={handleMobileChange}
      onBlur={handleMobileBlur}
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
                helperText={props.emailFail ? props.emailfailmessage : null}
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
// if(!props.loadingsocial)
  return(
    <div className={classes.paper}>
      {!props.noheading ? <h1 style={{textAlign: "center", margin: '2rem 1rem', fontWeight: '700'}} className="font-opensans">
      {props.loginmessage ? props.loginmessage : 'Log In'}
      </h1> : null}
      {!props.noclose && !props.hideloginclose ? <StyledCrossFontAwesomeIcon icon={faTimes} onClick={props.onhide} /> : null}
      {props.noicons || (props.token && !props.phone ) || ( props.token && props.phone === 'null' )  ?  null : <div style={{display: "grid", gridTemplateColumns: "33% 33% 33%", margin: "5vh 0"}}>
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
      </div>}
      {(props.token && !props.phone ) || ( props.token && props.phone === 'null' ) ? <p style={{margin: '0 1rem 4rem 1rem', fontWeight: '100'}} className="font-opensans text-center">This is where your experience captain can reach you to personalize your plan.</p> : null}
      {(props.token && !props.phone ) || ( props.token && props.phone === 'null' ) ? 
        <form className={classes.form} noValidate ><Grid container spacing={props.nospacing ? 0 : 2}>

       <Grid item xs={3}>
          <TextField
          select
          label={extension}
          fullWidth

          value={extension}
          onChange={handleExtensionChange}
          variant="outlined"
                  className="loginform country-code-field"

          >
          {ExtensionOptions}
        </TextField>
        </Grid>
        <Grid item xs={9}>
  <TextField
      key="mobile"
      error={props.mobileFail ? true: false}
      helperText={props.mobileFail ? props.mobilefailmessage : null}
      // disabled={props.otpSent ? true : false}
      variant="outlined"
      required
      fullWidth
      name="mobile"
      label="Mobile Number"
      type="mobile"
      id="mobile"
      onChange={handleMobileChange}
      onBlur={handleMobileBlur}

      className="loginform"
      inputRef={mobileRef}
      error={props.mobileFail ? true: false}

    />
  </Grid>
  <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.updatephone}
          onClick={_updatePhoneHandler}
          error={props.mobileFail ? true: false}

        >
          Complete Signup
            {props.loading ? <Spinner display="inline" size={16} margin="0 0 0 0.5rem"></Spinner>: null}
        </Button>
      </Grid> </form>
      : <form className={classes.form} noValidate >
        <Grid container spacing={props.nospacing ? 1 : 2}>
          <Grid item xs={3}>
          <TextField
          select
          label={extension}
          fullWidth

          value={extension}
          onChange={handleExtensionChange}
          variant="outlined"
                  className="loginform country-code-field"

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
   
          {props.newUser || ( props.otpSent && !props.name  ) ? firstname : null}
          {props.newUser  || ( props.otpSent && !props.name ) ? lastname : null}
          {props.newUser || ( props.otpSent && !props.email ) ? email : null}
          {props.otpSent ? password : null}
   
          {props.otpSent ? 
            <UpdatePhone style={{textAlign: 'left', width: '100%'}}>
              <u onClick={_handlePhoneUpdate}>Update Phone</u>
              <ResendOtp onClick={resetOtpHandler} ><u>Resend OTP</u></ResendOtp>
            </UpdatePhone>        
           : null}
      </Grid>
     
          <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={otpHandler}
          style={{display: !props.otpSent ? 'initial' : 'none' , margin: props.nospacing ? '0' :  '0.5rem 0'}}
        >
          Get OTP
            {props.loading ? <Spinner display="inline" size={16} margin="0 0 0 0.5rem"></Spinner>: null}
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          style={{display: props.otpSent && props.token === null ?  'initial' : 'none', margin: props.nospacing ? '0' : '0.5rem 0' }}
          onClick={submitOtpHandler}
       >
          Login
          {props.loading ? <Spinner display="inline" size={16} margin="0 0 0 0.5rem"></Spinner>: null}
        </Button>
        {props.newUser || ( props.otpSent && !props.name  ) ? <Grid container spacing={props.nospacing ? 1 : 2}>
          <Grid item xs={12}>
          <FormGroup>
  <FormControlLabel control={<Checkbox size='small' defaultChecked  value={whatsapp} onChange={() => setWhatsapp(!whatsapp)}  />} label={<div className='font-opensans' style={{fontWeight: '300', fontSize: '0.75rem'}}>Receive booking updates via WhatsApp?</div>} className='font-opensans' />
</FormGroup>
          </Grid>
        
        </Grid> : null}
        <div><hr></hr></div>
      
        <Grid container spacing={0}>
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
                      style={{textTransform: 'none', margin: props.nospacing ? '0' : '0.5rem 0'}}
                    >
                      <img src={google} style={{height: '1.5rem', margin: "0 0.5rem"}}></img>
                      <p style={{margin: '0', fontWeight: '300'}} className="font-opensans">Continue with Google</p>
                      {/* {props.loadingsocial ? <Spinner display="inline" size={16} margin="0 0 0 0.5rem"></Spinner>: null} */}
                    </Button>          )}
        />
        </Grid>
        {/* <Grid item xs={6}>
        <FacebookLogin
          appId= "189892422091317"
          fields="name,email,picture"
          callback={props.onFbAuth}
          className="google-login-button border"
          textButton = "&nbsp;&nbsp;"
            icon={          <img src={facebook} style={{height: '1.5rem'}}></img>
          }
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
       <div className="text-center font-nuntio" style={{fontSize: '0.75rem', fontWeight: '300', margin: '1rem 0'}}>By signing up you are agreeing with our <Link href="/privacy-policy"  style={{textDecoration: 'none'}} passHref><a target="_blank">T&Cs and privacy policy </a></Link></div>
      </form>}
      {props.loadingsocial ?<div style={{position: 'absolute', height: '100%', width: '100%', top: '0', zIndex: '2', backgroundColor: 'white'}} className="center-div"><Spinner></Spinner></div>: null}
      {/* {props.token !== null ? <Redirect to={props.authRedirectPath}></Redirect>: null} */}
    </div>
     
    );
    // else return <Spinner></Spinner>

}
const mapStateToPros = (state) => {
  return{
    otpFail : state.auth.otpFail,
    mobileFail: state.auth.mobileFail,
    mobilefailmessage: state.auth.mobilefailmessage,
    otpSent: state.auth.otpSent,
    loading: state.auth.loading,
    socialloading: state.auth.socialloading,
    newUser: state.auth.newUser,
    name: state.auth.name,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    phone: state.auth.phone,
    email: state.auth.email,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose
  }
}
const mapDispatchToProps = dispatch => {
    return{
      onAuth: (mobile, password, name, email, whatsapp) => dispatch(authaction.auth(mobile, password, name, email, whatsapp )),
      onOtp: (mobile, setNewUser) => dispatch(otpaction.getotp(mobile, setNewUser)),
      onResetLogin: () => dispatch(authaction.authResetLogin()),
      onGoogleAuth: (response) => dispatch(authaction.googleAuth(response)),
      onFbAuth: (response) => dispatch(authaction.fbAuth(response)),
      onUpdate: (response) =>dispatch(authaction.changeUserDetails(response)),
      authCloseLogin: () => dispatch(authaction.authCloseLogin()),
    }
  }
export default connect(mapStateToPros,mapDispatchToProps)((LogIn));