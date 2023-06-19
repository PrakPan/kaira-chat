import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ImageLoader from "./ImageLoader";

const SaifBackgroundImageLoader = (props) => {
   const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
   const FullContainer = styled("div")`
     margin: 0 auto;
     background-position: center;
     background-repeat: no-repeat;
     background-size: cover;
     height: 30rem;
     padding: ${(props) => (props.padding ? props.padding : "2rem 0 0 0")};

     @media screen and (min-width: 768px) {
       height: 37rem;
       padding: ${(props) => (props.padding ? props.padding : "2rem 0 0 0")};
     }
   `;
   const imageRequest = JSON.stringify({
     bucket: "thetarzanway-web",
     key: props.url,
     edits: {
       resize: {
         width: 1,
         height: 1,
         fit: "cover",
       },
     },
   });
  return (
    <>
      <FullContainer
        className={props.center ? "center-div " : ""}
        padding={props.padding}
        style={{
          backgroundImage: `url(${`${imgUrlEndPoint}/${Buffer.from(
            imageRequest
          ).toString("base64")}`})`,
          width: props.width ? props.width : "100%",
          maxWidth: "100%",
          height: props.height ? props.height : "100%",
          display: "flex",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          borderRadius: props.borderRadius ? props.borderRadius : "0",
          position: "relative",
          // overflow: "hidden",
          backgroundColor: "#7e7e7e",
          ...props.style,
        }}
      >
        <div
          style={{
            position: "absolute",
            zIndex: "0",
            top: "0",
            left: "0",
            height: "100%",
            width: "100%",
            borderRadius: props.borderRadius ? props.borderRadius : "0",
          }}
        >
          <ImageLoader
            noLazy={props.noLazy}
            url={props.url}
            style={{ filter: props.filter }}
            height="100%"
            width="100%"
            dimensions={props.dimensions}
            dimensionsMobile={props.dimensionsMobile}
            borderRadius={ props.borderRadius ? props.borderRadius : "0"}

          />
        </div>
        <div
          style={{
            position: "static",
            zIndex: "2",
            width: "100%",
            height: "100%",
          }}
        >
          {props.children}
        </div>
      </FullContainer>
    </>
  );
};

export default SaifBackgroundImageLoader;


//old code :-

// import React, {useState, useRef, useEffect} from 'react';
// import styled from 'styled-components';
// import media from './media';
// import LazyLoad from 'react-lazyload';


// const BackgroundImageContainer=styled.img`
// // filter: blur(6px);
// position: absolute;
// z-index: -1;
// background-position: center;
// `
// const ContentContainer=styled.div`
// padding: ${props => props.padding ? props.padding : '20vw 0 0 0'};

// display: flex;
//     flex-direction: column;
//     justify-content: center;
//     @media screen and (min-width: 768px){
//       padding: ${props => props.padding ? props.padding : '10vh 0 0 0'};

//     }

// `

// const SaifBackgroundImageLoader = (props) => {
  
//   let isPageWide = media('(min-width: 768px)')

//     const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
//     let imageRequest;
//     const [fullLoaded, setFullLoaded] = useState(false);
//   const fullImageLoadedHandler = () => {
//     if (props.onload) props.onload();
//       setFullLoaded(true);
//   };

// const [JSX, setJSX] = useState("");
// useEffect(() => {
//     let smallImageRequest = JSON.stringify({
//         bucket: "thetarzanway-web",
//         key: props.url,
//         edits: {
//           resize: {
           
//             width: 160,
//             height: 90,
//             fit: "cover",
//           },
//         },
//       });
//       let smallImageRequestSlider = JSON.stringify({
//         bucket: "thetarzanway-web",
//         key: props.url,
//         edits: {
//           resize: {
//             width: 40,
//             height: 30,
           
//             fit: "cover",
//           },
//         },
//       });
//       if(isPageWide){
//     if(props.dimensions){
//       imageRequest = JSON.stringify({
//       bucket: "thetarzanway-web",
//       key: props.url,
//       edits: {
//         resize: {
//           width: props.dimensions.width,
//           height: props.dimensions.height,
//           fit: "cover"
//         }
//       }
//     });
//     smallImageRequest = JSON.stringify({
//       bucket: "thetarzanway-web",
//       key: props.url,
//       edits: {
//         resize: {
//           width: Math.round(props.dimensions.width / 100),
//           height: Math.round(props.dimensions.height / 100),
//           fit: "cover",
//         },
//       },
//     });
//   }
//   else {
//     imageRequest = JSON.stringify({
//     bucket: "thetarzanway-web",
//     key: props.url,
//     edits: {
//       resize: {
//         width: 400,
//         height: 300,
//         fit: "cover"
//       }
//     }
//   });
//   smallImageRequest = JSON.stringify({
//     bucket: "thetarzanway-web",
//     key: props.url,
//     edits: {
//       resize: {
//         width: 40,
//         height: 30,
//         fit: "cover"
//       }
//     }
//   });

