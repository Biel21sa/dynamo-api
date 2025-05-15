import * as service from "../src/services/product.service";
import * as repository from "../src/repositories/product.repository";
import * as rulesService from "../src/services/establishmentRules.service";
import { Product } from "../src/models/product.model";
import { EstablishmentRules } from "../src/models/establishmentRules.model";

jest.mock("../src/repositories/product.repository");
jest.mock("../src/services/establishmentRules.service");

describe("product.service", () => {
  const establishmentId = "estab-1";
  const rules: EstablishmentRules = {
    id: "rule-1",
    establishmentId,
    picturesLimit: 2,
    videoLimit: 1,
  };

  const existingProducts: Product[] = [
    { id: "p1", establishmentId, type: "image", name: "Product 1", price: 10 },
    { id: "p2", establishmentId, type: "video", name: "Product 2", price: 20 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createProduct", () => {
    it("deve criar produto se dentro dos limites", async () => {
      const newProduct: Product = {
        id: "p3",
        establishmentId,
        type: "image",
        name: "Product 3",
        price: 30,
      };

      (rulesService.getRuleByEstablishmentId as jest.Mock).mockResolvedValue(
        rules
      );
      (repository.findByEstablishmentId as jest.Mock).mockResolvedValue([
        { id: "p1", establishmentId, type: "image" },
      ]);
      (repository.create as jest.Mock).mockResolvedValue(undefined);

      await service.createProduct(newProduct);

      expect(repository.create).toHaveBeenCalledWith(newProduct);
    });

    it("deve lançar erro se regras não forem encontradas", async () => {
      (rulesService.getRuleByEstablishmentId as jest.Mock).mockResolvedValue(
        null
      );

      await expect(
        service.createProduct({
          id: "x",
          establishmentId,
          type: "image",
          name: "Test Product",
          price: 0,
        })
      ).rejects.toThrow("Regras do estabelecimento não encontradas");
    });

    it("deve lançar erro se o limite de imagens for excedido", async () => {
      const newImageProduct: Product = {
        id: "x",
        establishmentId,
        type: "image",
        name: "Test Image Product",
        price: 0,
      };

      (rulesService.getRuleByEstablishmentId as jest.Mock).mockResolvedValue(
        rules
      );
      (repository.findByEstablishmentId as jest.Mock).mockResolvedValue([
        { id: "1", establishmentId, type: "image" },
        { id: "2", establishmentId, type: "image" },
      ]);

      await expect(service.createProduct(newImageProduct)).rejects.toThrow(
        "Limite de imagens atingido"
      );
    });

    it("deve lançar erro se o limite de vídeos for excedido", async () => {
      const newVideoProduct: Product = {
        id: "x",
        establishmentId,
        type: "video",
        name: "Test Video Product",
        price: 0,
      };

      (rulesService.getRuleByEstablishmentId as jest.Mock).mockResolvedValue(
        rules
      );
      (repository.findByEstablishmentId as jest.Mock).mockResolvedValue([
        { id: "1", establishmentId, type: "video" },
      ]);

      await expect(service.createProduct(newVideoProduct)).rejects.toThrow(
        "Limite de vídeos atingido"
      );
    });
  });

  describe("getProductById", () => {
    it("deve buscar produto por id", async () => {
      const product: Product = {
        id: "p1",
        establishmentId,
        type: "image",
        name: "Product 1",
        price: 10,
      };

      (repository.findById as jest.Mock).mockResolvedValue(product);

      const result = await service.getProductById("p1");

      expect(repository.findById).toHaveBeenCalledWith("p1");
      expect(result).toEqual(product);
    });
  });

  describe("listAllProducts", () => {
    it("deve listar todos os produtos", async () => {
      (repository.findAll as jest.Mock).mockResolvedValue(existingProducts);

      const result = await service.listAllProducts();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(existingProducts);
    });
  });

  describe("getProductsByEstablishmentId", () => {
    it("deve listar produtos por estabelecimento", async () => {
      (repository.findByEstablishmentId as jest.Mock).mockResolvedValue(
        existingProducts
      );

      const result = await service.getProductsByEstablishmentId(
        establishmentId
      );

      expect(repository.findByEstablishmentId).toHaveBeenCalledWith(
        establishmentId
      );
      expect(result).toEqual(existingProducts);
    });
  });

  describe("updateProduct", () => {
    it("deve atualizar produto", async () => {
      const updates = { type: "video" as "video" };

      await service.updateProduct("p1", updates);

      expect(repository.update).toHaveBeenCalledWith("p1", updates);
    });
  });

  describe("deleteProduct", () => {
    it("deve remover produto", async () => {
      await service.deleteProduct("p1");

      expect(repository.remove).toHaveBeenCalledWith("p1");
    });
  });
});
