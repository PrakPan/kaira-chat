import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Overview from './overview/Index';
import Menu from './Menu';
import Brief from './breif/Index';
import NewFooter from '../../components/newfooter/Index';
// import ItineraryElement from './itineraryelements/Index';
// import { ITINERARY_ELEMENT_TYPES } from '../../services/constants';
// import ItineraryPoiElement from './itineraryelements/Poi';
// import ItineraryFlightElement from './itineraryelements/Flight';
// import ItineraryFoodElement from './itineraryelements/Food';
// import DayContainer from './itinerary/DayContainer';
import Itinerary from './itinerary/Index';
import axiosdaybydayinstance from '../../services/itinerary/daybyday/preview';
import axiosbreifinstance from '../../services/itinerary/brief/preview';
import axios from 'axios';
import { MIS_SERVER_HOST } from '../../services/constants';
const Container = styled.div`
     width: 90%;
    margin: 24vw auto 0 auto;
    @media screen and (min-width: 768px){
         width: 85%;
         margin: 15vh auto 0 auto;
         visibility: hidden;
    }
`;


const Line = styled.div`
border: 1px solid #F0F0F0;
 width: 100vw;
  margin-left: -1rem;
   margin-bottom:1rem;
   @media screen and (min-width: 768px){
    margin-left: -5rem;
    width: 100vw;
}

`;

const NewItinerary = (props) => {
   const [offsets, setOffsets] = useState({
    "Brief" : null,
    "Itinerary": null,
    "Stays": null,
    "Flights": null,
    "Transfers": null,
    "Activities": null,
   })
   const [currentMenu, setCurrentMenu] = useState('Brief');

   const [itinerary, setItinerary] = useState(null);
   const [brief, setBreif] = useState(null);
   const [plan, setPlan] = useState(null);
   const [itineraryLoading, setItineraryLoading] = useState(true);
   const [briefLoading, setBreifLoading] = useState(true);


   const getBreifHandler = () => {
    axiosbreifinstance.get(`/?itinerary_id=`+props.id)
    .then(res => {
       setBreif(res.data);
       setBreifLoading(false);
      
       try{
        let city_slabs = res.data.city_slabs.length;
       }
       catch{
        window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
       }
    
    }).catch(error => {
      setBreifLoading(false);
    
      window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
    });
    }

    // useEffect(() => {
     
     //      let scrollhandler = () => {
    //       try{
    //         console.log(window.pageYOffset, offsets.Itinerary);
    //         if(window.pageYOffset >  offsets.Brief && window.pageYOffset <  offsets.Itinerary) setCurrentMenu("Brief");

    //         if(window.pageYOffset >  offsets.Itinerary && window.pageYOffset <  offsets.Stays ) setCurrentMenu("Itinerary");
    //         if(window.pageYOffset >  offsets.Stays  && window.pageYOffset <  offsets.Flights) setCurrentMenu("Stays");
    //         if(window.pageYOffset >  offsets.Flights && window.pageYOffset <  offsets.Transfers) setCurrentMenu("Flights");
    //         if(window.pageYOffset >  offsets.Transfers && window.pageYOffset <  offsets.Activities) setCurrentMenu("Transfers");
    //         if(window.pageYOffset >  offsets.Activities) setCurrentMenu("Activities");
 
    //       }catch{

    //       }
    //     };
    //     window.addEventListener('scroll', scrollhandler);
    //     return () => {
    //       window.removeEventListener('scroll', scrollhandler);
    //     };

    // });

    useEffect(() => {
   

      window.scrollTo(0,0);
    //  if(TRAVELER_ITINERARIES.includes(props.id)) setIsPastTravelerItinerary(true);
     axiosdaybydayinstance.get(`/?itinerary_id=`+props.id)
       .then(res => {
        
         if(res.data.day_slabs.length){
            setItinerary(res.data);
          setItineraryLoading(false);
          }
         else {
           window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
         }
       }).catch(error => {
          setItineraryLoading(false);
         window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
       });
      getBreifHandler();
       
       axios.get(MIS_SERVER_HOST+'/sales/plan/?itinerary_id='+props.id)
       .then(res => {

          setPlan(res.data);
         if(res.data.itinerary_status === ITINERARY_STATUSES.itinerary_not_created){
            //  setItineraryNotCreated(false);
             alert("Looks like there was an issue with your itinerary, please contact us at info@thetarzanway.com")
         }
         else {
            // setUserEmail(res.data.user_email);
            // if(res.data.start_date) setIsDatePresent(true);
          //  setItineraryReleased(res.data.is_visible_to_customer);
          //  setItineraryDate(res.data.created_at);
          //  setTimeRequired(res.data.time_needed_for_itinerary_completion);
         }

       }).catch(error => {

       });
       
      //  getAccommodationAndActivitiesHandler();
       
       

    

}, []);
console.log('p',plan)

    const FONT_SIZES_MOBILE = {
        heading : [],
        text: [],
    }
    return(
        <div style={{}}>
        <Container>
            <Overview group_type={plan ? plan.group_type : null} FONT_SIZES_MOBILE={FONT_SIZES_MOBILE} plan={plan} name={brief ? brief.name : null}  duration={plan ? plan.duration_unit && plan.duration_unit ? plan.duration_number + " "+ plan.duration_unit : null : null} filters={plan ? plan.experience_filters_selected : []}></Overview>
            <Menu currentMenu={currentMenu} ></Menu>
            <Line  ></Line>
            <div
            ref={el => {
                // el can be null - see https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs
                if (!el) return;
        
                // console.log(el.getBoundingClientRect().top); // prints 200px
              }}
            >
            <Brief brief={brief}></Brief>
            </div>
            <div style={{}}
             ref={el => {
                // el can be null - see https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs
                if (!el) return;
        
               else if (!offsets.Itinerary) setOffsets({...offsets, "Itinerary": el.getBoundingClientRect().top}); // prints 200px
               else return ;
              }}
            >
             
            <Itinerary  day_slabs={itinerary ? itinerary.day_slabs ? itinerary.day_slabs.length ? itinerary.day_slabs: null: null: null} city_slabs={brief ? brief.city_slabs ? brief.city_slabs.length ? brief.city_slabs: null: null: null}></Itinerary>
            </div>
            <div style={{height: '70vh'}}
             ref={el => {
                // el can be null - see https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs
                if (!el) return;
        
               else if (!offsets.Stays) setOffsets({...offsets, "Stays": el.getBoundingClientRect().top}); // prints 200px
               else return ;
              }}
            >
                Stays
            </div>
            <div style={{height: '80vh'}}
             ref={el => {
                // el can be null - see https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs
                if (!el) return;
        
               else if (!offsets.Flights) setOffsets({...offsets, "Flights": el.getBoundingClientRect().top}); // prints 200px
               else return ;
              }}
            >
                Flights
            </div>
            <div style={{height: '90vh'}}
             ref={el => {
                // el can be null - see https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs
                if (!el) return;
        
               else if (!offsets.Transfers) setOffsets({...offsets, "Transfers": el.getBoundingClientRect().top}); // prints 200px
               else return ;
              }}
            >
                Transfers
            </div>
            <div style={{height: '90vh'}}
             ref={el => {
                // el can be null - see https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs
                if (!el) return;
        
               else if (!offsets.Activities) setOffsets({...offsets, "Activities": el.getBoundingClientRect().top}); // prints 200px
               else return ;
              }}
            >
                Activities
            </div>
        </Container>
        <NewFooter>
            
        </NewFooter>
        </div>
        
    );
 }

export default NewItinerary;