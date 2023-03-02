import React, {useState} from 'react';
import Flickity from './Flickity';
import ImageLoader from '../../../../../ImageLoader';


const FlickityCarousel = (props) => {
  const [hover, setHover] = useState(false);

 //     let cards = [
//       <ImageLoader borderRadius="5px" url={props.images[0].image}   width='15vw' widthmobile="100%" height="auto"   dimensions={{width: 1600, height: 1600}} dimensionsMobile={{width: 1800, height: 1200}}></ImageLoader>
// ,      <ImageLoader borderRadius="5px" url={props.images[0].image}   width='15vw' widthmobile="100%" height="auto"   dimensions={{width: 1600, height: 1600}} dimensionsMobile={{width: 1800, height: 1200}}></ImageLoader>

//     ]
const _onMouseEnter = () => {
   setHover(true);
}
let cards=[<div>1</div>, <div>3</div>]
      return(
        <div onMouseOver={_onMouseEnter} onMouseLeave={() => setHover(false)}>
        <Flickity hover={hover}   review_score={props.review_score} review_count={props.review_count} images={props.images} cards={[<div>1</div>, <div>3</div>]}></Flickity>
        {/* <div>PRESS</div> */}
        </div> );
  } 


export default FlickityCarousel;