import { getOwner as emberGetOwner } from '@ember/application';
import { assert } from '@ember/debug';

export const getOwner = (object, optional=false) => {
  let owner = emberGetOwner(object);
  assert(`${object} doesn't have owner`, !!owner || optional);
  return owner;
}
