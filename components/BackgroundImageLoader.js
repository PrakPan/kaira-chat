import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components';
const Container = styled.div`
margin: 0 auto;
background-position: center;
background-repeat: no-repeat;
background-size: cover;
height: 60vh;
 
@media screen and (min-width: 768px){
  height: 85vh;
}

`;
const BackgroundImageLoader = (props) => {
  // background-image: ${props.filters}, url(${`${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`});

    const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
    let imageRequest;
    if(props.dimensions)
      imageRequest = JSON.stringify({
      bucket: "thetarzanway-web",
      key: props.url,
      edits: {
        resize: {
          width: props.dimensions.width,
          height: props.dimensions.height,
          fit: "cover"
        }
      }
    });
    else if(props.dimensionsMobile){
      imageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            width: props.dimensionsMobile.width,
            height: props.dimensionsMobile.height,
            fit: "cover"
          }
        }
      });
    }
    else imageRequest = JSON.stringify({
      bucket: "thetarzanway-web",
      key: props.url,
      edits: {
        resize: {
          width: 400,
          height: 300,
          fit: "cover"
        }
      }
    });
  
   

    // background-image: linear-gradient(180deg, rgba(0, 0, 0,0) 50%,
    // rgba(0, 0, 0, 0.8) 100%), url(${`${imgUrlEndPoint}/${btoa(imageRequest)}`});
    if(!props.height)
    return(
        <Container
        className={props.center ? "center-div" : ""}
        style={{backgroundImage: props.filter? props.filter+`, url(${`${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`})`: `linear-gradient(180deg, rgba(0, 0, 0,0) 0%, rgba(0, 0, 0, 0.8) 100%), url(${`${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`})`, width: props.width ? props.width : '100%', padding: props.padding ? props.padding : '10vh 0 0 0', maxWidth: '100%'}}
        >
           {/* <div style={{position: 'absolute', bottom: '0', color: 'white'}}>1</div> */}
           {props.children}
        </Container>
    );
    else return(
      <Container
        className={props.center ? "center-div" : ""}
        style={{backgroundImage: props.filter? props.filter+`, url(${`${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`})`: `linear-gradient(180deg, rgba(0, 0, 0,0) 0%, rgba(0, 0, 0, 0.8) 100%), url(${`${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`})`, width: props.width ? props.width : '100%', padding: props.padding ? props.padding : '10vh 0 0 0', maxWidth: '100%', height: props.height}}
        >
           {/* <div style={{position: 'absolute', bottom: '0', color: 'white'}}>1</div> */}
           {props.children}
        </Container>
    )
}

export default BackgroundImageLoader;