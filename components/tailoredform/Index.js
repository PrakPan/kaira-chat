import React, {useState, useEffect} from "react";
import dayjs  from 'dayjs';

import styled , {keyframes}from 'styled-components';
  import Grid from '@material-ui/core/Grid';
import Button from '../ui/button/Index';
 
  import * as ga from '../../services/ga/Index';
  import {format } from  "date-fns";
import media from '../media';

 import axiostailoredinstance from '../../services/leads/tailored';
import Spinner from '../Spinner';
//  import extensions from '../../../public/content/extensionsdata';
import { useRouter } from "next/router";
import {connect} from 'react-redux';
import {TbArrowBack} from 'react-icons/tb';

// import SlideOne from "./SlideOne";
import Flickity from './Flickity';
import { fadeIn } from 'react-animations'

const fadeInAnimation = keyframes`${fadeIn}`;
const Container = styled.div`
height: max-content;
color: black;
z-index :2;
position: relative;
  background-color: white;
 width: 100%;
 border: none !important;

 @media screen and (min-width: 768px){
    margin: 0;
    border-radius: 8px !important;

    min-height: 400px;
}

`
 const Heading = styled.p`
    font-size: 1.5rem;
    margin: 0rem 0 0rem 0;
    text-align: center;
    font-weight: 800;
    color: black;
    line-height: normal;

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
const BlackContainer = styled.div`
  background-color: rgba(0,0,0,0.4);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100vw;
  display: none;
  height: 100vh;
  animation: 0.5s ${fadeInAnimation};
  @media screen and (min-width: 768px){
    display: initial;
  }

