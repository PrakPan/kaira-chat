import CampaignContainer from '../../containers/rajasthan-campaign/Index';
import Layout from '../../components/Layout';
import Head  from 'next/head';
import { useRouter } from 'next/router';
import * as ga from '../../services/ga/Index';

const Campaign = (props) => {
  const router = useRouter();
  const _handleTailoredRedirect = () => {
    router.push('/tailored-travel?search_text=Rajasthan')
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
         <title>Rajasthan Travel Package: Personalize Your Rajasthan Tour - Lowest Prices Guaranteed</title>
         <meta
      name="description"
      content="Book your Rajasthan holidays with us. We offer customised Rajasthan tour packages for family, budget and luxury travelers."
    />
    <meta property="og:title" content="Rajasthan Travel Package: Personalize Your Rajasthan Tour - Lowest Prices Guaranteed" /><meta property="og:description" content="Book your Rajasthan holidays with us. We offer customised Rajasthan tour packages for family, budget and luxury travelers." /><meta property="og:image" content="/logoblack.svg" />
      <meta property='keywords' content='jaipur tour package, 
complete rajasthan tour, 
rajasthan tours and travels, 
rajasthan trip plan, 
rajasthan trip itinerary, 
ajmer tour package, 
jaipur udaipur tour, 
jaipur sightseeing tours, 
rajasthan tour itinerary, 
jaipur sightseeing tour package, 
jaipur udaipur package, 
jaipur and udaipur package, 
rajasthan trip from delhi, 
rajasthan tour, 
jaisalmer tour package, 
rajasthan trip, 
udaipur tour packages, 
udaipur package, 
mount abu tour packages, 
jaisalmer trip, 
rajasthan package, 
rajasthan tours and travels, 
rajasthan trip planner, 
jaisalmer tour, 
rajasthan honeymoon package, 
jaisalmer package, 
rajasthan tour packages from mumbai, 
mount abu package, 
rajasthan tour packages from pune, 
jaipur packages, 
rajasthan tour package from bangalore, 
rajasthan holiday package, 
udaipur honeymoon packages, 
cheapest rajasthan tour packages
,
'></meta>            
      </Head><CampaignContainer guideData={props.data}></CampaignContainer></Layout>
      // return null;
}
 

export default Campaign