import app from "./src/app";

// Start Server
const startServer = () => {
  const PORT = process.env.PORT || 3010;

  app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
  });
};
startServer();
