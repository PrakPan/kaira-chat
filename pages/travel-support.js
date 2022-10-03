import CovidContainer from '../containers/travelsupport/Index';
import Head from 'next/head';
import Layout from '../components/Layout'

const Covid = () => {
     return <Layout> 
      <Head>
      <title>Travel Support | Travel India | The Tarzan Way </title>
          <meta name="description" content="Planning a travel experience can be time consuming and overwhelming, here is your travel buddy to help you plan the perfect travel experience in India for you and your loved ones"></meta>
          <meta property="og:title" content="Travel Support | Travel India | The Tarzan Way " /> 
          <meta property="og:description" content="Planning a travel experience can be time consuming and overwhelming, here is your travel buddy to help you plan the perfect travel experience in India for you and your loved ones" />
          <meta property="og:image" content="/logoblack.svg" />
          <meta property='keywords' content='best places to visit in india, best places to visit in kasol, best places to visit in ladakh, best places to visit in andaman, best places to visit in manali, best places to visit in delhi, best places to visit in rajasthan, package for ladakh, package for manali, package for delhi, package for andaman, package for kashmir'></meta>
</Head>
<CovidContainer></CovidContainer>
</Layout>
    
}

export default Covid