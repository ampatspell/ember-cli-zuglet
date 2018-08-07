import Internal from '../../internal/internal';

export default Internal.extend({

  owner: null,
  key: null,
  dependencies: null,
  factory: null,
  mapping: null,

  createModel() {
    console.log('createModel');
  }

});
