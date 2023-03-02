import React, {useState, useEffect} from 'react';
import Row from '../../components/experiencecity/info/Row';

import InformationTextContainer from '../../components/experiencecity/info/InformationTextContainer';
// import YellowNavbar from './YellowNavbar';
import styled from 'styled-components';
import { Element } from 'react-scroll';
import Banner from './Banner/Index';
import { useRef } from 'react'
import { useRouter } from 'next/router';
import ExperiencesBlog from '../../components/containers/ExperiencesBlog';
import homepagecontent from '../../public/content/homepage';
import media from '../../components/media';
// import Heading from '../../components/heading/Heading';
import Heading from '../../components/newheading/heading/Index';
import Locations  from '../../components/experiencecity/info/RecommendedCities';
import PaginatedPoiMobile from '../../components/experiencecity/info/paginatedpoi/mobile/Index';
import PaginatedPoiDesktop from '../../components/experiencecity/info/paginatedpoi/desktop/Index';

import Blogs from '../../components/containers/Blogs';
import experiencepagecontent from '../../public/content/experiencepage';
import axiosrecommendedinstance from '../../services/poi/reccommededcities';
import Card from '../../components/cards/Location';

const HeadingContainer = styled.div`
height: max-content;
position: sticky;
background-color:white;
padding-bottom: 0.5rem;
z-index: 1040;
width: 100%;
@media screen and (min-width: 768px){
    top: 15vh;
    z-index: 1;
}
`;
const Details = (props) => {
  const [locations, setLocations] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
  


    axiosrecommendedinstance
      .get(
        `/?slug=`+props.slug
      )
      .then((res) => {
 
        setLocations(res.data);
       setLoaded(true);

      })
      .catch((error) => {
        // alert('Page could not be loaded. Please try again.');
      });

 
  }, []);

  let isPageWide = media('(min-width: 768px)')
  const router = useRouter();

  const [menuHeading, setMenuHeading] = useState('overview');
  let offsets = {

  }
  const [offset, setOffset] = useState(null);
  const inputRef = useRef()
  const howtoreach = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eros enim, lobortis quis velit in, commodo maximus risus. Morbi fringilla dui neque, eu ultrices tortor auctor in. <br></br> <p class='font-opensans'><b>By Air</b></p>How to reach by air<p class='font-opensans'><b>By Air</b></p>How to reach by air"
  const DetailsContainer = styled.div`
    width: 100%;
    margin: 0 auto 10vh auto;
    @media screen and (min-width: 768px) {
      width: 80%;
      padding: 0;
      margin: 0 auto 10vh auto;

    }
  `;
  const _handleRedirect = (slug) => {
    router.push('/travel-guide/city/'+slug)
  }
    let cardsarr=[];
  for(var i = 0 ; i<locations.length ; i++){
    const slug  = locations[i].slug;
    console.log(locations[i]);
    if(locations[i].image)
    cardsarr.push(
        <Card
  location={locations[i].name}
   img={locations[i].image}
  onclick={() => _handleRedirect(slug)}
  > 
  </Card>
    )
}




  return (
    <div >
      {/* <YellowNavbar   price={props.data.payment_info[0].total_cost}></YellowNavbar> */}
      {/* <PageNavigation price={props.data.payment_info[0].total_cost} /> */}
      {/* <HeaderExtraPadding></HeaderExtraPadding> */}
      <DetailsContainer>
      

         {!isPageWide ? <Element id='thingstodo'>
         {props.data.pois.length ?<Row heading='Things to do' top={!isPageWide ? '0' : "12vh"} padding="0 1rem">
          <PaginatedPoiMobile slug={props.slug} pois={props.data.pois} _openPoiModal={(poi) => props._openPoiModal(poi)} ></PaginatedPoiMobile>
          </Row> : null}
        </Element> :
        <Element id='thingstodo'>
        {props.data.pois.length ?<Row heading='Things to do' top={!isPageWide ? '0' : "12vh"} padding="0 1rem">
         <PaginatedPoiDesktop slug={props.slug} _openPoiModal={(poi) => props._openPoiModal(poi)} ></PaginatedPoiDesktop>
         </Row> : null}
       </Element> }

   

        <Element id='gettingaround' >
          {props.data.conveyance_available ? <Row heading="Getting Around" top={!isPageWide ? '0' : "12vh"} padding="0 1rem">
            <InformationTextContainer
              type='text'
              text={props.data.conveyance_available}></InformationTextContainer>
          </Row> : null}
        </Element>

      

        {props.data.experiences.length ? 
        <Element id='experiences' >
          {!isPageWide  ? <Row  heading='Experiences' top="0" padding="0 1rem">
          <ExperiencesBlog  page="testimonials" review heading={homepagecontent["Inidan Review"].name} text={homepagecontent["Inidan Review"].summary} img={homepagecontent["Inidan Review"].image} margin="2.5rem 0" experiences={props.data.experiences} ></ExperiencesBlog>
          </Row>
          : null} 
          {isPageWide && props.data.experiences.length > 3 ? <div>
          <Heading  bold noline aligndesktop="center" align="center">Experiences</Heading>
          <div  style={{height: '2rem'}}></div>
          <ExperiencesBlog  page="testimonials" review heading={homepagecontent["Inidan Review"].name} text={homepagecontent["Inidan Review"].summary} img={homepagecontent["Inidan Review"].image} margin="2.5rem 0" experiences={props.data.experiences} ></ExperiencesBlog>
          </div>: null}
        </Element> : null}

      {locations.length ? <Element id="nearby-places">
        {isPageWide ? <div>
        <Heading bold noline aligndesktop="center" align="center" margin="0 0 2rem 0">Nearby Places</Heading>
          <Locations cards={cardsarr}   slug={props.slug} locations={homepagecontent["Top Locations"]}></Locations>
        </div> : null}
        {!isPageWide ? <Row  heading='Nearby Places' top="0" padding="0 1rem">
          <Locations  cards={cardsarr} slug={props.slug} locations={homepagecontent["Top Locations"]}></Locations>
        </Row> : null}
        </Element> : null}
        <Blogs cityblogs={props.data.blogs} blogs={experiencepagecontent["Kasol Blogs"]} margin={isPageWide  ? "5rem 0" : "1.5rem 0"}></Blogs>

      </DetailsContainer>
     
      {!isPageWide? <Banner data={props.data}   heading={menuHeading}  color="black" buttonbgcolor="#F7e700" onclick={props.openBooking}></Banner> : null}
    </div>
  );
};

export default React.memo(Details);
