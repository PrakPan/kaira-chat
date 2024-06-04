import Drawer from "../../ui/Drawer";
import { useEffect, useState } from "react";
import transferEdit from "../../../services/itinerary/brief/transferEdit";
import axiosRoundTripEditInstance from "../../../services/itinerary/brief/roudTripEdit";
import { connect } from "react-redux";
import { openNotification } from "../../../store/actions/notification";
import CheckboxFormComponent from "../../FormComponents/CheckboxFormComponent";
import styled from "styled-components";
import Button from "../../../components/ui/button/Index";
import ImageLoader from "../../../components/ImageLoader";
import { IoMdArrowRoundBack } from "react-icons/io";
import { getIndianPrice } from "../../../services/getIndianPrice";
import useMediaQuery from "../../media";
import TransfersIcon from "../../../helper/TransfersIcon";
import { logEvent } from "../../../services/ga/Index";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const ClippathComp = styled.div`
  clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 95% 50%, 100% 0%);
`;

const GetInTouchContainer = styled.div`
  &:hover img {
    filter: invert(100%);
  }
`;

const TRANSFER_TYPES = {
  ONEWAYTRIP: {
    name: "one-way-trip",
    label: "One-way Trip",
  },
  ROUNDTRIP: {
    name: "round-trip",
    label: "Round Trip",
  },
  MULTICITYTRIP: {
    name: "multi-city-trip",
    label: "Multi-city Trip",
  },
};

