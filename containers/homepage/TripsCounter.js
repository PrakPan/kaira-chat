import React from "react";
import useInViewport from "../../components/custom hooks/useInViewport";
import media from "../../components/media";

function TripsCounter(props) {
  const [ref, inViewport] = useInViewport();
  let isPageWide = media("(min-width: 768px)");

  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center" }}>
      <h2
        style={
          isPageWide
            ? { fontSize: "45px", fontWeight: 700 }
            : { fontSize: "18px", fontWeight: 700 }
        }
      >
        10,000+
      </h2>
     
    </div>
  );
}

export default React.memo(TripsCounter);
