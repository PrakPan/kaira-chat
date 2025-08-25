import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import ImageLoader from "../../../components/ImageLoader";

const Container = styled.div`
  display: flex;
  position: relative;
`

const SingleImage = styled.div`
position: relative;
border: 3px solid #fff;
border-radius : 8px;
overflow: hidden
`

const MoreImageOverlay = styled.div`
position: relative;
border: 3px solid #fff;
border-radius : 8px;
background: #F8E700;
color: #000000;
overflow: hidden;
font-weight: 500;
font-size: 14px;
vertical-align: middle;
width: 46px;
height: 46px;
display : flex;
justify-content : center;
align-items: center
`

function SmallGallery(props) {
    console.log(props, ": small gal");
    const [renderImages, setRenderImages] = useState([]);

    useEffect(() => {
        const newArr = props.images.slice(0, props.maxShow);
        setRenderImages(newArr);
    }, [])
    return (
        <Container className="pr-[24px] pl-[24px] border-l  min-h-full">
            {props.images && renderImages.map((item, index) => <>
                <SingleImage style={{ left: -(index * 10) }}>
                    {/* <Image src={item} width={50} height={50} /> */}
                    <ImageLoader
                        dimensions={{ width: 40, height: 40 }}
                        url={item}
                        dimensionsMobile={{ width: 40, height: 40 }}
                        noLazy
                    ></ImageLoader>
                </SingleImage>
            </>)}
               {props?.images?.length > renderImages.length &&
                    <MoreImageOverlay style={{ left: -( renderImages.length* 10) }}>
                        +{props?.images?.length - renderImages.length}
                    </MoreImageOverlay>
                }
        </Container>
    )
}

export default SmallGallery