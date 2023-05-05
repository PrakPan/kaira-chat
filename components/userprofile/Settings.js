import React, { useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import * as authaction from '../../store/actions/auth';

import { TextField } from '@mui/material';
import { Grid } from '@mui/material';
import { Typography } from '@mui/material';
// import Button from '../../components/Button';
import Button from '../../components/ui/button/Index';
const Container = styled.div``;

const Subheading = styled.p`
  font-size: 1rem;
  font-weight: 600;
`;
const Heading = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0;
`;
const Settings = (props) => {
  var userDetails = {
    name: '',
  };
  const _userDetailsOnChangeHandler = (event, target) => {
    userDetails = {
      ...userDetails,
      [target]: event.target.value,
    };
  };
  const changeDetailsHandler = (field) => {
    let payload = {};
    payload[field] = userDetails[field];
    props.changeUserDetails1(payload);
  };
  return (
    <Container>
      <Heading className="font-lexend">Account Settings</Heading>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Subheading className="font-nunito">Name</Subheading>
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            placeholder={props.name}
            onChange={(event) => {
              _userDetailsOnChangeHandler(event, 'name');
            }}
          />
          {/* <Button onclick={() => changeDetailsHandler("name")} borderRadius="2rem" borderWidth="1px" margin="1rem auto">Change Data</Button> */}
          <Button
            boxShadow
            onclick={() => changeDetailsHandler('name')}
            borderRadius="2rem"
            borderWidth="1px"
            margin="1rem auto"
          >
            Change Data
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Subheading className="font-lexend">Email</Subheading>
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            placeholder={props.email}
            onChange={(event) => {
              _userDetailsOnChangeHandler(event, 'email');
            }}
          />
          {/* <Button onclick={() => changeDetailsHandler("email")} borderRadius="2rem" borderWidth="1px" margin="1rem auto">Change Data</Button> */}
          <Button
            boxShadow
            onclick={() => changeDetailsHandler('name')}
            borderRadius="2rem"
            borderWidth="1px"
            margin="1rem auto"
          >
            Change Data
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
const mapStateToPros = (state) => {
  return {
    name: state.auth.name,
    email: state.auth.email,
    phone: state.auth.phone,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    changeUserDetails1: (userDetails) =>
      dispatch(authaction.changeUserDetails(userDetails)),
  };
};
export default connect(mapStateToPros, mapDispatchToProps)(Settings);
