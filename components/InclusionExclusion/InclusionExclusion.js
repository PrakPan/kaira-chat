import React from "react";
import { useState } from "react";
import Exclusions from "./Exclusions";
import Inclusions from "./Inclusions";

const InclusionExclusion = (props) => {
  const [staysIds] = useState(props.payment?.summary?.Stays.bookings);
  const [transferIds] = useState(props.payment?.summary?.Transfers.bookings);
  const [flightsIds] = useState(props.payment?.summary?.Flights.bookings);

  return (
    <div>
      <Inclusions
        info={props.payment}
        staysIds={staysIds}
        transferIds={transferIds}
      />
      <Exclusions info={props.payment} flights={flightsIds} />
    </div>
  );
};

export default InclusionExclusion;
