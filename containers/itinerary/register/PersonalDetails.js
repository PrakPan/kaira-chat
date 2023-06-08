import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link
        style={{ textDecoration: 'none' }}
        color="inherit"
        href="https://material-ui.com/"
      >
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#F7e700',
    color: 'black',
    fontFamily: 'Open Sans',
    fontWeight: '600',
  },
}));

export default function SignIn(props) {
  const classes = useStyles();
  const [termsAccepted, setTermsAccepted] = useState(false);
  // const [details, setDetails] = useState({
  //     fname: null,
  //     lname: null,
  //     email: null,
  //     mobile: null,
  // })

  const _handleTermsChange = () => {
    setTermsAccepted(!termsAccepted);
  };
  // const _handleFnameChange = (event) => {
  //     setDetails({...details, fname: event.target.value})
  // }
  // const _handleLnameChange = (event) => {
  //     setDetails({...details, lname: event.target.value})
  // }
  // const _handleEmailChange = (event) => {
  //     setDetails({...details, email: event.target.value})
  // }
  // const _handleMobileChange = (event) => {
  //     setDetails({...details, mobile: event.target.value})
  // }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="fname"
            label="First Name"
            type="fname"
            id="fname"
            autoComplete="firstname"
            value={props.details.fname}
            onChange={props._handleFnameChange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="lname"
            label="Last Name"
            type="lname"
            id="lname"
            autoComplete="lastname"
            value={props.details.lname}
            onChange={props._handleLnameChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={props.details.email}
            onChange={props._handleEmailChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="mobile"
            label="Mobile"
            name="mobile"
            autoComplete="mobile"
            value={props.details.mobile}
            onChange={props._handleMobileChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="emergencycontact"
            label="Emergency Contact Number"
            name="emergencycontact"
            autoComplete="emergencycontact"
            value={props.details.emergencycontact}
            onChange={props._handleEmergencyContactChange}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <div
            style={{ display: 'grid', gridTemplateColumns: 'max-content auto' }}
          >
            <Checkbox
              value="remember"
              color="primary"
              checked={termsAccepted}
              onChange={_handleTermsChange}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '1rem',
              }}
              className="font-lexend"
            >
              <p style={{ margin: '0' }}>
                I agree to the{' '}
                <a
                  style={{ color: 'blue', textDecoration: 'underline' }}
                  href="https://drive.google.com/file/d/1TKbGccatSPfmZRee0ybwYGmvSK12eY2M/view?usp=sharing"
                  target="_blank"
                >
                  {' '}
                  terms & conditions
                </a>
              </p>
            </div>
          </div>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!termsAccepted}
            onClick={props._submitHandler}
          >
            Register
          </Button>
        </form>
      </div>
    </Container>
  );
}
