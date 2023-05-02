import React, {useRef, useState, useEffect} from 'react';
import styled from 'styled-components'
import router from 'next/router';

import Banner from './banner/Mobile'
import ItineraryContainer from './ItineraryContainer';
import Spinner from '../../../components/LoadingPage';
import defaultbreif from '../../itinerary/defaultbrief';
import DesktopPersonaliseBanner from '../../../components/containers/Banner' 
import urls from '../../../services/urls';
import openTailoredModal from '../../../services/openTailoredModal';
const Container = styled.div`
    width: 100%;
    @media screen and (min-width: 768px) {
      margin-top: 5vh;
    }
`;
 
const Itinerary = (props) =>{
  
  const [menuHeading, setMenuHeading] = useState('overview');
    // var id = props.match.params.id;
    var id="1";
    const [loaded, setLoaded] = useState(false);
    const [itinerary, setItinerary] = useState({name: "Loading Itinerary", images: []});
    const [breif, setBreif] = useState(defaultbreif);

    // useEffect(() => {
        // if(props.match.params.id === "LX1513cBeVVjRPY09EhI") setIsGroup(true);
        // axios.get(`https://suppliers.tarzanway.com/sales/itinerary/preview/day_by_day/?itinerary_id=`+props.match.params.id)
        //   .then(res => {
            
        //     setItinerary(res.data);
        //     setLoaded(true);

        //   }).catch(error => {
        //     props.history.push('/404')
        //   });
      //     axios.get(`https://suppliers.tarzanway.com/sales/itinerary/preview/brief/?itinerary_id=`+props.match.params.id)
      //     .then(res => {
      //       setBreif(res.data);
        
      //     }).catch(error => {

      //     });
      // }, []);



 let totalduration = 0;  
 //Calculate duration to show in full image
for(var i=0; i<props.brief.city_slabs.length; i++){
  if(props.brief.city_slabs[i].duration) totalduration+=parseInt(props.brief.city_slabs[i].duration);
}
  if(true)
    return (
      <>
        <Container>
          <ItineraryContainer
            is_experience
            itinerary={props.itinerary}
            brief={props.brief}
          ></ItineraryContainer>
        </Container>
        {/* <div className='hidden-desktop'><Banner></Banner></div> */}
        {/* <div className='hidden-desktop'><Banner  text="Some text here" buttontext="Buy Now" color="black" buttonbgcolor="#F7e700" onclick={props.openBooking}></Banner></div> */}
        <div className="hidden-mobile">
          <DesktopPersonaliseBanner
            onclick={() => openTailoredModal(router)}
            text="Want to personalise this experience?"
            cta="Start Now"
          ></DesktopPersonaliseBanner>
        </div>
        {/* <div className='hidden-mobile'><DesktopPersonaliseBanner onclick={props.openItinerary} text="Check out detailed itinerary" cta="Click Here"></DesktopPersonaliseBanner></div>  */}
        {/* <div className='hidden-desktop'><Banner text="View Itinerary"  buttontext="Click Me" color="black" buttonbgcolor="#f7e700"></Banner></div> */}
      </>
    );
    else return(
    // <div style={{height: "100vh", width: "100vw", backgroundColor: "#f7e700"}} className="center-div">
      <Spinner></Spinner>
    // </div>
    );
   
}

export default React.memo((Itinerary));




// import React, {useRef, useState, useEffect} from 'react';
// import styled from 'styled-components'

// // import Banner from '../../homepage/banner/Mobile';
// import Banner from '../Banner/Index';
// import DesktopPersonaliseBanner from '../../../components/containers/Banner' ;

// import ItineraryContainer from './ItineraryContainer';
// import Spinner from '../../../components/LoadingPage';
// import defaultbreif from '../../itinerary/defaultbrief';
// import urls from '../../../services/urls';

// const Container = styled.div`
//     width: 100%;
//     @media screen and (min-width: 768px) {
//       margin-top: 5vh;
//     }
// `;
 

// const Itinerary = (props) =>{
  

//     // var id = props.match.params.id;
//     var id="1";
//     const [loaded, setLoaded] = useState(false);
//     const [itinerary, setItinerary] = useState({name: "Loading Itinerary", images: []});
//     const [breif, setBreif] = useState(defaultbreif);

//     // useEffect(() => {
//         // if(props.match.params.id === "LX1513cBeVVjRPY09EhI") setIsGroup(true);
//         // axios.get(`https://suppliers.tarzanway.com/sales/itinerary/preview/day_by_day/?itinerary_id=`+props.match.params.id)
//         //   .then(res => {
            
//         //     setItinerary(res.data);
//         //     setLoaded(true);

//         //   }).catch(error => {
//         //     props.history.push('/404')
//         //   });
//       //     axios.get(`https://suppliers.tarzanway.com/sales/itinerary/preview/brief/?itinerary_id=`+props.match.params.id)
//       //     .then(res => {
//       //       setBreif(res.data);
        
//       //     }).catch(error => {

//       //     });
//       // }, []);


//       const _handleTailoredRedirect = (e) => {
//         router.push(urls.TRAVEL_SUPPORT)
//       }
//  let totalduration = 0;  
//  //Calculate duration to show in full image
// for(var i=0; i<props.brief.city_slabs.length; i++){
//   if(props.brief.city_slabs[i].duration) totalduration+=parseInt(props.brief.city_slabs[i].duration);
// }
//   if(true)
//     return(
//         <Container>
//               <ItineraryContainer is_experience itinerary={props.itinerary} brief={props.brief}></ItineraryContainer>
//               {/* <DesktopBanner onclick={_handleTailoredRedirect} text="Want to personalize your own experience?"></DesktopBanner> */}
//               {/* <div className='hidden-desktop'><Banner text="Want to craft your own travel experience?"  buttontext="Start Now" color="black" buttonbgcolor="#f7e700"></Banner></div> */}
        
//               {/* <div className='hidden-desktop'><Banner openBooking={props.openBooking} payment={props.payment} offsets={offset} locations={props.data.locations} heading={menuHeading} text="Some text here" buttontext="Buy Now" color="black" buttonbgcolor="#F7e700" onclick={props.openBooking}></Banner></div> */}
//                {/* <div className='hidden-mobile'><DesktopPersonaliseBanner onclick={props.openItinerary} text="Check out detailed itinerary" cta="Click Here"></DesktopPersonaliseBanner></div> */}

//         </Container>
//     );
//     else return(
//     // <div style={{height: "100vh", width: "100vw", backgroundColor: "#f7e700"}} className="center-div">
//       <Spinner></Spinner>
//     // </div>
//     );
   
// }

// export default React.memo((Itinerary));