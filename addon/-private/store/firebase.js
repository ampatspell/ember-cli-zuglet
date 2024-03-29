import firebase from "firebase/compat/app";

let id = 0;

export const initializeApp = (config, name) => firebase.initializeApp(config, `${name}-${id++}`);
export const destroyApp = app => app.delete();

export const enablePersistence = async firestore => {
  await firestore.enablePersistence({ synchronizeTabs: true }).catch(err => {
    console.error('firestore/enable-persistence', err.stack);
  });
};
