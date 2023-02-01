import React, {useState, useEffect} from 'react';
import styled , {keyframes} from 'styled-components';
import media from '../../../media';
import Bar from './Bar';
import Pannel from './pannel/Index';
import axioslocationsinstance from '../../../../services/poi/hotlocations';

import { fadeIn } from 'react-animations'

const fadeInAnimation = keyframes`${fadeIn}`;

const Container = styled.div`
width: 600px;
margin: auto;
animation: 0.3s ${fadeInAnimation};

`;

const BlackContainer = styled.div`
  background-color: rgba(0,0,0,0.4);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  

`;
const MobileSearch= (props) => {
  let isPageWide = media('(min-width: 768px)')
    const [pannelOpen, setPannelOpen] = useState(false);
    const [hotLocationsData, setHotLocationsData] = useState();
    
    useEffect(() => {
         axioslocationsinstance.get("").then(response => {
                  setHotLocationsData(response.data);
             });
       },[]);
    return(
        <Container>
             <BlackContainer onClick={props.onclose}></BlackContainer> 
             <Bar setPannelOpen={() => setPannelOpen(true)} hidden={ pannelOpen ? true : false} ></Bar>
           {true ? <Pannel hotlocations={hotLocationsData} setPannelClose={() => setPannelOpen(false)}></Pannel> :      null      } 
        </Container>
    );
}

export default MobileSearch;
