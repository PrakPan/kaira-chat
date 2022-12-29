import React, {useState, useEffect } from 'react';
  
import media from '../../media';
 
import styled from 'styled-components';
 import Pax from './pax/Index';
 import GroupType from './GroupType';
 import Question from '../Question';
 import Budget from './Budget';
 import {AiFillCaretDown} from 'react-icons/ai'
const Container = styled.div`
color: black;
width: 100%;
  @media screen and (min-width: 768px){
 
}

`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;
 
const SlideTwo = (props) =>{
    const [showPax, setShowPax] = useState(false);

  let isPageWide = media('(min-width: 768px)');
  
  return (
   <Container>
    <Section style={{marginBottom: '1.5rem'}}>
        <Question>How many travelers?</Question>
        {showPax ? <Pax></Pax> : 
        <GroupType setShowPax={setShowPax}></GroupType>}
        </Section>
        <Section>
         <Question className="font-opensans">What's your budget?</Question>
         <Budget setShowPax={setShowPax}></Budget>
         </Section>
         <div style={{display: 'flex'}}>
         <Question>What's kind of activities?</Question>
          <div style={{flexGrow: '1', textAlign: 'right'}}>
            <AiFillCaretDown style={{verticalAlign: 'initial'}} className="hover-pointer"> </AiFillCaretDown>
          </div>
         </div>
    </Container>
  );
}


export default SlideTwo;

