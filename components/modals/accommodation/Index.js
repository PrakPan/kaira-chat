import React, {useEffect, useState} from 'react';
import {Modal} from 'react-bootstrap';
import Overview from './Overview/Overview';
import styled from 'styled-components';
import About from './aboutus/About';
import GettingAround from './GettingAround';
import Recommendations from './Recommendations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import Tabs from './tabs/Index';
import axiosaccommodationinstance from '../../../services/bookings/FetchAccommodation';

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  &:hover{
    cursor: pointer;
  }
`;
const POI = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  useEffect(() => {
    // change after is_group field activated in itinerary APIs
    // if(props.match.params.id === "LX1513cBeVVjRPY09EhI" || props.match.params.id === "AY2n7HcBeVVjRPY0MgwO"  || props.match.params.id==="9OjdZ3gBeVVjRPY01cew") setIsGroup(true); 
    axiosaccommodationinstance.get(`/?accommodation_id=`+props.id,  {headers: {
      'Authorization': `Bearer ${props.token}`
      }})
    .then(res => {
       setData(res.data);
  
    }).catch(error => {
      // window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
    });
  }, [props.id]);

  return(
      <div>
        <Modal show={props.show}  id="poi-modal" size="lg"  onHide={props.onHide} style={{backgroundColor: 'transparent'}}>
            <Modal.Header style={{borderStyle: "solid solid none solid", borderColor: "#F7e700", borderWidth: "0.5rem", borderRadius: '16px 16px 0 0', height: '7.5vh', backgroundColor: 'white'}}>
              <StyledFontAwesomeIcon onClick={props.onHide} icon={faChevronLeft}></StyledFontAwesomeIcon>
            </Modal.Header>
            <Modal.Body style={{ height: '92.5vh', overflowY: 'auto', borderStyle: "none solid solid solid", borderColor: "#F7e700", borderWidth: "0.5rem", borderRadius: '0  0 16px 16px', backgroundColor: 'white', padding: '0'}}>
                <Overview data={data} images={data.images ? data.images : []} experience_filters={props.poi ? props.poi.experience_filters : null} name={props.poi ? props.poi.name : null} duration={props.poi ? props.poi.ideal_duration_hours : null}></Overview>
                <Tabs  
                data={data}
              
                >
                </Tabs>
                <div>
                  {/* <About short_description={props.poi ? props.poi.short_description : null}></About> */}
                  {/* <GettingAround getting_around={props.poi ? props.poi.getting_around : null}></GettingAround> */}
                  {/* <Recommendations recommendations={props.poi ? props.poi.recommendation : null} tips={props.poi ? props.poi.tips : null}></Recommendations> */}
                </div>


            </Modal.Body>
      </Modal>
      </div>
  );

}

export default POI;