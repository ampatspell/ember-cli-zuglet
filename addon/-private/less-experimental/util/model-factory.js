import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';
import { generateModelClass } from '../../util/model';

const validate = (parent, key, inline, named, mapping, prepare) => {
  assert(`parent is required`, !!parent);
  assert(`key is required`, typeOf(key) === 'string');
  if(inline) {
    assert(`inline must be object`, typeOf(inline) === 'object');
  }
  if(named) {
    throw new Error('named not implemented');
  }
  if(mapping) {
    assert(`mapping must be function`, typeOf(mapping) === 'function');
  }
  assert(`prepare must be function`, typeOf(prepare) === 'function');
}

export default class ModelFactory {

  constructor({ parent, key, inline, named, mapping, prepare }) {
    validate(parent, key, inline, named, mapping, prepare);
    this.parent = parent;
    this.key = key;
    this.opts = {
      inline,
      named,
      mapping,
      prepare
    };
    this.process = {}
  }

  createFactory() {
    let { parent, key, opts: { inline } } = this;
    if(inline) {
      let modelClass = generateModelClass(parent, key, inline);
      return props => modelClass.create(props);
    }
    throw new Error('not implemented');
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
    let prepare = this.opts.prepare(...args);
    let mapped = this.mapping(...prepare);
    assert(`'prepare' function is required for ${model}`, typeOf(model.prepare) === 'function');
    return model.prepare(...mapped);
  }

  create(...args) {
    let factory = this.factory;
    let model = factory();
    let promise = this.prepare(model, ...args);
    return { model, promise };
  }

}
