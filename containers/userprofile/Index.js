import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
// import Image from './Image';
// import Nav from 'react-bootstrap/Nav';
import axiomyplansinstance from '../../services/sales/MyPlans'
import styled from 'styled-components';
import CheckAuthRedirect from '../../components/HOC/CheckAuthRedirect';
// import Heading from '../../components/heading/Heading';
import Heading from '../../components/newheading/heading/Index';
// import Location from '../../components/cards/Location';
import Experiences from '../../components/containers/Experiences';
import Profile from './Profile'
// import Settings from './Settings';
import media from '../../components/media';
// import Spinner from '../../components/Spinner';
import ImageLoader from '../../components/ImageLoader';
import Link from 'next/link';
import {useRouter} from 'next/router';
import Spinner from '../../components/Spinner';

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
  

return(
    <CheckAuthRedirect authRedirectPath="/" redirectOnFail={() => router.push('/')}>
    <Container>
        {/* <Heading align="left" margin="1.5rem 0" bold>Your Space</Heading> */}
        {/* <Tabs defaultActiveKey={props.match.params.selected} className="justify-content-center nav-tabs-profile-main border-thin" style={{borderRadius: "5px"}}>
                <Tab eventKey="profile" title="Profile" className="font-nunito">
                    <ContentContainer className="border-thin"><Profile></Profile></ContentContainer>
                    <ContentContainer className="border-thin">
                        <Heading align="left" margin="0 0 1rem 0" bold>Expereinces Curated for You</Heading>
                        <Experiences experiences={[experiences[0], experiences[1], experiences[2], experiences[3]]} columns={3}></Experiences>
                    </ContentContainer>
                    <ContentContainer className="border-thin">
                        <Heading align="left" margin="0 0 1rem 0" bold>Readings Curated for You</Heading>
                    <Blogs columns={2}></Blogs>
                    </ContentContainer>
                </Tab>
                <Tab eventKey="messages" title="Messages"  className="font-nunito">
                    <ContentContainer className="border-thin">Messages
                    </ContentContainer>
                </Tab>
                <Tab eventKey="notifications" title="Notifictaions"  className="font-nunito">
                    <ContentContainer className="border-thin">Notifications</ContentContainer>
                </Tab>
                <Tab eventKey="plans" title="My Plans"  className="font-nunito">
                    <ContentContainer className="border-thin">Plans</ContentContainer>
                </Tab>
                <Tab eventKey="settings" title="Settings"  className="font-nunito">
                    <ContentContainer className="border-thin"><Settings></Settings></ContentContainer>
                </Tab>
            </Tabs> */}
            <ContentContainer ><Profile></Profile></ContentContainer>
                    <ContentContainer className="border-thi">
                        <div style={{display: 'flex'}}>{myPlansArr.length ? <Heading align='left' margin="0 0 2rem 0" bold noline>My Plans</Heading> :
                         <Heading align='left' margin="0" bold  noline>My Plans
                         </Heading>}
                         {
                            loading ? 
                            <Spinner></Spinner> : null
                         }</div>
                        {isPageWide && !myPlansArr.length  && !loading? <NoPlans className="font-opensans" >You don't have any plans yet. <Link href="/tailored-travel" passHref={true} ><a style={{color: 'black', textDecoration: 'none !important'}}>Start Planning</a></Link></NoPlans> : null}
                       
                        {myPlansArr.length ? <Experiences margin="1rem" itineraries={myPlansArr} ></Experiences> : !loading ?  <ImageLoader width="40%" widthmobile="40%" margin="7.5vh auto" url={"media/website/noplans.svg"}></ImageLoader> : null}
                        {!isPageWide && !myPlansArr.length && !loading ? <NoPlans className="font-opensans" >You don't have any plans yet. </NoPlans> : null}
                        {!isPageWide && !myPlansArr.length  && !loading? <Link href="/tailored-travel" passHref={true} ><a className="font-nunito" style={{color: 'black', fontWeight: '300', display: 'block', margin: '0.5rem auto', textDecoration: 'none !important', textAlign: 'center', fontSize: '1.25rem', letterSpacing: '1px'}}>Start Planning</a></Link> : null}
                    </ContentContainer>
                 
    </Container></CheckAuthRedirect>

);
}
const mapStateToPros = (state) => {
    return{
      token: state.auth.token,
    }
  }
export default connect(mapStateToPros)(UserDashboard);