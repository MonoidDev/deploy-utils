import { AWS_CREDENTIALS } from "@monoid-dev/deploy-utils-models";
import { z } from "zod";

import { TASK } from "./models";

export const env = z
  .object({
    ...AWS_CREDENTIALS.shape,
    ...TASK.shape,
  })
  .parse(process.env);
