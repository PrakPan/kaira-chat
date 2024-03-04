import { IoMdClose } from "react-icons/io";
import Drawer from "../../ui/Drawer";
import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import { useEffect, useState } from "react";
import transferEdit from "../../../services/itinerary/brief/transferEdit";
import { connect } from "react-redux";
import { openNotification } from "../../../store/actions/notification";
import CheckboxFormComponent from "../../FormComponents/CheckboxFormComponent";
import styled from "styled-components";
import Button from "../../../components/ui/button/Index";
import ImageLoader from "../../../components/ImageLoader";
import { IoMdArrowRoundBack } from "react-icons/io";
import { PiCurrencyInrBold } from "react-icons/pi";
import { getIndianPrice } from "../../../services/getIndianPrice";
import useMediaQuery from "../../media";
import TransfersIcon from "../../../helper/TransfersIcon";

const ClippathComp = styled.div`
  clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 95% 50%, 100% 0%);
`;

const GetInTouchContainer = styled.div`
  &:hover img {
    filter: invert(100%);
  }
`;

const TransferEditDrawer = (props) => {
  const {
    itinerary_id,
    showDrawer,
    setShowDrawer,
    selectedTransferHeading,
    origin,
    destination,
    alternateRoutes,
    loadingAlternates,
    alternatesError,
    day_slab_index,
    element_index,
    openNotification,
    fetchData,
    getPaymentHandler,
    payment,
    setShowLoginModal,
    check_in,
  } = props;

  const [transfers, setTransfers] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
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
    if (selectedTransfer) newTransfers.unshift(selectedTransfer);
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
    const data = {
      itinerary_id: itinerary_id,
      route_id: alternateRoutes.id,
      day_slab_index: day_slab_index,
      element_index: element_index,
      route: transfers[routeIndex],
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
      <div className="sticky px-2 top-0 bg-white z-[900] flex flex-col gap-5 py-4 pb-1 justify-start items-start mx-auto w-[98%]">
        <div className="flex flex-row gap-3 my-0 justify-start items-center">
          <IoMdArrowRoundBack
            onClick={() => setShowDrawer(false)}
            className="hover-pointer text-3xl font-semibold"
          />
          <div className="text-xl md:text-2xl lg:text-2xl font-semibold">
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
                  // loading={loading}
                  padding="12px"
                  onclick={props._GetInTouch}
                  // height='2rem'
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
            <div className="w-full flex justify-start">
              {alternateRoutes.routes.length} ways to travel from {origin} to{" "}
              {destination}
            </div>

            <div className="w-full flex flex-col items-center gap-3">
              {selectLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="mb-96">
                    <div className="animate-spin loader ease-linear rounded-full border-4 border-t-4 border-t-yellow-500 h-14 w-14"></div>
                  </div>
                </div>
              )}

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
  return (
    <div
      className={`w-full flex flex-col gap-0 items-start rounded-2xl py-3 px-3 pl-2 shadow-sm ${
        transferIndex === 0 ? "border-yellow-300" : ""
      } border-x-2 border-t-2 border-b-4`}
    >
      {transfer.recommended && (
        <ClippathComp className="text-sm font-semibold bg-[#F7E700] text-#090909 pl-2 pr-2 py-1 -ml-4 -mt-4 rounded-tl-2xl">
          Recommended
        </ClippathComp>
      )}
      {transfer.modes && transfer.modes.length > 1 ? (
        <MultiModeContainer
          transferIndex={transferIndex}
          transfer={transfer}
          handleSelect={handleSelect}
        />
      ) : (
        <div className="flex flex-row gap-2 w-full">
          <div
            className={`w-[80px] h-[70px] bg-gray-100 rounded-xl flex items-center justify-center`}
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
                  {transfer?.legs[0]?.carrier
                    ? transfer?.legs[0]?.carrier
                    : transfer.modes[0]}
                </div>
                <div className="text-sm text-gray-400">
                  {transfer?.legs[0]?.carrier &&
                    `${transfer.legs[0].carrier} | `}
                  {transfer.meta.Time} | {transfer.meta.Distance} Kms
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <div className="text-[13px] font-[300] leading-3">
                  Estimated cost
                </div>
                <div className="text-[18px] font-[800] leading-3">
                  {/* <PiCurrencyInrBold className="inline" /> */}
                  <span>
                    ₹
                    {getIndianPrice(Math.floor(transfer?.meta?.estimated_cost))}
                  </span>
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
                  checked={transferIndex === 0}
                  className="mb-1"
                />
                <label className="text-center cursor-pointer">
                  {transferIndex === 0 ? "Selected" : "Select"}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MobileRouteContainer = (props) => {
  const { transferIndex, transfer, handleSelect } = props;
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
        <MobileMultiModeContainer
          transferIndex={transferIndex}
          transfer={transfer}
          handleSelect={handleSelect}
        />
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row items-center gap-2">
            <div
              className={`w-[50px] h-[50px] bg-gray-100 rounded-xl flex items-center justify-center`}
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
                {transfer?.legs[0]?.carrier
                  ? transfer?.legs[0]?.carrier
                  : transfer.modes[0]}
              </div>
              <div className="text-sm text-gray-400">
                {transfer?.legs[0]?.carrier && `${transfer.legs[0].carrier} | `}
                {transfer.meta.Time} | {transfer.meta.Distance} Kms
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
                  {/* <PiCurrencyInrBold className="inline" /> */}
                  <span>
                    ₹
                    {getIndianPrice(Math.floor(transfer?.meta?.estimated_cost))}
                  </span>
                </div>
              </div>
              <div
                onClick={() => handleSelect(transferIndex)}
                className="flex flex-row gap-2 items-end justify-start cursor-pointer"
              >
                <CheckboxFormComponent
                  checked={transferIndex === 0}
                  className="mb-1"
                />
                <label className="text-center cursor-pointer">
                  {transferIndex === 0 ? "Selected" : "Select"}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MultiModeContainer = ({ transferIndex, transfer, handleSelect }) => {
  return (
    <div className="w-full flex flex-col gap-0">
      {transfer.modes.map((mode, index) => (
        <div className="flex flex-col gap-0 w-full">
          <div className="flex flex-row items-center justify-between">
            <div className={`flex flex-row gap-3 items-center justify-start`}>
              <div className="w-[50px] flex items-center justify-center">
                <TransfersIcon
                  TransportMode={transfer?.modes[index]}
                  Instyle={{
                    fontSize:
                      transfer?.modes[index] === "Bus" ? "3rem" : "3.5rem",
                    color: "black",
                  }}
                  classname={{ width: 50, height: 50 }}
                />
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
                  {/* <PiCurrencyInrBold className="inline" /> */}
                  <span>
                    ₹
                    {getIndianPrice(Math.floor(transfer?.meta?.estimated_cost))}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="w-full flex flex-row gap-3 items-center justify-start">
            <div className="w-[55px] flex flex-col gap-1 items-center justify-center">
              <div className="w-[2px] h-3 rounded-full bg-green-100"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-200"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-300"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-400"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-500"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-600"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-700"></div>
            </div>
            <div className="w-full flex flex-col gap-2 items-center justify-center">
              <div className="w-full flex flex-col items-start justify-start gap-0">
                <div className="text-[16px] md:text-lg lg:text-lg font-medium leading-3">
                  {transfer?.legs[index]?.carrier
                    ? transfer?.legs[index]?.carrier
                    : transfer.modes[index]}
                </div>
                <div className="text-sm text-gray-400">
                  {transfer?.legs[index]?.carrier &&
                    `${transfer.legs[index].carrier} | `}
                  {transfer.meta.Time} | {transfer.meta.Distance} Kms
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

          {index < transfer.modes.length - 1 && (
            <div
              className={`flex flex-row gap-3 items-center justify-start py-2`}
            >
              <div className="w-[50px] flex flex-col gap-1 items-center justify-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <div className="text-sm text-[#01202B]">Change / Transfer</div>
            </div>
          )}
        </div>
      ))}
      <div className="flex flex-row items-center justify-end py-3">
        <div
          onClick={() => handleSelect(transferIndex)}
          className="flex mt-2 flex-row gap-2 items-end justify-end cursor-pointer"
        >
          <CheckboxFormComponent
            checked={transferIndex === 0}
            className="mb-1"
          />
          <label className="text-center cursor-pointer">
            {transferIndex === 0 ? "Selected" : "Select"}
          </label>
        </div>
      </div>
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
        <div className="flex flex-col gap-0 w-full">
          <div className="flex flex-row items-center">
            <div className={`flex flex-row gap-3 items-center justify-start`}>
              <div className="w-[50px] flex items-center justify-center">
                <TransfersIcon
                  TransportMode={transfer?.modes[index]}
                  Instyle={{
                    fontSize:
                      transfer?.modes[index] === "Bus" ? "3rem" : "3.5rem",
                    color: "black",
                  }}
                  classname={{ width: 50, height: 50 }}
                />
              </div>
              <div className="text-[16px] md:text-lg lg:text-lg font-semibold">
                {transfer?.legs[index]?.origin?.shortName}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-row gap-3 items-center justify-start">
            <div className="w-[55px] flex flex-col gap-1 items-center justify-center">
              <div className="w-[2px] h-3 rounded-full bg-green-100"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-200"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-300"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-400"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-500"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-600"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-700"></div>
            </div>
            <div className="w-full flex flex-col gap-2 items-center justify-center">
              <div className="w-full flex flex-col items-start justify-start gap-0">
                <div className="text-[16px] md:text-lg lg:text-lg font-medium leading-3">
                  {transfer?.legs[index]?.carrier
                    ? transfer?.legs[index]?.carrier
                    : transfer.modes[index]}
                </div>
                <div className="text-sm text-gray-400">
                  {transfer?.legs[index]?.carrier &&
                    `${transfer.legs[index].carrier} | `}
                  {transfer.meta.Time} | {transfer.meta.Distance} Kms
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

          {index < transfer.modes.length - 1 && (
            <div
              className={`flex flex-row gap-3 items-center justify-start py-2`}
            >
              <div className="w-[50px] flex flex-col gap-1 items-center justify-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <div className="text-sm text-[#01202B]">Change / Transfer</div>
            </div>
          )}
        </div>
      ))}
      <div className="flex flex-row items-center justify-between mt-2 py-3">
        <div className="flex flex-col gap-2 items-start">
          <div className="text-[13px] font-[300] leading-3">Estimated cost</div>
          <div className="text-[18px] font-[800] leading-3">
            {/* <PiCurrencyInrBold className="inline" /> */}
            <span>
              ₹{getIndianPrice(Math.floor(transfer?.meta?.estimated_cost))}
            </span>
          </div>
        </div>
        <div
          onClick={() => handleSelect(transferIndex)}
          className="flex flex-row gap-2 items-end justify-end cursor-pointer"
        >
          <CheckboxFormComponent
            checked={transferIndex === 0}
            className="mb-1"
          />
          <label className="text-center cursor-pointer">
            {transferIndex === 0 ? "Selected" : "Select"}
          </label>
        </div>
      </div>
    </div>
  );
};
