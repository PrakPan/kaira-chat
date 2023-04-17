import React from 'react'
import styled from 'styled-components'
import { useState } from 'react';
import ImageLoader from '../../ImageLoader'
import media from '../../media'
import {TbArrowBack} from 'react-icons/tb'
import SkeletonCard from '../../ui/SkeletonCard';
import {FaStar, FaStarHalfAlt} from 'react-icons/fa'
const Title = styled.p`
font-weight : 800;
font-size : 20px;
`
const Reviews = styled.div`
display : flex;
align-items : center;
margin-block : 0.5rem;
gap : 0.2rem;
p ,u {
 font-size : 12px;
 color : #7A7A7A
}
u{
 margin-inline : 0.2rem;
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
background-color : #000000BF;
border-radius : 20px;
color : white;
font-size : 14px;
font-weight : 600;
position : absolute;
top : 185px;
left : 20px;
    @media screen and (min-width: 768px){
    top : 185px;
left : 320px;
    }
`
const Container = styled.div`
display: flex;
flex-direction: column;
gap: 1rem;
padding: 16px;
width: 360px;
@media screen and (min-width: 768px){
  width: 500px;
}
`

const POIDetails = (props) => {
  let isPageWide = media('(min-width: 768px)')
  const [imageLoading,setImageLoading] = useState(true)
  var about = (
    <p>
      {props.data.short_description?.substr(0, 250)} <b className='hover-pointer'>...more</b>
    </p>
  );
  const [aboutText,setAboutText] = useState(about)
   
      var experience_filters = <div>
        {
          props.data.experience_filters?.map((e,i)=><span key={i}>{e} {props.data.experience_filters.length-1 == i ? '' : <b>·</b>} </span>)
        }
    </div>
  
    var tips = <ul>
      {
        props.data.tips?.map((e,i) => <li key={i}>{e}</li>)
  }
    </ul>
  
  var stars = []
  for(let i = 0;i<Math.floor(props.data.rating);i++){
    stars.push(<FaStar />)
  }
  if(Math.floor(props.data.rating) < props.data.rating) stars.push(<FaStarHalfAlt />)
  
  
  return (
    <Container>
      <div
        onClick={(e) => props.handleCloseDrawer(e)}
      >
        <TbArrowBack
          style={{ height: "32px", width: "32px" }}
          cursor={"pointer"}
        />
      </div>
      <div style={imageLoading?{display : 'none'} : {display : 'initial'}}>
        <ImageLoader
          borderRadius="8px"
          marginTop="23px"
          widthMobile="100%"
          url={props.data.image}
          dimensionsMobile={{ width: 500, height: 280 }}
          dimensions={{ width: 468, height: 188 }}
          onload={() => {
            console.log("loaded"), setImageLoading(false);
          }}
        ></ImageLoader>
      </div>
      {imageLoading && <SkeletonCard width={isPageWide?"468px" : "100%"} height={"188px"} />}

      {props.data.ideal_duration_hours && (
        <TimeStamp>
          Approx Time : {props.data.ideal_duration_hours} hrs
        </TimeStamp>
      )}

      <div>
        <Title>{props.data.name}</Title>
        <Reviews>
          {props.data.rating && 
          <div style={{color : '#ffa500' , marginBottom : '0.3rem'}}>{stars}
            </div>
          }
          <div style={{display : 'flex' , alignItems : 'center'}}>
          {props.data.rating && <p style={{marginBlock : 'auto' }}>{props.data.rating} · {' '}</p>}

          {props.data.user_ratings_total && (
            <u>{' '} {props.data.user_ratings_total} Google reviews</u>
          )}  
          </div>
          
        </Reviews>
        {props.data.experience_filters && <Text>{experience_filters}</Text>}
      </div>

      {props.data.short_description && (
        <div>
          <Heading>About</Heading>
          <Text onClick={() => setAboutText(props.data.short_description)}>
            {aboutText}
          </Text>
        </div>
      )}

      {props.data.getting_around && (
        <div>
          <Heading>Getting Around</Heading>
          <Text>{props.data.getting_around}</Text>
        </div>
      )}

      {props.data.timings && (
        <div>
          <Heading>Timings</Heading>
          <Text>
            {
              <ul>
                {props.data.timings.weekday_text?.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            }
          </Text>
        </div>
      )}

      {props.data.tips && (
        <div>
          <Heading>Tips</Heading>
          <Text>{tips}</Text>
        </div>
      )}
    </Container>
  );
}

export default POIDetails