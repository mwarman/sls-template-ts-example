import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

import { Todo } from '@entities/todo';

// Use when request has a JSON body to validate
type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> };
export type ValidatedEventAPIGatewayProxyHandler<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

export const formatJSONResponse = (response: Todo | Todo[] | null, statusCode: number = 200) => {
  const body = response ? JSON.stringify(response) : undefined;
  return {
    statusCode,
    body,
  };
};
