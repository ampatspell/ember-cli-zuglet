import { computed } from '@ember/object';
import { A } from '@ember/array';

export default key => computed(`${key}.@each.model`, function() {
  let instances = this.get(key);
  if(!instances) {
    return;
  }

  let models = this._models;

  if(!models) {
    models = A();
    this._models = models;
  }

  models.clear();

  instances.forEach(instance => {
    let model = instance.get('model');
    models.pushObject(model);
  })

  return models;
}).readOnly();
