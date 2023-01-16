import React, {useState, useEffect } from 'react';
  
import media from '../../media';
 
import styled  from 'styled-components';
 import Pax from './pax/Index';
 import GroupType from './GroupType';
 import Question from '../Question';
 import Budget from './Budget';
 import {AiFillCaretDown} from 'react-icons/ai'
 import Preferences from './preferences/Index';

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
    const [showPreferences, setShowPreferences] = useState(false);
    // const [selectedPreferences, setSelectedPreferences] = useState([]);
  let isPageWide = media('(min-width: 768px)');
  const _handleShowPax = (grouptype) => {
    props.setGroupType(grouptype);
    if(grouptype === 'Friends' || grouptype === 'Family'){
      // props.setNumberOfAdults(2);
    setShowPax(true);
  
    }
  }
  return (
   <Container>
    <Section style={{marginBottom: '1.5rem'}}>
        <Question>How many travelers?</Question>
        {showPax ? <Pax
         numberOfAdults={props.numberOfAdults}
         setNumberOfAdults={props.setNumberOfAdults}
         numberOfChildren={props.numberOfChildren} 
         setNumberOfChildren={props.setNumberOfChildren}
         numberOfInfants={props.numberOfInfants}
         setNumberOfInfants={props.setNumberOfInfants}
        ></Pax> : 
        <GroupType setShowPax={setShowPax} _handleShowPax={_handleShowPax}></GroupType>}
        </Section>
        <Section>
         <Question className="font-opensans">What's your budget?</Question>
         <Budget setShowPax={setShowPax}
         setBudget ={props.setBudget }
          ></Budget>
         </Section>
         <div style={{display: 'flex'}} onClick={() => setShowPreferences(!showPreferences)}>
         <Question  hover_pointer>What's kind of activities?</Question>
          <div style={{flexGrow: '1', textAlign: 'right'}}>
            <AiFillCaretDown  style={{verticalAlign: 'initial'}} className="hover-pointer"> </AiFillCaretDown>
          </div>


         </div>
         {showPreferences ? <Preferences selectedPreferences={props.selectedPreferences} setSelectedPreferences={props.setSelectedPreferences}></Preferences> : null}

    </Container>
  );
}


export default SlideTwo;

