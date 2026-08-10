import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

import app from "./app.js";
import connectDB from "./config/database.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
