import { lambdaHandler } from "@monoid-dev/deployed-bot";
import fetch from "node-fetch";

globalThis.fetch = fetch as any;

export const handler = lambdaHandler;
