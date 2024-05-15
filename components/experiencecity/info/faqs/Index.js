import React from "react";
import Accordion from "./Accordion";

const Faqs = (props) => {
  return <Accordion faqs={props.faqs}></Accordion>;
};

export default Faqs;
