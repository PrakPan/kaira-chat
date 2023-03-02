import CampaignContainer from '../../containers/kerala-campaign/Index';
import Layout from '../../components/Layout';
import Head  from 'next/head';
import { useRouter } from 'next/router';
import * as ga from '../../services/ga/Index';

const Campaign = (props) => {
  const router = useRouter();
  const _handleTailoredRedirect = () => {
    router.push('/tailored-travel?search_text=Uttarakhand')
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
         <title>#1 Travel Planner for Kerala: Personalize Your Kerala Trip with Us - Kerala Tourism</title>
         <meta
      name="description"
      content="Plan your Kerala Vacation with our personalized travel planner. Search Hotels, Cabins, Villas and Packages in Kerala. Get Price Quotes and Book Online!"
    />
    <meta property="og:title" content="#1 Travel Planner for Kerala: Personalize Your Kerala Trip with Us - Kerala Tourism" /><meta property="og:description" content="Plan your Kerala Vacation with our personalized travel planner. Search Hotels, Cabins, Villas and Packages in Kerala. Get Price Quotes and Book Online!" /><meta property="og:image" content="/logoblack.svg" />
      <meta property='keywords' content='kerala local travel packages,
southern travels kerala tour packages,
kerala travels tour packages,
kerala travel packages from hyderabad,
best kerala travel packages,
kerala tours and travels packages,
kerala budget travel packages,
munnar kerala travel package,
kerala travel packages from delhi,
kerala travel packages,
travel packages to kerala from bangalore,

'></meta>            
      </Head><CampaignContainer guideData={props.data}></CampaignContainer></Layout>
      // return null;
}
 

export default Campaign