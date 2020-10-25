import State from './base';
import { registerDestructor } from '@ember/destroyable';

export default class RootState extends State {

  registersActivated = true

  init() {
    super.init(...arguments);
    registerDestructor(this.owner, () => this.onOwnerWillDestroy());
    this.activate(this);
  }

  onOwnerWillDestroy() {
    this.deactivate(this);
  }

}
