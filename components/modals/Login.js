import React, {useRef, useEffect, useState} from 'react';
// import {Modal} from 'react-bootstrap';
import Modal from '../ui/Modal'
import Login from '../userauth/LogInModal';
import styled from 'styled-components';
import {connect} from 'react-redux';
import ImageLoader from '../ImageLoader';
import media from '../media';
const ImgContainer = styled.div`
  height: 100%;
  position  : relative;
  img{
    filter: brightness(0.5);
  }
  `;

const ImgTagsContainer  = styled.div`
position : absolute;
top : 50%;
transform : translateY(-43%);
left : 10%;
img{
  filter: brightness(1);
}
`
const TagItem = styled.div`
display : grid;
grid-template-columns :40px 2fr;
gap : 1rem;
margin-bottom : 2rem;
p{
color : white;
font-weight: 600;
font-size: 16px;
line-height: 24px;
margin-block : auto;
}
`

const TagsContent = [{icon : 'media/icons/login/tag.png' ,  text : 'Better prices'} ,
{icon : 'media/icons/login/officer.png' , text : 'Get an experience captain'} ,
{icon : 'media/icons/login/24-hours.png' , text : '24x7 live support for your trips'} ,{
  icon : 'media/icons/login/discount.png' , text : 'Exclusive discounts'} ]



const Enquiry = (props) => {
  let isPageWide = media('(min-width: 768px)')
  const [modalWidth , setModalWidth] = useState(50)
    let myref = useRef(null);
    const [showImage, setShowImage] = useState(false);
    let height='100px'
     useEffect ( () => {
        if(myref.current){
            height = myref.current.offsetHeight;
        }    
    }, [myref]);
  useEffect ( () => {
  if(props.token) if(props.onhide) props.onhide();
}, [props.token, props.onhide]);

  useEffect(()=>{
  function findModalWidth(){
    if(window.innerWidth >= 1800) setModalWidth(50)
    else if(window.innerWidth >= 1400) setModalWidth(60)
    else if(window.innerWidth >= 1100) setModalWidth(70)
    else if(window.innerWidth >= 768) setModalWidth(90)
    else if(window.innerWidth >= 600) setModalWidth(60)
    else if(window.innerWidth >= 400) setModalWidth(80)
    else setModalWidth(90)
      }
      window.addEventListener("resize", findModalWidth);
      findModalWidth()
      return ()=> window.removeEventListener("resize", findModalWidth)  
  },[])


  if(isPageWide)
  return(
      <div className='font-poppins'>
        <Modal centered closeIcon  backdrop={props.hideloginclose ? 'static' : true} show={props.show} onHide={props.hideloginclose ? null : props.onhide} borderRadius='20px' width={modalWidth + '%'} >
            {/* <Modal.Body style={{padding: "0"}} > */}
                <div style={{display: "grid", gridTemplateColumns: "50% 50%"}}>
                  <div style={{backgroundColor: "#2C2C2C", height : '100%' , width : '100%' ,display: showImage ? 'none' : 'block' }}></div>
                  <ImgContainer style={{display: showImage ? 'block' : 'none'}}>
                      <ImageLoader url={'media/website/login-background.png'} height="100%" width="100%" onload={() => setShowImage(true)} ></ImageLoader>

                    <ImgTagsContainer>
                    {TagsContent.map((e,i)=><TagItem key={i}><ImageLoader borderRadius={'0.4rem 0 0 0.4rem'} url={e.icon} dimensions={{width : 200 , height : 200}}/><p className='font-poppins'>{e.text}</p></TagItem>)}
                    </ImgTagsContainer>
                
                  </ImgContainer>
                 <div style={{padding : '20px'}}><Login ref={myref} onhide={props.onhide}></Login></div>
                </div>
            {/* </Modal.Body> */}
      </Modal>
      </div>
  );
  else return(
  <div>
    <Modal centered backdrop={props.hideloginclose ? 'static' : true} show={props.show} onHide={props.hideloginclose ? null : props.onhide} width={modalWidth + '%'} borderRadius={'12px'}>
        {/* <Modal.Body style={{padding: "0"}} > */}
        <div style={{padding : '20px'}}><Login onhide={props.onhide}></Login></div>
        {/* </Modal.Body> */}
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