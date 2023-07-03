# Lambda S3 Builder

## What it does?

1. Given a `BUILD_DIR`, it builds the application using the `BUILD_COMMAND` command.
2. If the build is successful, it compresses the `BUILD_DIR` directory, keeping its structure. The zip file is at the same level as the directory.
3. The `hash` of the directory is computed.
4. The `{hash}.zip` is uploaded to AWS S3.
5. Trigger a update to the Lambda function using the latest S3.
6. The Lambda function is tagged with the Github URL to the commit.

## Environment Requirements

Only NodeJS. AWS JavaScript SDK is used, so AWS cli is not needed.

## Example

```bash
AWS_REGION=ap-northeast-1 \
AWS_ACCESS_KEY_ID=XXX \
AWS_SECRET_ACCESS_KEY=XXX \
GIT_PERSONAL_ACCESS_TOKEN=XXX \
BUILD_COMMAND="pnpm build" \
BUILD_DIR=BUILD_DIR \
BUILD_OUTPUT=BUILD_OUTPUT \
AWS_S3_BUCKET=AWS_S3_BUCKET \
FUNCTION_NAMES=fn1,fn2 \
npx @monoid-dev/lambda-s3-builder
```
