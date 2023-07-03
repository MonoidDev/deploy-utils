import { z } from "zod";

import { CREDENTIALS, TASK } from "./models";

export const env = z
  .object({
    ...CREDENTIALS.shape,
    ...TASK.shape,
  })
  .parse(process.env);
