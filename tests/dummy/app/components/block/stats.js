import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { setGlobal } from 'zuglet/utils';

export default class BlockStatsComponent extends Component {

  @service
  store

  @action
  setGlobal(model) {
    setGlobal({ model });
  }

}
