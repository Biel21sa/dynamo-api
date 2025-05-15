import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { dynamoClient } from "../src/utils/dynamoClient";

async function createUsersTable() {
  try {
    const command = new CreateTableCommand({
      TableName: "Users",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    });

    const result = await dynamoClient.send(command);
    console.log(
      "Tabela Users criada com sucesso:",
      result.TableDescription?.TableName
    );
  } catch (err: any) {
    if (err.name === "ResourceInUseException") {
      console.log("A tabela Users já existe.");
    } else {
      console.error("Erro ao criar tabela Users:", err);
    }
  }
}

async function createEstablishmentsTable() {
  try {
    const command = new CreateTableCommand({
      TableName: "Establishments",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    });

    await dynamoClient.send(command);
    console.log("Tabela Establishments criada com sucesso.");
  } catch (err) {
    console.error("Erro ao criar tabela Establishments:", err);
  }
}

async function createEstablishmentRulesTable() {
  try {
    const command = new CreateTableCommand({
      TableName: "EstablishmentRules",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "establishmentId", AttributeType: "S" },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "EstablishmentIdIndex",
          KeySchema: [{ AttributeName: "establishmentId", KeyType: "HASH" }],
          Projection: { ProjectionType: "ALL" },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    });

    await dynamoClient.send(command);
    console.log("Tabela EstablishmentRules criada com sucesso.");
  } catch (err) {
    console.error("Erro ao criar tabela EstablishmentRules:", err);
  }
}

async function createProductsTable() {
  try {
    const command = new CreateTableCommand({
      TableName: "Products",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "establishmentId", AttributeType: "S" },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "EstablishmentIdIndex",
          KeySchema: [{ AttributeName: "establishmentId", KeyType: "HASH" }],
          Projection: { ProjectionType: "ALL" },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    });

    await dynamoClient.send(command);
    console.log("Tabela Products criada com sucesso.");
  } catch (err) {
    console.error("Erro ao criar tabela Products:", err);
  }
}

async function main() {
  await createUsersTable();
  await createEstablishmentsTable();
  await createEstablishmentRulesTable();
  await createProductsTable();
}

main();
