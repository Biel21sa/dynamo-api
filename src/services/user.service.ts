import * as userRepository from "../repositories/user.repository";
import { User } from "../models/user.model";

export const createUser = async (user: User) => {
  await userRepository.create(user);
};

export const getUserById = async (id: string) => {
  return await userRepository.findById(id);
};

export const listUsers = async () => {
  return await userRepository.findAll();
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  await userRepository.update(id, updates);
};

export const deleteUser = async (id: string) => {
  await userRepository.remove(id);
};
