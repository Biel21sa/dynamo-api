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
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const userService = __importStar(require("../src/services/user.service"));
const dynamoClient_1 = require("../src/utils/dynamoClient");
jest.mock("@aws-sdk/lib-dynamodb", () => {
    const originalModule = jest.requireActual("@aws-sdk/lib-dynamodb");
    return {
        ...originalModule,
        DynamoDBDocumentClient: {
            from: jest.fn(() => ({
                send: jest.fn(),
            })),
        },
        PutCommand: jest.fn(),
        GetCommand: jest.fn(),
        ScanCommand: jest.fn(),
        UpdateCommand: jest.fn(),
        DeleteCommand: jest.fn(),
    };
});
describe("User Service", () => {
    const mockSend = jest.fn();
    beforeEach(() => {
        dynamoClient_1.dynamoClient.send = mockSend;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should create a user", async () => {
        const user = {
            id: "1",
            name: "Alice",
            email: "a@a.com",
            type: "owner",
        };
        await userService.createUser(user);
        expect(lib_dynamodb_1.PutCommand).toHaveBeenCalledWith({
            TableName: "Users",
            Item: user,
        });
        expect(mockSend).toHaveBeenCalled();
    });
    it("should get user by id", async () => {
        mockSend.mockResolvedValueOnce({ Item: { id: "1", name: "Bob" } });
        const result = await userService.getUserById("1");
        expect(lib_dynamodb_1.GetCommand).toHaveBeenCalledWith({
            TableName: "Users",
            Key: { id: "1" },
        });
        expect(result).toEqual({ id: "1", name: "Bob" });
    });
    it("should list users", async () => {
        mockSend.mockResolvedValueOnce({ Items: [{ id: "1" }, { id: "2" }] });
        const result = await userService.listUsers();
        expect(lib_dynamodb_1.ScanCommand).toHaveBeenCalled();
        expect(result).toHaveLength(2);
    });
    it("should update a user", async () => {
        const updates = { name: "NewName" };
        await userService.updateUser("1", updates);
        expect(lib_dynamodb_1.UpdateCommand).toHaveBeenCalled();
        expect(mockSend).toHaveBeenCalled();
    });
    it("should delete a user", async () => {
        await userService.deleteUser("1");
        expect(lib_dynamodb_1.DeleteCommand).toHaveBeenCalledWith({
            TableName: "Users",
            Key: { id: "1" },
        });
        expect(mockSend).toHaveBeenCalled();
    });
});
