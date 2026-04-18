import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import ImageLoader from "../../../components/ImageLoader";
import useMediaQuery from '../../../components/media';
import FullScreenGallery from '../../../components/fullscreengallery/Index';
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { logEvent } from "../../../services/ga/Index";


const Container = styled.div`
  display: flex;
  position: relative;
`

const SingleImage = styled.div`
position: relative;
overflow: hidden;
width: 44px;
height: 44px;
border-radius: 50%;
flex-shrink: 0;
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
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isFullScreenGalleryEnable, setIsFullScreenGalleryEnable] = useState(false);
    const isDesktop = useMediaQuery("(min-width:767px)");
    const [renderImages, setRenderImages] = useState([]);



    useEffect(() => {
        const gallery = searchParams.get("gallery");
        if (gallery === "true") {
            setIsFullScreenGalleryEnable(true);
        } else {
            setIsFullScreenGalleryEnable(false);
        }
    }, [searchParams]);

    const handleOpenGallery = (index = 0, imageId = null, value = null) => {
        router.push(
            {
                pathname: window.location.pathname,
                query: {
                    gallery: "true"
                },
            },
            undefined,
            { scroll: false }
        );

        setIsFullScreenGalleryEnable(true);

        logEvent({
            action: "Gallery_Open",
            params: {
                page: "Itinerary Page",
                event_category: "Button Click",
                event_label: "View Gallery",
                event_value: value,
                event_action: "Gallery",
            },
        });
    };

    const closeGallery = () => {
        setIsFullScreenGalleryEnable(false);

        router.push(
            {
                pathname: window.location.pathname,
                query: {},
            },
            undefined,
            { scroll: false }
        );
    };




    useEffect(() => {
        const newArr = props.images.slice(0, props.maxShow).filter((item) => item != "");
        console.log('new array is: ', newArr, "props images are: ", props.images);
        setRenderImages(newArr);
    }, [])

    return (
        <>
            <Container className={!props?.isDraft ?`pr-[24px] ${isDesktop  ? "border-l pl-[24px]" : ""} min-h-full` : "min-h-full"}>
                {props.images && renderImages.map((item, index) => <>
                    <SingleImage key={index} onClick={() => handleOpenGallery(index, null, 'Image')} style={{ left: -(index * 20) }} className='rounded-full border-white border-[3px] cursor-pointer'>
                        {/* <Image src={item} width={50} height={50} /> */}
                        <ImageLoader
                            // dimensions={{ width: 44, height: 44 }}
                            url={item.image || item}
                            style={{
                                width: "44px",
                                height: "44px",
                                objectFit: "cover",
                                cursor: "pointer",
                                margin: "auto",
                                // display: "block",
                              }}
                            // dimensionsMobile={{ width: 44, height: 44 }}
                            noLazy
                        ></ImageLoader>
                    </SingleImage>
                </>)}
                {props.images?.length > renderImages.length && !props.isDraft &&
                    <div style={{ left: -(renderImages.length * 20) }} className='relative rounded-full border-white border-[3px] '>
                        <MoreImageOverlay className='rounded-full cursor-pointer' onClick={() => handleOpenGallery(0, null, 'More Images')}>
                            +{props?.images?.length - renderImages.length}
                        </MoreImageOverlay>
                    </div>
                }
            </Container>

            {isFullScreenGalleryEnable &&
                <FullScreenGallery
                    mercury
                    imgUrlEndPoint={imgUrlEndPoint}
                    closeGalleryHandler={closeGallery}
                    images={props.images}
                ></FullScreenGallery>
            }

        </>
    )
}

export default SmallGallery