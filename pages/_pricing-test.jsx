import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updatePricingForm } from "../store/actions/pricingForm";
import PricingFormCard from "../components/bot-components/components/PricingForm";

// TEMPORARY visual-verification page — safe to delete.
export default function PricingTest() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      updatePricingForm({
        active: true,
        completed: false,
        loading: false,
        heading: "Almost there!",
        subheading: "Confirm a few final details before pricing.",
        startCity: "Delhi",
        startCityQuery: "Delhi",
        startCityCompleted: true,
        isInternational: true,
        addFlights: null,
        addVisa: false,
        addEsim: false,
      }),
    );
  }, [dispatch]);

  return (
    <div style={{ padding: 24, maxWidth: 560, margin: "0 auto", background: "#f4f4f0", minHeight: "100vh" }}>
      <h3>Pricing form — visual test</h3>
      <PricingFormCard onComplete={(msg) => console.log("COMPOSED:\n" + msg)} />
    </div>
  );
}
