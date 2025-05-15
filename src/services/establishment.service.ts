import { Establishment } from "../models/establishment.model";
import * as repo from "../repositories/establishment.repository";
import { getUserById } from "./user.service";
import { v4 as uuid } from "uuid";

export const createEstablishment = async (data: Omit<Establishment, "id">) => {
  const user = await getUserById(data.ownerId);
  if (!user) throw new Error("Owner not found");
  if (user.type !== "owner")
    throw new Error("Only users of type 'owner' can create an establishment");

  const item: Establishment = { id: uuid(), ...data };
  await repo.createEstablishment(item);
  return item;
};

export const getById = repo.getEstablishmentById;
export const update = repo.updateEstablishment;
export const remove = repo.deleteEstablishment;
export const listAll = repo.getAllEstablishments;
export const listByType = repo.getEstablishmentsByType;
