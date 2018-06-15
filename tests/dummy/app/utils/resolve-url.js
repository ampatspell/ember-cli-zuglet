import { getFastBoot } from 'ember-cli-zuglet/-private/util/fastboot';

// prember for some reason at the moment has this as a protocol
const _protocol = value => value === 'undefined:' ? 'http:' : value;

export default (sender, ...components) => {
  let { isFastBoot, fastboot } = getFastBoot(sender);
  if(isFastBoot) {
    let { protocol, host } = fastboot.get('request').getProperties('protocol', 'host');
    protocol = _protocol(protocol);
    components.unshift(`${protocol}//${host}`);
  }
  return components.join('');
}
