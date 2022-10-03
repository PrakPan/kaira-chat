import Head from 'next/head';
import Layout from '../components/Layout';
import LoaderContainer from '../containers/loaderbar/Index';

const Loader = () => {
     return <Layout>  <Head>
    <title>LoaderBar| The Tarzan Way | Travel India</title>
    <meta name="robots" content="noindex"></meta>
    <script src="https://kit.fontawesome.com/4f480de2c1.js" crossorigin="anonymous"></script>
{/* 
    <meta name="description" content="You can find our privacy policy  here for travel enquiries, applications, and partnerships"></meta>
    <meta property="og:title" content="Privacy-Policy | The Tarzan Way | India" /> 
    <meta property="og:description" content="You can find our privacy policy  here for travel enquiries, applications, and partnerships" />
    <meta property="og:image" content="/logoblack.svg" /> */}

</Head>  <LoaderContainer></LoaderContainer></Layout>
 

}

export default Loader