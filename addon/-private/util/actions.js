import { run, schedule } from '@ember/runloop';

export default fn => run(() => schedule('actions', fn));
