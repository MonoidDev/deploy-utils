import { env } from "./env";

const LARK_BASE_URL = "https://open.larksuite.com/open-apis/bot/v2/hook";

export interface Deployment {
  repo: string;
  commitHash: string;
  author: string;
  message: string;
}

export interface SendLarkOptions {
  title: string;
  deployments: Deployment[];
  dry?: boolean;
}

export const sendLark = async ({
  title,
  deployments,
  dry = false,
}: SendLarkOptions) => {
  const body = JSON.stringify(
    {
      msg_type: "post",
      content: {
        post: {
          en_us: {
            title,
            content: deployments.flatMap((deployment) => [
              [
                {
                  tag: "text",
                  text: `Author: ${deployment.author}`,
                },
              ],
              [
                {
                  tag: "text",
                  text: `Message: ${deployment.message}`,
                },
              ],
              [
                {
                  tag: "text",
                  text: `Commit: `,
                },
                {
                  tag: "a",
                  text: deployment.commitHash.slice(0, 7),
                  href: `https://github.com/MonoidDev/${deployment.repo}/commit/${deployment.commitHash}`,
                },
              ],
            ]),
          },
        },
      },
    },
    null,
    2,
  );

  if (dry) {
    console.info(body);
    return;
  }

  return await fetch(`${LARK_BASE_URL}/${env.LARK_BOT_TOKEN}`, {
    method: "POST",
    body,
  });
};
