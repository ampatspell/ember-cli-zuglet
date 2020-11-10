import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BlockChangesComponent extends Component {

  @tracked
  changes = [];

  @action
  onPropertyChange(key, value) {
    this.changes = [ ...this.changes, { key, value } ];
  }

  get log() {
    return this.changes.map(({ key, value })=> {
      if(value === undefined) {
        value = '[undefined]';
      } else if(value === null) {
        value = '[null]';
      }
      return `${key}: ${value}`;
    }).join('\n');
  }

}
