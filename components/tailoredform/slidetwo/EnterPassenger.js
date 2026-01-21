import { useState } from "react";
import styled from "styled-components";
import useMediaQuery from "../../media";
import BottomModal from "../../ui/LowerModal";
import ModalWithBackdrop from "../../ui/ModalWithBackdrop";

export const StyledText = styled.div`
  // font-family: "Inter", sans-serif;
  // font-weight: 400;
  // font-size: 14px;
`;

export const Section = styled.div`
  margin-bottom: 1.5rem;
`;


export const StyledBox = styled.div`
  height: 46px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  padding: 0 16px;
  color: black;
  cursor: pointer;
  background: #fff;
  justify-content: space-between;
  border: 1px solid #f7e700
`;

export const PassengerRow = styled.div`
  width: 327px;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  
`;

export const HeaderRow = styled.div`
  width: 327px;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  
`;

export const PassengerLabel = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Inter, sans-serif;

  .title {
    font-weight: 500;
    font-size: 14px;
  }
  .subtitle {
    font-size: 14px;
    font-weight: 400;
    color: #6b7280;
  }
`;

export const CounterBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CounterButton = styled.button`
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

export const CounterValue = styled.div`
  width: 87px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  border-radius: 40px;
  border: 1px solid var(--Text-Colors-Stroke, #E5E5E5);
  background: var(--text-colors-text-white, #FFF);
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-colors-text-black, #000);
  font-family: Inter, sans-serif;
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

export const AgeInput = styled.input`
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
  const [adults, setAdults] = useState(props.numberOfAdults);
  const [children, setChildren] = useState(props.numberOfChildren);
  const [infants, setInfants] = useState(props.numberOfInfants);
  const [childAges, setChildAges] = useState([]);

  let isPageWide = useMediaQuery("(min-width: 768px)");

  const handleChildrenChange = (newCount) => {
    setChildren(newCount);
    setChildAges((prev) => {
      const updated = [...prev];
      if (newCount > prev.length) {
        return [...updated, ...Array(newCount - prev.length).fill(10)];
      } else {
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

  return (
    <div>
      <StyledText className="mb-[4px] Body1M_16">{props.settings ? 'Number of Travellers' : "Who's Going"}</StyledText>
      <StyledBox onClick={() => setShowPassenger(true)}>
        {props.numberOfAdults + props.numberOfChildren + props.numberOfInfants} Travelers <span className="text-blue">Change</span>
      </StyledBox>

      {isPageWide ? 
      <ModalWithBackdrop
        show={showPassengers}
        backdrop
        size="md"
        onHide={() => {
          setShowPassenger(false)
          setAdults(props.numberOfAdults)
          setChildren(props.numberOfChildren)
          setInfants(props.numberOfInfants)
        }}
        borderRadius={"12px"}
        animation={false}
        paddingX="20px"
        paddingY="20px"
        backdropStyle={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(1px)" }} // <- add this
      >
        <div className="flex flex-col justify-between items-center h-[436px] overflow-y-auto">
          <HeaderRow>
            <div className="Heading2SB">Who's Going?</div>
            <div className="Body2R_14">{adults + children + infants} Travelers</div>
          </HeaderRow>

          <Section>
            {/* Adults */}
            <PassengerRow>
              <PassengerLabel>
                <div className="Body2M_14">Adults</div>
                <div className="subtitle">Ages 13 or above</div>
              </PassengerLabel>
              <CounterBox>
                <CounterButton onClick={() => setAdults((p) => p - 1)} disabled={adults <= 1}>−</CounterButton>
                <CounterValue>{adults}</CounterValue>
                <CounterButton onClick={() => setAdults((p) => p + 1)} disabled={props?.isTailored == true ? false : adults >= 14}>+</CounterButton>
              </CounterBox>
            </PassengerRow>

            {/* Children */}
            <PassengerRow style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <PassengerLabel>
                  <div className="Body2M_14">Children</div>
                  <div className="subtitle">Ages 0 to 12</div>
                </PassengerLabel>
                <CounterBox>
                  <CounterButton onClick={() => handleChildrenChange(children - 1)} disabled={children <= 0}>−</CounterButton>
                  <CounterValue>{children}</CounterValue>
                  <CounterButton onClick={() => handleChildrenChange(children + 1)} disabled={props?.isTailored == true ? false : children > 12}>+</CounterButton>
                </CounterBox>
              </div>

            </PassengerRow>

            {/* Infants */}
            <PassengerRow>
              <PassengerLabel>
                <div className="Body2M_14">Infants</div>
                <div className="subtitle">Under age 2</div>
              </PassengerLabel>
              <CounterBox>
                <CounterButton onClick={() => setInfants((p) => p - 1)} disabled={infants <= 0}>−</CounterButton>
                <CounterValue>{infants}</CounterValue>
                <CounterButton onClick={() => setInfants((p) => p + 1)} disabled={props?.isTailored == true ? false : infants > 4}>+</CounterButton>
              </CounterBox>
            </PassengerRow>
          </Section>

          {/* Buttons */}
          <div className="flex justify-end w-full gap-2">
            <ApplyButton className="w-1/2" onClick={handleApply}>Apply</ApplyButton>
          </div>
        </div>
      </ModalWithBackdrop> :
        <BottomModal
          show={showPassengers}
          onHide={() => {
            setShowPassenger(false)
            setAdults(props.numberOfAdults)
            setChildren(props.numberOfChildren)
            setInfants(props.numberOfInfants)
          }}
          width="100%"
          height="max-content"
          paddingX="20px"
          paddingY="20px"
          >
          <div className="flex flex-col justify-between items-center h-[436px] overflow-y-auto">
            <HeaderRow>
              <div className="Heading2SB">Who's Going?</div>
              <div className="Body2R_14">{adults + children + infants} Travelers</div>
            </HeaderRow>

            <Section className="w-full">
              {/* Adults */}
              <PassengerRow className="!w-[100%]">
                <PassengerLabel>
                  <div className="Body2M_14">Adults</div>
                  <div className="subtitle">Ages 13 or above</div>
                </PassengerLabel>
                <CounterBox>
                  <CounterButton onClick={() => setAdults((p) => p - 1)} disabled={adults <= 1}>−</CounterButton>
                  <CounterValue>{adults}</CounterValue>
                  <CounterButton onClick={() => setAdults((p) => p + 1)} disabled={props?.isTailored == true ? false : adults >= 14}>+</CounterButton>
                </CounterBox>
              </PassengerRow>

              {/* Children */}
              <PassengerRow className="!w-[100%]" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                  <PassengerLabel>
                    <div className="Body2M_14">Children</div>
                    <div className="subtitle">Ages 2 to 12</div>
                  </PassengerLabel>
                  <CounterBox>
                    <CounterButton onClick={() => handleChildrenChange(children - 1)} disabled={children <= 0}>−</CounterButton>
                    <CounterValue>{children}</CounterValue>
                    <CounterButton onClick={() => handleChildrenChange(children + 1)} disabled={props?.isTailored == true ? false : children > 12}>+</CounterButton>
                  </CounterBox>
                </div>

              </PassengerRow>

              {/* Infants */}
              <PassengerRow className="!w-[100%]">
                <PassengerLabel>
                  <div className="Body2M_14">Infants</div>
                  <div className="subtitle">Under age 2</div>
                </PassengerLabel>
                <CounterBox>
                  <CounterButton onClick={() => setInfants((p) => p - 1)} disabled={infants <= 0}>−</CounterButton>
                  <CounterValue>{infants}</CounterValue>
                  <CounterButton onClick={() => setInfants((p) => p + 1)} disabled={props?.isTailored == true ? false : infants > 4}>+</CounterButton>
                </CounterBox>
              </PassengerRow>
            </Section>

            {/* Buttons */}
            <div className="flex justify-end w-full gap-2">
              <ApplyButton className="w-1/2" onClick={handleApply}>Apply</ApplyButton>
            </div>
          </div>
        </BottomModal>
      }
    </div>
  );
};

export default EnterPassenger;
