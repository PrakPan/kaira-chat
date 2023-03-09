import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import media from '../../../media';
import Bar from './Bar';
import Pannel from './pannel/Index';
import axioslocationsinstance from '../../../../services/poi/hotlocations';
const Container = styled.div`
width: 50%;
margin: auto;

`;


const MobileSearch= (props) => {
  let isPageWide = media('(min-width: 768px)')
    const [pannelOpen, setPannelOpen] = useState(false);
    
    return(
        <Container>
             <Bar setPannelOpen={() => setPannelOpen(true)} hidden={ pannelOpen ? true : false} ></Bar>
           {pannelOpen ? <Pannel setPannelClose={() => setPannelOpen(false)}></Pannel> :      null      } 
        </Container>
    );
}

export default MobileSearch;
