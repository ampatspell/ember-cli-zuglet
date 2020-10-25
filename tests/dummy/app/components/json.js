import Component from '@glimmer/component';
import { objectToJSON } from 'zuglet/-private/util/object-to-json';

export default class JsonComponent extends Component {

  get string() {
    return JSON.stringify(objectToJSON(this.args.value), null, 2);
  }

}
