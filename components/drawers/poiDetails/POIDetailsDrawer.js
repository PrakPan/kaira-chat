import React, { useState } from 'react';
import Drawer from '../../ui/Drawer';
import POIDetailsSkeleton from './POIDetailsSkeleton';
import POIDetails from './POIDetails';
import { useEffect } from 'react';
import axiosPOIdetailsInstance from '../../../services/poi/poidetails';
import axiosPOIActivityInstance from '../../../services/poi/poiActivities';
import Slide from '../../../Animation/framerAnimation/Slide';
import { TbArrowBack } from 'react-icons/tb';
import styled from 'styled-components';

const POIDetailsDrawer = (props) => {
  const [data, setData] = useState([]);
  const [floatingButtonView, setFloatingButtonView] = useState(false);
  useEffect(() => {
    if (props.show) fetchData();
  }, [props.show]);

  function fetchData() {
    if (props.ActivityiconId) {
      axiosPOIActivityInstance
        .get(`/?id=${props.ActivityiconId}`)
        .then((res) => setData(res.data));
    } else {
      axiosPOIdetailsInstance
        .get(`/?id=${props.iconId}`)
        .then((res) => setData(res.data));
    }
  }
  const Floating = styled.div`
    position: fixed;

    bottom: 50px;
    background-color: #f7e700;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    zIndex: 1502 
    justify-content: center;
    right: 50px;
    filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04))
      drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
    cursor: pointer;
  `;
  return (
    <>
      <Drawer
        show={props.show}
        anchor={'right'}
        backdrop
        style={{ zIndex: 1501 }}
        className="font-lexend"
        onHide={props.handleCloseDrawer}
        // zIndex='1501'
      >
        {!!data.name ? (
          <POIDetails
            Topheading={props?.Topheading}
            setFloatingButtonView={setFloatingButtonView}
            floatingButtonView={floatingButtonView}
            data={data}
            handleCloseDrawer={props.handleCloseDrawer}
          />
        ) : (
          <POIDetailsSkeleton
            name={props.name}
            handleCloseDrawer={props.handleCloseDrawer}
          />
        )}
      </Drawer>
      {/* 
  {floatingButtonView && (
        <div className="absolute bottom-0 right-0 z-40">
          <Slide
            hideTime={4}
            onUnmount={() => setFloatingButtonView(!floatingButtonView)}
            isActive={floatingButtonView}
            direction={5}
            duration={2}
            xdistance={-50}
          >
            <Floating>
              <TbArrowBack
                style={{ height: '32px', width: '32px' }}
                cursor={'pointer'}
                onClick={(e) => {
                  props.handleCloseDrawer(e);
                }}
              />
            </Floating>
          </Slide>
        </div>
      )} */}
    </>
  );
};

export default POIDetailsDrawer;
