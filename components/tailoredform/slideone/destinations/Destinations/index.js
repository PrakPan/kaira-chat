import React, { useState } from "react";
import styled from "styled-components";
import { MdOutlineLocationOn } from "react-icons/md";
import SearchInputStarting from "../searchstarting/Input";
import SearchInput from "../search/Index";
import { BiTargetLock } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { StyledContainer } from "../../../../styled-components/TailoredForm";
import Image from "next/image";

const Container = styled.div`
  margin-bottom: 0.25rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.55rem 0.35rem;
  background-color: white;
  position: relative;
  @media screen and (min-width: 768px) {
    padding: 0.55rem 0.55rem;
  }
`;

const RightContainer = styled.div`
  line-height: 1;
  font-size: 0.85rem;
  color: #1360d3;
`;

const EndDestination = (props) => {
  const [searchFinalized, setSearchFinalized] = useState(false);
  const [focusLocation, setFocusLocation] = useState(false);
  const [focusSearch, setFocusSearch] = useState(null);
  const [showDestination, setShowDestination] = useState(true);
  console.log("props in end destinations is: ",props?.selectedCity?.name)
  const _handleShowSearchStarting = () => {
    props.setShowSearchStarting(true);
  };

  const _handleFocusStarting = () => {
    setFocusLocation(true);
    props.setShowSearchStarting(true);
    props.setShowCities(false);
  };

  const _handleFocusSearch = () => {
    setFocusSearch(true);
  };

  return (
    <StyledContainer
      onClick={
        props.selectlocation
          ? props.showCities
            ? () => props.setShowCities(false)
            : () => _handleShowSearchStarting()
          : () => {
            setShowDestination(false);
            _handleFocusSearch();
          }
      }
      className="font-lexend hover-pointer"
      style={{
        borderRadius: "8px",
        border:
          !focusLocation && !focusSearch
            ? "1px solid rgba(208, 213, 221, 1)"
            : "1px solid black",
      }}
    >
      <div
        className="hover-pointer text-[0.85rem] flex flex-row gap-[10px] items-center  w-full"
        selectlocation={props.selectlocation}
      >
        {props.selectedCity?.name ? (
          <>
            <Image src={"https://d31aoa0ehgvjdi.cloudfront.net/" + props?.selectedCity?.image} width={32} height={28} className="rounded-[6px] h-[28px] w-[32px]" />
          </>
        ) : (
          <MdOutlineLocationOn style={{ lineHeight: "1", fontSize: "1.25rem" }} />
        )}

        {props.selectlocation ? (
          !props.showSearchStarting ? (
            !props.startingLocation ? (
              <div className="w-[90%] flex flex-row gap-2 justify-between">
                <div className="truncate">Delhi, IN</div>
                <span
                  style={{
                    opacity: "0.3",
                  }}
                >
                  Departing from
                </span>
              </div>
            ) : (
              <div className="w-[90%] flex flex-row gap-2 justify-between">
                <div className="truncate">{props.startingLocation.name}</div>
                <span
                  style={{
                    opacity: "0.3",
                  }}
                >
                  Departing
                </span>
              </div>
            )
          ) : (
            <SearchInputStarting
              startingLocation={props.startingLocation}
              setStartingLocation={props.setStartingLocation}
              onfocus={_handleFocusStarting}
              onblur={() => {
                setFocusLocation(false);
              }}
              _handleShowSearchStarting={_handleShowSearchStarting}
              setShowSearchStarting={props.setShowSearchStarting}
              showSearchStarting={props.showSearchStarting}
            ></SearchInputStarting>
          )
        ) : props.destination && showDestination ? (
          <div className="w-[90%] flex flex-row gap-2 justify-between">
            <div className="truncate">{props.destination}</div>
            {!props.setDeletedId && (
              <span
                style={{
                  opacity: "0.3",
                }}
              >
                Destination
              </span>
            )}
          </div>
        ) : (
            <SearchInput
              autofocus={props.autofocus}
              _updateDestinationHandler={props._updateDestinationHandler}
              CITIES={props.CITIES}
              setShowDestination={setShowDestination}
              showDestination={showDestination}
              destination={props.destination}
              setDestination={props.setDestination}
              inbox_id={props.inbox_id}
              setSearchFinalized={setSearchFinalized}
              searchFinalized={searchFinalized}
              onfocus={_handleFocusSearch}
              onblur={() => {
                setFocusSearch(false);
              }}
              setFocusSearch={setFocusSearch}
              setSelectedCities={props.setSelectedCities}
              selectedCities={props.selectedCities}
              setValueStart={props.setValueStart}
              setValueEnd={props.setValueEnd}
              eventDates={props.eventDates}
              updatedData={props.updatedData}
              tailoredFormModal={props.tailoredFormModal}
            ></SearchInput>
        )}
      </div>

      {!props.selectlocation ? (
        <RightContainer className="hover-pointer">
          {props.setDeletedId ? (
            <Image
            src="/close.svg"
            width={18}
            height={18}
              onClick={() => {
                props.setDeletedId(props.inbox_id);
              }}
              className="hover-pointer"
              style={{ fontSize: "1rem", marginLeft: "2px", color: "black" }}
            />
          ) : null}
        </RightContainer>
      ) : (
        <RightContainer className="hover-pointer"></RightContainer>
      )}
    </StyledContainer>
  );
};

export default EndDestination;