import { getOwner } from '@ember/application';

export const _lookupFastboot = owner => {
  let fastboot = owner.lookup('service:fastboot');
  let isFastBoot = fastboot && fastboot.get('isFastBoot');
  return {
    fastboot,
    isFastBoot
  }
}

export const lookupFastboot = sender => _lookupFastboot(getOwner(sender));

export const isFastBoot = sender => {
  let { isFastBoot } = lookupFastboot(sender);
  return isFastBoot;
};
