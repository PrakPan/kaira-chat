import React, { useState, useRef } from "react";
import styled from "styled-components";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { IoMdClose, IoMdSunny } from "react-icons/io";
import { TbArrowBack } from "react-icons/tb";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdNightsStay } from "react-icons/md";
import media from "../../media";
import Drawer from "../../ui/Drawer";
import Button from "../../ui/button/Index";
import { BsFillSunriseFill, BsSunsetFill } from "react-icons/bs";
import { IoPerson } from "react-icons/io5";
import { RiArrowRightSLine } from "react-icons/ri";

export const Heading = styled.div`
  margin: 0;
  display: flex;
  gap: 0.5rem;
  margin: 1rem;
  @media screen and (min-width: 768px) {
  }
`;

export const Text = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const Container = styled.div`
  margin-bottom: 10px;
`;

const FlexBox = styled.div`
  width: 95%;
  margin-inline: auto;

  @media screen and (min-width: 768px) {
    display: grid;
    gap: 2%;

    grid-template-columns: 1fr 1fr;
  }
`;

const ItemContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  grid-auto-columns: auto;
  gap: 5px;
  grid-row-gap: 5px;
`;

const P = styled.div`
  margin-top: 1rem;
  margin-bottom: 0.3rem;
  font-weight: 600;
  @media screen and (min-width: 768px) {
    margin-bottom: 0.5rem;
    margin-top: 0rem;
    font-weight: 400;
  }
`;

const TextContainer = styled.div`
  font-size: 0.875rem;
  font-weight: 400;
  margin: 0.5rem auto;
  width: 95%;
`;

const Item = styled.div`
  font-size: 14px;
  cursor: pointer;
  padding: 3px 0;
  text-align: center;
  border-radius: 10px;
  background: ${(props) => (props.isSelected ? "#01202b" : "white")};
  border: ${(props) =>
    props.isSelected ? "2px solid #01202b" : " 2px solid #d0d5dd"};
    border-bottom: ${(props) =>
    props.isSelected ? "4px solid #F7E700" : " 2px solid #d0d5dd"};
  color: ${(props) => (props.isSelected ? "white" : "black")};

  &:hover {
    background: #01202bcf;
    border: 2px solid #01202bcf;
    color: white;
  }
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  position: fixed;
  width: 100%;
  bottom: 1.2rem;
`;

const FloatingView = styled.div`
  position: fixed;
  bottom: 75px;
  background: #f7e700;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 81%;
  z-index: 2;
  cursor: pointer;
`;

const SortContainer = styled.div`
  position: absolute;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background: white;
  border-radius: 0.5rem;
  left: 0;
  padding: 0.5rem;
  z-index: 2;
`;

const SortItem = styled.div`
  text-align: center;
  padding: 0.2rem 0.5rem;
  border-radius: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  :hover {
    background: #f7f3f3;
  }
