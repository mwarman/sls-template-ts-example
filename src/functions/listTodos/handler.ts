import { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { TodoEntity } from '@entities/todo';
import { DatabaseClient } from '@utils/database';

const listTodos: APIGatewayProxyHandler = async (event) => {
  console.log('Handler::listTodos');
  console.log(`event:\n${JSON.stringify(event, null, 2)}`);

  try {
    const databaseClient = new DatabaseClient();
    const todos = await new TodoEntity(databaseClient).findAll();
    return formatJSONResponse(todos);
  } catch (error) {
    console.log('ERROR::listTodos::', error);
    return formatJSONResponse(null, 500);
  }
};

export const main = middyfy(listTodos);
