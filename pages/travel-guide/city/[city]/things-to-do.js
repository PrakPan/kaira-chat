import ExperienceContainer from '../../../../containers/thingstodo/Index';
import Layout from '../../../../components/Layout';
import { useRouter } from 'next/router';
import Head  from 'next/head';
import axios from 'axios';
import {axiosallCityInstance} from '../../../../services/pages/travel-guide'

const Experience = (props) => {

    const router = useRouter();
    return <Layout>
         <Head>
         <meta
      name="description"
      content="We envision to simplify travel and build immersive travel experiences."
    />
    <meta property="og:title" content={props.cityData.name +" Things To Do  | The Tarzan Way"}/><meta property="og:description" content="We envision to simplify travel and build immersive travel experiences." /><meta property="og:image" content="/logoblack.svg" />
    <title>{props.cityData.name +" Things To Do | Travel Guide |  The Tarzan Way"}</title>
      </Head><ExperienceContainer cityData={props.cityData}   id={router.query.city}></ExperienceContainer></Layout>
// return null;
}

export async function getStaticPaths(){

      // const res = await fetch(`https://apis.tarzanway.com/search/all/?type=Location`)
      // const data = await res.json();

      const res = await axiosallCityInstance.get('')
      const data = res.data

      let paths = [];
      for(var i = 0 ; i<data.length ; i++){
            if(data[i].cta){
                  paths.push({
                        params: {
                              city: data[i].cta
                        }
                  })
            }
      }
      // let paths = data.map((object) => {
      //       if(object.cta !==null)

      //             return {
      //                   params: {
      //                         city: object.cta
      //                   }
      //             }
      // })
      return{
            fallback: true, 
            paths: paths,
            fallback: 'blocking'

             
      }
}
export async function getStaticProps(context){

      const res = await fetch(`https://apis.tarzanway.com/poi/city/?slug=`+context.params.city)
      const data = await res.json()
      if (!data) {
            return {
              notFound: true,
            }
          }
      return{
            props: {
                  cityData: data
            }
      }
}

export default Experience