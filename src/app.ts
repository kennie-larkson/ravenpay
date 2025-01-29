import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import transactionRoutes from "./routes/transactionRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to Ravenpay!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
