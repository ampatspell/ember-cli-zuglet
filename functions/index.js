'use strict';

const functions = require('firebase-functions');
const CORS = require('cors');

const cors = CORS({ origin: true });

exports.hello = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.json({ data: { hello: true, body: req.body } });
  });
});
