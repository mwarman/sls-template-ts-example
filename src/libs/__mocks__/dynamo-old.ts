import {
  DeleteCommandOutput,
  GetCommandInput,
  GetCommandOutput,
  PutCommandOutput,
  ScanCommandOutput,
  UpdateCommandInput,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';

import { todoFixtures } from './fixtures';

export class DatabaseClient {
  scan(): Promise<ScanCommandOutput> {
    return Promise.resolve({
      $metadata: '',
      Items: todoFixtures,
    });
  }

  get(input: GetCommandInput): Promise<GetCommandOutput> {
    const Item = todoFixtures.find((todo) => todo.todoId === input.Key.todoId);
    return Promise.resolve({
      $metadata: '',
      Item,
    });
  }

  put(): Promise<PutCommandOutput> {
    return Promise.resolve({
      $metadata: '',
    });
  }

  update(input: UpdateCommandInput): Promise<UpdateCommandOutput> {
    const Attributes = todoFixtures.find((todo) => todo.todoId === input.Key.todoId);
    return Promise.resolve({
      $metadata: '',
      Attributes,
    });
  }

  delete(): Promise<DeleteCommandOutput> {
    return Promise.resolve({
      $metadata: '',
    });
  }
}
