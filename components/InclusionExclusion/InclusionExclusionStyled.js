import styled from 'styled-components';

export const MainHeading = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: ${(props) => (props.size ? props.size : '18px')};

  color: #01202b;
  @media screen and (min-width: 768px) {
    padding: 1rem;
  }
`;
export const SubHeading = styled.div`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: ${(props) => (props.size ? props.size : '18px')};

  color: #01202b;
  @media screen and (min-width: 768px) {
    padding: 0rem;
  }
`;

export const RowElementContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`;

export const ColElementContainer = styled.div`
  display: flex;
  justify-content: space-between;

  flex-direction: column;
`;

export const LinkComp = styled.a`
  font-family: 'Poppins';
  text-decoration: none;
  overflow: hidden;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;

  line-height: 16px;
  /* identical to box height, or 133% */

  color: #1763f8;
`;
