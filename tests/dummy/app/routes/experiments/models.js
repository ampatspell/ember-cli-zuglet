import Route from '@ember/routing/route';
import model from 'ember-cli-zuglet/experimental/model/route';
import models from 'ember-cli-zuglet/less-experimental/models';
import observed from 'ember-cli-zuglet/experimental/observed';
import { readOnly } from '@ember/object/computed';

export default Route.extend({

  model: model({

    query: observed(),

    hamsters: models('query.content').inline({

      doc: null,

      id: readOnly('doc.id'),
      type: readOnly('doc.data.type'),
      name: readOnly('doc.data.name'),

      prepare(doc) {
        this.setProperties({ doc });
      },

    }),

    insert() {
      let { isLoaded, size } = this.get('query').getProperties('isLoaded', 'size');

      if(!isLoaded) {
        return;
      }

      if(size > 0) {
        return;
      }

      let coll = this.query.ref;

      return this.store.batch(batch => {
        const save = hash => batch.save(coll.doc().new(hash));
        save({ type: 'regular', name: 'Green' });
        save({ type: 'regular', name: 'Yellow' });
        save({ type: 'regular', name: 'White' });
        save({ type: 'special', name: 'Orange' });
        save({ type: 'regular', name: 'Brown' });
        save({ type: 'regular', name: 'Pink' });
        save({ type: 'regular', name: 'Red' });
      });
    },

    prepare() {
      let query = this.store.collection('hamsters').query();
      this.setProperties({ query });

      window.route = this;

      return query.observers.promise.then(() => this.insert());
    }

  })

});
