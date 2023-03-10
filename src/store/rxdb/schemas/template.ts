import { RxJsonSchema } from 'rxdb';

export interface Template {
  id?: string;
  name: string;
  template: any;
  created?: number;
  updated?: number;
}

export default ['template', {
  'title': 'Template schema',
  'version': 0,
  'description': 'A Template',
  'type': 'object',
  'primaryKey': 'id',
  'properties': {
    'id': {
      'type': 'string',
    },
    'name': {
      'type': 'string',
    },
    'template': {
      'type': 'string',
    },
    'created': {
      'type': 'number',
    },
    'updated': {
      'type': 'number',
    },
  },
  'required': ['name', 'template'],
  'attachments': {

  }
} as RxJsonSchema<Template>];
