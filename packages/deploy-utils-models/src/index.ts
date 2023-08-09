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

export const LARK_USERS = {
  dym: "53846bfg",
  myr: "69f79gf1",
  joyce: "3863e4gb",
  wcy: "19b9g4f1",
  mtm: "549ge569",
  lxm: "5bb69fcc",
  lzc: "fg6d73g6",
  cyw: "1945e51d",
};
