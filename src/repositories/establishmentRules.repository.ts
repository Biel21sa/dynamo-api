import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { EstablishmentRules } from "../models/establishmentRules.model";
import { dynamoClient } from "../utils/dynamoClient";

const TABLE_NAME = "EstablishmentRules";

export const create = async (rule: EstablishmentRules) => {
  await dynamoClient.send(
    new PutCommand({ TableName: TABLE_NAME, Item: rule })
  );
};

export const findById = async (id: string) => {
  const result = await dynamoClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { id } })
  );
  return result.Item as EstablishmentRules;
};

export const findByEstablishmentId = async (establishmentId: string) => {
  const result = await dynamoClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "establishmentId-index", // Certifique-se de criar este índice global secundário
      KeyConditionExpression: "establishmentId = :eid",
      ExpressionAttributeValues: {
        ":eid": establishmentId,
      },
    })
  );
  return result.Items?.[0] as EstablishmentRules;
};

export const update = async (
  id: string,
  updates: Partial<EstablishmentRules>
) => {
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
