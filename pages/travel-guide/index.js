import ExperiencesContainer from '../../containers/guides/Index';
import Layout from '../../components/Layout';
import Head  from 'next/head';

import travelGuideInstance from '../../services/travel-guide/travel-guide'
const Guide = (props) => {
      
    return <Layout>
         <Head>
         <title>Travel Guides | Travel India | The Tarzan Way</title>
         <meta
      name="description"
      content="We envision to simplify travel and build immersive travel experiences."
    />
    <meta property="og:title" content="Travel Guides | The Tarzan Way" /><meta property="og:description" content="We envision to simplify travel and build immersive travel experiences." /><meta property="og:image" content="/logoblack.svg" />
      <meta property='keywords' content='best places to visit in india, best places to visit in kasol, best places to visit in ladakh, best places to visit in andaman, best places to visit in manali, best places to visit in delhi, best places to visit in rajasthan, package for ladakh, package for manali, package for delhi, package for andaman, package for kashmir'></meta>            
      </Head><ExperiencesContainer guideData={props.data}></ExperiencesContainer></Layout>
}
 
export async function getStaticProps(context){

      const res = await travelGuideInstance.get('/')
      const data = res.data
      if (!data) {
            return {
              notFound: true,
            }
          }
      return{
            props: {
                  data: data
            }
      }
}


export default Guide