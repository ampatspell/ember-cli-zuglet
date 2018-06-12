import { getOwner } from '@ember/application';

export const lookupFastboot = sender => {
  let fastboot = getOwner(sender).lookup('service:fastboot');
  let isFastBoot = fastboot && fastboot.get('isFastBoot');
  return {
    fastboot,
    isFastBoot
  }
}

export default sender => lookupFastboot(sender).isFastBoot;
