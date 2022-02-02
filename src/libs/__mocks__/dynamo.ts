import { todoFixtures } from './fixtures';

export const mockDelete = jest.fn();

export const mockGet = jest.fn().mockImplementation((input) => {
  const Item = todoFixtures.find((todo) => todo.todoId === input.Key.todoId);
  return Promise.resolve({
    Item,
  });
});

export const mockPut = jest.fn();

export const mockScan = jest.fn().mockResolvedValue({ Items: todoFixtures });

export const mockUpdate = jest.fn().mockImplementation((input) => {
  const Attributes = todoFixtures.find((todo) => todo.todoId === input.Key.todoId);
  return Promise.resolve({
    Attributes,
  });
});

export const DatabaseClient = jest.fn().mockImplementation(() => {
  return {
    delete: mockDelete,
    get: mockGet,
    put: mockPut,
    scan: mockScan,
    update: mockUpdate,
  };
});
