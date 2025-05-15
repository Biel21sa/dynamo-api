import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import * as service from "../services/establishmentRules.service";

export const createRule = async (req: Request, res: Response) => {
  const rule = { id: uuidv4(), ...req.body };
  await service.createRule(rule);
  res.status(201).json(rule);
};

export const getRuleById = async (req: Request, res: Response) => {
  const rule = await service.getRuleById(req.params.id);
  if (!rule) return res.status(404).json({ message: "Regra não encontrada" });
  res.json(rule);
};

export const getRuleByEstablishmentId = async (req: Request, res: Response) => {
  const rule = await service.getRuleByEstablishmentId(
    req.params.establishmentId
  );
  if (!rule)
    return res
      .status(404)
      .json({ message: "Regra não encontrada para o estabelecimento" });
  res.json(rule);
};

export const updateRule = async (req: Request, res: Response) => {
  await service.updateRule(req.params.id, req.body);
  const updated = await service.getRuleById(req.params.id);
  res.json(updated);
};

export const deleteRule = async (req: Request, res: Response) => {
  await service.deleteRule(req.params.id);
  res.status(204).send();
};
