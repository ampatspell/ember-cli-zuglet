import EmberObject from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { A } from '@ember/array';
import firebase from 'firebase';
import isFastBoot from '../util/is-fastboot';
import { resolve } from 'rsvp';

export default EmberObject.extend({

  identifier: null,
  instances: null,
  id: 0,

  init() {
    this._super(...arguments);
    console.log('init', this+'');
    this.instances = A();
  },

  _release(opts, instance) {
    console.log('release', opts, instance);
    instance.delete();
  },

  _createInstancePromise(sender, opts) {
    this.incrementProperty('id');
    let { id, identifier } = this.getProperties('id', 'identifier');
    let app = firebase.initializeApp(opts.firebase, `${identifier}-${id}`);
    let firestore = app.firestore();
    firestore.settings({ timestampsInSnapshots: true });
    if(opts.firestore && opts.firestore.persistenceEnabled && !isFastBoot(sender)) {
      return resolve(firestore.enablePersistence()).catch(() => {}).then(() => app);
    }
    return resolve(app);
  },

  _allocate(sender, opts) {
    return this._createInstancePromise(sender, opts).then(app => {
      let release = () => this._release(opts, app);
      return { app, release };
    });
  },

  allocate(sender, opts) {
    return this._allocate(sender, opts);
  },

  toString() {
    return `<zuglet:firebase/pool::${guidFor(this)}>`;
  }

});
