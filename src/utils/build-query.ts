import { FilterQuery } from 'mongoose';

export function buildQuery<T>(dto: Partial<T>, mappings: Record<string, string>): FilterQuery<T> {
  const query: FilterQuery<T> = {};

  for (const [key, value] of Object.entries(dto)) {
    if (value !== undefined && value !== '') {
      const field = mappings[key] || key;

      if (typeof value === 'string') {
        if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
          setNestedField(query, field, value.toLowerCase() === 'true');
        } else if (!isNaN(Number(value))) {
          setNestedField(query, field, Number(value));
        } else {
          setNestedField(query, field, new RegExp(value, 'i'));
        }
      } else {
        setNestedField(query, field, value);
      }
    }
  }

  return query;
}

function setNestedField(obj: any, path: string, value: any) {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
}
