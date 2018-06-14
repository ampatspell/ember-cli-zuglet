import { getOwner } from '@ember/application';

export const lookupFastBoot = owner => {
  let fastboot = owner.lookup('service:fastboot');
  let isFastBoot = fastboot && fastboot.get('isFastBoot');
  return {
    fastboot,
    isFastBoot
  }
}

export const getFastBoot = sender => lookupFastBoot(getOwner(sender));

export const isFastBoot = sender => {
  let { isFastBoot } = getFastBoot(sender);
  return isFastBoot;
};
