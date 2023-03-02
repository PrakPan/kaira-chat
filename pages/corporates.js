import CovidContainer from '../containers/corporates[dev]/Index';
import Head from 'next/head';
import Layout from '../components/Layout'

const Covid = () => {
     return <Layout> 
      <Head>
      <title>Travel Support | Travel India | The Tarzan Way </title>
          <meta name="description" content="Keeping safe from coronavirus while traveling in India is very important and we have taken a number of steps to make sure that your travel experience in India is the safest and we are taking multiple steps to prevent anything happening to our travelers while traveling in India during the pandemic outbreak of coronavirus"></meta>
          <meta property="og:title" content="COVID-19 Safety | Safe Travel India | The Tarzan Way" /> 
          <meta property="og:description" content="Keeping safe from coronavirus while traveling in India is very important and we have taken a number of steps to make sure that your travel experience in India is the safest and we are taking multiple steps to prevent anything happening to our travelers while traveling in India during the pandemic outbreak of coronavirus" />
          <meta property="og:image" content="/logoblack.svg" />
</Head>
<CovidContainer></CovidContainer>
</Layout>
    
}

export default Covid