import React from 'react'
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@material-ui/core";
import Stack from "@mui/material/Stack";
import styled from 'styled-components'
import { Rating } from '@mui/material';
import { useState } from 'react';
import ImageLoader from '../../ImageLoader'
import media from '../../media'
import {TbArrowBack} from 'react-icons/tb'
const Title = styled.p`
font-weight : 800;
font-size : 20px;
`
const Reviews = styled.div`
display : flex;

&>p ,&>u {
 font-size : 12px;
 color : #7A7A7A
}
&>u{
 margin-left : 3px
}
`
const Text = styled.p`
font-size : 14px
`

const Heading = styled.p`
font-size: 18px;
font-weight: 800;
`;

const TimeStamp = styled.p`
height : 31px;
padding : 4px 8px;
background-color : #01202B;
border-radius : 20px;
color : white;
font-size : 14px;
font-weight : 600;
position : absolute;
top : 185px;
left : 20px;


    @media screen and (min-width: 768px){
    top : 185px;
left : 300px;
    }
`

const POIDetails = (props) => {
  let isPageWide = media('(min-width: 768px)')
  const about = (
    <p>
      {props.data.short_description?.substr(0, 250)} <b>...more</b>
    </p>
  );
  const [aboutText,setAboutText] = useState(about)
 


    const experience_filters = <div>
      {
        props.data.experience_filters?.map((e,i)=><span>{e} {props.data.experience_filters.length-1 == i ? '' : <b>·</b>} </span>)
      }
  </div>

  const tips = <ul>
    {
      props.data.tips?.map((e) => <li>{e}</li>)
}
  </ul>

  return (
    <Stack spacing={2} padding="16px" width={isPageWide?"500px" : '360px'}>
      <div style={{ marginBottom: "10px" }} onClick={(e)=>props.handleCloseDrawer(e)}>
        <TbArrowBack style={{height : '32px' , width : '32px'}} cursor={"pointer"} />
      </div>
      <ImageLoader
        borderRadius="8px"
        marginTop="23px"
        width="468px"
        height="188px"
        widthMobile="100%"
        url={props.data.image}
        dimensionsMobile={{ width: 600, height: 600 }}
        dimensions={{ width: 900, height: 900 }}
      ></ImageLoader>
      {props.data.ideal_duration_hours && <TimeStamp>Approx Time : {props.data.ideal_duration_hours} hrs</TimeStamp>}
      
      <Box>
        <Title>{props.data.name}</Title>
        <Reviews>
          {props.data.rating && (
            <Rating
              size="small"
              name="read-only"
              value={props.data.rating}
              readOnly
            />
          )}

          {props.data.rating && <p>{props.data.rating} ·</p>}

          {props.data.user_ratings_total && (
            <u>{props.data.user_ratings_total} Google reviews</u>
          )}
        </Reviews>
        {experience_filters && <Text>{experience_filters}</Text>}
      </Box>

      {props.data.short_description && <Box>
        <Heading>About</Heading>
        <Text onClick={() => setAboutText(props.data.short_description)}>
          {aboutText}
        </Text>
      </Box>}

      {props.data.getting_around &&<Box>
        <Heading>Getting Around</Heading>
        <Text>{props.data.getting_around}</Text>
      </Box>}

      {props.data.timings && (
        <Box>
          <Heading>Timings</Heading>
          <Text>
            {
              <ul>
                {props.data.timings.weekday_text?.map((e) => (
                  <li>{e}</li>
                ))}
              </ul>
            }
          </Text>
        </Box>
      )}

      {tips && (
        <Box>
          <Heading>Tips</Heading>
          <Text>{tips}</Text>
        </Box>
      )}
    </Stack>
  );
}

export default POIDetails