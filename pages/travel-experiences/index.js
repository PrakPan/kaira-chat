import ExpereincesContainer from '../../containers/experiencelisting/Index';
import Layout from '../../components/Layout'
import Head from 'next/head'

const Experiences = () => { 

  // if(typeof window !== 'undefined')
    return <Layout>
         <Head>
          <title>Travel Experiences | Travel India | The Tarzan Way </title>
          <meta name="description" content="Looking for something different than just checking your list of places? Take part in our experiential travel programs all across India created and curated by The Tarzan Way team."></meta>
          <meta property="og:title" content="Travel Experiences | India | The Tarzan Way " />
          <meta property="og:description" content="Looking for something different than just checking your list of places? Take part in our experiential travel programs all across India created and curated by The Tarzan Way team." />
          <meta property="og:image" content="/logoblack.svg" />
          <meta property='keywords' content='experiential travel india, himachal pradesh tours, uttarakhand tours, experiential tours, cultural tours india, spiritual tours india, adventure tours india, getaways near delhi, weekend getaways, vacations plan, village tourism, tours near delhi, local travel experience, customized trip planner india, customized holiday packages, customized packages in computer, customized travel, honeymoon travel packages, personalized travel package'></meta>
      </Head>
        <ExpereincesContainer></ExpereincesContainer>
        </Layout>
          // else return<div></div>

}

export default Experiences