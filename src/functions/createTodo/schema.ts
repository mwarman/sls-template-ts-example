export default {
  type: 'object',
  properties: {
    title: { type: 'string' },
    isComplete: { type: 'boolean' },
  },
  required: ['title'],
} as const;
