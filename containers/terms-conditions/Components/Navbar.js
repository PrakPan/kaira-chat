import React, { useEffect, useState } from "react";
import content from "../../../public/content/termsconditions";
import { Link, animateScroll as scroll } from "react-scroll";

const Term2 = () => {
  let card = [];
  const [headingText, setHeadingText] = useState(false);
  const [headingCont, setHeadingCont] = useState(false);

  useEffect(() => {
    for (var i = 0; i < content.length; i++) {
      {
        card.push(
          <li
            className="nav-item "
            style={{
              backgroundColor:
                headingCont === content[i].subheading
                  ? "#f7e700"
                  : "transparent",
              padding: "0.5rem",
              fontWeight: headingCont === content[i].subheading ? "600" : "400",
            }}
          >
            <Link
              activeClass="termsnavunderlinelink"
              to={content[i].subheading}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onSetActive={handleSetActive}
            >
              {content[i].subheading}{" "}
            </Link>
          </li>
        );
      }
    }
    setHeadingText(card);
  }, [headingCont]);

  const handleSetActive = (activeClass) => {
    setHeadingCont(activeClass);
  };

  return (
    <nav className="nav" id="navbar">
      <div className="nav-content">
        <div style={{ fontSize: "1rem" }}>{headingText}</div>
      </div>
    </nav>
  );
};

export default Term2;
