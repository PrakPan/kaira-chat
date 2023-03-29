import styled from "styled-components"
import Navigator from "./Navigator"
import Brief from './MenuItems/Brief'
import TopRecommendations from "./MenuItems/TopRecommendation"
import Poi  from "./pois/Index"
import FoodToEat from "./MenuItems/FoodToEat"
import WhyPlanWithUs from '../../components/WhyPlanWithUs/PlanWithUsWithEnquiry';
 import Reviews from '../travelplanner/CaseStudies/Index';
  import ChatWithUs from '../../components/containers/ChatWithUs/ChatWithUs';
import { useRouter } from "next/router"
import validateTextSize from "../../services/textSizeValidator"

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

    const Button = styled.button`
background : white;
color : #01202B;
border : 1.5px solid #01202B;
font-size : 1rem;
padding : 0.5rem 2rem;
display: block;
margin : 15px auto;
border-radius : 8px;
&:hover{
  color : white;
  background : black;
}
`
const Menu = (props)=>{
  const router = useRouter()

  const _handleTailoredRedirect = () => {
    router.push('/tailored-travel?search_text='+props.city)
  }

  return (
    <MenuContainer>
      {/* <Navigator handleClick={handleClick} {...props} /> */}
      {props.data.short_description && (
        <MenuItem id="Brief">
          <Brief
            heading={<Heading style={{margin: '0 0 30px 0'}}>{"A little about "+ props.data.name}</Heading>}
            short_description={props.data.short_description}
            lat={props.data.lat}
            lon={props.data.long}
            name={props.data.name}
            elevation={props.data.elevation[0]?.elevation}
          />
        <Button onClick={()=>{_handleTailoredRedirect()}}>{validateTextSize(`Craft a trip to ${props.data.name} now!`,8,'Craft a trip now!')}</Button>

        </MenuItem>
      )}

      {!!props.data.itinerary_data.length && (
        <MenuItem id="Itinerary">
          <Heading>Trips by our users to {props.data.name}</Heading>
          <TopRecommendations itinerary_data={props.data.itinerary_data} />
        </MenuItem>
      )}

      {!!props.data.pois.length && (
        <MenuItem id="Places to visit in">
          <Heading>Places to visit in {props.data.name}</Heading>
          <Poi pois={props.data.pois} city={props.data.name} _handleTailoredRedirect={_handleTailoredRedirect} />
        </MenuItem>
      )}

      {!!props.data.foods.length && (
        <MenuItem id="Food to eat" single>
          <Heading>Food to eat</Heading>
          <FoodToEat foods={props.data.foods} />
        </MenuItem>
      )}

      {props.data.conveyance_available && (
        <MenuItem id="How to reach" single>
          <Heading style={{marginBottom : '1rem'}}>How to reach</Heading>
          <P>{props.data.conveyance_available}</P>
        </MenuItem>
      )}

      {props.data.survival_tips_and_tricks && (
        <MenuItem id="Survival Tips & Tricks" single>
          <Heading style={{marginBottom : '1rem'}}>Survival Tips & Tricks</Heading>
          <P>{props.data.survival_tips_and_tricks}</P>
        </MenuItem>
      )}

      {props.data.folklore_or_story && (
        <MenuItem id="Folklore or Story" single>
          <Heading style={{marginBottom : '1rem'}}>Folklore or Story</Heading>
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