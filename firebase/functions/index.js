'use strict';

const functions = require('firebase-functions');
const HttpsError = functions.https.HttpsError;

exports.callable_success = functions.https.onCall(data => {
  return { request: data };
});

exports.callable_error = functions.https.onCall(() => {
  throw new HttpsError('not-found', 'something was not found', { id: 'foobar' });
});
