import styled from "styled-components"
import ImageLoader from "../../../components/ImageLoader"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useState } from "react";
import POIDetailsDrawer from "../../../components/drawers/poiDetails/POIDetailsDrawer";
import axiosPOIdetailsInstance from '../../../services/poi/poidetails'

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

    const [showDrawer, setShowDrawer] = useState(false);
    const [poiDetailsData, setPoiDetailsData] = useState({});
  
    const _handleOpen = (id) => {
          setShowDrawer(true);
          axiosPOIdetailsInstance
          .get(`/?id=${id}`)
          .then((res) => setPoiDetailsData(res.data));
        }
        const handleCloseDrawer = (e) => {
            e.stopPropagation()
            setShowDrawer(false);            
          };

    return (
        <Container onClick={()=>_handleOpen(props.data.id)}>
            <ImageContainer>
            <ImageLoader url={props.data.image} />
            </ImageContainer>
            {props.data.name && <Typography><p>{props.data.name}</p> <div><NavigateNextIcon /></div></Typography>}
            <POIDetailsDrawer
        show={showDrawer}
        iconId={props.data.id}
        handleCloseDrawer={handleCloseDrawer}
        poiDetailsData={poiDetailsData}
      />
        </Container>
    )

}