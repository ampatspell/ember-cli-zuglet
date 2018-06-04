import EmberObject from '@ember/object';

export default EmberObject.extend({

  getObservable() {
    return this.observable;
  },

  setObservable(next) {
    if(this.observable === next) {
      return next;
    }

    this.stopObserving();
    this.observable = next;
    this.startObserving();

    return next;
  },

  stopObserving() {
    let observer = this.observer;
    if(!observer) {
      return;
    }
    observer.cancel();
    this.observer = null;
  },

  startObserving() {
    let observable = this.observable;
    if(!observable) {
      return;
    }
    this.observer = observable.observe();
  },

  willDestroy() {
    this.stopObserving();
    this._super(...arguments);
  }

});
