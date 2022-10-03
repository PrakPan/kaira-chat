
import React, {useEffect} from 'react';
import styled from 'styled-components';
import icon1 from '../../assets/icons/inclusions&exclusions/solid/home.svg';
import icon2 from '../../assets/icons/inclusions&exclusions/solid/restaurant.svg';
import icon3 from '../../assets/icons/inclusions&exclusions/solid/running.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faRupeeSign} from '@fortawesome/free-solid-svg-icons';
import ImageLoader from '../../components/ImageLoader';
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  height: 7.5vh;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  align-items: center;
  border-style: none none solid none;
  border-color: hsl(0,0%,93%);
  border-width: 1px;
`;
const Image = styled.img`
    display: inline-block;
    width: 6vh;
    height: 6vh;
    margin: 0 1rem;
    border-radius: 50%;
`;
const IconContainer = styled.div`
    padding-left: 2rem;
`;
const Icon = styled.img`
    width: 1.5rem;
    height: auto;
    margin-right: 1.5rem;
`;
const CostContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const StartingFrom = styled.p`
    margin: 0;
    font-size: 2.5vh;
    &:before{
        font-size: 1.5vh;
        content: 'Starting from';
        display: block;
    }

`;
const BuyNow = styled.p`
    margin: 0 1.5rem 0 1.5rem;
    font-size: 2vh;
    padding: 1vh;
    border-radius: 5px;
    background-color: #F7e700;
    &:hover{
        cursor: pointer;
        color: white;
        background-color: black;
    }
`;
const Name = styled.p`
    margin: 0;
    font-size: 2.5vh;
    font-weight: 300;
    display: inline;

`;
const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

const CityCard = (props) => {

    let imageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: props.image,
        edits: {
          resize: {
            width: 900,
            height: 900,
            fit: "cover"
          }
        }
      });
      
  return(
   <Container className="border-thi">
        {/* <div style={{display: 'flex', alignItems: 'center'}}>
            <Image   src={`${imgUrlEndPoint}/${btoa(imageRequest)}`}></Image>
            <Name className="font-nunito">{props.title}</Name>
       </div> */}
       <IconContainer>
                <Icon src={icon1}></Icon>
                <Icon src={icon2}></Icon>
                <Icon src={icon3}></Icon>
        </IconContainer>
       <CostContainer>
            
            {/* <StartingFrom className="font-nunito">
                <FontAwesomeIcon style={{marginRight: '0.5rem'}} icon={faRupeeSign}/>
                {props.payment && props.payment.payment_info[0] ? props.payment.payment_info[0].base_price/100+' /-' : '/-'}
            </StartingFrom> */}
            <BuyNow className="font-opensans" onClick={props.openBooking}>Enquire Now</BuyNow>
       </CostContainer>
   </Container>

  );
}

export default CityCard;
