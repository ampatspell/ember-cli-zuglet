import Reference from './reference';

export default Reference.extend({

  collection(path) {
    return this._internal.collection(path).model(true);
  }

});
