import React, {useState} from 'react';
import styled from 'styled-components';
import ImageGallery from './slider/ImageSlider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faStar, faStarHalf} from '@fortawesome/free-solid-svg-icons';
import Button from '../../ui/button/Index';
import Link from 'next/link';
import media from '../../media';
import { useRouter } from 'next/router';
import { getIndianPrice } from '../../../services/getIndianPrice';
import urls from '../../../services/urls';
import * as ga from '../../../services/ga/Index'
import Spinner from '../../Spinner';
import usePageLoaded from '../../custom hooks/usePageLoaded';

const Container = styled.div`
width: 100%;
background-color: white;
box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
border-radius: 5px;
  @media screen and (min-width: 768px){
    &:hover{
      cursor: pointer;
    }
  }

`;
const ImageContainer = styled.div`
position: relative;
text-align: center;
color: white;
`;


const HeadingContainer= styled.div`
min-height: 4rem;
@media screen and (min-width: 768px){
min-height: 4rem;
}
`;
const ContentContainer = styled.div`
width: 100%;

padding: 1rem 0.5rem; 
box-sizing: border-box;
@media screen and (min-width: 768px){
}
`;
const TextContainer = styled.div`

height: 4.5rem;
overflow: hidden;
text-overflow: ellipsis;
margin: 1.5rem 0;

`;
const Text = styled.p`
font-weight: 300;
line-height: 1.5rem;
`;

const Price = styled.p`
font-weight: 800;
margin: 0;
&:before{
content: 'Starting From';
display: block;
font-weight: 300;
font-size: 0.75rem;
width: max-content;
margin: 0;
padding: 0;
}
`;
const Rating= styled.p`
margin: 0;
text-align: center;
margin: 0.5rem auto;
`;

const Heading = styled.p`
font-size: 1.25rem;
font-weight: 700;
margin: 0.5rem 0 0 0;
line-height: 1.25;
@media screen and (min-width: 768px){
font-size: 1.25rem;
margin: 0.75rem 0;
font-weight: 600;
color: #212529;
}
`;
 
const ExperienceCard = (props) => {
const [loading, setLoading] = useState(false);
  
  let isPageWide = media('(min-width: 768px)')
  const isPageLoaded = usePageLoaded();
 

const router = useRouter();
const _handleRedirect = () => {
  router.push('/travel-experiences/'+props.slug)
}
let textstr = "";  
if(!isPageWide ){ //change to less than 400
  textstr = props.text.substring(0,80)+"...";
}
else if(!isPageWide){ // change to 400 to 480
  textstr = props.text.substring(0,90)+"...";
}
else   textstr = props.text.substring(0,100)+"...";

const redirect = () => {
  setLoading(true);
  router.push(urls.travel_experiences.BASE+props.slug)
  // setLoading(false)
}
 const _handleClick = () => {
  setLoading(true);
 

  setTimeout(redirect, 1000);
  
  ga.callback_event({
    action: 'CC-'+props.experience,
    
    callback: redirect,
  })
}
    return (
      <Container className="netflix-ite">
        <ImageContainer>
          <ImageGallery
            filter={props.filter}
            location={props.location}
            cost={props.cost}
            duration={props.duration}
            images={props.images}
            name={props.experience}
          ></ImageGallery>
        </ImageContainer>
        <ContentContainer className="text-center">
          <HeadingContainer>
            <Heading className="font-lexend">{props.experience}</Heading>
          </HeadingContainer>
          {isPageLoaded ? (
            <Rating className="font-nunito">
              <FontAwesomeIcon
                icon={faStar}
                style={{ color: "#F7e700", fontSize: "2vh" }}
              ></FontAwesomeIcon>
              <FontAwesomeIcon
                icon={faStar}
                style={{ color: "#F7e700", fontSize: "2vh" }}
              ></FontAwesomeIcon>
              <FontAwesomeIcon
                icon={faStar}
                style={{ color: "#F7e700", fontSize: "2vh" }}
              ></FontAwesomeIcon>
              <FontAwesomeIcon
                icon={faStar}
                style={{ color: "#F7e700", fontSize: "2vh" }}
              ></FontAwesomeIcon>
              <FontAwesomeIcon
                icon={props.rating > 4.5 ? faStar : faStarHalf}
                style={{ color: "#F7e700", fontSize: "2vh" }}
              ></FontAwesomeIcon>
              {props.rating ? " " + props.rating : "4.5"}
            </Rating>
          ) : null}
          <TextContainer className="font-nunito">
            <Text>{textstr}</Text>
          </TextContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "0 0.5rem",
            }}
          >
            <Price className="font-lexend">
              {"₹ " +
                getIndianPrice(Math.round(props.starting_cost / 100)) +
                "/-"}
            </Price>
            <Link
              style={{ textDecoration: "none" }}
              passHref={true}
              href={urls.EXPERIENCES + props.id}
            >
              <Button
                display="inline-block"
                onclick={_handleClick}
                onclickparams={null}
                boxShadow
                hoverBgColor="black"
                bgColor="#f7e700"
                borderRadius="2rem"
                padding="0.5rem 1.5rem"
                borderStyle="none"
                hoverColor="white"
              >
                Check Out!
                {loading ? (
                  <Spinner
                    size={16}
                    display="inline"
                    margin="0 0 0 0.25rem"
                  ></Spinner>
                ) : null}
              </Button>
              {/* <Button onclick={_handleClick} onclickparams={null} boxShadow hoverBgColor="black" bgColor='#f7e700' borderRadius="2rem" padding="0.5rem 1.5rem" borderStyle="none" hoverColor="white">
                    <Spinner size={16}></Spinner>
                  </Button>  */}
            </Link>
          </div>
        </ContentContainer>
      </Container>
    ); 
}
 
export default ExperienceCard;
