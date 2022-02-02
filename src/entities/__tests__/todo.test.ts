import { DatabaseClient } from '@libs/dynamo';
import { TodoEntity } from '../todo';
import { todoFixtures } from '@libs/__mocks__/fixtures';

jest.mock('@libs/dynamo');

const DatabaseClientMock = DatabaseClient as jest.MockedClass<typeof DatabaseClient>;
const dbClient = new DatabaseClientMock();

describe('TodoEntity.findAll', () => {
  const mockScan = jest.fn().mockResolvedValue({ Items: todoFixtures });

  beforeEach(() => {
    DatabaseClientMock.mockClear();
    dbClient.scan = mockScan;
    mockScan.mockClear();
  });

  it('should find all Todos successfully', async () => {
    const entity = new TodoEntity(dbClient);

    const result = await entity.findAll();

    expect(result).toEqual(todoFixtures);
    expect(result.length).toEqual(todoFixtures.length);
  });

  it('should call DatabaseClient.scan with correct input', async () => {
    const entity = new TodoEntity(dbClient);
    const result = await entity.findAll();

    expect(result).toEqual(todoFixtures);
    expect(mockScan).toHaveBeenCalledTimes(1);
    expect(mockScan).toHaveBeenCalledWith({
      TableName: 'table-name',
    });
  });
});

describe('TodoEntity.findOne', () => {
  const mockGet = jest.fn().mockImplementation((input) => {
    const Item = todoFixtures.find((todo) => todo.todoId === input.Key.todoId);
    return Promise.resolve({
      Item,
    });
  });

  beforeEach(() => {
    DatabaseClientMock.mockClear();
    dbClient.get = mockGet;
    mockGet.mockClear();
  });

  it('should find Todo successfully', async () => {
    const entity = new TodoEntity(dbClient);

    const result = await entity.findOne(todoFixtures[0].todoId);

    expect(result).toEqual(todoFixtures[0]);
  });

  it('should call DatabaseClient.get with correct input', async () => {
    const entity = new TodoEntity(dbClient);
    const result = await entity.findOne(todoFixtures[0].todoId);

    expect(result).toEqual(todoFixtures[0]);
    expect(dbClient.get).toHaveBeenCalledTimes(1);
    expect(dbClient.get).toHaveBeenCalledWith({
      TableName: 'table-name',
      Key: {
        todoId: todoFixtures[0].todoId,
      },
    });
  });

  it('should return null when Todo not found', async () => {
    const entity = new TodoEntity(dbClient);

    const result = await entity.findOne('notFound');

    expect(result).toBeFalsy();
  });
});

describe('TodoEntity.create', () => {
  beforeEach(() => {
    DatabaseClientMock.mockClear();
  });

  it('should create Todo successfully', async () => {
    const entity = new TodoEntity(dbClient);

    const result = await entity.create(todoFixtures[0]);

    expect(result).toEqual(todoFixtures[0]);
  });
});

describe('TodoEntity.update', () => {
  const mockUpdate = jest.fn().mockImplementation((input) => {
    const Attributes = todoFixtures.find((todo) => todo.todoId === input.Key.todoId);
    return Promise.resolve({
      Attributes,
    });
  });

  beforeEach(() => {
    DatabaseClientMock.mockClear();
    dbClient.update = mockUpdate;
    mockUpdate.mockClear();
  });

  it('should update Todo successfully', async () => {
    const entity = new TodoEntity(dbClient);

    const result = await entity.update(todoFixtures[0]);

    expect(result).toEqual(todoFixtures[0]);
  });

  it('should return null when Todo to update is not found', async () => {
    // override the default mocked update function
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
    // override the default mocked update function
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
    const entity = new TodoEntity(dbClient);

    const result = await entity.delete(todoFixtures[0].todoId);

    expect(result).toBeFalsy();
  });
});
