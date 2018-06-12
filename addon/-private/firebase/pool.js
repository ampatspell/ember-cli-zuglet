import EmberObject from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { A } from '@ember/array';
import firebase from 'firebase';
import isFastBoot from '../util/is-fastboot';
import { resolve } from 'rsvp';

class FirebaseAllocator {

  constructor(pool, sender, opts) {
    this.pool = pool;
    this.id = pool._nextId();
    this.identifier = pool.get('identifier');
    this.sender = sender;
    this.opts = opts;
    this.promise = null;
    this._prepare();
  }

  _enablePersistence() {
    let { opts, sender } = this;
    return opts.firestore && opts.firestore.persistenceEnabled && !isFastBoot(sender);
  }

  _prepare() {
    let { identifier, id, opts } = this;

    this.app = firebase.initializeApp(opts.firebase, `${identifier}-${id}`);

    let firestore = this.app.firestore();
    firestore.settings({ timestampsInSnapshots: true });

    let promise;

    if(this._enablePersistence()) {
      promise = resolve(firestore.enablePersistence()).catch(() => {});
    } else {
      promise = resolve();
    }

    this.promise = promise.then(() => this.app);
  }

  release() {
    let { identifier, id, opts } = this;
    if(!this.pool._release(this, opts.pool.size)) {
      this.app.delete();
    }
  }

}

export default EmberObject.extend({

  identifier: null,
  id: 0,

  instances: null,

  init() {
    this._super(...arguments);
    this.instances = A();
  },

  allocate(sender, opts) {
    let instance = this.instances.shift();
    if(instance) {
      return instance;
    }
    return new FirebaseAllocator(this, sender, opts);
  },

  _release(instance, size) {
    let instances = this.instances;
    if(instances.length >= size) {
      return false;
    }
    instances.push(instance);
    return true;
  },

  _nextId() {
    return this.incrementProperty('id');
  },

  toString() {
    return `<zuglet:firebase/pool::${guidFor(this)}>`;
  }

});
