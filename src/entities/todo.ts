import { Entity } from '@entities/entity';
import { DatabaseClient } from '@utils/database';

import { ScanCommandInput, ScanCommandOutput } from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env.TABLE_NAME || 'table-name';

/**
 * Interface Todo describes the properties of a `Todo` entity.
 */
export interface Todo {
  todoId: string;
  title: string;
  isComplete: boolean;
}

/**
 * TodoEntity implements the persistence behaviors for a `Todo` entity.
 */
export class TodoEntity implements Entity<Todo, string> {
  private databaseClient: DatabaseClient;

  constructor(databaseClient: DatabaseClient) {
    this.databaseClient = databaseClient;
  }

  async findOne(id: string): Promise<Todo> {
    throw new Error('Method not implemented.');
  }

  async findAll(): Promise<Todo[]> {
    console.log('TodoEntity::findAll');

    // 1. format input
    const input: ScanCommandInput = {
      TableName: TABLE_NAME,
    };

    // 2. fetch from database
    const output: ScanCommandOutput = await this.databaseClient.scan(input);

    // 3. parse output
    return output.Items as Todo[];
  }

  async create(item: Todo): Promise<Todo> {
    throw new Error('Method not implemented.');
  }

  async update(item: Todo): Promise<Todo> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
