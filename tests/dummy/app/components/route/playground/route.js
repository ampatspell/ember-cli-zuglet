import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class RouteRouteComponent extends Component {

  @action
  async add() {
    await this.args.model.add('Untitled');
  }

}
