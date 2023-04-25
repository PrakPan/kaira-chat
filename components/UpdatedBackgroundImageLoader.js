// import build from '@date-io/date-fns';
import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components';
import media from './media';

const SmallContainer = styled.div`
 position: relative;
margin: 0 auto;
background-position: center;
background-repeat: no-repeat;
background-size: cover;
height: 30rem;
@media screen and (min-width: 768px){
  height: 37rem;
}


`;
const BackgroundImageContainer=styled.img`
filter: blur(6px);
position: absolute;
z-index: -1;
background-position: center;
`
const ContentContainer=styled.div`
padding: ${props => props.padding ? props.padding : '20vw 0 0 0'};

display: flex;
    flex-direction: column;
    justify-content: center;
    @media screen and (min-width: 768px){
      padding: ${props => props.padding ? props.padding : '10vh 0 0 0'};

    }

`
const FullContainer = styled.div`
margin: 0 auto;
background-position: center;
background-repeat: no-repeat;
background-size: cover;
height: 30rem;
padding: ${props => props.padding ? props.padding : '20vw 0 0 0'};

@media screen and (min-width: 768px){
  height: 37rem;
  padding: ${props => props.padding ? props.padding : '2rem 0 0 0'};

}

`;
const SaifBackgroundImageLoader = (props) => {
  let isPageWide = media('(min-width: 768px)')

    const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
    let imageRequest;
    const [fullLoaded, setFullLoaded] = useState(false);
    const fullImageLoadedHandler = () => {
      setFullLoaded(true);
    };
const [JSX, setJSX] = useState("");
useEffect(() => {
    let smallImageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
           
            width: 160,
            height: 90,
            fit: "cover",
          },
        },
      });
      let smallImageRequestSlider = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            width: 40,
            height: 30,
           
            fit: "cover",
          },
        },
      });
      if(isPageWide){
    if(props.dimensions){
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
    smallImageRequest=JSON.stringify({
      bucket: "thetarzanway-web",
      key: props.url,
      edits: {
        resize: {
          width: Math.round(props.dimensions.width/100),
          height: Math.round(props.dimensions.height)/100,
          fit: "cover"
        }
      }
    });
  }
  else {
    imageRequest = JSON.stringify({
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
  smallImageRequest = JSON.stringify({
    bucket: "thetarzanway-web",
    key: props.url,
    edits: {
      resize: {
        width: 40,
        height: 30,
        fit: "cover"
      }
    }
  });

}
}
    else {
      if(props.dimensionsMobile){
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
      smallImageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.url,
        edits: {
          resize: {
            width: Math.round(props.dimensionsMobile.width/100),
            height: Math.round(props.dimensionsMobile.height)/100,
            fit: "cover"
          }
        }
      });
    }
    else {
      imageRequest = JSON.stringify({
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
    smallImageRequest = JSON.stringify({
      bucket: "thetarzanway-web",
      key: props.url,
      edits: {
        resize: {
          width: 40,
          height: 30,
          fit: "cover"
        }
      }
    });

  }
  }

   
   
    const img = new Image();
    img.src = `${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`;
    img.decode().then(() => {
      // document.body.appendChild(img);
      fullImageLoadedHandler();
    });
    setJSX(
        <>
        <SmallContainer
        className={props.center ? "center-div" : ""}
        style={{display: !fullLoaded ? "flex" : "none",width: props.width ? props.width : '100%',  maxWidth: '100%',height:props.height ? props.height : "100%", padding: props.padding ? props.padding : '0', }}
        >
          <BackgroundImageContainer  style={{backgroundImage : props.filter ?props.filter+ `,url(${`${imgUrlEndPoint}/${Buffer.from(smallImageRequest).toString('base64')}`})`:(props.position? `linear-gradient(180deg, rgba(0, 0, 0,0) 0%, rgba(0, 0, 0, 0.8) 100%), url(${`${imgUrlEndPoint}/${Buffer.from(smallImageRequest).toString('base64')}`})`:`linear-gradient(180deg, rgba(0, 0, 0,0) 0%, rgba(0, 0, 0, 0.8) 100%), url(${`${imgUrlEndPoint}/${Buffer.from(smallImageRequest).toString('base64')}`})`),width: props.width ? props.width : '100%', padding: props.padding ? props.padding : '10vh 0 0 0', maxWidth: '100%',height:props.height ? props.height : "100%",backgroundRepeat: 'no-repeat',backgroundSize:'cover',zIndex:props.position ? "0":"-1"}}></BackgroundImageContainer>
          <ContentContainer padding={props.padding} style={{width: props.width ? props.width : '100%', maxWidth: '100%',height:props.height ? props.height : "100%", visibility: 'hidden'}}  >

           {props.children}
           </ContentContainer>
        </SmallContainer>
        <FullContainer
            className={props.center ? "center-div " : ""}
            padding={props.padding}
        style={{backgroundImage: props.filter? props.filter+`, url(${`${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`})`: `url(${`${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`})`, width: props.width ? props.width : '100%',  maxWidth: '100%',height:props.height ? props.height : "100%",display: fullLoaded ? "flex" : "none",backgroundRepeat: 'no-repeat',backgroundPosition:"center",backgroundSize:"cover", borderRadius: props.borderRadius ? props.borderRadius : '0'}}
        >
         
           {props.children}
        </FullContainer>
        </>
    );
    
  }, [props.dimensions, props.dimensionsMobile,props.height,fullLoaded]);

return(
    <>
    {JSX}
    </>
)
    
}

export default SaifBackgroundImageLoader;

// import React, {useState, useRef, useEffect} from 'react';
// import styled from 'styled-components';
// const SmallContainer = styled.div`
//  position: relative;
// margin: 0 auto;
// background-position: center;
// background-repeat: no-repeat;
// background-size: cover;
// height: 60vh;



 
// @media screen and (min-width: 768px){
//   height: 85vh;
// }


// `;
// const BackgroundImageContainer=styled.img`
// filter: blur(6px);
// position: absolute;
//  z-index: -1; 
// `
// const ContentContainer=styled.div`
// padding: 10vh 0 0 0;

// `
// const FullContainer = styled.div`
// margin: 0 auto;
// background-position: center;
// background-repeat: no-repeat;
// background-size: cover;
// height: 60vh;
 
// @media screen and (min-width: 768px){
//   height: 85vh;
// }

// `;
// const SaifBackgroundImageLoader = (props) => {
//     const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
//     let imageRequest;
//     const [fullLoaded, setFullLoaded] = useState(false);
//     const fullImageLoadedHandler = () => {
//       setFullLoaded(true);
//     };
// const [JSX, setJSX] = useState("");
// useEffect(() => {
//     let smallImageRequest = JSON.stringify({
//         bucket: "thetarzanway-web",
//         key: props.url,
//         edits: {
//           resize: {
//             width: 10,
//             height: 10,
//             fit: "cover",
//           },
//         },
//       });
//     if(props.dimensions)
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
//     else if(props.dimensionsMobile){
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
//     }
//     else imageRequest = JSON.stringify({
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
//         style={{display: !fullLoaded ? "flex" : "none",width: props.width ? props.width : '100%',  maxWidth: '100%',height:props.height ? props.height : "100%"}}
//         >
//           <BackgroundImageContainer  style={{backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0,0) 0%, rgba(0, 0, 0, 0.8) 100%), url(${`${imgUrlEndPoint}/${Buffer.from(smallImageRequest).toString('base64')}`})`,width: props.width ? props.width : '100%', padding: props.padding ? props.padding : '10vh 0 0 0', maxWidth: '100%',height:props.height ? props.height : "100%",backgroundRepeat: 'no-repeat',backgroundSize:'cover'}}></BackgroundImageContainer>
//           <ContentContainer style={{width: props.width ? props.width : '100%', padding: props.padding ? props.padding : '10vh 0 0 0', maxWidth: '100%',height:props.height ? props.height : "max-content"}}  >

//            {props.children}
//            </ContentContainer>
//         </SmallContainer>
//         <FullContainer
//             className={props.center ? "center-div " : ""}
//         style={{backgroundImage: props.filter? props.filter+`, url(${`${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`})`: `linear-gradient(180deg, rgba(0, 0, 0,0) 0%, rgba(0, 0, 0, 0.8) 100%), url(${`${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`})`, width: props.width ? props.width : '100%', padding: props.padding ? props.padding : '10vh 0 0 0', maxWidth: '100%',height:props.height ? props.height : "100%",display: fullLoaded ? "flex" : "none",backgroundRepeat: 'no-repeat'}}
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
// // filter:blur("6px")


// import build from '@date-io/date-fns';
// import { display } from '@material-ui/system';
// import React, {useState, useRef, useEffect} from 'react';
// import styled from 'styled-components';
// const SmallContainer = styled.div`
//  position: relative;
// margin: 0 auto;
// background-position: center;
// background-repeat: no-repeat;
// background-size: cover;
// height: 60vh;



 
// @media screen and (min-width: 768px){
//   height: 85vh;
// }


// `;
// const BackgroundImageContainer=styled.img`
// filter: blur(6px);
// z-index: -1;
// margin: 0;
// background-position: center;
// `
// const BackgroundImageSliderContainer=styled.img`
// filter: blur(6px);
// background-position: center;
// z-index: 2;
// background-size: cover;

// `
// const ContentContainer=styled.div`
// padding: 10vh 0 0 0;
// display: flex;
//     flex-direction: column;
//     justify-content: center;

// `
// const FullContainer = styled.div`
// margin: 0 auto;
// background-position: center;
// background-repeat: no-repeat;
// background-size: cover;
// height: 60vh;
 
// @media screen and (min-width: 768px){
//   height: 85vh;
// }

// `;
// const SaifBackgroundImageLoader = (props) => {
//     const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
//     let imageRequest;
//     const [fullLoaded, setFullLoaded] = useState(false);
//     const fullImageLoadedHandler = () => {
//       setFullLoaded(true);
//     };
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
//     if(props.dimensions)
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
//     else if(props.dimensionsMobile){
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
//     }
//     else imageRequest = JSON.stringify({
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
   
//     const img = new Image();
//     img.src = `${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`;
//     img.decode().then(() => {
//       // document.body.appendChild(img);
//       fullImageLoadedHandler();
//     });
//     setJSX(
//         <>
//         {/* {props.position && <SmallContainer
//         className={props.center ? "center-div" : ""}
//         style={{display: !fullLoaded ? "flex" : "none",width: props.width ? props.width : '100%',  maxWidth: '100%',height:props.height ? props.height : "100%"}}
//         >
//           <BackgroundImageContainer  style={{backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0,0) 0%, rgba(0, 0, 0, 0.8) 100%), url(${`${imgUrlEndPoint}/${Buffer.from(smallImageRequestSlider).toString('base64')}`})`,width: props.width ? props.width : '100%', padding: props.padding ? props.padding : '10vh 0 0 0', maxWidth: '100%',position:props.position ? props.position : "absolute",height:props.height ? props.height : "100%",backgroundRepeat: 'no-repeat',backgroundSize:'cover'}}></BackgroundImageContainer>
//           <ContentContainer style={{width: props.width ? props.width : '100%', padding: props.padding ? props.padding : '10vh 0 0 0', maxWidth: '100%',height:props.height ? props.height : "max-content"}}  >

//            {props.children}
//            </ContentContainer>
//         </SmallContainer>
        
//           } */}
//           <SmallContainer
//         className={props.center ? "center-div" : ""}
//         style={{display: !fullLoaded ? "flex" : "none",width: props.width ? props.width : '100%',  maxWidth: '100%',height: props.height ? props.height : "100%"}}
//         >
//           <BackgroundImageSliderContainer  style={{backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0,0) 0%, rgba(0, 0, 0, 0.8) 100%), url(${`${imgUrlEndPoint}/${Buffer.from(smallImageRequest).toString('base64')}`})`,width: props.width ? props.width : '100%', padding: props.padding ? props.padding : '10vh 0 0 0', maxWidth: '100%',position:props.position ? props.position : "absolute",display:props.position ? "flex": "none",height:props.height ? props.height : "100%",backgroundRepeat: 'no-repeat',backgroundSize:'cover'}}></BackgroundImageSliderContainer>

//           <BackgroundImageContainer  style={{backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0,0) 0%, rgba(0, 0, 0, 0.8) 100%), url(${`${imgUrlEndPoint}/${Buffer.from(smallImageRequest).toString('base64')}`})`,width: props.width ? props.width : '100%', padding: props.padding ? props.padding : '10vh 0 0 0', maxWidth: '100%',display:props.position ? "none": "flex" ,position:"absolute",height:props.height ? props.height : "100%",backgroundRepeat: 'no-repeat',backgroundSize:'cover'}}></BackgroundImageContainer>
//           {/* <BackgroundImageSliderContainer  style={{backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0,0) 0%, rgba(0, 0, 0, 0.8) 100%), url(${`${imgUrlEndPoint}/${Buffer.from(smallImageRequestSlider).toString('base64')}`})`,width: props.width ? props.width : '100%', padding: props.padding ? props.padding : '10vh 0 0 0', maxWidth: '100%',position:props.position ? props.position : "absolute",display:props.position ? "flex": "none",height:props.height ? props.height : "100%",backgroundRepeat: 'no-repeat',backgroundSize:'cover'}}></BackgroundImageSliderContainer> */}
         
//           <ContentContainer style={{width: props.width ? props.width : '100%', padding: props.padding ? props.padding : '10vh 0 0 0', maxWidth: '100%',height:props.height ? props.height : "max-content"}}  >

//            {props.children}
//            </ContentContainer>
//         </SmallContainer>

//         <FullContainer
//             className={props.center ? "center-div " : ""}
//         style={{backgroundImage: props.filter? props.filter+`, url(${`${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`})`: `linear-gradient(180deg, rgba(0, 0, 0,0) 0%, rgba(0, 0, 0, 0.8) 100%), url(${`${imgUrlEndPoint}/${Buffer.from(imageRequest).toString('base64')}`})`, width: props.width ? props.width : '100%', padding: props.padding ? props.padding : '10vh 0 0 0', maxWidth: '100%',height: props.height ? props.height : "100%",display: fullLoaded ? "flex" : "none",backgroundRepeat: 'no-repeat'}}
//         >
         
//            {props.children}
//         </FullContainer>
//         </>
//     );
    
//   }, [props.dimensions, props.dimensionsMobile,props.height,fullLoaded,props.position]);

// return(
//     <>
//     {JSX}
//     </>
// )
    
// }

// export default SaifBackgroundImageLoader;