import mongoose from "mongoose";

export const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["credit_card", "debit_card", "upi", "cash"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionId: {
      type: String,
      validate: {
        validator: function (value) {
          return this.status !== "completed" || Boolean(value);
        },
        message: "Transaction ID is required for completed payments",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
