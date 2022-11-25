import React from 'react';
import styled from 'styled-components'
import BackgroundImageLoader  from './UpdatedBackgroundImageLoader';


const Container = styled.div`

    width: 100%;

    padding: 0;
    height: 60vh;
    @media screen and (min-width: 768px){
        height: 85vh;
        padding: 0;
    }

    position: relative;
    `;

const fullimage = (props) =>{
    
     if(props.center){
        return(
        <Container>
            {props.img ? <BackgroundImageLoader  center url={props.url} dimensions={{width: 1600, height: 900}} dimensionsMobile={{width: 900, height: 600}} className="center-div" style={{backgroundImage: `url(${props.img})`}}>{props.children}</BackgroundImageLoader> : <BackgroundImageLoader  center className="center-div" url={props.url} dimensions={{width: 1600, height: 900}}  className="center-div">{props.children}</BackgroundImageLoader>}
        </Container>
        
    )
    }
    else{ 
        return(
        <Container className="center-dv">
 <BackgroundImageLoader  url={props.url} dimensions={{width: 1600, height: 900}}  dimensionsMobile={{width: 900, height: 600}} className="center-dv">{props.children}</BackgroundImageLoader>       
  </Container>
    );
    }
}

export default fullimage;