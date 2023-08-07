import { z } from "zod";

export const commaSepList = () =>
  z.preprocess(
    (v) => typeof v === "string" && v.split(","),
    z.string().array(),
  );

export const AWS_CREDENTIALS = z.object({
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
});

export const LARK_BOT_CREDENTIALS = z.object({
  LARK_BOT_TOKEN: z.string(),
});

export const GITHUB_CREDENTIALS = z.object({
  GITHUB_PERSONAL_TOKEN: z.string(),
});
