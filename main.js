import express from "express";
import axios from "axios";
import cors from "cors";

import initRoutes from "./routes/index.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

initRoutes(app);

app.use((err, req, res, next) => {
  // console.log(err.message);
  res.status(404).json({ origin: process.env.NETTRUYEN_URL, body: null, error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
