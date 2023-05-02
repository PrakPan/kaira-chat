import React, { useState, useEffect } from 'react';
// import Datepicker from '../Datepicker';

import { TextField } from '@mui/material';
import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Container } from '@mui/material';
import extensions from './extensionsdata';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
// import Heading from '../../../../components/heading/Heading';
import Heading from '../../../../components/newheading/heading/Index';
import Spinner from '../../../../components/Spinner';
// import SharedButton from '../../../../components/Button'
import SharedButton from '../../../../components/ui/button/Index';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import media from '../../../../components/media';
import axiostailoredinstance from '../../../../services/leads/tailored';
import { connect } from 'react-redux';
import Login from '../../../../components/userauth/LogInModal';
import { getFirstName } from '../../../../services/getfirstname';
const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  form: {
    width: '100%', // Fix IE 11 issue.
  },

  box: {
    borderRadius: '5px',
    borderWidth: '1px',
    borderColor: '#E4e4e4',
    borderStyle: 'solid',
    height: 'max-content',
    padding: '0.5rem',
  },
}));
var userDetails = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
};
const CountryCodeOption = styled.div`
  &:hover {
    cursor: pointer;
  }
  text-align: center;
  height: 2rem !important;
  margin: 0.5rem;
`;
const CountryImg = styled.img`
  height: 100%;
`;

