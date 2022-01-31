import type { ValidatedEventAPIGatewayProxyHandler } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as crypto from 'crypto';

import schema from './schema';
import { Todo, TodoEntity } from '@entities/todo';
import { DatabaseClient } from '@libs/dynamo';

const createTodo: ValidatedEventAPIGatewayProxyHandler<typeof schema> = async (event) => {
  console.log('Handler::createTodo');
  console.log(`event:\n${JSON.stringify(event, null, 2)}`);

  try {
    const { title, isComplete = false } = event.body;
    const todoToCreate: Todo = {
      todoId: crypto.randomBytes(8).toString('hex'),
      title,
      isComplete,
      createdAt: new Date().toISOString(),
    };

    const databaseClient = new DatabaseClient();
    const todo = await new TodoEntity(databaseClient).create(todoToCreate);
    return formatJSONResponse(todo);
  } catch (error) {
    console.log('ERROR::createTodo::', error);
    return formatJSONResponse(null, 500);
  }
};

export const main = middyfy(createTodo);
