import React, { useEffect, useState } from 'react'
import useInViewport from "../../components/custom hooks/useInViewport";
import axiosCountInstance from "../../services/itinerary/count";
import media from "../../components/media";

function TripsCounter() {
    const [count, setCount] = useState(null);
  const [ref, inViewport] = useInViewport();
  const [countToShow, setCountShow] = useState(0);
    let isPageWide = media("(min-width: 768px)");
    
useEffect(() => {
  axiosCountInstance.get("").then((res) => setCount(res.data.user));
}, []);
useEffect(() => {
  if (countToShow != count) {
    setTimeout(() => {
      if (countToShow < count) setCountShow((prev) => prev + 9);
      else setCountShow(count);
    }, [2]);
  }
}, [countToShow, inViewport]);
  return (
      <div ref={ref} style={{ display: "flex", alignItems: "center" , width : '138px' }}>
        <h2
          style={
            isPageWide
              ? { fontSize: "50px", fontWeight: 700 }
              : { fontSize: "18px", fontWeight: 700 }
          }
        >
          {countToShow}
        </h2>
        <h2>+</h2>
      </div>
  );
}

export default TripsCounter