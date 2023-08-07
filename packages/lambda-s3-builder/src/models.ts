import { commaSepList } from "@monoid-dev/deploy-utils-models";
import { z } from "zod";

export const TASK = z.object({
  BUILD_COMMAND: z.string(),
  BUILD_DIR: z.string(),
  BUILD_OUTPUT: z.string(),
  AWS_S3_BUCKET: z.string(),
  FUNCTION_NAMES: commaSepList(),
});
