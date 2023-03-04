import styled from "styled-components"
import ImageLoader from "./ImageLoader"
import urls from '../services/urls'
const Icon = styled.div`
width: 50px;
position: fixed;
z-index: 2;
right: 12px;
bottom: 72px;

@media screen and (min-width: 768px){
    padding: 0;
    bottom: 15px;
cursor : pointer;
}
`

const WhatsappFloating = (pops)=>{
    return <Icon onClick={()=>window.location.href=urls.WHATSAPP+"?text="+props.message}>
        <ImageLoader url='media/icons/bookings/whatsapp.svg' />
    </Icon>
}

export default WhatsappFloating