import React, { useState } from 'react';
import styled from 'styled-components'
// import Image from 'next-images'
const Fullimage = (props) =>{
    const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
    const [load, setLoad] = useState(false);
    const smallUrl = imgUrlEndPoint + "160x90"+"/"+props.url;
    const fullUrl = imgUrlEndPoint + "1600x900" + "/" + props.url;
    const Container = styled.div`
    background-image: linear-gradient(rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.3)), url(${props.url && smallUrl ? smallUrl : ''});
    width: 100%;
    height: 50vh;
    
    background-repeat: no-repeat;
    background-size: cover;
    @media screen and (min-width: 768px){
        height: 100vh;
        background-position: center;
    }
    overflow: hidden;
    position: relative;
    `;
    if (
        typeof window !== 'undefined' &&
        typeof document != 'undefined' && fullUrl && smallUrl
      ) {
    var bgImg = document.createElement('img');
    bgImg.src = fullUrl;
    bgImg.onload = () => {
        setLoad(true);
    }
}
         return(
        <div>
           <Container className="" style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("+fullUrl+")" , display: load ? 'visible' : 'none'}}>{props.children}</Container>
           <Container className="" style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("+smallUrl+")", display: load ? 'none' : 'visible'}}>{props.children}</Container>
        </div>
    );


    
}

export default Fullimage;