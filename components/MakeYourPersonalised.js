import React from "react";
import Modal from "./ui/Modal";
import { isDateOlderThanCurrent } from "../helper/isDateOlderThanCurrent";
import TailoredForm from "../components/tailoredform/Index";
import useMediaQuery from "../hooks/useMedia";

const MakeYourPersonalised = ({ date, onHide, show = false }) => {
  let isPageWide = useMediaQuery("(min-width: 768px)");

  return (
    isDateOlderThanCurrent(date) ||
    (show && (
      <Modal
        centered
        show={isDateOlderThanCurrent(date) || show}
        mobileWidth="90%"
        backdrop
        closeIcon={true}
        onHide={onHide}
        borderRadius={"12px"}
        height={!isPageWide && "90%"}
        animation={false}
        width={isPageWide ? "400px" : "100%"}
      >
        <TailoredForm tailoredFormModal onHide={onHide}></TailoredForm>
      </Modal>
    ))
  );
};

export default MakeYourPersonalised;
