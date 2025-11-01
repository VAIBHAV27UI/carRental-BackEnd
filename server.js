import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import userRoute from "./routes/user.route";
import adminRoute from "./routes/admin.route.js";
import connectDB from "./config/db.js";
import vehicleRoute from "./routes/vehicle.route.js";
import bookingRoute from "./routes/booking.route";
import paymentRoute from "./routes/payment.route.js";
import blogRoute from "./routes/blog.route.js";

// initialize express app
const app = express();

// db connect
connectDB();

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://car-rental-front-end-sooty.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const port = process.env.PORT || 5000;

app.use(process.env.API_PREFIX, userRoute);
app.use(process.env.API_ADMIN, adminRoute);
app.use(process.env.API_CAR, vehicleRoute);
app.use(process.env.API_BOOKING, bookingRoute);
app.use(process.env.API_PAYMENT, paymentRoute);
app.use(process.env.API_BLOG, blogRoute);

app.get("/", (req, res) => res.send("Server is running"));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
