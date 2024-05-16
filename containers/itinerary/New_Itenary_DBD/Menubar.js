import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  width: ${(props) => props.totalWidth}px;
`;

const ScrollButton = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
`;

const HorizontalBar = ({ width, height, content }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [totalWidth, setTotalWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setTotalWidth(content.reduce((acc, cur) => acc + cur.width, 0));
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [content]);

  const handleScroll = (e) => {
    setScrollPosition(e.target.scrollLeft);
  };

  const handleScrollLeft = () => {
    setScrollPosition(Math.max(scrollPosition - width, 0));
  };

  const handleScrollRight = () => {
    setScrollPosition(Math.min(scrollPosition + width, totalWidth - width));
  };

  return (
    <Container width={width} height={height} onScroll={handleScroll}>
      <ScrollButton onClick={handleScrollLeft}>{"<"}</ScrollButton>
      <Content totalWidth={totalWidth}>
        {content.map((item, index) => (
          <div key={index} style={{ width: item.width }}>
            {item.content}
          </div>
        ))}
      </Content>
      <ScrollButton onClick={handleScrollRight}>{">"}</ScrollButton>
    </Container>
  );
};

export default HorizontalBar;
