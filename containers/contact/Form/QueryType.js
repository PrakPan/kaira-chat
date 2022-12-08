import React, {useState} from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
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
        "I want to enquire about travel experiences",
        "I want to enquire about personalised travel",
        "I want to travel somewhere",
        "I want to enquire about partnerships",
        "I want to join TTW",
        "I want to join as an affiliate",
        "I have a complaint",
        "I need help with something else",
    ]
    const [queryType, setQueryType] = useState('');
    const _handleQueryTypeChange = (event) => {
        setQueryType(event.target.value);
        props._changeDetailsHandler(event, "type");
      };
    return(
        <FormControl className={classes.fullWidth}  variant="outlined" >
        <InputLabel htmlFor="contact-query-select" id="contact-query-label">Topic of Interest</InputLabel>
        <Select native={ true ?  true : false } label="Topic of interet" value={queryType} id="contact-query-select"
                onChange={_handleQueryTypeChange} className={classes.relative}>
                    <Option aria-label="None" value=""  style={{display: 'none'}}/>
                    <Option value={queries[0]} className="font-nunito">{queries[0]}</Option>
                    <Option value={queries[1]}  className="font-nunito">{queries[1]}</Option>
                    <Option  value={queries[2]} className="font-nunito">{queries[2]}</Option>
                    <Option  value={queries[3]} className="font-nunito">{queries[3]}</Option>
                    <Option value={queries[4]} className="font-nunito">{queries[4]}</Option>
                    <Option value={queries[5]} className="font-nunito">{queries[5]}</Option>
                    <Option value={queries[6]} className="font-nunito">{queries[6]}</Option>
                    <Option value={queries[7]} className="font-nunito">{queries[7]}</Option>
        </Select>
        </FormControl>
    );
    }
    else return null;
}

export default QueryType;
