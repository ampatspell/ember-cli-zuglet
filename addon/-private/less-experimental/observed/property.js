import destroyable from '../../util/destroyable';
import { getOwner } from '@ember/application';

const reusable = () => true;
const get = internal => internal.getObservable();
const set = (internal, value) => internal.setObservable(value);

const factoryName = opts => {
  let { type } = opts;
  return `zuglet:less-experimental/observed/${type}/internal`;
}

const create = opts => {
  let factory = factoryName(opts);
  return function(key) {
    let parent = this;
    let owner = getOwner(this);
    let instance = owner.factoryFor(factory).create({ parent, key, opts });
    return instance;
  }
}

export default opts => {
  opts.type = opts.content ? 'dynamic' : 'writable';
  return destroyable({
    reusable,
    create: create(opts),
    get,
    set: opts.type === 'writable' ? set : null
  });
};
