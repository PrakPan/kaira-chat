import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import PickersDay from '@mui/lab/PickersDay';
import isSameDay from 'date-fns/isSameDay';
import isWithinInterval from 'date-fns/isWithinInterval';
import isBefore from "date-fns/isBefore";

import { createTheme, ThemeProvider } from '@mui/material/styles';
const outerTheme = createTheme({
  palette: {
    primary: {
      main:"rgba(247, 231, 0,0.7)",

    },
  },
});

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay',
})(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: "#f7e700",
    color: 'black !important',
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
    backgroundColor: '#f7e700',

  }),
  ...(isLastDay && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
    color: 'black !important',

  }),
}));

const CustomDay = (props) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const _setStartDateHandler = (date) => {
        setStartDate(date);
    }

    const _setEndDateHandler = (date) => {
        setEndDate(date);
    }
    const _selectDateHandler = (date) => {
        if(!startDate){

            setStartDate(date);
        }
        else{

            //if both dates already selected
            if(startDate && endDate)
            {
                setStartDate(date);
                setEndDate(null);
            }
            //else if only start date selected
            else{
                // if start date > end date do nothings
                if(isBefore(date, startDate)) null
                else{
                  setEndDate(date);
                  props._setDatesHandler(startDate, date);
                }
            }
        }

    }

  const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
    if (!startDate) {
      return <PickersDay {...pickersDayProps} />;
    }

  
    let dayIsBetween, isFirstDay, isLastDay
    if(startDate && !endDate){
         dayIsBetween = false;
         isFirstDay = false;
         isLastDay = false;
    
    }
    else if(!startDate && !endDate){
     dayIsBetween = false;
    isFirstDay = false;
     isLastDay = false;
    }
    else if(startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate)
        dayIsBetween = isWithinInterval(date, { start , end  });
        isFirstDay = isSameDay(date, start);
        isLastDay = isSameDay(date, endDate);
    }
     return (
      <CustomPickersDay
        {...pickersDayProps}
        disableMargin
        dayIsBetween={dayIsBetween}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}

      />
    );
  };
  useEffect(() => {
    if(props.startDate && props.endDate) {
    setStartDate(props.startDate)
    setEndDate(props.endDate)

    }
   },[props.questionIndex]);
  return (
    <ThemeProvider theme={outerTheme}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDatePicker
        disablePast
        displayStaticWrapperAs="desktop"
        label="Week picker"
        value={startDate}
        onChange={(newValue) => {
          _selectDateHandler(newValue);
        }}
        renderDay={renderWeekPickerDay}

        inputFormat="'Week of' MMM d"
      />
    </LocalizationProvider>
    </ThemeProvider>
  );
}

export default CustomDay;