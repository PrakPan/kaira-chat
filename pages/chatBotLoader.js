// import { useEffect } from "react";

// export default function ChatbotLoader() {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://app.crmone.com/assets/scripts/integrate-widgets.js";
//     script.async = true;
//     script.onload = () => {
//       if (typeof window.createBot === "function") {
//         console.log("CRMOne script loaded successfully.");
//         const userId = localStorage.getItem("user_id");
//         const fullName = localStorage.getItem("name") || "";
//         const nameParts = fullName.trim().split(" ");
//         const last_name = nameParts.pop() || "";
//         const first_name = nameParts.join(" ");
//         const phone = localStorage.getItem("phone") || "";
//         const email = localStorage.getItem("email") || "";
//         const config = {
//           botId: "680b71a4a47fab68f44972ab",
//         };

//         // if (userId) {
//         //   config.user = {
//         //     id: userId,
//         //     first_name,
//         //     last_name,
//         //     phone,
//         //     email,
//         //   };
//         // }

//         window.createBot(config);
//       } else {
//         console.error("CRMOne: createBot is not defined after script load.");
//       }
//     };

//     document.body.appendChild(script);
//   }, []);


//   return (
//     <style jsx global>{`
//       #chatbot-iframe-container {
//         bottom: 0;
//         right: 0;
//         margin-right: 20px;
//         margin-bottom: 10px;
//         z-index: 1024 !important;
//         position: fixed;
//       }

//       #chatbot-iframe-container iframe {
//         width: 100%;
//         height: 100%;
//         border: none;
//       }

//       @media (max-width: 768px) {
//         #chatbot-iframe-container {
//           margin-bottom: 60px;
//           margin-right: 16px;
//         }
//       }
//     `}</style>
//   );
// }
