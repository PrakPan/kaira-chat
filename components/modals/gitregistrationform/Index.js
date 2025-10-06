import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import styled from "styled-components";
import { TbArrowBack } from "react-icons/tb";
import media from "../../../components/media";
import Form from "./form/Index";
import axiospurchaseinstance from "../../../services/sales/itinerary/Purchase";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Cart from "./cart/Index";
import TermsModal from "../terms/PW";
import LoadingPage from "../../LoadingPage";
import dayjs from "dayjs";

const Body = styled.div`
  padding: 0.5rem !important;
`;

const RegistrationModal = (props) => {
  const router = useRouter();
  const [verificationCount, setVerificationCount] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [formNotFilledError, setFormNotFilledError] = useState(false);
  const [formFailedError, setFormFailedError] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [rzVerificationLoading, setRzVerificationLoading] = useState(false);
  let isPageWide = media("(min-width: 768px)");

  useEffect(() => {
    if (!formFailedError) setVerificationCount(0);
  }, [props.show]);

  const _cloneHandler = (data) => {
    setFormFailedError(false);
    if (verificationCount == props.pax) {
      setFormNotFilledError(false);
      setPaymentLoading(true);
      axiospurchaseinstance
        .post(
          "/",
          {
            itinerary_id: props.id,
            number_of_adults: parseInt(props.pax),
            number_of_children: 0,
            number_of_infants: 0,
            start_date: dayjs(props.date).format("YYYY-MM-DD"),
            registered_users: data.slice(),
          },
          {
            headers: {
              Authorization: `Bearer ${props.token}`,
            },
          }
        )
        .then((res) => {
          if (isPageWide) {
            router.push(
              "/itinerary/" +
                res.data.itinerary.id +
                "/?t=2&booking=false&scroll=Stays"
            );
          } else {
            router.push(
              "/itinerary/" + res.data.itinerary.id + "/?t=2&booking=true"
            );
          }
        })
        .catch((err) => {
          setFormFailedError(err.response.data.message);

          setPaymentLoading(false);
        });
    } else {
      setFormNotFilledError(true);
    }
  };

  if (!rzVerificationLoading)
    return (
      <div className="z-[99999]">
        <Modal
          className="booking-modal z-[2000]"
          mobileWidth="100%"
          width="60%"
          show={props.show}
          closeIcon={false}
          size="xl"
          borderRadius={"12px"}
          onHide={props.hide}
        >
          <div className="flex px-4 flex-row justify-between items-center">
            <TbArrowBack
              onClick={props.hide}
              className="hover-pointer"
              style={{
                margin: "0.5rem",
                fontSize: "1.75rem",
                textAlign: "right",
              }}
            ></TbArrowBack>

            <p
              style={{ fontWeight: "800", margin: "0", fontSize: "19px" }}
              className=""
            >
              Confirm and Pay
            </p>
          </div>

          <Body className="">
            <Cart
              setShowTermsModal={setShowTermsModal}
              cost={props.payment ? props.payment.per_person_total_cost : null}
              date={props.date}
              pax={props.pax}
              plan={props.plan}
            ></Cart>

            <p
              className=" text-center"
              style={{
                fontWeight: "500",
                margin: "1rem 0 0 0",
                fontSize: "19px",
              }}
            >
              Member Details
            </p>
            <Form
              formFailedError={formFailedError}
              setFormFailedError={setFormFailedError}
              formNotFilledError={formNotFilledError}
              number_of_adults={props.number_of_adults}
              verificationCount={verificationCount}
              setVerificationCount={setVerificationCount}
              email={props.email}
              paymentLoading={paymentLoading}
              token={props.token}
              id={props.id}
              onSuccess={_cloneHandler}
              pax={props.pax}
            ></Form>
          </Body>
        </Modal>
        <TermsModal
          show={showTermsModal}
          hide={() => setShowTermsModal(false)}
        ></TermsModal>
      </div>
    );
  else return <LoadingPage></LoadingPage>;
};

const mapStateToPros = (state) => {
  return {
    name: state.auth.name,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    phone: state.auth.phone,
    email: state.auth.email,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserDetails: (details) => dispatch(authaction.setUserDetails(details)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(RegistrationModal);
