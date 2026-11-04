import mongoose from "mongoose";

// Schema: the fields every product document has
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  stock: { type: Number, default: 0 }, // stock quantity
  image: { type: String },
});

export default mongoose.model("Product", productSchema);