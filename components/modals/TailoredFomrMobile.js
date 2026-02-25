import React from "react";
import Modal from "../ui/Modal";
import media from "../media";
import TailoredForm from "../tailoredform/Index";
import NewTrip from "../../containers/new-trip";

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
      overflow="overflow: hidden"
    >
      <div className="flex justify-center items-center h-full">
      <div className="w-full h-full">
        <NewTrip onHide={props?.onHide}/>
        {/* <TailoredForm
          tailoredFormModal
          destinationType={props.destinationType}
          page_id={props.page_id}
          type={props?.type}
          children_cities={props.children_cities}
          destination={props.destination}
          cities={props.cities}
          onHide={props.onHide}
          eventDates={props.eventDates}
        ></TailoredForm> */}
      </div>
      </div>
    </Modal>
  );
};

export default TailoredFormMobileModal;
