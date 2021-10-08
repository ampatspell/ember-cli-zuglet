import { initializeApp as _initializeApp, deleteApp as _deleteApp } from "firebase/app";
import 'firebase/firestore';

let id = 0;

export const initializeApp = (config, name) => _initializeApp(config, `${name}-${id++}`);
export const destroyApp = app => _deleteApp(app);

export const enablePersistence = async firestore => {
  await firestore.enablePersistence({ synchronizeTabs: true }).catch(err => {
    console.error(err.stack);
  });
};
