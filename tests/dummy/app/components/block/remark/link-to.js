import Component from '@glimmer/component';
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { reads } from "macro-decorators";

export default class BlockRemarkLinkToComponent extends Component {

  @service router;

  @reads('args.model') model;

  get url() {
    let { model: { route, model } } = this;
    if(model) {
      return this.router.urlFor(route, model);
    } else {
      return this.router.urlFor(route);
    }
  }

  @action
  transitionTo(e) {
    if(e.metaKey) {
      return;
    }
    e.preventDefault();
    let { model: { route, model } } = this;
    if(model) {
      this.router.transitionTo(route, model);
    } else {
      this.router.transitionTo(route);
    }
  }

}
