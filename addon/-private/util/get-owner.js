import { getOwner as emberGetOwner } from '@ember/application';
import { assert } from '@ember/debug';

const {
  assign
} = Object;

export const getOwner = (object, opts) => {
  let { optional } = assign({ optional: false }, opts);
  assert(`object is required`, !!object);
  let owner = emberGetOwner(object);
  assert(`${object} must have Ember.js owner`, !!owner || optional);
  return owner;
}
