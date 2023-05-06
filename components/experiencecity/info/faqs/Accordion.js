import React from "react";
import { makeStyles } from "@mui/styles";
import MuiAccordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { withStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    zIndex: "1",
  },
  heading: {
    fontSize: "1rem",
    fontFamily: "'Open Sans', sans-serif !important;",
  },
}));

const Accordion = withStyles({
  root: {
    marginBottom: 10,
    border: "1px solid #e4e4e4",
    boxShadow: "none",
    zIndex: "1",
  },

  expanded: {},
})(MuiAccordion);
const FAQs = (props) => {
  const classes = useStyles();

  let FAQS = [];
  for (var i = 0; i < props.faqs.length; i++) {
    FAQS.push(
      <Accordion key={i}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{ zIndex: "1" }}
        >
          <Typography
            content={"span"}
            className="font-lexend"
            style={{ fontWeight: "600" }}
          >
            {props.faqs[i].question}
          </Typography>
        </AccordionSummary>
        <div
          style={{
            margin: "0 1rem",
            borderStyle: "none none solid none",
            borderWidth: "1px",
            borderColor: "#F7e700",
            position: "relative",
            top: "-0.5rem",
          }}
        ></div>
        <AccordionDetails>
          <Typography content={"span"} className="font-nunito">
            {props.faqs[i].answer}
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  }
  return <div className={classes.root}>{FAQS}</div>;
};

export default FAQs;
