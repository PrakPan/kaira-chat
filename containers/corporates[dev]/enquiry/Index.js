import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '../../../components/ui/button/Index';
import DateTime from './DateTime';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Types from './Type';
import axiosbdinstance from '../../../services/leads/bd';
import Spinner from '../../../components/Spinner';

const Heading = styled.p`
  font-size: 2.5rem;
  margin: 1rem 0 2rem 0;
  text-align: center;
  font-weight: 800;
`;

const Question = styled.p`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Enquiry = (props) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [name, setName] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [type, setType] = useState(null);
  // const [] = useState(null);
  const [value, setValue] = useState(dayjs());

  const _handleMobileChange = (event) => {
    if (event.target.value === '1') null;
  };

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [personError, setPersonError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [companyError, setCompanyError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const resetForm = () => {
    setLoading(false);
    setSubmitted(false);
    setPersonError(false);
    setPhoneError(false);
    setEmailError(false);
    setName(null);
    setCompanyName(null);
    setPhone(null);
    setEmail(null);
    setType(null);
  };
  const _hideModalHandler = () => {
    if (submitted) resetForm();
    props.onhide();
  };
  const _submitDataHandler = () => {
    setLoading(true);
    axiosbdinstance
      .post('/', {
        organization_name: companyName,
        phone: phone,
        person_name: name,
        email: email,
        service: 'wiejdn',
      })
      .then((res) => {
        setLoading(false);

        setSubmitted(true);
      })
      .catch((err) => {
        setLoading(false);

        if (err.response.data.email) {
          setEmailError(err.response.data.email[0]);
        }
        if (err.response.data.phone) {
          setPhoneError(err.response.data.phone[0]);
        }
        if (err.response.data.service) {
          // setTypeError( err.response.data.service[0])
        }
        if (err.response.data.person_name) {
          setPersonError(err.response.data.person_name[0]);
        }
        if (err.response.data.organization_name) {
          // setError()
          setCompanyError(err.response.data.organization_name[0]);
        }
        // err.json().then(json => {
        //     getPaymentHandler();
        //     setTransferBookings(json.bookings)
        //     // setFlightBookings(json.bookings);
        //   })
      });
  };
  return (
    <div>
      <Modal
        backdrop={true}
        show={props.show}
        size="md"
        centered
        onHide={_hideModalHandler}
        style={{ padding: "0" }}
      >
        <Modal.Body
          style={{ padding: "1rem", minHeight: "60vh" }}
          className="center-div"
        >
          <Heading>
            {submitted ? "Thank you for reaching out" : "Let's Connect"}
          </Heading>
          <div></div>
          {!submitted ? (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  onFocus={() => setPersonError(false)}
                  error={personError ? true : false}
                  helperText={personError ? personError : null}
                  label="Your Name"
                  placeholder="Enter your name"
                  key="name"
                  variant="outlined"
                  required
                  fullWidth
                  name="name"
                  type="name"
                  id="name"
                  onChange={(event) => setName(event.target.value)}
                  onBlur={null}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  onFocus={() => setCompanyError(false)}
                  error={companyError ? true : false}
                  helperText={companyError ? companyError : null}
                  placeholder="Enter company name"
                  key="company_name"
                  variant="outlined"
                  required
                  fullWidth
                  name="company_name"
                  label="Company Name"
                  type="name"
                  id="company_name"
                  onChange={(event) => setCompanyName(event.target.value)}
                  onBlur={null}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  onFocus={() => setPhoneError(false)}
                  error={phoneError ? true : false}
                  helperText={phoneError ? phoneError : null}
                  type="text"
                  placeholder="99999 99999"
                  key="phone"
                  variant="outlined"
                  required
                  fullWidth
                  name="phone"
                  label="Phone Number"
                  id="phone"
                  onChange={(event) => setPhone(event.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  onFocus={() => setEmailError(false)}
                  error={emailError ? true : false}
                  helperText={emailError ? emailError : null}
                  placeholder="info@thetarzanway.com"
                  key="email"
                  variant="outlined"
                  required
                  fullWidth
                  name="email"
                  label="Email ID"
                  type="email"
                  id="email"
                  onChange={(event) => setEmail(event.target.value)}
                  onBlur={null}
                />
              </Grid>
              <Grid item xs={12}>
                {/* <Question>Anual Budget</Question> */}
                <Types></Types>
              </Grid>
              <Grid item xs={12}>
                {/* <Question>When should we call you?</Question> */}

                {/* <DateTime></DateTime> */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    renderInput={(props) => (
                      <TextField
                        fullWidth
                        {...props}
                        onClick={() => setCalendarOpen(true)}
                      />
                    )}
                    label="When should we call you?"
                    value={value}
                    open={calendarOpen}
                    // calendarPosition="top-right"
                    onOpen={() => setCalendarOpen(true)}
                    onClose={() => setCalendarOpen(false)}
                    fullWidth
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
            
                  <Button
                    onclickparam={null}
                    onclick={_submitDataHandler}
                    margin="1rem 0 0 0"
                    width="100%"
                    borderRadius="5px"
                    borderWidth="0"
                    bgColor="#f7e700"
                    hoverBgColor="black"
                    color="black"
                    hoverColor="white"
                    loading={loading}
                  >
                    Schedule Callback
                  </Button>
              </Grid>
            </Grid>
          ) : (
            <div>{/* <BsFillCheckCircleFill></BsFillCheckCircleFill> */}</div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Enquiry;
