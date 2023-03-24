import styled from "styled-components"
import PoiCard from "./PoiCard"
import {useState} from 'react'
import media from '../../../components/media'
import PageDotsFlickity from '../../../components/PageDotsFlickity'
import validateTextSize from "../../../services/textSizeValidator"
import { useRouter } from "next/router"
import Map from '../../../components/Map'
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
const Button = styled.button`
background : white;
color : #01202B;
border : 1.5px solid #01202B;
font-size : 16px;
padding : 13px 68px;
display: block;
margin : 15px auto;
border-radius : 8px;
`
const MapInfo = styled.div`
b{
  font-weight : 600;
}
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

const router = useRouter()


  const _handleTailoredRedirect = () => {
    router.push('/tailored-travel?search_text='+props.city)
  
  }



  const InfoWindowContainer = (location)=><MapInfo>
    <b>{location.name}</b>
    <div>{location.experience_filters.map((e,i)=>(i !=0)?<span>{', '+e}</span>:<span>{e}</span>)}</div>
    {location.ideal_duration_hours && <p>Ideal duration : {location.ideal_duration_hours} hrs</p>}

  </MapInfo>

  const cards = props.pois?.map((e,i)=>
  <PoiCard key={e.id} data={e} showDrawer={showDrawer[i]} setShowDrawer={setShowDrawer} _handleOpen={_handleOpen}  handleCloseDrawer={handleCloseDrawer} />  
  )


    return (
      <GridContainer>
        <div className="hidden-mobile">
        {/* <> */}
            
            <Items>
            {
               props.pois.filter((e,i)=>i<more)?.map((e,i)=> ( <PoiCard key={e.id} data={e} showDrawer={showDrawer[i]} setShowDrawer={setShowDrawer} _handleOpen={_handleOpen}  handleCloseDrawer={handleCloseDrawer}/>))
            }
            </Items>

       
        {/* </GridContainer> */}
          <Button onClick={()=>{more<props.pois.length?setMore(more+4):_handleTailoredRedirect()}}>{more<props.pois.length?'View More' : validateTextSize(`Craft a trip to ${props.city} now!`,8,'Craft a trip now!')}</Button>
       
        </div>
        
        <div className="hidden-desktop">
        <PageDotsFlickity padding={'1rem 0.2rem'} cards={cards} />
        </div>
<Map locations={props.pois} defaultZoom={12} height={isPageWide?'350px':'230px'} InfoWindowContainer={InfoWindowContainer} />

    </GridContainer>

        )
}

export default Poi