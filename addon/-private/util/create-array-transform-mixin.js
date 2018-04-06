import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import { A } from '@ember/array';

export default hash => Mixin.create({

  objectAtContent(idx) {
    let object = A(get(this, 'arrangedContent')).objectAt(idx);
    return hash.public.call(this, object);
  },

  replaceContent(idx, amt, objects) {
    objects = A(objects).map(object => {
      return hash.internal.call(this, object);
    });
    this._super(idx, amt, objects);
  }

});
