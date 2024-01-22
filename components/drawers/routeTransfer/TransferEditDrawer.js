import { IoMdClose } from "react-icons/io";
import Drawer from "../../ui/Drawer";
import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import { useEffect, useState } from "react";
import transferEdit from "../../../services/itinerary/brief/transferEdit";
import { connect } from "react-redux";
import { openNotification } from "../../../store/actions/notification";
import CheckboxFormComponent from "../../FormComponents/CheckboxFormComponent";

const TransferEditDraser = (props) => {
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
  } = props;

  const [transfers, setTransfers] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);

  const getSelectedTransfer = () => {
    const route = alternateRoutes.transfers.find(
      (route) => route.heading === selectedTransferHeading
    );
    return route;
  };

  const filterAlternateRoutes = () => {
    const filteredTransfers = [
      ...alternateRoutes.transfers.sort(
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
    if (!loadingAlternates) {
      const filterdTransfers = filterAlternateRoutes();
      setTransfers(filterdTransfers);
    }
  }, [loadingAlternates, alternateRoutes]);

  const handleSelect = (routeIndex) => {
    setSelectLoading(true);
    const access_token = localStorage.getItem("access_token");
    const data = {
      itinerary_id: itinerary_id,
      route_id: alternateRoutes.route_id,
      day_slab_index: day_slab_index,
      element_index: element_index,
      route: transfers[routeIndex],
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
          getPaymentHandler();
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
        console.log("Error: ", err.message);
        setSelectLoading(false);
        setShowDrawer(false);
        openNotification({
          text: "There seems to be a problem, please try again!",
          heading: "Error!",
          type: "error",
        });
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
          <IoMdClose
            onClick={() => setShowDrawer(false)}
            className="hover-pointer"
            style={{
              fontSize: "1.75rem",
              textAlign: "right",
            }}
          ></IoMdClose>
          <div className="text-2xl font-normal">
            Changing transfer from {origin} to {destination}{" "}
          </div>
        </div>
        {loadingAlternates ? (
          <div className="mt-10 w-full flex flex-col gap-3 items-center">
            <div className="w-[90%] h-32 flex flex-col gap-3 bg-gray-200 rounded-lg p-3 shadow-sm animate-pulse"></div>
            <div className="w-[90%] h-32 flex flex-col gap-3 bg-gray-200 rounded-lg p-3 shadow-sm animate-pulse"></div>
            <div className="w-[90%] h-32 flex flex-col gap-3 bg-gray-200 rounded-lg p-3 shadow-sm animate-pulse"></div>
          </div>
        ) : alternatesError ? (
          <div className="w-full flex items-center justify-center">
            <div className="flex items-center justify-center bg-red-500 text-white rounded p-2">
              {alternatesError}
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-3">
            <div className="w-[90%] flex justify-start">
              {alternateRoutes.transfers.length} ways to travel from {origin} to{" "}
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

              {transfers.map((route, index) => (
                <div
                  key={index}
                  className={`w-[90%] flex flex-row gap-3 rounded-lg py-3 pl-3 shadow-sm ${
                    index === 0 ? "border-yellow-300" : ""
                  } border-2`}
                >
                  <div className="w-[15%] flex items-start">
                    <div className="w-[15%] lg:w-[10%]">
                      <TransportIconFetcher
                        TransportMode={route.modes[0]}
                        Instyle={{
                          fontSize:
                            props.route?.modes[0] === "Bus" ? "1rem" : "3.4rem",
                          color: "#4d4d4d",
                        }}
                      />
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-3">
                    <div className="flex flex-row items-start justify-between">
                      <div className="text-lg">{route.heading}</div>
                      {route.recommended ? (
                        <div className="flex flex-row items-center justify-end">
                          <div className="bg-[#F7E700] pl-5 pr-1 py-1 rounded-l-lg text-sm">
                            Recomended
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="flex flex-row items-center justify-between pr-3">
                      <div>{route.meta.Time}</div>
                      {/* <button
                        disabled={index === 0}
                        onClick={() => handleSelect(index)}
                        className={`${
                          index === 0
                            ? "cursor-not-allowed bg-gray-100"
                            : "bg-[#f7e700] hover:bg-black hover:text-white"
                        } p-1 px-3 rounded-lg border-2 border-black`}
                      >
                        {index === 0 ? "Selected" : "Select"}
                      </button> */}
                      <div
                        onClick={() => handleSelect(index)}
                        className="flex mt-2 mr-2 flex-row gap-1 items-end justify-start cursor-pointer"
                      >
                        <CheckboxFormComponent
                          checked={index === 0}
                          className="mb-1"
                        />
                        <label className="text-center">
                          {index === 0 ? "Selected" : "Select"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(TransferEditDraser);
