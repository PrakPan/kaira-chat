import React, {useState, useRef} from "react";
import dayjs, { Dayjs } from 'dayjs';

import styled from 'styled-components';
  import Grid from '@material-ui/core/Grid';
import Button from '../ui/button/Index';
 
  import * as ga from '../../services/ga/Index';

 import axiostailoredinstance from '../../services/leads/tailored';
import Spinner from '../Spinner';
//  import extensions from '../../../public/content/extensionsdata';
import { useRouter } from "next/router";
// import SlideOne from "./SlideOne";
import Flickity from './Flickity';

const Container = styled.div`
height: max-content;
padding: 1rem 1rem 1rem 1rem;
 background-color: white;
 width: 100%;
 margin: 0.5rem;
border-radius: 10px !important;
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
const Card = styled.div`
width: 80%;
margin: 2px 1rem;
 
`;
const Enquiry = (props) => {
    const flickity_ref=useRef(null);
   
    const [calendarOpen, setCalendarOpen] = useState(false);

 
     

    // const [phone, setPhone]= useState(null);
    const[email, setEmail]= useState(null);
    const [type, setType] = useState(null);
    const [extension, setExtension] = useState('India');  //store extension
    const handleExtensionChangeOption = (country) => {
        setExtension(country); 
      };
    // const [] = useState(null);
    const [valueStart, setValueStart] =useState((dayjs()));
    const [valueEnd, setValueEnd] =useState((dayjs()));


   
    const router = useRouter();
    
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // const [firstNameError, setFirstNameError] = useState(false);
    // const [lastNameError, setLastNameError] = useState(false);

    // const [phoneError, setPhoneError] = useState(false);
    // const [companyError, setCompanyError] = useState(false);
    // const [emailError, setEmailError] = useState(false);
    // let ExtensionOptions = [];
    // for(const country in extensions){
    //     ExtensionOptions.push(
    //       <CountryCodeOption key={country} value={country} onClick={() => handleExtensionChangeOption(country)}>
    //               <CountryImg src={extensions[country].img}  onClick={() => handleExtensionChangeOption(country)}></CountryImg>
    //       </CountryCodeOption>
    //     )
    //   }

 
     
     const _submitDataHandler = () => {
        ga.event({action: 'C-Andaman-Form-initiate', params: {key : ''}})

        setLoading(true);
        let data = {
            "locations": ["Andaman"],
            // "experience_filters_selected": filters,
            "budget": "Affordable",
            // "extra_data": extra_data,
            "city_id": [278],
            // "group_type": grouptype,
            "number_of_adults": parseInt(adults),
            "number_of_children": parseInt(children),
            "number_of_infants": parseInt(infants),
            "start_date": valueStart.toISOString().slice(0, 10),
            "end_date": valueEnd.toISOString().slice(0, 10),
            "user_email": email,
            // "user_phone": extensions[extension].label+phone,
            // "user_first_name": firstName,
            // "user_last_name": lastName
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
                // setEmailError(err.response.data.email)
            }
            if(err.response.data.phone){
                // setPhoneError(err.response.data.phone)

            }
            if(err.response.data.service){
                // setTypeError( err.response.data.service[0])

            }
            if(err.response.data.user_first_name){
                // setFirstNameError(err.response.data.user_first_name)
            }
            if(err.response.data.user_last_name){
                // setLastNameError(err.response.data.user_last_name)
            }
            if(err.response.data.organization_name){
                // setError()
                // setCompanyError(err.response.data.organization_name[0])

            }
            // err.json().then(json => {
            //     getPaymentHandler();
            //     setTransferBookings(json.bookings)
            //     // setFlightBookings(json.bookings);
            //   })
           
        })
    }
    const [slideIndex, setSlideIndex] = useState(0);
return(
    <Container className="border center-div">
        {/* <Modal  backdrop={true} show={props.show}  size="md" centered onHide={_hideModalHandler} style={{padding: "0"}}> */}
            {/* <Modal.Body style={{padding: "1rem", minHeight: '60vh'}} className="center-div" > */}
            {!submitted? <Heading>{"Get your free travel plan!" }</Heading> : null}
            <div>
            </div>  
            {/* <div key={index}  style={{width: '80%', margin: props.experience ? "2px 1rem" : '2px 0.5rem'}} ><div>{card}</div></div> */}

            <Flickity
            slideIndex={slideIndex}
        >
                           
        </Flickity>
        <Button margin="1rem 0" borderRadius="10px" borderWidth="0" bgColor="#f7e700" width="100%" onclick={() => setSlideIndex(slideIndex+1)}>
            Continue
            </Button>
            <Grid container spacing={2}>
           
 
    
                {/* <Grid item xs={12}>
                    {!loading ? 
                    <Button onclickparam={null} onclick={_submitDataHandler} margin="0rem 0 0 0"  width="100%" borderRadius="5px" borderWidth="0" bgColor="#f7e700" hoverBgColor="black" color="black" hoverColor="white">Continue</Button>
                        : 
                        <Button onclickparam={null} onclick={() => null} margin="0rem 0 0 0"  width="100%" borderRadius="5px" borderWidth="0" bgColor="#f7e700" hoverBgColor="black" color="black" hoverColor="white">
                            Preparing Plan
                            <Spinner display="inline-block" size={16} margin="0 0 0 0.5rem" color={loading ? 'white' : 'black'}></Spinner>
                        </Button>

                    }
                    </Grid> */}
            </Grid> 
           
            {/* </Modal.Body> */}
      {/* </Modal> */}
      </Container>
);
}

export default Enquiry;