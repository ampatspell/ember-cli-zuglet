import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { observed, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { all } from 'rsvp';

const forward = key => readOnly(`user.${key}`);

export default EmberObject.extend({

  user: null,

  uid:         forward('uid'),
  email:       forward('email'),

  doc: observed().owner('uid').content(({ uid, store }) => store.doc(`users/${uid}`).existing()),

  name: readOnly('doc.data.name'),

  async restore() {
    let { doc } = this;
    await all([
      resolveObservers(doc)
    ]);
  }

});
