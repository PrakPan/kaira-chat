import {ImPinterest2} from 'react-icons/im';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
 
 const  Container = styled.div`
 display: flex;

`;
 

const Socials = (props) => {
   
    useEffect(() => {
      
    },[]);

    return(
        <Container className='font-poppins'>
            <ImPinterest2 style={{marginRight: '0.75rem', fontSize: '1.25rem'}}></ImPinterest2>
            <ImPinterest2 style={{marginRight: '0.75rem', fontSize: '1.25rem'}}></ImPinterest2>
            <ImPinterest2 style={{marginRight: '0.75rem', fontSize: '1.25rem'}}></ImPinterest2>
            <ImPinterest2 style={{marginRight: '0.75rem', fontSize: '1.25rem'}}></ImPinterest2>
            <ImPinterest2 style={{marginRight: '0.75rem', fontSize: '1.25rem'}}></ImPinterest2>


        </Container>
        
    );
 }

export default Socials;