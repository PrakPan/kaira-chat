import React from 'react';
import styled from 'styled-components';
import media from '../../../../media';
import { useRouter } from 'next/router'
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import ImageLoader from '../../../../ImageLoader';
import SkeletonCard from '../../../../ui/SkeletonCard';

const Container = styled.div`
    // display: grid;
    // grid-template-columns: 1fr 1fr;
    // grid-gap: 1rem;
   margin: 1rem;
    `;
const MarkerContainer= styled.div`
background : #dfdfdf;
border-radius : 100%;
padding: 11px 14px;
`
const Text = styled.div`
font-weight : 500;
// margin-block : 5px;
p{
font-weight : 400;
margin-bottom : 0rem;
margin-top : -2px;
font-size : 12px;
color : #7e7e7e;
}
`

const LocationContainer = styled.div`
padding: 0.5rem;
margin-block : auto;
&:hover{
    cursor: pointer;
}
max-width: 100%;
border-radius: 10px;
display: grid;
grid-template-columns: 45px 5.5fr;
grid-gap: 0.5rem;
&:hover{
    cursor: pointer;
}
`;
const SkeletonContainer = styled.div`
padding: 0.5rem;
max-width: 100%;
display : grid;
grid-template-columns : 1fr 7fr;
`

const Heading = styled.p`
font-weight: 500;
font-style: normal;
font-size: 12px;
line-height: 16px;
display: flex;
align-items: center;
text-align: center;
text-transform: uppercase;
margin : 1rem;
color: #7A7A7A;
`;

const Locations= (props) => {
    const router = useRouter()

  let isPageWide = media('(min-width: 768px)')
  const _handleLocationClick = (data) => {
    if(data.cta) {
     // props.setPannelClose()
     // router.push('/travel-guide/city/'+slug)
     if(data.type === 'Location') window.location.href='https://thetarzanway.com/travel-guide/city/'+data.cta    
     if(data.type === 'State') window.location.href='https://thetarzanway.com/travel-planner/'+data.cta    
 
 }
   }
  const _handlePersonaliseRedirect = (id, name, parent) => {
    // localStorage.setItem('search_city_selected_id', id)
    // localStorage.setItem('search_city_selected_name', name)
    // localStorage.setItem('search_city_selected_parent', parent)


    router.push('/tailored-travel?search_text='+name)
  }
  let locations=[];
    if(props.hotlocations){
        for(var i=0; i<5; i++){
            const data = props.hotlocations[i]
            locations.push(
                <LocationContainer  onClick={() => _handleLocationClick(data)}>
                <MarkerContainer><FaMapMarkerAlt /></MarkerContainer>
            <Text>
              <div>{props.hotlocations[i].name}</div>
            {props.hotlocations[i].parent?<p>{props.hotlocations[i].parent}</p>:<p>{props.hotlocations[i].state?.name}</p>}  
            </Text>
           </LocationContainer>
            )
        }
    }
    else {
        for(var i=0; i<5; i++){
          
            locations.push(
                <SkeletonContainer>
                <SkeletonCard borderRadius='100%' width='46px'></SkeletonCard>
                <div style={{marginBlock : 'auto'}}>
                <SkeletonCard height='14px' ml='8px' width={'70%'} borderRadius={'2px'}></SkeletonCard>
                <SkeletonCard height='12px' ml='8px' mt='4px' width={'55%'} borderRadius={'2px'}></SkeletonCard>
                </div>
                         </SkeletonContainer>
            )
        }
    }
    return(
        <div>
        <Heading className="font-lexend">POPULAR DESTINATIONS</Heading>
        <Container>      
            {locations}  
        
        </Container>
        </div>
    );
}

export default Locations;
