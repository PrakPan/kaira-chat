import React from 'react'
import { useState } from 'react';
import ImageLoader from '../../ImageLoader';

const CityDetails = (props) => {
  console.log('props: ', props);
  const [imageLoading , setImageLoading] = useState(true)
  return (
    <>
      <div>
        <ImageLoader
          borderRadius="8px"
          marginTop="23px"
          widthMobile="100%"
          style={imageLoading ? { display: "none" } : {}}
          url={props.data?.images[0].image || props.data?.images[1].image}
          dimensionsMobile={{ width: 500, height: 280 }}
          dimensions={{ width: 468, height: 188 }}
          yuu
          onload={() => {
            setImageLoading(false);
          }}
          noLazy
        ></ImageLoader>
      </div>
      {imageLoading && (
        <div
          style={{ width: isPageWide ? "468px" : "100%", height: "188px" }}
        />
      )}
    </>
  );
}

export default CityDetails