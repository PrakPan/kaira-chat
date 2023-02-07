import Head from 'next/head';
import Layout from '../components/Layout';
// import { ScrollBar } from '../components/ScrollBar';
import PrivacyContainer from '../containers/newitinerary/Index';

const NewItinerary = () => {
     return  <Layout itinerary>  <Head>
    <title>Itinerary | The Tarzan Way | Travel India</title>
    <meta name="robots" content="noindex"></meta>
{/* 
    <meta name="description" content="You can find our privacy policy  here for travel enquiries, applications, and partnerships"></meta>
    <meta property="og:title" content="Privacy-Policy | The Tarzan Way | India" /> 
    <meta property="og:description" content="You can find our privacy policy  here for travel enquiries, applications, and partnerships" />
    <meta property="og:image" content="/logoblack.svg" /> */}

</Head>  <PrivacyContainer></PrivacyContainer></Layout>
 

}

export default NewItinerary