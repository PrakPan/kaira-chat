import ExperienceContainer from '../../containers/experiencelandingpage/Index';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import Head  from 'next/head';
import axios from 'axios';
const Experience = (props) => {
 
    const router = useRouter();
//     if(typeof window !== 'undefined')
    return <Layout itinerary>
         <Head>
         <meta
      name="description"
      content="We envision to simplify travel and build immersive travel experiences."
    />
    <meta property="og:title" content={props.experienceData.name+"| The Tarzan Way"} /><meta property="og:description" content="We envision to simplify travel and build immersive travel experiences." /><meta property="og:image" content="/logoblack.svg" />
            <title>{props.experienceData.name+"| The Tarzan Way"}</title>
      </Head><ExperienceContainer experienceData={props.experienceData} id={router.query.id}></ExperienceContainer></Layout>
      // else return null;
}

export async function getStaticPaths(){
      const res = await fetch(`https://apis.tarzanway.com/search/all/?type=Experience`)
      const data = await res.json();
      let paths = data.map((object) => {
                  return {
                        params: {
                              id: object.cta
                        }
                  }
      })
      return{
            fallback: true, 
            paths: paths,
            fallback: 'blocking'
      }
}
export async function getStaticProps(context){

      const res = await fetch(`https://apis.tarzanway.com/itinerary/experience/fetch?slug=`+context.params.id)
      const data = await res.json()
      if (!data) {
            return {
              notFound: true,
            }
          }
        
   
      return{
            props: {
                  experienceData: data
            }
      }
}
export default Experience