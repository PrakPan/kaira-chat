import ExpereincesContainer from '../containers/experiencelistingpreview[dev]/Index';
import Layout from '../components/Layout'
import Head from 'next/head'

const Experiences = () => { 

  if(typeof window !== 'undefined')
    return <Layout>
         <Head>
         <meta
      name="description"
      content="We envision to simplify travel and build immersive travel experiences."
    />
    <meta property="og:title" content="Tailored Travel | The Tarzan Way" /><meta property="og:description" content="We envision to simplify travel and build immersive travel experiences." /><meta property="og:image" content="/logoblack.svg" />
            <title>Travel Experiences | The Tarzan Way</title>
      </Head>
        <ExpereincesContainer></ExpereincesContainer>
        </Layout>
          else return<div></div>

}

export default Experiences