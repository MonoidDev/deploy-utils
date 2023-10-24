import { z } from "zod";

export const env = z
  .object({
    PROJECT_NAME: z.string(),
    SECRET_ID: z.string(),
  })
  .parse(process.env);

export const Secrets = z.object({
  github_personal_token: z.string(),
  deployed_bot_target_group_lark_token: z.string(),
});

export type Secrets = z.infer<typeof Secrets>;
