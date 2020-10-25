import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { activate } from 'zuglet';

export default class Thing extends EmberObject {

  @tracked
  isActivated = false

  @tracked
  foo = 'nothing'

  @activate
  child

  onActivated() {
    this.foo = 'activated';
  }

  onDeactivated() {
    this.foo = 'deactivated';
  }

}
