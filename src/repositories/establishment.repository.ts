import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { Establishment } from "../models/establishment.model";
import { dynamoClient } from "../utils/dynamoClient";

const TableName = "Establishments";

export const createEstablishment = async (item: Establishment) => {
  await dynamoClient.send(new PutCommand({ TableName, Item: item }));
};

export const getEstablishmentById = async (id: string) => {
  const result = await dynamoClient.send(
    new GetCommand({ TableName, Key: { id } })
  );
  return result.Item as Establishment;
};

export const updateEstablishment = async (
  id: string,
  updates: Partial<Establishment>
) => {
  const updateExpressions = [];
  const expressionAttributeValues: any = {};
  for (const key in updates) {
    updateExpressions.push(`${key} = :${key}`);
    expressionAttributeValues[`:${key}`] = (updates as any)[key];
  }

  const UpdateExpression = "SET " + updateExpressions.join(", ");

  await dynamoClient.send(
    new UpdateCommand({
      TableName,
      Key: { id },
      UpdateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    })
  );
};

export const deleteEstablishment = async (id: string) => {
  await dynamoClient.send(new DeleteCommand({ TableName, Key: { id } }));
};

export const getAllEstablishments = async () => {
  const result = await dynamoClient.send(new ScanCommand({ TableName }));
  return result.Items as Establishment[];
};

export const getEstablishmentsByType = async (type: "shopping" | "local") => {
  const result = await dynamoClient.send(
    new ScanCommand({
      TableName,
      FilterExpression: "#type = :type",
      ExpressionAttributeNames: { "#type": "type" },
      ExpressionAttributeValues: { ":type": type },
    })
  );
  return result.Items as Establishment[];
};
