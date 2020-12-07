import State from './state';
import { registerDestructor } from '@ember/destroyable';

export default class RootState extends State {

  init() {
    super.init(...arguments);
    registerDestructor(this.owner, () => this._onOwnerWillDestroy());
    this.activate(this);
  }

  _onOwnerWillDestroy() {
    this.deactivate(this);
  }

}
