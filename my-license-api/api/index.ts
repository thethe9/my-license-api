import express from "express";
import cors from "cors";
import router from "../routes";

const PORT = process.env.PORT || 9000;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
