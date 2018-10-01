import firebase from 'firebase';
import { resolve } from 'rsvp';
import { isFastBoot } from '../util/fastboot';

let _id = 0;

const nextId = () => {
  _id++;
  return _id;
}

export default class FirebaseInitializer {

  constructor(sender, identifier, opts) {
    this.sender = sender;
    this.identifier = identifier;
    this.opts = opts;
    this.promise = null;
    this.id = nextId();
    this._prepare();
  }

  _shouldEnablePersistence() {
    let { opts, sender } = this;
    return opts.firestore && opts.firestore.persistenceEnabled && !isFastBoot(sender);
  }

  _enablePersistence(firestore) {
    return resolve(firestore.enablePersistence({ experimentalTabSynchronization: true })).catch(() => {})
  }

  _prepare() {
    let { identifier, id, opts } = this;

    this.app = firebase.initializeApp(opts.firebase, `${identifier}-${id}`);

    let firestore = this.app.firestore();
    firestore.settings({ timestampsInSnapshots: true });

    let promise;

    if(this._shouldEnablePersistence()) {
      promise = this._enablePersistence(firestore);
    } else {
      promise = resolve();
    }

    this.promise = promise.then(() => this.app);
  }

  destroy() {
    this.promise.then(app => app.delete());
  }

}
