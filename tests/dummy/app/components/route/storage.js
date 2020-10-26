import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate } from 'zuglet/decorators';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

@root()
export default class RouteStorageComponent extends Component {

  @service
  store

  @tracked
  file

  @activate()
  task

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  @action
  onFiles(e) {
    let files = e.target.files;
    if(files) {
      let [ file ] = files;
      this.file = file || null;
    } else {
      this.file = null;
    }
  }

  @action
  upload() {
    let { file } = this;
    this.file = null;
    let task = this.store.storage.ref('hello').put({
      type: 'data',
      data: file,
      metadata: {
        contentType: file.type,
        contentDisposition: `filename="${file.name}"`
      }
    });
    this.task = task;
  }

  toString() {
    return toString(this);
  }

}
