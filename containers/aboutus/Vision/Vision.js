
import styled from 'styled-components';
import ImageLoader from '../../../components/ImageLoader';
// import Heading from '../../../components/heading/Heading';
import Heading from '../../../components/newheading/heading/Index';
import personaliseimg from '../../../public/assets/icons/values/personalised.svg';
import oneclickimg from '../../../public/assets/icons/values/oneclick.svg';
import supportimg from '../../../public/assets/icons/values/247.svg';
import classes from './Vision.module.css';

const Vision = (props) => {
 
    
    return(
    <div className={classes.Container}>
       <div className={classes.ImageContainer}>
           <ImageLoader url="media/website/About us picture.jpeg" fit="cover" dimensions={{width: 1600, height: 900}}></ImageLoader>
       </div>
       <div className={classes.TextContainer} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
           <Heading className="font-opensans" aligndesktop="center" bold noline margin="0" align="center">Our Vision</Heading>
           <p className={classes.Text}>Innovating and simplifying travel through:</p>
           <div className={classes.IconsContainer}>
               <div>
                    <img className={classes.Icon} src={personaliseimg}/>
                    <p className={classes.IconText}>Personalized</p>
                    <p className={classes.IconText}>plans</p>
               </div>
               <div>
                    <img className={classes.Icon}  src={oneclickimg}/>
                    <p className={classes.IconText}>All bookings</p>
                    <p className={classes.IconText}>in one click</p>
               </div>
               <div>
                    <img className={classes.Icon}  src={supportimg}/>
                    <p className={classes.IconText}>24/7</p>
                    <p className={classes.IconText}>live support</p>
               </div>
           </div>
       </div>
    </div>
  );
}
 
export default Vision;
