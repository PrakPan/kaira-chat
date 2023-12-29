import Head from 'next/head'
import HomepageContainer from '../containers/homepage/Index';
import Layout from '../components/Layout';
import { connect } from 'react-redux';
import * as authaction from '../store/actions/auth';
import { useEffect } from 'react';
import axiospagelistinstance from '../services/pages/list'
import axioscountrydetailsinstance from "../services/pages/country";
import axios from 'axios'
import { useRouter } from 'next/router';
const Home = (props) => {
  const router = useRouter()
  useEffect(() => {
    props.checkAuthState();
 
  }, []);
  return (
    <Layout>
      <Head>
        <title>Travel Company | India | The Tarzan Way</title>
        <meta
          name="description"
          content="The Tarzan Way is a travel based startup with the vision to simplify travel and build immersive travel programs across India. We personalize travel package and provide unique travel experience for travel in India"
        ></meta>
        <meta
          property="og:title"
          content="Travel Company | India | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="The Tarzan Way is a travel based startup with the vision to simplify travel and build immersive travel programs across India. We personalize travel package and provide unique travel experience for travel in India"
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content="travel in india, tour in india, india travel, travel agents near me, plan a trip, travel and experience culture, local travel experience, customized trip planner india, customized holiday packages, customized packages in computer, customized travel, honeymoon travel packages, personalized travel package"
        ></meta>
      </Head>

      <HomepageContainer
        asiaLocations={props.asiaLocations}
        europeLocations={props.europeLocations}
        token={props.token}
        locations={props.locations}
        ThemeData={props.ThemeData}
        continetCarousel={props.continetCarousel}
      ></HomepageContainer>
    </Layout>
  );
 
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

export async function getStaticProps() {
var ThemeData = [];
  var locations = []
  var asiaLocations = []
  var europeLocations = []
  try{
    const res = await axios.get(
      `https://apis.tarzanway.com/page/list?country=India&page_type=Theme&fields=id,banner_heading,path,image,link`
    );
    ThemeData = res.data;
  }
  catch(e){
    ThemeData = [];
  }
  try{
    const loc = await axiospagelistinstance.get(
      `?country=india&fields=id,destination,tagline,image,link,path`
    );
    locations = loc.data;

  const response = await axioscountrydetailsinstance(
    "/all?continent=asia&fields=id,name,path,tagline,image"
  );
    asiaLocations = response.data;  
      const resp = await axioscountrydetailsinstance(
        "/all?continent=europe&fields=id,name,path,tagline,image"
      );
    europeLocations = resp.data;  
  }
catch(e){
    locations = []
    asiaLocations = []
    europeLocations = []
  }
// contient carousel :-
  const res = await axiospagelistinstance(
    "?page_type=Continents&fields=destination,tagline,image,path"
  );
    const continetCarousel = [];
    for (let i = 0; i < res.data.length; i++) {
      const hot_destinations = await axioscountrydetailsinstance(
        `/all?continent=${res.data[i].destination}&hot_destinations=true&fields=id,name,path,tagline,image`
      );
      const hot_data = hot_destinations.data.filter((e, i) => {
        if (i < 6) return e;
      });
      continetCarousel.push({ ...res.data[i], hot_destinations: hot_data });
    }
      return {
        props: {
          ThemeData,
          locations,
          asiaLocations,
          europeLocations,
          continetCarousel,
        },
      };
  }

export default  connect(mapStateToPros, mapDispatchToProps)(Home);