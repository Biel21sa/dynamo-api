import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import * as userService from "../src/services/user.service";
import { dynamoClient } from "../src/utils/dynamoClient";

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
    (dynamoClient.send as jest.Mock) = mockSend;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user", async () => {
    const user = {
      id: "1",
      name: "Alice",
      email: "a@a.com",
      type: "owner" as "owner",
    };
    await userService.createUser(user);

    expect(PutCommand).toHaveBeenCalledWith({
      TableName: "Users",
      Item: user,
    });

    expect(mockSend).toHaveBeenCalled();
  });

  it("should get user by id", async () => {
    mockSend.mockResolvedValueOnce({ Item: { id: "1", name: "Bob" } });

    const result = await userService.getUserById("1");
    expect(GetCommand).toHaveBeenCalledWith({
      TableName: "Users",
      Key: { id: "1" },
    });

    expect(result).toEqual({ id: "1", name: "Bob" });
  });

  it("should list users", async () => {
    mockSend.mockResolvedValueOnce({ Items: [{ id: "1" }, { id: "2" }] });

    const result = await userService.listUsers();
    expect(ScanCommand).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });

  it("should update a user", async () => {
    const updates = { name: "NewName" };

    await userService.updateUser("1", updates);

    expect(UpdateCommand).toHaveBeenCalled();
    expect(mockSend).toHaveBeenCalled();
  });

  it("should delete a user", async () => {
    await userService.deleteUser("1");
    expect(DeleteCommand).toHaveBeenCalledWith({
      TableName: "Users",
      Key: { id: "1" },
    });
    expect(mockSend).toHaveBeenCalled();
  });
});
