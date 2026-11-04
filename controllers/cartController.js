import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// GET /cart - show the logged-in user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /cart - add a product to the cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate input
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "A valid productId is required" });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be a whole number of at least 1" });
    }

    // Check that the product exists before adding it
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // If the product is already in the cart, increase its quantity
    const item = cart.items.find((i) => i.product.toString() === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /cart/:productId - change the quantity of a product in the cart
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be a whole number of at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    const item = cart && cart.items.find((i) => i.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /cart/:productId - remove a product from the cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    const exists = cart && cart.items.some((i) => i.product.toString() === productId);
    if (!exists) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};