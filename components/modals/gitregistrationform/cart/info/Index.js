import styled from "styled-components";
import { getHumanDate } from "../../../../../services/getHumanDate";
import ImageLoader from "../../../../ImageLoader";
import { getIndianPrice } from "../../../../../services/getIndianPrice";
import dayjs from "dayjs";
import { BsFillCalendarEventFill } from "react-icons/bs";

const Container = styled.div`
  padding: 0 0.5rem;
  @media screen and (min-width: 768px) {
    padding: 0 1rem;
  }
`;

const OuterGridContainer = styled.div`
  display: grid;
  grid-row-gap: 2.5rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: auto max-content;
  grid-row-gap: 1rem;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const HeadingThree = styled.p`
  font-weight: 500;
  margin-bottom: 2px;
  font-size: 13px;
  line-height: 1;
  @media screen and (min-width: 768px) {
    font-size: 16px;
  }
`;

const Subheading = styled.p`
  font-weight: 300;
  color: rgba(91, 89, 89, 1);
  margin-bottom: 0px;
  line-height: 1;
  font-size: 13px;
  @media screen and (min-width: 768px) {
    font-size: 16px;
  }
`;

const Subheading2 = styled.p`
  font-weight: 300;
  color: rgba(91, 89, 89, 1);
  margin-bottom: 0px;
  line-height: 1;
  font-size: 10px;
  color: blue;
  @media screen and (min-width: 768px) {
    font-size: 13px;
  }
`;

const StrikedCost = styled.p`
  position: relative;
  width: max-content;
  margin-bottom: 0;
  margin-right: 8px;
  font-weight: 400;
  font-size: 13px;
  line-height: 1;
  text-align: center;
  &:before {
    position: absolute;
    content: "";
    left: 0;
    top: 45%;
    right: 0;
    border-top: 1px solid;
    border-color: inherit;
    -webkit-transform: skewY(-10deg);
    -moz-transform: skewY(-10deg);
    transform: skewY(-10deg);
  }

  @media screen and (min-width: 768px) {
    font-size: 16px;
  }
`;

const Cart = (props) => {
  const getDate = (date) => {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);

    return getHumanDate(day + "/" + month + "/" + year);
  };

  return (
    <Container className="">
      <OuterGridContainer>
        <GridContainer>
          <FlexContainer style={{ alignItems: "center", gap: "0.75rem" }}>
            <BsFillCalendarEventFill style={{ fontSize: "1.5rem" }} />
            <div>
              <HeadingThree>Start Date</HeadingThree>
              <Subheading>
                {props.date
                  ? getDate(dayjs(props.date).format("YYYY-MM-DD"))
                  : null}
              </Subheading>
            </div>
          </FlexContainer>

          <FlexContainer>
            <ImageLoader
              url="media/icons/bookings/tourist.png"
              height="1.5rem"
              width="1.5rem"
              widthmobile="1.5rem"
              dimensions={{ width: 100, height: 100 }}
              margin="0"
              leftalign
            ></ImageLoader>
            <div>
              <HeadingThree>Members</HeadingThree>
              <Subheading>{props.pax ? props.pax : null}</Subheading>
            </div>
          </FlexContainer>
        </GridContainer>

        <GridContainer>
          <div></div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex" }}>
              <StrikedCost>
                {props.cost
                  ? "₹ " +
                    getIndianPrice(
                      Math.round(Math.round(props.cost) / 100) * 2
                    ) +
                    " /-"
                  : null}
              </StrikedCost>
              <HeadingThree>
                {props.cost
                  ? "₹ " +
                    getIndianPrice(Math.round(Math.round(props.cost) / 100)) +
                    " /-"
                  : null}
              </HeadingThree>
            </div>
            <Subheading style={{ fontSize: "11px" }}>Per Member</Subheading>
          </div>
        </GridContainer>
      </OuterGridContainer>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto max-content",
          marginTop: "1rem",
        }}
      >
        <div></div>
        <div>
          <Subheading2
            className="hover-pointer"
            onClick={() => props.setShowTermsModal(true)}
            style={{ color: "blue", fontSize: "10px" }}
          >
            {"Terms & Conditions"}
          </Subheading2>
        </div>
      </div>
    </Container>
  );
};

export default Cart;
