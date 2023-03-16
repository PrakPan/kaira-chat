import { useState } from "react";
import styled from "styled-components"
import Map from '../Map'
import media from '../../../components/media'
const Container = styled.div`
margin-top : 30px;

@media screen and (min-width: 768px){
    display : grid;
    grid-template-columns : 3fr 1.6fr;
    gap : 2rem;

      }
`
const P = styled.p`
      font-weight: 300;
      text-align: left;
      line-height: 32px;
      @media screen and (min-width: 768px) {
       font-size:18px ;
      }
    `;

const Brief = (props)=>{
    const isPageWide = media('(min-width: 768px)')
    const [moreText,setMoreText] = useState(false)
    const textLength = isPageWide?1000:500
    

return <Container>
    
     <P>{moreText?props.short_description:props.short_description.substr(0, textLength)}
     {props.short_description.length>textLength&&<span style={{fontWeight : '700',cursor : 'pointer'}} onClick={()=>setMoreText(!moreText)}>{moreText?' ...less' : ' ...more'}</span>}
     </P>
    <div className='hidden-mobile'><Map lat={props.lat} long={props.long} /></div>
    </Container>
}

export default Brief