import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';
import Notification from './Notification';
// import Heading from '../../heading/Heading';
import Heading from '../../newheading/heading/Index';
import media from '../../media';
import axiosnotificationsinstance from '../../../services/user/notifications/notifications';
import { connect } from 'react-redux';
import ImageLoader from '../../ImageLoader';
import { RxCross2 } from 'react-icons/rx';

const ClearAll = styled.div`
  width: max-content;
  margin: 2rem auto;
  border-style: none none solid none;
  border-width: 1px;
  opacity: 0.5;
  &:hover {
    cursor: pointer;
  }
`;
const Illustration = styled.img`
  width: 70%;
  margin: auto;
  display: block;
  margin-top: 10vh;
  @media screen and (min-width: 768px) {
    width: 60%;
  }
`;
const Enquiry = (props) => {
  let isPageWide = media('(min-width: 768px)');
  let [notificationsArr, setNotificationsArr] = useState([]);
  useEffect(() => {
    if (props.token) {
      let notificationsarr = [];
      for (var i = 0; i < props.notifications.length; i++) {
        let id = props.notifications[i].id;
        notificationsarr.push(
          <Notification
            _deleteNotificationHandler={() =>
              props._deleteNotificationHandler(id)
            }
            id={props.notifications[i].id}
            heading={props.notifications[i].heading}
            text={props.notifications[i].text}
            cta_link={props.notifications[i].cta_link}
            status={props.notifications[i].status}
          ></Notification>
        );
      }
      setNotificationsArr(notificationsarr);
    }
  }, [props.notifications]);

  const _clearAllHandler = () => {
    setNotificationsArr([]);
    axiosnotificationsinstance
      .delete('', {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {})
      .catch((err) => {});
  };

  const _handleClose = () => {
    props._openAllNotificationsHandler();
    props.handleClose();
  };
  return (
    <div>
      <Modal
        show={props.show}
        onHide={_handleClose}
        size={isPageWide ? 'md' : 'lg'}
      >
        <Modal.Body
          style={{
            borderStyle: 'solid',
            borderWidth: '5px',
            borderColor: '#f7e700',
            minHeight: isPageWide ? '90vh' : '95vh',
          }}
        >
          <RxCross2
            onClick={_handleClose}
            style={{ width: '1rem', float: 'right' }}
          />
          <Heading
            noline
            align="center"
            aligndesktop="center"
            margin={!isPageWide ? '2rem' : '5rem auto'}
            bold
          >
            Notifications
          </Heading>
          {notificationsArr.length ? (
            notificationsArr
          ) : (
            <ImageLoader
              width="60%"
              widthmobile="70%"
              url={'media/website/nonotifications.svg'}
            />
          )}
          {notificationsArr.length > 1 ? (
            <ClearAll className="font-lexend" onClick={_clearAllHandler}>
              Clear All
            </ClearAll>
          ) : null}
        </Modal.Body>
      </Modal>
    </div>
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
export default connect(mapStateToPros, mapDispatchToProps)(Enquiry);
