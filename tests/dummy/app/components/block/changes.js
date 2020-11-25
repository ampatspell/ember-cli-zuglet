import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

// <Block::Changes as |Changes|>
//   <Changes.Property @key="doc" @value={{this.doc}}/>
//   <Changes.Property @key="doc.data.things" @value={{this.doc.data.things}}/>
// </Block::Changes>
//
export default class BlockChangesComponent extends Component {

  @tracked
  changes = [];

  @action
  onPropertyChange(key, value) {
    this.changes = [ ...this.changes, { key, value } ];
  }

  @action
  clear() {
    this.changes = [];
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
