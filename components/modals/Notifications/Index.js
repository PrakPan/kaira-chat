import React, { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import styled from "styled-components";
import Notification from "./Notification";
import Heading from "../../newheading/heading/Index";
import media from "../../media";
import { connect } from "react-redux";
import ImageLoader from "../../ImageLoader";

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

const Enquiry = (props) => {
  let isPageWide = media("(min-width: 768px)");
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
        width="31.5rem"
        mobilewidth="95%"
        closeIcon
        style={{
          borderStyle: "solid",
          borderWidth: "5px",
          borderColor: "#f7e700",
          minHeight: isPageWide ? "90vh" : "95vh",
        }}
      >
        <div style={{}}>
          <Heading
            noline
            align="center"
            aligndesktop="center"
            margin={!isPageWide ? "2rem" : "5rem auto"}
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
              noLazy
              url={"media/website/nonotifications.svg"}
            />
          )}

          {notificationsArr.length > 1 ? (
            <ClearAll className="" onClick={_clearAllHandler}>
              Clear All
            </ClearAll>
          ) : null}
        </div>
      </Modal>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToPros)(Enquiry);
