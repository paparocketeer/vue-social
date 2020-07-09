import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBDMTs59l1Dlxzm3ctJFgocuxt9o3iCO8Y",
    authDomain: "vue-social-67215.firebaseapp.com",
    databaseURL: "https://vue-social-67215.firebaseio.com",
    projectId: "vue-social-67215",
    storageBucket: "vue-social-67215.appspot.com",
    messagingSenderId: "524409633",
    appId: "1:524409633:web:3b3f8a460d6bda3763fc60",
    measurementId: "G-ZRBK1KR5RN"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection
}