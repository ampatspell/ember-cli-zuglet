import { A } from '@ember/array';

class ModelHolder {

  constructor(mapper, object) {
    this.mapper = mapper;
    this.object = object;
  }

  model(create) {
    let model = this._model;
    if(model === undefined && create) {
      model = this.mapper.createModel(this.object);
      this._model = model;
    }
    return model || null;
  }

  destroy() {
    let model = this._model;
    model && model.destroy();
  }

}

export default class ArrayMapper {

  constructor({ delegate }) {
    this.delegate = delegate;
    this.content = A([]);
  }

  createModel(object) {
    return this.delegate.model(object);
  }

  replace(start, remove, objects) {
    let content = this.content;

    let removed;
    if(remove) {
      removed = content.slice(start, start + remove);
    }

    let holders;
    if(objects) {
      holders = objects.map(object => new ModelHolder(this, object));
    }

    content.replace(start, remove, holders);

    if(removed) {
      removed.map(holder => holder.destroy());
    }
  }

  replaceAll(objects) {
    let remove = this.content.get('length');
    this.replace(0, remove, objects);
  }

  destroy() {
    let { content } = this;
    content.map(holder => holder.destroy());
    content.clear();
  }

}
