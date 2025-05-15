import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { User } from "../models/user.model";

const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
});
const ddb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Users";

export const createUser = async (user: User) => {
  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: user,
    })
  );
};

export const getUserById = async (id: string) => {
  const result = await ddb.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    })
  );
  return result.Item as User;
};

export const listUsers = async () => {
  const result = await ddb.send(
    new ScanCommand({
      TableName: TABLE_NAME,
    })
  );
  return result.Items as User[];
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  const updateExpressions = [];
  const ExpressionAttributeValues: Record<string, any> = {};
  const ExpressionAttributeNames: Record<string, string> = {};

  for (const [key, value] of Object.entries(updates)) {
    updateExpressions.push(`#${key} = :${key}`);
    ExpressionAttributeValues[`:${key}`] = value;
    ExpressionAttributeNames[`#${key}`] = key;
  }

  const UpdateExpression = `SET ${updateExpressions.join(", ")}`;

  await ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression,
      ExpressionAttributeValues,
      ExpressionAttributeNames,
    })
  );
};

export const deleteUser = async (id: string) => {
  await ddb.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    })
  );
};
