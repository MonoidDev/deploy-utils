import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

import { Secrets, env } from "./models";

export async function getSecrets(): Promise<Secrets> {
  const client = new SecretsManagerClient({
    region: "ap-northeast-1",
  });

  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: env.SECRET_ID,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      }),
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }

  const secret = response.SecretString ?? "{}";
  return Secrets.parse(JSON.parse(secret));
  // Your code goes here
}
