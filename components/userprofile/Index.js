import React, { useState } from 'react';
import {connect} from 'react-redux';
import Image from './Image';
import Nav from 'react-bootstrap/Nav';

import styled from 'styled-components';
import CheckAuthRedirect from '../../components/HOC/CheckAuthRedirect';
// import Heading from '../../components/heading/Heading';
import Heading from '../../components/newheading/heading/Index';

import Experiences from '../../components/containers/Experiences';
import experiences from '../../experiences';
import './Navbar.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Profile from './Profile'
import Settings from './Settings';
const UserDashboard = (props) => {
const Container = styled.div`
    width: 90%;
    margin: auto;
    @media screen and (min-width: 768px){
        width: 70%;
        padding-top: 10vh;
    }
`;
const ContentContainer = styled.div`
    border-radius: 5px;
    padding: 0rem;
    margin-top: 2rem;
    @media screen and (min-width: 768px){
        padding: 0;
    }
`;
 return(
<CheckAuthRedirect authRedirectPath="/profile/profile">
    {/* <Image></Image> */}
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
            <ContentContainer className="border-thin"><Profile></Profile></ContentContainer>
                    <ContentContainer className="border-thi">
                        <Heading align="left" margin="0 0 1rem 0" bold>Expereinces Curated for You</Heading>
                        <Experiences experiences={[experiences[0], experiences[1], experiences[2], experiences[3]]} columns={3}></Experiences>
                    </ContentContainer>
                    <ContentContainer className="border-thi">
                        <Heading align="left" margin="0 0 1rem 0" bold>Readings Curated for You</Heading>
                    {/* <Blogs columns={2}></Blogs> */}
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