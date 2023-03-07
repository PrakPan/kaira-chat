import styled from "styled-components"
import PoiCard from "./PoiCard"

const Container = styled.div`
display : grid;
grid-template-columns : 3fr 1fr;
`
const Items = styled.div`
display : grid;
grid-template-columns : 1fr 1fr;
gap : 22px;
`

const Poi = props=>{
    return (
        <Container>
            <Items>
            {
            props.pois?.map((e,i)=> ( <PoiCard key={e.id} data={e} />)) 
            }
            </Items>
        
       
        </Container>
    )
}

export default Poi