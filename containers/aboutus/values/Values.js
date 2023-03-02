import React from 'react';
import styled from 'styled-components';
import img1 from '../../../public/assets/arts/values/Innovate.svg';
import img2 from '../../../public/assets/arts/values/improve.svg';
import img3 from '../../../public/assets/arts/values/interact.svg';
import imagebanner from '../../../public/assets/arts/Brush.png';
import Slideshow from '../../../components/HowItWorksSlideshow[LEGACY]/HowItWorksSlideshow';
// import Heading from '../../../components/heading/Heading';
import Heading from '../../../components/newheading/heading/Index';
import media from '../../../components/media';
import classes from './Values.module.css';

 
 
   
const ContentArr = [
    <div>
       <div className={classes.CardHeadingContainerLeft}>
            <p className="font-opensans" style={{fontSize: '2rem'}}>Innovate</p>
        </div>
        <p className={classes.Text} style={{textAlign: "center"}} className="font-nunito">We aim to create a highly intelligent and user-friendly platform that helps every traveler to understand, plan, and book a travel experience and interact with fellow travelers and guides.</p>
    </div>,
     <div>
       <div className={classes.CardHeadingContainerLeft}>
                        <p className="font-opensans" style={{fontSize: '2rem'}}>Improve</p>
        </div>
        <p className={classes.Text} style={{textAlign: "center"}}  className="font-nunito">We aim to improve a traveler’s journey by giving them a one-stop solution for each of their travel needs with complete transparency of prices.</p>
    </div>, 
    <div>
       <div className={classes.CardHeadingContainerLeft}>
            <p className="font-opensans" style={{fontSize: '2rem'}}>Interact</p>
        </div>
        <p className={classes.Text} style={{textAlign: "center"}}  className="font-nunito">We aim to interact and connect with every traveler and to build diverse experiences for everyone irrespective of their age, gender, financial conditions, or disabilities.</p>
    </div>
]
const Values=()=>{
    let isPageWide = media('(min-width: 768px)')
    if(isPageWide)
    return(
        <>
        <Heading aligndesktop="center" className="font-opensans text-center" align="center" bold  margin="3.5rem">Our Values</Heading>
        <div className={classes.Container}>
        <div className="text-center">
            <div className={classes.ImageHeadingContainer}>
                    <div className={classes.CardHeadingContainerLeft}>
                        <p className={classes.CardHeading}>Innovate</p>
                    </div>
                <img className={classes.Img} src={img1}></img>
            </div>           
            <div>
            <p  className={classes.Text}>We aim to create a highly intelligent and user-friendly platform that helps every traveler to understand, plan, and book a travel experience and interact with fellow travelers and guides.</p>
            </div>
        </div>
        <div className="text-center">
            <div className={classes.ImageHeadingContainer}>
                <div className={classes.CardHeadingContainerRight}>
                    <p className={classes.CardHeading}>Improve</p>
                </div>
                <img className={classes.Img} src={img2} sty></img>
            </div>           
            <div>
            <p className={classes.Text}>We aim to improve a traveler’s journey by giving them a one-stop solution for each of their travel needs with complete transparency of prices.</p>
            </div>
        </div>
        <div className="text-center">
        <div className={classes.ImageHeadingContainer}>
            <div className={classes.CardHeadingContainerRight}>
                <p className={classes.CardHeading}>Interact</p>
            </div>
                <img className={classes.Img} src={img3} sty></img>
            </div>           
            <div>
            <p className={classes.Text}>We aim to interact and connect with every traveler and to build diverse experiences for everyone irrespective of their age, gender, financial conditions, or disabilities.</p>
            </div>
        </div>
        </div>
        </>
    );
    else return(
    <div>
        <Heading className="font-opensans text-center" bold align="center" margin="1.5rem">Our Values</Heading>
        <div style={{padding: "1.5rem 0 0 0"}}><Slideshow  vertical images={[img1, img2, img3]} content={ContentArr}></Slideshow></div>
    </div>
    );

}

export default Values;