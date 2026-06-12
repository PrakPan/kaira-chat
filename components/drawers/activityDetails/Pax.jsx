import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import ModalWithBackdrop from "../../ui/ModalWithBackdrop";
import BottomModal from "../../ui/LowerModal";
import useMediaQuery from "../../media";
import {
  AgeInput as ModalAgeInput,
  ApplyButton,
  CounterBox,
  CounterButton as ModalCounterButton,
  CounterValue,
  HeaderRow,
  PassengerLabel,
  PassengerRow,
  Section,
} from "../../tailoredform/slidetwo/EnterPassenger";

export const Pax = ({ pax, setPax, combo, limit = null }) => {
  const refDesktop = useRef(null);
  const refMobile = useRef(null);
  const isDesktop = useMediaQuery("(min-width:768px)");

  const [showPax, setShowPax] = useState(false);
  const [showPaxMobile, setShowPaxMobile] = useState(false);
  const [adults, setAdults] = useState(pax.adults || 1);
  const [children, setChildren] = useState(pax.children || 0);
  const [childAges, setChildAges] = useState(() => {
  const count = pax.children || 0;
  const ages = pax.childAges || [];
  return Array.from({ length: count }, (_, i) =>
    ages[i] !== undefined && ages[i] !== null ? ages[i] : 10
  );
});
  const [infants, setInfants] = useState(pax.infants || 0);


  useEffect(() => {
  const count = pax.children || 0;
  const ages = pax.childAges || [];
  setAdults(pax.adults || 1);
  setChildren(count);
  setChildAges(
    Array.from({ length: count }, (_, i) =>
      ages[i] !== undefined && ages[i] !== null ? ages[i] : 10
    )
  );
  setInfants(pax.infants || 0);
}, [pax.adults, pax.children, JSON.stringify(pax.childAges), pax.infants]);

  const handleMinus = (type) => {
    if (type === "adult" && adults > 1) setAdults((prev) => prev - 1);
    if (type === "children" && children > 0) {
      setChildren((prev) => prev - 1);
      setChildAges((prev) => prev.slice(0, -1));
    }
    if (type === "infants" && infants > 0) setInfants((prev) => prev - 1);
  };

  const handlePlus = (type) => {
    if (type === "adult") {
      if (!limit || adults < limit) {
        setAdults((prev) => prev + 1);
      }
    }
    if (type === "children") {
  setChildren((prev) => prev + 1);
  setChildAges((prev) => [...prev, 10]); 
}
    if (type === "infants") setInfants((prev) => prev + 1);
  };

  const handleChildAgeChange = (index, value) => {
    const age = value ? parseInt(value, 10) : 0;
    setChildAges((prev) => prev.map((a, i) => (i === index ? age : a)));
  };

  const handleDone = () => {
    combo
      ? setPax({
          adults,
          children,
          childAges,
          infants,
          number_of_adults: adults,
          number_of_children: children,
          number_of_infants: infants || 0,
        })
      : setPax({
          adults,
          children,
          childAges,
          infants,
          number_of_adults: adults,
          number_of_children: children,
        });
    setShowPax(false);
    setShowPaxMobile(false);
  };

  // Reset local counters to the last applied values when the modal is dismissed
  // without pressing Apply.
  const closeModal = () => {
    setAdults(pax.adults || 1);
    setChildren(pax.children || 0);
    setChildAges(
      Array.from({ length: pax.children || 0 }, (_, i) =>
        pax.childAges?.[i] !== undefined && pax.childAges?.[i] !== null
          ? pax.childAges[i]
          : 10
      )
    );
    setInfants(pax.infants || 0);
    setShowPax(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refDesktop.current && !refDesktop.current.contains(event.target)) {
        setShowPax(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refMobile.current && !refMobile.current.contains(event.target)) {
        setShowPaxMobile(false);
      }
    };
    if (showPaxMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPaxMobile]);

  const total = adults + children + infants;

  // "2 Adults, 1 Child, 1 Infant" — only the selected groups, proper
  // singular/plural. Matches the route-transfer travellers trigger.
  const summary =
    [
      adults > 0 ? `${adults} ${adults > 1 ? "Adults" : "Adult"}` : null,
      children > 0 ? `${children} ${children > 1 ? "Children" : "Child"}` : null,
      infants > 0 ? `${infants} ${infants > 1 ? "Infants" : "Infant"}` : null,
    ]
      .filter(Boolean)
      .join(", ") || "Add travellers";

  // Shared travellers modal body — matches the bus / train / taxi selector
  // (see TransferPax.jsx). Reused on desktop (ModalWithBackdrop) and mobile
  // (BottomModal) so every Travellers field opens the same modal.
  const ModalBody = (
    <div className="w-full flex flex-col justify-between items-center max-h-[80vh] md:max-h-[70vh] overflow-y-auto hide-scrollbar">
      <HeaderRow className="!w-full">
        <div className="Heading2SB">Travellers</div>
        <div className="Body2R_14">
          {total} {total > 1 ? "Travellers" : "Traveller"}
        </div>
      </HeaderRow>

      <Section className="w-full">
        {/* Adults */}
        <PassengerRow className="!w-[100%]">
          <PassengerLabel>
            <div className="Body2M_14">Adults</div>
            <div className="subtitle">12+ Years</div>
          </PassengerLabel>
          <CounterBox>
            <ModalCounterButton onClick={() => handleMinus("adult")} disabled={adults <= 1}>
              −
            </ModalCounterButton>
            <CounterValue>{adults}</CounterValue>
            <ModalCounterButton
              onClick={() => handlePlus("adult")}
              disabled={limit ? adults >= limit : false}
            >
              +
            </ModalCounterButton>
          </CounterBox>
        </PassengerRow>

        {/* Children */}
        <PassengerRow
          className="!w-[100%]"
          style={{ flexDirection: "column", alignItems: "flex-start" }}
        >
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
            <PassengerLabel>
              <div className="Body2M_14">Children</div>
              <div className="subtitle">2-12 Years</div>
            </PassengerLabel>
            <CounterBox>
              <ModalCounterButton
                onClick={() => handleMinus("children")}
                disabled={children <= 0}
              >
                −
              </ModalCounterButton>
              <CounterValue>{children}</CounterValue>
              <ModalCounterButton onClick={() => handlePlus("children")}>+</ModalCounterButton>
            </CounterBox>
          </div>

          {children > 0 && (
            <div
              className="w-full"
              style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div className="text-[12px] text-[#6E757A]">
                Enter the age of each child below
              </div>
              {childAges.map((age, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center w-full text-[12px]"
                >
                  <div className="Body2M_14">Age of Child {index + 1}</div>
                  <div className="flex items-center gap-2">
                    <ModalCounterButton
                      onClick={() => handleChildAgeChange(index, age - 1)}
                      disabled={age <= 2}
                    >
                      −
                    </ModalCounterButton>
                    <ModalAgeInput
                      type="number"
                      min="2"
                      max="12"
                      value={age}
                      onChange={(e) => handleChildAgeChange(index, e.target.value)}
                      disabled
                    />
                    <span className="text-sm text-gray-500">years</span>
                    <ModalCounterButton
                      onClick={() => handleChildAgeChange(index, age + 1)}
                      disabled={age >= 12}
                    >
                      +
                    </ModalCounterButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PassengerRow>

        {/* Infants */}
        {combo && (
          <PassengerRow className="!w-[100%]">
            <PassengerLabel>
              <div className="Body2M_14">Infants</div>
              <div className="subtitle">Under age 2</div>
            </PassengerLabel>
            <CounterBox>
              <ModalCounterButton onClick={() => handleMinus("infants")} disabled={infants <= 0}>
                −
              </ModalCounterButton>
              <CounterValue>{infants}</CounterValue>
              <ModalCounterButton onClick={() => handlePlus("infants")}>+</ModalCounterButton>
            </CounterBox>
          </PassengerRow>
        )}
      </Section>

      <div className="flex justify-end w-full gap-2">
        <ApplyButton className="w-1/2" onClick={handleDone}>
          Apply
        </ApplyButton>
      </div>
    </div>
  );

  return (
    <div className="relative w-fit h-fit flex flex-row items-center gap-2 rounded-lg cursor-pointer z-[10]">
      {/* Trigger (unchanged) */}
      <div
        onClick={() => setShowPax((prev) => !prev)}
        className="flex items-center gap-1.5 w-full bg-[#f4f3ec] py-[0.7rem] px-4 rounded-lg"
      >
        <FaUserFriends className="shrink-0 text-[#0b1220]" size={16} />
        <div className="ttw-type-small md:ttw-type-body font-medium">Travellers</div>
        <div className="ttw-type-small md:ttw-type-body font-medium">|</div>
        <div className="ttw-type-small font-medium whitespace-nowrap">
          {summary}
        </div>
        <IoIosArrowDown className="shrink-0" />
      </div>

      {isDesktop ? (
        <ModalWithBackdrop
          centered
          show={showPax}
          mobileWidth="100%"
          backdrop
          closeIcon={true}
          onHide={closeModal}
          borderRadius={"12px"}
          animation={false}
          paddingX="20px"
          paddingY="20px"
          backdropStyle={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(1px)" }}
        >
          <div className="min-w-[340px]">{ModalBody}</div>
        </ModalWithBackdrop>
      ) : (
        <BottomModal
          show={showPax === true}
          onHide={closeModal}
          width="100%"
          height="max-content"
          paddingX="20px"
          paddingY="20px"
        >
          {ModalBody}
        </BottomModal>
      )}
    </div>
  );
};