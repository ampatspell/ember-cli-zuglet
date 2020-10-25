import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';

export const getOwner = (object, optional=false) => {
  let owner = getOwner(object);
  assert(`${object} doesn't have owner`, !!owner || optional);
  return owner;
}
