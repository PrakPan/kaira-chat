import styled from "styled-components";
import FormControl from "@mui/material/FormControl";
import { makeStyles } from "@mui/styles";
import usePageLoaded from "../../../components/custom hooks/usePageLoaded";
import DropDown from "../../../components/ui/DropDown";

const useStyles = makeStyles((theme) => ({
  noPadding: {
    padding: 0,
  },
  fullWidth: {
    width: "100%",
    padding: 0,
  },
  relative: {
    position: "relative",
  },
}));

const Option = styled.option`
  padding: 0.75rem;
  background-color: white;
  border-style: none none solid none;
  border-width: 1px;
  border-color: hsl(0, 0%, 97%);
  &:hover {
    background-color: hsl(0, 0%, 96%);
    cursor: pointer;
  }
`;

const QueryType = (props) => {
  const isPageLoaded = usePageLoaded();
  const classes = useStyles();

  if (isPageLoaded) {
    const queries = [
      "Conferences or offsites",
      "Workcations or retreats",
      "Central Booking platform",
      "Partnerships",
      "Others",
    ];

    const _handleQueryTypeChange = (event) => {
      if (props.setQueryType) {
        props.setQueryType(event.target.value);
      }
    };

    return (
      <FormControl className={classes.fullWidth} variant="outlined">
        <DropDown
          native={true ? true : false}
          label="Topic of interest"
          value={props.queryType || ""}
          onChange={_handleQueryTypeChange}
          fontSize={"0.9rem"}
          labelStyle={{ paddingLeft: "20px" }}
        >
          <Option aria-label="None" value="" style={{ display: "none" }} />
          <Option value={queries[0]}>{queries[0]}</Option>
          <Option value={queries[1]}>{queries[1]}</Option>
          <Option value={queries[2]}>{queries[2]}</Option>
          <Option value={queries[3]}>{queries[3]}</Option>
          <Option value={queries[4]}>{queries[4]}</Option>
        </DropDown>
      </FormControl>
    );
  } else return null;
};

export default QueryType;
