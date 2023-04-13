import styled from "styled-components"
import Brief from './MenuItems/Brief'
import TopRecommendations from "./MenuItems/TopRecommendation"
import Poi  from "./pois/Index"
import FoodToEat from "./MenuItems/FoodToEat"
import WhyPlanWithUs from '../../components/WhyPlanWithUs/PlanWithUsWithEnquiry';
 import Reviews from '../travelplanner/CaseStudies/Index';
  import ChatWithUs from '../../components/containers/ChatWithUs/ChatWithUs';
import { useRouter } from "next/router"
import WeatherWidget from "../../components/WeatherWidget/WeatherWidget"
import media from "../../components/media"
import NearbyLocations from "./MenuItems/NearbyLocations"

const MenuContainer = styled.div`
width : 95%;    
margin : auto;
    @media screen and (min-width: 768px){
        width : 85%;
          }

#Brief{
  grid-area : Brief
}
#Itinerary{
  grid-area : Itinerary
}
#Places{
  grid-area : Places
}
#Food{
  grid-area : Food;
}
#Reach{
  grid-area : Reach
}
#Survival{
  grid-area : Survival
}
#Folklore{
  grid-area : Folklore
}
#Why{
  grid-area : Why
}
#Customers{
  grid-area : Customers
}

#nearby-places{
  grid-area : nearby-places 
}
${props=>props.thingsToDoPage? 'display : grid;grid-template-areas : "Places" "Food" "nearby-places" "Itinerary" "Reach" "Survival" "Folklore" "Why" "Customers"'
 : ''}
`
const TextBold = styled.p`
line-height: 24px;
font-weight: 600;
margin: 0;
color: rgb(1, 32, 43);
`;


const MenuItem = styled.div`
@media screen and (min-width: 1400px){
margin-right : ${props=>props.single?'29%' : '0'}
}
`
const Heading = styled.p`
font-weight: 600;
font-size: 32px;
line-height: 48px;
margin-block : 1.5rem;
@media screen and (min-width: 768px) {
margin-block : 3.5rem;
 }
`
const P = styled.p`
      font-weight: 300;
      text-align: left;
      line-height: 32px;
      @media screen and (min-width: 768px) {
       font-size: 18px;
      }
    `;

const WeatherContainer = styled.div`
border : 1px solid #ECEAEA;
border-radius : 10px;
padding : 25px;
height: max-content;
`
const Menu = (props)=>{



  const router = useRouter()

  const _handleTailoredRedirect = () => {
    router.push('/tailored-travel?search_text='+props.city)
  }
  let isPageWide = media('(min-width: 768px)')

  return (
    <MenuContainer thingsToDoPage={props.thingsToDoPage}>
      {/* <Navigator handleClick={handleClick} {...props} /> */}
      {props.data.short_description && !props.thingsToDoPage &&  (
        <MenuItem id="Brief">
          <Brief
            heading={<Heading style={{margin: '0 0 30px 0'}}>{"A little about "+ props.data.name}</Heading>}
            short_description={props.data.short_description}
            lat={props.data.lat}
            lon={props.data.long}
            name={props.data.name}
            elevation={props.data.elevation[0]?.elevation}
          />
        {/* <Button onClick={()=>{_handleTailoredRedirect()}}>{validateTextSize(`Craft a trip to ${props.data.name} now!`,8,'Craft a trip now!')}</Button> */}

        </MenuItem>
      )}

      {!!props.data.itinerary_data.length && (
        <MenuItem id="Itinerary">
          <Heading>Trips by our users to {props.data.name}</Heading>
          <TopRecommendations itinerary_data={props.data.itinerary_data} />
        </MenuItem>
      )}

      {!!props.data.pois.length && (
        <MenuItem id="Places">
          <Heading>Places to visit in {props.data.name}</Heading>
          <Poi pois={props.data.pois} city={props.data.name} _handleTailoredRedirect={_handleTailoredRedirect} />
        </MenuItem>
      )}

{props.thingsToDoPage && <MenuItem id="nearby-places">
<Heading>Nearby Places</Heading>
       <NearbyLocations data={props.data} />
        </MenuItem> }

      {!!props.data.foods.length && (
        <MenuItem id="Food" single={props.thingsToDoPage?false : true}>
          <Heading>Food to eat</Heading>
          <div style={(props.thingsToDoPage && isPageWide)?{display : 'grid' , gridTemplateColumns :'3fr 1.1fr' , gap : '2.5rem'} : {}}>
          <FoodToEat foods={props.data.foods} />
          
          {(props.thingsToDoPage ) && <WeatherContainer elevation={props.elevation}>
      <WeatherWidget city={props.data.name} lat={props.data.lat} lon={props.data.long} />
      {props.data.elevation[0]?.elevation && 
     <div style={{marginTop : '20px'}}>
     <TextBold>Altitude</TextBold>
     <p style={{fontWeight : '300', marginBottom : '0'}}>{Math.floor(props.data.elevation[0]?.elevation)} metres ({Math.floor(props.data.elevation[0]?.elevation*3.281)} feet) above sea level</p>
     </div>
 }
      </WeatherContainer>} 
          </div>
         </MenuItem>
      )}




      {props.data.conveyance_available && (
        <MenuItem id="Reach" single>
          <Heading style={{marginBottom : '1rem'}}>How to reach</Heading>
          <P>{props.data.conveyance_available}</P>
        </MenuItem>
      )}

      {props.data.survival_tips_and_tricks && (
        <MenuItem id="Survival" single>
          <Heading style={{marginBottom : '1rem'}}>Survival Tips & Tricks</Heading>
          <P>{props.data.survival_tips_and_tricks}</P>
        </MenuItem>
      )}

      {props.data.folklore_or_story && (
        <MenuItem id="Folklore" single>
          <Heading style={{marginBottom : '1rem'}}>Folklore or Story</Heading>
          <P>{props.data.folklore_or_story}</P>
        </MenuItem>
      )}
        {/* <Button onClick={()=>{_handleTailoredRedirect()}}>{validateTextSize(`Craft a trip to ${props.data.name} now!`,8,'Craft a trip now!')}</Button> */}

      <MenuItem id="Why">
        <Heading>Why plan with us?</Heading>
        <WhyPlanWithUs
          page_id={props.data.id}
          destination={props.destination}
          // cities={props.cities}
        />

      </MenuItem>

      <MenuItem id="Customers">
        <Heading style={{marginBottom : '1.5rem'}}>What our customers say?</Heading>
        <Reviews />
      </MenuItem>

      <MenuItem>
        <ChatWithUs />
      </MenuItem>
    </MenuContainer>
  );
}

export default Menu