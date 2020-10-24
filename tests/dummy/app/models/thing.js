import EmberObject from '@ember/object';
import { dummy } from 'zuglet/-private/property/dummy';
import { tracked } from '@glimmer/tracking';

export default class Thing extends EmberObject {

  @tracked
  isActivated = false

  @dummy('foobar')
  foo

}
