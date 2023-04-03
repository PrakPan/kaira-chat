 
import React, {useEffect} from 'react';
import {Modal} from 'react-bootstrap';
import {TbArrowBack} from 'react-icons/tb';
import media from '../media';
import TailoredForm from '../tailoredform/Index';


const TailoredFormMobileModal = (props) => {
 
  useEffect(() => {
   
  }, [props.id, props.show]);
  let isPageWide = media('(min-width: 768px)')

  return(
      <div>
        <Modal show={props.show}  className="booking-modal" size="lg"  onHide={props.onHide} animation={false} style={{}}>
            <Modal.Header style={{ float: 'right', height: isPageWide? 'max-content' : '20vw', position: 'sticky', top: '0', backgroundColor: 'white', justifyContent: 'flex-end', padding: !isPageWide ?  '2rem 1rem' : '1rem',  backgroundColor: 'white', zIndex: '2'}}>
            <TbArrowBack onClick={props.onHide} className="hover-pointer"   style={{margin: '0.5rem', fontSize: '1.75rem', textAlign: 'right',}} ></TbArrowBack>

              {/* <StyledFontAwesomeIcon onClick={props.onHide} icon={faChevronLeft}></StyledFontAwesomeIcon> */}
            </Modal.Header>
            <Modal.Body style={{   padding:'0' }}>
                <TailoredForm destinationType={props.destinationType}  page_id={props.page_id} children_cities={props.children_cities} destination={props.destination} cities={props.cities}></TailoredForm>
             
            </Modal.Body>
      </Modal>
      </div>
  );

}
 


 export default TailoredFormMobileModal;