import styled from "styled-components"
import InformationTextContainer from '../../../components/experiencecity/info/InformationTextContainer'
const Container = styled.div`
margin-top : 30px;

@media screen and (min-width: 768px){
    display : grid;
    grid-template-columns : 3fr 1fr;
    gap : 5rem;

      }
`
const Typography = styled.p`
    font-size : 16px;
    color : #01202B;
    line-height : 28px;
`

const Brief = (props)=>{
    return <Container>
    {/* {props.short_description &&<Typography className="font-nunito">{props.short_description}</Typography>} */}
    
     <InformationTextContainer
              type='text'
              text={props.short_description}></InformationTextContainer>
    <div style={{border: '1px solid red'}} className='hidden-mobile'>MAP COMPONENT</div>
    </Container>
}

export default Brief