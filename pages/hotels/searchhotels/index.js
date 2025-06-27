import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { FilterComponent } from "../../../components/flights/filterComponent";
import Layout from "../../../components/Layout";
import { Container } from "../../../components/modals/flights/new-flight-searched/FlightStyles";
import { MERCURY_HOST } from "../../../services/constants";
import NewHotelBooking from "../../../components/modals/bookingupdated/new-accommodation-searched/NewHotelBooking";
import { toast, ToastContainer } from "react-toastify";
import { SearchComponent } from "..";
import Drawer from "../../../components/ui/Drawer";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
import ImageLoader from "../../../components/ImageLoader";
import SkeletonCard from "../../../components/ui/SkeletonCard";
import { useDispatch } from "react-redux";
import { openNotification } from "../../../store/actions/notification";

const Title = styled.p`
  font-weight: 800;
  font-size: 20px;
`;

const Reviews = styled.div`
  display: flex;
  align-items: center;
  margin-block: 0.5rem;
  gap: 0.2rem;
  p,
  u {
    font-size: 12px;
    color: #7a7a7a;
  }
  u {
    margin-inline: 0.2rem;
  }
`;

const Text = styled.p`
  font-size: 14px;
`;

const Heading = styled.p`
  font-size: 18px;
  font-weight: 800;
`;

const BackContainer = styled.div`
  margin: 0;
  display: flex;
  gap: 0.5rem;
  position: sticky;
  z-index: 1;
  background: white;
  top: 0;
  padding-block: 0.75rem;

  @media screen and (min-width: 768px) {
    padding-block: 1rem;
  }
`;

const BackText = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const FloatingVContaineriew = styled.div`
  position: sticky;
  bottom: 10px;
  background: #f7e700;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 90%;
  z-index: 2;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  position: relative;
`;

