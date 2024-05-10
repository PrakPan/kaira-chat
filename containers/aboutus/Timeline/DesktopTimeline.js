import React from "react";
import ImageLoader from "../../../components/ImageLoader";
import classes from "./DesktopTimeline.module.css";
import content from "../../../public/content/aboutus";

let reviewcards = [];

for (var i = 0; i < 7; i++) {
  reviewcards.push(
    <div
      className={classes.Card}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ImageLoader
        fit="cover"
        widthtab="15rem"
        heighttab="15rem"
        width="20rem"
        height="20rem"
        borderRadius="50%"
        url={content.timeline[i].image}
        dimensions={{ width: 400, height: 400 }}
      ></ImageLoader>
    </div>
  );
  if (i === 1 || i === 3 || i === 5)
    reviewcards.push(
      <div
        className={classes.Card}
        style={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          margin: "-0.7rem 0 0 0;",
        }}
      >
        <p className={classes.Year} style={{ paddingLeft: "20%" }}>
          {content.timeline[i].year}
        </p>
        <p className={classes.Heading} style={{ paddingLeft: "20%" }}>
          {content.timeline[i].heading}
        </p>
        <p
          className={classes.Text}
          style={{ paddingLeft: "20%" }}
          dangerouslySetInnerHTML={{ __html: content.timeline[i].text }}
        ></p>
      </div>
    );
  else {
    reviewcards.push(
      <div
        className={classes.Card}
        style={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          margin: "-0.7rem 0 0 0;",
        }}
      >
        <p className={classes.Year}>{content.timeline[i].year}</p>
        <p className={classes.Heading}>{content.timeline[i].heading}</p>
        <p
          className={classes.Text}
          style={{ width: "80%" }}
          dangerouslySetInnerHTML={{ __html: content.timeline[i].text }}
        ></p>
      </div>
    );
  }
}

const TimeLine = () => {
  return (
    <div className={classes.Container}>
      <div
        style={{
          borderStyle: "none none none none",
          borderColor: "#f7e700",
          borderWidth: "0.7rem",
        }}
      ></div>
      <div className={classes.TimelineContainer}>{reviewcards}</div>
      <div
        style={{
          borderStyle: "solid none solid none",
          borderColor: "#f7e700",
          borderWidth: "0.7rem",
        }}
      ></div>
    </div>
  );
};

export default TimeLine;
