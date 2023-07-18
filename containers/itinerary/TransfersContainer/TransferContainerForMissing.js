import React, { useMemo, useState } from 'react';
import Button from '../../../components/Button';
import Slide from '../../../Animation/framerAnimation/Slide';
import axiosLeadChat from '../../../services/leads/chat.js';
import { useRouter } from 'next/router';
const TransferContainerForMissing = ({
  cityname1,
  cityname2,
  email,
  name,
  phone,
}) => {
  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isSucess, setIsSucess] = useState({
    value: false,
    errorMsg: '',
  });
  const getCurrentUrl = () => {
    const router = useRouter();
    const { asPath } = router;

    return `${process.env.NEXT_PUBLIC_BASE_URL}${asPath}`;
  };
  const currentUrl = getCurrentUrl();
  // request for get in touch

  const _GetInTouch = () => {
    setLoading(true);

    axiosLeadChat
      .post('/', {
        email: email,
        name: name,
        phone: phone,
        source: 'Itinerary',

        query_message: `I need help in completing booking - Transfer from ${cityname1} to ${cityname2} for my itinerary - ${currentUrl}`,
      })
      .then((res) => {
        //  props.getPaymentHandler();

        setIsSucess({
          value: true,
          errorMsg: res.data.message,
        });
        setIsShow(true);
        setLoading(false);
      })
      .catch((err) => {
        // setUpdateLoadingState(false);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // The response headers
        }
        setIsSucess({
          value: false,
          errorMsg: '',
        });
        setIsShow(false);
        setLoading(false);
        window.alert('There seems to be a problem, please try again!', err);
      });
  };
  const SlideComponent = useMemo(
    () => (
      <Slide
        hideTime={8}
        onUnmount={() =>
          setIsSucess({
            value: false,
            errorMsg: '',
          })
        }
        isActive={isSucess.value}
        direction={-2}
        duration={1.3}
        ydistance={25}
      >
        <div className="text-white  font-lexend px-2 py-1 border-2 border-red bg-green-500 rounded-lg  text-center font-normal text-sm ">
          {isSucess.errorMsg}
        </div>
      </Slide>
    ),
    [isSucess.value]
  );
  return (
    <>
      <div className=" fixed right-[10px] top-[50px] z-[200] ">
        {isSucess.value && SlideComponent}
      </div>
      <div className="my-3 lg:ml-7 ml-2 flex flex-col justify-center items-left">
        {isShow ? (
          <div>
            We'll get in touch with in the next 2 hours to complete this booking
          </div>
        ) : (
          <div>
            Transfer options not found for {cityname1} to {cityname2}
          </div>
        )}
        {!isShow && (
          <Button
            onclick={() => _GetInTouch(cityname1, cityname2)}
            loading={loading}
            fontWeight="500"
            borderColor="black"
            borderWidth="1px"
            bgColor="#F7e700"
            borderRadius="6px"
            margin="1rem 0 0 0"
            padding="0.5rem 0.75rem"
          >
            Get in touch
          </Button>
        )}
      </div>
    </>
  );
};

export default TransferContainerForMissing;
