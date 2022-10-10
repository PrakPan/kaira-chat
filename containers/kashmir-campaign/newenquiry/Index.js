import React, {useState} from "react";
import dayjs, { Dayjs } from 'dayjs';

import styled from 'styled-components';
import {Modal} from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '../../../components/ui/button/Index';
// import DateTime from './DateTime';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TypeAdult from './TypeAdult';
import TypeChild from './TypeChildren';
import TypeInfant from './TypeInfant';
import * as ga from '../../../services/ga/Index';

 import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getIndianPrice } from "../../../services/getIndianPrice";
import axiostailoredinstance from '../../../services/leads/tailored';
import Spinner from '../../../components/Spinner';
// import Pax from '../../personaliseform/grouptype/Index';
import extensions from '../../../public/content/extensionsdata';
import { useRouter } from "next/router";
const Container = styled.div`
height: max-content;
padding: 1rem 1rem 1rem 1rem;
 background-color: white;
 margin: 0.5rem;
border-radius: 10px !important;
min-height: 60vh;
@media screen and (min-width: 768px){
    margin: 0;
}

`
 const Heading = styled.p`
    font-size: 1.5rem;
    margin: 0rem 0 1rem 0;
    text-align: center;
    font-weight: 800;
    color: black;
    line-height: 1;

`;
const Subheading=styled.p`
font-size: 1.5rem;
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


    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null)
    const [adults, setAdults] = useState("2");
    const [children, setChildren] = useState("0");
    const [infants, setInfants] = useState("0");

    const [phone, setPhone]= useState(null);
    const[email, setEmail]= useState(null);
    const [type, setType] = useState(null);
    const [extension, setExtension] = useState('India');  //store extension
    const handleExtensionChangeOption = (country) => {
        setExtension(country); 
      };
    // const [] = useState(null);
    const [valueStart, setValueStart] =useState((dayjs()));
    const [valueEnd, setValueEnd] =useState((dayjs()));


    const _handleMobileChange=(event)=> {
        if(event.target.value === '1') null;
    }
    const router = useRouter();
    
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);

    const [phoneError, setPhoneError] = useState(false);
    // const [companyError, setCompanyError] = useState(false);
    const [emailError, setEmailError] = useState(false);
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

        setPhone(null);
        setEmail(null);
        setType(null);
    }
    const _hideModalHandler = () => {
        if(submitted) resetForm();
        props.onhide();
    }
     const _submitDataHandler = () => {
        ga.event({action: 'C-Andaman-Form-initiate', params: {key : ''}})

        setLoading(true);
        let data = {
            "locations": ["Kashmir"],
            // "experience_filters_selected": filters,
            "budget": "Affordable",
            // "extra_data": extra_data,
            "city_id": [152],
            // "group_type": grouptype,
            "number_of_adults": parseInt(adults),
            "number_of_children": parseInt(children),
            "number_of_infants": parseInt(infants),
            "start_date": valueStart.toISOString().slice(0, 10),
            "end_date": valueEnd.toISOString().slice(0, 10),
            "user_email": email,
            "user_phone": extensions[extension].label+phone,
            "user_first_name": firstName,
            "user_last_name": lastName
            // "user_location": {
            //   "lat": lat,
            //   "long": long,
            // },
            
          };
  
         axiostailoredinstance.post('',
       data
        ).then(response => {

            setSubmitted(true);
            if(!response.data.auto_itinerary_created) {
                window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
              
                 }
             else{
                ga.event({action: 'C-Andaman-Form-success', params: {key : ''}})
  
                setTimeout(function(){ 
                   
                  router.push('/itinerary/'+response.data.itinerary.itinerary_id); }, 3000);
  
              }
        }).catch(err => {
            setLoading(false);

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
            // err.json().then(json => {
            //     getPaymentHandler();
            //     setTransferBookings(json.bookings)
            //     // setFlightBookings(json.bookings);
            //   })
           
        })
    }
return(
    <Container className="border center-div">
        {/* <Modal  backdrop={true} show={props.show}  size="md" centered onHide={_hideModalHandler} style={{padding: "0"}}> */}
            {/* <Modal.Body style={{padding: "1rem", minHeight: '60vh'}} className="center-div" > */}
            {!submitted? <Heading>{"Get your free travel plan!" }</Heading> : null}
            <div>
            </div>
            
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
                     <TypeAdult setAdults={setAdults} >

                    </TypeAdult>
                </Grid>
                <Grid item xs={4} >
                     <TypeChild setChildren={setChildren}>

                    </TypeChild>
                </Grid>
                <Grid item xs={4}>
                     <TypeInfant setInfants={setInfants}>

                    </TypeInfant>
                </Grid>
                <Grid item xs={6}>
               
    <LocalizationProvider dateAdapter={AdapterDateFns}>
  <DatePicker
    label="Start Date"
    value={valueStart}
    onChange={(newValue) => {
      setValueStart(newValue);
    }}
    renderInput={(params) => <TextField {...params} fullWidth />}
  />
</LocalizationProvider>
                 </Grid>
                 <Grid item xs={6}>
               
               <LocalizationProvider dateAdapter={AdapterDateFns}>
             <DatePicker
               label="End Date"
               value={valueEnd}
               onChange={(newValue) => {
                 setValueEnd(newValue);
               }}
               renderInput={(params) => <TextField {...params} fullWidth />}
             />
           </LocalizationProvider>
                            </Grid>
                <Grid item xs={12}>
                    {!loading ? 
                    <Button onclickparam={null} onclick={_submitDataHandler} margin="0rem 0 0 0"  width="100%" borderRadius="5px" borderWidth="0" bgColor="#f7e700" hoverBgColor="black" color="black" hoverColor="white">View Plan</Button>
                        : 
                        <Button onclickparam={null} onclick={() => null} margin="0rem 0 0 0"  width="100%" borderRadius="5px" borderWidth="0" bgColor="#f7e700" hoverBgColor="black" color="black" hoverColor="white">
                            Preparing Plan
                            <Spinner display="inline-block" size={16} margin="0 0 0 0.5rem" color={loading ? 'white' : 'black'}></Spinner>
                        </Button>

                    }
                    </Grid>
            </Grid> 
           
            {/* </Modal.Body> */}
      {/* </Modal> */}
      </Container>
);
}

export default Enquiry;