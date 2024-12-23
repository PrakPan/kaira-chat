import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import Modal from "../../../components/ui/Modal";
import FloatingInput from "../../../components/ui/input/FloatingInput";
import { RxCross2 } from "react-icons/rx";
import TextField from "@mui/material/TextField";
import Button from "../../../components/ui/button/Index";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Types from "./Type";
import axiosbdinstance from "../../../services/leads/bd";
import media from "../../../components/media";
import ScheduleCall from "./ScheduleCall";

const Heading = styled.p`
  font-size: 1.35rem;
  margin: 1rem 0;
  text-align: left;
  font-weight: 600;
  color: black;
  line-height: normal;

  @media screen and (min-width: 815px) {
    font-size: 1.5rem;
    margin: 1rem 0;

    height: 1.8rem;
    overflow: hidden;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.7rem;
`;

const CloseIcon = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: right;
  border-bottom: 1px solid #0000004a;
  padding-block: 1rem;
  justify-content: flex-end;
`;

const Enquiry = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [name, setName] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [type, setType] = useState(null);
  const [value, setValue] = useState(dayjs());
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
      .post("/", {
        organization_name: companyName,
        phone: phone,
        person_name: name,
        email: email,
        service: "wiejdn",
        datetime: value.format("DD/MM/YYYY, HH:mm:ss"),
        type: type || "",
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

        if (err.response.data.person_name) {
          setPersonError(err.response.data.person_name[0]);
        }

        if (err.response.data.organization_name) {
          setCompanyError(err.response.data.organization_name[0]);
        }
      });
  };

  return (
    <div>
      <Modal
        overflow={"visible"}
        backdrop={true}
        show={props.show}
        size="md"
        centered
        onHide={_hideModalHandler}
        style={
          isPageWide
            ? {
                padding: "0 18px 18px 18px",
                width: "27rem",
                borderRadius: "1rem",
              }
            : {
                padding: "0px 18px 18px 18px",
                width: "95%",
                borderRadius: "1rem",
              }
        }
        zIndex={1298}
      >
        <CloseIcon>
          <RxCross2
            style={{
              fontSize: "1.75rem",
              textAlign: "right",
              cursor: "pointer",
            }}
            onClick={_hideModalHandler}
          />
        </CloseIcon>

        {submitted ? (
          <div className="mt-3 text-lg md:text-xl font-medium md:font-semibold">
            We have got your details and someone from our team will reach out to
            you regarding the next steps
          </div>
        ) : (
          <Heading>Let's Connect</Heading>
        )}

        {!submitted ? (
          <>
            <GridContainer>
              <FloatingInput
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
                fontSize={"0.9rem"}
              />

              <FloatingInput
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
                fontSize={"0.9rem"}
              />
            </GridContainer>

            <GridContainer>
              <FloatingInput
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
                fontSize={"0.9rem"}
              />

              <FloatingInput
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
                fontSize={"0.9rem"}
              />
            </GridContainer>

            <div style={{ marginBottom: "1.2rem" }}>
              <Types queryType={type} setQueryType={setType}></Types>
            </div>

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
                onOpen={() => setCalendarOpen(true)}
                onClose={() => setCalendarOpen(false)}
                fullWidth
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                fontSize={"0.9rem"}
              />
            </LocalizationProvider>

            <Button
              onclickparam={null}
              onclick={_submitDataHandler}
              fontSize="1rem"
              width={!isPageWide ? "auto" : "100%"}
              padding="0.5rem 2rem"
              fontWeight="500"
              margin="2rem 0 0 0"
              borderRadius="5px"
              borderWidth="1px"
              bgColor="#f7e700"
              loading={loading}
            >
              Schedule Callback
            </Button>
          </>
        ) : (
          <div></div>
        )}
      </Modal>
    </div>
  );
};

export default Enquiry;

export const ScheduleCallModal = ({ show, onhide }) => {
  const ref = useRef(null);

  const handleClose = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      onhide();
    }
  };

  if (show) {
    return (
      <div
        onClick={(e) => handleClose(e)}
        className="fixed inset-0 z-[1999] bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div className={`w-full md:w-[50%]`}>
          <ScheduleCall modalRef={ref} />
        </div>
      </div>
    );
  }
  return null;
};
