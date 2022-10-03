import TailoredContainer from '../containers/personaliseform/Index';
import Layout from '../components/Layout'
import Head from 'next/head';
import {useEffect} from 'react'

const Contact = (props) => {
     return <Layout itinerary hidecta><Head>
    <title>Tailored Travel | The Tarzan Way</title>
    <meta property="og:title" content="Tailored Travel | The Tarzan Way" /><meta property="og:description" content="We envision to simplify travel and build immersive travel experiences." /><meta property="og:image" content="/logoblack.svg" />
</Head><TailoredContainer referer={props.referer}></TailoredContainer>
  </Layout>
 
}

 
export default (Contact)