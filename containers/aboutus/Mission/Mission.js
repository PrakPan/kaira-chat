import React from "react";
import Heading from "../../../components/newheading/heading/Index";
import classes from "./Mission.module.css";
import ImageLoader from "../../../components/ImageLoader";

const Mission = (props) => {
  return (
    <div className={classes.Container}>
      <Heading bold align="center" aligndesktop="center" margin="3.5rem">
        Our Mission
      </Heading>
      <div className={classes.ListContainer}>
        <div className="center-div" style={{ margin: "0 1.5rem" }}>
          <ImageLoader
            dimensions={{ height: 100, width: 100 }}
            width="1.6rem"
            height="1.6rem"
            url={"media/icons/about-us/curated.svg"}
          />
        </div>
        <p className={classes.ListText}>
          We aim to create highly curated experiential travel programs.
        </p>
        <div className="center-div" style={{ margin: "0 1.5rem" }}>
          <ImageLoader
            dimensions={{ height: 100, width: 100 }}
            width="1.6rem"
            height="1.6rem"
            url={"media/icons/about-us/leadership.svg"}
          />
        </div>
        <p className={classes.ListText}>
          We aim to instill leadership skills in the youth by opening them up to
          various traveling experiences.
        </p>
        <div className="center-div" style={{ margin: "0 1.5rem" }}>
          <ImageLoader
            dimensions={{ height: 100, width: 100 }}
            width="1.6rem"
            height="1.6rem"
            url={"media/icons/about-us/culture.svg"}
          />
        </div>
        <p className={classes.ListText}>
          We aim to bridge the cross-cultural gap among nations across the
          world.
        </p>
        <div className="center-div" style={{ margin: "0 1.5rem" }}>
          <ImageLoader
            dimensions={{ height: 100, width: 100 }}
            width="1.6rem"
            height="1.6rem"
            url={"media/icons/about-us/inlcusion.svg"}
          />
        </div>
        <p className={classes.ListText}>
          We aim to build experiences for people who are unable to travel
          whether due to age, gender, financial conditions, or disabilities.
        </p>
        <div className="center-div" style={{ margin: "0 1.5rem" }}>
          <ImageLoader
            dimensions={{ height: 100, width: 100 }}
            width="1.6rem"
            height="1.6rem"
            url={"media/icons/about-us/transparency.svg"}
          />
        </div>
        <p className={classes.ListText}>
          We aim to build a transparent platform to provide support for
          personalized travel.
        </p>
      </div>
    </div>
  );
};

export default Mission;
