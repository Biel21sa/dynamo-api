import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import * as userService from "../services/user.service";

export const createUser = async (req: Request, res: Response) => {
  const user = { id: uuidv4(), ...req.body };
  await userService.createUser(user);
  res.status(201).json(user);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
  res.json(user);
};

export const listUsers = async (_req: Request, res: Response) => {
  const users = await userService.listUsers();
  res.json(users);
};

export const updateUser = async (req: Request, res: Response) => {
  await userService.updateUser(req.params.id, req.body);
  const updated = await userService.getUserById(req.params.id);
  res.json(updated);
};

export const deleteUser = async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id);
  res.status(204).send();
};
