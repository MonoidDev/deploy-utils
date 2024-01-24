#!/usr/bin/env node
import { createHash, type BinaryLike } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { relative } from "node:path";

import {
  LambdaClient,
  UpdateFunctionCodeCommand,
} from "@aws-sdk/client-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import chalk from "chalk";
import { $ } from "execa";
import { Glob } from "glob";
import JSZip from "jszip";
import prettyBytes from "pretty-bytes";
import { sortBy } from "remeda";

import { env } from "./env";

const $$ = $({
  cwd: env.BUILD_DIR,
  shell: true,
  stdio: "inherit",
});

const info = (...args: any[]) => {
  console.info(chalk.cyan(`[lambda-s3-builder]`), ...args);
};

export interface ZipDirectoryResult {
  zip: Buffer;
  name: string;
}

const pathSafeHash = (data: BinaryLike) => {
  return createHash("md5")
    .update(data)
    .digest()
    .toString("base64")
    .replace("/", "+");
};

/**
 * @param directory The path to the directory
 * Get the hash that stands for the content of the directory.
 * Does not consider empty directories.
 */
const zipDirectory = async (directory: string): Promise<ZipDirectoryResult> => {
  const g = new Glob(["**"], { cwd: directory, absolute: true, nodir: true });

  const fileNames = sortBy(await g.walk(), (x) => x);

  const fileHashes = new Map<string, string>();

  const zip = new JSZip();

  await Promise.all(
    fileNames.map((f) =>
      readFile(f).then((content) => {
        fileHashes.set(f, pathSafeHash(content));

        zip.file(relative(directory, f), content);
      }),
    ),
  );

  const hash = createHash("md5");

  for (const [key, value] of sortBy(
    [...fileHashes.entries()],
    ([key]) => key,
  )) {
    hash.update(relative(directory, key)).update("/").update(value);
  }

  const name = `${hash.digest().toString("base64").replaceAll(/\//g, "+")}.zip`;

  return {
    zip: await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9,
      },
    }),
    name,
  };
};

export const main = async () => {
  if (env.BUILD_COMMAND) {
    info(`Executing BUILD_COMMAND ${JSON.stringify(env.BUILD_COMMAND)}...`);

    await $$`${env.BUILD_COMMAND}`;
  }

  const { name, zip } = await zipDirectory(env.BUILD_OUTPUT);

  const s3Key = `${env.AWS_S3_DIR ?? env.FUNCTION_NAMES.join("-")}/${name}`;

  const targetName = `/tmp/${name}`;

  await writeFile(targetName, zip);

  info(`Zip written to ${targetName} (${prettyBytes(zip.byteLength)})`);

  info(`Executing BUILD_COMMAND ${JSON.stringify(env.BUILD_COMMAND)}...`);

  info(`Uploading to S3 ${env.AWS_S3_BUCKET}/${s3Key}`);

  // AWS_REGION & credentials are provided from environment variables
  const s3Client = new S3Client({});
  const response = await s3Client.send(
    new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: s3Key,
      Body: zip,
    }),
  );

  info(`Upload result: `, response);

  const client = new LambdaClient({});
  for (const functionName of env.FUNCTION_NAMES) {
    info(`Uploading Lambda Function: `, functionName);

    const response = await client.send(
      new UpdateFunctionCodeCommand({
        FunctionName: functionName,
        S3Bucket: env.AWS_S3_BUCKET,
        S3Key: s3Key,
      }),
    );

    info(`Upload ${functionName} result: `, response);
  }
};

main();
