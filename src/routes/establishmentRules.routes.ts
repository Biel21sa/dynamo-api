import express from "express";
import * as controller from "../controllers/establishmentRules.controller";

const router = express.Router();

router.post("/", controller.createRule);
router.get("/:id", controller.getRuleById);
router.get(
  "/establishment/:establishmentId",
  controller.getRuleByEstablishmentId
);
router.put("/:id", controller.updateRule);
router.delete("/:id", controller.deleteRule);

export default router;
