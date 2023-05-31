import styled from "styled-components"
import Brief from './MenuItems/Brief'
import TopRecommendations from "./MenuItems/TopRecommendation"
import Poi  from "./pois/Index"
import FoodToEat from "./MenuItems/FoodToEat"
import WhyPlanWithUs from '../../components/WhyPlanWithUs/PlanWithUsWithEnquiry';
 import Reviews from '../travelplanner/CaseStudies/Index';
  import ChatWithUs from '../../components/containers/ChatWithUs/ChatWithUs';
import NearbyLocations from "./MenuItems/NearbyLocations"
import AsSeenIn from "../testimonial/AsSeenIn"

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
const Menu = (props)=>{

  return (
    <MenuContainer thingsToDoPage={props.thingsToDoPage}>
      {props.data.short_description && !props.thingsToDoPage && (
        <MenuItem id="Brief">
           <Heading style={{ margin: "30px 0 30px 0" }}>
                {"A little about " + props.data.name}
              </Heading>
          <Brief
           
            short_description={props.data.short_description}
            lat={props.data.lat}
            lon={props.data.long}
            name={props.data.name}
            elevation={
              props.data.elevation &&
              props.data.elevation.length &&
              props.data.elevation[0]?.elevation
            }
          />
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
          <Poi
            elevation={props.elevation}
            data={props.data}
            thingsToDoPage={props.thingsToDoPage}
            pois={props.data.pois}
            city={props.data.name}
          />
        </MenuItem>
      )}

      <MenuItem id="nearby-places">
        <NearbyLocations nearbyCities={props.nearbyCities} data={props.data} />
      </MenuItem>

      {!!props.data.foods.length && (
        <MenuItem id="Food" single>
          <Heading>Food to eat</Heading>
          <FoodToEat foods={props.data.foods} />
        </MenuItem>
      )}

      {props.data.conveyance_available && (
        <MenuItem id="Reach" single>
          <Heading style={{ marginBottom: "1rem" }}>How to reach</Heading>
          <P>{props.data.conveyance_available}</P>
        </MenuItem>
      )}

      {props.data.survival_tips_and_tricks && (
        <MenuItem id="Survival" single>
          <Heading style={{ marginBottom: "1rem" }}>
            Survival Tips & Tricks
          </Heading>
          <P>{props.data.survival_tips_and_tricks}</P>
        </MenuItem>
      )}

      {props.data.folklore_or_story && (
        <MenuItem id="Folklore" single>
          <Heading style={{ marginBottom: "1rem" }}>Folklore or Story</Heading>
          <P>{props.data.folklore_or_story}</P>
        </MenuItem>
      )}

      <MenuItem id="Why">
        <Heading>Why plan with us?</Heading>
        <WhyPlanWithUs
          page_id={props.data.id}
          destination={props.destination}
        />
      </MenuItem>

      <MenuItem id="Customers">
        <Heading style={{ marginBottom: "1.5rem" }}>
          Happy Community of The Tarzan Way
        </Heading>
        <Reviews />
      </MenuItem>

      <MenuItem>
        <Heading style={{ marginBottom: "1.5rem" }}>
          What they say? 
        </Heading>
        <AsSeenIn />
        <ChatWithUs />
      </MenuItem>
    </MenuContainer>
  );
}

export default Menu