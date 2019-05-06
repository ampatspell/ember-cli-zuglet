import Route from '@ember/routing/route';
import { route, observed, resolveObservers, models } from 'ember-cli-zuglet/lifecycle';

export default Route.extend({

  model: route().inline({

    doc: observed().content(({ store }) => store.doc('things/wip').existing()),

    models: models('doc.data.array').object('type').inline({

      prepare(data, owner) {
        this.setProperties({ data, owner });
      },

      remove() {
        this.owner.remove(this.data);
      }

    }),

    prepare() {
    },

    load() {
      return resolveObservers(this.doc);
    },

    add(type, name) {
      this.doc.get('data.array').pushObject({ type, name });
    },

    remove(object) {
      this.doc.get('data.array').removeObject(object);
    },

    save() {
      this.doc.save();
    }

  })

});
