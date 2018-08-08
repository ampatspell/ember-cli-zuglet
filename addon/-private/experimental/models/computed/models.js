import { computed } from '@ember/object';
import { A } from '@ember/array';

export default key => computed(`${key}.@each.model`, function() {
  let models = this._models;

  if(!models) {
    models = A();
    this._models = models;
  }

  models.clear();

  let instances = this.get(key);

  instances.forEach(instance => {
    let model = instance.get('model');
    models.pushObject(model);
  })

  return models;
}).readOnly();
