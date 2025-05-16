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
const service = __importStar(require("../src/services/establishmentRules.service"));
const repository = __importStar(require("../src/repositories/establishmentRules.repository"));
jest.mock("../src/repositories/establishmentRules.repository");
describe("establishmentRules.service", () => {
    const rule = {
        id: "rule-1",
        establishmentId: "estab-1",
        picturesLimit: 5,
        videoLimit: 2,
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("deve criar uma nova regra", async () => {
        repository.create.mockResolvedValue(undefined);
        await service.createRule(rule);
        expect(repository.create).toHaveBeenCalledWith(rule);
    });
    it("deve buscar regra por ID", async () => {
        repository.findById.mockResolvedValue(rule);
        const result = await service.getRuleById("rule-1");
        expect(repository.findById).toHaveBeenCalledWith("rule-1");
        expect(result).toEqual(rule);
    });
    it("deve buscar regra por establishmentId", async () => {
        repository.findByEstablishmentId.mockResolvedValue(rule);
        const result = await service.getRuleByEstablishmentId("estab-1");
        expect(repository.findByEstablishmentId).toHaveBeenCalledWith("estab-1");
        expect(result).toEqual(rule);
    });
    it("deve atualizar uma regra", async () => {
        const updates = { picturesLimit: 10 };
        repository.update.mockResolvedValue(undefined);
        await service.updateRule("rule-1", updates);
        expect(repository.update).toHaveBeenCalledWith("rule-1", updates);
    });
    it("deve deletar uma regra", async () => {
        repository.remove.mockResolvedValue(undefined);
        await service.deleteRule("rule-1");
        expect(repository.remove).toHaveBeenCalledWith("rule-1");
    });
});
