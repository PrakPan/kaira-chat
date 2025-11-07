import React, { useState } from "react";
import styled from "styled-components";
import { MdOutlineLocationOn } from "react-icons/md";
import SearchInputStarting from "../searchstarting/Input";
import SearchInput from "../search/Index";
import { StyledContainer } from "../../../../styled-components/TailoredForm";
import Image from "next/image";
import { useSelector } from "react-redux";

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
  const hotLocations = useSelector((state) => state.HotLocationSearch);

  console.log(hotLocations,"hot locations")

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
      className=" hover-pointer bg-text-white"
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
            {props?.selectedCity?.name && <Image src={"https://d31aoa0ehgvjdi.cloudfront.net/" + props?.selectedCity?.image} width={32} height={28} className="rounded-[6px] h-[28px] w-[32px]" />}  
          </>
        ) : (
          <MdOutlineLocationOn className="h-[26px] w-[32px]" />
        )}

        {props.selectlocation ? (
          !props.showSearchStarting ? (
            !props.startingLocation ? (
              <div className="w-[90%] flex flex-row gap-2 justify-between">
                <div className="truncate Body2M_14">Delhi, IN</div>
                
              </div>
            ) : (
              <div className="w-[90%] flex flex-row gap-2 justify-between">
                <div className="truncate Body2M_14">{props.startingLocation.name}</div>
                
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
            <div className="truncate Body2M_14">{props.destination}</div>
            
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
              selectedCities={props.selectedCities}
              setValueStart={props.setValueStart}
              setValueEnd={props.setValueEnd}
              eventDates={props.eventDates}
              updatedData={props.updatedData}
              tailoredFormModal={props.tailoredFormModal}
              hotlocations={hotLocations}
            ></SearchInput>
        )}
      </div>

      {!props.selectlocation ? (
        <RightContainer className="hover-pointer">
            {props.setDeletedId && <Image
            src="/close.svg"
            width={18}
            height={18}
              onClick={() => {
                (props.index === 0 && props.size ==1)? props._updateDestinationHandler(
                  null,
                  props.inbox_id,
                  null
                ) : props.setDeletedId(props.inbox_id);
              }}
              className="hover-pointer"
              style={{ fontSize: "1rem", marginLeft: "2px", color: "black" }}
            />}
        </RightContainer>
      ) : (
        <RightContainer className="hover-pointer"></RightContainer>
      )}
    </StyledContainer>
  );
};

export default EndDestination;