const Button = styled.div`
  background-color: #f7e700;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border-width: 2px;
  &:hover {
    cursor: pointer;
    background-color: black;
    color: white;
  }
`;
const LoginContainer = styled.div`
  border-radius: 5px;
  @media screen and (min-width: 768px) {
    width: 35%;
    margin: auto;
    border-radius: 5px;
    padding: 0.5rem;
  }
`;
const Subheading = styled.p`
  font-weight: 100;
  text-align: center;
  @media screen and (min-width: 768px) {
    font-size: 1.25rem;
  }
`;
const SignIn = (props) => {
  let isPageWide = media('(min-width: 768px)');

  const [date, setDate] = useState(new Date());
  const classes = useStyles();
  const [extension, setExtension] = useState('India'); //store extension
  const [fnameFail, setfnameFail] = useState(false);
  const [lnameFail, setlnameFail] = useState(false);
  const [phoneFail, setPhoneFail] = useState(false);
  const [emailFail, setEmailFail] = useState(false);
  const [loading, setLoading] = useState(false);
  let ExtensionOptions = [];
  const handleDateChange = (date) => {
    setDate(date);
    // _calculateServiceFee();
  };
  for (const country in extensions) {
    ExtensionOptions.push(
      <CountryCodeOption key={country} value={country}>
        <CountryImg src={extensions[country].img}></CountryImg>
      </CountryCodeOption>
    );
  }
  const handleExtensionChange = (event) => {
    setExtension(event.target.value);
  };
  const _userDetailsOnChangeHandler = (event, target) => {
    userDetails = {
      ...userDetails,
      [target]: event.target.value,
    };
  };
  const _checkDetailsHandler = () => {};
  const _submitHandler = () => {
    setLoading(true);
    const data = {
      locations: props.experience,
      extra_data: userDetails.message,
    };

    axiostailoredinstance
      .post('', data, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((response) => {
        window.location.href =
          'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
        setLoading(false);
        // window.scrollTo(0,0);
      })
      .catch((error) => {
        setLoading(false);
        alert('There was a problem, please login and try again.');
      });
  };

  const _handleWhatsAppRedirect = () => {};
  const [name, setName] = useState();
  useEffect(() => {
    if (props.token) setName(getFirstName(props.name));
  }, [props.name]);

  let message =
    'Hey TTW! I was going through your travel experience %27' +
    props.experience +
    '%27 and would like to ask a few questions regarding the same, could you help?';
  if (isPageWide) {
    if (props.token && props.phone && props.phone !== 'null')
      return (
        <Container component="main" className={classes.box} maxWidth="xs">
          {!isPageWide && props._showBookingMobileHandler ? (
            <FontAwesomeIcon
              icon={faTimes}
              onClick={props._showBookingMobileHandler}
              style={{ float: 'right', marginBottom: '0.5rem' }}
            ></FontAwesomeIcon>
          ) : null}
          <Heading bold margin="0 auto 1.5rem auto" noline align="center">
            {'Hi ' + name + ' !'}
          </Heading>
          <Subheading className="font-nunito">How can we help you?</Subheading>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows="4"
                className="experience-enquiry-input"
                name="message"
                placeholder="Mention anything you would like to add"
                type="message"
                id="message"
                onChange={(event) =>
                  _userDetailsOnChangeHandler(event, 'message')
                }
              />
            </Grid>
            <Grid item xs={12}>
              {/* <Button  hoverBgColor="black"  onClick={() => _submitHandler()} width="100%" bgColor="#F7e700" hoverColor="black" borderRadius="5px" borderWidth="0px" margin="0" hoverBgColor="#f7e700">
                    Continue{loading ? <Spinner display="inline" size={16} margin="0 0 0 0.5rem"></Spinner> : null}
                </Button> */}
              <Button
                boxShadow
                hoverBgColor="black"
                onClick={() => _submitHandler()}
                width="100%"
                bgColor="#F7e700"
                hoverColor="black"
                borderRadius="5px"
                borderWidth="0px"
                margin="0"
              >
                Continue
                {loading ? (
                  <Spinner
                    display="inline"
                    size={16}
                    margin="0 0 0 0.5rem"
                  ></Spinner>
                ) : null}
              </Button>
            </Grid>
            <Grid item xs={12}>
              {/* <SharedButton onclick={()=> window.location.href="https://wa.me/919625509382?text="+message} hoverColor="black" hoverBgColor="#128C7E"  onclickparam={null} width="100%" bgColor="white" borderRadius="5px" borderWidth="1px" borderColor="#e4e4e4"   margin="0" >
        <FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
         Connect on WhatsApp</SharedButton> */}
              <SharedButton
                boxShadow
                onclick={() =>
                  (window.location.href =
                    'https://wa.me/919625509382?text=' + message)
                }
                hoverColor="black"
                hoverBgColor="#128C7E"
                onclickparam={null}
                width="100%"
                bgColor="white"
                borderRadius="5px"
                borderWidth="1px"
                borderColor="#e4e4e4"
                margin="0"
              >
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  style={{ marginRight: '0.5rem' }}
                />
                Connect on WhatsApp
              </SharedButton>
            </Grid>
          </Grid>
        </Container>
      );
    // else if(props.token) return null;
    else
      return (
        <LoginContainer
          className="border-thin"
          style={{ width: props.bookings ? '100%' : '35%' }}
        >
          <Login noclose></Login>
          {/* <SharedButton onclick={()=> window.location.href="https://wa.me/919625509382?text="+message} hoverColor="black" hoverBgColor="#128C7E"  onclickparam={null}  width="90%" bgColor="white" borderRadius="2rem" borderWidth="1px" borderColor="#e4e4e4"   margin="auto" >
        <FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
         Connect on WhatsApp</SharedButton> */}
          <SharedButton
            boxShadow
            onclick={() =>
              (window.location.href =
                'https://wa.me/919625509382?text=' + message)
            }
            hoverColor="black"
            hoverBgColor="#128C7E"
            onclickparam={null}
            width="90%"
            bgColor="white"
            borderRadius="2rem"
            borderWidth="1px"
            borderColor="#e4e4e4"
            margin="auto"
          >
            <FontAwesomeIcon
              icon={faWhatsapp}
              style={{ marginRight: '0.5rem' }}
            />
            Connect on WhatsApp
          </SharedButton>
        </LoginContainer>
      );
  } else {
    if (props.token && props.phone && props.phone !== 'null') {
      return (
        <Container
          component="main"
          className={classes.box}
          maxWidth="xs"
          style={{ margin: '1rem 0', padding: '1rem' }}
        >
          {!isPageWide && props._showBookingMobileHandler ? (
            <FontAwesomeIcon
              icon={faTimes}
              onClick={props._showBookingMobileHandler}
              style={{ float: 'right', marginBottom: '0.5rem' }}
            ></FontAwesomeIcon>
          ) : null}
          <Heading bold margin="0 auto 1.5rem auto" noline align="center">
            {'Hi ' + name + ' !'}
          </Heading>
          <Subheading className="font-nunito">How can we help you?</Subheading>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows="4"
                className="experience-enquiry-input"
                name="message"
                placeholder="Mention anything you would like to add"
                type="message"
                id="message"
                onChange={(event) =>
                  _userDetailsOnChangeHandler(event, 'message')
                }
              />
            </Grid>
            <Grid item xs={12}>
              {/* <Button  hoverBgColor="black"  onClick={() => _submitHandler()} width="100%" bgColor="#F7e700" hoverColor="black" borderRadius="5px" borderWidth="0px" margin="0" hoverBgColor="#f7e700">
                  Continue{loading ? <Spinner display="inline" size={16} margin="0 0 0 0.5rem"></Spinner> : null}
              </Button> */}
              <Button
                boxShadow
                hoverBgColor="black"
                onClick={() => _submitHandler()}
                width="100%"
                bgColor="#F7e700"
                hoverColor="black"
                borderRadius="5px"
                borderWidth="0px"
                margin="0"
              >
                Continue
                {loading ? (
                  <Spinner
                    display="inline"
                    size={16}
                    margin="0 0 0 0.5rem"
                  ></Spinner>
                ) : null}
              </Button>
            </Grid>
            <Grid item xs={12}>
              {/* <SharedButton onclick={()=> window.location.href="https://wa.me/919625509382?text="+message} hoverColor="black" hoverBgColor="#128C7E"  onclickparam={null} width="100%" bgColor="white" borderRadius="5px" borderWidth="1px" borderColor="#e4e4e4"   margin="0" >
      <FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
       Connect on WhatsApp</SharedButton> */}
              <SharedButton
                boxShadow
                onclick={() =>
                  (window.location.href =
                    'https://wa.me/919625509382?text=' + message)
                }
                hoverColor="black"
                hoverBgColor="#128C7E"
                onclickparam={null}
                width="100%"
                bgColor="white"
                borderRadius="5px"
                borderWidth="1px"
                borderColor="#e4e4e4"
                margin="0"
              >
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  style={{ marginRight: '0.5rem' }}
                />
                Connect on WhatsApp
              </SharedButton>
            </Grid>
          </Grid>
        </Container>
      );
    } else
      return (
        <LoginContainer
          className="border-thin"
          style={{ margin: '1rem 0', padding: '1rem' }}
        >
          <Login noclose></Login>
          {/* <SharedButton onclick={()=> window.location.href="https://wa.me/919625509382?text="+message} hoverColor="black" hoverBgColor="#128C7E"  onclickparam={null}  width="90%" bgColor="white" borderRadius="2rem" borderWidth="1px" borderColor="#e4e4e4"   margin="auto" >
          <FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
           Connect on WhatsApp</SharedButton> */}
          <SharedButton
            boxShadow
            onclick={() =>
              (window.location.href =
                'https://wa.me/919625509382?text=' + message)
            }
            hoverColor="black"
            hoverBgColor="#128C7E"
            onclickparam={null}
            width="90%"
            bgColor="white"
            borderRadius="2rem"
            borderWidth="1px"
            borderColor="#e4e4e4"
            margin="auto"
          >
            <FontAwesomeIcon
              icon={faWhatsapp}
              style={{ marginRight: '0.5rem' }}
            />
            Connect on WhatsApp
          </SharedButton>
        </LoginContainer>
      );
  }
};

const mapStateToPros = (state) => {
  return {
    showLogin: state.auth.showLogin,
    token: state.auth.token,
    name: state.auth.name,
    phone: state.auth.phone,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    authShowLogin: () => dispatch(authaction.authShowLogin()),
    authCloseLogin: () => dispatch(authaction.authCloseLogin()),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(SignIn);
