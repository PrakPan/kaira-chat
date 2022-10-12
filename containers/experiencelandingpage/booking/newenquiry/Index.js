import React, {useState} from "react";
import dayjs, { Dayjs } from 'dayjs';

import styled from 'styled-components';
import {Modal} from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '../../../../components/ui/button/Index';
// import DateTime from './DateTime';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TypeAdult from './TypeAdult';
import TypeChild from './TypeChildren';
import TypeInfant from './TypeInfant';

import axiosbdinstance from '../../../../services/leads/bd';
import Spinner from '../../../../components/Spinner'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getIndianPrice } from "../../../../services/getIndianPrice";
import axiosexperienceinstance from '../../../../services/leads/experience';
import extensions from '../../../../public/content/extensionsdata';
import ImageLoader from "../../../../components/ImageLoader";
import * as ga from '../../../../services/ga/Index';
const Container = styled.div`
height: max-content;
padding: 1rem 1rem 1rem 1rem;
margin-top: 1rem;
position: sticky;
top: 11vh;
border-radius: 10px !important;
min-height: 60vh;
@media screen and (min-width: 768px){
    min-height: 60vh;

}

`
 const Heading = styled.p`
    font-size: 1.5rem;
    margin: 0rem 0 1rem 0;
    text-align: center;
    font-weight: 800;

`;
const Subheading=styled.p`
font-size: 1rem;
    margin: 0rem 0 1rem 0;
    text-align: center;
    font-weight: 100;
`;

const Question = styled.p`
    font-size: 1rem;
    font-weight: 600;
    margin-bottom : 0.5rem;
`;
const Cost = styled.p`
font-size: 1.5rem;
text-align: right;
font-weight: 800;
flex-grow: 1;
margin: 0;
&:after{
    content: 'per person';
    display: block;
    font-size: 1rem;
    font-weight: 300;

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

  const CountryImg = styled.img`
  height: 100%;
