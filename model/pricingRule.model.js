import mongoose from "mongoose";

const pricingRuleSchema = new mongoose.Schema(
  {
    vehicleType: { type: String, enum: ["sedan", "suv", "hatchback", "luxury", "van"] },
    dayOfWeek: { type: Number, min: 0, max: 6 }, // 0 = Sunday
    discountPercent: { type: Number, default: 0 },
    extraCharges: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("PricingRule", pricingRuleSchema)