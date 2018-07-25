import Mixin from '@ember/object/mixin';

export default arg => {

  let lookup;

  if(typeof arg === 'string') {
    lookup = owner => owner.get(arg);
  } else {
    lookup = arg;
  }

  const wrap = target => function(...args) {
    let promise = lookup.call(this, this);
    let fn = promise[target];
    return fn.call(promise, ...args);
  }

  return Mixin.create({
    then:    wrap('then'),
    catch:   wrap('catch'),
    finally: wrap('finally')
  });
};
