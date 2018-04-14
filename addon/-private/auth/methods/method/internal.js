import Internal from '../../../internal/internal';

export default Internal.extend({

  methods: null,
  type: null,

  createModel() {
    let type = this.get('type');
    return this.methods.factoryFor(`zuglet:auth/method/${type}`).create({ _internal: this });
  }

});
