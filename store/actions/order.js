import * as actionTypes from "./actionsTypes";
import axios from "axios";

// Action creators
export const setUpdateLoading = (isLoading) => ({
  type: SET_UPDATE_LOADING,
  payload: isLoading,
});

export const setOrderDetails = (orderDetails) => {
  return {
    type: actionTypes.ORDER_SETORDERDETAILS,
    orderDetails: orderDetails,
  };
};

export const startCreatingOrder = () => {
  return {
    type: actionTypes.ORDER_CREATIONSTARTED,
  };
};

export const orderCreated = () => {
  return {
    type: actionTypes.ORDER_CREATED,
  };
};

export const orderPlaced = () => {
  return {
    type: actionTypes.ORDER_PLACED,
  };
};

export const couponApplied = (coupon, offerid) => {
  return {
    type: actionTypes.ORDER_COUPONAPPLIED,
    couponCode: coupon,
    offerId: offerid,
  };
};

export const couponInvalid = () => {
  return {
    type: actionTypes.ORDER_COUPONAINVALID,
  };
};

export const setSaleId = (saleid) => {
  return {
    type: actionTypes.ORDER_SETSALEID,
    saleId: saleid,
  };
};

export const applyCoupon = (coupon) => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    axios
      .get(
        "https://suppliers.tarzanway.com/payment/coupon/validate/?coupon_code=" +
          coupon +
          "&sale=" +
          getState().experience.saleId +
          "&user_email=" +
          getState().auth.email
      )
      .then((res) => {
        if (res.data.is_coupon_valid) {
          dispatch(couponApplied(coupon, res.data.amount_discounted));
        } else {
          dispatch(couponInvalid());
        }
      })
      .catch((err) => {});
  };
};

export const startPayment = (amount) => {
  //Load razorpay
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
  let razorpayOptions = {};
  return (dispatch, getState) => {
    dispatch(startCreatingOrder()); //Order creation started
    const token = getState().auth.token; //Get token from auth slice
    //Generate payment info payload
    const payementInfo = {
      amount: amount,
      currency: "INR",
      sale_id: getState().experience.saleId,
      description: getState().experience.experience,
      notes: {
        date: getState().experience.experience,
        experience_name: getState().experience.experience,
        number_of_people: getState().experience.pax,
        name: getState().auth.name,
        email: getState().auth.email,
        phone: getState().auth.phone,
      },
    };
    //Store offer details
    // let couponInfo = {

    if (getState().experience.couponApplied) {
      payementInfo["coupon_code"] = getState().experience.couponCode;
    }

    //genreate order on TTW backend
    axios
      .post("https://apis.tarzanway.com/pay/checkout/", payementInfo, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        dispatch(orderCreated());
        //Razorpay payload
        razorpayOptions = {
          amount: data.data.amount,
          currency: data.data.currency,
          name: "The Tarzan Way Payment Portal",
          description: data.data.description,
          image:
            "https://bitbucket.org/account/thetarzanway/avatar/256/?ts=1555263480",
          order_id: data.data.order_id,
          //Payment successfull handler passed to razorpay
          handler: function (response) {
            axios
              .post(
                "https://apis.tarzanway.com/pay/capture/",
                { ...response },
                { headers: { Authorization: `Bearer ${token}` } }
              )
              .then((data) => {
                dispatch(orderPlaced());
                window.location.href = "/thank-you";
              })
              .catch((err) => {
                alert("There was an error, please try again :(");
                window.location.href =
                  "/experiences/" + getState().experience.experienceId;
              });
          },
          //User details will be present as user is logged in
          prefill: {
            name: getState().auth.name,
            email: getState().auth.email,
            contact: getState().auth.phone,
          },
          theme: {
            color: "#F7e700",
          },
        };
        //start razorpay window
        var rzp1 = new window.Razorpay(razorpayOptions);
        rzp1.open();
      });
  };
};
