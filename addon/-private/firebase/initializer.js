import firebase from 'firebase';
import { resolve } from 'rsvp';
import { isFastBoot } from '../util/fastboot';
import { isInIframe } from '../util/browser';
import prepare from './prepare';

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
    return opts.firestore && opts.firestore.persistenceEnabled && !isFastBoot(sender) && !isInIframe();
  }

  _enablePersistence(firestore) {
    return resolve().then(() => {
      return firestore.enablePersistence({ synchronizeTabs: true });
    }).catch(() => {});
  }

  _prepare() {
    let { identifier, id, opts } = this;

    prepare(this.sender);

    this.app = firebase.initializeApp(opts.firebase, `${identifier}-${id}`);

    let firestore = this.app.firestore();

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
