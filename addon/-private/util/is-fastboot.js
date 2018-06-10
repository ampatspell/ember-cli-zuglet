import { getOwner } from '@ember/application';

export default sender => {
  let service = getOwner(sender).lookup('service:fastboot');
  return service && service.get('isFastBoot');
}
