import { OverlayScrollbars } from "overlayscrollbars";
import "overlayscrollbars/overlayscrollbars.css";
import React, { useEffect, useRef, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import styled from "styled-components";
import axioscouponfetchinstance from "../../../services/itinerary/coupon/couponlist";
import { PuffLoader } from "react-spinners";
import { getIndianPrice } from "../../../services/getIndianPrice";

const Countainer = styled.div`
  padding-bottom: 1rem;
`;

const Header = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
`;

const Body = styled.div`
  padding: 1rem;
`;

const FlexBox = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const Heading = styled.div`
  /* H4 token · 17/1.2/700/-0.015em */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.2;
  .text {
    /* Small body · 13/1.5/400 — supporting caption */
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.5;
    color: #7a7a7a;
  }
  &.sub-heading {
    /* Small body · 13/1.5/400 */
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.5;
    padding-bottom: 0.5rem;
  }
`;

const CouponContainer = styled.div`
  border-radius: 10px;
  margin-bottom: 0.5rem;
  border: 1px solid #efeded;
  display: grid;
  grid-template-columns: ${(props) =>
    props.couponlength > 13 ? "auto auto" : "8.5rem auto"};
  cursor: pointer;
  align-items: center;
  min-height: 35px;

  @media screen and (min-width: 768px) {
    grid-template-columns: ${(props) =>
      props.couponlength > 13 ? "auto auto" : "10rem auto"};
  }

  .coupon {
    /* Caption-ish · 12/1.4/600/0.04em — coupon code chip */
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    line-height: 1.4;
    background: #f7e70047;
    height: 100%;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: left;
    border-radius: 10px 0 0px 10px;
    clip-path: polygon(100% 0%, 92% 50%, 100% 100%, 0 100%, 0% 50%, 0 0);
    padding-inline: 1rem;
    text-align: left;
    @media screen and (min-width: 768px) {
      font-size: 13px;
      letter-spacing: 0.02em;
    }
  }
  .text {
    /* Small body shrunk · 12/1.4/400 — supporting copy */
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #615f5f;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
    padding: 0.5rem;
  }
`;

const CouponSlide = (props) => {
  const [couponList, setCouponList] = useState([]);
  const [loading, setLoading] = useState(false);
  let scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      OverlayScrollbars(scrollRef.current, {
        overflow: {
          x: "hidden",
          y: "scroll",
        },
        scrollbars: {
          autoHide: "scroll",
        },
      });
    } else {
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    axioscouponfetchinstance
      .get("/?itinerary_id=" + props.itinerary_id)
      .then((res) => {
        setLoading(false);
        setCouponList([...res.data.data, ...res.data.data, ...res.data.data]);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  return (
    <Countainer>
      <Header>
        <FlexBox>
          <BiArrowBack
            style={{ fontSize: "2rem", cursor: "pointer" }}
            onClick={() => props.closeCouponSlide()}
          />
          <Heading>
            <div>Apply Coupon</div>
            <div className="text">
              Trip Cost: ₹{" "}
              <>
                {props?.payment?.pay_only_for_one ||
                props?.payment?.show_per_person_cost
                  ? getIndianPrice(
                      Math.round(
                        Math.round(props.payment.per_person_discounted_cost) /
                          100
                      )
                    )
                  : getIndianPrice(
                      Math.round(
                        Math.round(props.payment.discounted_cost) / 100
                      )
                    )}
                {"/-"}
              </>
            </div>
          </Heading>
        </FlexBox>
        {props.couponJSX}
      </Header>

      <FlexBox
        style={{
          justifyContent: "center",
          height: "380px",
          display: loading ? "flex" : "none",
        }}
      >
        <PuffLoader color="black" size={65} />
      </FlexBox>
      <div
        style={{
          display: !loading ? "initial" : "none",
        }}
      >
        <Body>
          <Heading className="sub-heading">Applicable Coupons</Heading>
          <div
            style={{
              maxHeight: "20rem",
            }}
            ref={scrollRef}
          >
            <div>
              {couponList.map((e) => (
                <CouponContainer
                  couponlength={e.code.length}
                  onClick={() => {
                    props.setInputValue(e.code);
                    props.submitCoupon(e.code);
                  }}
                >
                  <div className="coupon">{e.code}</div>
                  <div className="text">
                    <div>{e.description}</div>
                    {e.discount ? (
                      <div>
                        {e.description ? "(" : ""}save ₹{" "}
                        <>
                          {getIndianPrice(
                            Math.round(Math.round(e.discount) / 100)
                          )}
                          {"/-"}
                        </>
                        {e.description ? ")" : ""}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </CouponContainer>
              ))}
            </div>
          </div>
        </Body>
      </div>
    </Countainer>
  );
};

export default CouponSlide;
