import SelectDate from "./SelectDate";
import SelectPax from "./SelectPax";
import Grid from "@mui/material/Grid";

const SelectDetails = (props) => {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <SelectDate></SelectDate>
        </Grid>
        <Grid item xs={6}>
          <SelectPax></SelectPax>
        </Grid>
      </Grid>
    </div>
  );
};

export default SelectDetails;
