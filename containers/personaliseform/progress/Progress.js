import React, { Component } from 'react';
import styled from 'styled-components';
import { LinearProgress } from '@mui/material';
import { withStyles } from '@mui/styles';

const Container = styled.div`
  margin: 2rem 0;
`;
class ColoredLinearProgress extends Component {
  render() {
    const { classes } = this.props;
    let progrss = Math.round(((this.props.questionIndex + 1) / 6) * 100);
    return (
      <LinearProgress
        variant="determinate"
        value={progrss}
        {...this.props}
        classes={{
          colorPrimary: classes.colorPrimary,
          barColorPrimary: classes.barColorPrimary,
        }}
      />
    );
  }
}

const styles = (props) => ({
  colorPrimary: {
    backgroundColor: 'rgb(247, 231, 0, 0.3) !important',
    height: '4px !important',
    borderRadius: '2rem !important',
  },
  barColorPrimary: {
    backgroundColor: 'rgba(247, 231, 0, 1) !important',
    height: '4px !important',
    borderRadius: '2rem !important',
  },
});

export default withStyles(styles)(ColoredLinearProgress);
