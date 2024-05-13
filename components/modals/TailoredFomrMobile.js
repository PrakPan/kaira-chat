import React from "react";
import Modal from "../ui/Modal";
import media from "../media";
import TailoredForm from "../tailoredform/Index";

const TailoredFormMobileModal = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <Modal
      height={!isPageWide && "100%"}
      overflow={"none"}
      borderRadius={"12px"}
      show={props.show}
      backdrop={true}
      className="booking-modal"
      size="lg"
      onHide={props.onHide}
      animation={false}
      width={isPageWide ? "400px" : "100%"}
    >
      <TailoredForm
        tailoredFormModal
        destinationType={props.destinationType}
        page_id={props.page_id}
        children_cities={props.children_cities}
        destination={props.destination}
        cities={props.cities}
        onHide={props.onHide}
      ></TailoredForm>
    </Modal>
  );
};

export default TailoredFormMobileModal;
