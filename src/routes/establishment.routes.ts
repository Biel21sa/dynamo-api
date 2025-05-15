import { Router } from "express";
import * as controller from "../controllers/establishment.controller";

const router = Router();

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.get("/type/:type", controller.listByType);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
