
import React, {useState} from 'react';
// import ImageLoader from '../../../components/ImageLoader';
import dayjs from 'dayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select from '@material-ui/core/Select';
import LogInModal from '../../../../components/modals/Login';

const SelectDate = (props) => {

    const [open, setOpen] =useState(false);

    const [showLoginModal, setShowLoginModal] = useState(false);

    const _handleOpen  = () => {
        console.log('testing')
        if(props.token){
        setOpen(true)
        }
        else {
            // setOpen(false)
            setShowLoginModal(true);
        }
    }

    const onKeyDown = (e) => {
        e.preventDefault();
     };
     const _handleFocus  = () => {
        
     }
   return (
    <div id="bookingsummary-date-container" >
        <LocalizationProvider   id="bookingsummary-pax" 
 dateAdapter={AdapterDateFns}>
  <DatePicker
  
onOpen={_handleOpen}
    label="Start Date"
    value={props.date}
     onClose={() => setOpen(false)}
    open={open}
    onChange={(newValue) => {
      props.setDate(newValue);
    }}
    renderInput={(params) => <TextField  onKeyDown={onKeyDown}  id="bookingsummary-pax" 
    {...params} fullWidth />}
  />
</LocalizationProvider>
<LogInModal
            show={showLoginModal}
             onhide={() => setShowLoginModal(false)}>
        </LogInModal>
    </div>
  );
}

export default SelectDate;

