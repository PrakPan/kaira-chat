import styled from "styled-components"
import Navigator from "./Navigator"
import Brief from './MenuItems/Brief'
import TopRecommendations from "./MenuItems/TopRecommendation"
import Poi  from "./pois/Index"
import FoodToEat from "./MenuItems/FoodToEat"
import { AiOutlineConsoleSql } from "react-icons/ai"
import WhyPlanWithUs from '../../components/WhyPlanWithUs/PlanWithUsWithEnquiry';
 import Reviews from '../travelplanner/CaseStudies/Index';
  import ChatWithUs from '../../components/containers/ChatWithUs/ChatWithUs';

const MenuContainer = styled.div`
width : 95%;    
margin : auto;
    @media screen and (min-width: 768px){
        width : 85%;
          }
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
margin-block : 30px;
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
    <MenuContainer>
      {/* <Navigator handleClick={handleClick} {...props} /> */}
      {props.data.short_description && (
        <MenuItem id="Brief">
          <Brief
            short_description={props.data.short_description}
            lat={props.data.lat}
            lon={props.data.long}
            name={props.data.name}
          />
        </MenuItem>
      )}

      {props.data.itinerary_data && (
        <MenuItem id="Itinerary">
          <Heading>Trips by our users to {props.data.name}</Heading>
          <TopRecommendations itinerary_data={props.data.itinerary_data} />
        </MenuItem>
      )}

      {props.data.pois && (
        <MenuItem id="Things to do">
          <Heading>Places to visit in {props.data.name}</Heading>
          <Poi pois={props.data.pois} city={props.data.name} />
        </MenuItem>
      )}

      {props.data.foods && (
        <MenuItem id="Food to eat" single>
          <Heading>Food to eat</Heading>
          <FoodToEat foods={props.data.foods} />
        </MenuItem>
      )}

      {props.data.conveyance_available && (
        <MenuItem id="How to reach" single>
          <Heading>How to reach</Heading>
          <P>{props.data.conveyance_available}</P>
        </MenuItem>
      )}

      {props.data.survival_tips_and_tricks && (
        <MenuItem id="Survival Tips & Tricks" single>
          <Heading>Survival Tips & Tricks</Heading>
          <P>{props.data.survival_tips_and_tricks}</P>
        </MenuItem>
      )}

      {props.data.folklore_or_story && (
        <MenuItem id="Folklore or Story" single>
          <Heading>Folklore or Story</Heading>
          <P>{props.data.folklore_or_story}</P>
        </MenuItem>
      )}

      <MenuItem>
        <Heading>Why plan with us?</Heading>
        <WhyPlanWithUs
          page_id={props.data.id}
          destination={props.destination}
          // cities={props.cities}
        />
      </MenuItem>

      <MenuItem>
        <Heading>What our customers say?</Heading>
        <Reviews />
      </MenuItem>

      <MenuItem>
        <ChatWithUs />
      </MenuItem>
    </MenuContainer>
  );
}

export default Menu