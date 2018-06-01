import { createModel, loadModel, resetController } from './util';
import { onResetController } from './hooks';
import { assert } from '@ember/debug';

const normalize = args => {
  let factory;
  let prepare;

  if(args.length === 1) {
    prepare = args[0];
  } else if(args.length === 2) {
    factory = args[0];
    prepare = args[1];
  } else {
    assert(`model takes one or two arguments`, false);
  }

  assert(`model 'prepare' argument must be function`, typeof prepare === 'function');

  return { factory, prepare };
}

// model((route, params) => {
//   return {
//     blogs: route.modelFor('blogs'),
//     id: params.foo_id
//   };
// })

// model('route/foobar', (route, params) => { })

// model(Model, (route, params) => { })

export default (...args) => {
  let { factory, prepare } = normalize(args);
  return function(params) {
    onResetController(this, resetController);
    let model = createModel(this, params, factory);
    let opts = prepare(this, params);
    return loadModel(model, [ opts ]);
  }
}
