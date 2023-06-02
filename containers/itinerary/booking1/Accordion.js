import React from 'react';
import { makeStyles } from '@mui/styles';
import MuiAccordion from '@mui/material/Accordion';
import Accordion, {
  AccordionDetails,
  AccordionSummary,
} from '../../../components/ui/Accordion';
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getIndianPrice } from '../../../services/getIndianPrice';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    zIndex: '1',
  },
  heading: {
    fontSize: '1rem',
    fontFamily: "'Open Sans', sans-serif !important;",
  },
}));

const FAQs = (props) => {
  const classes = useStyles();
  const HEADINGS = ['Stays ', 'Transfers', 'Flights', 'Activities'];
  let FAQS = [];
  let HeadingsJSX = [];
  let bookings = {};
  try {
    for (var i = 0; i < props.stayBookings.length; i++) {
      bookings = {
        ...bookings,
        [props.stayBookings[i].id]: props.stayBookings[i],
      };
    }
  } catch {}

  try {
    for (var j = 0; j < props.transferBookings.length; j++) {
      bookings = {
        ...bookings,
        [props.transferBookings[j].id]: props.transferBookings[j],
      };
    }
  } catch {}
  try {
    for (var k = 0; k < props.flightBookings.length; k++) {
      bookings = {
        ...bookings,
        [props.flightBookings[k].id]: props.flightBookings[k],
      };
    }
  } catch {}
  try {
    for (var k = 0; k < props.activityBookings.length; k++) {
      bookings = {
        ...bookings,
        [props.activityBookings[k].id]: props.activityBookings[k],
      };
    }
  } catch {}
  for (var key in props.payment.summary) {
    if (props.payment.summary[key].cost) {
      let ContentJSX = [];
      let bookingslist = [];
      let bookinglistwithcost = [];
      //loop through summary key bookings, generate details list
      for (var i = 0; i < props.payment.summary[key].bookings.length; i++) {
        try {
          bookingslist.push(
            <div className={'text-sm font-normal text-[#000]'}>
              {bookings[props.payment.summary[key].bookings[i].id].name}
            </div>
          );
          bookinglistwithcost.push(
            <div className={' text-sm font-normal text-[#000]'}>
              {bookings[props.payment.summary[key].bookings[i].id].name}
            </div>
          );
        } catch {}
        // ContentJSX.push(
        //  {bo}
        // );
      }
      HeadingsJSX.push(
        <Accordion
          key={key}
          style={{
            marginBottom: 10,
            // border: "1px solid #e4e4e4",
            // border: "1px solid red",
            boxShadow: 'none',
            zIndex: '1',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="itinerary-booking-summary-accordion"
            style={{ zIndex: '1', height: '1rem' }}
          >
            <Typography
              content={'span'}
              className="font-lexend"
              style={{ fontWeight: '700', fontSize: '0.80rem', margin: '0' }}
            >
              <div className="flex flex-row gap-1">
                {key} ({props.payment.meta_info.number_of_adults}
                {props.payment.meta_info.number_of_adults == 1
                  ? ' Adult'
                  : ' Adults'}
                )
              </div>
            </Typography>
            <Typography
              content={'span'}
              className="font-lexend"
              style={{
                fontWeight: '700',
                fontSize: '0.95rem',
                margin: '0',
                flexGrow: '1',
                textAlign: 'right',
                marginRight: '1.5rem',
              }}
            >
              {!props.payment.are_prices_hidden
                ? '₹ ' +
                  getIndianPrice(
                    Math.round(props.payment.summary[key].cost / 100)
                  )
                : null}
            </Typography>
          </AccordionSummary>
          {/* <div
            style={{
              margin: "0 1rem",
              borderStyle: "none none none none",
              borderWidth: "1px",
              borderColor: "#F7e700",
              position: "relative",
              top: "-0.5rem",
            }}
          ></div> */}
          <AccordionDetails style={{ display: 'block', padding: '0.1rem' }}>
            {props.payment.are_prices_hidden
              ? bookingslist
              : bookinglistwithcost}
          </AccordionDetails>
        </Accordion>
      );
    }
  }

  return <div className={classes.root}>{HeadingsJSX}</div>;
};

export default FAQs;
