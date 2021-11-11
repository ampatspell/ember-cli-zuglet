import Service from '@ember/service';
import environment from '../config/environment';
import flags from 'zuglet/-private/flags';

let {
  version: {
    zuglet: version,
    firebase
  }
} = flags;

let {
  dummy: {
    name
  }
} = environment;

export default class ConfigService extends Service {

  name = name;
  version = version;
  firebase = firebase;

}
