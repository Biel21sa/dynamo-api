import express from "express";
import { v4 as uuidv4 } from "uuid";
import * as userService from "../services/user.service";

const router = express.Router();

// Criar usuário
router.post("/", async (req, res) => {
  const user = { id: uuidv4(), ...req.body };
  await userService.createUser(user);
  res.status(201).json(user);
});

// Buscar por ID
router.get("/:id", async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
  res.json(user);
});

// Listar todos
router.get("/", async (_req, res) => {
  const users = await userService.listUsers();
  res.json(users);
});

// Atualizar
router.put("/:id", async (req, res) => {
  await userService.updateUser(req.params.id, req.body);
  const updated = await userService.getUserById(req.params.id);
  res.json(updated);
});

// Deletar
router.delete("/:id", async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(204).send();
});

export default router;
