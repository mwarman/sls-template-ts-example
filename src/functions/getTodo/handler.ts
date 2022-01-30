import { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { TodoEntity } from '@entities/todo';
import { DatabaseClient } from '@utils/database';

const getTodo: APIGatewayProxyHandler = async (event) => {
  console.log('Handler::getTodo');
  console.log(`event:\n${JSON.stringify(event, null, 2)}`);

  try {
    const { todoId } = event.pathParameters;

    const databaseClient = new DatabaseClient();
    const todo = await new TodoEntity(databaseClient).findOne(todoId);

    if (todo) {
      return formatJSONResponse(todo);
    } else {
      return formatJSONResponse(null, 404);
    }
  } catch (error) {
    console.log('ERROR::createTodo::', error);
    return formatJSONResponse(null, 500);
  }
};

export const main = middyfy(getTodo);
