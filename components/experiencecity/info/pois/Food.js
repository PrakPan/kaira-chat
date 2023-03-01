import React, { useState } from "react";
import styled from "styled-components";
import S3Icon from "../S3Icon";
import ImageLoader from "../../../ImageLoader";
import POIModal from "../../../modals/poi/Index";
import POIDetailsDrawer from "../../../drawers/poiDetails/POIDetailsDrawer";
import { Drawer } from "@material-ui/core";

const Container = styled.div`
  width: 100%;
  &:hover {
    cursor: pointer;
  }
`;
const IconTagLine = styled.p`
  font-weight: 400;
  margin: 1rem auto 0.5rem auto;
  font-size: 0.75rem;
  text-align: center;
`;

const Icon = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const handleCloseDrawer = () => {
    setShowDrawer(false);
  };
  const _handleOpen = (event) => {
    if (props.drawer) {
      setShowDrawer(!showDrawer);
    } else props._openPoiModal(props.icon);
  };

  return (
    <Container onClick={(event) => _handleOpen(event)}>
      <ImageLoader
        url={props.icon.image}
        dimensions={{ width: 900, height: 900 }}
        dimensionsMobile={{ width: 900, height: 900 }}
        location={props.location}
        icon={props.icon}
      ></ImageLoader>
      <IconTagLine className="font-opensans">{props.icon.name}</IconTagLine>
      <POIModal show={showModal} onHide={() => setShowModal(false)} />
      <POIDetailsDrawer
        show={showDrawer}
        iconId={props.icon.id}
        handleCloseDrawer={() => setShowDrawer(false)}
      />
    </Container>
  );
};

export default React.memo(Icon);
