import { z } from "zod";

export const CREDENTIALS = z.object({
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  GIT_PERSONAL_ACCESS_TOKEN: z.string(),
});

export const TASK = z.object({
  BUILD_COMMAND: z.string(),
  BUILD_DIR: z.string(),
  BUILD_OUTPUT: z.string(),
  AWS_S3_BUCKET: z.string(),
});
