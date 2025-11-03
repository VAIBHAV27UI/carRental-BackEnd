import mongoose from "mongoose";
import Booking from "../model/booking.model";

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("vehicle")
      .sort({ createdAt: -1 });
    return res.json({ success: true, data: bookings });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const bookings = await Booking.find({ user: id })
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to change booking status

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Booking ID" });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true } // return the updated document
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    return res.json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
