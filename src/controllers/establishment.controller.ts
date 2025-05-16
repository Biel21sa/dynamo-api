import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import * as service from "../services/establishment.service";

export const create = async (req: Request, res: Response) => {
  try {
    const establishment = {
      id: uuidv4(),
      ...req.body,
    };

    const result = await service.createEstablishment(establishment);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  const data = await service.getById(req.params.id);
  if (!data) return res.status(404).json({ error: "Not found" });
  res.json(data);
};

export const update = async (req: Request, res: Response) => {
  await service.update(req.params.id, req.body);
  res.status(204).send();
};

export const remove = async (req: Request, res: Response) => {
  await service.remove(req.params.id);
  res.status(204).send();
};

export const list = async (_: Request, res: Response) => {
  const list = await service.listAll();
  res.json(list);
};

export const listByType = async (req: Request, res: Response) => {
  const list = await service.listByType(
    req.params.type as "shopping" | "local"
  );
  res.json(list);
};
