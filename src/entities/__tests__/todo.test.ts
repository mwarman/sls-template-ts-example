import { DatabaseClient } from '@libs/dynamo';
import { TodoEntity } from '../todo';
import { todoFixtures } from '@libs/__mocks__/fixtures';

jest.mock('@libs/dynamo');

describe('TodoEntity.findAll', () => {
  it('should find all Todos successfully', async () => {
    const dbClient = new DatabaseClient();
    const entity = new TodoEntity(dbClient);

    const result = await entity.findAll();

    expect(result).toEqual(todoFixtures);
    expect(result.length).toEqual(todoFixtures.length);
  });
});

describe('TodoEntity.findOne', () => {
  it('should find Todo successfully', async () => {
    const dbClient = new DatabaseClient();
    const entity = new TodoEntity(dbClient);

    const result = await entity.findOne(todoFixtures[0].todoId);

    expect(result).toEqual(todoFixtures[0]);
  });

  it('should invoke DatabaseClient.get with correct input', async () => {
    const dbClient = new DatabaseClient();
    dbClient.get = jest.fn().mockImplementation(() => {
      return { Item: { todoId: 'a1' } };
    });

    const entity = new TodoEntity(dbClient);
    const todoId = 'a1';
    const result = await entity.findOne(todoId);

    expect(result.todoId).toBe(todoId);
    expect(dbClient.get).toHaveBeenCalledTimes(1);
    expect(dbClient.get).toHaveBeenCalledWith({
      TableName: 'table-name',
      Key: {
        todoId: 'a1',
      },
    });
  });

  it('should return null when Todo not found', async () => {
    const dbClient = new DatabaseClient();
    dbClient.get = jest.fn().mockResolvedValue({});

    const entity = new TodoEntity(dbClient);

    const result = await entity.findOne('notFound');

    expect(result).toBeFalsy();
  });
});

describe('TodoEntity.create', () => {
  it('should create Todo successfully', async () => {
    const dbClient = new DatabaseClient();
    const entity = new TodoEntity(dbClient);

    const result = await entity.create(todoFixtures[0]);

    expect(result).toEqual(todoFixtures[0]);
  });
});

describe('TodoEntity.update', () => {
  it('should update Todo successfully', async () => {
    const dbClient = new DatabaseClient();
    const entity = new TodoEntity(dbClient);

    const result = await entity.update(todoFixtures[0]);

    expect(result).toEqual(todoFixtures[0]);
  });

  it('should return null when Todo to update is not found', async () => {
    const dbClient = new DatabaseClient();
    dbClient.update = jest.fn().mockImplementation(() => {
      const error = new Error('Mock error');
      error.name = 'ConditionalCheckFailedException';
      return Promise.reject(error);
    });

    const entity = new TodoEntity(dbClient);

    const result = await entity.update(todoFixtures[0]);

    expect(result).toBeFalsy();
  });

  it('should re-throw other errors when Todo to update is not successful', async () => {
    const dbClient = new DatabaseClient();
    dbClient.update = jest.fn().mockImplementation(() => {
      const error = new Error('other');
      return Promise.reject(error);
    });

    const entity = new TodoEntity(dbClient);

    await expect(entity.update(todoFixtures[0])).rejects.toThrow('other');
  });
});

describe('TodoEntity.delete', () => {
  it('should delete Todo successfully', async () => {
    const dbClient = new DatabaseClient();
    const entity = new TodoEntity(dbClient);

    const result = await entity.delete(todoFixtures[0].todoId);

    expect(result).toBeFalsy();
  });
});
