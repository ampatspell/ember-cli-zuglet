import { all } from 'rsvp';
import { get } from '@ember/object';

export default (...args) => all(args.map(prop => prop && get(prop, 'observers.promise')));
