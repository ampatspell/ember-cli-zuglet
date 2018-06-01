import { cacheFor } from '../../util/destroyable';

export const observerFor = (owner, key) => {
  let internal = cacheFor(owner, key);
  return internal && internal.observer;
}
