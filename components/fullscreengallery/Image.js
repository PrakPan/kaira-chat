import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import ImageLoader from '../../components/ImageLoader';
import media from '../../components/media';
const ImageWrapper = styled.div`
    width: 100%;
    cursor: pointer;
    @media screen and (min-width: 768px){
     }
`;

const ImageContainer = (props) => {
    let isPageWide = media('(min-width: 768px)')
    const [imageLoaded, setImageLoaded] = useState(false);

      let is_url = isValidHttpUrl(props.images[props.imageSelected]);
      useEffect(() => {
        var img = new Image();
        if (!is_url) img.src = `${imgUrlEndPoint}/${btoa(imageRequest)}`;
        else img.src = props.images[props.imageSelected];
        img.onload = function () {
          var height = img.height;
          var width = img.width;
          let aspectration;
          aspectration = width / height;
          // setAspect({...aspect, image: aspectration});

          setImageLoaded(aspectration);
        };
        var img = new Image();
        if (!is_url) img.src = `${imgUrlEndPoint}/${btoa(nextImageRequest)}`;
        else img.src = props.images[props.imageSelected + 1];
        img.onload = function () {
          var height = img.height;
          var width = img.width;
          let aspectration;
          aspectration = width / height;
          // setAspect({...aspect, image: aspectration});

          setImageLoaded(aspectration);
        };
      }, []);
    let touchstart = null;
    const imgUrlEndPoint = 'https://d31aoa0ehgvjdi.cloudfront.net/';

    function isValidHttpUrl(string) {
        let url;
        
        try {
          url = new URL(string);
        } catch (_) {
          return false;  
        }
      
        return url.protocol === "http:" || url.protocol === "https:";
      }

   let imageRequest = JSON.stringify({
    bucket: 'thetarzanway-web',
    key: props.images[props.imageSelected],
   
        });
    
        let nextImageRequest = JSON.stringify({
            bucket: 'thetarzanway-web',
            key: props.images[props.imageSelected+1],
           
                });
            
        
 
    const _handleDragStart = (event) => {
        touchstart = event.clientX;
    }
    const _handleDragEnd = (event) => {
        if(touchstart > event.clientX) props._nextImgHandler()
        else props._prevImgHandler();
    }
    // if(imageLoaded){
            //  let width_desktop = Math.round((window.innerHeight/1.6 ) * imageLoaded);
            // let height_desktop = Math.round(window.innerHeight/1.6);
            // let width_desktop=1600;
            // let height_desktop=900;
            // let width_mobile = Math.round((window.innerWidth/0.7));
            // let height_mobile = Math.round(width_mobile/imageLoaded)

            return(
            <ImageWrapper  style={{display:  'block' }} draggable="true" onDragStart={_handleDragStart} onDragEnd={_handleDragEnd}>
                {/* <Animate> */}
                <ImageLoader
                    url={props.images[props.imageSelected]}
                    // dimensions={isPageWide ? {width: width_desktop, height: height_desktop} : {width: Math.round(width_mobile*1.5), height: Math.round(height_mobile*1.5)}}
                    // width={isPageWide ? Math.round(window.innerHeight*0.6*imageLoaded) : width_mobile+"px"}
                    maxheight='60vh'
                    maxwidth={isPageWide ? '70vw' :'80vw'}
                    fit="cover"
                /> 
                {/* </Animate> */}
                
            </ImageWrapper>
        );
        

    
    // }
    // else return null;
  
}

export default React.memo(ImageContainer); 