const TransferEditDrawer = (props) => {
  const {
    ItineraryId,
    showDrawer,
    setShowDrawer,
    selectedTransferHeading,
    origin,
    destination,
    alternateRoutes,
    roundTripSuggestions,
    multiCitySuggestions,
    loadingAlternates,
    alternatesError,
    day_slab_index,
    element_index,
    openNotification,
    fetchData,
    setShowLoginModal,
    check_in,
  } = props;

  const [transfers, setTransfers] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [transferType, setTransferType] = useState(
    TRANSFER_TYPES.ONEWAYTRIP.name
  );
  const isDesktop = useMediaQuery("(min-width:768px)");

  const getSelectedTransfer = () => {
    const route = alternateRoutes?.routes?.find(
      (route) => route.heading === selectedTransferHeading
    );
    return route;
  };

  const filterAlternateRoutes = () => {
    const filteredTransfers = [
      ...alternateRoutes?.routes?.sort(
        (a, b) => a.inconvenience_score - b.inconvenience_score
      ),
    ];
    filteredTransfers[0].recommended = true;

    const newTransfers = filteredTransfers.filter(
      (route, index) => route.heading !== selectedTransferHeading
    );
    const selectedTransfer = getSelectedTransfer();
    if (selectedTransfer)
      newTransfers.unshift({ ...selectedTransfer, isSelected: true });
    return newTransfers;
  };

  useEffect(() => {
    if (!loadingAlternates && !alternatesError) {
      const filterdTransfers = filterAlternateRoutes();
      setTransfers(filterdTransfers);
    }
  }, [loadingAlternates, alternateRoutes]);

  const handleSelect = (routeIndex) => {
    const access_token = localStorage.getItem("access_token");
    if (!props.token) {
      setShowLoginModal(true);
      return;
    }

    setSelectLoading(true);
    const selectedRoute = transfers[routeIndex];
    const data = {
      itinerary_id: ItineraryId,
      route_id: alternateRoutes.id,
      day_slab_index: day_slab_index,
      element_index: element_index,
      route: selectedRoute,
      check_in: check_in,
    };
    transferEdit
      .post("", data, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          fetchData((scroll = false));
          openNotification({
            text: "Your Transfer updated successfully!",
            heading: "Success!",
            type: "success",
          });
        }
        setSelectLoading(false);
        setShowDrawer(false);
      })
      .catch((err) => {
        setSelectLoading(false);
        setShowDrawer(false);
        if (err?.response?.status === 403) {
          props.openNotification({
            text: "You are not allowed to make changes to this itinerary",
            heading: "Error!",
            type: "error",
          });
        } else {
          props.openNotification({
            text: "There seems to be a problem, please try again!",
            heading: "Error!",
            type: "error",
          });
        }
      });

    logEvent({
      action: "Transfer_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: `Select`,
        evemt_value: selectedRoute?.legs[0]?.carrier
          ? selectedRoute?.legs[0]?.carrier
          : selectedRoute?.modes[0],
        event_action: "Transfer Add/Change Drawer",
      },
    });
  };

  const handleRoundTripSelect = (trace_id, cab_id) => {
    console.log(trace_id);
    const access_token = localStorage.getItem("access_token");
    if (!props.token) {
      setShowLoginModal(true);
      return;
    }
    setSelectLoading(true);

    const data = {
      itinerary_id: ItineraryId,
      trace_id,
      cab_id,
    };
    axiosRoundTripEditInstance
      .post("", data, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 201) {
          fetchData((scroll = false));
          openNotification({
            text: "Your Transfer updated successfully!",
            heading: "Success!",
            type: "success",
          });
        }
        setSelectLoading(false);
        setShowDrawer(false);
      })
      .catch((err) => {
        setSelectLoading(false);
        setShowDrawer(false);
        if (err.response.status === 403) {
          props.openNotification({
            text: "You are not allowed to make changes to this itinerary",
            heading: "Error!",
            type: "error",
          });
        } else {
          props.openNotification({
            text: "There seems to be a problem, please try again!",
            heading: "Error!",
            type: "error",
          });
        }
      });

    logEvent({
      action: "Transfer_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: `Select`,
        evemt_value: trace_id,
        event_action: "Transfer Add/Change Drawer",
      },
    });
  };

  const handleTransferType = (e) => {
    setTransferType(e.target.id);
  };

  return (
    <Drawer
      show={showDrawer}
      anchor={"right"}
      backdrop
      style={{ zIndex: 1501 }}
      className="font-lexend"
      onHide={() => setShowDrawer(false)}
      mobileWidth={"100vw"}
      width="50vw"
    >
      <div className="sticky px-2 top-0 bg-white z-[900] flex flex-col gap-4 py-4 pb-1 justify-start items-start mx-auto w-[98%]">
        <div className="flex flex-row gap-3 my-0 justify-start items-center">
          <IoMdArrowRoundBack
            onClick={() => setShowDrawer(false)}
            className="hover-pointer text-3xl font-semibold"
          />
          <div className="text-lg md:text-2xl lg:text-2xl font-semibold">
            {props.addOrEdit === "transferAdd" ? "Adding" : "Changing"} transfer
            from {origin} to {destination}{" "}
          </div>
        </div>
        {loadingAlternates ? (
          <div className="mt-10 w-full flex flex-col gap-3 items-center">
            <div className="w-full flex flex-row items-center gap-3 bg-gray-200 rounded-lg p-2 shadow-sm animate-pulse">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300"></div>
              </div>
              <div className="w-full h-full flex flex-col space-y-6 items-center justify-between">
                <div className="w-full flex flex-row space-x-3 items-start justify-between">
                  <div className="bg-gray-300 w-3/4 h-16 rounded-lg"></div>
                  <div className="bg-gray-300 w-1/5 h-7 rounded-lg"></div>
                </div>
                <div className="w-full flex flex-row space-x-3 items-center justify-between">
                  <div className="bg-gray-300 w-1/5 h-10 rounded-lg"></div>
                  <div className="bg-gray-300 w-1/5 h-10 rounded-lg"></div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-row gap-3 bg-gray-200 rounded-lg p-2 shadow-sm animate-pulse">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300"></div>
              </div>
              <div className="w-full h-full flex flex-col space-y-6 items-center justify-between">
                <div className="w-full flex flex-row space-x-3 items-start justify-between">
                  <div className="bg-gray-300 w-3/4 h-16 rounded-lg"></div>
                  <div className="bg-gray-300 w-1/5 h-7 rounded-lg"></div>
                </div>
                <div className="w-full flex flex-row space-x-3 items-center justify-between">
                  <div className="bg-gray-300 w-1/5 h-10 rounded-lg"></div>
                  <div className="bg-gray-300 w-1/5 h-10 rounded-lg"></div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-row gap-3 bg-gray-200 rounded-lg p-2 shadow-sm animate-pulse">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-300"></div>
              </div>
              <div className="w-full h-full flex flex-col space-y-6 items-center justify-between">
                <div className="w-full flex flex-row space-x-3 items-start justify-between">
                  <div className="bg-gray-300 w-3/4 h-16 rounded-lg"></div>
                  <div className="bg-gray-300 w-1/5 h-7 rounded-lg"></div>
                </div>
                <div className="w-full flex flex-row space-x-3 items-center justify-between">
                  <div className="bg-gray-300 w-1/5 h-10 rounded-lg"></div>
                  <div className="bg-gray-300 w-1/5 h-10 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        ) : alternatesError ? (
          <div className="w-full flex flex-col space-y-5 items-center justify-center">
            <div className="flex items-center justify-center bg-red-500 text-white rounded p-2">
              {alternatesError}
            </div>
            <div className="flex">
              <GetInTouchContainer>
                <Button
                  color="#111"
                  fontWeight="500"
                  fontSize="1rem"
                  borderWidth="2px"
                  width="100%"
                  borderRadius="8px"
                  bgColor="#f8e000"
                  padding="12px"
                  onclick={props._GetInTouch}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <ImageLoader
                      dimensions={{ height: 50, width: 50 }}
                      dimensionsMobile={{ height: 50, width: 50 }}
                      height={"20px"}
                      width={"20px"}
                      leftalign
                      url={"media/icons/login/customer-service-black.png"}
                    />{" "}
                    <span>Get in touch!</span>
                  </div>
                </Button>
              </GetInTouchContainer>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-3">
            <div className="w-full flex flex-row gap-4 px-2 whitespace-nowrap overflow-x-auto hide-scrollbar">
              <RadioButton
                name={TRANSFER_TYPES.ONEWAYTRIP.name}
                label={TRANSFER_TYPES.ONEWAYTRIP.label}
                transferType={transferType}
                handleTransferType={handleTransferType}
              />
              {roundTripSuggestions && (
                <RadioButton
                  name={TRANSFER_TYPES.ROUNDTRIP.name}
                  label={TRANSFER_TYPES.ROUNDTRIP.label}
                  transferType={transferType}
                  handleTransferType={handleTransferType}
                />
              )}
              {multiCitySuggestions && (
                <RadioButton
                  name={TRANSFER_TYPES.MULTICITYTRIP.name}
                  label={TRANSFER_TYPES.MULTICITYTRIP.label}
                  transferType={transferType}
                  handleTransferType={handleTransferType}
                />
              )}
            </div>
            {selectLoading && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="mb-96">
                  <div className="animate-spin loader ease-linear rounded-full border-4 border-t-4 border-t-yellow-500 h-14 w-14"></div>
                </div>
              </div>
            )}
            {transferType === TRANSFER_TYPES.ONEWAYTRIP.name ? (
              <>
                <div className="w-full flex justify-start">
                  {transfers.length < 2
                    ? `${transfers.length} way`
                    : `${transfers.length} ways`}{" "}
                  to travel from {origin} to {destination}
                </div>
                <div className="w-full flex flex-col items-center gap-3">
                  {transfers.map((transfer, index) => {
                    if (isDesktop)
                      return (
                        <RouteContainer
                          key={index}
                          transferIndex={index}
                          transfer={transfer}
                          handleSelect={handleSelect}
                        />
                      );
                    return (
                      <MobileRouteContainer
                        key={index}
                        transferIndex={index}
                        transfer={transfer}
                        handleSelect={handleSelect}
                      />
                    );
                  })}
                </div>
              </>
            ) : transferType === TRANSFER_TYPES.ROUNDTRIP.name ? (
              <RoundTripSuggestion
                handleRoundTripSelect={handleRoundTripSelect}
                roundTripSuggestions={roundTripSuggestions}
              />
            ) : transferType === TRANSFER_TYPES.MULTICITYTRIP.name ? (
              <MultiCityTripSuggestion
                handleRoundTripSelect={handleRoundTripSelect}
                multiCitySuggestions={multiCitySuggestions}
              />
            ) : null}
          </div>
        )}
      </div>
    </Drawer>
  );
};

