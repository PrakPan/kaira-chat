import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Overview from './Overview/Overview';
import styled from 'styled-components';
import About from './aboutus/About';
import GettingAround from './GettingAround';
import Recommendations from './Recommendations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Tabs from './tabs/Index';
import axiosaccommodationinstance from '../../../services/bookings/FetchAccommodation';
import { connect } from 'react-redux';
import { TbArrowBack } from 'react-icons/tb';
import Spinner from '../../Spinner';
import media from '../../media';
import LoadingLottie from '../../ui/LoadingLottie';
import Drawer from '../../ui/Drawer';
import POIDetailsSkeleton from '../../drawers/poiDetails/POIDetailsSkeleton';
import { CgClose } from 'react-icons/cg';
import Skeleton from './Skeleton';
import { IoMdClose } from 'react-icons/io';
import dayjs from 'dayjs';
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  &:hover {
    cursor: pointer;
  }
`;
const Container = styled.div`
  padding: 0 0.75rem 0.75rem 0.75rem;
  @media screen and (min-width: 768px) {
    padding: 0 1.25rem 1.25rem 1.25rem;
  }
`;
const BackContainer = styled.div`
  margin: 0;
  display: flex;
  gap: 0.5rem;
  position: sticky;
  z-index: 1;
  background: white;
  top: 0;
  padding-block: 0.75rem;

  @media screen and (min-width: 768px) {
    padding-block: 1rem;
  }
`;
const BackText = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;
const FloatingView = styled.div`
  position: sticky;
  bottom: 10px;
  background: #f7e700;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 90%;
  z-index: 2;
  cursor: pointer;
`;
const POI = (props) => {

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  useEffect(() => {
    if (props.show) {
      setLoading(true);
      let check_in = props.check_in
      let check_out = props.check_out
      if (props.check_in.includes('/')) {
        check_in = props.check_in.split("/").reverse().join("-");
        check_out = props.check_out.split("/").reverse().join("-");
      }
      let paramsObj = {
        accommodation_id : props.id,
        show_rooms: true,
      }
      if (props.currentBooking && props.currentBooking.source && props.currentBooking.source == 'Agoda') {
        paramsObj.check_in = check_in;
        paramsObj.check_out = check_out;
        paramsObj.source = 'Agoda'
      }
      // change after is_group field activated in itinerary APIs
      // if(props.match.params.id === "LX1513cBeVVjRPY09EhI" || props.match.params.id === "AY2n7HcBeVVjRPY0MgwO"  || props.match.params.id==="9OjdZ3gBeVVjRPY01cew") setIsGroup(true);
      axiosaccommodationinstance
        .get('' , {params : paramsObj})
        .then((res) => {
          setLoading(false);
          setData(res.data);
        })
        .catch((error) => {
          setLoading(false);
          // window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
        });
    }
  }, [props.id, props.show]);
  let isPageWide = media('(min-width: 768px)');
  return (
    <Drawer
      show={props.show}
      anchor={'right'}
      backdrop
      style={{ zIndex: 1525 }}
      className="font-lexend"
      onHide={props.onHide}
      mobileWidth={'100%'}
      width="50%"
      zIndex="1501"
    >
      {!loading ? (
        <Container>
          <BackContainer className=" font-lexend">
            <IoMdClose
              className="hover-pointer"
              onClick={props.onHide}
              style={{ fontSize: '2rem' }}
            ></IoMdClose>
            <BackText>Back to Itinerary</BackText>
          </BackContainer>
          <div>
            <Overview
              _setImagesHandler={props._setImagesHandler}
              user_rating={props.user_rating}
              currentBooking={props.currentBooking}
              number_of_reviews={props.number_of_reviews}
              data={data}
              images={data.images ? data.images : []}
              experience_filters={
                props.poi ? props.poi.experience_filters : null
              }
              name={props.poi ? props.poi.name : null}
              duration={props.poi ? props.poi.ideal_duration_hours : null}
              BookingButton={props.BookingButton}
              BookingButtonFun={props.BookingButtonFun}
            ></Overview>
          </div>
          {!isPageWide && (
            <FloatingView>
              <TbArrowBack
                style={{ height: '28px', width: '28px' }}
                cursor={'pointer'}
                onClick={props.onHide}
              />
            </FloatingView>
          )}
        </Container>
      ) : (
        <Skeleton onHide={props.onHide} />
      )}
    </Drawer>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToPros, mapDispatchToProps)(POI);
