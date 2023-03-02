import React, {useState, useEffect} from 'react';
  
 import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAccordion from '@material-ui/core/Accordion';
import { withStyles } from '@material-ui/styles';
import Email from './Email';
import Id from './Id';
import Grid from '@material-ui/core/Grid';
import axiosgitregisterinstance from '../../../../../services/sales/git/register';
import Button from '../../../../ui/button/Index';
import Spinner from '../../../../Spinner';
import styled from  'styled-components';
import {AiOutlinePlusSquare} from 'react-icons/ai';
import media from '../../../../media';

const GridContainer = styled.div`
  dislpay: grid;
  grid-template-columns: auto max-content;
`;
 
const Person = (props) => {
  let isPageWide = media('(min-width: 768px)')

     

    useEffect(() => {
         
      },[]);

        
  return(
      <GridContainer className='border'>
        <div>name@pw.live</div>
        <div>Invited</div>
      </GridContainer>
  );

}

export default Person;