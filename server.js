import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import connectDB from "./config/db.js";

import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import vehicleRoute from "./routes/vehicle.route.js";
import bookingRoute from "./routes/booking.route.js";
import paymentRoute from "./routes/payment.route.js";
import blogRoute from "./routes/blog.route.js";

// initialize express app
const app = express();


app.use(cors({ origin: "*", credentials: true }));


// db connect
connectDB();

// middleware
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://car-rental-front-end-sooty.vercel.app",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );


app.use(express.json());

const port = process.env.PORT || 5000;

console.log("API_PAYMENT =", process.env.API_PAYMENT);


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
