import mongoose from "mongoose";

// Schema: one cart per user, with a list of product IDs and quantities
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 1, default: 1 },
    },
  ],
});

export default mongoose.model("Cart", cartSchema);