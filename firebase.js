import  firebase  from 'firebase/compat';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyAl3L0bODT3PCuZ7Tj8Vp9BmQu4iNUTCRg',
	authDomain: 'rnchatapp-45c9d.firebaseapp.com',
	projectId: 'rnchatapp-45c9d',
	storageBucket: 'rnchatapp-45c9d.appspot.com',
	messagingSenderId: '286647957702',
	appId: '1:286647957702:web:2399184f666932d0abffc7'
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
