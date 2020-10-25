import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { model } from 'zuglet/-private/model';

@model
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
