import firebase from 'firebase';

export default () => firebase.firestore.FieldValue.serverTimestamp();
