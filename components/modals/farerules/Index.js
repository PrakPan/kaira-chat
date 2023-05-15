import React, { useEffect, useState} from 'react';
import {Modal} from 'react-bootstrap';
   import axiosflightsearch from '../../../services/bookings/FlightSearch';
import Header from './Header';
import LoadingLottie from "../../ui/LoadingLottie";
   const FareRules = (props) => {
const [html, setHtml] = useState(null);
    useEffect(() => {
        const TBO_TRACE_ID =  localStorage.getItem('tbo_trace_id')
if(props.showFareRules)
        axiosflightsearch.get( "/", {headers: {
           'Authorization': `Bearer ${props.token}`
           },
       params: {
        result_index: props.result_index,
        search_type : 'farerule',
        trace_id : TBO_TRACE_ID,
       }
   }).then( res => {
        setHtml(res.data.FareRules[0].FareRuleDetail)
   })
   .catch(err => {});
},[props.showFareRules])

// if(props.token)
  return (
    <div>
      <Modal
        className="booking-modal"
        show={props.showFareRules}
        size="md"
        onHide={props.hide}
        style={{ padding: "0" }}
      >
        <Modal.Header
          style={{
            display: "block",
            zIndex: "2",
            position: "sticky",
            top: "0",
            backgroundColor: "white",
          }}
        >
          <Header hide={props.hide}></Header>
        </Modal.Header>
        <Modal.Body style={{ padding: "0.5rem", backgroundColor: "white" }}>
          {html ? (
            <div
              dangerouslySetInnerHTML={{ __html: html }}
              style={{ overflowX: "scroll" }}
            ></div>
          ) : (
            <div className="center-div">
              <LoadingLottie height={"5rem"} width={"5rem"} margin="none" />
            </div>
          )}
        </Modal.Body>
      </Modal>
      {/* {showPhotos ? <FullScreenGallery images={[]} closeGalleryHandler={closePhotosHandler}></FullScreenGallery> : null} */}
    </div>
  );

 

}


 
export default  FareRules;