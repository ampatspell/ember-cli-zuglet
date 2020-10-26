import { toPrimitive } from './to-primitive';

export const toString = (model, string) => `<${toPrimitive(model)}${string ? `:${string}` : ''}>`;
