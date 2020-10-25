import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { model } from 'zuglet/-private/property/activate';

export default class Thing extends EmberObject {

  @tracked
  isActivated = false

  @model
  child

}
