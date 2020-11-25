import { getOwner as emberGetOwner } from '@ember/application';
import { assert } from '@ember/debug';

export const getOwner = (object, optional=false) => {
  assert(`object is required`, !!object);
  let owner = emberGetOwner(object);
  assert(`${object} must have Ember.js owner`, !!owner || optional);
  return owner;
}
