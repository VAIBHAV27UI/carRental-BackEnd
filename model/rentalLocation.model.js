import mongoose from "mongoose";

const rentalLocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true },
    pincode: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("RentalLocation", rentalLocationSchema)