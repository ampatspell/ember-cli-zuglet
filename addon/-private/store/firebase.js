import firebase from "firebase/app";
import 'firebase/firestore';

let id = 0;

export const initializeApp = (config, name) => firebase.initializeApp(config, `${name}-${id++}`);
export const destroyApp = app => app.delete();

export const enablePersistence = async firebase => {
  await firebase.firestore().enablePersistence({ synchronizeTabs: true }).catch(err => {
    console.error(err.stack);
  });
};
