import React from 'react';
import Modal from './ui/Modal';
import ButtonYellow from './ButtonYellow';
import { isDateOlderThanCurrent } from '../helper/isDateOlderThanCurrent';
import { useRouter } from 'next/router';

const MakeYourPersonalised = ({ date, onHide, clickHandler }) => {
  const router = useRouter();
  const _handleTailoredRedirect = (e) => {
    router.push('/tailored-travel');
  };
  return (
    <Modal
      centered
      show={isDateOlderThanCurrent(date)}
      mobileWidth="90%"
      width="20%"
      backdrop
      closeIcon={true}
      onHide={onHide}
      borderRadius={'12px'}
    >
      <div className="flex lg:h-[30vh] h-[40vh] justify-center items-center ">
        <ButtonYellow
          onClick={() =>
            clickHandler ? clickHandler() : _handleTailoredRedirect()
          }
        >
          <div className="text-[#01202B] "> make your personalised trip</div>
        </ButtonYellow>
      </div>
    </Modal>
  );
};

export default MakeYourPersonalised;
