import React, {useState, useRef, useEffect, createRef} from 'react';
// import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from '../../components/ui/button/Index';
import media from '../../components/media';
// import * as ga from '../../services/ga/Index';

import styled from 'styled-components';
// import ImageLoader from '../../components/ImageLoader';
 import {BiChevronDown} from 'react-icons/bi'
const Container = styled.div`
 padding: 0 1rem;
@media screen and (min-width: 768px){
 padding: 0;
   
   
}

`;

 
// const Heading = styled.div`
// font-size: 1.75rem;
// font-weight: 800;
 
// `;
const Text = styled.div`
font-size: 1rem;
position: relative;
font-weight: 300;
margin: 0;
text-align: justify;
overflow: hidden;
line-height: 1.5;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp:  ${(props) => (props.more ? 'none' : "6")};

-webkit-box-orient: vertical;
   @media screen and (min-width: 768px){
    text-align: justify;
    -webkit-line-clamp:  ${(props) => (props.more ? 'none' : "6")};


}
`;
 
const Heading = styled.h2`
font-size: 32px;
font-weight: 700;
margin: 2.5rem 0 2.5rem 0;
text-align: center;
@media screen and (min-width: 768px){
  text-align: left;
}
`;
const  Overview = (props) =>{

  let isPageWide = media('(min-width: 768px)');
  const [more, setMore] = useState(false);
  return (
   <Container>
    {/* <GridContainer> */}
      <div>
        <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "0 0 3.5rem 0"}  bold>{props.overview_heading}</Heading>        
      <Text more={more} className='font-lexend'>
        <p>{props.overview_text}</p>
        {!more ? <div className='hover-pointer' onClick={()=> setMore(true)} style={{position: 'absolute', right: '0', bottom: '0', backgroundColor: 'white', zIndex: '2', paddingLeft: '0.25rem', fontWeight: '600'}}>more
        <BiChevronDown style={{fontSize: '1rem'}}></BiChevronDown>
        </div>  : null}
      </Text>      
     
        </div>
      {/* </GridContainer> */}

    </Container>
  );
}


export default Overview;
