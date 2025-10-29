import "dotenv/config";
import { mongoDBConnection } from "./db/MongoDBConnection.js";
import { setupServer } from "./server.js";

async function starter() {
  await mongoDBConnection();
  setupServer();
}

starter();
