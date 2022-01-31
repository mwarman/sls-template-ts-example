import type { ValidatedEventAPIGatewayProxyHandler } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { Todo, TodoEntity } from '@entities/todo';
import { DatabaseClient } from '@libs/dynamo';

const updateTodo: ValidatedEventAPIGatewayProxyHandler<typeof schema> = async (event) => {
  console.log('Handler::updateTodo');
  console.log(`event:\n${JSON.stringify(event, null, 2)}`);

  try {
    const { todoId, title, isComplete = false, createdAt } = event.body;
    if (event.pathParameters.todoId !== todoId) {
      // path parameter must match value in body; otherwise 400 bad request
      return formatJSONResponse(null, 400);
    }

    const todoToUpdate: Todo = {
      todoId,
      title,
      isComplete,
      createdAt,
    };

    const databaseClient = new DatabaseClient();
    const todo = await new TodoEntity(databaseClient).update(todoToUpdate);
    if (todo) {
      return formatJSONResponse(todo);
    } else {
      // not found; 404
      return formatJSONResponse(null, 404);
    }
  } catch (error) {
    console.log('ERROR::updateTodo::', error);
    return formatJSONResponse(null, 500);
  }
};

export const main = middyfy(updateTodo);
