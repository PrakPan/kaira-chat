import React from "react";
import { IoMdClose } from "react-icons/io";
import styled from "styled-components";
import DropDown from "../../ui/DropDown";
import { useState } from "react";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import media from "../../media";
import { TbArrowBack } from "react-icons/tb";
import Drawer from "../../ui/Drawer";
import Button from "../../ui/button/Index";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const Heading = styled.div`
  margin: 0;
  display: flex;
  gap: 0.5rem;
  margin: 1rem;
  @media screen and (min-width: 768px) {
  }
`;

const Text = styled.div`
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

const DropDownContainer = styled.div`
  display: flex;
  gap: 2%;
  width: 95%;
  align-items: center;
  margin-inline: auto;
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
    <div>
      <FlexBox>
        <div>
          <P>Departure in</P>
          <ItemContainer>
            {ItemArr.map((e) => (
              <Item
                onClick={() => _handleFilterChange("departure_time_period", e)}
                isSelected={props.filtersState.departure_time_period === e}
              >
                {e}
              </Item>
            ))}
          </ItemContainer>
        </div>
        <div>
          <P>Reach by</P>
          <ItemContainer>
            {ItemArr.map((e) => (
              <Item
                onClick={() => _handleFilterChange("arrival_time_period", e)}
                isSelected={props.filtersState.arrival_time_period === e}
              >
                {e}
              </Item>
            ))}
          </ItemContainer>
        </div>
      </FlexBox>

      <P style={{ margin: "0.5rem auto 0.5rem auto", width: "95%" }}>Airline</P>

      <DropDownContainer>
        <div style={{ width: "15rem" }}>
          <DropDown
            onChange={(e) => {
              if (e.target.value !== "All")
                _handleFilterChange("airline_name", e.target.value);
              else _handleFilterChange("airline_name", "");
            }}
            height="35px"
            label="Select"
            labelStyle={{ paddingLeft: "20px" }}
            noFloatingabel
          >
            {props.airlineNames.map((e, i) => (
              <option
                style={{ borderBottom: "1px solid #e6e6e6" }}
                key={i}
                value={e}
              >
                {e}
              </option>
            ))}
          </DropDown>
        </div>

        {props.filtersState.non_stop_flights ? (
          <div
            onClick={() => {
              _handleFilterChange("non_stop_flights", false);
            }}
          >
            <ImCheckboxChecked style={{ display: "inline" }} /> Nonstop
          </div>
        ) : (
          <div
            onClick={() => {
              _handleFilterChange("non_stop_flights", true);
            }}
          >
            <ImCheckboxUnchecked style={{ display: "inline" }} /> Nonstop
          </div>
        )}
      </DropDownContainer>
    </div>
  );

  return (
    <Container>
      <Heading className="font-lexend">
        <IoMdClose
          className="hover-pointer"
          onClick={props.setHideFlightModal}
          style={{ fontSize: "2rem" }}
        ></IoMdClose>
        <Text>{props.text}</Text>
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
