import * as repository from "../repositories/product.repository";
import * as rulesService from "../services/establishmentRules.service";
import { Product } from "../models/product.model";

export const createProduct = async (product: Product) => {
  const { establishmentId, type = "image" } = product;

  const rules = await rulesService.getRuleByEstablishmentId(establishmentId);
  if (!rules) throw new Error("Regras do estabelecimento não encontradas");

  const existingProducts = await repository.findByEstablishmentId(
    establishmentId
  );

  const countImages = existingProducts.filter(
    (p) => (p.type ?? "image") === "image"
  ).length;
  const countVideos = existingProducts.filter((p) => p.type === "video").length;

  if (type === "image" && countImages >= rules.picturesLimit) {
    throw new Error("Limite de imagens atingido");
  }

  if (type === "video" && countVideos >= rules.videoLimit) {
    throw new Error("Limite de vídeos atingido");
  }

  await repository.create(product);
};

export const getProductById = async (id: string) => {
  return await repository.findById(id);
};

export const listAllProducts = async () => {
  return await repository.findAll();
};

export const getProductsByEstablishmentId = async (establishmentId: string) => {
  return await repository.findByEstablishmentId(establishmentId);
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  await repository.update(id, updates);
};

export const deleteProduct = async (id: string) => {
  await repository.remove(id);
};
