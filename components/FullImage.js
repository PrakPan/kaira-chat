import React from 'react';
import styled from 'styled-components'
import BackgroundImageLoader  from './UpdatedBackgroundImageLoader';


const Container = styled.div`

    width: 100%;

    padding: 0;
    // margin-top : 70px;
    height: ${(props) => (props.heightmobile ? props.heightmobile : "37rem")};
    @media screen and (min-width: 768px){
        height: ${(props) => (props.height ? props.height : "37rem")};
        padding: 0;
    }
    
    position: relative;
    `;
const fullimage = (props) =>{
    
     if(props.center){
        return(
        <Container height={props.height} heightmobile={props.heightmobile}>

            {props.img ? <BackgroundImageLoader padding={props.padding} filter={props.filter}  center url={props.url} dimensions={{width: 3206, height: 1202}} dimensionsMobile={{width: 900, height: 1200}} className="center-div" >{props.children}</BackgroundImageLoader> : <BackgroundImageLoader filter={props.filter} center className="center-div" url={props.url} dimensions={{width: 1806, height: 592}} dimensionsMobile={{width: 900, height: 1200}}>{props.children}</BackgroundImageLoader>}
        </Container>
        
    )
    }
    else{ 
        return(
        <Container height={props.height} heightmobile={props.heightmobile} className="center-dv">

 <BackgroundImageLoader padding={props.paddinzg}  filter={props.filter} url={props.url} dimensions={{width: 3206, height: 1202}} dimensionsMobile={{width: 900, height: 1200}} className="center-dv">{props.children}</BackgroundImageLoader>       
  </Container>
    );
    }
}

export default fullimage;