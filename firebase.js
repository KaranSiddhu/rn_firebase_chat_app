import  firebase  from 'firebase/compat';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
	//GET CONFIG FROM FIREBASE
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
