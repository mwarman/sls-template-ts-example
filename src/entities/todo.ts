import * as crypto from 'crypto';

import { Entity } from '@entities/entity';
import { DatabaseClient } from '@libs/dynamo';

import {
  DeleteCommandInput,
  GetCommandInput,
  PutCommandInput,
  ScanCommandInput,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env.TABLE_NAME || 'table-name';

/**
 * Interface Todo describes the properties of a `Todo` entity.
 */
export interface Todo {
  todoId?: string;
  title: string;
  isComplete: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * TodoEntity implements the persistence behaviors for a `Todo` entity.
 */
export class TodoEntity implements Entity<Todo, string> {
  private databaseClient: DatabaseClient;

  constructor(databaseClient: DatabaseClient) {
    this.databaseClient = databaseClient;
  }

  async findOne(todoId: string): Promise<Todo> {
    console.log('TodoEntity::findOne');

    // 1. map input
    const input: GetCommandInput = {
      TableName: TABLE_NAME,
      Key: {
        todoId,
      },
    };

    // 2. fetch from database
    const output = await this.databaseClient.get(input);

    // 3. map/return output
    return output.Item as Todo;
  }

  async findAll(): Promise<Todo[]> {
    console.log('TodoEntity::findAll');

    // 1. map input
    const input: ScanCommandInput = {
      TableName: TABLE_NAME,
    };

    // 2. fetch from database
    const output = await this.databaseClient.scan(input);

    // 3. map/return output
    return output.Items as Todo[];
  }

  async create(todo: Todo): Promise<Todo> {
    console.log('TodoEntity::create');

    // 1. map input
    todo.todoId = crypto.randomBytes(8).toString('hex');
    todo.createdAt = new Date().toISOString();
    const input: PutCommandInput = {
      TableName: TABLE_NAME,
      Item: {
        ...todo,
      },
      ConditionExpression: 'attribute_not_exists(todoId)',
    };

    // 2. put in database (Dynamo put item does not return the created item)
    await this.databaseClient.put(input);

    // 3. map/return output
    return todo;
  }

  async update(todo: Todo): Promise<Todo> {
    console.log('TodoEntity::update');

    try {
      // 1. map input
      todo.updatedAt = new Date().toISOString();
      const input: UpdateCommandInput = {
        TableName: TABLE_NAME,
        Key: {
          todoId: todo.todoId,
        },
        UpdateExpression: 'SET title = :ti, isComplete = :ic, updatedAt = :ua',
        ConditionExpression: 'todoId = :id',
        ExpressionAttributeValues: {
          ':id': todo.todoId,
          ':ti': todo.title,
          ':ic': todo.isComplete,
          ':ua': todo.updatedAt,
        },
        ReturnValues: 'ALL_NEW',
      };

      // 2. put in database
      const output = await this.databaseClient.update(input);

      // 3. map/return output
      return output.Attributes as Todo;
    } catch (error) {
      if (error.name === 'ConditionalCheckFailedException') {
        // not found
        return null;
      }
      throw error;
    }
  }

  async delete(todoId: string): Promise<void> {
    console.log('TodoEntity::delete');

    // 1. map input
    const input: DeleteCommandInput = {
      TableName: TABLE_NAME,
      Key: {
        todoId,
      },
    };

    // 2. delete from database
    await this.databaseClient.delete(input);

    // 3. map/return output
    return;
  }
}
