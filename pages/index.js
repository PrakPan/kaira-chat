import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import HomepageContainer from '../containers/homepage/Index';
import Layout from '../components/Layout';
import { connect } from 'react-redux';
import * as authaction from '../store/actions/auth';
import Router from 'next/router'
import { useEffect } from 'react';
import axiosTravelPlannerInstance from '../services/pages/travel-planner'
const  Home = (props) =>  {
  useEffect(() => {
    props.checkAuthState();
 
  }, []);
  console.log(props,'ppppopop')
  return (
    <Layout>
       <Head>
       <script
        dangerouslySetInnerHTML={{
  __html: `
 (function (d, w, c) { if(!d.getElementById("spd-busns-spt")) { var n = d.getElementsByTagName('script')[0], s = d.createElement('script'); var loaded = false; s.id = "spd-busns-spt"; s.async = "async"; s.setAttribute("data-self-init", "false"); s.setAttribute("data-init-type", "opt"); s.src = 'https://cdn.in-freshbots.ai/assets/share/js/freshbots.min.js'; s.setAttribute("data-client", "3225c221f3048e75e5a6ef1d6a5227c59290c8f1"); s.setAttribute("data-bot-hash", "d059e122d6884b9cb09bdbe690df8c367e8b911c"); s.setAttribute("data-env", "prod"); s.setAttribute("data-region", "in"); if (c) { s.onreadystatechange = s.onload = function () { if (!loaded) { c(); } loaded = true; }; } n.parentNode.insertBefore(s, n); } }) (document, window, function () { Freshbots.initiateWidget({ autoInitChat: false, getClientParams: function () { return ; } }, function(successResponse) { }, function(errorResponse) { }); });
  `}}
  />

          <title>Travel Company | India | The Tarzan Way</title>
          <meta name="description" content="The Tarzan Way is a travel based startup with the vision to simplify travel and build immersive travel programs across India. We personalize travel package and provide unique travel experience for travel in India"></meta>
          <meta property="og:title" content="Travel Company | India | The Tarzan Way" />
          <meta property="og:description" content="The Tarzan Way is a travel based startup with the vision to simplify travel and build immersive travel programs across India. We personalize travel package and provide unique travel experience for travel in India" />
          <meta property="og:image" content="/logoblack.svg" />
          <meta property='keywords' content='travel in india, tour in india, india travel, travel agents near me, plan a trip, travel and experience culture, local travel experience, customized trip planner india, customized holiday packages, customized packages in computer, customized travel, honeymoon travel packages, personalized travel package'></meta>
      </Head>
       
     <HomepageContainer ThemeData={props.ThemeData}></HomepageContainer>
    </Layout>
  )
 
}

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
    showLogin: state.auth.showLogin,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState: () => dispatch(authaction.checkAuthState()),
    authCloseLogin: () => dispatch(authaction.authCloseLogin()),
  };
};

export async function getStaticProps(){

  const res = await axiosTravelPlannerInstance.get(`/list?country=India&page_type=Theme`)
  const data = res.data

  const ThemeData = data.map((e)=>{return {id : e.id, link : e.link, image : e.image,heading : e.meta_keywords.split(',')[0]}})
       if (!data) {
            return {
              notFound: true,
            }
          }
      return{
            props: {
                  ThemeData: ThemeData
            }
      }
  }

export default  connect(mapStateToPros, mapDispatchToProps)(Home);