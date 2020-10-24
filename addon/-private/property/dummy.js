import Property, { property } from './property';

export default class DummyProperty extends Property {

  value = null

  init() {
    super.init(...arguments);
    this.value = this.opts.value;
  }

  getPropertyValue() {
    return this.value;
  }

  setPropertyValue(value) {
    this.value = value;
    return value;
  }

}

export const dummy = value => property({
  readOnly: false,
  deps: [],
  property: 'dummy',
  opts: {
    value
  }
});
