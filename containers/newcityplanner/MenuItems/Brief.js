import styled from "styled-components"

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
    {props.short_description &&<Typography className="font-nunito">{props.short_description}</Typography>}
    <div style={{border: '1px solid red'}} className='hidden-mobile'>MAP COMPONENT</div>
    </Container>
}

export default Brief