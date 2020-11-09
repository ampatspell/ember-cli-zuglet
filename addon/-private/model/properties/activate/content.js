import BaseActivateProperty from './activate';
import { assert } from '@ember/debug';
import { diff, asOptionalObject } from '../../decorators/diff';

export default class ContentActivateProperty extends BaseActivateProperty {

  init() {
    super.init(...arguments);
  }

  @diff(asOptionalObject)
  _mapping() {
    let { owner, opts } = this;
    return opts.mapping && opts.mapping.call(owner, owner);
  }

  @diff()
  _value(current) {
    let mapping = this._mapping;
    if(current && !mapping.updated && mapping.current) {
      return current;
    }
    let { owner, opts: { value } } = this;
    if(this.opts.mapping) {
      return value.call(owner, mapping.current, owner);
    } else {
      return value.call(owner, owner);
    }
  }

  getPropertyValue() {
    let { activator } = this;
    if(!activator) {
      let { current } = this._value;
      this.value = current;
      activator = this.createActivator(current);
      this.activator = activator;
    } else {
      let { current } = this._value;
      if(current !== this.value) {
        this.value = current;
        this.assertActivatorType(activator, current);
        activator.setValue(current);
      }
    }
    return activator.getValue();
  }

  setPropertyValue() {
    assert(`@activate().content(...) is read-only`, false);
  }

}