`;
const Enquiry = (props) => {
    const [calendarOpen, setCalendarOpen] = useState(false);

    const [name, setName] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null)
    const [adults, setAdults] = useState("2");
    const [children, setChildren] = useState("0");
    const [infants, setInfants] = useState("0");
    const [companyName, setCompanyName] = useState(null);
    const [phone, setPhone]= useState(null);
    const[email, setEmail]= useState(null);
    const [type, setType] = useState(null);
    // const [] = useState(null);
    const [value, setValue] =useState((dayjs()));

    const _handleMobileChange=(event)=> {
        if(event.target.value === '1') null;
    }
    
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);

    const [phoneError, setPhoneError] = useState(false);
    // const [companyError, setCompanyError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [extension, setExtension] = useState('India');
    const handleExtensionChangeOption = (country) => {
        setExtension(country); 
      };
    let ExtensionOptions = [];
    for(const country in extensions){
        ExtensionOptions.push(
          <CountryCodeOption key={country} value={country} onClick={() => handleExtensionChangeOption(country)}>
                  <CountryImg src={extensions[country].img}  onClick={() => handleExtensionChangeOption(country)}></CountryImg>
          </CountryCodeOption>
        )
      }

    const handleExtensionChange = (event) => {
        setExtension(event.target.value); 
   };

    const resetForm = () => {
        setLoading(false);
        setSubmitted(false);
        setFirstNameError(false);
        setLastNameError(false);

        setPhoneError(false);
        setEmailError(false);
        setFirstName(null);
        setLastName(null);

        setCompanyName(null);
        setPhone(null);
        setEmail(null);
        setType(null);
    }
    const _hideModalHandler = () => {
        if(submitted) resetForm();
        props.onhide();
    }
     const _submitDataHandler = () => {
        setLoading(true);
        ga.event({
            action: "EXPEnq-initiate",
            params : {
              'search_text': null,
            }
          });
         axiosexperienceinstance.post('/',
         {
             "itinerary_id": props.itinerary_id,
             "experience_id": props.experience_id,
             "experience_name": props.experience,
             "start_date": value.toISOString().slice(0, 10),
             "number_of_adults": parseInt(adults),
             "number_of_children": parseInt(children),
             "number_of_infants": parseInt(infants),
             "group_type": null,
             "user_first_name": firstName,
             "user_last_name": lastName,
             "user_phone": extensions[extension].label+phone,
             "user_email": email,
             "source": "Experience Page"
         }
        ).then(res => {
             setLoading(false);
             ga.event({
                action: "EXPEnq-success",
                params : {
                  'search_text': null,
                }
              });
            setSubmitted(true);
        }).catch(err => {
            setLoading(false);
            ga.event({
                action: "EXPEnq-failure",
                params : {
                  'search_text': null,
                }
              });
             if(err.response.data.email){
                setEmailError(err.response.data.email)
            }
            if(err.response.data.phone){
                setPhoneError(err.response.data.phone)

            }
            if(err.response.data.service){
                // setTypeError( err.response.data.service[0])

            }
            if(err.response.data.user_first_name){
                setFirstNameError(err.response.data.user_first_name)
            }
            if(err.response.data.user_last_name){
                setLastNameError(err.response.data.user_last_name)
            }
            if(err.response.data.organization_name){
                // setError()
                setCompanyError(err.response.data.organization_name[0])

            }
           
           
        })
    }
return(
    <Container className="border center-div">
        {/* <Modal  backdrop={true} show={props.show}  size="md" centered onHide={_hideModalHandler} style={{padding: "0"}}> */}
            {/* <Modal.Body style={{padding: "1rem", minHeight: '60vh'}} className="center-div" > */}
            {/* <Heading>{submitted ? "Thank you for reaching out" : "Book Now" }</Heading> */}
            <div>
            </div>
            {!submitted ? 
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField onFocus={() => setFirstNameError(false)} error={firstNameError ? true : false } helperText={firstNameError ? firstNameError : null} label="First Name" placeholder="Enter First name" key="fname"  variant="outlined" required fullWidth name="fname" type="name" id="fname"   onChange={(event) => setFirstName(event.target.value) } onBlur={null}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField onFocus={() => setLastNameError(false)} error={lastNameError ? true : false } helperText={lastNameError? lastNameError : null}  placeholder="Enter Last name" key="last_name"  variant="outlined" required fullWidth name="last_name" label="Last Name" type="name" id="last_name" onChange={(event) => setLastName(event.target.value)} onBlur={null}/>
                </Grid>
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
                    <TextField onFocus={() => setPhoneError(false)} error={phoneError ? true : false } helperText={phoneError ? phoneError : null} type="text" placeholder="99999 99999" key="phone"  variant="outlined" required fullWidth name="phone" label="Phone Number" id="phone" onChange={(event) => setPhone(event.target.value)} />
                </Grid>  
                <Grid item xs={12}>
                    <TextField onFocus={() => setEmailError(false)} error={emailError ? true : false } helperText={emailError ? emailError : null} type="text" placeholder="info@thetarzanway.com" key="email"  variant="outlined" required fullWidth name="email" label="Email" id="email" onChange={(event) => setEmail(event.target.value)} />
                </Grid>  
                <Grid item xs={4}>
                     <TypeAdult setAdults={setAdults}>

                    </TypeAdult>
                </Grid>
                <Grid item xs={4}>
                     <TypeChild setChildren={setChildren}>

                    </TypeChild>
                </Grid>
                <Grid item xs={4}>
                     <TypeInfant setInfants={setInfants}>

                    </TypeInfant>
                </Grid>
                <Grid item xs={12}>
                    {/* <Question>When should we call you?</Question> */}
                
                    {/* <DateTime></DateTime> */}
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        renderInput={(props) => <TextField   fullWidth {...props} onClick={() => setCalendarOpen(true)} />}
        label="When do you wish to start?"
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
    </LocalizationProvider> */}
    <LocalizationProvider dateAdapter={AdapterDateFns}>
  <DatePicker
    label="Start Date"
    value={value}
    onChange={(newValue) => {
      setValue(newValue);
    }}
    renderInput={(params) => <TextField {...params} fullWidth />}
  />
</LocalizationProvider>
                 </Grid>
                 {props.starting_price ? <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                    <div style={{alignItems: 'center', display: 'flex', paddingLeft: '8px', fontWeight: '600'}} className="font-opensans">Experience Cost</div>
                 <Cost className="font-opensans">{"₹ "+getIndianPrice(Math.round(props.starting_price/100))+" /-"}</Cost>
                 </div> : null}
                <Grid item xs={12}>
                    {!loading ? 
                    <Button onclickparam={null} onclick={_submitDataHandler} margin="0rem 0 0 0"  width="100%" borderRadius="5px" borderWidth="0" bgColor="#f7e700" hoverBgColor="black" color="black" hoverColor="white">Enquire Now</Button>
                        : 
                        <Button onclickparam={null} onclick={() => null} margin="1rem 0 0 0"  width="100%" borderRadius="5px" borderWidth="0" bgColor="#f7e700" hoverBgColor="black" color="black" hoverColor="white">
                            <Spinner display="inline-block" size={16} margin="0"></Spinner>
                        </Button>

                    }
                    </Grid>
            </Grid> : 
            <div>
                {/* <Cost>Rs 1000/-</Cost> */}
                <ImageLoader url="media/illustrations/undraw_happy_news_re_tsbd.svg" width="50%" widthmobile="50%"></ImageLoader>
                <Heading className="font-opensans">
                    We've received your request to book this experience
                </Heading>
                <Subheading className="font-opensans">
                Our travel experts will get in touch with you in the next 2 hours to complete your plan                </Subheading>
                {/* <BsFillCheckCircleFill></BsFillCheckCircleFill> */}
            </div>
            }
            {/* </Modal.Body> */}
      {/* </Modal> */}
      </Container>
);
}

export default Enquiry;