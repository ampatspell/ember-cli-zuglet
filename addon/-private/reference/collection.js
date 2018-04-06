import Reference from './reference';

export default Reference.extend({

  doc(path) {
    return this._internal.doc(path).model(true);
  }

});
