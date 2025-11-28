import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import SearchInputStarting from "../searchstarting/Input";
import SearchInput from "../search/Index";
import { BiTargetLock } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { StyledContainer } from "../../../../styled-components/TailoredForm";
import Image from "next/image";
import { changeUserLocation } from "../../../../../store/actions/userLocation";


const RightContainer = styled.div`
  line-height: 1;
  font-size: 0.85rem;
  color: #1360d3;
`;

const SelectedDestination = (props) => {
  const [searchFinalized, setSearchFinalized] = useState(false);
  const [focusLocation, setFocusLocation] = useState(false);
  const [focusSearch, setFocusSearch] = useState(null);
  const [showDestination, setShowDestination] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  
  const [userLocation, setUserLocation] = useState(null);

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

  // Helper function to validate location object
  const isValidLocation = (location) => {
    return (
      location &&
      (location.text || location.city) &&
      location.country
    );
  };

  useEffect(() => {
  const checkCookie = () => {
    const cookieValue = Cookies.get("userLocation");
    if (cookieValue) {
      try {
        const parsed = JSON.parse(cookieValue);
        setUserLocation(parsed);
      } catch (e) {
        console.error("Error parsing cookie:", e);
        setUserLocation(null);
      }
    } else {
      setUserLocation(null);
    }
  };


  checkCookie();

  const interval = setInterval(checkCookie, 500);

  return () => clearInterval(interval);
}, []);

  // Watch for userLocation changes from Redux
  useEffect(() => {
    if (userLocation && isValidLocation(userLocation)) {
      // Location is available, stop loading
      setLoading(false);
      
      // Auto-populate starting location if not already set
      if (!props.startingLocation) {
        props.setStartingLocation({
          name: userLocation.text || userLocation.city,
          place_id: userLocation.place_id,
          lat: userLocation.lat,
          long: userLocation.long,
          country: userLocation.country,
          currency: userLocation.currency,
          country_code: userLocation.country_code,
        });
      }
    } else if (!userLocation) {
      
      setLoading(true);
    }
  }, [userLocation]); 

  const handleLocationChange = (newLocation) => {
    props.setStartingLocation(newLocation);
    
    if (newLocation && newLocation.currency) {
      const updatedLocation = {
        text: newLocation.name,
        city: newLocation.name,
        country: newLocation.country,
        country_code: newLocation.country_code,
        currency: newLocation.currency,
        place_id: newLocation.place_id,
        lat: newLocation.lat,
        long: newLocation.long,
      };
      
      
      Cookies.set('userLocation', JSON.stringify(updatedLocation), { expires: 1 });
      

      dispatch(changeUserLocation({ location: updatedLocation }));
    }
  };

  const getDisplayLocation = () => {
    if (props.startingLocation) {
      return props.startingLocation.name;
    }
    if (userLocation) {
      return userLocation.text || userLocation.city || "Delhi, IN";
    }
    return "Delhi, IN";
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
      className="hover-pointer bg-text-white"  
      style={{
        borderRadius: "8px",
        border:
          !focusLocation && !focusSearch
            ? "1px solid rgba(208, 213, 221, 1)"
            : "1px solid black",
      }}
    >
      <div
        className="hover-pointer text-[0.85rem] flex flex-row items-center gap-[14px] w-full"
        selectlocation={props.selectlocation}
      >
        {props.selectedCity?.name ? (
          <Image 
            src={"https://d31aoa0ehgvjdi.cloudfront.net/" + props?.selectedCity?.image} 
            width={32} 
            height={28} 
            className="rounded-[6px] h-[28px] w-[32px]" 
          />   
        ) : (
          <BiTargetLock
            height={26}
            width={26}
            className="ml-[4px] h-[26px] w-[26px]"
          />
        )}

        {props.selectlocation ? (
          !props.showSearchStarting ? (
            loading ? (
              <div className="flex flex-row gap-2 items-center justify-center">
                {/* <svg 
                  className="animate-spin h-4 w-4 text-gray-600" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg> */}
                <p className="truncate Body2M_14 mb-0">Getting your location...</p>
              </div>
            ) : (
              <div className="w-[90%] flex flex-row gap-2 justify-between">
                <div className="truncate Body2M_14">{getDisplayLocation()}</div>
              </div>
            )
          ) : (
            <SearchInputStarting
              startingLocation={props.startingLocation}
              setStartingLocation={handleLocationChange}
              onfocus={_handleFocusStarting}
              onblur={() => {
                setFocusLocation(false);
              }}
              _handleShowSearchStarting={_handleShowSearchStarting}
              setShowSearchStarting={props.setShowSearchStarting}
              showSearchStarting={props.showSearchStarting}
            />
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
            setValueStart={props.setValueStart}
            setValueEnd={props.setValueEnd}
            eventDates={props.eventDates}
            updatedData={props.updatedData}
            tailoredFormModal={props.tailoredFormModal}
          />
        )}
      </div>

      <RightContainer className="hover-pointer">
        <Image
          src="/close.svg"
          width={18}
          height={18}
          onClick={() => {
            props.setStartingLocation(null);
          }}
          className="hover-pointer"
          style={{ fontSize: "1rem", marginLeft: "2px", color: "black" }}
        />
      </RightContainer>
    </StyledContainer>
  );
};

export default SelectedDestination;