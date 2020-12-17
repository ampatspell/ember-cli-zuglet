import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';
import type DummyStore from '../store';

@route()
export default class RouteRoute extends Route {

  @service
  store!: DummyStore

  model(): void {
  }

  async load(): Promise<void> {
    // resolve current user before rendering app
    await this.store.load();
  }

}
