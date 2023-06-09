import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import media from '../../../media';
import Bar from './Bar';
import Pannel from './pannel/Index';
const Container = styled.div`
width: 100%;


`;


const MobileSearch= (props) => {
   let isPageWide = media('(min-width: 768px)')
    const [pannelOpen, setPannelOpen] = useState(false);
    useEffect(() => {
             if(props.open) setPannelOpen(true)
       },[pannelOpen]);
       const _handlePannelClose = () => {
         setPannelOpen(false);
         if(props.onclose) props.onclose();
       }
    return(
        <Container>
      
           {pannelOpen ? <Pannel setPannelClose={_handlePannelClose}></Pannel> : <Bar setPannelOpen={() => setPannelOpen(true)}></Bar>} 
        </Container>
    );
}

export default MobileSearch;
