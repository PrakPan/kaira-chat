import React, {useState} from 'react';
import styled from 'styled-components';
import left from '../../public/assets/icons/navigation/leftcolor.svg';
import right from '../../public/assets/icons/navigation/rightcolor.svg';
import media from '../../components/media';
import Button from '../ui/button/Index';
import * as ga from '../../services/ga/Index';
 import { useRouter } from 'next/router';
import ImageLoader from '../ImageLoader';
/* Grid (desktop) / slideshow (mobile)
    inputs: images, content (JSX array), headings (JSX array)
    used: homepage, travel support
*/

const Container = styled.div`
   
    @media screen and (min-width: 768px){
        width: 100%;
        margin: auto;
      
    }
`;
const Arrow = styled.img`
    width: 1.5rem;
    margin: auto 0.5rem;
`;

const TextContainer = styled.div`
font-size: 16px;

`;
 
const ImageContainer = styled.div`
    padding: auto 1rem;
`;

const GridContainer = styled.div`
display: grid;
grid-gap: 1rem;
grid-template-columns: 1fr 3fr;
    @media screen and (min-width: 768px){
        grid-gap: 1rem;
        margin-bottom: 1rem;
    }
    `;
    
    
    
const HowItWorksSlideshow = (props) =>{
    const router=useRouter();
    let isPageWide = media('(min-width: 768px)');
    // const Image = styled.img`
    // width: ${props.vertical ? '40%' : '60%'};
    // margin: auto;
    // display: block;
    // @media screen and (min-width: 768px){
    //     width: 50%;
    // }
    // `;
    
    let touchstart = null;
    const [slideSelected, setSlideSelected] = useState(0);
    const _prevSlideHandler = (val) => {

        if(!(slideSelected === 0))
        setSlideSelected(slideSelected - 1);
    }
    const _nextSlideHandler = (val) => {

        if( !(slideSelected === 2) )
         setSlideSelected(slideSelected + 1);

    }
    const _handleDragStart = (event) => {
        touchstart = event.clientX;
    }
    const _handleDragEnd = (event) => {
        if(touchstart > event.clientX) _nextSlideHandler()
        else _prevSlideHandler();
    }
    const slidesmobile = [
        <GridContainer style={{}} >
             <ImageContainer className="center-div">
                <ImageLoader url ={props.images[0]} width="50%" margin="auto"  widthmobile={props.vertical ? '40%' : '60%'} />
            </ImageContainer>
            <TextContainer className="center-div">
                {props.headings[0]}
                {props.content[0]}
            </TextContainer>
           
        </GridContainer>,
        <GridContainer style={{}}>
            <ImageContainer className="center-div">
                <ImageLoader url={props.images[1]} width="50%" margin="auto" dimensions={{width: 400, height: 400}} widthmobile={props.vertical ? '40%' : '60%'} />
            </ImageContainer>
            <TextContainer className="center-div">
            {props.headings[1]}

                {props.content[1]}
            </TextContainer>
            
        </GridContainer>,
        <GridContainer style={{}}>
            <ImageContainer className="center-div">
                <ImageLoader url={props.images[2]} width="50%" margin="auto"  dimensions={{width: 400, height: 400}}  widthmobile={props.vertical ? '40%' : '60%'} />
            </ImageContainer>
            <TextContainer className="center-div">
            {props.headings[2]}
                {props.content[2]}
            </TextContainer>
            
        </GridContainer>
    ]
    const slidesdesktop = [
        <GridContainer key={0} style={{}} >
                <ImageContainer>
                <ImageLoader url={props.images[0]} width="100%" margin="auto" dimensions={{width: 400, height: 400}}  widthmobile={props.vertical ? '40%' : '60%'} />
        </ImageContainer>
        <TextContainer>
        {props.headings[0]}
            {props.content[0]}
        </TextContainer>
    
    </GridContainer>,
    <GridContainer  key={1} style={{}}>
            <ImageContainer>
            <ImageLoader url={props.images[1]} width="100%" margin="auto"  dimensions={{width: 400, height: 400}}  widthmobile={props.vertical ? '40%' : '60%'} />
        </ImageContainer>
        <TextContainer>
        {props.headings[1]}
            {props.content[1]}
        </TextContainer>
    
    </GridContainer>,
    <GridContainer  key={2} style={{}}>
         <ImageContainer >
         <ImageLoader url={props.images[2]} width="100%" margin="auto" dimensions={{width: 400, height: 400}} s widthmobile={props.vertical ? '40%' : '60%'} />
        </ImageContainer>
        <TextContainer>
        {props.headings[2]}
            {props.content[2]}
        </TextContainer>
       
    </GridContainer>
    ]
    // if(!isPageWide )
    const [loading, setLoading] = useState(false);

    const _handleTailoredRedirect = () => {
        router.push('/tailored-travel')
      }
      const _handleTailoredClick = () => {
        setLoading(true);
        setTimeout(_handleTailoredRedirect, 1000);
      
        ga.callback_event({
          action: 'TT-Howitworks',
          
          callback: _handleTailoredRedirect,
        })
      
      }
    return(
    <div>
    {/* <Container className='hidden-desktop' draggable="true"  onDragStart={_handleDragStart} onDragEnd={_handleDragEnd}>
        <div className="center-div">
            <Arrow src={left} onClick={_prevSlideHandler}/>
        </div>
        {slidesmobile[slideSelected]}
        <div className="center-div">
            <Arrow src={right} onClick={_nextSlideHandler}/>
        </div>
    </Container> */}
        <Container className='hidden-mobil'>
            {slidesdesktop}
        </Container>
        {!props.nostart ? <Button onclick={props.onclick ? props.onclick : _handleTailoredClick}   boxShadow borderRadius="2rem" margin="1rem auto"  padding="0.5rem 2rem" borderWidth="1px">
            Start Now
            {/* {loading ? <Spinner size={16}></Spinner> : null} */}
        </Button> : null}
        </div>
    );
    
} 

export default React.memo(HowItWorksSlideshow);