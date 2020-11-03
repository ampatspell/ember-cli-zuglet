import { helper } from '@ember/component/helper';

export default helper(function or([ a, b ]) {
  return a || b;
});
