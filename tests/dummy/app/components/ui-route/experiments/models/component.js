import Component from '@ember/component';
import layout from './template';
import model from 'ember-cli-zuglet/experimental/model';
import models from 'ember-cli-zuglet/experimental/models';
import observed from 'ember-cli-zuglet/experimental/observed';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-experiments-models' ],
  layout,

  model: model({

    query: observed(),

    models: models('query.content', 'id', 'data.{type,name}', {

      doc: null,

      id: readOnly('doc.id'),
      type: readOnly('doc.data.type'),
      name: readOnly('doc.data.name'),

      prepare(doc) {
        this.setProperties({ doc });
      },

      willDestroy() {
        this._super(...arguments);
        console.log(this+'', 'willDestroy');
      }

    }),

    prepare() {
      let query = this.store.collection('ducks').query();
      this.setProperties({ query });
      window.model = this;
      window.models = this.models;
    },

    willDestroy() {
      this._super(...arguments);
      console.log(this+'', 'willDestroy');
    }

  }),

});
