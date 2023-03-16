import styled from "styled-components"
import Experiences from "./Experiences"
 import { useState } from "react"

const Container = styled.div`

    @media screen and (min-width: 768px){
        display : grid;
        grid-template-columns : 3fr 1.6fr;
        gap : 2rem;
          };
          
  
`

const TopRecommendations = (props)=>{
    return (
        <Container>
        {/* <div style={{border : '1px solid red',gridColumnStart:2 , gridRowStart:1 , height : '390px'}}>Weather Component</div> */}

        <Experiences  two cols={'2'} link='https://www.blog.thetarzanway.com/post/hidden-gems-of-ladakh' heading="Hidden Gems of Ladakh"  text="Well, Ladakh is often referred to as the Land of explorers, which is because this amazing place has several hidden treasures waiting to be explored." img="media/website/b80cd8_8fb69995b7024cf3981e779ee18602d6_mv2.webp" margin="2.5rem 0" experiences={props.itinerary_data} ></Experiences>
        
        </Container>
    )
}
export default TopRecommendations