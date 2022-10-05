import CampaignContainer from '../../containers/kashmir-campaign/Index';
import Layout from '../../components/Layout';
import Head  from 'next/head';
import { useRouter } from 'next/router';
import * as ga from '../../services/ga/Index';

const Campaign = (props) => {
  const router = useRouter();
  const _handleTailoredRedirect = () => {
    router.push('/tailored-travel?search_text=Kashmir')
  }
  const _handleTailoredClick = () => {
     setTimeout(_handleTailoredRedirect, 1000);
  
    ga.callback_event({
      action: 'TT-Desktopbanner',
      
      callback: _handleTailoredRedirect,
    })
  
  }
  
    return <Layout hidehomecta ctaonclick={_handleTailoredClick}>
         <Head>
         <title>Kashmir Travel Package: Personalize Your Kashmir Tour - Lowest Prices Guaranteed</title>
         <meta
      name="description"
      content="Book your personalized Kashmir trip with us. Explore the true beauty of Kashmir and the valley's iconic sights. Lowest price with best value!"
    />
    <meta property="og:title" content="Kashmir Travel Package: Personalize Your Kashmir Tour - Lowest Prices Guaranteed" /><meta property="og:description" content="Book your personalized Kashmir trip with us. Explore the true beauty of Kashmir and the valley's iconic sights. Lowest price with best value!" /><meta property="og:image" content="/logoblack.svg" />
      <meta property='keywords' content='kashmir tour packages,kashmir travel package, kashmir trip cost,kashmir trip itinerary, kashmir holiday packages,jammu kashmir tour package, kashmir honeymoon packages,kashmir trip, kashmir trip package,srinagar tour packages, j&k tour packages,kashmir family tour package,kashmir group tour packages,kashmir luxury tour packages, j&k tourism packages,jammu kashmir trip package,jammu and kashmir tour packages,srinagar tour and travel, delhi to srinagar tour package,gulmarg kashmir tour,honeymoon kashmir tour package,tour package for gulmarg,
'></meta>            
      </Head><CampaignContainer guideData={props.data}></CampaignContainer></Layout>
      // return null;
}
 

export default Campaign