import React from 'react';
import styled from 'styled-components';
import media from '../../../../media';
import { useRouter } from 'next/router'
import {ImSearch} from 'react-icons/im'
import SkeletonCard from '../../../../ui/SkeletonCard';
const Container = styled.div`
    margin: 1rem;
    `;
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
    const ImageContainer = styled.div`
position: relative;
text-align: center;
color: white;
margin: auto;
border-radius: 50%;
width: 100%;
min-height: 16vw;
background: white;

&:hover{
    cursor: pointer;
    background: #f7e700;
}
@media screen and (min-width: 768px){
    min-height: 6.5vw;

}
`;
const ImageText = styled.div`
font-weight: 400;
margin: 0;
padding: 0;
font-size: 0.75rem;

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
    const router = useRouter()
  let isPageWide = media('(min-width: 768px)');
  const _handleLocationClick = (data) => {
    if(data.type == 'Location') router.push('/travel-guide/city/'+data.cta)
    else router.push('/travel-planner/'+data.cta)
  }
  const _handlePersonaliseRedirect = (name) => {
    router.push('/tailored-travel?search_text='+name)
  }
  let results=[];
  console.log(props.results,'_sour') 
  
  const skeleton = <div style={{display:'grid' , padding : '0.3rem', gap : '2px' , gridTemplateColumns : '0.5fr 5fr'}}>
  <SkeletonCard borderRadius='100%' width='44px'></SkeletonCard>
  <div style={{marginBlock : 'auto'}}>
  <SkeletonCard height='14px' ml='8px' width={'70%'} borderRadius={'2px'}></SkeletonCard>
  <SkeletonCard height='12px' ml='8px' mt='4px' width={'55%'} borderRadius={'2px'}></SkeletonCard>
  </div>
  </div>

console.log(props.results , 'props.results')
  if(!props.results) return <SkeletonContainer>{[skeleton,skeleton,skeleton,skeleton,skeleton]}</SkeletonContainer>

    return(      <>
        <Container>
        {props.results.map((e,i)=>
       { if(i<5) return<LocationContainer key={e["_source"].resource_id} onClick={() => {_handleLocationClick(e['_source'])}}>
            
            <MarkerContainer><ImSearch /></MarkerContainer>
            <Text>
              <div>{e['_source'].name}</div>
            {e['_source'].parent && <p>{e['_source'].parent}</p>}            
            </Text>
        </LocationContainer>}
        )
    }

        </Container>
        </>
    );
}

export default NewResults ;
