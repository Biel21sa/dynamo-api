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
      "Tabela criada com sucesso:",
      result.TableDescription?.TableName
    );
  } catch (err: any) {
    if (err.name === "ResourceInUseException") {
      console.log("A tabela já existe.");
    } else {
      console.error("Erro ao criar tabela:", err);
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
    console.log("Tabela criada com sucesso.");
  } catch (err) {
    console.error("Erro ao criar tabela:", err);
  }
}

createUsersTable();
createEstablishmentsTable();
