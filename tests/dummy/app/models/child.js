import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class Child extends EmberObject {

  @tracked
  isActivated = false

  @tracked
  foo = 'nothing'

  onActivated() {
    this.foo = 'activated';
  }

  onDeactivated() {
    this.foo = 'deactivated';
  }

}
