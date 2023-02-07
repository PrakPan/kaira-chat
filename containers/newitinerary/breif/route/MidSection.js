import styled from 'styled-components';
import { useState, useEffect } from 'react';
// import Pin from './Pin';
 import {MdOutlineFlightTakeoff} from 'react-icons/md';
const  Container = styled.div`
display: grid;
grid-template-columns: 30px auto;
min-height: 10vw;
`;
// const Heading = styled.div`
//     font-weight: 600;
//     margin: 0 0 0 0.75rem;
//     line-height: 24px;
//     display: flex;
//     align-items: center;
// `;
 const Line = styled.div`
    border-style: dashed;
    border-width: 1px;
    position: absolute;
    left: 50%;
    min-height: 10vw;
    height: 100%;
 `;
 const Text = styled.div`
    display: flex;
    align-items: center;
    margin: 0.75rem 0 0.75rem 0.75rem;

    
 `;
const MidSection = (props) => {
   
    useEffect(() => {
      
    },[]);

    return(
        <Container className='font-poppins'>
           <div style={{position: 'relative'}}>
                <Line></Line>
           </div>
           <Text>
            <MdOutlineFlightTakeoff style={{fontSize: '1.75rem', marginRight: '0.5rem'}}/>
            Fly: 2h 30m
            </Text>
            {/* <Heading>{props.duration ? props.location +  " ("+ props.duration+")": props.location }</Heading> */}
        </Container>
        
    );
 }

export default MidSection;