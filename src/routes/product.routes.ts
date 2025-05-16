import express from "express";
import * as controller from "../controllers/product.controller";

const router = express.Router();

router.post("/", controller.createProduct);
router.get("/", controller.listAllProducts);
router.get(
  "/establishment/:establishmentId",
  controller.getProductsByEstablishmentId
);
router.get("/:id", (req, res, next) => {
  controller.getProductById(req, res).catch(next);
});
router.put("/:id", (req, res, next) => {
  controller.updateProduct(req, res).catch(next);
});
router.delete("/:id", controller.deleteProduct);

export default router;
