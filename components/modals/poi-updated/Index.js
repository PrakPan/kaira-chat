import React, {useEffect} from 'react';
import {Modal} from 'react-bootstrap';
import Overview from '../poi/Overview/Overview';
import styled from 'styled-components';
import About from '../poi/aboutus/About';
import GettingAround from '../poi/GettingAround';
import Recommendations from '../poi/Recommendations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import Tabs from '../poi/tabs/Index';
import Body from './Body';
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  &:hover{
    cursor: pointer;
  }
`;
const POI = (props) => {

  
  return(
      <div>
        <Modal show={props.show}  id="poi-modal" size="lg"  onHide={props.onHide} style={{backgroundColor: 'transparent'}}>
            <Modal.Header style={{borderStyle: "solid solid none solid", borderColor: "#F7e700", borderWidth: "0.5rem", borderRadius: '16px 16px 0 0', height: '7.5vh', backgroundColor: 'white'}}>
              <StyledFontAwesomeIcon onClick={props.onHide} icon={faChevronLeft}></StyledFontAwesomeIcon>
            </Modal.Header>
            <Modal.Body style={{ height: '92.5vh', overflowY: 'auto', borderStyle: "none solid solid solid", borderColor: "#F7e700", borderWidth: "0.5rem", borderRadius: '0  0 16px 16px', backgroundColor: 'white', padding: '0'}}>
              <Body poi={props.poi}></Body>


            </Modal.Body>
      </Modal>
      </div>
  );

}

export default POI;