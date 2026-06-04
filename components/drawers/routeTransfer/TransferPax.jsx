import { useEffect, useRef, useState } from "react";
import { FaUserFriends, FaChevronDown } from "react-icons/fa";
import ModalWithBackdrop from "../../ui/ModalWithBackdrop";
import BottomModal from "../../ui/LowerModal";
import useMediaQuery from "../../media";
import {
  AgeInput,
  ApplyButton,
  CounterBox,
  CounterButton,
  CounterValue,
  HeaderRow,
  PassengerLabel,
  PassengerRow,
  Section,
} from "../../tailoredform/slidetwo/EnterPassenger";

const DEFAULT_CHILD_AGE = 10;

/**
 * Travellers selector for the transfer search drawer.
 *
 * Visually matches the canonical settings / hotels traveller selector
 * (ModalWithBackdrop on desktop, BottomModal on mobile, the shared
 * Passenger styled-components and dark "Apply" button) but keeps the
 * transfer's single-group data model: Adults / Children (+ ages) / Infants.
 *
 * Drop-in for the previous `Pax` component — same `pax` / `setPax` contract.
 */
const TransferPax = ({ pax, setPax, combo = true, limit = null, disabled = false }) => {
  const isDesktop = useMediaQuery("(min-width:768px)");

  const [isOpen, setIsOpen] = useState(false);
  const [adults, setAdults] = useState(pax?.adults || 1);
  const [children, setChildren] = useState(pax?.children || 0);
  const [childAges, setChildAges] = useState(() => {
    const count = pax?.children || 0;
    const ages = pax?.childAges || [];
    return Array.from({ length: count }, (_, i) =>
      ages[i] !== undefined && ages[i] !== null ? ages[i] : DEFAULT_CHILD_AGE,
    );
  });
  const [infants, setInfants] = useState(pax?.infants || 0);

  // Keep local state in sync when the parent pax changes.
  useEffect(() => {
    const count = pax?.children || 0;
    const ages = pax?.childAges || [];
    setAdults(pax?.adults || 1);
    setChildren(count);
    setChildAges(
      Array.from({ length: count }, (_, i) =>
        ages[i] !== undefined && ages[i] !== null ? ages[i] : DEFAULT_CHILD_AGE,
      ),
    );
    setInfants(pax?.infants || 0);
  }, [pax?.adults, pax?.children, JSON.stringify(pax?.childAges), pax?.infants]);

  const total = adults + children + infants;

  // "2 Adults, 1 Child, 1 Infant" — only the selected groups, proper singular/plural.
  const summary =
    [
      adults > 0 ? `${adults} ${adults > 1 ? "Adults" : "Adult"}` : null,
      children > 0 ? `${children} ${children > 1 ? "Children" : "Child"}` : null,
      infants > 0 ? `${infants} ${infants > 1 ? "Infants" : "Infant"}` : null,
    ]
      .filter(Boolean)
      .join(", ") || "Add travellers";

  const handleChildrenChange = (next) => {
    if (next < 0) return;
    setChildren(next);
    setChildAges((prev) => {
      if (next > prev.length) {
        return [...prev, ...Array(next - prev.length).fill(DEFAULT_CHILD_AGE)];
      }
      return prev.slice(0, next);
    });
  };

  const handleChildAgeChange = (index, value) => {
    const age = value ? parseInt(value, 10) : 0;
    setChildAges((prev) => prev.map((a, i) => (i === index ? age : a)));
  };

  const openModal = () => {
    if (!disabled) setIsOpen(true);
  };

  const closeModal = () => {
    // Reset to the last applied values on dismiss.
    setAdults(pax?.adults || 1);
    setChildren(pax?.children || 0);
    setChildAges(
      Array.from({ length: pax?.children || 0 }, (_, i) =>
        pax?.childAges?.[i] !== undefined && pax?.childAges?.[i] !== null
          ? pax.childAges[i]
          : DEFAULT_CHILD_AGE,
      ),
    );
    setInfants(pax?.infants || 0);
    setIsOpen(false);
  };

  const handleApply = () => {
    setPax({
      adults,
      children,
      childAges,
      infants,
      number_of_adults: adults,
      number_of_children: children,
      number_of_infants: infants || 0,
    });
    setIsOpen(false);
  };

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
            <CounterButton onClick={() => setAdults((p) => p - 1)} disabled={adults <= 1}>
              −
            </CounterButton>
            <CounterValue>{adults}</CounterValue>
            <CounterButton
              onClick={() => setAdults((p) => p + 1)}
              disabled={limit ? adults >= limit : false}
            >
              +
            </CounterButton>
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
              <CounterButton
                onClick={() => handleChildrenChange(children - 1)}
                disabled={children <= 0}
              >
                −
              </CounterButton>
              <CounterValue>{children}</CounterValue>
              <CounterButton onClick={() => handleChildrenChange(children + 1)}>+</CounterButton>
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
                    <CounterButton
                      onClick={() => handleChildAgeChange(index, age - 1)}
                      disabled={age <= 2}
                    >
                      −
                    </CounterButton>
                    <AgeInput
                      type="number"
                      min="2"
                      max="12"
                      value={age}
                      onChange={(e) => handleChildAgeChange(index, e.target.value)}
                      disabled
                    />
                    <span className="text-sm text-gray-500">years</span>
                    <CounterButton
                      onClick={() => handleChildAgeChange(index, age + 1)}
                      disabled={age >= 12}
                    >
                      +
                    </CounterButton>
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
              <CounterButton onClick={() => setInfants((p) => p - 1)} disabled={infants <= 0}>
                −
              </CounterButton>
              <CounterValue>{infants}</CounterValue>
              <CounterButton onClick={() => setInfants((p) => p + 1)}>+</CounterButton>
            </CounterBox>
          </PassengerRow>
        )}
      </Section>

      <div className="flex justify-end w-full gap-2">
        <ApplyButton className="w-1/2" onClick={handleApply}>
          Apply
        </ApplyButton>
      </div>
    </div>
  );

  return (
    <div className="relative w-full">
      {/* Trigger — matches the Departure Date/Time field chrome */}
      <div
        onClick={openModal}
        className={`flex h-[46.4px] w-full min-w-0 items-center gap-2 rounded-[10px] border bg-[#07213A0D] px-3 transition-colors ${
          isOpen ? "border-[#07213A]" : "border-[#07213A26]"
        } ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-[#07213A14] hover:border-[#07213A40]"
        }`}
      >
        <FaUserFriends className="shrink-0 text-[#07213A]" size={16} />
        <span className="Body2M_14 flex-1 truncate text-[#07213A]">{summary}</span>
        <FaChevronDown
          className={`shrink-0 text-[#07213A] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          size={14}
        />
      </div>

      {isDesktop ? (
        <ModalWithBackdrop
          centered
          show={isOpen}
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
          show={isOpen === true}
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

export default TransferPax;