// }
// }
//     else {
//       if(props.dimensionsMobile){
//       imageRequest = JSON.stringify({
//         bucket: "thetarzanway-web",
//         key: props.url,
//         edits: {
//           resize: {
//             width: props.dimensionsMobile.width,
//             height: props.dimensionsMobile.height,
//             fit: "cover"
//           }
//         }
//       });
//       smallImageRequest = JSON.stringify({
//         bucket: "thetarzanway-web",
//         key: props.url,
//         edits: {
//           resize: {
//             width: Math.round(props.dimensionsMobile.width/100),
//             height: Math.round(props.dimensionsMobile.height/100),
//             fit: "cover"
//           }
//         }
//       });
//     }
//     else {
//       imageRequest = JSON.stringify({
//       bucket: "thetarzanway-web",
//       key: props.url,
//       edits: {
//         resize: {
//           width: 400,
//           height: 300,
//           fit: "cover"
//         }
//       }
//     });
//     smallImageRequest = JSON.stringify({
//       bucket: "thetarzanway-web",
//       key: props.url,
//       edits: {
//         resize: {
//           width: 40,
//           height: 30,
//           fit: "cover"
//         }
//       }
//     });

//   }
//   }

//   const SmallContainer = styled(props.noLazy ? "div" : LazyLoad)`
//     position: relative;
//     margin: 0 auto;
//     background-position: center;
//     background-repeat: no-repeat;
//     background-size: cover;
//     height: 30rem;
//     @media screen and (min-width: 768px) {
//       height: 37rem;
//     }
//   `;
//   const FullContainer = styled(props.noLazy ? "div" : LazyLoad)`
//     margin: 0 auto;
//     background-position: center;
//     background-repeat: no-repeat;
//     background-size: cover;
//     height: 30rem;
//     padding: ${(props) => (props.padding ? props.padding : "2rem 0 0 0")};

//     @media screen and (min-width: 768px) {
//       height: 37rem;
//       padding: ${(props) => (props.padding ? props.padding : "2rem 0 0 0")};
//     }
//   `;

   
   
//     const img = new Image();
//     img.src = `${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`;
//     img.decode().then(() => {
//       // document.body.appendChild(img);
//       fullImageLoadedHandler();
//     });
//     setJSX(
//         <>
//         <SmallContainer
//         className={props.center ? "center-div" : ""}
//         style={{display: !fullLoaded ? "flex" : "none",width: props.width ? props.width : '100%',  maxWidth: '100%',height:props.height ? props.height : "100%", padding: props.padding ? props.padding : '0', }}
//         >
//           <BackgroundImageContainer  style={{backgroundImage : props.filter ?props.filter+ `,url(${`${imgUrlEndPoint}/${Buffer.from(smallImageRequest).toString('base64')}`})`:(props.position? `linear-gradient(180deg, rgba(0, 0, 0,0) 0%, rgba(0, 0, 0, 0.8) 100%), url(${`${imgUrlEndPoint}/${Buffer.from(smallImageRequest).toString('base64')}`})`:`linear-gradient(180deg, rgba(0, 0, 0,0) 0%, rgba(0, 0, 0, 0.8) 100%), url(${`${imgUrlEndPoint}/${Buffer.from(smallImageRequest).toString('base64')}`})`),width: props.width ? props.width : '100%', padding: props.padding ? props.padding : '0', maxWidth: '100%',height:props.height ? props.height : "100%",backgroundRepeat: 'no-repeat',backgroundSize:'cover',zIndex:props.position ? "0":"-1"}}></BackgroundImageContainer>
//           <ContentContainer padding={props.padding} style={{width: props.width ? props.width : '100%', maxWidth: '100%',height:props.height ? props.height : "100%", visibility: 'hidden'}}  >

//            {props.children}
//            </ContentContainer>
//         </SmallContainer>
//         <FullContainer
//             className={props.center ? "center-div " : ""}
//             padding={props.padding}
//         style={{backgroundImage: props.filter? props.filter+`, url(${`${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`})`: `url(${`${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`})`, width: props.width ? props.width : '100%',  maxWidth: '100%',height:props.height ? props.height : "100%",display: fullLoaded ? "flex" : "none",backgroundRepeat: 'no-repeat',backgroundPosition:"center",backgroundSize:"cover", borderRadius: props.borderRadius ? props.borderRadius : '0'}}
//         >
         
//            {props.children}
//         </FullContainer>
//         </>
//     );
    
//   }, [props.dimensions, props.dimensionsMobile,props.height,fullLoaded]);

// return(
//     <>
//     {JSX}
//     </>
// )
    
// }

// export default SaifBackgroundImageLoader;
