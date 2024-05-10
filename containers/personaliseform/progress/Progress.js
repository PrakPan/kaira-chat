import React, { Component } from "react";
import { LinearProgress } from "@mui/material";

class ColoredLinearProgress extends Component {
  render() {
    let progrss = Math.round(((this.props.questionIndex + 1) / 6) * 100);

    return (
      <LinearProgress
        variant="determinate"
        value={progrss}
        {...this.props}
        classes={{
          colorPrimary: {
            backgroundColor: "rgb(247, 231, 0, 0.3) !important",
            height: "4px !important",
            borderRadius: "2rem !important",
          },
          barColorPrimary: {
            backgroundColor: "rgba(247, 231, 0, 1) !important",
            height: "4px !important",
            borderRadius: "2rem !important",
          },
        }}
      />
    );
  }
}

export default ColoredLinearProgress;
