import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;

  padding: 10px 0px 20px 0px;
  color: #01202b;
`;
export const TransparentButton = styled.button`
  border: 1.5px solid #000000;
  filter: drop-shadow(0px 1px 0px #f0f0f0);
  border-radius: 6px;
  display: flex;
  font-weight: 550;
  font-size: 13px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  margin: 10px 0px 10px 0px;
`;
export const TransportContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const TransferInfo = styled.div`
  padding-top: 10px;
`;
export const Timecontainer = styled.div`
  font-weight: 500;
  font-size: 13px;
`;
export const Line = styled.div`
  border-style: none none solid none;
  border-color: #e4e4e4;
  border-width: 1px;
`;

export const Navbar = styled.div`
  position: ${({ sticky }) => (sticky ? 'sticky' : 'inherit')};
  top: 70px;
  display: flex;
  ::-webkit-scrollbar {
    display: none;
  }

  overflow-x: scroll;
  align-items: center;
  z-index: ${({ sticky }) => (sticky ? '1000' : '997')};
  margin: 0px -20px 0px -20px;
  background-color: white;
`;
