import React from "react";
import ImageLoader from "../../../components/ImageLoader";
import classes from "./MobileTimeline.module.css";
import content from "../../../public/content/aboutus";

const Timeline = (props) => {
  let cards = [];

  for (var i = 0; i < 7; i++) {
    if (i === 1 || i === 3 || i === 5) {
      cards.push(
        <div
          className={classes.LeftBorder}
          style={{ borderWidth: "7px 0 3.5px 7px" }}
        >
          <div>
            <ImageLoader
              widthmobile="150px"
              heightmobile="150px"
              url={content.timeline[i].image}
              borderRadius="50%"
              // dimensionsMobile={{ width: 400, height: 400 }}
              fit="cover"
            ></ImageLoader>
            <div className="center-div">
              <p className={classes.TextHeading}>
                {content.timeline[i].heading}
              </p>
              <p
                className={classes.Text}
                dangerouslySetInnerHTML={{ __html: content.timeline[i].text }}
              ></p>
            </div>
          </div>
        </div>
      );
      cards.push(<div></div>);
      if (i === 5)
        cards.push(
          <div
            style={{
              borderStyle: "none none solid none",
              borderColor: "#F7e700",
              borderWidth: "3.5px",
            }}
          ></div>
        );
      else cards.push(<div></div>);
    } else {
      cards.push(
        <div
          className={classes.RightBorder}
          style={{ borderWidth: "3.5px 7px" }}
        >
          <div className="bg-red-200">
            <ImageLoader
              widthmobile="150px"
              heightmobile="150px"
              url={content.timeline[i].image}
              borderRadius="50%"
              // dimensionsMobile={{ width: 400, height: 400 }}
            ></ImageLoader>
            <div className="center-div">
              <p className={classes.TextHeading}>
                {content.timeline[i].heading}
              </p>
              <p
                className={classes.Text}
                dangerouslySetInnerHTML={{ __html: content.timeline[i].text }}
              ></p>
            </div>
          </div>
        </div>
      );
      cards.push(<div></div>);
      cards.push(<div></div>);
    }
  }
  
  return (
    <div className={classes.Container}>
      <div
        style={{
          borderStyle: "solid none none none",
          borderColor: "#F7e700",
          borderWidth: "3.5px",
        }}
      ></div>
      {cards}
      <div></div>
    </div>
  );
};

export default Timeline;
