import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import ImageLoader from "../../../components/ImageLoader";
import useMediaQuery from '../../../components/media';
import FullScreenGallery from '../../../components/fullscreengallery/Index';

const Container = styled.div`
  display: flex;
  position: relative;
`

const SingleImage = styled.div`
position: relative;
overflow: hidden
`

const MoreImageOverlay = styled.div`
position: relative;
background: #F8E700;
color: #000000;
overflow: hidden;
font-weight: 500;
font-size: 14px;
height:44px;
width:44px;
display : flex;
justify-content : center;
align-items: center
`
const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

function SmallGallery(props) {
    const [isFullScreenGalleryEnable, setIsFullScreenGalleryEnable] = useState(false);
    const isDesktop = useMediaQuery("(min-width:767px)");
    console.log("max show is: ", props.images)

    const [renderImages, setRenderImages] = useState([]);

    useEffect(() => {
        const newArr = props.images.slice(0, props.maxShow).filter((item) => item != "");
        console.log('new array is: ', newArr)
        setRenderImages(newArr);
    }, [])
    return (
        <>
            <Container className={`pr-[24px] ${isDesktop ? "border-l pl-[24px]" : ""} min-h-full`}>
                {props.images && renderImages.map((item, index) => <>
                    <SingleImage style={{ left: -(index * 20) }} className='rounded-full border-white border-[3px]'>
                        {/* <Image src={item} width={50} height={50} /> */}
                        <ImageLoader
                            dimensions={{ width: 44, height: 44 }}
                            url={item.image || item}
                            dimensionsMobile={{ width: 44, height: 44 }}
                            noLazy
                        ></ImageLoader>
                    </SingleImage>
                </>)}
                {props.images?.length > renderImages.length &&
                    <div style={{ left: -(renderImages.length * 20) }} className='relative rounded-full border-white border-[3px]'>
                        <MoreImageOverlay className='rounded-full cursor-pointer' onClick={() => setIsFullScreenGalleryEnable(true)}>
                            +{props?.images?.length - renderImages.length}
                        </MoreImageOverlay>
                    </div>
                }
            </Container>

            {isFullScreenGalleryEnable &&
                <FullScreenGallery
                    mercury
                    imgUrlEndPoint={imgUrlEndPoint}
                    closeGalleryHandler={() => setIsFullScreenGalleryEnable(false)}
                    images={props.images}
                ></FullScreenGallery>
            }

        </>
    )
}

export default SmallGallery