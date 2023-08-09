import { LARK_USERS } from "@monoid-dev/deploy-utils-models";

import { parseCommitMessage } from "./parseCommitMessage";

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
  token: string;
}

export const sendLark = async ({
  title,
  deployments,
  dry = false,
  token,
}: SendLarkOptions) => {
  const body = JSON.stringify(
    {
      msg_type: "post",
      content: {
        post: {
          en_us: {
            title,
            content: deployments.flatMap((deployment) => {
              const parsed = parseCommitMessage(deployment.message);
              return [
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

                parsed.atUsers.map((user) =>
                  user in LARK_USERS
                    ? {
                        tag: "at",
                        user_id: LARK_USERS[user as keyof typeof LARK_USERS],
                      }
                    : {
                        tag: "text",
                        text: `Unknown user ${JSON.stringify(user)}`,
                      },
                ),
                ,
              ];
            }),
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

  return await fetch(`${LARK_BASE_URL}/${token}`, {
    method: "POST",
    body,
  });
};
