"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const service = __importStar(require("../src/services/product.service"));
const repository = __importStar(require("../src/repositories/product.repository"));
const rulesService = __importStar(require("../src/services/establishmentRules.service"));
jest.mock("../src/repositories/product.repository");
jest.mock("../src/services/establishmentRules.service");
describe("product.service", () => {
    const establishmentId = "estab-1";
    const rules = {
        id: "rule-1",
        establishmentId,
        picturesLimit: 2,
        videoLimit: 1,
    };
    const existingProducts = [
        { id: "p1", establishmentId, type: "image", name: "Product 1", price: 10 },
        { id: "p2", establishmentId, type: "video", name: "Product 2", price: 20 },
    ];
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("createProduct", () => {
        it("deve criar produto se dentro dos limites", async () => {
            const newProduct = {
                id: "p3",
                establishmentId,
                type: "image",
                name: "Product 3",
                price: 30,
            };
            rulesService.getRuleByEstablishmentId.mockResolvedValue(rules);
            repository.findByEstablishmentId.mockResolvedValue([
                { id: "p1", establishmentId, type: "image" },
            ]);
            repository.create.mockResolvedValue(undefined);
            await service.createProduct(newProduct);
            expect(repository.create).toHaveBeenCalledWith(newProduct);
        });
        it("deve lançar erro se regras não forem encontradas", async () => {
            rulesService.getRuleByEstablishmentId.mockResolvedValue(null);
            await expect(service.createProduct({
                id: "x",
                establishmentId,
                type: "image",
                name: "Test Product",
                price: 0,
            })).rejects.toThrow("Regras do estabelecimento não encontradas");
        });
        it("deve lançar erro se o limite de imagens for excedido", async () => {
            const newImageProduct = {
                id: "x",
                establishmentId,
                type: "image",
                name: "Test Image Product",
                price: 0,
            };
            rulesService.getRuleByEstablishmentId.mockResolvedValue(rules);
            repository.findByEstablishmentId.mockResolvedValue([
                { id: "1", establishmentId, type: "image" },
                { id: "2", establishmentId, type: "image" },
            ]);
            await expect(service.createProduct(newImageProduct)).rejects.toThrow("Limite de imagens atingido");
        });
        it("deve lançar erro se o limite de vídeos for excedido", async () => {
            const newVideoProduct = {
                id: "x",
                establishmentId,
                type: "video",
                name: "Test Video Product",
                price: 0,
            };
            rulesService.getRuleByEstablishmentId.mockResolvedValue(rules);
            repository.findByEstablishmentId.mockResolvedValue([
                { id: "1", establishmentId, type: "video" },
            ]);
            await expect(service.createProduct(newVideoProduct)).rejects.toThrow("Limite de vídeos atingido");
        });
    });
    describe("getProductById", () => {
        it("deve buscar produto por id", async () => {
            const product = {
                id: "p1",
                establishmentId,
                type: "image",
                name: "Product 1",
                price: 10,
            };
            repository.findById.mockResolvedValue(product);
            const result = await service.getProductById("p1");
            expect(repository.findById).toHaveBeenCalledWith("p1");
            expect(result).toEqual(product);
        });
    });
    describe("listAllProducts", () => {
        it("deve listar todos os produtos", async () => {
            repository.findAll.mockResolvedValue(existingProducts);
            const result = await service.listAllProducts();
            expect(repository.findAll).toHaveBeenCalled();
            expect(result).toEqual(existingProducts);
        });
    });
    describe("getProductsByEstablishmentId", () => {
        it("deve listar produtos por estabelecimento", async () => {
            repository.findByEstablishmentId.mockResolvedValue(existingProducts);
            const result = await service.getProductsByEstablishmentId(establishmentId);
            expect(repository.findByEstablishmentId).toHaveBeenCalledWith(establishmentId);
            expect(result).toEqual(existingProducts);
        });
    });
    describe("updateProduct", () => {
        it("deve atualizar produto", async () => {
            const updates = { type: "video" };
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
