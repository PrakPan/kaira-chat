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
    zIndex: '1'
  },
  heading: {
    fontSize: "1rem",
    fontFamily: "'Open Sans', sans-serif !important;",
  },

}));


const Accordion = withStyles({
  root: {
   marginBottom: 10,
   border: '0px solid #e4e4e4',
   boxShadow: 'none',
   zIndex: '1'

  },
 
  expanded: {},
})(MuiAccordion);
const FAQs = (props) =>   {
  const classes = useStyles();
const HEADINGS = [
    'Stays',
    'Transfers',
    "Flights",
    "Activities"
]
  let FAQS = [];
  let HeadingsJSX = []
  console.log('p', props.payment);
  let bookings = {};
  try{
  for(var i = 0 ; i < props.stayBookings.length ; i++){
    bookings= {...bookings, [props.stayBookings[i].id] : props.stayBookings[i] };
    
  }}
  catch{}

  try{
  for(var j = 0 ; j < props.transferBookings.length ; j++){
    bookings= {...bookings, [props.transferBookings[j].id] : props.transferBookings[j] };
    
  }}
  catch{

  }
  try{
  for(var k = 0 ; k < props.flightBookings.length ; k++){
    bookings= {...bookings, [props.flightBookings[k].id] : props.flightBookings[k] };
    
  }}
catch{

}
console.log(props.flightBookings)
console.log('b', bookings)
  for(var key in props.payment.summary){
    if(props.payment.summary[key].cost){
      let ContentJSX = [];
      let bookingslist=  [];
      let bookinglistwithcost = [];
      //loop through summary key bookings, generate details list 
      for(var i = 0 ; i < props.payment.summary[key].bookings.length; i++){
        console.log('test', bookings[props.payment.summary[key].bookings[i].id])
        try{
        bookingslist.push(
          <p style={{fontSize: "0.75rem", fontWeight: "400", letterSpacing: "1px", marginBottom: '0.25rem',}} className={props.blur ? "font-opensans text-enter blurry-text" : "font-opensans text-enter"}>{}</p>
        )
        bookinglistwithcost.push(
          <div style={{display: 'grid', gridTemplateColumns: 'auto max-content', margin: '0.5rem 0', gridGap: '1rem'}}>
            <p style={{ fontSize: "0.75rem", fontWeight: "300", letterSpacing: "1px", marginBottom: '0.25rem'}} className={props.blur ? "font-opensans text-enter blurry-text" : "font-opensans text-enter"}>{bookings[props.payment.summary[key].bookings[i].id].name}</p>
            {/* <p style={{fontSize: "0.75rem", fontWeight: "300", letterSpacing: "1px", marginBottom: '0.25rem', textAlign: 'right', marginRight: '24px'}}  className={props.blur ? "font-opensans text-enter blurry-text" : "font-opensans text-enter"}>{"₹ " + getIndianPrice(Math.ceil(bookings[props.payment.summary[key].bookings[i].id].booking_cost/100)) }</p>  */}
        </div>
      )
        }catch{}
          // ContentJSX.push(
          //  {bo}
          // );
      }
    HeadingsJSX.push(
      <Accordion key={key}>
       <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="itinerary-booking-summary-accordion"
        style={{zIndex: '1', minHeight: 'max-content'}}

      >
        <Typography content={'span'} className="font-opensans" style={{fontWeight:'600', fontSize: '0.75rem', margin: '0'}} >{key}</Typography>
        <Typography content={'span'} className="font-opensans" style={{fontWeight:'600', fontSize: '0.75rem', margin: '0', flexGrow:  '1', textAlign: 'right'}} >{"₹ "+ getIndianPrice(Math.round(props.payment.summary[key].cost/100))}</Typography>

      </AccordionSummary>
         <div style={{margin: '0 1rem', borderStyle: 'none none none none', borderWidth: '1px', borderColor: "#F7e700", position: 'relative', top: '-0.5rem'}}></div>
       <AccordionDetails style={{display: 'block', padding: '0'}}>
        {props.payment.are_prices_hidden ? bookingslist : bookinglistwithcost}
       </AccordionDetails>
     </Accordion>
       
    )
    }
  }
 
  return (
    <div className={classes.root}>
      {HeadingsJSX}
    </div>
  );
}

export default FAQs
