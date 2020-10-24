import EmberObject from '@ember/object';
import { dummy } from 'zuglet/-private/dev/dummy';

export default class Thing extends EmberObject {

  @dummy('foobar')
  foo

}
