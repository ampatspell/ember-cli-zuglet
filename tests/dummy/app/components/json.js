import Component from '@glimmer/component';
import { objectToJSON } from 'zuglet/utils';

export default class JsonComponent extends Component {

  get string() {
    return JSON.stringify(objectToJSON(this.args.value), null, 2);
  }

}
