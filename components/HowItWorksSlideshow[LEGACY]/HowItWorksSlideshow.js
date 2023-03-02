import React, {useState} from 'react';
import styled from 'styled-components';

import left from '../../public/assets/icons/navigation/leftcolor.svg';

import right from '../../public/assets/icons/navigation/rightcolor.svg';

import classes from './HowItWorksSlideshow.module.css';

/*Legacy Slideshow component for about us values (mobile)*/

const Container = styled.div`
    display: grid;
    grid-template-columns: max-content auto max-content;
`;
const Arrow = styled.img`
    width: 1.5rem;
    margin: auto 0.5rem;
`;

const TextContainer = styled.div`

`;
const Text = styled.p`
    font-size: 1rem;
    text-align: center;
    width: 90%;

`;
const ImageContainer = styled.div`
    padding: auto 1rem;
`;
const GridContainer = styled.div`
    display: grid;
    grid-template-columns: ${(props)=> props.vertical ? 'auto' : '60% 40%'};
    `;
    const Image = styled.img`
    width: ${(props)=>props.vertical ? '40%' : '100%'};
    margin: auto;
    display: block;
    `;


const HowItWorksSlideshow = (props) =>{
    
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
    const slides = [
        <div style={{gridTemplateColumns: props.vertical ?  'auto' : '60% 40%'}} >
            <div className={classes.TextContainer} >
                {props.content[0]}
            </div>
            <div className={classes.TextContainer} >
                <img className={classes.Image} src={props.images[0]} style={{width : props.vertical ? '40%' : '60%'}}/>
            </div>
        </div>,
        <div style={{gridTemplateColumns: props.vertical ? 'auto' : '60% 40%'}} >
            <div className={classes.TextContainer} >
                {props.content[1]}
            </div>
            <div className={classes.ImageContainer}>
                <img className={classes.Image}  src={props.images[1]} style={{width : props.vertical ? '40%' : '60%'}}/>
            </div>
        </div>,
        <div style={{gridTemplateColumns: props.vertical ? 'auto' : '60% 40%'}} >
            <div className={classes.TextContainer} >
                {props.content[2]}
            </div>
            <div className={classes.ImageContainer}>
                <img className={classes.Image}  src={props.images[2]} style={{width : props.vertical ? '40%' : '60%'}}/>
            </div>
        </div>
    ]
    return(
    <div className={classes.Container}  draggable="true"  onDragStart={_handleDragStart} onDragEnd={_handleDragEnd}>
        <div className="center-div">
            <img className={classes.Arrow} src={left} onClick={_prevSlideHandler}/>
        </div>
        {slides[slideSelected]}
        <div className="center-div">
            <img className={classes.Arrow} src={right} onClick={_nextSlideHandler}/>
        </div>
    </div>
    );
    
} 

export default React.memo(HowItWorksSlideshow);