import React, {useState} from 'react';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/styles';
import LogInModal from '../../../../components/modals/Login';
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
    const [showLoginModal , setShowLoginModal] = useState(false);
    
    const [queryType, setQueryType] = useState('');
    const _handleQueryTypeChange = (event) => {
        setQueryType(event.target.value);
        props.setPax(event.target.value);
      };
    // if(!showLoginModal)
    return(
        <div>
        <FormControl id="bookingsummary-pax" className={classes.fullWidth}  variant="outlined" >
        <InputLabel htmlFor="contact-query-select" id="contact-query-label">Adults</InputLabel>
        <Select disabled={props.token ? false : true} onClick={props.token ? null : () => setShowLoginModal(true)} native={ true ?  true : false } label="Topic of interest" value={queryType} 
                onChange={_handleQueryTypeChange} className={classes.relative}>
                    <Option aria-label="None" value=""  style={{display: 'none'}}/>
                    <Option value={1} className="font-nunito">1</Option>
                    <Option value={2}  className="font-nunito">2</Option>
                    <Option  value={3} className="font-nunito">3</Option>
                    <Option  value={4} className="font-nunito">4</Option>
                    <Option value={5} className="font-nunito">5</Option>
                    <Option value={6} className="font-nunito">6</Option>
                    <Option value={7} className="font-nunito">7</Option>
                    <Option value={8} className="font-nunito">8</Option>
                    <Option value={9} className="font-nunito">9</Option>
                    <Option value={10} className="font-nunito">10</Option>
                    <Option value={11} className="font-nunito">11</Option>
                    <Option value={12} className="font-nunito">12</Option>
                    <Option value={13} className="font-nunito">13</Option>
                    <Option value={14} className="font-nunito">14</Option>
                    <Option value={15} className="font-nunito">15</Option>



        </Select>
        </FormControl>

        <LogInModal
            show={showLoginModal}
             onhide={() => setShowLoginModal(false)}>
        </LogInModal>
        </div>
    );
    
 
    }
    else return null;
}

export default QueryType;
