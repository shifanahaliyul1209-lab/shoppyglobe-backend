import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/Product.js";

// Seed script: loads sample products into MongoDB (run once)
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Get sample data from DummyJSON and map it to our schema
    const res = await fetch("https://dummyjson.com/products?limit=30");
    const data = await res.json();
    const products = data.products.map((p) => ({
      name: p.title,
      price: p.price,
      description: p.description,
      stock: p.stock,
      image: p.thumbnail,
    }));

    await Product.deleteMany(); // clears old products first
    await Product.insertMany(products);
    console.log(`${products.length} products added`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();