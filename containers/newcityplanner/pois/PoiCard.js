import styled from "styled-components"
import ImageLoader from "../../../components/ImageLoader"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
const Container = styled.div`
position: relative;
`
const Typography = styled.div`
display : flex;
justify-content : space-between;
font-weight : 600;
font-size : 24px;
position: absolute;
bottom: 10px;
left : 16px;
right : 5px;
color : white;
`
const ImageContainer = styled.div`
height : 250px;
overflow : hidden;
border-radius: 15px;
`
export default function PoiCard(props){

    return (
        <Container>
            <ImageContainer>
            <ImageLoader url={props.data.image} />
            </ImageContainer>
            {props.data.name && <Typography><p>{props.data.name}</p> <div><NavigateNextIcon /></div></Typography>}
        </Container>
    )

}