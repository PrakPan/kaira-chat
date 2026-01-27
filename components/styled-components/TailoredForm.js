import styled from "styled-components";

export const StyledHeading = styled.div`
  color: var(--text-colors-text-focused, #000);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
`;

export const StyledContainer = styled.div`
  display: flex;
  width: 100%;
  padding: var(--L, 12px);
  align-items: center;
  gap: 10px;
  position: relative;
  border-radius: var(--S, 6px);
  border: 1px solid var(--Text-Colors-Stroke, #e5e5e5);
`;

export const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 86px;
  position: relative;
`;

export const StyledFlexWrap = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  
  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
`;