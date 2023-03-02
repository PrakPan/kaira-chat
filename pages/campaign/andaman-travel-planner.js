import CampaignContainer from '../../containers/andaman-campaign/Index';
import Layout from '../../components/Layout';
import Head  from 'next/head';
import { useRouter } from 'next/router';
import * as ga from '../../services/ga/Index';

const Campaign = (props) => {
  const router = useRouter();
  const _handleTailoredRedirect = () => {
    router.push('/tailored-travel?search_text=Andaman')
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
         <title>Personalize Your Andaman Trip | Best Tour Packages for Andaman & Nicobar Islands</title>
         <meta
      name="description"
      content="Personalize your Andaman and Nicobar Island Trip with Us. Discover the beauty of this pristine destination, with personalized Andaman Tour Packages."
    />
    <meta property="og:title" content="Personalize Your Andaman Trip | Best Tour Packages for Andaman & Nicobar Islands" /><meta property="og:description" content="Personalize your Andaman and Nicobar Island Trip with Us. Discover the beauty of this pristine destination, with personalized Andaman Tour Packages." /><meta property="og:image" content="/logoblack.svg" />
      <meta property='keywords' content='andaman & nicobar travel packages, andaman tour package, andaman and nicobar honeymoon packages, andaman tour package from delhi, andaman tour package from bangalore, andaman tour package from kolkata, andaman tour packages from mumbai, andaman tour package cost, andaman tour package from chennai, andaman family tour packages, andaman nicobar tour package from ahmedabad, andaman tour package from coimbatore, andaman tour packages from hyderabad, andaman nicobar islands tour packages, andaman tour package from nagpur, andaman nicobar tour package from jaipur, andaman nicobar tour package from delhi, andaman tour package from bangalore including flight, andaman family tour package from chennai including flight,
'></meta>            
      </Head><CampaignContainer guideData={props.data}></CampaignContainer></Layout>
      // return null;
}
 

export default Campaign