const mapStateToPros = (state) => {
  return {
    notificationText: state.Notification.text,
    token: state.auth.token,
    ItineraryId: state.ItineraryId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(TransferEditDrawer);

const RouteContainer = (props) => {
  const { transferIndex, transfer, handleSelect } = props;
  const [viewMore, setViewMore] = useState(false);

  const handleViewMore = () => {
    setViewMore((prev) => !prev);
  };

  return (
    <div
      className={`w-full flex flex-col gap-0 items-start rounded-2xl py-3 px-3 pl-2 shadow-sm ${
        transferIndex === 0 && transfer.isSelected ? "border-yellow-300" : ""
      } border-x-2 border-t-2 border-b-4`}
    >
      {transfer.recommended && (
        <ClippathComp className="text-sm font-semibold bg-[#F7E700] text-#090909 pl-2 pr-2 py-1 -ml-4 -mt-4 rounded-tl-2xl">
          Recommended
        </ClippathComp>
      )}
      {transfer.modes && transfer.modes.length > 1 ? (
        viewMore ? (
          <div className="w-full flex flex-col items-center justify-center">
            <MultiModeContainer
              transferIndex={transferIndex}
              transfer={transfer}
              handleSelect={handleSelect}
            />
            <ViewMoreButton
              viewMore={viewMore}
              handleViewMore={handleViewMore}
            />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center">
            <MultiRoute
              transferIndex={transferIndex}
              transfer={transfer}
              handleSelect={handleSelect}
            />
            <ViewMoreButton
              viewMore={viewMore}
              handleViewMore={handleViewMore}
            />
          </div>
        )
      ) : (
        <div className="flex flex-row gap-2 w-full">
          <div
            className={`w-[80px] h-[70px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
          >
            <TransfersIcon
              TransportMode={transfer.modes[0]}
              Instyle={{
                fontSize: transfer.modes[0] === "Bus" ? "2.5rem" : "3rem",
                color: "black",
              }}
              classname={{ width: 80, height: 75 }}
            />
          </div>

          <div className="w-full flex flex-col gap-2 justify-center">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col items-start gap-2">
                <div className="text-lg font-[500] leading-3">
                  {transfer.modes[0]}
                </div>
                <div className="text-sm text-gray-400">
                  {transfer?.legs[0]?.carrier && `${transfer.legs[0].carrier}`}
                  {transfer.meta.Time && ` | ${transfer.meta.Time}`}
                  {transfer.meta.Distance && ` | ${transfer.meta.Distance} Kms`}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <div className="text-[13px] font-[300] leading-3">
                  Estimated cost
                </div>
                <div className="text-[18px] font-[800] leading-3">
                  {getIndianPrice(
                    Math.floor(transfer?.meta?.estimated_cost)
                  ) !== "NaN" && (
                    <span>
                      ₹
                      {parseInt(
                        getIndianPrice(
                          Math.floor(transfer?.meta?.estimated_cost)
                        )
                      ) > 0
                        ? getIndianPrice(
                            Math.floor(transfer?.meta?.estimated_cost)
                          )
                        : " -"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full flex flex-row items-center justify-between">
              <div className="w-full">
                {transfer?.legs[0]?.facilities?.length ? (
                  <div className="text-sm">
                    Facilities:{" "}
                    {transfer?.legs[0]?.facilities?.map((facility, ind) => (
                      <span key={ind}>
                        <span>{facility}</span>
                        {ind < transfer?.legs[0]?.facilities?.length - 1 &&
                          " | "}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div
                onClick={() => handleSelect(transferIndex)}
                className="flex mt-2 flex-row gap-2 items-end justify-end cursor-pointer"
              >
                <CheckboxFormComponent
                  checked={transferIndex === 0 && transfer.isSelected}
                  className="mb-1"
                />
                <label className="text-center cursor-pointer">
                  {transferIndex === 0 && transfer.isSelected
                    ? "Selected"
                    : "Select"}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MultiRoute = (props) => {
  const { transferIndex, transfer, handleSelect } = props;

  return (
    <div className="flex flex-row gap-2 w-full">
      <div
        className={`w-[80px] h-[70px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
      >
        <TransfersIcon
          TransportMode={transfer.modes[0]}
          Instyle={{
            fontSize: transfer.modes[0] === "Bus" ? "2.5rem" : "3rem",
            color: "black",
          }}
          classname={{ width: 80, height: 75 }}
        />
      </div>

      <div className="w-full flex flex-col gap-2 justify-center">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col items-start gap-2">
            <div className="text-lg font-[500] leading-3">
              {transfer.modes.map((mode, index) => {
                return (
                  <span key={index}>
                    {mode}
                    {index < transfer.modes.length - 1 && ", "}
                  </span>
                );
              })}
            </div>
            <div className="text-sm text-gray-400">
              {transfer?.legs[0]?.carrier && `${transfer.legs[0].carrier}`}
              {transfer?.meta?.Time && ` | ${transfer.meta.Time}`}
              {transfer?.meta?.Distance && ` | ${transfer.meta.Distance} Kms`}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className="text-[13px] font-[300] leading-3">
              Estimated cost
            </div>
            <div className="text-[18px] font-[800] leading-3">
              {getIndianPrice(Math.floor(transfer?.meta?.estimated_cost)) !==
                "NaN" && (
                <span>
                  ₹
                  {parseInt(
                    getIndianPrice(Math.floor(transfer?.meta?.estimated_cost))
                  ) > 0
                    ? getIndianPrice(Math.floor(transfer?.meta?.estimated_cost))
                    : " -"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-row items-center justify-between">
          <div className="w-full">
            {transfer?.legs[0]?.facilities?.length ? (
              <div className="text-sm">
                Facilities:{" "}
                {transfer?.legs[0]?.facilities?.map((facility, ind) => (
                  <span key={ind}>
                    <span>{facility}</span>
                    {ind < transfer?.legs[0]?.facilities?.length - 1 && " | "}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div
            onClick={() => handleSelect(transferIndex)}
            className="flex mt-2 flex-row gap-2 items-end justify-end cursor-pointer"
          >
            <CheckboxFormComponent
              checked={transferIndex === 0 && transfer.isSelected}
              className="mb-1"
            />
            <label className="text-center cursor-pointer">
              {transferIndex === 0 && transfer.isSelected
                ? "Selected"
                : "Select"}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileRouteContainer = (props) => {
  const { transferIndex, transfer, handleSelect } = props;

  const [viewMore, setViewMore] = useState(false);

  const handleViewMore = () => {
    setViewMore((prev) => !prev);
  };

  return (
    <div
      className={`w-full flex flex-col gap-3 items-start rounded-2xl py-3 px-3 pl-2 shadow-sm ${
        transferIndex === 0 ? "border-yellow-300" : ""
      } border-x-2 border-t-2 border-b-4`}
    >
      {transfer.recommended && (
        <ClippathComp className="text-sm font-semibold bg-[#F7E700] text-#090909 pl-2 pr-2 py-1 -ml-4 -mt-4 rounded-tl-2xl">
          Recommended
        </ClippathComp>
      )}
      {transfer.modes && transfer.modes.length > 1 ? (
        viewMore ? (
          <div className="w-full flex flex-col items-center justify-center">
            <MobileMultiModeContainer
              transferIndex={transferIndex}
              transfer={transfer}
              handleSelect={handleSelect}
            />
            <ViewMoreButton
              viewMore={viewMore}
              handleViewMore={handleViewMore}
            />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center">
            <MobileMultiRoute
              transferIndex={transferIndex}
              transfer={transfer}
              handleSelect={handleSelect}
            />
            <ViewMoreButton
              viewMore={viewMore}
              handleViewMore={handleViewMore}
            />
          </div>
        )
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row items-center gap-2">
            <div
              className={`w-[50px] h-[50px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
            >
              <TransfersIcon
                TransportMode={transfer.modes[0]}
                Instyle={{
                  fontSize: transfer.modes[0] === "Bus" ? "2rem" : "2.5rem",
                  color: "black",
                }}
                classname={{ width: 50, height: 50 }}
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <div className="text-[16px] font-[600] leading-3">
                {transfer.modes[0]}
              </div>
              <div className="text-sm text-gray-400">
                {transfer?.legs[0]?.carrier && `${transfer.legs[0].carrier}`}
                {transfer?.meta?.Time && ` | ${transfer.meta.Time}`}
                {transfer?.meta?.Distance && ` | ${transfer.meta.Distance} Kms`}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              {transfer?.legs[0]?.facilities?.length ? (
                <div className="text-sm">
                  Facilities:{" "}
                  {transfer?.legs[0]?.facilities?.map((facility, index) => (
                    <span key={index}>
                      <span key={index}>{facility}</span>
                      {index < transfer?.legs[0]?.facilities?.length - 1 &&
                        " | "}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-row items-end justify-between mb-2">
              <div className="flex flex-col gap-2 items-start">
                <div className="text-[13px] font-[300] leading-3">
                  Estimated cost
                </div>
                <div className="text-[18px] font-[800] leading-3">
                  {getIndianPrice(
                    Math.floor(transfer?.meta?.estimated_cost)
                  ) !== "NaN" && (
                    <span>
                      ₹
                      {parseInt(
                        getIndianPrice(
                          Math.floor(transfer?.meta?.estimated_cost)
                        )
                      ) > 0
                        ? getIndianPrice(
                            Math.floor(transfer?.meta?.estimated_cost)
                          )
                        : " -"}
                    </span>
                  )}
                </div>
              </div>
              <div
                onClick={() => handleSelect(transferIndex)}
                className="flex flex-row gap-2 items-end justify-start cursor-pointer"
              >
                <CheckboxFormComponent
                  checked={transferIndex === 0 && transfer.isSelected}
                  className="mb-1"
                />
                <label className="text-center cursor-pointer">
                  {transferIndex === 0 && transfer.isSelected
                    ? "Selected"
                    : "Select"}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MobileMultiRoute = (props) => {
  const { transferIndex, transfer, handleSelect } = props;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row items-center gap-2">
        <div
          className={`w-[50px] h-[50px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
        >
          <TransfersIcon
            TransportMode={transfer.modes[0]}
            Instyle={{
              fontSize: transfer.modes[0] === "Bus" ? "2rem" : "2.5rem",
              color: "black",
            }}
            classname={{ width: 50, height: 50 }}
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="text-[16px] font-[600] leading-3">
            {transfer.modes.map((mode, index) => {
              return (
                <span key={index}>
                  {mode}
                  {index < transfer.modes.length - 1 && ", "}
                </span>
              );
            })}
          </div>
          <div className="text-sm text-gray-400">
            {transfer?.legs[0]?.carrier && `${transfer.legs[0].carrier}`}
            {transfer.meta.Time && ` | ${transfer.meta.Time}`}
            {transfer.meta.Distance && ` | ${transfer.meta.Distance} Kms`}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          {transfer?.legs[0]?.facilities?.length ? (
            <div className="text-sm">
              Facilities:{" "}
              {transfer?.legs[0]?.facilities?.map((facility, index) => (
                <span key={index}>
                  <span key={index}>{facility}</span>
                  {index < transfer?.legs[0]?.facilities?.length - 1 && " | "}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-row items-end justify-between mb-2">
          <div className="flex flex-col gap-2 items-start">
            <div className="text-[13px] font-[300] leading-3">
              Estimated cost
            </div>
            <div className="text-[18px] font-[800] leading-3">
              {getIndianPrice(Math.floor(transfer?.meta?.estimated_cost)) !==
                "NaN" && (
                <span>
                  ₹
                  {parseInt(
                    getIndianPrice(Math.floor(transfer?.meta?.estimated_cost))
                  ) > 0
                    ? getIndianPrice(Math.floor(transfer?.meta?.estimated_cost))
                    : " -"}
                </span>
              )}
            </div>
          </div>
          <div
            onClick={() => handleSelect(transferIndex)}
            className="flex flex-row gap-2 items-end justify-start cursor-pointer"
          >
            <CheckboxFormComponent
              checked={transferIndex === 0 && transfer.isSelected}
              className="mb-1"
            />
            <label className="text-center cursor-pointer">
              {transferIndex === 0 && transfer.isSelected
                ? "Selected"
                : "Select"}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const MultiModeContainer = ({ transferIndex, transfer, handleSelect }) => {
  return (
    <div className="w-full flex flex-col gap-0">
      {transfer.modes.map((mode, index) => (
        <div key={index} className="flex flex-col gap-0 w-full">
          {index === 0 ? (
            <div className="flex flex-row items-center justify-between">
              <div className={`flex flex-row gap-3 items-center justify-start`}>
                <div className="w-[50px] flex items-center justify-center">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow rounded-full"></div>
                  </div>
                </div>

                <div className="text-[16px] md:text-lg lg:text-lg font-semibold">
                  {transfer?.legs[index]?.origin?.shortName}
                </div>
              </div>
              {index === 0 && (
                <div className="flex flex-col gap-2 items-end">
                  <div className="text-[13px] font-[300] leading-3">
                    Estimated cost
                  </div>
                  <div className="text-[18px] font-[800] leading-3">
                    {getIndianPrice(
                      Math.floor(transfer?.meta?.estimated_cost)
                    ) !== "NaN" && (
                      <span>
                        ₹
                        {parseInt(
                          getIndianPrice(
                            Math.floor(transfer?.meta?.estimated_cost)
                          )
                        ) > 0
                          ? getIndianPrice(
                              Math.floor(transfer?.meta?.estimated_cost)
                            )
                          : " -"}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <div className="w-full flex flex-row gap-3 items-center justify-start">
            <div className="w-[55px] flex flex-col gap-1 items-center justify-center">
              <div className="w-[2px] h-3 rounded-full bg-green-100"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-200"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-300"></div>
              <div className="w-[50px] flex items-center justify-center">
                <TransfersIcon
                  TransportMode={transfer?.modes[index]}
                  Instyle={{
                    fontSize:
                      transfer?.modes[index] === "Bus" ? "3rem" : "3.5rem",
                    color: "black",
                  }}
                  classname={{ width: 40, height: 40 }}
                  Multimode
                />
              </div>
              <div className="w-[2px] h-3 rounded-full bg-teal-500"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-600"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-700"></div>
            </div>
            <div className="w-full flex flex-col gap-2 items-center justify-center">
              <div className="w-full flex flex-col items-start justify-start gap-0">
                <div className="text-[16px] md:text-lg lg:text-lg font-medium leading-3">
                  {transfer.modes[index]}
                </div>
                <div className="text-sm text-gray-400">
                  {transfer?.legs[index]?.carrier &&
                    `${transfer.legs[index].carrier}`}
                  {transfer?.meta?.Time && ` | ${transfer.meta.Time}`}
                  {transfer?.meta?.Distance &&
                    ` | ${transfer.meta.Distance} Kms`}
                </div>
              </div>

              <div className="w-full flex flex-row items-center justify-between">
                <div className="w-full">
                  {transfer?.legs[index]?.facilities?.length ? (
                    <div className="text-sm">
                      Facilities:{" "}
                      {transfer?.legs[index]?.facilities?.map(
                        (facility, ind) => (
                          <span key={ind}>
                            <span>{facility}</span>
                            {ind < transfer?.legs[0]?.facilities?.length - 1 &&
                              " | "}
                          </span>
                        )
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className={`flex flex-row gap-3 items-center justify-start`}>
              <div className="w-[50px] flex items-center justify-center">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow rounded-full"></div>
                </div>
              </div>
              <div className="text-[16px] md:text-lg lg:text-lg font-semibold">
                {transfer?.legs[index]?.destination?.shortName}
              </div>
            </div>
            {index === transfer.modes.length - 1 && (
              <div
                onClick={() => handleSelect(transferIndex)}
                className="flex mt-2 flex-row gap-2 items-end justify-end cursor-pointer"
              >
                <CheckboxFormComponent
                  checked={transferIndex === 0 && transfer.isSelected}
                  className="mb-1"
                />
                <label className="text-center cursor-pointer">
                  {transferIndex === 0 && transfer.isSelected
                    ? "Selected"
                    : "Select"}
                </label>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const MobileMultiModeContainer = ({
  transferIndex,
  transfer,
  handleSelect,
}) => {
  return (
    <div className="w-full flex flex-col gap-0">
      {transfer.modes.map((mode, index) => (
        <div key={index} className="flex flex-col gap-0 w-full">
          {index === 0 ? (
            <div className="flex flex-row items-center justify-between">
              <div className={`flex flex-row gap-3 items-center justify-start`}>
                <div className="w-[50px] flex items-center justify-center">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow rounded-full"></div>
                  </div>
                </div>

                <div className="text-[16px] md:text-lg lg:text-lg font-semibold">
                  {transfer?.legs[index]?.origin?.shortName}
                </div>
              </div>
            </div>
          ) : null}

          <div className="w-full flex flex-row gap-3 items-center justify-start">
            <div className="w-[55px] flex flex-col gap-1 items-center justify-center">
              <div className="w-[2px] h-3 rounded-full bg-green-100"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-200"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-300"></div>
              <div className="w-[50px] flex items-center justify-center">
                <TransfersIcon
                  TransportMode={transfer?.modes[index]}
                  Instyle={{
                    fontSize:
                      transfer?.modes[index] === "Bus" ? "2rem" : "2.5rem",
                    color: "black",
                  }}
                  classname={{ width: 40, height: 40 }}
                  Multimode
                />
              </div>
              <div className="w-[2px] h-3 rounded-full bg-teal-500"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-600"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-700"></div>
            </div>
            <div className="w-full flex flex-col gap-2 items-center justify-center">
              <div className="w-full flex flex-col items-start justify-start gap-0">
                <div className="text-[16px] md:text-lg lg:text-lg font-medium leading-3">
                  {transfer.modes[index]}
                </div>
                <div className="text-sm text-gray-400">
                  {transfer?.legs[index]?.carrier &&
                    `${transfer.legs[index].carrier}`}
                  {transfer?.meta?.Time && ` | ${transfer.meta.Time}`}
                  {transfer.meta.Distance && ` | ${transfer.meta.Distance} Kms`}
                </div>
              </div>

              <div className="w-full flex flex-row items-center justify-between">
                <div className="w-full">
                  {transfer?.legs[index]?.facilities?.length ? (
                    <div className="text-sm">
                      Facilities:{" "}
                      {transfer?.legs[index]?.facilities?.map(
                        (facility, ind) => (
                          <span key={ind}>
                            <span>{facility}</span>
                            {ind < transfer?.legs[0]?.facilities?.length - 1 &&
                              " | "}
                          </span>
                        )
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className={`flex flex-row gap-3 items-center justify-start`}>
            <div className="w-[50px] flex items-center justify-center">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow rounded-full"></div>
              </div>
            </div>
            <div className="text-[16px] md:text-lg lg:text-lg font-semibold">
              {transfer?.legs[index]?.destination?.shortName}
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-row items-center justify-between mt-2 py-3">
        <div className="flex flex-col gap-2 items-start">
          <div className="text-[13px] font-[300] leading-3">Estimated cost</div>
          <div className="text-[18px] font-[800] leading-3">
            {getIndianPrice(Math.floor(transfer?.meta?.estimated_cost)) !==
              "NaN" && (
              <span>
                ₹
                {parseInt(
                  getIndianPrice(Math.floor(transfer?.meta?.estimated_cost))
                ) > 0
                  ? getIndianPrice(Math.floor(transfer?.meta?.estimated_cost))
                  : " -"}
              </span>
            )}
          </div>
        </div>
        <div
          onClick={() => handleSelect(transferIndex)}
          className="flex flex-row gap-2 items-end justify-end cursor-pointer"
        >
          <CheckboxFormComponent
            checked={transferIndex === 0 && transfer.isSelected}
            className="mb-1"
          />
          <label className="text-center cursor-pointer">
            {transferIndex === 0 && transfer.isSelected ? "Selected" : "Select"}
          </label>
        </div>
      </div>
    </div>
  );
};

const ViewMoreButton = ({ viewMore, handleViewMore }) => {
  return (
    <button
      onClick={handleViewMore}
      className="text-sm flex flex-row gap-1 items-center justify-center hover:bg-black hover:text-white rounded-lg px-2 py-1"
    >
      {viewMore ? (
        <>
          View Less <IoIosArrowUp />
        </>
      ) : (
        <>
          View More <IoIosArrowDown />
        </>
      )}
    </button>
  );
};

const RadioButton = ({ name, label, transferType, handleTransferType }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <div
        onClick={handleTransferType}
        id={name}
        className={`flex items-center justify-center w-5 h-5 border-2 ${
          transferType === name ? "border-black" : "border-[#636366]"
        } rounded-full cursor-pointer`}
      >
        {transferType === name && (
          <div id={name} className="p-1 w-3 h-3 rounded-full bg-black"></div>
        )}
      </div>
      <label htmlFor={name} className="text-sm font-normal">
        {label}
      </label>
    </div>
  );
};

const RoundTripSuggestion = ({
  roundTripSuggestions,
  handleRoundTripSelect,
}) => {
  const [selectedCab, setSelectedCab] = useState(null);
  const [selectError, setSelectError] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [viewDetails, setViewDetails] = useState([
    ...Array(roundTripSuggestions.length).fill(false),
  ]);
  const isDesktop = useMediaQuery("(min-width:768px)");

  useEffect(() => {
    const routes = [];
    const pricing = [];
    roundTripSuggestions?.routes?.forEach((route) => {
      routes.push(route);
    });
    setRoutes(routes);
    roundTripSuggestions?.data?.cabRate.forEach((route) => {
      pricing.push(route);
    });
    setPricing(pricing);
  }, [roundTripSuggestions]);

  const handleSelectCab = (e) => {
    setSelectError(false);
    setSelectedCab(e.target.id);
  };

  const handleSelect = () => {
    if (selectedCab) {
      handleRoundTripSelect(roundTripSuggestions?.trace_id, +selectedCab);
    } else {
      setSelectError(true);
    }
  };
  return (
    <div
      className={`w-full flex flex-row gap-2 items-start rounded-2xl py-3 px-3 pl-2 shadow-sm border-x-2 border-t-2 border-b-4`}
    >
      {isDesktop && (
        <div
          className={`w-[80px] h-[70px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
        >
          <TransfersIcon
            TransportMode={"Taxi"}
            Instyle={{
              fontSize: "3rem",
              color: "black",
            }}
            classname={{ width: 80, height: 75 }}
          />
        </div>
      )}

      <div className="w-full flex flex-col gap-3">
        <div className="flex flex-row gap-2">
          {!isDesktop && (
            <div
              className={`w-[60px] h-[60px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
            >
              <TransfersIcon
                TransportMode={"Taxi"}
                Instyle={{
                  fontSize: "3rem",
                  color: "black",
                }}
                classname={{ width: 80, height: 75 }}
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <div className="text-[16px] font-medium">
              Intercity Round Trip{" "}
              {isDesktop &&
                `(${routes[0]?.source?.shortName} to ${
                  routes[routes.length - 1]?.destination?.shortName
                })`}
            </div>
            <div className="text-[#7A7A7A] text-[14px] font-normal">
              Distance: {roundTripSuggestions?.data?.quotedDistance} Kms
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-[14px] font-semibold">Routes</div>
          <div className="flex flex-col gap-1">
            {routes.map((route, i) => (
              <div
                key={`route-${i}`}
                className="flex flex-row items-center gap-2"
              >
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="text-[14px] font-normal">
                  {route?.source?.shortName} to {route?.destination?.shortName}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <div className="text-[14px] font-semibold">Available Cabs</div>
            {selectError && (
              <div className="bg-red-500 text-xs md:text-sm lg:text-sm text-white py-1 px-2 rounded-lg text-center animate-popOut">
                Please choose one cab
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            {pricing.map((price, i) => (
              <div
                key={`price-${i}`}
                className="w-full flex flex-row items-start gap-2"
              >
                <div>
                  <div
                    id={price?.cab?.id}
                    onClick={handleSelectCab}
                    className={`w-5 h-5 flex items-center justify-center rounded-full border-2 cursor-pointer ${
                      selectedCab == price?.cab?.id
                        ? "border-black"
                        : "border-[#636366]"
                    } `}
                  >
                    {selectedCab == price?.cab?.id && (
                      <div
                        id={price?.cab?.id}
                        className="w-3 h-3 bg-black rounded-full"
                      ></div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <div className="text-[#636366] text-[14px] font-normal">
                    {price.cab.type}:{" "}
                    <span className="text-black font-bold">
                      ₹{getIndianPrice(Math.floor(price?.fare?.totalAmount))}
                    </span>
                  </div>
                  {(viewDetails[i] || true) && (
                    <div className="text-sm">
                      <span className="font-semibold">Facilities: </span>
                      {price?.cab?.seatingCapacity
                        ? `${price.cab.seatingCapacity} Seating Capacity | `
                        : null}
                      {price?.cab?.bagCapacity
                        ? `${price.cab.bagCapacity} Bag Capacity | `
                        : null}
                      {price?.cab?.bigBagCapaCity
                        ? `${price.cab.bigBagCapaCity} Big Bag Capacity | `
                        : null}
                      {price?.cab?.fuelType
                        ? ` Fuel Type ${price.cab?.fuelType}`
                        : null}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          onClick={handleSelect}
          className="flex mt-2 flex-row gap-2 items-end justify-end cursor-pointer place-self-end"
        >
          <CheckboxFormComponent checked={false} className="mb-1" />
          <label className="text-center cursor-pointer">{"Select"}</label>
        </div>
      </div>
    </div>
  );
};

const MultiCityTripSuggestion = ({
  multiCitySuggestions,
  handleRoundTripSelect,
}) => {
  const [selectedCab, setSelectedCab] = useState(null);
  const [selectError, setSelectError] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [viewDetails, setViewDetails] = useState([
    ...Array(multiCitySuggestions.length).fill(false),
  ]);
  const isDesktop = useMediaQuery("(min-width:768px)");

  useEffect(() => {
    const routes = [];
    const pricing = [];
    multiCitySuggestions?.routes?.forEach((route) => {
      routes.push(route);
    });
    setRoutes(routes);
    multiCitySuggestions?.data?.cabRate.forEach((route) => {
      pricing.push(route);
    });
    setPricing(pricing);
  }, [multiCitySuggestions]);

  const handleSelectCab = (e) => {
    setSelectError(false);
    setSelectedCab(e.target.id);
  };

  const handleSelect = () => {
    if (selectedCab) {
      handleRoundTripSelect(multiCitySuggestions?.trace_id, +selectedCab);
    } else {
      setSelectError(true);
    }
  };

  return (
    <div
      className={`w-full flex flex-row gap-2 items-start rounded-2xl py-3 px-3 pl-2 shadow-sm border-x-2 border-t-2 border-b-4`}
    >
      {isDesktop && (
        <div
          className={`w-[80px] h-[70px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
        >
          <TransfersIcon
            TransportMode={"Taxi"}
            Instyle={{
              fontSize: "3rem",
              color: "black",
            }}
            classname={{ width: 80, height: 75 }}
          />
        </div>
      )}

      <div className="w-full flex flex-col gap-3">
        <div className="flex flex-row gap-2">
          {!isDesktop && (
            <div
              className={`w-[60px] h-[60px] px-2 bg-gray-100 rounded-xl flex items-center justify-center`}
            >
              <TransfersIcon
                TransportMode={"Taxi"}
                Instyle={{
                  fontSize: "3rem",
                  color: "black",
                }}
                classname={{ width: 80, height: 75 }}
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <div className="text-[16px] font-medium">
              Destination Taxi Only {isDesktop && "(Multicity)"}
            </div>
            <div className="text-[#7A7A7A] text-[14px] font-normal">
              Distance: {multiCitySuggestions?.data?.quotedDistance} Kms
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-[14px] font-semibold">Routes</div>
          <div className="flex flex-col gap-1">
            {routes.map((route, i) => (
              <div
                key={`route-${i}`}
                className="flex flex-row items-center gap-2"
              >
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="text-[14px] font-normal">
                  {route?.source?.shortName} to {route?.destination?.shortName}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <div className="text-[14px] font-semibold">Available Cabs</div>
            {selectError && (
              <div className="bg-red-500 text-xs md:text-sm lg:text-sm text-white py-1 px-2 rounded-lg text-center animate-popOut">
                Please choose one cab
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            {pricing.map((price, i) => (
              <div
                key={`price-${i}`}
                className="w-full flex flex-row items-start gap-2"
              >
                <div>
                  <div
                    id={price?.cab?.id}
                    onClick={handleSelectCab}
                    className={`w-5 h-5 flex items-center justify-center rounded-full border-2 cursor-pointer ${
                      selectedCab == price?.cab?.id
                        ? "border-black"
                        : "border-[#636366]"
                    } `}
                  >
                    {selectedCab == price?.cab?.id && (
                      <div
                        id={price?.cab?.id}
                        className="w-3 h-3 bg-black rounded-full"
                      ></div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <div className="text-[#636366] text-[14px] font-normal">
                    {price.cab.type}:{" "}
                    <span className="text-black font-bold">
                      ₹{getIndianPrice(Math.floor(price?.fare?.totalAmount))}
                    </span>
                  </div>
                  {(viewDetails[i] || true) && (
                    <div className="text-sm">
                      <span className="font-semibold">Facilities: </span>
                      {price?.cab?.seatingCapacity
                        ? `${price.cab.seatingCapacity} Seating Capacity | `
                        : null}
                      {price?.cab?.bagCapacity
                        ? `${price.cab.bagCapacity} Bag Capacity | `
                        : null}
                      {price?.cab?.bigBagCapaCity
                        ? `${price.cab.bigBagCapaCity} Big Bag Capacity | `
                        : null}
                      {price?.cab?.fuelType
                        ? ` Fuel Type ${price.cab?.fuelType}`
                        : null}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          onClick={handleSelect}
          className="flex mt-2 flex-row gap-2 items-end justify-end cursor-pointer place-self-end"
        >
          <CheckboxFormComponent checked={selectedCab} className="mb-1" />
          <label className="text-center cursor-pointer">
            {selectedCab ? "Selected" : "Select"}
          </label>
        </div>
      </div>
    </div>
  );
};
