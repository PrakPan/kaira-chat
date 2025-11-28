import styled from "styled-components";
import { getIndianPrice } from "../../../../services/getIndianPrice";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import media from "../../../media";
import { currencySymbols } from "../../../../data/currencySymbols";
import { useSelector } from "react-redux";

const Container = styled.div`
  padding: 0.75rem;
  @media screen and (min-width: 768px) {
    margin: 0.5rem 0.5rem 0 0.5rem;
  }
`;

const Cost = styled.p`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  text-align: center;
`;

const Text = styled.p`
  font-size: 15px;
  font-weight: 300;
  margin: 0;
  text-align: left;
  @media screen and (min-width: 768px) {
    text-align: center;
  }
`;

const FlexBox = styled.div`
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
`;

const SelectBox = styled.div`
  justify-content: center;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  @media screen and (min-width: 768px) {
    margin-top: 0.5rem;
  }
`;

const Section = (props) => {
  let isPageWide = media("(min-width: 768px)");
  var adult;
  if (props.selectedBooking.pax.number_of_adults > 1) adult = " Adults";
  else adult = " adult";
  var child;
  if (props.selectedBooking.pax.number_of_children > 1) child = " Childs";
  else child = " Child";
  const currency = useSelector(state=>state.UserLocation)?.location;

  if (props.data)
    return (
      <Container className="">
        <div
          style={
            isPageWide
              ? {}
              : {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }
          }
        >
          <FlexBox>
            {props.isSelected ? (
              <Cost className="">
                {props.data.cost
                  ? props.data.cost
                    ? `${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}` + getIndianPrice(Math.round(props.data.cost))
                    : null
                  : null}
              </Cost>
            ) : (
              <Cost className="">
                {props.data.Fare
                  ? props.data.Fare.OfferedFare
                    ? `${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}` +
                      getIndianPrice(Math.round(props.data.Fare.OfferedFare))
                    : null
                  : null}
              </Cost>
            )}

            <Text>
              {"(" +
                props.selectedBooking.pax.number_of_adults +
                adult +
                (props.selectedBooking.pax.number_of_children
                  ? ", " + props.selectedBooking.pax.number_of_children + child
                  : "") +
                ")"}
            </Text>
          </FlexBox>
          <SelectBox>
            {props.isSelected ? (
              <div>
                <ImCheckboxChecked style={{ display: "inline" }} /> Selected
              </div>
            ) : (
              <div
                onClick={() => {
                  props._updateBookingHandler({
                    booking_id: props.selectedBooking.id,
                    itinerary_id: props.selectedBooking.itinerary_id,
                    result_index: props.data.ResultIndex,
                  });
                }}
              >
                <ImCheckboxUnchecked style={{ display: "inline" }} /> Select
              </div>
            )}
          </SelectBox>
        </div>
      </Container>
    );
  else return null;
};

export default Section;
