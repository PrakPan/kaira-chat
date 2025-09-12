import { useState } from "react";
import styled from "styled-components";
import Modal from "../../ui/Modal";
import useMediaQuery from "../../media";
import BottomModal from "../../ui/LowerModal";

export const StyledText = styled.div`
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 14px;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

export const StyledBox = styled.div`
  height: 46px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  border: 1px solid #acacac;
  padding: 0 16px;
  color: #acacac;
  cursor: pointer;
`;

const PassengerRow = styled.div`
  width: 327px;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const PassengerLabel = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Inter, sans-serif;

  .title {
    font-weight: 500;
    font-size: 14px;
  }
  .subtitle {
    font-size: 12px;
    color: #6b7280;
  }
`;

const CounterBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CounterButton = styled.button`
  width: 32px;
  height: 32px;
  font-size: 18px;
  font-weight: bold;
  color: ${({ disabled }) => (disabled ? "#d1d5db" : "#000000")};
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const CounterValue = styled.div`
  width: 24px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
`;

export const ApplyButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background-color: #07213A;
  color: #ffffff;
  font-family: Inter, sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #000000;
  }
`;

export const ClearButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #cccccc;
  background-color: transparent;
  color: #333333;
  font-family: Inter, sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f2f2f2;
  }
`;

