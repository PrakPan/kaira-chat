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
import { connect, useSelector } from "react-redux";
import { openNotification } from "../../../../../store/actions/notification";
import dayjs from "dayjs";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { FaCar } from "react-icons/fa";
import { PiTaxiLight } from "react-icons/pi";
import { currencySymbols } from "../../../../../data/currencySymbols";


const Container = styled.div`
`;

const TaxiCard = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 1rem;
`;


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







const FacilitiesContainer = styled.div``;

const AccordionText = styled.div`
  font-size: 13px;
  font-weight: 300;
`;

const ComboSection = (props) => {
  const isPageWide = media("(min-width: 768px)");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const currency = useSelector(state=>state.currency);

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
    const startDateTime = dayjs(`${startDate}T${startTime}`);
    const arrivalDateTime = startDateTime.add(durationInMinutes, "minute");
    return arrivalDateTime.format("YYYY-MM-DDTHH:mm:ss");
  };

  if (!props.data) return null;

  return (
    <Container className="rounded-3xl border-sm border-solid border-text-disabled p-md  hover:bg-text-smoothwhite relative mt-md">
      <TaxiCard>
        {/* <ImageContainer> */}
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
        {/* <PiTaxiLight size={18} /> */}
        {/* <TaxiHeading className="text-center">
            {props.data.taxi_category.type}
          </TaxiHeading>
          <SeatInfo>
            {props.data?.taxi_category?.seating_capacity + "-seater"}
          </SeatInfo> */}
        {/* </ImageContainer> */}

        <DetailsContainer>
          <div className="flex justify-between max-ph:flex-col">
            <div>
              <div className="flex justify-between w-100">
                <span className="text-md font-600 leading-xl ">
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
                </span>
              </div>

              {<div className="text-sm font-400 leading-lg-md text-text-spacegrey">{props.data?.taxi_category?.model_name}</div>}

              <div className="flex flex-row justify-between">
                <div className="flex flex-col ">
                  <div className="font-600 text-md-lg leading-xl-sm">
                    {props.data?.taxi_category?.seating_capacity + "-seater"}
                  </div>
                  <FacilitiesContainer>
                    <Accordion
                      borderRadius="0.5rem"
                      open={open}
                      setOpen={setOpen}
                      iconStyle={{ right: "unset", left: "75px" }}
                    >
                      <AccordionSummary className="text-blue whitespace-nowrap"
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
                              <div className="text-sm font-400 leading-lg-md text-text-spacegrey"
                                key={index}

                              >
                                - {e}
                              </div>
                            ))}
                          </AccordionText>
                        ) : null}

                        {bagCapacity > 0 && (
                          <AccordionText>
                            <div className="text-sm font-400 leading-lg-md text-text-spacegrey"
                            >
                              - {bagCapacity} Luggage bags
                            </div>
                          </AccordionText>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </FacilitiesContainer>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full items-end  max-ph:flex-row">
              <div>
                <span className="text-lg font-700 2xl-md">
                  {`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}` + getIndianPrice(Math.ceil(props.data.price.total))}
                </span>
              </div>
              <div className="flex items-end justify-center">
                {loading ? (
                  <PulseLoader size={8} speedMultiplier={0.6} color="#111" />
                ) : props?.isSelected ? (
                  <div className="flex items-center gap-1">
                    {/* <ImCheckboxChecked className="inline" /> */}
                    <button className="ttw-btn-secondary-fill max-ph:w-full">Selected</button>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={handleOnSelect}
                  >
                    <button className="ttw-btn-fill-yellow max-ph:w-full">Add to Itinerary</button>
                    {/* <ImCheckboxUnchecked className="inline" /> */}
                  </div>
                )}
              </div>
            </div>
          </div>

        </DetailsContainer>
      </TaxiCard>
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
