import React, { useRef } from "react";
import useStackedComponents from "../../hooks/useStackedComponents";

const StackedComponents = () => {
  const component1Ref = useRef(null);
  const component2Ref = useRef(null);
  const component3Ref = useRef(null);

  const { styleForComponent, totalHeight } = useStackedComponents([
    component1Ref,
    component2Ref,
    component3Ref,
  ]);

  return (
    <div style={{ height: totalHeight }}>
      <div ref={component1Ref} style={styleForComponent(0)}>
        <div style={{ height: "60px" }}>comp 2</div>
      </div>
      <div ref={component2Ref} style={styleForComponent(1)}>
        <div style={{ height: "60px" }}>comp 2</div>
      </div>
      <div ref={component3Ref} style={styleForComponent(2)}>
        <div style={{ height: "60px" }}>comp 2</div>
      </div>
    </div>
  );
};

export default StackedComponents;
