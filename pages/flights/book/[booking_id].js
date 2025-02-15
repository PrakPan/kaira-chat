import { useEffect, useState } from "react";
import PassengerDetails from "../../../components/forms/PassengerDetails";
import PassengerDetailsInternational from "../../../components/forms/PassengerDetailsInternational";
import Button from "../../../components/ui/button/Index";
import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import { MERCURY_HOST } from "../../../services/constants";
import axios from "axios";
import { FlightSegment } from "../../../components/flights/FlightSegment";
import {
  AddButton,
  BookingContainer,
  Count,
  Divider,
  Input,
  PassengerForm,
  PriceCard,
  Section,
  SectionHeader,
  SectionTitle,
  Title,
} from "../../../components/modals/flights/new-flight-searched/FlightStyles";
import GlobalModal from "../../../components/modals/GlobalModal";
import { toast, ToastContainer } from "react-toastify";
export default function Book() {
  const router = useRouter();
  const [count, setCount] = useState({
    adults: 0,
    children: 0,
    infants: 0,
  });
  const [flightDetails, setFlightDetails] = useState([]);
  const { booking_id } = router.query;
  const [adultsData, setAdultsData] = useState([]);
  const [childrenData, setChildrenData] = useState([]);
  const [infantsData, setInfantsData] = useState([]);
  const [metaData, setMetaData] = useState({
    source: "Travclan",
    booking_id: "",
    itinerary_code: "",
    trace_id: "",
    is_domestic: true,
  });
  const [gstDetails, setGstDetails] = useState({});

  const [priceDetails, setPriceDetails] = useState({
    baseFare: 0,
    taxAndSubCharge: 0,
    totalAmount: 0,
  });

  const [isPriceUpdated, setIsPriceUpdated] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const getResponse = async () => {
      const res = await axios.get(
        `${MERCURY_HOST}/api/v1/itinerary/jhjkhkj/bookings/flight/${booking_id}`
      );
      setCount((prev) => ({
        ...prev,
        adults: res?.data?.number_of_adults,
        children: res?.data?.number_of_children,
        infants: res?.data?.number_of_infants,
      }));
      setFlightDetails(res?.data?.flight_details?.items[0]?.segments);
      setMetaData((prev) => ({
        ...prev,
        booking_id: booking_id,
        itinerary_code: res?.data?.flight_details?.itinerary_code,
        trace_id: res?.data?.flight_details?.trace_id,
      }));

      setPriceDetails({
        baseFare: res?.data?.flight_details?.price_details?.base_fare,
        taxAndSubCharge:
          res?.data?.flight_details?.price_details?.tax_and_surcharge,
        totalAmount: res?.data?.flight_details?.price_details?.total_amount,
      });

      if (res?.data?.flight_details?.is_domestic === false) {
        setMetaData((prev) => ({
          ...prev,
          is_domestic: false,
        }));
      }
    };
    getResponse();
  }, [router.isReady]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = {
      ...gstDetails,
      [name]: value,
    };
    setGstDetails(updatedForm);
  };

  const handleCountChange = (type) => {
    if (type === "adults" && adultsData.length < count.adults) {
      setAdultsData((prevData) => [...prevData, createPassenger(1)]);
    } else if (type === "children" && childrenData.length < count.children) {
      setChildrenData((prevData) => [...prevData, createPassenger(2)]);
    } else if (type === "infants" && infantsData.length < count.infants) {
      setInfantsData((prevData) => [...prevData, createPassenger(3)]);
    }
  };

  const createPassenger = (pax_type) => ({
    title: "",
    first_name: "",
    last_name: "",
    gender: "",
    pax_type,
    dob: "",
  });

  const handleSubmit = async () => {
    try {
    var res = await axios.get(
      `${MERCURY_HOST}/api/v1/itinerary/jhjkhkj/bookings/flight/${booking_id}`
    );
    if (
      res?.data?.flight_details?.price_details?.total_amount !==
      priceDetails.totalAmount
    ) {
      console.log(res?.data?.flight_details?.price_details?.total_amount);
      setPriceDetails({
        baseFare: res?.data?.flight_details?.price_details?.base_fare,
        taxAndSubCharge:
          res?.data?.flight_details?.price_details?.tax_and_surcharge,
        totalAmount: res?.data?.flight_details?.price_details?.total_amount,
      });
      setIsPriceUpdated(true);
      return;
    }

    res = await axios.post(
      `${MERCURY_HOST}/api/v1/itinerary/bookings/flight/new/add-travellers/`,
      {
        source: metaData.source,
        booking_id: metaData.booking_id,
        travellers: [...adultsData, ...childrenData, ...infantsData],
        is_domestic: metaData.is_domestic,
        gst_company_address: gstDetails.gst_company_address,
        gst_company_contact_number: gstDetails.gst_company_contact_number,
        gst_company_email: gstDetails.gst_company_email,
        gst_company_name: gstDetails.gst_company_name,
        gst_number: gstDetails.gst_number,
      }
    );} catch (error) {
      toast.error(error.response?.data?.errors[0]?.message[0])
    }
  };

  return (
    <Layout page="Book Flights">
      <div className="max-w-[85%] flex items-start gap-4 mt-[100px] mx-auto">
        <div className="w-[calc(100%-330px)]">
          <BookingContainer>
            {flightDetails.length > 0 ? (
              <FlightSegment segments={flightDetails} />
            ) : (
              <div>Please enter correct details</div>
            )}
          </BookingContainer>
          <BookingContainer>
            <Title>Traveller Details</Title>

            <Section>
              <SectionHeader>
                <SectionTitle>Adults</SectionTitle>
                <Count>
                  {adultsData.length}/{count.adults}
                </Count>
              </SectionHeader>
              <Divider />
              {adultsData.map((_, index) => (
                <>
                  {metaData.is_domestic ? (
                    <PassengerDetails
                      key={index}
                      index={index}
                      data={adultsData}
                      setData={setAdultsData}
                      name={"Adult"}
                    />
                  ) : (
                    <PassengerDetailsInternational
                      key={index}
                      index={index}
                      data={adultsData}
                      setData={setAdultsData}
                      name={"Adult"}
                    />
                  )}
                  <Divider />
                </>
              ))}
              <AddButton onClick={() => handleCountChange("adults")}>
                + Add Adult
              </AddButton>
            </Section>

            <Section>
              <SectionHeader>
                <SectionTitle>Children</SectionTitle>
                <Count>
                  {childrenData.length}/{count.children}
                </Count>
              </SectionHeader>
              <Divider />
              {childrenData.map((_, index) => (
                <>
                  {metaData.is_domestic ? (
                    <PassengerDetails
                      key={index}
                      index={index}
                      data={childrenData}
                      setData={setChildrenData}
                      name={"Children"}
                    />
                  ) : (
                    <PassengerDetailsInternational
                      key={index}
                      index={index}
                      data={childrenData}
                      setData={setChildrenData}
                      name={"Children"}
                    />
                  )}
                  <Divider />
                </>
              ))}
              <AddButton onClick={() => handleCountChange("children")}>
                + Add Child
              </AddButton>
            </Section>

            <Section>
              <SectionHeader>
                <SectionTitle>Infants</SectionTitle>
                <Count>
                  {infantsData.length}/{count.infants}
                </Count>
              </SectionHeader>
              {infantsData.map((_, index) => (
                <>
                  {metaData.is_domestic ? (
                    <PassengerDetails
                      key={index}
                      index={index}
                      data={infantsData}
                      setData={setInfantsData}
                      name={"Infant"}
                    />
                  ) : (
                    <PassengerDetailsInternational
                      key={index}
                      index={index}
                      data={infantsData}
                      setData={setInfantsData}
                      name={"Infant"}
                    />
                  )}
                </>
              ))}
              <AddButton onClick={() => handleCountChange("infants")}>
                + Add Infant
              </AddButton>
            </Section>
            <PassengerForm>
              <Input
                type="text"
                name="gst_company_address"
                value={gstDetails.gst_company_address}
                onChange={handleChange}
                placeholder="Enter Company address(Optional)"
              />
              <Input
                type="text"
                name="gst_company_email"
                value={gstDetails.gst_company_email}
                onChange={handleChange}
                placeholder="Enter Company address(Optional)"
              />
              <Input
                type="text"
                name="gst_company_name"
                value={gstDetails.gst_company_name}
                onChange={handleChange}
                placeholder="Enter Company Email(Optional)"
              />
              <Input
                type="text"
                name="gst_number"
                value={gstDetails.gst_number}
                onChange={handleChange}
                placeholder="Enter GST Number(Optional)"
              />
            </PassengerForm>
          </BookingContainer>
        </div>
        <PriceCard>
          <Title>Price</Title>
          <div className="w-full flex justify-between">
            <SectionTitle>Base Fare</SectionTitle>
            <p>{priceDetails.baseFare}</p>
          </div>
          <div className="w-full  flex justify-between">
            <SectionTitle>Tax & Subcharge</SectionTitle>
            <p>{priceDetails.taxAndSubCharge}</p>
          </div>
          <div className="w-full  flex justify-between">
            <SectionTitle>Total Amount</SectionTitle>
            <p>{priceDetails.totalAmount}</p>
          </div>

          <Button
            padding="0.75rem 1rem"
            fontSize="18px"
            fontWeight="500"
            bgColor="#f7e700"
            borderRadius="7px"
            color="black"
            borderWidth="1px"
            onclick={handleSubmit}
          >
            Book
          </Button>
        </PriceCard>
      </div>
      {isPriceUpdated && (
        <GlobalModal
          isOpen={isPriceUpdated}
          onClose={() => setIsPriceUpdated(false)}
          children={
            <CardComp priceDetails={priceDetails} handleSubmit={handleSubmit} />
          }
        />
      )}
      <ToastContainer/>
    </Layout>
  );
}

const CardComp = ({ priceDetails, handleSubmit }) => {
  return (
    <>
      <>
        <SectionTitle>
          Total Amount is changed to {priceDetails.totalAmount}.Do you still
          want to book?
        </SectionTitle>
        <Button
          padding="0.75rem 1rem"
          fontSize="18px"
          fontWeight="500"
          bgColor="#f7e700"
          borderRadius="7px"
          color="black"
          borderWidth="1px"
          onclick={handleSubmit}
        >
          Book
        </Button>
      </>
    </>
  );
};
