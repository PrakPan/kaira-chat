import React, { useState } from 'react';
import styled from 'styled-components';

import { withStyles } from '@mui/styles';
import { makeStyles } from '@mui/styles';
import { Grid } from '@mui/material';

import { Typography } from '@mui/material';
import Slider from '@material-ui/core/Slider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';

const useStyles = makeStyles({
  root: {
    width: '100%',
    backgroundColor: 'hsl(0,0%,97%)',
    padding: '0.5rem',
    position: 'sticky',
    height: '90vh',
    overflow: 'scroll',
    top: '0',
  },
  gridSlab: {
    margin: '1.5rem 0',
  },
  checkbox: {
    padding: '0.25rem',
  },
});

const Filters = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(30);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // return(
  //     <div style={{backgroundColor: "hsl(0,0%,97%)", borderRadius: "5px", padding:"1rem"}} >
  //     <p className="font-lexend" style={{fontSize: "1rem"}}><b>COST</b></p>
  //     <div style={{display: "grid", gridTemplateColumns: "50% 50%"}}>
  //         <div style={{border: "1px solid black", width: "90%", padding: "0.25rem", borderRadius: "5px", textAlign: "center", backgroundColor: "#F7e700", marginBottom: "1rem"}} className="font-nunito">Free</div>
  //         <div style={{border: "1px solid black", width: "90%", padding: "0.25rem", borderRadius: "5px", textAlign: "center", backgroundColor: "#F7e700", marginBottom: "1rem"}}>Paid</div>
  //     </div>
  //     <p className="font-lexend" style={{fontSize: "1rem"}}><b>EXPERIENCE TYPE</b></p>
  //     <div style={{border: "1px solid black", width: "100%", padding: "0.25rem", borderRadius: "5px", textAlign: "center", backgroundColor: "#F7e700", marginBottom: "1rem"}} className="font-nunito">Adventure</div>
  //     <div style={{border: "1px solid black", width: "100%", padding: "0.25rem", borderRadius: "5px", textAlign: "center", marginBottom: "1rem"}} className="font-nunito">Culture</div>
  //     <div style={{border: "1px solid black", width: "100%", padding: "0.25rem", borderRadius: "5px", textAlign: "center", marginBottom: "1rem"}} className="font-nunito">Heritage</div>
  //     <div style={{border: "1px solid black", width: "100%", padding: "0.25rem", borderRadius: "5px", textAlign: "center", backgroundColor: "#F7e700", marginBottom: "1rem"}} className="font-nunito">Spiritual</div>
  //     <div style={{border: "1px solid black", width: "100%", padding: "0.25rem", borderRadius: "5px", textAlign: "center", backgroundColor: "#F7e700", marginBottom: "1rem"}} className="font-nunito">Offbeat</div>
  //     <div style={{border: "1px solid black", width: "100%", padding: "0.25rem", borderRadius: "5px", textAlign: "center", marginBottom: "1rem"}} className="font-nunito">Social Travel</div>
  //     <div style={{border: "1px solid black", width: "100%", padding: "0.25rem", borderRadius: "5px", textAlign: "center", backgroundColor: "#F7e700", marginBottom: "1rem"}} className="font-nunito">Suprise Me</div>
  // </div>
  // );
  const marks = [
    {
      value: 0,
      label: 'Free',
    },
    {
      value: 100,
      label: 'Luxury',
    },
  ];
  const CustomCheckbox = withStyles({
    root: {
      margin: '0 !important',
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    checkedC: false,
    checkedD: true,
    checkedE: false,
    checkedJ: false,
    checkedF: false,
    checkedG: false,
    checkedH: false,
    checkedI: false,
  });
  const handleCheckboxChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  return (
    <div className={classes.root}>
      <Typography
        id="continuous-slider"
        gutterBottom
        className="font-lexend"
        style={{ fontSize: '1rem', fontWeight: '600' }}
      >
        COST
      </Typography>
      <Grid container spacing={2} style={{ textAlign: 'center' }}>
        <Grid item xs>
          <Slider
            marks={marks}
            value={value}
            onChange={handleChange}
            aria-labelledby="continuous-slider"
            style={{ width: '80%' }}
          />
        </Grid>
      </Grid>
      <Grid className={classes.gridSlab} spacing={0}>
        <Typography
          id="continuous-slider"
          gutterBottom
          className="font-lexend"
          style={{ fontSize: '1rem', fontWeight: '600' }}
        >
          EXPERIENCE FILTERS
        </Typography>
        <Grid item xs spacing={0}>
          <FormControlLabel
            control={
              <CustomCheckbox
                checked={state.checkedA}
                onChange={handleCheckboxChange}
                name="checkedA"
                className={classes.checkbox}
                iconStyle={{ fill: 'black' }}
              />
            }
            className={classes.checkbox}
            label="Nature and Relaxation"
          />
        </Grid>
        <Grid item xs>
          <FormControlLabel
            control={
              <CustomCheckbox
                checked={state.checkedB}
                onChange={handleCheckboxChange}
                name="checkedB"
                className={classes.checkbox}
              />
            }
            label="Adventure"
            className={classes.checkbox}
          />
        </Grid>
        <Grid item xs>
          <FormControlLabel
            control={
              <CustomCheckbox
                checked={state.checkedC}
                onChange={handleCheckboxChange}
                name="checkedC"
                className={classes.checkbox}
              />
            }
            label="Spiritual & Heritage"
          />
        </Grid>

        <Grid item xs>
          <FormControlLabel
            control={
              <CustomCheckbox
                checked={state.checkedE}
                onChange={handleCheckboxChange}
                name="checkedE"
                className={classes.checkbox}
              />
            }
            label="Educational & Shopping"
          />
        </Grid>
      </Grid>
      <Grid>
        <Typography
          id="continuous-slider"
          gutterBottom
          className="font-lexend"
          style={{ fontSize: '1rem', fontWeight: '600' }}
        >
          GROUP TYPE
        </Typography>
        <Grid item>
          <FormControlLabel
            control={
              <CustomCheckbox
                checked={state.checkedF}
                onChange={handleCheckboxChange}
                name="checkedF"
                className={classes.checkbox}
                iconStyle={{ fill: 'black' }}
              />
            }
            label="Solo"
          />
          <Grid item>
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={state.checkedG}
                  onChange={handleCheckboxChange}
                  name="checkedG"
                  className={classes.checkbox}
                />
              }
              label="Couple"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={state.checkedH}
                  onChange={handleCheckboxChange}
                  name="checkedH"
                  className={classes.checkbox}
                />
              }
              label="Group"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={state.checkedI}
                  onChange={handleCheckboxChange}
                  name="checkedI"
                  className={classes.checkbox}
                />
              }
              label="Family"
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Filters;
