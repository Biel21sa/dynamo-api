import express from "express";
import * as controller from "../controllers/product.controller";

const router = express.Router();

router.post("/", controller.createProduct);
router.get("/", controller.listAllProducts);
router.get("/:id", controller.getProductById);
router.get(
  "/establishment/:establishmentId",
  controller.getProductsByEstablishmentId
);
router.put("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

export default router;
