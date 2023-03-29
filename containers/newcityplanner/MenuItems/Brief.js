import { useState } from "react";
import styled from "styled-components"
import media from '../../../components/media'
import WeatherWidget from "../../../components/WeatherWidget/WeatherWidget";
const Container = styled.div`
margin-top : 30px;

@media screen and (min-width: 768px){
    display : grid;
    grid-template-columns : 3fr 1.1fr;
    gap : 2rem;

      }
`
const P = styled.p`
      font-weight: 300;
      text-align: left;
      line-height: 32px;
      @media screen and (min-width: 768px) {
       font-size:18px ;
      }
    `;
    const TextBold = styled.p`
  line-height: 24px;
  font-weight: 600;
  margin: 0;
  color: rgb(1, 32, 43);
`;

const WeatherContainer = styled.div`
border : 1px solid #ECEAEA;
border-radius : 10px;
padding : 25px;
height: ${props=>props.elevation?'200px' : '150px'};
`



const Brief = (props)=>{
    const isPageWide = media('(min-width: 768px)')
    const [moreText,setMoreText] = useState(false)
    const textLength = isPageWide?1000:500
    
return <Container>
    
     <P>
        {props.heading}
        {moreText?props.short_description:props.short_description.substr(0, textLength)}
     {props.short_description.length>textLength&&<span style={{fontWeight : '700',cursor : 'pointer'}} onClick={()=>setMoreText(!moreText)}>{moreText?' ...less' : ' ...more'}</span>}
     </P>
     <WeatherContainer elevation={props.elevation}>
     <WeatherWidget city={props.name} lat={props.lat} lon={props.lon} />
     {props.elevation && 
    <div style={{marginTop : '20px'}}>
    <TextBold>Altitude</TextBold>
    <p style={{fontWeight : '300'}}>{Math.floor(props.elevation)} meteres ({Math.floor(props.elevation*3.281)} feet) above sea level</p>
    </div>
}
     </WeatherContainer>
    </Container>
}

export default Brief