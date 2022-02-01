export default {
  type: 'object',
  properties: {
    todoId: { type: 'string' },
    title: { type: 'string' },
    isComplete: { type: 'boolean' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
  required: ['isComplete', 'title', 'todoId'],
} as const;
