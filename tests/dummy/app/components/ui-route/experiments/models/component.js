import Component from '@ember/component';
import layout from './template';
import model from 'ember-cli-zuglet/experimental/model';
import models from 'ember-cli-zuglet/experimental/models';
import observed from 'ember-cli-zuglet/experimental/observed';

export default Component.extend({
  classNameBindings: [ ':ui-route-experiments-models' ],
  layout,

  model: model({

    query: observed(),

    models: models('query.content', 'data.text', {

      prepare(doc) {
        this.setProperties({ doc });
      }

    }),

    prepare() {
      let query = this.store.collection('messages').query();
      this.setProperties({ query });
      window.model = this;
    }

  }),

});
