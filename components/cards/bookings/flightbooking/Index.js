import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components'
//  import { getHumanDate } from '../../../../services/getHumanDate';
  import SectionOne from './sectionone/Index';
import SectionTwo from './sectiontwo/Index';
  import media from '../../../media';
 import SectionThree from './SectionThree';
import SectionFour from './SectionFour';
 const Container = styled.div`
    width: 100%;        
    background-color: white;
     border-radius: 10px;
    display: flex;
    flex-flow: column;
    height: 100%;
    @media screen and (min-width: 768px){
        border-radius: 10px;
        position: relative;

    }
    
`;

 
 
 
const Booking = (props) =>{
    let isPageWide = media('(min-width: 768px)')

    

  
    const detailsarr=[]
    for(var i=0; i<props.details.length; i++){
        if(props.details[i].length)
        detailsarr.push(
            <li className={props.blur ? 'blurry-text' : ''} style={{fontSize: "0.75rem",  margin: "0.5rem 0 0.5rem 0rem", fontWeight: "300"}} >{props.details[i]}</li>
        );
    }
  
 
 

  console.log('1')
 
    //  if(isPageWide)
    return(
        <Container className='border' style={{ borderRadius: "10px"}}>
         <SectionOne data={props.data}></SectionOne>
         <SectionTwo data={props.data}></SectionTwo>
         <SectionThree data={props.data}></SectionThree>
         <SectionFour></SectionFour>
        </Container>
    );
 
}

export default  (Booking);