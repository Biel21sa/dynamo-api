import express from "express";
import * as userController from "../controllers/user.controller";

const router = express.Router();

router.post("/", userController.createUser);
router.get("/", userController.listUsers);
router.get("/:id", (req, res, next) => {
  userController.getUserById(req, res).catch(next);
});
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
