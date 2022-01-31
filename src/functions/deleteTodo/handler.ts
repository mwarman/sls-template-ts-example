import { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { TodoEntity } from '@entities/todo';
import { DatabaseClient } from '@utils/database';

const deleteTodo: APIGatewayProxyHandler = async (event) => {
  console.log('Handler::deleteTodo');
  console.log(`event:\n${JSON.stringify(event, null, 2)}`);

  try {
    const { todoId } = event.pathParameters;

    const databaseClient = new DatabaseClient();
    await new TodoEntity(databaseClient).delete(todoId);

    return formatJSONResponse(null, 204);
  } catch (error) {
    console.log('ERROR::deleteTodo::', error);
    return formatJSONResponse(null, 500);
  }
};

export const main = middyfy(deleteTodo);
