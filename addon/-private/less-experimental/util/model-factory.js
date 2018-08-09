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
    throw new Error('mapping not implemented');
  }
  assert(`prepare must be function`, typeOf(prepare) === 'function');
}

export default class ModelFactory {

  constructor({ parent, key, inline, named, mapping, prepare }) {
    validate(parent, key, inline, named, mapping, prepare);
    this.parent = parent;
    this.key = key;
    this.inline = inline;
    this.named = named;
    this.mapping = mapping;
    this.prepare = prepare;
  }

  createProcess() {
    let { parent, key, inline } = this;
    if(inline) {
      let modelClass = generateModelClass(parent, key, inline);
      return props => modelClass.create(props);
    }
    throw new Error('not implemented');
  }

  get factory() {
    let process = this._process;
    if(!process) {
      process = this.createProcess();
      this._process = process;
    }
    return process;
  }

  prepareModel(model, ...args) {
    let prepare = this.prepare(...args);
    assert(`'prepare' function is required for ${model}`, typeOf(model.prepare) === 'function');
    return model.prepare(...prepare);
  }

  create(...args) {
    let factory = this.factory;
    let model = factory();
    let promise = this.prepareModel(model, ...args);
    return { model, promise };
  }

}
