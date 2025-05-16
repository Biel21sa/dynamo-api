import express from "express";
import * as controller from "../controllers/establishmentRules.controller";

const router = express.Router();

router.post("/", controller.createRule);
router.get("/establishment/:establishmentId", (req, res, next) => {
  controller.getRuleByEstablishmentId(req, res).catch(next);
});
router.get("/:id", (req, res, next) => {
  controller.getRuleById(req, res).catch(next);
});
router.put("/:id", controller.updateRule);
router.delete("/:id", controller.deleteRule);

export default router;
