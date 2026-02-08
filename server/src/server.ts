import dotenv from "dotenv";
import app from "./app";
import { testConnection } from "./config/db";
dotenv.config();

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Test db connection
    await testConnection();

    app.listen(PORT, () => {
      console.log(`Artist management service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
