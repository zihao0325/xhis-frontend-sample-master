import Ajv from 'ajv';

const configSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', pattern: '^w-[a-z0-9.]+-[a-z0-9.]+$' },
    description: { type: 'string' },
    displayName: { type: 'string' },
    w: { type: 'number', maximum: 200, minimum: 0 },
    h: { type: 'number', maximum: 200, minimum: 0 },
    minW: { type: 'number', maximum: 200, minimum: 0 },
    minH: { type: 'number', maximum: 200, minimum: 0 },
    maxW: { type: 'number', maximum: 200, minimum: 0 },
    maxH: { type: 'number', maximum: 200, minimum: 0 },
    extra: { type: 'object' },
  },
  additionalProperties: false,
  required: ['name', 'description', 'displayName', 'w', 'h'],
};

const ajv = new Ajv();
const validate = ajv.compile(configSchema);

export { validate, configSchema };
