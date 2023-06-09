import React, {useEffect} from 'react';
import TextField from '@mui/material/TextField';
import StaticDateRangePicker from '@mui/lab/StaticDateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const outerTheme = createTheme({
    palette: {
      primary: {
        main:"rgba(247, 231, 0,0.7)",

      },
    },
  });
  
export default function StaticDateRangePickerDemo(props) {
  const [value, setValue] = React.useState([null, null]);
  useEffect(() => {
   if(props.startDate && props.endDate) setValue([props.startDate, props.endDate])
  },[props.questionIndex]);
  return (
    <ThemeProvider theme={outerTheme}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDateRangePicker
      disablePast
        displayStaticWrapperAs="desktop"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        
          props._setDatesHandler(newValue[0], newValue[1]);
        }}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 1 }}> to </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
      />
    </LocalizationProvider>
    </ThemeProvider>
  );
}
