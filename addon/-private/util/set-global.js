import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import { typeOf } from '@ember/utils';

export default (sender, hash) => {
  assert(`hash must be object`, typeOf(hash) === 'object');
  assert(`sender must be instance`, typeOf(sender) === 'instance');

  let owner = getOwner(sender);
  let environment = owner.factoryFor('config:environment').class.environment;

  if(environment === 'production') {
    return;
  }

  let silent = environment === 'test';

  let keys = Object.keys(hash);
  for(let key in hash) {
    let value = hash[key];
    window[key] = value;
    if(!silent) {
      console.log(`window.${key} = ${value}`);
    }
  }

  let cancelOnDestroy;

  let cancelled = false;
  let cancel = () => {
    if(cancelled) {
      return;
    }
    cancelled = true;

    keys.map(key => {
      delete window[key];
    });

    cancelOnDestroy();
  };

  if(owner) {
    let stores = owner.lookup('zuglet:stores');
    cancelOnDestroy = stores._internal.registerWillDestroyListener(() => cancel());
  }

  return cancel;
};
