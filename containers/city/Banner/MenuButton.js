import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import usePageLoaded from "../../../components/custom hooks/usePageLoaded";

const MenuButton = (props) => {
  const isPageLoaded = usePageLoaded();

  return (
    <div>
      {isPageLoaded ? (
        <FontAwesomeIcon
          style={{ marginRight: "0.5rem" }}
          icon={faEllipsisV}
          onClick={props.handleClick}
        />
      ) : null}
    </div>
  );
};

export default React.memo(MenuButton);
