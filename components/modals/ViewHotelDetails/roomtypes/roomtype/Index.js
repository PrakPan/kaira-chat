import styled from "styled-components";
import ImageLoader from "../../../../UpdatedBackgroundImageLoader";
import { getIndianPrice } from "../../../../../services/getIndianPrice";
import media from "../../../../media";
import { RxCross2 } from "react-icons/rx";
import { dateFormat } from "../../../../../helper/DateUtils";
import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import ImageCarousel from "../../../Carousel/ImageCarousel";

const ImageContainer = styled.div`
  height: 85px;
  width: 85px;
`;

const RoomType = (props) => {
  let isPageWide = media("(min-width: 768px)");
 
  const [openRooms, setOpenRooms] = useState({});

  const getRoomImage = (images) => {
    if (images && images.length) {
      for (let image of images) {
        if (image?.image) {
          return image.image;
        }
      }
    }
    return null;
  };

const pax = props?.rates?.reduce((total, rate) => {
  const roomTotal = rate?.rooms?.reduce((roomSum, room) => {
    const adults = Number(room?.number_of_adults) || 0;
    const children = Number(room?.number_of_children) || 0;
    return roomSum + adults + children;
  }, 0);
  return total + roomTotal;
}, 0);



  const getRoomsByRate = () => {
    if (!props.rates || !Array.isArray(props.rates)) return [];
    
    return props.rates.map((rate, rateIndex) => ({
      rate,
      rateIndex,
      rooms: rate.rooms || []
    }));
  };

  
  const toggleRoomDetails = (rateIndex, roomIndex) => {
    const roomKey = `${rateIndex}-${roomIndex}`;
    setOpenRooms(prev => ({
      ...prev,
      [roomKey]: !prev[roomKey]
    }));
  };


  const isRoomOpen = (rateIndex, roomIndex) => {
    const roomKey = `${rateIndex}-${roomIndex}`;
    return openRooms[roomKey] || false;
  };

  const roomsByRate = getRoomsByRate();

  return (
    <div className={`bg-[#F4F4F4] flex flex-col gap-3 p-3 rounded-lg cursor-pointer ${props.isSelected ? 'border-2 border-blue-500' : ''}`}>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center h-fit gap-2">
          <div className="text-md md:text-lg font-bold">
            Recommendation {props.index + 1}
          </div>
          {props.isSelected && (
            <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
              Selected
            </div>
          )}
        </div>

        <div className="flex flex-row items-center justify-between">
          <div className="text-xl md:text-2xl font-bold">
            {"₹" + getIndianPrice(Math.round(props.price)) + "/-"} <span className="font-normal text-sm">for {pax} people</span> 
          </div>

          <div className="flex flex-col gap-1 items-end">
            <button
              className="bg-[#F7E700] py-2 px-4 rounded-lg border-2 border-black hover:bg-black hover:text-white transition-all"
              onClick={() => props.handleUpdateBooking(props.index)}
            >
              Add to Itinerary
            </button>

            <div className="text-sm">
              on {props.checkInDate} ({props.city})
            </div>
          </div>
        </div>
      </div>

      {roomsByRate.map(({ rate, rateIndex, rooms }) => (
        <div key={rateIndex} className="flex flex-col gap-2">
          
          {roomsByRate.length > 1 && (
            <div className="text-sm font-semibold text-black px-2">
              ₹{getIndianPrice(Math.round(rate.final_rate))}
              <span className="text-[#ef7d7d]">{rate.refundable ? ' Refundable' : ' Non-Refundable'}</span>
            </div>
          )}
          
          {rooms.map((room, roomIndex) => {
            const isCurrentRoomOpen = isRoomOpen(rateIndex, roomIndex);
            
            return (
              <div
                key={`${rateIndex}-${roomIndex}`}
                className="flex flex-col gap-3 bg-white p-2 rounded-lg"
              >
                <div className="flex flex-row gap-3">
                  {getRoomImage(room?.images) && (
                    <ImageContainer>
                      <ImageLoader
                        noLazy
                        height={isPageWide ? "85px" : "75px"}
                        width={isPageWide ? "85px" : "75px"}
                        borderRadius="10px"
                        dimensions={{ height: 200, width: 200 }}
                        url={getRoomImage(room?.images)}
                      />
                    </ImageContainer>
                  )}

                  <div className="w-full">
                    {room.name ? (
                      <div className="w-full text-[14px] font-[400] md:text-lg md:font-semibold">
                        {room.name}{" "}
                        <span>
                          <RxCross2 className="inline" /> 1 room
                        </span>
                      </div>
                    ) : null}

                    {room?.number_of_adults && room?.number_of_adults !== "0" ? (
                      <div className="flex flex-col md:flex-row gap-1 items-start md:items-center">
                        <div className="flex flex-row gap-2">
                          <div className="text-md font-semibold">Sleeps</div>
                          <div>
                            {room.number_of_adults > 1
                              ? `${room.number_of_adults} Adults`
                              : `${room.number_of_adults} Adult`}
                            {room?.number_of_children &&
                            room?.number_of_children !== "0"
                              ? `, ${room.number_of_children} Children`
                              : null}
                            {/* {room?.child_ages && room.child_ages.length > 0 && (
                              <span className="text-xs text-gray-500">
                                {" "}(Ages: {room.child_ages.join(", ")})
                              </span>
                            )} */}
                          </div>
                        </div>
                        {rate?.board_basis && (
                          <p className="bg-[#e6f9ec] text-[#3BAF75] px-2 py-2 mb-0 rounded-md text-xs font-medium">
                            {rate.board_basis.description}
                          </p>
                        )}
                      </div>
                    ) : null}

                  
                    <div className="text-blue">
                      {isCurrentRoomOpen ? (
                        <div
                          className="w-fit flex flex-row items-center gap-1 hover:bg-black hover:text-white p-1 rounded-lg cursor-pointer"
                          onClick={() => toggleRoomDetails(rateIndex, roomIndex)}
                        >
                          <div>Hide details</div>
                          <IoIosArrowUp className="text-xl" />
                        </div>
                      ) : (
                        <div
                          className="w-fit flex flex-row items-center gap-1 hover:bg-black hover:text-white p-1 rounded-lg cursor-pointer"
                          onClick={() => toggleRoomDetails(rateIndex, roomIndex)}
                        >
                          <div>See details</div>
                          <IoIosArrowDown className="text-xl" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                
                {isCurrentRoomOpen && (
                  <div className="flex flex-col gap-3">
                    <div
                      className={`flex flex-col md:flex-row gap-1 ${
                        room?.description && room?.images?.length > 0
                          ? "justify-center"
                          : room?.images?.length > 0
                          ? "justify-end"
                          : ""
                      }`}
                    >
                      <div className="flex justify-start w-full">
                        {room?.description ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: room.description,
                            }}
                            className=""
                          ></div>
                        ) : null}
                      </div>
                      <div className="flex md:justify-end w-full">
                        {room?.images?.length > 0 && (
                          <div className="flex flex-col items-center justify-center gap-3 w-[100%] md:w-[80%] h-[250px]">
                            <ImageCarousel images={room?.images} />
                          </div>
                        )}
                      </div>
                    </div>

                    {room?.facilities?.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        <div className="text-lg font-semibold">
                          Room Amenities
                        </div>
                        <div className="text-[14px]">
                          <div className="flex flex-wrap gap-2">
                            {room.facilities.map((item, index) => (
                              <div key={index}>
                                <div className="bg-[#FAFAFA] p-[8px] rounded-[10px]">
                                  {item}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {roomsByRate[rateIndex]?.rate?.polices && roomsByRate[rateIndex].rate.polices.length > 0 ? (
                      <>
                        <div className="text-lg font-bold">Policies</div>
                        {roomsByRate[rateIndex].rate.polices.map((item, index) => (
                          <div key={index} className="flex flex-col gap-2">
                            <div className="text-lg font-semibold">{item.type}</div>
                            <div
                              className="text-[14px]"
                              dangerouslySetInnerHTML={{
                                __html: item.text,
                              }}
                            ></div>
                          </div>
                        ))}
                      </>
                    ) : null}

                    
                    {rate?.cancellation_policies && (
                      <div className="flex flex-col gap-2">
                        {/* <div className="text-lg font-bold">Cancellation Policy</div> */}
                        <div
                          className="text-[14px]"
                          dangerouslySetInnerHTML={{
                            __html: rate.cancellation_policies,
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default RoomType;