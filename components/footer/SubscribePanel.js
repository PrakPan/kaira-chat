import React, {useState,  useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import SubscribeContent from './YellowSubscribe';

const useStyles = makeStyles({
  paper: {
    backgroundColor: "#F7e700"
  }
});

const GridContainer = styled.div`
  width: 70%;
  margin: auto;
  display: grid; 
  grid-template-columns: 1fr 1fr 1fr;
`;
const ContentContainer = styled.div`
  padding: 0 1rem;
  text-align: center;
`;

const Heading = styled.h1`
font-weight: 700;
font-size: 4rem;
/* font-size: ${props => props.theme.fontsizes.desktop.headings.two ? props.theme.fontsizes.desktop.headings.two : props.theme.fontsizes.desktop.headings.two}; */
text-align: center;
margin: 3rem;
`;
const Subheading = styled.h3`
font-weight: 600;
font-size: ${props => props.theme.fontsizes.desktop.text.two ? props.theme.fontsizes.desktop.text.two : props.theme.fontsizes.desktop.text.two};
text-align: center;
margin-bottom: 1.5rem ;

`;
const P = styled.p`
font-weight: 300;
font-size: ${props => props.theme.fontsizes.desktop.text.four ? props.theme.fontsizes.desktop.text.four : props.theme.fontsizes.desktop.text.four};
text-align: center;
width: 80%;
margin: auto;
line-height: 1.5;
`;
const SubscribeDrawer = (props) =>  {
  const [subscribe, setSubscribe] = useState(true);

  
  const classes = useStyles();

  const _escCloseHandler = (event) => {
    if(event.keyCode === 27 ) props.onhide();
  }
  return (
    <div> 
          <Drawer anchor={'bottom'} open={props.open} className={classes.root} onClose={props.onhide} transitionDuration={1000} onKeyDown={_escCloseHandler}>
            <Paper className={classes.paper}>
              <SubscribeContent onhide={props.onhide}/>
            </Paper>
          </Drawer>
    </div>
  );
}

export default SubscribeDrawer;