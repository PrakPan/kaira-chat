import React, {useState} from 'react';
 import 'bootstrap/dist/css/bootstrap.min.css';

import media from '../../components/media';
 import Checkbox from './Checkbox';
import styled from 'styled-components';
  const Container = styled.div`
  position: relative;
   @media screen and (min-width: 768px){
 
}

`;
const Button = styled.div`
    background-color: #f7e700;
    border-radius: 5px;
    padding: 6px 10px;
    font-weight: 600;
    color: black;
`;
const Pannel = styled.div`
    height: max-content;
    position: absolute;
     float: right;
    padding: 0.5rem;
    background-color: white;
    border-radius: 5px;
      margin-top: 0.25rem;
`;
 
const  DropDown = (props) =>{

  let isPageWide = media('(min-width: 768px)');
  const [open, setOpen] = useState(false);
  
  return (
   <Container>
      <Button onClick={() => setOpen(!open)} className='hover-pointer'>Duration</Button>
      {open ? <Pannel className='border'>
       
        <Checkbox></Checkbox>
        <Checkbox></Checkbox>
        <Checkbox></Checkbox>
        <Checkbox></Checkbox>
        <Checkbox></Checkbox>

      </Pannel> : null}
    </Container>
  );
}


export default DropDown;

