import styled from "styled-components"
import PoiCard from "./PoiCard"
import {useState} from 'react'
import media from '../../../components/media'
import PageDotsFlickity from '../../../components/PageDotsFlickity'
import validateTextSize from "../../../services/textSizeValidator"
import Map from '../../../components/Map'
import WeatherWidget from "../../../components/WeatherWidget/WeatherWidget"
import openTailoredModal from "../../../services/openTailoredModal"
import { useRouter } from "next/router"
const GridContainer 
= styled.div`
@media screen and (min-width: 768px){
    display : grid;
    grid-template-columns : 3fr 1.1fr;    
    gap : 2.5rem;

}
`
const Items = styled.div`
display : grid;
gap : 22px;

@media screen and (min-width: 768px){
grid-template-columns : 1fr 1fr;
}
`
const TextBold = styled.p`
line-height: 24px;
font-weight: 600;
margin: 0;
color: rgb(1, 32, 43);
`;
const Button = styled.button`
background : white;
color : #01202B;
border : 1.5px solid #01202B;
font-size : 1rem;
padding : 0.5rem 2rem;
display: block;
margin : 15px auto 0px auto;
border-radius : 8px;
&:hover{
  color : white;
  background : black;
}
`
const MapInfo = styled.div`
b{
  font-weight : 600;
}
`

const WeatherContainer = styled.div`
border : 1px solid #ECEAEA;
border-radius : 10px;
padding : 25px;
height: max-content;
margin-bottom : 1.7rem;
`
const Poi = props=>{
  const [more,setMore] = useState(4)
  const drawerShowArr = props.pois?.map((e)=>{return{...e,isOpen:false}})
  const [showDrawer, setShowDrawer] = useState(drawerShowArr);

  let isPageWide = media('(min-width: 768px)')

  const _handleOpen = (id)=>{
    setShowDrawer(drawerShowArr.map((e)=>{
      if(e.id == id) return{...e,isOpen:true}
      return e
    }
  ))
  }
  const handleCloseDrawer = (e) => {
    e.stopPropagation()
    setShowDrawer(drawerShowArr);            
  };

  const InfoWindowContainer = (location)=><MapInfo>
    <b>{location.name}</b>
    <div>{location.experience_filters.map((e,i)=>(i !=0)?<span>{', '+e}</span>:<span>{e}</span>)}</div>
    {location.ideal_duration_hours && <p>Ideal duration : {location.ideal_duration_hours} hrs</p>}

  </MapInfo>

  const cards = props.pois?.map((e,i)=>
  <PoiCard key={e.id} data={e} showDrawer={showDrawer[i]} setShowDrawer={setShowDrawer} _handleOpen={_handleOpen}  handleCloseDrawer={handleCloseDrawer} />  
  )
  const router = useRouter()
  
    return (
      <GridContainer>
        <div className="hidden-mobile">            
            <Items>
            {
               props.pois.filter((e,i)=>i<more)?.map((e,i)=> ( <PoiCard key={e.id} data={e} showDrawer={showDrawer[i]} setShowDrawer={setShowDrawer} _handleOpen={_handleOpen}  handleCloseDrawer={handleCloseDrawer}/>))
            }
            </Items>
          <Button onClick={()=>{more<props.pois.length?setMore(more+4): props.data?openTailoredModal(router, props.data.id , props.data.name) : console.log('')}}>{more<props.pois.length?'View More' : validateTextSize(`Craft a trip to ${props.city} now!`,8,'Craft a trip now!')}</Button>
        </div>
        
        <div className="hidden-desktop">
        <PageDotsFlickity padding={'1rem 0.2rem'} cards={cards} />
        </div>
        <div>

        {(props.thingsToDoPage ) && <WeatherContainer elevation={props.elevation}>
      <WeatherWidget city={props.data.name} lat={props.data.lat} lon={props.data.long} />
      {props.data.elevation && props.data.elevation.length && props.data.elevation[0]?.elevation && 
     <div style={{marginTop : '20px'}}>
     <TextBold>Altitude</TextBold>
     <p style={{fontWeight : '300', marginBottom : '0'}}>{Math.floor(props.data.elevation[0]?.elevation)} metres ({Math.floor(props.data.elevation[0]?.elevation*3.281)} feet) above sea level</p>
     </div>
 }
      </WeatherContainer>} 


<Map locations={props.pois} defaultZoom={12} height={isPageWide? props.thingsToDoPage? '320px' : '350px' :'230px'} InfoWindowContainer={InfoWindowContainer} />

</div>
    </GridContainer>

        )
}

export default Poi