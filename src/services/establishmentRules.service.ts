import * as repository from "../repositories/establishmentRules.repository";
import { EstablishmentRules } from "../models/establishmentRules.model";

export const createRule = async (rule: EstablishmentRules) => {
  await repository.create(rule);
};

export const getRuleById = async (id: string) => {
  return await repository.findById(id);
};

export const getRuleByEstablishmentId = async (establishmentId: string) => {
  return await repository.findByEstablishmentId(establishmentId);
};

export const updateRule = async (
  id: string,
  updates: Partial<EstablishmentRules>
) => {
  await repository.update(id, updates);
};

export const deleteRule = async (id: string) => {
  await repository.remove(id);
};
