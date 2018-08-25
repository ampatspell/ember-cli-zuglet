import { cacheFor } from '../../util/destroyable';

export default (owner, key) => {
  let internal = cacheFor(owner, key);
  return internal && internal.getObserver();
}
