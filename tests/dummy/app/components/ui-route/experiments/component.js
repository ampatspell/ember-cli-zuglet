import Component from '@ember/component';
import layout from './template';

const make = (name, description, route) => ({ name, description, route: `experiments.${route || name}` });

const experiments = [
  make('auth', 'sign-in and out anonymous and with email'),
  make('query', 'query load, observation, document observation'),
  make('document', 'two independent instances of the same doc'),
  make('image', 'image upload task, status')
]

export default Component.extend({
  classNameBindings: [ ':ui-route-experiments' ],
  layout,

  experiments
  
});
