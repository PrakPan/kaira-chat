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
import {connect} from 'react-redux';
import {TbArrowBack} from 'react-icons/tb';
import Spinner from '../../Spinner';

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  &:hover{
    cursor: pointer;
  }
`;
const POI = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  useEffect(() => {
    if(props.show)
    // change after is_group field activated in itinerary APIs
    // if(props.match.params.id === "LX1513cBeVVjRPY09EhI" || props.match.params.id === "AY2n7HcBeVVjRPY0MgwO"  || props.match.params.id==="9OjdZ3gBeVVjRPY01cew") setIsGroup(true); 
    axiosaccommodationinstance.get(`/?accommodation_id=`+props.id+"&show_rooms=true",  {headers: {
      'Authorization': `Bearer ${props.token}`
      }})
    .then(res => {
      setLoading(false);
       setData(res.data);
   
    }).catch(error => {
      setLoading(false);
      // window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
    });
  }, [props.id, props.show]);

  return(
      <div>
        <Modal show={props.show}  className="booking-modal" size="lg"  onHide={props.onHide} animation={false} style={{}}>
            <Modal.Header style={{ float: 'right', height: '20vw', position: 'sticky', top: '0', backgroundColor: 'white', justifyContent: 'flex-end', padding: '2rem 1rem',  backgroundColor: 'white', zIndex: '2'}}>
            <TbArrowBack onClick={props.onHide} className="hover-pointer"   style={{margin: '0.5rem', fontSize: '1.75rem', textAlign: 'right',}} ></TbArrowBack>

              {/* <StyledFontAwesomeIcon onClick={props.onHide} icon={faChevronLeft}></StyledFontAwesomeIcon> */}
            </Modal.Header>
            <Modal.Body style={{   padding:'0' }}>
                {!loading ? <div><Overview  _setImagesHandler={props._setImagesHandler}data={data} images={data.images ? data.images : []} experience_filters={props.poi ? props.poi.experience_filters : null} name={props.poi ? props.poi.name : null} duration={props.poi ? props.poi.ideal_duration_hours : null}></Overview>
                <Tabs  
                data={data}
              
                >
                </Tabs>
                <div>
                  {/* <About short_description={props.poi ? props.poi.short_description : null}></About> */}
                  {/* <GettingAround getting_around={props.poi ? props.poi.getting_around : null}></GettingAround> */}
                  {/* <Recommendations recommendations={props.poi ? props.poi.recommendation : null} tips={props.poi ? props.poi.tips : null}></Recommendations> */}
                </div>
                </div>: <div style={{height: '100%', paddingTop: '20vw' }} className="center-div"><Spinner></Spinner></div>}

            </Modal.Body>
      </Modal>
      </div>
  );

}

const mapStateToPros = (state) => {
  return{
  
      token: state.auth.token,
    
  }
}
const mapDispatchToProps = dispatch => {
    return{
    
    }
  }


export default connect(mapStateToPros,mapDispatchToProps)(POI);