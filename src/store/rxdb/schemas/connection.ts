import { RxJsonSchema } from 'rxdb';

export interface Connection {
  id?: string,
  from: string,
  to: string,
  created?: number,
  updated?: number,
}

export default ['connection', {
  "title": "Connection schema",
  "version": 0,
  "description": "A Connection",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "primary": true,
    },
    "from": {
      "ref": "thought",
      "type": "string",
    },
    "to": {
      "ref": "thought",
      "type": "string",
    },
    "created": {
      "type": "number",
    },
    "updated": {
      "type": "number",
    },
  },
  "required": ["from", "to"],
  "attachments": {

  }
} as RxJsonSchema];
