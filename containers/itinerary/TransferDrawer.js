import { useState, useEffect } from "react";
import Image from "next/image";
import FlightDetailModal from "../../components/modals/daybyday/FlightDetailModal";
import TaxiDetailModal from "../../components/modals/daybyday/TaxiDetailModal";
import Drawer from "../../components/ui/Drawer";
import BackArrow from "../../components/ui/BackArrow";
import FlightDetailLoader from "../../components/modals/daybyday/FlightDetailLoader";
import { PulseLoader } from "react-spinners";
import VehicleDetailModal from "../../components/modals/daybyday/VehicleModal";
import VehicleDetailLoader from "../../components/modals/daybyday/VehicleDetailLoader";
import { AiOutlineRight, AiOutlineDown } from "react-icons/ai";
import { Generalbuttonstyle } from "../../components/ui/button/Generallinkbutton";

const TransferDrawer = ({
  show,
  setHandleShow,
  data,
  booking_type,
  loading,
  handleDelete,
  city,
   _updateFlightBookingHandler,
      _updatePaymentHandler,
      getPaymentHandler,
      oCityData,
          dCityData,
          setShowLoginModal,
          dcity,
          selectedBooking,
          setSelectedBooking,
          originCityId,
          destinationCityId,
          origin_itinerary_city_id,
          destination_itinerary_city_id,
          setShowDrawer,
  
}) => {

  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const isCombo = data?.children && data?.children.length > 0;
  useEffect(() => {
    if (show && isCombo && data?.children?.length > 0) {
      setExpandedIndexes([0]);
    }
  }, [show, isCombo, data?.children?.length]);

  const toggleExpand = (index) => {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes(expandedIndexes.filter(i => i !== index));
    } else {
      setExpandedIndexes([...expandedIndexes, index]);
    }
  };

  const renderDetailContent = (transferData, index) => {
    const type = transferData?.booking_type;
    const childTitle = `${index + 1}. ${transferData.name || `${transferData.transfer_type} Transfer`}`;
    const isExpanded = expandedIndexes.includes(index);

    const renderDetailsByType = () => {
      if (loading) {
        return <VehicleDetailLoader setHandleShow={null} />;
      }

      switch (type) {
        case "Flight":
          return (
            <FlightDetailModal
              segments={transferData?.transfer_details?.items?.[0]?.segments}
              fareRule={transferData?.transfer_details?.items?.[0]?.fare_rule?.[0]}
              booking_id={transferData?.id}
              setShowDetails={null} 
              name={transferData?.name}
              isEmbedded={true} 
            />
          );
        case "Taxi":
          return (
            <TaxiDetailModal
              data={transferData}
              setHandleShow={null} 
              handleDelete={null} 
              loading={loading}
              isEmbedded={true}
            />
          );
        default:
          return (
            <VehicleDetailModal
              data={transferData}
              setHandleShow={null} 
              handleDelete={null}
              loading={loading}
              isEmbedded={true}
            />
          );
      }
    };

    return (
      <div key={`${transferData.id}-${index}`} className="mb-6">
        <div 
          className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg cursor-pointer"
          onClick={() => toggleExpand(index)}
        >
          <h3 className="text-lg font-medium">{childTitle}</h3>
          {isExpanded ? (
            <AiOutlineDown className="text-gray-600" />
          ) : (
            <AiOutlineRight className="text-gray-600" />
          )}
        </div>
        
        {isExpanded && (
          <div className="mt-3">
            {renderDetailsByType()}
          </div>
        )}
      </div>
    );
  };

  return (
    <Drawer
      show={show}
      anchor={"right"}
      backdrop
      style={{ zIndex: 1501 }}
      className="font-lexend"
      onHide={setHandleShow}
      mobileWidth="100vw"
      width={`${booking_type !== "Flight" ? "45vw" : "50vw"}`}
    >
      {!isCombo ? (
        <>
          {booking_type === "Flight" ? (
            loading ? (
              <FlightDetailLoader />
            ) : (
              <FlightDetailModal
                segments={data?.transfer_details?.items?.[0]?.segments}
                fareRule={data?.transfer_details?.items?.[0]?.fare_rule?.[0]}
                booking_id={data?.id}
                setShowDetails={setHandleShow}
                name={city}
              />
            )
          ) : loading ? (
            <VehicleDetailLoader setHandleShow={setHandleShow} />
          ) : booking_type === "Taxi" ? (
            <TaxiDetailModal
              data={data}
              setHandleShow={setHandleShow}
              handleDelete={handleDelete}
              loading={loading}
               _updateFlightBookingHandler={_updateFlightBookingHandler}
                  _updatePaymentHandler={_updatePaymentHandler}
                  getPaymentHandler={getPaymentHandler}
                  oCityData={oCityData}
                      dCityData={dCityData}
                      setShowLoginModal={setShowLoginModal}
                      city={city}
                      dcity={dcity}
                      selectedBooking={selectedBooking}
                      setSelectedBooking={setSelectedBooking}
                      originCityId={originCityId}
                      destinationCityId={destinationCityId}
                      origin_itinerary_city_id={origin_itinerary_city_id}
                      destination_itinerary_city_id={
                        destination_itinerary_city_id
                      }
                      setShowDrawer={setShowDrawer}
            
              
            />
          ) : (
            <VehicleDetailModal
              data={data}
              setHandleShow={setHandleShow}
              handleDelete={handleDelete}
              loading={loading}
            />
          )}
        </>
      ) : (
        <div className="h-screen flex flex-col">
          <div className="p-4 border-b">
            <BackArrow handleClick={() => setHandleShow(false)} />
            <div className="flex justify-between">
            <div>
            <div className="text-xl font-semibold mt-2">
              {data.name || `${data.children[0]?.source_address?.name || ''} to ${data.children[data.children.length - 1]?.destination_address?.name || ''}`}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {data.duration || `${data.children.length} transfers`}
            </div>
            </div>
            <div>
                    <Generalbuttonstyle
                      borderRadius={"7px"}
                      fontSize={"1rem"}
                      padding={"7px 25px"}
                      onClick={()=>{
                        setHandleShow(false);
                        setShowDrawer(true);
                        //setShowTaxi(true);console.log("")
                      }}
                    >
                      Change
                    </Generalbuttonstyle>
                    </div>
                    </div>
          </div>

            
          <div className="flex-grow overflow-auto py-4 pb-24 ">
            {data.children.map((child, index) => renderDetailContent(child, index))}
          </div>
            
          <div className="p-4 bg-white sticky bottom-0 shadow-md">
            <button 
              className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center"
              onClick={() => handleDelete(data)}
              disabled={loading}
            >
              <div style={{ position: "relative" }}>
                <div className="flex gap-1 items-center text-white">
                  <div style={{ visibility: loading ? "hidden" : "visible" }} className="flex gap-1 items-center">
                    <Image src="/delete.svg" width={20} height={20} alt="Delete" />
                    <div>Delete Booking</div>
                  </div>

                  {loading && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <PulseLoader size={12} speedMultiplier={0.6} color="#ffffff" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default TransferDrawer;