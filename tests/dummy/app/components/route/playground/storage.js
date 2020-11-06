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

  @tracked
  url

  @tracked
  metadata

  @activate()
  task

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  @action
  onFile(file) {
    this.file = file;
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

  @action
  async getUrl() {
    try {
      let url = await this.store.storage.ref('hello').url();
      this.url = url;
    } catch(err) {
      this.url = err;
    }
  }

  @action
  async getMetadata() {
    try {
      let metadata = await this.store.storage.ref('hello').metadata();
      this.metadata = metadata;
    } catch(err) {
      this.metadata = metadata;
    }
  }

  toString() {
    return toString(this);
  }

}
