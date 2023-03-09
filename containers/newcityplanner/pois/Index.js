import styled from "styled-components"
import PoiCard from "./PoiCard"
import {useState} from 'react'
import media from '../../../components/media'
const GridContainer 
= styled.div`
@media screen and (min-width: 768px){
    display : grid;
    grid-template-columns : 3fr 1fr;    
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
const Poi = props=>{
  const [more,setMore] = useState(false)
  let isPageWide = media('(min-width: 768px)')

  let lessItems = !isPageWide? props.pois?.slice(0,2).map((e,i)=> ( <PoiCard key={e.id} data={e} />)) : props.pois?.slice(0,4).map((e,i)=> ( <PoiCard key={e.id} data={e} />))

    return (
        <div>
        <GridContainer>
            
            <Items>
            {
                more ? props.pois?.map((e,i)=> ( <PoiCard key={e.id} data={e} />))
                : lessItems
            }
            </Items>
       
        </GridContainer>
        <div style={{width:'75%'}}>
          <Button onClick={()=>setMore(!more)}>{more?'Show Less' : 'View all'}</Button>
          </div>
        </div>
        )
}

export default Poi