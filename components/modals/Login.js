import React, {useRef, useEffect, useState} from 'react';
import {Modal} from 'react-bootstrap';
import Login from '../userauth/LogInModal';
import styled from 'styled-components';
import {connect} from 'react-redux';
import ImageLoader from '../ImageLoader';
import media from '../media';
const ImgContainer = styled.div`
  height: 100%;
  `;
const Enquiry = (props) => {
  let isPageWide = media('(min-width: 768px)')

    let myref = useRef(null);
    const [showImage, setShowImage] = useState(false);
    let height='100px'
     useEffect ( () => {
        if(myref.current){
            height = myref.current.offsetHeight;
        }    
    }, [myref]);
  // const ImgContainer = styled.div`
  //   background-image: url(${img});
  //   background-size: cover;

  // `;
  useEffect ( () => {
  if(props.token) if(props.onhide) props.onhide();
}, [props.token, props.onhide]);
  

  if(isPageWide)
  return(
      <div>
        <Modal  backdrop={props.hideloginclose ? 'static' : true} show={props.show}  size="lg" centered onHide={props.hideloginclose ? null : props.onhide} style={{padding: "0"}}>
            <Modal.Body style={{padding: "0"}} >
                <div style={{display: "grid", gridTemplateColumns: "50% 50%"}}>
                  <div style={{backgroundColor: "	hsl(56, 100%, 48%, 50%)", display: showImage ? 'none' : 'block' }}></div>
                  <ImgContainer style={{display: showImage ? 'block' : 'none'}}>
                      <ImageLoader url={'media/website/locationyellow.jpg'} height="100%" width="100%" onload={() => setShowImage(true)} ></ImageLoader>
                  </ImgContainer>
                  <Login ref={myref} onhide={props.onhide}></Login>
                </div>
            </Modal.Body>
      </Modal>
      </div>
  );
  else return(
  <div>
    <Modal backdrop={props.hideloginclose ? 'static' : true} show={props.show}  size="lg" centered onHide={props.hideloginclose ? null : props.onhide}>
        <Modal.Body style={{padding: "0"}} >
              <Login onhide={props.onhide}></Login>
        </Modal.Body>
  </Modal>
  </div>);

}
const mapStateToPros = (state) => {
  return{
   
    hideloginclose: state.auth.hideloginclose,
    token: state.auth.token, 
  }
}
const mapDispatchToProps = dispatch => {
    return{
    
    }
  }
export default connect(mapStateToPros,mapDispatchToProps)(Enquiry);