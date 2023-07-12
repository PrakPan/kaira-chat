import React, {useState} from 'react';
import styled from 'styled-components';
 
import FullImg from '../../components/FullImage';
import Heading from '../../components/newheading/heading/Index';
import FullImgContent from './FullImgContent';
 
import media from '../../components/media';
  import travelsupportcontent from '../../public/content/travelsupport';
import Logos from './Logos';
import Benefits from './Benefits';
 import CaseStudies from './CaseStudies/Index';
import Enquiry from './enquiry/Index';
import NewCaseStudies from './NewCaseStudies/Index';

 
const SetWidthContainer = styled.div`
    width: 100%;
    margin: auto;
    @media screen and (min-width: 768px){
      width: 80%;
    }
  `;

const AffiliatePage = ()=> {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  let isPageWide = media('(min-width: 768px)');
 
  return (
    <div>
      <FullImg
        // style={isPageWide ? {} : { height: "30rem" }}
        heightmobile={"30rem"}
        height={"37rem"}
        filter={"brightness(0.7)"}
        zIndex={-1}
        center={isPageWide ? false : true}
        // url="media/website/duy-pham-Cecb0_8Hx-o-unsplash-min.jpeg"
        url={
          isPageWide
            ? "media/page/helena-lopes-UZe35tk5UoA-unsplash.jpg"
            : "media/page/corporates-mobile.jpg"
        }
      >
        <FullImgContent
          setEnquiryOpen={() => setEnquiryOpen(true)}
          subheading={travelsupportcontent["subheading"]}
        ></FullImgContent>
      </FullImg>
      <SetWidthContainer>
        <Logos></Logos>
        <Heading margin="5rem auto" bold>
          Catered to every organisation's need
        </Heading>
        <Benefits></Benefits>

        <Heading margin="5rem auto 2.5rem auto" bold>
          Reviews
        </Heading>
        {/* <CaseStudies></CaseStudies> */}
        <NewCaseStudies />
        {/* <WhyUs></WhyUs> */}
        {/* <HowItWorks images={howitworksimgs} content={HowitWorksContentsArr} headings={HowitWorksHeadingsArr}></HowItWorks> */}
      </SetWidthContainer>
      <br></br>
      <Enquiry
        show={enquiryOpen}
        onhide={() => setEnquiryOpen(false)}
      ></Enquiry>
    </div>
  );
}

export default AffiliatePage;
