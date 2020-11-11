import Service from '@ember/service';
import environment from '../config/environment';

let {
  dummy: {
    name,
    version
  }
} = environment;

export default class ConfigService extends Service {

  name = name
  version = version

}