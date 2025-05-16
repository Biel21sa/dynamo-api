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
const establishment_service_1 = require("../src/services/establishment.service");
const userService = __importStar(require("../src/services/user.service"));
const repo = __importStar(require("../src/repositories/establishment.repository"));
// Mocks automáticos
jest.mock("../src/services/user.service");
jest.mock("../src/repositories/establishment.repository");
describe("createEstablishment", () => {
    const mockUserOwner = {
        id: "user-123",
        name: "John Owner",
        email: "john@example.com",
        type: "owner",
    };
    const mockUserCustomer = {
        id: "user-456",
        name: "Jane Customer",
        email: "jane@example.com",
        type: "customer",
    };
    const data = {
        name: "My Store",
        ownerId: mockUserOwner.id,
        type: "shopping",
    };
    it("deve criar estabelecimento se o usuário for do tipo 'owner'", async () => {
        userService.getUserById.mockResolvedValue(mockUserOwner);
        repo.createEstablishment.mockResolvedValue(undefined);
        const result = await (0, establishment_service_1.createEstablishment)(data);
        expect(result).toHaveProperty("id");
        expect(result.name).toBe(data.name);
        expect(result.ownerId).toBe(data.ownerId);
        expect(result.type).toBe(data.type);
        expect(repo.createEstablishment).toHaveBeenCalledWith(expect.objectContaining(data));
    });
    it("deve lançar erro se o usuário não for encontrado", async () => {
        userService.getUserById.mockResolvedValue(null);
        await expect((0, establishment_service_1.createEstablishment)(data)).rejects.toThrow("Owner not found");
    });
    it("deve lançar erro se o usuário não for do tipo 'owner'", async () => {
        userService.getUserById.mockResolvedValue(mockUserCustomer);
        await expect((0, establishment_service_1.createEstablishment)(data)).rejects.toThrow("Only users of type 'owner' can create an establishment");
    });
});
describe("getById", () => {
    it("deve chamar o repositório com o ID correto", async () => {
        const id = "establishment-123";
        const mockEstablishment = { id, name: "My Store" };
        repo.getEstablishmentById.mockResolvedValue(mockEstablishment);
        const result = await repo.getEstablishmentById(id);
        expect(repo.getEstablishmentById).toHaveBeenCalledWith(id);
        expect(result).toEqual(mockEstablishment);
    });
});
