import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';
import { generateModelClass, modelFactoryForShortName } from '../../util/model';

const validate = (parent, key, inline, named, mapping, delegate) => {
  assert(`parent is required`, !!parent);
  assert(`key is required`, typeOf(key) === 'string');
  if(inline) {
    assert(`inline must be object`, typeOf(inline) === 'object');
  }
  if(named) {
    assert(`named must be string or function`, typeOf(named) === 'string' || typeOf(named) === 'function');
  }
  if(mapping) {
    assert(`mapping must be function`, typeOf(mapping) === 'function');
  }
  assert(`inline or named is requied, not both`, !inline || !named);
  assert(`inline or named is required`, inline || named);
  assert(`delegate must be object`, typeOf(delegate) === 'object');
  assert(`delegate.prepare must be function`, typeOf(delegate.prepare) === 'function');
  assert(`delegate.named must be function`, typeOf(delegate.named) === 'function');
}

export default class ModelFactory {

  constructor({ parent, key, inline, named, mapping, delegate }) {
    validate(parent, key, inline, named, mapping, delegate);
    this.parent = parent;
    this.key = key;
    this.opts = {
      inline,
      named,
      mapping,
    };
    this.delegate = delegate;
    this.process = {}
  }

  createFactory() {
    let { parent, key, opts: { inline, named } } = this;
    if(inline) {
      let modelClass = generateModelClass(parent, key, inline);
      return props => modelClass.create(props);
    } else if(named) {
      if(typeof named === 'string') {
        let modelClass = modelFactoryForShortName(parent, named);
        return props => modelClass.create(props);
      } else {
        return (props, args) => {
          let name = named(...this.delegate.named(...args));
          let modelClass = modelFactoryForShortName(parent, name);
          return modelClass.create(props);
        }
      }
    }
  }

  get factory() {
    let process = this.process.factory;
    if(!process) {
      process = this.createFactory();
      this.process.factory = process;
    }
    return process;
  }

  createMapping() {
    let { mapping } = this.opts;
    if(mapping) {
      return (...args) => {
        let ret = mapping(...args);
        return [ ret ];
      }
    }
    return (...args) => args;
  }

  get mapping() {
    let process = this.process.mapping;
    if(!process) {
      process = this.createMapping();
      this.process.mapping = process;
    }
    return process;
  }

  prepare(model, ...args) {
    let prepare = this.delegate.prepare(...args);
    let mapped = this.mapping(...prepare);
    assert(`'prepare' function is required for ${model}`, typeOf(model.prepare) === 'function');
    return model.prepare(...mapped);
  }

  create(...args) {
    let factory = this.factory;
    let model = factory({}, args);
    let promise = this.prepare(model, ...args);
    return { model, promise };
  }

}
