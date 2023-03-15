import styled from "styled-components"
import Navigator from "./Navigator"
import Brief from './MenuItems/Brief'
import TopRecommendations from "./MenuItems/TopRecommendation"
import Poi  from "./pois/Index"
import FoodToEat from "./MenuItems/FoodToEat"
const MenuContainer = styled.div`
width : 95%;    
margin : auto;
font-family: 'Poppins';
    @media screen and (min-width: 768px){
        width : 80%;
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
      line-height: 28px;
      @media screen and (min-width: 768px) {
       font-size: 18px;
      }
    `;

const Menu = (props)=>{
  function handleClick(e){
    let el = document.getElementById(e)
    if(el){ 
    el.scrollIntoView({behavior : 'smooth', block: 'center' }) 
  }
  }
  return (
        <MenuContainer>
            {/* <Navigator handleClick={handleClick} {...props} /> */}
            {props.data.short_description &&<MenuItem id='Brief'>
              <Brief short_description={props.data.short_description} lat={props.data.lat} long={props.data.long} />
            </MenuItem>}
            
            {/* <MenuItem id='Itinerary'>
                <Heading >TTW’s Top Recommendation</Heading>
                <TopRecommendations />
            </MenuItem> */}

            {props.data.pois &&<MenuItem id='Things to do' single>
            <Heading>Things to do</Heading>
             <Poi pois={props.data.pois} />
            </MenuItem>}

            {props.data.foods &&<MenuItem id='Food to eat' single>
            <Heading>Food to eat</Heading>
             <FoodToEat foods={props.data.foods} />
            </MenuItem>}

            {props.data.conveyance_available &&<MenuItem id='How to reach' single>
            <Heading>How to reach</Heading>
            <P>{props.data.conveyance_available}</P>
            </MenuItem>}

            {props.data.survival_tips_and_tricks &&<MenuItem id='Survival Tips & Tricks' single>
            <Heading>Survival Tips & Tricks</Heading>
            <P>{props.data.survival_tips_and_tricks}</P>
            </MenuItem>}

            {props.data.folklore_or_story &&<MenuItem id='Folklore or Story' single>
            <Heading>Folklore or Story</Heading>
            <P>{props.data.folklore_or_story}</P>
            </MenuItem>}


        </MenuContainer>
    )
}

export default Menu