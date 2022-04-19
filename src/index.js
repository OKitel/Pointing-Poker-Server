import express from "express";
import * as path from "node:path";
import mongoose from "mongoose";
import expressWsModule from "express-ws";
import { gameRouter } from "./game/gameRouter.js";
import { playerRouter } from "./player/playerRouter.js";
import fileUpload from "express-fileupload";
import cors from "cors";
import { webSocketFunction } from "./realtime/WebSocketFunction.js";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USER_NAME = process.env.DB_USER_NAME;
const DB_NAME = process.env.DB_NAME;

const staticPath = path.resolve("static");
const PORT = process.env.PORT || 5000;
const DB_URL = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@cluster0.e1biq.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const app = express();
const expressWs = expressWsModule(app);
export const aWss = expressWs.getWss();

const router = express.Router();
router.ws("/", webSocketFunction);

app.use(cors());
app.use(fileUpload({}));
app.use(express.json());
app.use("/ws", router);
// app.ws("/ws", webSocketFunction);
app.use("/game", gameRouter);
app.use("/player", playerRouter);
app.use(express.static(staticPath));
app.use("/", (req, res) => {
  res.end("<h1>pointing-poker-server</h1>");
});

async function startApp() {
  try {
    await mongoose.connect(DB_URL);
    app.listen(PORT, () => console.log(`Server start on port:`, PORT));
  } catch (error) {
    console.log(error);
  }
}
startApp();
