 
import React, {useEffect, useState} from 'react';
import Modal from '../ui/Modal';
import media from '../media';
import TailoredForm from '../tailoredform/Index';
import ImageLoader from '../ImageLoader';
import styled from 'styled-components'
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

const TagsContent = [
  {icon : 'media/icons/login/free-travel.png' , text : 'Unlimited travel plans for free!'} ,
  {icon : 'media/icons/login/discount.png' , text : 'Exclusive deals: Upto 70% off!'},
{icon : 'media/icons/login/officer.png' , text : 'Expert support, 24x7!'} ,
{icon : 'media/icons/login/night-stay.png' , text : 'Free night stay on selected properties!'} ]




const TailoredFormMobileModal = (props) => {
  let isPageWide = media('(min-width: 768px)')
  const [showImage, setShowImage] = useState(false);
  const [modalWidth , setModalWidth] = useState(!isPageWide? 90 :50)
 
  useEffect(() => {
   
  }, [props.id, props.show]);
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
    console.log(props.show , 'show')
    const [focusedDate , setFocusedDate] = useState(null)
    if(!isPageWide) return <Modal borderRadius={'12px'} show={props.show} backdrop={true}  className="booking-modal" size="lg"  onHide={props.onHide} animation={false} width={modalWidth + '%'}>
      <TailoredForm tailoredFormModal focusedDate={focusedDate} setFocusedDate={setFocusedDate}  destinationType={props.destinationType}  page_id={props.page_id} children_cities={props.children_cities} destination={props.destination} cities={props.cities}></TailoredForm>
</Modal>
  return(
      <Modal borderRadius={'12px'} show={props.show} backdrop={true}  className="booking-modal" size="lg"  onHide={props.onHide} animation={false} width={modalWidth + '%'}>
            <div style={{display: "grid", gridTemplateColumns: "50% 50%"}}>
                  <div style={{backgroundColor: "#2C2C2C", height : '100%' , width : '100%' ,display: showImage ? 'none' : 'block' }}></div>
                  <ImgContainer style={{display: showImage ? 'block' : 'none'}}>
                      <ImageLoader url={'media/website/login-background.png'} height="100%" width="100%" onload={() => setShowImage(true)} ></ImageLoader>

                    <ImgTagsContainer>
                    {TagsContent.map((e,i)=><TagItem key={i}><ImageLoader borderRadius={'0.4rem 0 0 0.4rem'} url={e.icon} dimensions={{width : 200 , height : 200}}/><p className='font-lexend'>{e.text}</p></TagItem>)}
                    </ImgTagsContainer>
                
                  </ImgContainer>
              <TailoredForm tailoredFormModal focusedDate={focusedDate} setFocusedDate={setFocusedDate}  destinationType={props.destinationType}  page_id={props.page_id} children_cities={props.children_cities} destination={props.destination} cities={props.cities}></TailoredForm>
              </div>
    </Modal>
);

  // return(
  //     <div>
  //       <Modal show={props.show}  className="booking-modal" size="lg"  onHide={props.onHide} animation={false} style={{}}>
  //           <Modal.Header style={{ float: 'right', height: isPageWide? 'max-content' : '20vw', position: 'sticky', top: '0', backgroundColor: 'white', justifyContent: 'flex-end', padding: !isPageWide ?  '2rem 1rem' : '1rem',  backgroundColor: 'white', zIndex: '2'}}>
  //           <TbArrowBack onClick={props.onHide} className="hover-pointer"   style={{margin: '0.5rem', fontSize: '1.75rem', textAlign: 'right',}} ></TbArrowBack>

  //             {/* <StyledFontAwesomeIcon onClick={props.onHide} icon={faChevronLeft}></StyledFontAwesomeIcon> */}
  //           </Modal.Header>
  //           <Modal.Body style={{   padding:'0' }}>
  //               <TailoredForm destinationType={props.destinationType}  page_id={props.page_id} children_cities={props.children_cities} destination={props.destination} cities={props.cities}></TailoredForm>
             
  //           </Modal.Body>
  //     </Modal>
  //     </div>
  // );

}
 


 export default TailoredFormMobileModal;