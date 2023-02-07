import React, {useState, useRef, useEffect, createRef} from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

import media from '../../components/media';
import * as ga from '../../services/ga/Index';

import styled from 'styled-components';
import ImageLoader from '../../components/ImageLoader';
import Heading from '../../components/newheading/heading/Index';
import {BiChevronDown} from 'react-icons/bi'
import Map from './Map'
const Container = styled.div`
 
@media screen and (min-width: 768px){
 
    width: 90%;
    margin: auto;
    padding: 1rem 0;
}

`;
const GridContainer = styled.div`
    
    display: grid;
    grid-gap: 30px;

    @media screen and (min-width: 768px){
        width: 100%;
        grid-template-columns: auto 400px;
        grid-gap: 30px;
        margin: auto;
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
margin: 0 0.5rem;
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
const  Overview = (props) =>{

  let isPageWide = media('(min-width: 768px)');
  const [more, setMore] = useState(false);
  
  return (
   <Container>
    <GridContainer>
      <div>
        <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "2.55rem 0"}  bold>{props.overview_heading}</Heading>        
      <Text more={more} className='font-opensans'>
        <p>{props.overview_text}</p>
        {!more ? <div className='hover-pointer' onClick={()=> setMore(true)} style={{position: 'absolute', right: '0', bottom: '0', backgroundColor: 'white', zIndex: '2', paddingLeft: '0.25rem', fontWeight: '600'}}>more
        <BiChevronDown style={{fontSize: '1rem'}}></BiChevronDown>
        </div>  : null}
      </Text>      
     
        </div>
        {props.locations ? props.locations.length ? <div style={{padding: !isPageWide ?  '0 0.5rem' : '2.5rem 0 0 0'}}><Map locations={props.locations}></Map></div> : null : null}
      </GridContainer>
    </Container>
  );
}


export default Overview;

