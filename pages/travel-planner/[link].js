import ExperienceContainer from '../../containers/travelplanner/Index';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import Head  from 'next/head';
import axios from 'axios';
const Experience = (props) => {
 console.log('d', props.experienceData)
    const router = useRouter();
     return <Layout itinerary>
         <Head>
         <meta
      name="description"
      content={props.experienceData.meta_description && props.experienceData.meta_description!=="" ? props.experienceData.meta_description : "We envision to simplify travel and build immersive travel experiences."}
    />
    <meta property="og:title" content={props.experienceData.page_title && props.experienceData.page_title!=="" ? props.experienceData.page_title : props.experienceData.overview_heading+" Travel Planner | The Tarzan Way"} /><meta property="og:description" content={props.experienceData.meta_description && props.experienceData.meta_description!=="" ? props.experienceData.meta_description : "We envision to simplify travel and build immersive travel experiences."} /><meta property="og:image" content="/logoblack.svg" />
            <title>{props.experienceData.page_title ? props.experienceData.page_title : props.experienceData.overview_heading+" Travel Planner | The Tarzan Way"}</title>
      </Head><ExperienceContainer experienceData={props.experienceData} link={router.query.link}></ExperienceContainer></Layout>
}

export async function getStaticPaths(){
      const res = await fetch(`https://apis.tarzanway.com/page/list`)
      const data = await res.json();
      console.log(data);
      let paths = [];
      for(var i =0 ; i< data.length; i++){
            if(data[i].page_type === 'Destination'){
                  paths.push({
                        params: {
                              link: data[i].link
                        }
                  })
            }
      }
  
      return{
            fallback: false, 
            paths: paths,
       }
}
export async function getStaticProps(context){

      const res = await fetch(`https://apis.tarzanway.com/page/?link=`+context.params.link)
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