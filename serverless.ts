import type { AWS } from '@serverless/typescript';

import getTodo from '@functions/getTodo';
import listTodos from '@functions/listTodos';
import createTodo from '@functions/createTodo';
import updateTodo from '@functions/updateTodo';

const tableName = '${self:service}-todo-${self:custom.stage}';

const serverlessConfiguration: AWS = {
  service: 'sls-template-ts-example',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    stage: 'dev',
    memorySize: 128,
    logRetentionInDays: 7,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      TABLE_NAME: tableName,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
            ],
            Resource: [
              {
                'Fn::GetAtt': ['TodoTable', 'Arn'],
              },
            ],
          },
        ],
      },
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { getTodo, listTodos, createTodo, updateTodo },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    stage: '${opt:stage, self:provider.stage}',
  },
  resources: {
    Resources: {
      TodoTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'todoId',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'todoId',
              KeyType: 'HASH',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: tableName,
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
