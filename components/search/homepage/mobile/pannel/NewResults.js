import React from 'react';
import styled from 'styled-components';
import {ImSearch} from 'react-icons/im'
import SkeletonCard from '../../../../ui/SkeletonCard';
const Container = styled.div`
    margin: 1rem;
    `;


const LocationContainer = styled.div`
padding: 0.3rem;
max-width: 100%;
display : flex;
gap : 12px;
align-items : center;
border-radius : 50px;
&:hover{
    background : #F0F0F0;
    cursor: pointer;

}
`;

const MarkerContainer= styled.div`
background : #dfdfdf;
border-radius : 100%;
padding: 10px 13px 10px 13px;
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
const SkeletonContainer = styled.div`
margin: 1rem;
@media screen and (min-width: 768px){
    // display: grid;
    // grid-template-columns: 1fr 1fr ;
    // grid-gap: 0.5rem;
}
`

const NewResults = (props) => {
  const _handleLocationClick = (data) => {
    console.log('data: ', data);
     if (data.path) window.location.href = "/" + data.path;

    // if(data.cta){
    // if(data.type == 'Location') window.location.href='https://thetarzanway.com/travel-guide/city/' + data.cta
    // else window.location.href='https://thetarzanway.com/travel-planner/'+ data.cta
    // }
  }
  
  const skeleton = <div style={{display:'grid' , padding : '0.3rem', gap : '2px' , gridTemplateColumns : '0.5fr 5fr'}}>
  <SkeletonCard borderRadius='100%' width='44px'></SkeletonCard>
  <div style={{marginBlock : 'auto'}}>
  <SkeletonCard height='14px' ml='8px' width={'70%'} borderRadius={'2px'}></SkeletonCard>
  <SkeletonCard height='12px' ml='8px' mt='4px' width={'55%'} borderRadius={'2px'}></SkeletonCard>
  </div>
  </div>

  if(!props.results) return <SkeletonContainer>{[skeleton,skeleton,skeleton,skeleton,skeleton]}</SkeletonContainer>

    return(      <>
        <Container>
        {props.results.map((e,i)=>
       { if(i<5) return<LocationContainer key={e.resource_id} onClick={() => {_handleLocationClick(e)}}>
            
            <MarkerContainer><ImSearch /></MarkerContainer>
            <Text>
              <div>{e.name}</div>
            {e.parent && <p>{e.parent}</p>}            
            </Text>
        </LocationContainer>}
        )
    }

        </Container>
        </>
    );
}

export default NewResults ;
