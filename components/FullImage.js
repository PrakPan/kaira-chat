import React from 'react';
import styled from 'styled-components'
import BackgroundImageLoader  from './UpdatedBackgroundImageLoader';


const Container = styled.div`

    width: 100%;

    padding: 0;
    height: ${(props) => (props.heightmobile ? props.heightmobile : "60vh")};
    @media screen and (min-width: 768px){
        height: ${(props) => (props.height ? props.height : "85vh")};
        padding: 0;
    }

    position: relative;
    `;

const fullimage = (props) =>{
    
     if(props.center){
        return(
        <Container height={props.height} heightmobile={props.heightmobile}>
            {props.img ? <BackgroundImageLoader filter={props.filter}  center url={props.url} dimensions={{width: 1600, height: 900}} dimensionsMobile={{width: 900, height: 600}} className="center-div" >{props.children}</BackgroundImageLoader> : <BackgroundImageLoader filter={props.filter} center className="center-div" url={props.url} dimensions={{width: 1600, height: 900}}  className="center-div">{props.children}</BackgroundImageLoader>}
        </Container>
        
    )
    }
    else{ 
        return(
        <Container height={props.height} heightmobile={props.heightmobile} className="center-dv">
 <BackgroundImageLoader filter={props.filter} url={props.url} dimensions={{width: 1600, height: 900}}  dimensionsMobile={{width: 900, height: 600}} className="center-dv">{props.children}</BackgroundImageLoader>       
  </Container>
    );
    }
}

export default fullimage;