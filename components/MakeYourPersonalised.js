import React from 'react';
import Modal from './ui/Modal';
import ButtonYellow from './ButtonYellow';
import { isDateOlderThanCurrent } from '../helper/isDateOlderThanCurrent';
import { useRouter } from 'next/router';
import TailoredFormMobileModal from './modals/TailoredFomrMobile';
import TailoredForm from '../components/tailoredform/Index';
import useMediaQuery from '../hooks/useMedia';
import styled from 'styled-components';

const MakeYourPersonalised = ({ date, onHide, clickHandler, show = false }) => {
  let isPageWide = useMediaQuery('(min-width: 768px)');
  const router = useRouter();
  const Heading = styled.div`
    font-weight: 600;
    font-size: 20px;
    padding: 0px 0px 0px 0px;

    text-align: center;
    margin-bottom: 8px;
  `;
  const _handleTailoredRedirect = (e) => {
    router.push('/tailored-travel');
  };
  return (
    isDateOlderThanCurrent(date) ||
    (show && (
      <Modal
        centered
        show={isDateOlderThanCurrent(date) || show}
        mobileWidth="90%"
        width="0%"
        backdrop
        closeIcon={true}
        onHide={onHide}
        borderRadius={'12px'}
        height={!isPageWide && '100%'}
        animation={false}
        width={isPageWide ? '400px' : '100%'}
      >
        <TailoredForm tailoredFormModal onHide={onHide}></TailoredForm>
      </Modal>
    ))
  );
};

export default MakeYourPersonalised;
