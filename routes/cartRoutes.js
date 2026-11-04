import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Every cart route needs a valid token
router.use(protect);

router.get("/", getCart); // GET /cart
router.post("/", addToCart); // POST /cart
router.put("/:productId", updateCartItem); // PUT /cart/:productId
router.delete("/:productId", removeFromCart); // DELETE /cart/:productId

export default router;