import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class Child extends EmberObject {

  @tracked
  isActivated = false

}
