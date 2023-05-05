import React, { useState } from 'react';
import styled from 'styled-components';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';

const useStyles = {
  noPadding: `
    p-0,
  `,
  fullWidth: `
    w-full,
    p-0,
  `,
  relative: `relative`,
};
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
  if (typeof window !== 'undefined') {
    const classes = useStyles();
    const queries = [
      'Conferences or offsites',
      'Workcations or retreats',
      'Central Booking platform',
      'Partnerships',
      'Others',
    ];
    const [queryType, setQueryType] = useState('');
    const _handleQueryTypeChange = (event) => {
      setQueryType(event.target.value);
      props.setChildren(event.target.value);
    };
    return (
      <FormControl className={classes.fullWidth} variant="outlined">
        <InputLabel htmlFor="contact-query-select" id="contact-query-label">
          Children
        </InputLabel>
        <Select
          native={true ? true : false}
          label="Topic of interest"
          value={queryType}
          id="contact-query-select"
          onChange={_handleQueryTypeChange}
          className={classes.relative}
        >
          <Option aria-label="None" value="" style={{ display: 'none' }} />
          <Option value={1} className="font-nunito">
            1
          </Option>
          <Option value={2} className="font-nunito">
            2
          </Option>
          <Option value={3} className="font-nunito">
            3
          </Option>
          <Option value={4} className="font-nunito">
            4
          </Option>
          <Option value={5} className="font-nunito">
            5
          </Option>
        </Select>
      </FormControl>
    );
  } else return null;
};

export default QueryType;
