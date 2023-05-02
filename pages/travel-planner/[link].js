import LadakhContainer from '../../containers/travelplanner/Index';
import Head from 'next/head';
import Layout from '../../components/Layout'
import { useState, useEffect } from 'react';
import axiosTravelPlannerInstance from '../../services/pages/travel-planner'
import axiospagelistinstance from '../../services/pages/list'
const TravelPlanner = (props) => {
	const [data, setData] = useState({
		page_title: null,
		meta_description: null,
		social_media_description: null,
		meta_keywords: null,
		social_share_title: null,

	});
	useEffect(() => {
			// setData(DATA);
	  }, []);

     return <Layout page_id={props.Data.id} destination={props.Data.destination}> 
      <Head>
      <title>{props.Data.page_title}</title>
      <meta name="description" content={props.Data.meta_description}></meta>
          <meta property="og:title" content={props.Data.social_share_title}/>
          <meta property="og:description" content={props.Data.social_media_description} />
          <meta property="og:image" content="/logoblack.svg" />
          <meta property='keywords' content={props.Data.meta_keywords}></meta>
</Head><LadakhContainer experienceData={props.Data} locations={props.locations}></LadakhContainer>
</Layout>
    
}

export async function getStaticPaths(){

//     const res = await fetch(`https://apis.tarzanway.com/page/list?country=india`)
//     const data = await res.json();
      const res = await axiosTravelPlannerInstance.get('/list')
      const data = res.data
      let paths = [];
    for(var i = 0 ; i<data.length ; i++){
          if(data[i].id!==1){
                paths.push({
                      params: {
                            link: data[i].link,
                      }
                })
          }
    }  
  
    return{
           paths: paths,
          fallback: 'blocking'
    }
}
export async function getStaticProps(context){

//     const res = await fetch(`https://apis.tarzanway.com/page/?link=`+context.params.link)
//     const data = await res.json()
const res = await axiosTravelPlannerInstance.get(`/?link=${context.params.link}`)
const data = res.data
var locations = []
var country = 'India'
      if(data.ancestors){
        if(data.ancestors.length && data.ancestors[0].level == 'Country' && data.ancestors[0].name){
          country = data.ancestors[0].name
        }
      }
try{
      const loc = await axiospagelistinstance.get(`/?country=${country}`)
       locations = loc.data
}
catch(e){
      locations = []
}
    if (!data) {
          return {
            notFound: true,
          }
        }
    return{
          props: {
                Data: data,
                locations
          }
    }
}




export default TravelPlanner