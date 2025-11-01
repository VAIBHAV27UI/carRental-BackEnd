import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
    },
    fuelType: {
      type: String,
      required: true,
    },
    transmission: {
      type: String,
      required: true,
    },
    seatingCapacity: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    rentalLocation: {
      type: mongoose.Schema.Types.ObjectId,
      red: "RentalLocation",
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    include: {
      type: [String],
      required: true,
    },
    notInclude: {
      type: [String],
      required: true,
    },
    availability: {
      type: Boolean,
      required: true,
      default:true
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
