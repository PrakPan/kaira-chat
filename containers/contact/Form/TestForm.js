import React, {useState, useRef} from 'react';

import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';

import { makeStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';
// import Heading from '../../../components/heading/Heading';
import Heading from '../../../components/newheading/heading/Index';

import QueryType from './QueryType';
import ReCAPTCHA from "react-google-recaptcha";
// import Button from '../../../components/Button';
import Button from '../../../components/ui/button/Index';
import {checkEmail} from '../../../services/validations.js';
import axios from 'axios';
// import Spinner from '../../../components/Spinner';
import SuccessModal from '../../../components/modals/Success';
 const Container1 = styled.div`
        background-color: white;
        width: 100%;
        margin: auto;
        padding: 1rem ;
        border-style: none none solid none;
        border-width: 1px;
        @media screen and (min-width: 768px){
            padding: 2rem ;
        }
    `;

 const FormContainer = styled.div`
    width: 100%;
    @media screen and (min-width: 768px){
        width: 50%;
        margin: auto;
    }
    @media (min-width: 768px) and (max-width: 1024px) {
        width: 80%;
    }
    `;
const useStyles = makeStyles((theme) => ({


  form: {
    width: '100%', // Fix IE 11 issue.
  },

}));

export default function SignUp() {
  const queries = {
    "I want to enquire about travel experiences": 'Travel Experiences',
    "I want to enquire about personalised travel": 'Personalised Travel',
    "I want to travel somewhere": 'Travel Somewhere',
    "I want to enquire about partnerships": 'Partnerships',
    "I want to join TTW": 'Join TTW',
    "I need help with something else": 'Need Help',
"I want to join as an affiliate": 'Affiliate',
"I have a complaint": 'Complaint',
"Others": "Other",
  };
    const myref=useRef();
    const [userDetails, setUserDetails] = useState({});
    const [emailFail, setEmailFail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

  const classes = useStyles();

const submitHandler = (token) => {
    if(false){
        setEmailFail(true);
    }
    else{
        setLoading(true);
        axios.post("https://suppliers.tarzanway.com/lead/contact-us/", {
            	"g-recaptcha-response": token,
	            "email": userDetails.email,
	            "first_name": userDetails.fname,
	            "last_name": userDetails.lname,
	            "phone": userDetails.mobile,
	            "query_type": queries[userDetails.type],
	            "country": userDetails.country,
	            "query_message": userDetails.message
        })
          .then(res => {
            // alert("Your message has been received. We will contact you within 24 hours.")
              setLoading(false);
              setSubmitted(true);

          }).catch(error => {
            alert("There was a problem, please refresh and try again.")
            setLoading(false);

        });
    }
}

const _changeDetailsHandler = (event, key) => {
    setUserDetails({
        ...userDetails,
        [key]: event.target.value
    })
}
    const onRecaptchaChange = (value) => {
       if(!submitted) submitHandler(value);

    }
const verifyHandler = (event) => {
    //check email first
    if(checkEmail(userDetails.email)) myref.current.execute();
    else{
        setEmailFail(true);
    }
}

  return (
      <Container1>
        <Heading align="center" aligndesktop="center" margin="1.5rem">Contact Us</Heading>
        <FormContainer>
    <Container component="main" className={classes.form}>
      <div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              { typeof window !== "undefined" ? <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={(event) => _changeDetailsHandler(event, 'fname')} 
              />: null}
            </Grid>
            <Grid item xs={12} sm={6}>
            { typeof window !== "undefined" ?<TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={(event) => _changeDetailsHandler(event, 'lname')}
              />: null}
            </Grid>
            <Grid item xs={12} sm={6}>
            { typeof window !== "undefined" ? <TextField
                variant="outlined"
                required
                fullWidth
                id="country"
                label="Country"
                name="country"
                autoComplete="country"
                onChange={(event) => _changeDetailsHandler(event, 'country')}
              />: null}
            </Grid>
             <Grid item xs={12} sm={6}>
             { typeof window !== "undefined" ?<TextField
                variant="outlined"
                required
                fullWidth
                id="mobile"
                label="Mobile"
                name="mobile"
                autoComplete="mobile"
                onChange={(event) => _changeDetailsHandler(event, 'mobile')}
              />: null}
            </Grid>
            
            <Grid item xs={12}>
            { typeof window !== "undefined" ?  <TextField
                error={emailFail}
                helperText={emailFail ? "Invalid Email" : null}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(event) => _changeDetailsHandler(event, 'email')}
              />: null}
            </Grid>
            <Grid item xs={12}>
                <QueryType _changeDetailsHandler={_changeDetailsHandler}></QueryType>
            </Grid>
            <Grid item xs={12}>
            { typeof window !== "undefined" ? <TextField
                variant="outlined"
                required
                fullWidth
                multiline
                rows={4}
                minRows={4}
                name="message"
                label="Message"
                type="message"
                id="message"
                onChange={(event) => _changeDetailsHandler(event, 'message')}
              />: null}
            </Grid>
            <Grid item xs={12}>
                {/* <div class="g-recaptcha" data-sitekey="6Lf4gqoZAAAAAAgeKAxQk5djc7DtaX-dRvUzvMs6"></div> */}
                <ReCAPTCHA
                    size="invisible"
                    sitekey="6LdcwZ8aAAAAAKzA37MqrCMV5epZ9jltfjKXQyZ_"
                    ref={myref}
                    onChange={onRecaptchaChange}
                />
            </Grid>
          </Grid>
         {/* <Button
           
            margin="1rem auto 0.5rem auto"
            padding="0.5rem 2rem"
            borderWidth="1px"
            bgColor={loading ? 'black' : 'white'}
            color={loading? 'white' : 'black'}
            onclick={() => verifyHandler()}>
            Submit
        </Button> */}
          <Button
           boxShadow
           margin="1rem auto 0.5rem auto"
           padding="0.5rem 2rem"
           borderWidth="1px"
           bgColor={loading ? 'black' : 'white'}
           color={loading? 'white' : 'black'}
           onclick={() => verifyHandler()}>
           Submit
       </Button>
        
        <div style={{width: "max-content", margin: "auto"}}>
        {/* {loading ? <Spinner size={20}></Spinner> : null} */}
        </div>
        <SuccessModal show={submitted}  hide={() => setSubmitted(false)}></SuccessModal>
      </div>

    </Container>
    </FormContainer>
    </Container1>
  );
}