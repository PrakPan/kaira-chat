import styled from "styled-components"
import Navigator from "./Navigator"
import Brief from './MenuItems/Brief'
import TopRecommendations from "./MenuItems/TopRecommendation"
import Poi  from "./pois/Index"
import FoodToEat from "./MenuItems/FoodToEat"
import HowToReach from "./MenuItems/HowToReach"
import InformationTextContainer from '../../components/experiencecity/info/InformationTextContainer'
const MenuContainer = styled.div`
width : 95%;    
margin : auto;
    @media screen and (min-width: 768px){
        width : 80%;
          }
`
const MenuItem = styled.div`
@media screen and (min-width: 768px){
margin-right : ${props=>props.single?'29%' : '0'}
}
`
const Heading = styled.p`
font-weight: 600;
font-size: 32px;
line-height: 48px;
margin-block : 30px;
`

const Menu = (props)=>{
console.log('0000.',props)
  function handleClick(e){
    let el = document.getElementById(e)
    if(el){ 
    el.scrollIntoView({behavior : 'smooth', block: 'center' }) 
  }
  }
  return (
        <MenuContainer>
            {/* <Navigator handleClick={handleClick} {...props} /> */}
            <MenuItem id='Brief'>
              <Brief short_description={props.data.short_description} lat={props.data.lat} long={props.data.long} />
            </MenuItem>
            
            <MenuItem id='Itinerary'>
                <Heading >TTW’s Top Recommendation</Heading>
                <TopRecommendations />
            </MenuItem>

            <MenuItem id='Things to do' single>
            <Heading>Things to do</Heading>
             <Poi pois={props.data.pois} />
            </MenuItem>

            <MenuItem id='Food to eat' single>
            <Heading>Food to eat</Heading>
             <FoodToEat foods={props.data.foods} />
            </MenuItem>

            <MenuItem id='How to reach' single>
            <Heading>How to reach</Heading>
            <InformationTextContainer
              type='text'
              text={props.data.conveyance_available}></InformationTextContainer>
            </MenuItem>

            <MenuItem id='Survival Tips & Tricks' single>
            <Heading>Survival Tips & Tricks</Heading>
            <InformationTextContainer
              type='text'
              text={props.data.survival_tips_and_tricks}></InformationTextContainer>
            </MenuItem>

            <MenuItem id='Folklore or Story' single>
            <Heading>Folklore or Story</Heading>
            <InformationTextContainer type='text' text={props.data.folklore_or_story}></InformationTextContainer>
            </MenuItem>


        </MenuContainer>
    )
}

export default Menu