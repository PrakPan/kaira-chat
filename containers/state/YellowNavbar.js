import React,{useState,useEffect, useRef} from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import ExperienceModal from './ExperienceModal';
import TTWblack from '../../assets/logoblack.svg';
import HideShowNavLogo from './NavbarLogo';
// import Button from '../../components/Button';
import Button from '../../components/ui/button/Index';

const YellowNavbar = (props) => {

  const headerheight = localStorage.getItem('NavbarHeight') + "rem";

  const Container = styled.div`
    z-index: ${props=>(props.zindex ? '15' : '5')};     
    position: sticky;
    top: 0;
    display: grid;
    grid-template-columns: 20% 73% 7%;
    min-height: ${headerheight};
    grid-template-rows: auto;
    `;
  const Yellow = styled.div`
    width: 100%;
    background-color: ${props => props.theme.colors.brandColor};
    @media screen and (min-width: 768px){
  
    }
    `;
  const Price = styled.p`
      &:before{
        content: "Starting from";
        display: block;
        font-size: 0.75rem;
      }
      margin: 0 1rem;
      @media screen and (min-width: 768px){
      margin: 0 2rem;
      }
    `;
  const _buyNowHandler = () => {
    props.history.push('/purchase');
  }

  const [zindex, setzindex]=useState(false);
  var yellownavpos;
  let elem = useRef();
    
  useEffect(() => { 
    const togglelogo=()=>{  
      yellownavpos=elem.current.getBoundingClientRect().top;          
      if(yellownavpos==0){                
        setzindex(true);
      }
      else{        
        setzindex(false);
      }
    }
    window.addEventListener("scroll", togglelogo);
    return () => {
      window.removeEventListener("scroll", togglelogo);
    };
  });
  const [modalShow, setModalShow] = useState(false);
  const showModal = () => {
    setModalShow(true);
  }
  const hideModal = () => {
    setModalShow(false);
  }
  return (
    <Container ref={elem} zindex={zindex} >
      <Yellow >    
      <HideShowNavLogo height={headerheight}/>     
      </Yellow>
      <Yellow style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
        {/* <div><a href="#overview" style={{margin: "0 0.5rem"}} className="font-nunito"><b>Overview</b></a>
          <a style={{margin: "0 0.5rem"}} className="font-nunito">Locations</a>
          <a style={{margin: "0 0.5rem"}} className="font-nunito">Itinerary</a>
          <a style={{margin: "0 0.5rem"}} className="font-nunito">Inclusions</a>
          <a style={{margin: "0 0.5rem"}} className="font-nunito">Exclusions</a>
          <a style={{margin: "0 0.5rem"}} className="font-nunito">Terms</a></div> */}     
        <Price>{"Rs " + props.price / 100 + "/-"} </Price>
        {/* <Button  onclick={showModal}>
        Buy Now
        </Button> */}
        <Button boxShadow onclick={showModal}>
        Buy Now
        </Button>
        <ExperienceModal show={modalShow} price={props.price} hide={hideModal} />
      </Yellow>
      <Yellow></Yellow>
    </Container>
  );
}

export default withRouter(YellowNavbar);
