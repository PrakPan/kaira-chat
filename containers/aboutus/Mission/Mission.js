import React from 'react';
 
// import Heading from '../../../components/heading/Heading';
import Heading from '../../../components/newheading/heading/Index';
import curatedimg from '../../../public/assets/icons/mission/curated.svg';
import missionimg from '../../../public/assets/icons/mission/leadership.svg';
import cultureimg from '../../../public/assets/icons/mission/culture.svg';
import transparencyimg from  '../../../public/assets/icons/mission/transparency.svg';
import inclusionimg from '../../../public/assets/icons/mission/inlcusion.svg';
import classes from './Mission.module.css';
 
 
 
const Mission =  (props) => {

    

    return(
        <div className={classes.Container}>
            <Heading bold align="center" aligndesktop="center" margin="3.5rem">Our Mission</Heading>
            <div className={classes.ListContainer}>
                <div className="center-div">
                    <img className={classes.Icon} src={curatedimg}/>
                </div>
                <p className={classes.ListText}>We aim to create highly curated experiential travel programs.</p>
                <div className="center-div">
                    <img className={classes.Icon} src={missionimg}/>
                </div>
                <p className={classes.ListText}>We aim to instill leadership skills in the youth by opening them up to various traveling experiences.</p>
                <div className="center-div">
                    <img className={classes.Icon} src={cultureimg}/>
                </div>
                <p className={classes.ListText}>We aim to bridge the cross-cultural gap among nations across the world.</p>
                  <div className="center-div">
                    <img className={classes.Icon} src={inclusionimg}/>
                </div>
                <p className={classes.ListText}>We aim to build experiences for people who are unable to travel whether due to age, gender, financial conditions, or disabilities.</p>
                 <div className="center-div">
                    <img className={classes.Icon} src={transparencyimg}/>
                </div>
                <p className={classes.ListText}>We aim to build a transparent platform to provide support for personalized travel.</p>
            </div>
        </div>
    );
    
}

export default Mission;