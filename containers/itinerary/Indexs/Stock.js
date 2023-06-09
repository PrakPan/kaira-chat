import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import FullImg from '../fullimg/FullImg';
import FullImgContainer from '../fullimg/FullImgContent';
import Menu from '../Menu';
import axios from 'axios';
import Spinner from '../../../components/LoadingPage';
import defaultbreif from '../defaultbrief';
import { MIS_SERVER_HOST } from '../../../services/constants';

import * as authaction from '../../../store/actions/auth';
import { connect } from 'react-redux';

const Container = styled.div`
  width: 100%;
`;

const Itinerary = (props) => {
  const _reloadBookingsHandler = () => {
    setBooking(null);

    fetch(MIS_SERVER_HOST + '/sales/bookings/?itinerary_id=' + props.id, {
      params: { itinerary_id: props.id },
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((json) => {
            setBooking(json.bookings);
            setPayment(json.payment_info);
          });
        } else if (response.status === 404) {
          setLoading(false);
          // setNoBookings(true);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const [loading, setLoading] = useState(true);
  const [itinerary, setItinerary] = useState({
    name: 'Loading Itinerary',
    images: ['null'],
  });
  const [breif, setBreif] = useState(defaultbreif);
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [showbooking, setShowbooking] = useState(false);

  const [reloadBookings, setReloadBookings] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    // if(props.match.params.id === "LX1513cBeVVjRPY09EhI") setIsGroup(true);
    props.checkAuthState();

    window.scrollTo(0, 0);
    axios
      .get(
        MIS_SERVER_HOST +
          '/sales/itinerary/stock/day_by_day/?itinerary_id=' +
          props.id
      )
      .then((res) => {
        setItinerary(res.data);
        setLoading(false);
      })
      .catch((error) => {
        // props.history.push('/404')
      });
    axios
      .get(
        MIS_SERVER_HOST +
          '/sales/itinerary/stock/brief/?itinerary_id=' +
          props.id
      )
      .then((res) => {
        setBreif(res.data);
      })
      .catch((error) => {
        // props.history.push('/404')
      });
  }, []);

  let totalduration = 0;
  //Calculate duration to show in full image
  for (var i = 0; i < breif.city_slabs.length; i++) {
    if (breif.city_slabs[i].duration)
      totalduration += parseInt(breif.city_slabs[i].duration);
  }
  if (!loading) {
    if (!booking) {
      fetch(MIS_SERVER_HOST + '/sales/bookings/?itinerary_id=' + props.id, {
        params: { itinerary_id: props.id },
      }).then((response) => {
        if (response.status === 200) {
          response.json().then((json) => {
            setBooking(json.bookings);
            setPayment(json.payment_info);
          });
        }
      });
    }
    if (!payment) {
      fetch(
        MIS_SERVER_HOST +
          '/payment/info/?itinerary_type=Tailored&itinerary_id=' +
          itinerary.tailor_made_id
      ).then((response) => {
        if (response.status === 200) {
          response.json().then((json) => {
            // setPayment(json);
          });
        }
      });
    }

    const _updateBookingHandler = (json) => {
      setShowBookingModal(false);
      setBooking(json);
    };
    return (
      <Container>
        {/* <Header/> */}
        <FullImg url={itinerary.images ? itinerary.images[0] : null}>
          <FullImgContainer
            heading={itinerary.name}
            duration={totalduration}
          ></FullImgContainer>
        </FullImg>
        <div id="itinerary-anchor">
          <Menu
            _reloadBookingsHandler={_reloadBookingsHandler}
            id={props.id}
            is_stock
            _updateBookingHandler={_updateBookingHandler}
            showbooking={showbooking}
            payment={payment}
            itinerary={itinerary}
            breif={breif}
            booking={booking}
          ></Menu>
        </div>
        {/* <Footer></Footer> */}
      </Container>
    );
  } else
    return (
      // <div style={{height: "100vh", width: "100vw", backgroundColor: "#f7e700"}} className="center-div">
      <Spinner></Spinner>
      // </div>
    );
};
const mapStateToPros = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState: () => dispatch(authaction.checkAuthState()),
  };
};

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(React.memo(Itinerary));
