import ExperienceContainer from '../../../containers/city/Index';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import Head  from 'next/head';
const Experience = (props) => {
     const schemaData = {
      "@context": "https://schema.org/",
      "@type": "item",
      "name": props.cityData.name,
      "description": props.cityData.short_description,
    
    };
     const router = useRouter();
    return <Layout>
          <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}

          >
          
          </script>
         <Head>
         <meta name="description" content={props.cityData.short_description}    />
    <meta property="og:title" content={props.cityData.name +" | Travel Guide |  The Tarzan Way"} />
    <meta property="og:description" content={props.cityData.short_description} />
    <meta property="og:image" content="/logoblack.svg" />
      <title>{props.cityData.name +" | Travel Guide |  The Tarzan Way"}</title>
      <meta property='keywords' content='best places to visit in india, best places to visit in kasol, best places to visit in ladakh, best places to visit in andaman, best places to visit in manali, best places to visit in delhi, best places to visit in rajasthan, package for ladakh, package for manali, package for delhi, package for andaman, package for kashmir'></meta>
      </Head><ExperienceContainer  cityData={props.cityData}  id={router.query.city}></ExperienceContainer></Layout>
}

export async function getStaticPaths(){

      const res = await fetch(`https://apis.tarzanway.com/search/all/?type=Location`)
      const data = await res.json();
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
      //       if(object.cta !== null)
      //             return {
      //                   params: {
      //                         city: object.cta
      //                   }
      //             }
      // })
      return{
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