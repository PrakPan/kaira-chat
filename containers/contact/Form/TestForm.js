import React, { useState, useRef } from "react";
import styled from "styled-components";
import Heading from "../../../components/newheading/heading/Index";
import ReCAPTCHA from "react-google-recaptcha";
import Button from "../../../components/ui/button/Index";
import { checkEmail } from "../../../services/validations.js";
import axios from "axios";
import SuccessModal from "../../../components/modals/Success";
import FloatingInput from "../../../components/ui/input/FloatingInput";
import DropDown from "../../../components/ui/DropDown";
const Container1 = styled.div`
  background-color: white;
  width: 100%;
  margin: auto;
  padding: 1rem;
  border-style: none none solid none;
  border-width: 1px;
  @media screen and (min-width: 768px) {
    padding: 2rem;
  }
`;

const FormContainer = styled.form`
  width: 100%;
  display: grid;
  grid-row-gap: 0.5rem;
  @media screen and (min-width: 768px) {
    width: 50%;
    margin: auto;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    width: 80%;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-row-gap: 0.5rem;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
`;

export default function SignUp() {
  const DropDownQueries = [
    {
      text: "I want to enquire about travel experiences",
      value: "Travel Experiences",
    },
    {
      text: "I want to enquire about personalised travel",
      value: "Personalised Travel",
    },
    { text: "I want to travel somewhere", value: "Travel Somewhere" },
    { text: "I want to enquire about partnerships", value: "Partnerships" },
    { text: "I want to join TTW", value: "Join TTW" },
    { text: "I need help with something else", value: "Need Help" },
    { text: "I want to join as an affiliate", value: "Affiliate" },
    { text: "I have a complaint", value: "Complaint" },
    { text: "Others", value: "Other" },
  ];

  const myref = useRef();
  const [userDetails, setUserDetails] = useState({
    fname: "",
    lname: "",
    country: "",
    mobile: "",
    message: "",
    email: "",
    query_type : "",
  });
  const [emailFail, setEmailFail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checkEmpty, setCheckEmpty] = useState(null);
  const submitHandler = (token) => {
    if (false) {
      setEmailFail(true);
    } else {
      setLoading(true);
      axios
        .post("https://suppliers.tarzanway.com/lead/contact-us/", {
          "g-recaptcha-response": token,
          email: userDetails.email,
          first_name: userDetails.fname,
          last_name: userDetails.lname,
          phone: userDetails.mobile,
          query_type: userDetails.query_type,
          country: userDetails.country,
          query_message: userDetails.message,
        })
        .then((res) => {
          setLoading(false);
          setSubmitted(true);
        })
        .catch((error) => {
          alert("There was a problem, please refresh and try again.");
          setLoading(false);
        });
    }
  };
  const _changeDetailsHandler = (event, key) => {
    setUserDetails({
      ...userDetails,
      [key]: event.target.value,
    });
  };
  const onRecaptchaChange = (value) => {
    if (!submitted) submitHandler(value);
  };
  const verifyHandler = () => {
    // check email first
    for (let key in userDetails) {
      if (userDetails[key] === "") return setCheckEmpty(key);
    }
    if (checkEmail(userDetails.email)) myref.current.execute();
    else {
      setEmailFail(true);
    }
  };

  return (
    <Container1>
      <Heading align="center" aligndesktop="center" margin="1.5rem">
        Contact Us
      </Heading>
      <FormContainer>
        <GridContainer>
          {typeof window !== "undefined" ? (
            <FloatingInput
              height='60px'
              error={checkEmpty == "fname"}
              helperText={"Please Enter Your First Name"}
              autoComplete="fname"
              name="firstName"
              variant="outlined"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoFocus
              onChange={(event) => _changeDetailsHandler(event, "fname")}
            />
          ) : null}

          {typeof window !== "undefined" ? (
            <FloatingInput
              height='60px'
              error={checkEmpty == "lname"}
              helperText={"Please Enter Your Last Name"}
              variant="outlined"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="lname"
              onChange={(event) => _changeDetailsHandler(event, "lname")}
            />
          ) : null}
        </GridContainer>
        <GridContainer>
          {typeof window !== "undefined" ? (
            <FloatingInput
              height='60px'
              error={checkEmpty == "country"}
              helperText={"Please Enter Your Country"}
              variant="outlined"
              required
              fullWidth
              id="country"
              label="Country"
              name="country"
              autoComplete="country"
              onChange={(event) => _changeDetailsHandler(event, "country")}
            />
          ) : null}
          {typeof window !== "undefined" ? (
            <FloatingInput
              height='60px'
              error={checkEmpty == "mobile"}
              helperText={"Please Enter Your Mobile Number"}
              variant="outlined"
              required
              fullWidth
              id="mobile"
              label="Mobile"
              name="mobile"
              autoComplete="mobile"
              onChange={(event) => _changeDetailsHandler(event, "mobile")}
            />
          ) : null}
        </GridContainer>
        {typeof window !== "undefined" ? (
          <FloatingInput
              height='60px'
            error={emailFail}
            helperText={emailFail ? "Invalid Email" : null}
            variant="outlined"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={(event) => _changeDetailsHandler(event, "email")}
          />
        ) : null}
        {typeof window !== "undefined" &&
        <div>
<DropDown 
        onChange={(e)=>_changeDetailsHandler(e, "query_type")} 
        label="Topic of interest" 
        labelStyle={{paddingLeft : '20px'}} 
        height='60px'
        error={checkEmpty == "query_type"}
        helperText={"Please Select Your Interest"}
        >{DropDownQueries.map((e,i)=><option key={i} value={e.value}>{e.text}</option>)}</DropDown>
        </div>
}
        {typeof window !== "undefined" ? (
          <FloatingInput
              height='60px'
            error={checkEmpty == "message"}
            helperText={"Please Enter Message"}
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
            onChange={(event) => _changeDetailsHandler(event, "message")}
          />
        ) : null}
        {/* <div class="g-recaptcha" data-sitekey="6Lf4gqoZAAAAAAgeKAxQk5djc7DtaX-dRvUzvMs6"></div> */}
        <ReCAPTCHA
          size="invisible"
          sitekey="6LdcwZ8aAAAAAKzA37MqrCMV5epZ9jltfjKXQyZ_"
          ref={myref}
          onChange={onRecaptchaChange}
        />
        <Button
          boxShadow
          margin="1rem auto 0.5rem auto"
          padding="0.5rem 2rem"
          borderWidth="1px"
          bgColor={loading ? "black" : "white"}
          color={loading ? "white" : "black"}
          type="submit"
          onclick={verifyHandler}
        >
          Submit
        </Button>

        <div style={{ width: "max-content", margin: "auto" }}>
          {/* {loading ? <Spinner size={20}></Spinner> : null} */}
        </div>
        <SuccessModal
          show={submitted}
          hide={() => setSubmitted(false)}
        ></SuccessModal>
      </FormContainer>
    </Container1>
  );
}
