import { getOwner } from '@ember/application';

export const lookupFastboot = owner => {
  let fastboot = owner.lookup('service:fastboot');
  let isFastBoot = fastboot && fastboot.get('isFastBoot');
  return {
    fastboot,
    isFastBoot
  }
}

export const getFastboot = sender => lookupFastboot(getOwner(sender));

export const isFastBoot = sender => {
  let { isFastBoot } = getFastboot(sender);
  return isFastBoot;
};