`;
const Enquiry = (props) => {
 
    const router = useRouter();
    
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [selectedCities, setSelectedCities] = useState([]);
    const [groupType, setGroupType] = useState(null);
    const [startingLocation, setStartingLocation ] = useState(false);
    
  
     
     const _submitDataHandler = () => {
         const value_start = new Date(valueStart);
        const value_end = new Date(valueEnd);
        setLoading(true);
        let cityids =[];
        let citynames=[];
        // let starting_location = null;
        

        for(var i =0 ; i < selectedCities.length; i++){
          cityids.push(parseInt(selectedCities[i].id));
          citynames.push(selectedCities[i].name);
        }
        
        const start_date = format(value_start,  "yyyy-MM-dd");
        const end_date =  format(value_end,  "yyyy-MM-dd");

        let number_of_adults = 2, number_of_children=0, number_of_infants=0;
        if(groupType === 'Solo'){
            number_of_adults = 1;
        }
        else if(groupType === 'Couple'){
            number_of_adults = 2;
        }
        else{
            number_of_adults=numberOfAdults;
            number_of_children=numberOfChildren;
            number_of_infants=numberOfInfants;
        }
        // console.log(selectedPreferences);
        let data = {
            "locations": citynames,
            "experience_filters_selected": selectedPreferences,
            "budget": budget,
             "city_id": cityids,
            "group_type": groupType,
            "number_of_adults": number_of_adults,
            "number_of_children": number_of_children,
            "number_of_infants": number_of_infants,
            "start_date": start_date,
            "end_date": end_date,
          
            "user_location": {
                "place_id": startingLocation ? startingLocation.place_id  :  "ChIJLbZ-NFv9DDkRzk0gTkm3wlI"
            }
            
          };
          // if(startingLocation)
        //   console.log(data)
          setLoading(true);
         axiostailoredinstance.post('',
       data, {headers: {
        'Authorization': `Bearer ${props.token}`
        }}
        ).then(response => {
            setSubmitted(true);
            if(!response.data.auto_itinerary_created) {
                window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
              
                 }
             else{
                // ga.event({action: 'C-Andaman-Form-success', params: {key : ''}})
  
                setTimeout(function(){ 
                   
                  router.push('/itinerary/'+response.data.itinerary.itinerary_id); }, 3000);
                  setLoading(false);

              }
        }).catch(err => {
            setLoading(false);

             if(err.response.data.email){
             }
        })
    }
    const [slideIndex, setSlideIndex] = useState(0);
    const _prevSlideHandler = () => {
        if(slideIndex) setSlideIndex(slideIndex-1);
    }
    const [valueStart, setValueStart] =useState((dayjs()));
    const [valueEnd, setValueEnd] =useState((dayjs()));
    const [numberOfAdults, setNumberOfAdults] = useState(2);
    const [numberOfChildren, setNumberOfChildren] = useState(0);
    const [numberOfInfants, setNumberOfInfants] = useState(0);
    const [budget, setBudget] = useState('Affordable');
    const [selectedPreferences, setSelectedPreferences]  = useState([]);
    const [showCities, setShowCities] = useState(false);
    const [showSearchStarting, setShowSearchStarting] = useState(false);

    const [showBlack, setShowBlack] = useState(false);
    // console.log(startingLocation);
    useEffect(() => {

        if(slideIndex === 2 && props.token) _submitDataHandler();
      }, [slideIndex, props.token]);
      const _handleHideBlack = () => {
        setShowBlack(false);
        setShowCities(false);
        setShowSearchStarting(false);
      }
      // console.log(props.experienceData)
  let isPageWide = media('(min-width: 768px)');

    // const [budgetLower,setBudgetLower] = useState(0);
    if(!loading && !submitted)
 return(
    <div>
                {showBlack ? <BlackContainer onClick={_handleHideBlack}></BlackContainer> : null}
               
    <Container className={isPageWide ? "border center-div"  : "center-div"} onClick={() => setShowBlack(true)}>
        {/* <Modal  backdrop={true} show={props.show}  size="md" centered onHide={_hideModalHandler} style={{padding: "0"}}> */}
            {/* <Modal.Body style={{padding: "1rem", minHeight: '60vh'}} className="center-div" > */}
           
            {/* <div onClick={(e) => _prevSlideHandler}>Back</div> */}
            <div style={{padding: '0.5rem', width: '100%', marginBottom: slideIndex === 2 ? '2rem' : '1rem', display: 'grid', gridTemplateColumns: 'max-content auto', borderStyle: 'none none solid none' , borderWidth: '1px', borderColor: '#f7e700'}}>
            {slideIndex ? <div className="center-div"><TbArrowBack onClick={_prevSlideHandler} className="hover-pointer" style={{ marginTop: '4px', fontSize: '1.5rem'}}></TbArrowBack></div> : <div></div>}
            <Heading>{"Trip Planner" }</Heading> 

            </div>
            {/* <div key={index}  style={{width: '80%', margin: props.experience ? "2px 1rem" : '2px 0.5rem'}} ><div>{card}</div></div> */}
            <div style={{padding: '1rem', width: '100%'}}>
            <Flickity
            startingLocation={startingLocation}
            setStartingLocation={setStartingLocation}
            children_cities={props.children_cities}
            showSearchStarting={showSearchStarting} 
            setShowSearchStarting={setShowSearchStarting}
            showCities={showCities}
            setShowCities={setShowCities}
            destination={props.destination}
            token={props.token}
            // _handlePrev={_prevSlideHandler}
            slideIndex={slideIndex}
            cities={props.cities}
            selectedCities={selectedCities}
            setSelectedCities={setSelectedCities}
            valueStart={valueStart}
            valueEnd={valueEnd}
            setValueStart={setValueStart}
            setValueEnd={setValueEnd}
            groupType={groupType}
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
        {/* {slideIndex !==2 ? <Button margin="1rem 0" borderRadius="10px" borderWidth="0" bgColor="#f7e700" width="100%" onclick={() => setSlideIndex(slideIndex+1)}>
            Continue
            </Button> : <Button margin="1rem 0" borderRadius="10px" borderWidth="0" bgColor="#f7e700" width="100%" onclick={_submitDataHandler}>
            Submit
            </Button> } */}
            {
                slideIndex === 0? <div style={{display: 'flex', justifyContent: 'flex-end', visibility: showCities ? 'hidden' : 'visible'}}><Button align="right" padding="0.5rem 2rem" fontWeight="600" margin="1rem 0" borderRadius="5px" borderWidth="0" bgColor="#f7e700"  onclick={() => setSlideIndex(slideIndex+1)}>
                Next
                </Button></div>  : null
            }
            {
                slideIndex === 1 ? !props.token ? <div style={{display: 'flex', justifyContent: 'flex-end'}}><Button padding="0.5rem 2rem" fontWeight="600" margin="1rem 0" borderRadius="5px" borderWidth="0" bgColor="#f7e700"  onclick={() => setSlideIndex(slideIndex+1)}>
                Next
                </Button></div> :  <div style={{display: 'flex', justifyContent: 'flex-end'}}><Button padding="0.5rem 2rem" fontWeight="600"  margin="1rem 0" borderRadius="8px" borderWidth="0" bgColor="#f7e700"  onclick={_submitDataHandler}>
            Submit
            </Button></div> : null
            }
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
      </div>
      </Container>
      </div>
);
else return(
    <div>
                        {showBlack ? <BlackContainer onClick={() => setShowBlack(false)}></BlackContainer> : null}

    <Container className="border center-div">
        <Spinner></Spinner>
    </Container>
    </div>
)
}

const mapStateToPros = (state) => {
    return{
    
      name: state.auth.name,
      emailFail: state.auth.emailFail,
      token: state.auth.token,
      phone: state.auth.phone,
      email: state.auth.email,
      
    }
  }
  const mapDispatchToProps = dispatch => {
      return{
   
      }
    }
  
export default  connect(mapStateToPros,mapDispatchToProps)(Enquiry);