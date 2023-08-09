import {
  ECSClient,
  DescribeServicesCommand,
  DescribeTaskDefinitionCommand,
} from "@aws-sdk/client-ecs";
import { Octokit } from "@octokit/rest";
import type { EventBridgeEvent } from "aws-lambda";
import invariant from "tiny-invariant";

import { getSecrets } from "./getSecrets";
import { Deployment, sendLark } from "./sendLark";

const secretsPromise = getSecrets();

export const lambdaHandler = async (
  event: EventBridgeEvent<"ECS Deployment State Change", any>,
) => {
  if (event["detail-type"] !== "ECS Deployment State Change") {
    return;
  }

  const secrets = await secretsPromise;

  const client = new ECSClient({});

  const octokit = new Octokit({
    auth: secrets.github_personal_token,
  });

  // Cluster name is needed for DescribeServices to work.
  // Extract it from arn:aws:ecs:ap-northeast-1:540462574055:service/d2d-cluster-dev/d2d-pdf
  const cluster = event.resources[0].split("/")[1];

  // Get commit info by deploymentId
  const response = await client.send(
    new DescribeServicesCommand({
      services: event.resources,
      include: ["TAGS"],
      cluster,
    }),
  );

  invariant(response.services, "services cannot be undefined");

  const title =
    event.detail.eventName === "SERVICE_DEPLOYMENT_IN_PROGRESS"
      ? "[INFO] D2D Backend: Deploying..."
      : event.detail.eventName === "SERVICE_DEPLOYMENT_COMPLETED"
      ? "[SUCCESS] D2D Backend: Services Deployed!"
      : "[ERROR] D2D Backend: Deployment Failed!";

  const deployments: Deployment[] = [];

  for (const service of response.services) {
    invariant(service.serviceName);
    invariant(service.taskDefinition, "taskDefinition cannot be undefined");
    const taskDefinitionResponse = await client.send(
      new DescribeTaskDefinitionCommand({
        taskDefinition: service.taskDefinition,
      }),
    );

    invariant(taskDefinitionResponse.taskDefinition?.containerDefinitions);

    for (const containerDefinition of taskDefinitionResponse.taskDefinition
      .containerDefinitions) {
      invariant(containerDefinition.image);

      const tag = containerDefinition.image.split(":")[1];

      // Assume tag is like `dev-e761f2b`
      const [mode, commitHash] = tag.split("-");

      invariant(
        !!mode && !!commitHash,
        `Unhandled tag: ${JSON.stringify(tag)}`,
      );

      // Guess the repo name to be `serviceName`
      const repo = service.serviceName;

      const commit = await octokit.rest.repos.getCommit({
        repo,
        ref: commitHash,
        owner: "MonoidDev",
      });

      deployments.push({
        author: commit.data.author?.login ?? "?",
        message: commit.data.commit.message,
        commitHash,
        repo,
      });
    }
  }

  const larkResponse = await sendLark({
    title,
    deployments,
    dry: false,
    token: secrets.deployed_bot_target_group_lark_token,
  });
  const larkData = await larkResponse?.json();
  invariant(
    larkData.msg === "success",
    `Get invalid response from lark: ${JSON.stringify(larkData)}`,
  );

  return {
    success: true,
  };
};