const AgeInput = styled.input`
  display: flex;
  width: 87px;
  padding: 6px 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 40px;
  border: 1px solid var(--Text-Colors-Stroke, #E5E5E5);
  background: var(--text-colors-text-white, #FFF);
  font-size: 14px;
  text-align: center;
  outline: none;

  /* Hide arrows in Chrome, Safari, Edge, Opera */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Hide arrows in Firefox */
  &[type=number] {
    -moz-appearance: textfield;
  }

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;


const EnterPassenger = (props) => {
  const [showPassengers, setShowPassenger] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [childAges, setChildAges] = useState([]);

  let isPageWide = useMediaQuery("(min-width: 768px)");

  const handleChildrenChange = (newCount) => {
    setChildren(newCount);
    setChildAges((prev) => {
      const updated = [...prev];
      if (newCount > prev.length) {
        // add empty slots for new children
        return [...updated, ...Array(newCount - prev.length).fill("")];
      } else {
        // remove extra age inputs
        return updated.slice(0, newCount);
      }
    });
  };

  const handleApply = () => {
    props.setRoomConfiguration([
      {
        adults,
        children,
        infants,
        childAges,
      },
    ]);
    props.setNumberOfAdults(adults)
    props.setNumberOfChildren(children)
    props.setNumberOfInfants(infants)
    setShowPassenger(false);
  };

  console.log("room config new is: ", props?.roomConfiguration)
  return (
    <div>
      <StyledText className="mb-[4px]">Who's Going</StyledText>
      <StyledBox onClick={() => setShowPassenger(true)}>
        {props.numberOfAdults + props.numberOfChildren + props.numberOfInfants} Travelers
      </StyledBox>

      {isPageWide ? 
      <Modal
        height={isPageWide ? "436px" : "100%"}
        borderRadius={"12px"}
        show={showPassengers}
        backdrop={true}
        size="lg"
        onHide={() => setShowPassenger(false)}
        animation={false}
        width={isPageWide ? "367px" : "100%"}
      >
        <div className="flex flex-col justify-between items-center h-[436px] p-[20px] overflow-y-auto">
          <PassengerRow className="flex flex-col p-2">
            <div className="text-[20px]">Who's Going?</div>
            <div>{adults + children + infants} Travelers</div>
          </PassengerRow>

          <Section>
            {/* Adults */}
            <PassengerRow>
              <PassengerLabel>
                <div className="title">Adults</div>
                <div className="subtitle">Ages 13 or above</div>
              </PassengerLabel>
              <CounterBox>
                <CounterButton onClick={() => setAdults((p) => p - 1)} disabled={adults <= 1}>−</CounterButton>
                <CounterValue>{adults}</CounterValue>
                <CounterButton onClick={() => setAdults((p) => p + 1)} disabled={adults >= 14}>+</CounterButton>
              </CounterBox>
            </PassengerRow>

            {/* Children */}
            <PassengerRow style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <PassengerLabel>
                  <div className="title">Children</div>
                  <div className="subtitle">Ages 2 to 12</div>
                </PassengerLabel>
                <CounterBox>
                  <CounterButton onClick={() => handleChildrenChange(children - 1)} disabled={children <= 0}>−</CounterButton>
                  <CounterValue>{children}</CounterValue>
                  <CounterButton onClick={() => handleChildrenChange(children + 1)} disabled={children > 12}>+</CounterButton>
                </CounterBox>
              </div>

            </PassengerRow>

            {children > 0 && (
              <div className="w-full" style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div className="text-[12px] text-[#6E757A]">Enter the children age for the best options and prices</div>
                {Array.from({ length: children }).map((_, idx) => (
                  <PassengerRow className="w-full text-[12px]" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <div className="flex justify-between items-center w-full">
                      <div className="title">Age of Child {idx}</div>
                      <AgeInput
                        key={idx}
                        type="number"
                        min="2"
                        max="12"
                        value={childAges[idx] || ""}
                        onChange={(e) => {
                          const updated = [...childAges];
                          updated[idx] = e.target.value;
                          setChildAges(updated);
                        }}
                      />
                    </div>
                  </PassengerRow>
                ))}
              </div>
            )}

            {/* Infants */}
            <PassengerRow>
              <PassengerLabel>
                <div className="title">Infants</div>
                <div className="subtitle">Under age 2</div>
              </PassengerLabel>
              <CounterBox>
                <CounterButton onClick={() => setInfants((p) => p - 1)} disabled={infants <= 0}>−</CounterButton>
                <CounterValue>{infants}</CounterValue>
                <CounterButton onClick={() => setInfants((p) => p + 1)} disabled={infants > 4}>+</CounterButton>
              </CounterBox>
            </PassengerRow>
          </Section>

          {/* Buttons */}
          <div className="flex justify-between w-full gap-2">
            <ClearButton className="w-1/2" onClick={() => { setAdults(2); setChildren(0); setInfants(0); setChildAges([]); setShowPassenger(false); }}>Clear</ClearButton>
            <ApplyButton className="w-1/2" onClick={handleApply}>Apply</ApplyButton>
          </div>
        </div>
      </Modal> :
        <BottomModal
          show={showPassengers}
          onHide={() => setShowPassenger(false)}
          width="100%"
          height="max-content"
          >
          <div className="flex flex-col justify-between items-center h-[436px] p-[20px] overflow-y-auto">
            <PassengerRow className="flex flex-col p-2 !w-[100%]">
              <div className="text-[20px]">Who's Going?</div>
              <div>{adults + children + infants} Travelers</div>
            </PassengerRow>

            <Section className="w-full">
              {/* Adults */}
              <PassengerRow className="!w-[100%]">
                <PassengerLabel>
                  <div className="title">Adults</div>
                  <div className="subtitle">Ages 13 or above</div>
                </PassengerLabel>
                <CounterBox>
                  <CounterButton onClick={() => setAdults((p) => p - 1)} disabled={adults <= 1}>−</CounterButton>
                  <CounterValue>{adults}</CounterValue>
                  <CounterButton onClick={() => setAdults((p) => p + 1)} disabled={adults >= 14}>+</CounterButton>
                </CounterBox>
              </PassengerRow>

              {/* Children */}
              <PassengerRow className="!w-[100%]" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                  <PassengerLabel>
                    <div className="title">Children</div>
                    <div className="subtitle">Ages 2 to 12</div>
                  </PassengerLabel>
                  <CounterBox>
                    <CounterButton onClick={() => handleChildrenChange(children - 1)} disabled={children <= 0}>−</CounterButton>
                    <CounterValue>{children}</CounterValue>
                    <CounterButton onClick={() => handleChildrenChange(children + 1)} disabled={children > 12}>+</CounterButton>
                  </CounterBox>
                </div>

              </PassengerRow>

              {children > 0 && (
                <div className="w-full" style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div className="text-[12px] text-[#6E757A]">Enter the children age for the best options and prices</div>
                  {Array.from({ length: children }).map((_, idx) => (
                    <PassengerRow className="!w-full text-[12px]" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                      <div className="flex justify-between items-center w-full">
                        <div className="title">Age of Child {idx}</div>
                        <AgeInput
                          key={idx}
                          type="number"
                          min="2"
                          max="12"
                          value={childAges[idx] || ""}
                          onChange={(e) => {
                            const updated = [...childAges];
                            updated[idx] = e.target.value;
                            setChildAges(updated);
                          }}
                        />
                      </div>
                    </PassengerRow>
                  ))}
                </div>
              )}

              {/* Infants */}
              <PassengerRow className="!w-[100%]">
                <PassengerLabel>
                  <div className="title">Infants</div>
                  <div className="subtitle">Under age 2</div>
                </PassengerLabel>
                <CounterBox>
                  <CounterButton onClick={() => setInfants((p) => p - 1)} disabled={infants <= 0}>−</CounterButton>
                  <CounterValue>{infants}</CounterValue>
                  <CounterButton onClick={() => setInfants((p) => p + 1)} disabled={infants > 4}>+</CounterButton>
                </CounterBox>
              </PassengerRow>
            </Section>

            {/* Buttons */}
            <div className="flex justify-between w-full gap-2">
              <ClearButton className="w-1/2" onClick={() => { setAdults(2); setChildren(0); setInfants(0); setChildAges([]); setShowPassenger(false); }}>Clear</ClearButton>
              <ApplyButton className="w-1/2" onClick={handleApply}>Apply</ApplyButton>
            </div>
          </div>
        </BottomModal>
      }
    </div>
  );
};

export default EnterPassenger;
