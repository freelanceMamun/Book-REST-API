import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";

// Start Server

const startServer = async () => {
  const PORT = config.PORT || 3010;

  await connectDB();

  app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
  });
};
startServer();
