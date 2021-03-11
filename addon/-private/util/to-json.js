import { toPrimitive } from './to-primitive';

export const toJSON = (instance, props) => {
  return {
    instance: toPrimitive(instance),
    ...props
  };
};
