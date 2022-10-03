import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Details from './Details';
import media from '../../components/media';


const HeaderExtraPadding = styled.div`
height: 3vh;
background-color: white;
z-index: 1000; 
position: sticky;
top: 7.5vh;
`;

const SimpleTabs = (props) => {

  let isPageWide = media('(min-width: 768px)')


    useEffect(() => {
  
    });
    

 

  // if(props.guideLoaded)
  return (
    <div>
    
      
            <Details    guideLoaded={props.guideLoaded} data={props.data} ></Details>
     
    </div> 
  );
  // else return <div></div>
}


export default React.memo((SimpleTabs));