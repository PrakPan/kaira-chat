import Image from "next/image";
import styled from "styled-components";

export const StyledBox = styled.div`
  width: 124px;
  height: 124px;
  min-width: 124px;
  max-width: 124px;
  display: flex;
  padding: 20px;
  flex-direction: column;
  border-radius: 12px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: ${({ is_selected }) => (is_selected ? "#FFFFE7" : "#FBFBFB")};
  border: 1px solid #F7E700;
  box-shadow: 0 4px 34px 1px rgba(195, 195, 195, 0.25);
  flex-shrink: 0; 
`;

const groups = ["Solo", "Couple", "Friends", "Family"];

const ScrollContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  overflow-x: auto; 
  padding-bottom: 8px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const GroupComponent = (props) => {
  return (
    <ScrollContainer>
      {groups.map((item) => (
        <StyledBox
          key={item}
          is_selected={props.groupType === item}
          onClick={() => props._handleShowPax(item)}
        >
          <Image src={`/${item.toLowerCase()}.svg`} width={40} height={40} alt={item} />
          <div className="text-md font-500 leading-xl">{item}</div>
        </StyledBox>
      ))}
    </ScrollContainer>
  );
};

export default GroupComponent;
