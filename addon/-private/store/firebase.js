import firebase from "firebase/app";
import 'firebase/firestore';

export const initializeApp = (config, name) => firebase.initializeApp(config, name);
export const destroyApp = app => app.delete();

export const enablePersistence = async firebase => {
  await firebase.firestore().enablePersistence({ synchronizeTabs: true }).catch(err => {
    console.error(err.stack);
  });
};
