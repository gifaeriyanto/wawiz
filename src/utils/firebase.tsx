import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBKk2SI0XKcuXxicaQsDXtHKGiSv12RMBM',
  authDomain: 'wawiz-app.firebaseapp.com',
  projectId: 'wawiz-app',
  storageBucket: 'wawiz-app.appspot.com',
  messagingSenderId: '857782487055',
  appId: '1:857782487055:web:eb9b61724bba14f3effb7a',
};

let firebaseApp: firebase.app.App;
let db: firebase.firestore.Firestore;
let auth: firebase.auth.Auth;

if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
  db = firebaseApp.firestore();
  auth = firebaseApp.auth();
}

export { firebaseApp, auth, db };
