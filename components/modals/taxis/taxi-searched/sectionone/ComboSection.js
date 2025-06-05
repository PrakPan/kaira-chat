import React, { useState } from "react";
import styled from "styled-components";
import media from "../../../../media";
import { axiosTaxiBooking } from "../../../../../services/bookings/UpdateTaxiGozo";
import ImageLoader from "../../../../ImageLoader";
import { PulseLoader } from "react-spinners";
import { getIndianPrice } from "../../../../../services/getIndianPrice";
import Accordion, {
  AccordionDetails,
  AccordionSummary,
} from "../../../../ui/Accordion";
import { connect } from "react-redux";
import { openNotification } from "../../../../../store/actions/notification";
import dayjs from "dayjs";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { FaCar } from "react-icons/fa";
import { PiTaxiLight } from "react-icons/pi";

// Styled components
// const Container = styled.div`
//    border-bottom: 1px solid rgba(238, 238, 238, 1);
//   padding: 1rem 0.75rem;
//   margin-bottom: 0.5rem;
// `;
const Container = styled.div`
  padding: 1rem 0.75rem;
`;

const TaxiCard = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 1rem;
`;

// const ImageContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   min-width: 30px;
// `;
const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 10px;
`;

const DetailsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// const TaxiHeading = styled.p`
//   font-size: 16px;
//   font-weight: 700;
//   margin: 0 0 0.2rem 0;
//   line-height: 1.2;
// `;
const TaxiHeading = styled.p`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 0.2rem 0;
  line-height: 1.2;
`;

const ModelText = styled.div`
  font-size: 0.8rem;
  color: #888080;
  font-weight: 300;
  margin: 0 0 0.5rem 0;
`;

const RouteContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;

const Location = styled.p`
  font-size: 13px;
  font-weight: 400;
  margin: 0;
`;

const TripInfoContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.75rem 0;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const InfoGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex: 1;

  @media (max-width: 767px) {
    width: 100%;
    justify-content: space-between;
  }
`;

// const PriceActionContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   justify-content: center;
//   gap: 0.5rem;

//   @media (max-width: 767px) {
//     width: 100%;
//     flex-direction: row;
//     justify-content: space-between;
//     align-items: center;
//     margin-top: 0.5rem;
//   }
// `;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoHeading = styled.p`
  font-size: 13px;
  font-weight: 700;
  margin: 0;
  line-height: 1;
`;

const InfoText = styled.p`
  font-size: 13px;
  font-weight: 300;
  margin: 0;
  color: rgba(91, 89, 89, 1);
`;

const Cost = styled.p`
  font-weight: 800;
  font-size: 1rem;
  line-height: 1;
  margin: 0;

  @media screen and (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const SelectButton = styled.button`
  border: 2px solid black;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f7e700;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    background-color: black;
    color: white;
  }

  &:focus {
    outline: none;
  }
`;

const SeatInfo = styled.p`
  font-size: 13px;
  font-weight: 300;
  margin: 0.25rem 0 0 0;
  text-align: center;
`;

const FacilitiesContainer = styled.div``;

const AccordionText = styled.div`
  font-size: 13px;
  font-weight: 300;
