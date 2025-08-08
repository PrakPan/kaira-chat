import styled from "styled-components";

export const StyledHeading = styled.div`
  color: var(--text-colors-text-focused, #000);

  /* Body/Body | Regular */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
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
  padding: 8px var(--XXL, 20px);
  justify-content: center;
  align-items: center;

  border-radius: 50px;
  border: 1px solid var(--Text-Colors-Stroke, #e5e5e5);
   ${({ clicked }) =>
    clicked &&
    `
      border: 1px solid var(--primary-colors-primary-yellow-color, #f7e700);
      background: var(--primary-colors-primary-yellow-color, #f7e700);
    `}
`;

export const StyledFlexWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  gap: 12px var(--L, 12px);
  align-self: stretch;
  flex-wrap: wrap;
`;
