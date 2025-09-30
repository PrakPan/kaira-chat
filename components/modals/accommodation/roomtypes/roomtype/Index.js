import styled from "styled-components";
import ImageLoader from "../../../../UpdatedBackgroundImageLoader";
import { getIndianPrice } from "../../../../../services/getIndianPrice";
import media from "../../../../media";
import { RxCross2 } from "react-icons/rx";
import { dateFormat } from "../../../../../helper/DateUtils";
import { use, useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import ImageCarousel from "../../../Carousel/ImageCarousel";
import Image from "next/image";
import { useAnalytics } from "../../../../../hooks/useAnalytics";
import { useRouter } from "next/router";

const ImageContainer = styled.div`
  height: 85px;
  width: 85px;
`;

const RoomType = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [openRooms, setOpenRooms] = useState({});
  const { trackHotelRoomDetails } = useAnalytics();
  const router = useRouter();
  

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


  const toggleRoomDetails = (roomIndex) => {
    if(openRooms[roomIndex]){    
      trackHotelRoomDetails(router.query.id, props.data.id,roomIndex, 'room_details_viewed')
    }else{
      trackHotelRoomDetails(router.query.id, props.data.id,roomIndex, 'room_details_hide')
    }
    setOpenRooms(prev => ({
      ...prev,
      [roomIndex]: !prev[roomIndex]
    }));

  };

  return (
    <>
      {props.rooms.map((room, index) => (
        <div key={index} className="bg-[#F4F4F4] flex flex-col gap-3 p-3 rounded-lg">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center h-fit gap-2">
              <div className="text-md md:text-lg font-bold">
                Room {props.index + index + 1}
              </div>
            </div>

            {/* <div className="flex flex-row items-center justify-between">
              <div className="text-xl md:text-2xl font-bold">
                {"₹" + getIndianPrice(Math.round(props.data?.final_rate)) + "/-"}{" "}
                <span className="font-normal text-sm">
                  for{" "}
                  {props?.duration === 1
                    ? props?.duration + " Night"
                    : props?.duration + " Nights"}{" "}
                </span>
              </div>
            </div> */}
          </div>

          <div className="flex flex-col gap-3 bg-white p-2 rounded-lg">
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
                  <div className="flex flex-col md:flex-row gap-1 items-start md:items-center md:justify-start">
                    <div className="text-md font-semibold">Sleeps {room.number_of_adults > 1
                        ? ` ${room.number_of_adults} Adults`
                        : ` ${room.number_of_adults} Adult`}
                      {room?.number_of_children &&
                      room?.number_of_children !== "0"
                        ? `, ${room.number_of_children} Children`
                        : null}</div>
                    {/* <div>
                    
                    </div> */}
                    {/* {props?.data?.board_basis && (
                      <p className="bg-[#e6f9ec] text-[#3BAF75] px-2 py-2 mb-0 rounded-md text-xs font-medium">
                        {props?.data?.board_basis?.description}
                      </p>
                    )} */}
                              {props?.data?.board_basis && (
                      props?.data?.board_basis?.description === "Room Only" ? (
                        <p className="bg-[#FAFAFA] text-[#7A7A7A] px-2 py-2 mb-0 rounded-md text-xs font-medium">
                          {props?.data?.board_basis?.description}
                        </p>
                      ) : (
                        <div className="flex flex-row items-center bg-[#FAFAFA] text-[#7A7A7A] text-[12px] px-1 gap-2 rounded-sm">
                          <div>{props?.data?.board_basis?.description}</div>
                        </div>
                      )
                    )}
                  </div>
                ) : null}
                {(room?.description || 
                      room?.images?.length > 0 || 
                      room?.facilities?.length > 0 ||
                      (props.data?.polices && props.data.polices.length > 0) ||
                      props.data?.cancellation_policies
                    ) && (
                      <div 
                        className="text-blue font-normal text-sm"
                        onClick={() => toggleRoomDetails(index)}
                      >
                        {openRooms[index] ? (
                          <div className="w-fit flex flex-row items-center gap-1 hover:bg-black hover:text-white p-1 rounded-lg cursor-pointer">
                            <div>Hide details</div>
                            <IoIosArrowUp className="text-xl" />
                          </div>
                        ) : (
                          <div className="w-fit flex flex-row items-center gap-1 hover:bg-black hover:text-white p-1 rounded-lg cursor-pointer">
                            <div>See details</div>
                            <IoIosArrowDown className="text-xl" />
                          </div>
                        )}
                      </div>
                    )}
              </div>
            </div>

            {openRooms[index] && (
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
                  <div className="flex justify-end w-full">
                    {room?.images?.length > 0 && (
                      <div className="flex flex-col items-center justify-center gap-3 md:w-[80%] w-full h-[250px]">
                        <ImageCarousel images={room?.images} />
                      </div>
                    )}
                  </div>
                </div>

                {room?.facilities?.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-lg font-semibold">Room Amenities</div>
                    <div className="text-[14px]">
                      <div className="flex flex-wrap gap-2">
                        {room.facilities.map((item, facilityIndex) => (
                          <div key={facilityIndex}>
                            <div className="bg-[#FAFAFA] p-[8px] rounded-[10px]">
                              {item}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

              
                <div className="flex flex-col gap-3">
                  {props.data?.polices && props?.data?.polices?.length > 0
                    ? props.data.polices.map((item, policyIndex) => (
                        <div key={policyIndex} className="flex flex-col gap-2">
                          <div className="text-lg font-semibold">{item.type}</div>
                          <div
                            className="text-[14px]"
                            dangerouslySetInnerHTML={{
                              __html: item.text,
                            }}
                          ></div>
                        </div>
                      ))
                    : null}
                </div>

                {/* <div>
                  {props?.cancellationPolicy && (
                    <div
                      className="text-[14px]"
                      dangerouslySetInnerHTML={{
                        __html: props?.cancellationPolicy,
                      }}
                    ></div>
                  )}
                </div> */}
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default RoomType;