`;

const ItemArr = ["Morning", "Afternoon", "Evening", "Night"];

const sortItems = ["Price", "Duration"];

const Section = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [sortShow, setSortShow] = useState(false);
  const [SelectedSort, setSelectedSort] = useState(props.filtersState.sort_by);
  const [showPax, setShowPax] = useState(false);

  var adult;
  if (props.pax.adults > 1) adult = " Adults";
  else adult = " Adult";
  var child;
  if (props.pax.children > 1) child = " Childs";
  else child = " Child";
  var infant;
  if (props.pax.infants > 1) infant = " Infants";
  else infant = " Infant";

  const _handleFilterChange = (key, value) => {
    const obj = {
      order: "asc",
      non_stop_flights: false,
      departure_time_period: "",
      arrival_time_period: "",
      airline_name: "",
      sort_by: "price",
    };

    if (props.filtersState[key] === value)
      props.setFiltersState((prev) => {
        return { ...prev, [key]: obj[key] };
      });
    else
      props.setFiltersState((prev) => {
        return { ...prev, [key]: value };
      });
  };

  const FiltersSection = (
    <div className="flex flex-col gap-3">
      <FlexBox>
        <div>
          <P>Departure from {props.selectedBooking?.city || props?.mercuryTransfer?.source?.city_name}</P>
          <ItemContainer>
            {ItemArr.map((e) => (
              <Item
                onClick={() => _handleFilterChange("departure_time_period", e)}
                isSelected={props.filtersState.departure_time_period === e}
              >
                <TimeIcon time={e} isSelected={props.filtersState.departure_time_period === e} />
              </Item>
            ))}
          </ItemContainer>
        </div>
        <div>
          <P>Arrival at {props.selectedBooking?.destination_city || props?.mercuryTransfer?.destination?.city_name}</P>
          <ItemContainer>
            {ItemArr.map((e) => (
              <Item
                onClick={() => _handleFilterChange("arrival_time_period", e)}
                isSelected={props.filtersState.arrival_time_period === e}
              >
                <TimeIcon time={e} isSelected={props.filtersState.arrival_time_period === e} />
              </Item>
            ))}
          </ItemContainer>
        </div>
      </FlexBox>

      <div className="flex flex-col gap-3 px-[.5rem] md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex flex-col gap-2">
          {props.filtersState.non_stop_flights ? (
            <div
              onClick={() => {
                _handleFilterChange("non_stop_flights", false);
              }}
              className="cursor-pointer"
            >
              <ImCheckboxChecked style={{ display: "inline" }} /> Non-stop flights only?
            </div>
          ) : (
            <div
              className="cursor-pointer"
              onClick={() => {
                _handleFilterChange("non_stop_flights", true);
              }}
            >
              <ImCheckboxUnchecked style={{ display: "inline" }} /> Non-stop flights only?
            </div>
          )}

          <div className="py-1">Departure Date: <span className="font-bold">{props.selectedBooking?.check_in ? new Date(props.selectedBooking?.check_in).toDateString() :  props?.mercuryTransfer?.start_datetime ? new Date(props?.mercuryTransfer?.start_datetime).toDateString() : new Date().toDateString()}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div onClick={() => setShowPax(true)} className="relative w-fit px-3 py-2 rounded-lg border-2 cursor-pointer hover:border-black transition-all flex flex-row items-center gap-2">
            <IoPerson className="text-2xl" />

            <div>
              <div>Passengers & Class</div>

              {props.pax.adults +
                adult +
                (props.pax.children
                  ? ", " + props.pax.children + child
                  : "") +
                (props.pax.infants
                  ? ", " + props.pax.infants + infant
                  : "") + (", " + props.classType.key)}
            </div>
          </div>

          {showPax && (<Pax setShowPax={setShowPax} pax={props.pax} setPax={props.setPax} classType={props.classType} setClassType={props.setClassType} />)}
        </div>
      </div>
    </div>
  );


  return (
    <Container>
      <Heading className="font-lexend flex flex-col items-start">
        <div className="flex flex-row items-center gap-2">
          <IoMdClose
            className="hover-pointer"
            onClick={props.setHideFlightModal}
            style={{ fontSize: "2rem" }}
          ></IoMdClose>
          <Text>{props.text}</Text>
        </div>

        <div className="group text-blue md:ml-2 flex flex-row items-center cursor-pointer hover:translate-x-1 transition-all">
          <button
            onClick={(e) => {
              props.handleTransferEdit(e);
            }}
            className="focus:outline-none">
            See more ways to travel?
          </button>

          <RiArrowRightSLine className="text-xl group-hover:scale-110 group-hover:translate-x-1 transition-all" />
        </div>
      </Heading>

      {isPageWide ? FiltersSection : <></>}

      <TextContainer>
        Showing {props.flightCount} {props.text} {isPageWide ? "|" : <br />}{" "}
        Sort by:{" "}
        <div
          style={{
            display: "inline",
            position: "relative",
            cursor: "pointer",
          }}
          onClick={() => {
            setSortShow(!sortShow);
          }}
        >
          <b>
            {SelectedSort}
            {sortShow ? (
              <FiChevronUp
                style={{
                  display: "inline",
                  fontWeight: 900,
                  fontSize: "1.2rem",
                }}
              />
            ) : (
              <FiChevronDown
                style={{
                  display: "inline",
                  fontWeight: 900,
                  fontSize: "1.2rem",
                }}
              />
            )}
          </b>
          {sortShow ? (
            <SortContainer>
              {sortItems.map((e, i) => (
                <SortItem
                  key={i}
                  onClick={() => {
                    setSelectedSort(e);
                    _handleFilterChange("sort_by", e.toLowerCase());
                  }}
                  selected={e === SelectedSort}
                >
                  {e}
                </SortItem>
              ))}
            </SortContainer>
          ) : (
            <></>
          )}
        </div>
      </TextContainer>

      {!isPageWide && (
        <Drawer
          anchor={"right"}
          backdrop
          style={{ zIndex: 1502 }}
          className="font-lexend"
          show={props.showFilter}
          onHide={() => props.setShowFilter(false)}
          mobileWidth={"100%"}
          width={"50%"}
        >
          <Container>
            <Heading className="font-lexend">
              <IoMdClose
                className="hover-pointer"
                onClick={() => props.setShowFilter(false)}
                style={{ fontSize: "2rem" }}
              ></IoMdClose>
              <Text>Filter</Text>
            </Heading>
            {FiltersSection}

            <ButtonContainer>
              <Button
                onclick={() => {
                  props.setFiltersState({
                    order: "asc",
                    non_stop_flights: false,
                    departure_time_period: "",
                    arrival_time_period: "",
                    airline_name: "",
                  });
                  props.setShowFilter(false);
                }}
                padding="0.7rem 3rem"
                borderRadius="0.5rem"
                fontWeight="600"
              >
                Cancel
              </Button>

              <Button
                onclick={() => {
                  props._FetchFlightsHandler();
                  props.setShowFilter(false);
                }}
                bgColor={"#F7E700"}
                padding="0.7rem 3rem"
                borderRadius="0.5rem"
                fontWeight="600"
              >
                Apply
              </Button>
            </ButtonContainer>
          </Container>
          {!isPageWide && (
            <FloatingView>
              <TbArrowBack
                style={{ height: "28px", width: "28px" }}
                cursor={"pointer"}
                onClick={() => props.setShowFilter(false)}
              />
            </FloatingView>
          )}
        </Drawer>
      )}
    </Container>
  );
};

export default Section;

const Pax = ({ setShowPax, pax, setPax, classType, setClassType }) => {
  const ref = useRef(null);
  const [adults, setAdults] = useState(pax.adults ? pax.adults : 1);
  const [children, setChildren] = useState(pax.children ? pax.children : 0);
  const [infants, setInfants] = useState(pax.infants ? pax.infants : 0);
  const [cabinClass, setCabinClass] = useState(classType);

  const handleMinus = (type) => {
    switch (type) {
      case "adult":
        setAdults(prev => {
          if (prev > 1) {
            return prev - 1;
          }
          return prev;
        })
        break;
      case "children":
        setChildren(prev => {
          if (prev > 0) {
            return prev - 1;
          }
          return prev;
        })
        break;
      case "infants":
        setInfants(prev => {
          if (prev > 0) {
            return prev - 1;
          }
          return prev;
        })
        break;
      default:
        break;
    }
  }

  const handlePlus = (type) => {
    switch (type) {
      case 'adult':
        setAdults(prev => prev + 1);
        break;
      case 'children':
        setChildren(prev => prev + 1);
        break;
      case 'infants':
        setInfants(prev => prev + 1);
        break;
      default:
        break;
    }
  }

  const handleClose = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setShowPax(false);
    }
  }

  const handleDone = () => {
    setPax({
      adults,
      children,
      infants
    });

    setClassType(cabinClass);

    setShowPax(false);
  }

  return (
    <div onClick={handleClose} className="fixed inset-0 z-50">
      <div ref={ref} className="absolute top-[270px] md:top-[240px] left-2 right-2 md:right-5 md:left-auto bg-neutral-100 shadow-2xl drop-shadow-3xl p-3 rounded-lg space-y-5 text-sm">
        <div className="flex flex-col gap-1">
          <div>Adults (12y +)</div>
          <div className="flex flex-row items-center gap-2">
            <FaMinus onClick={() => handleMinus('adult')} className="cursor-pointer" />
            <div className="bg-white px-2 py-1 rounded-md">{adults}</div>
            <FaPlus onClick={() => handlePlus('adult')} className="cursor-pointer" />
          </div>
        </div>

        <div className="flex flex-row gap-5">
          <div className="flex flex-col gap-1">
            <div>Children (2y - 12y)</div>
            <div className="flex flex-row items-center gap-2">
              <FaMinus onClick={() => handleMinus('children')} className="cursor-pointer" />
              <div className="bg-white px-2 py-1 rounded-md">{children}</div>
              <FaPlus onClick={() => handlePlus('children')} className="cursor-pointer" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div>Infants (below 2y)</div>
            <div className="flex flex-row items-center gap-2">
              <FaMinus onClick={() => handleMinus('infants')} className="cursor-pointer" />
              <div className="bg-white px-2 py-1 rounded-md">{infants}</div>
              <FaPlus onClick={() => handlePlus('infants')} className="cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div>Choose Travel Class</div>
          <div className="w-fit flex flex-col md:flex-row border-2 border-gray-400 rounded-lg">
            <div
              onClick={() => setCabinClass({ key: 'Economy', value: 2 })}
              style={{ backgroundColor: cabinClass.value === 2 ? "#F8E000" : "" }}
              className="px-3 py-2 rounded-lg cursor-pointer hover:bg-[#F8E000]"
            >
              Economy
            </div>

            <div
              onClick={() => setCabinClass({ key: 'Premium Economy', value: 3 })}
              style={{ backgroundColor: cabinClass.value === 3 ? "#F8E000" : "" }}
              className="px-3 py-2 rounded-lg cursor-pointer hover:bg-[#F8E000]"
            >
              Premium Economy
            </div>

            <div
              onClick={() => setCabinClass({ key: 'Business', value: 4 })}
              style={{ backgroundColor: cabinClass.value === 4 ? "#F8E000" : "" }}
              className="px-3 py-2 rounded-lg cursor-pointer hover:bg-[#F8E000]"
            >
              Business
            </div>

            <div
              onClick={() => setCabinClass({ key: 'Premium Business', value: 5 })}
              style={{ backgroundColor: cabinClass.value === 5 ? "#F8E000" : "" }}
              className="px-3 py-2 rounded-lg cursor-pointer hover:bg-[#F8E000]"
            >
              Premium Business
            </div>

            <div
              onClick={() => setCabinClass({ key: 'First Class', value: 6 })}
              style={{ backgroundColor: cabinClass.value === 6 ? "#F8E000" : "" }}
              className="px-3 py-2 rounded-lg cursor-pointer hover:bg-[#F8E000]"
            >
              First Class
            </div>
          </div>
        </div>

        <div className="border-t-2 border-t-white pt-2">
          <button onClick={handleDone} className="bg-[#F8E000] py-2 px-4 rounded-lg border-2 transition-all border-black hover:bg-black hover:text-white">Done</button>
        </div>
      </div>
    </div>
  )
}

const TimeIcon = ({ time, isSelected }) => {
  switch (time) {
    case 'Morning':
      return (
        <div style={{ color: isSelected ? "#F7E700" : "" }} className="flex flex-col items-center">
          <BsFillSunriseFill className="text-lg md:text-2xl" />
          <div className="text-xs md:text-sm">Before 6 AM</div>
        </div>
      )
    case 'Afternoon':
      return (
        <div style={{ color: isSelected ? "#F7E700" : "" }} className="flex flex-col items-center">
          <IoMdSunny className="text-lg md:text-2xl" />
          <div className="text-xs md:text-sm">6 AM - 12 PM</div>
        </div>
      )
    case 'Evening':
      return (
        <div style={{ color: isSelected ? "#F7E700" : "" }} className="flex flex-col items-center">
          <BsSunsetFill className="text-lg md:text-2xl" />
          <div className="text-xs md:text-sm">12 PM - 6 PM</div>
        </div>
      )
    case 'Night':
      return (
        <div style={{ color: isSelected ? "#F7E700" : "" }} className="flex flex-col items-center">
          <MdNightsStay className="text-lg md:text-2xl" />
          <div className="text-xs md:text-sm">After 6 PM</div>
        </div>
      )
    default:
      break;
  }


}
