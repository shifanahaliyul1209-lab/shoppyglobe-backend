import express from "express";
import { getProducts, getProductById } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts); // GET /products
router.get("/:id", getProductById); // GET /products/:id

export default router;