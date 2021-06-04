  var firebaseConfig = {
    apiKey: "AIzaSyBYE9dkzokTxT7WH-hzet2epiF4eHbvnzs",
    authDomain: "cl2dswiiurbano.firebaseapp.com",
    projectId: "cl2dswiiurbano",
    storageBucket: "cl2dswiiurbano.appspot.com",
    messagingSenderId: "1054201030969",
    appId: "1:1054201030969:web:e9ccf5ad3ea7c80784e0e8",
    measurementId: "G-0YLTZN3E26"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  const auth = firebase.auth();
  const db = firebase.firestore();
  const st = firebase.storage().ref();