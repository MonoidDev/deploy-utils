import {
  AWS_CREDENTIALS,
  LARK_BOT_CREDENTIALS,
  GITHUB_CREDENTIALS,
} from "@monoid-dev/deploy-utils-models";
import { z } from "zod";

export const env = z
  .object({
    ...AWS_CREDENTIALS.partial().shape,
    ...LARK_BOT_CREDENTIALS.shape,
    ...GITHUB_CREDENTIALS.shape,
  })
  .parse(process.env);
