import { isFastBoot } from '../util/fastboot';

const noop = () => {};

const workaroundWindowEventListenersInFastBoot = () => {
  if(!window.addEventListener) {
    window.addEventListener = noop;
  }
  if(!window.removeEventListener) {
    window.removeEventListener = noop;
  }
}

export default sender => {
  if(isFastBoot(sender)) {
    workaroundWindowEventListenersInFastBoot();
  }
}
