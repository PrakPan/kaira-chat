import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import Slider from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const useStyles = {
  root: `w-[100%]
  bg-[hsl(0,0%,97%)]
 p-[0.5rem]
  sticky
  h-['90vh']
  overflow-scroll
  top-0
`,
  gridSlab: `
    m-[1.5rem 0]
  `,
  checkbox: `
    p-[0.25rem]
  `,
};

const Filters = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(30);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const marks = [
    {
      value: 0,
      label: "Free",
    },
    {
      value: 100,
      label: "Luxury",
    },
  ];

  const CustomCheckbox = <Checkbox color="default" {...props} />;

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
        className=""
        style={{ fontSize: "1rem", fontWeight: "600" }}
      >
        COST
      </Typography>
      <Grid container spacing={2} style={{ textAlign: "center" }}>
        <Grid item xs>
          <Slider
            marks={marks}
            value={value}
            onChange={handleChange}
            aria-labelledby="continuous-slider"
            style={{ width: "80%" }}
          />
        </Grid>
      </Grid>
      <Grid className={classes.gridSlab} spacing={0}>
        <Typography
          id="continuous-slider"
          gutterBottom
          className=""
          style={{ fontSize: "1rem", fontWeight: "600" }}
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
                iconStyle={{ fill: "black" }}
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
          className=""
          style={{ fontSize: "1rem", fontWeight: "600" }}
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
                iconStyle={{ fill: "black" }}
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
