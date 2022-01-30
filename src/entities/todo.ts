import { Entity } from '@entities/entity';
import { DatabaseClient } from '@utils/database';

import {
  GetCommandInput,
  GetCommandOutput,
  PutCommandInput,
  ScanCommandInput,
  ScanCommandOutput,
} from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env.TABLE_NAME || 'table-name';

/**
 * Interface Todo describes the properties of a `Todo` entity.
 */
export interface Todo {
  todoId: string;
  title: string;
  isComplete: boolean;
  createdAt?: string;
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
    const output: GetCommandOutput = await this.databaseClient.get(input);

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
    const output: ScanCommandOutput = await this.databaseClient.scan(input);

    // 3. map/return output
    return output.Items as Todo[];
  }

  async create(todo: Todo): Promise<Todo> {
    console.log('TodoEntity::create');

    // 1. map input
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

  async update(item: Todo): Promise<Todo> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
