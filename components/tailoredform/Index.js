import React, {useState, useRef} from "react";
import dayjs  from 'dayjs';

import styled from 'styled-components';
  import Grid from '@material-ui/core/Grid';
import Button from '../ui/button/Index';
 
  import * as ga from '../../services/ga/Index';
  import {format } from  "date-fns";

 import axiostailoredinstance from '../../services/leads/tailored';
import Spinner from '../Spinner';
//  import extensions from '../../../public/content/extensionsdata';
import { useRouter } from "next/router";
 
// import SlideOne from "./SlideOne";
import Flickity from './Flickity';

const Container = styled.div`
height: max-content;
color: black;
z-index :2;
position: relative;
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
       
    const router = useRouter();
    
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [selectedCities, setSelectedCities] = useState([]);
    const [groupType, setGroupType] = useState(null);
    
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
        // ga.event({action: 'C-Andaman-Form-initiate', params: {key : ''}})
        // console.log(selectedCities);
        setLoading(true);
        const cityids =[];
        const citynames=[];
        for(var i =0 ; i < selectedCities.length; i++){
          cityids.push(parseInt(selectedCities[i].id));
          citynames.push(selectedCities[i].name);
        }
        // console.log(citynames);
        // console.log(cityids);
        // console.log(format(valueStart,  "yyyy-MM-dd"));
        const start_date = format(valueStart,  "yyyy-MM-dd");
        const end_date =  format(valueEnd,  "yyyy-MM-dd");
        console.log(selectedPreferences);
        let data = {
            "locations": citynames,
            "experience_filters_selected": filters,
            "budget": budget_to_send,
             "city_id": cityids,
            "group_type": grouptype,
            "number_of_adults": number_of_adults,
            "number_of_children": number_of_children,
            "number_of_infants": number_of_infants,
            "start_date": start_date,
            "end_date": end_date,
          
            // "user_location": {
            //   "lat": lat,
            //   "long": long,
            // },
            
          };
  
    //      axiostailoredinstance.post('',
    //    data
    //     ).then(response => {

    //         setSubmitted(true);
    //         if(!response.data.auto_itinerary_created) {
    //             window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
              
    //              }
    //          else{
    //             ga.event({action: 'C-Andaman-Form-success', params: {key : ''}})
  
    //             setTimeout(function(){ 
                   
    //               router.push('/itinerary/'+response.data.itinerary.itinerary_id); }, 3000);
  
    //           }
    //     }).catch(err => {
    //         setLoading(false);

    //          if(err.response.data.email){
    //          }
    //     })
    }
    const [slideIndex, setSlideIndex] = useState(0);
    const _prevSlideHandler = () => {
        console.log('test')
        if(slideIndex) setSlideIndex(slideIndex-1);
    }
    const [valueStart, setValueStart] =useState((dayjs()));
    const [valueEnd, setValueEnd] =useState((dayjs()));
    const [numberOfAdults, setNumberOfAdults] = useState(2);
    const [numberOfChildren, setNumberOfChildren] = useState(0);
    const [numberOfInfants, setNumberOfInfants] = useState(0);
    const [budget, setBudget] = useState('Affordable');
    const [selectedPreferences, setSelectedPreferences]  = useState([]);
    // const [budgetLower,setBudgetLower] = useState(0);

return(
    <Container className="border center-div">
        {/* <Modal  backdrop={true} show={props.show}  size="md" centered onHide={_hideModalHandler} style={{padding: "0"}}> */}
            {/* <Modal.Body style={{padding: "1rem", minHeight: '60vh'}} className="center-div" > */}
            {!submitted? <Heading>{"Get your free travel plan!" }</Heading> : null}
            {/* <div onClick={(e) => _prevSlideHandler}>Back</div> */}
            <div>
            </div>  
            {/* <div key={index}  style={{width: '80%', margin: props.experience ? "2px 1rem" : '2px 0.5rem'}} ><div>{card}</div></div> */}

            <Flickity
            _handlePrev={_prevSlideHandler}
            slideIndex={slideIndex}
            cities={props.cities}
            selectedCities={selectedCities}
            setSelectedCities={setSelectedCities}
            valueStart={valueStart}
            valueEnd={valueEnd}
            setValueStart={setValueStart}
            setValueEnd={setValueEnd}
            setGroupType={setGroupType}
            numberOfAdults={numberOfAdults}
         setNumberOfAdults={setNumberOfAdults}
         numberOfChildren={numberOfChildren} 
         setNumberOfChildren={setNumberOfChildren}
         numberOfInfants={numberOfInfants}
         setNumberOfInfants={setNumberOfInfants}
         setBudget ={setBudget}
         selectedPreferences={selectedPreferences} 
         setSelectedPreferences={setSelectedPreferences}
        >
                           
        </Flickity>
        {slideIndex !==2 ? <Button margin="1rem 0" borderRadius="10px" borderWidth="0" bgColor="#f7e700" width="100%" onclick={() => setSlideIndex(slideIndex+1)}>
            Continue
            </Button> : <Button margin="1rem 0" borderRadius="10px" borderWidth="0" bgColor="#f7e700" width="100%" onclick={_submitDataHandler}>
            Submit
            </Button> }
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