function convertDate(dateStr) {
  const [year, day, month] = dateStr.split("-");
  return `${year}-${month}-${day}`;
}
const SearchHotels = () => {
  const router = useRouter();
  const { city, checkIn, checkOut, ppl, price, searchText, country } =
    router.query;
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    priceLowerRange: 0,
    priceUpperRange: 0,
    starCategory: [],
    userRatings: [],
  });
  const [input, setInput] = useState({
    cityId: "",
    city: "",
    country: "",
    checkIn: convertDate(checkIn),
    checkOut: convertDate(checkOut),
    occupancies: [],
    num_adults: 0,
    num_children: 0,
  });
  const dispatch = useDispatch();

  const [showDetails, setShowDetails] = useState(false);

  function parseRoomData(roomData) {
    const rooms = roomData.split("v"); // Split rooms by 'v'
    let numChildren = 0;
    let numAdults = 0;
    let occupancies = rooms.map((room) => {
      const parts = room.split("t").map(Number); // Split by 't' and convert to numbers
      const [num_adults, children, ...child_ages] = parts;
      numChildren += children;
      numAdults += num_adults;
      return { num_adults, child_ages };
    });
    occupancies = [...occupancies, numAdults, numChildren];
    return occupancies;
  }
  const [hotelDetails, setHotelDetails] = useState({});

  useEffect(() => {
    if (!router.isReady) return; // Wait until router is ready
    const FetchResults = async () => {
      try {
        let occupancies = parseRoomData(ppl);
        const numChildren = occupancies.pop();
        const numAdults = occupancies.pop();
        setInput({
          checkIn: convertDate(checkIn),
          checkOut: convertDate(checkOut),
          occupancies: occupancies,
          cityId: city,
          city: { city: searchText, country: country },
          num_children: numChildren,
          num_adults: numAdults,
        });
        requestApi(checkIn, checkOut, city, occupancies);
      } catch (err) {
        console.log("ERROR: ", err);
      }
    };

    FetchResults();
  }, [router.isReady, router.query]);
  useEffect(() => {
    const FetchResults = async () => {
      try {
        requestApi(
          input?.checkIn,
          input?.checkOut,
          input?.occupancies,
          input?.childAges
        );
      } catch (err) {
        console.log("ERROR: ", err);
      }
    };
    FetchResults();
  }, [filters.applyFilter]);

  const requestApi = async (checkIn, checkOut, city, occupancies) => {
    try {
      const res = await axios.post(`${MERCURY_HOST}/api/v1/hotels/search/`, {
        check_in: new Date(checkIn).toISOString().split("T")[0],
        check_out: new Date(checkOut).toISOString().split("T")[0],
        city_id: city,
        occupancies: occupancies,
        filter_by: {
          price_lower_range: filters?.priceLowerRange,
          ...(filters?.priceUpperRange !== 0 && {
            price_upper_range: filters?.priceUpperRange,
          }),
          star_category: filters?.starCategory?.map(Number),
          user_ratings: filters?.userRatings?.map(Number),
        },
      });
      setData(res?.data?.data);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.errors?.[0]?.detail?.[0]?.message ||
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";

      dispatch(
        openNotification({
          type: "error",
          text: `${errorMessage}`,
          heading: "Error!",
        })
      );
      console.log("Error: ", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Layout page="Flights">
      <ToastContainer />
      <SearchComponent
        input={input}
        setInput={setInput}
        handleChange={handleChange}
        small={true}
      />
      {router.isReady && (
        <Container className="hotels">
          <div className="grid grid-cols-[auto,1fr] gap-2">
            <div>
              <FilterComponent input={filters} setInput={setFilters} />
            </div>
            <div>
              <div className="flex justify-end items-center">
                <div className="bg-white border rounded-lg flex gap-2 items-center justify-center p-1 mb-2 shadow-md">
                  <label className="text-gray-700 font-medium">Sort by</label>
                  <select
                    className="bg-transparent px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setFilters({
                          ...filters,
                          price_order: "",
                          duration_order: "",
                        });
                      } else if (value === "price") {
                        setFilters({
                          ...filters,
                          price_order: "asc",
                          duration_order: "",
                        });
                      }
                    }}
                  >
                    <option value="">None</option>
                    <option value="price">Price</option>
                  </select>
                </div>
              </div>
              {data.length != 0 &&
                data.map((item) => (
                  <>
                    <NewHotelBooking
                      booking={item}
                      duration={
                        (new Date(checkOut) - new Date(checkIn)) /
                        (1000 * 60 * 60 * 24)
                      }
                      // openDetails={()=>setShowDetails(true)}
                      openDetails={() => {
                        setShowDetails(true);
                        const handleClick = async () => {
                          const res = await axios.post(
                            `${MERCURY_HOST}/api/v1/hotels/detail/`,
                            {
                              trace_id: null,
                              check_in: input?.checkIn,
                              check_out: input?.checkOut,
                              hotel_id: String(item?.id),
                              num_adults: input?.num_adults,
                              num_children: input?.num_children,
                              currency: "INR",
                              source: item?.source,
                            }
                          );
                          setHotelDetails(res?.data);
                        };
                        handleClick();
                      }}
                    />
                  </>
                ))}
              <Drawer
                show={showDetails}
                anchor={"right"}
                backdrop
                className="font-lexend"
                onHide={() => setShowDetails(false)}
                mobileWidth={"100%"}
                width="50%"
              >
                <Container>
                  <BackContainer className=" font-lexend">
                    <IoMdClose
                      className="hover-pointer"
                      onClick={() => setShowDetails(false)}
                      style={{ fontSize: "2rem" }}
                    ></IoMdClose>
                    <BackText>Hotel Details</BackText>
                  </BackContainer>
                  <ImageContainer style={{ height: "188px" }}>
                    <div>
                      <div
                        style={{
                          display: hotelDetails?.images?.[0]?.image
                            ? "initial"
                            : "none",
                        }}
                      >
                        <ImageLoader
                          borderRadius="8px"
                          marginTop="23px"
                          widthMobile="100%"
                          url={
                            hotelDetails?.images?.[0]?.image
                              ? hotelDetails?.images?.[0]?.image
                              : "media/icons/bookings/notfounds/noroom.png"
                          }
                          dimensionsMobile={{ width: 500, height: 280 }}
                          dimensions={{ width: 468, height: 188 }}
                          noLazy
                        ></ImageLoader>
                      </div>

                      <div
                        style={{
                          display: !hotelDetails?.images?.[0]?.image
                            ? "initial"
                            : "none",
                        }}
                      >
                        <div
                          style={{
                            width: "468px",
                            height: "188px",
                            overflow: "hidden",
                            borderRadius: "8px",
                          }}
                        >
                          <SkeletonCard />
                        </div>
                      </div>
                    </div>
                  </ImageContainer>

                  <div className="mt-3">
                    <Title>{hotelDetails?.name}</Title>
                    {hotelDetails?.addr1 && (
                      <div>
                        <span className="font-bold pr-1">Address:</span>{" "}
                        {hotelDetails?.addr1}
                      </div>
                    )}

                    <Reviews>
                      {hotelDetails?.star_category ? (
                        <div
                          style={{ color: "#FFD201", marginBottom: "0.3rem" }}
                          className="flex flex-row gap-1"
                        >
                          {hotelDetails?.star_category}
                        </div>
                      ) : null}

                      <div style={{ display: "flex", alignItems: "center" }}>
                        {hotelDetails?.rating_ext ? (
                          <p style={{ marginBlock: "auto" }}>
                            {hotelDetails?.rating_ext} ·{" "}
                          </p>
                        ) : null}

                        {hotelDetails?.num_reviews_ext ? (
                          <u> {hotelDetails?.num_reviews_ext} user reviews</u>
                        ) : null}
                      </div>
                    </Reviews>
                    {/* {props.data?.experience_filters && (
                      <Text>{experience_filters}</Text>
                    )} */}
                  </div>

                  {hotelDetails?.cost ? (
                    <div className="flex flex-row">
                      Cost: <span className="font-semibold px-1">₹</span>
                      {hotelDetails.cost}
                      {" /- "}
                      {"Per person"}
                    </div>
                  ) : hotelDetails?.price ? (
                    <div className="flex flex-row">
                      Cost: <span className="font-semibold px-1">₹</span>
                      {hotelDetails?.price}
                      {" /- "}
                      {"Per person"}
                    </div>
                  ) : null}

                  {hotelDetails?.recommendations?.[0]?.rates?.[0]?.rooms?.[0]
                    ?.description && (
                    <div>
                      <Heading>About</Heading>
                      <Text>
                        {
                          hotelDetails?.recommendations?.[0]?.rates?.[0]
                            ?.rooms?.[0]?.description
                        }
                      </Text>
                    </div>
                  )}
                </Container>
              </Drawer>
            </div>
          </div>
        </Container>
      )}
      {/* <Booking check_in={checkIn} check_out={checkOut} cityId={city} number_of_adults={1}/> */}
    </Layout>
  );
};

export default SearchHotels;
