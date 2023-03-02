import DashboardContainer from '../../containers/userprofile/Index';
import Layout from '../../components/Layout'
import Head from 'next/head';
import {useEffect} from 'react'

const Dashboard = (props) => {
    if(typeof window !== 'undefined')
    return <Layout><Head>
    <title>Dashboard | The Tarzan Way</title>
    <meta property="og:title" content="Dahsboard | The Tarzan Way" /><meta property="og:description" content="We envision to simplify travel and build immersive travel experiences." /><meta property="og:image" content="/logoblack.svg" />
</Head><DashboardContainer></DashboardContainer>
  </Layout>
  else return <div></div>

}



export default (Dashboard)