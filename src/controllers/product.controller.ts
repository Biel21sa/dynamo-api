import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import * as service from "../services/product.service";

export const createProduct = async (req: Request, res: Response) => {
  const product = { id: uuidv4(), ...req.body };

  try {
    await service.createProduct(product);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await service.getProductById(req.params.id);
  if (!product)
    return res.status(404).json({ message: "Produto não encontrado" });
  res.json(product);
};

export const getProductsByEstablishmentId = async (
  req: Request,
  res: Response
) => {
  const products = await service.getProductsByEstablishmentId(
    req.params.establishmentId
  );
  res.json(products);
};

export const listAllProducts = async (_req: Request, res: Response) => {
  const products = await service.listAllProducts();
  res.json(products);
};

export const updateProduct = async (req: Request, res: Response) => {
  await service.updateProduct(req.params.id, req.body);
  const updated = await service.getProductById(req.params.id);
  res.json(updated);
};

export const deleteProduct = async (req: Request, res: Response) => {
  await service.deleteProduct(req.params.id);
  res.status(204).send();
};
