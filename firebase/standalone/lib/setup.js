const admin = require('firebase-admin');
const getConfig = require('../../../config');

const initializeAdmin = (config, name) => {
  let { firebase, serviceAccountKey } = config;
  let credential = admin.credential.cert(require(serviceAccountKey));
  return admin.initializeApp(Object.assign({}, firebase, { credential }), name);
};

class Context {

  constructor(fullName) {
    this.fullName = fullName;
    this.config = getConfig(fullName);
    this.admin = initializeAdmin(this.config, fullName);
    this.firestore = this.admin.firestore();
    this.auth = this.admin.auth();
    this.storage = this.admin.storage();
    this.bucket = this.storage.bucket();
  }

}

const argv = require('minimist')(process.argv.slice(2));

const run = fn => Promise.resolve(fn()).then(arg => arg, err => {
  console.error(err.stack);
  process.exit(-1);
});

const withContext = (fullName, fn) => run(async () => {
  let context = new Context(fullName);
  let result = await fn(context);
  context.admin.delete();
  return result;
});

const exit = message => {
  console.error(message);
  process.exit(-1);
}

module.exports = {
  Context,
  run,
  withContext,
  argv,
  exit
};
