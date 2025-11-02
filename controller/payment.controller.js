import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../model/booking.model.js";
import Payment from "../model/payment.model.js";

import dotenv from "dotenv";
dotenv.config();

// Initialize Razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const checkAvailability = async (vehicleId, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    vehicle: vehicleId,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });
  return bookings.length === 0;
};

export const createOrder = async (req, res) => {
  try {
    const { amount, bookingData } = req.body;

    const {
      vehicle,
      user,
      pickupDate,
      returnDate,
      pickupLocation,
      dropoffLocation,
      totalPrice,
    } = bookingData;

    if (
      !vehicle ||
      !user ||
      !pickupDate ||
      !returnDate ||
      !pickupLocation ||
      !dropoffLocation ||
      !totalPrice
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const isAvailable = await checkAvailability(vehicle, pickupDate, returnDate);
    if (!isAvailable) {
      return res
        .status(400)
        .json({ success: false, message: "Car not available for selected dates" });
    }

    console.log("Creating Razorpay order with amount:", amount);

    const order = await razorpayInstance.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    if (!order) {
      console.error("❌ Razorpay order creation failed");
      return res
        .status(500)
        .json({ success: false, message: "Razorpay order creation failed" });
    }

    const booking = await Booking.create({
      vehicle,
      user,
      pickupDate,
      returnDate,
      pickupLocation,
      dropoffLocation,
      totalPrice,
      paymentStatus: "pending",
    });

    console.log("Booking created:", booking._id);
    console.log("Razorpay order:", order.id);

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      order,
      booking,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "pending" },
      { new: true }
    );

    const payment = await Payment.create({
      booking: booking._id,
      amount: booking.totalPrice,
      method: "upi", 
      status: "completed",
      transactionId: razorpay_payment_id,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and booking confirmed",
      booking,
      payment,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
