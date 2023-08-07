import { lambdaHandler } from "../src/lambdaHandler";

lambdaHandler({
  version: "0",
  id: "676ca433-d8da-ce95-bc07-7815a3deb201",
  "detail-type": "ECS Deployment State Change",
  source: "aws.ecs",
  account: "540462574055",
  time: "2023-08-07T06:30:17Z",
  region: "ap-northeast-1",
  resources: [
    "arn:aws:ecs:ap-northeast-1:540462574055:service/d2d-cluster-dev/d2d-pdf",
  ],
  detail: {
    eventType: "INFO",
    eventName: "SERVICE_DEPLOYMENT_COMPLETED",
    deploymentId: "ecs-svc/1702860048778063437",
    updatedAt: "2023-08-07T06:28:58.617Z",
    reason: "ECS deployment ecs-svc/1702860048778063437 completed.",
  },
});
