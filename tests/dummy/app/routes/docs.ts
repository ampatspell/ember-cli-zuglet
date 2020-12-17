import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type DocsService from '../services/docs';

export default class DocsRoute extends Route {

  @service
  docs!: DocsService

  model() {
    return this.docs;
  }

}
