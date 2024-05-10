import React from "react";
import Heading from "../../../components/newheading/heading/Index";
import classes from "./Numbers.module.css";

const Mission = (props) => {
  return (
    <div>
      <Heading bold aligndesktop="center" align="center" margin="3.5rem">
        Fast Facts
      </Heading>
      <div className={classes.Container}>
        <div className={classes.TileContainer}>
          <p className={classes.Number}>250</p>
          <p className={classes.Text}> Experiences curated</p>
        </div>
        <div className={classes.TileContainer}>
          <p className={classes.Number}>30</p>
          <p className={classes.Text}>Villages Empowered</p>
        </div>
        <div className={classes.TileContainer}>
          <p className={classes.Number}>520</p>
          <p className={classes.Text}>Local Partners</p>
        </div>
      </div>
    </div>
  );
};

export default Mission;
