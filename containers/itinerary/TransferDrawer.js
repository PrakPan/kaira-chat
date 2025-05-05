import { useState } from "react";
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

const TransferDrawer = ({
  show,
  setHandleShow,
  data,
  booking_type,
  loading,
  handleDelete,
  city
}) => {
  // Check if this is a combo transfer by checking if it has children
  const isCombo = data?.children && data?.children.length > 0;

  // Function to render the appropriate detail component based on booking type
  const renderDetailContent = (transferData, index) => {
    const type = transferData?.booking_type;

    // Custom title for combo children
    const childTitle = `${index + 1}. ${transferData.name || `${transferData.transfer_type} Transfer`}`;

    if (loading) {
       return (
       //type === "Flight" ? 
      //   <div key={`${transferData.id}-loading`} className="mb-8">
      //     <h3 className="text-lg font-medium mb-4 px-4">{childTitle}</h3>
      //     <FlightDetailLoader /> 
      //   </div>
      //   : 
        <div key={`${transferData.id}-loading`} className="mb-8">
          <h3 className="text-lg font-medium mb-4 px-4">{childTitle}</h3>
          <VehicleDetailLoader setHandleShow={null} />
        </div>
       )
    }

    switch (type) {
      case "Flight":
        return (
          <div key={`${transferData.id}-flight`} className="mb-8">
            <h3 className="text-lg font-medium mb-4 px-4">{childTitle}</h3>
            <FlightDetailModal
              segments={transferData?.transfer_details?.items?.[0]?.segments}
              fareRule={transferData?.transfer_details?.items?.[0]?.fare_rule?.[0]}
              booking_id={transferData?.id}
              setShowDetails={null} // Don't close drawer when viewed in combo
              name={transferData?.name}
              isEmbedded={true} // Flag to indicate this is embedded in a combo view
            />
          </div>
        );
      case "Taxi":
        return (
          <div key={`${transferData.id}-taxi`} className="mb-8">
            <h3 className="text-lg font-medium mb-4 px-4">{childTitle}</h3>
            <TaxiDetailModal
              data={transferData}
              setHandleShow={null} 
              handleDelete={null} 
              loading={loading}
              isEmbedded={true}
            />
          </div>
        );
      default:
        return (
          <div key={`${transferData.id}-vehicle`} className="mb-8">
            <h3 className="text-lg font-medium mb-4 px-4">{childTitle}</h3>
            <VehicleDetailModal
              data={transferData}
              setHandleShow={null} // Don't close drawer when viewed in combo
              handleDelete={null} // Disable individual delete in combo view
              loading={loading}
              isEmbedded={true} // Flag to indicate this is embedded in a combo view
            />
          </div>
        );
    }
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
        // Single transfer type display - keep original behavior
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
        // Combo transfer display - stacked view
        <div className="h-screen flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <BackArrow handleClick={() => setHandleShow(false)} />
            <div className="text-xl font-semibold mt-2">
              {data.name || `${data.children[0]?.source_address?.name || ''} to ${data.children[data.children.length - 1]?.destination_address?.name || ''}`}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {data.duration || `${data.children.length} transfers`}
            </div>
          </div>
            
          {/* Scrollable content area with all details stacked */}
          <div className="flex-grow overflow-auto py-4 pb-24">
            {data.children.map((child, index) => renderDetailContent(child, index))}
          </div>
            
          {/* Fixed delete button at the bottom */}
          <div className="p-4 bg-white sticky bottom-0 shadow-md">
            <button 
              className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center"
              onClick={()=>handleDelete(data)}
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
