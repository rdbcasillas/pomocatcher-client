import firebase from 'firebase'
import firestore from 'firebase/firestore'

var config = {
  apiKey: "AIzaSyBAIV0z_FpGQzABwqrFXmw3lMKOY_KN3g4",
  authDomain: "pomocatcher.firebaseapp.com",
  databaseURL: "https://pomocatcher.firebaseio.com",
  projectId: "pomocatcher",
  storageBucket: "pomocatcher.appspot.com",
  messagingSenderId: "450838700838"
};

const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings({
  timestampsInSnapshots: true
})

export default firebaseApp.firestore()