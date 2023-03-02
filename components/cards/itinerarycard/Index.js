import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import ImageGallery from './slider/ImageSlider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCog, faCalendarWeek, faTags, faCoins, faRupeeSign, faStar, faStarHalf, faWallet} from '@fortawesome/free-solid-svg-icons';
import media from '../../media';
import { useRouter } from 'next/router';

const Container = styled.div`
width: 100%;
background-color: white;
box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
border-radius: 5px;
  @media screen and (min-width: 768px){
    &:hover{
      cursor: pointer;
    }
  }

`;
const ImageContainer = styled.div`
position: relative;
text-align: center;
color: white;
`;

  const ContentContainer = styled.div`
    width: 100%;
   
    padding: 1rem 0; 
    box-sizing: border-box;
    @media screen and (min-width: 768px){
    }
  `;
  const HeadingContainer= styled.div`
  height: 3rem;
  @media screen and (min-width: 768px){
    height: 3rem;
  }
  `;
  const TextContainer = styled.div`

 
  text-overflow: ellipsis;
  margin: 1rem 0 1rem 0;

`;
const Text = styled.p`
  font-weight: 300;
  font-size: 0.75rem;
  height: 4rem;
  margin: 0 0.5rem;
`;

   
 
const Heading = styled.p`
font-size: 1.5rem;
font-weight: 700;
margin: 0.5rem 0.5rem 0 0.5rem;
line-height: 1.25;
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
@media screen and (min-width: 768px){
  font-size: 1.25rem;
  margin: 0.75rem 0.5rem;
  font-weight: 600;
  color: #212529;
}
`;

