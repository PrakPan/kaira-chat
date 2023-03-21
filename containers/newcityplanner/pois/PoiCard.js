import styled ,{keyframes} from "styled-components"
import ImageLoader from "../../../components/ImageLoader"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useState } from "react";
import POIDetailsDrawer from "../../../components/drawers/poiDetails/POIDetailsDrawer";
import axiosPOIdetailsInstance from '../../../services/poi/poidetails'


const LeftSlideIn = keyframes`
  from { 
    transform: translateX(0%);
  } 
  to { 
    transform: translateX(25px);
  } 
`;

const LeftSlideOut = keyframes`
  from { 
    transform: translateX(25px);
  }
  to { 
    transform: translateX(0%);
  } 
`;

const RightSlideIn = keyframes`
  from { 
    transform: translateX(0px);
  } 
  to { 
    transform: translateX(-25px);
  } 
`;

const RightSlideOut = keyframes`
  from { 
    transform: translateX(-25px);
  }
  to { 
    transform: translateX(0px);
  } 
`;


const Container = styled.div`
position: relative;
cursor : pointer;
border-radius: 15px;

overflow :hidden;
& :hover{
  // opacity : 0.9;
  .AnimateLeft{
    animation: 0.5s ${LeftSlideIn} forwards;
 }
 .AnimateRight{
  animation : 0.5s ${RightSlideIn} forwards
 }
}
`


const Typography = styled.div`
display : flex;
justify-content : space-between;
font-weight : 600;
font-size : 16px;
position: absolute;
bottom: 10px;
left : 16px;
right : 5px;
color : white;
animation: 0.5s ${LeftSlideOut};
animation: 0.5s ${RightSlideOut};
`
const ImageContainer = styled.div`
height : 250px;
overflow : hidden;
color : grey;
transition: 0.5s all ease-in-out ;

&:hover{
  transform: scale(1.1); 

}
`

const Overlay = styled.div`
position: absolute;
top: 0;
bottom: 0;
left: 0;
right: 0;
height: 100%;
width: 100%;
opacity: 0;
transition: .5s ease;
background: linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%);
opacity : 1;
&:hover{
  background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 58%);
filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#000000",endColorstr="#ffffff",GradientType=1);
}

`
export default function PoiCard(props){          
    return (
        <Container onClick={()=>{ 
        props._handleOpen(props.data.id)}}>
            <ImageContainer>
            <ImageLoader height='100%' url={props.data.image} />
            </ImageContainer>
            <Overlay />
            {props.data.name && <Typography><p className='AnimateLeft'>{props.data.name}</p> <div><NavigateNextIcon className='AnimateRight' /></div></Typography>}
            <POIDetailsDrawer
        show={props.showDrawer.isOpen}
        iconId={props.data.id}
        handleCloseDrawer={props.handleCloseDrawer}
      />
        </Container>
    )

}