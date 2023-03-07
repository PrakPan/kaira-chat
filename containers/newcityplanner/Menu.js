import styled from "styled-components"
import Navigator from "./Navigator"
import Brief from './MenuItems/Brief'
import TopRecommendations from "./MenuItems/TopRecommendation"
import Poi  from "./pois/Index"
const MenuContainer = styled.div`
width : 95%;    
margin : auto;
    @media screen and (min-width: 768px){
        width : 80%;
          }
`
const MenuItem = styled.div`

`
const Heading = styled.p`
font-weight: 600;
font-size: 32px;
line-height: 48px;
margin-block : 30px;
`

const Menu = (props)=>{
    return (
        <MenuContainer>
            <Navigator {...props} />
            <MenuItem>
              <Brief short_description={props.data.short_description} />
            </MenuItem>
            
            <MenuItem>
                <Heading>TTW’s Top Recommendation</Heading>
                <TopRecommendations />
            </MenuItem>

            <MenuItem>
            <Heading>Things to do</Heading>
             <Poi pois={props.data.pois} />
            </MenuItem>

        </MenuContainer>
    )
}

export default Menu