`;

const ComboSection = (props) => {
  const isPageWide = media("(min-width: 768px)");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleUpdate = (data) => {
    if (props.onSelect) {
      props?.onSelect(data);
    } else return;
  };

  const handleOnSelect = () => {
    props.onTaxiSelect?.(props?.index);

    const arrivalTime = calculateArrivalTime(
      props.start_date,
      props.start_time,
      props.data?.duration?.value ?? 0
    );

    handleUpdate({
      ...props.data,
      booking_type: "Taxi",
      arrival_time: arrivalTime,
    });
  };
  let bagCapacity = 0;
  if (props.data?.taxi_category?.bag_capacity) {
    bagCapacity += props.data.taxi_category.bag_capacity;
  }

  const calculateArrivalTime = (startDate, startTime, durationInMinutes) => {
    console.log("Selected Data", startDate, startTime, durationInMinutes);
    const startDateTime = dayjs(`${startDate}T${startTime}`);
    const arrivalDateTime = startDateTime.add(durationInMinutes, "minute");
    return arrivalDateTime.format("YYYY-MM-DDTHH:mm:ss");
  };

  if (!props.data) return null;

  return (
    <Container className="font-lexend">
      <TaxiCard>
        <ImageContainer>
          {/* {props.data?.taxi_category?.image ? (
            <ImageLoader
              is_url
              noLazy
              url={props.data.taxi_category.image}
              width="90%"
              widthmobile="90%"
              height="auto"
            />
          ) : ( */}
          {/* <ImageLoader
              url={"media/icons/bookings/car (2).png"}
              width="90%"
              widthmobile="90%"
              height="auto"
            /> */}
          {/* )} */}
          <PiTaxiLight size={18} />
          {/* <TaxiHeading className="text-center">
            {props.data.taxi_category.type}
          </TaxiHeading>
          <SeatInfo>
            {props.data?.taxi_category?.seating_capacity + "-seater"}
          </SeatInfo> */}
        </ImageContainer>

        <DetailsContainer>
          <TaxiHeading>
            {props.data?.taxi_category?.type ? (
              <>
                {props.data.taxi_category.type}{" "}
                {props.data.taxi_category?.fuel_type && isPageWide
                  ? `(${props.data.taxi_category.fuel_type})`
                  : null}
              </>
            ) : props.selectedBooking.transfer_type ===
              "Intercity round-trip" ? (
              "Round-trip Taxi"
            ) : (
              "One-way Taxi"
            )}
            <div>
              <Cost>
                {"₹" + getIndianPrice(Math.ceil(props.data.price.total)) + "/-"}
              </Cost>
            </div>
          </TaxiHeading>

          {<ModelText>{props.data?.taxi_category?.model_name}</ModelText>}

          {/* <TripInfoContainer> */}
          {/* <ImageLoader
              url="media/icons/bookings/distance.png"
              height="1.5rem"
              width="1.5rem"
              widthmobile="1.5rem"
              dimensions={{ width: 100, height: 100 }}
              margin="0"
              leftalign
              noLazy
            /> */}

          {/* <InfoGroup>
              {props.data?.distance?.text && (
                <InfoItem>
                  <InfoHeading>
                    {props.data.distance.text}
                  </InfoHeading>
                  <InfoText className="font-nunito">Included</InfoText>
                </InfoItem>
              )}

              {props.data?.duration?.text && (
                <InfoItem>
                  <InfoHeading>
                    {props.data.duration.text}
                  </InfoHeading>
                  <InfoText className="font-nunito">Included</InfoText>
                </InfoItem>
              )}
            </InfoGroup> */}
          {/* 
            <PriceActionContainer> */}
          {/* <Cost>{"₹" + getIndianPrice(Math.ceil(props.data.price.total)) + "/-"}</Cost> */}
          {/* {loading ? (
                <PulseLoader size={8} speedMultiplier={0.6} color="#111" />
              ) : (
               props?.isSelected ? (
            <div className="flex items-center gap-1">
              <ImCheckboxChecked className="inline" /> Selected
            </div>
          ) : (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={handleOnSelect}
            >
              <ImCheckboxUnchecked className="inline" /> Select
            </div>
          ))} */}

          {/* </PriceActionContainer> */}
          {/* </TripInfoContainer> */}

          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2">
              <div className="font-bold text-lg p-[0.4rem]">
                {props.data?.taxi_category?.seating_capacity + "-seater"}
              </div>
              <FacilitiesContainer>
                <Accordion
                  borderRadius="0.5rem"
                  open={open}
                  setOpen={setOpen}
                  iconStyle={{ right: "unset", left: "75px" }}
                >
                  <AccordionSummary
                    style={
                      isPageWide
                        ? { padding: "0.5rem 0" }
                        : { padding: "0.5rem 0" }
                    }
                  >
                    Facilities
                  </AccordionSummary>

                  <AccordionDetails
                    style={!isPageWide ? { marginBottom: "1rem" } : {}}
                  >
                    {props.data?.instructions &&
                    props.data?.instructions?.length ? (
                      <AccordionText>
                        {props.data.instructions.map((e, index) => (
                          <div
                            key={index}
                            style={{ marginLeft: isPageWide ? "0.75rem" : "" }}
                          >
                            - {e}
                          </div>
                        ))}
                      </AccordionText>
                    ) : null}

                    {bagCapacity > 0 && (
                      <AccordionText>
                        <div
                          style={{ marginLeft: isPageWide ? "0.75rem" : "" }}
                        >
                          - {bagCapacity} Luggage bags
                        </div>
                      </AccordionText>
                    )}
                  </AccordionDetails>
                </Accordion>
              </FacilitiesContainer>
            </div>
            <div className="p-[0.4rem] flex items-center justify-center">
              {loading ? (
                <PulseLoader size={8} speedMultiplier={0.6} color="#111" />
              ) : props?.isSelected ? (
                <div className="flex items-center gap-1">
                  <ImCheckboxChecked className="inline" />
                </div>
              ) : (
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={handleOnSelect}
                >
                  <ImCheckboxUnchecked className="inline" />
                </div>
              )}
            </div>
          </div>
        </DetailsContainer>
      </TaxiCard>
      <hr />
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    name: state.auth.name,
    phone: state.auth.phone,
    email: state.auth.email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(ComboSection);
