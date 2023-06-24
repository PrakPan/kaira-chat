import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import axiomyplansinstance from '../../services/sales/MyPlans'
import styled from 'styled-components';
import CheckAuthRedirect from '../../components/HOC/CheckAuthRedirect';
import Heading from '../../components/newheading/heading/Index';
import Experiences from '../../components/containers/Experiences';
import Profile from './Profile'
import media from '../../components/media';
import ImageLoader from '../../components/ImageLoader';
import Link from 'next/link';
import {useRouter} from 'next/router';
import Spinner from '../../components/Spinner';
import openTailoredModal from '../../services/openTailoredModal';

const Container = styled.div`
    width: 100%;
    margin: 12vh auto;

    @media screen and (min-width: 768px){
        width: 70%;
        padding-top: 10vh;
        margin:  auto;

    }
`;
const ContentContainer = styled.div`
    border-radius: 5px;
    padding: 0rem;
    margin: 2rem 0;
    @media screen and (min-width: 768px){
        padding: 0;
    }
`;
const Illustration = styled.img`
    width: 40%;
    margin: 7.5vh auto;
    display: block;

@media screen and (min-width: 768px){

}
`;
const NoPlans = styled.p`
    font-weight: 300;
    font-size: 1.25rem;
    letter-spacing: 1px;
    text-align: center;
    margin: 0 0.5rem;
    color: black;
    @media screen and (min-width: 768px){
        margin: 0;
        text-align: left;
    }
`;

const UserDashboard = (props) => {
    const [myPlansArr, setMyPlansArr] = useState([]);
    const [loading, setLoading] = useState(true);
    let isPageWide = media('(min-width: 768px)')
    let router = useRouter();
    useEffect(() => {
        window.scrollTo(0,0);
        if(props.token){

                axiomyplansinstance.get("", {headers: {
                    'Authorization': `Bearer ${props.token}`
                    }}).then(res => {
                        
        
                        let plansarr = [];
        
                        for(var i=0 ; i<res.data.length; i++){
                             plansarr.push(
                                res.data[i]
                            );
                        }
                        setMyPlansArr(plansarr)
                        setLoading(false);
                    }).catch(err => {
                        setLoading(false);
        
                    })
        
            
        }




        
      },[props.token]);
  

return (
  <CheckAuthRedirect
    authRedirectPath="/"
    redirectOnFail={() => router.push("/")}
  >
    <Container>
      <ContentContainer>
        <Profile></Profile>
      </ContentContainer>
      <ContentContainer className="border-thi">
        <div style={{ display: "flex" }}>
          {myPlansArr.length ? (
            <Heading align="left" margin="0 0 2rem 0" bold noline>
              My Plans
            </Heading>
          ) : (
            <Heading align="left" margin="0" bold noline>
              My Plans
            </Heading>
          )}
          {loading ? <Spinner></Spinner> : null}
        </div>
        {isPageWide && !myPlansArr.length && !loading ? (
          <NoPlans className="font-lexend">
            You don't have any plans yet.{" "}
            <a
              onClick={() => openTailoredModal(router)}
              style={{ color: "black", textDecoration: "none !important" }}
            >
              Start Planning
            </a>
          </NoPlans>
        ) : null}

        {/* {myPlansArr.length ? <Experiences margin="1rem" itineraries={myPlansArr} ></Experiences> : !loading ?  <ImageLoader width="40%" widthmobile="40%" margin="7.5vh auto" url={"media/website/noplans.svg"}></ImageLoader> : null} */}
        {myPlansArr.length ? (
          <Experiences navigationButtons experiences={myPlansArr}></Experiences>
        ) : !loading ? (
          <ImageLoader
            width="40%"
            widthmobile="40%"
            margin="7.5vh auto"
            url={"media/website/noplans.svg"}
          ></ImageLoader>
        ) : null}
        {!isPageWide && !myPlansArr.length && !loading ? (
          <NoPlans className="font-lexend">
            You don't have any plans yet.{" "}
          </NoPlans>
        ) : null}
        {!isPageWide && !myPlansArr.length && !loading ? (
            <a
              onClick={() => openTailoredModal(router)}
              className="font-nunito"
              style={{
                color: "black",
                fontWeight: "300",
                display: "block",
                margin: "0.5rem auto",
                textDecoration: "none !important",
                textAlign: "center",
                fontSize: "1.25rem",
                letterSpacing: "1px",
              }}
            >
              Start Planning
            </a>
        ) : null}
      </ContentContainer>
    </Container>
  </CheckAuthRedirect>
);
}
const mapStateToPros = (state) => {
    return{
      token: state.auth.token,
    }
  }
export default connect(mapStateToPros)(UserDashboard);