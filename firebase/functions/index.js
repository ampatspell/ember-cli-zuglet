const functions = require('firebase-functions');

module.exports.echo = functions.https.onCall((data, context) => {
  let { auth } = context;
  let uid;
  if(auth) {
    uid = auth.uid;
  }
  return { data, uid };
});
