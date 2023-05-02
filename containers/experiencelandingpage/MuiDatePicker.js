import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  Day,
  Calendar,
} from '@material-ui/pickers';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@mui/styles';

/*
Description:
This component is a dropdown keyboard DatePicker, with specific disabled
and highlighted dates, custom width & height inputfield.
------------------------------------------------------------------------------------------------
Props: 
None
------------------------------------------------------------------------------------------------
Components used:
ThemeProvider, createMuiTheme, MuiPickersUtilsProvider, KeyboardPicker, Day, DateFnsUtils
from material-ui
*/

const materialTheme = createMuiTheme({
  shape: {
    borderRadius: 5, //adds inputfield & calender border radius
  },
  props: {
    MuiTextField: {
      variant: 'outlined', //adds textfield border-box
    },
  },
  overrides: {
    MuiIconButton: {
      //removes all outilnes from datepicker
      root: {
        '&:active': {
          outline: 'none',
        },
        '&:focus': {
          outline: 'none',
        },
      },
    },
    MuiInputBase: {
      //inputfield custom styles
      root: {
        backgroundColor: 'white',
        height: 36,
        width: '13rem',
        '& fieldset': {
          transition: 'all 0.6s ease',
          borderColor: 'black',
        },
      },
    },
    MuiPickersDay: {
      // dropdown calendar styles
      day: {
        color: 'black',
      },
      daySelected: {
        backgroundColor: 'black',
        color: 'white',
        '&:hover': {
          backgroundColor: 'black',
        },
      },
    },
  },
});

//set disabled dates
const disabledDates = (date) => {
  return date.getDate() === 7 || date.getDate() === 5;
};

const MuiDatePicker = () => {
  const [date, setDate] = useState(new Date());
  const selectedDays = [1, 2, 15];
  const handleDateChange = (date) => {
    setDate(date);
  };

  return (
    <div>
      <ThemeProvider theme={materialTheme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            style={{
              dialogContent: { width: 1 },
              dialogBodyContent: { minHeight: 1, minWidth: 1 },
            }}
            disableToolbar
            format="dd/MM/yyyy"
            margin="none"
            variant="inline"
            id="date-picker-inline"
            size="small"
            value={date}
            onChange={handleDateChange}
            shouldDisableDate={disabledDates} //pass disabled dates
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            //highlight dates
            renderDay={(date, day, isInCurrentMonth, dayComponent) => {
              const isSelected =
                isInCurrentMonth && selectedDays.includes(date.getDate());
              return (
                <Day
                  style={{
                    backgroundColor: isSelected ? '#f7e700' : 'transparent',
                    color: 'black',
                  }}
                >
                  {dayComponent}
                </Day>
              );
            }}
          />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </div>
  );
};

export default MuiDatePicker;