const ExperienceCard= (props) => {
    let isPageWide = media('(min-width: 768px)');

    const [hours, setHours] = useState('-');
    const [minutes, setMinutes] = useState('-');
    const [seconds, setSeconds] = useState('-');
  
    const [showItineraryTimer, setShowItineraryTimer] = useState(true);
    const [minimiseTimer, setMinimiseTimer] = useState(false);

  const [timerValid, setTimerValid] = useState(false);

  const [statusColor, setStatusColor] = useState('white');
  const [statusText, setStatusText] = useState('');
  const [itineraryText, setItineraryText] = useState('')


  const  msToTime = (duration, unit) => {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    if(unit === 'hours') return hours;
    else if(unit === 'minutes') return minutes;
    else if(unit === 'seconds') return seconds;
    else return hours;
  }
    useEffect(() => {
      
      if(props.itineraryDate  && props.timeRequired){
         setShowItineraryTimer(true);
        const startingdate= new Date(props.itineraryDate.toString().replace(/-/g, "/"));
            const finaldate =  new Date(new Date(startingdate.toString().replace(/-/g, "/")).setHours(startingdate.getHours() + props.timeRequired));
            let startingtimer =  finaldate.getTime() - new Date().getTime() ;
            if(true){
             
              const startingdate= new Date(props.itineraryDate.toString().replace(/-/g, "/"));
              const finaldate =  new Date(new Date(startingdate.toString().replace(/-/g, "/")).setHours(startingdate.getHours() + props.timeRequired));
              let startingtimer =  finaldate.getTime() - new Date().getTime() ;
              
              const timerId = setInterval(function(){
                  startingtimer = startingtimer - 1000;
                  setHours (msToTime(startingtimer, 'hours'));
                  setMinutes(msToTime(startingtimer, 'minutes'));
                  setSeconds(msToTime(startingtimer, 'seconds'));
              }, 1000);
    
            }
    
      }
      return () => {
        // clearInterval(progressId);
        // clearInterval(timerId)
    }
    }, [props.itineraryDate, props.timeRequired]);
   

   
      const ShortText = styled.p`
      font-size: ${props => props.theme.fontsizes.mobile.text.default};
      font-weight: 300;
      @media screen and (min-width: 768px){
        font-size: ${props => props.theme.fontsizes.desktop.text.five};
        font-weight: 300;
        line-height: 1.5;

      }
      `; 
      const IconsContainer = styled.div`
        color: #696969;
        padding-bottom: 0.5rem;
        display: grid;
        grid-template-columns: repeat(3,1fr);
        font-size: ${props => props.theme.fontsizes.desktop.text.five};
        border-style: none;
        border-width: 1px;
        border-color: #E4e4e4;

      `;
      
const router = useRouter();
const _handleRedirect = () => {
  router.push('/itinerary/'+props.id)
}
let textstr = "";  
let cta="Check Out";

useEffect(() => {
  if(props.status === 'ITINERARY_UNDER_PREPARATION'){
    textstr="We're as excited as you are to plan your travel but we need a little more time to complete your itinerary.",
    cta="Preview"
    setStatusColor('#f7e700');
    setStatusText("UNDER PREPARATION - ")
    setItineraryText("We're as excited as you are to plan your travel but we need a little more time to complete your itinerary.")
  }
    else if(props.status === 'ITINERARY_PREPARED'){
    textstr="Good things take time, not always. Here is your plan that has been completely personalized by our travel experts.";
    cta="Check Out";
    setStatusColor('green');
    setStatusText("ITINERARY PREPARED");
    setItineraryText("Good things take time, not always. Here is your plan that has been completely personalized by our travel experts.")

  }
  else if(props.status === 'ITINERARY_USER_ACTION_REQUIRED'){
    textstr="Oops! Looks like there was a problem preparing your itinerary, please get in touch with your experience captain.";
    cta="Enquire Now";
    setStatusColor('red');
    setStatusText("ACTION REQUIRED"); 
    setItineraryText("Oops! Looks like there was a problem preparing your itinerary, please get in touch with your experience captain.")

  }
  else if(props.status === "ITINERARY_PAYMENT_COMPLETED"){
    textstr="Pack your bags, it's time to travel and create everlasting memories.";
    cta="View Now";
    setStatusColor('black');
    setStatusText("READY"); 
    setItineraryText("Pack your bags, it's time to travel and create everlasting memories.")
  }

}, [props.status]);
 
    return(
      <Container className="netflix-ite" onClick={_handleRedirect}>
        <ImageContainer>
              <ImageGallery budget={props.budget} filter={props.filter} locations={props.locations}   duration={props.duration} image={props.image} name={props.name}></ImageGallery>
       </ImageContainer>  
       <ContentContainer className="text-center">
           <HeadingContainer>
             <Heading className="font-opensans">{props.name}</Heading>
           </HeadingContainer>
       
            <TextContainer className="font-nunito" >
              {/* <ShortText> */}
                <Text>{itineraryText}</Text>
                {/* {props.status ==="ITINERARY_UNDER_PREPARATION" ?  <Timer card hours={hours} minutes={minutes} seconds={seconds}  timeRequired={props.timeRequired} itineraryDate={props.itineraryDate} hideTimer={true} _handleTimerClose={null} showTimer={true} _hideTimerHandler={null}></Timer> : <div style={{visibility: 'hidden'}}><Timer hours={hours} minutes={minutes} seconds={seconds}  timeRequired={props.timeRequired} itineraryDate={props.itineraryDate} hideTimer={true} _handleTimerClose={null} showTimer={true} _hideTimerHandler={null} card></Timer> </div>} */}
                {/* </ShortText> */}
            </TextContainer>
            <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center", margin: '0 0.5rem'}}>
            {/* <Price className="font-opensans">{"INR "+props.starting_cost+"/-"}</Price> */}
                {/* <Link passHref={true} href ={'/experiences/'+props.id}>
                  <Button onclick={_handleRedirect} margin="auto" hoverBgColor="black" bgColor='transparent' borderWidth="1px" borderRadius="2rem" padding="0.25rem 1.25rem" borderStyle="solid" hoverColor="white">{cta}
                  </Button>
                  </Link> */}
            </div>
       </ContentContainer>
       {/* <Status className="font-opensans" style={{backgroundColor: statusColor, color: props.status === 'ITINERARY_UNDER_PREPARATION' ? 'black' : 'white'}}>
         {statusText}
         {props.status ==="ITINERARY_UNDER_PREPARATION" ? <Timer hours={hours} minutes={minutes} seconds={seconds}/>:null}
         </Status> */}
      </Container> 
  ); 
}
 
export default React.memo(ExperienceCard);
