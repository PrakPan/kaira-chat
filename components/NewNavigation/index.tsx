import { useNavigationMarker, NavigationMarker } from "./NavigationMarker";
import styled from "styled-components";
import { NavigationLink } from "./NavigationLink";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Container = styled.div`
  min-width: 100%;
  width: fit-content;
  position: sticky;
  top: 0;
  z-index: 2;

  display: flex;
  align-items: center;
  background-color: white !important;
  border-bottom: 1px solid #e5e3de;
  box-sizing: border-box;
`;

const InnerContainer = styled.div`
  display: flex;
  max-width: 1200px;
  width: 100%;
  position: relative;
  height: 100%;
`;

export const Navigation = ({ items, BarName, ClickHandler, selectedItem, trackSectionViewed }) => {
  const router = useRouter();
  const { markerPos, ...markerHandlers } = useNavigationMarker();
  
  const getSelectedId = () => {
    if (!selectedItem) return `${items[0].id}`;
    
    const foundItem = items.find(item => item.label === selectedItem);
    return foundItem ? `${foundItem.id}` : `${items[0].id}`;
  };

  const [selectedTab, setSelectedTab] = useState(getSelectedId());


  useEffect(() => {
    const newSelectedId = getSelectedId();
    if (newSelectedId !== selectedTab) {
      setSelectedTab(newSelectedId);
    }
  }, [selectedItem]);

  const handleTabClick = (item, index) => {
    if (ClickHandler) {
      ClickHandler(item.label);
    }
    
    if (trackSectionViewed) {
      trackSectionViewed(router.query.id, item.label);
    }
    
    setSelectedTab(`${item.id}`);
  };

  return (
    <Container>
      <InnerContainer>
        {items.map((item, index) => (
          <NavigationLink
            {...markerHandlers}
            onClick={() => handleTabClick(item, index)}
            isSelected={selectedTab === `${item.id}`}
            item={item}
            BarName={BarName}
            setSelectedTab={setSelectedTab}
            key={index}
            className={index === items.length - 1 ? "last-navigation-link" : ""}
          >
            {item.label}
          </NavigationLink>
        ))}

        <NavigationMarker x={markerPos.x} height={2} width={markerPos.width} />
      </InnerContainer>
    </Container>
  );
};