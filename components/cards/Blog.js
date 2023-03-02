import React from 'react';
import styled from 'styled-components';
import ImageLoader from '../ImageLoader';
// import Button from '../Button';
import Button from '../ui/button/Index';
import {useRouter} from 'next/router';


const Container = styled.div`
width: 100%;
background-color: transparent;
margin-bottom: 1rem;
padding: ${(props) => props.padding? '1rem' : '0'};
border-radius: 5px;
//background-color: ${(props) => props.bgColor ? props.bgColor : "transparent"}
background-color: ${(props)=> props.bgColor? props.bgColor : 'transparent'};
@media screen and (min-width: 768px){
    margin: 0;
    padding: 0;
}
`;
// const Image = styled.img`
//     border-radius: 50%;
//     //width:${imgWidth};
//     width: ${props => props.imgWidth ? props.imgWidth : imgWidth };
// `;
const Name = styled.p`
    padding: 0; 
     font-size:1.25rem;
    margin: 1rem;
    @media screen and (min-width: 768px){
        font-size:16px;
        font-weight: 600;
        width: 80%;
        margin: 2rem auto 1rem auto;
        text-align: center;
    }
    overflow: hidden;
    line-height: 1.5;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
`;


const Experiences= (props) => {

    const Review = styled.div`
    width: 90%;
    margin: 0;
    padding: 0; 
    position: relative;

    font-size 14.4px;
    @media screen and (min-width: 768px){
        font-size: 14.4px;
    }
    color: #212529;
    font-weight: 300;
    line-height: 1.5;
    &:before{
        content: ${ (props) => props.review ? 'open-quote' : ''};
        font-family: "Font Awesome 5 Free";
        font-size:2.5rem;
        padding: 0;
        display: inline-block;

        line-height: 1;
    }
    &:after{
        content: close-quote;
        font-family: "Font Awesome 5 Free";
        font-size: 2.5rem;
        padding: 0;
        visibility: hidden;
        line-height: 1;
        display: block;
    }
    overflow: hidden;
    line-height: 1.5;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 4;
-webkit-box-orient: vertical;

       
`;
    /*Require props: imgWidth*/
 
  
    const router = useRouter();
    const _onClickHandler = () => {
        if(props.page){
            router.push('/'+props.page)
        }
        else if(props.link){
             window.location.href=props.link;
        }
    }

    return(
      <Container className="center-div">  
        {/* <img style={{ width: "40%", margin: "auto", borderRadius: "50%"}} src={img}></img> */}
        <ImageLoader width={props.location ? '30%' : "40%"} margin="auto" borderRadius="50%" widthmobile="50%" dimensions={{width: 600, height: 600}} url={props.img}></ImageLoader>  
          <Name  onClick={props.page || props.link? _onClickHandler : null}  className="font-opensans text-center hover-pointer"><b>{props.heading}</b></Name>
          <Review             onClick={props.page || props.link? _onClickHandler : null}  className="text-center font-nunito hover-pointer" dangerouslySetInnerHTML={props.text ? { __html: props.text } : { __html: +"Looks like there was a problem loading this..." }}></Review>
          
     <Button
               boxShadow
            borderRadius="2rem"
            margin="1rem auto"
            borderWidth="1px"
            padding="0.5rem 1rem"
            color="#212529"
            fontWeight="300"
            hoverBgColor="black"
            hoverColor="white"
            fontSize="12px"
            onclick={props.page || props.link? _onClickHandler : null}
            >
                Read More
            </Button>
      </Container>
  ); 
}

export default Experiences;
