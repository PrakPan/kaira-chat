const restartBot = () => {
    if (typeof window === "undefined" || typeof window.createBot !== "function") {
      console.warn("Bot script not ready yet.");
      return;
    }
  
    const userId = localStorage.getItem("user_id");
    const name = localStorage.getItem("name") || "";
    const phone = localStorage.getItem("phone");
    const email = localStorage.getItem("email");
    const [first_name = "", last_name = ""] = name.split(" ");
  
    const contactDetail =
      userId && first_name && phone && email
        ? { id: userId, first_name, last_name, phone, email }
        : null;
  
    const config = {
      botId: "680b71a4a47fab68f44972ab",
      ...(contactDetail ? { contactDetail } : { internalLoad: true }),
    };
  
    try {
      window.createBot(config);
    } catch (err) {
      console.error("Failed to start bot:", err);
    }
  };
  export default restartBot