import styled from 'styled-components';
const Color = {
 yellow : '#F7E700',
 dark : 'black',
 gray : 'gray',
}
export const ScrollBar=styled.div`

 /* width: 100%; */
 height: 100vh;
    overflow-y: auto;

&::-webkit-scrollbar {
  width: 0.6rem;
  
}

&::-webkit-scrollbar-track {
  background: ${Color.yellow};
  border-radius: 100vw;
  margin-block: 0.5em;

}

&::-webkit-scrollbar-thumb {
  background-color: ${Color.dark};
  /* border: 0.25em solid white; */
  border-radius: 100vw;
  height: 6rem;
  &:hover {
  background: ${Color.gray};
}
}

`
// /* scrollbar */
// ::-webkit-scrollbar {
//   width: 0.6rem;
  
// }

// ::-webkit-scrollbar-track {
//   background: #F7E700;
//   border-radius: 100vw;
//   margin-block: 0.5rem;
// }

// ::-webkit-scrollbar-thumb {
// background-color: black;
// /* border: 0.025em solid #F7E700;*\
//   border-radius: 100vw;
//   height: 6rem;
//   /* -webkit-width:5em; */

// }

// ::-webkit-scrollbar-thumb:hover {
//   background: #F7E700;
// }




  /* scrollbar */
  /* ::-webkit-scrollbar {
    width: 1em;
  }
  
  ::-webkit-scrollbar-track {
    background: gray;
    border-radius: 100vw;
    margin-block: 0.5em;
  }
  
 ::-webkit-scrollbar-thumb {
  background-color: whitesmoke;
  border: 0.25em solid white;
    border-radius: 100vw;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: black;
  } */


    /* scrollbar */
//  ::-webkit-scrollbar {
//   width: 0.6rem;
 
// }

// ::-webkit-scrollbar-track {
//   background: #F7E700;
//   border-radius: 100vw;
//   margin-block: 0.5rem;
// }

// ::-webkit-scrollbar-thumb {
// background-color: black;
// /* border: 0.025em solid #F7E700; */
//   border-radius: 100vw;
//   height: 6rem;
//   /* -webkit-width:5em; */

// }

// ::-webkit-scrollbar-thumb:hover {
//   background: #F7E700;
// }