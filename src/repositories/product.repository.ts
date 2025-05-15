import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Product } from "../models/product.model";
import { dynamoClient } from "../utils/dynamoClient";

const TABLE_NAME = "Products";

export const create = async (product: Product) => {
  await dynamoClient.send(
    new PutCommand({ TableName: TABLE_NAME, Item: product })
  );
};

export const findById = async (id: string) => {
  const result = await dynamoClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { id } })
  );
  return result.Item as Product;
};

export const findAll = async () => {
  const result = await dynamoClient.send(
    new ScanCommand({ TableName: TABLE_NAME })
  );
  return result.Items as Product[];
};

export const findByEstablishmentId = async (establishmentId: string) => {
  const result = await dynamoClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "establishmentId-index",
      KeyConditionExpression: "establishmentId = :eid",
      ExpressionAttributeValues: {
        ":eid": establishmentId,
      },
    })
  );
  return result.Items as Product[];
};

export const update = async (id: string, updates: Partial<Product>) => {
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
