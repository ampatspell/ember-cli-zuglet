import Property, { property } from './property';
import { get } from '@ember/object';
import { A } from '@ember/array';
import { getOwner } from '../../util/get-owner';
import { getState } from '../state';
import { getStores } from '../../stores';

const marker = Symbol('MODELS');

const setMarker = (model, value) => {
  let state = getState(model);
  state[marker] = value;
}

const getMarker = model => {
  let state = getState(model);
  return state[marker];
}

export default class ModelsProperty extends Property {

  init() {
    super.init(...arguments);
    this.models = A([]);
    this.stores = getStores(this);
  }

  get _source() {
    let { owner, opts: { sourceKey } } = this;
    let source = get(owner, sourceKey);
    if(!source) {
      return;
    }
    return A(source);
  }

  //

  createModel(source) {
    let { owner, opts: { modelName, mapping } } = this;
    let props = mapping.call(owner, source, owner);
    let model = this.stores.models.create(modelName, props);
    setMarker(model, source);
    return model;
  }

  //

  sourceArrayDidChange(source) {
    source = A(source);

    let current = this.models;
    let removed = A([ ...current ]);
    let added = A();
    let models = A();

    let find = doc => current.find(model => getMarker(model) === doc);
    let create = doc => this.createModel(doc);

    source.forEach(doc => {
      let model = find(doc);
      if(model) {
        removed.removeObject(model);
      } else {
        model = create(doc);
        added.pushObject(model);
      }
      models.pushObject(model);
    });

    if(this.isActivated) {
      this.deactivateValues(removed);
      this.activateValues(added);
    }

    this.models = models;
  }

  sourceDidChange() {
    let next = this._source;
    let current = this.source;
    this.sourceArrayDidChange(next);
    if(next !== current) {
      this.source = next;
    }
  }

  getPropertyValue() {
    this.sourceDidChange();
    return this.models;
  }

  //

  activateValues(models) {
    models.map(model => this.activateValue(model));
  }

  deactivateValues(models) {
    models.map(model => this.deactivateValue(model));
  }

  //

  onActivated() {
    this.activateValues(this.models);
  }

  onDeactivated() {
    this.deactivateValues(this.models);
  }

}

export const models = (sourceKey, modelName, mapping) => property({
  readOnly: true,
  deps: [ `${sourceKey}.[]` ],
  property: 'models',
  opts: {
    sourceKey,
    modelName,
    mapping
  }
});
