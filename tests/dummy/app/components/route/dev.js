import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { tracked } from '@glimmer/tracking';
import { object, raw, property } from 'zuglet/-private/tracking/object';
import { alias } from 'macro-decorators';

export default class RouteDevComponent extends Component {

  @service
  store

  @tracked
  isDirty = false

  @object()
  data

  @raw('data')
  raw

  @property('data')
  property

  @alias('data.info.name')
  name

  constructor() {
    super(...arguments);
    setGlobal({ component: this });

    this.data = { info: { name: 'hey there' }}
    this.property.onDirty = () => this.isDirty = true;
  }

  toString() {
    return toString(this);
  }

}
