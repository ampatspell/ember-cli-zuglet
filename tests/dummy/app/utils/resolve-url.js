import { getFastBoot } from 'ember-cli-zuglet/-private/util/fastboot';

export default (sender, ...components) => {
  let { isFastBoot, fastboot } = getFastBoot(sender);
  if(isFastBoot) {
    let { protocol, host } = fastboot.get('request').getProperties('protocol', 'host');
    components.unshift(`${protocol}//${host}`);
  }
  return components.join('');
}
