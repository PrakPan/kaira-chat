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
        const newArr = (props.images || []).slice(0, props.maxShow).filter((item) => item != "");
        setRenderImages(newArr);
    }, [props.images, props.maxShow])

    return (
        <>
            <Container className={props?.compact ? "min-h-full" : !props?.isDraft ?`pr-[24px] ${isDesktop  ? "border-l pl-[24px]" : ""} min-h-full` : "min-h-full"}>
                {props.images && renderImages.map((item, index) => <>
                    <SingleImage key={index} onClick={() => handleOpenGallery(index, null, 'Image')} style={{ left: -(index * (props?.compact ? 16 : 20)), width: props?.compact ? 26 : 44, height: props?.compact ? 26 : 44 }} className={`rounded-full border-white ${props?.compact ? "border-2" : "border-[3px]"} cursor-pointer`}>
                        {/* <Image src={item} width={50} height={50} /> */}
                        <ImageLoader
                            url={item.image || item}
                            style={{
                                width: props?.compact ? "26px" : "44px",
                                height: props?.compact ? "26px" : "44px",
                                objectFit: "cover",
                                cursor: "pointer",
                                margin: "auto",
                              }}
                            noLazy
                        ></ImageLoader>
                    </SingleImage>
                </>)}
                {props.images?.length > renderImages.length && !props.isDraft &&
                    <div style={{ left: -(renderImages.length * (props?.compact ? 16 : 20)) }} className={`relative rounded-full border-white ${props?.compact ? "border-2" : "border-[3px]"} `}>
                        <MoreImageOverlay className='rounded-full cursor-pointer' style={props?.compact ? { width: 26, height: 26, fontSize: 11 } : undefined} onClick={() => handleOpenGallery(0, null, 'More Images')}>
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
                    closeLabel={props.closeLabel}
                    images={props.images}
                ></FullScreenGallery>
            }

        </>
    )
}

export default SmallGallery