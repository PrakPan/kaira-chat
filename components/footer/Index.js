import React, {useState} from 'react';
import Yellow from './CommunityYellow';
import Subscribe from './Subscribe';
import Black from './Links';
import Copyright from './Copyright';
import YellowPannel from './SubscribePanel';
import { makeStyles } from '@material-ui/styles';
import styled from 'styled-components';



const useStyles = makeStyles({
  paper: {
    backgroundColor: "#F7e700"
  }
});

const Container = styled.div`
max-width: 100vw !important;
z-index: 1100;
position: relative;
@media screen and (min-width: 768px){
  padding-bottom: 0;
}
`;

const Footer = (props) => {
      const classes = useStyles();
    const [pannel, setPannel] = useState(false);
  

  
    const _handleScroll = (event) => {
     }
    const _openPannelHandler = () => {

    }
    return(
        <Container onScroll={(event) => _handleScroll(event)}>
            <Yellow></Yellow>
            <div style={{backgroundColor: "black"}}>
                <Subscribe openpannel={() => setPannel(true)} showpannel={pannel} hidepannel={() => setPannel(false)}></Subscribe>
                <Black></Black>
                <Copyright></Copyright>
                <YellowPannel open={pannel} onhide={() => setPannel(false)}/>
            </div>
            <div>
         
    </div>
        </Container>
    );
}

export default Footer;
