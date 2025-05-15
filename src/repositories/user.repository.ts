import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { User } from "../models/user.model";
import { dynamoClient } from "../utils/dynamoClient";

const TABLE_NAME = "Users";

export const create = async (user: User) => {
  await dynamoClient.send(
    new PutCommand({ TableName: TABLE_NAME, Item: user })
  );
};

export const findById = async (id: string) => {
  const result = await dynamoClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { id } })
  );
  return result.Item as User;
};

export const findAll = async () => {
  const result = await dynamoClient.send(
    new ScanCommand({ TableName: TABLE_NAME })
  );
  return result.Items as User[];
};

export const update = async (id: string, updates: Partial<User>) => {
  const updateExpressions = [];
  const ExpressionAttributeValues: Record<string, any> = {};
  const ExpressionAttributeNames: Record<string, string> = {};

  for (const [key, value] of Object.entries(updates)) {
    updateExpressions.push(`#${key} = :${key}`);
    ExpressionAttributeValues[`:${key}`] = value;
    ExpressionAttributeNames[`#${key}`] = key;
  }

  await dynamoClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeValues,
      ExpressionAttributeNames,
    })
  );
};

export const remove = async (id: string) => {
  await dynamoClient.send(
    new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
  );
};
