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
import { CgClose } from "react-icons/cg";
import Skeleton from './Skeleton'
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  &:hover {
    cursor: pointer;
  }
`;
const Container = styled.div`
  padding: 0.75rem;
  @media screen and (min-width: 768px) {
    padding: 1.25rem;
  }
`;
const POI = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  useEffect(() => {
    if (props.show)
          setLoading(true);
      
      // change after is_group field activated in itinerary APIs
      // if(props.match.params.id === "LX1513cBeVVjRPY09EhI" || props.match.params.id === "AY2n7HcBeVVjRPY0MgwO"  || props.match.params.id==="9OjdZ3gBeVVjRPY01cew") setIsGroup(true);
      axiosaccommodationinstance
        .get(`/?accommodation_id=` + props.id + '&show_rooms=true')
        .then((res) => {
          setLoading(false);
          setData(res.data);
        })
        .catch((error) => {
          setLoading(false);
          // window.location.href = 'https://www.blog.thetarzanway.com/thank-you-page-enquiry';
        });
  }, [props.id, props.show]);
  let isPageWide = media('(min-width: 768px)');

  return (
      <Drawer
        show={props.show}
        anchor={"right"}
        backdrop
        style={{ zIndex: 1501 }}
        className="font-lexend"
        onHide={props.onHide}
        mobileWidth={"100%"}
        width="50%"
        zIndex='1501'
      >
        {!loading ? (
            <Container>
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <CgClose
                  onClick={props.onHide}
                  className="hover-pointer"
                  style={{
                    fontSize: "1.75rem",
                    marginLeft: "-5px",
                  }}
                ></CgClose>
                <div style={{ fontSize: "16px" }}>Back to Itinerary</div>
              </div>
              <div style={{ marginTop: "1rem" }}>
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
                ></Overview>
              </div>
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
