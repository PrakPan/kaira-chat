import React, {useState} from 'react';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  noPadding: {
      padding: 0
  },
  fullWidth: {
      width: '100%',
        padding: 0,
  },
  relative: {
      position: 'relative',
  }

}));
const Option = styled.option`
    padding: 0.75rem;
    background-color: white;
    border-style: none none solid none;
    border-width: 1px;
    border-color: hsl(0,0%,97%);
    &:hover{
        background-color: hsl(0,0%,96%);
        cursor: pointer;
    }
`;
const QueryType = (props) => {
    if(typeof window !== "undefined"){

    const classes = useStyles();
    const queries =[
        "Conferences or offsites",
        "Workcations or retreats",
        "Central Booking platform",
        "Partnerships",
        "Others",
 
    ]
    const [queryType, setQueryType] = useState('');
    const _handleQueryTypeChange = (event) => {
        setQueryType(event.target.value);
        props.setChildren(event.target.value);
      };
    return(
        <FormControl className={classes.fullWidth}  variant="outlined" >
        <InputLabel htmlFor="contact-query-select" id="contact-query-label">Children</InputLabel>
        <Select native={ true ?  true : false } label="Topic of interest" value={queryType} id="contact-query-select"
                onChange={_handleQueryTypeChange} className={classes.relative}>
    <Option aria-label="None" value=""  style={{display: 'none'}}/>
    <Option aria-label="None" value=""  style={{display: 'none'}}/>
                    <Option value={1} className="font-nunito">1</Option>
                    <Option value={2}  className="font-nunito">2</Option>
                    <Option  value={3} className="font-nunito">3</Option>
                    <Option  value={4} className="font-nunito">4</Option>
                    <Option value={5} className="font-nunito">5</Option>
           
        </Select>
        </FormControl>
    );
    }
    else return null;
}

export default QueryType;
