import styled from "styled-components"
import InformationTextContainer from '../../../components/experiencecity/info/InformationTextContainer'
import Map from '../Map'
const Container = styled.div`
margin-top : 30px;

@media screen and (min-width: 768px){
    display : grid;
    grid-template-columns : 3fr 1.2fr;
    gap : 2rem;

      }
`
const Typography = styled.p`
    font-size : 16px;
    color : #01202B;
    line-height : 28px;
`

const Brief = (props)=>{
    console.log('sss0',props)
    return <Container>
    {/* {props.short_description &&<Typography className="font-nunito">{props.short_description}</Typography>} */}
    
     <InformationTextContainer
              type='text'
              text={props.short_description}></InformationTextContainer>
    <div className='hidden-mobile'><Map lat={props.lat} long={props.long} /></div>
    </Container>
}

export default Brief