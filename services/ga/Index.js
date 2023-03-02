export  const  event = ({ action, params }) => {
 window.gtag( 'event', action, params);
   }

   export  const  callback_event = ({ action, callback }) => {
    window.gtag( 'event', action,  {
      'event_callback' :  callback
      
    });
      }