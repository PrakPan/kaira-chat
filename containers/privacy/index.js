import content from "../../public/content/privacypolicy";
import styled from "styled-components";
import YellowContainer from "../contact/YellowContainer";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import SubHeading from "../../components/newheading/heading/Index";
import { useEffect } from "react";
import { useState } from "react";
import urls from "../../services/urls";



const Container = styled.div`

  text-align: center;
  padding: 10vh 2rem 2rem 2rem;

  @media screen and (min-width: 768px) {
    padding: 10vh 4rem 4rem 4rem;
  }

 





`
const Heading = styled.p`
  font-size: 3.25rem;
  font-weight: 700;
  margin: 1.5rem 0;
  @media screen and (min-width: 768px) {
    font-size: 5rem;
  }
`;
const StyleListItem = styled.li`
  text-align: left;
  font-weight: 300;
  font-size: 1rem;
`;
const TextContainer = styled.p`
  text-align: left;
  font-weight: 300;
  font-size: 1rem;
`;

 

const Privacy = (props) => {
 
  let cards = [];
  const [CardJSX, setCardJSX] = useState(false);
  useEffect(() => {
    for (var i = 0; i < content.length; i++) {
      if (content[i].heading) {
        cards.push(
          <Heading key={content[i].heading} className="font-opensans">{content[i].heading}</Heading>
        );
      } else {
        cards.push(
          <SubHeading
          key={content[i].subheading}
            className="font-opensans"
            margin="2rem auto "
            font-weight="400"
            text-align="center"
          >
            {content[i].subheading}
          </SubHeading>
        );
      }

      for (var j = 0; j < content[i].content.length; j++) {
        if (content[i].content[j].array) {
          for (var k = 0; k < content[i].content[j].array.length; k++) {
            cards.push(
              <StyleListItem key={content[i].content[j].array[k]} className="font-opensans">
                {content[i].content[j].array[k]}
              </StyleListItem>
            );
          }
        } else {
          cards.push(
            <TextContainer key={content[i].content[j].text} className="font-opensans">
              {content[i].content[j].text}
            </TextContainer>
          );
        }
      }
    }
    setCardJSX(cards);
  }, []);

  const _openWhatsapp = () => {
    var win = window.open('https://wa.me/message/K7OY4SEPSVZXD1', '_blank');
    win.focus();
}
  //buttons part to be removed
  

  return (
   
    <YellowContainer desktopWidth="70%" mobileWidth="95%">
      <div>
      <Container>
        {CardJSX}
        {/* <Button
          borderStyle="none"
          margin="1rem auto"
          bgColor="#075E54"
          borderRadius="5px"
          color="white"
          onclick={_openWhatsapp}
          onclickparam={null}
          boxShadow
        >
          <FontAwesomeIcon
            icon={faWhatsapp}
            style={{ marginRight: "0.5rem" }}
          />
          WhatsApp
        </Button>

        <Button
          link={"/404"}
          hoverBgColor="black"
          bgColor="#F7E700"
          borderRadius="2rem"
          padding="0.5rem 1.5rem"
          borderStyle="none"
          hoverColor="white"
          boxShadow
        >
          Check Out!
        </Button>

        <Button
          external_link={"/404"}
          borderRadius="2rem"
          margin="1rem auto"
          borderWidth="1px"
          padding="0.5rem 1rem"
          color="#212529"
          fontWeight="300"
          hoverBgColor="black"
          hoverColor="white"
          fontSize="1rem"
          boxShadow
        >
          Read More
        </Button> */}
        <ChatWithUs link={urls.CONTACT} />
      </Container>
      </div>
    </YellowContainer>
    
  );
};

export default Privacy;


//previous

// import content from "../../public/content/privacypolicy";
// import styled from "styled-components";
// import YellowContainer from "../contact/YellowContainer";
// import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
// import SubHeading from "../../components/heading/Heading";
// import { useEffect } from "react";
// import { useState } from "react";


// const Container = styled.div`
//   text-align: center;
//   padding: 10vh 2rem 2rem 2rem;

//   @media screen and (min-width: 768px) {
//     padding: 10vh 4rem 4rem 4rem;
//   }
// `;
// const Heading = styled.p`
//   font-size: 3.25rem;
//   font-weight: 700;
//   margin: 1.5rem 0;
//   @media screen and (min-width: 768px) {
//     font-size: 5rem;
//   }
// `;
// const StyleListItem = styled.li`
//   text-align: left;
//   font-weight: 300;
//   font-size: 1rem;
// `;
// const TextContainer = styled.p`
//   text-align: left;
//   font-weight: 300;
//   font-size: 1rem;
// `;

// const Privacy = (props) => {
 
//   let cards = [];
//   const [CardJSX, setCardJSX] = useState(false);
//   useEffect(() => {
//     for (var i = 0; i < content.length; i++) {
//       if (content[i].heading) {
//         cards.push(
//           <Heading className="font-opensans">{content[i].heading}</Heading>
//         );
//       } else {
//         cards.push(
//           <SubHeading
//             className="font-opensans"
//             margin="2rem auto "
//             font-weight="400"
//             text-align="center"
//           >
//             {content[i].subheading}
//           </SubHeading>
//         );
//       }

//       for (var j = 0; j < content[i].content.length; j++) {
//         if (content[i].content[j].array) {
//           for (var k = 0; k < content[i].content[j].array.length; k++) {
//             cards.push(
//               <StyleListItem className="font-opensans">
//                 {content[i].content[j].array[k]}
//               </StyleListItem>
//             );
//           }
//         } else {
//           cards.push(
//             <TextContainer className="font-opensans">
//               {content[i].content[j].text}
//             </TextContainer>
//           );
//         }
//       }
//     }
//     setCardJSX(cards);
//   }, []);

//   return (
//     <YellowContainer desktopWidth="70%" mobileWidth="95%">
//       <Container>
//         {CardJSX}
//         <ChatWithUs link="/contact" />
//       </Container>
//     </YellowContainer>
//   );
// };

// export default Privacy;

