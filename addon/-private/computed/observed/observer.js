import { get } from '@ember/object';
import { cacheFor } from '../../util/destroyable';

export const observerFor = (owner, key) => {
  let internal = cacheFor(owner, key);
  return internal && internal.observer;
}

export const observerPromiseFor = (owner, key) => {
  let observer = observerFor(owner, key);
  return observer && get(observer, 'promise');
}
