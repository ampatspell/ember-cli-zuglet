import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class BlockChangesPropertyComponent extends Component {

  @action
  onValue(_, [ value ]) {
    this.args.onPropertyChange(this.args.key, value);
  }

}
