import React, {useEffect} from 'react';
import DesktopTimeline from './DesktopTimeline';
import MobileTimeline from './MobileTimeline';
import media from '../../../components/media';

const AboutUs = () => {  
  let isPageWide = media('(min-width: 768px)')
  // if(typeof window !== "undefined" && window.innerWidth >= 768  )

  if(isPageWide) return <DesktopTimeline></DesktopTimeline>
  else return <MobileTimeline></MobileTimeline>


}

export default AboutUs;
