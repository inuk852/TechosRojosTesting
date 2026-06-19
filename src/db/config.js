// src/db/config.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const env = import.meta.env;

const endpoint =
  env.VITE_DYNAMODB_ENDPOINT ?? "http://localhost:8000";
const region = env.VITE_AWS_REGION ?? "us-east-1";

const accessKeyId = env.VITE_AWS_ACCESS_KEY_ID ?? "local";
const secretAccessKey = env.VITE_AWS_SECRET_ACCESS_KEY ?? "local";

const credentials = {
  accessKeyId,
  secretAccessKey,
};

const client = new DynamoDBClient({
  region,
  endpoint,
  credentials,
});

export default client;