import React from "react";
import { Modal } from "react-bootstrap";

const Details = (props) => {
  return (
    <div>
      <Modal
        centered
        show={props.show}
        size="md"
        onHide={props.hide}
        className="detals-modal"
      >
        <div className="">{props.children}</div>
      </Modal>
    </div>
  );
};

export default Details;
