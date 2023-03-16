import styled from "styled-components"
import PoiCard from "./PoiCard"
import {useState} from 'react'
import media from '../../../components/media'

const GridContainer 
= styled.div`
@media screen and (min-width: 768px){
    // display : grid;
    // grid-template-columns : 3fr 1fr;    
    // gap : 5rem;

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

  let lessItems = !isPageWide? props.pois?.slice(0,2).map((e,i)=> ( <PoiCard key={e.id} data={e} showDrawer={showDrawer[i]} setShowDrawer={setShowDrawer} _handleOpen={_handleOpen}  handleCloseDrawer={handleCloseDrawer} />)) : props.pois?.slice(0,4).map((e,i)=> ( <PoiCard key={e.id} data={e} showDrawer={showDrawer[i]} setShowDrawer={setShowDrawer} _handleOpen={_handleOpen}  handleCloseDrawer={handleCloseDrawer} />))

    return (
        <div>
        <GridContainer>
            
            <Items>
            {
                more ? props.pois?.map((e,i)=> ( <PoiCard key={e.id} data={e} showDrawer={showDrawer[i]} setShowDrawer={setShowDrawer} _handleOpen={_handleOpen}  handleCloseDrawer={handleCloseDrawer}/>))
                : lessItems
            }
            </Items>
       
        </GridContainer>
          <Button onClick={()=>setMore(!more)}>{more?'Show Less' : 'View all'}</Button>
        </div>
        )
}

export default Poi