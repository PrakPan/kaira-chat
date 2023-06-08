import React from 'react';

import Accordion from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQs = (props) => {
  let FAQS = [];
  for (var i = 0; i < props.faqs.length; i++) {
    FAQS.push(
      <MuiAccordion
        style={{
          marginBottom: 10,
          border: "1px solid #e4e4e4",
          boxShadow: "none",
          zIndex: "1",
        }}
        key={i}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{ zIndex: '1' }}
        >
          <Typography
            content={'span'}
            className="font-lexend"
            style={{ fontWeight: '600' }}
          >
            {props.faqs[i].question}
          </Typography>
        </AccordionSummary>
        <div
          style={{
            margin: '0 1rem',
            borderStyle: 'none none solid none',
            borderWidth: '1px',
            borderColor: '#F7e700',
            position: 'relative',
            top: '-0.5rem',
          }}
        ></div>
        <AccordionDetails>
          <Typography content={'span'} className="font-nunito">
            {props.faqs[i].answer}
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  }
  return <div className={classes.root}>{FAQS}</div>;
};

export default FAQs;
