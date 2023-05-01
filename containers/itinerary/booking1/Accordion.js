import React from 'react';
import { makeStyles } from '@material-ui/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/styles';
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

const Accordion = withStyles({
  root: {
    marginBottom: 10,
    border: '0px solid #F7E70033',
    boxShadow: 'none',
    zIndex: '1',
  },

  expanded: {},
})(MuiAccordion);
const FAQs = (props) => {
  const classes = useStyles();
  const HEADINGS = ['Stays', 'Transfers', 'Flights', 'Activities'];
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
            <div className="text-sm font-normal">
              {bookings[props.payment.summary[key].bookings[i].id].name}
            </div>
          );
          bookinglistwithcost.push(
            <div>
              <div className="text-sm font-normal">
                {bookings[props.payment.summary[key].bookings[i].id].name}
              </div>
              {/* <p style={{fontSize: "0.75rem", fontWeight: "300", letterSpacing: "1px", marginBottom: '0.25rem', textAlign: 'right', marginRight: '24px'}}  className={props.blur ? "font-lexend text-enter blurry-text" : "font-lexend text-enter"}>{"₹ " + getIndianPrice(Math.ceil(bookings[props.payment.summary[key].bookings[i].id].booking_cost/100)) }</p>  */}
            </div>
          );
        } catch {}
        // ContentJSX.push(
        //  {bo}
        // );
      }
      HeadingsJSX.push(
        <div key={key}>
          <div className="flex flex-row justify-between w-full font-bold">
            <div>{key}</div>

            <div className="text-lg">
              {!props.payment.are_prices_hidden
                ? '₹ ' +
                  getIndianPrice(
                    Math.round(props.payment.summary[key].cost / 100)
                  )
                : null}
            </div>
          </div>

          <div>
            {props.payment.are_prices_hidden
              ? bookingslist
              : bookinglistwithcost}
          </div>
        </div>
      );
    }
  }

  return (
    <div className="max-h-32 overflow-y-auto Hide_scrollBar">{HeadingsJSX}</div>
  );
};

export default FAQs;
