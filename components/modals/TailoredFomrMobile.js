import React from "react";
import Modal from "../ui/Modal";
import media from "../media";
import TailoredForm from "../tailoredform/Index";

const TailoredFormMobileModal = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <Modal
      height={"100%"}
      borderRadius={"12px"}
      show={props.show}
      backdrop={true}
      className="booking-modal"
      size="lg"
      onHide={props.onHide}
      animation={false}
      width={isPageWide ? "100%" : "100%"}
    >
      <div className="flex justify-center items-center">
      <div className="w-full h-full">
        <TailoredForm
          tailoredFormModal
          destinationType={props.destinationType}
          page_id={props.page_id}
          type={props?.type}
          children_cities={props.children_cities}
          destination={props.destination}
          cities={props.cities}
          onHide={props.onHide}
          eventDates={props.eventDates}
        ></TailoredForm>
      </div>
      </div>
    </Modal>
  );
};

export default TailoredFormMobileModal;
