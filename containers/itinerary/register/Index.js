import React, { useState } from 'react';
import styled from 'styled-components';
import PersonalDetails from './PersonalDetails';
import axios from 'axios';

const Container = styled.div`
  padding: 1rem;
  min-height: 40vh;
`;
const DescriptionContainer = styled.div`
  padding: 1rem;
  margin: 1rem auto;
  width: 90%;
  background: hsl(0, 0%, 93%);
  @media screen and (min-width: 768px) {
    width: 60%;
  }
`;
const Description = styled.p`
  margin: 0;
  font-weight: 300;
  line-height: 1.75;
`;
const Register = (props) => {
  const [details, setDetails] = useState({
    fname: null,
    lname: null,
    email: null,
    mobile: null,
    emergencycontact: null,
  });

  const _handleFnameChange = (event) => {
    setDetails({ ...details, fname: event.target.value });
  };
  const _handleLnameChange = (event) => {
    setDetails({ ...details, lname: event.target.value });
  };
  const _handleEmailChange = (event) => {
    setDetails({ ...details, email: event.target.value });
  };
  const _handleMobileChange = (event) => {
    setDetails({ ...details, mobile: event.target.value });
  };
  const _handleEmergencyContactChange = (event) => {
    setDetails({ ...details, emergencycontact: event.target.value });
  };
  const _submitHandler = () => {
    axios
      .post('https://suppliers.tarzanway.com/campaign/response/', {
        first_name: details.fname,
        last_name: details.lname,
        email: details.email,
        phone: details.mobile,
        campaign: 'Rotaract - Holi Experience (Jodhpur)',
        form_response: {
          emergency_contact_number: details.emergencycontact,
        },
      })
      .then((res) => {
        props.history.push('/thank-you');
      })
      .catch((error) => {
        alert('There was a problem, please refresh and try again.');
      });
  };
  return (
    <Container id="Register">
      <DescriptionContainer>
        <Description className="font-nunito">
          Hey there! Before you start your travel experience we need to make
          sure that you are well aware of the itinerary you'll be following and
          read the terms and conditions that make you a responsible traveler.
          Please fill the really short form below and read the terms carefully.
          Happy Journey!
        </Description>
      </DescriptionContainer>
      <PersonalDetails
        _handleFnameChange={_handleFnameChange}
        _handleLnameChange={_handleLnameChange}
        _handleEmailChange={_handleEmailChange}
        _handleMobileChange={_handleMobileChange}
        _handleEmergencyContactChange={_handleEmergencyContactChange}
        details={details}
        _submitHandler={_submitHandler}
      ></PersonalDetails>
    </Container>
  );
};

export default Register;
