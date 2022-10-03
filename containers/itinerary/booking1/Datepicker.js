import 'date-fns';
import React from 'react';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {
  ThemeProvider,
  withStyles,
  makeStyles,

} from '@material-ui/core/styles';

const StyledTextField = withStyles({
    root: {
    '& label.Mui-focused': {
      color: 'green',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red',
      },
      '&:hover fieldset': {
        borderColor: 'yellow',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green',
      },
    },
  },
})(KeyboardDatePicker);
export default function MaterialUIPickers(props) {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(new Date('2021-04-20T21:11:54'));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
    variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          value={props.selectedDate}
          onChange={props.handleDateChange}
          fullWidth
          autoOk={true}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
    </MuiPickersUtilsProvider>
  );
}
